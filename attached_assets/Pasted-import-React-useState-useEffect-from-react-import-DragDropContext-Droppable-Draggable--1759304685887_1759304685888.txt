import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { Plus, Search, Clock, Play, Square, Calendar, User, Timer, MoreVertical } from 'lucide-react';
import { supabase } from '@consulting19/shared/lib/supabase';

interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  due_date: string;
  estimated_hours: number;
  actual_hours: number;
  billable: boolean;
  client: {
    first_name: string;
    last_name: string;
  } | null;
  project: {
    title: string;
  } | null;
  created_at: string;
  updated_at: string;
}

interface TaskTimer {
  taskId: string;
  startTime: Date;
  elapsedTime: number;
}

interface TaskBoardProps {
  consultantId: string;
}

const TaskBoard: React.FC<TaskBoardProps> = ({ consultantId }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [activeTimers, setActiveTimers] = useState<Map<string, TaskTimer>>(new Map());
  const [realtimeChannel, setRealtimeChannel] = useState<any>(null);

  const columns = [
    { id: 'todo', title: 'To Do', emoji: '📋' },
    { id: 'in_progress', title: 'In Progress', emoji: '🔄' },
    { id: 'review', title: 'Review', emoji: '👀' },
    { id: 'completed', title: 'Completed', emoji: '✅' }
  ];

  useEffect(() => {
    fetchTasks();
    setupRealtimeSubscription();
    
    return () => {
      if (realtimeChannel) {
        supabase.removeChannel(realtimeChannel);
      }
    };
  }, [consultantId]);

  useEffect(() => {
    // Timer interval for updating elapsed time
    const interval = setInterval(() => {
      setActiveTimers(prev => {
        const updated = new Map(prev);
        updated.forEach((timer, taskId) => {
          const now = new Date();
          const elapsed = Math.floor((now.getTime() - timer.startTime.getTime()) / 1000);
          updated.set(taskId, { ...timer, elapsedTime: elapsed });
        });
        return updated;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const setupRealtimeSubscription = () => {
    const channel = supabase
      .channel('task-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tasks',
          filter: `consultant_id=eq.${consultantId}`
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const newTask = payload.new as Task;
            setTasks(prev => [...prev, newTask]);
          } else if (payload.eventType === 'UPDATE') {
            const updatedTask = payload.new as Task;
            setTasks(prev => prev.map(task => 
              task.id === updatedTask.id ? updatedTask : task
            ));
          } else if (payload.eventType === 'DELETE') {
            const deletedTask = payload.old as Task;
            setTasks(prev => prev.filter(task => task.id !== deletedTask.id));
          }
        }
      )
      .subscribe();

    setRealtimeChannel(channel);
  };

  const fetchTasks = async () => {
    try {
      setLoading(true);
      
      const { data: tasksData, error } = await supabase
        .from('tasks')
        .select(`
          *,
          project:projects(
            title,
            client:clients(first_name, last_name)
          )
        `)
        .eq('consultant_id', consultantId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching tasks:', error);
        return;
      }

      const transformedTasks = tasksData?.map(task => ({
        ...task,
        client: task.project?.client || null,
        project: task.project ? { title: task.project.title } : null
      })) || [];

      setTasks(transformedTasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const newStatus = destination.droppableId;
    const taskId = draggableId;

    // Optimistic update
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, status: newStatus } : task
    ));

    try {
      const updateData: any = { 
        status: newStatus,
        updated_at: new Date().toISOString()
      };

      // Set timestamps based on status
      if (newStatus === 'in_progress' && source.droppableId === 'todo') {
        updateData.started_at = new Date().toISOString();
      } else if (newStatus === 'completed') {
        updateData.completed_at = new Date().toISOString();
        // Stop timer if running
        if (activeTimers.has(taskId)) {
          const timer = activeTimers.get(taskId)!;
          const totalSeconds = Math.floor((new Date().getTime() - timer.startTime.getTime()) / 1000);
          const additionalHours = totalSeconds / 3600;
          
          const task = tasks.find(t => t.id === taskId);
          if (task) {
            updateData.actual_hours = (task.actual_hours || 0) + additionalHours;
          }
          
          setActiveTimers(prev => {
            const updated = new Map(prev);
            updated.delete(taskId);
            return updated;
          });
        }
      }

      const { error } = await supabase
        .from('tasks')
        .update(updateData)
        .eq('id', taskId);

      if (error) {
        console.error('Error updating task status:', error);
        // Revert optimistic update
        fetchTasks();
      }
    } catch (error) {
      console.error('Error updating task:', error);
      fetchTasks();
    }
  };

  const startTimer = (taskId: string) => {
    setActiveTimers(prev => {
      const updated = new Map(prev);
      updated.set(taskId, {
        taskId,
        startTime: new Date(),
        elapsedTime: 0
      });
      return updated;
    });
  };

  const stopTimer = async (taskId: string) => {
    const timer = activeTimers.get(taskId);
    if (!timer) return;

    const totalSeconds = Math.floor((new Date().getTime() - timer.startTime.getTime()) / 1000);
    const additionalHours = totalSeconds / 3600;

    const task = tasks.find(t => t.id === taskId);
    if (task) {
      const newActualHours = (task.actual_hours || 0) + additionalHours;
      
      try {
        const { error } = await supabase
          .from('tasks')
          .update({ 
            actual_hours: newActualHours,
            updated_at: new Date().toISOString()
          })
          .eq('id', taskId);

        if (error) {
          console.error('Error updating task hours:', error);
        } else {
          setTasks(prev => prev.map(t => 
            t.id === taskId ? { ...t, actual_hours: newActualHours } : t
          ));
        }
      } catch (error) {
        console.error('Error updating task hours:', error);
      }
    }

    setActiveTimers(prev => {
      const updated = new Map(prev);
      updated.delete(taskId);
      return updated;
    });
  };

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = 
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'todo': return 'bg-gray-100 text-gray-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'review': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-16 bg-gray-200 rounded-lg"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
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
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Task Board</h1>
              <p className="text-gray-600">Drag and drop tasks to update their status</p>
            </div>
            <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Plus className="w-4 h-4 mr-2" />
              Add Task
            </button>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search tasks..."
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
                  <option value="todo">To Do</option>
                  <option value="in_progress">In Progress</option>
                  <option value="review">Review</option>
                  <option value="completed">Completed</option>
                </select>
                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Priorities</option>
                  <option value="urgent">Urgent</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Kanban Board with Drag & Drop */}
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {columns.map((column) => {
              const columnTasks = filteredTasks.filter(task => task.status === column.id);
              
              return (
                <div key={column.id} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900">
                      {column.title} ({columnTasks.length})
                    </h2>
                    <div className="text-2xl">{column.emoji}</div>
                  </div>
                  
                  <Droppable droppableId={column.id}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`space-y-3 min-h-[400px] p-2 rounded-lg transition-colors ${
                          snapshot.isDraggingOver ? 'bg-blue-50 border-2 border-blue-200' : 'bg-transparent'
                        }`}
                      >
                        {columnTasks.length === 0 ? (
                          <div className="text-center py-8 text-gray-500">
                            <div className="text-4xl mb-2">📝</div>
                            <p className="text-sm">No {column.title.toLowerCase()} tasks</p>
                          </div>
                        ) : (
                          columnTasks.map((task, index) => (
                            <Draggable key={task.id} draggableId={task.id} index={index}>
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className={`bg-white rounded-lg shadow-sm border border-gray-200 p-4 transition-all ${
                                    snapshot.isDragging ? 'shadow-lg rotate-2 scale-105' : 'hover:shadow-md'
                                  }`}
                                >
                                  <div className="flex items-start justify-between mb-2">
                                    <h3 className="font-medium text-gray-900 text-sm">{task.title}</h3>
                                    <div className="flex items-center space-x-1">
                                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(task.priority)}`}>
                                        {task.priority}
                                      </span>
                                      <button className="p-1 text-gray-400 hover:text-gray-600">
                                        <MoreVertical className="w-3 h-3" />
                                      </button>
                                    </div>
                                  </div>
                                  
                                  {task.description && (
                                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{task.description}</p>
                                  )}
                                  
                                  <div className="space-y-2">
                                    {task.project && (
                                      <div className="flex items-center text-xs text-gray-500">
                                        <User className="w-3 h-3 mr-1" />
                                        <span>{task.project.title}</span>
                                      </div>
                                    )}
                                    
                                    {task.client && (
                                      <div className="flex items-center text-xs text-gray-500">
                                        <User className="w-3 h-3 mr-1" />
                                        <span>{`${task.client.first_name} ${task.client.last_name}`}</span>
                                      </div>
                                    )}
                                    
                                    {task.due_date && (
                                      <div className="flex items-center text-xs text-gray-500">
                                        <Calendar className="w-3 h-3 mr-1" />
                                        <span>{new Date(task.due_date).toLocaleDateString()}</span>
                                      </div>
                                    )}
                                    
                                    <div className="flex items-center justify-between text-xs text-gray-500">
                                      <span>{task.estimated_hours}h estimated</span>
                                      <span>{task.actual_hours.toFixed(1)}h logged</span>
                                    </div>

                                    {/* Timer Display */}
                                    {activeTimers.has(task.id) && (
                                      <div className="bg-blue-50 border border-blue-200 rounded p-2">
                                        <div className="flex items-center justify-center text-blue-700 font-mono text-sm">
                                          <Timer className="w-3 h-3 mr-1" />
                                          {formatTime(activeTimers.get(task.id)!.elapsedTime)}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                  
                                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                                      {task.status.replace('_', ' ')}
                                    </span>
                                    
                                    <div className="flex items-center space-x-1">
                                      {task.status === 'in_progress' && (
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            if (activeTimers.has(task.id)) {
                                              stopTimer(task.id);
                                            } else {
                                              startTimer(task.id);
                                            }
                                          }}
                                          className={`p-1 rounded transition-colors ${
                                            activeTimers.has(task.id) 
                                              ? 'text-red-600 hover:text-red-700 bg-red-50' 
                                              : 'text-green-600 hover:text-green-700 bg-green-50'
                                          }`}
                                        >
                                          {activeTimers.has(task.id) ? <Square className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                                        </button>
                                      )}
                                      <button className="p-1 text-gray-400 hover:text-gray-600">
                                        <Clock className="w-4 h-4" />
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </Draggable>
                          ))
                        )}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              );
            })}
          </div>
        </DragDropContext>

        {/* Summary Stats */}
        <div className="bg-white rounded-lg shadow-md p-6 mt-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Task Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{tasks.length}</div>
              <div className="text-sm text-gray-600">Total Tasks</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {filteredTasks.filter(t => t.status === 'in_progress').length}
              </div>
              <div className="text-sm text-gray-600">In Progress</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {filteredTasks.filter(t => t.status === 'completed').length}
              </div>
              <div className="text-sm text-gray-600">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {tasks.reduce((sum, task) => sum + (task.estimated_hours || 0), 0)}h
              </div>
              <div className="text-sm text-gray-600">Estimated Hours</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {tasks.reduce((sum, task) => sum + (task.actual_hours || 0), 0).toFixed(1)}h
              </div>
              <div className="text-sm text-gray-600">Actual Hours</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{activeTimers.size}</div>
              <div className="text-sm text-gray-600">Active Timers</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskBoard;