import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '@consulting19/shared';
import { 
  BarChart3, 
  FileText, 
  CheckSquare, 
  MessageSquare, 
  CreditCard, 
  Settings,
  Calendar,
  TrendingUp,
  Mail,
  HelpCircle,
  Briefcase,
  User,
  ArrowRight,
  DollarSign,
  Clock,
  AlertTriangle,
  Activity,
  Target,
  Award,
  Send,
  Plus,
  Eye
} from 'lucide-react';
import { supabase } from '@consulting19/shared/lib/supabase';

interface DashboardStats {
  activeProjects: number;
  pendingTasks: number;
  totalDocuments: number;
  unreadMessages: number;
  totalSpent: number;
  upcomingMeetings: number;
  pendingPayments: number;
}

interface ConsultantInfo {
  id: string;
  full_name: string;
  email: string;
  status: string;
}

interface RecentActivity {
  id: string;
  description: string;
  created_at: string;
  action_type: string;
}

const ClientDashboard = () => {
  const { user, profile } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    activeProjects: 0,
    pendingTasks: 0,
    totalDocuments: 0,
    unreadMessages: 0,
    totalSpent: 0,
    upcomingMeetings: 0,
    pendingPayments: 0
  });
  const [consultant, setConsultant] = useState<ConsultantInfo | null>(null);
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
      
      // Get client ID
      const { data: clientData, error: clientError } = await supabase
        .from('clients')
        .select('id, assigned_consultant_id')
        .eq('profile_id', user?.id)
        .maybeSingle();

      if (clientError) {
        console.error('Client fetch error:', clientError);
        setLoading(false);
        return;
      }

      if (!clientData) {
        console.log('No client record found');
        setLoading(false);
        return;
      }

      // Fetch consultant info
      if (clientData.assigned_consultant_id) {
        const { data: consultantData } = await supabase
          .from('user_profiles')
          .select('id, full_name, email, is_active')
          .eq('id', clientData.assigned_consultant_id)
          .single();

        if (consultantData) {
          setConsultant({
            id: consultantData.id,
            full_name: consultantData.full_name,
            email: consultantData.email,
            status: consultantData.is_active ? 'active' : 'inactive'
          });
        }
      }

      // Fetch dashboard statistics
      const [
        { data: projects },
        { data: tasks },
        { data: documents },
        { data: messages },
        { data: invoices },
        { data: meetings },
        { data: activities }
      ] = await Promise.all([
        supabase.from('projects').select('id, status').eq('client_id', clientData.id),
        supabase.from('tasks').select('id, status').eq('client_id', clientData.id).eq('is_client_visible', true),
        supabase.from('documents').select('id').eq('client_id', clientData.id),
        supabase.from('messages').select('id, is_read').eq('receiver_id', user?.id),
        supabase.from('invoices').select('amount_due, status, currency').eq('client_id', clientData.id),
        supabase.from('meetings').select('id, start_time, status').eq('client_id', clientData.id),
        supabase.from('audit_logs').select('id, description, created_at, action_type').eq('user_id', user?.id).order('created_at', { ascending: false }).limit(5)
      ]);

      // Calculate stats
      const activeProjects = projects?.filter(p => p.status === 'active').length || 0;
      const pendingTasks = tasks?.filter(t => ['todo', 'in_progress'].includes(t.status)).length || 0;
      const totalDocuments = documents?.length || 0;
      const unreadMessages = messages?.filter(m => !m.is_read).length || 0;
      const totalSpent = invoices?.filter(i => i.status === 'paid').reduce((sum, i) => sum + (i.amount_due || 0), 0) || 0;
      const upcomingMeetings = meetings?.filter(m => new Date(m.start_time) > new Date() && m.status === 'scheduled').length || 0;
      const pendingPayments = invoices?.filter(i => i.status === 'pending').reduce((sum, i) => sum + (i.amount_due || 0), 0) || 0;

      setStats({
        activeProjects,
        pendingTasks,
        totalDocuments,
        unreadMessages,
        totalSpent,
        upcomingMeetings,
        pendingPayments
      });

      setRecentActivity(activities || []);
    } catch (err) {
      console.error('Dashboard data fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    { 
      label: 'Projects', 
      href: '/projects', 
      icon: FolderOpen, 
      description: 'View and manage your projects',
      color: 'bg-blue-50 text-blue-600 border-blue-200'
    },
    { 
      label: 'Tasks', 
      href: '/tasks', 
      icon: CheckSquare, 
      description: 'Check your pending tasks',
      color: 'bg-green-50 text-green-600 border-green-200'
    },
    { 
      label: 'Company Documents', 
      href: '/file-manager', 
      icon: FileText, 
      description: 'View official company documents',
      color: 'bg-purple-50 text-purple-600 border-purple-200'
    },
    { 
      label: 'Messages', 
      href: '/messages', 
      icon: MessageSquare, 
      description: 'Chat with your consultant',
      color: 'bg-orange-50 text-orange-600 border-orange-200'
    },
    { 
      label: 'Meetings', 
      href: '/meetings', 
      icon: Calendar, 
      description: 'Schedule and join meetings',
      color: 'bg-indigo-50 text-indigo-600 border-indigo-200'
    },
    { 
      label: 'Accounting', 
      href: '/accounting', 
      icon: BarChart3, 
      description: 'Submit monthly financial documents',
      color: 'bg-teal-50 text-teal-600 border-teal-200'
    },
    { 
      label: 'Billing', 
      href: '/billing', 
      icon: CreditCard, 
      description: 'View invoices and payments',
      color: 'bg-red-50 text-red-600 border-red-200'
    },
  ];

  const getActivityIcon = (actionType: string) => {
    switch (actionType) {
      case 'document_uploaded': return '📄';
      case 'payment_completed': return '💰';
      case 'task_completed': return '✅';
      case 'message_sent': return '💬';
      case 'meeting_scheduled': return '📅';
      default: return '🔔';
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
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
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
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome, {profile?.full_name || user?.email?.split('@')[0] || 'Client'}!
              </h1>
              <p className="text-gray-600">Dashboard overview</p>
            </div>
            
            {/* Consultant Info */}
            {consultant && (
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-700">Your Consultant:</span>
                  <span className="text-sm font-semibold text-gray-900">{consultant.full_name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="flex items-center space-x-1 px-3 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors">
                    <Send className="w-3 h-3" />
                    <span>Message</span>
                  </button>
                  <button className="flex items-center space-x-1 px-3 py-1 border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-50 transition-colors">
                    <Calendar className="w-3 h-3" />
                    <span>Schedule</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Projects</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.activeProjects}</p>
                <p className="text-sm text-green-600 mt-1">↗ 1 active</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Tasks</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.pendingTasks}</p>
                <p className="text-sm text-orange-600 mt-1">↗ All caught up</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <CheckSquare className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Documents</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalDocuments}</p>
                <p className="text-sm text-green-600 mt-1">↗ 1 uploaded</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Unread Messages</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.unreadMessages}</p>
                <p className="text-sm text-purple-600 mt-1">↗ All caught up</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Spent</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">${stats.totalSpent.toLocaleString()}</p>
                <p className="text-sm text-blue-600 mt-1">↗ View billing</p>
              </div>
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Upcoming Meetings</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.upcomingMeetings}</p>
                <p className="text-sm text-indigo-600 mt-1">↗ No meetings scheduled</p>
              </div>
              <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-indigo-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Pending Payments Alert */}
        {stats.pendingPayments > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="w-5 h-5 text-yellow-600" />
                <div>
                  <p className="text-sm font-semibold text-yellow-900">Pending Payments</p>
                  <p className="text-sm text-yellow-800">
                    You have ${stats.pendingPayments.toLocaleString()} in pending payments.
                  </p>
                </div>
              </div>
              <button className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors">
                Pay Now
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Quick Actions */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Quick Actions</h2>
              <span className="text-sm text-gray-500">Common tasks and shortcuts</span>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {quickActions.map((action, index) => (
                <a
                  key={index}
                  href={action.href}
                  className={`flex items-center space-x-4 p-4 rounded-xl border-2 hover:shadow-md transition-all duration-200 group ${action.color}`}
                >
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                    <action.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 group-hover:text-gray-700">{action.label}</h3>
                    <p className="text-sm text-gray-600">{action.description}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
                </a>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
              <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                View All
              </button>
            </div>
            
            {recentActivity.length > 0 ? (
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="text-lg mt-0.5">
                      {getActivityIcon(activity.action_type)}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900 font-medium">{activity.description}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(activity.created_at).toLocaleDateString()} • {new Date(activity.created_at).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Activity className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 text-sm">No recent activity</p>
                <p className="text-gray-500 text-xs">Your activities will appear here</p>
              </div>
            )}
          </div>
        </div>

        {/* Financial Overview */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Financial Overview</h2>
            <span className="text-sm text-gray-500">Your investment in business expansion</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-green-50 rounded-xl border border-green-200">
              <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-green-600 mb-2">
                ${stats.totalSpent.toLocaleString()}
              </div>
              <div className="text-sm text-green-700 font-medium">Total Investment</div>
            </div>

            <div className="text-center p-6 bg-orange-50 rounded-xl border border-orange-200">
              <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-orange-600 mb-2">
                ${stats.pendingPayments.toLocaleString()}
              </div>
              <div className="text-sm text-orange-700 font-medium">Pending Payments</div>
            </div>

            <div className="text-center p-6 bg-blue-50 rounded-xl border border-blue-200">
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Award className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-blue-600 mb-2">
                {stats.activeProjects}
              </div>
              <div className="text-sm text-blue-700 font-medium">Active Projects</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ClientDashboard;