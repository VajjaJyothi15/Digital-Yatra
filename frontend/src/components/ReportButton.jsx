import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText } from 'lucide-react';

const ReportButton = ({ isFloating = true }) => {
  const navigate = useNavigate();

  if (!isFloating) {
    return (
      <button 
        className="btn btn-secondary" 
        onClick={() => navigate('/report')}
        style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
      >
        <FileText size={16} /> Report Issue
      </button>
    );
  }

  return (
    <div 
      onClick={() => navigate('/report')}
      style={{
        position: 'fixed',
        bottom: '28px',
        right: '28px',
        background: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)',
        color: 'white',
        borderRadius: '50px',
        padding: '14px 22px',
        fontWeight: '700',
        fontSize: '0.95rem',
        boxShadow: '0 10px 25px rgba(29, 78, 216, 0.4)',
        cursor: 'pointer',
        zIndex: 1500,
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        transition: 'all 0.3s ease',
        border: '2px solid rgba(255,255,255,0.3)'
      }}
      onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
      onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
    >
      <FileText size={20} />
      <span>REPORT ISSUE</span>
    </div>
  );
};

export default ReportButton;
