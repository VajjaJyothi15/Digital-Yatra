from database.db import get_db

def validate_transport_fare(transport_type, origin, destination, quoted_fare):
    """
    Compare tourist quoted fare against estimated / official fare ranges.
    Returns overcharging warning if quoted_fare exceeds estimated range.
    """
    db = get_db()
    quoted = float(quoted_fare)

    # Lookup matching fare rule
    row = db.execute(
        """SELECT * FROM fares 
           WHERE LOWER(transport_type) = LOWER(?) 
             AND (LOWER(origin) LIKE ? OR LOWER(destination) LIKE ?)""",
        (transport_type, f"%{origin.lower()}%", f"%{destination.lower()}%")
    ).fetchone()

    if row:
        fare_rule = dict(row)
        min_f = fare_rule['min_fare']
        max_f = fare_rule['max_fare']
        est_time = fare_rule['est_time_mins']
    else:
        # Generic distance/time baseline estimate if specific route not in DB
        min_f = 80.0
        max_f = 160.0
        est_time = 25

    is_overcharging = quoted > max_f
    diff_amount = round(quoted - max_f, 2) if is_overcharging else 0.0

    warning_msg = None
    if is_overcharging:
        warning_msg = f"⚠️ The quoted amount of ₹{quoted:.0f} is above the estimated fare range of ₹{min_f:.0f} – ₹{max_f:.0f}."
    else:
        warning_msg = f"✓ Quoted fare of ₹{quoted:.0f} is within normal estimated fare range (₹{min_f:.0f} – ₹{max_f:.0f})."

    return {
        "transport_type": transport_type,
        "origin": origin,
        "destination": destination,
        "quoted_fare": quoted,
        "estimated_min_fare": min_f,
        "estimated_max_fare": max_f,
        "estimated_time_mins": est_time,
        "formatted_range": f"₹{min_f:.0f} – ₹{max_f:.0f}",
        "is_overcharging": is_overcharging,
        "difference_amount": diff_amount,
        "warning_message": warning_msg,
        "trust_status": "ESTIMATED"
    }
