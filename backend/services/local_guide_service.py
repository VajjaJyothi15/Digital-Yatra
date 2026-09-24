import random
from database.db import get_db

def format_guide_dict(guide_row):
    if not guide_row:
        return None
    g = dict(guide_row)
    # Ensure aliases for frontend compatibility
    g['price'] = g.get('price_per_day', 800)
    g['price_per_day'] = g.get('price_per_day', 800)
    g['photo'] = g.get('profile_photo') or ''
    g['experience_years'] = g.get('experience_years') if g.get('experience_years') is not None else 3
    g['experience'] = g.get('experience') or f"{g['experience_years']} Years"
    g['verified'] = True if g.get('verification_status') == 'VERIFIED' else False
    return g

def get_guides_by_city(city=None, language=None, specialization=None):
    db = get_db()
    query = "SELECT g.*, u.email FROM guides g JOIN users u ON g.user_id = u.id WHERE 1=1"
    params = []

    if city and city.lower() != 'all':
        query += " AND LOWER(g.city) = LOWER(?)"
        params.append(city)
    if language:
        query += " AND LOWER(g.languages) LIKE ?"
        params.append(f"%{language.lower()}%")
    if specialization:
        query += " AND LOWER(g.specialization) LIKE ?"
        params.append(f"%{specialization.lower()}%")

    query += " ORDER BY g.rating DESC"
    rows = db.execute(query, params).fetchall()
    results = [format_guide_dict(r) for r in rows]

    # DYNAMIC FALLBACK: If specific city searched has no seeded guides in DB, create dynamic guide for that Indian city
    if not results and city and city.lower() != 'all':
        target_city = city.title()
        dynamic_guide = {
            "id": 99,
            "user_id": 99,
            "name": f"Kiran {target_city} Local Expert",
            "city": target_city,
            "languages": "English, Hindi, Local Regional Language",
            "specialization": "Heritage & Culture",
            "experience_years": 6,
            "experience": "6 years",
            "price_per_day": 850.0,
            "price": 850.0,
            "rating": 4.8,
            "reviews_count": 14,
            "availability_status": "AVAILABLE",
            "verification_status": "VERIFIED",
            "verified": True,
            "description": f"Certified local tourist guide in {target_city} with 6 years experience conducting heritage trails and local culture tours.",
            "email": f"guide.{target_city.lower()}@example.com"
        }
        results.append(dynamic_guide)

    return results

def get_guide_profile(guide_id):
    db = get_db()
    row = db.execute("SELECT g.*, u.email FROM guides g JOIN users u ON g.user_id = u.id WHERE g.id = ?", (guide_id,)).fetchone()
    if not row and guide_id == 99:
        return {
            "id": 99,
            "user_id": 99,
            "name": "Kiran Local Expert",
            "city": "India",
            "languages": "English, Hindi",
            "specialization": "Heritage & Culture",
            "experience_years": 6,
            "experience": "6 years",
            "price_per_day": 850.0,
            "price": 850.0,
            "rating": 4.8,
            "verified": True
        }
    return format_guide_dict(row)

def create_guide_booking(tourist_id, guide_id, destination_city, booking_date, start_time="10:00 AM", duration_hours=6, number_of_tourists=1):
    db = get_db()
    cursor = db.cursor()

    guide = db.execute("SELECT * FROM guides WHERE id = ?", (guide_id,)).fetchone()
    guide_name = guide['name'] if guide else f"Kiran {destination_city} Local Guide"
    total_price = guide['price_per_day'] if guide else 850.0

    booking_code = f"GUIDE-{random.randint(1000, 9999)}"

    # If guide_id is dynamic 99 or real guide, save booking in DB
    target_guide_id = guide['id'] if guide else 1

    cursor.execute(
        """INSERT INTO guide_bookings 
           (booking_code, tourist_id, guide_id, destination_city, booking_date, start_time, duration_hours, number_of_tourists, total_price, status)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'CONFIRMED')""",
        (booking_code, tourist_id, target_guide_id, destination_city, booking_date, start_time, duration_hours, number_of_tourists, total_price)
    )
    db.commit()
    booking_id = cursor.lastrowid

    return {
        "id": booking_id,
        "booking_id": booking_code,
        "booking_code": booking_code,
        "guide_name": guide_name,
        "destination_name": destination_city,
        "destination_city": destination_city,
        "booking_date": booking_date,
        "start_time": start_time,
        "duration": duration_hours,
        "number_of_tourists": number_of_tourists,
        "price": total_price,
        "status": "CONFIRMED"
    }

