import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, LanguageProvider, useAuth } from '@consulting19/shared';
import LoginPage from './pages/auth/LoginPage';
import ClientDashboard from './pages/client/ClientDashboard';
import ClientProjects from './pages/client/ClientProjects';
import ClientProjectDetails from './pages/client/ClientProjectDetails';
import ClientServices from './pages/client/ClientServices';
import ClientMessages from './pages/client/ClientMessages';
import ClientCalendar from './pages/client/ClientCalendar';
import ClientBilling from './pages/client/ClientBilling';
import ClientAccounting from './pages/client/ClientAccounting';
import ClientFileManager from './pages/client/ClientFileManager';
import ClientMailbox from './pages/client/ClientMailbox';
import ClientProgressTracking from './pages/client/ClientProgressTracking';
import ClientSupport from './pages/client/ClientSupport';
import ClientSettings from './pages/client/ClientSettings';
import ClientAvailability from './pages/client/ClientAvailability';
import ClientLayout from './components/layouts/ClientLayout';

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <Router
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <div className="min-h-screen bg-gray-50">
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/*" element={<ProtectedClientRoutes />} />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </LanguageProvider>
  );
}

const ProtectedClientRoutes = () => {
  const { user, loading } = useAuth();
  
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
        <Route path="/" element={<ClientDashboard />} />
        <Route path="/projects" element={<ClientProjects />} />
        <Route path="/projects/:projectId" element={<ClientProjectDetails />} />
        <Route path="/services" element={<ClientServices />} />
        <Route path="/messages" element={<ClientMessages />} />
        <Route path="/calendar" element={<ClientCalendar />} />
        <Route path="/billing" element={<ClientBilling />} />
        <Route path="/accounting" element={<ClientAccounting />} />
        <Route path="/files" element={<ClientFileManager />} />
        <Route path="/mailbox" element={<ClientMailbox />} />
        <Route path="/progress" element={<ClientProgressTracking />} />
        <Route path="/availability" element={<ClientAvailability />} />
        <Route path="/support" element={<ClientSupport />} />
        <Route path="/settings" element={<ClientSettings />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ClientLayout>
  );
};

export default App;