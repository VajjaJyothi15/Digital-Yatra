from flask import Blueprint, request, jsonify, session
from database.db import get_db
from services.local_guide_service import (
    get_guides_by_city,
    get_guide_profile,
    create_guide_booking,
    get_tourist_bookings,
    get_guide_dashboard_data,
    update_guide_availability,
    update_guide_profile_data
)

guide_booking_bp = Blueprint('guide_booking', __name__, url_prefix='/api/guides')

@guide_booking_bp.route('', methods=['GET'])
def list_guides():
    city = request.args.get('city')
    language = request.args.get('language')
    specialization = request.args.get('specialization')

    guides = get_guides_by_city(city=city, language=language, specialization=specialization)
    return jsonify({
        "success": True,
        "count": len(guides),
        "guides": guides
    })

@guide_booking_bp.route('/<int:guide_id>', methods=['GET'])
def guide_detail(guide_id):
    guide = get_guide_profile(guide_id)
    if not guide:
        return jsonify({"success": False, "message": "Guide profile not found."}), 404
    return jsonify({"success": True, "guide": guide})

@guide_booking_bp.route('/profile', methods=['PUT'])
@guide_booking_bp.route('/<int:guide_id>', methods=['PUT'])
def edit_guide_profile(guide_id=None):
    data = request.get_json() or {}
    user_data = session.get('user', {})
    target_id = guide_id or data.get('guide_id') or data.get('user_id') or user_data.get('id')

    if not target_id:
        return jsonify({"success": False, "message": "Guide ID or User ID is required."}), 400

    updated_profile = update_guide_profile_data(target_id, data)
    if not updated_profile:
        return jsonify({"success": False, "message": "Guide profile not found in database."}), 404

    return jsonify({
        "success": True,
        "message": "✓ Guide Profile updated successfully in database!",
        "guide": updated_profile
    })

@guide_booking_bp.route('/book', methods=['POST'])
def book_guide():
    data = request.get_json() or {}
    
    # Try session user first, then json payload, then default 1
    user_data = session.get('user', {})
    tourist_id = user_data.get('id') or data.get('tourist_id') or 1

    guide_id = data.get('guide_id')
    destination_city = data.get('destination_name') or data.get('destination_city', 'Goa')
    booking_date = data.get('booking_date')
    start_time = data.get('start_time', '10:00 AM')
    duration_hours = data.get('duration') or data.get('duration_hours', 6)
    number_of_tourists = data.get('number_of_tourists', 1)

    if not guide_id or not booking_date:
        return jsonify({"success": False, "message": "Guide ID and booking date are required."}), 400

    try:
        booking = create_guide_booking(
            tourist_id=int(tourist_id),
            guide_id=int(guide_id),
            destination_city=destination_city,
            booking_date=booking_date,
            start_time=start_time,
            duration_hours=int(duration_hours),
            number_of_tourists=int(number_of_tourists)
        )
        return jsonify({
            "success": True,
            "message": "✓ Guide Booking Confirmed!",
            "booking": booking
        }), 201
    except ValueError as e:
        return jsonify({"success": False, "message": str(e)}), 400

@guide_booking_bp.route('/my-bookings', methods=['GET'])
def my_bookings():
    user_data = session.get('user', {})
    tourist_id = user_data.get('id') or request.args.get('tourist_id') or 1
    bookings = get_tourist_bookings(int(tourist_id))
    return jsonify({"success": True, "count": len(bookings), "bookings": bookings})

@guide_booking_bp.route('/booking/<int:booking_id>/cancel', methods=['PUT', 'POST'])
def cancel_booking(booking_id):
    db = get_db()
    cursor = db.cursor()
    cursor.execute("UPDATE guide_bookings SET status = 'CANCELLED' WHERE id = ?", (booking_id,))
    db.commit()
    return jsonify({"success": True, "message": "Booking cancelled successfully."})

@guide_booking_bp.route('/booking/<int:booking_id>/status', methods=['PUT'])
def update_booking_status(booking_id):
    data = request.get_json() or {}
    new_status = data.get('status', 'CONFIRMED')
    db = get_db()
    cursor = db.cursor()
    cursor.execute("UPDATE guide_bookings SET status = ? WHERE id = ?", (new_status, booking_id))
    db.commit()
    return jsonify({"success": True, "message": f"Booking status updated to {new_status}."})

@guide_booking_bp.route('/dashboard', methods=['GET'])
def guide_dashboard():
    user_data = session.get('user', {})
    user_id = request.args.get('user_id') or user_data.get('id')
    
    if not user_id:
        # fallback to first guide user in database
        db = get_db()
        first_guide = db.execute("SELECT user_id FROM guides LIMIT 1").fetchone()
        if first_guide:
            user_id = first_guide['user_id']
        else:
            return jsonify({"success": False, "message": "User ID required."}), 400

    dashboard_data = get_guide_dashboard_data(int(user_id))
    if not dashboard_data:
        return jsonify({"success": False, "message": "Guide profile not found for this account."}), 404

    return jsonify({"success": True, **dashboard_data})

@guide_booking_bp.route('/availability', methods=['PUT'])
def set_availability():
    data = request.get_json() or {}
    user_data = session.get('user', {})
    user_id = data.get('user_id') or user_data.get('id')
    status = data.get('status', 'AVAILABLE')

    if not user_id:
        return jsonify({"success": False, "message": "User ID required."}), 400

    update_guide_availability(int(user_id), status)
    return jsonify({"success": True, "message": f"Availability status set to {status}!"})
