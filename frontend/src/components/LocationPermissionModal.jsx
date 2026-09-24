import React, { useState, useEffect } from 'react';
import { getLiveLocation, saveLiveLocation } from '../utils/geolocation';
import { Navigation, MapPin, CheckCircle, Shield, X, RefreshCw } from 'lucide-react';

export default function LocationPermissionModal({ user, userLocation, onLocationUpdate }) {
  const [showModal, setShowModal] = useState(false);
  const [requesting, setRequesting] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    // Check if tourist has already responded to location prompt in current browser session
    const sessionResponded = sessionStorage.getItem('dy_gps_prompt_responded');
    if (!sessionResponded) {
      setShowModal(true);
    }
  }, [user]);

  const handleAllowGps = () => {
    setRequesting(true);
    setErrorMsg('');
    setStatusMsg('⚡ Connecting to device GPS hardware...');

    getLiveLocation(
      (loc) => {
        setRequesting(false);
        setStatusMsg(`🎯 Live GPS Connected (${loc.lat.toFixed(4)}, ${loc.lng.toFixed(4)})`);
        if (onLocationUpdate) onLocationUpdate(loc);
        saveLiveLocation(loc);
        sessionStorage.setItem('dy_gps_prompt_responded', 'true');
        setTimeout(() => setShowModal(false), 800);
      },
      (err) => {
        setRequesting(false);
        console.warn('GPS prompt notice:', err.message, 'code:', err.code);
        if (err.code === 1) {
          setErrorMsg('Location permission is turned off. You can enable it in your browser site settings, or continue using the fallback location.');
        } else if (err.code === 2) {
          setErrorMsg('Your device could not determine your location. Please check your device location services.');
        } else if (err.code === 3) {
          setErrorMsg('Could not get your location within 15 seconds. Please try again or continue with the fallback location.');
        } else {
          setErrorMsg('Location access unavailable. Continuing with fallback location.');
        }
        sessionStorage.setItem('dy_gps_prompt_responded', 'true');
      },
      (status) => setStatusMsg(status)
    );
  };

  const handleSkip = () => {
    sessionStorage.setItem('dy_gps_prompt_responded', 'true');
    setShowModal(false);
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 text-white shadow-2xl relative space-y-6">
        
        {/* Close Button */}
        <button
          onClick={handleSkip}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header Icon */}
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-blue-600/20 text-blue-400 border border-blue-500/30 rounded-2xl flex items-center justify-center shrink-0">
            <Navigation className="w-7 h-7 animate-pulse text-blue-400" />
          </div>
          <div>
            <span className="text-[11px] font-black uppercase tracking-wider text-amber-400 bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-400/20">
              Tourist Location Service
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white mt-1 leading-tight">
              Allow Live GPS Location Access?
            </h2>
          </div>
        </div>

        {/* Description */}
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
          Digital Yatra uses your live device GPS coordinates to calculate real distances and show <strong>nearby hotels, authentic dining, clean restrooms, emergency hospitals, police stations, transport, and local tour guides</strong> directly around your exact position!
        </p>

        {/* Status / Error Notifications */}
        {statusMsg && !errorMsg && (
          <div className="p-3 bg-blue-950/60 border border-blue-800/80 rounded-2xl text-xs text-blue-300 font-bold flex items-center gap-2">
            <RefreshCw className={`w-4 h-4 text-blue-400 ${requesting ? 'animate-spin' : ''}`} />
            <span>{statusMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="p-3.5 bg-amber-950/40 border border-amber-800/60 rounded-2xl text-xs text-amber-200 font-semibold leading-normal flex items-start gap-2">
            <Shield className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Current Active Location Info */}
        {userLocation && userLocation.lat && (
          <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-slate-300 font-medium">
              <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Current GPS: <strong>{userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}</strong></span>
            </div>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-black uppercase">
              {userLocation.source || 'GPS Connected'}
            </span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3 pt-2">
          <button
            onClick={handleAllowGps}
            disabled={requesting}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs sm:text-sm font-black rounded-2xl shadow-xl transition flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Navigation className="w-4 h-4 fill-white" />
            {requesting ? 'Connecting Live Device GPS...' : errorMsg ? 'TRY AGAIN 🔄' : 'ALLOW LIVE GPS LOCATION 🎯'}
          </button>

          <button
            onClick={handleSkip}
            className="w-full py-3 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-2xl transition"
          >
            Continue with Fallback Location
          </button>
        </div>

        <div className="text-[11px] text-slate-400 text-center font-medium flex items-center justify-center gap-1">
          <Shield className="w-3.5 h-3.5 text-emerald-400" /> Location data is used strictly for live distance navigation and nearby facilities.
        </div>

      </div>
    </div>
  );
}
