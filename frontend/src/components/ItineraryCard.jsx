import React from 'react';
import { useNavigate } from 'react-router-dom';
import TrustBadge from './TrustBadge';
import { Clock, MapPin, Sparkles, AlertCircle, RefreshCw, ExternalLink } from 'lucide-react';

const ItineraryCard = ({ 
  dayNumber, 
  date, 
  daySummary, 
  isMissed, 
  isRecalculated, 
  schedule, 
  dayEstimatedCost, 
  viewMode = 'detailed',
  onMissedDay,
  destination = ''
}) => {
  const navigate = useNavigate();

  const handleShowInternalMap = (item) => {
    navigate('/guide', {
      state: {
        city: destination || item.place_name,
        destLat: item.latitude,
        destLng: item.longitude,
        destinationName: item.place_name
      }
    });
  };

  return (
    <div className={`bg-white rounded-3xl p-6 border shadow-md space-y-4 transition ${
      isMissed ? 'border-amber-400 bg-amber-50/20' : isRecalculated ? 'border-indigo-300' : 'border-slate-200'
    }`}>
      {/* Card Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <span className={`font-extrabold px-3.5 py-1 rounded-xl text-xs tracking-wide text-white ${
            isMissed ? 'bg-amber-600' : 'bg-blue-600'
          }`}>
            DAY {dayNumber}
          </span>
          {date && <span className="text-slate-500 font-medium text-xs sm:text-sm">{date}</span>}

          {isRecalculated && (
            <span className="bg-indigo-100 text-indigo-800 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <RefreshCw className="w-3 h-3 text-indigo-600" /> Recalculated
            </span>
          )}
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <span className="text-xs text-slate-400 font-medium">Est. Day Cost: </span>
            <span className="text-sm sm:text-base font-extrabold text-blue-600">
              ₹{dayEstimatedCost}
            </span>
          </div>

          {onMissedDay && (
            <button
              onClick={() => onMissedDay(dayNumber)}
              title="Click if you missed morning/daytime schedule to recalculate remaining plan"
              className="flex items-center gap-1 text-[11px] font-extrabold text-amber-700 hover:text-amber-900 bg-amber-100 hover:bg-amber-200 px-3 py-1.5 rounded-xl border border-amber-300 transition"
            >
              <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
              <span>Missed Day {dayNumber}? Recalculate ⚡</span>
            </button>
          )}
        </div>
      </div>

      {/* Day Narrative Summary ("How you spend the day") */}
      {daySummary && (
        <div className={`p-3.5 border rounded-2xl flex items-start gap-3 ${
          isMissed ? 'bg-amber-100/70 border-amber-300 text-amber-950' : 'bg-blue-50/80 border-blue-100 text-slate-900'
        }`}>
          <Sparkles className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <div>
            <div className="text-[11px] font-extrabold uppercase tracking-wider text-blue-900">
              How You Spend Day {dayNumber}:
            </div>
            <p className="text-xs font-medium leading-relaxed mt-0.5 text-slate-700">{daySummary}</p>
          </div>
        </div>
      )}

      {/* View Mode: SUMMARY MODE */}
      {viewMode === 'summary' ? (
        <div className="space-y-2 pt-1">
          <div className="text-xs font-semibold text-slate-500">Key Stops for Day {dayNumber}:</div>
          <div className="flex flex-wrap gap-2">
            {schedule && schedule.map((item, idx) => (
              <div key={idx} className="bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                <span>📍</span>
                <span>{item.place_name}</span>
                <span className="text-[10px] text-blue-600 font-bold">({item.start_time})</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* View Mode: DETAILED MODE */
        <div className="space-y-3 pt-1">
          {schedule && schedule.map((item, idx) => (
            <div 
              key={idx} 
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200/80 hover:border-blue-300 transition"
            >
              <div className="flex items-center gap-3">
                <div className="bg-white border border-slate-200 text-blue-600 font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1 shrink-0 shadow-xs">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{item.start_time}</span>
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-slate-900">{item.place_name}</h4>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="bg-slate-200 text-slate-700 text-[10px] font-semibold px-2 py-0.5 rounded-md">
                      {item.category}
                    </span>
                    <TrustBadge status={item.trust_status || 'VERIFIED'} />
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3 text-xs font-semibold text-slate-600">
                <div className="flex items-center gap-3">
                  <span>💰 Entry: <strong className="text-slate-900">{item.estimated_cost > 0 ? `₹${item.estimated_cost}` : 'Free'}</strong></span>
                  {item.rating && <span>⭐ <strong className="text-slate-900">{item.rating}</strong></span>}
                </div>

                {/* Map Choices: Digital Yatra Map vs Google Maps */}
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleShowInternalMap(item)}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-extrabold px-2.5 py-1.5 rounded-xl shadow-xs transition flex items-center gap-1"
                  >
                    <MapPin className="w-3 h-3" /> Show on Map
                  </button>

                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.place_name + ' ' + destination)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-slate-200 hover:bg-slate-300 text-slate-800 text-[11px] font-extrabold px-2.5 py-1.5 rounded-xl transition flex items-center gap-1"
                  >
                    <ExternalLink className="w-3 h-3" /> Google Maps
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ItineraryCard;
