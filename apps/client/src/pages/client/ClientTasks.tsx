import React from 'react';
import { Helmet } from 'react-helmet-async';
import { HelpCircle, Plus, MessageSquare } from 'lucide-react';
import { supabase } from '@consulting19/shared/lib/supabase';

const ClientSupport = () => {
  return (
    <>
      <Helmet>
        <title>Support - Client Portal</title>
      </Helmet>
      
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Support</h1>
          <p className="text-gray-600 mt-1">Get help and submit support requests</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <HelpCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Support Center</h3>
          <p className="text-gray-600 mb-6">
            Get help from your consultant or submit support requests.
          </p>
          <div className="flex items-center justify-center space-x-3">
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              <MessageSquare className="w-4 h-4 mr-2" />
              Contact Consultant
            </button>
            <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Plus className="w-4 h-4 mr-2" />
              New Support Request
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ClientSupport;