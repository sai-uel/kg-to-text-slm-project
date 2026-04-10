import requests
import sys
import json
from datetime import datetime

class DrugBankAPITester:
    def __init__(self, base_url="https://drugbank-kg-text.preview.emergentagent.com"):
        self.base_url = base_url
        self.token = None
        self.tests_run = 0
        self.tests_passed = 0
        self.admin_credentials = {
            "email": "drugbankkgtotext@uel.com",
            "password": "drugbank1919"
        }

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None):
        """Run a single API test"""
        url = f"{self.base_url}/api/{endpoint}"
        test_headers = {'Content-Type': 'application/json'}
        
        if headers:
            test_headers.update(headers)
        
        if self.token:
            test_headers['Authorization'] = f'Bearer {self.token}'

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=test_headers)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=test_headers)
            elif method == 'DELETE':
                response = requests.delete(url, headers=test_headers)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    response_data = response.json()
                    print(f"   Response: {json.dumps(response_data, indent=2)[:200]}...")
                except:
                    print(f"   Response: {response.text[:100]}...")
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                print(f"   Response: {response.text[:200]}...")

            return success, response.json() if response.text and response.status_code < 500 else {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            return False, {}

    def test_health_check(self):
        """Test health endpoint"""
        success, response = self.run_test(
            "Health Check",
            "GET",
            "health",
            200
        )
        return success

    def test_admin_login(self):
        """Test admin login and get token"""
        success, response = self.run_test(
            "Admin Login",
            "POST",
            "auth/login",
            200,
            data=self.admin_credentials
        )
        if success and 'access_token' in response:
            self.token = response['access_token']
            print(f"   Admin logged in: {response.get('name', 'Unknown')}")
            print(f"   Is Admin: {response.get('is_admin', False)}")
            return True
        return False

    def test_user_registration(self):
        """Test user registration"""
        test_user = {
            "name": f"Test User {datetime.now().strftime('%H%M%S')}",
            "email": f"test_{datetime.now().strftime('%H%M%S')}@example.com",
            "password": "testpass123"
        }
        
        success, response = self.run_test(
            "User Registration",
            "POST",
            "auth/register",
            200,
            data=test_user
        )
        return success, test_user if success else None

    def test_user_login(self, user_data):
        """Test user login"""
        if not user_data:
            return False
            
        login_data = {
            "email": user_data["email"],
            "password": user_data["password"]
        }
        
        success, response = self.run_test(
            "User Login",
            "POST",
            "auth/login",
            200,
            data=login_data
        )
        return success

    def test_get_current_user(self):
        """Test get current user endpoint"""
        success, response = self.run_test(
            "Get Current User",
            "GET",
            "auth/me",
            200
        )
        return success

    def test_text_generation(self):
        """Test text generation endpoint (should fail due to missing HF_TOKEN)"""
        sample_triples = """DB00945 | category | Nonsteroidal Anti-inflammatory Agents
DB00945 | mechanism | Irreversibly inhibits cyclooxygenase-1 and 2 (COX-1 and COX-2)
DB00945 | indication | Treatment of mild to moderate pain, fever, and inflammation"""
        
        success, response = self.run_test(
            "Text Generation (Expected to fail - no HF_TOKEN)",
            "POST",
            "generate",
            503,  # Expected to fail with 503 due to missing HF_TOKEN
            data={"triples": sample_triples}
        )
        return success

    def test_admin_stats(self):
        """Test admin stats endpoint"""
        success, response = self.run_test(
            "Admin Stats",
            "GET",
            "admin/stats",
            200
        )
        if success:
            print(f"   Total Users: {response.get('total_users', 0)}")
            print(f"   Total Generations: {response.get('total_generations', 0)}")
        return success

    def test_admin_users(self):
        """Test admin users endpoint"""
        success, response = self.run_test(
            "Admin Users List",
            "GET",
            "admin/users",
            200
        )
        if success:
            users = response.get('users', [])
            print(f"   Found {len(users)} users")
        return success

    def test_admin_recent_generations(self):
        """Test admin recent generations endpoint"""
        success, response = self.run_test(
            "Admin Recent Generations",
            "GET",
            "admin/recent-generations",
            200
        )
        if success:
            generations = response.get('generations', [])
            print(f"   Found {len(generations)} recent generations")
        return success

    def test_logout(self):
        """Test logout endpoint"""
        success, response = self.run_test(
            "Logout",
            "POST",
            "auth/logout",
            200
        )
        if success:
            self.token = None
        return success

def main():
    print("🚀 Starting DrugBank KG-to-Text API Testing...")
    print("=" * 60)
    
    tester = DrugBankAPITester()
    
    # Test sequence
    tests = [
        ("Health Check", tester.test_health_check),
        ("Admin Login", tester.test_admin_login),
        ("Get Current User", tester.test_get_current_user),
        ("Admin Stats", tester.test_admin_stats),
        ("Admin Users List", tester.test_admin_users),
        ("Admin Recent Generations", tester.test_admin_recent_generations),
        ("Text Generation (Expected Fail)", tester.test_text_generation),
        ("Logout", tester.test_logout),
    ]
    
    # Run user registration and login tests
    print("\n📝 Testing User Registration & Login Flow...")
    reg_success, user_data = tester.test_user_registration()
    if reg_success:
        tester.test_user_login(user_data)
    
    # Run main test sequence
    print("\n🔐 Testing Admin Flow...")
    for test_name, test_func in tests:
        try:
            test_func()
        except Exception as e:
            print(f"❌ {test_name} failed with exception: {str(e)}")
    
    # Print results
    print("\n" + "=" * 60)
    print(f"📊 Test Results: {tester.tests_passed}/{tester.tests_run} tests passed")
    
    if tester.tests_passed == tester.tests_run:
        print("🎉 All tests passed!")
        return 0
    else:
        print(f"⚠️  {tester.tests_run - tester.tests_passed} tests failed")
        return 1

if __name__ == "__main__":
    sys.exit(main())