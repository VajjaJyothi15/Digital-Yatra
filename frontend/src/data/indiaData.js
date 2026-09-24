// Complete Database of 28 States & 8 Union Territories of India
// Includes Top 10 Visiting Places, Famous Food, Culture, Temples & Traditional Clothes for every region.

export const INDIA_STATES_AND_UTS = {
  // ================= 28 STATES =================
  "Andhra Pradesh": {
    type: "State",
    capital: "Amaravati",
    famousFood: "Hyderabadi/Andhra Biryani, Pesarattu, Gongura Pachadi, Pootharekulu, Ulavacharu",
    culture: "Kuchipudi classical dance, Sankranti & Ugadi festivals, Kalamkari textile art",
    famousTemples: "Sri Venkateswara Temple (Tirupati), Kanaka Durga (Vijayawada), Simhachalam, Srisailam Mallikarjuna",
    traditionalClothes: "Dharmavaram & Mangalagiri Silk Sarees, Pancha (Dhoti) with Kanduva",
    places: [
      { rank: 1, name: "Sri Venkateswara Temple", city: "Tirupati", cat: "World Famous Pilgrimage", desc: "Sacred hill shrine atop Seshachalam hills attracting millions of global pilgrims.", history: "Patronized by Chola, Hoysala, and Vijayanagara kings since 4th century CE." },
      { rank: 2, name: "RK Beach & Submarine Museum", city: "Visakhapatnam", cat: "Naval Museum & Coast", desc: "Scenic ocean promenade featuring real Soviet-built INS Kursura Submarine Museum.", history: "Visakhapatnam grew into India's primary Eastern Naval Command hub." },
      { rank: 3, name: "Araku Valley & Borra Caves", city: "Visakhapatnam", cat: "Hill Station & Caves", desc: "Picturesque hill station with coffee plantations, tribal culture, and million-year limestone caves.", history: "Borra Caves were discovered by British geologist William King in 1807." },
      { rank: 4, name: "Kanaka Durga Temple", city: "Vijayawada", cat: "Sacred Hill Temple", desc: "Revered temple set on Indrakeeladri Hill overlooking Krishna River.", history: "Mentioned in ancient scriptures as the site of Goddess Durga's victory." },
      { rank: 5, name: "Belum Caves", city: "Kurnool", cat: "Subterranean Caves", desc: "Second largest cave system in the Indian subcontinent with underground passages.", history: "Formed over millions of years by underground water currents." },
      { rank: 6, name: "Rushikonda Blue Flag Beach", city: "Visakhapatnam", cat: "Water Sports Beach", desc: "Blue Flag certified golden sand beach popular for sea kayaking and jet skiing.", history: "Renowned as one of India's cleanest and safest recreational beaches." },
      { rank: 7, name: "Lepakshi Veerabhadra Temple", city: "Anantapur", cat: "Vijayanagara Sculpture", desc: "16th-century temple famous for hanging pillar, monolithic Nandi, and ceiling murals.", history: "Built by Virupanna and Veeranna brothers during King Achyutaraya's reign." },
      { rank: 8, name: "Chandragiri Fort & Palaces", city: "Tirupati", cat: "Vijayanagara Capital Fort", desc: "11th-century fort complex featuring Raja and Rani Palaces and light shows.", history: "Served as the final capital of the Vijayanagara Empire." },
      { rank: 9, name: "Simhachalam Temple", city: "Visakhapatnam", cat: "Ancient Cave Shrine", desc: "Hilltop temple dedicated to Lord Narasimha covered in sandal paste round the year.", history: "Built in 11th century with architectural inscriptions from Chola and Gajapati kings." },
      { rank: 10, name: "Talakona Waterfalls & Bio Reserve", city: "Chittoor", cat: "Highest State Waterfall", desc: "Highest waterfall in Andhra Pradesh (270 ft) surrounded by dense bio-reserve trails.", history: "Gateway to Sri Venkateswara National Park flora and fauna." }
    ]
  },
  "Arunachal Pradesh": {
    type: "State",
    capital: "Itanagar",
    famousFood: "Bamboo Shoot delicacy, Thukpa, Lukter, Pehak, Dung Po (Steamed Rice)",
    culture: "Bardo Chham dance, Losar & Solung tribal festivals, Monpa wood carving",
    famousTemples: "Tawang Monastery, Parasuram Kund, Golden Pagoda (Namsai), Malinithan",
    traditionalClothes: "Gale (wraparound skirt), Monpa coats, Apatani woven shawls",
    places: [
      { rank: 1, name: "Tawang Monastery", city: "Tawang", cat: "Buddhist Monastery", desc: "Largest Buddhist monastery in India situated at 10,000 feet altitude.", history: "Founded by Merak Lama Lodre Gyatso in 1680 AD." },
      { rank: 2, name: "Sela Pass & Sela Lake", city: "Tawang", cat: "High Altitude Pass", desc: "Snow-covered mountain pass at 13,700 feet with crystal frozen lakes.", history: "Named after Sela, a local Monpa girl who assisted Indian soldiers in 1962 war." },
      { rank: 3, name: "Ziro Valley", city: "Lower Subansiri", cat: "UNESCO World Heritage Site", desc: "Picturesque valley famous for Apatani tribal culture and annual music festival.", history: "Home to the unique Apatani tribe known for sustainable paddy-fish farming." },
      { rank: 4, name: "Namdapha National Park", city: "Changlang", cat: "Biodiversity Hotspot", desc: "4th largest national park in India harboring snow leopards, cloud leopards and tigers.", history: "Declared a National Park and Tiger Reserve in 1983." },
      { rank: 5, name: "Golden Pagoda (Sangken)", city: "Namsai", cat: "Theravada Monastery", desc: "Stunning Burmese-style golden pagoda complex set amidst peaceful gardens.", history: "Consecrated in 2010, major center for Sangken water festival." },
      { rank: 6, name: "Itanagar Fort (Ita Fort)", city: "Itanagar", cat: "Historic Brick Fort", desc: "Irregular-shaped historic fort built with over 8 million ancient bricks.", history: "Built by Chutia dynasty rulers in 14th-15th century." },
      { rank: 7, name: "Bomdila Monastery & Viewpoint", city: "Bomdila", cat: "Monastery & Himalayas", desc: "Scenic mountain town offering views of Kangto and Gorichen snow peaks.", history: "Established in 1965 belonging to the Mahayana pantheon." },
      { rank: 8, name: "Parasuram Kund", city: "Lohit", cat: "Sacred Pilgrimage", desc: "Holy pilgrimage site on the lower reaches of Lohit River.", history: "Revered in Hindu lore where sage Parasuram washed away his sins." },
      { rank: 9, name: "Roing & Mehao Lake", city: "Lower Dibang Valley", cat: "Valley & High Lake", desc: "Serene mountain lake surrounded by virgin evergreen rainforests.", history: "Ancient settlement region of the Idu Mishmi tribe." },
      { rank: 10, name: "Dirang Valley & Hot Springs", city: "Dirang", cat: "Valley & Thermal Springs", desc: "Picturesque valley known for kiwi orchards, sheep breeding farms, and natural hot springs.", history: "Historic stopover along the ancient Tibet trade route." }
    ]
  },
  "Assam": {
    type: "State",
    capital: "Dispur",
    famousFood: "Masor Tenga (Sour Fish Curry), Assam Tea, Pitha, Khaar, Duck Meat Curry",
    culture: "Bihu Folk Dance, Rongali Bihu festival, Sattriya classical dance",
    famousTemples: "Kamakhya Devi Temple (Guwahati), Umananda Island Temple, Navagraha",
    traditionalClothes: "Muga Silk Mekhela Chador for women, Suria & Seleng for men",
    places: [
      { rank: 1, name: "Kaziranga National Park", city: "Golaghat", cat: "UNESCO World Heritage", desc: "World famous sanctuary home to two-thirds of the world's Great One-horned Rhinoceroses.", history: "Created in 1905 under Mary Curzon's initiative." },
      { rank: 2, name: "Kamakhya Devi Temple", city: "Guwahati", cat: "Sacred Shakti Peeth", desc: "Revered hilltop temple atop Nilachal hill celebrated during Ambubachi Mela.", history: "One of the oldest of 51 Shakti Peethas dating back to 8th century." },
      { rank: 3, name: "Majuli River Island", city: "Jorhat", cat: "World's Largest River Island", desc: "World's largest river island in the Brahmaputra River, cultural heart of Neo-Vaishnavite Satras.", history: "Formed by Brahmaputra course changes in 1750." },
      { rank: 4, name: "Manas National Park", city: "Barpeta", cat: "UNESCO Elephant Reserve", desc: "UNESCO sanctuary known for rare golden langurs and pygmy hogs.", history: "Declared a World Heritage Site in Danger in 1992, restored in 2011." },
      { rank: 5, name: "Sivasagar Ahom Palaces & Tanks", city: "Sivasagar", cat: "Ahom Dynasty Capital", desc: "Historic royal city featuring Rang Ghar amphitheater, Talatal Ghar, and Joysagar tank.", history: "Capital of the Ahom Kingdom which ruled Assam for 600 years." },
      { rank: 6, name: "Umananda Peacock Island", city: "Guwahati", cat: "Smallest Inhabited Island", desc: "Smallest inhabited river island in the world housing an ancient Shiva temple.", history: "Temple constructed in 1694 by Ahom King Gadadhar Singha." },
      { rank: 7, name: "Hajo Pilgrimage Center", city: "Kamrup", cat: "Multi-Faith Pilgrimage", desc: "Unique ancient center sacred to Hindus (Hayagriva Madhava), Muslims (Powa Mecca), and Buddhists.", history: "Harmonious pilgrimage site active since 12th century." },
      { rank: 8, name: "Haflong Hill Station", city: "Dima Hasao", cat: "Only Hill Station of Assam", desc: "Scenic town known as 'Switzerland of the East' with blue hills and orchid gardens.", history: "Developed during British railway expansion into Assam." },
      { rank: 9, name: "Orang National Park", city: "Darrang", cat: "Mini Kaziranga", desc: "Sanctuary along the north bank of Brahmaputra featuring tigers, rhinos, and migratory birds.", history: "Established as a game reserve in 1915." },
      { rank: 10, name: "Tezpur Cultural Capital", city: "Sonitpur", cat: "City of Eternal Romance", desc: "Historic town known for Agnigarh hill park, Cole Park, and ancient stone ruins.", history: "Associated with the mythological love story of Usha and Aniruddha." }
    ]
  },
  "Bihar": {
    type: "State",
    capital: "Patna",
    famousFood: "Litti Chokha, Sattu Paratha, Khaja (Silao), Thekua, Tilkut",
    culture: "Chhath Puja festival, Madhubani (Mithila) painting art, Bidesia folk theatre",
    famousTemples: "Mahabodhi Temple (Bodh Gaya), Vishnupad (Gaya), Mahavir Mandir, Jal Mandir (Pawapuri)",
    traditionalClothes: "Bhagalpuri Silk Sarees, Dhoti-Kurta with Gamchha",
    places: [
      { rank: 1, name: "Mahabodhi Temple Complex", city: "Bodh Gaya", cat: "UNESCO World Heritage", desc: "Sacred temple complex marking the exact spot where Lord Buddha attained Enlightenment under the Bodhi Tree.", history: "First built by Emperor Ashoka in 3rd century BCE." },
      { rank: 2, name: "Nalanda Mahavihara Ruins", city: "Nalanda", cat: "UNESCO Ancient University", desc: "Ruins of the world's first residential international university that housed 10,000 students.", history: "Flourished from 5th century CE under Gupta and Pala dynasties." },
      { rank: 3, name: "Vishnupad Temple & Ghats", city: "Gaya", cat: "Sacred Ancestral Shrine", desc: "Revered temple featuring 40cm footprint of Lord Vishnu stamped in solid basalt rock.", history: "Rebuilt in 1787 by Queen Ahilyabai Holkar of Indore." },
      { rank: 4, name: "Vikramshila University Ruins", city: "Bhagalpur", cat: "Ancient Learning Center", desc: "Historic Buddhist university ruins founded as a major center for Tantric Buddhism.", history: "Established by Pala King Dharmapala in 8th century." },
      { rank: 5, name: "Pawapuri Jal Mandir", city: "Nalanda", cat: "Jain Sacred Shrine", desc: "White marble temple built in the middle of a lotus tank where Lord Mahavira attained Nirvana.", history: "Built by King Nandivardhana, elder brother of Lord Mahavira." },
      { rank: 6, name: "Takht Sri Harmandir Sahib", city: "Patna", cat: "Sacred Sikh Takht", desc: "One of the 5 Takhts of Sikhism, marking the birthplace of Guru Gobind Singh Ji.", history: "Built by Maharaja Ranjit Singh in memory of 10th Sikh Guru." },
      { rank: 7, name: "Sher Shah Suri Tomb", city: "Sasaram", cat: "Indo-Islamic Tomb", desc: "Red sandstone octagonal tomb standing in the middle of an artificial lake.", history: "Designed by Aliwal Khan and built between 1540 and 1545." },
      { rank: 8, name: "Kesaria Stupa", city: "East Champaran", cat: "Tallest Buddhist Stupa", desc: "Tallest Buddhist stupa in the world (104 feet high), surrounded by green fields.", history: "Discovered by ASI in 1998, dates back to Ashokan era." },
      { rank: 9, name: "Valmiki Tiger Reserve", city: "West Champaran", cat: "National Park", desc: "Only tiger reserve in Bihar situated along the Indo-Nepal border on Gandak River.", history: "Established in 1989 inside dense Sal forests." },
      { rank: 10, name: "Vaishali Ancient City", city: "Vaishali", cat: "World's First Republic", desc: "Historic birthplace of Lord Mahavira and site of Buddha's last sermon.", history: "Capital of Licchavi republic, the world's earliest democracy." }
    ]
  },
  "Chhattisgarh": {
    type: "State",
    capital: "Raipur",
    famousFood: "Chila, Farra, Muthia, Aamat, Bafauri, Dubki Kadi",
    culture: "Bastar Dussehra (75-day festival), Panthi & Raut Nacha folk dances, Bell Metal Dhokra craft",
    famousTemples: "Bhoramdeo Temple, Danteshwari Temple (Dantewada), Bambleshwari (Dongargarh)",
    traditionalClothes: "Kosa Silk Sarees, Tribal beaded jewelry and cotton dhotis",
    places: [
      { rank: 1, name: "Chitrakote Waterfalls", city: "Bastar", cat: "Niagara of India", desc: "Widest waterfall in India (300 meters wide) cascading over Indravati River cliffs.", history: "Iconic natural wonder changing color according to season." },
      { rank: 2, name: "Bhoramdeo Temple Complex", city: "Kabirdham", cat: "Khajuraho of Chhattisgarh", desc: "11th-century carved stone temple complex dedicated to Lord Shiva amidst Maikal hills.", history: "Built by King Ramachandra of Nagavanshi Dynasty in 1089 AD." },
      { rank: 3, name: "Danteshwari Temple", city: "Dantewada", cat: "Sacred Shakti Peeth", desc: "600-year-old temple dedicated to Goddess Danteshwari, patron deity of Bastar.", history: "Built in 14th century by Kakatiya Kings." },
      { rank: 4, name: "Kanger Valley National Park & Kutumsar Cave", city: "Bastar", cat: "National Park & Caves", desc: "Dense park housing Kutumsar subterranean caves with blind cavefish.", history: "Kutumsar Cave discovered by geography professor Dr. H.L. Shukla in 1950s." },
      { rank: 5, name: "Sirpur Heritage Site", city: "Mahasamund", cat: "Ancient Temple Ruins", desc: "Archaeological riverfront site featuring 7th-century Lakshmana brick temple.", history: "Capital of Somavamshi kings visited by Xuanzang in 639 CE." },
      { rank: 6, name: "Mainpat Hill Station", city: "Surguja", cat: "Shimla of Chhattisgarh", desc: "High plateau hill resort featuring Dhakpo Monastery and bouncing soil (Jaljali).", history: "Settled by Tibetan refugees in 1962." },
      { rank: 7, name: "Dongargarh Maa Bambleshwari Temple", city: "Rajnandgaon", cat: "Hilltop Shrine", desc: "Revered hilltop temple at 1,600 feet altitude accessible by ropeway.", history: "Founded by King Vikramaditya over 2,000 years ago." },
      { rank: 8, name: "Tirathgarh Waterfalls", city: "Bastar", cat: "Block Waterfall", desc: "300-foot multi-tiered waterfall inside Kanger Valley National Park.", history: "Cascades over steps of white rocks inside pristine forest." },
      { rank: 9, name: "Achanakmar Tiger Reserve", city: "Mungeli", cat: "Biosphere Reserve", desc: "Part of Amarkantak Biosphere Reserve home to tigers, leopards, and gaur.", history: "Declared a sanctuary in 1975 and Tiger Reserve in 2009." },
      { rank: 10, name: "Raipur Marine Drive (Telibandha)", city: "Raipur", cat: "Urban Waterfront", desc: "Vibrant city lake promenade with giant national flag and cultural street shows.", history: "Developed as Raipur's premier urban recreational center." }
    ]
  },
  "Goa": {
    type: "State",
    capital: "Panaji",
    famousFood: "Goan Fish Curry Rice, Bebinca, Pork Vindaloo, Chicken Xacuti, Feni",
    culture: "Shigmo & Carnival festivals, Dekhni & Fugdi folk dances, Indo-Portuguese music",
    famousTemples: "Shanta Durga Temple (Ponda), Mangueshi Temple, Tambdi Surla Mahadev",
    traditionalClothes: "Kunbi Saree, Casual beachwear & Indo-Portuguese shirts",
    places: [
      { rank: 1, name: "Baga & Calangute Coast", city: "North Goa", cat: "Beach & Water Sports", desc: "Bustling coastline famous for water sports, beach shacks, seafood thalis, and sunset walks.", history: "Evolved from quiet fishing villages into India's premier beach tourism coastline." },
      { rank: 2, name: "Fort Aguada & Lighthouse", city: "Candolim", cat: "Historical Portuguese Fort", desc: "17th-century Portuguese fortress and lighthouse guarding the Mandovi River mouth.", history: "Built in 1612 to protect against Dutch invaders and replenish fresh water for ships." },
      { rank: 3, name: "Basilica of Bom Jesus", city: "Old Goa", cat: "UNESCO Baroque Church", desc: "UNESCO World Heritage church housing the mortal remains of St. Francis Xavier.", history: "Consecrated in 1605, it is a landmark of Jesuit architecture in Asia." },
      { rank: 4, name: "Dudhsagar Waterfalls", city: "Sanguem", cat: "Scenic Waterfall", desc: "Four-tiered milk-white cascade tucked inside Bhagwan Mahavir Wildlife Sanctuary.", history: "Named 'Sea of Milk' due to the foamy white water crashing down 310 meters." },
      { rank: 5, name: "Anjuna & Vagator Sunset Coast", city: "Anjuna", cat: "Cliff Beach & Night Market", desc: "Iconic coastal enclave known for red cliff sunset points and flea market heritage.", history: "Famous since 1960s as a haven for international bohemian travelers and artists." },
      { rank: 6, name: "Fontainhas Latin Quarter", city: "Panaji", cat: "Portuguese Heritage Street", desc: "Heritage neighborhood featuring vibrant yellow, green, and blue Portuguese villas and bakeries.", history: "Founded in late 18th century by Antonio Joao de Sequeira." },
      { rank: 7, name: "Palolem & Colva Scenic Beaches", city: "South Goa", cat: "Quiet Pristine Beach", desc: "Crescent-shaped serene beach backed by coconut palms and calm swimming waters.", history: "Traditional South Goa fishing haven celebrated for eco-friendly beach huts." },
      { rank: 8, name: "Chapora Fort (Dil Chahta Hai Fort)", city: "Vagator", cat: "Hilltop Ruin Viewpoint", desc: "Historic fort ruin overlooking the Chapora River and Arabian Sea coast.", history: "Built by Muslim ruler Adil Shah and rebuilt by Portuguese in 1717." },
      { rank: 9, name: "Sahakari Spice Plantation", city: "Ponda", cat: "Eco-Tourism & Spices", desc: "Lush tropical plantation offering guided spice tours, traditional thalis, and elephant baths.", history: "Showcases Goa's 400-year-old spice trading tradition." },
      { rank: 10, name: "Reis Magos Fort & Mandovi Cruise", city: "Reis Magos", cat: "Restored Fort & River Cruise", desc: "Restored riverfront fortress offering sunset cruises along the Mandovi River.", history: "Built in 1551 as a defense outpost for the Portuguese Viceroy." }
    ]
  },
  "Gujarat": {
    type: "State",
    capital: "Gandhinagar",
    famousFood: "Dhokla, Khandvi, Undhiyu, Gujarati Thali, Fafda Jalebi, Dabeli",
    culture: "Garba & Dandiya Raas dance, Navratri festival (9 nights), Patola weaving & Bandhani art",
    famousTemples: "Somnath Temple, Dwarkadhish Temple, Sun Temple (Modhera), Ambaji Temple",
    traditionalClothes: "Chaniya Choli with Bandhani Dupatta, Kediyu & Khedut Kurta",
    places: [
      { rank: 1, name: "Statue of Unity", city: "Kevadia / Ekta Nagar", cat: "World's Tallest Statue", desc: "Colossal 182-meter statue of Sardar Vallabhbhai Patel overlooking Narmada Dam.", history: "Inaugurated in 2018, standing twice the height of Statue of Liberty." },
      { rank: 2, name: "Rann of Kutch & White Desert", city: "Kutch", cat: "White Salt Desert", desc: "World's largest salt desert famous for Rann Utsav cultural festival and starlit night views.", history: "Former arm of the Arabian Sea that dried up due to geological shifts." },
      { rank: 3, name: "Somnath Jyotirlinga Temple", city: "Veraval", cat: "First Jyotirlinga Shrine", desc: "Sacred oceanfront Shiva temple rebuilt 16 times throughout history.", history: "First among the 12 holy Jyotirlinga shrines, rebuilt in 1951 by Sardar Patel." },
      { rank: 4, name: "Gir National Park", city: "Junagadh", cat: "Asiatic Lion Sanctuary", desc: "Only natural habitat of the endangered Asiatic Lion in the entire world.", history: "Protected since 1900 by Nawab of Junagadh; sanctuary formed in 1965." },
      { rank: 5, name: "Sabarmati Ashram", city: "Ahmedabad", cat: "Mahatma Gandhi Heritage", desc: "Historic ashram on Sabarmati river banks from where Mahatma Gandhi launched Dandi March.", history: "Established in 1917 as Gandhi's primary residence for 12 years." },
      { rank: 6, name: "Dwarkadhish Temple", city: "Dwarka", cat: "Char Dham Shrine", desc: "5-story 72-pillar ancient temple dedicated to Lord Krishna on Gomti River mouth.", history: "Believed to be built by Vajranabha over Krishna's original residence." },
      { rank: 7, name: "Rani ki Vav Stepwell", city: "Patan", cat: "UNESCO Stepwell Wonder", desc: "Subterranean 7-tiered stepwell adorned with 1,500 masterfully carved sculptures.", history: "Constructed in 1063 AD by Queen Udayamati in memory of King Bhima I." },
      { rank: 8, name: "Sun Temple", city: "Modhera", cat: "Solanki Architecture", desc: "11th-century temple complex designed so first rays of rising sun illuminate the deity.", history: "Built in 1026 AD by King Bhima I of the Solanki dynasty." },
      { rank: 9, name: "Champaner-Pavagadh Park", city: "Panchmahal", cat: "UNESCO Heritage Park", desc: "Archaeological park featuring Hindu fort fortress and 16th-century Jama Masjid.", history: "Capital of Gujarat Sultanate built by Mahmud Begada." },
      { rank: 10, name: "Lothal Harappan Ruins", city: "Ahmedabad District", cat: "Ancient Indus Valley Port", desc: "5,000-year-old Indus Valley Civilization port city featuring world's oldest dockyard.", history: "Discovered by ASI in 1954, dating back to 2400 BCE." }
    ]
  },
  "Haryana": {
    type: "State",
    capital: "Chandigarh",
    famousFood: "Bajra Khichdi, Kachri ki Sabzi, Bathua Raita, Churma, Hara Dhania Cholia",
    culture: "Dhamal & Phag folk dances, Surajkund International Crafts Mela, Teej festival",
    famousTemples: "Brahma Sarovar (Kurukshetra), Mansa Devi (Panchkula), Sheetla Mata (Gurugram)",
    traditionalClothes: "Daaman (heavy pleated skirt), Kurti & Chunder, Dhoti-Kurta with Pagri",
    places: [
      { rank: 1, name: "Brahma Sarovar & Jyotisar", city: "Kurukshetra", cat: "Epic Mahabharata Site", desc: "Sacred holy water tank and exact spot where Lord Krishna delivered the Bhagavad Gita.", history: "Mentioned in Mahabharata epic as holy water body excavated by King Kuru." },
      { rank: 2, name: "Kingdom of Dreams & CyberHub", city: "Gurugram", cat: "Modern Entertainment", desc: "India's premier live entertainment theater complex and food hub.", history: "Opened in 2010 showcasing Bollywood musicals and state pavilions." },
      { rank: 3, name: "Sultanpur National Park", city: "Gurugram", cat: "Bird Sanctuary", desc: "RAMSAR wetland sanctuary hosting over 250 species of resident and migratory birds.", history: "Declared a National Park in 1991 through Peter Jackson's birding efforts." },
      { rank: 4, name: "Yadavindra Gardens (Pinjore)", city: "Panchkula", cat: "17th Century Mughal Garden", desc: "7-terraced Mughal garden featuring fountains, palaces, and Japanese gardens.", history: "Designed by Fadai Khan, foster brother of Emperor Aurangzeb, in 17th century." },
      { rank: 5, name: "Mansa Devi Temple", city: "Panchkula", cat: "Sacred Shakti Shrine", desc: "Revered hilltop temple dedicated to Goddess Mansa Devi in Bilaspur village.", history: "Built by Maharaja Gopal Singh of Manimajra between 1811 and 1815." },
      { rank: 6, name: "Surajkund Lake & Mela Grounds", city: "Faridabad", cat: "10th Century Amphitheater", desc: "Reservoir with stepped sun-amphitheater host to the world's largest crafts fair.", history: "Built by King Suraj Pal of Tomar Dynasty in 10th century." },
      { rank: 7, name: "Karna Lake", city: "Karnal", cat: "Historic Lake Park", desc: "Landscaped lake named after Mahabharata hero Karna who donated gold here.", history: "Associated with King Karna who bathed here daily in Mahabharata lore." },
      { rank: 8, name: "Damdama Lake", city: "Gurugram", cat: "Natural Lake & Adventure", desc: "Sprawling lake at the foot of Aravali hills popular for boating and rock climbing.", history: "Formed in 1947 when British constructed a rain harvesting dam." },
      { rank: 9, name: "Star Monument (Radhaswami)", city: "Bhiwani", cat: "Architectural Wonder", desc: "Star-shaped hexagonal building constructed without pillar supports.", history: "Housed in Param Sant Tara Chand Ji Maharaj ashram complex." },
      { rank: 10, name: "Tilyar Lake & Zoo", city: "Rohtak", cat: "Recreation & Lake", desc: "132-acre green lake complex featuring mini zoo, toy train, and boating.", history: "Premier weekend getaway destination developed by Haryana Tourism." }
    ]
  },
  "Himachal Pradesh": {
    type: "State",
    capital: "Shimla",
    famousFood: "Dham (Traditional Feast), Siddu, Madra, Chha Gosht, Babru, Mittha",
    culture: "Nati folk dance (Guinness record), Kullu Dussehra, Himachali cap (Topi) heritage",
    famousTemples: "Hadimba Temple (Manali), Jwala Ji (Kangra), Baijnath Shiva Temple, Chintpurni",
    traditionalClothes: "Phattan & Chola with Himachali Topi, Pattu woolen shawls",
    places: [
      { rank: 1, name: "Rohtang Pass & Solang Valley", city: "Manali", cat: "Snow Pass & Adventure", desc: "Snow-bound mountain pass at 13,050 ft offering paragliding, skiing, and ATV rides.", history: "Ancient trade pass connecting Kullu valley to Lahaul and Spiti." },
      { rank: 2, name: "Mall Road & Jakhoo Temple", city: "Shimla", cat: "Colonial Capital & Ridge", desc: "Pedestrian colonial street flanked by Tudor architecture, Christ Church, and giant Hanuman statue.", history: "Summer Capital of British India from 1864 to 1947." },
      { rank: 3, name: "McLeod Ganj & Dalai Lama Temple", city: "Dharamshala", cat: "Little Lhasa & Buddhism", desc: "Residence of His Holiness the 14th Dalai Lama and Tibetan Government in Exile.", history: "Established as Tibetan exile headquarters in 1960." },
      { rank: 4, name: "Hadimba Devi Temple", city: "Manali", cat: "Ancient Wooden Pagoda", desc: "4-tiered wooden pagoda temple set inside ancient Dhungri Van Vihar cedar forest.", history: "Built in 1553 AD by Maharaja Bahadur Singh." },
      { rank: 5, name: "Spiti Valley & Key Monastery", city: "Lahaul-Spiti", cat: "Cold Desert Mountain", desc: "High altitude cold desert valley featuring 1,000-year-old Key Gompa monastery.", history: "Key Monastery founded by Dromton in 11th century." },
      { rank: 6, name: "Kasol & Manikaran Hot Springs", city: "Kullu", cat: "Parvati Valley Springs", desc: "Hippie village along Parvati River famous for natural geothermal sulfur springs.", history: "Manikaran Sahib Gurudwara visited by Guru Nanak Dev Ji." },
      { rank: 7, name: "Khajjiar (Mini Switzerland)", city: "Chamba", cat: "Meadow & Pine Forest", desc: "Grassy meadow surrounded by cedar forests with a small lake in the center.", history: "Officially christened 'Mini Switzerland' by Swiss envoy Willy P. Blazer in 1992." },
      { rank: 8, name: "Baijnath Shiva Temple", city: "Kangra", cat: "Nagara Style Temple", desc: "13th-century stone temple dedicated to Lord Shiva as the Physician (Vaidyanath).", history: "Constructed in 1204 AD by two local merchants Ahuka and Manyuka." },
      { rank: 9, name: "Kalka-Shimla Toy Train", city: "Shimla", cat: "UNESCO Mountain Railway", desc: "Narrow-gauge railway passing through 102 tunnels and 864 bridges up mountain curves.", history: "Opened in 1903 under Lord Curzon's supervision." },
      { rank: 10, name: "Chamba Town & Bhuri Singh Museum", city: "Chamba", cat: "Ancient Kingdom Town", desc: "Ancient town on Ravi river banks known for Chamba Rumal embroidery and Pahari art.", history: "Founded in 920 AD by Raja Sahil Varman." }
    ]
  },
  "Jharkhand": {
    type: "State",
    capital: "Ranchi",
    famousFood: "Dhuska with Aloo Chana, Pittha, Rugra (Wild Mushroom), Chilka Roti, Malpua",
    culture: "Chhau Mask Dance, Sarhul spring festival, Sohrai & Khovar tribal cave wall painting",
    famousTemples: "Baidyanath Jyotirlinga (Deoghar), Jagannath Temple (Ranchi), Chhinnamasta (Rajrappa)",
    traditionalClothes: "Panchi & Parhan saree, Tasar silk handloom",
    places: [
      { rank: 1, name: "Baba Baidyanath Dham", city: "Deoghar", cat: "Sacred Jyotirlinga", desc: "Holy Shiva Jyotirlinga temple destination for millions of Shravani Mela pilgrims.", history: "One of 12 Jyotirlingas where Ravana sacrificed his 10 heads to Lord Shiva." },
      { rank: 2, name: "Hundru & Jonha Waterfalls", city: "Ranchi", cat: "Subarnarekha Cascades", desc: "Spectacular 320-foot waterfall where Subarnarekha River falls over rocky cliffs.", history: "Created by rejuvenation of Ranchi plateau in geological history." },
      { rank: 3, name: "Chhinnamasta Temple", city: "Rajrappa / Ramgarh", cat: "Tantric Shakti Shrine", desc: "Revered temple located at the confluence of Damodar and Bhera rivers.", history: "Ancient Shakti Peeth dedicated to headless Goddess Chhinnamasta." },
      { rank: 4, name: "Betla National Park", city: "Palamu", cat: "First Tiger Reserve", desc: "Sanctuary inside Chota Nagpur plateau featuring wild elephants, tigers, and Palamu Fort ruins.", history: "One of the first national parks in India to become a Tiger Reserve in 1974." },
      { rank: 5, name: "Parasnath Hill (Shikharji)", city: "Giridih", cat: "Highest Peak & Jain Shrine", desc: "Highest peak in Jharkhand (4,478 ft) where 20 of 24 Jain Tirthankaras attained Moksha.", history: "Sacred Jain pilgrimage center dating back thousands of years." },
      { rank: 6, name: "Patratu Valley & Dam", city: "Ramgarh", cat: "Scenic S-Curve Valley", desc: "Winding S-curve mountain pass with clear lake views and boating resort.", history: "Dam built in 1962 to supply water to Patratu Thermal Power Station." },
      { rank: 7, name: "Ranchi Jagannath Temple", city: "Ranchi", cat: "Hilltop Replica Temple", desc: "17th-century hilltop temple built as a replica of Puri Jagannath Temple.", history: "Built by King of Barkagarh, Thakur Aani Nath Shahdeo, in 1691." },
      { rank: 8, name: "Dassam Waterfalls", city: "Ranchi", cat: "Kanchi River Falls", desc: "144-foot clear water cascade where Kanchi River tumbles down 10 streams.", history: "Named 'Dassam' meaning 10 streams in Mundari tribal dialect." },
      { rank: 9, name: "Jamshedpur Jubilee Park & Lake", city: "Jamshedpur", cat: "Steel City Park", desc: "225-acre park gifted by Tata Steel, featuring musical fountains and rose garden.", history: "Inaugurated in 1958 on Jamshedji Tata's birth centenary." },
      { rank: 10, name: "Netarhat (Queen of Chhotanagpur)", city: "Latehar", cat: "Sunrise & Sunset Hill", desc: "Serene hill station famous for Magnolia sunset point and pine forests.", history: "Developed as a secluded summer retreat during British Raj." }
    ]
  },
  "Karnataka": {
    type: "State",
    capital: "Bengaluru",
    famousFood: "Bisi Bele Bath, Mysore Pak, Neer Dosa, Dharwad Peda, Mangalore Bun, Ragi Mudde",
    culture: "Yakshagana dance-drama, Mysore Dasara, Kamabala buffalo race",
    famousTemples: "Virupaksha (Hampi), Chamundeshwari (Mysore), Murudeshwar, Kukke Subramanya",
    traditionalClothes: "Ilkal & Mysore Silk Sarees, Kache Panche with Angavastram",
    places: [
      { rank: 1, name: "Mysore Palace & Chamundi Hill", city: "Mysuru", cat: "Royal Palace", desc: "Indo-Saracenic royal palace glowing with 100,000 lights during Dasara festival.", history: "Official seat of Wadiyar Dynasty, rebuilt in 1912 by Henry Irwin." },
      { rank: 2, name: "Hampi Vijayanagara Ruins", city: "Hampi", cat: "UNESCO Ruined Capital", desc: "UNESCO World Heritage boulder landscape featuring Virupaksha Temple & Stone Chariot.", history: "Capital of Vijayanagara Empire in 14th century, once 2nd largest city in world." },
      { rank: 3, name: "Coorg Abbey Falls & Raja's Seat", city: "Coorg / Madikeri", cat: "Coffee Hills & Falls", desc: "Misty hill district known as 'Scotland of India' with coffee plantations and cascades.", history: "Ruled by Kodagu Kings until British annexation in 1834." },
      { rank: 4, name: "Badami Cave Temples & Pattadakal", city: "Bagalkot", cat: "UNESCO Rock Cut Temples", desc: "6th-century red sandstone cave temples overlooking Agastya Lake.", history: "Capital of Badami Chalukyas from 540 to 757 CE." },
      { rank: 5, name: "Gokarna Om Beach", city: "Gokarna", cat: "Coastal Pilgrimage & Beach", desc: "Om-shaped natural beach combined with ancient Mahabaleshwar Shiva temple.", history: "Revered in Hindu lore as the place where Atmalinga was installed." },
      { rank: 6, name: "Chikmagalur Coffee Estates", city: "Chikmagalur", cat: "Coffee Land & Mullayanagiri", desc: "Birthplace of Indian coffee featuring Mullayanagiri, Karnataka's highest peak.", history: "Baba Budan brought 7 coffee beans from Yemen in 1670 CE." },
      { rank: 7, name: "Jog Falls", city: "Shimoga", cat: "2nd Highest Plunge Fall", desc: "Segmented 830-foot waterfall formed by Sharavathi River cascading down rocky cliffs.", history: "Renowned eco-tourism destination created by Sharavathi river gorge." },
      { rank: 8, name: "Murudeshwar Temple & Statue", city: "Uttara Kannada", cat: "Giant Shiva Statue", desc: "World's 2nd tallest Shiva statue (123 ft) situated on Kanduka Hill surrounded by Arabian Sea.", history: "Modern architectural marvel built by R. N. Shetty." },
      { rank: 9, name: "Belur & Halebidu Temples", city: "Hassan", cat: "UNESCO Hoysala Sculptures", desc: "12th-century star-shaped temples featuring soapstone carvings of dancers and deities.", history: "Commissioned by King Vishnuvardhana to commemorate victory over Cholas in 1117 CE." },
      { rank: 10, name: "Bangalore Palace & Lalbagh", city: "Bengaluru", cat: "Tudor Style Palace & Garden", desc: "Tudor-style royal palace featuring glass house botanical gardens and tech heritage.", history: "Built by Rev. J. Garrett in 1878 and purchased by Chamarajendra Wadiyar X." }
    ]
  },
  "Kerala": {
    type: "State",
    capital: "Thiruvananthapuram",
    famousFood: "Kerala Sadya (Leaf Feast), Appam with Stew, Puttu & Kadala, Malabar Biryani",
    culture: "Kathakali & Mohiniyattam classical dances, Thrissur Pooram & Vallam Kali (Boat Race)",
    famousTemples: "Padmanabhaswamy Temple, Sabarimala Ayyappa, Guruvayur Temple, Chottanikkara",
    traditionalClothes: "Kasavu Saree (Gold border), Mundu & Veshti",
    places: [
      { rank: 1, name: "Alleppey Houseboats & Backwaters", city: "Alappuzha", cat: "Backwater Cruises", desc: "Tranquil network of lagoons, canals, and traditional Kettuvallam houseboats.", history: "Known as 'Venice of the East', trade port established by Raja Kesavadas in 1762." },
      { rank: 2, name: "Munnar Tea Gardens", city: "Munnar", cat: "Hill Station & Tea Hills", desc: "Sprawling tea hill plantations at 1,600m altitude near Eravikulam National Park.", history: "Developed as a summer resort by the British Raj in 19th century." },
      { rank: 3, name: "Fort Kochi & Chinese Nets", city: "Kochi", cat: "Colonial Port & Heritage", desc: "Iconic waterfront featuring 500-year-old Chinese fishing nets and Portuguese villas.", history: "Major spice trading port since 14th century attracting European traders." },
      { rank: 4, name: "Padmanabhaswamy Temple", city: "Thiruvananthapuram", cat: "Royal Golden Temple", desc: "Gold-plated Dravidian temple famed for immense underground treasure vaults.", history: "Rebuilt in 18th century by Maharajah Marthanda Varma." },
      { rank: 5, name: "Wayanad Edakkal Caves", city: "Wayanad", cat: "Prehistoric Cave Art", desc: "Neolithic rock carvings and petroglyphs dating back to 6000 BCE in high mountain caves.", history: "Discovered in 1890 by Fred Fawcett, revealing prehistoric human settlement." },
      { rank: 6, name: "Kovalam & Varkala Cliff Beaches", city: "Trivandrum", cat: "Cliff Coast & Ayurveda", desc: "Dramatic red cliff beach overlooking Arabian Sea with seaside cafes and ayurvedic resorts.", history: "Popularized in 1930s by the Maharani of Travancore." },
      { rank: 7, name: "Periyar Wildlife Sanctuary", city: "Thekkady", cat: "Elephant & Tiger Reserve", desc: "Protected jungle sanctuary surrounding Periyar Lake, popular for boat safaris.", history: "Created in 1934 as Neliyampatty sanctuary by Maharajah of Travancore." },
      { rank: 8, name: "Athirappilly Waterfalls", city: "Thrissur", cat: "Niagara of India", desc: "80-foot wide cascading waterfall on the Chalakudy River surrounded by rainforests.", history: "Featured in numerous Indian epic films including Baahubali." },
      { rank: 9, name: "Kumarakom Bird Sanctuary", city: "Kottayam", cat: "Migratory Birds & Lake", desc: "Lush sanctuary on Vembanad Lake home to migratory Siberian storks and egrets.", history: "Set up in former rubber plantation developed by Englishman Alfred George Baker." },
      { rank: 10, name: "Bekal Fort & Beach", city: "Kasaragod", cat: "Coastal Keyhole Fort", desc: "Largest fort in Kerala with keyhole-shaped ramparts offering panoramic sea views.", history: "Built by Shivappa Nayaka of Bednore in 1650 AD." }
    ]
  },
  "Madhya Pradesh": {
    type: "State",
    capital: "Bhopal",
    famousFood: "Poha Jalebi, Bhutte Ka Kees, Dal Bafla, Indori Sev, Palak Puri",
    culture: "Bhagoria tribal festival, Matki folk dance, Chanderi & Maheshwari handlooms",
    famousTemples: "Khajuraho Temples, Mahakaleshwar Jyotirlinga (Ujjain), Sanchi Stupa, Omkareshwar",
    traditionalClothes: "Maheshwari & Chanderi Sarees, Dhoti-Bandbandha coat",
    places: [
      { rank: 1, name: "Khajuraho Group of Temples", city: "Chhatarpur", cat: "UNESCO Temple Art", desc: "World famous 10th-century temples featuring magnificent Nagara sculptures.", history: "Built by Chandela dynasty kings between 950 and 1050 CE." },
      { rank: 2, name: "Mahakaleshwar Jyotirlinga", city: "Ujjain", cat: "Sacred Jyotirlinga & Bhasma Aarti", desc: "Revered Shiva Jyotirlinga temple famous for early morning Bhasma Aarti ceremony.", history: "One of 12 holy Jyotirlingas, capital of ancient Avanti kingdom." },
      { rank: 3, name: "Sanchi Stupa", city: "Raisen", cat: "UNESCO Buddhist Monument", desc: "Oldest stone structure in India featuring hemispherical dome and carved gateways (Toranas).", history: "Commissioned by Emperor Ashoka in 3rd century BCE." },
      { rank: 4, name: "Gwalior Fort & Jai Vilas Palace", city: "Gwalior", cat: "Impenetrable Hill Fort", desc: "Massive hill fortress overlooking Gwalior city, known as 'pearl among fortresses'.", history: "Built by Raja Man Singh Tomar in 15th century." },
      { rank: 5, name: "Bandhavgarh National Park", city: "Umaria", cat: "Highest Tiger Density", desc: "Premier national park harboring the highest density of Royal Bengal Tigers in India.", history: "Former royal hunting preserve of Maharajas of Rewa." },
      { rank: 6, name: "Kanha National Park", city: "Mandla", cat: "Rudyard Kipling's Jungle", desc: "Sprawling sal forest sanctuary that inspired Rudyard Kipling's 'The Jungle Book'.", history: "Created in 1955 and made a Project Tiger reserve in 1973." },
      { rank: 7, name: "Bhedaghat Marble Rocks & Dhuandhar", city: "Jabalpur", cat: "Narmada River Gorge", desc: "100-foot marble rock gorge on Narmada River illuminated under moonlight boat rides.", history: "Formed over centuries as Narmada river carved soft marble rocks." },
      { rank: 8, name: "Orchha Fort & Cenotaphs", city: "Niwari / Orchha", cat: "Bundela Dynasty Capital", desc: "Medieval palace fortress featuring Jahangir Mahal, Ram Raja Temple, and river Chhatris.", history: "Founded in 1501 by Bundela chieftain Rudra Pratap Singh." },
      { rank: 9, name: "Pachmarhi (Satpura ki Rani)", city: "Narmadapuram", cat: "Only Hill Station of MP", desc: "Verdant hill station featuring Bee Falls, Jatashankar cave, and Dhupgarh sunset point.", history: "Discovered by Captain James Forsyth of British Army in 1857." },
      { rank: 10, name: "Bhimbetka Rock Shelters", city: "Raisen", cat: "UNESCO Prehistoric Art", desc: "Cave complex featuring 30,000-year-old Paleolithic rock paintings.", history: "Discovered by archaeologist V.S. Wakankar in 1957." }
    ]
  },
  "Maharashtra": {
    type: "State",
    capital: "Mumbai",
    famousFood: "Vada Pav, Misal Pav, Pav Bhaji, Puran Poli, Bombil Fry, Modak",
    culture: "Ganesh Chaturthi festival, Lavani folk dance, Warli tribal art",
    famousTemples: "Siddhivinayak (Mumbai), Shirdi Sai Baba, Trimbakeshwar, Bhimashankar",
    traditionalClothes: "Nauvari Saree (9-yard lugade), Pheta (turban) & Dhoti",
    places: [
      { rank: 1, name: "Gateway of India & Taj Hotel", city: "Mumbai", cat: "Iconic Waterfront", desc: "Basalt arch monument erected overlooking Mumbai harbor opposite Taj Mahal Palace Hotel.", history: "Built in 1911 to commemorate the landing of King George V and Queen Mary." },
      { rank: 2, name: "Ajanta & Ellora Caves", city: "Chhatrapati Sambhajinagar", cat: "UNESCO Rock Caves", desc: "World-famous rock-cut Buddhist, Hindu & Jain cave temples featuring Kailash Temple.", history: "Carved into volcanic basalt rock between 2nd century BCE and 10th century CE." },
      { rank: 3, name: "Marine Drive & Queen's Necklace", city: "Mumbai", cat: "Coastal Promenade", desc: "3.6 km long C-shaped boulevard along South Mumbai coast glowing at night.", history: "Constructed on land reclaimed by Pallonji Mistry in 1920s." },
      { rank: 4, name: "Shirdi Sai Baba Temple", city: "Shirdi", cat: "Sacred Shrine", desc: "Global pilgrimage shrine dedicated to revered spiritual saint Sai Baba.", history: "Sai Baba arrived in Shirdi in mid-19th century and lived here until 1918." },
      { rank: 5, name: "Lonavala & Khandala Ghats", city: "Pune District", cat: "Western Ghats Hills", desc: "Scenic hill stations famous for Karla & Bhaja Caves, waterfalls, and chikki sweet.", history: "Served as an important trade route connecting coastal ports to Deccan plateau." },
      { rank: 6, name: "Elephanta Caves & Island", city: "Mumbai Harbor", cat: "UNESCO Cave Art", desc: "Island rock-cut cave temples dedicated to Lord Shiva featuring Trimurti sculpture.", history: "Carved between 5th and 7th centuries CE." },
      { rank: 7, name: "Sinhagad Fort & Shaniwar Wada", city: "Pune", cat: "Maratha Fort & Palace", desc: "Historic hill fortress where Tanaji Malusare fought, and Maratha Peshwa palace ruins.", history: "Built over 2,000 years ago, famous for 1670 Battle of Sinhagad." },
      { rank: 8, name: "Chhatrapati Shivaji Terminus (CST)", city: "Mumbai", cat: "UNESCO Gothic Station", desc: "Victorian Gothic UNESCO World Heritage railway terminus.", history: "Designed by Frederick William Stevens and completed in 1888." },
      { rank: 9, name: "Mahabaleshwar & Panchgani", city: "Satara", cat: "Strawberry Hill Station", desc: "High-altitude hill resort famous for strawberry farms, Arthur's Seat viewpoint, and Venna Lake.", history: "Summer capital of Bombay Presidency during British Raj." },
      { rank: 10, name: "Trimbakeshwar Jyotirlinga Temple", city: "Nashik", cat: "Holy Jyotirlinga", desc: "Sacred Shiva Jyotirlinga temple at the origin of Godavari River.", history: "Rebuilt by Peshwa Balaji Baji Rao in 18th century." }
    ]
  },
  "Manipur": {
    type: "State",
    capital: "Imphal",
    famousFood: "Eromba, Kangshoi, Singju, Chamthong, Chak-Hao Kheer (Black Rice Pudding)",
    culture: "Manipuri Raas Leela dance, Yaoshang festival, Thang-Ta martial arts",
    famousTemples: "Shree Shree Govindajee Temple, Kangla Fort Temple, Ibudhou Thangjing",
    traditionalClothes: "Innaphi & Phanek for women, Khamen Chatpa dhoti for men",
    places: [
      { rank: 1, name: "Loktak Lake & Keibul Lamjao", city: "Bishnupur", cat: "World's Only Floating Park", desc: "Largest freshwater lake in Northeast India famous for phumdis (floating islands) and endangered Sangai deer.", history: "Keibul Lamjao declared a National Park in 1977 to save Sangai dancing deer." },
      { rank: 2, name: "Kangla Fort Complex", city: "Imphal", cat: "Royal Seat of Meitei Kings", desc: "Historic palace fort surrounded by moats, sacred shrines, and dragons statues (Kangla Sha).", history: "Ancient seat of Meitei Kingdom until British conquest in 1891." },
      { rank: 3, name: "Ima Keithel (Mothers' Market)", city: "Imphal", cat: "All-Women Market", desc: "500-year-old market run entirely by over 5,000 married Meitei women shopkeepers.", history: "Est. 16th century under Lallup labor system." },
      { rank: 4, name: "INRA War Memorial (Moirang)", city: "Moirang", cat: "Indian National Army History", desc: "Historic town where Netaji Subhash Chandra Bose's INA flag was first hoisted on Indian soil.", history: "Hoisted by Colonel Shaukat Malik on April 14, 1944." },
      { rank: 5, name: "Shree Shree Govindajee Temple", city: "Imphal", cat: "Royal Vaishnavite Temple", desc: "Twin-domed gold temple dedicated to Lord Krishna and Radha adjacent to Kangla Palace.", history: "Built in 1846 by Maharaja Nara Singh." },
      { rank: 6, name: "Ukhrul & Shirui Lily Hills", city: "Ukhrul", cat: "Rare Flower Hills", desc: "Scenic hill district home to the rare Shirui Lily (Lilium mackliniae) that grows nowhere else.", history: "Discovered by English botanist Dr. Frank Kingdon-Ward in 1946." },
      { rank: 7, name: "Dzukou Valley (Manipur Side)", city: "Senapati", cat: "Trekking Valley", desc: "High altitude green rolling valley famous for endemic flowers and bamboo brush.", history: "Sacred valley in tribal folklore." },
      { rank: 8, name: "Khongjom War Memorial", city: "Thoubal", cat: "Freedom Memorial", desc: "Monument commemorating the brave Manipur warriors who fought British forces in 1891 Anglo-Manipur war.", history: "Features highest sword statue in India." },
      { rank: 9, name: "Andro Heritage Village", city: "Imphal East", cat: "Cultural Craft Village", desc: "Traditional village preserving ancient pottery techniques and sacred fire (Meitei hearth).", history: "Fire has been kept burning continuously for centuries." },
      { rank: 10, name: "Moreh Border Town", city: "Tengnoupal", cat: "Indo-Myanmar International Border", desc: "Bustling international border trading hub connecting India to Myanmar.", history: "Key gateway of India's 'Act East' policy." }
    ]
  },
  "Meghalaya": {
    type: "State",
    capital: "Shillong",
    famousFood: "Jadoh (Rice & Meat), Dohneiiong, Tungrymbai, Nakham Bitchi, Pumaloi",
    culture: "Shad Suk Mynsiem & Nongkrem dances, Wangala 100-Drums festival",
    famousTemples: "Nartiang Durga Temple, Kamakhya shrine spots, Sacred Monoliths",
    traditionalClothes: "Jainsem & Torba for Khasi women, Dakmanda for Garo women",
    places: [
      { rank: 1, name: "Cherrapunji (Sohra) & Nohkalikai", city: "East Khasi Hills", cat: "Rainiest Place & Falls", desc: "High rainfall plateau featuring Nohkalikai Falls (tallest plunge waterfall in India at 1,115 ft).", history: "Recorded world's highest annual rainfall in 1860-61." },
      { rank: 2, name: "Living Root Bridges (Nongriat)", city: "Nongriat / Sohra", cat: "UNESCO Eco Engineering", desc: "Double-decker living root bridges bio-engineered by Khasi tribes using Ficus elastica roots.", history: "Grown over centuries across rushing jungle rivers." },
      { rank: 3, name: "Dawki & Umngot River", city: "West Jaintia Hills", cat: "Crystal Clear River", desc: "Glass-like transparent green river where boats appear to float on air near Indo-Bangladesh border.", history: "Historic trade route along Jaintia hills border." },
      { rank: 4, name: "Mawlynnong Village", city: "East Khasi Hills", cat: "Cleanest Village in Asia", desc: "Eco-friendly village awarded Cleanest Village in Asia, featuring bamboo skywalks.", history: "Cleanliness initiative started by villagers in 1988." },
      { rank: 5, name: "Shillong Peak & Elephant Falls", city: "Shillong", cat: "Scotland of the East", desc: "Highest peak in Shillong (6,449 ft) and 3-tiered mountain waterfall.", history: "Colonial summer resort established during British Raj." },
      { rank: 6, name: "Umiam Lake (Barapani)", city: "Ri-Bhoi", cat: "Reservoir Lake & Sports", desc: "Sprawling blue water reservoir lake surrounded by pine forests.", history: "Created in 1960 by damming the Umiam River for hydroelectricity." },
      { rank: 7, name: "Mawsynram Caves & Stalagmites", city: "East Khasi Hills", cat: "Mawjymbuin Cave", desc: "Cave containing natural stalagmite forming a natural Shiva Lingam.", history: "Receives highest average annual rainfall on Earth." },
      { rank: 8, name: "Nartiang Monoliths & Durga Temple", city: "West Jaintia Hills", cat: "Ancient Monolith Park", desc: "Largest collection of Khasi & Jaintia megalithic stone monoliths.", history: "Erected between 1500 and 1800 AD to honor Jaintia Kings." },
      { rank: 9, name: "Balpakram National Park", city: "South Garo Hills", cat: "Land of Perpetual Winds", desc: "Deep canyon plateau national park home to red pandas, wild water buffaloes, and pitcher plants.", history: "Sacred spirit abode in Garo tribal mythology." },
      { rank: 10, name: "Laitlum Canyons", city: "East Khasi Hills", cat: "Panoramic Canyon View", desc: "Breathtaking green canyon edge offering deep valley views and winding staircases.", history: "Featured in numerous films for its dramatic cliff vistas." }
    ]
  },
  "Mizoram": {
    type: "State",
    capital: "Aizawl",
    famousFood: "Bai (Vegetable Stew), Varsa Vung, Sawhchiar (Meat Rice), Koat Pitha",
    culture: "Cheraw (Bamboo Dance), Chapchar Kut spring festival, Solakia dance",
    famousTemples: "Solomon's Temple (Aizawl), Luangmual Handicrafts, Shiv Mandir Vairengte",
    traditionalClothes: "Puan & Puanchei (intricate woven wraparound skirt)",
    places: [
      { rank: 1, name: "Reiek Heritage Village & Peak", city: "Mamit", cat: "Heritage Village & Peak", desc: "Mountain peak (4,700 ft) with traditional Mizo tribal huts and panoramic cliff views.", history: "Preserves model houses of ancient Mizo chiefs." },
      { rank: 2, name: "Solomon's Temple", city: "Aizawl", cat: "Architectural Cathedral", desc: "Grand white marble church with 4 towers capable of seating 2,000 worshippers.", history: "Conceived by Kohhran Thianghlim church group in 1996." },
      { rank: 3, name: "Vantawng Falls", city: "Serchhip", cat: "Highest Waterfall in Mizoram", desc: "750-foot two-tiered waterfall surrounded by dense bamboo forests.", history: "Named after legendary swimmer Vantawnga who swam up the falls." },
      { rank: 4, name: "Phawngpui (Blue Mountain)", city: "Lawngtlai", cat: "Highest Peak in Mizoram", desc: "Highest mountain peak in Mizoram (7,100 ft) famous for orchids and rhododendrons.", history: "Sacred abode of the Mizo folk deity." },
      { rank: 5, name: "Tamdil Lake", city: "Saitual", cat: "Natural Lake & Eco Resort", desc: "Largest natural lake in Mizoram surrounded by tropical forests and fishing spots.", history: "Legendary lake formed from a giant mustard plant stump." },
      { rank: 6, name: "Aizawl Viewpoint & Durtlang Hills", city: "Aizawl", cat: "Capital Skyline View", desc: "Hilltop ridge offering twinkling nighttime views of Aizawl city built on steep slopes.", history: "Established as British military post in 1890." },
      { rank: 7, name: "Champhai Border Town", city: "Champhai", cat: "Rice Bowl of Mizoram", desc: "Border commercial town offering sweeping views of Myanmar hills and vineyards.", history: "Gateway town along ancient trade routes." },
      { rank: 8, name: "Murlen National Park", city: "Champhai", cat: "Dense Jungle Park", desc: "Dense rainforest park where canopy is so thick that sunlight barely reaches the ground.", history: "Declared a National Park in 1991." },
      { rank: 9, name: "Lunglei Rock Bridge", city: "Lunglei", cat: "Natural Rock Bridge", desc: "Second largest town in Mizoram named after a natural bridge of rock on Nghasih stream.", history: "Former British administrative district headquarters." },
      { rank: 10, name: "Khuangchera Cave", city: "Mamit", cat: "Adventure Cave Network", desc: "Second longest cave in Mizoram extending 1,600 meters with dark passages.", history: "Named after legendary Mizo warrior Khuangchera." }
    ]
  },
  "Nagaland": {
    type: "State",
    capital: "Kohima",
    famousFood: "Smoked Pork with Axone (Fermented Soybeans), Raja Mircha (Ghost Pepper), Bamboo Steamed Fish",
    culture: "Hornbill Festival (Festival of Festivals), War Dance, 16 major Naga tribe traditions",
    famousTemples: "Kohima Cathedral, Dimapur Kachari Ruins, Doyang Hydro Spot",
    traditionalClothes: "Naga Shawls (Tsungkotepsu, Tsungrem), Mekhela, Beaded necklaces",
    places: [
      { rank: 1, name: "Kisama Heritage Village", city: "Kohima", cat: "Hornbill Festival Site", desc: "Cultural village hosting the world-famous Hornbill Festival every December.", history: "Established by Nagaland government to preserve 16 Naga tribal morungs." },
      { rank: 2, name: "Dzukou Valley", city: "Kohima / Manipur Border", cat: "Valley of Flowers", desc: "Stunning high altitude rolling green valley famous for the endemic Dzukou Lily.", history: "Sacred pristine valley preserved by local tribal youth." },
      { rank: 3, name: "Kohima War Cemetery", city: "Kohima", cat: "WWII Battle Site", desc: "Commonwealth war memorial on Garrison Hill honoring heroes of the 1944 Battle of Kohima.", history: "Site of the turning point Battle of Kohima where Allied forces defeated Japanese invasion." },
      { rank: 4, name: "Dimapur Kachari Ruins", city: "Dimapur", cat: "Megalithic Mushroom Pillars", desc: "Monolithic mushroom-shaped stone pillars dating back to the medieval Dimasa Kachari Kingdom.", history: "Constructed in 13th century prior to Ahom invasion." },
      { rank: 5, name: "Japfu Peak & Rhododendrons", city: "Kohima", cat: "2nd Highest Peak", desc: "Mountain peak (10,000 ft) featuring the world's tallest rhododendron tree (109 ft).", history: "Guinness record holder for tallest rhododendron tree." },
      { rank: 6, name: "Khonoma Green Village", city: "Kohima District", cat: "First Green Village in Asia", desc: "500-year-old Angami Naga village famous for eco-conservation and anti-poaching rules.", history: "Famous for resisting British invasions in 1879." },
      { rank: 7, name: "Mokokchung Cultural Hub", city: "Mokokchung", cat: "Ao Naga Capital", desc: "Cultural capital of the Ao Naga tribe known for Moatsu and Tsungremong festivals.", history: "Primary administrative town established during British Raj." },
      { rank: 8, name: "Mon & Longwa Village", city: "Mon", cat: "Konyak Tattooed Warriors", desc: "Traditional Konyak Naga village where the Chief's house straddles the India-Myanmar international border.", history: "Home to former headhunter Konyak warriors with facial tattoos." },
      { rank: 9, name: "Tuophema Tourist Village", city: "Kohima", cat: "Angami Eco Huts", desc: "Model eco-tourist village featuring traditional Angami Naga huts and ethnic feasts.", history: "Built collaboratively by village clans." },
      { rank: 10, name: "Shilloi Lake", city: "Phek", cat: "Footprint Shaped Lake", desc: "Footprint-shaped natural lake surrounded by pine hills, sacred to Lazu villagers.", history: "Revered in tribal lore where no one catches fish due to sacred beliefs." }
    ]
  },
  "Odisha": {
    type: "State",
    capital: "Bhubaneswar",
    famousFood: "Pakhala Bhata, Chenna Poda (Baked Cheese Sweet), Dalma, Rasagola, Crab Kalia",
    culture: "Odissi classical dance, Puri Rath Yatra (Chariot Festival), Pattachitra scroll art",
    famousTemples: "Jagannath Temple (Puri), Konark Sun Temple, Lingaraj Temple, Mukteshwar",
    traditionalClothes: "Sambalpuri & Bomkai Ikat Sarees, Dhoti-Kurta",
    places: [
      { rank: 1, name: "Jagannath Temple & Grand Road", city: "Puri", cat: "Char Dham & Rath Yatra", desc: "12th-century sacred temple famous for world's largest Rath Yatra chariot festival.", history: "Built by King Anantavarman Chodaganga Deva in 1161 AD." },
      { rank: 2, name: "Konark Sun Temple", city: "Konark", cat: "UNESCO Chariot Temple", desc: "13th-century Sun Temple carved as a colossal 24-wheeled stone chariot drawn by 7 horses.", history: "Constructed by King Narasimhadeva I of Eastern Ganga Dynasty in 1250 AD." },
      { rank: 3, name: "Chilika Lake & Irrawaddy Dolphins", city: "Puri / Ganjam", cat: "Largest Coastal Lagoon", desc: "Asia's largest brackish water lagoon famous for Satapada Irrawaddy dolphins and migratory birds.", history: "Historic port region mentioned by Ptolemy." },
      { rank: 4, name: "Lingaraj Temple", city: "Bhubaneswar", cat: "Kalinga Architecture", desc: "180-foot stone temple tower representing the pinnacle of Kalinga architectural style.", history: "Built by Somavamsi King Jajati Keshari in 11th century." },
      { rank: 5, name: "Udayagiri & Khandagiri Caves", city: "Bhubaneswar", cat: "Jain Rock Cut Caves", desc: "Partly natural and partly carved rock caves built for Jain monks featuring Hathigumpha inscription.", history: "Commissioned by King Kharavela of Mahameghavahana dynasty in 2nd century BCE." },
      { rank: 6, name: "Simlipal National Park", city: "Mayurbhanj", cat: "Biosphere & Tiger Reserve", desc: "Massive biosphere sanctuary featuring Bengal tigers, Asian elephants, and Joranda waterfalls.", history: "Former hunting ground of Maharajas of Mayurbhanj." },
      { rank: 7, name: "Dhauli Shanti Stupa", city: "Bhubaneswar", cat: "Peace Pagoda & Rock Edicts", desc: "White peace pagoda standing on Dhauli hills where Kalinga War was fought.", history: "Site where Emperor Ashoka renounced war and embraced Buddhism in 261 BCE." },
      { rank: 8, name: "Gopalpur on Sea Beach", city: "Ganjam", cat: "Historic Seaport & Beach", desc: "Quiet beach town featuring colonial bungalows and lighthouse.", history: "Important trading port during British East India Company era." },
      { rank: 9, name: "Bhitarkanika National Park", city: "Kendrapara", cat: "Mangroves & Saltwater Crocodiles", desc: "RAMSAR mangrove sanctuary harboring world's largest saltwater crocodiles and Olive Ridley turtles.", history: "Second largest mangrove ecosystem in India." },
      { rank: 10, name: "Hirakud Dam", city: "Sambalpur", cat: "World's Longest Earthen Dam", desc: "Longest earthen dam in the world (25.8 km) built across Mahanadi River with Gandhi Minar watchtower.", history: "Inaugurated by Prime Minister Jawaharlal Nehru in 1957." }
    ]
  },
  "Punjab": {
    type: "State",
    capital: "Chandigarh",
    famousFood: "Makki di Roti & Sarson da Saag, Amritsari Kulcha, Butter Chicken, Lassi, Chole Bhature",
    culture: "Bhangra & Giddha folk dances, Baisakhi & Gurpurab festivals, Phulkari embroidery",
    famousTemples: "Golden Temple (Harmandir Sahib), Durgiana Temple, Devi Talab Mandir",
    traditionalClothes: "Phulkari Dupatta & Patiala Salwar Suit, Kurta-Pajama with Turban",
    places: [
      { rank: 1, name: "Golden Temple (Harmandir Sahib)", city: "Amritsar", cat: "Sacred Sikh Shrine", desc: "Sacred gilded temple open to all, surrounded by the holy Amrit Sarovar pool.", history: "Founded in 1577 by Guru Ram Das Ji; gold leaf added by Maharaja Ranjit Singh in 1830." },
      { rank: 2, name: "Jallianwala Bagh Memorial", city: "Amritsar", cat: "National War Memorial", desc: "Historic memorial park honoring 1919 martyrs, featuring preserved bullet walls.", history: "Site of the tragic 1919 massacre under British General Dyer." },
      { rank: 3, name: "Wagah Border Ceremony", city: "Amritsar", cat: "Military Border Retreat", desc: "High-energy daily military retreat ceremony at the India-Pakistan border post.", history: "Initiated in 1959 by Indian Border Security Force and Pakistan Rangers." },
      { rank: 4, name: "Gobindgarh Fort & Museum", city: "Amritsar", cat: "Heritage Military Fort", desc: "18th-century military fort featuring 7D light shows and Sikh heritage museum.", history: "Built by Gujjar Singh Bhangi and expanded by Maharaja Ranjit Singh." },
      { rank: 5, name: "Partition Museum", city: "Amritsar", cat: "History Museum", desc: "World's first museum dedicated to the story and memories of the 1947 Partition.", history: "Housed in historic Town Hall building near Golden Temple." },
      { rank: 6, name: "Anandpur Sahib Gurudwara", city: "Rupnagar", cat: "Holy Birthplace of Khalsa", desc: "Sacred white marble Gurudwara where Guru Gobind Singh Ji established the Khalsa Panth in 1699.", history: "Founded by Guru Tegh Bahadur Ji in 1665." },
      { rank: 7, name: "Virasat-e-Khalsa Museum", city: "Anandpur Sahib", cat: "World Class Museum", desc: "Architectural museum celebrating 500 years of Sikh history and culture.", history: "Designed by renowned architect Moshe Safdie, opened in 2011." },
      { rank: 8, name: "Sheesh Mahal & Qila Mubarak", city: "Patiala", cat: "Royal Palace", desc: "Palace of mirrors built inside 18-acre garden complex displaying miniature paintings.", history: "Built by Maharaja Narinder Singh in 1847." },
      { rank: 9, name: "Devi Talab Mandir", city: "Jalandhar", cat: "Ancient Shakti Peeth", desc: "500-year-old temple dedicated to Goddess Durga situated in the middle of a holy tank.", history: "One of 51 sacred Shakti Peethas in Hindu tradition." },
      { rank: 10, name: "Rock Garden & Sukhna Lake", city: "Chandigarh", cat: "Scrap Sculptures & Lake", desc: "Renowned eco-park created entirely out of industrial & home waste ceramics.", history: "Created secretly by Nek Chand starting in 1957." }
    ]
  },
  "Rajasthan": {
    type: "State",
    capital: "Jaipur",
    famousFood: "Dal Baati Churma, Ghevar, Laal Maas, Pyaz Kachori, Ker Sangri, Gatte ki Sabzi",
    culture: "Ghoomar & Kalbelia dances, Teej & Gangaur festivals, Block printing & Blue Pottery",
    famousTemples: "Brahma Temple (Pushkar), Karni Mata (Deshnoke), Dilwara Jain Temples, Khatu Shyam",
    traditionalClothes: "Ghagra Choli with Bandhani Dupatta, Rajputi Poshak, Dhoti-Kurta with Safa",
    places: [
      { rank: 1, name: "Amer Fort & Sheesh Mahal", city: "Jaipur", cat: "Heritage Fort", desc: "Magnificent 16th-century hilltop Rajput fortress overlooking Maota Lake with exquisite glass mirror palaces.", history: "Built by Raja Man Singh I in 1592, Amer Fort blends Rajput and Mughal architecture." },
      { rank: 2, name: "Hawa Mahal (Palace of Winds)", city: "Jaipur", cat: "Royal Palace", desc: "Five-story pink sandstone palace with 953 intricate honeycomb lattice windows for royal women.", history: "Constructed in 1799 by Maharaja Sawai Pratap Singh inspired by Khetri Mahal." },
      { rank: 3, name: "City Palace & Lake Pichola", city: "Udaipur", cat: "Royal Palace & Lake", desc: "Majestic palace complex overlooking island palaces and serene boat rides on Lake Pichola.", history: "Established in 1559 by Maharana Udai Singh II as the capital of Mewar Kingdom." },
      { rank: 4, name: "Mehrangarh Fort", city: "Jodhpur", cat: "Imperial Fort", desc: "Imposing fortress built 400 feet above Jodhpur city with intricate carved courtyards and cannons.", history: "Founded by Rao Jodha in 1459, featuring thick impenetrable walls." },
      { rank: 5, name: "Jaisalmer Fort & Sam Dunes", city: "Jaisalmer", cat: "Desert Golden Fort", desc: "Living sandstone Golden Fort in the Thar Desert with camel safaris and desert camps.", history: "Built in 1156 AD by Rawal Jaisal, it is one of the world's few fully inhabited forts." },
      { rank: 6, name: "Ranthambore National Park", city: "Sawai Madhopur", cat: "Wildlife & Tigers", desc: "Premier Royal Bengal tiger reserve set amidst ancient fort ruins and jungle lakes.", history: "Former royal hunting grounds of Jaipur Maharajas, declared a national park in 1980." },
      { rank: 7, name: "Pushkar Brahma Temple & Holy Lake", city: "Pushkar", cat: "Sacred Pilgrimage", desc: "Sacred lake encircled by 52 bathing ghats and one of the world's few Lord Brahma temples.", history: "Legendary ancient site celebrated during the famous annual Pushkar Camel Fair." },
      { rank: 8, name: "Chittorgarh Fort", city: "Chittorgarh", cat: "UNESCO Heroic Fort", desc: "Largest fort in India featuring Vijay Stambha (Tower of Victory) and Padmini Palace.", history: "Capital of Mewar from 7th to 16th centuries, famous for Rajput valor and sacrifice." },
      { rank: 9, name: "Junagarh Fort & Museum", city: "Bikaner", cat: "Royal Fort", desc: "Unconquered fort complex featuring Phool Mahal, Karan Mahal, and royal armor collections.", history: "Constructed by Raja Rai Singh in 1589, showcasing exquisite stone carving." },
      { rank: 10, name: "Mount Abu & Dilwara Temples", city: "Mount Abu", cat: "Hill Station & Temples", desc: "Only hill station in Rajasthan featuring 11th-century marble carved Jain temples.", history: "Carved between 11th and 13th centuries by Vastupala-Tejapala with extraordinary detail." }
    ]
  },
  "Sikkim": {
    type: "State",
    capital: "Gangtok",
    famousFood: "Momos, Thukpa, Gundruk, Phagshapa, Sha Phaley, Chhurpi Cheese",
    culture: "Cham Masked Lama dance, Losar & Saga Dawa festivals, Thangka scroll painting",
    famousTemples: "Rumtek Monastery, Pemayangtse Monastery, Buddha Park (Ravangla), Kirateshwar Mahadev",
    traditionalClothes: "Bakhu / Kho wraparound gown for men & women, Honju blouse",
    places: [
      { rank: 1, name: "Nathula Pass & Baba Mandir", city: "East Sikkim", cat: "Indo-China Border Pass", desc: "High mountain pass at 14,140 ft on the ancient Silk Route connecting India to Tibet.", history: "Historic trade route opened for border trade in 2006." },
      { rank: 2, name: "Tsomgo (Changu) Lake", city: "East Sikkim", cat: "Glacial Lake", desc: "Sacred glacial lake at 12,400 ft reflecting snow peaks and blue skies.", history: "Revered in Sikkimese folklore where lamas studied lake color to predict future." },
      { rank: 3, name: "Rumtek Monastery", city: "Gangtok", cat: "Sacred Karma Kagyu Seat", desc: "Largest monastery in Sikkim housing rare golden stupa and Buddhist relics.", history: "Rebuilt in 1966 by 16th Karmapa Rangjung Rigpe Dorje." },
      { rank: 4, name: "Buddha Park (Tathagata Tsal)", city: "Ravangla", cat: "130-foot Statue", desc: "Park featuring a 130-foot copper statue of Lord Buddha surrounded by Himalayan gardens.", history: "Consecrated by 14th Dalai Lama in 2013 to mark 2550th birth anniversary." },
      { rank: 5, name: "Yumthang Valley of Flowers", city: "North Sikkim", cat: "Valley of Rhododendrons", desc: "Alpine sanctuary with hot springs, yak pastures, and 24 species of rhododendrons.", history: "Famous alpine sanctuary near Shingba Rhododendron Sanctuary." },
      { rank: 6, name: "Gurudongmar Lake", city: "North Sikkim", cat: "High Altitude Sacred Lake", desc: "One of the highest lakes in the world (17,800 ft), sacred to Buddhists, Sikhs, and Hindus.", history: "Blessed by Guru Padmasambhava in 8th century so a portion never freezes." },
      { rank: 7, name: "Pelling & Skywalk", city: "West Sikkim", cat: "Kanchenjunga Views & Glass Skywalk", desc: "Hill resort offering close-up views of Mount Kanchenjunga and India's first glass skywalk.", history: "Located near Chenrezig 137-foot giant statue." },
      { rank: 8, name: "Pemayangtse Monastery", city: "Pelling", cat: "One of Oldest Monasteries", desc: "300-year-old monastery featuring 7-tiered wooden sculpture of Guru Rinpoche's heavenly palace.", history: "Founded by Lhatsun Chenpo in 1705." },
      { rank: 9, name: "Namchi Char Dham Complex", city: "South Sikkim", cat: "Pilgrimage Complex", desc: "Cultural complex featuring 108-foot Shiva statue and replicas of India's 4 Char Dham shrines.", history: "Inaugurated in 2011 on Solophok Hill." },
      { rank: 10, name: "Gangtok Ropeway & MG Marg", city: "Gangtok", cat: "Pedestrian Boulevard", desc: "Spick-and-span eco pedestrian boulevard with cable car rides over Gangtok valley.", history: "India's first litter-and-smoke-free pedestrian shopping street." }
    ]
  },
  "Tamil Nadu": {
    type: "State",
    capital: "Chennai",
    famousFood: "Idli Dosa Sambhar, Chettinad Chicken, Filter Coffee, Pongal, Jigarthanda",
    culture: "Bharatanatyam classical dance, Pongal festival, Carnatic classical music, Tanjore painting",
    famousTemples: "Meenakshi Amman (Madurai), Brihadeeswarar (Thanjavur), Ramanathaswamy (Rameswaram)",
    traditionalClothes: "Kanjeevaram Silk Sarees, Veshti (Dhoti) with Angavastram",
    places: [
      { rank: 1, name: "Meenakshi Amman Temple", city: "Madurai", cat: "Dravidian Temple Wonder", desc: "Historic temple complex with 14 towering gopurams covered in thousands of colorful sculptures.", history: "Rebuilt in 16th century by Nayak rulers of Madurai." },
      { rank: 2, name: "Brihadeeswarar Temple (Big Temple)", city: "Thanjavur", cat: "UNESCO Chola Temple", desc: "1000-year-old granite temple built without binding mortar, featuring single-stone dome.", history: "Built by Emperor Raja Raja Chola I in 1010 CE." },
      { rank: 3, name: "Shore Temple & Pancha Rathas", city: "Mamallapuram", cat: "UNESCO Coastal Monoliths", desc: "7th-century rock-cut monuments overlooking the Bay of Bengal.", history: "Carved during Pallava dynasty rule under Narasimhavarman II." },
      { rank: 4, name: "Ooty Lake & Toy Train", city: "Nilgiris / Ooty", cat: "Hill Station & Heritage Train", desc: "Hill station surrounded by Nilgiri tea estates and UNESCO mountain train rides.", history: "Founded by John Sullivan in 1819 as summer resort for Madras Presidency." },
      { rank: 5, name: "Ramanathaswamy Temple & Pamban Bridge", city: "Rameswaram", cat: "Sacred Island Shrine", desc: "Island temple featuring world's longest temple corridor and sea sea-bridge.", history: "Expanded by Setupati Kings of Ramnad in 12th century." },
      { rank: 6, name: "Vivekananda Rock Memorial", city: "Kanyakumari", cat: "Southernmost Tip Monument", desc: "Monument built on a rock island where Swami Vivekananda meditated, at 3 oceans confluence.", history: "Built in 1970 to honor Swami Vivekananda's meditation in 1892." },
      { rank: 7, name: "Kanchipuram Silk & Temple City", city: "Kanchipuram", cat: "Silk & Temple Heritage", desc: "City of 1000 temples famous for Ekambareswarar Temple and Kanjeevaram silk sarees.", history: "Served as royal capital of Pallava Empire from 4th to 9th centuries." },
      { rank: 8, name: "Kodaikanal Lake & Coaker's Walk", city: "Kodaikanal", cat: "Princess of Hill Stations", desc: "Star-shaped lake surrounded by pine forests, Pillar Rocks, and mist viewpoints.", history: "Established in 1845 by American missionaries." },
      { rank: 9, name: "Marina Beach & Kapaleeshwarar", city: "Chennai", cat: "World's 2nd Longest Beach", desc: "13 km natural urban sandy beach flanked by colonial lighthouse and Kapaleeshwarar temple.", history: "Promenade developed by Governor Mountstuart Elphinstone Grant Duff in 1880s." },
      { rank: 10, name: "Adiyogi Shiva Statue", city: "Coimbatore", cat: "Massive Steel Statue", desc: "112-foot steel statue of Adiyogi Shiva recognized by Guinness World Records.", history: "Designed by Sadhguru Jaggi Vasudev and consecrated in 2017." }
    ]
  },
  "Telangana": {
    type: "State",
    capital: "Hyderabad",
    famousFood: "Hyderabadi Dum Biryani, Haleem, Mirchi ka Salan, Qubani ka Meetha, Irani Chai",
    culture: "Bathukamma floral festival, Perini Thandavam dance, Bidriware metal craft",
    famousTemples: "Yadadri Temple, Ramappa Temple (UNESCO), Bhadrachalam, Thousand Pillar Temple",
    traditionalClothes: "Pochampally Ikat Sarees, Sherwani & Kurta-Pajama",
    places: [
      { rank: 1, name: "Charminar & Laad Bazaar", city: "Hyderabad", cat: "Iconic Monument", desc: "16th-century four-minaret mosque surrounded by pearl and bangle bazaars.", history: "Built in 1591 by Muhammad Quli Qutb Shah to celebrate end of plague." },
      { rank: 2, name: "Golconda Fort", city: "Hyderabad", cat: "Acoustic Fortress", desc: "Formidable hill fortress known for acoustic engineering and Koh-i-Noor diamond vault.", history: "Capital of Qutb Shahi Dynasty from 1512 to 1687." },
      { rank: 3, name: "Ramoji Film City", city: "Hyderabad", cat: "World's Largest Film Studio", desc: "Guinness-certified world's largest film studio complex spanning 2,000 acres.", history: "Set up by media tycoon Ramoji Rao in 1996." },
      { rank: 4, name: "Ramappa Temple", city: "Mulugu / Warangal", cat: "UNESCO Floating Brick Temple", desc: "13th-century Kakatiya temple built with lightweight floating bricks and carved pillars.", history: "Constructed by General Recharla Rudra in 1213 CE during Ganapati Deva's reign." },
      { rank: 5, name: "Hussain Sagar & Buddha Statue", city: "Hyderabad", cat: "Lake & Monolithic Statue", desc: "Heart-shaped lake featuring 18-meter monolithic granite Buddha statue in the center.", history: "Lake built by Ibrahim Quli Qutb Shah in 1563." },
      { rank: 6, name: "Salar Jung Museum", city: "Hyderabad", cat: "World Collection Museum", desc: "One of 3 National Museums in India housing European, Asian, and Middle Eastern art collections.", history: "Established from private collection of Salar Jung III." },
      { rank: 7, name: "Thousand Pillar Temple", city: "Warangal", cat: "Kakatiya Heritage", desc: "12th-century star-shaped triple shrine dedicated to Shiva, Vishnu, and Surya.", history: "Constructed by King Rudra Deva in 1163 CE." },
      { rank: 8, name: "Yadadri Temple", city: "Yadadri Bhuvanagiri", cat: "Grand Granite Temple", desc: "Newly reconstructed Dravidian stone temple dedicated to Narasimha Swamy.", history: "Ancient cave temple modernized with 250,000 tons of black granite." },
      { rank: 9, name: "Chowmahalla Palace", city: "Hyderabad", cat: "Nizam Palace", desc: "Palace of the Nizams featuring Grand Khilawat durbar hall and vintage cars.", history: "Built between 1750 and 1869 modeled after Shah's Palace in Tehran." },
      { rank: 10, name: "Bhadrachalam Temple", city: "Bhadradri Kothagudem", cat: "Sacred Godavari Temple", desc: "Historic temple on the banks of Godavari River associated with Ramayana epic.", history: "Constructed by Kancharla Gopanna (Bhakta Ramadasu) in 17th century." }
    ]
  },
  "Tripura": {
    type: "State",
    capital: "Agartala",
    famousFood: "Mui Borok (Berma Fermented Fish), Mosdeng, Kosoi Bwtwi, Bangui Rice, Gudok",
    culture: "Garia & Hojagiri bottle balance dances, Durga Puja, Bamboo & Cane craft",
    famousTemples: "Tripura Sundari Temple (Udaipur), Unakoti Rock Carvings, Kasba Kali",
    traditionalClothes: "Rignai (wraparound lower cloth) & Risa (upper chest wrap)",
    places: [
      { rank: 1, name: "Ujjayanta Palace", city: "Agartala", cat: "Royal Palace Museum", desc: "Neoclassical white palace set in Mughal gardens, former seat of Tripura Kings.", history: "Built in 1901 by Maharaja Radha Kishore Manikya." },
      { rank: 2, name: "Neermahal Water Palace", city: "Melaghar", cat: "Lake Palace Wonder", desc: "Palace built in the center of Rudrasagar Lake combining Hindu and Islamic architecture.", history: "Constructed in 1930 by Maharaja Bir Bikram Kishore Manikya." },
      { rank: 3, name: "Unakoti Rock Cut Carvings", city: "Kailashahar", cat: "Ancient Rock Reliefs", desc: "Shaivite pilgrimage site featuring giant rock-cut carvings of Lord Shiva.", history: "Carved between 7th and 9th centuries; name means 'one less than a crore'." },
      { rank: 4, name: "Tripura Sundari Temple (Matabari)", city: "Udaipur", cat: "Sacred 51 Shakti Peeth", desc: "Square 500-year-old temple shaped like a tortoise dedicated to Goddess Kali.", history: "Built by Maharaja Dhanya Manikya in 1501 AD." },
      { rank: 5, name: "Jampui Hills", city: "North Tripura", cat: "Orange Capital & Hills", desc: "Highest hill range in Tripura famous for orange orchards and misty views.", history: "Settled by Mizo and Reang tribal communities." },
      { rank: 6, name: "Sepahijala Wildlife Sanctuary", city: "Bishalgarh", cat: "Clouded Leopard Sanctuary", desc: "Sanctuary harboring rare Phayre's leaf monkeys, clouded leopards, and botanical gardens.", history: "Established in 1987 as a bio-reserve." },
      { rank: 7, name: "Pilak Buddhist Archaeological Site", city: "South Tripura", cat: "Ancient Buddhist & Hindu Site", desc: "Archaeological valley displaying 8th-century terracotta plaques and Buddhist stupas.", history: "Flourished between 8th and 12th centuries under Buddhist kings." },
      { rank: 8, name: "Boxanagar Stupa Site", city: "Sepahijala", cat: "Brick Stupa Complex", desc: "Excavated 6th-century brick Buddhist stupa and monastery along Bangladesh border.", history: "Discovered by ASI in 1997." },
      { rank: 9, name: "Heritage Park Agartala", city: "Agartala", cat: "Miniature Tripura Park", desc: "Sprawling park featuring miniature replicas of all Tripura monuments and stone art.", history: "Inaugurated in 2012 to highlight state heritage." },
      { rank: 10, name: "Chabimura Rock Carvings", city: "Amarpur", cat: "Riverfront Rock Carvings", desc: "Steep rock wall carvings of deities on Gomati River banks accessible by boat.", history: "Carved during 15th-16th century reign of Manikya kings." }
    ]
  },
  "Uttar Pradesh": {
    type: "State",
    capital: "Lucknow",
    famousFood: "Tunday Kabab, Awadhi Dum Biryani, Banarasi Paan, Bedmi Puri, Petha",
    culture: "Kathak classical dance, Chhath & Janmashtami, Banarasi Zari silk weaving",
    famousTemples: "Kashi Vishwanath (Varanasi), Banke Bihari (Vrindavan), Ram Mandir (Ayodhya)",
    traditionalClothes: "Banarasi Silk Sarees, Chikankari Kurta with Churidar",
    places: [
      { rank: 1, name: "Taj Mahal", city: "Agra", cat: "World Wonder", desc: "Ivory-white marble mausoleum built by Shah Jahan on the banks of Yamuna River.", history: "Constructed between 1631 and 1648 in memory of Mumtaz Mahal." },
      { rank: 2, name: "Kashi Vishwanath Temple & Ghats", city: "Varanasi", cat: "Sacred Pilgrimage & Ghats", desc: "Holy Jyotirlinga temple and sacred Ganga River ghats famous for evening Ganga Aarti.", history: "Varanasi is the world's oldest continuously inhabited city (3,000+ years old)." },
      { rank: 3, name: "Shri Ram Janmabhoomi Mandir", city: "Ayodhya", cat: "Sacred Ram Birthplace", desc: "Grand pink sandstone temple celebrating the birthplace of Lord Shri Ram.", history: "Consecrated in January 2024, designed in traditional Nagara style." },
      { rank: 4, name: "Agra Red Fort", city: "Agra", cat: "UNESCO Imperial Fort", desc: "Massive red sandstone imperial fortress housing Jahangiri Mahal and Sheesh Mahal.", history: "Main residence of emperors of the Mughal Dynasty until 1638." },
      { rank: 5, name: "Fatehpur Sikri Ghost City", city: "Agra", cat: "UNESCO Heritage City", desc: "Fortified ghost capital built by Emperor Akbar featuring Buland Darwaza.", history: "Founded in 1569 as Akbar's short-lived capital before water scarcity forced abandonment." },
      { rank: 6, name: "Sarnath Buddhist Stupa", city: "Varanasi", cat: "Buddhist Heritage", desc: "Sacred site where Lord Buddha preached his first sermon after enlightenment.", history: "Emperor Ashoka erected Dhamek Stupa and Lion Capital pillar here in 3rd century BCE." },
      { rank: 7, name: "Shri Krishna Janmabhoomi", city: "Mathura", cat: "Sacred Birthplace", desc: "Revered temple complex marking the birthplace of Lord Krishna.", history: "Ancient holy city celebrated in Hindu scriptures for thousands of years." },
      { rank: 8, name: "Bara Imambara & Rumi Darwaza", city: "Lucknow", cat: "Awadh Heritage", desc: "Architectural marvel featuring Bhulbhulaiya maze and Ottoman-style gateway.", history: "Built by Nawab Asaf-ud-Daula in 1784 during famine relief." },
      { rank: 9, name: "Triveni Sangam", city: "Prayagraj", cat: "Sacred Confluence", desc: "Holy confluence of Ganga, Yamuna, and mythical Saraswati rivers, host to Kumbh Mela.", history: "Site of the world's largest religious gathering, the Maha Kumbh Mela." },
      { rank: 10, name: "Prem Mandir & Banke Bihari", city: "Vrindavan", cat: "Spiritual Shrine", desc: "White Italian marble temple adorned with light shows and Krishna leela carvings.", history: "Inaugurated in 2012 by Jagadguru Kripalu Parishat." }
    ]
  },
  "Uttarakhand": {
    type: "State",
    capital: "Dehradun",
    famousFood: "Kafuli, Bhattan ki Churkani, Aloo ke Gutke, Singori, Bal Mithai",
    culture: "Choliya sword dance, Nanda Devi Raj Jat Yatra, Ganga Aarti traditions",
    famousTemples: "Kedarnath, Badrinath, Gangotri, Yamunotri (Char Dham), Tungnath",
    traditionalClothes: "Pichora (bridal saree with red dots), Ghagri, Garhwali Kurta-Pajama",
    places: [
      { rank: 1, name: "Kedarnath & Badrinath (Char Dham)", city: "Rudraprayag / Chamoli", cat: "Sacred Himalayan Shrines", desc: "Revered Himalayan shrines set against snow peaks, key pillars of the Char Dham Yatra.", history: "Established by Adi Shankaracharya in 8th century CE." },
      { rank: 2, name: "Rishikesh Laxman Jhula & Ganga Aarti", city: "Rishikesh", cat: "Yoga Capital of World", desc: "Spiritual town famous for suspension bridges, yoga ashrams, and Ganga Aarti.", history: "Visited by The Beatles in 1968, sparking global yoga interest." },
      { rank: 3, name: "Har Ki Pauri Ghat", city: "Haridwar", cat: "Sacred Ganga Ghat", desc: "Revered riverfront ghat where celestial nectar drops fell during Samudra Manthan.", history: "Built by King Vikramaditya in 1st century BCE." },
      { rank: 4, name: "Naini Lake & Mall Road", city: "Nainital", cat: "Lake District Hill Station", desc: "Eye-shaped blue lake surrounded by 7 green mountains and sailboat rides.", history: "Discovered by British sugar merchant P. Barron in 1841." },
      { rank: 5, name: "Jim Corbett National Park", city: "Ramnagar", cat: "Oldest National Park", desc: "India's first national park famous for Royal Bengal Tigers and jeep safaris.", history: "Established in 1936 as Hailey National Park, renamed after Jim Corbett." },
      { rank: 6, name: "Mussoorie Kempty Falls", city: "Mussoorie", cat: "Queen of Hills", desc: "Colonial hill station featuring Kempty Falls, Gun Hill cable car, and Mall Road.", history: "Established by British military officer Captain Young in 1825." },
      { rank: 7, name: "Valley of Flowers & Hemkund Sahib", city: "Chamoli", cat: "UNESCO Alpine Valley", desc: "UNESCO alpine valley filled with 500 species of wild flowers and high altitude Sikh shrine.", history: "Discovered by British mountaineer Frank Smythe in 1931." },
      { rank: 8, name: "Auli Ski Resort & Cable Car", city: "Chamoli", cat: "Premier Ski Destination", desc: "Snowy slopes offering panoramic views of Nanda Devi peak and 4 km cable car rides.", history: "Originally developed as a training ground for Indo-Tibetan Border Police." },
      { rank: 9, name: "Tungnath & Chandrashila Peak", city: "Rudraprayag", cat: "Highest Shiva Temple", desc: "World's highest Shiva temple (12,073 ft) reached via scenic rhododendron treks.", history: "One of Panch Kedar temples built by Pandavas according to legend." },
      { rank: 10, name: "Tehri Dam & Lake Sports", city: "Tehri Garhwal", cat: "Highest Dam in India", desc: "Tallest dam in India (855 ft) creating a massive green lake for jet-skiing and kayaking.", history: "Constructed between 1978 and 2006 on Bhagirathi River." }
    ]
  },
  "West Bengal": {
    type: "State",
    capital: "Kolkata",
    famousFood: "Machher Jhol (Fish Curry), Rosogolla, Mishti Doi, Kosha Mangsho, Kolkata Kathi Roll",
    culture: "Durga Puja (UNESCO Heritage), Rabindra Sangeet, Baul music, Kantha embroidery",
    famousTemples: "Dakshineswar Kali Temple, Kalighat, Tarapith, Belur Math",
    traditionalClothes: "Garad & Tant Saree (White with red border), Dhoti-Panjabi",
    places: [
      { rank: 1, name: "Victoria Memorial & Maidan", city: "Kolkata", cat: "White Marble Palace", desc: "Grand white Italian marble monument surrounded by 64 acres of manicured gardens.", history: "Built between 1906 and 1921 in memory of Queen Victoria." },
      { rank: 2, name: "Howrah Bridge & Hooghly Ghats", city: "Kolkata", cat: "Iconic Cantilever Bridge", desc: "World famous 705-meter balanced cantilever bridge spanning the Hooghly River.", history: "Commissioned in 1943 without a single nut or bolt." },
      { rank: 3, name: "Darjeeling Tiger Hill & Toy Train", city: "Darjeeling", cat: "UNESCO Himalayan Railway", desc: "Queen of the Hills offering sunrise views over Kanchenjunga peak and toy train rides.", history: "Railway constructed between 1879 and 1881." },
      { rank: 4, name: "Sundarbans Mangrove Forest", city: "South 24 Parganas", cat: "UNESCO Delta & Tigers", desc: "World's largest mangrove forest delta home to swimming Royal Bengal Tigers.", history: "Declared a World Heritage Site in 1987." },
      { rank: 5, name: "Dakshineswar Kali Temple", city: "Kolkata", cat: "Navaratna Temple", desc: "19-spired temple on Hooghly banks associated with mystic saint Ramakrishna Paramahamsa.", history: "Founded by Rani Rashmoni in 1855." },
      { rank: 6, name: "Belur Math", city: "Howrah", cat: "Ramakrishna Mission HQ", desc: "Headquarters of Ramakrishna Math blending Hindu, Christian, and Islamic architecture.", history: "Founded by Swami Vivekananda in 1897." },
      { rank: 7, name: "Santiniketan Visva-Bharati", city: "Birbhum", cat: "UNESCO World Heritage Site", desc: "Open-air university town founded by Nobel Laureate Rabindranath Tagore.", history: "Established in 1901, inscribed as UNESCO World Heritage in 2023." },
      { rank: 8, name: "Digha & Mandarmani Beaches", city: "Purba Medinipur", cat: "Seaside Resorts", desc: "Popular beach resort town known for flat hard sand beaches and fresh seafood.", history: "Promoted by West Bengal's first Chief Minister Dr. B.C. Roy." },
      { rank: 9, name: "Hazarduari Palace & Museum", city: "Murshidabad", cat: "Palace of 1000 Doors", desc: "Imperial palace featuring 1,000 doors (900 false ones) built for Nawab Nazim Humayun Jah.", history: "Designed by Duncan Macleod and built between 1829 and 1837." },
      { rank: 10, name: "Indian Museum & Park Street", city: "Kolkata", cat: "Oldest Museum in Asia", desc: "Oldest and largest multipurpose museum in Asia featuring Egyptian mummies and Ashoka pillars.", history: "Founded by Asiatic Society of Bengal in 1814." }
    ]
  },

  // ================= 8 UNION TERRITORIES =================
  "Andaman and Nicobar Islands": {
    type: "Union Territory",
    capital: "Port Blair",
    famousFood: "Seafood Platter, Fish Curry, Coconut Prawn Curry, Grilled Lobster",
    culture: "Tribal heritage (Jarawa, Sentinelese, Onge), Island beach life & light shows",
    famousTemples: "Cellular Jail Memorial, Chidiyatapu Temple, Murugan Temple Port Blair",
    traditionalClothes: "Light cotton island resortwear & traditional tribal ornaments",
    places: [
      { rank: 1, name: "Cellular Jail National Memorial", city: "Port Blair", cat: "Freedom Memorial", desc: "Historic 7-winged colonial prison where Indian freedom fighters were exiled.", history: "Constructed by the British between 1896 and 1906." },
      { rank: 2, name: "Radhanagar Beach (Havelock)", city: "Swaraj Dweep (Havelock)", cat: "Asia's Best Beach", desc: "Pristine white sand turquoise beach voted among the finest beaches in Asia.", history: "Famous for crystal waters and lush mahua tree backdrop." },
      { rank: 3, name: "Elephant Beach Scuba Reef", city: "Havelock Island", cat: "Coral Reef & Snorkeling", desc: "Premier coral reef destination popular for sea walking, scuba diving, and kayaking.", history: "Renowned for rich marine life and colorful brain corals." },
      { rank: 4, name: "Ross Island (Netaji Subhash Dweep)", city: "Port Blair", cat: "Colonial Ruins & Deer", desc: "Historic island containing British colonial church & ballroom ruins overrun by wild deer.", history: "Former administrative headquarters of the British settlement." },
      { rank: 5, name: "Baratang Mud Volcano & Caves", city: "North & Middle Andaman", cat: "Limestone Caves", desc: "Unique mud volcanoes and naturally formed limestone cave passages.", history: "Reached via boat trip through dense mangrove creeks." },
      { rank: 6, name: "Chidiyatapu Sunset Point", city: "Port Blair", cat: "Bird Island & Sunset", desc: "Southernmost tip of South Andaman famous for birdwatching and golden sunsets.", history: "Home to biological park preserving island endemic flora." },
      { rank: 7, name: "Neil Island (Shaheed Dweep)", city: "Neil Island", cat: "Natural Rock Bridge", desc: "Tranquil island famous for Laxmanpur Beach, Bharatpur Beach, and natural rock arch.", history: "Named after British Brigadier General James George Smith Neill." },
      { rank: 8, name: "Mount Harriet National Park", city: "South Andaman", cat: "Highest Peak & Wildlife", desc: "Featured on 20-rupee note, offering views of Ross Island and saltwater crocodile habitat.", history: "Summer headquarters of Chief Commissioner during British era." },
      { rank: 9, name: "North Bay Island", city: "Port Blair", cat: "Lighthouse Island", desc: "Coral island featuring the famous lighthouse depicted on the Indian Rs 20 banknote.", history: "Major water sports hub close to Port Blair." },
      { rank: 10, name: "Wandoor Beach & Marine Park", city: "Port Blair", cat: "Mahatma Gandhi Marine Park", desc: "Coral beach gateway to 15 uninhabited tropical islands.", history: "Declared a Marine National Park in 1983." }
    ]
  },
  "Chandigarh": {
    type: "Union Territory",
    capital: "Chandigarh",
    famousFood: "Chana Bhatura, Amritsari Kulcha, Paneer Tikka, Lassi, Tandoori Chicken",
    culture: "Modern planned architectural city culture, Rose Festival, Lake boat life",
    famousTemples: "Chandi Mandir (City Name Origin), Mansa Devi Nearby, Rock Garden",
    traditionalClothes: "Modern Western wear, Phulkari Dupattas & Kurta Pyjama",
    places: [
      { rank: 1, name: "Rock Garden of Le Corbusier", city: "Sector 1", cat: "UNESCO Eco Art Park", desc: "World famous 40-acre sculpture garden built entirely from industrial urban waste.", history: "Created secretly by Nek Chand starting in 1957." },
      { rank: 2, name: "Sukhna Lake", city: "Sector 1", cat: "Man-made Sanctuary Lake", desc: "3 km long pristine lake at the foot of Shivalik hills, popular for boating and morning walks.", history: "Created in 1958 by damming the Sukhna Choe stream." },
      { rank: 3, name: "Zakir Hussain Rose Garden", city: "Sector 16", cat: "Asia's Largest Rose Garden", desc: "30-acre botanical garden containing 1,600 varieties of roses and medicinal plants.", history: "Established in 1967 under Chief Commissioner M.S. Randhawa." },
      { rank: 4, name: "Capitol Complex (UNESCO)", city: "Sector 1", cat: "UNESCO Modern Architecture", desc: "Government complex featuring the Open Hand Monument, Secretariat, High Court, and Legislative Assembly.", history: "Designed by Swiss-French architect Le Corbusier in 1950s." },
      { rank: 5, name: "Elante Mall & Shopping Hub", city: "Industrial Area Phase 1", cat: "Shopping & Dining", desc: "Largest shopping mall in Northern India featuring international outlets and multiplexes.", history: "Opened in 2013 spanning 20 acres." },
      { rank: 6, name: "Government Museum & Art Gallery", city: "Sector 10", cat: "Gandhara Sculptures", desc: "Museum housing premier collections of Gandhara Buddhist sculptures and Pahari miniature art.", history: "Designed by Le Corbusier, opened in 1968." },
      { rank: 7, name: "Japanese Garden", city: "Sector 31", cat: "Theme Garden", desc: "Park built with traditional Japanese architecture including pagoda towers and waterfalls.", history: "Inaugurated in 2014 by Chandigarh Administration." },
      { rank: 8, name: "Chandi Mandir Temple", city: "Chandi Mandir", cat: "City Name Origin", desc: "Ancient temple dedicated to Goddess Chandi from which the city 'Chandigarh' derives its name.", history: "Located 15 km from city center near Shivalik hills." },
      { rank: 9, name: "Pinjore Yadavindra Gardens", city: "Near Chandigarh", cat: "7-Terrace Mughal Garden", desc: "Historic 17th-century Mughal garden complex featuring illuminated fountains.", history: "Built by Mughal architect Fadai Khan." },
      { rank: 10, name: "Terraced Garden", city: "Sector 33", cat: "Chrysanthemum Show Grounds", desc: "Beautifully landscaped terraced park host to the annual Chrysanthemum Flower Show.", history: "Established in 1979." }
    ]
  },
  "Dadra and Nagar Haveli and Daman and Diu": {
    type: "Union Territory",
    capital: "Daman",
    famousFood: "Chicken Bullet, Seafood Curry, Damanese Fish Fry, Cozido, Jet-Ski Cocktails",
    culture: "Indo-Portuguese fusion beach culture, Nani Daman Fort heritage, Garba festivals",
    famousTemples: "St. Jerome Fort Church, Cathedral of Bom Jesus, Somnath Mahadev Temple",
    traditionalClothes: "Indo-Portuguese casual wear, Gujarati Bandhani Sarees",
    places: [
      { rank: 1, name: "Moti Daman Fort & Cathedral", city: "Daman", cat: "16th-Century Portuguese Fort", desc: "Massive Portuguese fortress enclosing 10-sailed bastions and the Cathedral of Bom Jesus.", history: "Built by Portuguese in 1559 to protect against Mughal armies." },
      { rank: 2, name: "Devka Beach & Amusement Park", city: "Daman", cat: "Urban Beach & Fountains", desc: "Black sand beach featuring a seaside promenade with musical fountains.", history: "Popularized as Daman's primary recreational beach." },
      { rank: 3, name: "Jampore Beach", city: "Daman", cat: "Quiet Water Sports Beach", desc: "Casuarina-lined quiet beach famous for parasailing, buggy rides, and shallow waters.", history: "Renowned as Daman's best beach for swimming." },
      { rank: 4, name: "Diu Fort & Lighthouse", city: "Diu", cat: "Oceanfront Citadel", desc: "Colossal Portuguese castle fortress surrounded by Arabian Sea on three sides.", history: "Constructed between 1535 and 1541 following defense treaty." },
      { rank: 5, name: "Nagoa Beach", city: "Diu", cat: "Horseshoe Beach", desc: "Famous horseshoe-shaped palm beach known for unique African Hoka palm trees.", history: "Hoka palm trees brought by Portuguese from Africa." },
      { rank: 6, name: "Naida Caves", city: "Diu", cat: "Geological Labyrinth Caves", desc: "Natural rock-cut cave labyrinth with sunlight beams breaking through ceiling openings.", history: "Formed when Portuguese excavated stone for fort construction." },
      { rank: 7, name: "St. Paul's Church", city: "Diu", cat: "Gothic Portuguese Church", desc: "Gothic church known for intricate wood carvings and baroque facade.", history: "Completed in 1610, dedicated to Our Lady of Immaculate Conception." },
      { rank: 8, name: "Vanganga Lake Garden", city: "Silvassa (Dadra)", cat: "Island Lake Park", desc: "Japanese-style island garden set in the middle of Vanganga Lake with wooden bridges.", history: "Constructed by Dadra & Nagar Haveli tourism department." },
      { rank: 9, name: "Dudhani End & Boating", city: "Silvassa", cat: "Water Sports Lake", desc: "Massive water body formed by Madhuban Dam surrounded by forested hills.", history: "Known as the 'Kashmir of Dadra'." },
      { rank: 10, name: "Tribal Cultural Museum", city: "Silvassa", cat: "Tribal Heritage Museum", desc: "Museum showcasing life, masks, hunting tools, and musical instruments of Warli and Dhodia tribes.", history: "Established to preserve indigenous heritage of Dadra and Nagar Haveli." }
    ]
  },
  "Delhi": {
    type: "Union Territory",
    capital: "New Delhi",
    famousFood: "Chole Bhature, Butter Chicken, Paranthe (Chandni Chowk), Momos, Nihari",
    culture: "Multicultural Capital, Qutub Festival, Dilli Haat craft bazaars",
    famousTemples: "Akshardham Temple, Lotus Temple, Jama Masjid, Gurudwara Bangla Sahib",
    traditionalClothes: "Modern cosmopolitan wear, Designer Sarees & Sherwanis",
    places: [
      { rank: 1, name: "Red Fort (Lal Qila)", city: "Old Delhi", cat: "UNESCO Mughal Fort", desc: "Imperial red sandstone fortress built by Mughal Emperor Shah Jahan in 1648.", history: "Served as main Mughal seat and site of Prime Minister's Independence Day speech." },
      { rank: 2, name: "Qutub Minar & Complex", city: "Mehrauli", cat: "UNESCO World Minaret", desc: "UNESCO 73-meter brick minaret built in 1192 surrounded by ancient Iron Pillar ruins.", history: "Started by Qutb-ud-din Aibak to celebrate victory of Delhi Sultanate." },
      { rank: 3, name: "Humayun's Tomb", city: "Nizamuddin", cat: "UNESCO Garden Tomb", desc: "Precursor to the Taj Mahal, showcasing magnificent Mughal garden tomb architecture.", history: "Commissioned by Humayun's chief consort Bega Begum in 1558." },
      { rank: 4, name: "India Gate & Kartavya Path", city: "New Delhi", cat: "National War Memorial", desc: "42-meter war memorial arch honoring 84,000 Indian soldiers, flanked by lush lawns.", history: "Designed by Sir Edwin Lutyens and inaugurated in 1931." },
      { rank: 5, name: "Lotus Temple (Bahá'í House)", city: "Kalkaji", cat: "Architectural Wonder", desc: "Pure white marble flower-shaped temple open to all faiths for silent meditation.", history: "Designed by Fariborz Sahba and completed in 1986." },
      { rank: 6, name: "Akshardham Temple", city: "East Delhi", cat: "Grand Hindu Complex", desc: "World's largest comprehensive Hindu temple showcasing Indian culture, carvings & fountain show.", history: "Inaugurated in 2005 by Pramukh Swami Maharaj." },
      { rank: 7, name: "Jama Masjid & Chandni Chowk", city: "Old Delhi", cat: "Historic Mosque & Bazaar", desc: "Largest mosque in India overlooking historic bazaars and street food lanes.", history: "Built by Shah Jahan between 1644 and 1656." },
      { rank: 8, name: "Rashtrapati Bhavan & Amrit Udyan", city: "New Delhi", cat: "Presidential Palace", desc: "340-room presidential residence featuring Mughal Gardens with hundreds of rose varieties.", history: "Designed by Edwin Lutyens as Viceroy's House." },
      { rank: 9, name: "Lodhi Gardens & Tombs", city: "Lodhi Estate", cat: "Heritage Park", desc: "90-acre city park containing 15th-century Sayyid and Lodhi dynasty tombs.", history: "Landscaped by Lady Willingdon in 1936." },
      { rank: 10, name: "Gurudwara Bangla Sahib", city: "Connaught Place", cat: "Sacred Sikh Temple", desc: "Prominent Sikh temple known for its golden dome, holy pond (Sarovar), and mega community kitchen (Langar).", history: "Originally a bungalow belonging to Raja Jai Singh of Amber in 17th century." }
    ]
  },
  "Jammu and Kashmir": {
    type: "Union Territory",
    capital: "Srinagar (Summer) / Jammu (Winter)",
    famousFood: "Wazwan (Rista, Rogan Josh), Kahwa Tea, Modur Pulao, Kaladi Cheese, Sheermal",
    culture: "Rouf folk dance, Shikara houseboats, Pashmina shawl weaving & Walnut wood carving",
    famousTemples: "Vaishno Devi Temple (Katra), Amarnath Cave Temple, Shankaracharya Temple, Hazratbal",
    traditionalClothes: "Pheran with Tilla embroidery, Kasaba cap & Kashmiri Pashmina Shawls",
    places: [
      { rank: 1, name: "Dal Lake & Houseboats", city: "Srinagar", cat: "Jewel of Srinagar", desc: "Famous lake featuring wooden Shikara boat rides, floating vegetable markets, and carved houseboats.", history: "Mentioned as Ishtapatha in ancient Sanskrit texts." },
      { rank: 2, name: "Gulmarg Gondola & Ski Resort", city: "Baramulla", cat: "High Altitude Cable Car", desc: "Premier skiing destination featuring world's 2nd highest cable car (13,780 ft).", history: "Named 'Meadow of Flowers' by Sultan Yusuf Shah in 16th century." },
      { rank: 3, name: "Vaishno Devi Temple", city: "Katra / Jammu", cat: "Sacred Holy Cave", desc: "Revered cave shrine in Trikuta mountains visited by millions of devotees annually.", history: "Holy cave shrine associated with Goddess Vaishnavi." },
      { rank: 4, name: "Pahalgam & Betaab Valley", city: "Anantnag", cat: "Valley of Shepherds", desc: "Alpine valley on Lidder River, starting point for Amarnath Yatra trek.", history: "Named Betaab valley after the Bollywood film 'Betaab' shot here." },
      { rank: 5, name: "Sonamarg (Meadow of Gold)", city: "Ganderbal", cat: "Glacier Valley", desc: "High alpine valley with Thajiwas Glacier and trout-filled Sind River.", history: "Gateway to the ancient Silk Route connecting Kashmir to Ladakh." },
      { rank: 6, name: "Shankaracharya Temple", city: "Srinagar", cat: "Hilltop Shiva Temple", desc: "Historic stone temple at 1,000 feet above Srinagar offering panoramic city views.", history: "Visited by Adi Shankaracharya in 9th century CE." },
      { rank: 7, name: "Mughal Gardens (Shalimar & Nishat)", city: "Srinagar", cat: "UNESCO Mughal Garden", desc: "Terraced gardens with cascading fountains overlooking Dal Lake.", history: "Shalimar Bagh built by Emperor Jahangir for Empress Nur Jahan in 1619." },
      { rank: 8, name: "Indira Gandhi Tulip Garden", city: "Srinagar", cat: "Asia's Largest Tulip Garden", desc: "74-acre garden boasting 1.5 million tulips in 48 varieties overlooking Dal Lake.", history: "Opened in 2007 to boost spring tourism in Kashmir." },
      { rank: 9, name: "Amarnath Cave Shrine", city: "Anantnag", cat: "Sacred Ice Lingam", desc: "High altitude cave at 12,756 ft where an ice stalagmite natural Shiva Lingam forms every summer.", history: "Revered in Hindu lore as the cave where Lord Shiva revealed secret of immortality." },
      { rank: 10, name: "Patnitop & Chenani-Nashri Tunnel", city: "Udhampur", cat: "Pine Hill Resort", desc: "Scenic hilltop plateau surrounded by dense pine forests and snow slopes.", history: "Originally named 'Patan Da Tal' meaning Pond of the Princess." }
    ]
  },
  "Ladakh": {
    type: "Union Territory",
    capital: "Leh",
    famousFood: "Skyu, Thukpa, Butter Tea (Gur Gur Tsampa), Khambir bread, Chhurpi",
    culture: "Cham Masked monastic dance, Hemis Tsechu festival, Ladakhi Losar, Archery & Polo",
    famousTemples: "Hemis Monastery, Thiksey Monastery, Shanti Stupa, Diskit Monastery",
    traditionalClothes: "Goncha (heavy wool coat) with Perak turquoise headgear",
    places: [
      { rank: 1, name: "Pangong Tso Lake", city: "Leh", cat: "High Altitude Saltwater Lake", desc: "World famous 134-km long endorheic lake changing colors from blue to turquoise.", history: "Located at 14,270 ft altitude, spanning India and China." },
      { rank: 2, name: "Nubra Valley & Hunder Sand Dunes", city: "Nubra", cat: "Double-Humped Camel Desert", desc: "Cold mountain desert famous for Bactrian double-humped camel rides and Diskit Monastery.", history: "Key ancient Silk Route stopover between Tibet and Turkestan." },
      { rank: 3, name: "Thiksey Monastery", city: "Leh", cat: "12-Story Potala Replica", desc: "Imposing 12-story red & white monastery featuring 49-foot Maitreya Future Buddha statue.", history: "Founded by Gelugpa order in 15th century." },
      { rank: 4, name: "Shanti Stupa", city: "Leh", cat: "White Peace Pagoda", desc: "White-domed stupa on Changspa hilltop offering panoramic Leh valley views.", history: "Built in 1991 by Japanese Buddhist Bhikshu Gyomyo Nakamura." },
      { rank: 5, name: "Leh Palace", city: "Leh", cat: "9-Story Royal Palace", desc: "9-story dun-colored palace modeling Tibet's Potala Palace.", history: "Built by King Sengge Namgyal in 1600 AD." },
      { rank: 6, name: "Magnetic Hill", city: "Leh", cat: "Optical Illusion Hill", desc: "Gravity hill stretch on Leh-Kargil highway where vehicles appear to roll uphill.", history: "Renowned tourist wonder caused by surrounding land layout." },
      { rank: 7, name: "Hemis Monastery & Museum", city: "Leh", cat: "Largest Monastery in Ladakh", desc: "Wealthiest Tibetan monastery famous for 2-day Hemis festival and giant Thangka.", history: "Re-established in 1672 by King Sengge Namgyal." },
      { rank: 8, name: "Tso Moriri Lake", city: "Changthang", cat: "RAMSAR High Lake", desc: "High altitude freshwater lake (14,836 ft) sanctuary for migratory black-necked cranes.", history: "Sacred lake of the nomadic Changpa tribe." },
      { rank: 9, name: "Khardung La Pass", city: "Leh", cat: "World's Highest Motorable Pass", desc: "Iconic mountain pass at 17,582 ft connecting Leh to Nubra Valley.", history: "Opened to public motor vehicles in 1988." },
      { rank: 10, name: "Kargil & Zojila Pass", city: "Kargil", cat: "National War Memorial", desc: "Historic town and Dras War Memorial honoring 1999 Kargil War heroes.", history: "Strategic gateway connecting Kashmir valley to Ladakh." }
    ]
  },
  "Lakshadweep": {
    type: "Union Territory",
    capital: "Kavaratti",
    famousFood: "Mus Kavaab (Tuna Kebab), Fish Tikka, Coconut Bondas, Kadalakka, Octopus Fry",
    culture: "Lava Folk Dance, Parichakali martial art, Coral island eco-traditions",
    famousTemples: "Ujra Mosque (Kavaratti), Marine Aquarium, Agatti Atoll Reefs",
    traditionalClothes: "Kachi (wraparound cloth) & Thattam scarf for women",
    places: [
      { rank: 1, name: "Agatti Island & Lagoon", city: "Agatti", cat: "Gateway Coral Atoll", desc: "6 km long coral island featuring turquoise lagoons, airstrip, and scuba diving.", history: "Main gateway island with Lakshadweep's only airport." },
      { rank: 2, name: "Bangaram Atoll & Resort", city: "Bangaram", cat: "Uninhabited Paradise", desc: "Teardrop-shaped uninhabited coral island surrounded by shallow turquoise lagoons.", history: "Renowned global international diving destination." },
      { rank: 3, name: "Kavaratti Island & Ujra Mosque", city: "Kavaratti", cat: "Capital & Marine Aquarium", desc: "Capital island featuring 17th-century carved Ujra Mosque and Marine Aquarium.", history: "Mosque constructed by Sheikh Mohammad Kasim in 17th century." },
      { rank: 4, name: "Kadmat Island Water Sports", city: "Kadmat", cat: "Long Lagoon & Diving", desc: "Cardamom island featuring long pristine white sand beaches and water sports complex.", history: "Famous for rich sea turtle nesting grounds." },
      { rank: 5, name: "Minicoy Island & Lighthouse", city: "Minicoy", cat: "Southernmost Atoll & Tower", desc: "Crescent-shaped island featuring 300-foot brick lighthouse built by British in 1885.", history: "Has unique Mahl language & culture close to Maldives." },
      { rank: 6, name: "Kalpeni Island & Coral Debris", city: "Kalpeni", cat: "Giant Coral Storm Bank", desc: "Island famous for massive storm bank of coral debris along its eastern shoreline.", history: "Storm bank formed during a severe cyclone in 1847." },
      { rank: 7, name: "Thinnakara Island", city: "Thinnakara", cat: "Secluded Coral Islet", desc: "Secluded uninhabited islet opposite Bangaram, popular for night kayaking and bioluminescence.", history: "Preserved eco-tourism coral islet." },
      { rank: 8, name: "Pittie Bird Sanctuary", city: "Pittie Island", cat: "Uninhabited Bird Islet", desc: "Uninhabited sand spit island breeding ground for sooty terns and sea birds.", history: "Declared a bird sanctuary under Wildlife Protection Act." },
      { rank: 9, name: "Andrott Island & Tomb", city: "Andrott", cat: "Largest Island", desc: "Largest island in Lakshadweep housing Saint Ubaidullah's tomb who introduced Islam.", history: "First island to convert to Islam in 7th century." },
      { rank: 10, name: "Chetlat & Bitra Atolls", city: "Chetlat", cat: "Northern Atolls", desc: "Smallest inhabited islands known for coir weaving and turtle nesting reefs.", history: "Historic fishing and coir making outpost." }
    ]
  },
  "Puducherry": {
    type: "Union Territory",
    capital: "Puducherry",
    famousFood: "Crepes & Croissants, French Onion Soup, Pondicherry Fish Curry, Baguettes, Ratatouille",
    culture: "French Colonial Heritage, Sri Aurobindo Ashram spiritual movement, International Yoga Festival",
    famousTemples: "Manakula Vinayagar Temple, Sacred Heart Basilica, Matrimandir (Auroville)",
    traditionalClothes: "Indo-French resort wear, Cotton Sarees with French lace caps",
    places: [
      { rank: 1, name: "Promenade Beach & Rock Beach", city: "Puducherry", cat: "French Riviera Promenade", desc: "1.2 km seafront boulevard featuring French colonial heritage buildings and Gandhi Statue.", history: "Frontier French colonial port city established in 1674." },
      { rank: 2, name: "Auroville & Matrimandir", city: "Auroville", cat: "International Experimental City", desc: "Global township featuring golden sphere Matrimandir meditation hall.", history: "Founded in 1968 by Mirra Alfassa ('The Mother') and designed by Roger Anger." },
      { rank: 3, name: "French Quarter (White Town)", city: "Puducherry", cat: "French Colonial Streets", desc: "Heritage neighborhood featuring yellow mustard villas, bougainvillea lanes, and French cafes.", history: "Preserves 18th-century French East India Company architecture." },
      { rank: 4, name: "Sri Aurobindo Ashram", city: "Puducherry", cat: "Spiritual Ashram", desc: "Spiritual community ashram housing the Samadhi of Sri Aurobindo and The Mother.", history: "Founded by Sri Aurobindo Ghose in 1926." },
      { rank: 5, name: "Paradise Beach (Chunnambar)", city: "Chunnambar", cat: "Island Beach & Boat Ride", desc: "Secluded golden sand beach reached via backwater boat ride along Chunnambar River.", history: "Developed as Pondicherry's premier water sports beach." },
      { rank: 6, name: "Basilica of the Sacred Heart of Jesus", city: "Puducherry", cat: "Gothic Revival Basilica", desc: "100-year-old Gothic revival church featuring rare stained glass panels depicting Jesus' life.", history: "Consecrated in 1907 by French missionaries." },
      { rank: 7, name: "Arulmigu Manakula Vinayagar Temple", city: "Puducherry", cat: "500-Year-Old Ganesha Temple", desc: "Historic temple dedicated to Lord Ganesha, famous for gold-chariot procession.", history: "Pre-dates French arrival in 1674; elephant Lakshmi blessed visitors here." },
      { rank: 8, name: "Arikamedu Archaeological Ruins", city: "Puducherry", cat: "Ancient Roman Trading Port", desc: "Excavated Roman trading port revealing amphorae jars and Roman coins from 2nd century BCE.", history: "Excavated by Sir Mortimer Wheeler in 1940s." },
      { rank: 9, name: "Serenity Beach", city: "Kottakuppam", cat: "Surfing Beach", desc: "Quiet sandy beach popular for surfing schools and fresh seafood shacks.", history: "Famous battle site during 1760 Anglo-French Carnatic Wars." },
      { rank: 10, name: "Pondicherry Museum", city: "White Town", cat: "French Heritage Museum", desc: "Museum housing French governor's bed, carriages, Arikamedu Roman relics, and Chola bronzes.", history: "Located in historic Law de Lauriston building." }
    ]
  }
};


