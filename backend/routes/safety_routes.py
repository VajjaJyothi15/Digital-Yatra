from flask import Blueprint, request, jsonify
from services.safety_service import trigger_sos_alert, generate_location_share

safety_bp = Blueprint('safety', __name__, url_prefix='/api/safety')

@safety_bp.route('/emergency', methods=['GET'])
def get_emergency_info():
    return jsonify({
        "success": True,
        "emergency_numbers": {
            "national_emergency": "112",
            "police": "100",
            "ambulance": "108",
            "women_helpline": "1091",
            "tourist_helpline": "1363"
        },
        "guidelines": [
            "1. Stay in well-lit, public areas if you feel unsafe.",
            "2. Share your live GPS location with a trusted contact.",
            "3. Tap the red 🚨 SOS button to alert nearest emergency responders.",
            "4. Call 112 for immediate national emergency assistance."
        ]
    })

@safety_bp.route('/sos', methods=['POST'])
def trigger_sos():
    data = request.get_json() or {}
    user_id = data.get('user_id', 1)
    latitude = data.get('latitude')
    longitude = data.get('longitude')
    details = data.get('details', 'Emergency SOS Triggered by Tourist')

    if latitude is None or longitude is None:
        return jsonify({"success": False, "message": "Live latitude and longitude coordinates are required to send SOS alert."}), 400

    sos_response = trigger_sos_alert(
        user_id=int(user_id),
        latitude=float(latitude),
        longitude=float(longitude),
        details=details
    )

    return jsonify({
        "success": True,
        "message": "🚨 EMERGENCY SOS ALERT ACTIVATED!",
        "sos": sos_response
    }), 201

@safety_bp.route('/share-location', methods=['POST'])
def share_location():
    data = request.get_json() or {}
    user_id = data.get('user_id', 1)
    latitude = data.get('latitude')
    longitude = data.get('longitude')
    contact_name = data.get('contact_name', 'Trusted Contact')
    contact_phone = data.get('contact_phone', '')

    if latitude is None or longitude is None:
        return jsonify({"success": False, "message": "Live latitude and longitude coordinates are required to share location."}), 400

    share_response = generate_location_share(
        user_id=int(user_id),
        latitude=float(latitude),
        longitude=float(longitude),
        contact_name=contact_name,
        contact_phone=contact_phone
    )

    return jsonify({
        "success": True,
        "message": "Location link generated successfully!",
        "share": share_response
    })
