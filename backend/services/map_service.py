from database.db import get_db

def get_map_markers(city=None, category=None):
    """
    Get map markers for destinations, restrooms, water points, hospitals, police, transport.
    """
    db = get_db()
    
    # Query services
    service_query = "SELECT id, name, category, city, latitude, longitude, rating, trust_status FROM services WHERE 1=1"
    service_params = []
    if city:
        service_query += " AND LOWER(city) = LOWER(?)"
        service_params.append(city)
    if category:
        service_query += " AND LOWER(category) = LOWER(?)"
        service_params.append(category)

    service_rows = db.execute(service_query, service_params).fetchall()
    markers = [dict(s) for s in service_rows]

    # Query destinations if category is Attraction or All
    if not category or category.lower() in ['attraction', 'all']:
        dest_query = "SELECT id, name, 'Attraction' as category, city, latitude, longitude, rating, trust_status FROM destinations WHERE 1=1"
        dest_params = []
        if city:
            dest_query += " AND LOWER(city) = LOWER(?)"
            dest_params.append(city)

        dest_rows = db.execute(dest_query, dest_params).fetchall()
        markers.extend([dict(d) for d in dest_rows])

    return markers
