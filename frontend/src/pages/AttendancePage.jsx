import React, { useEffect, useState } from 'react';
import { apiService } from '../services/api';
import { DataTable } from '../components/DataTable';
import { Modal } from '../components/Modal';
import { CalendarCheck, Plus } from 'lucide-react';

export const AttendancePage = () => {
  const [attendanceList, setAttendanceList] = useState([]);
  const [students, setStudents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [studentId, setStudentId] = useState('');
  const [status, setStatus] = useState('PRESENT');
  const [remarks, setRemarks] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const aData = await apiService.getAttendance();
    const sData = await apiService.getStudents();
    setAttendanceList(aData);
    setStudents(sData);
  };

  const handleMarkAttendance = async (e) => {
    e.preventDefault();
    if (!studentId) return;

    const today = new Date().toISOString().split('T')[0];
    await apiService.markAttendance(Number(studentId), today, status, remarks);
    setIsModalOpen(false);
    loadData();
  };

  const columns = [
    { header: 'Student Name', render: (r) => r.student?.user?.fullName || 'Alex Mercer' },
    { header: 'Roll No', render: (r) => r.student?.rollNumber || 'CS2024001' },
    { header: 'Date', accessor: 'date' },
    {
      header: 'Status',
      render: (r) => (
        <span className={`badge ${r.status === 'PRESENT' ? 'badge-success' : r.status === 'LATE' ? 'badge-warning' : 'badge-danger'}`}>
          {r.status}
        </span>
      )
    },
    { header: 'Remarks', accessor: 'remarks' }
  ];

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <div>
          <h1 className="page-title">Attendance Monitoring</h1>
          <p className="page-subtitle">Track daily hostel curfew and student night presence</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="btn btn-primary">
          <Plus size={18} /> Mark Attendance
        </button>
      </div>

      <div className="glass-card">
        <DataTable columns={columns} data={attendanceList} />
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Mark Daily Attendance">
        <form onSubmit={handleMarkAttendance}>
          <div className="form-group">
            <label className="form-label">Student</label>
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
            <label className="form-label">Attendance Status</label>
            <select className="form-control" value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="PRESENT">PRESENT</option>
              <option value="LATE">LATE</option>
              <option value="ABSENT">ABSENT</option>
              <option value="ON_LEAVE">ON LEAVE</option>
            </select>
          </div>

          <div className="form-group" style={{ marginBottom: '24px' }}>
            <label className="form-label">Remarks / Note</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Returned after curfew, Valid pass"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
            Save Attendance Record
          </button>
        </form>
      </Modal>
    </div>
  );
};
