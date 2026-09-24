import math

def haversine_distance(lat1, lon1, lat2, lon2):
    """
    Calculate the great circle distance between two points 
    on the earth (specified in decimal degrees).
    Returns distance in kilometers.
    """
    if lat1 is None or lon1 is None or lat2 is None or lon2 is None:
        return float('inf')
        
    try:
        lat1, lon1, lat2, lon2 = map(float, [lat1, lon1, lat2, lon2])
    except (ValueError, TypeError):
        return float('inf')

    # Radius of earth in kilometers
    R = 6371.0

    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    
    a = (math.sin(dlat / 2.0) ** 2 +
         math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) *
         math.sin(dlon / 2.0) ** 2)
         
    c = 2.0 * math.atan2(math.sqrt(a), math.sqrt(1.0 - a))
    distance = R * c
    
    return round(distance, 2)

def format_distance(dist_km):
    """
    Format distance for display (e.g. 300 m vs 1.5 km).
    """
    if dist_km < 1.0:
        return f"{int(dist_km * 1000)} m"
    return f"{dist_km:.1f} km"
