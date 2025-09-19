import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '@consulting19/shared';
import { 
  BarChart3, 
  CheckCircle, 
  FileText, 
  MessageSquare, 
  Calendar,
  DollarSign,
  User,
  Building,
  Clock,
  TrendingUp,
  AlertTriangle,
  CreditCard,
  FolderOpen,
  Target,
  Mail,
  HelpCircle,
  Settings,
  ArrowRight,
  Plus,
  Bell
} from 'lucide-react';
import { supabase } from '@consulting19/shared/lib/supabase';

interface DashboardStats {
  activeProjects: number;
  pendingTasks: number;
  totalDocuments: number;
  unreadMessages: number;
  totalSpent: number;
  upcomingMeetings: number;
}

interface ConsultantInfo {
  id: string;
  full_name: string;
  email: string;
  status: string;
}

interface RecentActivity {
  id: string;
  action_type: string;
  description: string;
  created_at: string;
}

const ClientDashboard = () => {
  const { user, profile } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    activeProjects: 0,
    pendingTasks: 0,
    totalDocuments: 0,
    unreadMessages: 0,
    totalSpent: 0,
    upcomingMeetings: 0
  });
  const [consultant, setConsultant] = useState<ConsultantInfo | null>(null);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [pendingPayments, setPendingPayments] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && profile) {
      fetchDashboardData();
    }
  }, [user, profile]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Get client data
      const { data: clientData } = await supabase
        .from('clients')
        .select('id, assigned_consultant_id')
        .eq('profile_id', user?.id)
        .maybeSingle();

      if (clientData) {
        // Fetch consultant info
        if (clientData.assigned_consultant_id) {
          const { data: consultantData } = await supabase
            .from('user_profiles')
            .select('id, full_name, email')
            .eq('id', clientData.assigned_consultant_id)
            .single();

          if (consultantData) {
            setConsultant({
              ...consultantData,
              status: 'online'
            });
          }
        }

        // Fetch dashboard stats
        const [projectsData, tasksData, documentsData, messagesData, invoicesData, meetingsData] = await Promise.all([
          supabase.from('projects').select('id').eq('client_id', clientData.id).eq('status', 'active'),
          supabase.from('tasks').select('id').eq('client_id', clientData.id).eq('status', 'todo'),
          supabase.from('documents').select('id').eq('client_id', clientData.id),
          supabase.from('messages').select('id').eq('receiver_id', user?.id).eq('is_read', false),
          supabase.from('invoices').select('amount_due, status').eq('client_id', clientData.id),
          supabase.from('meetings').select('id').eq('client_id', clientData.id).gte('start_time', new Date().toISOString())
        ]);

        const totalSpent = invoicesData.data?.filter(i => i.status === 'paid').reduce((sum, i) => sum + Number(i.amount_due), 0) || 0;
        const pendingAmount = invoicesData.data?.filter(i => i.status === 'pending').reduce((sum, i) => sum + Number(i.amount_due), 0) || 0;

        setStats({
          activeProjects: projectsData.data?.length || 0,
          pendingTasks: tasksData.data?.length || 0,
          totalDocuments: documentsData.data?.length || 0,
          unreadMessages: messagesData.data?.length || 0,
          totalSpent,
          upcomingMeetings: meetingsData.data?.length || 0
        });

        setPendingPayments(pendingAmount);

        // Fetch recent activity
        const { data: activityData } = await supabase
          .from('audit_logs')
          .select('id, action_type, description, created_at')
          .eq('user_id', user?.id)
          .order('created_at', { ascending: false })
          .limit(5);

        setRecentActivity(activityData || []);
      }
    } catch (err) {
      console.error('Dashboard data fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Helmet>
          <title>Dashboard - Client Portal</title>
        </Helmet>
        
        <div className="space-y-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Dashboard - Client Portal</title>
      </Helmet>
      
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-600 to-teal-600 rounded-2xl p-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                Welcome, {profile?.full_name || user?.email?.split('@') || 'Client'}!
              </h1>
              <p className="text-blue-100 text-lg">
                Your business expansion dashboard
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-blue-100 mb-1">Your Consultant</div>
              {consultant ? (
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-white/30 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-white">{consultant.full_name}</div>
                      <div className="text-xs text-blue-100">{consultant.email}</div>
                      <div className="flex items-center space-x-1 mt-1">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        <span className="text-xs text-green-200">Online</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2 mt-3">
                    <button className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors">
                      <MessageSquare className="w-4 h-4 mr-1 inline" />
                      Message
                    </button>
                    <button className="flex-1 px-3 py-2 bg-white/20 text-white rounded-lg text-sm hover:bg-white/30 transition-colors">
                      <Calendar className="w-4 h-4 mr-1 inline" />
                      Schedule
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 text-center">
                  <User className="w-8 h-8 text-white/60 mx-auto mb-2" />
                  <div className="text-sm text-white/80">No consultant assigned</div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Projects</p>
                <p className="text-3xl font-bold text-gray-900">{stats.activeProjects}</p>
                <p className="text-sm text-green-600 mt-1">↗ 1 active</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
                <FolderOpen className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Tasks</p>
                <p className="text-3xl font-bold text-gray-900">{stats.pendingTasks}</p>
                <p className="text-sm text-orange-600 mt-1">↗ All caught up</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Documents</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalDocuments}</p>
                <p className="text-sm text-green-600 mt-1">↗ 1 uploaded</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Unread Messages</p>
                <p className="text-3xl font-bold text-gray-900">{stats.unreadMessages}</p>
                <p className="text-sm text-purple-600 mt-1">↗ All caught up</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Spent</p>
                <p className="text-3xl font-bold text-gray-900">${stats.totalSpent.toLocaleString()}</p>
                <p className="text-sm text-green-600 mt-1">↗ View billing</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Upcoming Meetings</p>
                <p className="text-3xl font-bold text-gray-900">{stats.upcomingMeetings}</p>
                <p className="text-sm text-indigo-600 mt-1">↗ No meetings scheduled</p>
              </div>
              <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-indigo-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Pending Payments Alert */}
        {pendingPayments > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="w-5 h-5 text-yellow-600" />
                <div>
                  <h3 className="text-sm font-semibold text-yellow-800">Pending Payments</h3>
                  <p className="text-sm text-yellow-700">
                    You have ${pendingPayments.toLocaleString()} in pending payments.
                  </p>
                </div>
              </div>
              <button className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors">
                Pay Now
              </button>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Quick Actions</h2>
            <p className="text-sm text-gray-600">Common tasks and shortcuts</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            <button className="flex flex-col items-center p-4 rounded-xl hover:bg-gray-50 transition-colors group">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-3 group-hover:bg-blue-200 transition-colors">
                <FolderOpen className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-sm font-medium text-gray-900">Projects</span>
              <span className="text-xs text-gray-500">View and manage your projects</span>
            </button>

            <button className="flex flex-col items-center p-4 rounded-xl hover:bg-gray-50 transition-colors group">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-3 group-hover:bg-green-200 transition-colors">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <span className="text-sm font-medium text-gray-900">Tasks</span>
              <span className="text-xs text-gray-500">Check your pending tasks</span>
            </button>

            <button className="flex flex-col items-center p-4 rounded-xl hover:bg-gray-50 transition-colors group">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-3 group-hover:bg-purple-200 transition-colors">
                <FileText className="w-6 h-6 text-purple-600" />
              </div>
              <span className="text-sm font-medium text-gray-900">Documents</span>
              <span className="text-xs text-gray-500">View official company documents</span>
            </button>

            <button className="flex flex-col items-center p-4 rounded-xl hover:bg-gray-50 transition-colors group">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-3 group-hover:bg-orange-200 transition-colors">
                <MessageSquare className="w-6 h-6 text-orange-600" />
              </div>
              <span className="text-sm font-medium text-gray-900">Messages</span>
              <span className="text-xs text-gray-500">Chat with your consultant</span>
            </button>

            <button className="flex flex-col items-center p-4 rounded-xl hover:bg-gray-50 transition-colors group">
              <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-3 group-hover:bg-indigo-200 transition-colors">
                <Calendar className="w-6 h-6 text-indigo-600" />
              </div>
              <span className="text-sm font-medium text-gray-900">Meetings</span>
              <span className="text-xs text-gray-500">Schedule and join meetings</span>
            </button>

            <button className="flex flex-col items-center p-4 rounded-xl hover:bg-gray-50 transition-colors group">
              <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center mb-3 group-hover:bg-teal-200 transition-colors">
                <BarChart3 className="w-6 h-6 text-teal-600" />
              </div>
              <span className="text-sm font-medium text-gray-900">Accounting</span>
              <span className="text-xs text-gray-500">Submit monthly financial documents</span>
            </button>

            <button className="flex flex-col items-center p-4 rounded-xl hover:bg-gray-50 transition-colors group">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mb-3 group-hover:bg-red-200 transition-colors">
                <CreditCard className="w-6 h-6 text-red-600" />
              </div>
              <span className="text-sm font-medium text-gray-900">Billing</span>
              <span className="text-xs text-gray-500">View invoices and payments</span>
            </button>
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

          {/* Financial Overview */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Financial Overview</h2>
              <p className="text-sm text-gray-600">Your investment in business expansion</p>
            </div>
            
            <div className="space-y-4">
              <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-700">Total Investment</p>
                    <p className="text-2xl font-bold text-green-900">${stats.totalSpent.toLocaleString()}</p>
                  </div>
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-orange-50 rounded-xl p-4 border border-orange-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-orange-700">Pending Payments</p>
                    <p className="text-2xl font-bold text-orange-900">${pendingPayments.toLocaleString()}</p>
                  </div>
                  <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                    <Clock className="w-5 h-5 text-orange-600" />
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-700">Active Projects</p>
                    <p className="text-2xl font-bold text-blue-900">{stats.activeProjects}</p>
                  </div>
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Target className="w-5 h-5 text-blue-600" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ClientDashboard;