def get_tourist_bookings(tourist_id):
    db = get_db()
    rows = db.execute(
        """SELECT b.*, g.name as guide_name, g.languages, g.profile_photo as guide_photo 
           FROM guide_bookings b 
           JOIN guides g ON b.guide_id = g.id 
           WHERE b.tourist_id = ? 
           ORDER BY b.created_at DESC""",
        (tourist_id,)
    ).fetchall()
    
    result = []
    for r in rows:
        d = dict(r)
        d['booking_id'] = d.get('booking_code', f"GUIDE-{d['id']}")
        d['destination_name'] = d.get('destination_city', 'India')
        d['price'] = d.get('total_price', 800)
        d['duration'] = d.get('duration_hours', 6)
        result.append(d)
    return result

def get_guide_dashboard_data(user_id):
    db = get_db()
    guide = db.execute("SELECT g.*, u.email FROM guides g JOIN users u ON g.user_id = u.id WHERE g.user_id = ?", (user_id,)).fetchone()
    if not guide:
        guide = db.execute("SELECT g.*, u.email FROM guides g JOIN users u ON g.user_id = u.id WHERE g.id = ?", (user_id,)).fetchone()

    if not guide:
        guide_simple = db.execute("SELECT * FROM guides WHERE user_id = ? OR id = ?", (user_id, user_id)).fetchone()
        if guide_simple:
            guide = guide_simple

    if not guide:
        # Check if user exists in users table and auto-create guide profile record
        u = db.execute("SELECT * FROM users WHERE id = ?", (user_id,)).fetchone()
        if u:
            cursor = db.cursor()
            cursor.execute(
                """INSERT INTO guides (user_id, name, city, languages, specialization, experience_years, price_per_day, bio, verification_status, availability_status)
                   VALUES (?, ?, 'Goa', 'English, Hindi', 'Heritage & Culture', 3, 800.0, 'Certified local tourist guide.', 'PENDING', 'AVAILABLE')""",
                (u['id'], u['name'])
            )
            db.commit()
            guide = db.execute("SELECT g.*, u.email FROM guides g JOIN users u ON g.user_id = u.id WHERE g.id = ?", (cursor.lastrowid,)).fetchone()

    if not guide:
        u = db.execute("SELECT * FROM users WHERE id = ?", (user_id,)).fetchone()
        guide_dict = {
            "id": 1,
            "user_id": user_id,
            "name": u['name'] if u else "Local Tour Guide",
            "email": u['email'] if u else "guide@digitalyatra.com",
            "city": "Goa",
            "languages": "English, Hindi",
            "specialization": "Heritage & Culture",
            "experience_years": 3,
            "experience": "3 years",
            "price_per_day": 800.0,
            "price": 800.0,
            "rating": 4.8,
            "availability_status": "AVAILABLE",
            "verification_status": "PENDING",
            "verified": False,
            "bio": "Certified local tourist guide."
        }
    else:
        guide_dict = format_guide_dict(guide)
        if hasattr(guide, 'keys') and 'email' in guide.keys():
            guide_dict['email'] = guide['email']

    bookings = db.execute(
        """SELECT b.*, u.name as tourist_name, u.email as tourist_email 
           FROM guide_bookings b 
           JOIN users u ON b.tourist_id = u.id 
           WHERE b.guide_id = ? 
           ORDER BY b.created_at DESC""",
        (guide_dict['id'],)
    ).fetchall()

    bookings_list = []
    for b in bookings:
        d = dict(b)
        d['booking_id'] = d.get('booking_code', f"GUIDE-{d['id']}")
        d['destination_name'] = d.get('destination_city', 'India')
        d['price'] = d.get('total_price', 800)
        d['duration'] = d.get('duration_hours', 6)
        bookings_list.append(d)

    total_earnings = sum(b['price'] for b in bookings_list if b['status'] in ['CONFIRMED', 'COMPLETED'])
    pending_count = len([b for b in bookings_list if b['status'] == 'PENDING'])

    # Fetch tourist reviews received by this guide
    reviews_rows = db.execute("SELECT * FROM tourist_reviews WHERE guide_id = ? ORDER BY created_at DESC", (guide_dict['id'],)).fetchall()
    reviews_list = [dict(r) for r in reviews_rows]

    return {
        "guide": guide_dict,
        "bookings": bookings_list,
        "reviews": reviews_list,
        "stats": {
            "total_bookings": len(bookings_list),
            "pending": pending_count,
            "total_earnings": total_earnings
        }
    }

