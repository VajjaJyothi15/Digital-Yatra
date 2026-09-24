import React, { useState, useEffect } from 'react';
import { submitReportFormData, getUserReports } from '../api/api';
import { FileText, MapPin, Upload, CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import { getLiveLocation } from '../utils/geolocation';

const categories = [
  { id: 'Sanitation', label: 'Sanitation & Restroom', icon: '🚻' },
  { id: 'Transport', label: 'Transport Reliability', icon: '🚕' },
  { id: 'Overcharging', label: 'Touting & Overcharging', icon: '💰' },
  { id: 'Safety', label: 'Safety & Harassment', icon: '🚨' },
  { id: 'Road / Infrastructure', label: 'Infrastructure & Roads', icon: '🚧' },
  { id: 'Food / Water', label: 'Food & Drinking Water', icon: '💧' },
  { id: 'Other', label: 'Other Issue', icon: '📋' }
];

const Report = ({ user }) => {
  const [category, setCategory] = useState('Sanitation');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [description, setDescription] = useState('');
  const [photoFile, setPhotoFile] = useState(null);

  const [submitting, setSubmitting] = useState(false);
  const [submittedReport, setSubmittedReport] = useState(null);
  const [error, setError] = useState('');
  const [pastReports, setPastReports] = useState([]);
  const [gpsStatus, setGpsStatus] = useState('Detecting GPS location...');

  useEffect(() => {
    detectGPS();
    fetchUserReports();
  }, []);

  const detectGPS = () => {
    getLiveLocation(
      (loc) => {
        setLatitude(loc.lat.toFixed(4));
        setLongitude(loc.lng.toFixed(4));
      },
      () => {
        setGpsStatus('⚠️ Location permission denied/unavailable. Please enter coordinates manually.');
      },
      (status) => setGpsStatus(status)
    );
  };


  const fetchUserReports = async () => {
    try {
      const uId = user ? user.id : 1;
      const res = await getUserReports({ user_id: uId });
      if (res.success) {
        setPastReports(res.reports);
      }
    } catch (err) {
      console.error('Fetch user reports error:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('user_id', user ? user.id : 1);
      formData.append('category', category);
      formData.append('latitude', latitude);
      formData.append('longitude', longitude);
      formData.append('description', description);
      if (photoFile) {
        formData.append('photo', photoFile);
      }

      const res = await submitReportFormData(formData);
      if (res.success) {
        setSubmittedReport(res.report);
        setDescription('');
        setPhotoFile(null);
        fetchUserReports();
      } else {
        setError(res.message || 'Report submission failed.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error submitting report.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: '850px', margin: '40px auto', padding: '0 24px' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <span className="hero-tag">CIVIC & TOURISM TRANSPARENCY</span>
        <h1 style={{ fontSize: '2.4rem', marginTop: '8px' }}>📝 Report a Tourism Issue</h1>
        <p style={{ color: 'var(--text-muted)' }}>
          Help improve sanitation, transport, food safety, and infrastructure by reporting problems to authorities.
        </p>
      </div>

      {/* Submission Success Confirmation Modal / Banner */}
      {submittedReport && (
        <div className="glass-card" style={{ background: '#ECFDF5', border: '2px solid #10B981', padding: '28px', marginBottom: '32px', textAlign: 'center' }}>
          <CheckCircle2 size={48} color="#10B981" style={{ margin: '0 auto 12px auto' }} />
          <h2 style={{ color: '#065F46', marginBottom: '6px' }}>✓ Report Submitted Successfully</h2>
          
          <div style={{ background: 'white', padding: '16px', borderRadius: '12px', display: 'inline-block', margin: '16px 0', border: '1px solid #A7F3D0', textAlign: 'left' }}>
            <div style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--primary)' }}>
              Report ID: {submittedReport.report_id}
            </div>
            <div style={{ fontSize: '0.9rem', marginTop: '4px' }}>
              Category: <strong>{submittedReport.category}</strong>
            </div>
            <div style={{ fontSize: '0.9rem', marginTop: '2px' }}>
              Status: <span className="trust-badge verified">Under Review</span>
            </div>
          </div>

          <p style={{ fontSize: '0.85rem', color: '#047857' }}>
            Your report is recorded in the tourism authority database and will feed into real-time hotspot monitoring.
          </p>

          <button 
            className="btn btn-primary" 
            style={{ marginTop: '16px', padding: '8px 20px', fontSize: '0.85rem' }}
            onClick={() => setSubmittedReport(null)}
          >
            Submit Another Report
          </button>
        </div>
      )}

      {error && (
        <div className="alert-banner alert-error">
          <AlertCircle size={18} /> {error}
        </div>
      )}

      {/* Report Submission Form */}
      <div className="glass-card" style={{ padding: '32px', marginBottom: '40px' }}>
        <form onSubmit={handleSubmit}>
          {/* Category Selection */}
          <div className="form-group">
            <label style={{ fontSize: '1rem', marginBottom: '12px' }}>1. Select Problem Category</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
              {categories.map((cat) => {
                const selected = category === cat.id;
                return (
                  <div
                    key={cat.id}
                    onClick={() => setCategory(cat.id)}
                    style={{
                      padding: '12px 14px',
                      borderRadius: '12px',
                      border: selected ? '2px solid var(--primary)' : '1px solid #CBD5E1',
                      background: selected ? 'var(--primary-light)' : 'white',
                      color: selected ? 'var(--primary)' : 'var(--text-main)',
                      fontWeight: selected ? '700' : '500',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      fontSize: '0.9rem'
                    }}
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Location Detection */}
          <div className="form-group" style={{ marginTop: '20px' }}>
            <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>2. Location Coordinates</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: '600' }}>{gpsStatus}</span>
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '6px' }}>
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Latitude:</span>
                <input 
                  type="text" 
                  className="form-control" 
                  value={latitude}
                  onChange={(e) => setLatitude(e.target.value)}
                  required 
                />
              </div>
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Longitude:</span>
                <input 
                  type="text" 
                  className="form-control" 
                  value={longitude}
                  onChange={(e) => setLongitude(e.target.value)}
                  required 
                />
              </div>
            </div>
          </div>

          {/* Photo Upload */}
          <div className="form-group">
            <label>3. Add Photo (Optional)</label>
            <input 
              type="file" 
              accept="image/*"
              className="form-control"
              onChange={(e) => setPhotoFile(e.target.files[0])}
            />
            {photoFile && (
              <div style={{ fontSize: '0.8rem', color: 'var(--success)', marginTop: '4px' }}>
                ✓ Selected file: {photoFile.name}
              </div>
            )}
          </div>

          {/* Description */}
          <div className="form-group">
            <label>4. Problem Description</label>
            <textarea 
              className="form-control"
              rows="4"
              placeholder="What happened? Describe the issue (e.g. overcharging amount, missing water supply, unhygienic restroom)..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            ></textarea>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%', padding: '14px', fontSize: '1rem', marginTop: '8px' }}
            disabled={submitting}
          >
            {submitting ? 'Submitting Report...' : 'SUBMIT REPORT'}
          </button>
        </form>
      </div>

      {/* User's Previous Reports */}
      {pastReports.length > 0 && (
        <div>
          <h3 style={{ fontSize: '1.3rem', marginBottom: '16px' }}>📋 Your Submitted Reports</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {pastReports.map((rpt) => (
              <div key={rpt.id} className="glass-card" style={{ padding: '18px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontWeight: '800', color: 'var(--primary)', fontSize: '0.95rem' }}>
                    #RPT{rpt.id + 1000}
                  </span>
                  <span className={`trust-badge ${rpt.status === 'Resolved' ? 'verified' : 'user-reported'}`}>
                    {rpt.status}
                  </span>
                </div>
                <div style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--text-main)' }}>
                  Category: {rpt.category}
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '6px 0' }}>
                  {rpt.description}
                </p>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', gap: '16px' }}>
                  <span>📍 Coordinates: {rpt.latitude}, {rpt.longitude}</span>
                  <span>🗓️ Date: {rpt.created_at}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Report;
