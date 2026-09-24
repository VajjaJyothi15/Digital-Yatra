from database.db import get_db

def create_incident_report(user_id, category, latitude, longitude, description, photo_path=None):
    """
    Save a tourist incident report into the database with default status 'Under Review'.
    """
    db = get_db()
    cursor = db.cursor()

    cursor.execute(
        """INSERT INTO reports (user_id, category, latitude, longitude, description, photo_path, status)
           VALUES (?, ?, ?, ?, ?, ?, 'Under Review')""",
        (user_id, category, float(latitude), float(longitude), description, photo_path)
    )
    db.commit()
    report_id = cursor.lastrowid

    return {
        "report_id": f"#RPT{report_id + 1000}",
        "db_id": report_id,
        "category": category,
        "latitude": latitude,
        "longitude": longitude,
        "description": description,
        "photo_path": photo_path,
        "status": "Under Review"
    }

def get_reports_by_user(user_id):
    db = get_db()
    rows = db.execute("SELECT * FROM reports WHERE user_id = ? ORDER BY created_at DESC", (user_id,)).fetchall()
    return [dict(r) for r in rows]

def get_all_reports(status=None):
    db = get_db()
    query = "SELECT r.*, u.name as user_name, u.email as user_email FROM reports r LEFT JOIN users u ON r.user_id = u.id WHERE 1=1"
    params = []
    if status:
        query += " AND r.status = ?"
        params.append(status)
    query += " ORDER BY r.created_at DESC"
    rows = db.execute(query, params).fetchall()
    return [dict(r) for r in rows]
