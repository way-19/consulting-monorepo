import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from '@consulting19/shared';
import ClientLayout from './components/layouts/ClientLayout';
import LoginPage from './pages/auth/LoginPage';

// Client Pages
import ClientDashboard from './pages/client/ClientDashboard';
import ClientProjects from './pages/client/ClientProjects';
import ClientProjectDetails from './pages/client/ClientProjectDetails';
import ClientTasks from './pages/client/ClientTasks';
import ClientServices from './pages/client/ClientServices';
import ClientMessages from './pages/client/ClientMessages';
import ClientMeetings from './pages/client/ClientMeetings';
import ClientCalendar from './pages/client/ClientCalendar';
import ClientBilling from './pages/client/ClientBilling';
import ClientAccounting from './pages/client/ClientAccounting';
import ClientFileManager from './pages/client/ClientFileManager';
import ClientMailbox from './pages/client/ClientMailbox';
import ClientProgressTracking from './pages/client/ClientProgressTracking';
import ClientSupport from './pages/client/ClientSupport';
import ClientSettings from './pages/client/ClientSettings';

function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Auth Routes */}
            <Route path="/login" element={<LoginPage />} />
            
            {/* Client Routes */}
            <Route path="/client" element={<ClientLayout />}>
              <Route index element={<Navigate to="/client/dashboard" replace />} />
              <Route path="dashboard" element={<ClientDashboard />} />
              <Route path="projects" element={<ClientProjects />} />
              <Route path="projects/:id" element={<ClientProjectDetails />} />
              <Route path="tasks" element={<ClientTasks />} />
              <Route path="services" element={<ClientServices />} />
              <Route path="messages" element={<ClientMessages />} />
              <Route path="meetings" element={<ClientMeetings />} />
              <Route path="calendar" element={<ClientCalendar />} />
              <Route path="billing" element={<ClientBilling />} />
              <Route path="accounting" element={<ClientAccounting />} />
              <Route path="file-manager" element={<ClientFileManager />} />
              <Route path="mailbox" element={<ClientMailbox />} />
              <Route path="progress" element={<ClientProgressTracking />} />
              <Route path="support" element={<ClientSupport />} />
              <Route path="settings" element={<ClientSettings />} />
            </Route>

            {/* Default redirect */}
            <Route path="/" element={<Navigate to="/client/dashboard" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </HelmetProvider>
  );
}

export default App;