import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { apiService } from '../services/api';
import { StatCard } from '../components/StatCard';
import { DataTable } from '../components/DataTable';
import { Modal } from '../components/Modal';
import { Home, Wrench, CalendarCheck, CreditCard, Layers, CheckCircle, AlertCircle } from 'lucide-react';

export const StudentDashboard = () => {
  const { user } = useContext(AuthContext);
  const studentId = user?.studentId || 1;
  const [allocation, setAllocation] = useState(null);
  const [availableRooms, setAvailableRooms] = useState([]);
  const [maintenance, setMaintenance] = useState([]);
  const [payments, setPayments] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    loadData();
  }, [studentId]);

  const loadData = async () => {
    const alloc = await apiService.getStudentAllocation(studentId);
    const mData = await apiService.getMaintenanceRequests();
    const pData = await apiService.getPayments();
    const aData = await apiService.getAttendance();
    const rData = await apiService.getRooms();

    setAllocation(alloc);
    setMaintenance(mData.slice(0, 3));
    setPayments(pData.slice(0, 3));
    setAttendance(aData.slice(0, 3));
    setAvailableRooms(rData.filter(r => r.status === 'AVAILABLE' && r.currentOccupancy < r.capacity));
  };

  const handleRequestAllocation = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    if (!selectedRoom) return;

    try {
      await apiService.allocateRoom(Number(studentId), Number(selectedRoom));
      setSuccessMsg('Room allocation request successful!');
      setIsRequestModalOpen(false);
      setSelectedRoom('');
      loadData();
    } catch (err) {
      setErrorMsg(err.message || 'Failed to allocate room.');
    }
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

  const allocatedRoomLabel = allocation?.room
    ? `Room ${allocation.room.roomNumber} (${allocation.room.blockName})`
    : 'Not Allocated';

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <div>
          <h1 className="page-title">Welcome Back, {user?.fullName || 'Student'}</h1>
          <p className="page-subtitle">Student Services & Hostel Overview</p>
        </div>
        {!allocation && (
          <button onClick={() => { setErrorMsg(''); setIsRequestModalOpen(true); }} className="btn btn-primary">
            <Home size={18} /> Request Room Allocation
          </button>
        )}
      </div>

      {errorMsg && (
        <div style={{ padding: '12px 16px', background: 'rgba(239,68,68,0.15)', border: '1px solid #f87171', borderRadius: '8px', color: '#f87171', marginBottom: '20px' }}>
          {errorMsg}
        </div>
      )}

      {successMsg && (
        <div style={{ padding: '12px 16px', background: 'rgba(52,211,153,0.15)', border: '1px solid #34d399', borderRadius: '8px', color: '#34d399', marginBottom: '20px' }}>
          {successMsg}
        </div>
      )}

      <div className="stat-grid">
        <StatCard icon={<Home size={24} />} label="Allocated Room" value={allocatedRoomLabel} color="#38bdf8" />
        <StatCard icon={<CalendarCheck size={24} />} label="Monthly Attendance" value="95%" color="#34d399" />
        <StatCard icon={<Wrench size={24} />} label="Active Maintenance" value={`${maintenance.length} Request(s)`} color="#fbbf24" />
        <StatCard icon={<CreditCard size={24} />} label="Fee Status" value="Cleared" color="#818cf8" />
      </div>

      {/* Allocated Room Details Card */}
      {allocation?.room && (
        <div className="glass-card" style={{ marginBottom: '24px', borderLeft: '4px solid #38bdf8' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '12px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Home size={20} color="#38bdf8" /> Current Room Allocation Details
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
            <div>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Room Number</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f8fafc' }}>{allocation.room.roomNumber}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Hostel Block</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f8fafc' }}>{allocation.room.blockName}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Floor Level</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f8fafc' }}>Floor {allocation.room.floor !== undefined ? allocation.room.floor : 1}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Room Type</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f8fafc' }}>{allocation.room.roomType || 'STANDARD'}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Allocation Date</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#38bdf8' }}>{allocation.allocationDate}</div>
            </div>
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
        <div className="glass-card">
          <h3 style={{ fontSize: '1.1rem', marginBottom: '16px', fontWeight: 700 }}>My Maintenance Requests</h3>
          <DataTable columns={maintenanceColumns} data={maintenance} />
        </div>

        <div className="glass-card">
          <h3 style={{ fontSize: '1.1rem', marginBottom: '16px', fontWeight: 700 }}>Important Hostel Announcements</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ padding: '12px', background: 'rgba(255,255,255,0.04)', borderRadius: '8px', borderLeft: '4px solid #38bdf8' }}>
              <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Room Allocation Notice</div>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '4px' }}>Students can view and request available rooms directly from their portal.</div>
            </div>
            <div style={{ padding: '12px', background: 'rgba(255,255,255,0.04)', borderRadius: '8px', borderLeft: '4px solid #34d399' }}>
              <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Mess Fee Payment Due Date</div>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '4px' }}>Upcoming monthly mess fees due by September 1st.</div>
            </div>
          </div>
        </div>
      </div>

      {/* Request Room Modal */}
      <Modal isOpen={isRequestModalOpen} onClose={() => setIsRequestModalOpen(false)} title="Select & Request Hostel Room">
        {errorMsg && (
          <div style={{ padding: '10px', background: 'rgba(239,68,68,0.15)', border: '1px solid #f87171', borderRadius: '6px', color: '#f87171', marginBottom: '16px', fontSize: '0.85rem' }}>
            {errorMsg}
          </div>
        )}
        <form onSubmit={handleRequestAllocation}>
          <div className="form-group" style={{ marginBottom: '24px' }}>
            <label className="form-label">Available Hostel Rooms</label>
            <select
              className="form-control"
              value={selectedRoom}
              onChange={(e) => setSelectedRoom(e.target.value)}
              required
            >
              <option value="">-- Choose Available Room --</option>
              {availableRooms.map((r) => (
                <option key={r.id} value={r.id}>
                  Room {r.roomNumber} - {r.blockName} (Floor {r.floor !== undefined ? r.floor : 1}) [{r.currentOccupancy}/{r.capacity} Occupied]
                </option>
              ))}
            </select>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
            Confirm & Reserve Room
          </button>
        </form>
      </Modal>
    </div>
  );
};
