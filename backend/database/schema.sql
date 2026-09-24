-- Schema for Digital Yatra Smart Tourist Companion (SQLite)

CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT DEFAULT 'TOURIST', -- TOURIST, GUIDE, ADMIN
    interests TEXT DEFAULT '',
    budget_preference TEXT DEFAULT 'Medium',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS guides (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER UNIQUE NOT NULL,
    name TEXT NOT NULL,
    city TEXT NOT NULL,
    languages TEXT NOT NULL,
    specialization TEXT NOT NULL,
    experience_years INTEGER DEFAULT 1,
    price_per_day REAL DEFAULT 800.0,
    rating REAL DEFAULT 4.8,
    availability_status TEXT DEFAULT 'AVAILABLE', -- AVAILABLE, UNAVAILABLE
    verification_status TEXT DEFAULT 'VERIFIED', -- PENDING, VERIFIED, REJECTED
    bio TEXT,
    profile_photo TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS guide_bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    booking_code TEXT UNIQUE NOT NULL,
    tourist_id INTEGER NOT NULL,
    guide_id INTEGER NOT NULL,
    destination_city TEXT NOT NULL,
    booking_date TEXT NOT NULL,
    start_time TEXT NOT NULL,
    duration_hours INTEGER DEFAULT 6,
    number_of_tourists INTEGER DEFAULT 1,
    total_price REAL NOT NULL,
    status TEXT DEFAULT 'CONFIRMED', -- PENDING, CONFIRMED, REJECTED, CANCELLED, COMPLETED
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(tourist_id) REFERENCES users(id),
    FOREIGN KEY(guide_id) REFERENCES guides(id)
);

CREATE TABLE IF NOT EXISTS destinations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    country TEXT DEFAULT 'India',
    description TEXT,
    latitude REAL NOT NULL,
    longitude REAL NOT NULL,
    category TEXT NOT NULL,
    entry_fee REAL DEFAULT 0.0,
    rating REAL DEFAULT 4.0,
    trust_status TEXT DEFAULT 'VERIFIED',
    image TEXT,
    popular INTEGER DEFAULT 1
);

CREATE TABLE IF NOT EXISTS services (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    category TEXT NOT NULL, -- Restroom, Water, Food, Hospital, Police, Transport, Stay, Attraction
    city TEXT NOT NULL,
    latitude REAL NOT NULL,
    longitude REAL NOT NULL,
    price_min REAL DEFAULT 0.0,
    price_max REAL DEFAULT 0.0,
    rating REAL DEFAULT 4.0,
    trust_status TEXT DEFAULT 'VERIFIED', -- VERIFIED, USER-REPORTED, ESTIMATED
    last_updated TEXT DEFAULT CURRENT_DATE
);

CREATE TABLE IF NOT EXISTS trips (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    destination TEXT NOT NULL,
    start_date TEXT NOT NULL,
    end_date TEXT NOT NULL,
    group_size INTEGER DEFAULT 1,
    budget REAL DEFAULT 10000.0,
    interests TEXT DEFAULT '',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS itinerary (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    trip_id INTEGER NOT NULL,
    day_number INTEGER NOT NULL,
    place_name TEXT NOT NULL,
    category TEXT NOT NULL,
    latitude REAL,
    longitude REAL,
    start_time TEXT NOT NULL,
    end_time TEXT NOT NULL,
    estimated_cost REAL DEFAULT 0.0,
    FOREIGN KEY(trip_id) REFERENCES trips(id)
);

CREATE TABLE IF NOT EXISTS reports (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    category TEXT NOT NULL, -- Sanitation, Transport, Overcharging, Safety, Road / Infrastructure, Food / Water, Other
    latitude REAL NOT NULL,
    longitude REAL NOT NULL,
    description TEXT NOT NULL,
    photo_path TEXT,
    status TEXT DEFAULT 'Under Review', -- Under Review, Verified, Resolved, Rejected
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS feedback (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    service_id INTEGER NOT NULL,
    rating REAL NOT NULL,
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id),
    FOREIGN KEY(service_id) REFERENCES services(id)
);

CREATE TABLE IF NOT EXISTS fares (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    transport_type TEXT NOT NULL, -- Taxi, Auto, Bus, Metro
    origin TEXT NOT NULL,
    destination TEXT NOT NULL,
    min_fare REAL NOT NULL,
    max_fare REAL NOT NULL,
    est_time_mins INTEGER DEFAULT 20
);

