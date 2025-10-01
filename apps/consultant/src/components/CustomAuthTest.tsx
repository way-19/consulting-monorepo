import React, { useState } from 'react';
import { useCustomAuth, createAuthenticatedFetch } from '@consulting19/shared';
import { User, Lock, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';

const CustomAuthTest: React.FC = () => {
  const { user, profile, loading, signIn, signUp, signOut, refreshProfile } = useCustomAuth();
  const [testResults, setTestResults] = useState<string[]>([]);
  const [isRunningTests, setIsRunningTests] = useState(false);

  const addTestResult = (result: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${result}`]);
  };

  const runAuthenticationTests = async () => {
    setIsRunningTests(true);
    setTestResults([]);
    
    try {
      addTestResult('🧪 Starting Custom JWT Authentication Tests...');

      // Test 1: Check current authentication state
      addTestResult(`✅ Current user: ${user ? user.email : 'Not authenticated'}`);
      addTestResult(`✅ Current profile: ${profile ? `${profile.first_name} ${profile.last_name} (${profile.role})` : 'No profile'}`);
      addTestResult(`✅ Loading state: ${loading}`);

      // Test 2: Test authenticated fetch
      if (user) {
        try {
          const authenticatedFetch = createAuthenticatedFetch();
          addTestResult('✅ Authenticated fetch helper created successfully');
          
          // Test API call (this would need a real endpoint)
          addTestResult('ℹ️ Authenticated fetch ready for API calls');
        } catch (error) {
          addTestResult(`❌ Authenticated fetch error: ${error}`);
        }
      }

      // Test 3: Test profile refresh
      if (user) {
        try {
          await refreshProfile();
          addTestResult('✅ Profile refresh successful');
        } catch (error) {
          addTestResult(`❌ Profile refresh error: ${error}`);
        }
      }

      // Test 4: Check localStorage token
      const token = localStorage.getItem('auth_token');
      addTestResult(`✅ Token in localStorage: ${token ? 'Present' : 'Not found'}`);

      addTestResult('🎉 Authentication tests completed!');
    } catch (error) {
      addTestResult(`❌ Test error: ${error}`);
    } finally {
      setIsRunningTests(false);
    }
  };

  const testSignIn = async () => {
    try {
      addTestResult('🔐 Testing sign-in with demo credentials...');
      const result = await signIn('giorgi.meskhi@consulting19.com', 'password123');
      addTestResult(`✅ Sign-in successful: ${JSON.stringify(result)}`);
    } catch (error) {
      addTestResult(`❌ Sign-in error: ${error}`);
    }
  };

  const testSignOut = async () => {
    try {
      addTestResult('🚪 Testing sign-out...');
      await signOut();
      addTestResult('✅ Sign-out successful');
    } catch (error) {
      addTestResult(`❌ Sign-out error: ${error}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <Lock className="w-5 h-5 text-blue-600" />
          </div>
          <h1 className="text-2xl font-semibold text-gray-900">Custom JWT Authentication Test</h1>
        </div>

        {/* Current Authentication Status */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h2 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
            <User className="w-5 h-5 mr-2" />
            Current Authentication Status
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                {user ? (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-500" />
                )}
                <span className="text-sm font-medium">
                  User: {user ? user.email : 'Not authenticated'}
                </span>
              </div>
              
              <div className="flex items-center space-x-2">
                {profile ? (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-500" />
                )}
                <span className="text-sm font-medium">
                  Profile: {profile ? `${profile.first_name} ${profile.last_name}` : 'No profile'}
                </span>
              </div>
              
              <div className="flex items-center space-x-2">
                {profile?.role ? (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-500" />
                )}
                <span className="text-sm font-medium">
                  Role: {profile?.role || 'No role'}
                </span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                {loading ? (
                  <RefreshCw className="w-4 h-4 text-blue-500 animate-spin" />
                ) : (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                )}
                <span className="text-sm font-medium">
                  Loading: {loading ? 'Yes' : 'No'}
                </span>
              </div>
              
              <div className="flex items-center space-x-2">
                {localStorage.getItem('auth_token') ? (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-500" />
                )}
                <span className="text-sm font-medium">
                  Token: {localStorage.getItem('auth_token') ? 'Present' : 'Not found'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Test Actions */}
        <div className="space-y-4">
          <h2 className="text-lg font-medium text-gray-900">Test Actions</h2>
          
          <div className="flex flex-wrap gap-3">
            <button
              onClick={runAuthenticationTests}
              disabled={isRunningTests}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {isRunningTests ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <CheckCircle className="w-4 h-4" />
              )}
              <span>Run Authentication Tests</span>
            </button>
            
            {!user && (
              <button
                onClick={testSignIn}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center space-x-2"
              >
                <Lock className="w-4 h-4" />
                <span>Test Sign In</span>
              </button>
            )}
            
            {user && (
              <button
                onClick={testSignOut}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center space-x-2"
              >
                <Lock className="w-4 h-4" />
                <span>Test Sign Out</span>
              </button>
            )}
          </div>
        </div>

        {/* Test Results */}
        {testResults.length > 0 && (
          <div className="mt-6">
            <h2 className="text-lg font-medium text-gray-900 mb-3">Test Results</h2>
            <div className="bg-gray-900 rounded-lg p-4 max-h-96 overflow-y-auto">
              <div className="space-y-1">
                {testResults.map((result, index) => (
                  <div key={index} className="text-sm font-mono text-gray-300">
                    {result}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* User Details */}
        {user && profile && (
          <div className="mt-6 bg-green-50 rounded-lg p-4">
            <h2 className="text-lg font-medium text-gray-900 mb-3">User Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <strong>ID:</strong> {user.id}
              </div>
              <div>
                <strong>Email:</strong> {user.email}
              </div>
              <div>
                <strong>Name:</strong> {profile.first_name} {profile.last_name}
              </div>
              <div>
                <strong>Role:</strong> {profile.role}
              </div>
              <div>
                <strong>Active:</strong> {user.is_active ? 'Yes' : 'No'}
              </div>
              <div>
                <strong>Created:</strong> {new Date(user.created_at).toLocaleDateString()}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomAuthTest;