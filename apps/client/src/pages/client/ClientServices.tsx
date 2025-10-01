import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { ShoppingCart, DollarSign, Check, Clock, AlertCircle, Package, Globe, X } from 'lucide-react';
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

interface Country {
  code: string;
  name_en: string;
}

interface CrossAssignment {
  id: string;
  service_description: string;
  estimated_price: number | null;
  status: string;
  target_country_code: string;
  referring_consultant_name: string;
  referring_country_code: string;
  target_consultant_name: string;
  created_at: string;
}

const ClientServices = () => {
  const [availableServices, setAvailableServices] = useState<CustomService[]>([]);
  const [myOrders, setMyOrders] = useState<ServiceOrder[]>([]);
  const [crossAssignments, setCrossAssignments] = useState<CrossAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userCountry, setUserCountry] = useState('');
  const [showCrossAssignmentModal, setShowCrossAssignmentModal] = useState(false);
  const [activeCountries, setActiveCountries] = useState<Country[]>([]);
  const [crossAssignmentForm, setCrossAssignmentForm] = useState({
    target_country_code: '',
    service_description: '',
    estimated_price: ''
  });
  const authFetch = createAuthenticatedFetch();

  useEffect(() => {
    fetchUserProfile();
  }, []);

  useEffect(() => {
    if (userCountry) {
      fetchAvailableServices();
      fetchMyOrders();
      fetchCrossAssignments();
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
      const response = await authFetch('/api/consultant-services/client-orders');
      
      if (!response.ok) {
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

  const fetchCrossAssignments = async () => {
    try {
      const response = await authFetch('/api/cross-assignments/client');
      
      if (!response.ok) {
        setCrossAssignments([]);
        return;
      }

      const data = await response.json();
      setCrossAssignments(data.assignments || []);
    } catch (err: any) {
      console.error('Error fetching cross assignments:', err);
      setCrossAssignments([]);
    }
  };

  const fetchActiveCountries = async () => {
    try {
      const response = await authFetch('/api/cross-assignments/active-countries');
      
      if (!response.ok) {
        throw new Error('Failed to fetch countries');
      }

      const data = await response.json();
      setActiveCountries(data.countries || []);
    } catch (err: any) {
      console.error('Error fetching active countries:', err);
      alert('Failed to load available countries');
    }
  };

  const handleOpenCrossAssignmentModal = () => {
    setShowCrossAssignmentModal(true);
    fetchActiveCountries();
  };

  const handleCloseCrossAssignmentModal = () => {
    setShowCrossAssignmentModal(false);
    setCrossAssignmentForm({
      target_country_code: '',
      service_description: '',
      estimated_price: ''
    });
  };

  const handleSubmitCrossAssignment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!crossAssignmentForm.target_country_code || !crossAssignmentForm.service_description) {
      alert('Please fill in all required fields');
      return;
    }

    if (!confirm('Submit service request to consultant in ' + crossAssignmentForm.target_country_code + '?')) {
      return;
    }

    try {
      const response = await authFetch('/api/cross-assignments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          target_country_code: crossAssignmentForm.target_country_code,
          service_description: crossAssignmentForm.service_description,
          estimated_price: crossAssignmentForm.estimated_price ? parseFloat(crossAssignmentForm.estimated_price) : undefined
        })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to submit request');
      }

      alert('Service request submitted successfully! The consultant will review your request.');
      handleCloseCrossAssignmentModal();
      await fetchCrossAssignments();
    } catch (err: any) {
      console.error('Error submitting cross assignment:', err);
      alert(err.message || 'Failed to submit request');
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
            <div className="mb-6 flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Available Services</h1>
                <p className="text-gray-600 mt-1">
                  Custom services for {userCountry} from your consultant
                </p>
              </div>
              <button
                onClick={handleOpenCrossAssignmentModal}
                className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <Globe className="w-4 h-4 mr-2" />
                Request from Another Country
              </button>
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

          {/* Cross-Country Requests */}
          {crossAssignments.length > 0 && (
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Cross-Country Service Requests</h2>
                <p className="text-gray-600 mt-1">
                  Your requests for services from consultants in other countries
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 divide-y divide-gray-200">
                {crossAssignments.map((assignment) => (
                  <div key={assignment.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {assignment.service_description}
                          </h3>
                          {getStatusBadge(assignment.status)}
                        </div>
                        <div className="space-y-1 text-sm text-gray-600">
                          <p>Target Country: <span className="font-medium">{assignment.target_country_code}</span></p>
                          <p>Target Consultant: <span className="font-medium">{assignment.target_consultant_name}</span></p>
                          <p>Your Consultant: <span className="font-medium">{assignment.referring_consultant_name}</span> ({assignment.referring_country_code})</p>
                          <p className="text-xs text-gray-500">
                            Requested: {new Date(assignment.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      {assignment.estimated_price && (
                        <div className="text-right ml-4">
                          <p className="text-sm text-gray-600">Estimated</p>
                          <p className="text-xl font-bold text-gray-900">
                            ${assignment.estimated_price.toLocaleString()}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

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

        {/* Cross Assignment Modal */}
        {showCrossAssignmentModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Request Service from Another Country
                  </h2>
                  <button
                    onClick={handleCloseCrossAssignmentModal}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <form onSubmit={handleSubmitCrossAssignment} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Target Country *
                    </label>
                    <select
                      value={crossAssignmentForm.target_country_code}
                      onChange={(e) => setCrossAssignmentForm({
                        ...crossAssignmentForm,
                        target_country_code: e.target.value
                      })}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="">Select a country</option>
                      {activeCountries
                        .filter(c => c.code !== userCountry)
                        .map(country => (
                          <option key={country.code} value={country.code}>
                            {country.name_en} ({country.code})
                          </option>
                        ))}
                    </select>
                    <p className="text-xs text-gray-500 mt-1">
                      Select the country where you need services
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Service Description *
                    </label>
                    <textarea
                      value={crossAssignmentForm.service_description}
                      onChange={(e) => setCrossAssignmentForm({
                        ...crossAssignmentForm,
                        service_description: e.target.value
                      })}
                      required
                      rows={4}
                      placeholder="Describe what service you need (e.g., Company registration in Costa Rica, Tax consultation for international business, etc.)"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Estimated Budget (Optional)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2 text-gray-500">$</span>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={crossAssignmentForm.estimated_price}
                        onChange={(e) => setCrossAssignmentForm({
                          ...crossAssignmentForm,
                          estimated_price: e.target.value
                        })}
                        placeholder="0.00"
                        className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Optional: Provide your budget estimate
                    </p>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-900">
                      <strong>How it works:</strong><br />
                      Your request will be forwarded to a consultant in the target country. 
                      Your current consultant will receive a 15% referral commission if the request is approved.
                    </p>
                  </div>

                  <div className="flex space-x-4">
                    <button
                      type="button"
                      onClick={handleCloseCrossAssignmentModal}
                      className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      Submit Request
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ClientServices;
