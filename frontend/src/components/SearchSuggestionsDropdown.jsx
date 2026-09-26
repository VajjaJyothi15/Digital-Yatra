import React from 'react';
import { MapPin, Loader2 } from 'lucide-react';

/**
 * Clean, responsive, mobile-friendly destination suggestion dropdown
 * matching Digital Yatra design aesthetics.
 */
export default function SearchSuggestionsDropdown({
  suggestions = [],
  loading = false,
  isOpen = false,
  query = '',
  onSelect,
  style = {}
}) {
  if (!isOpen || !query || !query.trim()) {
    return null;
  }

  return (
    <div
      className="search-suggestions-dropdown"
      style={{
        position: 'absolute',
        top: 'calc(100% + 6px)',
        left: 0,
        right: 0,
        width: '100%',
        backgroundColor: '#FFFFFF',
        borderRadius: '16px',
        border: '1px solid #CBD5E1',
        boxShadow: '0 16px 40px rgba(0, 0, 0, 0.25)',
        zIndex: 999999,
        overflow: 'hidden',
        maxHeight: '340px',
        overflowY: 'auto',
        textAlign: 'left',
        boxSizing: 'border-box',
        ...style
      }}
    >
      {loading && suggestions.length === 0 ? (
        <div style={{
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          color: '#64748B',
          fontSize: '0.88rem',
          fontWeight: '600'
        }}>
          <Loader2 className="animate-spin" size={18} style={{ color: '#2563EB' }} />
          <span>Searching destinations...</span>
        </div>
      ) : suggestions.length === 0 ? (
        <div style={{
          padding: '18px 20px',
          textAlign: 'center',
          color: '#64748B',
          fontSize: '0.88rem',
          fontWeight: '600',
          background: '#F8FAFC'
        }}>
          🔍 No matching destinations found
        </div>
      ) : (
        <ul style={{ listStyle: 'none', margin: 0, padding: '6px 0' }}>
          {suggestions.map((item) => (
            <li
              key={item.id}
              onClick={() => onSelect(item.searchValue || item.title)}
              className="suggestion-item"
              style={{
                padding: '10px 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px',
                cursor: 'pointer',
                transition: 'background-color 0.15s ease',
                borderBottom: '1px solid #F1F5F9'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#EFF6FF';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', overflow: 'hidden' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '10px',
                  backgroundColor: '#DBEAFE',
                  color: '#2563EB',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <MapPin size={16} />
                </div>
                <div style={{ overflow: 'hidden' }}>
                  <div style={{
                    fontSize: '0.92rem',
                    fontWeight: '700',
                    color: '#0F172A',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {item.title}
                  </div>
                  <div style={{
                    fontSize: '0.78rem',
                    color: '#64748B',
                    fontWeight: '500',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {item.subtitle}
                  </div>
                </div>
              </div>

              {item.category && (
                <span style={{
                  fontSize: '0.7rem',
                  fontWeight: '700',
                  color: '#1E40AF',
                  backgroundColor: '#F1F5F9',
                  padding: '3px 8px',
                  borderRadius: '8px',
                  whiteSpace: 'nowrap',
                  flexShrink: 0
                }}>
                  {item.category}
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
