from flask import Blueprint, request, jsonify
from services.guide_service import find_nearby_services
from services.map_service import get_map_markers

guide_bp = Blueprint('guide', __name__, url_prefix='/api/guide')

@guide_bp.route('/nearby', methods=['GET'])
def get_nearby():
    lat = request.args.get('lat')
    lng = request.args.get('lng')
    category = request.args.get('category')
    city = request.args.get('city')
    radius = float(request.args.get('radius', 10.0))

    services = find_nearby_services(
        lat=lat,
        lng=lng,
        category=category,
        city=city,
        radius_km=radius
    )

    return jsonify({
        "success": True,
        "count": len(services),
        "services": services
    })

@guide_bp.route('/restrooms', methods=['GET'])
def get_restrooms():
    lat, lng, city = request.args.get('lat'), request.args.get('lng'), request.args.get('city')
    services = find_nearby_services(lat, lng, category='Restroom', city=city)
    return jsonify({"success": True, "count": len(services), "services": services})

@guide_bp.route('/water', methods=['GET'])
def get_water():
    lat, lng, city = request.args.get('lat'), request.args.get('lng'), request.args.get('city')
    services = find_nearby_services(lat, lng, category='Water', city=city)
    return jsonify({"success": True, "count": len(services), "services": services})

@guide_bp.route('/food', methods=['GET'])
def get_food():
    lat, lng, city = request.args.get('lat'), request.args.get('lng'), request.args.get('city')
    services = find_nearby_services(lat, lng, category='Food', city=city)
    return jsonify({"success": True, "count": len(services), "services": services})

@guide_bp.route('/hospitals', methods=['GET'])
def get_hospitals():
    lat, lng, city = request.args.get('lat'), request.args.get('lng'), request.args.get('city')
    services = find_nearby_services(lat, lng, category='Hospital', city=city)
    return jsonify({"success": True, "count": len(services), "services": services})

@guide_bp.route('/police', methods=['GET'])
def get_police():
    lat, lng, city = request.args.get('lat'), request.args.get('lng'), request.args.get('city')
    services = find_nearby_services(lat, lng, category='Police', city=city)
    return jsonify({"success": True, "count": len(services), "services": services})

@guide_bp.route('/transport', methods=['GET'])
def get_transport():
    lat, lng, city = request.args.get('lat'), request.args.get('lng'), request.args.get('city')
    services = find_nearby_services(lat, lng, category='Transport', city=city)
    return jsonify({"success": True, "count": len(services), "services": services})

@guide_bp.route('/markers', methods=['GET'])
def get_markers():
    city = request.args.get('city')
    category = request.args.get('category')
    markers = get_map_markers(city=city, category=category)
    return jsonify({"success": True, "count": len(markers), "markers": markers})
