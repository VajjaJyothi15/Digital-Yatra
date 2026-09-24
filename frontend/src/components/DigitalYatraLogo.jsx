import React from 'react';

const DigitalYatraLogo = ({ size = 'medium', light = false }) => {
  const isSmall = size === 'small';
  const isLarge = size === 'large';

  const iconSize = isSmall ? '32px' : isLarge ? '56px' : '42px';
  const fontSize = isSmall ? '1.1rem' : isLarge ? '2.2rem' : '1.4rem';

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: isSmall ? '8px' : '12px' }}>
      <div 
        style={{
          width: iconSize,
          height: iconSize,
          borderRadius: '12px',
          background: 'linear-gradient(135deg, #0F766E 0%, #0D9488 50%, #F59E0B 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: isSmall ? '1.1rem' : isLarge ? '1.8rem' : '1.3rem',
          boxShadow: '0 4px 14px rgba(15, 118, 110, 0.4)',
          border: '1.5px solid rgba(255,255,255,0.4)',
          flexShrink: 0
        }}
      >
        🧭
      </div>
      <div>
        <div style={{ fontSize: fontSize, fontWeight: '800', letterSpacing: '-0.5px', color: light ? 'white' : 'var(--text-main)', lineHeight: '1.1' }}>
          Digital Yatra
        </div>
        <div style={{ fontSize: isSmall ? '0.6rem' : '0.7rem', color: '#2DD4BF', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>
          Explore India • Digital Travel
        </div>
      </div>
    </div>
  );
};

export default DigitalYatraLogo;
