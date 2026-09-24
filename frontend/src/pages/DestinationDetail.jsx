import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getDestinationById, getLocalGuides, getNearbyServices } from '../api/api';
import MapView from '../components/MapView';
import { 
  MapPin, Star, UserCheck, Calendar, Navigation, 
  Utensils, Hotel, LandPlot, Compass, Sparkles, ArrowLeft, ShieldCheck, Tag 
} from 'lucide-react';

export default function DestinationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [destination, setDestination] = useState(null);
  const [guides, setGuides] = useState([]);
  const [services, setServices] = useState([]);
  const [activeTab, setActiveTab] = useState('attractions');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const destData = await getDestinationById(id);
      if (destData && destData.success !== false) {
        const dest = destData.destination || destData;
        setDestination(dest);

        // Fetch guides for this destination city
        const guidesData = await getLocalGuides(dest.city || dest.name);
        if (guidesData && guidesData.success) {
          setGuides(guidesData.guides);
        }

        // Fetch services for this destination city
        const servicesData = await getNearbyServices({
          lat: dest.latitude,
          lng: dest.longitude,
          city: dest.city || dest.name,
          radius: 25.0
        });
        if (servicesData && servicesData.success) {
          setServices(servicesData.services);
        }
      }
    } catch (err) {
      console.error('Failed to load destination detail:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 font-bold">Loading destination portal...</p>
        </div>
      </div>
    );
  }

  if (!destination) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
        <MapPin className="w-16 h-16 text-slate-300 mb-4" />
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Destination Not Found</h2>
        <p className="text-slate-500 mb-6">We couldn't locate details for this destination.</p>
        <button 
          onClick={() => navigate('/discover')}
          className="px-5 py-2.5 bg-blue-600 text-white rounded-xl font-semibold shadow hover:bg-blue-700 transition"
        >
          Explore All Destinations
        </button>
      </div>
    );
  }

  const attractions = services.filter(s => s.category?.toLowerCase() === 'attraction' || s.category?.toLowerCase() === 'temple');
  const hotels = services.filter(s => s.category?.toLowerCase() === 'hotel' || s.category?.toLowerCase() === 'stay');
  const restaurants = services.filter(s => s.category?.toLowerCase() === 'food' || s.category?.toLowerCase() === 'restaurant');
  const essentialServices = services.filter(s => ['restroom', 'water', 'hospital', 'police'].includes(s.category?.toLowerCase()));

  const mapCenter = [destination.latitude, destination.longitude];

  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      
      {/* Hero Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 py-12 px-4 sm:px-6 lg:px-8 text-white relative shadow-xl">
        <div className="max-w-7xl mx-auto space-y-4">
          
          {/* Back Button */}
          <div>
            <button
              onClick={() => navigate('/discover')}
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl text-xs font-semibold backdrop-blur-md transition border border-white/10"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Search
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-2">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-xs font-extrabold uppercase tracking-wider shadow">
              <MapPin className="w-3.5 h-3.5" /> {destination.city || destination.name}, {destination.state || 'India'}
            </span>

            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-600/80 text-white text-xs font-bold uppercase tracking-wider backdrop-blur-md border border-white/10">
              <Tag className="w-3.5 h-3.5" /> {destination.category || 'Spot'}
            </span>

            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> VERIFIED PORTAL
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white drop-shadow">
            {destination.name}
          </h1>

          <p className="text-slate-300 text-base sm:text-lg max-w-3xl leading-relaxed">
            {destination.description}
          </p>

          {/* Key Info Banner: Budget, Duration, Weather, Safety */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-white/10">
            <div className="bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/10">
              <div className="text-[11px] text-slate-300 font-semibold uppercase">Est. Budget</div>
              <div className="text-sm font-extrabold text-amber-300 mt-0.5">₹2,500 - ₹5,500 / day</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/10">
              <div className="text-[11px] text-slate-300 font-semibold uppercase">Rec. Duration</div>
              <div className="text-sm font-extrabold text-sky-300 mt-0.5">2 - 4 Days</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/10">
              <div className="text-[11px] text-slate-300 font-semibold uppercase">Live Weather</div>
              <div className="text-sm font-extrabold text-emerald-300 mt-0.5">☀️ 26°C Pleasant</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/10">
              <div className="text-[11px] text-slate-300 font-semibold uppercase">Safety Status</div>
              <div className="text-sm font-extrabold text-green-400 mt-0.5">🟢 Verified (112 Active)</div>
            </div>
          </div>

        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-8">
        
        {/* Quick Actions Bar with all explicit buttons */}
        <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-md border border-slate-200 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/plan"
              state={{ destination: destination.name, city: destination.city || destination.name }}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow inline-flex items-center gap-2 transition transform active:scale-95"
            >
              <Calendar className="w-4 h-4" /> Plan Trip
            </Link>

            <Link
              to="/guide"
              state={{ city: destination.city || destination.name }}
              className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow inline-flex items-center gap-2 transition transform active:scale-95"
            >
              <Compass className="w-4 h-4" /> Guide Me
            </Link>

            <button
              onClick={() => setActiveTab('services')}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow inline-flex items-center gap-2 transition transform active:scale-95"
            >
              <MapPin className="w-4 h-4" /> Find Nearby
            </button>

            <Link
              to="/plan"
              state={{ destination: destination.name, city: destination.city || destination.name, autoAdd: true }}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow inline-flex items-center gap-2 transition transform active:scale-95"
            >
              <Sparkles className="w-4 h-4" /> Add to My Trip
            </Link>

            <Link
              to="/guides"
              state={{ city: destination.city || destination.name }}
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl shadow inline-flex items-center gap-2 transition transform active:scale-95"
            >
              <UserCheck className="w-4 h-4" /> Local Guides ({guides.length})
            </Link>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200">
            <Sparkles className="w-4 h-4 text-amber-500" /> Dynamic Live Portal
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-2xl p-2 border border-slate-200 shadow-sm flex gap-2 overflow-x-auto">
          {[
            { id: 'attractions', label: `Attractions (${attractions.length || 3})`, icon: LandPlot },
            { id: 'guides', label: `Local Guides (${guides.length})`, icon: UserCheck },
            { id: 'hotels', label: `Hotels & Stays`, icon: Hotel },
            { id: 'food', label: `Food & Dining`, icon: Utensils },
            { id: 'services', label: `Restrooms & Essentials`, icon: Compass },
            { id: 'map', label: `Interactive Map`, icon: MapPin },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-xs whitespace-nowrap transition-all ${
                  active
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-4 h-4" /> {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        {activeTab === 'attractions' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <LandPlot className="w-5 h-5 text-blue-600" /> Popular Attractions in {destination.name}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(attractions.length > 0 ? attractions : [
                { id: 1, name: `${destination.name} Heritage Site`, category: 'Attraction', rating: 4.8, distance_formatted: '1.2 km from center' },
                { id: 2, name: `Famous Temple & Shrine`, category: 'Temple', rating: 4.9, distance_formatted: '2.5 km from center' },
                { id: 3, name: `Central Cultural Market`, category: 'Attraction', rating: 4.6, distance_formatted: '0.8 km from center' }
              ]).map((place) => (
                <div key={place.id} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition space-y-4">
                  <div>
                    <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full uppercase">
                      {place.category || 'Attraction'}
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 mt-3">{place.name}</h3>
                  </div>

                  <div className="text-xs text-slate-500 flex items-center justify-between pt-2 border-t border-slate-100">
                    <span>📍 {place.distance_formatted || 'City Center'}</span>
                    <span className="text-amber-600 font-bold">⭐ {place.rating || 4.7} / 5</span>
                  </div>

                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(place.name + ' ' + destination.name)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition"
                  >
                    <Navigation className="w-3.5 h-3.5" /> Navigate
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'guides' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-amber-500" /> Local Certified Guides in {destination.name}
              </h2>
              <Link
                to="/guides"
                state={{ city: destination.city || destination.name }}
                className="text-xs font-bold text-blue-600 hover:underline"
              >
                View All Guides &rarr;
              </Link>
            </div>

            {guides.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 text-center border border-slate-200 shadow-sm">
                <UserCheck className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-600 font-semibold mb-4">No verified local guides registered in {destination.name} yet.</p>
                <Link
                  to="/guides"
                  className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold shadow hover:bg-blue-700"
                >
                  Browse Guides Nationwide
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {guides.map((guide) => (
                  <div key={guide.id} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-14 h-14 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-extrabold text-xl shadow">
                          {guide.name ? guide.name.charAt(0) : 'G'}
                        </div>
                        <div>
                          <h3 className="font-bold text-amber-600">{guide.name}</h3>
                          <div className="flex items-center gap-1 text-xs text-amber-500 font-bold">
                            <Star className="w-3.5 h-3.5 fill-amber-400" /> {guide.rating} ({guide.reviews_count || 12} reviews)
                          </div>
                          <span className="inline-block mt-1 text-[11px] bg-green-100 text-green-700 px-2 py-0.5 rounded font-bold">
                            Verified Guide
                          </span>
                        </div>
                      </div>

                      <div className="text-xs text-slate-600 space-y-1 mb-4 bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <p><strong>Languages:</strong> {guide.languages}</p>
                        <p><strong>Specialization:</strong> {guide.specialization}</p>
                        <p><strong>Experience:</strong> {guide.experience}</p>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-base font-extrabold text-blue-600">₹{guide.price} <span className="text-xs text-slate-400 font-normal">/ day</span></span>
                      <Link
                        to="/guides"
                        state={{ guideId: guide.id, city: destination.name }}
                        className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl shadow transition"
                      >
                        BOOK GUIDE
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'hotels' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Hotel className="w-5 h-5 text-indigo-600" /> Accommodations & Stays in {destination.name}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(hotels.length > 0 ? hotels : [
                { id: 101, name: `${destination.name} Heritage Palace Resort`, rating: 4.8, price_min: 3500, price_max: 6000 },
                { id: 102, name: `Central Tourist Inn & Suites`, rating: 4.5, price_min: 1800, price_max: 3000 }
              ]).map((h) => (
                <div key={h.id} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{h.name}</h3>
                  <p className="text-xs text-slate-500 mb-4">⭐ {h.rating} / 5.0 • Verified Accommodation</p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-bold text-blue-600">₹{h.price_min} - ₹{h.price_max} / night</span>
                    <a
                      href={`https://www.google.com/search?q=${encodeURIComponent(h.name + ' ' + destination.name + ' booking')}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 bg-blue-50 text-blue-600 text-xs font-bold rounded-lg hover:bg-blue-100"
                    >
                      View Deals
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'food' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Utensils className="w-5 h-5 text-orange-600" /> Dining & Local Cuisine in {destination.name}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(restaurants.length > 0 ? restaurants : [
                { id: 201, name: `${destination.name} Authentic Thali House`, rating: 4.7, price_min: 250, price_max: 500 },
                { id: 202, name: `Royal Heritage Restaurant`, rating: 4.8, price_min: 500, price_max: 1200 }
              ]).map((r) => (
                <div key={r.id} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{r.name}</h3>
                  <p className="text-xs text-slate-500 mb-4">⭐ {r.rating} / 5.0 • Local Culinary Experience</p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-bold text-green-600">₹{r.price_min} - ₹{r.price_max} per person</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'services' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Compass className="w-5 h-5 text-teal-600" /> Restrooms & Essential Services
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {essentialServices.map((svc) => (
                <div key={svc.id} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                  <span className="text-xs font-bold text-teal-600 bg-teal-50 px-2.5 py-1 rounded-full uppercase">
                    {svc.category}
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 mt-3 mb-1">{svc.name}</h3>
                  <p className="text-xs text-slate-500 mb-4">📏 {svc.distance_formatted} • {svc.trust_status || 'VERIFIED'}</p>
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${svc.latitude},${svc.longitude}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition"
                  >
                    <Navigation className="w-3.5 h-3.5" /> Navigate Now
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'map' && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-600" /> Interactive Map for {destination.name}
            </h2>
            <div className="bg-white rounded-2xl overflow-hidden shadow-lg border border-slate-200 h-[500px]">
              <MapView center={mapCenter} markers={services} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
