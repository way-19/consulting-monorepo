import React from 'react';
import { useAuth } from '@consulting19/shared/contexts/AuthContext';

const SessionDebugger: React.FC = () => {
  const { user, session, profile, resetSession } = useAuth();

  const handleResetSession = async () => {
    if (window.confirm('Are you sure you want to reset the session? This will reload the page.')) {
      await resetSession();
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      right: '10px',
      background: '#f0f0f0',
      border: '1px solid #ccc',
      padding: '10px',
      borderRadius: '5px',
      fontSize: '12px',
      maxWidth: '300px',
      zIndex: 9999
    }}>
      <h4 style={{ margin: '0 0 10px 0' }}>Session Debug Info</h4>
      
      <div style={{ marginBottom: '5px' }}>
        <strong>User ID:</strong> {user?.id || 'None'}
      </div>
      
      <div style={{ marginBottom: '5px' }}>
        <strong>Email:</strong> {user?.email || 'None'}
      </div>
      
      <div style={{ marginBottom: '5px' }}>
        <strong>Profile ID:</strong> {profile?.id || 'None'}
      </div>
      
      <div style={{ marginBottom: '5px' }}>
        <strong>Role:</strong> {profile?.role || 'None'}
      </div>
      
      <div style={{ marginBottom: '10px' }}>
        <strong>Session:</strong> {session ? 'Active' : 'None'}
      </div>
      
      {user?.id === 'd3e11540-bd33-4d45-a883-d7cd398b48ae' && (
        <div style={{ 
          background: '#ffebee', 
          color: '#c62828', 
          padding: '5px', 
          borderRadius: '3px',
          marginBottom: '10px'
        }}>
          ⚠️ OLD USER ID DETECTED!
        </div>
      )}
      
      <button 
        onClick={handleResetSession}
        style={{
          background: '#ff4444',
          color: 'white',
          border: 'none',
          padding: '5px 10px',
          borderRadius: '3px',
          cursor: 'pointer',
          fontSize: '12px'
        }}
      >
        Reset Session
      </button>
    </div>
  );
};

export default SessionDebugger;