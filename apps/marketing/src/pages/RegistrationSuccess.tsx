import React, { useEffect, useState } from 'react';
import { CheckCircle, User, Mail, Lock, ExternalLink, Copy, Eye, EyeOff } from 'lucide-react';
import { Link } from 'react-router-dom';

interface RegistrationData {
  user_id: string;
  client_id: string;
  order_id: string;
  consultant: {
    id: string;
    name: string;
    email: string;
  } | null;
  login_credentials: {
    email: string;
    temp_password: string;
  };
  company_name: string;
  country: string;
}

const RegistrationSuccess: React.FC = () => {
  const [registrationData, setRegistrationData] = useState<RegistrationData | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  useEffect(() => {
    const data = sessionStorage.getItem('registrationData');
    if (data) {
      setRegistrationData(JSON.parse(data));
    }
  }, []);

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  if (!registrationData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Loading...</h1>
          <p className="text-gray-600">Please wait while we load your registration details.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Registration Successful!</h1>
          <p className="text-gray-600 text-lg">Your account has been created and your order is being processed</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Login Credentials */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center mb-4">
              <User className="h-6 w-6 text-teal-600 mr-2" />
              <h2 className="text-xl font-semibold text-gray-800">Your Login Credentials</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <div className="flex items-center space-x-2">
                  <div className="flex-1 p-3 bg-gray-50 rounded-lg border">
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-gray-800">{registrationData.login_credentials.email}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => copyToClipboard(registrationData.login_credentials.email, 'email')}
                    className="p-2 text-gray-500 hover:text-teal-600 transition-colors"
                    title="Copy email"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
                {copiedField === 'email' && (
                  <p className="text-sm text-green-600 mt-1">✓ Email copied to clipboard</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Temporary Password</label>
                <div className="flex items-center space-x-2">
                  <div className="flex-1 p-3 bg-gray-50 rounded-lg border">
                    <div className="flex items-center">
                      <Lock className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-gray-800 font-mono">
                        {showPassword ? registrationData.login_credentials.temp_password : '••••••••••••'}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    className="p-2 text-gray-500 hover:text-teal-600 transition-colors"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                  <button
                    onClick={() => copyToClipboard(registrationData.login_credentials.temp_password, 'password')}
                    className="p-2 text-gray-500 hover:text-teal-600 transition-colors"
                    title="Copy password"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
                {copiedField === 'password' && (
                  <p className="text-sm text-green-600 mt-1">✓ Password copied to clipboard</p>
                )}
                <p className="text-sm text-amber-600 mt-1">
                  ⚠️ Please change this password after your first login for security
                </p>
              </div>
            </div>

            <div className="mt-6">
              <a
                href={`${window.location.origin.replace('3000', '5173')}/login`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-teal-600 text-white py-3 px-4 rounded-lg hover:bg-teal-700 transition-colors flex items-center justify-center space-x-2"
              >
                <span>Access Client Portal</span>
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Order & Consultant Info */}
          <div className="space-y-6">
            {/* Order Details */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Order Details</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Company:</span>
                  <span className="font-medium text-gray-800">{registrationData.company_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Country:</span>
                  <span className="font-medium text-gray-800">{registrationData.country}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Order ID:</span>
                  <span className="font-mono text-sm text-gray-800">{registrationData.order_id}</span>
                </div>
              </div>
            </div>

            {/* Consultant Info */}
            {registrationData.consultant ? (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Your Assigned Consultant</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Name:</span>
                    <span className="font-medium text-gray-800">{registrationData.consultant.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email:</span>
                    <span className="text-gray-800">{registrationData.consultant.email}</span>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-teal-50 rounded-lg">
                  <p className="text-sm text-teal-700">
                    Your consultant will contact you within 24 hours to discuss your requirements and next steps.
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Consultant Assignment</h3>
                <div className="p-3 bg-amber-50 rounded-lg">
                  <p className="text-sm text-amber-700">
                    A qualified consultant will be assigned to your case shortly. You will be notified via email once the assignment is complete.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Next Steps */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">What Happens Next?</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-teal-600 font-semibold">1</span>
              </div>
              <h4 className="font-medium text-gray-800 mb-2">Login to Portal</h4>
              <p className="text-sm text-gray-600">Use your credentials to access the client portal and change your password</p>
            </div>
            <div className="text-center">
              <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-teal-600 font-semibold">2</span>
              </div>
              <h4 className="font-medium text-gray-800 mb-2">Upload Documents</h4>
              <p className="text-sm text-gray-600">Your consultant will guide you on which documents to upload</p>
            </div>
            <div className="text-center">
              <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-teal-600 font-semibold">3</span>
              </div>
              <h4 className="font-medium text-gray-800 mb-2">Track Progress</h4>
              <p className="text-sm text-gray-600">Monitor your company formation progress in real-time</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 mb-4">
            Need help? Contact our support team at{' '}
            <a href="mailto:support@yourcompany.com" className="text-teal-600 hover:text-teal-700">
              support@yourcompany.com
            </a>
          </p>
          <Link
            to="/"
            className="inline-flex items-center text-teal-600 hover:text-teal-700 transition-colors"
          >
            ← Back to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegistrationSuccess;