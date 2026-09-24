import React from 'react';

const TrustBadge = ({ status = 'VERIFIED' }) => {
  const normStatus = status.toUpperCase();
  let badgeClass = 'verified';
  let label = 'VERIFIED';
  let icon = '🟢';

  if (normStatus === 'USER-REPORTED') {
    badgeClass = 'user-reported';
    label = 'USER-REPORTED';
    icon = '🔵';
  } else if (normStatus === 'ESTIMATED') {
    badgeClass = 'estimated';
    label = 'ESTIMATED';
    icon = '🟡';
  }

  return (
    <span className={`trust-badge ${badgeClass}`}>
      <span>{icon}</span> {label}
    </span>
  );
};

export default TrustBadge;
