# BioKG Text AI - PRD

## Original Problem Statement
Build a complete production-style full-stack web application for a public HuggingFace model that converts DrugBank-style knowledge graph triples into natural language descriptions. Renamed to **BioKG Text AI** with professional medical/pharmaceutical design.

## Architecture
- **Frontend**: React 19 + Tailwind CSS + Shadcn UI
- **Backend**: FastAPI + Python
- **Database**: MongoDB
- **Authentication**: JWT with bcrypt password hashing
- **AI Model**: Qwen2.5-72B-Instruct via HuggingFace Inference API

## User Personas
1. **Researchers**: Use the platform to convert drug relationship triples into readable text
2. **Clinicians**: Generate natural language descriptions for clinical documentation
3. **Admin**: Monitor platform usage, view analytics, manage system

## Core Requirements (Static)
- [x] Landing page with hero, features, how-it-works sections
- [x] Generate page with text input AND file upload (CSV, JSON, TTL, RDF)
- [x] User authentication (register/login/logout)
- [x] User dashboard with saved generations
- [x] Admin dashboard with analytics
- [x] JWT-based protected routes
- [x] MongoDB database integration
- [x] HuggingFace model inference integration
- [x] Export generations as JSON/TXT

## What's Been Implemented (Jan 2026)
### Backend
- FastAPI server with modular route structure
- JWT authentication with bcrypt password hashing
- MongoDB models for users and generations
- HuggingFace Inference API integration
- Admin seeding on startup
- Health check endpoint
- CORS configuration

### Frontend
- Landing page with hero, features, how-it-works, use cases, CTA sections
- Demo page with input/output panels, history, sample loading
- Login/Register pages with beautiful split-screen design
- User dashboard with personalized welcome, stats, saved generations
- Admin dashboard with analytics, system status, user list
- Responsive navbar with glassmorphism effect
- Footer with social links
- Toast notifications (sonner)
- Protected routes for authenticated users
- Admin-only routes

### Design
- Outfit font for headings, Manrope for body
- Indigo/blue/gray color palette
- Interactive cards with hover effects
- Gradient accents and animations
- Custom scrollbars and selection colors

## Prioritized Backlog

### P0 (Critical) - DONE
- [x] Authentication system
- [x] Demo generation page
- [x] Basic dashboard

### P1 (High Priority)
- [ ] Add HF_TOKEN to enable actual model inference
- [ ] Password reset functionality
- [ ] Email verification

### P2 (Medium Priority)
- [ ] Generation history pagination
- [ ] Dark mode toggle
- [ ] User profile editing
- [ ] Rate limiting

### P3 (Nice to Have)
- [ ] Multiple model support
- [ ] Batch generation
- [ ] API key management for users
- [ ] Webhook notifications

## Next Tasks
1. User needs to add HF_TOKEN to backend/.env for actual inference
2. Test with real HuggingFace model inference
3. Add password reset flow
4. Consider adding email notifications
