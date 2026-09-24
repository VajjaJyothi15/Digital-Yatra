import math
from database.db import get_db

class RecommendationEngine:
    def __init__(self):
        pass

    def recommend_attractions(self, user_interests, budget, destination_city=None, top_n=6):
        """
        Content-based filtering using cosine similarity between 
        user interest vector and destination category vectors.
        """
        db = get_db()
        if destination_city and destination_city.strip() and destination_city.strip().lower() not in ['all', 'all india']:
            clean_city = destination_city.strip()
            # 1. Search in destinations table by city, name, or state
            query_d = "SELECT * FROM destinations WHERE LOWER(city) = LOWER(?) OR LOWER(name) LIKE ? OR LOWER(state) = LOWER(?)"
            destinations = [dict(row) for row in db.execute(query_d, [clean_city, f"%{clean_city.lower()}%", clean_city]).fetchall()]

            # 2. Also search in services table (attractions, spots, temples, nature) for this city
            query_s = "SELECT id, name, category, city, latitude, longitude, rating, price_min as fee, trust_status FROM services WHERE LOWER(city) = LOWER(?) OR LOWER(name) LIKE ?"
            services = [dict(row) for row in db.execute(query_s, [clean_city, f"%{clean_city.lower()}%"]).fetchall()]
            for s in services:
                s['description'] = f"{s['category']} spot in {s['city']}"
                destinations.append(s)

        if not destinations and not destination_city:
            destinations = [dict(row) for row in db.execute("SELECT * FROM destinations").fetchall()]

        user_interest_list = [i.strip().lower() for i in user_interests.split(',') if i.strip()] if isinstance(user_interests, str) else []
        
        # Build vocabulary of categories
        all_categories = list(set([d['category'].lower() for d in destinations] + user_interest_list))
        if not all_categories:
            return destinations[:top_n]

        # User vector
        user_vec = [1 if cat in user_interest_list else 0 for cat in all_categories]

        scored_destinations = []
        for dest in destinations:
            dest_cat = dest['category'].lower()
            dest_vec = [1 if cat == dest_cat else 0 for cat in all_categories]

            # Cosine similarity calculation
            dot_product = sum(u * d for u, d in zip(user_vec, dest_vec))
            norm_u = math.sqrt(sum(u ** 2 for u in user_vec)) or 1.0
            norm_d = math.sqrt(sum(d ** 2 for d in dest_vec)) or 1.0
            similarity = dot_product / (norm_u * norm_d)

            # Weight score by rating and budget alignment
            rating_weight = (dest['rating'] or 4.0) / 5.0
            final_score = (similarity * 0.6) + (rating_weight * 0.4)

            dest_copy = dict(dest)
            dest_copy['match_score'] = round(final_score * 100, 1)
            dest_copy['ai_label'] = 'AI Recommended' if similarity > 0 else 'Verified'
            scored_destinations.append(dest_copy)

        scored_destinations.sort(key=lambda x: x['match_score'], reverse=True)
        return scored_destinations[:top_n]

recommendation_engine = RecommendationEngine()
