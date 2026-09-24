class CostEstimatorModel:
    def __init__(self):
        # Base daily estimates per person in INR
        self.base_costs = {
            'Low': {'stay': 800, 'food': 400, 'transport': 250, 'activities': 200},
            'Medium': {'stay': 1800, 'food': 800, 'transport': 500, 'activities': 500},
            'High': {'stay': 4000, 'food': 1800, 'transport': 1200, 'activities': 1200}
        }

    def predict_trip_budget(self, days, group_size=1, budget_tier='Medium', city='Hyderabad'):
        """
        Estimate trip expenses for stay, food, transport, and activities.
        Returns range estimate with detailed breakdown.
        """
        days = max(1, int(days))
        group_size = max(1, int(group_size))
        tier = budget_tier if budget_tier in self.base_costs else 'Medium'

        rates = self.base_costs[tier]
        
        # Calculate base components
        stay_cost = rates['stay'] * days * math.ceil(group_size / 2.0)  # Assuming twin sharing rooms
        food_cost = rates['food'] * days * group_size
        transport_cost = rates['transport'] * days * math.ceil(group_size / 3.0)
        activity_cost = rates['activities'] * days * group_size
        misc_cost = int((stay_cost + food_cost + transport_cost + activity_cost) * 0.1)

        total_base = stay_cost + food_cost + transport_cost + activity_cost + misc_cost
        
        min_total = int(total_base * 0.9)
        max_total = int(total_base * 1.15)

        return {
            "days": days,
            "group_size": group_size,
            "budget_tier": tier,
            "breakdown": {
                "accommodation": stay_cost,
                "food": food_cost,
                "transport": transport_cost,
                "activities": activity_cost,
                "miscellaneous": misc_cost
            },
            "estimated_total_min": min_total,
            "estimated_total_max": max_total,
            "formatted_range": f"₹{min_total:,} – ₹{max_total:,}"
        }

import math
cost_estimator = CostEstimatorModel()
