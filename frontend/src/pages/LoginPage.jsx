import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { apiService } from '../services/api';
import { Shield, Key, User } from 'lucide-react';

export const LoginPage = () => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = await apiService.login(username, password);
      login(data, data.token);

      if (data.role === 'ADMIN') {
        navigate('/admin-dashboard');
      } else if (data.role === 'WARDEN') {
        navigate('/warden-dashboard');
      } else {
        navigate('/student-dashboard');
      }
    } catch (err) {
      setError('Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  const setDemoRole = (roleName) => {
    if (roleName === 'ADMIN') {
      setUsername('admin');
      setPassword('admin123');
    } else if (roleName === 'WARDEN') {
      setUsername('warden1');
      setPassword('warden123');
    } else {
      setUsername('student1');
      setPassword('student123');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'radial-gradient(circle at top right, #1e293b, #0f172a)',
      padding: '20px'
    }}>
      <div className="glass-card" style={{ width: '100%', maxWidth: '420px', padding: '36px' }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #38bdf8, #818cf8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            color: '#0f172a',
            fontWeight: 800,
            fontSize: '1.4rem'
          }}>
            <Shield size={28} />
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 700 }}>Smart Hostel Login</h2>
          <p style={{ color: '#94a3b8', fontSize: '0.88rem', marginTop: '6px' }}>University Student Services & Hostel Portal</p>
        </div>

        {error && (
          <div style={{
            background: 'rgba(248, 113, 113, 0.15)',
            border: '1px solid rgba(248, 113, 113, 0.3)',
            color: '#f87171',
            padding: '10px 14px',
            borderRadius: '8px',
            fontSize: '0.85rem',
            marginBottom: '20px'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label">Username</label>
            <input
              type="text"
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              required
            />
          </div>

          <div className="form-group" style={{ marginBottom: '24px' }}>
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px' }} disabled={loading}>
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div style={{ marginTop: '28px', paddingTop: '20px', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <div style={{ fontSize: '0.75rem', color: '#64748b', textAlign: 'center', marginBottom: '12px', fontWeight: 600 }}>
            QUICK ASSESSMENT DEMO LOGIN
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="btn btn-secondary btn-sm" style={{ flex: 1 }} onClick={() => setDemoRole('STUDENT')}>Student</button>
            <button className="btn btn-secondary btn-sm" style={{ flex: 1 }} onClick={() => setDemoRole('WARDEN')}>Warden</button>
            <button className="btn btn-secondary btn-sm" style={{ flex: 1 }} onClick={() => setDemoRole('ADMIN')}>Admin</button>
          </div>
        </div>
      </div>
    </div>
  );
};
