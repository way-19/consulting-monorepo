import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '@consulting19/shared';
import { 
  User, 
  DollarSign, 
  MessageSquare, 
  Calendar,
  FileText,
  CheckCircle,
  Building,
  Mail,
  Phone,
  Star,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import { supabase } from '@consulting19/shared/lib/supabase';

interface ClientStats {
  activeProjects: number;
  completedTasks: number;
  totalSpent: number;
  unreadMessages: number;
  upcomingMeetings: number;
  documentsUploaded: number;
}

interface AssignedConsultant {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  specialization?: string;
  rating?: number;
  profile_image?: string;
}

interface RecentActivity {
  id: string;
  action_type: string;
  description: string;
  created_at: string;
}

interface Project {
  id: string;
  name: string;
  status: string;
  progress: number;
  created_at: string;
}

const ClientDashboard = () => {
  const { user, profile } = useAuth();
  const [stats, setStats] = useState<ClientStats>({
    activeProjects: 0,
    completedTasks: 0,
    totalSpent: 0,
    unreadMessages: 0,
    upcomingMeetings: 0,
    documentsUploaded: 0
  });
  const [assignedConsultant, setAssignedConsultant] = useState<AssignedConsultant | null>(null);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [activeProjects, setActiveProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && profile) {
      fetchDashboardData();
    }
  }, [user, profile]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch client data
      const { data: clientData } = await supabase
        .from('clients')
        .select('assigned_consultant_id')
        .eq('user_id', user?.id)
        .single();

      // Fetch assigned consultant details
      if (clientData?.assigned_consultant_id) {
        const { data: consultantData } = await supabase
          .from('user_profiles')
          .select('id, first_name, last_name, email, phone, specialization, profile_image')
          .eq('id', clientData.assigned_consultant_id)
          .single();

        if (consultantData) {
          // Get consultant rating
          const { data: ratingData } = await supabase
            .from('client_feedback')
            .select('rating')
            .eq('consultant_id', consultantData.id);

          const avgRating = ratingData && ratingData.length > 0
            ? ratingData.reduce((sum, r) => sum + r.rating, 0) / ratingData.length
            : 0;

          setAssignedConsultant({
            ...consultantData,
            rating: avgRating
          });
        }
      }

      // Fetch dashboard stats in parallel
      const [
        projectsData,
        tasksData,
        ordersData,
        messagesData,
        meetingsData,
        documentsData,
        activityData
      ] = await Promise.all([
        // Active projects
        supabase
          .from('projects')
          .select('id, name, status, progress, created_at')
          .eq('client_id', user?.id)
          .in('status', ['active', 'in_progress']),
        
        // Completed tasks
        supabase
          .from('tasks')
          .select('id')
          .eq('client_id', user?.id)
          .eq('status', 'completed'),
        
        // Total spent
        supabase
          .from('service_orders')
          .select('total_amount')
          .eq('client_id', user?.id)
          .in('status', ['completed', 'paid']),
        
        // Unread messages
        supabase
          .from('messages')
          .select('id')
          .eq('receiver_id', user?.id)
          .eq('is_read', false),
        
        // Upcoming meetings
        supabase
          .from('meetings')
          .select('id')
          .eq('client_id', user?.id)
          .gte('start_time', new Date().toISOString()),
        
        // Documents uploaded
        supabase
          .from('documents')
          .select('id')
          .eq('client_id', user?.id),
        
        // Recent activity
        supabase
          .from('audit_logs')
          .select('id, action_type, description, created_at')
          .eq('user_id', user?.id)
          .order('created_at', { ascending: false })
          .limit(5)
      ]);

      // Calculate stats
      const activeProjects = projectsData.data?.length || 0;
      const completedTasks = tasksData.data?.length || 0;
      const totalSpent = ordersData.data?.reduce((sum, order) => sum + Number(order.total_amount), 0) || 0;
      const unreadMessages = messagesData.data?.length || 0;
      const upcomingMeetings = meetingsData.data?.length || 0;
      const documentsUploaded = documentsData.data?.length || 0;

      setStats({
        activeProjects,
        completedTasks,
        totalSpent,
        unreadMessages,
        upcomingMeetings,
        documentsUploaded
      });

      setActiveProjects(projectsData.data || []);
      setRecentActivity(activityData.data || []);

    } catch (err) {
      console.error('Dashboard data fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'on_hold': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Helmet>
        <title>Client Dashboard - Consulting19</title>
      </Helmet>

      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          Welcome back, {profile?.full_name}!
        </h1>
        <p className="text-blue-100">
          Here's an overview of your projects and activities.
        </p>
      </div>

      {/* Assigned Consultant Card */}
      {assignedConsultant && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <User className="h-5 w-5 mr-2 text-blue-600" />
            Your Assigned Consultant
          </h2>
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              {assignedConsultant.profile_image ? (
                <img
                  src={assignedConsultant.profile_image}
                  alt={`${assignedConsultant.first_name} ${assignedConsultant.last_name}`}
                  className="h-16 w-16 rounded-full object-cover"
                />
              ) : (
                <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center">
                  <User className="h-8 w-8 text-blue-600" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-medium text-gray-900">
                {assignedConsultant.first_name} {assignedConsultant.last_name}
              </h3>
              {assignedConsultant.specialization && (
                <p className="text-sm text-gray-600 mb-2">{assignedConsultant.specialization}</p>
              )}
              {assignedConsultant.rating && assignedConsultant.rating > 0 && (
                <div className="flex items-center mb-3">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="ml-1 text-sm text-gray-600">
                    {assignedConsultant.rating.toFixed(1)} rating
                  </span>
                </div>
              )}
              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-1" />
                  <a href={`mailto:${assignedConsultant.email}`} className="hover:text-blue-600">
                    {assignedConsultant.email}
                  </a>
                </div>
                {assignedConsultant.phone && (
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-1" />
                    <a href={`tel:${assignedConsultant.phone}`} className="hover:text-blue-600">
                      {assignedConsultant.phone}
                    </a>
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-col space-y-2">
              <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                <MessageSquare className="h-4 w-4 mr-1" />
                Message
              </button>
              <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                <Calendar className="h-4 w-4 mr-1" />
                Schedule
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Building className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Projects</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.activeProjects}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completed Tasks</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.completedTasks}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <DollarSign className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Spent</p>
              <p className="text-2xl font-semibold text-gray-900">{formatCurrency(stats.totalSpent)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <MessageSquare className="h-8 w-8 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Unread Messages</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.unreadMessages}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Calendar className="h-8 w-8 text-indigo-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Upcoming Meetings</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.upcomingMeetings}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <FileText className="h-8 w-8 text-teal-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Documents</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.documentsUploaded}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Active Projects and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Projects */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Active Projects</h2>
          <div className="space-y-4">
            {activeProjects.length > 0 ? (
              activeProjects.slice(0, 3).map((project) => (
                <div key={project.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-gray-900">{project.name}</h3>
                    <div className="mt-1 flex items-center space-x-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                        {project.status}
                      </span>
                      <span className="text-xs text-gray-500">
                        {project.progress}% complete
                      </span>
                    </div>
                  </div>
                  <ExternalLink className="h-4 w-4 text-gray-400" />
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No active projects</p>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivity.length > 0 ? (
              recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <div className="h-2 w-2 bg-blue-600 rounded-full mt-2"></div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{activity.description}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(activity.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No recent activity</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;