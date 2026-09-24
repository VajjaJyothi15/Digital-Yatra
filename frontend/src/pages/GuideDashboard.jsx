import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getGuideDashboard, updateBookingStatus, updateGuideProfile, updateGuideAvailability } from '../api/api';
import { 
  UserCheck, Calendar, DollarSign, CheckCircle2, Clock, XCircle, 
  Settings, Award, ShieldCheck, MapPin, AlertCircle, RefreshCw, Globe, Sparkles, Edit3, Save, Camera, Check 
} from 'lucide-react';

export default function GuideDashboard() {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('bookings'); // bookings or profile or edit
  const [actionLoading, setActionLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState('');
  const [saveError, setSaveError] = useState('');

  // Profile Edit Form State
  const [formData, setFormData] = useState({
    name: '',
    city: '',
    languages: '',
    specialization: '',
    experience_years: 1,
    price_per_day: 800,
    bio: '',
    profile_photo: '',
    availability_status: 'AVAILABLE'
  });

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const userStr = localStorage.getItem('user');
      if (!userStr) {
        navigate('/login');
        return;
      }
      const user = JSON.parse(userStr);
      const res = await getGuideDashboard(user?.id ? { user_id: user.id } : {});
      if (res.success) {
        setDashboardData(res);
        if (res.guide) {
          setFormData({
            name: res.guide.name || '',
            city: res.guide.city || 'Goa',
            languages: res.guide.languages || 'English, Hindi',
            specialization: res.guide.specialization || 'Heritage & Culture',
            experience_years: res.guide.experience_years || 3,
            price_per_day: res.guide.price || res.guide.price_per_day || 800,
            bio: res.guide.bio || res.guide.description || '',
            profile_photo: res.guide.profile_photo || res.guide.photo || '',
            availability_status: res.guide.availability_status || 'AVAILABLE'
          });
        }
      } else {
        console.error('Failed to load guide dashboard:', res.message);
      }
    } catch (err) {
      console.error('Dashboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (bookingId, newStatus) => {
    setActionLoading(true);
    try {
      const res = await updateBookingStatus(bookingId, newStatus);
      if (res.success) {
        fetchDashboard();
      } else {
        alert(res.message || 'Failed to update booking status.');
      }
    } catch (err) {
      console.error('Error updating status:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    setSaveSuccess('');
    setSaveError('');

    try {
      const userStr = localStorage.getItem('user');
      const user = userStr ? JSON.parse(userStr) : {};
      
      const payload = {
        guide_id: dashboardData?.guide?.id,
        user_id: user.id || dashboardData?.guide?.user_id,
        ...formData
      };

      const res = await updateGuideProfile(payload);
      if (res.success) {
        setSaveSuccess('✓ Profile updated and saved to database successfully!');
        
        // Update user in localStorage if name changed
        if (user.id && formData.name) {
          const updatedUser = { ...user, name: formData.name };
          localStorage.setItem('user', JSON.stringify(updatedUser));
        }

        setTimeout(() => setSaveSuccess(''), 4000);
        fetchDashboard();
      } else {
        setSaveError(res.message || 'Failed to update profile.');
      }
    } catch (err) {
      setSaveError(err.response?.data?.message || 'Server error updating profile.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleAvailability = async (newStatus) => {
    try {
      const userStr = localStorage.getItem('user');
      const user = userStr ? JSON.parse(userStr) : {};
      const res = await updateGuideAvailability({ user_id: user.id || dashboardData?.guide?.user_id, status: newStatus });
      if (res.success) {
        setFormData(prev => ({ ...prev, availability_status: newStatus }));
        fetchDashboard();
      }
    } catch (err) {
      console.error('Availability update error:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 font-semibold">Loading Guide Dashboard...</p>
        </div>
      </div>
    );
  }

  const guide = dashboardData?.guide;
  const bookings = dashboardData?.bookings || [];
  const stats = dashboardData?.stats || { total_bookings: 0, pending: 0, total_earnings: 0 };

  const spokenLanguagesList = guide?.languages ? guide.languages.split(',').map(s => s.trim()).filter(Boolean) : ['English', 'Hindi'];
  const specializationsList = guide?.specialization ? guide.specialization.split(',').map(s => s.trim()).filter(Boolean) : ['Heritage & Culture'];

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 rounded-3xl p-8 text-white shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 flex items-center justify-center font-extrabold text-2xl shadow-lg border-2 border-amber-300 shrink-0">
              {guide?.name ? guide.name.charAt(0) : 'G'}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h1 className="text-2xl font-extrabold">{guide?.name || 'Local Guide Portal'}</h1>
                <span className={`text-[11px] font-extrabold px-3 py-1 rounded-full ${
                  guide?.verified ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                }`}>
                  {guide?.verified ? '✓ VERIFIED GUIDE' : 'PENDING VERIFICATION'}
                </span>
                <span className={`text-[11px] font-extrabold px-3 py-1 rounded-full cursor-pointer ${
                  guide?.availability_status === 'AVAILABLE' ? 'bg-green-500 text-white' : 'bg-slate-700 text-slate-300'
                }`} onClick={() => handleToggleAvailability(guide?.availability_status === 'AVAILABLE' ? 'UNAVAILABLE' : 'AVAILABLE')}>
                  ● {guide?.availability_status || 'AVAILABLE'}
                </span>
              </div>
              <p className="text-slate-300 text-xs sm:text-sm flex items-center gap-2 font-medium">
                <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" /> Served City: <strong className="text-white">{guide?.city || 'Goa'}</strong> • Daily Rate: <strong className="text-amber-400">₹{guide?.price}/day</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchDashboard}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold backdrop-blur-md flex items-center gap-2 transition"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Refresh
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Total Bookings</span>
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-3xl font-extrabold text-slate-900">{stats.total_bookings}</div>
            <p className="text-xs text-slate-400 mt-1">Tourist requests received</p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Pending Requests</span>
              <Clock className="w-5 h-5 text-amber-500" />
            </div>
            <div className="text-3xl font-extrabold text-amber-600">{stats.pending}</div>
            <p className="text-xs text-slate-400 mt-1">Awaiting your response</p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Completed Tours</span>
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-3xl font-extrabold text-green-600">{bookings.filter(b => b.status === 'COMPLETED').length}</div>
            <p className="text-xs text-slate-400 mt-1">Successfully guided</p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Total Earnings</span>
              <DollarSign className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="text-3xl font-extrabold text-slate-900">₹{stats.total_earnings}</div>
            <p className="text-xs text-slate-400 mt-1">Confirmed booking revenue</p>
          </div>
        </div>

        {/* Bookings Section Header */}
        <div className="border-b border-slate-200 pb-4">
          <h2 className="text-lg font-black text-slate-900">
            Tourist Bookings & Requests ({bookings.length})
          </h2>
        </div>

        {/* Bookings List */}
        <div className="space-y-4">
          {bookings.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
              <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-600 font-medium">No tourist bookings found yet.</p>
              <p className="text-slate-400 text-xs mt-1">When tourists book your guide services, requests will appear here.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {bookings.map((booking) => (
                <div key={booking.id} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:border-amber-400 transition">
                  <div className="space-y-3 flex-1">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs font-black bg-slate-900 text-amber-300 px-3 py-1 rounded-xl">
                        🎫 {booking.booking_id}
                      </span>
                      <span className={`text-xs font-black px-3 py-1 rounded-full ${
                        booking.status === 'CONFIRMED' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
                        booking.status === 'COMPLETED' ? 'bg-blue-100 text-blue-800 border border-blue-300' :
                        booking.status === 'REJECTED' ? 'bg-rose-100 text-rose-800 border border-rose-300' : 'bg-amber-100 text-amber-800 border border-amber-300'
                      }`}>
                        ● {booking.status}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-lg font-black text-slate-900">
                        {booking.destination_name} Tour Guide Booking
                      </h3>
                      <p className="text-xs text-slate-500 font-medium">
                        Booked on: {booking.created_at || 'Recently'}
                      </p>
                    </div>

                    {/* Who Booked (Tourist Info Card) */}
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 space-y-2">
                      <div className="flex items-center gap-2 text-xs font-black text-slate-900">
                        <UserCheck className="w-4 h-4 text-amber-500" />
                        <span>Tourist Name: <strong>{booking.tourist_name || 'Registered Tourist'}</strong></span>
                      </div>
                      {booking.tourist_email && (
                        <div className="text-xs text-slate-600 font-medium pl-6">
                          📧 Email: <strong>{booking.tourist_email}</strong>
                        </div>
                      )}
                    </div>

                    {/* When Booked & Tour Details */}
                    <div className="text-xs text-slate-700 grid grid-cols-2 sm:grid-cols-4 gap-3 bg-amber-50/60 p-3 rounded-2xl border border-amber-200/80">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 block uppercase">Scheduled Date</span>
                        <strong className="text-slate-900 font-extrabold">{booking.booking_date}</strong>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 block uppercase">Start Time</span>
                        <strong className="text-slate-900 font-extrabold">{booking.start_time}</strong>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 block uppercase">Duration</span>
                        <strong className="text-slate-900 font-extrabold">{booking.duration} Hours</strong>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 block uppercase">Tourists</span>
                        <strong className="text-slate-900 font-extrabold">{booking.number_of_tourists} People</strong>
                      </div>
                    </div>
                  </div>

                  {/* Right Side: Total Price & Action Buttons */}
                  <div className="flex flex-col items-end gap-3 self-stretch md:self-center justify-between border-t md:border-t-0 pt-4 md:pt-0 border-slate-100">
                    <div className="text-right">
                      <span className="text-xs font-bold text-slate-400 block uppercase">Total Fare</span>
                      <span className="text-2xl font-black text-amber-600">₹{booking.price}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {booking.status === 'PENDING' && (
                        <>
                          <button
                            disabled={actionLoading}
                            onClick={() => handleStatusUpdate(booking.id, 'CONFIRMED')}
                            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black rounded-xl shadow transition"
                          >
                            Accept Booking
                          </button>
                          <button
                            disabled={actionLoading}
                            onClick={() => handleStatusUpdate(booking.id, 'REJECTED')}
                            className="px-4 py-2.5 bg-rose-100 hover:bg-rose-200 text-rose-700 text-xs font-bold rounded-xl transition"
                          >
                            Reject
                          </button>
                        </>
                      )}

                      {booking.status === 'CONFIRMED' && (
                        <button
                          disabled={actionLoading}
                          onClick={() => handleStatusUpdate(booking.id, 'COMPLETED')}
                          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-black rounded-xl shadow transition"
                        >
                          Mark Completed
                        </button>
                      )}

                      {booking.status === 'COMPLETED' && (
                        <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                          ✓ Tour Completed
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
