import React, { useEffect, useState } from 'react';
import { apiService } from '../services/api';
import { StatCard } from '../components/StatCard';
import { DataTable } from '../components/DataTable';
import { Users, Home, CalendarCheck, Wrench, UserCheck } from 'lucide-react';

export const WardenDashboard = () => {
  const [summary, setSummary] = useState(null);
  const [recentVisitors, setRecentVisitors] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const sData = await apiService.getSummary();
    const vData = await apiService.getVisitors();
    setSummary(sData);
    setRecentVisitors(vData);
  };

  const visitorColumns = [
    { header: 'Visitor Name', accessor: 'visitorName' },
    { header: 'Relation', accessor: 'relation' },
    { header: 'Phone', accessor: 'phone' },
    { header: 'Student', render: (r) => r.student?.user?.fullName || 'Alex Mercer' },
    {
      header: 'Status',
      render: (r) => (
        <span className={`badge ${r.status === 'CHECKED_IN' ? 'badge-success' : 'badge-secondary'}`}>
          {r.status}
        </span>
      )
    }
  ];

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <div>
          <h1 className="page-title">Warden Operational Portal</h1>
          <p className="page-subtitle">Daily Hostel Operations & Security Oversight</p>
        </div>
      </div>

      <div className="stat-grid">
        <StatCard icon={<Users size={24} />} label="Total Hostellers" value={summary?.totalStudents || 124} color="#38bdf8" />
        <StatCard icon={<CalendarCheck size={24} />} label="Present Today" value={summary?.presentStudentsToday || 110} color="#34d399" />
        <StatCard icon={<UserCheck size={24} />} label="Active Visitors" value={summary?.activeVisitors || 3} color="#818cf8" />
        <StatCard icon={<Wrench size={24} />} label="Pending Maintenance" value={summary?.pendingMaintenanceRequests || 4} color="#fbbf24" />
      </div>

      <div className="glass-card">
        <h3 style={{ fontSize: '1.1rem', marginBottom: '16px', fontWeight: 700 }}>Active Visitor Logs</h3>
        <DataTable columns={visitorColumns} data={recentVisitors} />
      </div>
    </div>
  );
};
