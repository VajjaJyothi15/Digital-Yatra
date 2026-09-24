from flask import Blueprint, request, jsonify
from services.admin_service import (
    get_admin_dashboard_metrics, 
    update_report_status_and_feedback_loop,
    submit_user_feedback
)
from services.report_service import get_all_reports
from database.db import get_db

admin_bp = Blueprint('admin', __name__, url_prefix='/api')

@admin_bp.route('/admin/dashboard', methods=['GET'])
def get_dashboard():
    metrics = get_admin_dashboard_metrics()
    return jsonify({
        "success": True,
        "dashboard": metrics
    })

@admin_bp.route('/admin/reports', methods=['GET'])
def get_admin_reports():
    status = request.args.get('status')
    reports = get_all_reports(status=status)
    return jsonify({
        "success": True,
        "count": len(reports),
        "reports": reports
    })

@admin_bp.route('/admin/reports/<int:report_id>', methods=['PUT'])
def update_report(report_id):
    data = request.get_json() or {}
    new_status = data.get('status', 'Verified')

    if new_status not in ['Under Review', 'Verified', 'Resolved', 'Rejected']:
        return jsonify({"success": False, "message": "Invalid status value."}), 400

    result = update_report_status_and_feedback_loop(report_id, new_status)
    return jsonify({
        "success": True,
        "message": f"Report #{report_id} status updated to '{new_status}'!",
        "result": result
    })

from services.local_guide_service import format_guide_dict

@admin_bp.route('/admin/guides', methods=['GET'])
def get_admin_guides():
    db = get_db()
    rows = db.execute("SELECT g.*, u.email FROM guides g JOIN users u ON g.user_id = u.id ORDER BY g.id DESC").fetchall()
    return jsonify({
        "success": True,
        "count": len(rows),
        "guides": [format_guide_dict(r) for r in rows]
    })

@admin_bp.route('/admin/guides/<int:guide_id>/verify', methods=['PUT', 'POST'])
def verify_guide(guide_id):
    data = request.get_json() or {}
    
    # Handle boolean verified key or string status key
    if 'verified' in data:
        status = 'VERIFIED' if data['verified'] else 'REJECTED'
    else:
        status = data.get('status', 'VERIFIED').upper()

    if status not in ['VERIFIED', 'REJECTED', 'PENDING', 'REVOKED']:
        return jsonify({"success": False, "message": "Invalid verification status."}), 400

    db = get_db()
    cursor = db.cursor()
    cursor.execute("UPDATE guides SET verification_status = ? WHERE id = ?", (status, guide_id))
    db.commit()

    return jsonify({
        "success": True,
        "message": f"✓ Guide #{guide_id} status updated to '{status}' in database!",
        "status": status
    })

@admin_bp.route('/admin/guides/<int:guide_id>/revoke', methods=['PUT', 'POST'])
def revoke_guide(guide_id):
    db = get_db()
    cursor = db.cursor()
    cursor.execute("UPDATE guides SET verification_status = 'REJECTED' WHERE id = ?", (guide_id,))
    db.commit()

    return jsonify({
        "success": True,
        "message": f"✓ Guide #{guide_id} verification and portal access REVOKED successfully!",
        "status": "REJECTED"
    })

@admin_bp.route('/feedback', methods=['POST'])
def add_feedback():
    data = request.get_json() or {}
    user_id = data.get('user_id', 1)
    service_id = data.get('service_id', 1)
    rating = data.get('rating', 5.0)
    comment = data.get('comment', '')

    res = submit_user_feedback(
        user_id=int(user_id),
        service_id=int(service_id),
        rating=float(rating),
        comment=comment
    )

    return jsonify({
        "success": True,
        "message": "Feedback submitted successfully! Recommendation system updated.",
        "feedback": res
    }), 201
