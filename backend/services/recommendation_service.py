from models.recommendation_model import recommendation_engine

def get_recommendations_for_user(user_interests, budget, destination_city=None, top_n=6):
    return recommendation_engine.recommend_attractions(
        user_interests=user_interests,
        budget=budget,
        destination_city=destination_city,
        top_n=top_n
    )
