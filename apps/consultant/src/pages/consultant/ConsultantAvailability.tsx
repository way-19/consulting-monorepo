import { useState, useEffect } from 'react';
import { Clock, Calendar, DollarSign, Ban, Plus, X, Video, Save, Trash2 } from 'lucide-react';
import { createAuthenticatedFetch } from '@consulting19/shared';

interface AvailabilitySlot {
  id?: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  status: string;
  notes?: string;
}

interface BlockedTime {
  id: string;
  title: string;
  start_time: string;
  end_time: string;
  reason?: string;
}

interface MeetingPricing {
  id?: string;
  duration_minutes: number;
  price: number;
  currency: string;
}

interface ConsultantSettings {
  video_platform?: string;
  video_meeting_url?: string;
  meeting_topics?: string[];
  hourly_rate?: number;
}

interface Stats {
  weekly_hours: number;
  active_days: number;
  hourly_rate: number;
  blocked_times: number;
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const ConsultantAvailability = () => {
  const [stats, setStats] = useState<Stats>({ weekly_hours: 0, active_days: 0, hourly_rate: 0, blocked_times: 0 });
  const [availability, setAvailability] = useState<AvailabilitySlot[]>([]);
  const [localSchedule, setLocalSchedule] = useState<{ [key: number]: { start: string; end: string } }>({});
  const [blockedTimes, setBlockedTimes] = useState<BlockedTime[]>([]);
  const [pricing, setPricing] = useState<MeetingPricing[]>([]);
  const [localPricing, setLocalPricing] = useState<{ [key: number]: number }>({});
  const [settings, setSettings] = useState<ConsultantSettings>({
    video_platform: 'google_meet',
    video_meeting_url: '',
    meeting_topics: ['Legal Consulting', 'Business Strategy', 'Tax Planning', 'Company Formation'],
    hourly_rate: 150
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showBlockedModal, setShowBlockedModal] = useState(false);
  const [newBlocked, setNewBlocked] = useState({ title: '', start_time: '', end_time: '', reason: '' });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const authenticatedFetch = createAuthenticatedFetch();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [statsRes, availRes, blockedRes, pricingRes, settingsRes] = await Promise.all([
        authenticatedFetch('/api/availability/stats/self'),
        authenticatedFetch('/api/availability/self'),
        authenticatedFetch('/api/availability/blocked/list'),
        authenticatedFetch('/api/availability/pricing/list'),
        authenticatedFetch('/api/availability/settings/get')
      ]);

      const statsData = await statsRes.json();
      const availData = await availRes.json();
      const blockedData = await blockedRes.json();
      const pricingData = await pricingRes.json();
      const settingsData = await settingsRes.json();

      if (statsData.success) setStats(statsData.stats);
      if (availData.success) {
        setAvailability(availData.availability || []);
        
        // Initialize local schedule from fetched availability
        const scheduleMap: { [key: number]: { start: string; end: string } } = {};
        (availData.availability || []).forEach((slot: AvailabilitySlot) => {
          scheduleMap[slot.day_of_week] = {
            start: slot.start_time,
            end: slot.end_time
          };
        });
        setLocalSchedule(scheduleMap);
      }
      if (blockedData.success) setBlockedTimes(blockedData.blocked_times || []);
      if (pricingData.success) {
        setPricing(pricingData.pricing || []);
        
        // Initialize local pricing from fetched data
        const pricingMap: { [key: number]: number } = {};
        (pricingData.pricing || []).forEach((p: MeetingPricing) => {
          pricingMap[p.duration_minutes] = p.price;
        });
        setLocalPricing(pricingMap);
      }
      if (settingsData.success && settingsData.settings) {
        setSettings({
          ...settingsData.settings,
          meeting_topics: JSON.parse(settingsData.settings.meeting_topics || '[]')
        });
      }
    } catch (error) {
      console.error('Error loading data:', error);
      setError('Failed to load availability data');
    } finally {
      setLoading(false);
    }
  };

