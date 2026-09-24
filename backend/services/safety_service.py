from database.db import get_db
from utils.distance import haversine_distance, format_distance

def trigger_sos_alert(user_id, latitude, longitude, details=None):
    """
    Log emergency SOS trigger and locate immediate emergency responders.
    """
    db = get_db()
    cursor = db.cursor()

    # Log report as Safety Emergency
    cursor.execute(
        """INSERT INTO reports (user_id, category, latitude, longitude, description, status)
           VALUES (?, 'Safety', ?, ?, ?, 'Under Review')""",
        (user_id, float(latitude), float(longitude), details or "Emergency SOS Triggered by Tourist")
    )
    db.commit()
    report_id = cursor.lastrowid

    # Locate nearest hospital and police station
    hospitals = db.execute("SELECT * FROM services WHERE LOWER(category) = 'hospital'").fetchall()
    police = db.execute("SELECT * FROM services WHERE LOWER(category) = 'police'").fetchall()

    user_lat, user_lng = float(latitude), float(longitude)

    nearest_hospital = None
    min_hosp_dist = float('inf')
    for h in hospitals:
        item = dict(h)
        d = haversine_distance(user_lat, user_lng, item['latitude'], item['longitude'])
        if d < min_hosp_dist:
            min_hosp_dist = d
            item['distance_formatted'] = format_distance(d)
            nearest_hospital = item

    nearest_police = None
    min_pol_dist = float('inf')
    for p in police:
        item = dict(p)
        d = haversine_distance(user_lat, user_lng, item['latitude'], item['longitude'])
        if d < min_pol_dist:
            min_pol_dist = d
            item['distance_formatted'] = format_distance(d)
            nearest_police = item

    return {
        "sos_id": f"#SOS{report_id + 5000}",
        "status": "ACTIVE_SOS",
        "emergency_number": "112",
        "nearest_hospital": nearest_hospital,
        "nearest_police": nearest_police,
        "location": {"latitude": user_lat, "longitude": user_lng}
    }

def generate_location_share(user_id, latitude, longitude, contact_name=None, contact_phone=None):
    """
    Generate shareable location tracking payload for trusted contacts.
    """
    lat_str = f"{float(latitude):.4f}"
    lng_str = f"{float(longitude):.4f}"
    share_url = f"https://www.google.com/maps?q={lat_str},{lng_str}"

    return {
        "user_id": user_id,
        "share_url": share_url,
        "coordinates": {"latitude": latitude, "longitude": longitude},
        "contact_name": contact_name or "Trusted Contact",
        "message": f"Digital Yatra Live Location Share: Tourist location at {lat_str}, {lng_str}. Track here: {share_url}"
    }
