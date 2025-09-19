import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '@consulting19/shared';
import { FileText, Upload, BarChart3 } from 'lucide-react';
import { supabase } from '@consulting19/shared/lib/supabase';

const ClientAccounting = () => {

  return (
    <>
      <Helmet>
        <title>Accounting - Client Portal</title>
      </Helmet>
      
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Accounting</h1>
          <p className="text-gray-600 mt-1">Submit monthly financial documents</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Accounting Module</h3>
          <p className="text-gray-600 mb-6">
            Submit monthly financial documents and track your accounting submissions.
          </p>
          <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Upload className="w-4 h-4 mr-2" />
            Upload Documents
          </button>
        </div>
      </div>
    </>
  );
};

export default ClientAccounting;