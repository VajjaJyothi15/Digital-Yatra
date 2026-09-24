import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { compareFare } from '../api/api';
import TrustBadge from './TrustBadge';
import { Calculator, AlertTriangle, CheckCircle, ArrowRight, FileText } from 'lucide-react';

const FareCalculator = () => {
  const navigate = useNavigate();

  const [transportType, setTransportType] = useState('Auto');
  const [origin, setOrigin] = useState('Baga Beach');
  const [destination, setDestination] = useState('Panaji Market');
  const [quotedFare, setQuotedFare] = useState(250);

  const [fareResult, setFareResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCompare = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await compareFare({
        transport_type: transportType,
        origin,
        destination,
        quoted_fare: parseFloat(quotedFare)
      });
      if (res.success) {
        setFareResult(res.fare_analysis);
      }
    } catch (err) {
      console.error('Fare error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card" style={{ padding: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
        <Calculator size={22} color="var(--primary)" />
        <h3 style={{ fontSize: '1.2rem' }}>🚕 Fare Transparency Calculator</h3>
      </div>
      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '18px' }}>
        Check if a quoted taxi or auto fare matches estimated fare ranges in your area.
      </p>

      <form onSubmit={handleCompare}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div className="form-group">
            <label>Transport Type</label>
            <select 
              className="form-control"
              value={transportType}
              onChange={(e) => setTransportType(e.target.value)}
            >
              <option value="Auto">Auto Rickshaw</option>
              <option value="Taxi">Cab / Taxi</option>
              <option value="Bus">Public Bus</option>
              <option value="Metro">Metro</option>
            </select>
          </div>

          <div className="form-group">
            <label>Quoted Fare (INR ₹)</label>
            <input 
              type="number"
              className="form-control"
              value={quotedFare}
              onChange={(e) => setQuotedFare(e.target.value)}
              required
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div className="form-group">
            <label>Start Location</label>
            <input 
              type="text"
              className="form-control"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Destination</label>
            <input 
              type="text"
              className="form-control"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              required
            />
          </div>
        </div>

        <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '4px' }} disabled={loading}>
          {loading ? 'Checking Fare...' : 'Compare Quoted Fare'}
        </button>
      </form>

      {/* Result Display */}
      {fareResult && (
        <div 
          style={{ 
            marginTop: '20px', 
            padding: '18px', 
            borderRadius: '14px', 
            background: fareResult.is_overcharging ? '#FEF2F2' : '#F0FDF4',
            border: fareResult.is_overcharging ? '1.5px solid #FCA5A5' : '1.5px solid #86EFAC'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: '700', color: fareResult.is_overcharging ? '#991B1B' : '#166534' }}>
              {fareResult.is_overcharging ? '⚠️ HIGH QUOTE ALERT' : '✓ FAIR QUOTE'}
            </span>
            <TrustBadge status={fareResult.trust_status} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '6px' }}>
            <span>Estimated Fare Range:</span>
            <strong style={{ color: 'var(--primary)' }}>{fareResult.formatted_range}</strong>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '12px' }}>
            <span>Quoted Amount:</span>
            <strong style={{ color: fareResult.is_overcharging ? '#DC2626' : '#16A34A', fontSize: '1.05rem' }}>
              ₹{fareResult.quoted_fare}
            </strong>
          </div>

          <p style={{ fontSize: '0.85rem', color: fareResult.is_overcharging ? '#7F1D1D' : '#14532D', marginBottom: '14px', lineHeight: '1.4' }}>
            {fareResult.warning_message}
          </p>

          {fareResult.is_overcharging && (
            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                className="btn btn-secondary" 
                style={{ flex: 1, padding: '8px', fontSize: '0.8rem' }}
                onClick={() => navigate('/guide', { state: { category: 'Transport' } })}
              >
                View Alternatives
              </button>
              <button 
                className="btn btn-accent" 
                style={{ flex: 1, padding: '8px', fontSize: '0.8rem' }}
                onClick={() => navigate('/report', { state: { category: 'Overcharging' } })}
              >
                <FileText size={14} /> Report Issue
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FareCalculator;
