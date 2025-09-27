import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '@consulting19/shared';
import { supabase } from '@consulting19/shared/lib/supabase';
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
  translated_content?: string;
  original_language: string;
  target_language: string;
  is_translated: boolean;
  is_read: boolean;
  created_at: string;
}

interface Consultant {
  id: string;
  full_name: string;
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
  const [autoTranslate, setAutoTranslate] = useState(true);
  const [clientId, setClientId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user && profile) {
      fetchChatData();
    }
  }, [user, profile]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchChatData = async () => {
    try {
      setLoading(true);
      
      // Get client ID and assigned consultant
      const { data: clientData, error: clientError } = await supabase
        .from('clients')
        .select('id, assigned_consultant_id')
        .eq('profile_id', user?.id)
        .single();

      if (clientError || !clientData) {
        console.error('Client data not found:', clientError);
        setLoading(false);
        return;
      }

      setClientId(clientData.id);

      if (!clientData.assigned_consultant_id) {
        setLoading(false);
        return;
      }

      // Get consultant info
      const { data: consultantData, error: consultantError } = await supabase
        .from('user_profiles')
        .select('id, full_name, email, preferred_language, is_active')
        .eq('id', clientData.assigned_consultant_id)
        .single();

      if (consultantError) {
        console.error('Error fetching consultant:', consultantError);
      } else {
        setConsultant(consultantData);
      }

      // Get messages between client and consultant
      const { data: messagesData, error: messagesError } = await supabase
        .from('messages')
        .select('*')
        .or(`and(sender_id.eq.${user?.id},receiver_id.eq.${clientData.assigned_consultant_id}),and(sender_id.eq.${clientData.assigned_consultant_id},receiver_id.eq.${user?.id})`)
        .order('created_at', { ascending: true });

      if (messagesError) {
        console.error('Error fetching messages:', messagesError);
      } else {
        setMessages(messagesData || []);
        
        // Mark received messages as read
        const unreadMessages = messagesData?.filter(m => 
          m.receiver_id === user?.id && !m.is_read
        ) || [];
        
        if (unreadMessages.length > 0) {
          await supabase
            .from('messages')
            .update({ is_read: true })
            .in('id', unreadMessages.map(m => m.id));
        }
      }

      // Setup real-time subscription for new messages
      const channel = supabase
        .channel('messages')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'messages',
            filter: `receiver_id=eq.${user?.id}`
          },
          (payload) => {
            const newMessage = payload.new as Message;
            setMessages(prev => [...prev, newMessage]);
            
            // Mark as read immediately
            supabase
              .from('messages')
              .update({ is_read: true })
              .eq('id', newMessage.id)
              .then(() => {
                setMessages(prev => 
                  prev.map(m => 
                    m.id === newMessage.id ? { ...m, is_read: true } : m
                  )
                );
              });
          }
        )
        .subscribe();

      // Cleanup subscription on unmount
      return () => {
        supabase.removeChannel(channel);
      };

    } catch (err) {
      console.error('Unexpected error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !consultant || !clientId || sending) return;

    try {
      setSending(true);
      
      let translatedContent = null;
      let targetLanguage = profile?.preferred_language || 'en';
      
      // Auto-translate if enabled and languages differ
      if (autoTranslate && consultant.preferred_language !== targetLanguage) {
        try {
          const { data: translationData, error: translationError } = await supabase.functions.invoke(
            'translate',
            {
              body: {
                texts: [newMessage],
                target_lang: consultant.preferred_language.toUpperCase(),
                source_lang: targetLanguage.toUpperCase()
              }
            }
          );

          if (!translationError && translationData?.translations?.[0]) {
            translatedContent = translationData.translations[0];
          }
        } catch (translationErr) {
          console.warn('Translation failed, sending original message:', translationErr);
        }
      }

      // Insert message
      const { data: messageData, error: messageError } = await supabase
        .from('messages')
        .insert({
          sender_id: user?.id,
          receiver_id: consultant.id,
          content: newMessage,
          translated_content: translatedContent,
          original_language: targetLanguage,
          target_language: consultant.preferred_language,
          is_translated: !!translatedContent,
          is_read: false
        })
        .select()
        .single();

      if (messageError) {
        throw messageError;
      }

      // Add to local state
      setMessages(prev => [...prev, messageData]);
      setNewMessage('');

    } catch (err) {
      console.error('Error sending message:', err);
      alert('Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const getMessageDisplayContent = (message: Message) => {
    // If message is from consultant and auto-translate is on and translated content exists
    if (message.sender_id !== user?.id && autoTranslate && message.translated_content) {
      return message.translated_content;
    }
    return message.content;
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
                  <h3 className="font-semibold text-gray-900">{consultant.full_name}</h3>
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
                    <span>Speaks: English, {consultant.preferred_language === 'tr' ? 'Türkçe' : consultant.preferred_language === 'pt' ? 'Português' : 'English'}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                {/* Auto-translate toggle */}
                <div className="flex items-center space-x-2">
                  <Languages className="w-4 h-4 text-gray-500" />
                  <button
                    onClick={() => setAutoTranslate(!autoTranslate)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      autoTranslate ? 'bg-green-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        autoTranslate ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                  <span className="text-xs text-gray-600">Auto-translate: {autoTranslate ? 'ON' : 'OFF'}</span>
                </div>
                
                {/* AI Assistant Button */}
                <button className="inline-flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <Bot className="w-4 h-4 mr-2" />
                  AI Assistant
                </button>
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length > 0 ? (
              messages.map((message) => {
                const isFromMe = message.sender_id === user?.id;
                const displayContent = getMessageDisplayContent(message);
                
                return (
                  <div key={message.id} className={`flex ${isFromMe ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                      isFromMe 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-100 text-gray-900'
                    }`}>
                      <p className="text-sm whitespace-pre-wrap">{displayContent}</p>
                      
                      {/* Show translation indicator */}
                      {!isFromMe && autoTranslate && message.is_translated && message.translated_content && (
                        <div className="flex items-center space-x-1 mt-2 pt-2 border-t border-gray-200">
                          <Languages className="w-3 h-3 text-gray-500" />
                          <span className="text-xs text-gray-500">Translated from {message.original_language.toUpperCase()}</span>
                        </div>
                      )}
                      
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
                    Send your first message to {consultant.full_name}
                  </p>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-1">
                        <Languages className="w-3 h-3 text-blue-600" />
                      </div>
                      <div className="text-left">
                        <h4 className="text-sm font-semibold text-blue-900 mb-1">Auto-Translation Active</h4>
                        <p className="text-xs text-blue-800">
                          Messages will be automatically translated between your language and your consultant's preferred language.
                        </p>
                      </div>
                    </div>
                  </div>
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
                  placeholder={`Message ${consultant.full_name}...`}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={1}
                  style={{ minHeight: '44px', maxHeight: '120px' }}
                  onInput={(e) => {
                    const target = e.target as HTMLTextAreaElement;
                    target.style.height = 'auto';
                    target.style.height = Math.min(target.scrollHeight, 120) + 'px';
                  }}
                />
                <div className="flex items-center justify-between mt-2">
                  <p className="text-xs text-gray-500">
                    Press Enter to send, Shift+Enter for new line
                  </p>
                  {autoTranslate && consultant.preferred_language !== (profile?.preferred_language || 'en') && (
                    <div className="flex items-center space-x-1 text-xs text-green-600">
                      <Languages className="w-3 h-3" />
                      <span>Auto-translate: ON</span>
                    </div>
                  )}
                </div>
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
              <h4 className="font-semibold text-gray-900">{consultant.full_name}</h4>
              <p className="text-sm text-gray-600">{consultant.email}</p>
              <div className="flex items-center space-x-2 mt-1">
                <div className={`w-2 h-2 rounded-full ${consultant.is_active ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                <span className={`text-xs ${consultant.is_active ? 'text-green-600' : 'text-gray-500'}`}>
                  {consultant.is_active ? 'Available' : 'Away'}
                </span>
                <span className="text-gray-400">•</span>
                <span className="text-xs text-gray-500">
                  Preferred language: {consultant.preferred_language === 'tr' ? 'Türkçe' : consultant.preferred_language === 'pt' ? 'Português' : 'English'}
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