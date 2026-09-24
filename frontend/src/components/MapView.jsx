import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, Polyline, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import TrustBadge from './TrustBadge';

// Pure SVG Map Pin Icons (Zero Image Files)
const createSvgPin = (bgColor, emoji) => L.divIcon({
  className: 'custom-svg-pin',
  html: `<div style="
    background: ${bgColor};
    width: 34px;
    height: 34px;
    border-radius: 50% 50% 50% 0;
    transform: rotate(-45deg);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 12px rgba(0,0,0,0.35);
    border: 2px solid white;
  "><span style="transform: rotate(45deg); font-size: 15px;">${emoji}</span></div>`,
  iconSize: [34, 34],
  iconAnchor: [17, 34],
  popupAnchor: [0, -34]
});

const userGpsIcon = createSvgPin('#EF4444', '📍');
const destinationMarkerIcon = createSvgPin('#F59E0B', '🚩');
const defaultMarkerIcon = createSvgPin('#2563EB', '🏛️');

// Component to dynamically fit map bounds or center on target location
const MapFitBounds = ({ points, targetLocation }) => {
  const map = useMap();
  useEffect(() => {
    if (targetLocation && targetLocation.lat && targetLocation.lng) {
      map.setView([targetLocation.lat, targetLocation.lng], 15, { animate: true });
    } else {
      const validPoints = points.filter(p => p && p[0] != null && p[1] != null);
      if (validPoints.length >= 2) {
        const bounds = L.latLngBounds(validPoints);
        map.fitBounds(bounds, { padding: [60, 60], maxZoom: 15 });
      } else if (validPoints.length === 1) {
        map.setView(validPoints[0], 14, { animate: true });
      }
    }
  }, [points, targetLocation, map]);
  return null;
};

// Map click listener to set live GPS pin by clicking on the map
const MapClickListener = ({ onMapClick }) => {
  useMapEvents({
    click(e) {
      if (onMapClick) {
        onMapClick({ lat: e.latlng.lat, lng: e.latlng.lng });
      }
    }
  });
  return null;
};

export default function MapView({ center, markers = [], userLocation, destinationLocation, onMapClick }) {
  // Determine points for auto bounds
  const pointsForBounds = [];
  if (userLocation && userLocation.lat && userLocation.lng) {
    pointsForBounds.push([userLocation.lat, userLocation.lng]);
  }
  if (destinationLocation && destinationLocation.lat && destinationLocation.lng) {
    pointsForBounds.push([destinationLocation.lat, destinationLocation.lng]);
  }

  // Determine active initial center
  const currentCenter = destinationLocation && destinationLocation.lat && destinationLocation.lng
    ? [destinationLocation.lat, destinationLocation.lng]
    : userLocation && userLocation.lat && userLocation.lng 
      ? [userLocation.lat, userLocation.lng]
      : center && center[0] && center[1] 
        ? center 
        : (markers.length > 0 && markers[0].latitude && markers[0].longitude 
            ? [markers[0].latitude, markers[0].longitude] 
            : [26.9239, 75.8267]); // Dynamic Jaipur/Goa fallback

  return (
    <div style={{ width: '100%', height: '100%', minHeight: '450px', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)', position: 'relative' }}>
      
      {/* Map Header Status Badge */}
      <div className="absolute top-3 right-3 z-[1000] bg-slate-900/90 text-white px-3.5 py-1.5 rounded-xl text-xs font-bold shadow-lg backdrop-blur-md border border-white/20 flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
        <span>🗺️ INTERACTIVE MAP ACTIVE</span>
      </div>

      <MapContainer 
        center={currentCenter} 
        zoom={14} 
        scrollWheelZoom={false}
        style={{ width: '100%', height: '100%' }}
      >
        <MapFitBounds points={pointsForBounds} targetLocation={destinationLocation} />
        {onMapClick && <MapClickListener onMapClick={onMapClick} />}
        
        {/* OpenStreetMap / Leaflet Tiles */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* 1. User Live GPS Location Marker & Pulsating Circle */}
        {userLocation && userLocation.lat && userLocation.lng && (
          <>
            <Circle
              center={[userLocation.lat, userLocation.lng]}
              radius={userLocation.accuracy || 300}
              pathOptions={{ color: '#EF4444', fillColor: '#EF4444', fillOpacity: 0.15, weight: 2 }}
            />
            <Marker position={[userLocation.lat, userLocation.lng]} icon={userGpsIcon}>
              <Popup>
                <div style={{ textAlign: 'center', padding: '4px' }}>
                  <strong style={{ color: '#DC2626', fontSize: '0.9rem' }}>🎯 Your Live GPS Location</strong>
                  <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '2px' }}>
                    Lat: {userLocation.lat.toFixed(4)}, Lng: {userLocation.lng.toFixed(4)}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#2563EB', marginTop: '4px', fontWeight: 'bold' }}>
                    Source: {userLocation.source || 'Device GPS'}
                  </div>
                </div>
              </Popup>
            </Marker>
          </>
        )}

        {/* 2. Target Destination Marker */}
        {destinationLocation && destinationLocation.lat && destinationLocation.lng && (
          <Marker position={[destinationLocation.lat, destinationLocation.lng]} icon={destinationMarkerIcon}>
            <Popup>
              <div style={{ textAlign: 'center', padding: '4px' }}>
                <strong style={{ color: '#D97706', fontSize: '0.95rem' }}>🚩 Requested Destination</strong>
                <div style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#0F172A', marginTop: '2px' }}>
                  {destinationLocation.name || destinationLocation.city}
                </div>
                {destinationLocation.city && (
                  <div style={{ fontSize: '0.75rem', color: '#64748B' }}>{destinationLocation.city}</div>
                )}
                <a 
                  href={`https://www.google.com/maps/dir/?api=1${userLocation && userLocation.lat ? `&origin=${userLocation.lat},${userLocation.lng}` : ''}&destination=${destinationLocation.lat},${destinationLocation.lng}`} 
                  target="_blank" 
                  rel="noreferrer"
                  style={{ 
                    display: 'block', 
                    textAlign: 'center', 
                    padding: '6px 10px', 
                    fontSize: '0.75rem', 
                    marginTop: '8px',
                    backgroundColor: '#2563EB', 
                    color: '#FFFFFF', 
                    borderRadius: '8px', 
                    fontWeight: 'bold', 
                    textDecoration: 'none' 
                  }}
                >
                  Open Directions on Google Maps 🧭
                </a>
              </div>
            </Popup>
          </Marker>
        )}

        {/* 3. Dashed Route Line connecting Live Location to Destination */}
        {userLocation && userLocation.lat && destinationLocation && destinationLocation.lat && (
          <Polyline
            positions={[
              [userLocation.lat, userLocation.lng],
              [destinationLocation.lat, destinationLocation.lng]
            ]}
            pathOptions={{ color: '#2563EB', weight: 4, dashArray: '8, 8', opacity: 0.8 }}
          />
        )}

        {/* 4. Selected Destination Center Marker if no specific destinationLocation passed */}
        {markers.length === 0 && !destinationLocation && (!userLocation || !userLocation.lat) && (
          <Marker position={currentCenter} icon={defaultMarkerIcon}>
            <Popup>
              <div style={{ textAlign: 'center', padding: '4px' }}>
                <strong>📍 Destination Location Center</strong>
              </div>
            </Popup>
          </Marker>
        )}

        {/* 5. Service & Nearby Facility Markers */}
        {markers.map((m, idx) => (
          <Marker key={m.id || idx} position={[m.latitude, m.longitude]} icon={defaultMarkerIcon}>
            <Popup>
              <div style={{ padding: '4px', maxWidth: '220px' }}>
                <div style={{ marginBottom: '6px' }}>
                  <TrustBadge status={m.trust_status || 'VERIFIED'} />
                </div>
                <h4 style={{ fontSize: '0.95rem', margin: '4px 0', fontWeight: 'bold', color: '#0F172A' }}>{m.name}</h4>
                <div style={{ fontSize: '0.8rem', color: '#64748B', marginBottom: '6px' }}>
                  Category: <strong>{m.category}</strong>
                </div>
                {m.distance_formatted && (
                  <div style={{ fontSize: '0.8rem', color: '#0F766E', fontWeight: '700', marginBottom: '8px' }}>
                    📏 Distance: {m.distance_formatted}
                  </div>
                )}
                <a 
                  href={`https://www.google.com/maps/dir/?api=1${userLocation && userLocation.lat ? `&origin=${userLocation.lat},${userLocation.lng}` : ''}&destination=${m.latitude},${m.longitude}`} 
                  target="_blank" 
                  rel="noreferrer"
                  style={{ 
                    display: 'block', 
                    textAlign: 'center', 
                    padding: '8px 12px', 
                    fontSize: '0.75rem', 
                    width: '100%', 
                    backgroundColor: '#2563EB', 
                    color: '#FFFFFF', 
                    borderRadius: '8px', 
                    fontWeight: 'bold', 
                    textDecoration: 'none' 
                  }}
                >
                  Navigate on Google Maps 🧭
                </a>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
