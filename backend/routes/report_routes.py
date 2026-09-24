import os
from flask import Blueprint, request, jsonify, current_app
from werkzeug.utils import secure_filename
from services.report_service import create_incident_report, get_reports_by_user, get_all_reports
from database.db import get_db

report_bp = Blueprint('reports', __name__, url_prefix='/api/reports')

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@report_bp.route('', methods=['POST'])
def submit_report():
    user_id = request.form.get('user_id') or (request.json.get('user_id') if request.is_json else 1)
    category = request.form.get('category') or (request.json.get('category') if request.is_json else None)
    latitude = request.form.get('latitude') or (request.json.get('latitude') if request.is_json else 0.0)
    longitude = request.form.get('longitude') or (request.json.get('longitude') if request.is_json else 0.0)
    location_name = request.form.get('location_name') or (request.json.get('location_name') if request.is_json else '')
    description = request.form.get('description') or (request.json.get('description') if request.is_json else None)

    if not category or not description:
        return jsonify({"success": False, "message": "Category and description are required."}), 400

    photo_path = None
    if 'photo' in request.files:
        file = request.files['photo']
        if file and allowed_file(file.filename):
            filename = secure_filename(f"report_{user_id}_{file.filename}")
            upload_dir = current_app.config['UPLOAD_FOLDER']
            os.makedirs(upload_dir, exist_ok=True)
            save_path = os.path.join(upload_dir, filename)
            file.save(save_path)
            photo_path = f"/uploads/{filename}"

    report_result = create_incident_report(
        user_id=int(user_id) if user_id else 1,
        category=category,
        latitude=latitude,
        longitude=longitude,
        description=description,
        photo_path=photo_path,
        location_name=location_name
    )

    return jsonify({
        "success": True,
        "message": "Report submitted successfully!",
        "report": report_result
    }), 201

@report_bp.route('', methods=['GET'])
def get_reports():
    user_id = request.args.get('user_id')
    status = request.args.get('status')

    if user_id:
        reports = get_reports_by_user(int(user_id))
    else:
        reports = get_all_reports(status=status)

    return jsonify({
        "success": True,
        "count": len(reports),
        "reports": reports
    })

@report_bp.route('/<int:report_id>', methods=['GET'])
def get_report_detail(report_id):
    db = get_db()
    row = db.execute("SELECT * FROM reports WHERE id = ?", (report_id,)).fetchone()
    if not row:
        return jsonify({"success": False, "message": "Report not found."}), 404

    return jsonify({
        "success": True,
        "report": dict(row)
    })
