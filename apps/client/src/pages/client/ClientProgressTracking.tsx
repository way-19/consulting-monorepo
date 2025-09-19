import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '@consulting19/shared';
import { 
  TrendingUp, 
  Target, 
  Award, 
  BarChart3, 
  Calendar,
  CheckCircle,
  Clock,
  Star,
  Trophy,
  Zap,
  Activity,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  Percent,
  Users,
  FileText,
  MessageSquare,
  DollarSign,
  Sparkles,
  Medal,
  Crown,
  Gift
} from 'lucide-react';
import { supabase } from '@consulting19/shared/lib/supabase';

interface ProgressData {
  projects: {
    total: number;
    active: number;
    completed: number;
    completion_rate: number;
    avg_progress: number;
  };
  tasks: {
    total: number;
    completed: number;
    pending: number;
    completion_rate: number;
    avg_completion_time: number;
  };
  milestones: {
    total: number;
    achieved: number;
    upcoming: number;
    achievement_rate: number;
  };
  activity: {
    this_week: number;
    last_week: number;
    trend: 'up' | 'down' | 'stable';
    trend_percentage: number;
  };
}

interface Milestone {
  id: string;
  title: string;
  description: string;
  type: 'project' | 'task' | 'financial' | 'timeline';
  target_value: number;
  current_value: number;
  unit: string;
  is_achieved: boolean;
  achieved_date: string | null;
  reward_points: number;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'projects' | 'collaboration' | 'financial' | 'engagement';
  points: number;
  is_unlocked: boolean;
  unlocked_date: string | null;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

const ClientProgressTracking = () => {
  const { user, profile } = useAuth();
  const [progressData, setProgressData] = useState<ProgressData>({
    projects: { total: 0, active: 0, completed: 0, completion_rate: 0, avg_progress: 0 },
    tasks: { total: 0, completed: 0, pending: 0, completion_rate: 0, avg_completion_time: 0 },
    milestones: { total: 0, achieved: 0, upcoming: 0, achievement_rate: 0 },
    activity: { this_week: 0, last_week: 0, trend: 'stable', trend_percentage: 0 }
  });
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [totalPoints, setTotalPoints] = useState(0);
  const [nextLevelPoints, setNextLevelPoints] = useState(100);

  useEffect(() => {
    if (user && profile) {
      fetchProgressData();
      generateMilestones();
      generateAchievements();
    }
  }, [user, profile]);

  const fetchProgressData = async () => {
    try {
      setLoading(true);
      
      // Get client ID
      const { data: clientData, error: clientError } = await supabase
        .from('clients')
        .select('id')
        .eq('profile_id', user?.id)
        .maybeSingle();

      if (clientError || !clientData) {
        console.error('Client fetch error:', clientError);
        return;
      }

      // Fetch comprehensive progress data
      const [
        { data: projects },
        { data: tasks },
        { data: thisWeekActivity },
        { data: lastWeekActivity }
      ] = await Promise.all([
        supabase.from('projects').select('*').eq('client_id', clientData.id),
        supabase.from('tasks').select('*').eq('client_id', clientData.id).eq('is_client_visible', true),
        supabase.from('audit_logs').select('*').eq('user_id', user?.id).gte('created_at', getWeekStart(0)),
        supabase.from('audit_logs').select('*').eq('user_id', user?.id).gte('created_at', getWeekStart(1)).lt('created_at', getWeekStart(0))
      ]);

      // Calculate project metrics
      const projectMetrics = {
        total: projects?.length || 0,
        active: projects?.filter(p => p.status === 'active').length || 0,
        completed: projects?.filter(p => p.status === 'completed').length || 0,
        completion_rate: projects?.length ? (projects.filter(p => p.status === 'completed').length / projects.length) * 100 : 0,
        avg_progress: projects?.length ? projects.reduce((sum, p) => sum + (p.progress || 0), 0) / projects.length : 0
      };

      // Calculate task metrics
      const taskMetrics = {
        total: tasks?.length || 0,
        completed: tasks?.filter(t => t.status === 'completed').length || 0,
        pending: tasks?.filter(t => ['todo', 'in_progress'].includes(t.status)).length || 0,
        completion_rate: tasks?.length ? (tasks.filter(t => t.status === 'completed').length / tasks.length) * 100 : 0,
        avg_completion_time: 0 // Would calculate from task duration data
      };

      // Calculate milestone metrics
      const milestoneMetrics = {
        total: 10, // Mock total milestones
        achieved: 3, // Mock achieved
        upcoming: 7, // Mock upcoming
        achievement_rate: 30
      };

      // Calculate activity trend
      const thisWeekCount = thisWeekActivity?.length || 0;
      const lastWeekCount = lastWeekActivity?.length || 0;
      const trendPercentage = lastWeekCount > 0 
        ? ((thisWeekCount - lastWeekCount) / lastWeekCount) * 100 
        : thisWeekCount > 0 ? 100 : 0;

      const activityMetrics = {
        this_week: thisWeekCount,
        last_week: lastWeekCount,
        trend: trendPercentage > 5 ? 'up' : trendPercentage < -5 ? 'down' : 'stable',
        trend_percentage: Math.abs(trendPercentage)
      };

      setProgressData({
        projects: projectMetrics,
        tasks: taskMetrics,
        milestones: milestoneMetrics,
        activity: activityMetrics
      });

      // Calculate level and points
      const points = (projectMetrics.completed * 100) + (taskMetrics.completed * 20) + (milestoneMetrics.achieved * 50);
      setTotalPoints(points);
      setCurrentLevel(Math.floor(points / 100) + 1);
      setNextLevelPoints((Math.floor(points / 100) + 1) * 100);

    } catch (err) {
      console.error('Error fetching progress data:', err);
    } finally {
      setLoading(false);
    }
  };

  const getWeekStart = (weeksAgo: number) => {
    const date = new Date();
    date.setDate(date.getDate() - (weeksAgo * 7) - date.getDay());
    date.setHours(0, 0, 0, 0);
    return date.toISOString();
  };

  const generateMilestones = () => {
    const mockMilestones: Milestone[] = [
      {
        id: '1',
        title: 'First Project Completed',
        description: 'Complete your first business expansion project',
        type: 'project',
        target_value: 1,
        current_value: progressData.projects.completed,
        unit: 'projects',
        is_achieved: progressData.projects.completed >= 1,
        achieved_date: progressData.projects.completed >= 1 ? new Date().toISOString() : null,
        reward_points: 100
      },
      {
        id: '2', 
        title: 'Task Master',
        description: 'Complete 10 tasks successfully',
        type: 'task',
        target_value: 10,
        current_value: progressData.tasks.completed,
        unit: 'tasks',
        is_achieved: progressData.tasks.completed >= 10,
        achieved_date: null,
        reward_points: 150
      },
      {
        id: '3',
        title: 'Active Communicator',
        description: 'Exchange 50 messages with your consultant',
        type: 'project',
        target_value: 50,
        current_value: 23,
        unit: 'messages',
        is_achieved: false,
        achieved_date: null,
        reward_points: 75
      },
      {
        id: '4',
        title: 'Document Organizer',
        description: 'Upload 20 documents to your account',
        type: 'project',
        target_value: 20,
        current_value: 7,
        unit: 'documents',
        is_achieved: false,
        achieved_date: null,
        reward_points: 120
      },
      {
        id: '5',
        title: 'Meeting Master',
        description: 'Complete 5 consultant meetings',
        type: 'timeline',
        target_value: 5,
        current_value: 2,
        unit: 'meetings',
        is_achieved: false,
        achieved_date: null,
        reward_points: 200
      }
    ];
    
    setMilestones(mockMilestones);
  };

  const generateAchievements = () => {
    const mockAchievements: Achievement[] = [
      {
        id: '1',
        title: 'Welcome Aboard!',
        description: 'Successfully created your Consulting19 account',
        icon: '🎉',
        category: 'engagement',
        points: 25,
        is_unlocked: true,
        unlocked_date: new Date().toISOString(),
        rarity: 'common'
      },
      {
        id: '2',
        title: 'First Steps',
        description: 'Completed your first task',
        icon: '👟',
        category: 'projects',
        points: 50,
        is_unlocked: progressData.tasks.completed > 0,
        unlocked_date: progressData.tasks.completed > 0 ? new Date().toISOString() : null,
        rarity: 'common'
      },
      {
        id: '3',
        title: 'Global Explorer',
        description: 'Explored services in 3+ countries',
        icon: '🌍',
        category: 'engagement',
        points: 100,
        is_unlocked: false,
        unlocked_date: null,
        rarity: 'rare'
      },
      {
        id: '4',
        title: 'Business Builder',
        description: 'Successfully formed your first company',
        icon: '🏢',
        category: 'projects',
        points: 300,
        is_unlocked: progressData.projects.completed > 0,
        unlocked_date: null,
        rarity: 'epic'
      },
      {
        id: '5',
        title: 'Diamond Client',
        description: 'Spent over $10,000 on services',
        icon: '💎',
        category: 'financial',
        points: 500,
        is_unlocked: false,
        unlocked_date: null,
        rarity: 'legendary'
      }
    ];
    
    setAchievements(mockAchievements);
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'border-gray-300 bg-gray-50';
      case 'rare': return 'border-blue-300 bg-blue-50';
      case 'epic': return 'border-purple-300 bg-purple-50';
      case 'legendary': return 'border-yellow-300 bg-yellow-50';
      default: return 'border-gray-300 bg-gray-50';
    }
  };