// Helper function to resolve destination-specific Best Time to Visit and Best Season
export function getBestTimeAndSeason(place, stateName = '') {
  if (place && place.bestTime && place.bestSeason) {
    return { bestTime: place.bestTime, bestSeason: place.bestSeason };
  }

  const name = ((place?.name || '') + ' ' + (place?.cat || '') + ' ' + (place?.desc || '')).toLowerCase();
  const st = (stateName || '').toLowerCase();

  // High Himalayas & Cold Deserts
  if (st.includes('ladakh') || st.includes('spiti') || name.includes('pass') || name.includes('glacier') || name.includes('high altitude') || name.includes('snow')) {
    return { bestTime: 'May – September', bestSeason: 'Summer & Autumn' };
  }

  // Hill Stations & Mountain Ranges
  if (st.includes('himachal') || st.includes('uttarakhand') || st.includes('sikkim') || st.includes('kashmir') || name.includes('hill') || name.includes('valley') || name.includes('peak')) {
    return { bestTime: 'March – June & December – February (Snow)', bestSeason: 'Summer & Winter' };
  }

  // Beaches, Coastline & Islands
  if (st.includes('goa') || st.includes('andaman') || st.includes('lakshadweep') || name.includes('beach') || name.includes('coast') || name.includes('island') || name.includes('sea')) {
    return { bestTime: 'November – February', bestSeason: 'Winter & Spring' };
  }

  // South India / Backwaters / Deccan Plateau
  if (st.includes('kerala') || st.includes('andhra') || st.includes('tamil') || st.includes('telangana') || st.includes('karnataka') || st.includes('puducherry')) {
    return { bestTime: 'September – February', bestSeason: 'Winter & Post-Monsoon' };
  }

  // Desert, Heritage Plains & Central India
  if (st.includes('rajasthan') || st.includes('gujarat') || st.includes('madhya') || st.includes('uttar pradesh') || st.includes('delhi') || st.includes('bihar') || st.includes('punjab') || st.includes('haryana')) {
    return { bestTime: 'October – March', bestSeason: 'Winter & Autumn' };
  }

  // Northeast States
  if (st.includes('assam') || st.includes('meghalaya') || st.includes('arunachal') || st.includes('manipur') || st.includes('nagaland') || st.includes('tripura') || st.includes('mizoram')) {
    return { bestTime: 'October – April', bestSeason: 'Winter & Spring' };
  }

  return { bestTime: 'October – March', bestSeason: 'Winter & Autumn' };
}
