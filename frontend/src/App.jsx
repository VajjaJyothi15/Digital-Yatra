import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Chatbot from './components/Chatbot';
import Home from './pages/Home';
import Discover from './pages/Discover';
import DestinationDetail from './pages/DestinationDetail';
import BookGuide from './pages/BookGuide';
import GuideDashboard from './pages/GuideDashboard';
import TouristBookings from './pages/TouristBookings';
import Login from './pages/Login';
import Register from './pages/Register';
import PlanTrip from './pages/PlanTrip';
import Itinerary from './pages/Itinerary';
import Guide from './pages/Guide';
import Safety from './pages/Safety';
import Report from './pages/Report';
import Admin from './pages/Admin';
import Reviews from './pages/Reviews';
import LocationPermissionModal from './components/LocationPermissionModal';
import { getSavedLiveLocation, saveLiveLocation, getLiveLocation } from './utils/geolocation';
import './styles/global.css';

function App() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user') || localStorage.getItem('dy_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [userLocation, setUserLocation] = useState(() => getSavedLiveLocation());

  // Listen for live GPS location updates across all pages
  useEffect(() => {
    const handleLocationUpdateEvent = (e) => {
      if (e.detail && e.detail.lat && e.detail.lng) {
        setUserLocation(e.detail);
      }
    };
    window.addEventListener('dy_location_updated', handleLocationUpdateEvent);
    return () => window.removeEventListener('dy_location_updated', handleLocationUpdateEvent);
  }, []);

  const handleLocationUpdate = (loc) => {
    setUserLocation(loc);
    saveLiveLocation(loc);
  };

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('dy_user', JSON.stringify(userData));
    sessionStorage.removeItem('dy_gps_prompt_responded');
  };

  const handleUpdateUser = (updatedData) => {
    const newUserData = { ...user, ...updatedData };
    setUser(newUserData);
    localStorage.setItem('user', JSON.stringify(newUserData));
    localStorage.setItem('dy_user', JSON.stringify(newUserData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('dy_user');
    sessionStorage.removeItem('dy_gps_prompt_responded');
  };

  const userRole = user?.role || 'TOURIST';

  return (
    <Router>
      <div className="app-container">
        {userRole === 'TOURIST' && (
          <LocationPermissionModal 
            user={user} 
            userLocation={userLocation} 
            onLocationUpdate={handleLocationUpdate} 
          />
        )}
        <Navbar user={user} userLocation={userLocation} onLogout={handleLogout} onUpdateUser={handleUpdateUser} />

        <main className="main-content">
          <Routes>
            {/* ROLE BASED DASHBOARD REDIRECTION */}
            <Route 
              path="/" 
              element={
                userRole === 'GUIDE' ? <Navigate to="/guide-dashboard" replace /> :
                userRole === 'ADMIN' ? <Navigate to="/admin" replace /> :
                <Home user={user} userLocation={userLocation} onLocationUpdate={handleLocationUpdate} />
              } 
            />
            
            <Route path="/discover" element={<Discover user={user} userLocation={userLocation} />} />
            <Route path="/destination/:id" element={<DestinationDetail user={user} userLocation={userLocation} />} />
            <Route path="/guides" element={<BookGuide user={user} userLocation={userLocation} />} />
            <Route path="/guide-dashboard" element={<GuideDashboard user={user} />} />
            <Route path="/my-bookings" element={<TouristBookings user={user} />} />
            <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
            <Route path="/register" element={<Register onLoginSuccess={handleLoginSuccess} />} />
            <Route path="/plan" element={<PlanTrip user={user} userLocation={userLocation} />} />
            <Route path="/itinerary" element={<Itinerary user={user} userLocation={userLocation} />} />
            <Route path="/guide" element={<Guide user={user} userLocation={userLocation} onLocationUpdate={handleLocationUpdate} />} />
            <Route path="/safety" element={<Safety user={user} userLocation={userLocation} onLocationUpdate={handleLocationUpdate} />} />
            <Route path="/report" element={<Report user={user} userLocation={userLocation} />} />
            <Route path="/reviews" element={<Reviews user={user} />} />
            <Route path="/admin" element={<Admin user={user} />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        {/* Global Floating AI Assistant for Tourist Portal */}
        {userRole === 'TOURIST' && <Chatbot userLocation={userLocation} />}

        <footer className="footer">
          <p>© 2026 Digital Yatra. All rights reserved.</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
