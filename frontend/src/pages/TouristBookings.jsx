import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getTouristBookings, cancelGuideBooking } from '../api/api';
import { UserCheck, Calendar, MapPin, Clock, CheckCircle2, AlertCircle, XCircle } from 'lucide-react';

export default function TouristBookings() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const userStr = localStorage.getItem('user');
      if (!userStr) {
        navigate('/login');
        return;
      }
      const res = await getTouristBookings();
      if (res.success) {
        setBookings(res.bookings);
      }
    } catch (err) {
      console.error('Failed to fetch tourist bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this guide booking?')) return;

    try {
      const res = await cancelGuideBooking(bookingId);
      if (res.success) {
        fetchBookings();
      } else {
        alert(res.message || 'Failed to cancel booking.');
      }
    } catch (err) {
      console.error('Error cancelling booking:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 flex items-center gap-2">
              <UserCheck className="w-7 h-7 text-amber-500" /> My Guide Bookings
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Track and manage all your local guide reservations across Indian cities.
            </p>
          </div>

          <Link
            to="/guides"
            className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl shadow transition"
          >
            + Book New Guide
          </Link>
        </div>

        {bookings.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
            <Calendar className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-800 mb-2">No Bookings Found</h3>
            <p className="text-slate-500 text-sm mb-6">You haven't booked any local guides yet.</p>
            <Link
              to="/guides"
              className="px-5 py-2.5 bg-amber-500 text-white text-sm font-semibold rounded-xl shadow hover:bg-amber-600"
            >
              Browse Local Guides
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((b) => (
              <div key={b.id} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white flex items-center justify-center font-extrabold text-xl shadow">
                    {b.guide_name ? b.guide_name.charAt(0) : 'G'}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                        {b.booking_id}
                      </span>
                      <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                        b.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' :
                        b.status === 'COMPLETED' ? 'bg-blue-100 text-blue-700' :
                        b.status === 'CANCELLED' ? 'bg-slate-100 text-slate-600' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {b.status}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900">{b.guide_name}</h3>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mb-2">
                      <MapPin className="w-3.5 h-3.5 text-red-500" /> {b.destination_name}
                    </p>

                    <div className="text-xs text-slate-600 space-x-3">
                      <span>📅 Date: <strong>{b.booking_date}</strong></span>
                      <span>⏱️ Time: <strong>{b.start_time}</strong></span>
                      <span>💰 Rate: <strong>₹{b.price}</strong></span>
                    </div>
                  </div>
                </div>

                {b.status === 'PENDING' && (
                  <button
                    onClick={() => handleCancel(b.id)}
                    className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold rounded-xl border border-red-200 transition"
                  >
                    Cancel Booking
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
