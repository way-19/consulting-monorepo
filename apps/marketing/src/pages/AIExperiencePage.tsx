import React, { useState } from 'react';
import { ArrowLeft, Bot, Zap, Globe, MessageSquare, CheckCircle, Star, Users, Shield, Target, TrendingUp, Calendar, FileText, Building2, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useLanguage } from '../lib/language';
import { Button, Card } from '../lib/ui';
import { AIAgentIcon } from '@consulting19/shared';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const AIExperiencePage = () => {
  const { t } = useLanguage();
  const [activeDemo, setActiveDemo] = useState('consultation');

  const aiFeatures = [
    {
      icon: Bot,
      title: 'AI Oracle Assistant',
      description: 'Your personal AI consultant available 24/7 in 20+ languages',
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: Globe,
      title: 'Global Jurisdiction Analysis',
      description: 'AI-powered analysis of 19+ countries for optimal business setup',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Zap,
      title: 'Instant Recommendations',
      description: 'Get personalized business structure recommendations in seconds',
      color: 'from-orange-500 to-red-500',
    },
    {
      icon: Shield,
      title: 'Compliance Monitoring',
      description: 'AI monitors regulatory changes and alerts you proactively',
      color: 'from-green-500 to-emerald-500',
    },
  ];

  const demoScenarios = [
    {
      id: 'consultation',
      title: 'AI Business Consultation',
      description: 'See how AI Oracle provides instant business advice',
      messages: [
        { type: 'user', content: 'I want to start a tech company with low taxes' },
        { type: 'ai', content: 'Based on your requirements, I recommend Estonia for EU access with e-Residency, or Georgia for 1% tax rate. Would you like me to analyze the specific benefits of each?' },
        { type: 'user', content: 'Tell me about Georgia' },
        { type: 'ai', content: 'Georgia offers Small Business Status with 1% tax on turnover up to $200K annually. Setup takes 1-2 days, no minimum capital required. I can connect you with Giorgi Meskhi, our Georgian specialist. Shall I schedule a consultation?' },
      ]
    },
    {
      id: 'analysis',
      title: 'Jurisdiction Analysis',
      description: 'Watch AI analyze multiple countries for your needs',
      messages: [
        { type: 'user', content: 'Compare UAE vs Singapore for my fintech startup' },
        { type: 'ai', content: 'Analyzing both jurisdictions for fintech... UAE offers 0% corporate tax and strong banking sector, while Singapore provides robust regulatory framework and Asian market access. UAE: Faster setup, lower costs. Singapore: Better for fundraising, stronger IP protection. Which aspect is more important for your startup?' },
        { type: 'user', content: 'I need strong regulatory framework' },
        { type: 'ai', content: 'Singapore is ideal for you. MAS (Monetary Authority) provides clear fintech regulations, sandbox programs for testing, and strong investor confidence. I can connect you with our Singapore specialist for detailed guidance.' },
      ]
    },
    {
      id: 'multilingual',
      title: 'Multilingual Support',
      description: 'Experience seamless communication in any language',
      messages: [
        { type: 'user', content: 'Türkiye\'de şirket kurmak istiyorum', lang: 'tr' },
        { type: 'ai', content: 'Türkiye\'de şirket kuruluşu için size yardımcı olabilirim. Anonim şirket veya limited şirket seçenekleriniz var. Hangi sektörde faaliyet göstereceksiniz?', lang: 'tr' },
        { type: 'user', content: 'E-ticaret sektöründe', lang: 'tr' },
        { type: 'ai', content: 'E-ticaret için Limited Şirket öneriyorum. Daha az sermaye gereksinimi ve basit yönetim yapısı var. Türk uzmanımızla görüşmenizi ayarlayabilirim.', lang: 'tr' },
      ]
    }
  ];

  const benefits = [
    {
      icon: Zap,
      title: 'Instant Responses',
      description: 'Get answers to complex business questions in seconds',
    },
    {
      icon: Globe,
      title: '20+ Languages',
      description: 'Communicate in your native language with perfect translation',
    },
    {
      icon: Users,
      title: 'Expert Connection',
      description: 'Seamlessly connect with local specialists when needed',
    },
    {
      icon: Shield,
      title: 'Always Updated',
      description: 'AI knowledge base updated with latest regulations and laws',
    },
  ];

  const useCases = [
    {
      title: 'Jurisdiction Selection',
      description: 'Find the perfect country for your business',
      icon: Target,
      example: 'AI analyzes your business model, target markets, and tax preferences to recommend optimal jurisdictions',
    },
    {
      title: 'Tax Optimization',
      description: 'Discover legal tax-saving strategies',
      icon: TrendingUp,
      example: 'Get personalized tax strategies based on your income sources and business structure',
    },
    {
      title: 'Compliance Guidance',
      description: 'Stay compliant across all jurisdictions',
      icon: FileText,
      example: 'Receive proactive alerts about regulatory changes affecting your business',
    },
    {
      title: 'Expert Matching',
      description: 'Connect with the right specialists',
      icon: Users,
      example: 'AI matches you with consultants based on your specific needs and location',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Experience the Future of Business Consulting - AI-Powered Platform - Consulting19</title>
        <meta name="description" content="Experience AI-powered business consulting with instant recommendations, multilingual support, and expert connections across 19+ countries." />
      </Helmet>

      <Navbar />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-600 text-white py-14 mt-16 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-14 left-14 w-44 h-44 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-14 right-14 w-67 h-67 bg-cyan-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        {/* Floating AI Icons */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-14 left-1/4 text-3xl animate-float">🤖</div>
          <div className="absolute top-22 right-1/4 text-2xl animate-float-delayed">⚡</div>
          <div className="absolute bottom-14 left-1/3 text-2xl animate-bounce delay-1000">🌍</div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center mb-6">
            <Link to="/">
              <Button variant="outline" icon={ArrowLeft} iconPosition="left" className="border-white text-white bg-white/10 hover:bg-white/20 hover:border-white shadow-lg backdrop-blur-sm">
                Back to Home
              </Button>
            </Link>
          </div>
          
          <div className="max-w-5xl mx-auto text-center">
            <div className="flex items-center justify-center space-x-3 mb-8">
              <div className="w-11 h-11 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-xl animate-pulse">
                <Bot className="w-6 h-6 text-white" />
              </div>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
              Experience the Future of
              <br />
              <span className="bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-300 bg-clip-text text-transparent">
                Business Consulting
              </span>
            </h1>
            
            <p className="text-lg text-purple-100 mb-6 leading-relaxed max-w-4xl mx-auto">
              Discover how AI Oracle revolutionizes international business consulting with instant recommendations, 
              multilingual support, and seamless expert connections.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth?mode=register">
                <Button 
                  size="md" 
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-bold px-8 py-3 text-base shadow-2xl border-0 transform hover:scale-105 transition-all duration-300"
                >
                  Start Free Trial
                </Button>
              </Link>
              <Button 
                size="md" 
                className="bg-white/20 backdrop-blur-sm text-white border-2 border-white/30 hover:bg-white/30 font-semibold px-8 py-3 text-base transition-all duration-300"
              >
                Watch Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* AI Features */}
        <section className="py-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              AI-Powered <span className="text-purple-600">Intelligence</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Revolutionary AI technology that transforms how you approach international business
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {aiFeatures.map((feature, index) => (
              <Card key={index} hover className="text-center border-2 border-gray-100 hover:border-purple-200 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl group">
                <Card.Body className="py-10 relative overflow-hidden">
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
                  
                  <div className={`w-20 h-20 bg-gradient-to-r ${feature.color} rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                    <feature.icon className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-purple-700 transition-colors duration-300">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </Card.Body>
              </Card>
            ))}
          </div>
        </section>

        {/* Interactive Demo */}
        <section className="py-20 bg-gradient-to-br from-gray-50 via-purple-50 to-blue-50 rounded-3xl mb-16">
          <div className="max-w-6xl mx-auto px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                See AI Oracle in <span className="text-purple-600">Action</span>
              </h2>
              <p className="text-xl text-gray-600">
                Interactive demonstrations of AI-powered consulting
              </p>
            </div>

            {/* Demo Tabs */}
            <div className="flex justify-center mb-8">
              <div className="flex space-x-2 bg-white rounded-xl p-2 shadow-lg">
                {demoScenarios.map((demo) => (
                  <button
                    key={demo.id}
                    onClick={() => setActiveDemo(demo.id)}
                    className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                      activeDemo === demo.id
                        ? 'bg-purple-600 text-white shadow-lg'
                        : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
                    }`}
                  >
                    {demo.title}
                  </button>
                ))}
              </div>
            </div>

            {/* Demo Content */}
            <div className="bg-white rounded-2xl shadow-2xl border border-purple-100 overflow-hidden">
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6">
                <h3 className="text-xl font-bold mb-2">
                  {demoScenarios.find(d => d.id === activeDemo)?.title}
                </h3>
                <p className="text-purple-100">
                  {demoScenarios.find(d => d.id === activeDemo)?.description}
                </p>
              </div>
              
              <div className="p-6 h-80 overflow-y-auto">
                <div className="space-y-4">
                  {demoScenarios.find(d => d.id === activeDemo)?.messages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`flex items-start space-x-3 max-w-xs lg:max-w-md ${
                        message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                      }`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                          message.type === 'user' 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-purple-600 text-white'
                        }`}>
                          {message.type === 'user' ? (
                            <Users className="w-4 h-4" />
                          ) : (
                            <Bot className="w-4 h-4" />
                          )}
                        </div>
                        <div className={`p-4 rounded-2xl ${
                          message.type === 'user'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}>
                          <p className="text-sm leading-relaxed">{message.content}</p>
                          {message.lang && (
                            <div className="mt-2 text-xs opacity-75">
                              Language: {message.lang.toUpperCase()}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Why Choose <span className="text-purple-600">AI Oracle</span>?
            </h2>
            <p className="text-xl text-gray-600">
              Revolutionary advantages that transform your consulting experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} hover className="text-center group">
                <Card.Body className="py-8">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                    <benefit.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-purple-700 transition-colors duration-300">{benefit.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
                </Card.Body>
              </Card>
            ))}
          </div>
        </section>

        {/* Use Cases */}
        <section className="py-20 bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 rounded-3xl mb-16">
          <div className="max-w-6xl mx-auto px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                AI Oracle <span className="text-purple-600">Use Cases</span>
              </h2>
              <p className="text-xl text-gray-600">
                Real-world applications of AI-powered consulting
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {useCases.map((useCase, index) => (
                <Card key={index} hover className="group">
                  <Card.Body className="p-8">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <useCase.icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-purple-700 transition-colors duration-300">{useCase.title}</h3>
                        <p className="text-gray-600 mb-4">{useCase.description}</p>
                        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                          <p className="text-sm text-purple-800 italic">"{useCase.example}"</p>
                        </div>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              ))}
            </div>
          </div>
        </section>


        {/* CTA Section */}
        <section className="py-20">
          <Card className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 text-white">
            <Card.Body className="text-center py-16">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-4xl font-bold mb-6">
                  Ready to Experience AI-Powered Consulting?
                </h2>
                <p className="text-xl text-purple-100 mb-8 leading-relaxed">
                  Join thousands of entrepreneurs who have transformed their international expansion 
                  with AI Oracle's intelligent guidance and expert network.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-6 justify-center mb-8">
                  <Link to="/auth?mode=register">
                    <Button 
                      size="lg" 
                      className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-bold px-10 py-4 text-lg shadow-2xl border-0 transform hover:scale-105 transition-all duration-300"
                    >
                      Start Your AI Consultation
                    </Button>
                  </Link>
                  <Link to="/ai-recommendations">
                    <Button 
                      size="lg" 
                      className="bg-white text-purple-600 hover:bg-gray-100 font-bold px-10 py-4 text-lg shadow-2xl transform hover:scale-105 transition-all duration-300"
                    >
                      Get AI Recommendations
                    </Button>
                  </Link>
                </div>

                <div className="flex items-center justify-center space-x-8 text-purple-100">
                  <div className="flex items-center space-x-2">
                    <Bot className="w-6 h-6" />
                    <span>AI-Powered</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Globe className="w-6 h-6" />
                    <span>19+ Countries</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Zap className="w-6 h-6" />
                    <span>Instant Results</span>
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </section>
      </div>

      <Footer />
      
      {/* AI Agent Icon */}
      <AIAgentIcon />

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .animate-float-delayed {
          animation: float 3s ease-in-out infinite;
          animation-delay: 1s;
        }
      `}</style>
    </div>
  );
};

export default AIExperiencePage;
