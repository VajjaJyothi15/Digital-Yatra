import React from 'react';
import TrustBadge from './TrustBadge';
import { MapPin } from 'lucide-react';

const DestinationCard = ({ destination, onSelect }) => {
  return (
    <div className="dest-card">
      <div className="dest-card-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <span style={{ fontSize: '0.8rem', background: 'rgba(255,255,255,0.2)', padding: '4px 10px', borderRadius: '12px', fontWeight: '600' }}>
            {destination.category}
          </span>
          <TrustBadge status={destination.trust_status} />
        </div>
        <div>
          <h3 style={{ fontSize: '1.2rem', color: 'white' }}>{destination.name}</h3>
          <div style={{ fontSize: '0.85rem', color: '#2DD4BF', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <MapPin size={14} /> {destination.city}
          </div>
        </div>
      </div>
      <div className="dest-card-body">
        <p className="dest-card-desc">
          {destination.description && destination.description.length > 100 
            ? `${destination.description.substring(0, 100)}...` 
            : destination.description}
        </p>
        <div className="dest-card-footer">
          <div>
            <span style={{ fontWeight: '700', fontSize: '1.05rem', color: 'var(--primary)' }}>
              {destination.entry_fee > 0 ? `₹${destination.entry_fee}` : 'Free'}
            </span>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              ⭐ {destination.rating} / 5.0
            </div>
          </div>
          {onSelect && (
            <button 
              className="btn btn-primary" 
              style={{ padding: '8px 14px', fontSize: '0.8rem' }}
              onClick={() => onSelect(destination)}
            >
              Add to Plan
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DestinationCard;
