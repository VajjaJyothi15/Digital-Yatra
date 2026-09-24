from models.cost_model import cost_estimator

def estimate_trip_budget(days, group_size, budget_tier, city='Goa'):
    return cost_estimator.predict_trip_budget(
        days=days,
        group_size=group_size,
        budget_tier=budget_tier,
        city=city
    )
