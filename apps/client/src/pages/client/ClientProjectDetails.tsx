import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '@consulting19/shared';
import { 
  ArrowLeft,
  Calendar, 
  User, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  FileText, 
  BarChart3,
  DollarSign,
  Globe,
  Target,
  TrendingUp,
  Play,
  Pause,
  Edit,
  Settings,
  MessageSquare,
  Upload,
  Download,
  Eye,
  Plus
} from 'lucide-react';
import { supabase } from '@consulting19/shared/lib/supabase';

interface ProjectDetails {
  id: string;
  title: string;
  description_i18n: any;
  status: string;
  priority: string;
  progress: number;
  budget: number;
  currency: string;
  start_date: string;
  end_date: string;
  created_at: string;
  consultant: {
    id: string;
    full_name: string;
    email: string;
    timezone: string;
  };
  tasks: any[];
  documents: any[];
  steps: any[];
}

const ClientProjectDetails = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [project, setProject] = useState<ProjectDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (user && profile && projectId) {
      fetchProjectDetails();
    }
  }, [user, profile, projectId]);

  const fetchProjectDetails = async () => {
    try {
      setLoading(true);
      
      // Get client ID
      const { data: clientData, error: clientError } = await supabase
        .from('clients')
        .select('id')
        .eq('profile_id', user?.id)
        .single();

      if (clientError || !clientData) {
        setError('Client data not found');
        return;
      }

      // Fetch project details with consultant info
      const { data: projectData, error: projectError } = await supabase
        .from('projects')
        .select(`
          *,
          consultant:user_profiles!projects_consultant_id_fkey(id, full_name, email, timezone)
        `)
        .eq('id', projectId)
        .eq('client_id', clientData.id)
        .single();

      if (projectError || !projectData) {
        setError('Project not found');
        return;
      }

      // Fetch project tasks
      const { data: tasksData } = await supabase
        .from('tasks')
        .select('*')
        .eq('project_id', projectId)
        .eq('is_client_visible', true)
        .order('created_at', { ascending: true });

      // Fetch project documents
      const { data: documentsData } = await supabase
        .from('documents')
        .select('*')
        .eq('client_id', clientData.id)
        .order('uploaded_at', { ascending: false });

      setProject({
        ...projectData,
        tasks: tasksData || [],
        documents: documentsData || []
      });

    } catch (err) {
      console.error('Error fetching project details:', err);
      setError('Failed to load project details');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-6 h-6 text-green-600" />;
      case 'active': return <Clock className="w-6 h-6 text-blue-600" />;
      case 'on_hold': return <AlertCircle className="w-6 h-6 text-yellow-600" />;
      case 'cancelled': return <AlertCircle className="w-6 h-6 text-red-600" />;
      default: return <BarChart3 className="w-6 h-6 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'active': return 'bg-blue-100 text-blue-800';
      case 'on_hold': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
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
      <>
        <Helmet>
          <title>Project Details - Client Portal</title>
        </Helmet>
        
        <div className="space-y-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="h-32 bg-gray-200 rounded-lg mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </>
    );
  }

  if (error || !project) {
    return (
      <>
        <Helmet>
          <title>Project Details - Client Portal</title>
        </Helmet>
        
        <div className="space-y-6">
          <div className="flex items-center space-x-3 mb-6">
            <button
              onClick={() => navigate('/projects')}
              className="inline-flex items-center px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Projects
            </button>
          </div>
          
          <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-lg text-center">
            <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
            <h3 className="text-lg font-semibold mb-2">Project Not Found</h3>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      </>
    );
  }

  const completedTasks = project.tasks.filter(t => t.status === 'completed').length;
  const totalTasks = project.tasks.length;
  const taskCompletionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return (
    <>
      <Helmet>
        <title>{project.title} - Project Details</title>
      </Helmet>
      
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-3 mb-6">
          <button
            onClick={() => navigate('/projects')}
            className="inline-flex items-center px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Projects
          </button>
        </div>

        {/* Project Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start space-x-4">
              {getStatusIcon(project.status)}
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{project.title}</h1>
                <p className="text-gray-600 mt-2">
                  {project.description_i18n?.en || 'No description available'}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(project.status)}`}>
                {project.status}
              </span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(project.priority)}`}>
                {project.priority}
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
              <span>Overall Progress</span>
              <span>{project.progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${project.progress}%` }}
              ></div>
            </div>
          </div>

          {/* Project Meta */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="flex items-center space-x-2">
              <User className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600">
                {project.consultant?.full_name}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600">
                {project.start_date ? new Date(project.start_date).toLocaleDateString() : 'No start date'}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <DollarSign className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600">
                {project.budget ? `${project.budget.toLocaleString()} ${project.currency}` : 'No budget set'}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Target className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600">
                {project.end_date ? new Date(project.end_date).toLocaleDateString() : 'No deadline'}
              </span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-3">
            <Link
              to={`/tasks?projectId=${project.id}`}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              View Tasks ({totalTasks})
            </Link>
            <Link
              to={`/files?projectId=${project.id}`}
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <FileText className="w-4 h-4 mr-2" />
              Project Files
            </Link>
            <Link
              to="/messages"
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Message Consultant
            </Link>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'overview', name: 'Overview', icon: BarChart3 },
                { id: 'tasks', name: `Tasks (${totalTasks})`, icon: CheckCircle },
                { id: 'timeline', name: 'Timeline', icon: Calendar },
                { id: 'documents', name: `Documents (${project.documents.length})`, icon: FileText },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.name}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-blue-700">Task Progress</p>
                        <p className="text-2xl font-bold text-blue-900">{taskCompletionRate.toFixed(0)}%</p>
                      </div>
                      <CheckCircle className="w-8 h-8 text-blue-600" />
                    </div>
                  </div>
                  
                  <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-green-700">Budget Progress</p>
                        <p className="text-2xl font-bold text-green-900">{project.progress}%</p>
                      </div>
                      <DollarSign className="w-8 h-8 text-green-600" />
                    </div>
                  </div>
                  
                  <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-purple-700">Total Documents</p>
                        <p className="text-2xl font-bold text-purple-900">{project.documents.length}</p>
                      </div>
                      <FileText className="w-8 h-8 text-purple-600" />
                    </div>
                  </div>
                </div>

                {/* Project Description */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Project Description</h3>
                  <p className="text-gray-700 leading-relaxed">
                    {project.description_i18n?.en || 'No detailed description available for this project.'}
                  </p>
                </div>

                {/* Project Timeline */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Timeline</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Start Date:</span>
                      <span className="font-medium text-gray-900">
                        {project.start_date ? new Date(project.start_date).toLocaleDateString() : 'Not set'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">End Date:</span>
                      <span className="font-medium text-gray-900">
                        {project.end_date ? new Date(project.end_date).toLocaleDateString() : 'Not set'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Duration:</span>
                      <span className="font-medium text-gray-900">
                        {project.start_date && project.end_date ? 
                          `${Math.ceil((new Date(project.end_date).getTime() - new Date(project.start_date).getTime()) / (1000 * 60 * 60 * 24))} days` :
                          'Not calculated'
                        }
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tasks Tab */}
            {activeTab === 'tasks' && (
              <div className="space-y-4">
                {project.tasks.length > 0 ? (
                  project.tasks.map((task) => (
                    <div key={task.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{task.title}</h4>
                          <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500 mt-2">
                            <span>Priority: {task.priority}</span>
                            {task.due_date && (
                              <span>Due: {new Date(task.due_date).toLocaleDateString()}</span>
                            )}
                          </div>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                          {task.status.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <CheckCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600">No tasks assigned to this project yet</p>
                  </div>
                )}
                
                <div className="text-center">
                  <Link
                    to={`/tasks?projectId=${project.id}`}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    View All Tasks
                  </Link>
                </div>
              </div>
            )}

            {/* Timeline Tab */}
            {activeTab === 'timeline' && (
              <div className="space-y-6">
                <div className="relative">
                  <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-300"></div>
                  
                  <div className="space-y-6">
                    <div className="relative flex items-start space-x-4">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center z-10">
                        <Play className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">Project Started</h3>
                        <p className="text-sm text-gray-600">Initial consultation and planning phase</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {project.start_date ? new Date(project.start_date).toLocaleDateString() : 'Date not set'}
                        </p>
                      </div>
                    </div>

                    {project.tasks.filter(t => t.status === 'completed').map((task) => (
                      <div key={task.id} className="relative flex items-start space-x-4">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center z-10">
                          <CheckCircle className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{task.title}</h3>
                          <p className="text-sm text-gray-600">{task.description}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            Completed • {task.actual_hours}h spent
                          </p>
                        </div>
                      </div>
                    ))}

                    {project.status === 'completed' && (
                      <div className="relative flex items-start space-x-4">
                        <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center z-10">
                          <Target className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">Project Completed</h3>
                          <p className="text-sm text-gray-600">All objectives achieved successfully</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {project.end_date ? new Date(project.end_date).toLocaleDateString() : 'Recently'}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Documents Tab */}
            {activeTab === 'documents' && (
              <div className="space-y-4">
                {project.documents.length > 0 ? (
                  project.documents.map((doc) => (
                    <div key={doc.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <FileText className="w-5 h-5 text-blue-600" />
                          <div>
                            <h4 className="font-semibold text-gray-900">{doc.name}</h4>
                            <div className="text-sm text-gray-500">
                              {doc.type} • {doc.file_size ? `${(doc.file_size / 1024).toFixed(0)} KB` : 'Unknown size'}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {doc.file_url && (
                            <>
                              <button 
                                onClick={() => window.open(doc.file_url, '_blank')}
                                className="inline-flex items-center px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                              >
                                <Eye className="w-4 h-4 mr-1" />
                                View
                              </button>
                              <button 
                                onClick={() => {
                                  const a = document.createElement('a');
                                  a.href = doc.file_url;
                                  a.download = doc.name;
                                  a.click();
                                }}
                                className="inline-flex items-center px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                              >
                                <Download className="w-4 h-4 mr-1" />
                                Download
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600">No documents uploaded for this project yet</p>
                  </div>
                )}
                
                <div className="text-center">
                  <Link
                    to={`/files?projectId=${project.id}`}
                    className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    View All Project Files
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Consultant Info */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Consultant</h3>
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900">{project.consultant.full_name}</h4>
              <p className="text-sm text-gray-600">{project.consultant.email}</p>
              {project.consultant.timezone && (
                <p className="text-xs text-gray-500">Timezone: {project.consultant.timezone}</p>
              )}
            </div>
            <Link
              to="/messages"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Send Message
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default ClientProjectDetails;