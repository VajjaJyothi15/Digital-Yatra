import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import DigitalYatraLogo from './DigitalYatraLogo';
import { Compass, ShieldAlert, FileText, MapPin, UserCheck, CalendarCheck, User, LogOut, LogIn, LayoutDashboard, Landmark, Navigation, Menu, X, Edit3, CheckCircle, Settings, BookmarkCheck, Phone, Mail, Globe, Award, Shield, DollarSign } from 'lucide-react';
import { updateUserProfile } from '../api/api';

const Navbar = ({ user, userLocation, onLogout, onUpdateUser }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Comprehensive User Profile & Edit Modal State
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [editName, setEditName] = useState(user?.name || '');
  const [editEmail, setEditEmail] = useState(user?.email || '');
  const [editPhone, setEditPhone] = useState(user?.phone || user?.guide_details?.bio || '');
  const [editCity, setEditCity] = useState(user?.city || user?.guide_details?.city || 'Goa');
  const [editDesignation, setEditDesignation] = useState(user?.designation || 'Tourism Officer');

  // Role-specific profile fields
  const [editInterests, setEditInterests] = useState(user?.interests || '');
  const [editBudget, setEditBudget] = useState(user?.budget_preference || 'Medium');
  const [editLanguages, setEditLanguages] = useState(user?.languages || 'English, Hindi');
  const [editSpecialization, setEditSpecialization] = useState(user?.specialization || 'Heritage & Culture');
  const [editPrice, setEditPrice] = useState(user?.price_per_day || 800);

  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState('');
  const [saveError, setSaveError] = useState('');

  const userRole = user?.role || 'TOURIST';
  const firstLetter = user?.name ? user.name.trim()[0].toUpperCase() : 'U';

  // Sync profile state when user prop changes
  useEffect(() => {
    if (user) {
      setEditName(user.name || '');
      setEditEmail(user.email || '');
      setEditPhone(user.phone || (user.guide_details?.bio ? user.guide_details.bio.replace('Phone: ', '') : ''));
      setEditCity(user.city || user.guide_details?.city || 'Goa');
      setEditDesignation(user.designation || (userRole === 'ADMIN' ? 'Chief Security Officer' : ''));
      setEditInterests(user.interests || '');
      setEditBudget(user.budget_preference || 'Medium');
      setEditLanguages(user.languages || 'English, Hindi');
      setEditSpecialization(user.specialization || 'Heritage & Culture');
      setEditPrice(user.price_per_day || 800);
    }
  }, [user, userRole]);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  const handleOpenProfileModal = () => {
    setIsEditing(false);
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
        email: editEmail || user?.email,
        name: editName,
        phone: editPhone,
        city: editCity,
        designation: editDesignation,
        interests: editInterests,
        budget_preference: editBudget,
        languages: editLanguages,
        specialization: editSpecialization,
        price_per_day: editPrice
      });

      if (res.success) {
        setSaveSuccess('✓ Profile updated successfully!');
        if (onUpdateUser) {
          onUpdateUser(res.user);
        }
        setIsEditing(false);
        setTimeout(() => {
          setSaveSuccess('');
        }, 2000);
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
      {/* USER PROFILE & ACCOUNT MODAL (Contains Name, Phone, Email, Role Details, Login & Logout) */}
      {showProfileModal && (
        <div className="fixed inset-0 z-[2700] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200 space-y-5 animate-scaleUp max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-sky-500 text-white font-black text-xl flex items-center justify-center shadow-lg border border-white/30">
                  {firstLetter}
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-1.5">
                    {user?.name || 'User Profile'}
                  </h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase ${
                      userRole === 'ADMIN' ? 'bg-indigo-100 text-indigo-700' :
                      userRole === 'GUIDE' ? 'bg-amber-100 text-amber-800' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {userRole}
                    </span>
                    <span className="text-xs text-slate-500 truncate max-w-[160px]">{user?.email}</span>
                  </div>
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

            {/* Profile Form (View mode / Edit Mode) */}
            <form onSubmit={handleSaveProfile} className="space-y-3.5">
              
              {/* Name Field */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                <div className="relative">
                  <input 
                    type="text" 
                    disabled={!isEditing}
                    className={`w-full pl-9 pr-4 py-2.5 rounded-xl border text-xs font-bold ${isEditing ? 'bg-white border-blue-500 text-slate-900 ring-2 ring-blue-100' : 'bg-slate-50 border-slate-200 text-slate-700'}`}
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    required
                  />
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                </div>
              </div>

              {/* Email Address Field */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Mail ID / Email Address</label>
                <div className="relative">
                  <input 
                    type="email" 
                    disabled={!isEditing}
                    className={`w-full pl-9 pr-4 py-2.5 rounded-xl border text-xs font-bold ${isEditing ? 'bg-white border-blue-500 text-slate-900 ring-2 ring-blue-100' : 'bg-slate-50 border-slate-200 text-slate-700'}`}
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    required
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                </div>
              </div>

              {/* Phone Number Field */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
                <div className="relative">
                  <input 
                    type="tel" 
                    disabled={!isEditing}
                    placeholder="+91 9876543210"
                    className={`w-full pl-9 pr-4 py-2.5 rounded-xl border text-xs font-bold ${isEditing ? 'bg-white border-blue-500 text-slate-900 ring-2 ring-blue-100' : 'bg-slate-50 border-slate-200 text-slate-700'}`}
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                  />
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                </div>
              </div>

              {/* City / Region Field */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">City / Location</label>
                <div className="relative">
                  <input 
                    type="text" 
                    disabled={!isEditing}
                    placeholder="e.g. Goa, Jaipur, Tirupati"
                    className={`w-full pl-9 pr-4 py-2.5 rounded-xl border text-xs font-bold ${isEditing ? 'bg-white border-blue-500 text-slate-900 ring-2 ring-blue-100' : 'bg-slate-50 border-slate-200 text-slate-700'}`}
                    value={editCity}
                    onChange={(e) => setEditCity(e.target.value)}
                  />
                  <Globe className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                </div>
              </div>

              {/* ROLE SPECIFIC EXTRA DETAILS */}

              {/* TOURIST EXTRA DETAILS */}
              {userRole === 'TOURIST' && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Budget Preference</label>
                    <select 
                      disabled={!isEditing}
                      className={`w-full px-3 py-2 rounded-xl border text-xs font-semibold ${isEditing ? 'bg-white border-blue-500 text-slate-900' : 'bg-slate-50 border-slate-200 text-slate-700'}`}
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
                            disabled={!isEditing}
                            onClick={() => toggleInterestItem(opt)}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition ${
                              active 
                                ? 'bg-blue-600 text-white border-blue-600' 
                                : 'bg-slate-50 text-slate-600 border-slate-200'
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

              {/* LOCAL GUIDE EXTRA DETAILS */}
              {userRole === 'GUIDE' && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Languages Spoken</label>
                    <input 
                      type="text" 
                      disabled={!isEditing}
                      placeholder="English, Hindi, Telugu"
                      className={`w-full px-3 py-2 rounded-xl border text-xs font-bold ${isEditing ? 'bg-white border-amber-500 text-slate-900' : 'bg-slate-50 border-slate-200 text-slate-700'}`}
                      value={editLanguages}
                      onChange={(e) => setEditLanguages(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Guide Specialization</label>
                    <input 
                      type="text" 
                      disabled={!isEditing}
                      placeholder="Heritage & Culture, Wildlife"
                      className={`w-full px-3 py-2 rounded-xl border text-xs font-bold ${isEditing ? 'bg-white border-amber-500 text-slate-900' : 'bg-slate-50 border-slate-200 text-slate-700'}`}
                      value={editSpecialization}
                      onChange={(e) => setEditSpecialization(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Daily Fee Rate (₹)</label>
                    <input 
                      type="number" 
                      disabled={!isEditing}
                      className={`w-full px-3 py-2 rounded-xl border text-xs font-bold ${isEditing ? 'bg-white border-amber-500 text-slate-900' : 'bg-slate-50 border-slate-200 text-slate-700'}`}
                      value={editPrice}
                      onChange={(e) => setEditPrice(e.target.value)}
                    />
                  </div>
                </>
              )}

              {/* ADMIN EXTRA DETAILS */}
              {userRole === 'ADMIN' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Administrator Designation</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      disabled={!isEditing}
                      placeholder="Senior Tourism Safety Officer"
                      className={`w-full pl-9 pr-4 py-2.5 rounded-xl border text-xs font-bold ${isEditing ? 'bg-white border-indigo-500 text-slate-900' : 'bg-slate-50 border-slate-200 text-slate-700'}`}
                      value={editDesignation}
                      onChange={(e) => setEditDesignation(e.target.value)}
                    />
                    <Shield className="w-4 h-4 text-indigo-500 absolute left-3 top-3" />
                  </div>
                </div>
              )}

              {/* MODAL ACTION BUTTONS: EDIT, SAVE, SWITCH LOGIN & LOGOUT */}
              <div className="pt-3 space-y-2 border-t border-slate-100">
                {!isEditing ? (
                  <button 
                    type="button" 
                    onClick={() => setIsEditing(true)}
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow transition flex items-center justify-center gap-1.5"
                  >
                    <Edit3 size={14} /> Edit Profile Details
                  </button>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <button 
                      type="button" 
                      onClick={() => setIsEditing(false)}
                      className="py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl border border-slate-200"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      disabled={saving}
                      className="py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow transition flex items-center justify-center gap-1"
                    >
                      <CheckCircle size={14} /> {saving ? 'Saving...' : 'Save Details'}
                    </button>
                  </div>
                )}

                {/* LOGIN & LOGOUT OPTIONS INSIDE PROFILE MODAL */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => { setShowProfileModal(false); navigate('/login'); }}
                    className="py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 border border-slate-700"
                    title="Switch or Login to another account"
                  >
                    <LogIn size={14} /> Login / Switch Account
                  </button>

                  <button
                    type="button"
                    onClick={() => { setShowProfileModal(false); onLogout(); navigate('/login'); }}
                    className="py-2.5 bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 border border-red-200"
                    title="Log out from session"
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

        {/* Desktop User Actions: Unique First Letter Avatar Icon + Edit Profile Option + Login / Logout */}
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
                    {userRole} • Profile
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
                    <div className="text-[10px] text-sky-400 font-bold">{userRole} • Tap to view & edit profile</div>
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
