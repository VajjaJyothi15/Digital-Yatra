import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import DigitalYatraLogo from './DigitalYatraLogo';
import { Compass, ShieldAlert, FileText, MapPin, UserCheck, CalendarCheck, User, LogOut, LogIn, LayoutDashboard, Landmark, Navigation, Menu, X } from 'lucide-react';

const Navbar = ({ user, userLocation, onLogout }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const userRole = user?.role || 'TOURIST';

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  return (
    <nav className="navbar shadow-xl relative z-[1000]">
      {/* Top Bar: Brand Logo & Right Mobile Controls */}
      <div className="flex items-center justify-between w-full md:w-auto">
        <div className="flex items-center gap-3 shrink-0">
          <Link to="/" className="flex items-center no-underline" onClick={() => setIsMobileMenuOpen(false)}>
            <DigitalYatraLogo size="small" light={true} />
          </Link>

          {/* Global Live Location Status Badge (Desktop) */}
          {userLocation && userLocation.lat && (
            <div className="hidden lg:flex items-center gap-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 px-2.5 py-1 rounded-full text-[11px] font-bold whitespace-nowrap shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
              <Navigation size={11} className="text-emerald-400" />
              <span>GPS ({userLocation.lat.toFixed(2)}, {userLocation.lng.toFixed(2)})</span>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Toggle Button */}
        <div className="flex items-center gap-2 md:hidden">
          {userLocation && userLocation.lat && (
            <div className="flex items-center gap-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 px-2 py-0.5 rounded-full text-[10px] font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
              <span>GPS</span>
            </div>
          )}
          <button
            onClick={toggleMobileMenu}
            className="p-2 text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition"
            aria-label="Toggle Navigation Menu"
          >
            {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Desktop Nav Links Container */}
      <div className="hidden md:flex nav-links items-center gap-1">
        {/* Tourist Links */}
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

        {/* Local Guide Links */}
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

        {/* Admin Links */}
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

      {/* Desktop User Actions */}
      <div className="hidden md:flex nav-user shrink-0">
        {user ? (
          <div className="flex items-center gap-2">
            <div className="user-chip text-xs px-2.5 py-1 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 font-medium">
              <User size={13} className="inline mr-1 text-sky-400" />
              <span>{user.name}</span>
              <span className="opacity-60 text-[10px] ml-1">({userRole})</span>
            </div>
            <button 
              onClick={() => { onLogout(); navigate('/login'); }} 
              className="bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white px-3 py-1.5 rounded-xl text-xs font-semibold border border-slate-700 transition-all flex items-center gap-1"
            >
              <LogOut size={13} /> Logout
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link 
              to="/login" 
              className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5 no-underline"
            >
              <LogIn size={14} /> Login
            </Link>
            <Link 
              to="/register" 
              className="px-4 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold rounded-xl shadow-md transition-all no-underline"
            >
              Register
            </Link>
          </div>
        )}
      </div>

      {/* Mobile Drawer Menu (Visible when hamburger toggled on small screens) */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-slate-900/95 backdrop-blur-xl border-b border-slate-800 p-4 shadow-2xl flex flex-direction-column flex-col gap-3 animate-fadeIn">
          {/* User Account Info inside mobile menu */}
          {user ? (
            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-800/80 border border-slate-700/80 mb-1">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
                <div className="w-8 h-8 rounded-full bg-blue-600/30 text-blue-400 flex items-center justify-center font-bold">
                  {user.name ? user.name[0].toUpperCase() : 'U'}
                </div>
                <div>
                  <div className="font-bold text-slate-100">{user.name}</div>
                  <div className="text-[10px] text-slate-400">{user.email || userRole}</div>
                </div>
              </div>
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
  );
};

export default Navbar;
