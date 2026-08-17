import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { LoginPage } from './pages/LoginPage';
import { StudentDashboard } from './pages/StudentDashboard';
import { WardenDashboard } from './pages/WardenDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { RoomAllocationPage } from './pages/RoomAllocationPage';
import { OccupancyPage } from './pages/OccupancyPage';
import { AttendancePage } from './pages/AttendancePage';
import { MaintenancePage } from './pages/MaintenancePage';
import { VisitorPage } from './pages/VisitorPage';
import { PaymentPage } from './pages/PaymentPage';
import { ReportsPage } from './pages/ReportsPage';

const ProtectedLayout = ({ children }) => {
  const { isAuthenticated } = useContext(AuthContext);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <Navbar />
        {children}
      </div>
    </div>
  );
};

export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          
          <Route path="/student-dashboard" element={<ProtectedLayout><StudentDashboard /></ProtectedLayout>} />
          <Route path="/warden-dashboard" element={<ProtectedLayout><WardenDashboard /></ProtectedLayout>} />
          <Route path="/admin-dashboard" element={<ProtectedLayout><AdminDashboard /></ProtectedLayout>} />
          <Route path="/rooms/allocation" element={<ProtectedLayout><RoomAllocationPage /></ProtectedLayout>} />
          <Route path="/rooms/occupancy" element={<ProtectedLayout><OccupancyPage /></ProtectedLayout>} />
          <Route path="/attendance" element={<ProtectedLayout><AttendancePage /></ProtectedLayout>} />
          <Route path="/maintenance" element={<ProtectedLayout><MaintenancePage /></ProtectedLayout>} />
          <Route path="/visitors" element={<ProtectedLayout><VisitorPage /></ProtectedLayout>} />
          <Route path="/payments" element={<ProtectedLayout><PaymentPage /></ProtectedLayout>} />
          <Route path="/reports" element={<ProtectedLayout><ReportsPage /></ProtectedLayout>} />

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
