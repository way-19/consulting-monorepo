import { useState, useEffect } from 'react';
import { Search, User, Building, MessageSquare, DollarSign, MoreVertical } from 'lucide-react';
import { useAuth, createAuthenticatedFetch } from '@consulting19/shared';

interface Client {
  id: string;
  profile_id: string;
  company_name: string;
  status: 'active' | 'inactive' | 'pending' | 'completed';
  priority: 'low' | 'medium' | 'high';
  notes: string;
  created_at: string;
  updated_at: string;
  first_name: string;
  last_name: string;
  email: string;
  avatar_url?: string;
}

interface ClientStats {
  projects: number;
  tasks: number;
  spent: number;
}

const ConsultantClients = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [clientStats, setClientStats] = useState<Record<string, ClientStats>>({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const { user } = useAuth();

  const authFetch = createAuthenticatedFetch();

  useEffect(() => {
    fetchClients();
  }, [user]);

  const fetchClients = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      const response = await authFetch('/api/clients?page=1&limit=100', {
        method: 'GET'
      });

      if (!response.ok) {
        throw new Error('Failed to fetch clients');
      }

      const data = await response.json();
      setClients(data.clients || []);
      
      // Fetch stats for each client
      if (data.clients && data.clients.length > 0) {
        fetchAllClientStats(data.clients);
      }
    } catch (error) {
      console.error('Error fetching clients:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllClientStats = async (clientsList: Client[]) => {
    const statsPromises = clientsList.map(async (client) => {
      try {
        const response = await authFetch(`/api/clients/${client.id}/stats`, {
          method: 'GET'
        });

        if (response.ok) {
          const data = await response.json();
          return { clientId: client.id, stats: data.stats };
        }
      } catch (error) {
        console.error(`Error fetching stats for client ${client.id}:`, error);
      }
      return { clientId: client.id, stats: { projects: 0, tasks: 0, spent: 0 } };
    });

    const statsResults = await Promise.all(statsPromises);
    const statsMap: Record<string, ClientStats> = {};
    statsResults.forEach(result => {
      if (result) {
        statsMap[result.clientId] = result.stats;
      }
    });
    setClientStats(statsMap);
  };

  const handleStatusChange = async (clientId: string, newStatus: string) => {
    // TODO: Implement status update API endpoint
    console.log('Status change:', clientId, newStatus);
  };

  const handlePriorityChange = async (clientId: string, newPriority: string) => {
    // TODO: Implement priority update API endpoint
    console.log('Priority change:', clientId, newPriority);
  };

  const filteredClients = clients.filter(client => {
    const fullName = `${client.first_name || ''} ${client.last_name || ''}`.trim();
    
    const matchesSearch = 
      fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || client.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || client.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getStatusBgColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-orange-100 text-orange-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Clients</h1>
          <p className="text-gray-600">Manage and track your client relationships</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Clients</p>
                <p className="text-3xl font-bold text-gray-900">{clients.length}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <User className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Active Clients</p>
                <p className="text-3xl font-bold text-gray-900">
                  {clients.filter(c => c.status === 'active').length}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <User className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">High Priority</p>
                <p className="text-3xl font-bold text-gray-900">
                  {clients.filter(c => c.priority === 'high').length}
                </p>
              </div>
              <div className="p-3 bg-red-100 rounded-lg">
                <User className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Avg Performance</p>
                <p className="text-3xl font-bold text-gray-900">0%</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <User className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search clients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-4">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="pending">Pending</option>
              </select>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Priorities</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Clients Grid */}
        {filteredClients.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClients.map((client) => {
              const stats = clientStats[client.id] || { projects: 0, tasks: 0, spent: 0 };
              const fullName = `${client.first_name || ''} ${client.last_name || ''}`.trim() || 'Unknown';
              
              return (
                <div key={client.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-200">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="w-6 h-6 text-blue-600" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 truncate">{fullName}</h3>
                        <div className="flex items-center mt-1">
                          <Building className="w-3 h-3 text-gray-400 mr-1 flex-shrink-0" />
                          <p className="text-sm text-gray-600 truncate">{client.company_name}</p>
                        </div>
                      </div>
                    </div>
                    <button className="text-gray-400 hover:text-gray-600 ml-2">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Tags */}
                  <div className="flex items-center space-x-2 mb-4">
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                      client
                    </span>
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                      EN
                    </span>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="bg-blue-50 rounded-lg p-3 text-center">
                      <div className="text-2xl font-bold text-blue-600">{stats.projects}</div>
                      <div className="text-xs text-blue-600 mt-1">Projects</div>
                    </div>
                    <div className="bg-orange-50 rounded-lg p-3 text-center">
                      <div className="text-2xl font-bold text-orange-600">{stats.tasks}</div>
                      <div className="text-xs text-orange-600 mt-1">Tasks</div>
                    </div>
                    <div className="bg-green-50 rounded-lg p-3 text-center">
                      <div className="text-2xl font-bold text-green-600">
                        ${stats.spent.toFixed(0)}
                      </div>
                      <div className="text-xs text-green-600 mt-1">Spent</div>
                    </div>
                  </div>

                  {/* Status and Priority Dropdowns */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <select
                      value={client.status}
                      onChange={(e) => handleStatusChange(client.id, e.target.value)}
                      className={`w-full px-3 py-2 rounded-lg text-sm font-medium border-0 focus:ring-2 focus:ring-blue-500 ${getStatusBgColor(client.status)}`}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="pending">Pending</option>
                      <option value="completed">Completed</option>
                    </select>
                    
                    <select
                      value={client.priority}
                      onChange={(e) => handlePriorityChange(client.id, e.target.value)}
                      className={`w-full px-3 py-2 rounded-lg text-sm font-medium border-0 focus:ring-2 focus:ring-blue-500 ${getPriorityColor(client.priority)}`}
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-2">
                    <button className="flex items-center justify-center space-x-2 px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700">
                      <User className="w-4 h-4" />
                      <span>Profile</span>
                    </button>
                    <button className="flex items-center justify-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                      <Building className="w-4 h-4" />
                      <span>Task</span>
                    </button>
                    <button className="flex items-center justify-center space-x-2 px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700">
                      <MessageSquare className="w-4 h-4" />
                      <span>Message</span>
                    </button>
                    <button className="flex items-center justify-center space-x-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium">
                      <DollarSign className="w-4 h-4" />
                      <span>Fee</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No clients found
            </h3>
            <p className="text-gray-600">
              {searchTerm || statusFilter !== 'all' || priorityFilter !== 'all'
                ? 'No clients match your filters'
                : 'No clients have been assigned to you yet'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConsultantClients;
