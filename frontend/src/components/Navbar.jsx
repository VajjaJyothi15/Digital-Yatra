import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import DigitalYatraLogo from './DigitalYatraLogo';
import { Compass, ShieldAlert, FileText, MapPin, UserCheck, CalendarCheck, User, LogOut, LogIn, LayoutDashboard, Search, Landmark, Navigation } from 'lucide-react';

const Navbar = ({ user, userLocation, onLogout }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const userRole = user?.role || 'TOURIST';

  return (
    <nav className="navbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <Link to="/" style={{ textDecoration: 'none' }}>
          <DigitalYatraLogo size="small" light={true} />
        </Link>

        {/* Global Live Location Status Badge */}
        {userLocation && userLocation.lat && (
          <div className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-full text-[11px] font-black flex items-center gap-1.5 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <Navigation size={12} className="text-emerald-400" />
            <span>Live GPS ({userLocation.lat.toFixed(2)}, {userLocation.lng.toFixed(2)})</span>
          </div>
        )}
      </div>

      <div className="nav-links">
        {/* Tourist Links */}
        {userRole === 'TOURIST' && (
          <>
            <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
              <Compass size={18} /> Home
            </Link>
            <Link to="/discover" className={`nav-link ${location.pathname === '/discover' ? 'active' : ''}`}>
              <Landmark size={18} /> History & Places
            </Link>
            <Link to="/plan" className={`nav-link ${location.pathname === '/plan' ? 'active' : ''}`}>
              <CalendarCheck size={18} /> Plan Trip
            </Link>
            <Link to="/guide" className={`nav-link ${location.pathname === '/guide' ? 'active' : ''}`}>
              <MapPin size={18} /> Guide Me
            </Link>
            <Link to="/guides" className={`nav-link ${location.pathname === '/guides' ? 'active' : ''}`}>
              <UserCheck size={18} /> Book Guide
            </Link>
            <Link to="/my-bookings" className={`nav-link ${location.pathname === '/my-bookings' ? 'active' : ''}`}>
              <CalendarCheck size={18} /> My Bookings
            </Link>
            <Link to="/safety" className={`nav-link ${location.pathname === '/safety' ? 'active' : ''}`} style={{ color: '#F87171' }}>
              <ShieldAlert size={18} /> Safety Mode
            </Link>
            <Link to="/report" className={`nav-link ${location.pathname === '/report' ? 'active' : ''}`}>
              <FileText size={18} /> Report
            </Link>
          </>
        )}

        {/* Local Guide Links */}
        {userRole === 'GUIDE' && (
          <>
            <Link to="/guide-dashboard" className={`nav-link ${location.pathname === '/guide-dashboard' ? 'active' : ''}`}>
              <LayoutDashboard size={18} /> Guide Dashboard
            </Link>
            <Link to="/discover" className={`nav-link ${location.pathname === '/discover' ? 'active' : ''}`}>
              <Landmark size={18} /> History & Places
            </Link>
            <Link to="/safety" className={`nav-link ${location.pathname === '/safety' ? 'active' : ''}`} style={{ color: '#F87171' }}>
              <ShieldAlert size={18} /> Safety Mode
            </Link>
          </>
        )}

        {/* Admin Links */}
        {userRole === 'ADMIN' && (
          <>
            <Link to="/admin" className={`nav-link ${location.pathname === '/admin' ? 'active' : ''}`}>
              <LayoutDashboard size={18} /> Admin Dashboard
            </Link>
            <Link to="/discover" className={`nav-link ${location.pathname === '/discover' ? 'active' : ''}`}>
              <Landmark size={18} /> History & Places
            </Link>
            <Link to="/report" className={`nav-link ${location.pathname === '/report' ? 'active' : ''}`}>
              <FileText size={18} /> Reports
            </Link>
          </>
        )}
      </div>

      <div className="nav-user">
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div className="user-chip">
              <User size={14} /> {user.name} <span style={{ opacity: 0.7, fontSize: '0.75rem' }}>({userRole})</span>
            </div>
            <button 
              onClick={() => { onLogout(); navigate('/login'); }} 
              className="btn btn-secondary" 
              style={{ padding: '6px 12px', fontSize: '0.8rem' }}
            >
              <LogOut size={14} /> Logout
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '10px' }}>
            <Link to="/login" className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
              <LogIn size={15} /> Login
            </Link>
            <Link to="/register" className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
              Register
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
