import math
from database.db import get_db

def submit_tourist_review(tourist_id, destination_name, destination_rating, guide_id=None, guide_rating=5.0, comments=""):
    db = get_db()
    cursor = db.cursor()

    # Get tourist user details
    tourist = db.execute("SELECT name, email FROM users WHERE id = ?", (tourist_id,)).fetchone()
    tourist_name = tourist['name'] if tourist else "Tourist Traveler"
    tourist_email = tourist['email'] if tourist else ""

    # Get guide details if guide_id provided
    guide_name = ""
    target_guide_id = None
    if guide_id:
        try:
            g_id_int = int(guide_id)
            guide = db.execute("SELECT id, name FROM guides WHERE id = ? OR user_id = ?", (g_id_int, g_id_int)).fetchone()
            if guide:
                target_guide_id = guide['id']
                guide_name = guide['name']
        except Exception:
            pass

    dest_rating_val = float(destination_rating) if destination_rating else 5.0
    guide_rating_val = float(guide_rating) if guide_rating else 5.0

    cursor.execute(
        """INSERT INTO tourist_reviews 
           (tourist_id, tourist_name, tourist_email, destination_name, destination_rating, guide_id, guide_name, guide_rating, comments)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)""",
        (tourist_id, tourist_name, tourist_email, destination_name or "", dest_rating_val, target_guide_id, guide_name, guide_rating_val, comments or "")
    )
    db.commit()
    review_id = cursor.lastrowid

    # If guide was reviewed, update guide average rating & reviews_count in database
    if target_guide_id:
        try:
            stats = db.execute(
                "SELECT AVG(guide_rating) as avg_r, COUNT(*) as cnt FROM tourist_reviews WHERE guide_id = ?", 
                (target_guide_id,)
            ).fetchone()
            
            if stats and stats['avg_r']:
                new_avg = round(float(stats['avg_r']), 1)
                new_cnt = int(stats['cnt'])
                cursor.execute(
                    "UPDATE guides SET rating = ?, reviews_count = ? WHERE id = ?",
                    (new_avg, new_cnt, target_guide_id)
                )
                db.commit()
        except Exception as e:
            print(f"[Review Service] Error updating guide ratings: {e}")

    row = db.execute("SELECT * FROM tourist_reviews WHERE id = ?", (review_id,)).fetchone()
    return dict(row) if row else None

def get_all_tourist_reviews():
    db = get_db()
    rows = db.execute("SELECT * FROM tourist_reviews ORDER BY created_at DESC").fetchall()
    return [dict(r) for r in rows]

def get_guide_reviews(guide_id):
    db = get_db()
    rows = db.execute("SELECT * FROM tourist_reviews WHERE guide_id = ? ORDER BY created_at DESC", (guide_id,)).fetchall()
    return [dict(r) for r in rows]
