import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getDestinations } from '../api/api';
import TrustBadge from '../components/TrustBadge';
import Chatbot from '../components/Chatbot';
import SearchSuggestionsDropdown from '../components/SearchSuggestionsDropdown';
import { useDestinationSuggestions } from '../utils/useDestinationSuggestions';
import { Search, Compass, MapPin, ArrowRight, Star } from 'lucide-react';
import '../styles/home.css';

const DISCOVERY_CATEGORIES = [
  { id: 'All', name: 'All India' },
  { id: 'Beach', name: 'Beach Places', icon: '🏖️' },
  { id: 'Mountain', name: 'Mountain Places', icon: '🏔️' },
  { id: 'Religious', name: 'Religious Places', icon: '🛕' },
  { id: 'Party', name: 'Party & Nightlife', icon: '🎉' },
  { id: 'Royal', name: 'Royal Places', icon: '👑' },
  { id: 'Food', name: 'Food Places', icon: '🍛' },
  { id: 'Heritage', name: 'Ancient & Heritage', icon: '🏛️' },
  { id: 'Snow', name: 'Snow Places', icon: '❄️' },
  { id: 'Nature', name: 'Green / Nature', icon: '🌿' },
  { id: 'Waterfall', name: 'Waterfall Places', icon: '💦' },
  { id: 'River', name: 'River Places', icon: '💧' },
  { id: 'Lake', name: 'Lake Places', icon: '🌊' }
];

const categoryGradients = {
  History: 'linear-gradient(135deg, #7C2D12 0%, #C2410C 100%)',
  Heritage: 'linear-gradient(135deg, #7C2D12 0%, #C2410C 100%)',
  Culture: 'linear-gradient(135deg, #312E81 0%, #4338CA 100%)',
  Spiritual: 'linear-gradient(135deg, #064E3B 0%, #047857 100%)',
  Religious: 'linear-gradient(135deg, #064E3B 0%, #047857 100%)',
  Temple: 'linear-gradient(135deg, #064E3B 0%, #047857 100%)',
  Adventure: 'linear-gradient(135deg, #164E63 0%, #0891B2 100%)',
  Beach: 'linear-gradient(135deg, #164E63 0%, #0891B2 100%)',
  Mountain: 'linear-gradient(135deg, #1E3A8A 0%, #3B82F6 100%)',
  Royal: 'linear-gradient(135deg, #78350F 0%, #D97706 100%)',
  Party: 'linear-gradient(135deg, #581C87 0%, #9333EA 100%)',
  Food: 'linear-gradient(135deg, #991B1B 0%, #EF4444 100%)',
  Snow: 'linear-gradient(135deg, #0F172A 0%, #38BDF8 100%)',
  Nature: 'linear-gradient(135deg, #14532D 0%, #15803D 100%)',
  Waterfall: 'linear-gradient(135deg, #0284C7 0%, #06B6D4 100%)',
  River: 'linear-gradient(135deg, #0369A1 0%, #0EA5E9 100%)',
  Lake: 'linear-gradient(135deg, #0F766E 0%, #14B8A6 100%)',
  Default: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)'
};

