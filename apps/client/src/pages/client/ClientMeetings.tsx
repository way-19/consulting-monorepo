import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Calendar, Clock, User, Video } from 'lucide-react';

const ClientMeetings = () => {
  return (
    <>
      <Helmet>
        <title>Meetings - Client Portal</title>
      </Helmet>
      
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Meetings</h1>
          <p className="text-gray-600 mt-1">Schedule and manage your consultant meetings</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Meetings Scheduled</h3>
          <p className="text-gray-600 mb-6">
            Schedule your first consultation with your assigned consultant.
          </p>
          <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Video className="w-4 h-4 mr-2" />
            Schedule Meeting
          </button>
        </div>
      </div>
    </>
  );
};

export default ClientMeetings;