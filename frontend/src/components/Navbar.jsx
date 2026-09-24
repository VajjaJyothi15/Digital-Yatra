import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import DigitalYatraLogo from './DigitalYatraLogo';
import { Compass, ShieldAlert, FileText, MapPin, UserCheck, CalendarCheck, User, LogOut, LogIn, LayoutDashboard, Landmark, Navigation, Menu, X, Edit3, CheckCircle, Settings, BookmarkCheck } from 'lucide-react';
import { updateUserProfile } from '../api/api';

const Navbar = ({ user, userLocation, onLogout, onUpdateUser }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Edit Profile Modal State
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [editName, setEditName] = useState(user?.name || '');
  const [editInterests, setEditInterests] = useState(user?.interests || '');
  const [editBudget, setEditBudget] = useState(user?.budget_preference || 'Medium');
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState('');
  const [saveError, setSaveError] = useState('');

  const userRole = user?.role || 'TOURIST';
  const firstLetter = user?.name ? user.name.trim()[0].toUpperCase() : 'U';

  // Sync state when user prop changes
  useEffect(() => {
    if (user) {
      setEditName(user.name || '');
      setEditInterests(user.interests || '');
      setEditBudget(user.budget_preference || 'Medium');
    }
  }, [user]);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  const handleOpenProfileModal = () => {
    setEditName(user?.name || '');
    setEditInterests(user?.interests || '');
    setEditBudget(user?.budget_preference || 'Medium');
    setSaveSuccess('');
    setSaveError('');
    setShowProfileModal(true);
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaveError('');
    setSaveSuccess('');
    setSaving(true);

    try {
      const res = await updateUserProfile({
        id: user?.id,
        email: user?.email,
        name: editName,
        interests: editInterests,
        budget_preference: editBudget
      });

      if (res.success) {
        setSaveSuccess('✓ Profile updated successfully!');
        if (onUpdateUser) {
          onUpdateUser(res.user);
        }
        setTimeout(() => {
          setShowProfileModal(false);
          setSaveSuccess('');
        }, 1500);
      } else {
        setSaveError(res.message || 'Failed to update profile.');
      }
    } catch (err) {
      setSaveError(err.response?.data?.message || 'Error updating profile.');
    } finally {
      setSaving(false);
    }
  };

  const interestOptions = ['History', 'Food', 'Nature', 'Shopping', 'Adventure', 'Culture', 'Spiritual'];
  const currentInterestList = typeof editInterests === 'string' ? editInterests.split(', ').filter(Boolean) : [];

  const toggleInterestItem = (item) => {
    let updated;
    if (currentInterestList.includes(item)) {
      updated = currentInterestList.filter((i) => i !== item);
    } else {
      updated = [...currentInterestList, item];
    }
    setEditInterests(updated.join(', '));
  };

  return (
    <>
      {/* EDIT PROFILE & ACCOUNT MODAL */}
      {showProfileModal && (
        <div className="fixed inset-0 z-[2700] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200 space-y-5 animate-scaleUp">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-sky-500 text-white font-black text-lg flex items-center justify-center shadow-md border border-white/30">
                  {firstLetter}
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-1.5">
                    User Account & Profile
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">{user?.email || 'Logged in account'}</p>
                </div>
              </div>
              <button 
                onClick={() => setShowProfileModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition"
              >
                <X size={20} />
              </button>
            </div>

            {saveSuccess && (
              <div className="p-3 bg-emerald-50 text-emerald-700 rounded-xl text-xs font-bold border border-emerald-200 flex items-center gap-2">
                <CheckCircle size={16} className="text-emerald-600" /> {saveSuccess}
              </div>
            )}

            {saveError && (
              <div className="p-3 bg-red-50 text-red-700 rounded-xl text-xs font-bold border border-red-200">
                ⚠️ {saveError}
              </div>
            )}

            {/* Profile Edit Form */}
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Display Name</label>
                <div className="relative">
                  <input 
                    type="text" 
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    required
                  />
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Account Role</label>
                <div className="px-3.5 py-2 rounded-xl bg-slate-100 text-slate-800 text-xs font-extrabold border border-slate-200 flex items-center justify-between">
                  <span>{userRole} ACCOUNT</span>
                  <span className="text-[10px] text-blue-600 font-bold uppercase">Active Status</span>
                </div>
              </div>

              {userRole === 'TOURIST' && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Budget Preference</label>
                    <select 
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                      value={editBudget}
                      onChange={(e) => setEditBudget(e.target.value)}
                    >
                      <option value="Low">Budget (Economic)</option>
                      <option value="Medium">Standard / Comfort (Medium)</option>
                      <option value="High">Luxury / Premium (High)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Travel Interests</label>
                    <div className="flex flex-wrap gap-1.5">
                      {interestOptions.map((opt) => {
                        const active = currentInterestList.includes(opt);
                        return (
                          <button
                            type="button"
                            key={opt}
                            onClick={() => toggleInterestItem(opt)}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition ${
                              active 
                                ? 'bg-blue-600 text-white border-blue-600 shadow-xs' 
                                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            {active ? '✓ ' : '+ '} {opt}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}

              {/* Action Buttons inside Profile Modal */}
              <div className="pt-2 space-y-2">
                <button 
                  type="submit" 
                  disabled={saving}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow transition flex items-center justify-center gap-1.5"
                >
                  <Edit3 size={14} /> {saving ? 'Saving Changes...' : 'Save Profile Details'}
                </button>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  {userRole === 'TOURIST' && (
                    <button
                      type="button"
                      onClick={() => { setShowProfileModal(false); navigate('/my-bookings'); }}
                      className="py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center justify-center gap-1 border border-slate-200"
                    >
                      <BookmarkCheck size={14} /> My Bookings
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => { setShowProfileModal(false); onLogout(); navigate('/login'); }}
                    className={`py-2.5 bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs rounded-xl flex items-center justify-center gap-1 border border-red-200 ${userRole !== 'TOURIST' ? 'col-span-2' : ''}`}
                  >
                    <LogOut size={14} /> Logout
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TOP NAVBAR */}
      <nav className="navbar shadow-xl relative z-[1000]">
        
        {/* Left Column: Brand Logo + Live GPS Activation directly BELOW Title Name */}
        <div className="flex flex-col shrink-0">
          <Link to="/" className="flex items-center no-underline" onClick={() => setIsMobileMenuOpen(false)}>
            <DigitalYatraLogo size="small" light={true} />
          </Link>

          {/* Global Live Location Activation Badge BELOW Title Name */}
          {userLocation && userLocation.lat && (
            <div className="flex items-center gap-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 px-2 py-0.5 rounded-full text-[10px] font-bold self-start mt-1 shadow-xs whitespace-nowrap">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
              <Navigation size={10} className="text-emerald-400" />
              <span>Live GPS ({userLocation.lat.toFixed(2)}, {userLocation.lng.toFixed(2)})</span>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Toggle Button */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={toggleMobileMenu}
            className="p-2 text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition"
            aria-label="Toggle Navigation Menu"
          >
            {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Desktop Nav Links Container */}
        <div className="hidden md:flex nav-links items-center gap-1">
          {userRole === 'TOURIST' && (
            <>
              <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
                <Compass size={16} /> <span>Home</span>
              </Link>
              <Link to="/discover" className={`nav-link ${location.pathname === '/discover' ? 'active' : ''}`}>
                <Landmark size={16} /> <span>History & Places</span>
              </Link>
              <Link to="/plan" className={`nav-link ${location.pathname === '/plan' ? 'active' : ''}`}>
                <CalendarCheck size={16} /> <span>Plan Trip</span>
              </Link>
              <Link to="/guide" className={`nav-link ${location.pathname === '/guide' ? 'active' : ''}`}>
                <MapPin size={16} /> <span>Guide Me</span>
              </Link>
              <Link to="/guides" className={`nav-link ${location.pathname === '/guides' ? 'active' : ''}`}>
                <UserCheck size={16} /> <span>Book Guide</span>
              </Link>
              <Link to="/my-bookings" className={`nav-link ${location.pathname === '/my-bookings' ? 'active' : ''}`}>
                <CalendarCheck size={16} /> <span>My Bookings</span>
              </Link>
              <Link to="/safety" className={`nav-link ${location.pathname === '/safety' ? 'active' : ''}`} style={{ color: '#F87171' }}>
                <ShieldAlert size={16} /> <span>Safety Mode</span>
              </Link>
              <Link to="/report" className={`nav-link ${location.pathname === '/report' ? 'active' : ''}`}>
                <FileText size={16} /> <span>Report</span>
              </Link>
            </>
          )}

          {userRole === 'GUIDE' && (
            <>
              <Link to="/guide-dashboard" className={`nav-link ${location.pathname === '/guide-dashboard' ? 'active' : ''}`}>
                <LayoutDashboard size={16} /> <span>Guide Dashboard</span>
              </Link>
              <Link to="/discover" className={`nav-link ${location.pathname === '/discover' ? 'active' : ''}`}>
                <Landmark size={16} /> <span>History & Places</span>
              </Link>
              <Link to="/safety" className={`nav-link ${location.pathname === '/safety' ? 'active' : ''}`} style={{ color: '#F87171' }}>
                <ShieldAlert size={16} /> <span>Safety Mode</span>
              </Link>
            </>
          )}

          {userRole === 'ADMIN' && (
            <>
              <Link to="/admin" className={`nav-link ${location.pathname === '/admin' ? 'active' : ''}`}>
                <LayoutDashboard size={16} /> <span>Admin Dashboard</span>
              </Link>
              <Link to="/discover" className={`nav-link ${location.pathname === '/discover' ? 'active' : ''}`}>
                <Landmark size={16} /> <span>History & Places</span>
              </Link>
              <Link to="/report" className={`nav-link ${location.pathname === '/report' ? 'active' : ''}`}>
                <FileText size={16} /> <span>Reports</span>
              </Link>
            </>
          )}
        </div>

        {/* Desktop User Actions: Unique Profile Avatar Icon + Edit Profile Option + Logout */}
        <div className="hidden md:flex nav-user shrink-0 items-center gap-2">
          {user ? (
            <div className="flex items-center gap-2">
              {/* Unique User Profile Chip with Initial Avatar */}
              <button 
                onClick={handleOpenProfileModal}
                className="flex items-center gap-2 bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700 px-2.5 py-1.5 rounded-2xl transition cursor-pointer group shadow-sm text-left"
                title="Click to view & edit user profile details"
              >
                {/* First Letter Avatar Circle */}
                <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-sky-400 text-white font-black text-xs flex items-center justify-center shadow-md border border-white/20 group-hover:scale-105 transition">
                  {firstLetter}
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-slate-100 max-w-[120px] truncate leading-none">
                    {user.name}
                  </span>
                  <span className="text-[9.5px] text-sky-400 font-semibold leading-none mt-0.5">
                    {userRole} • Edit Profile
                  </span>
                </div>
              </button>

              <button 
                onClick={() => { onLogout(); navigate('/login'); }} 
                className="bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white px-3 py-2 rounded-xl text-xs font-semibold border border-slate-700 transition flex items-center gap-1"
                title="Logout from session"
              >
                <LogOut size={13} /> Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link 
                to="/login" 
                className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition flex items-center gap-1.5 no-underline"
              >
                <LogIn size={14} /> Login
              </Link>
              <Link 
                to="/register" 
                className="px-4 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold rounded-xl shadow-md transition no-underline"
              >
                Register
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Drawer Menu (Visible when hamburger toggled on small screens) */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-slate-900/95 backdrop-blur-xl border-b border-slate-800 p-4 shadow-2xl flex flex-col gap-3 animate-fadeIn">
            {user ? (
              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-800/80 border border-slate-700/80 mb-1">
                <button 
                  onClick={() => { setIsMobileMenuOpen(false); handleOpenProfileModal(); }}
                  className="flex items-center gap-2.5 text-xs font-semibold text-slate-200 text-left cursor-pointer"
                >
                  <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-extrabold flex items-center justify-center text-sm shadow-md">
                    {firstLetter}
                  </div>
                  <div>
                    <div className="font-bold text-slate-100 flex items-center gap-1">
                      {user.name} <Edit3 size={11} className="text-sky-400" />
                    </div>
                    <div className="text-[10px] text-sky-400 font-bold">{userRole} • Tap to edit profile</div>
                  </div>
                </button>

                <button 
                  onClick={() => { setIsMobileMenuOpen(false); onLogout(); navigate('/login'); }} 
                  className="bg-red-500/20 hover:bg-red-500/30 text-red-400 px-3 py-1.5 rounded-xl text-xs font-bold border border-red-500/30 flex items-center gap-1"
                >
                  <LogOut size={13} /> Logout
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 mb-2">
                <Link 
                  to="/login" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-bold rounded-xl text-center flex items-center justify-center gap-1.5"
                >
                  <LogIn size={14} /> Login
                </Link>
                <Link 
                  to="/register" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl text-center shadow-md flex items-center justify-center gap-1.5"
                >
                  Register
                </Link>
              </div>
            )}

            {/* Navigation Links inside Mobile Drawer */}
            <div className="flex flex-col gap-1">
              {userRole === 'TOURIST' && (
                <>
                  <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
                    <Compass size={18} /> <span>Home</span>
                  </Link>
                  <Link to="/discover" onClick={() => setIsMobileMenuOpen(false)} className={`nav-link ${location.pathname === '/discover' ? 'active' : ''}`}>
                    <Landmark size={18} /> <span>History & Places</span>
                  </Link>
                  <Link to="/plan" onClick={() => setIsMobileMenuOpen(false)} className={`nav-link ${location.pathname === '/plan' ? 'active' : ''}`}>
                    <CalendarCheck size={18} /> <span>Plan Trip</span>
                  </Link>
                  <Link to="/guide" onClick={() => setIsMobileMenuOpen(false)} className={`nav-link ${location.pathname === '/guide' ? 'active' : ''}`}>
                    <MapPin size={18} /> <span>Guide Me</span>
                  </Link>
                  <Link to="/guides" onClick={() => setIsMobileMenuOpen(false)} className={`nav-link ${location.pathname === '/guides' ? 'active' : ''}`}>
                    <UserCheck size={18} /> <span>Book Guide</span>
                  </Link>
                  <Link to="/my-bookings" onClick={() => setIsMobileMenuOpen(false)} className={`nav-link ${location.pathname === '/my-bookings' ? 'active' : ''}`}>
                    <CalendarCheck size={18} /> <span>My Bookings</span>
                  </Link>
                  <Link to="/safety" onClick={() => setIsMobileMenuOpen(false)} className={`nav-link ${location.pathname === '/safety' ? 'active' : ''}`} style={{ color: '#F87171' }}>
                    <ShieldAlert size={18} /> <span>Safety Mode</span>
                  </Link>
                  <Link to="/report" onClick={() => setIsMobileMenuOpen(false)} className={`nav-link ${location.pathname === '/report' ? 'active' : ''}`}>
                    <FileText size={18} /> <span>Report</span>
                  </Link>
                </>
              )}

              {userRole === 'GUIDE' && (
                <>
                  <Link to="/guide-dashboard" onClick={() => setIsMobileMenuOpen(false)} className={`nav-link ${location.pathname === '/guide-dashboard' ? 'active' : ''}`}>
                    <LayoutDashboard size={18} /> <span>Guide Dashboard</span>
                  </Link>
                  <Link to="/discover" onClick={() => setIsMobileMenuOpen(false)} className={`nav-link ${location.pathname === '/discover' ? 'active' : ''}`}>
                    <Landmark size={18} /> <span>History & Places</span>
                  </Link>
                  <Link to="/safety" onClick={() => setIsMobileMenuOpen(false)} className={`nav-link ${location.pathname === '/safety' ? 'active' : ''}`} style={{ color: '#F87171' }}>
                    <ShieldAlert size={18} /> <span>Safety Mode</span>
                  </Link>
                </>
              )}

              {userRole === 'ADMIN' && (
                <>
                  <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)} className={`nav-link ${location.pathname === '/admin' ? 'active' : ''}`}>
                    <LayoutDashboard size={18} /> <span>Admin Dashboard</span>
                  </Link>
                  <Link to="/discover" onClick={() => setIsMobileMenuOpen(false)} className={`nav-link ${location.pathname === '/discover' ? 'active' : ''}`}>
                    <Landmark size={18} /> <span>History & Places</span>
                  </Link>
                  <Link to="/report" onClick={() => setIsMobileMenuOpen(false)} className={`nav-link ${location.pathname === '/report' ? 'active' : ''}`}>
                    <FileText size={18} /> <span>Reports</span>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;
