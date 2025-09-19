import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth, LoadingSpinner } from '@consulting19/shared';
import LoginPage from './pages/auth/LoginPage';
import ConsultantDashboard from './pages/consultant/ConsultantDashboard';
import ConsultantClients from './pages/consultant/ConsultantClients';
import ConsultantTasks from './pages/consultant/ConsultantTasks';
import ConsultantDocuments from './pages/consultant/ConsultantDocuments';
import ConsultantAvailability from './pages/consultant/ConsultantAvailability';
import ConsultantServices from './pages/consultant/ConsultantServices';
import ConsultantContent from './pages/consultant/ConsultantContent';
import ConsultantLayout from './components/layouts/ConsultantLayout';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/*" element={<ProtectedConsultantRoutes />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

const ProtectedConsultantRoutes = () => {
  const { user, role, loading } = useAuth();
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (role !== 'consultant') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600">You don't have permission to access the consultant dashboard.</p>
        </div>
      </div>
    );
  }
  
  return (
    <Routes>
      <Route path="/" element={<ConsultantDashboard />} />
      <Route path="/clients" element={<ConsultantClients />} />
      <Route path="/tasks" element={<ConsultantTasks />} />
      <Route path="/documents" element={<ConsultantDocuments />} />
      <Route path="/availability" element={<ConsultantAvailability />} />
      <Route path="/services" element={<ConsultantServices />} />
      <Route path="/content" element={<ConsultantContent />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;