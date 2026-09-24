import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getNearbyServices, getDestinations } from '../api/api';
import GuideMe from '../components/GuideMe';
import MapView from '../components/MapView';
import TrustBadge from '../components/TrustBadge';
import { MapPin, Navigation, Compass, RefreshCw, CheckCircle, Flag, Map, ExternalLink, Search, Sparkles, Layers } from 'lucide-react';
import { getLiveLocation, watchLiveLocation, searchLocationByName } from '../utils/geolocation';
import '../styles/guide.css';

// Fallback coordinate dictionary for major tourist destinations & cities across India
const CITY_COORDINATES = {
  "Jaipur": { lat: 26.9124, lng: 75.7873 },
  "Amer Fort & Sheesh Mahal": { lat: 26.9855, lng: 75.8513 },
  "Hawa Mahal (Palace of Winds)": { lat: 26.9239, lng: 75.8267 },
  "Taj Mahal": { lat: 27.1751, lng: 78.0421 },
  "Agra": { lat: 27.1767, lng: 78.0081 },
  "Varanasi": { lat: 25.3176, lng: 82.9739 },
  "Kashi Vishwanath Temple & Ghats": { lat: 25.3109, lng: 83.0107 },
  "Tirupati": { lat: 13.6288, lng: 79.4192 },
  "Sri Venkateswara Temple": { lat: 13.6833, lng: 79.3472 },
  "Goa": { lat: 15.2993, lng: 74.1240 },
  "Baga & Calangute Coast": { lat: 15.5553, lng: 73.7517 },
  "Fort Aguada & Lighthouse": { lat: 15.4927, lng: 73.7737 },
  "Hyderabad": { lat: 17.3850, lng: 78.4867 },
  "Charminar & Laad Bazaar": { lat: 17.3616, lng: 78.4747 },
  "Delhi": { lat: 28.6139, lng: 77.2090 },
  "Red Fort (Lal Qila)": { lat: 28.6562, lng: 77.2410 },
  "Mumbai": { lat: 19.0760, lng: 72.8777 },
  "Gateway of India & Taj Hotel": { lat: 18.9220, lng: 72.8347 },
  "Amritsar": { lat: 31.6340, lng: 74.8723 },
  "Golden Temple (Harmandir Sahib)": { lat: 31.6200, lng: 74.8765 },
  "Kochi": { lat: 9.9312, lng: 76.2673 },
  "Alleppey Houseboats & Backwaters": { lat: 9.4981, lng: 76.3388 },
  "Munnar Tea Gardens": { lat: 10.0889, lng: 77.0595 },
  "Udaipur": { lat: 24.5854, lng: 73.7125 },
  "City Palace & Lake Pichola": { lat: 24.5764, lng: 73.6835 },
  "Mysuru": { lat: 12.2958, lng: 76.6394 },
  "Mysore Palace & Chamundi Hill": { lat: 12.3052, lng: 76.6552 },
  "Hampi Vijayanagara Ruins": { lat: 15.3350, lng: 76.4600 },
  "Shimla": { lat: 31.1048, lng: 77.1734 },
  "Rishikesh": { lat: 30.0869, lng: 78.2676 },
  "Srinagar": { lat: 34.0837, lng: 74.7973 },
  "Leh": { lat: 34.1526, lng: 77.5771 },
  "Kolkata": { lat: 22.5726, lng: 88.3639 },
  "Chennai": { lat: 13.0827, lng: 80.2707 },
  "Madurai": { lat: 9.9252, lng: 78.1198 },
  "Meenakshi Amman Temple": { lat: 9.9195, lng: 78.1193 },
  "Visakhapatnam": { lat: 17.6868, lng: 83.2185 },
  "RK Beach Visakhapatnam": { lat: 17.7100, lng: 83.3175 }
};

// Calculate Haversine distance in km / meters
function getHaversineDistance(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return null;
  const R = 6371; // km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const dist = R * c;
  return dist < 1 ? `${(dist * 1000).toFixed(0)} meters` : `${dist.toFixed(1)} km`;
}

