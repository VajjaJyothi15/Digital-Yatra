import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getEmergencyInfo, triggerSOS, shareLocation, getNearbyServices } from '../api/api';
import TrustBadge from '../components/TrustBadge';
import MapView from '../components/MapView';
import { ShieldAlert, PhoneCall, MapPin, Share2, FileText, CheckCircle2, Navigation, ExternalLink, X } from 'lucide-react';
import { getLiveLocation } from '../utils/geolocation';
import '../styles/safety.css';

const Safety = ({ user }) => {
  const navigate = useNavigate();

  const [emergencyData, setEmergencyData] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState('');
  const [hospitalList, setHospitalList] = useState([]);
  const [policeList, setPoliceList] = useState([]);
  const [nearestHospital, setNearestHospital] = useState(null);
  const [nearestPolice, setNearestPolice] = useState(null);

  const [selectedMapPlace, setSelectedMapPlace] = useState(null);
  const [showMapModal, setShowMapModal] = useState(false);

  const [sosActive, setSosActive] = useState(false);
  const [sosResult, setSosResult] = useState(null);
  const [shareData, setShareData] = useState(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchEmergencyInfo();
    detectGPS();
  }, []);

  const detectGPS = () => {
    setLocationError('');
    getLiveLocation(
      (loc) => {
        setUserLocation(loc);
        fetchResponders(loc.lat, loc.lng);
      },
      (err) => {
        setLocationError("Your current location is unavailable. You can search a location manually or enable GPS permission.");
      }
    );
  };

  const fetchEmergencyInfo = async () => {
    try {
      const res = await getEmergencyInfo();
      if (res.success) {
        setEmergencyData(res);
      }
    } catch (err) {
      console.error('Emergency info fetch error:', err);
    }
  };

  const fetchResponders = async (lat, lng) => {
    try {
      const hospRes = await getNearbyServices({ lat, lng, category: 'Hospital' });
      if (hospRes.success && hospRes.services && hospRes.services.length > 0) {
        setHospitalList(hospRes.services);
        setNearestHospital(hospRes.services[0]);
      }
      const polRes = await getNearbyServices({ lat, lng, category: 'Police' });
      if (polRes.success && polRes.services && polRes.services.length > 0) {
        setPoliceList(polRes.services);
        setNearestPolice(polRes.services[0]);
      }
    } catch (err) {
      console.error('Fetch responders error:', err);
    }
  };

  const openInternalMapModal = (place) => {
    setSelectedMapPlace(place);
    setShowMapModal(true);
  };

  const handleSosTrigger = async () => {
    setLoading(true);
    try {
      const res = await triggerSOS({
        user_id: user ? user.id : 1,
        latitude: userLocation.lat,
        longitude: userLocation.lng,
        details: 'Tourist Pressed 🚨 SOS Button in Safety Mode'
      });
      if (res.success) {
        setSosResult(res.sos);
        setSosActive(true);
      }
    } catch (err) {
      console.error('SOS Trigger error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleShareLocation = async () => {
    try {
      const res = await shareLocation({
        user_id: user ? user.id : 1,
        latitude: userLocation.lat,
        longitude: userLocation.lng
      });
      if (res.success) {
        setShareData(res.share);
      }
    } catch (err) {
      console.error('Share location error:', err);
    }
  };

  const copyShareLink = () => {
    if (shareData && shareData.share_url) {
      navigator.clipboard.writeText(shareData.share_url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 3000);
    }
  };

  return (
    <div className="safety-container">
      {/* Red Hero Banner */}
      <div className="safety-hero">
        <span style={{ background: 'rgba(255,255,255,0.2)', padding: '4px 14px', borderRadius: '16px', fontSize: '0.8rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' }}>
          EMERGENCY SAFETY MODE
        </span>
        <h1 style={{ fontSize: '2.5rem', color: 'white', marginTop: '8px' }}>🚨 Tourist Safety Hub</h1>
        <p style={{ color: '#FCA5A5', fontSize: '1rem', maxWidth: '600px', margin: '8px auto 0 auto' }}>
          Instant Emergency SOS, National Hotline 112, Nearest Hospital/Police lookup, and Trusted Contact Location Sharing.
        </p>

        {/* SOS Big Pulsing Trigger */}
        <div className="sos-button-wrapper">
          <button className="sos-big-btn" onClick={handleSosTrigger} disabled={loading}>
            <span>🚨</span>
            <span>{loading ? '...' : 'SOS'}</span>
          </button>
        </div>

        <div style={{ fontSize: '0.9rem', color: '#FEE2E2', fontWeight: '600' }}>
          Tap SOS to trigger emergency responder alerts
        </div>
      </div>

      {/* SOS Active Result Banner */}
      {sosActive && sosResult && (
        <div className="glass-card" style={{ background: '#FEF2F2', border: '2px solid #EF4444', padding: '24px', marginBottom: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ color: '#991B1B', fontSize: '1.4rem' }}>🚨 ACTIVE SOS ALERT TRIGGERED</h2>
            <span style={{ background: '#EF4444', color: 'white', padding: '4px 12px', borderRadius: '12px', fontWeight: '800', fontSize: '0.8rem' }}>
              {sosResult.sos_id}
            </span>
          </div>

          <p style={{ color: '#7F1D1D', marginBottom: '16px', fontSize: '0.95rem' }}>
            Emergency alert logged in system. National Emergency Number: <strong>112</strong>
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            {sosResult.nearest_hospital && (
              <div style={{ background: 'white', padding: '16px', borderRadius: '12px', borderLeft: '4px solid #EF4444' }}>
                <strong style={{ color: '#991B1B' }}>🏥 Nearest Hospital:</strong>
                <div>{sosResult.nearest_hospital.name} ({sosResult.nearest_hospital.distance_formatted})</div>
              </div>
            )}
            {sosResult.nearest_police && (
              <div style={{ background: 'white', padding: '16px', borderRadius: '12px', borderLeft: '4px solid #3B82F6' }}>
                <strong style={{ color: '#1D4ED8' }}>👮 Nearest Police Station:</strong>
                <div>{sosResult.nearest_police.name} ({sosResult.nearest_police.distance_formatted})</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* National Emergency Hotline Cards Grid */}
      <h2 style={{ fontSize: '1.4rem', marginBottom: '16px' }}>📞 Emergency Contact Hotlines</h2>
      <div className="emergency-numbers-grid">
        <a href="tel:112" className="emergency-num-card" style={{ background: '#FEF2F2', borderColor: '#FCA5A5' }}>
          <div style={{ fontSize: '1.8rem' }}>📞</div>
          <div style={{ fontWeight: '800', fontSize: '1.4rem', color: '#991B1B' }}>112</div>
          <div style={{ fontSize: '0.8rem', color: '#7F1D1D', fontWeight: '700' }}>National Emergency</div>
        </a>

        <a href="tel:100" className="emergency-num-card">
          <div style={{ fontSize: '1.8rem' }}>👮</div>
          <div style={{ fontWeight: '800', fontSize: '1.4rem', color: 'var(--primary)' }}>100</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Police Helpline</div>
        </a>

        <a href="tel:108" className="emergency-num-card">
          <div style={{ fontSize: '1.8rem' }}>🚑</div>
          <div style={{ fontWeight: '800', fontSize: '1.4rem', color: '#D97706' }}>108</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Medical Ambulance</div>
        </a>

        <a href="tel:1363" className="emergency-num-card">
          <div style={{ fontSize: '1.8rem' }}>🧭</div>
          <div style={{ fontWeight: '800', fontSize: '1.4rem', color: '#2563EB' }}>1363</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Tourist Helpline</div>
        </a>
      </div>

      {/* Nearest Hospital & Police Cards */}
      <div className="safety-actions-grid">
        {/* Nearest Hospital Card */}
        <div className="safety-card">
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h3 style={{ fontSize: '1.15rem' }}>🏥 Nearest Hospital</h3>
              {nearestHospital && <TrustBadge status={nearestHospital.trust_status} />}
            </div>

            {nearestHospital ? (
              <div>
                <h4 style={{ color: 'var(--primary)', marginBottom: '4px' }}>{nearestHospital.name}</h4>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                  📏 Distance: <strong>{nearestHospital.distance_formatted}</strong> • Rating: ⭐ {nearestHospital.rating}
                </div>
              </div>
            ) : (
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                {locationError || "Locating medical facilities near your GPS position..."}
              </p>
            )}
          </div>

          {nearestHospital && (
            <div className="flex flex-col gap-2 mt-4">
              <button
                type="button"
                onClick={() => openInternalMapModal(nearestHospital)}
                className="btn btn-primary text-xs font-black flex items-center justify-center gap-1.5 py-2.5 w-full rounded-xl shadow"
              >
                <MapPin size={16} /> 📍 Show on Digital Yatra Map
              </button>

              <a
                href={`https://www.google.com/maps/dir/?api=1${userLocation && userLocation.lat ? `&origin=${userLocation.lat},${userLocation.lng}` : ''}&destination=${nearestHospital.latitude},${nearestHospital.longitude}`}
                target="_blank"
                rel="noreferrer"
                className="btn btn-secondary text-xs font-black flex items-center justify-center gap-1.5 py-2.5 w-full rounded-xl"
              >
                <ExternalLink size={16} /> 🗺️ Open in Google Maps
              </a>
            </div>
          )}
        </div>

        {/* Nearest Police Station Card */}
        <div className="safety-card">
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h3 style={{ fontSize: '1.15rem' }}>👮 Nearest Police Station</h3>
              {nearestPolice && <TrustBadge status={nearestPolice.trust_status} />}
            </div>

            {nearestPolice ? (
              <div>
                <h4 style={{ color: 'var(--primary)', marginBottom: '4px' }}>{nearestPolice.name}</h4>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                  📏 Distance: <strong>{nearestPolice.distance_formatted}</strong> • Rating: ⭐ {nearestPolice.rating}
                </div>
              </div>
            ) : (
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                {locationError || "Locating police posts near your GPS position..."}
              </p>
            )}
          </div>

          {nearestPolice && (
            <div className="flex flex-col gap-2 mt-4">
              <button
                type="button"
                onClick={() => openInternalMapModal(nearestPolice)}
                className="btn btn-primary text-xs font-black flex items-center justify-center gap-1.5 py-2.5 w-full rounded-xl shadow"
              >
                <MapPin size={16} /> 📍 Show on Digital Yatra Map
              </button>

              <a
                href={`https://www.google.com/maps/dir/?api=1${userLocation && userLocation.lat ? `&origin=${userLocation.lat},${userLocation.lng}` : ''}&destination=${nearestPolice.latitude},${nearestPolice.longitude}`}
                target="_blank"
                rel="noreferrer"
                className="btn btn-secondary text-xs font-black flex items-center justify-center gap-1.5 py-2.5 w-full rounded-xl"
              >
                <ExternalLink size={16} /> 🗺️ Open in Google Maps
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Internal Digital Yatra Interactive Map Modal */}
      {showMapModal && selectedMapPlace && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-4xl w-full shadow-2xl relative space-y-4 border border-slate-200">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <span className="text-[11px] font-black uppercase text-red-600 tracking-wider block">
                  📍 Digital Yatra Internal Interactive Map
                </span>
                <h3 className="text-xl font-black text-slate-900">
                  {selectedMapPlace.name}
                </h3>
                <p className="text-xs text-slate-500 font-bold">
                  Category: {selectedMapPlace.category} • Distance: {selectedMapPlace.distance_formatted || 'Near your location'}
                </p>
              </div>
              <button
                onClick={() => setShowMapModal(false)}
                className="p-2 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-700 font-bold transition"
              >
                <X size={20} />
              </button>
            </div>

            <div className="h-[420px] rounded-2xl overflow-hidden border border-slate-300 shadow-inner">
              <MapView
                center={[selectedMapPlace.latitude, selectedMapPlace.longitude]}
                markers={[selectedMapPlace]}
                userLocation={userLocation}
                destinationLocation={{
                  lat: selectedMapPlace.latitude,
                  lng: selectedMapPlace.longitude,
                  name: selectedMapPlace.name
                }}
              />
            </div>

            <div className="flex flex-wrap justify-between items-center gap-3 pt-2 border-t border-slate-100">
              <a
                href={`https://www.google.com/maps/dir/?api=1${userLocation && userLocation.lat ? `&origin=${userLocation.lat},${userLocation.lng}` : ''}&destination=${selectedMapPlace.latitude},${selectedMapPlace.longitude}`}
                target="_blank"
                rel="noreferrer"
                className="btn btn-secondary text-xs font-black flex items-center gap-1.5 px-4 py-2 rounded-xl"
              >
                <ExternalLink size={14} /> 🗺️ Switch to Google Maps
              </a>
              <button
                onClick={() => setShowMapModal(false)}
                className="btn btn-primary text-xs font-black px-5 py-2 rounded-xl"
              >
                Close Map
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Trusted Contact Location Sharing Section */}
      <div className="glass-card" style={{ padding: '24px', marginBottom: '32px' }}>
        <h3 style={{ fontSize: '1.2rem', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Share2 size={20} color="var(--primary)" /> Trusted Contact Location Sharing
        </h3>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
          Share your real-time GPS coordinates and Google Maps tracking link with family or a trusted contact.
        </p>

        {!shareData ? (
          <button className="btn btn-primary" onClick={handleShareLocation}>
            <Share2 size={16} /> Share My Location
          </button>
        ) : (
          <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '12px', border: '1px solid #CBD5E1' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--primary)', marginBottom: '6px' }}>
              Live Tracking Link Generated:
            </div>
            <input
              type="text"
              readOnly
              className="form-control"
              value={shareData.share_url}
              style={{ fontSize: '0.85rem', marginBottom: '12px' }}
            />
            <button className="btn btn-secondary" onClick={copyShareLink} style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
              {copiedLink ? <><CheckCircle2 size={16} color="var(--success)" /> Link Copied!</> : 'Copy Shareable Link'}
            </button>
          </div>
        )}
      </div>

      {/* Report Safety Issue Bridge Card */}

      {/* Report Safety Issue Bridge Card */}
      <div className="glass-card" style={{ background: '#FFFBEB', border: '1px solid #FDE68A', padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', color: '#92400E' }}>Encountered a Safety Incident or Harassment?</h3>
            <p style={{ fontSize: '0.85rem', color: '#B45309', marginTop: '4px' }}>
              Log a formal safety incident report to notify destination managers and tourist authorities.
            </p>
          </div>
          <button className="btn btn-accent" onClick={() => navigate('/report')}>
            <FileText size={16} /> Report Safety Issue
          </button>
        </div>
      </div>
    </div>
  );
};

export default Safety;
