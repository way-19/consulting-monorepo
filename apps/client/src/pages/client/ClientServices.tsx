import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { ShoppingCart, DollarSign, Check, Clock, AlertCircle, Package } from 'lucide-react';
import { createAuthenticatedFetch } from '@consulting19/shared';

interface CustomService {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  country_code: string;
  consultant_name: string;
}

interface ServiceOrder {
  id: string;
  order_number: string;
  service_name: string;
  service_category: string;
  total_amount: number;
  status: string;
  created_at: string;
  completed_at: string | null;
}

const ClientServices = () => {
  const [availableServices, setAvailableServices] = useState<CustomService[]>([]);
  const [myOrders, setMyOrders] = useState<ServiceOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userCountry, setUserCountry] = useState('');
  const authFetch = createAuthenticatedFetch();

  useEffect(() => {
    fetchUserProfile();
  }, []);

  useEffect(() => {
    if (userCountry) {
      fetchAvailableServices();
      fetchMyOrders();
    }
  }, [userCountry]);

  const fetchUserProfile = async () => {
    try {
      const response = await authFetch('/api/users/profile');
      
      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }

      const data = await response.json();
      setUserCountry(data.user.country_code || 'GE'); // Default to Georgia if not set
    } catch (err: any) {
      console.error('Error fetching profile:', err);
      setUserCountry('GE'); // Fallback
    }
  };

  const fetchAvailableServices = async () => {
    try {
      setLoading(true);
      const response = await authFetch(`/api/consultant-services/by-country/${userCountry}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch services');
      }

      const data = await response.json();
      setAvailableServices(data.services || []);
    } catch (err: any) {
      console.error('Error fetching services:', err);
      setError(err.message || 'Failed to load services');
    } finally {
      setLoading(false);
    }
  };

  const fetchMyOrders = async () => {
    try {
      // Fetch client's service orders
      const response = await authFetch('/api/consultant-services/client-orders');
      
      if (!response.ok) {
        // If endpoint doesn't exist, just return empty
        setMyOrders([]);
        return;
      }

      const data = await response.json();
      setMyOrders(data.orders || []);
    } catch (err: any) {
      console.error('Error fetching orders:', err);
      setMyOrders([]);
    }
  };

  const handlePurchaseService = async (serviceId: string, serviceName: string, price: number) => {
    if (!confirm(`Purchase "${serviceName}" for $${price}?`)) {
      return;
    }

    try {
      // Create service order
      const response = await authFetch('/api/consultant-services/purchase', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          consultant_custom_service_id: serviceId
        })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to purchase service');
      }

      alert('Service purchased successfully! Your consultant will be notified.');
      await fetchMyOrders();
    } catch (err: any) {
      console.error('Error purchasing service:', err);
      alert(err.message || 'Failed to purchase service');
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; color: string; icon: JSX.Element }> = {
      pending: {
        label: 'Pending',
        color: 'bg-yellow-100 text-yellow-800',
        icon: <Clock className="w-4 h-4" />
      },
      in_progress: {
        label: 'In Progress',
        color: 'bg-blue-100 text-blue-800',
        icon: <Package className="w-4 h-4" />
      },
      completed: {
        label: 'Completed',
        color: 'bg-green-100 text-green-800',
        icon: <Check className="w-4 h-4" />
      },
      cancelled: {
        label: 'Cancelled',
        color: 'bg-red-100 text-red-800',
        icon: <AlertCircle className="w-4 h-4" />
      }
    };

    const config = statusConfig[status] || statusConfig.pending;

    return (
      <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.icon}
        <span>{config.label}</span>
      </span>
    );
  };

  if (loading) {
    return (
      <>
        <Helmet>
          <title>Services - Client Portal</title>
        </Helmet>
        
        <div className="min-h-screen bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-gray-200 rounded w-1/4"></div>
              <div className="grid grid-cols-3 gap-6">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Services - Client Portal</title>
      </Helmet>
      
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          {/* Available Services */}
          <div>
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900">Available Services</h1>
              <p className="text-gray-600 mt-1">
                Custom services for {userCountry} from your consultant
              </p>
            </div>

            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                <div>
                  <h3 className="text-sm font-semibold text-red-900">Error</h3>
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            )}

            {availableServices.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {availableServices.map((service) => (
                  <div key={service.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
                    <div className="p-6">
                      <div className="mb-4">
                        {service.category && (
                          <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full mb-3">
                            {service.category}
                          </span>
                        )}
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          {service.name}
                        </h3>
                        <p className="text-sm text-gray-600 mb-3">
                          {service.description || 'No description available'}
                        </p>
                        <p className="text-xs text-gray-500">
                          Provided by: {service.consultant_name}
                        </p>
                      </div>

                      <div className="border-t border-gray-200 pt-4">
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-sm text-gray-600">Price:</span>
                          <span className="text-2xl font-bold text-gray-900">
                            ${service.price.toLocaleString()}
                          </span>
                        </div>

                        <button
                          onClick={() => handlePurchaseService(service.id, service.name, service.price)}
                          className="w-full inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <ShoppingCart className="w-4 h-4 mr-2" />
                          Purchase Service
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                <DollarSign className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No Services Available
                </h3>
                <p className="text-gray-600">
                  Your consultant hasn't created any custom services yet for {userCountry}
                </p>
              </div>
            )}
          </div>

          {/* My Service Orders */}
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">My Service Orders</h2>
              <p className="text-gray-600 mt-1">
                Track the status of your purchased services
              </p>
            </div>

            {myOrders.length > 0 ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 divide-y divide-gray-200">
                {myOrders.map((order) => (
                  <div key={order.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {order.service_name}
                          </h3>
                          {getStatusBadge(order.status)}
                        </div>
                        {order.service_category && (
                          <p className="text-sm text-gray-600 mb-2">
                            Category: {order.service_category}
                          </p>
                        )}
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>Order #{order.order_number}</span>
                          <span>•</span>
                          <span>{new Date(order.created_at).toLocaleDateString()}</span>
                          {order.completed_at && (
                            <>
                              <span>•</span>
                              <span>Completed: {new Date(order.completed_at).toLocaleDateString()}</span>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="text-right ml-4">
                        <p className="text-xl font-bold text-gray-900">
                          ${order.total_amount.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No Service Orders Yet
                </h3>
                <p className="text-gray-600">
                  Purchase a service to get started
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ClientServices;
