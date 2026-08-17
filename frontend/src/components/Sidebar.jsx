import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import {
  LayoutDashboard,
  Home,
  Users,
  CalendarCheck,
  Wrench,
  UserCheck,
  CreditCard,
  BarChart3
} from 'lucide-react';

export const Sidebar = () => {
  const { user } = useContext(AuthContext);
  const role = user?.role || 'STUDENT';

  const navItems = [
    {
      label: 'Dashboard',
      path: role === 'ADMIN' ? '/admin-dashboard' : role === 'WARDEN' ? '/warden-dashboard' : '/student-dashboard',
      icon: <LayoutDashboard size={18} />
    },
    { label: 'Room Allocation', path: '/rooms/allocation', icon: <Home size={18} /> },
    { label: 'Occupancy Tracker', path: '/rooms/occupancy', icon: <Users size={18} /> },
    { label: 'Attendance', path: '/attendance', icon: <CalendarCheck size={18} /> },
    { label: 'Maintenance', path: '/maintenance', icon: <Wrench size={18} /> },
    { label: 'Visitor Log', path: '/visitors', icon: <UserCheck size={18} /> },
    { label: 'Fee Payments', path: '/payments', icon: <CreditCard size={18} /> },
    { label: 'Reports', path: '/reports', icon: <BarChart3 size={18} /> },
  ];

  return (
    <aside style={{
      width: '240px',
      background: 'rgba(15, 23, 42, 0.95)',
      borderRight: '1px solid rgba(255, 255, 255, 0.1)',
      padding: '24px 16px',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px'
    }}>
      <div style={{ padding: '0 12px 16px', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        Main Menu
      </div>
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          style={({ isActive }) => ({
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '10px 14px',
            borderRadius: '8px',
            fontSize: '0.9rem',
            fontWeight: 600,
            color: isActive ? '#38bdf8' : '#94a3b8',
            background: isActive ? 'rgba(56, 189, 248, 0.12)' : 'transparent',
            border: isActive ? '1px solid rgba(56, 189, 248, 0.3)' : '1px solid transparent',
            transition: 'all 0.2s ease'
          })}
        >
          {item.icon}
          {item.label}
        </NavLink>
      ))}
    </aside>
  );
};