  const getRarityGlow = (rarity: string) => {
    switch (rarity) {
      case 'rare': return 'shadow-blue-200';
      case 'epic': return 'shadow-purple-200';
      case 'legendary': return 'shadow-yellow-200';
      default: return '';
    }
  };

  const getMilestoneProgress = (milestone: Milestone) => {
    return Math.min((milestone.current_value / milestone.target_value) * 100, 100);
  };

  if (loading) {
    return (
      <>
        <Helmet>
          <title>Progress Tracking - Client Portal</title>
        </Helmet>
        
        <div className="space-y-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
        <title>Progress Tracking - Client Portal</title>
      </Helmet>
      
      <div className="space-y-8">
        {/* Hero Stats Section */}
        <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-3xl p-8 border border-indigo-200">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-200/30 to-purple-200/30 rounded-full -translate-y-32 translate-x-32"></div>
          
          <div className="relative">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                  <TrendingUp className="w-8 h-8 mr-3 text-blue-600" />
                  Progress Dashboard
                </h1>
                <p className="text-gray-600 text-lg mt-2">Track your business expansion journey</p>
              </div>
              
              {/* Level Badge */}
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 via-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-xl mb-2">
                  <Crown className="w-10 h-10 text-white" />
                </div>
                <div className="font-bold text-gray-900">Level {currentLevel}</div>
                <div className="text-sm text-gray-600">{totalPoints} / {nextLevelPoints} XP</div>
                <div className="w-20 bg-gray-200 rounded-full h-2 mt-2">
                  <div 
                    className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${(totalPoints % 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
                    <Target className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className={`flex items-center space-x-1 text-sm font-medium ${
                    progressData.activity.trend === 'up' ? 'text-green-600' : 
                    progressData.activity.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    {progressData.activity.trend === 'up' ? <ArrowUpRight className="w-4 h-4" /> : 
                     progressData.activity.trend === 'down' ? <ArrowDownRight className="w-4 h-4" /> : 
                     <Activity className="w-4 h-4" />}
                    <span>{progressData.activity.trend_percentage.toFixed(0)}%</span>
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-2">{progressData.projects.avg_progress.toFixed(0)}%</div>
                <div className="text-sm text-gray-600">Average Progress</div>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <Sparkles className="w-5 h-5 text-green-500" />
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-2">{progressData.tasks.completion_rate.toFixed(0)}%</div>
                <div className="text-sm text-gray-600">Task Success Rate</div>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center">
                    <Award className="w-6 h-6 text-purple-600" />
                  </div>
                  <Trophy className="w-5 h-5 text-purple-500" />
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-2">{progressData.milestones.achievement_rate.toFixed(0)}%</div>
                <div className="text-sm text-gray-600">Milestones Hit</div>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center">
                    <Zap className="w-6 h-6 text-orange-600" />
                  </div>
                  <Activity className="w-5 h-5 text-orange-500" />
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-2">{progressData.activity.this_week}</div>
                <div className="text-sm text-gray-600">This Week's Activity</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Milestones Progress */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 px-8 py-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <Target className="w-6 h-6 mr-2 text-purple-600" />
                Current Milestones
              </h2>
              <p className="text-sm text-gray-600 mt-1">Track your progress towards key goals</p>
            </div>
            
            <div className="p-8 space-y-6">
              {milestones.map((milestone) => {
                const progress = getMilestoneProgress(milestone);
                
                return (
                  <div key={milestone.id} className="relative">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          milestone.is_achieved ? 'bg-green-500' : 'bg-gray-300'
                        }`}>
                          {milestone.is_achieved ? (
                            <CheckCircle className="w-5 h-5 text-white" />
                          ) : (
                            <Target className="w-5 h-5 text-gray-600" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{milestone.title}</h3>
                          <p className="text-sm text-gray-600">{milestone.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-gray-900">
                          {milestone.current_value} / {milestone.target_value}
                        </div>
                        <div className="text-xs text-gray-500">{milestone.unit}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">{progress.toFixed(0)}% complete</span>
                      <span className="text-sm font-medium text-purple-600">+{milestone.reward_points} XP</span>
                    </div>
                    
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-purple-500 to-indigo-500 h-3 rounded-full transition-all duration-700 relative"
                        style={{ width: `${progress}%` }}
                      >
                        {progress > 80 && (
                          <div className="absolute inset-0 bg-gradient-to-r from-purple-300 to-indigo-300 animate-pulse"></div>
                        )}
                      </div>
                    </div>
                    
                    {milestone.is_achieved && (
                      <div className="absolute -top-2 -right-2">
                        <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center animate-bounce">
                          <Star className="w-3 h-3 text-yellow-800 fill-current" />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Achievement Gallery */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 px-8 py-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <Award className="w-6 h-6 mr-2 text-yellow-600" />
                Achievement Gallery
              </h2>
              <p className="text-sm text-gray-600 mt-1">Unlock badges as you progress</p>
            </div>
            
            <div className="p-8">
              <div className="grid grid-cols-2 gap-4">
                {achievements.map((achievement) => (
                  <div 
                    key={achievement.id} 
                    className={`relative rounded-2xl border-2 p-4 transition-all duration-300 ${
                      achievement.is_unlocked 
                        ? `${getRarityColor(achievement.rarity)} ${getRarityGlow(achievement.rarity)} shadow-lg transform hover:scale-105`
                        : 'border-gray-200 bg-gray-50 opacity-60'
                    }`}
                  >
                    <div className="text-center">
                      <div className={`text-4xl mb-3 ${
                        achievement.is_unlocked ? '' : 'grayscale'
                      }`}>
                        {achievement.icon}
                      </div>
                      <h3 className={`font-bold mb-1 ${
                        achievement.is_unlocked ? 'text-gray-900' : 'text-gray-500'
                      }`}>
                        {achievement.title}
                      </h3>
                      <p className={`text-xs mb-2 ${
                        achievement.is_unlocked ? 'text-gray-600' : 'text-gray-400'
                      }`}>
                        {achievement.description}
                      </p>
                      <div className={`text-xs font-semibold ${
                        achievement.is_unlocked ? 'text-yellow-600' : 'text-gray-400'
                      }`}>
                        +{achievement.points} XP
                      </div>
                      
                      {/* Rarity indicator */}
                      <div className="absolute top-2 right-2">
                        <div className={`w-3 h-3 rounded-full ${
                          achievement.rarity === 'common' ? 'bg-gray-400' :
                          achievement.rarity === 'rare' ? 'bg-blue-400' :
                          achievement.rarity === 'epic' ? 'bg-purple-400' :
                          'bg-yellow-400'
                        }`}></div>
                      </div>

                      {/* Unlock animation */}
                      {achievement.is_unlocked && achievement.rarity !== 'common' && (
                        <div className="absolute inset-0 pointer-events-none">
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-full animate-pulse"></div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Project Analytics */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
                Project Analytics
              </h3>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Total Projects</span>
                <span className="font-bold text-2xl text-gray-900">{progressData.projects.total}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Active</span>
                <span className="font-bold text-blue-600">{progressData.projects.active}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Completed</span>
                <span className="font-bold text-green-600">{progressData.projects.completed}</span>
              </div>

              {/* Visual Progress */}
              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Completion Rate</span>
                  <span className="text-sm font-medium text-gray-900">{progressData.projects.completion_rate.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-cyan-500 h-3 rounded-full transition-all duration-700"
                    style={{ width: `${progressData.projects.completion_rate}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Task Analytics */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                Task Performance
              </h3>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Total Tasks</span>
                <span className="font-bold text-2xl text-gray-900">{progressData.tasks.total}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Completed</span>
                <span className="font-bold text-green-600">{progressData.tasks.completed}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Pending</span>
                <span className="font-bold text-orange-600">{progressData.tasks.pending}</span>
              </div>

              {/* Visual Progress */}
              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Success Rate</span>
                  <span className="text-sm font-medium text-gray-900">{progressData.tasks.completion_rate.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full transition-all duration-700"
                    style={{ width: `${progressData.tasks.completion_rate}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Activity Trend */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-orange-50 to-red-50 px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Activity className="w-5 h-5 mr-2 text-orange-600" />
                Weekly Activity
              </h3>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">This Week</span>
                <span className="font-bold text-2xl text-gray-900">{progressData.activity.this_week}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Last Week</span>
                <span className="font-bold text-gray-600">{progressData.activity.last_week}</span>
              </div>

              {/* Trend Indicator */}
              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center justify-center space-x-2 p-3 rounded-xl bg-gradient-to-r from-orange-50 to-red-50">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    progressData.activity.trend === 'up' ? 'bg-green-500' :
                    progressData.activity.trend === 'down' ? 'bg-red-500' : 'bg-gray-500'
                  }`}>
                    {progressData.activity.trend === 'up' ? (
                      <ArrowUpRight className="w-4 h-4 text-white" />
                    ) : progressData.activity.trend === 'down' ? (
                      <ArrowDownRight className="w-4 h-4 text-white" />
                    ) : (
                      <Activity className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <div className="text-center">
                    <div className={`text-lg font-bold ${
                      progressData.activity.trend === 'up' ? 'text-green-600' :
                      progressData.activity.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                    }`}>
                      {progressData.activity.trend === 'stable' ? '±0' : 
                       progressData.activity.trend === 'up' ? '+' : '-'}{progressData.activity.trend_percentage.toFixed(0)}%
                    </div>
                    <div className="text-xs text-gray-500 uppercase tracking-wider">
                      {progressData.activity.trend}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Progress Breakdown */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-8 py-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <PieChart className="w-6 h-6 mr-2 text-gray-600" />
              Detailed Analytics
            </h2>
            <p className="text-sm text-gray-600 mt-1">Comprehensive view of your progress</p>
          </div>
          
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Engagement Score */}
              <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl border border-blue-200">
                <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <div className="text-2xl font-bold text-blue-600 mb-2">85%</div>
                <div className="text-sm text-blue-800 font-medium">Engagement Score</div>
                <div className="text-xs text-blue-600 mt-1">+12% this month</div>
              </div>

              {/* Communication */}
              <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl border border-purple-200">
                <div className="w-16 h-16 bg-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="w-8 h-8 text-white" />
                </div>
                <div className="text-2xl font-bold text-purple-600 mb-2">92%</div>
                <div className="text-sm text-purple-800 font-medium">Response Rate</div>
                <div className="text-xs text-purple-600 mt-1">Excellent!</div>
              </div>

              {/* Documentation */}
              <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl border border-green-200">
                <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-white" />
                </div>
                <div className="text-2xl font-bold text-green-600 mb-2">78%</div>
                <div className="text-sm text-green-800 font-medium">Doc Submission</div>
                <div className="text-xs text-green-600 mt-1">On track</div>
              </div>

              {/* Investment Level */}
              <div className="text-center p-6 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl border border-yellow-200">
                <div className="w-16 h-16 bg-yellow-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <DollarSign className="w-8 h-8 text-white" />
                </div>
                <div className="text-2xl font-bold text-yellow-600 mb-2">Silver</div>
                <div className="text-sm text-yellow-800 font-medium">Client Tier</div>
                <div className="text-xs text-yellow-600 mt-1">Next: Gold</div>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Timeline */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-50 to-blue-50 px-8 py-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <Calendar className="w-6 h-6 mr-2 text-indigo-600" />
              Progress Timeline
            </h2>
            <p className="text-sm text-gray-600 mt-1">Your expansion journey milestones</p>
          </div>
          
          <div className="p-8">
            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 to-purple-500"></div>
              
              <div className="space-y-8">
                {[
                  { 
                    title: 'Account Created', 
                    description: 'Welcome to Consulting19!', 
                    date: 'Today', 
                    status: 'completed',
                    icon: '🎉',
                    points: 25
                  },
                  { 
                    title: 'Consultant Assigned', 
                    description: 'Matched with expert advisor', 
                    date: 'Day 1', 
                    status: 'completed',
                    icon: '👨‍💼',
                    points: 50
                  },
                  { 
                    title: 'First Meeting Scheduled', 
                    description: 'Initial consultation planned', 
                    date: 'Day 3', 
                    status: 'in_progress',
                    icon: '📅',
                    points: 75
                  },
                  { 
                    title: 'Service Package Selected', 
                    description: 'Choose your expansion strategy', 
                    date: 'Week 1', 
                    status: 'upcoming',
                    icon: '📦',
                    points: 100
                  },
                  { 
                    title: 'Company Formation Complete', 
                    description: 'Legal entity established', 
                    date: 'Week 2-4', 
                    status: 'upcoming',
                    icon: '🏢',
                    points: 300
                  }
                ].map((event, index) => (
                  <div key={index} className="relative flex items-start space-x-6">
                    {/* Timeline Node */}
                    <div className={`relative z-10 w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg ${
                      event.status === 'completed' ? 'bg-gradient-to-br from-green-500 to-emerald-500' :
                      event.status === 'in_progress' ? 'bg-gradient-to-br from-blue-500 to-cyan-500' :
                      'bg-gradient-to-br from-gray-300 to-gray-400'
                    }`}>
                      <span className="text-2xl">{event.icon}</span>
                    </div>
                    
                    <div className="flex-1 pb-8">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{event.title}</h3>
                        <span className="text-sm font-medium text-purple-600">+{event.points} XP</span>
                      </div>
                      <p className="text-gray-600 mb-2">{event.description}</p>
                      <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-500">{event.date}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          event.status === 'completed' ? 'bg-green-100 text-green-800' :
                          event.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          {event.status === 'completed' ? 'Completed' :
                           event.status === 'in_progress' ? 'In Progress' : 'Upcoming'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Rewards & Next Level */}
        <div className="bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 rounded-2xl shadow-lg border border-yellow-200 p-8">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
              <Gift className="w-10 h-10 text-white" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Level {currentLevel + 1} Rewards Await!
            </h2>
            
            <p className="text-gray-700 mb-6 max-w-md mx-auto">
              You're only {nextLevelPoints - totalPoints} XP away from unlocking exclusive features and rewards.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-white/50">
                <Medal className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                <div className="text-sm font-semibold text-gray-900">Priority Support</div>
                <div className="text-xs text-gray-600">Faster response times</div>
              </div>
              
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-white/50">
                <Star className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <div className="text-sm font-semibold text-gray-900">Premium Features</div>
                <div className="text-xs text-gray-600">Advanced analytics</div>
              </div>
              
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-white/50">
                <Trophy className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <div className="text-sm font-semibold text-gray-900">Exclusive Access</div>
                <div className="text-xs text-gray-600">Special consultations</div>
              </div>
            </div>

            {/* Level Progress */}
            <div className="mt-6 max-w-md mx-auto">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Level Progress</span>
                <span className="text-sm font-bold text-gray-900">
                  {totalPoints} / {nextLevelPoints} XP
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 h-4 rounded-full transition-all duration-1000 relative"
                  style={{ width: `${(totalPoints % 100)}%` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-300 via-orange-400 to-red-400 animate-pulse opacity-50"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ClientProgressTracking;