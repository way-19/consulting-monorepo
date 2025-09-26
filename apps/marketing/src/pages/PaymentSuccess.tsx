import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Check, ArrowRight, Mail, User } from 'lucide-react';

const PaymentSuccess: React.FC = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [isVerifying, setIsVerifying] = useState(true);
  const [verificationComplete, setVerificationComplete] = useState(false);

  useEffect(() => {
    if (sessionId) {
      // Simulate verification process
      setTimeout(() => {
        setIsVerifying(false);
        setVerificationComplete(true);
      }, 2000);
    }
  }, [sessionId]);

  if (isVerifying) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full mx-4 text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Verifying Payment</h2>
          <p className="text-gray-600">Please wait while we confirm your payment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-2xl w-full mx-4">
        {/* Success Icon */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
            <Check className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Payment Successful!</h1>
          <p className="text-gray-600 text-lg">Your company formation order has been confirmed</p>
        </div>

        {/* Order Details */}
        <div className="bg-gray-50 rounded-xl p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">What happens next?</h3>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 bg-teal-100 rounded-full flex items-center justify-center mt-0.5">
                <span className="text-teal-600 text-sm font-semibold">1</span>
              </div>
              <div>
                <h4 className="font-medium text-gray-800">Account Creation</h4>
                <p className="text-gray-600 text-sm">Your client account has been created automatically</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 bg-teal-100 rounded-full flex items-center justify-center mt-0.5">
                <span className="text-teal-600 text-sm font-semibold">2</span>
              </div>
              <div>
                <h4 className="font-medium text-gray-800">Consultant Assignment</h4>
                <p className="text-gray-600 text-sm">A qualified consultant has been assigned to your case</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 bg-teal-100 rounded-full flex items-center justify-center mt-0.5">
                <span className="text-teal-600 text-sm font-semibold">3</span>
              </div>
              <div>
                <h4 className="font-medium text-gray-800">Email Confirmation</h4>
                <p className="text-gray-600 text-sm">Check your email for login credentials and next steps</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            to="/client"
            className="flex-1 bg-teal-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-teal-700 transition-colors flex items-center justify-center space-x-2"
          >
            <User className="w-5 h-5" />
            <span>Access Client Panel</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
          
          <Link
            to="/"
            className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2"
          >
            <span>Back to Home</span>
          </Link>
        </div>

        {/* Contact Info */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Mail className="w-5 h-5 text-blue-600" />
            <h4 className="font-medium text-blue-800">Need Help?</h4>
          </div>
          <p className="text-blue-700 text-sm">
            If you have any questions, please contact our support team at{' '}
            <a href="mailto:support@consulting19.com" className="underline">
              support@consulting19.com
            </a>
          </p>
        </div>

        {/* Session ID for reference */}
        {sessionId && (
          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500">
              Reference ID: {sessionId.slice(-8).toUpperCase()}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccess;