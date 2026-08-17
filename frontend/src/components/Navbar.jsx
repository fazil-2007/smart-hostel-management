import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { LogOut, User, Shield, Bell } from 'lucide-react';

export const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <header style={{
      height: '64px',
      background: 'rgba(30, 41, 59, 0.8)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 28px',
      position: 'sticky',
      top: 0,
      zIndex: 50
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{
          width: '36px',
          height: '36px',
          borderRadius: '8px',
          background: 'linear-gradient(135deg, #38bdf8, #818cf8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 800,
          color: '#0f172a'
        }}>
          SH
        </div>
        <div>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>Smart Hostel Platform</h2>
          <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>University Management Portal</span>
        </div>
      </div>

      {user && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            background: 'rgba(255,255,255,0.05)',
            padding: '6px 14px',
            borderRadius: '20px',
            border: '1px solid rgba(255,255,255,0.1)'
          }}>
            <Shield size={16} color="#38bdf8" />
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{user.fullName || user.username}</span>
            <span className="badge badge-info">{user.role}</span>
          </div>

          <button onClick={logout} className="btn btn-secondary btn-sm">
            <LogOut size={16} /> Logout
          </button>
        </div>
      )}
    </header>
  );
};
