import { useState, useEffect } from 'react';
import { Search, MoreVertical, User, Building, Phone, Mail, Calendar } from 'lucide-react';
import { supabase } from '@consulting19/shared/lib/supabase';
import { useAuth } from '@consulting19/shared';

interface Client {
  id: string;
  profile_id: string;
  company_name: string;
  status: 'active' | 'inactive' | 'pending' | 'completed';
  priority: 'low' | 'medium' | 'high';
  notes: string;
  created_at: string;
  updated_at: string;
  user_profiles: {
    full_name: string;
    email: string;
    phone?: string;
  } | null;
}

const ConsultantClients = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const { user, profile } = useAuth();

  useEffect(() => {
    const fetchClients = async () => {
      if (!user || !profile) return;

      try {
        setLoading(true);
        
        // Get clients directly assigned to this consultant
      const { data: clientsData, error } = await supabase
        .from('clients')
        .select(`
          id,
          profile_id,
          company_name,
          status,
          priority,
          notes,
          created_at,
          updated_at,
          user_profiles!profile_id(
            full_name,
            email,
            phone
          )
        `)
        .eq('assigned_consultant_id', profile.id);

        if (error) {
          console.error('Error fetching clients:', error);
          return;
        }

        // Transform the data to match our interface
        const transformedClients = clientsData?.map(client => ({
          ...client,
          user_profiles: Array.isArray(client.user_profiles) 
            ? client.user_profiles[0] || null 
            : client.user_profiles
        })) || [];
        
        setClients(transformedClients);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, [user, profile]);

  const filteredClients = clients.filter(client => {
    const matchesSearch = 
      client.user_profiles?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.company_name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || client.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || client.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });



  const getStatusColor = (status: string) => {
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
              <div key={i} className="h-48 bg-gray-200 rounded-lg"></div>
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
          <div className="mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Clients</h1>
              <p className="text-gray-600">Manage your client relationships</p>
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
                  <option value="all">All Clients</option>
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
        </div>

        {/* Clients Grid */}
        {filteredClients.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredClients.map((client) => (
              <div key={client.id} className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-200 group">
                <div className="p-6">
                  {/* Header with Avatar and Menu */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                          <User className="w-6 h-6 text-white" />
                        </div>
                        <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                          client.status === 'active' ? 'bg-green-500' : 
                          client.status === 'pending' ? 'bg-yellow-500' : 
                          client.status === 'inactive' ? 'bg-gray-400' : 'bg-blue-500'
                        }`}></div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 truncate text-lg">
                          {client.user_profiles?.full_name || 'Unknown'}
                        </h3>
                        {client.company_name && (
                          <div className="flex items-center mt-1">
                            <Building className="w-3 h-3 text-gray-400 mr-1" />
                            <p className="text-sm text-gray-600 truncate">{client.company_name}</p>
                          </div>
                        )}
                      </div>
                    </div>
                    <button className="text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Contact Information */}
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center text-sm text-gray-600 bg-gray-50 rounded-lg p-2">
                      <Mail className="w-4 h-4 mr-2 text-blue-500" />
                      <span className="truncate">{client.user_profiles?.email}</span>
                    </div>
                    {client.user_profiles?.phone && (
                      <div className="flex items-center text-sm text-gray-600 bg-gray-50 rounded-lg p-2">
                        <Phone className="w-4 h-4 mr-2 text-green-500" />
                        <span className="truncate">{client.user_profiles.phone}</span>
                      </div>
                    )}
                  </div>

                  {/* Status and Priority Badges */}
                  <div className="flex justify-between items-center mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${getStatusColor(client.status)}`}>
                      {client.status}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${getPriorityColor(client.priority)}`}>
                      {client.priority} Priority
                    </span>
                  </div>

                  {/* Client Since */}
                  <div className="flex items-center text-xs text-gray-500 mb-4">
                    <Calendar className="w-3 h-3 mr-1" />
                    Client since {new Date(client.created_at).toLocaleDateString('tr-TR', { 
                      year: 'numeric', 
                      month: 'short' 
                    })}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    <button className="flex-1 px-3 py-2 text-sm bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors font-medium">
                      View Profile
                    </button>
                    <button className="flex-1 px-3 py-2 text-sm bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium">
                      Create Task
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No clients found
            </h3>
            <p className="text-gray-600">
              No clients have been assigned to you yet. Clients are added to the system through the registration process.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConsultantClients;