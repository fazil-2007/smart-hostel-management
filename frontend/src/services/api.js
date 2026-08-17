import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 5000,
});

// Interceptor to add Authorization Bearer token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('sh_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

// Mock Data Fallbacks for Standalone Demo
const MOCK_DATA = {
  summary: {
    totalStudents: 124,
    totalRooms: 60,
    occupiedRooms: 42,
    availableRooms: 18,
    pendingMaintenanceRequests: 4,
    activeVisitors: 3,
    pendingPayments: 12,
    presentStudentsToday: 110,
  },
  students: [
    { id: 1, rollNumber: 'CS2024001', department: 'Computer Science', yearOfStudy: 3, user: { fullName: 'Alex Mercer', email: 'alex.mercer@student.edu', phone: '+1234567892' } },
    { id: 2, rollNumber: 'EC2024045', department: 'Electronics & Comm', yearOfStudy: 2, user: { fullName: 'Sophia Chen', email: 'sophia.chen@student.edu', phone: '+1234567893' } },
    { id: 3, rollNumber: 'ME2024012', department: 'Mechanical Engg', yearOfStudy: 4, user: { fullName: 'Marcus Johnson', email: 'marcus.j@student.edu', phone: '+1234567894' } },
  ],
  rooms: [
    { id: 1, roomNumber: 'A-101', blockName: 'Block A', capacity: 2, currentOccupancy: 2, roomType: 'STANDARD', status: 'FULL' },
    { id: 2, roomNumber: 'A-102', blockName: 'Block A', capacity: 2, currentOccupancy: 1, roomType: 'STANDARD', status: 'AVAILABLE' },
    { id: 3, roomNumber: 'B-201', blockName: 'Block B', capacity: 1, currentOccupancy: 0, roomType: 'DELUXE', status: 'AVAILABLE' },
    { id: 4, roomNumber: 'B-202', blockName: 'Block B', capacity: 2, currentOccupancy: 0, roomType: 'STANDARD', status: 'MAINTENANCE' },
    { id: 5, roomNumber: 'C-301', blockName: 'Block C', capacity: 3, currentOccupancy: 0, roomType: 'STANDARD', status: 'AVAILABLE' },
  ],
  allocations: [
    { id: 1, student: { id: 1, rollNumber: 'CS2024001', user: { fullName: 'Alex Mercer' } }, room: { roomNumber: 'A-101', blockName: 'Block A' }, allocationDate: '2025-08-01', status: 'ACTIVE' },
    { id: 2, student: { id: 2, rollNumber: 'EC2024045', user: { fullName: 'Sophia Chen' } }, room: { roomNumber: 'A-101', blockName: 'Block A' }, allocationDate: '2025-08-01', status: 'ACTIVE' },
    { id: 3, student: { id: 3, rollNumber: 'ME2024012', user: { fullName: 'Marcus Johnson' } }, room: { roomNumber: 'A-102', blockName: 'Block A' }, allocationDate: '2025-08-05', status: 'ACTIVE' },
  ],
  attendance: [
    { id: 1, student: { rollNumber: 'CS2024001', user: { fullName: 'Alex Mercer' } }, date: '2026-08-17', status: 'PRESENT', remarks: 'On time' },
    { id: 2, student: { rollNumber: 'EC2024045', user: { fullName: 'Sophia Chen' } }, date: '2026-08-17', status: 'PRESENT', remarks: 'On time' },
    { id: 3, student: { rollNumber: 'ME2024012', user: { fullName: 'Marcus Johnson' } }, date: '2026-08-17', status: 'LATE', remarks: 'Returned at 10:15 PM' },
  ],
  maintenance: [
    { id: 1, student: { user: { fullName: 'Alex Mercer' } }, room: { roomNumber: 'A-101' }, category: 'PLUMBING', description: 'Leaking bathroom faucet in room A-101.', status: 'IN_PROGRESS', priority: 'HIGH', createdAt: '2026-08-16T10:00:00' },
    { id: 2, student: { user: { fullName: 'Sophia Chen' } }, room: { roomNumber: 'A-101' }, category: 'ELECTRICAL', description: 'Study lamp socket not working.', status: 'PENDING', priority: 'MEDIUM', createdAt: '2026-08-17T09:30:00' },
    { id: 3, student: { user: { fullName: 'Marcus Johnson' } }, room: { roomNumber: 'A-102' }, category: 'FURNITURE', description: 'Broken study chair cushion replacement.', status: 'RESOLVED', priority: 'LOW', createdAt: '2026-08-15T14:20:00' },
  ],
  visitors: [
    { id: 1, student: { user: { fullName: 'Alex Mercer' } }, visitorName: 'David Mercer', relation: 'Father', phone: '+1999888777', entryTime: '2026-08-17T12:00:00', purpose: 'Delivering academic books', status: 'CHECKED_IN' },
    { id: 2, student: { user: { fullName: 'Sophia Chen' } }, visitorName: 'Elena Chen', relation: 'Mother', phone: '+1999888778', entryTime: '2026-08-17T09:00:00', exitTime: '2026-08-17T11:00:00', purpose: 'Weekend visit', status: 'CHECKED_OUT' },
  ],
  payments: [
    { id: 1, student: { rollNumber: 'CS2024001', user: { fullName: 'Alex Mercer' } }, amount: 1200.00, paymentType: 'HOSTEL_FEE', dueDate: '2026-09-01', paidDate: '2026-08-10', status: 'PAID', transactionId: 'TXN-984710293' },
    { id: 2, student: { rollNumber: 'EC2024045', user: { fullName: 'Sophia Chen' } }, amount: 1200.00, paymentType: 'HOSTEL_FEE', dueDate: '2026-09-01', paidDate: null, status: 'PENDING', transactionId: null },
    { id: 3, student: { rollNumber: 'ME2024012', user: { fullName: 'Marcus Johnson' } }, amount: 350.00, paymentType: 'MESS_FEE', dueDate: '2026-08-15', paidDate: null, status: 'OVERDUE', transactionId: null },
  ]
};

export const apiService = {
  checkHealth: async () => {
    try {
      const res = await apiClient.get('/health');
      return res.data;
    } catch {
      return { status: 'UP (Offline Fallback)', timestamp: new Date().toISOString() };
    }
  },

  login: async (username, password) => {
    try {
      const res = await apiClient.post('/auth/login', { username, password });
      return res.data;
    } catch {
      // Offline Demo Fallback Login
      let role = 'STUDENT';
      let fullName = 'Alex Mercer';
      let studentId = 1;

      if (username.includes('admin')) {
        role = 'ADMIN';
        fullName = 'System Administrator';
        studentId = null;
      } else if (username.includes('warden')) {
        role = 'WARDEN';
        fullName = 'Dr. Robert Vance';
        studentId = null;
      }

      return {
        token: 'demo-jwt-token-xyz-123',
        id: 1,
        username,
        fullName,
        email: `${username}@university.edu`,
        role,
        studentId
      };
    }
  },

  getSummary: async () => {
    try {
      const res = await apiClient.get('/reports/summary');
      return res.data;
    } catch {
      return MOCK_DATA.summary;
    }
  },

  getStudents: async () => {
    try {
      const res = await apiClient.get('/students');
      return res.data;
    } catch {
      return MOCK_DATA.students;
    }
  },

  getRooms: async () => {
    try {
      const res = await apiClient.get('/rooms');
      return res.data;
    } catch {
      return MOCK_DATA.rooms;
    }
  },

  getOccupancyMetrics: async () => {
    try {
      const res = await apiClient.get('/rooms/occupancy');
      return res.data;
    } catch {
      return { totalRooms: 60, totalCapacity: 120, totalOccupancy: 84, availableSpots: 36, occupancyPercentage: 70.0 };
    }
  },

  getAllocations: async () => {
    try {
      const res = await apiClient.get('/allocations');
      return res.data;
    } catch {
      return MOCK_DATA.allocations;
    }
  },

  allocateRoom: async (studentId, roomId) => {
    try {
      const res = await apiClient.post('/allocations', { studentId, roomId });
      return res.data;
    } catch {
      return { id: Date.now(), studentId, roomId, allocationDate: new Date().toISOString().split('T')[0], status: 'ACTIVE' };
    }
  },

  vacateRoom: async (allocationId) => {
    try {
      const res = await apiClient.put(`/allocations/${allocationId}/vacate`);
      return res.data;
    } catch {
      return { id: allocationId, status: 'VACATED', vacateDate: new Date().toISOString().split('T')[0] };
    }
  },

  getAttendance: async () => {
    try {
      const res = await apiClient.get('/attendance');
      return res.data;
    } catch {
      return MOCK_DATA.attendance;
    }
  },

  markAttendance: async (studentId, date, status, remarks) => {
    try {
      const res = await apiClient.post('/attendance', { studentId, date, status, remarks });
      return res.data;
    } catch {
      return { id: Date.now(), studentId, date, status, remarks };
    }
  },

  getMaintenanceRequests: async () => {
    try {
      const res = await apiClient.get('/maintenance');
      return res.data;
    } catch {
      return MOCK_DATA.maintenance;
    }
  },

  createMaintenanceRequest: async (studentId, roomId, category, description, priority) => {
    try {
      const res = await apiClient.post('/maintenance', { studentId, roomId, category, description, priority });
      return res.data;
    } catch {
      return { id: Date.now(), category, description, priority, status: 'PENDING', createdAt: new Date().toISOString() };
    }
  },

  updateMaintenanceStatus: async (requestId, status) => {
    try {
      const res = await apiClient.put(`/maintenance/${requestId}/status`, { status });
      return res.data;
    } catch {
      return { id: requestId, status };
    }
  },

  getVisitors: async () => {
    try {
      const res = await apiClient.get('/visitors');
      return res.data;
    } catch {
      return MOCK_DATA.visitors;
    }
  },

  logVisitor: async (studentId, visitorName, relation, phone, purpose) => {
    try {
      const res = await apiClient.post('/visitors', { studentId, visitorName, relation, phone, purpose });
      return res.data;
    } catch {
      return { id: Date.now(), visitorName, relation, phone, purpose, entryTime: new Date().toISOString(), status: 'CHECKED_IN' };
    }
  },

  checkoutVisitor: async (visitorId) => {
    try {
      const res = await apiClient.put(`/visitors/${visitorId}/checkout`);
      return res.data;
    } catch {
      return { id: visitorId, status: 'CHECKED_OUT', exitTime: new Date().toISOString() };
    }
  },

  getPayments: async () => {
    try {
      const res = await apiClient.get('/payments');
      return res.data;
    } catch {
      return MOCK_DATA.payments;
    }
  },

  payFee: async (paymentId) => {
    try {
      const res = await apiClient.put(`/payments/${paymentId}/pay`);
      return res.data;
    } catch {
      return { id: paymentId, status: 'PAID', paidDate: new Date().toISOString().split('T')[0], transactionId: 'TXN-DEMO999' };
    }
  }
};
