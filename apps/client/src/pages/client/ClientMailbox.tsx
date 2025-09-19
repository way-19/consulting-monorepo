import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Mail, FileText, Truck } from 'lucide-react';
import { supabase } from '@consulting19/shared/lib/supabase';
import { useAuth } from '@consulting19/shared';

const ClientMailbox = () => {

  return (
    <>
      <Helmet>
        <title>Virtual Mailbox - Client Portal</title>
      </Helmet>
      
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mailbox</h1>
          <p className="text-gray-600 mt-1">Access company documents and mail forwarding</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <Mail className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Virtual Mailbox</h3>
          <p className="text-gray-600 mb-6">
            Access your company documents and request physical mail forwarding.
          </p>
          <button className="inline-flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
            <Truck className="w-4 h-4 mr-2" />
            Request Forwarding
          </button>
        </div>
      </div>
    </>
  );
};

export default ClientMailbox;