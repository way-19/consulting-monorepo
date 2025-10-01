import React from 'react';
import ReactDOM from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import './i18n.ts';
import App from './App.tsx';
import AppWithCustomAuth from './AppWithCustomAuth.tsx';
import './index.css';

// Check if we should use custom auth (via URL parameter)
const urlParams = new URLSearchParams(window.location.search);
const useCustomAuth = urlParams.get('customAuth') === 'true';

// Show a banner to indicate which auth system is being used
if (useCustomAuth) {
  console.log('🔐 Using Custom JWT Authentication');
  document.title = 'Consultant App (Custom Auth)';
} else {
  console.log('🔐 Using Supabase Authentication');
  document.title = 'Consultant App (Supabase Auth)';
}

const AppComponent = useCustomAuth ? AppWithCustomAuth : App;

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HelmetProvider>
      <AppComponent />
    </HelmetProvider>
  </React.StrictMode>,
);