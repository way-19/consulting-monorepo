import { useState, useEffect } from 'react';
import { Calendar, Globe, Save } from 'lucide-react';

interface AvailabilityData {
  timezone: string;
  calendar_url: string;
  weekly: {
    [key: string]: {
      enabled: boolean;
      morning: boolean;
      afternoon: boolean;
      evening: boolean;
    };
  };
}

const ConsultantAvailability = () => {
  const [availability, setAvailability] = useState<AvailabilityData>({
    timezone: 'UTC',
    calendar_url: '',
    weekly: {
      monday: { enabled: true, morning: true, afternoon: true, evening: false },
      tuesday: { enabled: true, morning: true, afternoon: true, evening: false },
      wednesday: { enabled: true, morning: true, afternoon: true, evening: false },
      thursday: { enabled: true, morning: true, afternoon: true, evening: false },
      friday: { enabled: true, morning: true, afternoon: true, evening: false },
      saturday: { enabled: false, morning: false, afternoon: false, evening: false },
      sunday: { enabled: false, morning: false, afternoon: false, evening: false },
    }
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const updateDayAvailability = (day: string, field: string, value: boolean) => {
    setAvailability(prev => ({
      ...prev,
      weekly: {
        ...prev.weekly,
        [day]: {
          ...prev.weekly[day],
          [field]: value,
        }
      }
    }));
  };

  const saveAvailability = async () => {
    setSaving(true);
    // Simulate saving
    setTimeout(() => {
      setSaving(false);
      alert('Availability saved successfully!');
    }, 1000);
  };

  const timezones = [
    'UTC',
    'America/New_York',
    'America/Los_Angeles',
    'Europe/London',
    'Europe/Berlin',
    'Europe/Istanbul',
    'Asia/Dubai',
    'Asia/Singapore',
    'Asia/Tokyo',
    'Australia/Sydney',
  ];

  const days = [
    'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-64 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Availability</h1>
          <p className="text-gray-600">Manage your schedule and booking settings</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Settings */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">General Settings</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Timezone
                </label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <select
                    value={availability.timezone}
                    onChange={(e) => setAvailability(prev => ({ ...prev, timezone: e.target.value }))}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {timezones.map(tz => (
                      <option key={tz} value={tz}>{tz}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Calendar URL
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="url"
                    value={availability.calendar_url}
                    onChange={(e) => setAvailability(prev => ({ ...prev, calendar_url: e.target.value }))}
                    placeholder="https://calendar.google.com/..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Optional: Link to your Google Calendar or Outlook for automatic sync
                </p>
              </div>
            </div>
          </div>

          {/* Weekly Schedule */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Weekly Hours</h2>
            <div className="space-y-4">
              {days.map(day => (
                <div key={day} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={availability.weekly[day]?.enabled || false}
                      onChange={(e) => updateDayAvailability(day, 'enabled', e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="font-medium text-gray-900 capitalize">
                      {day}
                    </span>
                  </div>
                  
                  {availability.weekly[day]?.enabled && (
                    <div className="flex space-x-2">
                      <label className="flex items-center space-x-1">
                        <input
                          type="checkbox"
                          checked={availability.weekly[day]?.morning || false}
                          onChange={(e) => updateDayAvailability(day, 'morning', e.target.checked)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-600">Morning</span>
                      </label>
                      <label className="flex items-center space-x-1">
                        <input
                          type="checkbox"
                          checked={availability.weekly[day]?.afternoon || false}
                          onChange={(e) => updateDayAvailability(day, 'afternoon', e.target.checked)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-600">Afternoon</span>
                      </label>
                      <label className="flex items-center space-x-1">
                        <input
                          type="checkbox"
                          checked={availability.weekly[day]?.evening || false}
                          onChange={(e) => updateDayAvailability(day, 'evening', e.target.checked)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-600">Evening</span>
                      </label>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-8 flex justify-end">
          <button
            onClick={saveAvailability}
            disabled={saving}
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {saving ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConsultantAvailability;