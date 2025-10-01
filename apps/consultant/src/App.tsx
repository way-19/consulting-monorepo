import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, LanguageProvider, useAuth } from '@consulting19/shared';
import LoginPage from './pages/auth/LoginPage';
import ConsultantDashboard from './pages/consultant/ConsultantDashboard';
import ConsultantClients from './pages/consultant/ConsultantClients';
import ConsultantTasks from './pages/consultant/ConsultantTasks';
import ConsultantTaskBoard from './pages/consultant/ConsultantTaskBoard';
import ConsultantDocuments from './pages/consultant/ConsultantDocuments';
import ConsultantMessages from './pages/consultant/ConsultantMessages';
import ConsultantAvailability from './pages/consultant/ConsultantAvailability';
import ConsultantServices from './pages/consultant/ConsultantServices';
import ConsultantFinancial from './pages/consultant/ConsultantFinancial';
import ConsultantCrossAssignments from './pages/consultant/ConsultantCrossAssignments';
import ConsultantContent from './pages/consultant/ConsultantContent';
import ConsultantSettings from './pages/consultant/ConsultantSettings';
import ConsultantLayout from './components/layouts/ConsultantLayout';

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
            <Route path="/*" element={<ProtectedConsultantRoutes />} />
          </Routes>
        </div>
      </Router>
      </AuthProvider>
    </LanguageProvider>
  );
}

const ProtectedConsultantRoutes = () => {
  const { user, profile, loading } = useAuth();
  
  console.log('Consultant App - User:', user?.email, 'Profile role:', profile?.role, 'Loading:', loading);
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-teal-600 rounded-lg flex items-center justify-center mx-auto mb-6">
            <span className="text-white font-bold text-xl">C19</span>
          </div>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading Consultant Dashboard...</p>
        </div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (profile?.role !== 'consultant') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-4">You don't have permission to access the consultant dashboard.</p>
          <div className="bg-gray-100 p-4 rounded-lg max-w-md mx-auto">
            <p className="text-sm text-gray-700">
              <strong>Current role:</strong> {profile?.role || 'unknown'}<br />
              <strong>Required role:</strong> consultant<br />
              <strong>Email:</strong> {user?.email}
            </p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <ConsultantLayout>
      <Routes>
        <Route path="/" element={<ConsultantDashboard />} />
        <Route path="/clients" element={<ConsultantClients />} />
        <Route path="/tasks" element={<ConsultantTasks />} />
        <Route path="/tasks/board" element={<ConsultantTaskBoard />} />
        <Route path="/documents" element={<ConsultantDocuments />} />
        <Route path="/messages" element={<ConsultantMessages />} />
        <Route path="/availability" element={<ConsultantAvailability />} />
        <Route path="/services" element={<ConsultantServices />} />
        <Route path="/financial" element={<ConsultantFinancial />} />
        <Route path="/cross-assignments" element={<ConsultantCrossAssignments />} />
        <Route path="/content" element={<ConsultantContent />} />
        <Route path="/settings" element={<ConsultantSettings />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ConsultantLayout>
  );
};

export default App;