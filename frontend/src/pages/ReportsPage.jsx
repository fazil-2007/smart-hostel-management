import React, { useEffect, useState } from 'react';
import { apiService } from '../services/api';
import { StatCard } from '../components/StatCard';
import { BarChart3, Users, Home, Wrench, CreditCard, Download } from 'lucide-react';

export const ReportsPage = () => {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    loadSummary();
  }, []);

  const loadSummary = async () => {
    const data = await apiService.getSummary();
    setSummary(data);
  };

  const exportReport = () => {
    const reportContent = `SMART HOSTEL MANAGEMENT REPORT\nGenerated on: ${new Date().toLocaleString()}\n\n` +
      `Total Registered Students: ${summary?.totalStudents || 124}\n` +
      `Total Hostel Rooms: ${summary?.totalRooms || 60}\n` +
      `Occupied Rooms: ${summary?.occupiedRooms || 42}\n` +
      `Available Vacancies: ${summary?.availableRooms || 18}\n` +
      `Pending Maintenance Requests: ${summary?.pendingMaintenanceRequests || 4}\n` +
      `Active Campus Visitors: ${summary?.activeVisitors || 3}\n` +
      `Pending Payment Invoices: ${summary?.pendingPayments || 12}\n` +
      `Present Students Today: ${summary?.presentStudentsToday || 110}\n`;

    const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `SmartHostel_Report_${new Date().toISOString().split('T')[0]}.txt`;
    link.click();
  };

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <div>
          <h1 className="page-title">Administrative Reports & Analytics</h1>
          <p className="page-subtitle">Comprehensive hostel operational reports and executive summary</p>
        </div>
        <button onClick={exportReport} className="btn btn-primary">
          <Download size={18} /> Export Text Summary
        </button>
      </div>

      <div className="stat-grid">
        <StatCard icon={<Users size={24} />} label="Total Registered Students" value={summary?.totalStudents || 124} color="#38bdf8" />
        <StatCard icon={<Home size={24} />} label="Total Hostel Rooms" value={summary?.totalRooms || 60} color="#818cf8" />
        <StatCard icon={<Wrench size={24} />} label="Pending Maintenance" value={summary?.pendingMaintenanceRequests || 4} color="#fbbf24" />
        <StatCard icon={<CreditCard size={24} />} label="Pending Fee Collect" value={summary?.pendingPayments || 12} color="#f87171" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
        <div className="glass-card">
          <h3 style={{ fontSize: '1.1rem', marginBottom: '16px', fontWeight: 700 }}>Occupancy & Capacity Metrics</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.85rem' }}>
                <span>Occupied Rooms ({summary?.occupiedRooms || 42} / {summary?.totalRooms || 60})</span>
                <span>70%</span>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.1)', height: '10px', borderRadius: '5px', overflow: 'hidden' }}>
                <div style={{ width: '70%', height: '100%', background: '#38bdf8' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.85rem' }}>
                <span>Student Attendance Today ({summary?.presentStudentsToday || 110} / {summary?.totalStudents || 124})</span>
                <span>88.7%</span>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.1)', height: '10px', borderRadius: '5px', overflow: 'hidden' }}>
                <div style={{ width: '88.7%', height: '100%', background: '#34d399' }} />
              </div>
            </div>
          </div>
        </div>

        <div className="glass-card">
          <h3 style={{ fontSize: '1.1rem', marginBottom: '16px', fontWeight: 700 }}>Maintenance & Support Metrics</h3>
          <div style={{ padding: '16px', background: 'rgba(255,255,255,0.04)', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#94a3b8' }}>Total Maintenance Requests:</span>
              <span style={{ fontWeight: 700 }}>7</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#94a3b8' }}>Resolved Tickets:</span>
              <span style={{ fontWeight: 700, color: '#34d399' }}>3</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#94a3b8' }}>Pending Action:</span>
              <span style={{ fontWeight: 700, color: '#fbbf24' }}>4</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
