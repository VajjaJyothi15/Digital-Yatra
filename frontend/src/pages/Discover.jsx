import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { 
  Search, MapPin, Sparkles, Filter, Compass, ArrowRight, Star, Tag, Landmark, 
  BookOpen, Navigation, CalendarCheck, UserCheck, ChevronDown, ChevronUp, Layers, 
  Award, Utensils, Music, Shirt, Building2, Globe, Calendar, CloudSun 
} from 'lucide-react';
import { INDIA_STATES_AND_UTS, getBestTimeAndSeason } from '../data/indiaData';
import { getDestinations } from '../api/api';
import SearchSuggestionsDropdown from '../components/SearchSuggestionsDropdown';
import { useDestinationSuggestions } from '../utils/useDestinationSuggestions';

export default function Discover() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('search') || '';

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [regionFilter, setRegionFilter] = useState('ALL'); // 'ALL', 'STATES', 'UTS'
  const [selectedRegion, setSelectedRegion] = useState('Andhra Pradesh');
  const [seasonFilter, setSeasonFilter] = useState('ALL'); // 'ALL', 'Winter', 'Summer', 'Monsoon', 'Spring'
  
  const [apiDestinations, setApiDestinations] = useState([]);
  const [loading, setLoading] = useState(false);

  // Autocomplete Suggestions Hook
  const {
    suggestions,
    loading: suggestionsLoading,
    isOpen: isSuggestionsOpen,
    setIsOpen: setIsSuggestionsOpen,
    containerRef: suggestionsRef
  } = useDestinationSuggestions(searchQuery);

  const allRegionNames = Object.keys(INDIA_STATES_AND_UTS);

  // Fetch API destinations if available to complement static region data
  useEffect(() => {
    fetchApiDestinations();
  }, [selectedRegion]);

  const fetchApiDestinations = async () => {
    setLoading(true);
    try {
      const res = await getDestinations({ search: selectedRegion });
      if (res && res.success && Array.isArray(res.destinations)) {
        setApiDestinations(res.destinations);
      } else if (Array.isArray(res)) {
        setApiDestinations(res);
      }
    } catch (err) {
      console.warn('API destinations notice:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filter region names list for dropdown/matrix buttons
  const filteredRegionNames = allRegionNames.filter(name => {
    const region = INDIA_STATES_AND_UTS[name];
    if (regionFilter === 'STATES' && region.type !== 'State') return false;
    if (regionFilter === 'UTS' && region.type !== 'Union Territory') return false;

    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    
    // Match state name, capital, food, culture, temples, clothes, or places
    const matchRegion = name.toLowerCase().includes(q) ||
                        region.capital.toLowerCase().includes(q) ||
                        region.famousFood.toLowerCase().includes(q) ||
                        region.culture.toLowerCase().includes(q) ||
                        region.famousTemples.toLowerCase().includes(q) ||
                        region.traditionalClothes.toLowerCase().includes(q);

    const matchPlaces = region.places.some(p => 
      p.name.toLowerCase().includes(q) || 
      p.city.toLowerCase().includes(q) || 
      p.cat.toLowerCase().includes(q) ||
      p.desc.toLowerCase().includes(q)
    );

    return matchRegion || matchPlaces;
  });

  // Keep selectedRegion valid if filters change
  useEffect(() => {
    if (filteredRegionNames.length > 0 && !filteredRegionNames.includes(selectedRegion)) {
      setSelectedRegion(filteredRegionNames[0]);
    }
  }, [regionFilter]);

  const activeRegionData = INDIA_STATES_AND_UTS[selectedRegion] || INDIA_STATES_AND_UTS['Andhra Pradesh'];

  // Combine static state places with backend API places for the selected state
  const combineStatePlaces = () => {
    const staticPlaces = activeRegionData.places || [];
    
    // Convert API destinations for this state if available
    const extraApiPlaces = apiDestinations
      .filter(d => {
        const matchesState = (d.state && d.state.toLowerCase() === selectedRegion.toLowerCase()) ||
                             (d.description && d.description.toLowerCase().includes(selectedRegion.toLowerCase()));
        return matchesState;
      })
      .map((d, idx) => ({
        rank: staticPlaces.length + idx + 1,
        name: d.name,
        city: d.city || selectedRegion,
        cat: d.category || 'Tourist Attraction',
        desc: d.description || `Explore famous sights and culture in ${d.name}, ${selectedRegion}.`,
        history: `Historical landmark in ${d.city || selectedRegion}. Verified by Digital Yatra Portal.`,
        bestTime: d.best_time || 'October – March',
        bestSeason: d.best_season || 'Winter & Spring',
        apiId: d.id
      }));

    // Deduplicate by place name
    const seen = new Set();
    const combined = [];

    [...staticPlaces, ...extraApiPlaces].forEach(place => {
      const key = place.name.toLowerCase().trim();
      if (!seen.has(key)) {
        seen.add(key);
        // Enrich best time and best season
        const seasonInfo = getBestTimeAndSeason(place, selectedRegion);
        combined.push({
          ...place,
          bestTime: place.bestTime || seasonInfo.bestTime,
          bestSeason: place.bestSeason || seasonInfo.bestSeason
        });
      }
    });

    // Re-rank 1 to 20
    return combined.slice(0, 20).map((p, index) => ({ ...p, rank: index + 1 }));
  };

  const allStateTop20Places = combineStatePlaces();

  // Filter top 20 places by user search query and optional best season filter
  const filteredTop20Places = allStateTop20Places.filter(place => {
    // Season filter
    if (seasonFilter !== 'ALL') {
      const seasonText = (place.bestSeason + ' ' + place.bestTime).toLowerCase();
      if (!seasonText.includes(seasonFilter.toLowerCase())) return false;
    }

    // Search query filter
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return place.name.toLowerCase().includes(q) || 
           place.city.toLowerCase().includes(q) || 
           place.cat.toLowerCase().includes(q) ||
           place.desc.toLowerCase().includes(q) ||
           (place.history && place.history.toLowerCase().includes(q)) ||
           selectedRegion.toLowerCase().includes(q);
  });

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setIsSuggestionsOpen(false);
    setSearchParams(searchQuery ? { search: searchQuery } : {});
  };

  const handleSelectSuggestion = (selectedVal) => {
    setSearchQuery(selectedVal);
    setIsSuggestionsOpen(false);
    setSearchParams(selectedVal ? { search: selectedVal } : {});
  };

  const statesCount = allRegionNames.filter(n => INDIA_STATES_AND_UTS[n].type === 'State').length;
  const utsCount = allRegionNames.filter(n => INDIA_STATES_AND_UTS[n].type === 'Union Territory').length;

  return (
    <div className="history-page">
      <div className="history-container">

        {/* 1. Header Hero Banner */}
        <div className="history-hero" style={{ overflow: 'visible' }}>
          <div style={{ position: 'relative', zIndex: 10, maxWidth: '720px' }}>
            <div className="history-hero-badge">
              <Landmark style={{ width: '16px', height: '16px', color: '#F59E0B' }} />
              ALL 28 STATES & 8 UNION TERRITORIES OF INDIA
            </div>
            <h1 className="history-hero-title">
              India History & Top Places Directory
            </h1>
            <p className="history-hero-subtitle">
              Explore all <strong>28 States & 8 Union Territories</strong> with their famous <strong>Food & Delicacies</strong>, <strong>Culture & Festivals</strong>, <strong>Temples & Sacred Shrines</strong>, <strong>Traditional Clothes</strong>, and <strong>Top 20 Places to Visit</strong>!
            </p>

            {/* Search Input */}
            <form
              onSubmit={handleSearchSubmit}
              className="history-search-form"
              ref={suggestionsRef}
              style={{ position: 'relative' }}
            >
              <Search style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', width: '20px', height: '20px', color: '#94A3B8' }} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSuggestionsOpen(true);
                }}
                onFocus={() => {
                  if (searchQuery.trim()) setIsSuggestionsOpen(true);
                }}
                placeholder="Search state, place, food, temple, or dress (e.g. Tirupati, Araku, Biryani)..."
                className="history-search-input"
              />
              <button type="submit" className="history-search-btn">
                Search
              </button>
              <SearchSuggestionsDropdown
                suggestions={suggestions}
                loading={suggestionsLoading}
                isOpen={isSuggestionsOpen}
                query={searchQuery}
                onSelect={handleSelectSuggestion}
              />
            </form>
          </div>
        </div>

        {/* 2. State Selection Section & Region Filter Bar */}
        <div className="state-select-card">
          <div className="state-select-header">
            
            {/* State Selection Dropdown Control */}
            <div className="state-select-control">
              <div style={{ padding: '10px', background: 'rgba(37, 99, 235, 0.1)', color: '#2563EB', borderRadius: '16px', display: 'flex', alignItems: 'center' }}>
                <MapPin style={{ width: '20px', height: '20px' }} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 900, color: '#64748B', textTransform: 'uppercase', tracking: '0.5px', marginBottom: '4px' }}>
                  Choose State / Union Territory:
                </label>
                <select
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                  className="state-select-dropdown"
                >
                  <optgroup label="28 States of India">
                    {allRegionNames.filter(n => INDIA_STATES_AND_UTS[n].type === 'State').map(rName => (
                      <option key={rName} value={rName}>📍 {rName}</option>
                    ))}
                  </optgroup>
                  <optgroup label="8 Union Territories">
                    {allRegionNames.filter(n => INDIA_STATES_AND_UTS[n].type === 'Union Territory').map(rName => (
                      <option key={rName} value={rName}>🏖️ {rName} (UT)</option>
                    ))}
                  </optgroup>
                </select>
              </div>
            </div>

            {/* Region Filter Category Tabs */}
            <div className="region-filter-tabs">
              <button
                onClick={() => setRegionFilter('ALL')}
                className={`region-tab-btn ${regionFilter === 'ALL' ? 'active' : ''}`}
              >
                All ({allRegionNames.length})
              </button>
              <button
                onClick={() => setRegionFilter('STATES')}
                className={`region-tab-btn ${regionFilter === 'STATES' ? 'active' : ''}`}
              >
                28 States ({statesCount})
              </button>
              <button
                onClick={() => setRegionFilter('UTS')}
                className={`region-tab-btn ${regionFilter === 'UTS' ? 'active' : ''}`}
              >
                8 UTs ({utsCount})
              </button>
            </div>
          </div>

          {/* Region Selection Buttons Matrix */}
          {filteredRegionNames.length === 0 ? (
            <p style={{ color: '#64748B', fontSize: '0.8rem', textAlign: 'center', padding: '16px 0', fontWeight: 600 }}>
              No regions match "{searchQuery}". Try clearing search filter.
            </p>
          ) : (
            <div className="state-pills-container">
              {filteredRegionNames.map((rName) => {
                const isUT = INDIA_STATES_AND_UTS[rName].type === 'Union Territory';
                const isSelected = selectedRegion === rName;

                return (
                  <button
                    key={rName}
                    onClick={() => setSelectedRegion(rName)}
                    className={`state-pill ${isSelected ? 'active' : ''} ${isUT ? 'is-ut' : ''}`}
                  >
                    <MapPin style={{ width: '14px', height: '14px', color: isSelected ? '#FCD34D' : isUT ? '#D97706' : '#2563EB' }} />
                    <span>{rName}</span>
                    {isUT && !isSelected && (
                      <span className="ut-chip">UT</span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* 3. Selected Region Cultural & Heritage Overview Banner */}
        <div className="region-overview-banner">
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justify: 'space-between', gap: '16px', borderBottom: '1px solid rgba(255, 255, 255, 0.15)', paddingBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ padding: '12px', background: '#F59E0B', color: '#0F172A', borderRadius: '16px' }}>
                <Globe style={{ width: '28px', height: '28px' }} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h2 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#FFFFFF' }}>{selectedRegion}</h2>
                  <span style={{ background: '#F59E0B', color: '#0F172A', fontSize: '0.7rem', fontWeight: 900, padding: '2px 10px', borderRadius: '9999px', textTransform: 'uppercase' }}>
                    {activeRegionData.type}
                  </span>
                </div>
                <p style={{ fontSize: '0.85rem', color: '#C7D2FE', fontWeight: 600, marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Building2 style={{ width: '14px', height: '14px', color: '#F59E0B' }} /> Capital / Seat: <strong style={{ color: '#FFFFFF' }}>{activeRegionData.capital}</strong>
                </p>
              </div>
            </div>

            <div style={{ background: 'rgba(255, 255, 255, 0.1)', padding: '10px 16px', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.1)', textAlign: 'right' }}>
              <span style={{ fontSize: '0.75rem', color: '#C7D2FE', display: 'block', fontWeight: 700 }}>Visiting Places Directory</span>
              <span style={{ fontSize: '1.1rem', fontWeight: 900, color: '#F59E0B' }}>Top 20 Places in {selectedRegion}</span>
            </div>
          </div>

          {/* 4 Cultural Pillars Grid (Food, Culture, Temples, Clothes) */}
          <div className="region-pillars-grid">
            
            {/* Food Pillar */}
            <div className="pillar-card">
              <div className="pillar-title" style={{ color: '#FCD34D' }}>
                <Utensils style={{ width: '16px', height: '16px', color: '#F59E0B' }} /> Famous Food & Delicacies
              </div>
              <p className="pillar-text">
                {activeRegionData.famousFood}
              </p>
            </div>

            {/* Culture Pillar */}
            <div className="pillar-card">
              <div className="pillar-title" style={{ color: '#5EEAD4' }}>
                <Music style={{ width: '16px', height: '16px', color: '#2DD4BF' }} /> Culture, Dance & Festivals
              </div>
              <p className="pillar-text">
                {activeRegionData.culture}
              </p>
            </div>

            {/* Temples Pillar */}
            <div className="pillar-card">
              <div className="pillar-title" style={{ color: '#E9D5FF' }}>
                <Landmark style={{ width: '16px', height: '16px', color: '#C084FC' }} /> Famous Temples & Shrines
              </div>
              <p className="pillar-text">
                {activeRegionData.famousTemples}
              </p>
            </div>

            {/* Clothes Pillar */}
            <div className="pillar-card">
              <div className="pillar-title" style={{ color: '#FECDD3' }}>
                <Shirt style={{ width: '16px', height: '16px', color: '#FB7185' }} /> Traditional Clothes & Attire
              </div>
              <p className="pillar-text">
                {activeRegionData.traditionalClothes}
              </p>
            </div>

          </div>
        </div>

        {/* 4. Dynamic "Top 20 Places to Visit in [Selected State]" Section */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="top-places-header">
            <div>
              <span style={{ fontSize: '0.7rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#2563EB', background: '#EFF6FF', padding: '4px 12px', borderRadius: '9999px', border: '1px solid #BFDBFE', display: 'inline-block', marginBottom: '6px' }}>
                STATE SELECTION ACTIVE: {selectedRegion}
              </span>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Award style={{ width: '28px', height: '28px', color: '#F59E0B' }} />
                Top 20 Places to Visit in {selectedRegion}
              </h2>
            </div>

            {/* Best Season Optional Filter Bar */}
            <div className="season-filter-bar">
              <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 700, padding: '0 8px' }}>Season:</span>
              {[
                { id: 'ALL', label: 'All Seasons' },
                { id: 'Winter', label: '❄️ Winter' },
                { id: 'Summer', label: '☀️ Summer' },
                { id: 'Monsoon', label: '🌧️ Monsoon' }
              ].map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSeasonFilter(s.id)}
                  className={`season-btn ${seasonFilter === s.id ? 'active' : ''}`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div style={{ background: '#FFFFFF', borderRadius: '24px', padding: '48px', textAlign: 'center', border: '1px solid #E2E8F0' }}>
              <div style={{ width: '40px', height: '40px', border: '4px solid #2563EB', borderTopColor: 'transparent', borderRadius: '50%', margin: '0 auto 12px', animation: 'spin 1s linear infinite' }}></div>
              <p style={{ color: '#475569', fontWeight: 800, fontSize: '0.9rem' }}>Loading Top 20 Places in {selectedRegion}...</p>
            </div>
          ) : filteredTop20Places.length === 0 ? (
            <div style={{ background: '#FFFFFF', borderRadius: '24px', padding: '48px', textAlign: 'center', border: '1px solid #E2E8F0', maxWidth: '480px', margin: '32px auto' }}>
              <MapPin style={{ width: '48px', height: '48px', color: '#CBD5E1', margin: '0 auto 12px' }} />
              <h4 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1E293B' }}>No Places Found</h4>
              <p style={{ color: '#64748B', fontSize: '0.85rem', margin: '8px 0 16px' }}>
                No destinations matched "{searchQuery || seasonFilter}" in {selectedRegion}.
              </p>
              <button
                onClick={() => { setSearchQuery(''); setSeasonFilter('ALL'); setSearchParams({}); }}
                className="btn btn-primary"
              >
                Reset Search & Season Filters
              </button>
            </div>
          ) : (
            <div className="places-grid">
              {filteredTop20Places.map((place) => (
                <div key={place.rank + '-' + place.name} className="place-card-item">
                  
                  {/* Card Header Banner */}
                  <div className="place-card-banner">
                    <div style={{ display: 'flex', itemsCenter: 'center', justifyBetween: 'space-between', gap: '8px', marginBottom: '8px' }}>
                      <span className="place-rank-badge">
                        🏆 Rank #{place.rank} Choice in {selectedRegion}
                      </span>
                      <span style={{ background: 'rgba(255, 255, 255, 0.2)', padding: '2px 10px', borderRadius: '9999px', fontSize: '0.7rem', fontWeight: 800, color: '#2DD4BF', textTransform: 'uppercase' }}>
                        {place.cat}
                      </span>
                    </div>

                    <h4 style={{ fontSize: '1.35rem', fontWeight: 900, color: '#FFFFFF', lineHeight: 1.2, marginBottom: '4px' }}>
                      {place.name}
                    </h4>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: 700, color: '#99F6E4' }}>
                      <MapPin style={{ width: '14px', height: '14px', color: '#F59E0B' }} /> {place.city}, {selectedRegion}
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="place-card-body">
                    
                    {/* Description */}
                    <p className="place-desc-box">
                      {place.desc}
                    </p>

                    {/* Best Time & Season */}
                    <div className="place-season-box">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', fontWeight: 900, color: '#1E3A8A', textTransform: 'uppercase' }}>
                        <Calendar style={{ width: '16px', height: '16px', color: '#2563EB' }} /> Best Time to Visit & Season
                      </div>
                      <p style={{ fontSize: '0.8rem', fontWeight: 700, color: '#1E293B', margin: 0 }}>
                        🗓️ Best Months: <strong>{place.bestTime}</strong>
                      </p>
                      <p style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0F766E', margin: 0 }}>
                        🍂 Best Season: <strong>{place.bestSeason}</strong>
                      </p>
                    </div>

                    {/* History & Origin */}
                    {place.history && (
                      <div className="place-history-box">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', fontWeight: 900, color: '#78350F', textTransform: 'uppercase' }}>
                          <BookOpen style={{ width: '16px', height: '16px', color: '#D97706' }} /> Historical Origin & Heritage
                        </div>
                        <p style={{ fontSize: '0.8rem', color: '#334155', lineHeight: 1.5, margin: 0 }}>
                          {place.history}
                        </p>
                      </div>
                    )}

                  </div>

                  {/* Footer Action Buttons */}
                  <div className="place-card-actions">
                    <button
                      onClick={() => navigate(`/destination/${encodeURIComponent(place.city || place.name)}`, { state: { destination: place } })}
                      className="action-btn-explore"
                      title="Explore details, maps & guide"
                    >
                      <Compass style={{ width: '14px', height: '14px' }} /> Explore
                    </button>

                    <button
                      onClick={() => navigate('/plan', { state: { destination: place.city } })}
                      className="action-btn-plan"
                    >
                      <CalendarCheck style={{ width: '14px', height: '14px', color: '#60A5FA' }} /> Plan Trip
                    </button>

                    <button
                      onClick={() => navigate('/guide', { state: { city: place.city, destinationName: place.name } })}
                      className="action-btn-guide"
                    >
                      <Navigation style={{ width: '14px', height: '14px' }} /> Guide Me
                    </button>

                    <button
                      onClick={() => navigate('/guides', { state: { city: place.city } })}
                      className="action-btn-book"
                    >
                      <UserCheck style={{ width: '14px', height: '14px' }} /> Book Guide
                    </button>
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
