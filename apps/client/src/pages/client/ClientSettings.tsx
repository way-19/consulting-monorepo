import React from 'react';
import { Helmet } from 'react-helmet-async';

const ClientSettings = () => {
  return (
    <>
      <Helmet>
        <title>Settings - Client Portal</title>
      </Helmet>
      
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Account Settings</h1>
          <p className="text-gray-600 mt-1">Manage your account preferences and settings</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <p className="text-gray-600">Settings page coming soon...</p>
        </div>
      </div>
    </>
  );
};

export default ClientSettings;