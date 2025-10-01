import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Calendar, Clock, User, MapPin } from 'lucide-react';
import { useAuth, createAuthenticatedFetch } from '@consulting19/shared';

interface AvailabilitySlot {
  id: number;
  day_of_week: number;
  start_time: string;
  end_time: string;
  status: string;
  notes: string | null;
  first_name: string;
  last_name: string;
  email: string;
}

const ClientAvailability = () => {
  const { user } = useAuth();
  const [availability, setAvailability] = useState<AvailabilitySlot[]>([]);
  const [consultantId, setConsultantId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const authFetch = createAuthenticatedFetch();

  const daysOfWeek = [
    { id: 0, name: 'Sunday', short: 'Sun' },
    { id: 1, name: 'Monday', short: 'Mon' },
    { id: 2, name: 'Tuesday', short: 'Tue' },
    { id: 3, name: 'Wednesday', short: 'Wed' },
    { id: 4, name: 'Thursday', short: 'Thu' },
    { id: 5, name: 'Friday', short: 'Fri' },
    { id: 6, name: 'Saturday', short: 'Sat' }
  ];

  useEffect(() => {
    if (user) {
      fetchClientConsultant();
    }
  }, [user]);

  useEffect(() => {
    if (consultantId) {
      fetchAvailability();
    }
  }, [consultantId]);

  const fetchClientConsultant = async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }
    
    try {
      const response = await authFetch(`/api/users/${user.id}`, {
        method: 'GET'
      });

      if (!response.ok) {
        throw new Error('Failed to fetch client data');
      }

      const data = await response.json();
      if (data.user?.client?.assigned_consultant_id) {
        setConsultantId(data.user.client.assigned_consultant_id);
      } else {
        // No consultant assigned - stop loading
        setLoading(false);
      }
    } catch (error) {
      console.error('Error fetching client consultant:', error);
      setLoading(false);
    }
  };

  const fetchAvailability = async () => {
    try {
      setLoading(true);
      const response = await authFetch(`/api/availability/${consultantId}`, {
        method: 'GET'
      });

      if (!response.ok) {
        throw new Error('Failed to fetch availability');
      }

      const data = await response.json();
      setAvailability(data.availability || []);
    } catch (error) {
      console.error('Error fetching availability:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'busy':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'off':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const getSlotsForDay = (dayId: number) => {
    return availability.filter(slot => slot.day_of_week === dayId);
  };

  const consultantName = availability.length > 0 
    ? `${availability[0].first_name} ${availability[0].last_name}`
    : 'Your Consultant';

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Consultant Availability - Client Portal</title>
      </Helmet>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Consultant Availability</h1>
            <p className="text-gray-600 mt-1">View your consultant's working hours and availability</p>
          </div>
        </div>

        {/* Consultant Info Card */}
        {availability.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-teal-600 rounded-full flex items-center justify-center shadow-lg">
                <User className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{consultantName}</h2>
                <p className="text-gray-600 flex items-center mt-1">
                  <MapPin className="w-4 h-4 mr-1" />
                  {availability[0].email}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Weekly Calendar */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
          <div className="p-6 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">Weekly Schedule</h3>
            </div>
          </div>

          {!consultantId ? (
            <div className="p-12 text-center">
              <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Consultant Assigned</h3>
              <p className="text-gray-600">
                You don't have a consultant assigned yet. A consultant will be assigned to you after your first order.
              </p>
            </div>
          ) : availability.length === 0 ? (
            <div className="p-12 text-center">
              <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Availability Set</h3>
              <p className="text-gray-600">
                Your consultant hasn't set their availability schedule yet.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {daysOfWeek.map(day => {
                const slots = getSlotsForDay(day.id);
                
                return (
                  <div key={day.id} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start space-x-4">
                      <div className="w-24 flex-shrink-0">
                        <p className="font-semibold text-gray-900">{day.name}</p>
                        <p className="text-sm text-gray-500">{day.short}</p>
                      </div>
                      
                      <div className="flex-1">
                        {slots.length === 0 ? (
                          <div className="text-gray-400 italic">No availability</div>
                        ) : (
                          <div className="space-y-2">
                            {slots.map(slot => (
                              <div 
                                key={slot.id} 
                                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                              >
                                <div className="flex items-center space-x-3">
                                  <Clock className="w-4 h-4 text-gray-500" />
                                  <span className="font-medium text-gray-900">
                                    {formatTime(slot.start_time)} - {formatTime(slot.end_time)}
                                  </span>
                                </div>
                                
                                <div className="flex items-center space-x-3">
                                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(slot.status)}`}>
                                    {slot.status.charAt(0).toUpperCase() + slot.status.slice(1)}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Info Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Clock className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-blue-900">Booking Information</h4>
              <p className="text-sm text-blue-700 mt-1">
                These are your consultant's available hours. To schedule a meeting, please use the Calendar page 
                or contact your consultant directly via Messages.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ClientAvailability;
