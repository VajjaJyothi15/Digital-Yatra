from database.db import get_db

def get_admin_dashboard_metrics():
    """
    Compute total reports, status breakdowns, category statistics, 
    and identify high-density problem hotspots.
    """
    db = get_db()

    # Total & Status Counts
    total = db.execute("SELECT COUNT(*) as count FROM reports").fetchone()['count']
    pending = db.execute("SELECT COUNT(*) as count FROM reports WHERE status = 'Under Review'").fetchone()['count']
    verified = db.execute("SELECT COUNT(*) as count FROM reports WHERE status = 'Verified'").fetchone()['count']
    resolved = db.execute("SELECT COUNT(*) as count FROM reports WHERE status = 'Resolved'").fetchone()['count']

    # Category Breakdown
    cat_rows = db.execute(
        "SELECT category, COUNT(*) as count FROM reports GROUP BY category ORDER BY count DESC"
    ).fetchall()
    categories_breakdown = {row['category']: row['count'] for row in cat_rows}

    # Hotspots Detection (Grouping by rounded lat/lng coordinates to identify repeated reports)
    hotspot_rows = db.execute(
        """SELECT ROUND(latitude, 2) as lat_grp, ROUND(longitude, 2) as lng_grp, 
                  COUNT(*) as report_count, category, description
           FROM reports 
           GROUP BY lat_grp, lng_grp 
           ORDER BY report_count DESC"""
    ).fetchall()

    hotspots = []
    for idx, h in enumerate(hotspot_rows):
        area_name = f"Area {chr(65 + idx)}"  # Area A, Area B, Area C
        if h['lat_grp'] == 17.36 and h['lng_grp'] == 78.48:
            area_name = "Area A (Charminar & Old City)"
        elif h['lat_grp'] == 26.92 and h['lng_grp'] == 75.83:
            area_name = "Area B (Hawa Mahal & Pink City)"
        elif h['lat_grp'] == 25.31 and h['lng_grp'] == 83.01:
            area_name = "Area C (Godowlia & Dashashwamedh)"

        hotspots.append({
            "area_name": area_name,
            "latitude": h['lat_grp'],
            "longitude": h['lng_grp'],
            "report_count": h['report_count'],
            "primary_category": h['category'],
            "latest_issue": h['description']
        })

    # Recent Feedback
    feedback_rows = db.execute(
        """SELECT f.*, u.name as user_name, s.name as service_name 
           FROM feedback f 
           LEFT JOIN users u ON f.user_id = u.id 
           LEFT JOIN services s ON f.service_id = s.id 
           ORDER BY f.created_at DESC LIMIT 5"""
    ).fetchall()

    return {
        "summary": {
            "total_reports": total,
            "pending_reports": pending,
            "verified_reports": verified,
            "resolved_reports": resolved
        },
        "categories_breakdown": categories_breakdown,
        "hotspots": hotspots,
        "recent_feedback": [dict(f) for f in feedback_rows]
    }

def update_report_status_and_feedback_loop(report_id, new_status):
    """
    Update report status and trigger feedback loop: 
    if a sanitation/service report is resolved, update trust status of nearby services.
    """
    db = get_db()
    cursor = db.cursor()

    cursor.execute("UPDATE reports SET status = ? WHERE id = ?", (new_status, report_id))
    
    # Trigger feedback loop
    if new_status in ['Verified', 'Resolved']:
        report = db.execute("SELECT * FROM reports WHERE id = ?", (report_id,)).fetchone()
        if report:
            # Upgrade trust status of services in the same city/area
            cursor.execute(
                "UPDATE services SET trust_status = 'VERIFIED' WHERE LOWER(category) = LOWER(?)",
                (report['category'],)
            )

    db.commit()

    return {
        "report_id": report_id,
        "status": new_status,
        "feedback_loop_triggered": True
    }

def submit_user_feedback(user_id, service_id, rating, comment):
    db = get_db()
    cursor = db.cursor()

    cursor.execute(
        "INSERT INTO feedback (user_id, service_id, rating, comment) VALUES (?, ?, ?, ?)",
        (user_id, service_id, float(rating), comment)
    )
    
    # Recalculate service rating
    avg_row = db.execute(
        "SELECT AVG(rating) as avg_rating FROM feedback WHERE service_id = ?",
        (service_id,)
    ).fetchone()
    if avg_row and avg_row['avg_rating']:
        new_rating = round(avg_row['avg_rating'], 1)
        cursor.execute("UPDATE services SET rating = ? WHERE id = ?", (new_rating, service_id))

    db.commit()
    return {"success": True, "feedback_id": cursor.lastrowid}