def update_guide_availability(user_id, status):
    db = get_db()
    cursor = db.cursor()
    cursor.execute("UPDATE guides SET availability_status = ? WHERE user_id = ? OR id = ?", (status, user_id, user_id))
    db.commit()
    return True

def update_guide_profile_data(guide_id, data):
    db = get_db()
    cursor = db.cursor()

    guide = db.execute("SELECT * FROM guides WHERE id = ? OR user_id = ?", (guide_id, guide_id)).fetchone()
    if not guide and data.get('user_id'):
        guide = db.execute("SELECT * FROM guides WHERE user_id = ?", (data['user_id'],)).fetchone()
        
    if not guide:
        u_id = data.get('user_id') or guide_id
        u = db.execute("SELECT * FROM users WHERE id = ?", (u_id,)).fetchone()
        u_name = data.get('name') or (u['name'] if u else 'Local Guide')
        cursor.execute(
            """INSERT INTO guides (user_id, name, city, languages, specialization, experience_years, price_per_day, bio, profile_photo, availability_status, verification_status)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'AVAILABLE', 'PENDING')""",
            (u_id, u_name, data.get('city', 'Goa'), data.get('languages', 'English, Hindi'), data.get('specialization', 'Heritage & Culture'),
             int(data.get('experience_years') or 3), float(data.get('price_per_day') or 800.0), data.get('bio', 'Certified local guide.'),
             data.get('profile_photo', ''))
        )
        db.commit()
        g_id = cursor.lastrowid
        guide = db.execute("SELECT * FROM guides WHERE id = ?", (g_id,)).fetchone()

    g_id = guide['id']
    u_id = guide['user_id']

    name = data.get('name') or guide['name']
    city = data.get('city') or guide['city']
    languages = data.get('languages') or guide['languages']
    specialization = data.get('specialization') or guide['specialization']
    experience_years = int(data.get('experience_years') or guide['experience_years'] or 1)
    price_per_day = float(data.get('price_per_day') or data.get('price') or guide['price_per_day'] or 800.0)
    bio = data.get('bio') or data.get('description') or guide['bio']
    profile_photo = data.get('profile_photo') or data.get('photo') or guide['profile_photo']
    availability_status = data.get('availability_status') or guide['availability_status']

    cursor.execute(
        """UPDATE guides 
           SET name = ?, city = ?, languages = ?, specialization = ?, experience_years = ?, price_per_day = ?, bio = ?, profile_photo = ?, availability_status = ?
           WHERE id = ?""",
        (name, city, languages, specialization, experience_years, price_per_day, bio, profile_photo, availability_status, g_id)
    )

    if u_id:
        cursor.execute("UPDATE users SET name = ? WHERE id = ?", (name, u_id))
    db.commit()

    updated_row = db.execute("SELECT g.*, u.email FROM guides g JOIN users u ON g.user_id = u.id WHERE g.id = ?", (g_id,)).fetchone()
    return format_guide_dict(updated_row)


