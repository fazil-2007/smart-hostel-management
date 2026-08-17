import React from 'react';

export const StatCard = ({ icon, label, value, color = '#38bdf8' }) => {
  return (
    <div className="glass-card stat-card">
      <div className="stat-icon-wrapper" style={{ color: color, background: `${color}18` }}>
        {icon}
      </div>
      <div>
        <div className="stat-value">{value}</div>
        <div className="stat-label">{label}</div>
      </div>
    </div>
  );
};
