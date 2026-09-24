from flask import Blueprint, request, jsonify
from services.review_service import (
    submit_tourist_review,
    get_all_tourist_reviews,
    get_guide_reviews
)

review_bp = Blueprint('review', __name__, url_prefix='/api')

@review_bp.route('/reviews', methods=['POST'])
def add_tourist_review():
    data = request.get_json() or {}
    
    tourist_id = data.get('tourist_id') or data.get('user_id')
    destination_name = data.get('destination_name', '')
    destination_rating = data.get('destination_rating', 5.0)
    guide_id = data.get('guide_id')
    guide_rating = data.get('guide_rating', 5.0)
    comments = data.get('comments', '').strip()

    if not tourist_id:
        return jsonify({"success": False, "message": "Logged-in tourist ID is required to post a review."}), 400

    if not comments:
        return jsonify({"success": False, "message": "Please enter feedback comments or review description."}), 400

    review = submit_tourist_review(
        tourist_id=tourist_id,
        destination_name=destination_name,
        destination_rating=destination_rating,
        guide_id=guide_id,
        guide_rating=guide_rating,
        comments=comments
    )

    if not review:
        return jsonify({"success": False, "message": "Failed to submit review."}), 500

    return jsonify({
        "success": True,
        "message": "✓ Review & feedback submitted successfully! Ratings updated across guide and admin dashboards.",
        "review": review
    })

@review_bp.route('/reviews', methods=['GET'])
def list_all_reviews():
    reviews = get_all_tourist_reviews()
    return jsonify({
        "success": True,
        "count": len(reviews),
        "reviews": reviews
    })

@review_bp.route('/guides/<int:guide_id>/reviews', methods=['GET'])
def list_guide_reviews(guide_id):
    reviews = get_guide_reviews(guide_id)
    return jsonify({
        "success": True,
        "count": len(reviews),
        "reviews": reviews
    })
