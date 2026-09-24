from utils.distance import haversine_distance

class RouteOptimizer:
    def __init__(self):
        self.time_slots = [
            ("09:00", "11:00"),
            ("11:30", "13:30"),
            ("14:00", "16:00"),
            ("16:30", "18:30"),
            ("19:00", "21:00")
        ]

    def optimize_day_schedule(self, places, start_lat=None, start_lng=None):
        """
        Sort places by spatial proximity and assign time slots.
        """
        if not places:
            return []

        remaining = list(places)
        ordered = []
        curr_lat = start_lat if start_lat else remaining[0].get('latitude')
        curr_lng = start_lng if start_lng else remaining[0].get('longitude')

        while remaining:
            best_idx = 0
            best_dist = float('inf')
            for i, p in enumerate(remaining):
                d = haversine_distance(curr_lat, curr_lng, p.get('latitude'), p.get('longitude'))
                if d < best_dist:
                    best_dist = d
                    best_idx = i

            next_place = remaining.pop(best_idx)
            ordered.append(next_place)
            if next_place.get('latitude') and next_place.get('longitude'):
                curr_lat = next_place['latitude']
                curr_lng = next_place['longitude']

        # Assign time slots
        scheduled = []
        for idx, place in enumerate(ordered):
            slot_idx = idx % len(self.time_slots)
            start_t, end_t = self.time_slots[slot_idx]
            scheduled.append({
                "place_name": place.get('name', 'Attraction Spot'),
                "category": place.get('category', 'Sightseeing'),
                "latitude": place.get('latitude'),
                "longitude": place.get('longitude'),
                "start_time": start_t,
                "end_time": end_t,
                "estimated_cost": place.get('entry_fee', 0.0),
                "rating": place.get('rating', 4.5),
                "trust_status": place.get('trust_status', 'VERIFIED')
            })

        return scheduled

route_optimizer = RouteOptimizer()
