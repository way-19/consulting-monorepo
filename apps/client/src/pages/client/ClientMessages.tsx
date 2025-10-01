import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAuth, createAuthenticatedFetch } from '@consulting19/shared';
import { 
  MessageSquare, 
  Send, 
  User, 
  Globe, 
  Bot, 
  Languages,
  Circle,
  CheckCircle2,
  Loader2
} from 'lucide-react';

interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  subject?: string;
  is_read: boolean;
  created_at: string;
  sender_name?: string;
  sender_avatar?: string;
  receiver_name?: string;
  receiver_avatar?: string;
}

interface Consultant {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  preferred_language: string;
  is_active: boolean;
}

const ClientMessages = () => {
  const { user, profile } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [consultant, setConsultant] = useState<Consultant | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [clientId, setClientId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const authFetch = createAuthenticatedFetch();

  useEffect(() => {
    if (user && profile) {
      fetchChatData();
    }
  }, [user, profile]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Poll for new messages every 5 seconds
  useEffect(() => {
    if (!consultant || !clientId) return;

    const interval = setInterval(() => {
      fetchMessages();
    }, 5000);

    return () => clearInterval(interval);
  }, [consultant, clientId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchChatData = async () => {
    try {
      setLoading(true);
      
      // Get assigned consultant info
      const clientsResponse = await authFetch('/api/clients?limit=1', {
        method: 'GET'
      });

      if (!clientsResponse.ok) {
        throw new Error('Failed to fetch client data');
      }

      const clientsData = await clientsResponse.json();
      const client = clientsData.clients?.[0];

      if (!client || !client.assigned_consultant_id) {
        setLoading(false);
        return;
      }

      setClientId(client.id);

      // Get consultant profile
      const consultantResponse = await authFetch(`/api/users/${client.assigned_consultant_id}`, {
        method: 'GET'
      });

      if (consultantResponse.ok) {
        const consultantData = await consultantResponse.json();
        setConsultant({
          id: consultantData.user.id,
          first_name: consultantData.user.first_name,
          last_name: consultantData.user.last_name,
          email: consultantData.user.email,
          preferred_language: consultantData.user.preferred_language || 'en',
          is_active: consultantData.user.is_active
        });
      }

      // Fetch messages
      await fetchMessages();

    } catch (err) {
      console.error('Unexpected error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async () => {
    if (!consultant) return;

    try {
      const response = await authFetch(`/api/messages?conversation_with=${consultant.id}&limit=100`, {
        method: 'GET'
      });

      if (!response.ok) {
        throw new Error('Failed to fetch messages');
      }

      const data = await response.json();
      setMessages(data.messages || []);

      // Mark unread messages as read
      const unreadMessages = data.messages?.filter((m: Message) => 
        m.receiver_id === user?.id && !m.is_read
      ) || [];

      for (const msg of unreadMessages) {
        authFetch(`/api/messages/${msg.id}/read`, {
          method: 'PATCH'
        }).catch(err => console.error('Failed to mark message as read:', err));
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !consultant || sending) return;

    try {
      setSending(true);

      const response = await authFetch('/api/messages/send', {
        method: 'POST',
        body: JSON.stringify({
          receiver_id: consultant.id,
          content: newMessage.trim()
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to send message');
      }

      const data = await response.json();
      
      // Add message to local state immediately
      setMessages(prev => [...prev, data.data]);
      setNewMessage('');
      
      // Fetch updated messages
      fetchMessages();

    } catch (err) {
      console.error('Error sending message:', err);
      alert(err instanceof Error ? err.message : 'Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (loading) {
    return (
      <>
        <Helmet>
          <title>Messages - Client Portal</title>
        </Helmet>
        
        <div className="space-y-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="h-96 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </>
    );
  }

  if (!consultant) {
    return (
      <>
        <Helmet>
          <title>Messages - Client Portal</title>
        </Helmet>
        
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
            <p className="text-gray-600 mt-1">Chat with your consultant</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Consultant Assigned</h3>
            <p className="text-gray-600 mb-6">
              You'll be able to chat with your consultant once one is assigned to your account.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-1">
                  <MessageSquare className="w-3 h-3 text-blue-600" />
                </div>
                <div className="text-left">
                  <h4 className="text-sm font-semibold text-blue-900 mb-1">What happens next?</h4>
                  <p className="text-xs text-blue-800">
                    Our team will assign you a consultant based on your business needs and location.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  const consultantFullName = `${consultant.first_name} ${consultant.last_name}`;

  return (
    <>
      <Helmet>
        <title>Messages - Client Portal</title>
      </Helmet>
      
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
          <p className="text-gray-600 mt-1">Chat with your consultant</p>
        </div>

        {/* Chat Interface */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-[600px] flex flex-col">
          {/* Chat Header */}
          <div className="p-4 border-b border-gray-200 bg-gray-50 rounded-t-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{consultantFullName}</h3>
                  <div className="flex items-center space-x-2 text-sm">
                    <span className="text-gray-600">Your Consultant</span>
                    <span className="text-gray-400">•</span>
                    <div className="flex items-center space-x-1">
                      <div className={`w-2 h-2 rounded-full ${consultant.is_active ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                      <span className={consultant.is_active ? 'text-green-600' : 'text-gray-500'}>
                        {consultant.is_active ? 'Online' : 'Offline'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1 text-xs text-gray-500">
                    <Globe className="w-3 h-3" />
                    <span>Language: {consultant.preferred_language.toUpperCase()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length > 0 ? (
              messages.map((message) => {
                const isFromMe = message.sender_id === user?.id;
                
                return (
                  <div key={message.id} className={`flex ${isFromMe ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                      isFromMe 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-100 text-gray-900'
                    }`}>
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      
                      <div className={`flex items-center justify-end space-x-1 mt-2 text-xs ${
                        isFromMe ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                        <span>{new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        {isFromMe && (
                          <div className="flex items-center">
                            {message.is_read ? (
                              <CheckCircle2 className="w-3 h-3 text-blue-200" />
                            ) : (
                              <Circle className="w-3 h-3 text-blue-200" />
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Start Your Conversation</h3>
                  <p className="text-gray-600 mb-4">
                    Send your first message to {consultantFullName}
                  </p>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="p-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">
            <div className="flex items-end space-x-3">
              <div className="flex-1">
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={`Message ${consultantFullName}...`}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={1}
                  style={{ minHeight: '44px', maxHeight: '120px' }}
                  onInput={(e) => {
                    const target = e.target as HTMLTextAreaElement;
                    target.style.height = 'auto';
                    target.style.height = Math.min(target.scrollHeight, 120) + 'px';
                  }}
                />
                <p className="text-xs text-gray-500 mt-2">
                  Press Enter to send, Shift+Enter for new line
                </p>
              </div>
              
              <button
                onClick={handleSendMessage}
                disabled={!newMessage.trim() || sending}
                className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {sending ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Consultant Info Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Consultant</h3>
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900">{consultantFullName}</h4>
              <p className="text-sm text-gray-600">{consultant.email}</p>
              <div className="flex items-center space-x-2 mt-1">
                <div className={`w-2 h-2 rounded-full ${consultant.is_active ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                <span className={`text-xs ${consultant.is_active ? 'text-green-600' : 'text-gray-500'}`}>
                  {consultant.is_active ? 'Available' : 'Away'}
                </span>
                <span className="text-gray-400">•</span>
                <span className="text-xs text-gray-500">
                  Preferred language: {consultant.preferred_language.toUpperCase()}
                </span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600">Response time</div>
              <div className="text-lg font-bold text-green-600">~2h</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ClientMessages;
