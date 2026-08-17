import React, { useEffect, useState } from 'react';
import { apiService } from '../services/api';
import { DataTable } from '../components/DataTable';
import { Modal } from '../components/Modal';
import { Plus, CheckCircle, XCircle } from 'lucide-react';

export const RoomAllocationPage = () => {
  const [allocations, setAllocations] = useState([]);
  const [students, setStudents] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedRoom, setSelectedRoom] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const aData = await apiService.getAllocations();
    const sData = await apiService.getStudents();
    const rData = await apiService.getRooms();
    setAllocations(aData);
    setStudents(sData);
    setRooms(rData.filter(r => r.status === 'AVAILABLE'));
  };

  const handleAllocate = async (e) => {
    e.preventDefault();
    if (!selectedStudent || !selectedRoom) return;

    await apiService.allocateRoom(Number(selectedStudent), Number(selectedRoom));
    setIsModalOpen(false);
    loadData();
  };

  const handleVacate = async (allocationId) => {
    await apiService.vacateRoom(allocationId);
    loadData();
  };

  const columns = [
    { header: 'Student Name', render: (r) => r.student?.user?.fullName || 'Alex Mercer' },
    { header: 'Roll No', render: (r) => r.student?.rollNumber || 'CS2024001' },
    { header: 'Room No', render: (r) => r.room?.roomNumber || 'A-101' },
    { header: 'Block', render: (r) => r.room?.blockName || 'Block A' },
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

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <div>
          <h1 className="page-title">Room Allocation Management</h1>
          <p className="page-subtitle">Assign rooms to registered university students</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="btn btn-primary">
          <Plus size={18} /> Allocate New Room
        </button>
      </div>

      <div className="glass-card">
        <DataTable columns={columns} data={allocations} />
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Allocate Room to Student">
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
                  {s.user?.fullName} ({s.rollNumber})
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
                  Room {r.roomNumber} - {r.blockName} ({r.currentOccupancy}/{r.capacity})
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
