import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, DollarSign, Globe, Star, ToggleLeft, ToggleRight } from 'lucide-react';

interface CustomService {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  billing_type: string;
  category: string;
  is_active: boolean;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

const ConsultantServices = () => {
  const [services, setServices] = useState<CustomService[]>([]);
  const [loading, setLoading] = useState(true);
  const [showServiceForm, setShowServiceForm] = useState(false);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const toggleServiceStatus = (serviceId: string, currentStatus: boolean) => {
    setServices(prev => 
      prev.map(service => 
        service.id === serviceId 
          ? { ...service, is_active: !currentStatus }
          : service
      )
    );
  };

  const deleteService = (serviceId: string) => {
    if (confirm('Are you sure you want to delete this service?')) {
      setServices(prev => prev.filter(service => service.id !== serviceId));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Services</h1>
              <p className="text-gray-600">Create and manage your custom services</p>
            </div>
            <button 
              onClick={() => setShowServiceForm(true)}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Service
            </button>
          </div>
        </div>

        {/* Services Grid */}
        {services.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <div key={service.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{service.title}</h3>
                        {service.is_featured && (
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{service.description}</p>
                    </div>
                    <button
                      onClick={() => toggleServiceStatus(service.id, service.is_active)}
                      className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
                        service.is_active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {service.is_active ? (
                        <ToggleRight className="w-3 h-3" />
                      ) : (
                        <ToggleLeft className="w-3 h-3" />
                      )}
                      <span>{service.is_active ? 'Active' : 'Inactive'}</span>
                    </button>
                  </div>

                  <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Price:</span>
                      <div className="text-right">
                        <div className="text-lg font-bold text-gray-900">
                          ${service.price.toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-500 capitalize">
                          {service.billing_type.replace('_', ' ')}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4 space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Category:</span>
                      <span className="font-medium text-gray-900">{service.category}</span>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <button className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                      <Eye className="w-4 h-4 mr-1 inline" />
                      Preview
                    </button>
                    <button className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                      <Edit className="w-4 h-4 mr-1 inline" />
                      Edit
                    </button>
                    <button 
                      onClick={() => deleteService(service.id)}
                      className="px-3 py-2 text-sm border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <DollarSign className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Services Created Yet
            </h3>
            <p className="text-gray-600 mb-6">
              Create your first custom service to start offering specialized solutions to clients
            </p>
            <button 
              onClick={() => setShowServiceForm(true)}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Service
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConsultantServices;