from flask import Blueprint, request, jsonify
from database.db import get_db
from services.recommendation_service import get_recommendations_for_user
from services.itinerary_service import generate_full_itinerary
from services.budget_service import estimate_trip_budget
from datetime import datetime

trip_bp = Blueprint('trips', __name__, url_prefix='/api')

@trip_bp.route('/recommendations', methods=['POST'])
def get_recommendations():
    data = request.get_json() or {}
    interests = data.get('interests', '')
    budget = data.get('budget', 10000.0)
    city = data.get('destination', None)

    recommendations = get_recommendations_for_user(
        user_interests=interests,
        budget=budget,
        destination_city=city,
        top_n=6
    )

    return jsonify({
        "success": True,
        "count": len(recommendations),
        "recommendations": recommendations
    })

@trip_bp.route('/budget/estimate', methods=['POST'])
def get_budget_estimate():
    data = request.get_json() or {}
    start_date = data.get('start_date', '')
    end_date = data.get('end_date', '')
    group_size = data.get('group_size', 1)
    budget_preference = data.get('budget_preference', 'Medium')
    city = data.get('destination', 'Goa')

    try:
        d1 = datetime.strptime(start_date, "%Y-%m-%d")
        d2 = datetime.strptime(end_date, "%Y-%m-%d")
        days = max(1, (d2 - d1).days + 1)
    except Exception:
        days = 3

    estimate = estimate_trip_budget(
        days=days,
        group_size=group_size,
        budget_tier=budget_preference,
        city=city
    )

    return jsonify({
        "success": True,
        "estimate": estimate
    })

@trip_bp.route('/itinerary/generate', methods=['POST'])
def generate_itinerary_endpoint():
    data = request.get_json() or {}
    destination = data.get('destination', 'Goa')
    start_date = data.get('start_date', '2026-10-01')
    end_date = data.get('end_date', '2026-10-03')
    group_size = data.get('group_size', 1)
    budget = data.get('budget', 10000.0)
    interests = data.get('interests', '')
    missed_from_day = data.get('missed_from_day', None)

    itinerary_data = generate_full_itinerary(
        destination=destination,
        start_date=start_date,
        end_date=end_date,
        group_size=group_size,
        budget=budget,
        interests=interests,
        missed_from_day=missed_from_day
    )

    return jsonify({
        "success": True,
        "itinerary": itinerary_data
    })

@trip_bp.route('/trips/create', methods=['POST'])
def create_trip():
    data = request.get_json() or {}
    user_id = data.get('user_id', 1)
    destination = data.get('destination', '').strip()
    start_date = data.get('start_date', '')
    end_date = data.get('end_date', '')
    group_size = data.get('group_size', 1)
    budget = data.get('budget', 10000.0)
    interests = data.get('interests', '')
    budget_preference = data.get('budget_preference', 'Medium')

    if not destination or not start_date or not end_date:
        return jsonify({"success": False, "message": "Destination, start date, and end date are required."}), 400

    db = get_db()
    cursor = db.cursor()

    # Save trip to database
    cursor.execute(
        """INSERT INTO trips (user_id, destination, start_date, end_date, group_size, budget, interests)
           VALUES (?, ?, ?, ?, ?, ?, ?)""",
        (user_id, destination, start_date, end_date, group_size, budget, interests)
    )
    trip_id = cursor.lastrowid

    # Generate itinerary
    itinerary_result = generate_full_itinerary(
        destination=destination,
        start_date=start_date,
        end_date=end_date,
        group_size=group_size,
        budget=budget,
        interests=interests
    )

    # Save itinerary items to database
    for day in itinerary_result['day_wise_itinerary']:
        day_num = day['day_number']
        for item in day['schedule']:
            cursor.execute(
                """INSERT INTO itinerary (trip_id, day_number, place_name, category, latitude, longitude, start_time, end_time, estimated_cost)
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)""",
                (trip_id, day_num, item['place_name'], item['category'], item['latitude'], item['longitude'], item['start_time'], item['end_time'], item['estimated_cost'])
            )

    db.commit()

    # Budget estimate
    budget_est = estimate_trip_budget(
        days=itinerary_result['num_days'],
        group_size=group_size,
        budget_tier=budget_preference,
        city=destination
    )

    return jsonify({
        "success": True,
        "message": "Trip created successfully!",
        "trip_id": trip_id,
        "itinerary": itinerary_result,
        "budget_estimate": budget_est
    }), 201

@trip_bp.route('/trips/<int:trip_id>', methods=['GET'])
def get_trip(trip_id):
    db = get_db()
    trip_row = db.execute("SELECT * FROM trips WHERE id = ?", (trip_id,)).fetchone()
    if not trip_row:
        return jsonify({"success": False, "message": "Trip not found."}), 404

    trip = dict(trip_row)
    itinerary_rows = db.execute(
        "SELECT * FROM itinerary WHERE trip_id = ? ORDER BY day_number, start_time",
        (trip_id,)
    ).fetchall()

    # Group by day
    days_dict = {}
    for r in itinerary_rows:
        d_num = r['day_number']
        if d_num not in days_dict:
            days_dict[d_num] = []
        days_dict[d_num].append(dict(r))

    trip['day_wise_itinerary'] = [
        {"day_number": d, "schedule": items} for d, items in days_dict.items()
    ]

    return jsonify({
        "success": True,
        "trip": trip
    })
