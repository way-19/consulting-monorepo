import React, { useState, useEffect } from 'react';
import { X, Smartphone, Key, Copy, Check, AlertTriangle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface MfaSetupProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

const MfaSetup: React.FC<MfaSetupProps> = ({ isOpen, onClose, onComplete }) => {
  const { enableMfa } = useAuth();
  const [step, setStep] = useState(1);
  const [qrCode, setQrCode] = useState('');
  const [secret, setSecret] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen && step === 1) {
      generateMfaSecret();
    }
  }, [isOpen, step]);

  const generateMfaSecret = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Generate MFA secret and QR code
      const { data, error } = await enableMfa();
      
      if (error) {
        setError(error.message);
        return;
      }

      if (data) {
        setQrCode(data.qr_code);
        setSecret(data.secret);
        setStep(2);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to generate MFA secret');
    } finally {
      setLoading(false);
    }
  };

  const verifyMfaCode = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      setError('Please enter a valid 6-digit code');
      return;
    }

    try {
      setLoading(true);
      setError('');

      // Verify the MFA code
      const { error } = await enableMfa(verificationCode);
      
      if (error) {
        setError(error.message);
        return;
      }

      setStep(3);
      setTimeout(() => {
        onComplete();
        handleClose();
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to verify MFA code');
    } finally {
      setLoading(false);
    }
  };

  const copySecret = async () => {
    try {
      await navigator.clipboard.writeText(secret);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy secret:', err);
    }
  };

  const handleClose = () => {
    setStep(1);
    setQrCode('');
    setSecret('');
    setVerificationCode('');
    setError('');
    setCopied(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Smartphone className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Enable Two-Factor Authentication</h3>
              <p className="text-sm text-gray-600">Step {step} of 3</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {step === 1 && (
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Key className="w-8 h-8 text-blue-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Secure Your Account</h4>
              <p className="text-gray-600 mb-6">
                Two-factor authentication adds an extra layer of security to your account by requiring a code from your phone.
              </p>
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                  <span className="ml-2 text-gray-600">Generating setup code...</span>
                </div>
              ) : (
                <button
                  onClick={generateMfaSecret}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Get Started
                </button>
              )}
            </div>
          )}

          {step === 2 && (
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Scan QR Code</h4>
              <p className="text-gray-600 mb-4">
                Use your authenticator app (Google Authenticator, Authy, etc.) to scan this QR code:
              </p>
              
              {qrCode && (
                <div className="bg-white p-4 rounded-lg border border-gray-200 mb-4 text-center">
                  <img src={qrCode} alt="QR Code" className="mx-auto mb-4" />
                </div>
              )}

              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <p className="text-sm text-gray-600 mb-2">Or enter this code manually:</p>
                <div className="flex items-center space-x-2">
                  <code className="flex-1 bg-white p-2 rounded border text-sm font-mono break-all">
                    {secret}
                  </code>
                  <button
                    onClick={copySecret}
                    className="p-2 text-gray-500 hover:text-gray-700 rounded hover:bg-gray-100 transition-colors"
                  >
                    {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Enter verification code from your app:
                  </label>
                  <input
                    type="text"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="000000"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-lg font-mono"
                    maxLength={6}
                  />
                </div>

                <button
                  onClick={verifyMfaCode}
                  disabled={loading || verificationCode.length !== 6}
                  className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Verifying...
                    </div>
                  ) : (
                    'Verify & Enable 2FA'
                  )}
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">2FA Enabled Successfully!</h4>
              <p className="text-gray-600 mb-4">
                Your account is now protected with two-factor authentication.
              </p>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-sm text-green-800">
                  Make sure to save your backup codes in a safe place. You'll need them if you lose access to your authenticator app.
                </p>
              </div>
            </div>
          )}

          {error && (
            <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-semibold text-red-900 mb-1">Error</h4>
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {step === 2 && (
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-lg">
            <p className="text-xs text-gray-600">
              <strong>Tip:</strong> Popular authenticator apps include Google Authenticator, Authy, Microsoft Authenticator, and 1Password.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MfaSetup;