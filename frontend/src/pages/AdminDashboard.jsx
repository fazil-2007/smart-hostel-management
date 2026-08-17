import React, { useEffect, useState } from 'react';
import { apiService } from '../services/api';
import { StatCard } from '../components/StatCard';
import { DataTable } from '../components/DataTable';
import { Users, Home, CreditCard, Wrench, BarChart3 } from 'lucide-react';

export const AdminDashboard = () => {
  const [summary, setSummary] = useState(null);
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const sData = await apiService.getSummary();
    const rData = await apiService.getRooms();
    setSummary(sData);
    setRooms(rData);
  };

  const roomColumns = [
    { header: 'Room No', accessor: 'roomNumber' },
    { header: 'Block', accessor: 'blockName' },
    { header: 'Type', accessor: 'roomType' },
    { header: 'Capacity', accessor: 'capacity' },
    { header: 'Occupancy', accessor: 'currentOccupancy' },
    {
      header: 'Status',
      render: (r) => (
        <span className={`badge ${r.status === 'AVAILABLE' ? 'badge-success' : r.status === 'FULL' ? 'badge-warning' : 'badge-danger'}`}>
          {r.status}
        </span>
      )
    }
  ];

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <div>
          <h1 className="page-title">Administrator Management Suite</h1>
          <p className="page-subtitle">Master Hostel Controls & System Metrics</p>
        </div>
      </div>

      <div className="stat-grid">
        <StatCard icon={<Users size={24} />} label="Total Registered Students" value={summary?.totalStudents || 124} color="#38bdf8" />
        <StatCard icon={<Home size={24} />} label="Total Hostel Rooms" value={summary?.totalRooms || 60} color="#818cf8" />
        <StatCard icon={<BarChart3 size={24} />} label="Available Rooms" value={summary?.availableRooms || 18} color="#34d399" />
        <StatCard icon={<CreditCard size={24} />} label="Pending Fee Collect" value={summary?.pendingPayments || 12} color="#f87171" />
      </div>

      <div className="glass-card">
        <h3 style={{ fontSize: '1.1rem', marginBottom: '16px', fontWeight: 700 }}>Hostel Room Inventory Overview</h3>
        <DataTable columns={roomColumns} data={rooms} />
      </div>
    </div>
  );
};
