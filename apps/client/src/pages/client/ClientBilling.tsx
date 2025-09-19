import React from 'react';
import { Helmet } from 'react-helmet-async';

const ClientBilling = () => {
  return (
    <>
      <Helmet>
        <title>Billing - Client Portal</title>
      </Helmet>
      
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Billing & Payments</h1>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <p className="text-gray-600">Billing page coming soon...</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default ClientBilling;