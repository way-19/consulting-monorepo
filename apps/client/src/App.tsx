import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, LanguageProvider, useAuth } from '@consulting19/shared';
import LoginPage from './pages/auth/LoginPage';
import ClientDashboard from './pages/client/ClientDashboard';
import ClientProjects from './pages/client/ClientProjects';
import ClientProjectDetails from './pages/client/ClientProjectDetails';
import ClientTasks from './pages/client/ClientTasks';
import ClientDocuments from './pages/client/ClientDocuments';
import ClientMessages from './pages/client/ClientMessages';
import ClientBilling from './pages/client/ClientBilling';
import ClientCalendar from './pages/client/ClientCalendar';
import ClientAccounting from './pages/client/ClientAccounting';
import ClientFileManager from './pages/client/ClientFileManager';
import ClientMailbox from './pages/client/ClientMailbox';
import ClientProgressTracking from './pages/client/ClientProgressTracking';
import ClientSupport from './pages/client/ClientSupport';
import ClientSettings from './pages/client/ClientSettings';
import ClientOnboarding from './pages/client/ClientOnboarding';
import ClientLayout from './components/layouts/ClientLayout';

function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/*" element={<ProtectedClientRoutes />} />
            </Routes>
          </div>
        </Router>
      </LanguageProvider>
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
  
  if (profile?.role !== 'client') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-4">You don't have permission to access the client dashboard.</p>
          <div className="bg-gray-100 p-4 rounded-lg max-w-md mx-auto">
            <p className="text-sm text-gray-700">
              <strong>Current role:</strong> {profile?.role || 'unknown'}<br />
              <strong>Required role:</strong> client<br />
              <strong>Email:</strong> {user?.email}
            </p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <ClientLayout>
      <Routes>
        <Route path="/client" element={<ClientDashboard />} />
        <Route path="/client/projects" element={<ClientProjects />} />
        <Route path="/client/projects/:projectId" element={<ClientProjectDetails />} />
        <Route path="/client/tasks" element={<ClientTasks />} />
        <Route path="/client/documents" element={<ClientDocuments />} />
        <Route path="/client/messages" element={<ClientMessages />} />
        <Route path="/client/invoices" element={<ClientBilling />} />
        <Route path="/client/calendar" element={<ClientCalendar />} />
        <Route path="/client/accounting" element={<ClientAccounting />} />
        <Route path="/client/files" element={<ClientFileManager />} />
        <Route path="/client/mailbox" element={<ClientMailbox />} />
        <Route path="/client/progress" element={<ClientProgressTracking />} />
        <Route path="/client/support" element={<ClientSupport />} />
        <Route path="/client/settings" element={<ClientSettings />} />
        <Route path="/client/onboarding" element={<ClientOnboarding />} />
        <Route path="/" element={<Navigate to="/client" replace />} />
        <Route path="*" element={<Navigate to="/client" replace />} />
      </Routes>
    </ClientLayout>
  );
};

export default App;