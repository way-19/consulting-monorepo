import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from '@shared/contexts/AuthContext';
import { LanguageProvider } from '@shared/contexts/LanguageContext';
import ClientLayout from './components/layouts/ClientLayout';
import LoginPage from './pages/auth/LoginPage';
import ClientDashboard from './pages/client/ClientDashboard';
import ClientProjects from './pages/client/ClientProjects';
import ClientProjectDetails from './pages/client/ClientProjectDetails';
import ClientTasks from './pages/client/ClientTasks';
import ClientServices from './pages/client/ClientServices';
import ClientMessages from './pages/client/ClientMessages';
import ClientMeetings from './pages/client/ClientMeetings';
import ClientBilling from './pages/client/ClientBilling';
import ClientAccounting from './pages/client/ClientAccounting';
import ClientFileManager from './pages/client/ClientFileManager';
import ClientMailbox from './pages/client/ClientMailbox';
import ClientProgressTracking from './pages/client/ClientProgressTracking';
import ClientSupport from './pages/client/ClientSupport';
import ClientSettings from './pages/client/ClientSettings';
import ClientOnboarding from './pages/client/ClientOnboarding';
import './index.css';

function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <LanguageProvider>
          <Router>
            <Helmet>
              <title>Client Portal</title>
              <meta name="description" content="Client management portal" />
            </Helmet>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/onboarding" element={<ClientOnboarding />} />
              <Route path="/" element={<ClientLayout />}>
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="dashboard" element={<ClientDashboard />} />
                <Route path="projects" element={<ClientProjects />} />
                <Route path="projects/:projectId" element={<ClientProjectDetails />} />
                <Route path="tasks" element={<ClientTasks />} />
                <Route path="services" element={<ClientServices />} />
                <Route path="messages" element={<ClientMessages />} />
                <Route path="meetings" element={<ClientMeetings />} />
                <Route path="billing" element={<ClientBilling />} />
                <Route path="accounting" element={<ClientAccounting />} />
                <Route path="file-manager" element={<ClientFileManager />} />
                <Route path="mailbox" element={<ClientMailbox />} />
                <Route path="progress" element={<ClientProgressTracking />} />
                <Route path="support" element={<ClientSupport />} />
                <Route path="settings" element={<ClientSettings />} />
              </Route>
            </Routes>
          </Router>
        </LanguageProvider>
      </AuthProvider>
    </HelmetProvider>
  );
}

export default App;