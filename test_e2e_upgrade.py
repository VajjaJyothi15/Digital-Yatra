import os
import sys
import unittest
import time

# Ensure backend directory is in python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend'))

from app import create_app

class DigitalYatraE2ETestCase(unittest.TestCase):
    def setUp(self):
        self.app = create_app()
        self.app.config['TESTING'] = True
        self.client = self.app.test_client()

    def test_health_check(self):
        res = self.client.get('/api/health')
        data = res.get_json()
        self.assertEqual(res.status_code, 200)
        self.assertTrue(data['success'] if 'success' in data else data['status'] == 'healthy')

    def test_auth_and_forgot_password(self):
        # Register new tourist with unique email
        ts = int(time.time() * 1000)
        email = f"test.tourist.{ts}@example.com"
        reg_res = self.client.post('/api/auth/register', json={
            "name": "Test Tourist",
            "email": email,
            "password": "password123",
            "role": "TOURIST"
        })
        self.assertEqual(reg_res.status_code, 201)

        # Login with original password
        login_res = self.client.post('/api/auth/login', json={
            "email": email,
            "password": "password123"
        })
        self.assertEqual(login_res.status_code, 200)

        # Forgot password request
        forgot_res = self.client.post('/api/auth/forgot-password', json={"email": email})
        self.assertEqual(forgot_res.status_code, 200)
        token = forgot_res.get_json().get('reset_token')
        self.assertIsNotNone(token)

        # Reset password
        reset_res = self.client.post('/api/auth/reset-password', json={
            "email": email,
            "token": token,
            "new_password": "newpassword123"
        })
        self.assertEqual(reset_res.status_code, 200)

        # Verify login with new password
        new_login = self.client.post('/api/auth/login', json={
            "email": email,
            "password": "newpassword123"
        })
        self.assertEqual(new_login.status_code, 200)

    def test_google_login(self):
        ts = int(time.time() * 1000)
        g_res = self.client.post('/api/auth/google', json={
            "email": f"google.traveler.{ts}@gmail.com",
            "name": "Google Traveler",
            "role": "TOURIST"
        })
        self.assertEqual(g_res.status_code, 200)
        self.assertTrue(g_res.get_json()['success'])

    def test_chatgpt_style_ai_assistant(self):
        # 1. Travel inquiry
        gk_res = self.client.post('/api/assistant/chat', json={
            "message": "I WANT TO TRAVEL TO GOA WHAT DO U THINK",
            "destination": "Goa",
            "language": "English"
        })
        self.assertEqual(gk_res.status_code, 200)
        reply = gk_res.get_json()['chat']['reply']
        self.assertIn("Goa", reply)
        self.assertIn("Day 1", reply)

        # 2. Academic programming query redirected politely
        code_res = self.client.post('/api/assistant/chat', json={
            "message": "Explain Python loops with an example.",
            "destination": "Goa"
        })
        self.assertEqual(code_res.status_code, 200)
        c_reply = code_res.get_json()['chat']['reply']
        self.assertIn("Digital Yatra AI Specialist", c_reply)

        # 3. Multi-turn conversation context
        mt_res = self.client.post('/api/assistant/chat', json={
            "message": "Suggest places for day 2.",
            "destination": "Goa",
            "messages": [
                {"role": "user", "content": "I am going to Goa for 3 days."},
                {"role": "assistant", "content": "Great! Goa is wonderful."}
            ]
        })
        self.assertEqual(mt_res.status_code, 200)

    def test_guide_profile_edit(self):
        edit_res = self.client.put('/api/guides/profile', json={
            "guide_id": 1,
            "user_id": 2,
            "name": "Kiran Verified Guide",
            "city": "Goa",
            "languages": "English, Hindi, Telugu, Spanish",
            "specialization": "Heritage & Culture, Food",
            "experience_years": 5,
            "price_per_day": 950.0,
            "bio": "Certified local expert in Goa beaches and heritage."
        })
        self.assertEqual(edit_res.status_code, 200)
        updated_guide = edit_res.get_json()['guide']
        self.assertEqual(updated_guide['city'], 'Goa')
        self.assertEqual(updated_guide['price'], 950.0)

    def test_admin_revoke_action(self):
        # Admin verify
        v_res = self.client.put('/api/admin/guides/1/verify', json={"verified": True})
        self.assertEqual(v_res.status_code, 200)
        self.assertEqual(v_res.get_json()['status'], 'VERIFIED')

        # Admin revoke
        r_res = self.client.put('/api/admin/guides/1/revoke')
        self.assertEqual(r_res.status_code, 200)
        self.assertEqual(r_res.get_json()['status'], 'REJECTED')

    def test_safety_and_reports(self):
        sos_res = self.client.post('/api/safety/sos', json={
            "user_id": 1,
            "latitude": 15.2993,
            "longitude": 74.1240,
            "details": "Test E2E SOS Alert"
        })
        self.assertEqual(sos_res.status_code, 201)

        share_res = self.client.post('/api/safety/share-location', json={
            "user_id": 1,
            "latitude": 15.2993,
            "longitude": 74.1240
        })
        self.assertEqual(share_res.status_code, 200)
        self.assertIn("share_url", share_res.get_json()['share'])

if __name__ == '__main__':
    unittest.main()
