import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import DigitalYatraLogo from './DigitalYatraLogo';
import { Compass, ShieldAlert, FileText, MapPin, UserCheck, CalendarCheck, User, LogOut, LogIn, LayoutDashboard, Search, Landmark, Navigation } from 'lucide-react';

const Navbar = ({ user, userLocation, onLogout }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const userRole = user?.role || 'TOURIST';

  return (
    <nav className="navbar shadow-xl">
      {/* Brand & GPS Badge */}
      <div className="flex items-center gap-3 shrink-0">
        <Link to="/" className="flex items-center no-underline">
          <DigitalYatraLogo size="small" light={true} />
        </Link>

        {/* Global Live Location Status Badge */}
        {userLocation && userLocation.lat && (
          <div className="hidden xl:flex items-center gap-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 px-2.5 py-1 rounded-full text-[11px] font-bold whitespace-nowrap shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
            <Navigation size={11} className="text-emerald-400" />
            <span>GPS ({userLocation.lat.toFixed(2)}, {userLocation.lng.toFixed(2)})</span>
          </div>
        )}
      </div>

      {/* Nav Links Container */}
      <div className="nav-links">
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

      {/* User Actions */}
      <div className="nav-user shrink-0">
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
    </nav>
  );
};

export default Navbar;