export default function Guide({ user }) {
  const routerLocation = useLocation();
  const initialCategory = routerLocation.state?.category || 'All';
  const initialCity = routerLocation.state?.city || routerLocation.state?.destination || routerLocation.state?.destinationName || routerLocation.state?.place?.city || routerLocation.state?.place?.name || 'NEAR_ME';
  const initialDestName = routerLocation.state?.destinationName || routerLocation.state?.destination || routerLocation.state?.place?.name || (initialCity === 'NEAR_ME' ? 'Your Live Location' : initialCity);

  const [destinations, setDestinations] = useState([]);
  const [selectedCity, setSelectedCity] = useState(initialCity);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [requestedDestName, setRequestedDestName] = useState(initialDestName);
  
  const [customSearchInput, setCustomSearchInput] = useState('');
  const [customCoords, setCustomCoords] = useState(null);
  const [searchingDest, setSearchingDest] = useState(false);

  // Facilities scope: 'BOTH' (show in both live location & destination), 'LIVE_GPS', 'DESTINATION'
  const [facilityScope, setFacilityScope] = useState('BOTH');

  const [userLocation, setUserLocation] = useState(null);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [gpsStatus, setGpsStatus] = useState('Detecting Live GPS location...');
  const [isLiveTracking, setIsLiveTracking] = useState(false);

  useEffect(() => {
    loadDestinations();
    detectLocation();
  }, []);

  useEffect(() => {
    const st = routerLocation.state;
    if (st) {
      const cityVal = st.city || st.destination || st.destinationName || st.place?.city || st.place?.name;
      if (cityVal && cityVal !== 'NEAR_ME') {
        setSelectedCity(cityVal);
        setRequestedDestName(st.destinationName || st.place?.name || cityVal);
        if (st.destLat && st.destLng) {
          setCustomCoords({ lat: Number(st.destLat), lng: Number(st.destLng) });
        }
      }
      if (st.category) {
        setSelectedCategory(st.category);
      }
    }
  }, [routerLocation.state]);

  const loadDestinations = async () => {
    try {
      const list = await getDestinations();
      if (Array.isArray(list)) {
        setDestinations(list);
      }
    } catch (e) {
      console.error('Failed to load destinations in Guide page:', e);
    }
  };

  // Resolve target destination coordinates dynamically
  const resolveDestinationCoords = () => {
    if (selectedCity === 'NEAR_ME' || selectedCity === 'All India') {
      if (userLocation && userLocation.lat && userLocation.lng) {
        return { lat: userLocation.lat, lng: userLocation.lng, name: 'Your Live Position', city: 'Near You' };
      }
    }

    if (customCoords) {
      return { lat: customCoords.lat, lng: customCoords.lng, name: requestedDestName, city: selectedCity };
    }

    if (routerLocation.state?.destLat && routerLocation.state?.destLng) {
      return {
        lat: Number(routerLocation.state.destLat),
        lng: Number(routerLocation.state.destLng),
        name: requestedDestName,
        city: selectedCity
      };
    }

    if (CITY_COORDINATES[requestedDestName]) {
      return { ...CITY_COORDINATES[requestedDestName], name: requestedDestName, city: selectedCity };
    }
    if (CITY_COORDINATES[selectedCity]) {
      return { ...CITY_COORDINATES[selectedCity], name: requestedDestName, city: selectedCity };
    }

    const matchedDest = destinations.find(d => 
      d.name.toLowerCase() === requestedDestName.toLowerCase() || 
      d.name.toLowerCase() === selectedCity.toLowerCase()
    );

    if (matchedDest && matchedDest.latitude && matchedDest.longitude) {
      return { lat: matchedDest.latitude, lng: matchedDest.longitude, name: matchedDest.name, city: matchedDest.city || selectedCity };
    }

    if (userLocation && userLocation.lat) {
      return { lat: userLocation.lat, lng: userLocation.lng, name: 'Your Live Position', city: 'Near You' };
    }
    return { lat: 26.9124, lng: 75.7873, name: requestedDestName, city: selectedCity };
  };

  const destinationLocation = resolveDestinationCoords();

  const currentCenter = userLocation 
    ? [userLocation.lat, userLocation.lng] 
    : [destinationLocation.lat, destinationLocation.lng];

  const calculatedDistance = userLocation && destinationLocation && destinationLocation.name !== 'Your Live Position'
    ? getHaversineDistance(userLocation.lat, userLocation.lng, destinationLocation.lat, destinationLocation.lng)
    : null;

  useEffect(() => {
    fetchServices();
  }, [selectedCategory, selectedCity, customCoords, userLocation, facilityScope]);

  useEffect(() => {
    let watchId = null;
    if (isLiveTracking) {
      watchId = watchLiveLocation(
        (loc) => setUserLocation(loc),
        (err) => console.warn('Live watch error:', err),
        (status) => setGpsStatus(status)
      );
    }
    return () => {
      if (watchId !== null && navigator.geolocation) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [isLiveTracking]);

  const detectLocation = () => {
    setIsLiveTracking(true);
    getLiveLocation(
      (loc) => {
        setUserLocation(loc);
        setGpsStatus(`🎯 Live GPS Connected (${loc.lat.toFixed(4)}, ${loc.lng.toFixed(4)})`);
      },
      (error) => {
        console.warn('GPS Error/Denied:', error.message);
        const fallbackLoc = { lat: 16.5062, lng: 80.6480, source: 'Andhra Pradesh Fallback' };
        setUserLocation(fallbackLoc);
        setGpsStatus(`📍 Click "Allow Live Location" above to sync device GPS`);
      },
      (status) => setGpsStatus(status)
    );
  };

  const handleMapClick = (coords) => {
    setIsLiveTracking(false);
    setUserLocation(coords);
    setGpsStatus(`🎯 Manual Pin Set (${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)})`);
  };

  const handleCityChange = (newCity) => {
    setSelectedCity(newCity);
    setCustomCoords(null);
    if (newCity === 'NEAR_ME') {
      setRequestedDestName('Your Live Position');
    } else {
      setRequestedDestName(newCity);
    }
    setGpsStatus(`📍 Target Destination: ${newCity === 'NEAR_ME' ? 'Near My Live GPS' : newCity}`);
  };

  const handleCustomDestSearch = async (e) => {
    if (e) e.preventDefault();
    const query = customSearchInput.trim();
    if (!query) return;

    setSearchingDest(true);
    setGpsStatus(`🔎 Searching destination "${query}"...`);

    if (CITY_COORDINATES[query]) {
      setCustomCoords(CITY_COORDINATES[query]);
      setRequestedDestName(query);
      setSelectedCity(query);
      setGpsStatus(`🎯 Target Destination set: ${query}`);
      setSearchingDest(false);
      return;
    }

    const matched = destinations.find(d => 
      d.name.toLowerCase().includes(query.toLowerCase()) || 
      (d.city && d.city.toLowerCase().includes(query.toLowerCase()))
    );

    if (matched && matched.latitude && matched.longitude) {
      setCustomCoords({ lat: matched.latitude, lng: matched.longitude });
      setRequestedDestName(matched.name);
      setSelectedCity(matched.city || matched.name);
      setGpsStatus(`🎯 Target Destination set: ${matched.name}`);
      setSearchingDest(false);
      return;
    }

    const results = await searchLocationByName(query);
    if (results && results.length > 0) {
      const top = results[0];
      setCustomCoords({ lat: top.lat, lng: top.lng });
      setRequestedDestName(top.name.split(',')[0] || query);
      setSelectedCity(top.name.split(',')[0] || query);
      setGpsStatus(`🎯 Target Destination found: ${top.name.split(',')[0]}`);
    } else {
      setGpsStatus(`⚠️ Destination "${query}" not resolved. Using live position.`);
    }
    setSearchingDest(false);
  };

  const fetchServices = async () => {
    setLoading(true);
    try {
      const catParam = selectedCategory === 'All' ? '' : selectedCategory;
      const combinedServices = [];
      const seenIds = new Set();

      // 1. Fetch facilities near Live GPS Position
      if ((facilityScope === 'LIVE_GPS' || facilityScope === 'BOTH') && userLocation && userLocation.lat) {
        const liveRes = await getNearbyServices({
          lat: userLocation.lat,
          lng: userLocation.lng,
          category: catParam,
          city: '',
          radius: 25.0
        });

        if (liveRes.success && Array.isArray(liveRes.services)) {
          liveRes.services.forEach(s => {
            seenIds.add(s.id);
            combinedServices.push({
              ...s,
              location_scope: 'Near Live GPS 📍',
              distance_formatted: s.distance_formatted || (userLocation ? getHaversineDistance(userLocation.lat, userLocation.lng, s.latitude, s.longitude) : null)
            });
          });
        }
      }

      // 2. Fetch facilities near Target Destination
      if ((facilityScope === 'DESTINATION' || facilityScope === 'BOTH') && destinationLocation && destinationLocation.lat && destinationLocation.name !== 'Your Live Position') {
        const destRes = await getNearbyServices({
          lat: destinationLocation.lat,
          lng: destinationLocation.lng,
          category: catParam,
          city: selectedCity === 'NEAR_ME' ? '' : selectedCity,
          radius: 25.0
        });

        if (destRes.success && Array.isArray(destRes.services)) {
          destRes.services.forEach(s => {
            const uniqueId = seenIds.has(s.id) ? `dest_${s.id}` : s.id;
            seenIds.add(uniqueId);

            const distStr = userLocation && userLocation.lat 
              ? getHaversineDistance(userLocation.lat, userLocation.lng, s.latitude, s.longitude)
              : s.distance_formatted;

            combinedServices.push({
              ...s,
              id: uniqueId,
              location_scope: `Near ${destinationLocation.name} 🚩`,
              distance_formatted: distStr
            });
          });
        }
      }

      // Fallback if no specific scope returned results
      if (combinedServices.length === 0) {
        const fallbackTarget = (destinationLocation && destinationLocation.lat) ? destinationLocation : userLocation;
        if (fallbackTarget && fallbackTarget.lat) {
          const fallbackRes = await getNearbyServices({
            lat: fallbackTarget.lat,
            lng: fallbackTarget.lng,
            category: catParam,
            city: selectedCity === 'NEAR_ME' ? '' : selectedCity,
            radius: 50.0
          });
          if (fallbackRes.success && Array.isArray(fallbackRes.services)) {
            fallbackRes.services.forEach(s => {
              combinedServices.push({
                ...s,
                location_scope: 'Nearby Location',
                distance_formatted: userLocation && userLocation.lat ? getHaversineDistance(userLocation.lat, userLocation.lng, s.latitude, s.longitude) : s.distance_formatted
              });
            });
          }
        }
      }

      setServices(combinedServices);
    } catch (err) {
      console.error('Fetch services error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Google Maps navigation URL with explicit Live GPS origin and target destination
  const googleMapsRouteUrl = (userLocation && userLocation.lat && destinationLocation && destinationLocation.lat)
    ? `https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${destinationLocation.lat},${destinationLocation.lng}`
    : (userLocation && userLocation.lat)
      ? `https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${encodeURIComponent(requestedDestName)}`
      : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(requestedDestName + ' ' + (selectedCity === 'NEAR_ME' ? '' : selectedCity))}`;

  const handleShowOnInternalMap = (service) => {
    setCustomCoords({ lat: service.latitude, lng: service.longitude });
    setRequestedDestName(service.name);
    setGpsStatus(`📍 Map Centered on Selected Place: ${service.name}`);

    const mapElement = document.getElementById('digital-yatra-map-container');
    if (mapElement) {
      mapElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <div className="guide-container">
      
      {/* Header */}
      <div className="guide-header">
        <span className="hero-tag">REAL-TIME GPS & NEARBY FACILITIES</span>
        <h1 style={{ fontSize: '2.4rem', marginTop: '8px' }}>🧭 Live Location & Nearby Guide</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Find clean restrooms, drinking water, authentic food & dining, hospitals, police stations, transport, attractions, and hotels <strong>centered directly around your Live Location & Target Destination</strong>!
        </p>

        {/* Live Location & Destination Route Info Banner */}
        <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-xl border border-slate-800 my-5 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 divide-y md:divide-y-0 md:divide-x divide-slate-800">
            
            {/* Live Location Box */}
            <div className="flex items-center gap-3 pt-2 md:pt-0">
              <div className="p-3 bg-red-600/20 text-red-500 rounded-2xl border border-red-500/30">
                <Navigation className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-red-400 uppercase tracking-wider block">Your Live Location</span>
                <p className="text-sm font-black text-white">
                  {userLocation ? `${userLocation.lat.toFixed(4)}, ${userLocation.lng.toFixed(4)}` : 'Detecting GPS...'}
                </p>
                <span className="text-[10px] text-slate-400 font-medium">Device GPS Active</span>
              </div>
            </div>

            {/* Destination Box */}
            <div className="flex items-center gap-3 pt-4 md:pt-0 md:pl-4">
              <div className="p-3 bg-amber-500/20 text-amber-400 rounded-2xl border border-amber-500/30">
                <Flag className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block">Target Destination</span>
                <p className="text-sm font-black text-white truncate max-w-[220px]">
                  {selectedCity === 'NEAR_ME' ? '🎯 Near Your Live Position' : requestedDestName}
                </p>
                <span className="text-[10px] text-slate-400 font-medium">
                  {selectedCity === 'NEAR_ME' ? 'Current Position' : selectedCity}
                </span>
              </div>
            </div>

            {/* Distance & Google Maps Action */}
            <div className="flex items-center justify-between gap-3 pt-4 md:pt-0 md:pl-4">
              <div>
                <span className="text-[11px] font-bold text-teal-400 uppercase tracking-wider block">Live Distance</span>
                <p className="text-xl font-black text-teal-300">
                  {calculatedDistance ? `📏 ${calculatedDistance}` : '📍 At Your Spot'}
                </p>
              </div>

              <a
                href={googleMapsRouteUrl}
                target="_blank"
                rel="noreferrer"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-4 py-2.5 rounded-2xl text-xs font-black shadow-lg flex items-center gap-1.5 transition scale-100 hover:scale-105 shrink-0"
              >
                <ExternalLink className="w-4 h-4" /> Open Directions on Maps
              </a>
            </div>

          </div>

          {/* GPS Status & Refresh Control */}
          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
            <span className="text-slate-300 font-medium">{gpsStatus}</span>
            <button
              onClick={detectLocation}
              className="font-black text-emerald-400 hover:text-emerald-300 underline flex items-center gap-1"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Refresh Live GPS
            </button>
          </div>
        </div>

        {/* Filter Location Mode & Destination Search Controls */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-md space-y-4 my-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-blue-600"></span>
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                Filter Location Mode & Set Target Destination
              </h3>
            </div>
            {selectedCity !== 'NEAR_ME' && (
              <button
                type="button"
                onClick={() => handleCityChange('NEAR_ME')}
                className="text-xs font-bold text-blue-600 hover:text-blue-800 bg-blue-50 px-3 py-1 rounded-full border border-blue-200"
              >
                🎯 Reset to My Live GPS Location
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Quick City Dropdown */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Select Destination / City:
              </label>
              <select 
                className="w-full bg-slate-50 border border-slate-300 text-slate-900 px-4 py-3 rounded-2xl text-xs font-extrabold focus:outline-none focus:ring-2 focus:ring-blue-600"
                value={selectedCity}
                onChange={(e) => handleCityChange(e.target.value)}
              >
                <option value="NEAR_ME">🎯 Near My Live GPS Location (Current Position)</option>
                <option value="Amer Fort & Sheesh Mahal">Amer Fort & Sheesh Mahal (Jaipur)</option>
                <option value="Taj Mahal">Taj Mahal (Agra)</option>
                <option value="Kashi Vishwanath Temple & Ghats">Kashi Vishwanath Temple & Ghats (Varanasi)</option>
                <option value="Sri Venkateswara Temple">Sri Venkateswara Temple (Tirupati)</option>
                <option value="Charminar & Laad Bazaar">Charminar & Laad Bazaar (Hyderabad)</option>
                <option value="Gateway of India & Taj Hotel">Gateway of India (Mumbai)</option>
                <option value="Baga & Calangute Coast">Baga & Calangute Coast (Goa)</option>
                <option value="Red Fort (Lal Qila)">Red Fort (Delhi)</option>
                <option value="Golden Temple (Harmandir Sahib)">Golden Temple (Amritsar)</option>
                <option value="City Palace & Lake Pichola">City Palace (Udaipur)</option>
                <option value="RK Beach Visakhapatnam">RK Beach (Visakhapatnam)</option>
                {destinations.length > 0 && (
                  destinations.map(d => (
                    <option key={d.id} value={d.name}>{d.name} ({d.state})</option>
                  ))
                )}
              </select>
            </div>

            {/* Custom Destination Search Box */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Or Type Any Custom Destination / Landmark:
              </label>
              <form onSubmit={handleCustomDestSearch} className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 text-slate-900 rounded-2xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="e.g. Amer Fort, Tirupati, Goa, Taj Mahal..."
                    value={customSearchInput}
                    onChange={(e) => setCustomSearchInput(e.target.value)}
                  />
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                </div>
                <button
                  type="submit"
                  disabled={searchingDest}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-2xl text-xs font-black shadow transition flex items-center gap-1 disabled:opacity-50"
                >
                  {searchingDest ? 'Searching...' : '🔍 Set Target'}
                </button>
              </form>
            </div>

          </div>

          {/* Quick Landmark Quick-Select Chips */}
          <div className="pt-2 flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-bold text-slate-400">Popular Destinations:</span>
            {[
              "Amer Fort & Sheesh Mahal",
              "Taj Mahal",
              "Sri Venkateswara Temple",
              "Charminar & Laad Bazaar",
              "Baga & Calangute Coast",
              "RK Beach Visakhapatnam"
            ].map(spot => (
              <button
                key={spot}
                onClick={() => {
                  setCustomSearchInput(spot);
                  handleCityChange(spot);
                }}
                className={`text-[11px] font-extrabold px-3 py-1 rounded-full border transition ${
                  requestedDestName === spot 
                    ? 'bg-amber-500 text-white border-amber-500 shadow-sm' 
                    : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                }`}
              >
                📍 {spot.split('(')[0]}
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* Category Selector Bar (Restrooms, Water, Food, Hospitals, Police, Transport, Attractions, Hotels) */}
      <GuideMe 
        selectedCategory={selectedCategory} 
        onSelectCategory={setSelectedCategory} 
      />

      {/* Map + Cards Grid Layout */}
      <div className="map-layout-grid" id="digital-yatra-map-container">
        {/* Interactive OpenStreetMap Container */}
        <div className="map-card-wrapper">
          <MapView 
            center={currentCenter} 
            markers={services} 
            userLocation={userLocation}
            destinationLocation={destinationLocation}
            onMapClick={handleMapClick}
          />
        </div>

        {/* Nearby Services List */}
        <div>
          {/* Dual Location Facility Filter Scope Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4 bg-slate-900 text-white p-3 rounded-2xl border border-slate-800 shadow-md">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-black uppercase tracking-wider text-slate-200">
                Facility Display Scope:
              </span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => setFacilityScope('BOTH')}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition ${
                  facilityScope === 'BOTH'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                🌐 Facilities in Both Locations ({userLocation ? 'Live GPS + Destination' : 'Both'})
              </button>

              <button
                onClick={() => setFacilityScope('LIVE_GPS')}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition ${
                  facilityScope === 'LIVE_GPS'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                📍 Near My Live GPS Location
              </button>

              <button
                onClick={() => setFacilityScope('DESTINATION')}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition ${
                  facilityScope === 'DESTINATION'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                🚩 Near Target Destination
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <h3 style={{ fontSize: '1.15rem' }}>
              Facilities Found ({services.length})
            </h3>
            <button 
              className="btn btn-secondary" 
              style={{ padding: '6px 12px', fontSize: '0.8rem' }}
              onClick={fetchServices}
            >
              <RefreshCw size={14} /> Refresh
            </button>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
              Locating facilities near your target destination & live GPS position...
            </div>
          ) : services.length === 0 ? (
            <div className="glass-card text-center p-8 space-y-4">
              <p className="text-slate-700 font-extrabold text-sm">
                No {selectedCategory === 'All' ? 'facilities' : selectedCategory.toLowerCase() + ' locations'} were found near your current location or selected destination.
              </p>
              <div className="flex justify-center gap-3 flex-wrap">
                <button 
                  onClick={fetchServices}
                  className="btn btn-primary text-xs font-black px-4 py-2"
                >
                  🔄 Try Again
                </button>
                <button 
                  onClick={() => handleCityChange('NEAR_ME')}
                  className="btn btn-secondary text-xs font-black px-4 py-2"
                >
                  🔍 Search Manually
                </button>
              </div>
            </div>
          ) : (
            <div className="service-cards-list">
              {services.map((service) => (
                <div key={service.id} className="service-card relative border-2 border-slate-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition bg-white space-y-2">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="distance-tag font-bold text-xs bg-slate-100 text-slate-800 px-2.5 py-1 rounded-lg">
                        📏 {service.distance_formatted || '0.5 km near you'}
                      </span>
                      {service.location_scope && (
                        <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md text-white ${
                          service.location_scope.includes('Live GPS') ? 'bg-emerald-600' : 'bg-amber-500'
                        }`}>
                          {service.location_scope}
                        </span>
                      )}
                    </div>
                    <TrustBadge status={service.trust_status} />
                  </div>

                  <h4 style={{ fontSize: '1.05rem', marginBottom: '4px', color: 'var(--text-main)', fontWeight: '800' }}>
                    {service.name}
                  </h4>

                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
                    <span>Category: <strong>{service.category}</strong></span> • <span>Location: {service.city}</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', paddingTop: '10px', borderTop: '1px solid #F1F5F9' }}>
                    <div>
                      {service.price_max > 0 ? (
                        <span style={{ fontWeight: '700', fontSize: '0.85rem', color: 'var(--primary)' }}>
                          ₹{service.price_min} – ₹{service.price_max}
                        </span>
                      ) : (
                        <span style={{ fontWeight: '700', fontSize: '0.85rem', color: 'var(--success)' }}>
                          Free / Public Facility
                        </span>
                      )}
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        ⭐ {service.rating} / 5.0 • Updated: {service.last_updated || 'Just now'}
                      </div>
                    </div>

                    {/* TWO Explicit Navigation Choices: Digital Yatra Map vs Google Maps */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        type="button"
                        onClick={() => handleShowOnInternalMap(service)}
                        className="btn btn-primary flex items-center gap-1 text-xs font-black"
                        style={{ padding: '6px 12px' }}
                      >
                        <MapPin size={14} /> 📍 Show on Digital Yatra Map
                      </button>

                      <a 
                        href={`https://www.google.com/maps/dir/?api=1${userLocation && userLocation.lat ? `&origin=${userLocation.lat},${userLocation.lng}` : ''}&destination=${service.latitude},${service.longitude}`}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-secondary flex items-center gap-1 text-xs font-black"
                        style={{ padding: '6px 12px' }}
                      >
                        <ExternalLink size={14} /> 🗺️ Open in Google Maps
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
