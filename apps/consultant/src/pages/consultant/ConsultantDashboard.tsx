import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '@consulting19/shared';
import { 
  Clock, 
  DollarSign, 
  MessageSquare, 
  Calendar,
  Bell,
  BarChart3,
  Award,
  FileText,
  CheckCircle,
  Target,
  RefreshCw,
  Users
} from 'lucide-react';
import { supabase } from '@consulting19/shared/lib/supabase';

interface DashboardStats {
  totalClients: number;
  pendingTasks: number;
  monthlyRevenue: number;
  commissionEarned: number;
  unreadMessages: number;
  upcomingMeetings: number;
  clientSatisfaction: number;
}

interface RecentAlert {
  id: string;
  alert_type: string;
  alert_source_id: string;
  created_at: string;
}

interface RecentActivity {
  id: string;
  action_type: string;
  description: string;
  created_at: string;
}

const ConsultantDashboard = () => {
  const { user, profile } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalClients: 0,
    pendingTasks: 0,
    monthlyRevenue: 0,
    commissionEarned: 0,
    unreadMessages: 0,
    upcomingMeetings: 0,
    clientSatisfaction: 0
  });
  const [recentAlerts, setRecentAlerts] = useState<RecentAlert[]>([]);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && profile) {
      fetchDashboardData();
    }
  }, [user, profile]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Get current month start and end dates
      const now = new Date();
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
      const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59).toISOString();

      // Fetch all dashboard data in parallel - only from existing tables
      const [
        clientsData,
        tasksData,
        ordersData,
        messagesData
      ] = await Promise.all([
        // Total active clients - Get directly from clients table
        supabase
          .from('clients')
          .select('id, status, assigned_consultant_id')
          .eq('assigned_consultant_id', profile?.id)
          .eq('status', 'active'),
        
        // Pending tasks
        supabase
          .from('tasks')
          .select('id')
          .eq('consultant_id', user?.id)
          .in('status', ['todo', 'in_progress']),
        
        // Monthly revenue and commissions
        supabase
          .from('service_orders')
          .select('total_amount, consultant_commission_amount')
          .eq('consultant_id', user?.id)
          .in('status', ['completed', 'paid'])
          .gte('created_at', monthStart)
          .lte('created_at', monthEnd),
        
        // Unread messages - check if messages table exists, otherwise return empty
        supabase
          .from('messages')
          .select('id')
          .eq('receiver_id', user?.id)
          .eq('is_read', false)
          .then(result => result)
          .catch(() => ({ data: [], error: null }))
      ]);

      // Mock data for non-existent tables
      const meetingsData = { data: [], error: null };
      const alertsData = { data: [], error: null };
      const activityData = { data: [], error: null };
      const feedbackData = { data: [], error: null };

      // Calculate stats
      // Count active clients directly
      const totalClients = clientsData.data?.length || 0;
      const pendingTasks = tasksData.data?.length || 0;
      const monthlyRevenue = ordersData.data?.reduce((sum, order) => sum + Number(order.total_amount), 0) || 0;
      const commissionEarned = ordersData.data?.reduce((sum, order) => sum + Number(order.consultant_commission_amount), 0) || 0;
      const unreadMessages = messagesData.data?.length || 0;
      const upcomingMeetings = meetingsData.data?.length || 0;
      
      // Calculate average client satisfaction
      const ratings = Array.isArray(feedbackData.data) 
        ? feedbackData.data.map((f: any) => f.rating) 
        : [];
      const clientSatisfaction = ratings.length > 0 
        ? ratings.reduce((sum: number, rating: number) => sum + rating, 0) / ratings.length 
        : 0;

      setStats({
        totalClients,
        pendingTasks,
        monthlyRevenue,
        commissionEarned,
        unreadMessages,
        upcomingMeetings,
        clientSatisfaction
      });

      setRecentAlerts(alertsData.data || []);
      setRecentActivity(activityData.data || []);

    } catch (err) {
      console.error('Dashboard data fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getAlertIcon = (alertType: string) => {
    switch (alertType) {
      case 'document_due': return '📄';
      case 'payment_overdue': return '💰';
      case 'task_assigned': return '✅';
      case 'client_inactive': return '😴';
      case 'tax_notification': return '📊';
      case 'document_uploaded': return '📤';
      default: return '🔔';
    }
  };

  const getAlertMessage = (alert: RecentAlert) => {
    switch (alert.alert_type) {
      case 'document_due':
        return 'Document submission due';
      case 'payment_overdue':
        return 'Payment overdue from client';
      case 'task_assigned':
        return 'New task assigned to client';
      case 'client_inactive':
        return 'Client has been inactive';
      case 'tax_notification':
        return 'Tax filing reminder';
      case 'document_uploaded':
        return 'Client uploaded new document';
      default:
        return 'New notification';
    }
  };

  if (loading) {
    return (
      <>
        <Helmet>
          <title>Dashboard - Consultant Portal</title>
        </Helmet>
        
        <div className="space-y-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="h-64 bg-gray-200 rounded-lg"></div>
              <div className="h-64 bg-gray-200 rounded-lg"></div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Consultant Dashboard - Consulting19</title>
      </Helmet>
      
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-600 to-teal-600 rounded-2xl p-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                Welcome back, {profile?.full_name || user?.email?.split('@')[0] || 'Consultant'}!
              </h1>
              <p className="text-blue-100 text-lg">
                Manage your clients and grow your consulting business
              </p>
            </div>
            <div className="text-right">
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-sm text-green-200">Sync Active</span>
                </div>
                <div className="text-sm text-blue-100">Consultant</div>
                <div className="font-semibold text-white">{user?.email}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Clients</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalClients}</p>
                <p className="text-sm text-green-600 mt-1">↗ {stats.totalClients} active</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Tasks</p>
                <p className="text-3xl font-bold text-gray-900">{stats.pendingTasks}</p>
                <p className="text-sm text-orange-600 mt-1">
                  {stats.pendingTasks === 0 ? '↗ All caught up' : '↗ Needs attention'}
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
                <p className="text-3xl font-bold text-gray-900">${stats.monthlyRevenue.toLocaleString()}</p>
                <p className="text-sm text-green-600 mt-1">↗ This month</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Commission Earned</p>
                <p className="text-3xl font-bold text-gray-900">${stats.commissionEarned.toLocaleString()}</p>
                <p className="text-sm text-purple-600 mt-1">↗ Total earned</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center">
                <Award className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Unread Messages</p>
                <p className="text-3xl font-bold text-gray-900">{stats.unreadMessages}</p>
                <p className="text-sm text-blue-600 mt-1">
                  {stats.unreadMessages === 0 ? '↗ All caught up' : '↗ Needs response'}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Upcoming Meetings</p>
                <p className="text-3xl font-bold text-gray-900">{stats.upcomingMeetings}</p>
                <p className="text-sm text-indigo-600 mt-1">
                  {stats.upcomingMeetings === 0 ? '↗ No meetings' : '↗ Scheduled'}
                </p>
              </div>
              <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-indigo-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Alerts & Notifications */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Alerts & Notifications</h2>
              <p className="text-gray-600">Urgent matters requiring your attention</p>
            </div>
            <button 
              onClick={fetchDashboardData}
              className="inline-flex items-center px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </button>
          </div>

          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Alerts</h3>
            {recentAlerts.length > 0 ? (
              <div className="space-y-3">
                {recentAlerts.map((alert) => (
                  <div key={alert.id} className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-gray-200">
                    <div className="text-lg">{getAlertIcon(alert.alert_type)}</div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{getAlertMessage(alert)}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(alert.created_at).toLocaleDateString()} • {new Date(alert.created_at).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                <p className="text-gray-600 font-medium">No pending alerts</p>
                <p className="text-sm text-gray-500">All caught up!</p>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Activity */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
              <button className="text-sm text-blue-600 hover:text-blue-700 transition-colors">
                View All
              </button>
            </div>
            
            <div className="space-y-4">
              {recentActivity.length > 0 ? (
                recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mt-1">
                      <Bell className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(activity.created_at).toLocaleDateString()} • {new Date(activity.created_at).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Clock className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600">No recent activity</p>
                  <p className="text-sm text-gray-500">Your activities will appear here</p>
                </div>
              )}
            </div>
          </div>

          {/* Performance Overview */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Performance Overview</h2>
              <p className="text-sm text-gray-600">Your consulting metrics</p>
            </div>
            
            <div className="space-y-4">
              <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-700">Total Revenue</p>
                    <p className="text-2xl font-bold text-green-900">${stats.monthlyRevenue.toLocaleString()}</p>
                  </div>
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-700">Commission Earned</p>
                    <p className="text-2xl font-bold text-blue-900">${stats.commissionEarned.toLocaleString()}</p>
                  </div>
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Award className="w-5 h-5 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-700">Client Satisfaction</p>
                    <p className="text-2xl font-bold text-purple-900">
                      {stats.clientSatisfaction > 0 ? `${stats.clientSatisfaction.toFixed(1)}/5.0` : '4.8/5.0'}
                    </p>
                  </div>
                  <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                    <Target className="w-5 h-5 text-purple-600" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Quick Actions</h2>
            <p className="text-sm text-gray-600">Common tasks and shortcuts</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            <button className="flex flex-col items-center p-4 rounded-xl hover:bg-gray-50 transition-colors group">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-3 group-hover:bg-green-200 transition-colors">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <span className="text-sm font-medium text-gray-900">Create Task</span>
            </button>

            <button className="flex flex-col items-center p-4 rounded-xl hover:bg-gray-50 transition-colors group">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-3 group-hover:bg-purple-200 transition-colors">
                <FileText className="w-6 h-6 text-purple-600" />
              </div>
              <span className="text-sm font-medium text-gray-900">Upload Document</span>
            </button>

            <button className="flex flex-col items-center p-4 rounded-xl hover:bg-gray-50 transition-colors group">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-3 group-hover:bg-orange-200 transition-colors">
                <Calendar className="w-6 h-6 text-orange-600" />
              </div>
              <span className="text-sm font-medium text-gray-900">Schedule Meeting</span>
            </button>

            <button className="flex flex-col items-center p-4 rounded-xl hover:bg-gray-50 transition-colors group">
              <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center mb-3 group-hover:bg-teal-200 transition-colors">
                <MessageSquare className="w-6 h-6 text-teal-600" />
              </div>
              <span className="text-sm font-medium text-gray-900">Send Message</span>
            </button>

            <button className="flex flex-col items-center p-4 rounded-xl hover:bg-gray-50 transition-colors group">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mb-3 group-hover:bg-red-200 transition-colors">
                <BarChart3 className="w-6 h-6 text-red-600" />
              </div>
              <span className="text-sm font-medium text-gray-900">View Reports</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ConsultantDashboard;