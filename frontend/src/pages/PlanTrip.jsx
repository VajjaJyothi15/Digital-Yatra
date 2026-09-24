import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { createTrip, estimateBudget } from '../api/api';
import FareCalculator from '../components/FareCalculator';
import { Calendar, Users, DollarSign, Compass, Sparkles, Save, Edit3, Check, ArrowRight } from 'lucide-react';

export default function PlanTrip({ user }) {
  const routerLocation = useLocation();
  const navigate = useNavigate();

  // Load saved preferences if available
  const savedParams = (() => {
    try {
      return JSON.parse(localStorage.getItem('digital_yatra_saved_trip_params')) || null;
    } catch {
      return null;
    }
  })();

  const initialDestination = routerLocation.state?.destination || routerLocation.state?.city || routerLocation.state?.destinationName || savedParams?.destination || 'Jaipur';

  const [destination, setDestination] = useState(initialDestination);
  const [startDate, setStartDate] = useState(savedParams?.startDate || '2026-10-01');
  const [endDate, setEndDate] = useState(savedParams?.endDate || '2026-10-04');
  const [groupSize, setGroupSize] = useState(savedParams?.groupSize || 2);
  const [budget, setBudget] = useState(savedParams?.budget || 12000);
  const [budgetPreference, setBudgetPreference] = useState(savedParams?.budgetPreference || 'Medium');
  const [selectedInterests, setSelectedInterests] = useState(savedParams?.interests || ['History', 'Food', 'Culture']);

  const [isSaved, setIsSaved] = useState(!!savedParams);
  const [saveToast, setSaveToast] = useState(false);
  const [budgetEstimate, setBudgetEstimate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const interestOptions = ['History', 'Food', 'Nature', 'Shopping', 'Adventure', 'Culture', 'Spiritual'];

  useEffect(() => {
    const passedDest = routerLocation.state?.destination || routerLocation.state?.city || routerLocation.state?.destinationName;
    if (passedDest) {
      setDestination(passedDest);
    }
  }, [routerLocation.state]);

  useEffect(() => {
    fetchEstimate();
  }, [startDate, endDate, groupSize, budgetPreference, destination]);

  const fetchEstimate = async () => {
    try {
      const res = await estimateBudget({
        start_date: startDate,
        end_date: endDate,
        group_size: groupSize,
        budget_preference: budgetPreference,
        destination: destination
      });
      if (res.success) {
        setBudgetEstimate(res.estimate);
      }
    } catch (err) {
      console.error('Estimate error:', err);
    }
  };

  const handleSaveInfo = () => {
    const paramsToSave = {
      destination,
      startDate,
      endDate,
      groupSize,
      budget,
      budgetPreference,
      interests: selectedInterests
    };
    localStorage.setItem('digital_yatra_saved_trip_params', JSON.stringify(paramsToSave));
    setIsSaved(true);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 3000);
  };

  const toggleInterest = (interest) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter((i) => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Auto save on submit
    handleSaveInfo();

    try {
      const tripData = {
        user_id: user ? user.id : 1,
        destination,
        start_date: startDate,
        end_date: endDate,
        group_size: groupSize,
        budget: parseFloat(budget),
        interests: selectedInterests.join(', '),
        budget_preference: budgetPreference
      };

      const res = await createTrip(tripData);
      if (res.success) {
        navigate('/itinerary', { 
          state: { 
            trip: res.itinerary, 
            estimate: res.budget_estimate, 
            tripId: res.trip_id,
            formData: tripData
          } 
        });
      } else {
        setError(res.message || 'Failed to generate itinerary.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error generating trip plan.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 bg-blue-100 text-blue-800 text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" /> SMART TOURIST AI PLANNER
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Plan & Save Your Smart Yatra
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Save your trip details & preferences. The AI will immediately build a custom schedule with detailed daily activity plans and estimated cost breakdowns.
        </p>
      </div>

      {saveToast && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center gap-3 text-xs font-semibold shadow-sm animate-fade-in">
          <Check className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>Trip information saved successfully! AI will use these saved preferences for all itinerary planning.</span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded-2xl text-xs border border-red-200 font-medium">
          ⚠️ {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Planning Form (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <span>📋</span> Trip Parameters
            </h2>
            
            <div className="flex items-center gap-2">
              {isSaved ? (
                <button
                  type="button"
                  onClick={() => setIsSaved(false)}
                  className="flex items-center gap-1 bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold px-3 py-1.5 rounded-xl border border-amber-200 transition"
                >
                  <Edit3 className="w-3.5 h-3.5 text-amber-600" /> Edit Saved Info
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSaveInfo}
                  className="flex items-center gap-1 bg-slate-100 hover:bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1.5 rounded-xl border border-slate-200 transition"
                >
                  <Save className="w-3.5 h-3.5" /> Save Information
                </button>
              )}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Destination Selection */}
            <div>
              <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2">
                Select or Type Destination City in India
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  className="flex-1 px-4 py-3 rounded-xl border border-slate-300 text-sm font-extrabold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="e.g. Goa, Visakhapatnam, Tirupati, Delhi, Mumbai, Udaipur..."
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  required
                />
                <select 
                  className="px-3 py-3 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 focus:outline-none bg-slate-50 cursor-pointer" 
                  value=""
                  onChange={(e) => { if (e.target.value) setDestination(e.target.value); }}
                >
                  <option value="">⚡ Quick Select Popular City</option>
                  <option value="Goa">Goa</option>
                  <option value="Delhi">Delhi</option>
                  <option value="Mumbai">Mumbai</option>
                  <option value="Visakhapatnam">Visakhapatnam</option>
                  <option value="Tirupati">Tirupati</option>
                  <option value="Jaipur">Jaipur</option>
                  <option value="Varanasi">Varanasi</option>
                  <option value="Bengaluru">Bengaluru</option>
                  <option value="Chennai">Chennai</option>
                  <option value="Kochi">Kochi</option>
                  <option value="Agra">Agra</option>
                  <option value="Amritsar">Amritsar</option>
                  <option value="Mysuru">Mysuru</option>
                  <option value="Udaipur">Udaipur</option>
                  <option value="Rishikesh">Rishikesh</option>
                  <option value="Manali">Manali</option>
                  <option value="Darjeeling">Darjeeling</option>
                  <option value="Ooty">Ooty</option>
                  <option value="Ahmedabad">Ahmedabad</option>
                  <option value="Lucknow">Lucknow</option>
                  <option value="Pune">Pune</option>
                  <option value="Vijayawada">Vijayawada</option>
                </select>
              </div>
            </div>

            {/* Travel Dates */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2">
                  Start Date
                </label>
                <input 
                  type="date" 
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600" 
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required 
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2">
                  End Date
                </label>
                <input 
                  type="date" 
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600" 
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required 
                />
              </div>
            </div>

            {/* Group Size & Budget Tier */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2">
                  Group Size (Persons)
                </label>
                <input 
                  type="number" 
                  min="1" 
                  max="50" 
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600" 
                  value={groupSize}
                  onChange={(e) => setGroupSize(parseInt(e.target.value) || 1)}
                  required 
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2">
                  Budget Style
                </label>
                <select 
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600" 
                  value={budgetPreference} 
                  onChange={(e) => setBudgetPreference(e.target.value)}
                >
                  <option value="Low">Economic (Hostels, Public Fares)</option>
                  <option value="Medium">Standard (3-Star Stay, Auto/Cab)</option>
                  <option value="High">Luxury / Premium (Resorts, Private Taxi)</option>
                </select>
              </div>
            </div>

            {/* Target Budget Input */}
            <div>
              <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2">
                Total Target Budget (₹ INR)
              </label>
              <input 
                type="number" 
                step="500"
                className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600" 
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                required 
              />
            </div>

            {/* Travel Interests Chips */}
            <div>
              <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2">
                Select Tourist Interests
              </label>
              <div className="flex flex-wrap gap-2 pt-1">
                {interestOptions.map((opt) => {
                  const active = selectedInterests.includes(opt);
                  return (
                    <button
                      type="button"
                      key={opt}
                      onClick={() => toggleInterest(opt)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-bold border transition ${
                        active ? 'bg-blue-600 text-white border-blue-600 shadow-sm' : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {active ? '✓ ' : '+ '} {opt}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Form Actions */}
            <div className="pt-2 flex gap-3">
              <button 
                type="button"
                onClick={handleSaveInfo}
                className="w-1/3 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs sm:text-sm rounded-2xl border border-slate-200 shadow-xs transition flex items-center justify-center gap-1.5"
              >
                <Save className="w-4 h-4 text-blue-600" /> Save Info
              </button>

              <button 
                type="submit" 
                className="flex-1 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold text-xs sm:text-sm rounded-2xl shadow-lg transition flex items-center justify-center gap-2"
                disabled={loading}
              >
                {loading ? 'AI Generating Trip...' : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
                    <span>GENERATE AI ITINERARY</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Live Budget Breakdown Sidebar */}
        <div className="space-y-6">
          <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-xl border border-slate-800 space-y-4">
            <h3 className="text-base font-extrabold text-white flex items-center gap-2">
              <span>💰</span> AI Cost Breakdown
            </h3>
            
            {budgetEstimate ? (
              <div className="space-y-4">
                <div className="bg-white/10 p-4 rounded-2xl border border-white/10 space-y-1">
                  <div className="text-[11px] text-slate-300 font-medium uppercase tracking-wider">
                    Est. Total ({budgetEstimate.days} Days, {budgetEstimate.group_size} Person)
                  </div>
                  <div className="text-2xl font-black text-amber-400">
                    {budgetEstimate.formatted_range}
                  </div>
                  <div className="text-[10px] text-teal-300 font-semibold">
                    Target Budget: ₹{Number(budget).toLocaleString()}
                  </div>
                </div>

                <div className="text-xs space-y-2.5 font-medium text-slate-300">
                  <div className="flex justify-between pb-1 border-b border-slate-800">
                    <span className="text-slate-400">🏨 Stay / Hotel:</span>
                    <strong className="text-white">₹{budgetEstimate.breakdown.accommodation.toLocaleString()}</strong>
                  </div>
                  <div className="flex justify-between pb-1 border-b border-slate-800">
                    <span className="text-slate-400">🍴 Food & Dining:</span>
                    <strong className="text-white">₹{budgetEstimate.breakdown.food.toLocaleString()}</strong>
                  </div>
                  <div className="flex justify-between pb-1 border-b border-slate-800">
                    <span className="text-slate-400">🚕 Local Transport:</span>
                    <strong className="text-white">₹{budgetEstimate.breakdown.transport.toLocaleString()}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">🎟️ Tickets & Fares:</span>
                    <strong className="text-white">₹{budgetEstimate.breakdown.activities.toLocaleString()}</strong>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-xs text-slate-400 italic">
                Calculating cost breakdown...
              </div>
            )}
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-3xl p-5 space-y-2 text-xs text-blue-900">
            <h4 className="font-extrabold flex items-center gap-1.5">
              <span>💡</span> Smart Saving Tip
            </h4>
            <p className="leading-relaxed">
              Clicking <strong>Save Information</strong> preserves your trip setup in your browser. Whenever you revisit Digital Yatra, your saved preferences will automatically populate!
            </p>
          </div>

          {/* Transport Fare Transparency Calculator */}
          <FareCalculator />
        </div>
      </div>
    </div>
  );
}
