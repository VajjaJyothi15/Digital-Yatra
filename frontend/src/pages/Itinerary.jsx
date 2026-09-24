import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ItineraryCard from '../components/ItineraryCard';
import { generateItinerary } from '../api/api';
import { RefreshCw, Calendar, MapPin, DollarSign, ArrowLeft, Sparkles, CheckCircle2, ListFilter, Sliders, Edit3, Save, AlertCircle } from 'lucide-react';

export default function Itinerary() {
  const location = useLocation();
  const navigate = useNavigate();

  const stateData = location.state || {};
  const [itinerary, setItinerary] = useState(stateData.trip || null);
  const [estimate, setEstimate] = useState(stateData.estimate || null);
  
  // View mode switcher: 'detailed' vs 'summary'
  const [viewMode, setViewMode] = useState('detailed');
  
  // Edit & Regenerate panel state
  const [showEditPanel, setShowEditPanel] = useState(false);
  const [editBudget, setEditBudget] = useState(stateData.formData?.budget || 12000);
  const [editInterests, setEditInterests] = useState(stateData.formData?.interests || 'History, Food, Culture');
  const [editGroupSize, setEditGroupSize] = useState(stateData.formData?.group_size || 2);

  const [regenerating, setRegenerating] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const handleRegenerate = async (customParams = {}) => {
    setRegenerating(true);
    setToastMessage('');
    try {
      const destName = itinerary?.destination || stateData.formData?.destination || 'Jaipur';
      const targetBudget = customParams.budget || editBudget;
      const targetInterests = customParams.interests || editInterests;
      const targetGroup = customParams.group_size || editGroupSize;

      const payload = {
        destination: destName,
        start_date: stateData.formData?.start_date || '2026-10-01',
        end_date: stateData.formData?.end_date || '2026-10-04',
        group_size: targetGroup,
        budget: targetBudget,
        interests: targetInterests,
        ...(customParams.missed_from_day ? { missed_from_day: customParams.missed_from_day } : {})
      };

      const res = await generateItinerary(payload);
      if (res && res.success && res.itinerary) {
        setItinerary(res.itinerary);
        setShowEditPanel(false);

        if (customParams.missed_from_day) {
          setToastMessage(`⚡ Schedule Recalculated! Day ${customParams.missed_from_day} transformed to evening recovery plan and remaining days adjusted.`);
        } else {
          setToastMessage('Itinerary successfully regenerated with fresh distinct routes for each day!');
        }

        setTimeout(() => setToastMessage(''), 5000);
      }
    } catch (err) {
      console.error('Error regenerating plan:', err);
    } finally {
      setRegenerating(false);
    }
  };

  const handleMissedDay = (dayNumber) => {
    handleRegenerate({ missed_from_day: dayNumber });
  };

  if (!itinerary) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200 shadow-xl text-center space-y-4">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto text-2xl font-bold">
            🗺️
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900">No Active Itinerary Found</h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            Please use our AI Trip Planner to create a customized day-by-day travel schedule for any destination in India.
          </p>
          <button 
            className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm rounded-xl shadow-md transition"
            onClick={() => navigate('/plan')}
          >
            Go to Trip Planner 🚀
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Navigation & Action Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button 
          onClick={() => navigate('/plan')} 
          className="flex items-center gap-2 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs px-4 py-2.5 rounded-xl border border-slate-200 shadow-xs transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Planner
        </button>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => setShowEditPanel(!showEditPanel)} 
            className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs px-4 py-2.5 rounded-xl border border-slate-200 transition"
          >
            <Sliders className="w-4 h-4 text-blue-600" /> 
            {showEditPanel ? 'Close Edit Settings' : '✏️ Edit Trip Details'}
          </button>

          <button 
            onClick={() => handleRegenerate()} 
            disabled={regenerating}
            className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-extrabold text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-lg transition disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${regenerating ? 'animate-spin' : ''}`} />
            {regenerating ? 'REGENERATING PLAN...' : 'REGENERATE PLAN'}
          </button>
        </div>
      </div>

      {/* Quick Edit Settings Panel */}
      {showEditPanel && (
        <div className="p-6 bg-slate-900 text-white rounded-3xl border border-slate-800 shadow-xl space-y-4 animate-fade-in">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
              <span>✏️</span> Edit Trip Parameters & Regenerate AI Plan
            </h3>
            <span className="text-[11px] text-amber-400 font-semibold">{itinerary.destination}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                Target Budget (₹)
              </label>
              <input 
                type="number" 
                value={editBudget}
                onChange={(e) => setEditBudget(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-white text-xs px-3.5 py-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-400"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                Group Size (Persons)
              </label>
              <input 
                type="number" 
                value={editGroupSize}
                onChange={(e) => setEditGroupSize(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-white text-xs px-3.5 py-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-400"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                Interests / Preferences
              </label>
              <input 
                type="text" 
                value={editInterests}
                onChange={(e) => setEditInterests(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-white text-xs px-3.5 py-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-400"
              />
            </div>
          </div>

          <div className="flex justify-end pt-1">
            <button
              onClick={() => handleRegenerate()}
              disabled={regenerating}
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs px-5 py-2.5 rounded-xl shadow transition flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" /> Save Changes & Regenerate AI Plan
            </button>
          </div>
        </div>
      )}

      {/* Toast Banner on Regeneration / Missed Schedule Recalculation */}
      {toastMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center gap-3 text-xs font-semibold animate-fade-in shadow-sm">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Banner Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden border border-slate-800">
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-extrabold px-3 py-1 rounded-full">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" /> AI OPTIMIZED TRAVEL SCHEDULE
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              {itinerary.destination} Tour Plan
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-teal-300">
              <span className="flex items-center gap-1">🗓️ {itinerary.num_days || 3} Days Trip</span>
              <span className="flex items-center gap-1">📍 Distinct Daily Routes</span>
              <span className="flex items-center gap-1">⚡ Recalculation Active</span>
            </div>
          </div>

          {estimate && (
            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 sm:p-5 rounded-2xl shrink-0 min-w-[200px]">
              <div className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider">Estimated Total Cost</div>
              <div className="text-2xl font-black text-amber-400 mt-1">
                {estimate.formatted_range}
              </div>
              <div className="text-[10px] text-slate-300 mt-1 font-medium">
                🟡 INCLUDES STAY, FOOD & FARES
              </div>
            </div>
          )}
        </div>
      </div>

      {/* View Mode Switcher Header: DETAILED vs SHORT SUMMARY */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <span>📅</span> Day-by-Day Schedule
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">Every day is uniquely planned. Click "Missed Day" if schedule was delayed!</p>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="flex items-center bg-slate-200/70 p-1 rounded-2xl text-xs font-extrabold">
          <button
            onClick={() => setViewMode('detailed')}
            className={`px-4 py-2 rounded-xl transition flex items-center gap-1.5 ${
              viewMode === 'detailed' 
                ? 'bg-white text-blue-600 shadow-md' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>📋 Detailed View</span>
          </button>

          <button
            onClick={() => setViewMode('summary')}
            className={`px-4 py-2 rounded-xl transition flex items-center gap-1.5 ${
              viewMode === 'summary' 
                ? 'bg-white text-blue-600 shadow-md' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>⚡ Short Summary</span>
          </button>
        </div>
      </div>

      {/* Day-Wise Schedule List */}
      <div className="space-y-6">
        {itinerary.day_wise_itinerary && itinerary.day_wise_itinerary.map((day) => (
          <ItineraryCard 
            key={day.day_number}
            dayNumber={day.day_number}
            date={day.date}
            daySummary={day.day_summary}
            isMissed={day.is_missed}
            isRecalculated={day.is_recalculated}
            schedule={day.schedule}
            dayEstimatedCost={day.day_estimated_cost}
            viewMode={viewMode}
            onMissedDay={handleMissedDay}
          />
        ))}
      </div>

      {/* Dynamic Assistance Footer Banner */}
      <div className="p-5 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl flex items-start gap-4">
        <div className="bg-blue-600 text-white p-2.5 rounded-xl shrink-0 mt-0.5">
          <Sparkles className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <h4 className="text-xs sm:text-sm font-extrabold text-blue-950">Dynamic Schedule Recalculator Active</h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            If you get stuck in traffic, miss a morning tour, or change your plans, click <strong className="text-amber-800">Missed Day X? Recalculate ⚡</strong> on that day card to instantly shift your itinerary from that day forward!
          </p>
        </div>
      </div>
    </div>
  );
}
