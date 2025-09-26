import React from 'react';
import ReactDOM from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import App from './App.tsx';
import './index.css';
import { Toaster } from 'react-hot-toast'
import { CountryConfigService, CrossDomainSync } from '@consulting19/shared';

// Expose services globally for debugging
(window as any).CountryConfigService = CountryConfigService;
(window as any).CrossDomainSync = CrossDomainSync;
console.log('🔧 MARKETING - CountryConfigService and CrossDomainSync exposed globally');

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HelmetProvider>
    <Toaster />
      <App />
    </HelmetProvider>
  </React.StrictMode>,
);