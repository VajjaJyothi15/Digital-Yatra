import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { getLocalGuides, getDestinations, createGuideBooking } from '../api/api';
import { 
  UserCheck, Star, MapPin, Calendar, Clock, Users, ShieldCheck, 
  Search, CheckCircle2, AlertCircle, X, Compass, Filter, DollarSign 
} from 'lucide-react';

export default function BookGuide() {
  const routerLocation = useLocation();
  const navigate = useNavigate();
  const initialCity = routerLocation.state?.city || routerLocation.state?.destinationName || routerLocation.state?.destination || 'All';
  const preSelectedGuideId = routerLocation.state?.guideId || null;

  const [guides, setGuides] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedCity, setSelectedCity] = useState(initialCity);
  const [selectedSpecialization, setSelectedSpecialization] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Booking Modal State
  const [selectedGuide, setSelectedGuide] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingForm, setBookingForm] = useState({
    bookingDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    startTime: '10:00 AM',
    duration: 6,
    numberOfTourists: 2
  });
  const [submitting, setSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    loadDestinations();
  }, []);

  useEffect(() => {
    const passedCity = routerLocation.state?.city || routerLocation.state?.destinationName || routerLocation.state?.destination;
    if (passedCity) {
      setSelectedCity(passedCity);
    }
  }, [routerLocation.state]);

  useEffect(() => {
    fetchGuides();
  }, [selectedCity]);

  const loadDestinations = async () => {
    try {
      const data = await getDestinations();
      if (Array.isArray(data)) {
        setDestinations(data);
      }
    } catch (err) {
      console.error('Failed to load destinations:', err);
    }
  };

  const fetchGuides = async () => {
    setLoading(true);
    try {
      const cityArg = selectedCity === 'All' ? '' : selectedCity;
      const res = await getLocalGuides(cityArg);
      if (res.success) {
        setGuides(res.guides);

        if (preSelectedGuideId) {
          const matched = res.guides.find(g => g.id === preSelectedGuideId);
          if (matched) {
            handleOpenBooking(matched);
          }
        }
      }
    } catch (err) {
      console.error('Failed to fetch guides:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenBooking = (guide) => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      alert('Please login as a Tourist to book a local guide.');
      navigate('/login');
      return;
    }
    setSelectedGuide(guide);
    setShowBookingModal(true);
    setBookingSuccess(null);
    setErrorMessage('');
  };

  const handleConfirmBooking = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMessage('');

    try {
      const payload = {
        guide_id: selectedGuide.id,
        destination_name: selectedGuide.city,
        booking_date: bookingForm.bookingDate,
        start_time: bookingForm.startTime,
        duration: bookingForm.duration,
        number_of_tourists: bookingForm.numberOfTourists,
        price: selectedGuide.price
      };

      const res = await createGuideBooking(payload);
      if (res.success) {
        setBookingSuccess(res.booking);
      } else {
        setErrorMessage(res.message || 'Failed to complete guide booking.');
      }
    } catch (err) {
      console.error('Booking submission error:', err);
      setErrorMessage('Server error while booking guide. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const specializations = ['All', 'Heritage & Culture', 'Religious Tourism', 'Food & Culinary', 'Nature & Wildlife', 'Photography'];

  const filteredGuides = guides.filter(g => {
    const matchesSearch = g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.languages.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.specialization.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSpec = selectedSpecialization === 'All' || g.specialization.toLowerCase().includes(selectedSpecialization.toLowerCase());

    return matchesSearch && matchesSpec;
  });

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Banner */}
        <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 rounded-3xl p-8 sm:p-12 text-white shadow-xl mb-10 relative overflow-hidden">
          <div className="max-w-2xl relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold text-amber-100 mb-4">
              <UserCheck className="w-4 h-4 text-white" /> Local Guide Directory
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4">
              Book Verified Local Guides Across India
            </h1>
            <p className="text-amber-100 text-lg mb-8">
              Explore heritage stories, hidden gems, and local traditions with certified, multilingual local experts in your destination city.
            </p>

            {/* City & Search Controls */}
            <div className="flex flex-col sm:flex-row gap-3 max-w-xl">
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="px-4 py-3.5 rounded-2xl bg-white text-slate-900 font-semibold shadow-md focus:outline-none text-sm"
              >
                <option value="All">All Indian Cities</option>
                {destinations.map(d => (
                  <option key={d.id} value={d.name}>{d.name} ({d.state})</option>
                ))}
              </select>

              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by guide name, language, or specialty..."
                  className="w-full pl-11 pr-4 py-3.5 rounded-2xl text-slate-900 placeholder-slate-400 bg-white shadow-md text-sm focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Specialization Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8">
          <span className="text-xs font-bold text-slate-500 flex items-center gap-1 uppercase tracking-wider mr-2">
            <Filter className="w-3.5 h-3.5" /> Specialization:
          </span>
          {specializations.map((spec) => (
            <button
              key={spec}
              onClick={() => setSelectedSpecialization(spec)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedSpecialization === spec
                  ? 'bg-amber-500 text-white shadow-md'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {spec}
            </button>
          ))}
        </div>

        {/* Guides List Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-6 h-72 animate-pulse border border-slate-200"></div>
            ))}
          </div>
        ) : filteredGuides.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 max-w-md mx-auto my-10">
            <UserCheck className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-800 mb-2">No Guides Found</h3>
            <p className="text-slate-500 text-sm mb-6">
              No local guides currently match your selected filters in {selectedCity}.
            </p>
            <button
              onClick={() => { setSelectedCity('All'); setSelectedSpecialization('All'); setSearchQuery(''); }}
              className="px-5 py-2.5 bg-amber-500 text-white text-sm font-semibold rounded-xl shadow hover:bg-amber-600"
            >
              Show All Guides
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGuides.map((guide) => (
              <div key={guide.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
                <div>
                  {/* Card Header with Initial Avatar */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white flex items-center justify-center font-extrabold text-2xl shadow-md">
                        {guide.name ? guide.name.charAt(0) : 'G'}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-amber-600">{guide.name}</h3>
                        <div className="flex items-center gap-1 text-xs text-amber-500 font-bold mt-0.5">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> {guide.rating || 4.8} 
                          <span className="text-slate-400 font-normal">({guide.reviews_count || 12} reviews)</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
                          <MapPin className="w-3 h-3 text-red-500" /> {guide.city}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Verification Badge */}
                  <div className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-50 text-green-700 rounded-lg text-xs font-semibold mb-4">
                    <ShieldCheck className="w-3.5 h-3.5 text-green-600" /> Verified Tourism Guide
                  </div>

                  {/* Guide Info List */}
                  <div className="text-xs text-slate-600 space-y-2 mb-6 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                    <p><strong>Languages:</strong> {guide.languages}</p>
                    <p><strong>Specialization:</strong> {guide.specialization}</p>
                    <p><strong>Experience:</strong> {guide.experience}</p>
                    {guide.description && <p className="text-slate-500 italic mt-1 line-clamp-2">"{guide.description}"</p>}
                  </div>
                </div>

                {/* Price & Book Button */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-xl font-extrabold text-slate-900">₹{guide.price}</span>
                    <span className="text-xs text-slate-400 block font-normal">per day (full tour)</span>
                  </div>

                  <button
                    onClick={() => handleOpenBooking(guide)}
                    className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-extrabold rounded-xl shadow-md transition transform active:scale-95"
                  >
                    BOOK GUIDE
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Booking Confirmation Dialog Modal */}
        {showBookingModal && selectedGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative border border-slate-100 overflow-hidden">
              <button
                onClick={() => setShowBookingModal(false)}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>

              {bookingSuccess ? (
                /* Success View */
                <div className="text-center py-6">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 mx-auto mb-4">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-extrabold text-slate-900 mb-2">Guide Booking Confirmed!</h3>
                  <p className="text-slate-600 text-sm mb-6">
                    Your request for <strong>{selectedGuide.name}</strong> in {selectedGuide.city} has been confirmed.
                  </p>

                  <div className="bg-slate-50 rounded-2xl p-4 text-left text-xs text-slate-700 space-y-2 mb-6 border border-slate-200">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Booking ID:</span>
                      <strong className="font-mono text-blue-600">{bookingSuccess.booking_id}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Guide Name:</span>
                      <strong>{bookingSuccess.guide_name}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Destination:</span>
                      <strong>{bookingSuccess.destination_name}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Date & Time:</span>
                      <strong>{bookingSuccess.booking_date} at {bookingSuccess.start_time}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Total Price:</span>
                      <strong className="text-amber-600">₹{bookingSuccess.price}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Status:</span>
                      <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded font-bold">{bookingSuccess.status}</span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Link
                      to="/my-bookings"
                      className="flex-1 py-3 bg-blue-600 text-white text-sm font-semibold rounded-xl text-center shadow hover:bg-blue-700"
                    >
                      View My Bookings
                    </Link>
                    <button
                      onClick={() => setShowBookingModal(false)}
                      className="flex-1 py-3 bg-slate-100 text-slate-700 text-sm font-semibold rounded-xl text-center hover:bg-slate-200"
                    >
                      Close
                    </button>
                  </div>
                </div>
              ) : (
                /* Booking Form View */
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold text-lg">
                      {selectedGuide.name ? selectedGuide.name.charAt(0) : 'G'}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-lg">{selectedGuide.name}</h3>
                      <p className="text-xs text-slate-500">📍 {selectedGuide.city} • ₹{selectedGuide.price}/day</p>
                    </div>
                  </div>

                  {errorMessage && (
                    <div className="p-3 bg-red-50 text-red-700 rounded-xl text-xs mb-4 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" /> {errorMessage}
                    </div>
                  )}

                  <form onSubmit={handleConfirmBooking} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Select Date
                      </label>
                      <input
                        type="date"
                        required
                        value={bookingForm.bookingDate}
                        onChange={(e) => setBookingForm({ ...bookingForm, bookingDate: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Start Time
                        </label>
                        <select
                          value={bookingForm.startTime}
                          onChange={(e) => setBookingForm({ ...bookingForm, startTime: e.target.value })}
                          className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none"
                        >
                          <option value="09:00 AM">09:00 AM</option>
                          <option value="10:00 AM">10:00 AM</option>
                          <option value="11:00 AM">11:00 AM</option>
                          <option value="02:00 PM">02:00 PM</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Duration (Hours)
                        </label>
                        <select
                          value={bookingForm.duration}
                          onChange={(e) => setBookingForm({ ...bookingForm, duration: Number(e.target.value) })}
                          className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none"
                        >
                          <option value={4}>4 Hours (Half Day)</option>
                          <option value={6}>6 Hours (Standard)</option>
                          <option value={8}>8 Hours (Full Day)</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Number of Tourists
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={bookingForm.numberOfTourists}
                        onChange={(e) => setBookingForm({ ...bookingForm, numberOfTourists: Number(e.target.value) })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none"
                      />
                    </div>

                    {/* Summary */}
                    <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200 text-xs space-y-1.5">
                      <div className="flex justify-between text-slate-700">
                        <span>Base Rate:</span>
                        <span>₹{selectedGuide.price} / day</span>
                      </div>
                      <div className="flex justify-between text-slate-700">
                        <span>Platform Fee:</span>
                        <span className="text-green-600 font-bold">FREE</span>
                      </div>
                      <div className="flex justify-between text-slate-900 font-bold text-sm pt-2 border-t border-amber-200">
                        <span>Total Payable:</span>
                        <span className="text-amber-600 font-extrabold text-base">₹{selectedGuide.price}</span>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full py-3.5 bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-sm rounded-xl shadow-lg transition disabled:opacity-50"
                    >
                      {submitting ? 'Confirming Booking...' : 'CONFIRM BOOKING'}
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
