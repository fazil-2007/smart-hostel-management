import React, { useEffect, useState } from 'react';
import { apiService } from '../services/api';
import { DataTable } from '../components/DataTable';
import { Modal } from '../components/Modal';
import { UserCheck, Plus, LogOut } from 'lucide-react';

export const VisitorPage = () => {
  const [visitors, setVisitors] = useState([]);
  const [students, setStudents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [studentId, setStudentId] = useState('');
  const [visitorName, setVisitorName] = useState('');
  const [relation, setRelation] = useState('');
  const [phone, setPhone] = useState('');
  const [purpose, setPurpose] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const vData = await apiService.getVisitors();
    const sData = await apiService.getStudents();
    setVisitors(vData);
    setStudents(sData);
  };

  const handleLogVisitor = async (e) => {
    e.preventDefault();
    if (!studentId) return;

    await apiService.logVisitor(Number(studentId), visitorName, relation, phone, purpose);
    setIsModalOpen(false);
    loadData();
  };

  const handleCheckout = async (visitorId) => {
    await apiService.checkoutVisitor(visitorId);
    loadData();
  };

  const columns = [
    { header: 'Visitor Name', accessor: 'visitorName' },
    { header: 'Relation', accessor: 'relation' },
    { header: 'Phone', accessor: 'phone' },
    { header: 'Visiting Student', render: (r) => r.student?.user?.fullName || 'Alex Mercer' },
    { header: 'Purpose', accessor: 'purpose' },
    { header: 'Entry Time', render: (r) => r.entryTime ? new Date(r.entryTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-' },
    {
      header: 'Status',
      render: (r) => (
        <span className={`badge ${r.status === 'CHECKED_IN' ? 'badge-success' : 'badge-secondary'}`}>
          {r.status}
        </span>
      )
    },
    {
      header: 'Action',
      render: (r) => r.status === 'CHECKED_IN' ? (
        <button onClick={() => handleCheckout(r.id)} className="btn btn-secondary btn-sm" style={{ color: '#fbbf24' }}>
          Check Out
        </button>
      ) : (
        <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>Checked Out</span>
      )
    }
  ];

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <div>
          <h1 className="page-title">Visitor Management Log</h1>
          <p className="page-subtitle">Track entry & exit timings of campus visitors</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="btn btn-primary">
          <Plus size={18} /> Log Visitor Entry
        </button>
      </div>

      <div className="glass-card">
        <DataTable columns={columns} data={visitors} />
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Register Visitor Entry">
        <form onSubmit={handleLogVisitor}>
          <div className="form-group">
            <label className="form-label">Hosteller / Student Being Visited</label>
            <select className="form-control" value={studentId} onChange={(e) => setStudentId(e.target.value)} required>
              <option value="">-- Select Student --</option>
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.user?.fullName} ({s.rollNumber})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Visitor Full Name</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. David Mercer"
              value={visitorName}
              onChange={(e) => setVisitorName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Relation to Student</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Father, Mother, Relative"
              value={relation}
              onChange={(e) => setRelation(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Visitor Contact Phone</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. +1999888777"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>

          <div className="form-group" style={{ marginBottom: '24px' }}>
            <label className="form-label">Purpose of Visit</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Bringing textbooks, Family visit"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
            Log Visitor Check-In
          </button>
        </form>
      </Modal>
    </div>
  );
};
