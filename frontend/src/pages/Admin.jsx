import React, { useState, useEffect } from 'react';
import { getAdminDashboardMetrics, getAdminReports, updateReportStatus, getLocalGuides, verifyGuide, revokeGuideByAdmin } from '../api/api';
import TrustBadge from '../components/TrustBadge';
import { FileText, AlertTriangle, CheckCircle, Clock, MapPin, RefreshCw, Layers, ShieldCheck, UserCheck, AlertCircle, Ban } from 'lucide-react';
import '../styles/dashboard.css';

export default function Admin({ user }) {
  const [metrics, setMetrics] = useState(null);
  const [reports, setReports] = useState([]);
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [activeTab, setActiveTab] = useState('reports'); // reports or guides
  const [toastMessage, setToastMessage] = useState(null);

  // Revoke Confirmation Modal State
  const [revokeTarget, setRevokeTarget] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [mRes, rRes, gRes] = await Promise.all([
        getAdminDashboardMetrics(),
        getAdminReports(),
        getLocalGuides({ city: 'all' })
      ]);
      if (mRes.success) setMetrics(mRes.dashboard);
      if (rRes.success) setReports(rRes.reports);
      if (gRes.success) setGuides(gRes.guides);
    } catch (err) {
      console.error('Admin data fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (msg, type = 'success') => {
    setToastMessage({ msg, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleStatusChange = async (reportId, newStatus) => {
    setUpdatingId(reportId);
    try {
      const res = await updateReportStatus(reportId, newStatus);
      if (res.success) {
        showToast(`Report #${reportId} status updated to '${newStatus}'!`);
        fetchAdminData();
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update report status.', 'error');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleVerifyGuide = async (guideId, verifyStatus) => {
    setActionLoading(true);
    try {
      const res = await verifyGuide(guideId, verifyStatus);
      if (res.success) {
        showToast(res.message || 'Guide verification updated successfully!');
        fetchAdminData();
      } else {
        showToast(res.message || 'Failed to update guide status.', 'error');
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Guide verify error.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const confirmRevokeGuide = (guideItem) => {
    setRevokeTarget(guideItem);
  };

  const executeRevoke = async () => {
    if (!revokeTarget) return;
    setActionLoading(true);
    try {
      const res = await revokeGuideByAdmin(revokeTarget.id);
      if (res.success) {
        showToast(`🚫 Revoked verification and portal access for guide ${revokeTarget.name}!`);
        setRevokeTarget(null);
        fetchAdminData();
      } else {
        showToast(res.message || 'Failed to revoke guide.', 'error');
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Authorization error executing revoke.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="admin-container relative">
      
      {/* Toast Banner */}
      {toastMessage && (
        <div className={`fixed top-6 right-6 z-[3000] p-4 rounded-2xl shadow-2xl text-xs sm:text-sm font-extrabold flex items-center gap-2 ${
          toastMessage.type === 'error' ? 'bg-red-600 text-white' : 'bg-slate-900 text-amber-300 border border-amber-500/40'
        }`}>
          <span>{toastMessage.type === 'error' ? '⚠️' : '✓'}</span>
          <span>{toastMessage.msg}</span>
        </div>
      )}

      {/* Revoke Confirmation Modal Dialog */}
      {revokeTarget && (
        <div className="fixed inset-0 z-[2500] bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200 space-y-4">
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mx-auto">
              <Ban className="w-6 h-6" />
            </div>
            
            <div className="text-center">
              <h3 className="text-lg font-extrabold text-slate-900">Revoke Guide Verification?</h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Are you sure you want to <strong>REVOKE</strong> official verification for guide <strong className="text-slate-900">{revokeTarget.name}</strong> ({revokeTarget.city})?
                <br /><br />
                This action will update the database status to <span className="text-red-600 font-bold">REJECTED</span> and immediately remove verified guide status on their dashboard.
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setRevokeTarget(null)}
                className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition"
              >
                Cancel
              </button>
              <button
                disabled={actionLoading}
                onClick={executeRevoke}
                className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white text-xs font-extrabold rounded-xl shadow-lg transition flex items-center justify-center gap-1.5"
              >
                {actionLoading ? 'Revoking...' : 'Yes, Revoke Access'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
        <div>
          <span className="hero-tag">DESTINATION MANAGERS & AUTHORITIES</span>
          <h1 style={{ fontSize: '2.4rem', marginTop: '6px' }}>🏛 Admin Dashboard</h1>
          <p style={{ color: 'var(--text-muted)' }}>
            Real-time incident monitoring, local guide verification, hotspot detection, and portal oversight.
          </p>
        </div>
        <button className="btn btn-secondary" onClick={fetchAdminData}>
          <RefreshCw size={16} /> Refresh Metrics
        </button>
      </div>

      {loading && (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
          Loading admin dashboard metrics...
        </div>
      )}

      {metrics && (
        <div>
          {/* Summary KPI Cards */}
          <div className="kpi-grid">
            <div className="kpi-card" style={{ borderLeft: '4px solid var(--primary)' }}>
              <div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '700' }}>TOTAL REPORTS</div>
                <div className="kpi-value" style={{ color: 'var(--primary)' }}>{metrics.summary.total_reports}</div>
              </div>
              <div style={{ fontSize: '2.2rem' }}>📋</div>
            </div>

            <div className="kpi-card" style={{ borderLeft: '4px solid #F59E0B' }}>
              <div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '700' }}>PENDING REVIEW</div>
                <div className="kpi-value" style={{ color: '#D97706' }}>{metrics.summary.pending_reports}</div>
              </div>
              <div style={{ fontSize: '2.2rem' }}>⏳</div>
            </div>

            <div className="kpi-card" style={{ borderLeft: '4px solid #10B981' }}>
              <div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '700' }}>LOCAL GUIDES</div>
                <div className="kpi-value" style={{ color: '#059669' }}>{guides.length}</div>
              </div>
              <div style={{ fontSize: '2.2rem' }}>🧑‍🏫</div>
            </div>

            <div className="kpi-card" style={{ borderLeft: '4px solid #3B82F6' }}>
              <div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '700' }}>RESOLVED ISSUES</div>
                <div className="kpi-value" style={{ color: '#2563EB' }}>{metrics.summary.resolved_reports}</div>
              </div>
              <div style={{ fontSize: '2.2rem' }}>✅</div>
            </div>
          </div>

          {/* Admin Navigation Tabs */}
          <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', borderBottom: '2px solid #E2E8F0' }}>
            <button
              onClick={() => setActiveTab('reports')}
              style={{
                padding: '12px 20px',
                fontWeight: '700',
                fontSize: '0.95rem',
                color: activeTab === 'reports' ? 'var(--primary)' : 'var(--text-muted)',
                borderBottom: activeTab === 'reports' ? '3px solid var(--primary)' : '3px solid transparent',
                background: 'none',
                cursor: 'pointer'
              }}
            >
              📋 Incident Reports ({reports.length})
            </button>
            <button
              onClick={() => setActiveTab('guides')}
              style={{
                padding: '12px 20px',
                fontWeight: '700',
                fontSize: '0.95rem',
                color: activeTab === 'guides' ? '#D97706' : 'var(--text-muted)',
                borderBottom: activeTab === 'guides' ? '3px solid #D97706' : '3px solid transparent',
                background: 'none',
                cursor: 'pointer'
              }}
            >
              🧑‍🏫 Guide Verification & Revoke ({guides.filter(g => !g.verified).length} Pending)
            </button>
          </div>

          {/* Tab 1: Reports Management */}
          {activeTab === 'reports' && (
            <div>
              {/* Hotspots & Categories Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '36px' }}>
                {/* Hotspot Detection Card */}
                <div className="glass-card" style={{ padding: '24px' }}>
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px', color: '#92400E' }}>
                    <AlertTriangle size={20} color="#D97706" /> Repeated Report Issue Hotspots
                  </h3>

                  {metrics.hotspots && metrics.hotspots.length > 0 ? (
                    metrics.hotspots.map((h, idx) => (
                      <div key={idx} className="hotspot-card">
                        <div>
                          <strong style={{ fontSize: '1rem', color: '#78350F' }}>{h.area_name}</strong>
                          <div style={{ fontSize: '0.8rem', color: '#B45309', marginTop: '2px' }}>
                            Primary Category: <strong>{h.primary_category}</strong>
                          </div>
                        </div>
                        <span style={{ background: '#F59E0B', color: 'white', fontWeight: '800', padding: '6px 14px', borderRadius: '16px', fontSize: '0.85rem' }}>
                          {h.report_count} Reports
                        </span>
                      </div>
                    ))
                  ) : (
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No hotspots detected.</div>
                  )}
                </div>

                {/* Category Breakdown */}
                <div className="glass-card" style={{ padding: '24px' }}>
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Layers size={20} color="var(--primary)" /> Reports by Problem Category
                  </h3>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {Object.entries(metrics.categories_breakdown).map(([cat, count]) => (
                      <div key={cat} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: '#F8FAFC', borderRadius: '10px' }}>
                        <span style={{ fontWeight: '600', fontSize: '0.9rem' }}>{cat}</span>
                        <span style={{ background: 'var(--primary-light)', color: 'var(--primary)', fontWeight: '800', padding: '4px 12px', borderRadius: '12px', fontSize: '0.85rem' }}>
                          {count}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Reports Table */}
              <div className="glass-card" style={{ padding: '28px' }}>
                <h3 style={{ fontSize: '1.3rem', marginBottom: '16px' }}>📋 Incident Reports Management</h3>

                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>REPORT ID</th>
                      <th>CATEGORY</th>
                      <th>LOCATION</th>
                      <th>DESCRIPTION</th>
                      <th>CURRENT STATUS</th>
                      <th>CHANGE STATUS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reports.map((rpt) => (
                      <tr key={rpt.id}>
                        <td>
                          <strong style={{ color: 'var(--primary)' }}>#RPT{rpt.id + 1000}</strong>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{rpt.created_at}</div>
                        </td>
                        <td>
                          <span style={{ fontWeight: '600' }}>{rpt.category}</span>
                        </td>
                        <td>
                          {rpt.latitude && rpt.longitude && (parseFloat(rpt.latitude) !== 0 || parseFloat(rpt.longitude) !== 0) ? (
                            <a 
                              href={`https://www.google.com/maps?q=${rpt.latitude},${rpt.longitude}`}
                              target="_blank"
                              rel="noreferrer"
                              style={{ color: '#2563EB', fontWeight: '600', fontSize: '0.85rem' }}
                              title={`Coordinates: ${rpt.latitude}, ${rpt.longitude}`}
                            >
                              📍 {rpt.location_name || `${rpt.latitude}, ${rpt.longitude}`}
                            </a>
                          ) : (
                            <span style={{ fontWeight: '600', fontSize: '0.85rem', color: '#1E293B' }}>
                              📍 {rpt.location_name || 'Live Location'}
                            </span>
                          )}
                        </td>
                        <td style={{ maxWidth: '240px' }}>
                          {rpt.description}
                        </td>
                        <td>
                          <TrustBadge status={rpt.status === 'Resolved' ? 'VERIFIED' : 'USER-REPORTED'} />
                        </td>
                        <td>
                          <select 
                            className="status-select"
                            value={rpt.status}
                            onChange={(e) => handleStatusChange(rpt.id, e.target.value)}
                            disabled={updatingId === rpt.id}
                          >
                            <option value="Under Review">Under Review</option>
                            <option value="Verified">Verified</option>
                            <option value="Resolved">Resolved</option>
                            <option value="Rejected">Rejected</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tab 2: Guide Verification & Revoke */}
          {activeTab === 'guides' && (
            <div className="glass-card" style={{ padding: '28px' }}>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '16px' }}>🧑‍🏫 Local Guide Verification & Revoke Actions</h3>

              <table className="admin-table">
                <thead>
                  <tr>
                    <th>GUIDE NAME</th>
                    <th>CITY</th>
                    <th>SPECIALIZATION</th>
                    <th>LANGUAGES</th>
                    <th>PRICE / DAY</th>
                    <th>STATUS</th>
                    <th>ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  {guides.map((g) => (
                    <tr key={g.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#F59E0B', color: 'white', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem' }}>
                            {g.name ? g.name.charAt(0) : 'G'}
                          </div>
                          <div>
                            <strong>{g.name}</strong>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>⭐ {g.rating} / 5.0</div>
                          </div>
                        </div>
                      </td>
                      <td><strong>{g.city}</strong></td>
                      <td>{g.specialization}</td>
                      <td style={{ fontSize: '0.85rem' }}>{g.languages}</td>
                      <td><strong style={{ color: 'var(--primary)' }}>₹{g.price}</strong></td>
                      <td>
                        <span style={{
                          fontSize: '0.75rem',
                          fontWeight: '800',
                          padding: '4px 10px',
                          borderRadius: '12px',
                          background: g.verified ? '#DCFCE7' : '#FEF3C7',
                          color: g.verified ? '#15803D' : '#B45309'
                        }}>
                          {g.verified ? 'VERIFIED' : 'PENDING'}
                        </span>
                      </td>
                      <td>
                        {!g.verified ? (
                          <div style={{ display: 'flex', gap: '6px' }}>
                            <button
                              disabled={actionLoading}
                              onClick={() => handleVerifyGuide(g.id, true)}
                              style={{ background: '#10B981', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 'bold' }}
                            >
                              VERIFY
                            </button>
                            <button
                              disabled={actionLoading}
                              onClick={() => confirmRevokeGuide(g)}
                              style={{ background: '#EF4444', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 'bold' }}
                            >
                              REJECT
                            </button>
                          </div>
                        ) : (
                          <button
                            disabled={actionLoading}
                            onClick={() => confirmRevokeGuide(g)}
                            style={{ background: '#FEF2F2', color: '#DC2626', border: '1px solid #FCA5A5', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 'bold' }}
                          >
                            REVOKE
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

        </div>
      )}
    </div>
  );
}
