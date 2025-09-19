import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@consulting19/shared';
import LoginPage from './pages/auth/LoginPage';
import ClientDashboard from './pages/client/ClientDashboard';
import ClientProjects from './pages/client/ClientProjects';
import ClientProjectDetails from './pages/client/ClientProjectDetails';
import ClientTasks from './pages/client/ClientTasks';
import ClientAccounting from './pages/client/ClientAccounting';
import ClientBilling from './pages/client/ClientBilling';
import ClientCalendar from './pages/client/ClientCalendar';
import ClientFileManager from './pages/client/ClientFileManager';
import ClientMailbox from './pages/client/ClientMailbox';
import ClientMeetings from './pages/client/ClientMeetings';
import ClientMessages from './pages/client/ClientMessages';
import ClientOnboarding from './pages/client/ClientOnboarding';
import ClientProgressTracking from './pages/client/ClientProgressTracking';
import ClientServices from './pages/client/ClientServices';
import ClientSettings from './pages/client/ClientSettings';
import ClientSupport from './pages/client/ClientSupport';
import ClientLayout from './components/layouts/ClientLayout';
import './i18n';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/*" element={<ProtectedClientRoutes />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

const ProtectedClientRoutes = () => {
  const { user, profile, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-teal-600 rounded-lg flex items-center justify-center mx-auto mb-6">
            <span className="text-white font-bold text-xl">C19</span>
          </div>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading Client Dashboard...</p>
        </div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return (
    <ClientLayout>
      <Routes>
        <Route path="/" element={<Navigate to="/client" replace />} />
        <Route path="/client" element={<ClientDashboard />} />
        <Route path="/client/projects" element={<ClientProjects />} />
        <Route path="/client/projects/:projectId" element={<ClientProjectDetails />} />
        <Route path="/client/tasks" element={<ClientTasks />} />
        <Route path="/client/documents" element={<ClientAccounting />} />
        <Route path="/client/messages" element={<ClientMessages />} />
        <Route path="/client/invoices" element={<ClientBilling />} />
        <Route path="/client/calendar" element={<ClientCalendar />} />
        <Route path="/client/reports" element={<ClientProgressTracking />} />
        <Route path="/client/time-tracking" element={<ClientProgressTracking />} />
        <Route path="/client/support" element={<ClientSupport />} />
        <Route path="/client/settings" element={<ClientSettings />} />
        <Route path="*" element={<Navigate to="/client" replace />} />
      </Routes>
    </ClientLayout>
  );
};

export default App;