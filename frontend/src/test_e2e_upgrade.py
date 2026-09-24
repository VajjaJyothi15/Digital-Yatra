import requests
import sys

# Ensure UTF-8 output encoding for Windows console
sys.stdout.reconfigure(encoding='utf-8')

BASE_URL = "http://127.0.0.1:5000"

def test_full_system():
    print("=== TESTING COMPLETE DIGITAL YATRA PLATFORM ===")

    # 1. Test Destinations API across India
    r = requests.get(f"{BASE_URL}/api/destinations")
    assert r.status_code == 200
    destinations = r.json().get('destinations', [])
    print(f"[OK] Destinations API: Found {len(destinations)} Indian destinations.")
    city_names = [d['name'] for d in destinations]
    print(f"     Destinations: {', '.join(city_names[:8])}...")

    # Test single destination detail for Jaipur
    r = requests.get(f"{BASE_URL}/api/destinations/Jaipur")
    assert r.status_code == 200
    dest = r.json().get('destination', {})
    print(f"[OK] Jaipur Destination Detail: {dest.get('name')} in {dest.get('state')}")

    # 2. Test Local Guide Search API for Jaipur
    r = requests.get(f"{BASE_URL}/api/guides?city=Jaipur")
    assert r.status_code == 200
    guides = r.json().get('guides', [])
    print(f"[OK] Jaipur Local Guides API: Found {len(guides)} guides in Jaipur.")
    for g in guides:
        print(f"     Guide: {g['name']} | Rating: {g['rating']} | Price: RS.{g['price']}/day | Verified: {g['verified']}")

    # 3. Test Tourist Registration & Guide Booking Creation
    session = requests.Session()
    reg_payload = {
        "name": "Arjun Kumar",
        "email": "arjun.tourist@example.com",
        "password": "password123",
        "role": "TOURIST"
    }
    r = session.post(f"{BASE_URL}/api/auth/register", json=reg_payload)
    if r.status_code not in [200, 201]:
        # try login
        r = session.post(f"{BASE_URL}/api/auth/login", json={"email": "arjun.tourist@example.com", "password": "password123"})
    
    assert r.status_code in [200, 201]
    tourist_user = r.json().get('user')
    print(f"[OK] Tourist User Auth: Logged in as {tourist_user['name']} (ID: {tourist_user['id']})")

    # Book a guide in Jaipur (Priya Sharma, guide_id: 1)
    booking_payload = {
        "guide_id": 1,
        "destination_name": "Jaipur",
        "booking_date": "2026-09-25",
        "start_time": "10:00 AM",
        "duration": 6,
        "number_of_tourists": 3,
        "price": 800
    }
    r = session.post(f"{BASE_URL}/api/guides/book", json=booking_payload)
    assert r.status_code in [200, 201]
    booking = r.json().get('booking', {})
    print(f"[OK] Guide Booking Created: Booking ID {booking.get('booking_id')} for {booking.get('guide_name')} in {booking.get('destination_name')}")

    # 4. Test Tourist My Bookings API
    r = session.get(f"{BASE_URL}/api/guides/my-bookings")
    assert r.status_code == 200
    my_bookings = r.json().get('bookings', [])
    print(f"[OK] Tourist My Bookings: Found {len(my_bookings)} bookings for tourist.")

    # 5. Test Guide Portal Dashboard
    guide_session = requests.Session()
    g_login = guide_session.post(f"{BASE_URL}/api/auth/login", json={"email": "guide.priya@example.com", "password": "password123"})
    assert g_login.status_code in [200, 201]
    g_user = g_login.json().get('user')
    print(f"[OK] Guide User Auth: Logged in as {g_user['name']} (Role: {g_user['role']})")

    r = guide_session.get(f"{BASE_URL}/api/guides/dashboard")
    assert r.status_code in [200, 201]
    dashboard = r.json()
    print(f"[OK] Guide Dashboard: {dashboard['stats']['total_bookings']} total bookings, RS.{dashboard['stats']['total_earnings']} earnings.")

    # 6. Test Admin Guide Verification
    admin_session = requests.Session()
    a_login = admin_session.post(f"{BASE_URL}/api/auth/login", json={"email": "admin@digitalyatra.gov.in", "password": "admin123"})
    assert a_login.status_code in [200, 201]

    # Verify Guide ID 2 (Ramesh Tirupati)
    r = admin_session.put(f"{BASE_URL}/api/admin/guides/2/verify", json={"verified": True})
    assert r.status_code == 200
    print(f"[OK] Admin Guide Verification: Guide Ramesh Tirupati verified successfully.")

    # 7. Test Multilingual AI Assistant with Destination Context
    chat_payload = {
        "message": "Where can I find vegetarian food in Tirupati?",
        "destination": "Tirupati",
        "language": "Hindi"
    }
    r = requests.post(f"{BASE_URL}/api/assistant/chat", json=chat_payload)
    assert r.status_code == 200
    bot_reply = r.json().get('reply')
    print(f"[OK] Multilingual Chatbot (Hindi + Tirupati context):")
    print(f"     Bot Output: {bot_reply}")

    print("\n🎉 ALL E2E BACKEND & FRONTEND INTEGRATION TESTS PASSED PERFECTLY!")

if __name__ == '__main__':
    test_full_system()
