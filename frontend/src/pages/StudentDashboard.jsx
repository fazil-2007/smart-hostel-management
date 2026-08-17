import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { apiService } from '../services/api';
import { StatCard } from '../components/StatCard';
import { DataTable } from '../components/DataTable';
import { Home, Wrench, CalendarCheck, CreditCard, Bell } from 'lucide-react';

export const StudentDashboard = () => {
  const { user } = useContext(AuthContext);
  const [maintenance, setMaintenance] = useState([]);
  const [payments, setPayments] = useState([]);
  const [attendance, setAttendance] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const mData = await apiService.getMaintenanceRequests();
    const pData = await apiService.getPayments();
    const aData = await apiService.getAttendance();
    setMaintenance(mData.slice(0, 3));
    setPayments(pData.slice(0, 3));
    setAttendance(aData.slice(0, 3));
  };

  const maintenanceColumns = [
    { header: 'Category', accessor: 'category' },
    { header: 'Description', accessor: 'description' },
    {
      header: 'Priority',
      render: (r) => (
        <span className={`badge ${r.priority === 'HIGH' ? 'badge-danger' : 'badge-warning'}`}>
          {r.priority}
        </span>
      )
    },
    {
      header: 'Status',
      render: (r) => (
        <span className={`badge ${r.status === 'RESOLVED' ? 'badge-success' : 'badge-info'}`}>
          {r.status}
        </span>
      )
    }
  ];

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <div>
          <h1 className="page-title">Welcome Back, {user?.fullName || 'Student'}</h1>
          <p className="page-subtitle">Student Services & Hostel Overview</p>
        </div>
      </div>

      <div className="stat-grid">
        <StatCard icon={<Home size={24} />} label="Allocated Room" value="A-101 (Block A)" color="#38bdf8" />
        <StatCard icon={<CalendarCheck size={24} />} label="Monthly Attendance" value="95%" color="#34d399" />
        <StatCard icon={<Wrench size={24} />} label="Active Maintenance" value="1 Request" color="#fbbf24" />
        <StatCard icon={<CreditCard size={24} />} label="Fee Status" value="Cleared" color="#818cf8" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
        <div className="glass-card">
          <h3 style={{ fontSize: '1.1rem', marginBottom: '16px', fontWeight: 700 }}>My Maintenance Requests</h3>
          <DataTable columns={maintenanceColumns} data={maintenance} />
        </div>

        <div className="glass-card">
          <h3 style={{ fontSize: '1.1rem', marginBottom: '16px', fontWeight: 700 }}>Important Hostel Announcements</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ padding: '12px', background: 'rgba(255,255,255,0.04)', borderRadius: '8px', borderLeft: '4px solid #38bdf8' }}>
              <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Hostel Outing Night Pass Rule</div>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '4px' }}>All students must register visitors or curfew pass before 9:00 PM.</div>
            </div>
            <div style={{ padding: '12px', background: 'rgba(255,255,255,0.04)', borderRadius: '8px', borderLeft: '4px solid #34d399' }}>
              <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Mess Fee Payment Due Date</div>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '4px' }}>Upcoming monthly mess fees due by September 1st.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
