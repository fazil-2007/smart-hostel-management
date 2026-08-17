import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { apiService } from '../services/api';
import { DataTable } from '../components/DataTable';
import { Modal } from '../components/Modal';
import { Wrench, Plus } from 'lucide-react';

export const MaintenancePage = () => {
  const { user } = useContext(AuthContext);
  const [requests, setRequests] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [category, setCategory] = useState('PLUMBING');
  const [roomId, setRoomId] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('MEDIUM');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const mData = await apiService.getMaintenanceRequests();
    const rData = await apiService.getRooms();
    setRequests(mData);
    setRooms(rData);
  };

  const handleCreateRequest = async (e) => {
    e.preventDefault();
    const studentId = user?.studentId || 1;
    const room = roomId || 1;
    await apiService.createMaintenanceRequest(studentId, Number(room), category, description, priority);
    setIsModalOpen(false);
    loadData();
  };

  const handleStatusChange = async (requestId, newStatus) => {
    await apiService.updateMaintenanceStatus(requestId, newStatus);
    loadData();
  };

  const columns = [
    { header: 'ID', accessor: 'id' },
    { header: 'Student', render: (r) => r.student?.user?.fullName || 'Alex Mercer' },
    { header: 'Room', render: (r) => r.room?.roomNumber || 'A-101' },
    { header: 'Category', accessor: 'category' },
    { header: 'Description', accessor: 'description' },
    {
      header: 'Priority',
      render: (r) => (
        <span className={`badge ${r.priority === 'HIGH' ? 'badge-danger' : r.priority === 'MEDIUM' ? 'badge-warning' : 'badge-info'}`}>
          {r.priority}
        </span>
      )
    },
    {
      header: 'Status',
      render: (r) => (
        <span className={`badge ${r.status === 'RESOLVED' ? 'badge-success' : r.status === 'IN_PROGRESS' ? 'badge-info' : 'badge-warning'}`}>
          {r.status}
        </span>
      )
    },
    {
      header: 'Actions',
      render: (r) => (
        <div style={{ display: 'flex', gap: '6px' }}>
          {r.status !== 'RESOLVED' && (
            <button onClick={() => handleStatusChange(r.id, 'RESOLVED')} className="btn btn-secondary btn-sm" style={{ color: '#34d399' }}>
              Resolve
            </button>
          )}
          {r.status === 'PENDING' && (
            <button onClick={() => handleStatusChange(r.id, 'IN_PROGRESS')} className="btn btn-secondary btn-sm" style={{ color: '#38bdf8' }}>
              In Progress
            </button>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <div>
          <h1 className="page-title">Maintenance Requests</h1>
          <p className="page-subtitle">Report & resolve hostel facility and room repair issues</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="btn btn-primary">
          <Plus size={18} /> Raise Maintenance Request
        </button>
      </div>

      <div className="glass-card">
        <DataTable columns={columns} data={requests} />
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Submit Maintenance Ticket">
        <form onSubmit={handleCreateRequest}>
          <div className="form-group">
            <label className="form-label">Category</label>
            <select className="form-control" value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="PLUMBING">PLUMBING</option>
              <option value="ELECTRICAL">ELECTRICAL</option>
              <option value="FURNITURE">FURNITURE</option>
              <option value="CLEANING">CLEANING</option>
              <option value="OTHER">OTHER</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Room</label>
            <select className="form-control" value={roomId} onChange={(e) => setRoomId(e.target.value)} required>
              <option value="">-- Select Room --</option>
              {rooms.map((r) => (
                <option key={r.id} value={r.id}>
                  Room {r.roomNumber} ({r.blockName})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Priority Level</label>
            <select className="form-control" value={priority} onChange={(e) => setPriority(e.target.value)}>
              <option value="LOW">LOW</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="HIGH">HIGH</option>
            </select>
          </div>

          <div className="form-group" style={{ marginBottom: '24px' }}>
            <label className="form-label">Description</label>
            <textarea
              className="form-control"
              rows={3}
              placeholder="Describe the issue in detail..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
            Submit Request
          </button>
        </form>
      </Modal>
    </div>
  );
};
