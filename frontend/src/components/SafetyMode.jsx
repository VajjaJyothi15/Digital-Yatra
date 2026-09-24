import React, { useState } from 'react';
import { triggerSOS } from '../api/api';
import { ShieldAlert, PhoneCall, AlertTriangle, X } from 'lucide-react';

const SafetyMode = ({ userLocation, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [sosResult, setSosResult] = useState(null);
  const [error, setError] = useState('');

  const handleTrigger = async () => {
    setError('');
    if (!userLocation || !userLocation.lat || !userLocation.lng) {
      setError('Location access is unavailable. Please grant location permission or search destination to send SOS alert.');
      return;
    }

    setLoading(true);
    try {
      const res = await triggerSOS({
        user_id: 1,
        latitude: userLocation.lat,
        longitude: userLocation.lng,
        details: 'Tourist Pressed Emergency SOS Alert'
      });
      if (res.success) {
        setSosResult(res.sos);
      } else {
        setError(res.message || 'Failed to send SOS.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error sending SOS alert.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content" style={{ borderTop: '6px solid #EF4444' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#B91C1C', fontWeight: '800', fontSize: '1.2rem' }}>
            <ShieldAlert size={24} /> 🚨 EMERGENCY SOS TRIGGER
          </div>
          {onClose && <X size={20} style={{ cursor: 'pointer' }} onClick={onClose} />}
        </div>

        {error && (
          <div style={{ padding: '12px', background: '#FEF2F2', border: '1px solid #FCA5A5', color: '#991B1B', borderRadius: '12px', fontSize: '0.85rem', marginBottom: '16px' }}>
            ⚠️ {error}
          </div>
        )}

        {!sosResult ? (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>
              Press the SOS button below to alert nearest emergency responders and fetch immediate assistance.
            </p>

            <div className="sos-button-wrapper">
              <button className="sos-big-btn" onClick={handleTrigger} disabled={loading}>
                <span>🚨</span>
                <span style={{ fontSize: '1.4rem' }}>{loading ? '...' : 'SOS'}</span>
              </button>
            </div>

            <div style={{ background: '#FEF2F2', padding: '12px', borderRadius: '12px', color: '#991B1B', fontSize: '0.85rem' }}>
              📞 National Emergency Helpline Hotline: <strong>112</strong>
            </div>
          </div>
        ) : (
          <div style={{ background: '#FEF2F2', padding: '20px', borderRadius: '16px', border: '1px solid #FCA5A5' }}>
            <h3 style={{ color: '#991B1B', marginBottom: '12px' }}>🚨 SOS ALERT ACTIVATED</h3>
            <div style={{ fontSize: '0.9rem', marginBottom: '16px' }}>
              SOS ID: <strong>{sosResult.sos_id}</strong> • Emergency Hotline: <strong>112</strong>
            </div>

            {sosResult.nearest_hospital && (
              <div style={{ background: 'white', padding: '14px', borderRadius: '12px', marginBottom: '12px', borderLeft: '4px solid #EF4444' }}>
                <strong style={{ color: '#991B1B' }}>🏥 Nearest Hospital:</strong> {sosResult.nearest_hospital.name} ({sosResult.nearest_hospital.distance_formatted})
              </div>
            )}

            {sosResult.nearest_police && (
              <div style={{ background: 'white', padding: '14px', borderRadius: '12px', borderLeft: '4px solid #3B82F6' }}>
                <strong style={{ color: '#1D4ED8' }}>👮 Nearest Police Station:</strong> {sosResult.nearest_police.name} ({sosResult.nearest_police.distance_formatted})
              </div>
            )}

            <button className="btn btn-danger" style={{ width: '100%', marginTop: '20px' }} onClick={onClose}>
              Close Emergency Alert
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SafetyMode;