  const saveAvailability = async (day: number) => {
    const schedule = localSchedule[day];
    if (!schedule || !schedule.start || !schedule.end) {
      setError('Please set both start and end times');
      return;
    }

    const existing = availability.find(a => a.day_of_week === day);
    
    try {
      const response = existing 
        ? await authenticatedFetch(`/api/availability/${existing.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ start_time: schedule.start, end_time: schedule.end })
          })
        : await authenticatedFetch('/api/availability', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              day_of_week: day, 
              start_time: schedule.start, 
              end_time: schedule.end, 
              status: 'available' 
            })
          });

      if (response.ok) {
        setSuccess('Availability updated successfully');
        setTimeout(() => setSuccess(null), 3000);
        await loadData();
      } else {
        setError('Failed to update availability');
      }
    } catch (error) {
      console.error('Error updating availability:', error);
      setError('Failed to update availability');
    }
  };

  const deleteAvailability = async (id: string) => {
    try {
      const response = await authenticatedFetch(`/api/availability/${id}`, { method: 'DELETE' });
      if (response.ok) {
        setSuccess('Availability deleted successfully');
        setTimeout(() => setSuccess(null), 3000);
        await loadData();
      } else {
        setError('Failed to delete availability');
      }
    } catch (error) {
      console.error('Error deleting availability:', error);
      setError('Failed to delete availability');
    }
  };

  const addBlockedTime = async () => {
    try {
      const response = await authenticatedFetch('/api/availability/blocked', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBlocked)
      });
      
      if (response.ok) {
        setShowBlockedModal(false);
        setNewBlocked({ title: '', start_time: '', end_time: '', reason: '' });
        setSuccess('Blocked time added successfully');
        setTimeout(() => setSuccess(null), 3000);
        await loadData();
      } else {
        setError('Failed to add blocked time');
      }
    } catch (error) {
      console.error('Error adding blocked time:', error);
      setError('Failed to add blocked time');
    }
  };

  const deleteBlockedTime = async (id: string) => {
    try {
      const response = await authenticatedFetch(`/api/availability/blocked/${id}`, { method: 'DELETE' });
      if (response.ok) {
        setSuccess('Blocked time deleted successfully');
        setTimeout(() => setSuccess(null), 3000);
        await loadData();
      } else {
        setError('Failed to delete blocked time');
      }
    } catch (error) {
      console.error('Error deleting blocked time:', error);
      setError('Failed to delete blocked time');
    }
  };

  const updatePricing = async (duration: number) => {
    const price = localPricing[duration];
    
    // Validate price before sending
    if (!price || isNaN(price) || price <= 0) {
      setError('Please enter a valid price');
      return;
    }

    try {
      const response = await authenticatedFetch('/api/availability/pricing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ duration_minutes: duration, price, currency: 'USD' })
      });

      if (response.ok) {
        setSuccess('Pricing updated successfully');
        setTimeout(() => setSuccess(null), 3000);
        await loadData();
      } else {
        setError('Failed to update pricing');
      }
    } catch (error) {
      console.error('Error updating pricing:', error);
      setError('Failed to update pricing');
    }
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      const response = await authenticatedFetch('/api/availability/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });

      if (response.ok) {
        setSuccess('Settings saved successfully');
        setTimeout(() => setSuccess(null), 3000);
        await loadData();
      } else {
        setError('Failed to save settings');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      setError('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>)}
          </div>
        </div>
      </div>
    );
  }

  const getAvailabilityForDay = (day: number) => availability.find(a => a.day_of_week === day);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Success/Error Notifications */}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg flex items-center justify-between">
            <span>{success}</span>
            <button onClick={() => setSuccess(null)} className="text-green-600 hover:text-green-800">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg flex items-center justify-between">
            <span>{error}</span>
            <button onClick={() => setError(null)} className="text-red-600 hover:text-red-800">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Availability Management</h1>
          <p className="text-gray-600 mt-2">Configure your schedule, pricing, and meeting settings</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Weekly Hours</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.weekly_hours}h</p>
              </div>
              <Clock className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Days</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.active_days}</p>
              </div>
              <Calendar className="w-8 h-8 text-green-500" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Hourly Rate</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">${stats.hourly_rate}</p>
              </div>
              <DollarSign className="w-8 h-8 text-purple-500" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Blocked Times</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.blocked_times}</p>
              </div>
              <Ban className="w-8 h-8 text-red-500" />
            </div>
          </div>
        </div>

        {/* Weekly Schedule */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Weekly Schedule</h2>
          <div className="space-y-3">
            {DAYS.map((day, index) => {
              const slot = getAvailabilityForDay(index);
              const localTime = localSchedule[index] || { start: slot?.start_time || '09:00', end: slot?.end_time || '17:00' };
              
              return (
                <div key={day} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <span className="font-medium text-gray-900 w-28">{day}</span>
                  <div className="flex items-center gap-4 flex-1">
                    <input
                      type="time"
                      value={localTime.start}
                      onChange={(e) => setLocalSchedule({ 
                        ...localSchedule, 
                        [index]: { ...localTime, start: e.target.value } 
                      })}
                      onBlur={() => saveAvailability(index)}
                      className="border border-gray-300 rounded px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-gray-500">to</span>
                    <input
                      type="time"
                      value={localTime.end}
                      onChange={(e) => setLocalSchedule({ 
                        ...localSchedule, 
                        [index]: { ...localTime, end: e.target.value } 
                      })}
                      onBlur={() => saveAvailability(index)}
                      className="border border-gray-300 rounded px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500"
                    />
                    {slot && (
                      <button
                        onClick={() => deleteAvailability(slot.id!)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Blocked Times */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Blocked Times</h2>
              <button
                onClick={() => setShowBlockedModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                <Plus className="w-4 h-4" /> Add Block
              </button>
            </div>
            <div className="space-y-2">
              {blockedTimes.length === 0 ? (
                <p className="text-gray-500 text-sm">No blocked times</p>
              ) : (
                blockedTimes.map(block => (
                  <div key={block.id} className="flex items-center justify-between p-3 border border-gray-200 rounded">
                    <div>
                      <p className="font-medium text-gray-900">{block.title}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(block.start_time).toLocaleDateString()} - {new Date(block.end_time).toLocaleDateString()}
                      </p>
                    </div>
                    <button
                      onClick={() => deleteBlockedTime(block.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Meeting Pricing */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Meeting Pricing</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 border border-gray-200 rounded">
                <span className="font-medium text-gray-900">30 min session</span>
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">$</span>
                  <input
                    type="number"
                    value={localPricing[30] || pricing.find(p => p.duration_minutes === 30)?.price || 250}
                    onChange={(e) => setLocalPricing({ ...localPricing, 30: parseFloat(e.target.value) })}
                    onBlur={() => updatePricing(30)}
                    className="w-24 border border-gray-300 rounded px-3 py-1.5 text-sm"
                  />
                </div>
              </div>
              <div className="flex items-center justify-between p-3 border border-gray-200 rounded">
                <span className="font-medium text-gray-900">60 min session</span>
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">$</span>
                  <input
                    type="number"
                    value={localPricing[60] || pricing.find(p => p.duration_minutes === 60)?.price || 400}
                    onChange={(e) => setLocalPricing({ ...localPricing, 60: parseFloat(e.target.value) })}
                    onBlur={() => updatePricing(60)}
                    className="w-24 border border-gray-300 rounded px-3 py-1.5 text-sm"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Settings */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Meeting Settings</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Video Platform</label>
              <select
                value={settings.video_platform}
                onChange={(e) => setSettings({ ...settings, video_platform: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
              >
                <option value="google_meet">Google Meet</option>
                <option value="zoom">Zoom</option>
                <option value="teams">Microsoft Teams</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Meeting URL</label>
              <div className="relative">
                <Video className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="url"
                  value={settings.video_meeting_url}
                  onChange={(e) => setSettings({ ...settings, video_meeting_url: e.target.value })}
                  placeholder="https://meet.google.com/xxx-xxxx-xxx"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <button
              onClick={saveSettings}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div> : <Save className="w-4 h-4" />}
              {saving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </div>
      </div>

      {/* Blocked Time Modal */}
      {showBlockedModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Blocked Time</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={newBlocked.title}
                  onChange={(e) => setNewBlocked({ ...newBlocked, title: e.target.value })}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  placeholder="e.g., Vacation, Conference"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                  <input
                    type="datetime-local"
                    value={newBlocked.start_time}
                    onChange={(e) => setNewBlocked({ ...newBlocked, start_time: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                  <input
                    type="datetime-local"
                    value={newBlocked.end_time}
                    onChange={(e) => setNewBlocked({ ...newBlocked, end_time: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reason (Optional)</label>
                <textarea
                  value={newBlocked.reason}
                  onChange={(e) => setNewBlocked({ ...newBlocked, reason: e.target.value })}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  rows={2}
                  placeholder="Optional reason for blocking"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowBlockedModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={addBlockedTime}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Add Block
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConsultantAvailability;
