from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

from fastapi import FastAPI, APIRouter, HTTPException, Request, Response, Depends
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId
import os
import logging
import bcrypt
import jwt
import httpx
from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional
from datetime import datetime, timezone, timedelta
import time

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# JWT Configuration
JWT_SECRET = os.environ.get('JWT_SECRET', 'fallback-secret-change-in-production')
JWT_ALGORITHM = "HS256"

# HuggingFace Configuration
HF_TOKEN = os.environ.get('HF_TOKEN', '')
HF_MODEL_ID = os.environ.get('HF_MODEL_ID', 'BSVGK/gemma-1.1-2b-it-drugbank-kg2text-lora_v1')

# Create the main app
app = FastAPI(title="DrugBank KG-to-Text AI Platform")

# Create routers
api_router = APIRouter(prefix="/api")
auth_router = APIRouter(prefix="/auth", tags=["Authentication"])
generate_router = APIRouter(prefix="/generate", tags=["Generation"])
generations_router = APIRouter(prefix="/generations", tags=["Generations"])
admin_router = APIRouter(prefix="/admin", tags=["Admin"])

# ==================== SCHEMAS ====================

class UserRegister(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(..., min_length=6)

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: str
    name: str
    email: str
    is_admin: bool
    created_at: str

class GenerateRequest(BaseModel):
    triples: str = Field(..., min_length=10)

class GenerateResponse(BaseModel):
    generated_text: str
    latency_ms: int
    input_length: int

class SaveGenerationRequest(BaseModel):
    input_triples: str
    generated_text: str
    latency_ms: int

class GenerationResponse(BaseModel):
    id: str
    input_triples: str
    generated_text: str
    latency_ms: int
    created_at: str

class AdminStats(BaseModel):
    total_users: int
    total_generations: int
    avg_input_size: float
    avg_output_size: float
    avg_latency_ms: float
    generations_today: int
    generations_this_week: int

# ==================== PASSWORD UTILITIES ====================

def hash_password(password: str) -> str:
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode("utf-8"), salt)
    return hashed.decode("utf-8")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(plain_password.encode("utf-8"), hashed_password.encode("utf-8"))

# ==================== JWT UTILITIES ====================

