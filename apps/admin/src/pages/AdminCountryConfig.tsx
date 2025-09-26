import React from 'react';
import { ArrowRight, Globe, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminCountryConfig: React.FC = () => {
  const navigate = useNavigate();

  const handleGoToFormControl = () => {
    navigate('/forms');
  };

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Countries Configuration</h1>
          <p className="text-gray-600">
            Country configurations have been moved to the Form Control page for better management.
          </p>
        </div>

        {/* Migration Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <Globe className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-3 flex-1">
              <h3 className="text-lg font-medium text-blue-900 mb-2">
                Feature Moved to Form Control
              </h3>
              <p className="text-blue-700 mb-4">
                All country configuration features including form management, packages, and services 
                have been consolidated into the Form Control page for a better user experience.
              </p>
              <button
                onClick={handleGoToFormControl}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Settings className="w-4 h-4 mr-2" />
                Go to Form Control
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            </div>
          </div>
        </div>

        {/* Features List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            What you can do in Form Control:
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div>
                <h4 className="font-medium text-gray-900">Country Management</h4>
                <p className="text-gray-600 text-sm">Create, edit, and manage country configurations</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div>
                <h4 className="font-medium text-gray-900">Form Builder</h4>
                <p className="text-gray-600 text-sm">Design and customize order forms for each country</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div>
                <h4 className="font-medium text-gray-900">Package Management</h4>
                <p className="text-gray-600 text-sm">Configure service packages and pricing</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div>
                <h4 className="font-medium text-gray-900">Order Management</h4>
                <p className="text-gray-600 text-sm">View and manage incoming orders</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCountryConfig;