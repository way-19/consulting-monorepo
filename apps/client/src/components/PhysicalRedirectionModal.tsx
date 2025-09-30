import { useState } from 'react';
import { X, MapPin, CreditCard, Truck } from 'lucide-react';
import { supabase } from '@consulting19/shared/lib/supabase';
import { useAuth } from '@consulting19/shared';

interface Document {
  id: string;
  name: string;
  category: string;
  file_path: string;
  file_size: number;
  mime_type: string;
  status: string;
  uploaded_at: string;
  notes?: string;
}

interface PhysicalRedirectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: Document;
  onSuccess: () => void;
}

interface AddressForm {
  recipient_name: string;
  address_line_1: string;
  address_line_2: string;
  city: string;
  state_province: string;
  postal_code: string;
  country: string;
}

const PhysicalRedirectionModal = ({ isOpen, onClose, document, onSuccess: _onSuccess }: PhysicalRedirectionModalProps) => {
  const { user } = useAuth();
  const [step, setStep] = useState<'address' | 'payment' | 'processing'>('address');
  
  // Note: onSuccess is passed but not used here since this component redirects to Stripe
  // The success handling is managed by the parent component after Stripe checkout
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [addressForm, setAddressForm] = useState<AddressForm>({
    recipient_name: '',
    address_line_1: '',
    address_line_2: '',
    city: '',
    state_province: '',
    postal_code: '',
    country: ''
  });

  const handleAddressChange = (field: keyof AddressForm, value: string) => {
    setAddressForm(prev => ({ ...prev, [field]: value }));
  };

  const validateAddress = () => {
    const required = ['recipient_name', 'address_line_1', 'city', 'postal_code', 'country'];
    return required.every(field => addressForm[field as keyof AddressForm].trim() !== '');
  };

  const handleAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateAddress()) {
      setError('Please fill in all required fields.');
      return;
    }

    setError(null);
    setStep('payment');
  };

  const handlePayment = async () => {
    setLoading(true);
    setError(null);

    try {
      // Get client profile
      const { data: clientData, error: clientError } = await supabase
        .from('clients')
        .select('id')
        .eq('profile_id', user?.id)
        .single();

      if (clientError) throw clientError;

      setStep('processing');

      // Create Stripe checkout session
      const { data: sessionData, error: sessionError } = await supabase.functions.invoke(
        'create-physical-redirection-session',
        {
          body: {
            documentId: document.id,
            documentName: document.name,
            recipientName: addressForm.recipient_name,
            recipientAddress: {
              address_line_1: addressForm.address_line_1,
              address_line_2: addressForm.address_line_2,
              city: addressForm.city,
              state_province: addressForm.state_province,
              postal_code: addressForm.postal_code,
              country: addressForm.country,
            },
            clientId: clientData.id,
            amount: 2500, // $25.00 in cents
          },
        }
      );

      if (sessionError) {
        console.error('Error creating checkout session:', sessionError);
        throw new Error('Failed to create payment session');
      }

      // Redirect to Stripe checkout
      if (sessionData?.url) {
        window.location.href = sessionData.url;
      } else {
        throw new Error('No checkout URL received');
      }

    } catch (error) {
      console.error('Error creating redirection request:', error);
      setError('Failed to create redirection request. Please try again.');
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <Truck className="w-6 h-6 text-orange-600" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Request Physical Redirection
              </h2>
              <p className="text-sm text-gray-500">Document: {document.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Progress Steps */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <div className={`flex items-center space-x-2 ${step === 'address' ? 'text-orange-600' : step === 'payment' || step === 'processing' ? 'text-green-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step === 'address' ? 'bg-orange-100' : step === 'payment' || step === 'processing' ? 'bg-green-100' : 'bg-gray-100'}`}>
                1
              </div>
              <span className="text-sm font-medium">Address</span>
            </div>
            <div className={`flex-1 h-0.5 ${step === 'payment' || step === 'processing' ? 'bg-green-600' : 'bg-gray-200'}`}></div>
            <div className={`flex items-center space-x-2 ${step === 'payment' ? 'text-orange-600' : step === 'processing' ? 'text-green-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step === 'payment' ? 'bg-orange-100' : step === 'processing' ? 'bg-green-100' : 'bg-gray-100'}`}>
                2
              </div>
              <span className="text-sm font-medium">Payment</span>
            </div>
            <div className={`flex-1 h-0.5 ${step === 'processing' ? 'bg-green-600' : 'bg-gray-200'}`}></div>
            <div className={`flex items-center space-x-2 ${step === 'processing' ? 'text-orange-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step === 'processing' ? 'bg-orange-100' : 'bg-gray-100'}`}>
                3
              </div>
              <span className="text-sm font-medium">Processing</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {step === 'address' && (
            <form onSubmit={handleAddressSubmit} className="space-y-4">
              <div className="flex items-center space-x-2 mb-4">
                <MapPin className="w-5 h-5 text-gray-400" />
                <h3 className="text-lg font-medium text-gray-900">Delivery Address</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Recipient Name *
                  </label>
                  <input
                    type="text"
                    value={addressForm.recipient_name}
                    onChange={(e) => handleAddressChange('recipient_name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Full name of recipient"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address Line 1 *
                  </label>
                  <input
                    type="text"
                    value={addressForm.address_line_1}
                    onChange={(e) => handleAddressChange('address_line_1', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Street address"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address Line 2
                  </label>
                  <input
                    type="text"
                    value={addressForm.address_line_2}
                    onChange={(e) => handleAddressChange('address_line_2', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Apartment, suite, etc. (optional)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    value={addressForm.city}
                    onChange={(e) => handleAddressChange('city', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="City"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    State/Province
                  </label>
                  <input
                    type="text"
                    value={addressForm.state_province}
                    onChange={(e) => handleAddressChange('state_province', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="State or Province"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Postal Code *
                  </label>
                  <input
                    type="text"
                    value={addressForm.postal_code}
                    onChange={(e) => handleAddressChange('postal_code', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Postal/ZIP code"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Country *
                  </label>
                  <input
                    type="text"
                    value={addressForm.country}
                    onChange={(e) => handleAddressChange('country', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Country"
                    required
                  />
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 text-white bg-orange-600 rounded-lg hover:bg-orange-700 transition-colors"
                >
                  Continue to Payment
                </button>
              </div>
            </form>
          )}

          {step === 'payment' && (
            <div className="space-y-6">
              <div className="flex items-center space-x-2 mb-4">
                <CreditCard className="w-5 h-5 text-gray-400" />
                <h3 className="text-lg font-medium text-gray-900">Payment Information</h3>
              </div>

              {/* Order Summary */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3">Order Summary</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Document:</span>
                    <span className="text-gray-900">{document.name}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Service:</span>
                    <span className="text-gray-900">Physical Mail Redirection</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Delivery Address:</span>
                    <span className="text-gray-900 text-right">
                      {addressForm.recipient_name}<br />
                      {addressForm.address_line_1}<br />
                      {addressForm.city}, {addressForm.postal_code}<br />
                      {addressForm.country}
                    </span>
                  </div>
                  <div className="border-t border-gray-200 pt-2 mt-2">
                    <div className="flex justify-between font-medium">
                      <span>Total:</span>
                      <span>$25.00 USD</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="border border-gray-200 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-4">
                  You will be redirected to Stripe to complete your payment securely.
                </p>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <CreditCard className="w-4 h-4" />
                  <span>Secure payment powered by Stripe</span>
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setStep('address')}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Back to Address
                </button>
                <button
                  onClick={handlePayment}
                  disabled={loading}
                  className="flex-1 px-4 py-2 text-white bg-orange-600 rounded-lg hover:bg-orange-700 disabled:bg-gray-400 transition-colors"
                >
                  {loading ? 'Processing...' : 'Pay $25.00'}
                </button>
              </div>
            </div>
          )}

          {step === 'processing' && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Processing Payment</h3>
              <p className="text-gray-600">
                Please wait while we process your payment and create your redirection request...
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PhysicalRedirectionModal;