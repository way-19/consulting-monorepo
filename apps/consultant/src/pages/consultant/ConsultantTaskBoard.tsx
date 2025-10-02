import { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Search, Clock, Play, Square, Calendar, User, MoreVertical } from 'lucide-react';
import { useAuth, createAuthenticatedFetch } from '@consulting19/shared';

interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  due_date: string | null;
  estimated_hours: number;
  actual_hours: number;
  billable: boolean;
  is_client_visible: boolean;
  client_first_name: string | null;
  client_last_name: string | null;
  client_company: string | null;
  project_title: string | null;
  created_at: string;
  updated_at: string;
}

interface TaskTimer {
  taskId: string;
  startTime: Date;
  elapsedTime: number;
}

interface ServiceOrder {
  id: string;
  order_number: string;
  service_name: string;
  service_category: string;
  client_name: string;
  client_email: string;
  total_amount: number;
  status: string;
  created_at: string;
}

const ConsultantTaskBoard = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [serviceOrders, setServiceOrders] = useState<ServiceOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [activeTimers, setActiveTimers] = useState<Map<string, TaskTimer>>(new Map());

  const authFetch = createAuthenticatedFetch();

  const columns = [
    { id: 'todo', title: 'To Do', emoji: '📋' },
    { id: 'in_progress', title: 'In Progress', emoji: '🔄' },
    { id: 'review', title: 'Review', emoji: '👀' },
    { id: 'completed', title: 'Completed', emoji: '✅' }
  ];

  useEffect(() => {
    if (user) {
      fetchTasks();
      fetchServiceOrders();
    }
  }, [user]);

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

  const fetchTasks = async () => {
    try {
      setLoading(true);

      const response = await authFetch('/api/tasks?limit=100', {
        method: 'GET'
      });

      if (!response.ok) {
        throw new Error('Failed to fetch tasks');
      }

      const data = await response.json();
      setTasks(data.tasks || []);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchServiceOrders = async () => {
    try {
      const response = await authFetch('/api/consultant-services/orders');
      
      if (!response.ok) {
        console.error('Failed to fetch service orders');
        return;
      }

      const data = await response.json();
      setServiceOrders(data.orders || []);
    } catch (error) {
      console.error('Error fetching service orders:', error);
    }
  };

  const updateServiceOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const response = await authFetch(`/api/consultant-services/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) {
        throw new Error('Failed to update order status');
      }

      await fetchServiceOrders();
    } catch (error) {
      console.error('Error updating service order status:', error);
      alert('Failed to update order status');
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
        status: newStatus
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

      const response = await authFetch(`/api/tasks/${taskId}`, {
        method: 'PATCH',
        body: JSON.stringify(updateData)
      });

      if (!response.ok) {
        throw new Error('Failed to update task status');
      }

      // Refresh to get updated data
      fetchTasks();
    } catch (error) {
      console.error('Error updating task:', error);
      // Revert optimistic update
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
        const response = await authFetch(`/api/tasks/${taskId}`, {
          method: 'PATCH',
          body: JSON.stringify({ actual_hours: newActualHours })
        });

        if (response.ok) {
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
          <div className="mb-4">
            <h1 className="text-3xl font-bold text-gray-900">Task Board</h1>
            <p className="text-gray-600">Tasks are automatically created from orders. Drag and drop to update status.</p>
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

        {/* Service Orders Section */}
        {serviceOrders.length > 0 && (
          <div className="mb-8">
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Service Orders</h2>
              <p className="text-gray-600">Custom services purchased by clients</p>
            </div>

            <div className="bg-white rounded-lg shadow-md divide-y divide-gray-200">
              {serviceOrders.map((order) => (
                <div key={order.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {order.service_name}
                        </h3>
                        {order.service_category && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                            {order.service_category}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                        <span className="flex items-center">
                          <User className="w-4 h-4 mr-1" />
                          {order.client_name}
                        </span>
                        <span>•</span>
                        <span>Order #{order.order_number}</span>
                        <span>•</span>
                        <span>{new Date(order.created_at).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <select
                          value={order.status}
                          onChange={(e) => updateServiceOrderStatus(order.id, e.target.value)}
                          className={`px-3 py-1 text-sm rounded-lg border-2 font-medium ${
                            order.status === 'completed' 
                              ? 'bg-green-50 text-green-800 border-green-200'
                              : order.status === 'in_progress'
                              ? 'bg-blue-50 text-blue-800 border-blue-200'
                              : 'bg-yellow-50 text-yellow-800 border-yellow-200'
                          }`}
                        >
                          <option value="pending">Pending</option>
                          <option value="in_progress">In Progress</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <p className="text-2xl font-bold text-gray-900">
                        ${order.total_amount.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Kanban Board with Drag & Drop */}
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {columns.map((column) => {
              const columnTasks = filteredTasks.filter(task => task.status === column.id);
              
              return (
                <div key={column.id} className="bg-gray-100 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900 flex items-center">
                      <span className="text-2xl mr-2">{column.emoji}</span>
                      {column.title}
                      <span className="ml-2 px-2 py-1 bg-white rounded-full text-sm">
                        {columnTasks.length}
                      </span>
                    </h3>
                  </div>

                  <Droppable droppableId={column.id}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`min-h-[500px] transition-colors ${
                          snapshot.isDraggingOver ? 'bg-blue-50' : ''
                        }`}
                      >
                        <div className="space-y-3">
                          {columnTasks.map((task, index) => {
                            const timer = activeTimers.get(task.id);
                            const clientName = task.client_first_name || task.client_last_name 
                              ? `${task.client_first_name || ''} ${task.client_last_name || ''}`.trim()
                              : task.client_company || 'Unknown';

                            return (
                              <Draggable key={task.id} draggableId={task.id} index={index}>
                                {(provided, snapshot) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    className={`bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow ${
                                      snapshot.isDragging ? 'shadow-lg ring-2 ring-blue-500' : ''
                                    }`}
                                  >
                                    {/* Priority Badge */}
                                    <div className="flex items-center justify-between mb-2">
                                      <span className={`px-2 py-1 rounded text-xs font-medium border ${getPriorityColor(task.priority)}`}>
                                        {task.priority}
                                      </span>
                                      <button className="text-gray-400 hover:text-gray-600">
                                        <MoreVertical className="w-4 h-4" />
                                      </button>
                                    </div>

                                    {/* Task Title */}
                                    <h4 className="font-semibold text-gray-900 mb-2">
                                      {task.title}
                                    </h4>

                                    {/* Task Description */}
                                    {task.description && (
                                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                        {task.description}
                                      </p>
                                    )}

                                    {/* Task Meta */}
                                    <div className="space-y-2 mb-3">
                                      <div className="flex items-center text-xs text-gray-500">
                                        <User className="w-3 h-3 mr-1" />
                                        <span className="truncate">{clientName}</span>
                                      </div>
                                      {task.project_title && (
                                        <div className="flex items-center text-xs text-gray-500">
                                          <span className="truncate">{task.project_title}</span>
                                        </div>
                                      )}
                                      {task.due_date && (
                                        <div className="flex items-center text-xs text-gray-500">
                                          <Calendar className="w-3 h-3 mr-1" />
                                          <span>{new Date(task.due_date).toLocaleDateString()}</span>
                                        </div>
                                      )}
                                    </div>

                                    {/* Timer */}
                                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                                      <div className="flex items-center text-xs text-gray-600">
                                        <Clock className="w-3 h-3 mr-1" />
                                        <span>
                                          {task.actual_hours ? task.actual_hours.toFixed(1) : '0.0'}h
                                          {task.estimated_hours ? ` / ${task.estimated_hours}h` : ''}
                                        </span>
                                      </div>
                                      
                                      {timer ? (
                                        <div className="flex items-center space-x-2">
                                          <span className="text-xs font-mono text-red-600">
                                            {formatTime(timer.elapsedTime)}
                                          </span>
                                          <button
                                            onClick={() => stopTimer(task.id)}
                                            className="p-1 bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors"
                                          >
                                            <Square className="w-3 h-3" />
                                          </button>
                                        </div>
                                      ) : (
                                        <button
                                          onClick={() => startTimer(task.id)}
                                          className="p-1 bg-green-100 text-green-600 rounded hover:bg-green-200 transition-colors"
                                        >
                                          <Play className="w-3 h-3" />
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                )}
                              </Draggable>
                            );
                          })}
                          {provided.placeholder}
                        </div>
                      </div>
                    )}
                  </Droppable>
                </div>
              );
            })}
          </div>
        </DragDropContext>
      </div>
    </div>
  );
};

export default ConsultantTaskBoard;
