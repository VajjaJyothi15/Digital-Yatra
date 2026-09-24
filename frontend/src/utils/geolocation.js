/**
 * Robust Geolocation Utility for Digital Yatra
 * Provides exact device GPS tracking, Nominatim search, and interactive map location resolution.
 */

export const saveLiveLocation = (loc) => {
  if (loc && loc.lat && loc.lng) {
    try {
      localStorage.setItem('dy_live_location', JSON.stringify(loc));
      window.dispatchEvent(new CustomEvent('dy_location_updated', { detail: loc }));
    } catch (e) {
      console.warn("Failed to store live location:", e);
    }
  }
};

export const getSavedLiveLocation = () => {
  try {
    const saved = localStorage.getItem('dy_live_location');
    return saved ? JSON.parse(saved) : null;
  } catch (e) {
    return null;
  }
};

export const getLiveLocation = (onSuccess, onError, onStatusUpdate) => {
  if (onStatusUpdate) onStatusUpdate("⚡ Requesting Live Device GPS...");

  if (!navigator.geolocation) {
    const err = new Error("Geolocation API not supported by browser");
    if (onStatusUpdate) onStatusUpdate("⚠️ Browser does not support geolocation. Search location or click map.");
    if (onError) onError(err);
    return;
  }

  // Request native browser location with sufficient timeout for device/browser permission
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const loc = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        accuracy: position.coords.accuracy,
        source: 'device_gps'
      };
      saveLiveLocation(loc);
      if (onStatusUpdate) {
        onStatusUpdate(`🎯 Present Location Active (${loc.lat.toFixed(4)}, ${loc.lng.toFixed(4)})`);
      }
      onSuccess(loc);
    },
    (err) => {
      console.warn("Native Geolocation failed/denied:", err.message, "code:", err.code);
      let userMsg = "⚠️ Present location unavailable. Search destination or click map to set pin.";
      if (err.code === 1) {
        userMsg = "⚠️ Location permission denied by browser. Please allow location access or search location below.";
      } else if (err.code === 2) {
        userMsg = "⚠️ Location position unavailable on device. Search location below.";
      } else if (err.code === 3) {
        userMsg = "⚠️ Location request timed out. Retrying or search destination below.";
      }

      if (onStatusUpdate) onStatusUpdate(userMsg);
      if (onError) {
        onError(err);
      } else {
        const apFallback = { lat: 16.5062, lng: 80.6480, source: 'Andhra Pradesh Fallback' };
        if (onSuccess) onSuccess(apFallback);
      }
    },
    { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 }
  );
};

export const watchLiveLocation = (onLocationUpdate, onError, onStatusUpdate) => {
  if (!navigator.geolocation) return null;

  return navigator.geolocation.watchPosition(
    (position) => {
      const loc = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        accuracy: position.coords.accuracy,
        source: 'watch'
      };
      saveLiveLocation(loc);
      if (onStatusUpdate) {
        onStatusUpdate(`🎯 Live Tracking Active (${loc.lat.toFixed(4)}, ${loc.lng.toFixed(4)})`);
      }
      onLocationUpdate(loc);
    },
    (err) => {
      console.warn("watchPosition update notice:", err.message);
      if (onError) onError(err);
    },
    { enableHighAccuracy: true, timeout: 15000, maximumAge: 5000 }
  );
};

/**
 * Search any location, landmark, or address using OpenStreetMap Nominatim
 */
export const searchLocationByName = async (query) => {
  if (!query || !query.trim()) return null;
  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query.trim())}&countrycodes=in&limit=5`;
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      if (data && data.length > 0) {
        return data.map(item => ({
          name: item.display_name,
          lat: parseFloat(item.lat),
          lng: parseFloat(item.lon)
        }));
      }
    }
  } catch (err) {
    console.error("Location search failed:", err);
  }
  return null;
};
