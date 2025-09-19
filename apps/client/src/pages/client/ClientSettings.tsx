import React from 'react';
import { Helmet } from 'react-helmet-async';

const ClientSettings = () => {
  return (
    <>
      <Helmet>
        <title>Settings - Client Portal</title>
      </Helmet>
      
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Account Settings</h1>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <p className="text-gray-600">Settings page coming soon...</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default ClientSettings;