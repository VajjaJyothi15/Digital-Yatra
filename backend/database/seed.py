import os
import sqlite3
from werkzeug.security import generate_password_hash

DB_PATH = os.path.join(os.path.dirname(__file__), 'digital_yatra.db')
SCHEMA_PATH = os.path.join(os.path.dirname(__file__), 'schema.sql')

def seed_data_if_empty(conn):
    try:
        cursor = conn.cursor()
        cursor.execute("SELECT COUNT(*) FROM destinations")
        dest_count = cursor.fetchone()[0]
        if dest_count > 0:
            return  # Database already contains destination data

        print("[DB] Database destinations table is empty. Auto-seeding initial data...")
        
        pass_hash = generate_password_hash("password123")
        admin_pass = generate_password_hash("admin123")

        # 1. Seed Users (Tourists, Guides, Admin)
        cursor.execute("SELECT COUNT(*) FROM users")
        if cursor.fetchone()[0] == 0:
            users = [
                ("Rahul Sharma", "rahul@example.com", pass_hash, "TOURIST", "History, Food, Culture", "Medium"),
                ("Priya Patel", "priya@example.com", pass_hash, "TOURIST", "Nature, Adventure, Shopping", "High"),
                ("Admin User", "admin@digitalyatra.gov.in", admin_pass, "ADMIN", "All", "High"),
                ("Ramesh Rao", "guide.ramesh@example.com", pass_hash, "GUIDE", "Spiritual, History", "Medium"),
                ("Priya Sharma", "guide.priya@example.com", pass_hash, "GUIDE", "Heritage, Culture", "Medium"),
                ("Anand Verma", "guide.anand@example.com", pass_hash, "GUIDE", "Spiritual, Culture", "Medium"),
                ("Mario D'Souza", "guide.mario@example.com", pass_hash, "GUIDE", "Adventure, Beaches", "High"),
                ("Rajesh Kumar", "guide.rajesh@example.com", pass_hash, "GUIDE", "History, Monuments", "Medium"),
                ("Sameer Khan", "guide.sameer@example.com", pass_hash, "GUIDE", "Food, Culture", "Medium")
            ]
            cursor.executemany(
                "INSERT INTO users (name, email, password_hash, role, interests, budget_preference) VALUES (?, ?, ?, ?, ?, ?)",
                users
            )

        # 2. Seed Guides Profiles
        cursor.execute("SELECT COUNT(*) FROM guides")
        if cursor.fetchone()[0] == 0:
            guides = [
                (4, "Ramesh Rao", "Tirupati", "Telugu, Hindi, English", "Spiritual & Temple Tourism", 8, 800.0, 4.9, "AVAILABLE", "VERIFIED", "Certified Tirumala Tirupati temple guide with 8 years experience in pilgrim assistance and Vedic history."),
                (5, "Priya Sharma", "Jaipur", "Hindi, English", "Heritage & Royal Palaces", 5, 1000.0, 4.8, "AVAILABLE", "VERIFIED", "Expert Rajasthan heritage guide specializing in Amer Fort, Hawa Mahal, and Pink City architecture."),
                (6, "Anand Verma", "Varanasi", "Hindi, English, Sanskrit", "Spiritual & Ghats Tour", 6, 750.0, 4.9, "AVAILABLE", "VERIFIED", "Varanasi native guide leading Evening Ganga Aarti, ancient ghat walks, and temple histories."),
                (7, "Mario D'Souza", "Goa", "English, Hindi, Konkani", "Coastal & Adventure Tourism", 7, 1200.0, 4.7, "AVAILABLE", "VERIFIED", "Licensed Goa tourist guide for beach trails, water sports, and Portuguese heritage churches."),
                (8, "Rajesh Kumar", "Delhi", "Hindi, English", "Monuments & Old Delhi Food", 10, 900.0, 4.6, "AVAILABLE", "VERIFIED", "Experienced Delhi guide for UNESCO heritage minarets, Red Fort, and Chandni Chowk street food walks."),
                (9, "Sameer Khan", "Mumbai", "English, Hindi, Marathi", "City Highlights & Coastal Walks", 4, 1100.0, 4.8, "AVAILABLE", "VERIFIED", "Mumbai local guide covering Gateway of India, Marine Drive, and Bollywood heritage spots.")
            ]
            cursor.executemany(
                """INSERT INTO guides 
                   (user_id, name, city, languages, specialization, experience_years, price_per_day, rating, availability_status, verification_status, bio)
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
                guides
            )

        # 3. Seed Destinations Across India
        destinations = [
            ("Baga Beach & Coastal Promenade", "Goa", "Goa", "India", "Famous golden sand beach known for water sports, beach shacks, seafood, and vibrant sunsets.", 15.5553, 73.7517, "Beach", 0.0, 4.8, "VERIFIED", "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=600&q=80", 1),
            ("Varkala Cliff Beach", "Varkala", "Kerala", "India", "Dramatic red laterite cliffs bordering the Arabian Sea with pristine beaches and Ayurvedic wellness spots.", 8.7379, 76.7163, "Beach", 0.0, 4.7, "VERIFIED", "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80", 1),
            ("Radhanagar Beach Havelock", "Andaman", "Andaman & Nicobar", "India", "Consistently rated among Asia's top beaches with turquoise waters, white powder sand, and lush palm fronds.", 11.9841, 92.9515, "Beach", 0.0, 4.9, "VERIFIED", "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80", 1),
            ("Gokarna Om Beach", "Gokarna", "Karnataka", "India", "Serene naturally Om-shaped beach surrounded by Western Ghats cliffs and coastal trails.", 14.5198, 74.3178, "Beach", 0.0, 4.6, "VERIFIED", "https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?auto=format&fit=crop&w=600&q=80", 1),
            ("RK Beach & Promenade", "Visakhapatnam", "Andhra Pradesh", "India", "Vibrant urban beach featuring the INS Kursura Submarine Museum, lighthouse, and seaside eateries.", 17.6868, 83.2185, "Beach", 0.0, 4.5, "VERIFIED", "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80", 1),

            ("Solang Valley & Rohtang Pass", "Manali", "Himachal Pradesh", "India", "High mountain valley offering paragliding, snow vistas, and majestic Himalayan peaks.", 32.2432, 77.1892, "Mountain", 0.0, 4.8, "VERIFIED", "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=600&q=80", 1),
            ("Leh Palace & Khardung La Pass", "Ladakh", "Ladakh", "India", "High-altitude desert mountains, Buddhist monasteries, and one of the highest motorable passes in the world.", 34.1526, 77.5771, "Mountain", 50.0, 4.9, "VERIFIED", "https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=600&q=80", 1),
            ("Kempty Falls & Gun Hill", "Mussoorie", "Uttarakhand", "India", "Queen of Hills featuring lush green mountain valleys, cable car rides, and colonial heritage.", 30.4598, 78.0644, "Mountain", 20.0, 4.6, "VERIFIED", "https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=600&q=80", 1),
            ("Tawang Monastery & Valley", "Tawang", "Arunachal Pradesh", "India", "Spectacular Himalayan mountain valley home to India's largest Buddhist monastery.", 27.5861, 91.8594, "Mountain", 0.0, 4.8, "VERIFIED", "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=600&q=80", 1),

            ("Sri Venkateswara Swamy Temple", "Tirupati", "Andhra Pradesh", "India", "World-renowned sacred hill shrine dedicated to Lord Venkateswara atop Tirumala hills.", 13.6833, 79.3500, "Religious", 0.0, 4.9, "VERIFIED", "https://images.unsplash.com/photo-1621831972820-22245b0a3944?auto=format&fit=crop&w=600&q=80", 1),
            ("Kashi Vishwanath Temple & Ghats", "Varanasi", "Uttar Pradesh", "India", "Sacred Shiva Jyotirlinga temple situated along the holy Ganga riverbank in the world's oldest city.", 25.3109, 83.0107, "Religious", 0.0, 4.9, "VERIFIED", "https://images.unsplash.com/photo-1609949279531-cf48d64bed89?auto=format&fit=crop&w=600&q=80", 1),
            ("Golden Temple (Harmandir Sahib)", "Amritsar", "Punjab", "India", "Spiritual center of Sikhism, famous for its gilded golden architecture and universal langar service.", 31.6200, 74.8765, "Religious", 0.0, 4.9, "VERIFIED", "https://images.unsplash.com/photo-1514222709107-a180c68d72b4?auto=format&fit=crop&w=600&q=80", 1),
            ("Meenakshi Amman Temple", "Madurai", "Tamil Nadu", "India", "Historic Dravidian temple complex featuring 14 towering gopurams carved with colorful deities.", 9.9195, 78.1193, "Religious", 0.0, 4.8, "VERIFIED", "https://images.unsplash.com/photo-1600100397608-f010e423b971?auto=format&fit=crop&w=600&q=80", 1),

            ("Anjuna Beach Night Markets & Clubs", "Goa", "Goa", "India", "Epicenter of Goa's trance, beach clubs, night flea markets, and live music venues.", 15.5873, 73.7423, "Party", 0.0, 4.7, "VERIFIED", "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=600&q=80", 1),
            ("Indiranagar & MG Road Nightlife Hub", "Bengaluru", "Karnataka", "India", "Pub capital of India packed with craft breweries, rooftop lounges, and live music venues.", 12.9784, 77.6408, "Party", 0.0, 4.6, "VERIFIED", "https://images.unsplash.com/photo-1572116469696-31de0f17cc34?auto=format&fit=crop&w=600&q=80", 1),
            ("Hauz Khas Village & Socials", "Delhi", "Delhi", "India", "Trendy urban nightlife destination blending medieval lake ruins with chic bars and art cafes.", 28.5494, 77.1932, "Party", 0.0, 4.5, "VERIFIED", "https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?auto=format&fit=crop&w=600&q=80", 1),
            ("Marine Drive & Bandra Promenade", "Mumbai", "Maharashtra", "India", "Iconic coastal boulevard, seaside lounges, late-night street food, and rooftop bars.", 18.9432, 72.8230, "Party", 0.0, 4.8, "VERIFIED", "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=600&q=80", 1),

            ("Amer Fort & City Palace", "Jaipur", "Rajasthan", "India", "Majestic hilltop fort built from red sandstone and marble overlooking Maota Lake.", 26.9855, 75.8513, "Royal", 100.0, 4.9, "VERIFIED", "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=600&q=80", 1),
            ("Mysore Palace", "Mysuru", "Karnataka", "India", "Indo-Saracenic royal residence illuminated by over 100,000 bulbs every weekend.", 12.3052, 76.6552, "Royal", 100.0, 4.9, "VERIFIED", "https://images.unsplash.com/photo-1600100397608-f010e423b971?auto=format&fit=crop&w=600&q=80", 1),
            ("Mehrangarh Fort & Umaid Bhawan", "Jodhpur", "Rajasthan", "India", "One of India's largest fortresses perched 400 feet above the famous Blue City.", 26.2978, 73.0184, "Royal", 200.0, 4.8, "VERIFIED", "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=600&q=80", 1),
            ("Udaipur City Palace & Lake Palace", "Udaipur", "Rajasthan", "India", "Extensive palace complex built over 400 years overlooking the serene Lake Pichola.", 24.5764, 73.6835, "Royal", 300.0, 4.9, "VERIFIED", "https://images.unsplash.com/photo-1615874959474-d609969a20ed?auto=format&fit=crop&w=600&q=80", 1),

            ("Chandni Chowk Food Walk", "Delhi", "Delhi", "India", "Legendary historic food market famous for Paranthe Wali Gali, kebabs, jalebis, and street chaat.", 28.6506, 77.2303, "Food", 0.0, 4.8, "VERIFIED", "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80", 1),
            ("Hazratganj & Chowk Street Food", "Lucknow", "Uttar Pradesh", "India", "Culinary capital celebrated for authentic Tunday Kababi, Galouti Kebabs, and Awadhi biryanis.", 26.8467, 80.9462, "Food", 0.0, 4.8, "VERIFIED", "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80", 1),
            ("Sarafa Night Food Bazaar", "Indore", "Madhya Pradesh", "India", "Jewelry market that transforms into a bustling night food street with over 100 sweet & savory stalls.", 22.7196, 75.8577, "Food", 0.0, 4.7, "VERIFIED", "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80", 1),
            ("Kashi Chat Bhandar & Malaiyyo", "Varanasi", "Uttar Pradesh", "India", "World-renowned food hub for Tamatar Chaat, Palak Chaat, Lassi, and seasonal Malaiyyo sweets.", 25.3092, 83.0080, "Food", 0.0, 4.9, "VERIFIED", "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=600&q=80", 1),

            ("Hampi Vijayanagara Ruins", "Hampi", "Karnataka", "India", "UNESCO World Heritage site featuring stone chariots, boulder landscapes, and ancient temple ruins.", 15.3350, 76.4600, "Heritage", 40.0, 4.9, "VERIFIED", "https://images.unsplash.com/photo-1600100397608-f010e423b971?auto=format&fit=crop&w=600&q=80", 1),
            ("Ajanta & Ellora Caves", "Aurangabad", "Maharashtra", "India", "Rock-cut cave monuments featuring ancient Buddhist, Hindu, and Jain cave carvings and murals.", 20.5519, 75.7033, "Heritage", 40.0, 4.8, "VERIFIED", "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=600&q=80", 1),
            ("Konark Sun Temple", "Konark", "Odisha", "India", "13th-century monumental stone chariot temple dedicated to Sun God Surya with intricate stone wheels.", 19.8876, 86.0945, "Heritage", 40.0, 4.7, "VERIFIED", "https://images.unsplash.com/photo-1596178065887-1198b6148b2b?auto=format&fit=crop&w=600&q=80", 1),
            ("Qutub Minar & Red Fort", "Delhi", "Delhi", "India", "UNESCO World Heritage sites depicting Mughal & Delhi Sultanate architectural heights.", 28.5244, 77.1855, "Heritage", 40.0, 4.7, "VERIFIED", "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=600&q=80", 1),

            ("Auli Ski Resort & Snow Slopes", "Auli", "Uttarakhand", "India", "Premier Himalayan skiing resort surrounded by Nanda Devi snow peaks and coniferous forests.", 30.5284, 79.5694, "Snow", 0.0, 4.9, "VERIFIED", "https://images.unsplash.com/photo-1548777123-e216912df7d8?auto=format&fit=crop&w=600&q=80", 1),
            ("Gulmarg Gondola & Snow Slopes", "Gulmarg", "Jammu & Kashmir", "India", "World's second-highest cable car offering breathtaking snow panoramas and winter sports.", 34.0484, 74.3805, "Snow", 100.0, 4.9, "VERIFIED", "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=600&q=80", 1),
            ("Yumthang Valley Snow Sanctuary", "Sikkim", "Sikkim", "India", "Valley of Flowers covered in glistening winter snow sheets bordered by hot springs and pine trails.", 27.8258, 88.6958, "Snow", 0.0, 4.8, "VERIFIED", "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=600&q=80", 1),

            ("Munnar Tea Gardens & Anamudi", "Munnar", "Kerala", "India", "Rolling green tea plantations, misty mountain valleys, and endangered Nilgiri Tahr wildlife.", 10.0889, 77.0595, "Nature", 0.0, 4.9, "VERIFIED", "https://images.unsplash.com/photo-1596178065887-1198b6148b2b?auto=format&fit=crop&w=600&q=80", 1),
            ("Valley of Flowers National Park", "Chamoli", "Uttarakhand", "India", "UNESCO biosphere reserve famed for endemic alpine flower meadows and serene trekking trails.", 30.7280, 79.6053, "Nature", 150.0, 4.9, "VERIFIED", "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80", 1),
            ("Coorg Coffee Estates & Brahmagiri", "Coorg", "Karnataka", "India", "Scotland of India known for aromatic coffee plantations, spice gardens, and lush rainforests.", 12.4244, 75.7382, "Nature", 0.0, 4.7, "VERIFIED", "https://images.unsplash.com/photo-1511497584788-876761c119ef?auto=format&fit=crop&w=600&q=80", 1),

            ("Dudhsagar Four-Tiered Waterfall", "Goa", "Goa", "India", "Majestic 310-meter four-tiered white waterfall cascading through Bhagwan Mahaveer Sanctuary.", 15.3144, 74.3143, "Waterfall", 50.0, 4.8, "VERIFIED", "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=600&q=80", 1),
            ("Athirappilly Niagara of India", "Thrissur", "Kerala", "India", "Largest waterfall in Kerala roaring down 80 feet through dense rainforest vegetation.", 10.2851, 76.5698, "Waterfall", 40.0, 4.8, "VERIFIED", "https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&w=600&q=80", 1),
            ("Jog Falls Gorge", "Shimoga", "Karnataka", "India", "Second-steepest plunge waterfall in India created by the Sharavathi River falling 253 meters.", 14.2268, 74.8122, "Waterfall", 20.0, 4.7, "VERIFIED", "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80", 1),

            ("Rishikesh Laxman Jhula & Rafting", "Rishikesh", "Uttarakhand", "India", "Yoga capital situated on the clear turquoise Ganga river, famous for white-water rafting and beach camps.", 30.0869, 78.2676, "River", 0.0, 4.8, "VERIFIED", "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=600&q=80", 1),
            ("Varanasi Sacred Ganga Ghats", "Varanasi", "Uttar Pradesh", "India", "Serene riverfront promenade lined with 84 ancient ghats, sunrise boat rides, and evening Ganga Aarti.", 25.3076, 83.0104, "River", 0.0, 4.9, "VERIFIED", "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=600&q=80", 1),
            ("Brahmaputra River Sunset Cruise", "Guwahati", "Assam", "India", "Mighty river flowing through Assam, offering river dolphin sightings and island monastery cruises.", 26.1445, 91.7362, "River", 200.0, 4.6, "VERIFIED", "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80", 1),

            ("Lake Pichola & Jag Mandir", "Udaipur", "Rajasthan", "India", "Picturesque artificial fresh water lake featuring heritage island palaces and romantic boat cruises.", 24.5764, 73.6835, "Lake", 0.0, 4.9, "VERIFIED", "https://images.unsplash.com/photo-1615874959474-d609969a20ed?auto=format&fit=crop&w=600&q=80", 1),
            ("Dal Lake Shikara Promenade", "Srinagar", "Jammu & Kashmir", "India", "Jewel in the crown of Kashmir featuring floating vegetable markets and wooden houseboats.", 34.1189, 74.8683, "Lake", 0.0, 4.9, "VERIFIED", "https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=600&q=80", 1),
            ("Pangong Tso High Altitude Lake", "Ladakh", "Ladakh", "India", "Endorheic lake at 4,225m altitude famous for changing colors from blue to emerald green.", 33.7595, 78.6674, "Lake", 0.0, 4.9, "VERIFIED", "https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=600&q=80", 1)
        ]
        cursor.executemany(
            """INSERT INTO destinations 
               (name, city, state, country, description, latitude, longitude, category, entry_fee, rating, trust_status, image, popular)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
            destinations
        )

        # 4. Seed Location-Specific Services Across India
        cursor.execute("SELECT COUNT(*) FROM services")
        if cursor.fetchone()[0] == 0:
            services = [
                ("Tirupati Railway Station Public Restroom", "Restroom", "Tirupati", 13.6288, 79.4192, 0.0, 5.0, 4.3, "VERIFIED", "2026-09-18"),
                ("Tirupati RTC Bus Stand Water ATM", "Water", "Tirupati", 13.6295, 79.4180, 0.0, 2.0, 4.7, "VERIFIED", "2026-09-20"),
                ("Bhimas Deluxe Andhra Vegetarian Thali", "Food", "Tirupati", 13.6310, 79.4170, 120.0, 300.0, 4.8, "VERIFIED", "2026-09-19"),
                ("Sri Venkateswara Institute of Medical Sciences (SVIMS)", "Hospital", "Tirupati", 13.6380, 79.4080, 0.0, 400.0, 4.6, "VERIFIED", "2026-09-15"),
                ("Tirupati East Police Station", "Police", "Tirupati", 13.6320, 79.4200, 0.0, 0.0, 4.5, "VERIFIED", "2026-09-12"),
                ("Tirumala Hill Shuttle Taxi & Bus Stand", "Transport", "Tirupati", 13.6290, 79.4185, 60.0, 150.0, 4.4, "VERIFIED", "2026-09-19"),
                ("Fortune Select Grand Ridge Hotel", "Stay", "Tirupati", 13.6350, 79.4100, 2500.0, 5000.0, 4.6, "VERIFIED", "2026-09-14"),

                ("Pink City Public Toilet & Restroom", "Restroom", "Jaipur", 26.9242, 75.8270, 5.0, 10.0, 3.9, "USER-REPORTED", "2026-09-16"),
                ("Jaipur Smart RO Water ATM", "Water", "Jaipur", 26.9235, 75.8262, 1.0, 5.0, 4.6, "VERIFIED", "2026-09-20"),
                ("LMB Sweets & Thali Restaurant", "Food", "Jaipur", 26.9225, 75.8250, 200.0, 700.0, 4.7, "VERIFIED", "2026-09-18"),
                ("SMS Government Hospital Jaipur", "Hospital", "Jaipur", 26.8970, 75.8150, 0.0, 300.0, 4.5, "VERIFIED", "2026-09-10"),
                ("Kotwali Police Station Jaipur", "Police", "Jaipur", 26.9250, 75.8240, 0.0, 0.0, 4.4, "VERIFIED", "2026-09-11"),
                ("Badi Chaupar Taxi & Auto Stand", "Transport", "Jaipur", 26.9245, 75.8280, 50.0, 300.0, 3.8, "ESTIMATED", "2026-09-16"),

                ("Godowlia Chowk Public Sanitation Facility", "Restroom", "Varanasi", 25.3090, 83.0085, 0.0, 5.0, 4.0, "USER-REPORTED", "2026-09-18"),
                ("Ganga Seva Water Purification Station", "Water", "Varanasi", 25.3079, 83.0100, 0.0, 0.0, 4.7, "VERIFIED", "2026-09-19"),
                ("Kashi Chat Bhandar", "Food", "Varanasi", 25.3092, 83.0080, 40.0, 150.0, 4.9, "VERIFIED", "2026-09-20"),
                ("BHU Trauma Center & Hospital", "Hospital", "Varanasi", 25.2677, 82.9913, 0.0, 400.0, 4.6, "VERIFIED", "2026-09-08"),
                ("Dashashwamedh Police Outpost", "Police", "Varanasi", 25.3075, 83.0095, 0.0, 0.0, 4.7, "VERIFIED", "2026-09-14"),

                ("Baga Beach Public Toilet & Shower", "Restroom", "Goa", 15.5558, 73.7515, 10.0, 20.0, 4.1, "VERIFIED", "2026-09-18"),
                ("Calangute Clean RO Drinking Fountain", "Water", "Goa", 15.5400, 73.7550, 0.0, 0.0, 4.6, "VERIFIED", "2026-09-19"),
                ("Souza Lobo Goan Seafood Restaurant", "Food", "Goa", 15.5490, 73.7520, 300.0, 1000.0, 4.8, "VERIFIED", "2026-09-17"),
                ("Manipal Hospital Goa", "Hospital", "Goa", 15.4650, 73.8120, 0.0, 500.0, 4.6, "VERIFIED", "2026-09-10"),
                ("Calangute Police Station", "Police", "Goa", 15.5420, 73.7600, 0.0, 0.0, 4.5, "VERIFIED", "2026-09-12"),

                ("Connaught Place Clean Public Toilet", "Restroom", "Delhi", 28.6315, 77.2167, 5.0, 10.0, 4.2, "VERIFIED", "2026-09-20"),
                ("AIIMS Hospital New Delhi", "Hospital", "Delhi", 28.5672, 77.2100, 0.0, 500.0, 4.8, "VERIFIED", "2026-09-15"),

                ("Churchgate Station Public Restroom", "Restroom", "Mumbai", 18.9350, 72.8270, 5.0, 10.0, 4.3, "VERIFIED", "2026-09-18"),
                ("KEM Hospital Parel Mumbai", "Hospital", "Mumbai", 19.0020, 72.8420, 0.0, 400.0, 4.7, "VERIFIED", "2026-09-14")
            ]
            cursor.executemany(
                """INSERT INTO services 
                   (name, category, city, latitude, longitude, price_min, price_max, rating, trust_status, last_updated)
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
                services
            )

        # 5. Seed Incident Reports
        cursor.execute("SELECT COUNT(*) FROM reports")
        if cursor.fetchone()[0] == 0:
            reports = [
                ("Water", "Water ATM malfunctioning near Tirupati RTC bus stand", 13.6295, 79.4180, None, "Under Review"),
                ("Sanitation", "Restroom clean & operational at Baga Beach Goa", 15.5558, 73.7515, None, "Verified")
            ]
            cursor.executemany(
                """INSERT INTO reports (category, description, latitude, longitude, photo_path, status)
                   VALUES (?, ?, ?, ?, ?, ?)""",
                reports
            )

        conn.commit()
        print("[SUCCESS] Auto-seeded database with 44 destinations, 6 guides, services, and users!")
    except Exception as e:
        print(f"[DB] Error in seed_data_if_empty: {e}")

def seed_database():
    tourism_path = os.path.join(os.path.dirname(__file__), 'tourism.db')
    if os.path.exists(tourism_path):
        try:
            os.remove(tourism_path)
        except Exception:
            pass

    if os.path.exists(DB_PATH):
        try:
            os.remove(DB_PATH)
            print(f"[REMOVED] Existing database: {DB_PATH}")
        except Exception as e:
            print(f"[NOTICE] Could not remove existing DB file: {e}")

    conn = sqlite3.connect(DB_PATH)
    seed_data_if_empty(conn)
    conn.close()

if __name__ == '__main__':
    seed_database()


if __name__ == '__main__':
    seed_database()
