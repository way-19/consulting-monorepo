import React from 'react';
import { User, Mail, Lock, Eye, EyeOff } from 'lucide-react';

export interface UserCredentialsData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface UserCredentialsProps {
  userCredentials: UserCredentialsData;
  onCredentialsChange: (credentials: UserCredentialsData) => void;
  showPassword: boolean;
  onTogglePassword: () => void;
}

const UserCredentials: React.FC<UserCredentialsProps> = ({
  userCredentials,
  onCredentialsChange,
  showPassword,
  onTogglePassword
}) => {
  const handleChange = (field: keyof UserCredentialsData, value: string) => {
    onCredentialsChange({
      ...userCredentials,
      [field]: value
    });
  };

  const passwordsMatch = userCredentials.password === userCredentials.confirmPassword;
  const isPasswordValid = userCredentials.password.length >= 8;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Create Account</h2>
        <p className="text-gray-600">Set up your account to access our services</p>
      </div>
      
      <div className="bg-white p-6 rounded-lg border border-gray-200 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              First Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your first name"
                value={userCredentials.firstName}
                onChange={(e) => handleChange('firstName', e.target.value)}
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Last Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your last name"
                value={userCredentials.lastName}
                onChange={(e) => handleChange('lastName', e.target.value)}
              />
            </div>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="email"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your email address"
              value={userCredentials.email}
              onChange={(e) => handleChange('email', e.target.value)}
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type={showPassword ? 'text' : 'password'}
              className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                userCredentials.password && !isPasswordValid ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter your password"
              value={userCredentials.password}
              onChange={(e) => handleChange('password', e.target.value)}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              onClick={onTogglePassword}
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {userCredentials.password && !isPasswordValid && (
            <p className="text-red-500 text-sm mt-1">Password must be at least 8 characters long</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Confirm Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type={showPassword ? 'text' : 'password'}
              className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                userCredentials.confirmPassword && !passwordsMatch ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Confirm your password"
              value={userCredentials.confirmPassword}
              onChange={(e) => handleChange('confirmPassword', e.target.value)}
            />
          </div>
          {userCredentials.confirmPassword && !passwordsMatch && (
            <p className="text-red-500 text-sm mt-1">Passwords do not match</p>
          )}
        </div>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2">Password Requirements:</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li className={`flex items-center ${isPasswordValid ? 'text-green-600' : ''}`}>
              <span className="mr-2">{isPasswordValid ? '✓' : '•'}</span>
              At least 8 characters long
            </li>
            <li className="flex items-center">
              <span className="mr-2">•</span>
              Mix of uppercase and lowercase letters (recommended)
            </li>
            <li className="flex items-center">
              <span className="mr-2">•</span>
              Include numbers and special characters (recommended)
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default UserCredentials;