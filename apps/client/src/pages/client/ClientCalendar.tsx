import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '@consulting19/shared';
import { supabase } from '@consulting19/shared/lib/supabase';
import {
  Calendar as CalendarIcon,
  Clock,
  DollarSign,
  Users,
  Briefcase,
  CheckCircle,
  Plus,
  Settings,
  Save,
  User,
  Building,
  MessageSquare,
  Star,
  X,
  Bell
} from 'lucide-react';

interface Department {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: string;
}

interface Consultant {
  id: string;
  full_name: string;
  email: string;
  timezone: string;
  price_per_hour: number;
  currency: string;
}

interface Meeting {
  id: string;
  title: string;
  description: string;
  start_time: string;
  end_time: string;
  status: string;
  price_paid: number;
  currency: string;
  meeting_url?: string;
  consultant?: {
    full_name: string;
  };
  department?: {
    name: string;
  };
}

const ClientCalendar = () => {
  const { user, profile } = useAuth();
  
  // State variables
  const [departments, setDepartments] = useState<Department[]>([]);
  const [consultants, setConsultants] = useState<Consultant[]>([]);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedConsultant, setSelectedConsultant] = useState('');
  const [liveSlotDuration, setLiveSlotDuration] = useState(60); // Dynamic slot duration
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  
  // Modal states
  const [showPreferencesModal, setShowPreferencesModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<any>(null);
  const [meetingTitle, setMeetingTitle] = useState('');
  const [meetingDescription, setMeetingDescription] = useState('');
  
  // Preferences
  const [userPreferences, setUserPreferences] = useState<any>({});
  const [tempPreferences, setTempPreferences] = useState<any>({});
  
  const slotDurationOptions = [30, 60, 90, 120];

  // Fetch data functions
  const fetchDepartments = useCallback(async () => {
    const { data, error } = await supabase
      .from('departments')
      .select('*')
      .eq('is_active', true)
      .order('sort_order');
    
    if (error) {
      console.error('Error fetching departments:', error);
    } else {
      setDepartments(data || []);
    }
  }, []);

  const fetchConsultants = useCallback(async () => {
    const { data, error } = await supabase
      .from('user_profiles')
      .select(`
        id, full_name, email, timezone,
        consultant_availability(price_per_hour, currency)
      `)
      .eq('role', 'consultant')
      .eq('is_active', true);
    
    if (error) {
      console.error('Error fetching consultants:', error);
    } else {
      const mappedConsultants = (data || []).map((c: any) => ({
        id: c.id,
        full_name: c.full_name,
        email: c.email,
        timezone: c.timezone || 'UTC',
        price_per_hour: c.consultant_availability?.[0]?.price_per_hour || 150,
        currency: c.consultant_availability?.[0]?.currency || 'USD',
      }));
      setConsultants(mappedConsultants);
    }
  }, []);

  const fetchMeetings = useCallback(async () => {
    if (!user?.id) return;
    
    try {
      const { data: clientData } = await supabase
        .from('clients')
        .select('id')
        .eq('profile_id', user.id)
        .single();

      if (!clientData) return;

      const { data, error } = await supabase
        .from('meetings')
        .select(`
          *,
          consultant:user_profiles(full_name),
          department:departments(name)
        `)
        .eq('client_id', clientData.id)
        .order('start_time');

      if (error) {
        console.error('Error fetching meetings:', error);
      } else {
        setMeetings(data || []);
      }
    } catch (err) {
      console.error('Error:', err);
    }
  }, [user?.id]);

  const fetchUserPreferences = useCallback(async () => {
    if (!user?.id) return;
    
    const { data, error } = await supabase
      .from('user_preferences')
      .select('*')
      .eq('user_id', user.id);

    if (error) {
      console.error('Error fetching preferences:', error);
    } else {
      const prefs: any = {};
      (data || []).forEach(p => {
        prefs[p.setting_key] = p.setting_value;
      });
      setUserPreferences(prefs);
      setTempPreferences(prefs);
      
      // Set initial values from preferences
      if (prefs.default_slot_duration) {
        setLiveSlotDuration(prefs.default_slot_duration);
      }
      if (prefs.preferred_consultant_id) {
        setSelectedConsultant(prefs.preferred_consultant_id);
      }
    }
  }, [user?.id]);

  useEffect(() => {
    Promise.all([
      fetchDepartments(),
      fetchConsultants(),
      fetchUserPreferences(),
      fetchMeetings()
    ]).then(() => setLoading(false));
  }, [fetchDepartments, fetchConsultants, fetchUserPreferences, fetchMeetings]);

  // Calculate dynamic pricing based on selected duration
  const calculateSlotPrice = (duration: number) => {
    const selectedConsultantInfo = consultants.find(c => c.id === selectedConsultant);
    if (!selectedConsultantInfo) return 0;
    return (selectedConsultantInfo.price_per_hour / 60) * duration;
  };

  // Handle preference saving
  const handleSavePreferences = async () => {
    setBookingLoading(true);
    try {
      const updates = Object.keys(tempPreferences).map(key => ({
        user_id: user?.id,
        setting_key: key,
        setting_value: tempPreferences[key],
      }));

      const { error } = await supabase
        .from('user_preferences')
        .upsert(updates, { onConflict: 'user_id,setting_key' });

      if (error) throw error;

      setUserPreferences(tempPreferences);
      setLiveSlotDuration(tempPreferences.default_slot_duration || 60);
      alert('Preferences saved successfully!');
      setShowPreferencesModal(false);
    } catch (error: any) {
      console.error('Error saving preferences:', error);
      alert('Failed to save preferences');
    } finally {
      setBookingLoading(false);
    }
  };

  const selectedConsultantInfo = consultants.find(c => c.id === selectedConsultant);
  const upcomingMeetings = meetings.filter(m => new Date(m.start_time) > new Date());
  const totalMeetings = meetings.length;

  if (loading) {
    return (
      <>
        <Helmet>
          <title>Calendar - Client Portal</title>
        </Helmet>
        <div className="space-y-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
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
        <title>Calendar - Client Portal</title>
      </Helmet>

      <div className="space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Calendar & Meetings</h1>
            <p className="text-gray-600">Schedule and manage your consultations</p>
          </div>
          <button
            onClick={() => setShowPreferencesModal(true)}
            className="inline-flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            <Settings className="w-4 h-4 mr-2" />
            Preferences
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Upcoming Meetings</p>
                <p className="text-3xl font-bold text-gray-900">{upcomingMeetings.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
                <CalendarIcon className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Meetings</p>
                <p className="text-3xl font-bold text-gray-900">{totalMeetings}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Your Consultant</p>
                <p className="text-xl font-bold text-gray-900">{selectedConsultantInfo?.full_name || 'Not Selected'}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center">
                <User className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex flex-col md:flex-row gap-4">
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select Department (Optional)</option>
            {departments.map(dept => (
              <option key={dept.id} value={dept.id}>{dept.name}</option>
            ))}
          </select>
          <select
            value={selectedConsultant}
            onChange={(e) => setSelectedConsultant(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select Consultant</option>
            {consultants.map(cons => (
              <option key={cons.id} value={cons.id}>{cons.full_name}</option>
            ))}
          </select>
          <select
            value={liveSlotDuration}
            onChange={(e) => setLiveSlotDuration(Number(e.target.value))}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {slotDurationOptions.map(duration => (
              <option key={duration} value={duration}>{duration} minutes</option>
            ))}
          </select>
        </div>

        {/* This Week's Overview */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">This Week's Overview</h2>
          <p className="text-gray-600 mb-6">
            Current slot duration: {liveSlotDuration} minutes • 
            Price per slot: ${selectedConsultantInfo ? calculateSlotPrice(liveSlotDuration).toFixed(2) : '0.00'}
          </p>
          <div className="grid grid-cols-7 gap-4">
            {Array.from({length: 7}).map((_, i) => {
              const date = new Date();
              date.setDate(date.getDate() + i);
              return (
                <div key={i} className="text-center">
                  <div className="text-sm font-medium text-gray-600">
                    {date.toLocaleDateString('en-US', { weekday: 'short' })}
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{date.getDate()}</div>
                  <div className="text-xs text-gray-500 mb-2">
                    {date.toLocaleDateString('en-US', { month: 'short' })}
                  </div>
                  <div className="space-y-2">
                    <button
                      onClick={() => {
                        setSelectedSlot({
                          start: new Date(date.setHours(10, 0)),
                          end: new Date(date.setHours(10 + Math.floor(liveSlotDuration/60), liveSlotDuration%60)),
                          price: selectedConsultantInfo ? calculateSlotPrice(liveSlotDuration) : 0,
                          currency: selectedConsultantInfo?.currency || 'USD'
                        });
                        setShowBookingModal(true);
                      }}
                      className="w-full p-2 bg-blue-100 text-blue-800 rounded-lg text-xs hover:bg-blue-200"
                    >
                      10:00 - {Math.floor(10 + liveSlotDuration/60)}:{liveSlotDuration%60 === 0 ? '00' : liveSlotDuration%60}
                      <span className="block mt-1">
                        ${selectedConsultantInfo ? calculateSlotPrice(liveSlotDuration).toFixed(2) : '0.00'}
                      </span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Upcoming Meetings */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Upcoming Meetings ({upcomingMeetings.length})</h2>
          {meetings.length > 0 ? (
            <div className="space-y-4">
              {meetings.map(meeting => (
                <div key={meeting.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{meeting.title}</h3>
                      <div className="text-sm text-gray-600">
                        {new Date(meeting.start_time).toLocaleString()} with {meeting.consultant?.full_name}
                      </div>
                      {meeting.department && (
                        <div className="text-xs text-gray-500 mt-1">{meeting.department.name}</div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {meeting.meeting_url && (
                      <a
                        href={meeting.meeting_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
                      >
                        <MessageSquare className="w-4 h-4 mr-1 inline" />
                        Join
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <CalendarIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No meetings scheduled</p>
            </div>
          )}
        </div>

        {/* Preferences Modal */}
        {showPreferencesModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Calendar Preferences</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Default Meeting Duration
                  </label>
                  <select
                    value={tempPreferences.default_slot_duration || 60}
                    onChange={(e) => setTempPreferences(prev => ({ ...prev, default_slot_duration: Number(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {slotDurationOptions.map(duration => (
                      <option key={duration} value={duration}>{duration} minutes</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Consultant
                  </label>
                  <select
                    value={tempPreferences.preferred_consultant_id || ''}
                    onChange={(e) => setTempPreferences(prev => ({ ...prev, preferred_consultant_id: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">None</option>
                    {consultants.map(cons => (
                      <option key={cons.id} value={cons.id}>{cons.full_name}</option>
                    ))}
                  </select>
                </div>

                {/* Email Reminders */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Reminders
                  </label>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={tempPreferences.enable_email_reminders || false}
                      onChange={(e) => setTempPreferences(prev => ({ ...prev, enable_email_reminders: e.target.checked }))}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-900">Enable email reminders for meetings</span>
                  </div>
                </div>

                {/* In-App Notifications */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    In-App Notifications
                  </label>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={tempPreferences.enable_in_app_reminders || false}
                      onChange={(e) => setTempPreferences(prev => ({ ...prev, enable_in_app_reminders: e.target.checked }))}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-900">Enable in-app notifications for meetings</span>
                  </div>
                </div>

                {/* Default Reminder Time */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Default Reminder Time
                  </label>
                  <select
                    value={tempPreferences.default_reminder_time || 15}
                    onChange={(e) => setTempPreferences(prev => ({ ...prev, default_reminder_time: Number(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value={5}>5 minutes before</option>
                    <option value={15}>15 minutes before</option>
                    <option value={30}>30 minutes before</option>
                    <option value={60}>1 hour before</option>
                    <option value={120}>2 hours before</option>
                    <option value={1440}>1 day before</option>
                  </select>
                </div>

                {/* Auto-join Meetings */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Auto-join Meetings
                  </label>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={tempPreferences.auto_join_meetings || false}
                      onChange={(e) => setTempPreferences(prev => ({ ...prev, auto_join_meetings: e.target.checked }))}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-900">Automatically join meetings when they start</span>
                  </div>
                </div>

              </div>
              <div className="flex items-center space-x-3 mt-6">
                <button
                  onClick={() => setShowPreferencesModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSavePreferences}
                  disabled={bookingLoading}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  {bookingLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Preferences
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Booking Modal */}
        {showBookingModal && selectedSlot && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Book Meeting</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date & Time
                  </label>
                  <p className="p-3 bg-gray-100 rounded-lg text-gray-800">
                    {selectedSlot.start?.toLocaleString()} - {selectedSlot.end?.toLocaleString()}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meeting Title *
                  </label>
                  <input
                    type="text"
                    value={meetingTitle}
                    onChange={(e) => setMeetingTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Initial Consultation"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={meetingDescription}
                    onChange={(e) => setMeetingDescription(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                    placeholder="Briefly describe meeting agenda"
                  />
                </div>
                {selectedSlot.price > 0 && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm font-medium text-blue-800">
                      Price: <span className="font-bold">${selectedSlot.price?.toFixed(2)} {selectedSlot.currency}</span>
                      <span className="ml-2 text-purple-600">({liveSlotDuration} min session)</span>
                    </p>
                  </div>
                )}
              </div>
              <div className="flex items-center space-x-3 mt-6">
                <button
                  onClick={() => setShowBookingModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => alert('Meeting booking will be implemented with database!')}
                  disabled={bookingLoading || !meetingTitle.trim()}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  Book Meeting
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ClientCalendar;