import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { submitReview, getAllReviews, getDestinations, getLocalGuides } from '../api/api';
import { Star, MessageSquare, MapPin, UserCheck, Send, CheckCircle2, AlertCircle, Sparkles, Filter, ShieldCheck, Heart } from 'lucide-react';

export default function Reviews() {
  const navigate = useNavigate();
  const location = useLocation();

  const [destinations, setDestinations] = useState([]);
  const [guides, setGuides] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Review Form State
  const [selectedDestination, setSelectedDestination] = useState(location.state?.destinationName || 'Goa');
  const [customDestination, setCustomDestination] = useState('');
  const [destinationRating, setDestinationRating] = useState(5);
  const [hoverDestRating, setHoverDestRating] = useState(0);

  const [selectedGuideId, setSelectedGuideId] = useState(location.state?.guideId || '');
  const [guideRating, setGuideRating] = useState(5);
  const [hoverGuideRating, setHoverGuideRating] = useState(0);

  const [comments, setComments] = useState('');

  // Comprehensive List of Major Indian Tourist Destinations & Cities
  const POPULAR_DESTINATIONS = [
    "Goa", "Jaipur", "Varanasi", "Agra", "Tirupati", "Visakhapatnam",
    "Kerala Backwaters", "Udaipur", "Delhi", "Mumbai", "Bengaluru",
    "Chennai", "Kolkata", "Hyderabad", "Shimla", "Manali", "Rishikesh",
    "Ooty", "Darjeeling", "Amritsar", "Mysore", "Munnar", "Kochi",
    "Pune", "Ahmedabad", "Jodhpur", "Ladakh / Leh", "Kanyakumari",
    "Pondicherry", "Srinagar", "Shillong", "Coorg", "Hampi", "Ayodhya",
    "Puri", "Mathura / Vrindavan", "Jaisalmer", "Nainital", "Rameswaram",
    "Vijayawada", "Guwahati", "Madurai", "Kodaikanal", "Chikmagalur"
  ];

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const [dRes, gRes, rRes] = await Promise.all([
        getDestinations(),
        getLocalGuides('All'),
        getAllReviews()
      ]);

      if (Array.isArray(dRes)) setDestinations(dRes);
      if (gRes && gRes.success) setGuides(gRes.guides);
      if (rRes && rRes.success) setReviews(rRes.reviews);
    } catch (err) {
      console.error('Error fetching review data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    const userStr = localStorage.getItem('user');
    if (!userStr) {
      setErrorMessage('Please login to post your review.');
      setTimeout(() => navigate('/login', { state: { from: '/reviews' } }), 1200);
      return;
    }
    const user = JSON.parse(userStr);

    const finalDestinationName = selectedDestination === 'OTHER'
      ? customDestination.trim()
      : selectedDestination;

    if (!finalDestinationName) {
      setErrorMessage('Please specify or select a destination/city name.');
      return;
    }

    if (!comments.trim()) {
      setErrorMessage('Please enter comments describing your trip or guide experience.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        tourist_id: user.id,
        destination_name: finalDestinationName,
        destination_rating: destinationRating,
        guide_id: selectedGuideId ? Number(selectedGuideId) : null,
        guide_rating: guideRating,
        comments: comments.trim()
      };

      const res = await submitReview(payload);
      if (res.success) {
        setSuccessMessage('🎉 Review submitted successfully! Ratings updated across Guide & Admin dashboards.');
        setComments('');
        setCustomDestination('');
        setTimeout(() => setSuccessMessage(''), 5000);
        
        // Refresh reviews list
        const rRes = await getAllReviews();
        if (rRes && rRes.success) setReviews(rRes.reviews);
      } else {
        setErrorMessage(res.message || 'Failed to submit review.');
      }
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Server error while posting review.');
    } finally {
      setSubmitting(false);
    }
  };

  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  // Build unique merged destination list
  const mergedDestinations = Array.from(
    new Set([
      ...POPULAR_DESTINATIONS,
      ...destinations.map((d) => d.name)
    ])
  ).sort();

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden border border-slate-800">
          <div className="max-w-3xl relative z-10 space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/20 backdrop-blur-md text-xs font-bold text-amber-300 border border-amber-500/30">
              <Sparkles className="w-4 h-4 text-amber-400" /> Tourist Feedback & Reviews
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
              Rate Destinations & Local Tour Guides
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Share your authentic travel stories, rate tourist destinations, and evaluate local guides. All reviews automatically update Guide Ratings and provide real-time metrics in the Admin Safety & Governance dashboard.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Review Submission Form (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-amber-500" /> Write a Review
              </h2>
              {user ? (
                <p className="text-xs text-slate-500 mt-1">
                  Logged in as: <strong className="text-slate-900">{user.name}</strong> ({user.email})
                </p>
              ) : (
                <div className="mt-3 p-3 bg-amber-50 rounded-2xl border border-amber-200/80 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span className="text-xs font-extrabold text-amber-900">
                      Please login to post your review.
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => navigate('/login', { state: { from: '/reviews' } })}
                    className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow transition shrink-0"
                  >
                    Login Now
                  </button>
                </div>
              )}
            </div>

            {successMessage && (
              <div className="p-4 bg-emerald-50 text-emerald-800 rounded-2xl text-xs font-extrabold border border-emerald-200 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" /> {successMessage}
              </div>
            )}

            {errorMessage && (
              <div className="p-4 bg-rose-50 text-rose-800 rounded-2xl text-xs font-bold border border-rose-200 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" /> {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmitReview} className="space-y-5">
              
              {/* Destination Selector */}
              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1">
                  Select Destination / City
                </label>
                <div className="relative">
                  <select
                    value={selectedDestination}
                    onChange={(e) => setSelectedDestination(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 text-xs sm:text-sm font-semibold focus:ring-2 focus:ring-amber-500 bg-white"
                    required
                  >
                    {mergedDestinations.map((name) => (
                      <option key={name} value={name}>{name}</option>
                    ))}
                    <option value="OTHER">➕ Add Custom Destination / City...</option>
                  </select>
                  <MapPin className="w-4 h-4 text-slate-400 absolute right-4 top-3.5 pointer-events-none" />
                </div>

                {/* Custom Destination / City Text Input */}
                {selectedDestination === 'OTHER' && (
                  <div className="mt-2.5 space-y-1">
                    <label className="block text-[11px] font-extrabold text-amber-800">
                      Type Custom Destination / City Name:
                    </label>
                    <input
                      type="text"
                      required
                      value={customDestination}
                      onChange={(e) => setCustomDestination(e.target.value)}
                      placeholder="e.g. Kedarnath, Alleppey, Chikmagalur, Kodaikanal..."
                      className="w-full px-4 py-2.5 rounded-xl border border-amber-300 text-xs font-semibold focus:ring-2 focus:ring-amber-500 bg-amber-50/50 text-slate-900"
                    />
                  </div>
                )}
              </div>


              {/* Destination Star Rating */}
              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1.5">Destination Rating</label>
                <div className="flex items-center gap-1.5 bg-amber-50/70 p-3 rounded-2xl border border-amber-200/80">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onMouseEnter={() => setHoverDestRating(star)}
                      onMouseLeave={() => setHoverDestRating(0)}
                      onClick={() => setDestinationRating(star)}
                      className="p-1 transition transform hover:scale-125 focus:outline-none"
                    >
                      <Star
                        className={`w-7 h-7 ${
                          (hoverDestRating || destinationRating) >= star
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-slate-300'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="ml-2 text-xs font-black text-amber-700">{destinationRating} / 5</span>
                </div>
              </div>

              {/* Guide Selector (Optional / Recommended) */}
              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1">Select Tour Guide (Optional)</label>
                <select
                  value={selectedGuideId}
                  onChange={(e) => setSelectedGuideId(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-xs sm:text-sm font-semibold focus:ring-2 focus:ring-amber-500 bg-white"
                >
                  <option value="">-- Select Guide (Or Leave Blank for Destination Only) --</option>
                  {guides.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.name} ({g.city} • ₹{g.price}/day)
                    </option>
                  ))}
                </select>
              </div>

              {/* Guide Star Rating */}
              {selectedGuideId && (
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 mb-1.5">Guide Service Rating</label>
                  <div className="flex items-center gap-1.5 bg-indigo-50/70 p-3 rounded-2xl border border-indigo-200/80">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onMouseEnter={() => setHoverGuideRating(star)}
                        onMouseLeave={() => setHoverGuideRating(0)}
                        onClick={() => setGuideRating(star)}
                        className="p-1 transition transform hover:scale-125 focus:outline-none"
                      >
                        <Star
                          className={`w-7 h-7 ${
                            (hoverGuideRating || guideRating) >= star
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-slate-300'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="ml-2 text-xs font-black text-indigo-700">{guideRating} / 5</span>
                  </div>
                </div>
              )}

              {/* Comments / Feedback Textarea */}
              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1">
                  Trip Comments & Review Message Box
                </label>
                <textarea
                  rows="4"
                  required
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  placeholder="Share details about your journey, destination highlights, local guide behavior, food quality, safety, and travel tips for future tourists..."
                  className="w-full p-4 rounded-xl border border-slate-300 text-xs sm:text-sm font-medium focus:ring-2 focus:ring-amber-500"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs sm:text-sm rounded-xl shadow-lg transition flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" /> {submitting ? 'Submitting Review...' : 'SUBMIT REVIEW & FEEDBACK'}
              </button>
            </form>
          </div>

          {/* Right Column: Community Tourist Reviews Feed (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                  <Heart className="w-5 h-5 text-rose-500" /> Community Tourist Reviews
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">Real verified ratings and trip feedback posted by tourists across India.</p>
              </div>
              <span className="text-xs font-extrabold bg-slate-900 text-amber-300 px-3 py-1 rounded-xl">
                {reviews.length} Reviews
              </span>
            </div>

            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white rounded-3xl p-6 h-36 animate-pulse border border-slate-200"></div>
                ))}
              </div>
            ) : reviews.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm">
                <MessageSquare className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h4 className="text-base font-extrabold text-slate-800">No Reviews Posted Yet</h4>
                <p className="text-xs text-slate-500 mt-1">Be the first tourist to review a destination or local guide!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {reviews.map((rev) => (
                  <div key={rev.id} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition space-y-3">
                    <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-600 text-slate-950 font-extrabold text-lg flex items-center justify-center shrink-0 shadow-sm">
                          {rev.tourist_name ? rev.tourist_name.charAt(0) : 'T'}
                        </div>
                        <div>
                          <h4 className="text-sm font-extrabold text-slate-900">{rev.tourist_name}</h4>
                          <span className="text-[11px] text-slate-400 font-medium">Verified Tourist</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        {rev.destination_name && (
                          <span className="text-[11px] font-extrabold bg-amber-50 text-amber-800 px-2.5 py-1 rounded-xl border border-amber-200 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-amber-500" /> {rev.destination_name} (⭐ {rev.destination_rating || 5.0})
                          </span>
                        )}
                        {rev.guide_name && (
                          <span className="text-[11px] font-extrabold bg-indigo-50 text-indigo-800 px-2.5 py-1 rounded-xl border border-indigo-200 flex items-center gap-1">
                            <UserCheck className="w-3 h-3 text-indigo-500" /> Guide: {rev.guide_name} (⭐ {rev.guide_rating || 5.0})
                          </span>
                        )}
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      "{rev.comments}"
                    </p>

                    <div className="text-[10px] text-slate-400 font-semibold text-right">
                      Reviewed on: {rev.created_at || 'Recently'}
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}
