import React, { useEffect, useState } from 'react';
import { apiService } from '../services/api';
import { StatCard } from '../components/StatCard';
import { DataTable } from '../components/DataTable';
import { Users, Home, CheckCircle2, AlertCircle } from 'lucide-react';

export const OccupancyPage = () => {
  const [metrics, setMetrics] = useState(null);
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const mData = await apiService.getOccupancyMetrics();
    const rData = await apiService.getRooms();
    setMetrics(mData);
    setRooms(rData);
  };

  const columns = [
    { header: 'Room No', accessor: 'roomNumber' },
    { header: 'Block', accessor: 'blockName' },
    { header: 'Type', accessor: 'roomType' },
    { header: 'Capacity', accessor: 'capacity' },
    { header: 'Occupants', accessor: 'currentOccupancy' },
    {
      header: 'Occupancy Rate',
      render: (r) => {
        const rate = Math.round((r.currentOccupancy / r.capacity) * 100);
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ flex: 1, background: 'rgba(255,255,255,0.1)', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{
                width: `${rate}%`,
                height: '100%',
                background: rate === 100 ? '#fbbf24' : rate > 0 ? '#38bdf8' : '#34d399'
              }} />
            </div>
            <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{rate}%</span>
          </div>
        );
      }
    },
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
          <h1 className="page-title">Occupancy Tracking & Analytics</h1>
          <p className="page-subtitle">Real-time room occupancy and capacity utilization</p>
        </div>
      </div>

      <div className="stat-grid">
        <StatCard icon={<Home size={24} />} label="Total Hostel Capacity" value={metrics?.totalCapacity || 120} color="#38bdf8" />
        <StatCard icon={<Users size={24} />} label="Current Occupancy" value={metrics?.totalOccupancy || 84} color="#818cf8" />
        <StatCard icon={<CheckCircle2 size={24} />} label="Available Vacancies" value={metrics?.availableSpots || 36} color="#34d399" />
        <StatCard icon={<AlertCircle size={24} />} label="Occupancy Rate" value={`${metrics?.occupancyPercentage || 70.0}%`} color="#fbbf24" />
      </div>

      <div className="glass-card">
        <h3 style={{ fontSize: '1.1rem', marginBottom: '16px', fontWeight: 700 }}>Hostel Block Breakdown</h3>
        <DataTable columns={columns} data={rooms} />
      </div>
    </div>
  );
};