def create_access_token(user_id: str, email: str) -> str:
    payload = {
        "sub": user_id,
        "email": email,
        "exp": datetime.now(timezone.utc) + timedelta(minutes=60),
        "type": "access"
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

def create_refresh_token(user_id: str) -> str:
    payload = {
        "sub": user_id,
        "exp": datetime.now(timezone.utc) + timedelta(days=7),
        "type": "refresh"
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

async def get_current_user(request: Request) -> dict:
    token = request.cookies.get("access_token")
    if not token:
        auth_header = request.headers.get("Authorization", "")
        if auth_header.startswith("Bearer "):
            token = auth_header[7:]
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        if payload.get("type") != "access":
            raise HTTPException(status_code=401, detail="Invalid token type")
        user = await db.users.find_one({"_id": ObjectId(payload["sub"])})
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        user["id"] = str(user["_id"])
        user.pop("_id", None)
        user.pop("password_hash", None)
        return user
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

async def get_optional_user(request: Request) -> Optional[dict]:
    try:
        return await get_current_user(request)
    except HTTPException:
        return None

async def get_admin_user(request: Request) -> dict:
    user = await get_current_user(request)
    if not user.get("is_admin", False):
        raise HTTPException(status_code=403, detail="Admin access required")
    return user

# ==================== AUTH ROUTES ====================

@auth_router.post("/register")
async def register(data: UserRegister, response: Response):
    email = data.email.lower()
    existing = await db.users.find_one({"email": email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed = hash_password(data.password)
    user_doc = {
        "name": data.name,
        "email": email,
        "password_hash": hashed,
        "is_admin": False,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    result = await db.users.insert_one(user_doc)
    user_id = str(result.inserted_id)
    
    access_token = create_access_token(user_id, email)
    refresh_token = create_refresh_token(user_id)
    
    response.set_cookie(key="access_token", value=access_token, httponly=True, secure=False, samesite="lax", max_age=3600, path="/")
    response.set_cookie(key="refresh_token", value=refresh_token, httponly=True, secure=False, samesite="lax", max_age=604800, path="/")
    
    return {
        "id": user_id,
        "name": data.name,
        "email": email,
        "is_admin": False,
        "created_at": user_doc["created_at"],
        "access_token": access_token
    }

@auth_router.post("/login")
async def login(data: UserLogin, response: Response):
    email = data.email.lower()
    user = await db.users.find_one({"email": email})
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    if not verify_password(data.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    user_id = str(user["_id"])
    access_token = create_access_token(user_id, email)
    refresh_token = create_refresh_token(user_id)
    
    response.set_cookie(key="access_token", value=access_token, httponly=True, secure=False, samesite="lax", max_age=3600, path="/")
    response.set_cookie(key="refresh_token", value=refresh_token, httponly=True, secure=False, samesite="lax", max_age=604800, path="/")
    
    return {
        "id": user_id,
        "name": user["name"],
        "email": user["email"],
        "is_admin": user.get("is_admin", False),
        "created_at": user.get("created_at", ""),
        "access_token": access_token
    }

@auth_router.post("/logout")
async def logout(response: Response):
    response.delete_cookie("access_token", path="/")
    response.delete_cookie("refresh_token", path="/")
    return {"message": "Logged out successfully"}

@auth_router.get("/me")
async def get_me(request: Request):
    user = await get_current_user(request)
    return user

@auth_router.post("/refresh")
async def refresh_token(request: Request, response: Response):
    token = request.cookies.get("refresh_token")
    if not token:
        raise HTTPException(status_code=401, detail="No refresh token")
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        if payload.get("type") != "refresh":
            raise HTTPException(status_code=401, detail="Invalid token type")
        user = await db.users.find_one({"_id": ObjectId(payload["sub"])})
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        
        user_id = str(user["_id"])
        access_token = create_access_token(user_id, user["email"])
        response.set_cookie(key="access_token", value=access_token, httponly=True, secure=False, samesite="lax", max_age=3600, path="/")
        return {"message": "Token refreshed", "access_token": access_token}
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Refresh token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

# ==================== GENERATION ROUTES ====================

@generate_router.post("", response_model=GenerateResponse)
async def generate_text(data: GenerateRequest, request: Request):
    """Generate natural language from knowledge graph triples using HuggingFace model"""
    start_time = time.time()
    
    # Format the prompt exactly as specified
    prompt = f"""<start_of_turn>user
Convert the following drug knowledge graph triples into a clear and complete natural language description.

{data.triples}<end_of_turn>
<start_of_turn>model
"""
    
    if not HF_TOKEN:
        raise HTTPException(
            status_code=503, 
            detail="HuggingFace API token not configured. Please add HF_TOKEN to environment variables."
        )
    
    try:
        async with httpx.AsyncClient(timeout=120.0) as client_http:
            response = await client_http.post(
                f"https://api-inference.huggingface.co/models/{HF_MODEL_ID}",
                headers={"Authorization": f"Bearer {HF_TOKEN}"},
                json={
                    "inputs": prompt,
                    "parameters": {
                        "max_new_tokens": 512,
                        "temperature": 0.7,
                        "do_sample": True,
                        "return_full_text": False
                    }
                }
            )
            
            if response.status_code == 503:
                error_data = response.json()
                if "loading" in str(error_data).lower():
                    raise HTTPException(
                        status_code=503,
                        detail="Model is loading. Please wait a moment and try again."
                    )
            
            if response.status_code != 200:
                logger.error(f"HuggingFace API error: {response.status_code} - {response.text}")
                raise HTTPException(
                    status_code=response.status_code,
                    detail=f"HuggingFace API error: {response.text}"
                )
            
            result = response.json()
            
            # Extract generated text
            if isinstance(result, list) and len(result) > 0:
                generated_text = result[0].get("generated_text", "")
            elif isinstance(result, dict):
                generated_text = result.get("generated_text", "")
            else:
                generated_text = str(result)
            
            # Clean up the generated text
            generated_text = generated_text.strip()
            if "<end_of_turn>" in generated_text:
                generated_text = generated_text.split("<end_of_turn>")[0].strip()
            
            latency_ms = int((time.time() - start_time) * 1000)
            
            return GenerateResponse(
                generated_text=generated_text,
                latency_ms=latency_ms,
                input_length=len(data.triples)
            )
            
    except httpx.TimeoutException:
        raise HTTPException(status_code=504, detail="Request to HuggingFace timed out. Please try again.")
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Generation error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Generation failed: {str(e)}")

# ==================== GENERATIONS (SAVED) ROUTES ====================

@generations_router.post("/save")
async def save_generation(data: SaveGenerationRequest, request: Request):
    user = await get_current_user(request)
    
    gen_doc = {
        "user_id": user["id"],
        "input_triples": data.input_triples,
        "generated_text": data.generated_text,
        "latency_ms": data.latency_ms,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    result = await db.generations.insert_one(gen_doc)
    
    return {
        "id": str(result.inserted_id),
        "message": "Generation saved successfully"
    }

@generations_router.get("/my", response_model=List[GenerationResponse])
async def get_my_generations(request: Request):
    user = await get_current_user(request)
    
    generations = await db.generations.find(
        {"user_id": user["id"]},
        {"_id": 1, "input_triples": 1, "generated_text": 1, "latency_ms": 1, "created_at": 1}
    ).sort("created_at", -1).to_list(100)
    
    return [
        GenerationResponse(
            id=str(g["_id"]),
            input_triples=g["input_triples"],
            generated_text=g["generated_text"],
            latency_ms=g.get("latency_ms", 0),
            created_at=g.get("created_at", "")
        )
        for g in generations
    ]

@generations_router.delete("/{generation_id}")
async def delete_generation(generation_id: str, request: Request):
    user = await get_current_user(request)
    
    result = await db.generations.delete_one({
        "_id": ObjectId(generation_id),
        "user_id": user["id"]
    })
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Generation not found")
    
    return {"message": "Generation deleted successfully"}

@generations_router.get("/export")
async def export_generations(request: Request):
    user = await get_current_user(request)
    
    generations = await db.generations.find(
        {"user_id": user["id"]},
        {"_id": 0, "input_triples": 1, "generated_text": 1, "latency_ms": 1, "created_at": 1}
    ).sort("created_at", -1).to_list(1000)
    
    return {"generations": generations}

# ==================== ADMIN ROUTES ====================

@admin_router.get("/stats", response_model=AdminStats)
async def get_admin_stats(request: Request):
    await get_admin_user(request)
    
    total_users = await db.users.count_documents({})
    total_generations = await db.generations.count_documents({})
    
    # Calculate averages
    pipeline = [
        {
            "$group": {
                "_id": None,
                "avg_input": {"$avg": {"$strLenCP": "$input_triples"}},
                "avg_output": {"$avg": {"$strLenCP": "$generated_text"}},
                "avg_latency": {"$avg": "$latency_ms"}
            }
        }
    ]
    
    aggregation = await db.generations.aggregate(pipeline).to_list(1)
    
    avg_input_size = 0.0
    avg_output_size = 0.0
    avg_latency_ms = 0.0
    
    if aggregation and len(aggregation) > 0:
        avg_input_size = aggregation[0].get("avg_input", 0) or 0
        avg_output_size = aggregation[0].get("avg_output", 0) or 0
        avg_latency_ms = aggregation[0].get("avg_latency", 0) or 0
    
    # Today's generations
    today = datetime.now(timezone.utc).replace(hour=0, minute=0, second=0, microsecond=0)
    today_str = today.isoformat()
    generations_today = await db.generations.count_documents({
        "created_at": {"$gte": today_str}
    })
    
    # This week's generations
    week_ago = (datetime.now(timezone.utc) - timedelta(days=7)).isoformat()
    generations_this_week = await db.generations.count_documents({
        "created_at": {"$gte": week_ago}
    })
    
    return AdminStats(
        total_users=total_users,
        total_generations=total_generations,
        avg_input_size=round(avg_input_size, 2),
        avg_output_size=round(avg_output_size, 2),
        avg_latency_ms=round(avg_latency_ms, 2),
        generations_today=generations_today,
        generations_this_week=generations_this_week
    )

@admin_router.get("/recent-generations")
async def get_recent_generations(request: Request, limit: int = 10):
    await get_admin_user(request)
    
    generations = await db.generations.aggregate([
        {"$sort": {"created_at": -1}},
        {"$limit": limit},
        {
            "$lookup": {
                "from": "users",
                "let": {"user_id": {"$toObjectId": "$user_id"}},
                "pipeline": [
                    {"$match": {"$expr": {"$eq": ["$_id", "$$user_id"]}}}
                ],
                "as": "user"
            }
        },
        {"$unwind": {"path": "$user", "preserveNullAndEmptyArrays": True}},
        {
            "$project": {
                "_id": 0,
                "id": {"$toString": "$_id"},
                "input_triples": {"$substr": ["$input_triples", 0, 100]},
                "generated_text": {"$substr": ["$generated_text", 0, 100]},
                "latency_ms": 1,
                "created_at": 1,
                "user_name": {"$ifNull": ["$user.name", "Anonymous"]}
            }
        }
    ]).to_list(limit)
    
    return {"generations": generations}

@admin_router.get("/users")
async def get_all_users(request: Request):
    await get_admin_user(request)
    
    users = await db.users.find(
        {},
        {"_id": 1, "name": 1, "email": 1, "is_admin": 1, "created_at": 1}
    ).sort("created_at", -1).to_list(100)
    
    return {
        "users": [
            {
                "id": str(u["_id"]),
                "name": u.get("name", ""),
                "email": u.get("email", ""),
                "is_admin": u.get("is_admin", False),
                "created_at": u.get("created_at", "")
            }
            for u in users
        ]
    }

# ==================== HEALTH ROUTE ====================

@api_router.get("/health")
async def health_check():
    try:
        await db.command("ping")
        db_status = "connected"
    except Exception:
        db_status = "disconnected"
    
    return {
        "status": "healthy",
        "database": db_status,
        "model_id": HF_MODEL_ID,
        "hf_token_configured": bool(HF_TOKEN)
    }

@api_router.get("/")
async def root():
    return {"message": "DrugBank KG-to-Text AI Platform API"}

# ==================== INCLUDE ROUTERS ====================

api_router.include_router(auth_router)
api_router.include_router(generate_router)
api_router.include_router(generations_router)
api_router.include_router(admin_router)
app.include_router(api_router)

# ==================== MIDDLEWARE ====================

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=[os.environ.get('FRONTEND_URL', 'http://localhost:3000')] + os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==================== STARTUP EVENTS ====================

@app.on_event("startup")
async def startup_event():
    # Create indexes
    await db.users.create_index("email", unique=True)
    await db.generations.create_index("user_id")
    await db.generations.create_index("created_at")
    
    # Seed admin user
    admin_email = os.environ.get("ADMIN_EMAIL", "admin@example.com").lower()
    admin_password = os.environ.get("ADMIN_PASSWORD", "admin123")
    
    existing = await db.users.find_one({"email": admin_email})
    if existing is None:
        hashed = hash_password(admin_password)
        await db.users.insert_one({
            "email": admin_email,
            "password_hash": hashed,
            "name": "Admin",
            "is_admin": True,
            "created_at": datetime.now(timezone.utc).isoformat()
        })
        logger.info(f"Admin user created: {admin_email}")
    elif not verify_password(admin_password, existing["password_hash"]):
        await db.users.update_one(
            {"email": admin_email},
            {"$set": {"password_hash": hash_password(admin_password)}}
        )
        logger.info(f"Admin password updated for: {admin_email}")
    
    # Write test credentials
    Path("/app/memory").mkdir(parents=True, exist_ok=True)
    with open("/app/memory/test_credentials.md", "w") as f:
        f.write("# Test Credentials\n\n")
        f.write("## Admin Account\n")
        f.write(f"- Email: {admin_email}\n")
        f.write(f"- Password: {admin_password}\n")
        f.write("- Role: admin\n\n")
        f.write("## Auth Endpoints\n")
        f.write("- POST /api/auth/register\n")
        f.write("- POST /api/auth/login\n")
        f.write("- POST /api/auth/logout\n")
        f.write("- GET /api/auth/me\n")
        f.write("- POST /api/auth/refresh\n")

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
