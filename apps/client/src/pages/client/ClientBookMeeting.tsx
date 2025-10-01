import { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Clock, DollarSign, Video, ChevronRight, User } from 'lucide-react';
import { createAuthenticatedFetch } from '@consulting19/shared';

interface Consultant {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  country_code?: string;
}

interface AvailableSlot {
  start_time: string;
  end_time: string;
  duration_minutes: number;
}

interface MeetingPricing {
  duration_minutes: number;
  price: number;
  currency: string;
}

const ClientBookMeeting = () => {
  const [consultants, setConsultants] = useState<Consultant[]>([]);
  const [selectedConsultant, setSelectedConsultant] = useState<Consultant | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [availableSlots, setAvailableSlots] = useState<AvailableSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<AvailableSlot | null>(null);
  const [pricing, setPricing] = useState<MeetingPricing[]>([]);
  const [selectedDuration, setSelectedDuration] = useState<number>(30);
  const [meetingTopic, setMeetingTopic] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const authenticatedFetch = createAuthenticatedFetch();

  useEffect(() => {
    loadConsultants();
  }, []);

  useEffect(() => {
    if (selectedConsultant && selectedDate) {
      loadAvailableSlots();
    }
  }, [selectedConsultant, selectedDate]);

  useEffect(() => {
    if (selectedConsultant) {
      loadPricing();
    }
  }, [selectedConsultant]);

  const loadConsultants = async () => {
    try {
      const response = await authenticatedFetch('/api/users?role=consultant&is_active=true');
      const data = await response.json();
      setConsultants(data || []);
    } catch (err) {
      console.error('Error loading consultants:', err);
      setError('Failed to load consultants');
    }
  };

  const loadAvailableSlots = async () => {
    if (!selectedConsultant || !selectedDate) return;
    
    setLoading(true);
    try {
      const response = await authenticatedFetch(
        `/api/meetings/available/${selectedConsultant.id}?date=${selectedDate}`
      );
      const data = await response.json();
      setAvailableSlots(data.slots || []);
    } catch (err) {
      console.error('Error loading slots:', err);
      setError('Failed to load available slots');
    } finally {
      setLoading(false);
    }
  };

  const loadPricing = async () => {
    if (!selectedConsultant) return;

    try {
      const response = await authenticatedFetch(`/api/availability/pricing/${selectedConsultant.id}`);
      const data = await response.json();
      if (data.success) {
        setPricing(data.pricing || []);
      }
    } catch (err) {
      console.error('Error loading pricing:', err);
    }
  };

  const handleBook = async () => {
    if (!selectedConsultant || !selectedSlot || !selectedDuration || !meetingTopic) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const response = await authenticatedFetch('/api/meetings/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          consultant_id: selectedConsultant.id,
          start_time: selectedSlot.start_time,
          duration_minutes: selectedDuration,
          meeting_topic: meetingTopic,
          title: `${selectedDuration}min Consultation - ${meetingTopic}`
        })
      });

      const data = await response.json();
      
      if (data.success && data.checkout_url) {
        window.location.href = data.checkout_url;
      } else {
        setError('Failed to create booking');
      }
    } catch (err) {
      console.error('Error booking meeting:', err);
      setError('Failed to create booking');
    } finally {
      setLoading(false);
    }
  };

  const getCurrentPrice = () => {
    const priceObj = pricing.find(p => p.duration_minutes === selectedDuration);
    return priceObj ? priceObj.price : (selectedDuration === 30 ? 250 : 400);
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Book a Meeting</h1>
          <p className="text-gray-600 mt-2">Schedule a consultation with our expert advisors</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Step 1: Select Consultant */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-blue-600" />
            Step 1: Select Consultant
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {consultants.map(consultant => (
              <button
                key={consultant.id}
                onClick={() => setSelectedConsultant(consultant)}
                className={`p-4 border-2 rounded-lg text-left transition-all ${
                  selectedConsultant?.id === consultant.id
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300'
                }`}
              >
                <div className="font-medium text-gray-900">
                  {consultant.first_name} {consultant.last_name}
                </div>
                <div className="text-sm text-gray-600">{consultant.email}</div>
                {consultant.country_code && (
                  <div className="text-xs text-gray-500 mt-1">
                    Country: {consultant.country_code}
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Step 2: Select Date & Time */}
        {selectedConsultant && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-blue-600" />
              Step 2: Select Date & Time
            </h2>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Date
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => {
                  setSelectedDate(e.target.value);
                  setSelectedSlot(null);
                }}
                min={getMinDate()}
                className="border border-gray-300 rounded-lg px-4 py-2 w-full md:w-auto"
              />
            </div>

            {selectedDate && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Available Time Slots
                </label>
                {loading ? (
                  <div className="text-gray-500">Loading slots...</div>
                ) : availableSlots.length === 0 ? (
                  <div className="text-gray-500">No available slots for this date</div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
                    {availableSlots.map((slot, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedSlot(slot)}
                        className={`px-4 py-2 border rounded-lg text-sm transition-all ${
                          selectedSlot?.start_time === slot.start_time
                            ? 'border-blue-600 bg-blue-50 text-blue-700'
                            : 'border-gray-300 hover:border-blue-400'
                        }`}
                      >
                        {formatTime(slot.start_time)}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Step 3: Meeting Details */}
        {selectedSlot && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Video className="w-5 h-5 text-blue-600" />
              Step 3: Meeting Details
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meeting Topic
                </label>
                <select
                  value={meetingTopic}
                  onChange={(e) => setMeetingTopic(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2"
                >
                  <option value="">Select a topic</option>
                  <option value="Legal Consulting">Legal Consulting</option>
                  <option value="Business Strategy">Business Strategy</option>
                  <option value="Tax Planning">Tax Planning</option>
                  <option value="Company Formation">Company Formation</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setSelectedDuration(30)}
                    className={`p-4 border-2 rounded-lg transition-all ${
                      selectedDuration === 30
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-300 hover:border-blue-400'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900">30 minutes</div>
                        <div className="text-2xl font-bold text-blue-600 mt-1">
                          ${pricing.find(p => p.duration_minutes === 30)?.price || 250}
                        </div>
                      </div>
                      <Clock className="w-6 h-6 text-gray-400" />
                    </div>
                  </button>

                  <button
                    onClick={() => setSelectedDuration(60)}
                    className={`p-4 border-2 rounded-lg transition-all ${
                      selectedDuration === 60
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-300 hover:border-blue-400'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900">60 minutes</div>
                        <div className="text-2xl font-bold text-blue-600 mt-1">
                          ${pricing.find(p => p.duration_minutes === 60)?.price || 400}
                        </div>
                      </div>
                      <Clock className="w-6 h-6 text-gray-400" />
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Booking Summary & Payment */}
        {selectedSlot && meetingTopic && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Booking Summary</h2>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-gray-600">Consultant</span>
                <span className="font-medium">
                  {selectedConsultant?.first_name} {selectedConsultant?.last_name}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-gray-600">Date & Time</span>
                <span className="font-medium">
                  {new Date(selectedSlot.start_time).toLocaleDateString()} at {formatTime(selectedSlot.start_time)}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-gray-600">Duration</span>
                <span className="font-medium">{selectedDuration} minutes</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-gray-600">Topic</span>
                <span className="font-medium">{meetingTopic}</span>
              </div>
              <div className="flex justify-between py-3 bg-blue-50 px-4 rounded">
                <span className="text-gray-900 font-semibold flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-blue-600" />
                  Total
                </span>
                <span className="text-2xl font-bold text-blue-600">
                  ${getCurrentPrice()}
                </span>
              </div>
            </div>

            <button
              onClick={handleBook}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  Proceed to Payment
                  <ChevronRight className="w-5 h-5" />
                </>
              )}
            </button>
            
            <p className="text-sm text-gray-500 text-center mt-4">
              You will be redirected to Stripe for secure payment
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientBookMeeting;
