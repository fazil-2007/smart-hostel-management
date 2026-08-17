import React, { useEffect, useState } from 'react';
import { apiService } from '../services/api';
import { DataTable } from '../components/DataTable';
import { Modal } from '../components/Modal';
import { Plus, Home, Layers, AlertTriangle, CheckCircle } from 'lucide-react';

export const RoomAllocationPage = () => {
  const [allocations, setAllocations] = useState([]);
  const [students, setStudents] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [allRooms, setAllRooms] = useState([]);
  const [activeTab, setActiveTab] = useState('allocations'); // 'allocations' | 'available'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedRoom, setSelectedRoom] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const aData = await apiService.getAllocations();
    const sData = await apiService.getStudents();
    const rData = await apiService.getRooms();
    setAllocations(aData);
    setStudents(sData);
    setAllRooms(rData);
    setRooms(rData.filter(r => r.status === 'AVAILABLE' && r.currentOccupancy < r.capacity));
  };

  const handleAllocate = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    if (!selectedStudent || !selectedRoom) return;

    try {
      await apiService.allocateRoom(Number(selectedStudent), Number(selectedRoom));
      setSuccessMessage('Room allocated successfully!');
      setIsModalOpen(false);
      setSelectedStudent('');
      setSelectedRoom('');
      loadData();
    } catch (err) {
      setErrorMessage(err.message || 'Failed to allocate room.');
    }
  };

  const handleVacate = async (allocationId) => {
    try {
      await apiService.vacateRoom(allocationId);
      setSuccessMessage('Room vacated successfully!');
      loadData();
    } catch (err) {
      setErrorMessage(err.message || 'Failed to vacate room.');
    }
  };

  const allocationColumns = [
    { header: 'Student Name', render: (r) => r.student?.user?.fullName || 'Alex Mercer' },
    { header: 'Roll No', render: (r) => r.student?.rollNumber || 'CS2024001' },
    { header: 'Room No', render: (r) => r.room?.roomNumber || 'A-101' },
    { header: 'Block', render: (r) => r.room?.blockName || 'Block A' },
    { header: 'Floor', render: (r) => `Floor ${r.room?.floor !== undefined ? r.room?.floor : 1}` },
    { header: 'Allocation Date', accessor: 'allocationDate' },
    {
      header: 'Status',
      render: (r) => (
        <span className={`badge ${r.status === 'ACTIVE' ? 'badge-success' : 'badge-danger'}`}>
          {r.status}
        </span>
      )
    },
    {
      header: 'Action',
      render: (r) => r.status === 'ACTIVE' ? (
        <button onClick={() => handleVacate(r.id)} className="btn btn-secondary btn-sm" style={{ color: '#f87171' }}>
          Vacate Room
        </button>
      ) : (
        <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>Vacated</span>
      )
    }
  ];

  const availableRoomColumns = [
    { header: 'Room No', accessor: 'roomNumber' },
    { header: 'Hostel / Block', accessor: 'blockName' },
    { header: 'Floor', render: (r) => `Floor ${r.floor !== undefined ? r.floor : 1}` },
    { header: 'Type', accessor: 'roomType' },
    { header: 'Capacity', accessor: 'capacity' },
    { header: 'Current Occupancy', render: (r) => `${r.currentOccupancy} / ${r.capacity}` },
    {
      header: 'Status',
      render: (r) => (
        <span className={`badge ${r.status === 'AVAILABLE' ? 'badge-success' : r.status === 'FULL' ? 'badge-warning' : 'badge-danger'}`}>
          {r.status}
        </span>
      )
    },
    {
      header: 'Action',
      render: (r) => (r.status === 'AVAILABLE' && r.currentOccupancy < r.capacity) ? (
        <button
          onClick={() => {
            setSelectedRoom(r.id);
            setIsModalOpen(true);
          }}
          className="btn btn-primary btn-sm"
        >
          Assign Student
        </button>
      ) : (
        <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>Unavailable</span>
      )
    }
  ];

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <div>
          <h1 className="page-title">Room Allocation Management</h1>
          <p className="page-subtitle">View hostel rooms, assign available spots, and manage student allocations</p>
        </div>
        <button onClick={() => { setErrorMessage(''); setIsModalOpen(true); }} className="btn btn-primary">
          <Plus size={18} /> Allocate New Room
        </button>
      </div>

      {errorMessage && (
        <div style={{
          padding: '12px 16px',
          background: 'rgba(239, 68, 68, 0.15)',
          border: '1px solid rgba(239, 68, 68, 0.4)',
          borderRadius: '8px',
          color: '#f87171',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <AlertTriangle size={20} />
          <span>{errorMessage}</span>
        </div>
      )}

      {successMessage && (
        <div style={{
          padding: '12px 16px',
          background: 'rgba(52, 211, 153, 0.15)',
          border: '1px solid rgba(52, 211, 153, 0.4)',
          borderRadius: '8px',
          color: '#34d399',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <CheckCircle size={20} />
          <span>{successMessage}</span>
        </div>
      )}

      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
        <button
          onClick={() => setActiveTab('allocations')}
          className={`btn ${activeTab === 'allocations' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <Home size={16} /> Room Allocations ({allocations.length})
        </button>
        <button
          onClick={() => setActiveTab('available')}
          className={`btn ${activeTab === 'available' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <Layers size={16} /> Available Rooms ({rooms.length})
        </button>
      </div>

      <div className="glass-card">
        {activeTab === 'allocations' ? (
          <DataTable columns={allocationColumns} data={allocations} />
        ) : (
          <DataTable columns={availableRoomColumns} data={rooms} />
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Allocate Room to Student">
        {errorMessage && (
          <div style={{ padding: '10px', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid #f87171', borderRadius: '6px', color: '#f87171', marginBottom: '16px', fontSize: '0.85rem' }}>
            {errorMessage}
          </div>
        )}
        <form onSubmit={handleAllocate}>
          <div className="form-group">
            <label className="form-label">Select Student</label>
            <select
              className="form-control"
              value={selectedStudent}
              onChange={(e) => setSelectedStudent(e.target.value)}
              required
            >
              <option value="">-- Choose Student --</option>
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.user?.fullName || s.rollNumber} ({s.rollNumber})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group" style={{ marginBottom: '24px' }}>
            <label className="form-label">Select Available Room</label>
            <select
              className="form-control"
              value={selectedRoom}
              onChange={(e) => setSelectedRoom(e.target.value)}
              required
            >
              <option value="">-- Choose Room --</option>
              {rooms.map((r) => (
                <option key={r.id} value={r.id}>
                  Room {r.roomNumber} - {r.blockName} (Floor {r.floor !== undefined ? r.floor : 1}) [{r.currentOccupancy}/{r.capacity}]
                </option>
              ))}
            </select>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
            Confirm Allocation
          </button>
        </form>
      </Modal>
    </div>
  );
};