export default function Home({ user, userLocation, onLocationUpdate }) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeDestination, setActiveDestination] = useState('Jaipur');

  // Autocomplete Suggestions Hook
  const {
    suggestions,
    loading: suggestionsLoading,
    isOpen: isSuggestionsOpen,
    setIsOpen: setIsSuggestionsOpen,
    containerRef: suggestionsRef
  } = useDestinationSuggestions(searchQuery);

  // Discovery Section State
  const [selectedDiscoveryCategory, setSelectedDiscoveryCategory] = useState('All');
  const [discoverySearch, setDiscoverySearch] = useState('');
  const [discoveryDestinations, setDiscoveryDestinations] = useState([]);
  const [discoveryLoading, setDiscoveryLoading] = useState(false);

  useEffect(() => {
    fetchTopDestinations();
    fetchDiscoveryDestinations('All', '');
  }, []);

  useEffect(() => {
    fetchDiscoveryDestinations(selectedDiscoveryCategory, discoverySearch);
  }, [selectedDiscoveryCategory]);

  const fetchTopDestinations = async () => {
    setLoading(true);
    try {
      const data = await getDestinations();
      if (Array.isArray(data)) {
        setDestinations(data);
        if (data.length > 0) setActiveDestination(data[0].city || data[0].name);
      } else if (data && data.destinations) {
        setDestinations(data.destinations);
        if (data.destinations.length > 0) setActiveDestination(data.destinations[0].city || data.destinations[0].name);
      }
    } catch (err) {
      console.error('Error fetching destinations:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDiscoveryDestinations = async (category, search) => {
    setDiscoveryLoading(true);
    try {
      const catParam = category === 'All' ? '' : category;
      const data = await getDestinations({ category: catParam, search });
      if (data && data.destinations) {
        setDiscoveryDestinations(data.destinations);
      } else if (Array.isArray(data)) {
        setDiscoveryDestinations(data);
      }
    } catch (err) {
      console.error('Error fetching discovery destinations:', err);
    } finally {
      setDiscoveryLoading(false);
    }
  };

  const handleDiscoverySearchSubmit = (e) => {
    e.preventDefault();
    fetchDiscoveryDestinations(selectedDiscoveryCategory, discoverySearch);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setIsSuggestionsOpen(false);
    if (searchQuery.trim()) {
      navigate(`/discover?search=${encodeURIComponent(searchQuery)}`);
    } else {
      navigate('/discover');
    }
  };

  const handleSelectSuggestion = (selectedVal) => {
    setSearchQuery(selectedVal);
    setIsSuggestionsOpen(false);
  };

  const handleGuideCategoryClick = (category) => {
    navigate('/guide', { state: { category, city: activeDestination } });
  };

  return (
    <div>
      {/* 1. HERO SECTION */}
      <section className="hero-section">
        <div className="hero-content">
          <span className="hero-tag">EXPLORE INDIA • TRAVEL GUIDE</span>
          <h1 className="hero-title">Explore India</h1>
          <p className="hero-subtitle">
            Discover handpicked Indian destinations by travel style & category
          </p>

          {/* Search Destination */}
          <form
            onSubmit={handleSearchSubmit}
            className="hero-search-box"
            ref={suggestionsRef}
            style={{ position: 'relative' }}
          >
            <Search size={22} color="var(--text-muted)" style={{ marginRight: '12px', flexShrink: 0 }} />
            <input
              type="text"
              placeholder="Where are you travelling? (e.g. Jaipur, Tirupati, Goa, Varanasi, Delhi)"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsSuggestionsOpen(true);
              }}
              onFocus={() => {
                if (searchQuery.trim()) setIsSuggestionsOpen(true);
              }}
            />
            <button type="submit" className="btn btn-primary" style={{ padding: '10px 20px', borderRadius: '14px', flexShrink: 0 }}>
              Explore India
            </button>
            <SearchSuggestionsDropdown
              suggestions={suggestions}
              loading={suggestionsLoading}
              isOpen={isSuggestionsOpen}
              query={searchQuery}
              onSelect={handleSelectSuggestion}
            />
          </form>

          {/* 12 Category Discovery Buttons (Wrapped Flex, No H-Scroll) */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '10px',
            marginTop: '20px'
          }}>
            {DISCOVERY_CATEGORIES.map((cat) => {
              const active = selectedDiscoveryCategory === cat.id;
              return (
                <div
                  key={cat.id}
                  onClick={() => {
                    setSelectedDiscoveryCategory(cat.id);
                    setDiscoverySearch('');
                  }}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 16px',
                    borderRadius: '20px',
                    cursor: 'pointer',
                    background: active ? 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)' : 'rgba(255, 255, 255, 0.15)',
                    border: active ? '2px solid #60A5FA' : '1px solid rgba(255, 255, 255, 0.25)',
                    boxShadow: active ? '0 6px 16px rgba(37, 99, 235, 0.4)' : 'none',
                    color: '#FFFFFF',
                    fontWeight: '700',
                    fontSize: '0.82rem',
                    transition: 'all 0.2s'
                  }}
                >
                  {cat.icon && cat.id !== 'All' && <span style={{ fontSize: '1.1rem' }}>{cat.icon}</span>}
                  <span>{cat.name}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 2. MAIN DASHBOARD CONTAINER */}
      <div className="dashboard-container">

        {/* Dynamic Destination Cards Grid */}
        <div style={{ marginTop: '24px', marginBottom: '32px' }}>
          {discoveryLoading ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#64748B', fontWeight: '600' }}>
              🔄 Loading travel destinations...
            </div>
          ) : discoveryDestinations.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', background: '#F8FAFC', borderRadius: '20px', border: '1px dashed #CBD5E1' }}>
              <p style={{ color: '#64748B', fontWeight: '600' }}>
                No destinations found matching category <strong>{selectedDiscoveryCategory}</strong>.
              </p>
              <button
                onClick={() => {
                  setSelectedDiscoveryCategory('All');
                  setDiscoverySearch('');
                }}
                className="btn btn-secondary"
                style={{ marginTop: '12px', padding: '8px 16px', fontSize: '0.8rem' }}
              >
                View All Destinations Across India
              </button>
            </div>
          ) : (
            <div className="destinations-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
              {discoveryDestinations.map((dest) => {
                const bg = categoryGradients[dest.category] || categoryGradients.Default;
                return (
                  <div
                    key={dest.id || dest.name}
                    style={{
                      background: '#FFFFFF',
                      borderRadius: '24px',
                      overflow: 'hidden',
                      border: '1px solid #E2E8F0',
                      boxShadow: '0 4px 14px rgba(0, 0, 0, 0.05)',
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      cursor: 'pointer'
                    }}
                    onClick={() => navigate(`/destination/${encodeURIComponent(dest.id || dest.name)}`)}
                  >
                    {/* Stylized Gradient Header (No Images) */}
                    <div style={{ height: '140px', background: bg, padding: '16px', position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.7rem', background: 'rgba(255, 255, 255, 0.25)', color: '#FFFFFF', padding: '4px 10px', borderRadius: '12px', fontWeight: '700', backdropFilter: 'blur(4px)' }}>
                          {dest.category || 'Spot'}
                        </span>
                        <span style={{ fontSize: '0.75rem', background: '#F59E0B', color: '#0F172A', padding: '3px 8px', borderRadius: '10px', fontWeight: '900' }}>
                          ⭐ {dest.rating || 4.8}
                        </span>
                      </div>
                      <div>
                        <h3 style={{ fontSize: '1.15rem', color: '#FFFFFF', fontWeight: '800', margin: 0 }}>
                          {dest.name}
                        </h3>
                        <div style={{ fontSize: '0.8rem', color: '#6EE7B7', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                          <MapPin size={12} /> {dest.city || dest.name}, {dest.state || 'India'}
                        </div>
                      </div>
                    </div>

                    {/* Card Body & Actions */}
                    <div style={{ padding: '16px' }}>
                      <p style={{ fontSize: '0.82rem', color: '#64748B', lineHeight: '1.4', margin: '0 0 14px 0', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {dest.description || `Explore tourist places, food recommendations, stays, and certified local guides in ${dest.name}.`}
                      </p>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', paddingTop: '10px', borderTop: '1px solid #F1F5F9' }}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate('/plan', { state: { destination: dest.name } });
                          }}
                          className="btn btn-primary"
                          style={{ padding: '6px 10px', fontSize: '0.75rem', borderRadius: '10px' }}
                        >
                          ✈️ Plan Trip
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate('/guide', { state: { city: dest.city || dest.name } });
                          }}
                          className="btn btn-secondary"
                          style={{ padding: '6px 10px', fontSize: '0.75rem', borderRadius: '10px' }}
                        >
                          🧭 Guide Me
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Floating Multilingual Conversational AI Travel Assistant Widget */}
        <Chatbot destination={activeDestination} />

      </div>
    </div>
  );
}
