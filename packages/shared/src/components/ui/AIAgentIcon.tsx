import React, { useState, useEffect } from 'react';
import { Bot, X, Send, Zap, MessageSquare } from 'lucide-react';

interface AIAgentIconProps {
  autoOpen?: boolean;
  position?: 'bottom-right' | 'bottom-left';
}

export const AIAgentIcon: React.FC<AIAgentIconProps> = ({ 
  autoOpen = false, 
  position = 'bottom-right' 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      id: '1',
      type: 'ai',
      content: 'Hello! I\'m your AI Oracle assistant. I can help you find the perfect jurisdiction for your business, explain tax strategies, and connect you with expert consultants. How can I assist with your international expansion?',
      timestamp: new Date(),
    }
  ]);

  useEffect(() => {
    if (autoOpen) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 3000); // Auto-open after 3 seconds on homepage
      return () => clearTimeout(timer);
    }
  }, [autoOpen]);

  const positionClasses = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6',
  };

  const quickQuestions = [
    'I want to start a tech company',
    'Looking for tax optimization',
    'Need EU market access',
    'Interested in crypto business',
    'Asset protection strategies',
    'Banking solutions needed',
  ];

  const sendMessage = () => {
    if (!message.trim()) return;

    const newMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: message,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, newMessage]);
    setMessage('');

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: 'Great question! Based on your needs, I can recommend specific jurisdictions and connect you with our expert consultants. Would you like me to analyze your requirements and suggest the best countries for your business?',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const handleQuickQuestion = (question: string) => {
    setMessage(question);
    sendMessage();
  };

  return (
    <>
      {/* AI Agent Icon */}
      <div className={`fixed ${positionClasses[position]} z-50`}>
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="group relative w-16 h-16 bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-110 animate-pulse"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-400 to-teal-400 rounded-full blur-lg opacity-60 group-hover:opacity-80 transition-opacity"></div>
            <div className="relative w-full h-full flex items-center justify-center">
              <Bot className="w-8 h-8 text-white" />
            </div>
            
            {/* Notification dot */}
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 rounded-full flex items-center justify-center">
              <Zap className="w-2 h-2 text-white" />
            </div>
            
            {/* Tooltip */}
            <div className="absolute bottom-full right-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="bg-gray-900 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap">
                AI Oracle Assistant - Click to start!
                <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
              </div>
            </div>
          </button>
        )}

        {/* Chat Window */}
        {isOpen && (
          <div className="w-80 h-96 bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 text-white p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold">AI Oracle Assistant</h3>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-xs text-blue-100">Online</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-xs px-4 py-2 rounded-2xl ${
                    msg.type === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}>
                    <p className="text-sm">{msg.content}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Questions */}
            <div className="p-4 border-t border-gray-200">
              <div className="space-y-2 mb-3">
                <p className="text-xs font-medium text-gray-700">Quick questions:</p>
                <div className="grid grid-cols-1 gap-1">
                  {quickQuestions.slice(0, 2).map((question, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickQuestion(question)}
                      className="text-left p-2 text-xs bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Input */}
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Type your message..."
                  className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={sendMessage}
                  disabled={!message.trim()}
                  className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes slide-in-from-bottom {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-in {
          animation: slide-in-from-bottom 0.3s ease-out;
        }
        
        .slide-in-from-bottom-4 {
          animation: slide-in-from-bottom 0.3s ease-out;
        }
      `}</style>
    </>
  );
};