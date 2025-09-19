import React, { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle, Clock, DollarSign, FileText, Users, Shield, Lock, Globe, MessageSquare, Calendar, TrendingUp, Bot, Zap, Target, BarChart3, ChevronDown, Eye, Building2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useLanguage } from '../../lib/language';
import { Button, Card } from '../../lib/ui';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const AssetProtectionPage = () => {
  const { t } = useLanguage();
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [visibleSteps, setVisibleSteps] = useState<number[]>([]);

  // Scroll animation for process steps
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const stepIndex = parseInt(entry.target.getAttribute('data-step') || '0');
            setVisibleSteps(prev => [...new Set([...prev, stepIndex])]);
          }
        });
      },
      { threshold: 0.3 }
    );

    const stepElements = document.querySelectorAll('[data-step]');
    stepElements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const serviceHighlights = [
    {
      icon: Globe,
      title: 'Offshore Protection Jurisdictions',
      description: 'Access to premier offshore jurisdictions with proven asset protection laws',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Shield,
      title: 'AI-Backed Security Guidance',
      description: 'Advanced AI analysis for optimal protection strategies and risk assessment',
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: Zap,
      title: 'Customized Wealth Strategies',
      description: 'Tailored protection plans designed specifically for your asset portfolio',
      color: 'from-orange-500 to-red-500',
    },
    {
      icon: Lock,
      title: 'Maximum Privacy & Risk Mitigation',
      description: 'Comprehensive privacy protection with advanced risk mitigation techniques',
      color: 'from-green-500 to-emerald-500',
    },
  ];

  const whyChooseUs = [
    {
      icon: Shield,
      title: 'Proven Strategies',
      description: 'We implement internationally recognized protective structures with proven track records.',
    },
    {
      icon: Users,
      title: 'Local Expertise',
      description: 'Partnered with trusted firms in top asset protection jurisdictions worldwide.',
    },
    {
      icon: Bot,
      title: 'AI Advantage',
      description: '24/7 multilingual AI assistant for strategy clarification and ongoing support.',
    },
    {
      icon: Eye,
      title: 'Confidential & Secure',
      description: 'Your data and assets are fully protected at every stage of the process.',
    },
  ];

  const protectionStrategies = [
    {
      title: 'Offshore Trusts',
      description: 'Asset separation, creditor protection, estate planning',
      icon: Shield,
      color: 'from-blue-500 to-cyan-500',
      benefits: ['Asset separation', 'Creditor protection', 'Privacy enhancement', 'Estate planning'],
      jurisdictions: ['Cook Islands', 'Nevis', 'Belize', 'Cayman Islands'],
    },
    {
      title: 'Private Foundations',
      description: 'Succession planning, governance, tax efficiency',
      icon: Building2,
      color: 'from-purple-500 to-pink-500',
      benefits: ['Perpetual existence', 'Flexible governance', 'Tax efficiency', 'Succession planning'],
      jurisdictions: ['Panama', 'Liechtenstein', 'Malta', 'Netherlands'],
    },
    {
      title: 'Holding Companies',
      description: 'Flexibility, liability limitation, tax optimization',
      icon: TrendingUp,
      color: 'from-green-500 to-teal-500',
      benefits: ['Limited liability', 'Tax optimization', 'Operational flexibility', 'Investment protection'],
      jurisdictions: ['Luxembourg', 'Netherlands', 'Malta', 'Cyprus'],
    },
    {
      title: 'Insurance Solutions',
      description: 'Risk transfer, estate benefits, liquidity protection',
      icon: Target,
      color: 'from-orange-500 to-yellow-500',
      benefits: ['Risk transfer', 'Liquidity protection', 'Tax advantages', 'Estate benefits'],
      jurisdictions: ['Switzerland', 'Ireland', 'Luxembourg', 'Liechtenstein', 'Gibraltar'],
    },
  ];

  const processSteps = [
    {
      step: 1,
      title: 'Asset & Risk Assessment',
      description: 'Evaluate risks',
      duration: '3–5 days',
      detail: 'Comprehensive evaluation of your assets and potential risk exposure',
    },
    {
      step: 2,
      title: 'Protection Strategy Design',
      description: 'Tailored protection plan',
      duration: '1 week',
      detail: 'Develop customized asset protection strategy based on your specific needs',
    },
    {
      step: 3,
      title: 'Structure Implementation',
      description: 'Set up trusts/foundations',
      duration: '2–4 weeks',
      detail: 'Establish trusts, foundations, or other protective structures',
    },
    {
      step: 4,
      title: 'Asset Transfer Planning',
      description: 'Execute transfers securely',
      duration: '1–2 weeks',
      detail: 'Plan and execute secure asset transfers to protective structures',
    },
    {
      step: 5,
      title: 'Documentation & Compliance',
      description: 'Complete documentation',
      duration: '1 week',
      detail: 'Complete all legal documentation and establish compliance procedures',
    },
    {
      step: 6,
      title: 'Ongoing Management',
      description: 'Continuous monitoring',
      duration: 'Ongoing',
      detail: 'Continuous monitoring and management of protective structures',
    },
  ];

  const serviceFeatures = [
    'Offshore trust setup',
    'Private foundation planning',
    'Holding company structuring',
    'Insurance-based risk transfer',
    'Asset transfer management',
    'Estate & succession planning',
    'Ongoing monitoring & audits',
    'Compliance & documentation',
  ];

  const faqs = [
    {
      question: 'Is asset protection legal?',
      answer: 'Yes, asset protection through proper legal structures is completely legal when done proactively and in compliance with all applicable laws and regulations.',
    },
    {
      question: 'When should I consider asset protection?',
      answer: 'Asset protection should be implemented before you need it. The best time is when your business is successful and growing, before any potential threats arise.',
    },
    {
      question: 'What assets can be protected?',
      answer: 'Most assets can be protected including real estate, business interests, investments, intellectual property, and liquid assets through appropriate structures.',
    },
    {
      question: 'How much does asset protection cost?',
      answer: 'Costs vary based on complexity and jurisdiction, typically ranging from $10,000-50,000 for initial setup, with ongoing maintenance costs of $2,000-10,000 annually.',
    },
    {
      question: 'Will asset protection affect my taxes?',
      answer: 'Asset protection structures can be designed to be tax-neutral or provide tax benefits, depending on your situation and objectives. We ensure tax compliance in all strategies.',
    },
    {
      question: 'How long does asset protection setup take?',
      answer: 'Setup typically takes 4-8 weeks depending on the complexity of structures and jurisdictions involved. Simple trusts can be faster, while complex structures take longer.',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Protect What Matters Most - Asset Protection Services - Consulting19</title>
        <meta name="description" content="Comprehensive asset protection and wealth security strategies powered by AI and trusted by clients worldwide. Expert guidance for offshore trusts, foundations, and protective structures." />
      </Helmet>

      <Navbar />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 text-white py-9 mt-16 overflow-hidden min-h-[36vh] flex items-center">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-12 left-12 w-40 h-40 bg-white/10 rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute bottom-12 right-12 w-60 h-60 bg-cyan-400/10 rounded-full blur-2xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-400/5 rounded-full blur-2xl"></div>
        </div>

        {/* Floating Security Icons */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-12 left-1/4 text-2xl animate-float">🔒</div>
          <div className="absolute top-20 right-1/4 text-xl animate-float-delayed">🛡️</div>
          <div className="absolute bottom-12 left-1/3 text-xl animate-bounce delay-1000">🏦</div>
          <div className="absolute bottom-20 right-1/3 text-lg animate-pulse delay-500">💎</div>
        </div>

        {/* Animated Vault Pattern */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-r from-blue-800/20 via-purple-800/20 to-indigo-800/20">
          <svg className="w-full h-full" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <defs>
              <pattern id="vaultPattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                <circle cx="20" cy="20" r="2" fill="currentColor" opacity="0.3" className="animate-pulse" />
              </pattern>
            </defs>
            <path d="M0,60 C300,120 900,0 1200,60 L1200,120 L0,120 Z" fill="url(#vaultPattern)" className="text-white/10"></path>
          </svg>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="flex items-center mb-6">
            <Link to="/services">
              <Button variant="outline" icon={ArrowLeft} iconPosition="left" className="border-white text-white bg-white/10 hover:bg-white/20 hover:border-white shadow-lg backdrop-blur-sm">
                Back to Services
              </Button>
            </Link>
          </div>
          
          <div className="max-w-5xl mx-auto text-center">
            <div className="flex items-center justify-center space-x-3 mb-8">
              <div className="relative w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-xl animate-pulse">
                <Shield className="w-6 h-6 text-white" />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400/30 via-purple-400/30 to-indigo-400/30 rounded-xl blur-md animate-pulse"></div>
              </div>
            </div>
            
            <h1 className="text-2xl md:text-4xl font-bold mb-4 leading-tight animate-fade-in">
              Protect What
              <br />
              <span className="bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-300 bg-clip-text text-transparent animate-gradient">
                Matters Most
              </span>
            </h1>
            
            <p className="text-lg text-blue-100 mb-6 leading-relaxed max-w-3xl mx-auto animate-fade-in-up delay-200">
              Comprehensive asset protection and wealth security strategies – powered by AI and trusted by clients worldwide.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6 animate-fade-in-up delay-300">
              <Link to="/auth?mode=register">
                <Button 
                  size="md" 
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-bold px-8 py-3 text-base shadow-xl border-0 transform hover:scale-105 transition-all duration-300"
                >
                  Join to Start Asset Protection
                </Button>
              </Link>
              <Button 
                size="md" 
                className="bg-white/20 backdrop-blur-sm text-white border-2 border-white/30 hover:bg-white/30 font-semibold px-8 py-3 text-base transition-all duration-300"
              >
                Free Protection Consultation
              </Button>
            </div>

            {/* Trust Badge */}
            <div className="inline-flex items-center bg-white/20 backdrop-blur-sm rounded-full px-6 py-2 shadow-lg border border-white/30 animate-fade-in-up delay-400">
              <Globe className="w-5 h-5 text-cyan-300 mr-2" />
              <span className="text-white font-medium">Global Expertise</span>
              <span className="mx-3 text-white/60">•</span>
              <Bot className="w-5 h-5 text-purple-300 mr-2" />
              <span className="text-white font-medium">AI Multilingual Support</span>
              <span className="mx-3 text-white/60">•</span>
              <Shield className="w-5 h-5 text-green-300 mr-2" />
              <span className="text-white font-medium">Proven Protection Structures</span>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Service Highlights */}
        <section className="py-16">
          {/* Matrix Private Wealth Premium Section */}
          <div className="mb-16">
            <Card hover className="overflow-hidden group relative bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-800 text-white border border-purple-200 hover:border-purple-300 transition-all duration-500 transform hover:scale-[1.01] hover:shadow-xl">
              {/* Animated Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-2 left-2 w-8 h-8 border border-purple-300 rounded-full animate-pulse"></div>
                <div className="absolute bottom-2 right-2 w-6 h-6 border border-indigo-300 rounded-lg rotate-45 animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 left-1/4 w-4 h-4 border border-purple-300 rounded-full animate-bounce delay-500"></div>
              </div>

              {/* Premium Badge */}
              <div className="absolute top-2 left-2 z-20">
                <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-xs font-bold px-2 py-1 rounded-full shadow-lg animate-pulse">
                  ⭐ PREMIUM INVITATION ONLY
                </span>
              </div>

              {/* Floating Wealth Icons */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
                <div className="absolute top-6 right-6 text-lg animate-float">💎</div>
                <div className="absolute top-12 left-6 text-base animate-float-delayed">🏛️</div>
                <div className="absolute bottom-6 right-1/3 text-base animate-bounce delay-1000">🌍</div>
                <div className="absolute bottom-8 left-1/3 text-sm animate-pulse delay-500">🤖</div>
              </div>

              <Card.Body className="p-4 relative z-10">
                <div className="max-w-3xl mx-auto">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-center">
                    {/* Content */}
                    <div>
                      <div className="flex items-center space-x-2 mb-3">
                        <div className="w-6 h-6 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center shadow-lg">
                          <Shield className="w-3 h-3 text-white" />
                        </div>
                        <div className="text-lg animate-pulse">👑</div>
                      </div>
                      
                      <h2 className="text-lg md:text-xl font-bold mb-3 leading-tight">
                        Global Wealth Management —
                        <br />
                        <span className="bg-gradient-to-r from-yellow-300 via-orange-300 to-pink-300 bg-clip-text text-transparent animate-gradient">
                          Meet Your Personal AI Advisor
                        </span>
                      </h2>
                      
                      <p className="text-sm text-purple-100 mb-4 leading-relaxed">
                        Tax, inheritance, citizenship, reputation... One system for everything.
                        <br />
                        <span className="text-yellow-300 font-semibold">Invitation only access.</span>
                      </p>
                      
                      <div className="space-y-2 mb-4">
                        {[
                          { icon: '🤖', text: 'Design your wealth\'s future with AI' },
                          { icon: '🌍', text: 'Real-time risk analysis for 150+ countries' },
                          { icon: '🎙️', text: '24/7 strategic guidance with voice AI advisor' },
                          { icon: '⚡', text: 'Digital immortality and inheritance transfer technology' }
                        ].map((feature, index) => (
                          <div key={index} className="flex items-center space-x-4 group">
                            <div className="w-6 h-6 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                              <span className="text-sm">{feature.icon}</span>
                            </div>
                            <span className="text-purple-100 font-medium text-sm group-hover:text-yellow-300 transition-colors duration-300">
                              {feature.text}
                            </span>
                          </div>
                        ))}
                      </div>
                      
                      <Button 
                        size="sm" 
                        className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black font-bold px-6 py-3 text-base shadow-xl border-0 transform hover:scale-105 transition-all duration-300 relative overflow-hidden group"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <span className="relative z-10 flex items-center">
                          🔥 Exclusive Access to Matrix Wealth →
                        </span>
                      </Button>
                    </div>

                    {/* AI Wealth Illustration */}
                    <div className="relative">
                      <div className="bg-gradient-to-br from-purple-50 via-indigo-50 to-purple-50 rounded-xl p-4 shadow-xl border border-purple-100 relative overflow-hidden">
                        {/* Animated background elements */}
                        <div className="absolute top-2 right-2 w-8 h-8 bg-gradient-to-r from-purple-200/30 to-indigo-200/30 rounded-full blur-lg animate-pulse"></div>
                        <div className="absolute bottom-2 left-2 w-6 h-6 bg-gradient-to-r from-indigo-200/30 to-purple-200/30 rounded-full blur-md animate-pulse delay-1000"></div>
                        
                        <div className="text-center mb-4">
                          <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center mx-auto mb-2 shadow-lg">
                            <Shield className="w-4 h-4 text-white" />
                          </div>
                          <h3 className="text-base font-bold text-gray-900 mb-1">Matrix AI Wealth</h3>
                          <p className="text-purple-700 text-sm">Ultra-high-net-worth platform</p>
                        </div>
                        
                        <div className="space-y-3">
                          <div className="bg-white rounded-lg p-3 shadow-lg border border-purple-100 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-emerald-500"></div>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs font-medium text-gray-700">Global Portfolio</span>
                              <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                <span className="text-xs font-bold text-green-600">Protected</span>
                              </div>
                            </div>
                            <div className="text-lg font-bold text-gray-900 mb-1">€68.4M</div>
                            <div className="text-xs text-gray-600">AI Optimization Active</div>
                          </div>
                          
                          <div className="bg-white rounded-lg p-3 shadow-lg border border-indigo-100 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-indigo-500"></div>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs font-medium text-gray-700">Risk Analysis</span>
                              <div className="flex items-center space-x-2">
                                <span className="text-lg">🤖</span>
                                <span className="text-xs font-bold text-purple-600">AI Monitor</span>
                              </div>
                            </div>
                            <div className="text-sm font-bold text-gray-900 mb-1">Low Risk</div>
                            <div className="text-xs text-gray-600">150+ country analysis</div>
                          </div>
                          
                          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg p-3 text-white text-center shadow-lg">
                            <div className="text-xs font-medium mb-1">👑 Matrix Status</div>
                            <div className="text-sm font-bold">Fully Protected</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {serviceHighlights.map((highlight, index) => (
              <Card key={index} hover className="text-center border-2 border-gray-100 hover:border-blue-200 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl group relative overflow-hidden">
                <Card.Body className="py-10 relative z-10">
                  {/* Animated background gradient on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${highlight.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
                  
                  {/* Glowing outline effect */}
                  <div className={`absolute inset-0 bg-gradient-to-r ${highlight.color} opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500`}></div>
                  
                  <div className={`w-20 h-20 bg-gradient-to-r ${highlight.color} rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 relative`}>
                    <highlight.icon className="w-10 h-10 text-white" />
                    <div className={`absolute inset-0 bg-gradient-to-r ${highlight.color} rounded-3xl blur-lg opacity-60 group-hover:opacity-100 transition-opacity duration-500`}></div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-blue-700 transition-colors duration-300">{highlight.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{highlight.description}</p>
                </Card.Body>
              </Card>
            ))}
          </div>
        </section>

        {/* Why Consulting19 for Asset Protection? */}
        <section className="py-20 bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 rounded-3xl mb-16 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-8 left-8 w-32 h-32 border-2 border-blue-300 rounded-full animate-pulse"></div>
            <div className="absolute bottom-8 right-8 w-24 h-24 border-2 border-purple-300 rounded-lg rotate-45 animate-pulse delay-1000"></div>
            <div className="absolute top-1/2 left-1/4 w-16 h-16 border border-cyan-300 rounded-full animate-bounce delay-500"></div>
          </div>

          <div className="relative max-w-6xl mx-auto px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Why <span className="text-blue-600">Consulting19</span> for Asset Protection?
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                The future of wealth protection consulting is here
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-10">
                {whyChooseUs.map((reason, index) => (
                  <div key={index} className="flex items-start space-x-6 group">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                      <reason.icon className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-700 transition-colors duration-300">{reason.title}</h3>
                      <p className="text-gray-600 leading-relaxed text-lg">{reason.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* AI Protection Illustration */}
              <div className="relative">
                <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50 rounded-3xl p-10 shadow-2xl border-2 border-blue-100 relative overflow-hidden">
                  {/* Animated background elements */}
                  <div className="absolute top-6 right-6 w-24 h-24 bg-gradient-to-r from-blue-200/30 to-purple-200/30 rounded-full blur-xl animate-pulse"></div>
                  <div className="absolute bottom-6 left-6 w-20 h-20 bg-gradient-to-r from-purple-200/30 to-indigo-200/30 rounded-full blur-lg animate-pulse delay-1000"></div>
                  
                  <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl">
                      <Shield className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">AI Asset Protection</h3>
                    <p className="text-blue-700">Digital wealth security layers</p>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="bg-white rounded-2xl p-6 shadow-xl border border-blue-100 relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-emerald-500"></div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-gray-700">Asset Portfolio</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                          <span className="text-sm font-bold text-green-600">Protected</span>
                        </div>
                      </div>
                      <div className="text-2xl font-bold text-gray-900 mb-2">$36.4M</div>
                      <div className="text-sm text-gray-600">Offshore Trust Structure</div>
                    </div>
                    
                    <div className="bg-white rounded-2xl p-6 shadow-xl border border-purple-100 relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-gray-700">Risk Assessment</span>
                        <div className="flex items-center space-x-2">
                          <Bot className="w-4 h-4 text-purple-600" />
                          <span className="text-sm font-bold text-purple-600">AI Monitored</span>
                        </div>
                      </div>
                      <div className="text-lg font-bold text-gray-900 mb-2">Low Risk</div>
                      <div className="text-sm text-gray-600">Continuous monitoring active</div>
                    </div>
                    
                    <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl p-6 text-white text-center shadow-xl">
                      <div className="text-sm font-medium mb-2">🛡️ Protection Status</div>
                      <div className="text-xl font-bold">Fully Secured</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Protection Strategies (Interactive Cards) */}
        <section className="py-20 relative">
          {/* Vault Door Pattern Background */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 25% 25%, #3b82f6 3px, transparent 3px),
                               radial-gradient(circle at 75% 75%, #8b5cf6 3px, transparent 3px)`,
              backgroundSize: '60px 60px'
            }}></div>
          </div>

          <div className="relative">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Protection <span className="text-blue-600">Strategies</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Choose from proven asset protection structures tailored to your needs
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {protectionStrategies.map((strategy, index) => (
                <Card key={index} hover className="text-center group cursor-pointer transform hover:scale-105 transition-all duration-500 hover:shadow-2xl border-2 border-gray-100 hover:border-blue-200 relative overflow-hidden">
                  <Card.Body className="py-10 relative z-10">
                    {/* Animated background gradient on hover */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${strategy.color} opacity-0 group-hover:opacity-15 transition-opacity duration-500`}></div>
                    
                    {/* Glowing effect */}
                    <div className={`absolute inset-0 bg-gradient-to-r ${strategy.color} opacity-0 group-hover:opacity-30 blur-2xl transition-opacity duration-500`}></div>
                    
                    <div className={`w-20 h-20 bg-gradient-to-r ${strategy.color} rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 relative`}>
                      <strategy.icon className="w-10 h-10 text-white" />
                      <div className={`absolute inset-0 bg-gradient-to-r ${strategy.color} rounded-3xl blur-lg opacity-60 group-hover:opacity-100 transition-opacity duration-500`}></div>
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-blue-700 transition-colors duration-300">{strategy.title}</h3>
                    <p className="text-gray-600 leading-relaxed mb-6">{strategy.description}</p>
                    
                    <div className="space-y-2 mb-6">
                      {strategy.benefits.map((benefit, i) => (
                        <div key={i} className="text-sm text-gray-700 flex items-center">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                          <span>{benefit}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="text-xs text-gray-500">
                      <strong>Available in:</strong> {strategy.jurisdictions.join(', ')}
                    </div>
                  </Card.Body>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Protection Process (Timeline Animation) */}
        <section className="py-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Protection <span className="text-blue-600">Process</span>
            </h2>
            <p className="text-xl text-gray-600">
              Step-by-step timeline with shield icon pulse effects
            </p>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-2 h-full bg-gradient-to-b from-blue-500 via-purple-500 to-indigo-500 rounded-full hidden lg:block shadow-lg"></div>
            
            <div className="space-y-16">
              {processSteps.map((step, index) => (
                <div 
                  key={index} 
                  data-step={index}
                  className={`flex items-center ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} flex-col lg:space-x-12 transition-all duration-700 ${
                    visibleSteps.includes(index) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                  }`}
                >
                  <div className={`flex-1 ${index % 2 === 0 ? 'lg:text-right' : 'lg:text-left'} text-center lg:mb-0 mb-8`}>
                    <Card className="inline-block group hover:shadow-2xl transition-all duration-500 transform hover:scale-105 border-2 border-gray-100 hover:border-blue-200">
                      <Card.Body className="py-8 px-10 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="relative">
                          <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-700 transition-colors duration-300">{step.title}</h3>
                          <p className="text-gray-600 mb-4 text-lg">{step.detail}</p>
                          <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                            <Clock className="w-5 h-5" />
                            <span className="font-medium text-lg">{step.duration}</span>
                          </div>
                        </div>
                      </Card.Body>
                    </Card>
                  </div>
                  
                  <div className={`relative z-10 w-20 h-20 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-xl shadow-2xl transform transition-all duration-700 ${
                    visibleSteps.includes(index) ? 'scale-100 rotate-0' : 'scale-75 rotate-45'
                  }`}>
                    {step.step}
                    {/* Shield pulse animation for active step */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-ping opacity-30"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full animate-pulse opacity-20"></div>
                  </div>
                  
                  <div className="flex-1 hidden lg:block"></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* What's Included (Grid with Hover Effect) */}
        <section className="py-20 relative">
          {/* Moving grid background */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: `linear-gradient(45deg, #3b82f6 25%, transparent 25%),
                               linear-gradient(-45deg, #3b82f6 25%, transparent 25%),
                               linear-gradient(45deg, transparent 75%, #8b5cf6 75%),
                               linear-gradient(-45deg, transparent 75%, #8b5cf6 75%)`,
              backgroundSize: '30px 30px',
              backgroundPosition: '0 0, 0 15px, 15px -15px, -15px 0px',
              animation: 'moveGrid 20s linear infinite'
            }}></div>
          </div>

          <div className="relative">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                What's <span className="text-blue-600">Included</span>
              </h2>
              <p className="text-xl text-gray-600">
                Complete asset protection coverage with premium support
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {serviceFeatures.map((feature, index) => (
                <Card key={index} className="text-center hover:shadow-2xl transition-all duration-500 transform hover:scale-110 group border-2 border-gray-100 hover:border-blue-200 relative overflow-hidden">
                  <Card.Body className="py-8 relative z-10">
                    {/* Glowing gradient outline on hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500"></div>
                    
                    <div className="relative">
                      <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl transform group-hover:scale-125 group-hover:rotate-12 transition-all duration-500">
                        <CheckCircle className="w-8 h-8 text-white" />
                      </div>
                      <p className="text-gray-700 font-semibold leading-relaxed group-hover:text-blue-700 transition-colors duration-300">{feature}</p>
                    </div>
                  </Card.Body>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 relative">
          {/* Moving blue-violet grid background */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 20% 20%, #3b82f6 2px, transparent 2px),
                               radial-gradient(circle at 80% 80%, #8b5cf6 2px, transparent 2px)`,
              backgroundSize: '50px 50px',
              animation: 'moveGrid 25s linear infinite reverse'
            }}></div>
          </div>

          <div className="relative">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Frequently Asked <span className="text-blue-600">Questions</span>
              </h2>
              <p className="text-xl text-gray-600">
                Get answers to common asset protection questions
              </p>
            </div>

            <div className="max-w-4xl mx-auto space-y-6">
              {faqs.map((faq, index) => (
                <Card key={index} className="hover:shadow-2xl transition-all duration-500 border-2 border-gray-100 hover:border-blue-200 group">
                  <Card.Body>
                    <button
                      onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                      className="w-full text-left"
                    >
                      <div className="flex items-center justify-between py-4">
                        <h3 className="text-xl font-bold text-gray-900 pr-6 group-hover:text-blue-700 transition-colors duration-300">{faq.question}</h3>
                        <div className={`w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center transition-all duration-500 ${
                          expandedFaq === index ? 'bg-blue-600 rotate-180' : 'group-hover:bg-blue-200'
                        }`}>
                          <ChevronDown className={`w-6 h-6 transition-all duration-500 ${
                            expandedFaq === index ? 'text-white' : 'text-blue-600'
                          }`} />
                        </div>
                      </div>
                    </button>
                    
                    <div className={`overflow-hidden transition-all duration-700 ease-in-out ${
                      expandedFaq === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                    }`}>
                      <div className="pt-6 border-t border-gray-200 mt-4">
                        <p className="text-gray-600 leading-relaxed text-lg">{faq.answer}</p>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA (Bottom Banner) */}
        <section className="py-20">
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-3xl text-white p-16 text-center relative overflow-hidden">
            {/* Animated glowing lock icons */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-8 left-8 text-4xl animate-pulse">🔒</div>
              <div className="absolute top-12 right-12 text-3xl animate-pulse delay-1000">🛡️</div>
              <div className="absolute bottom-8 left-12 text-3xl animate-bounce delay-500">💎</div>
              <div className="absolute bottom-12 right-8 text-2xl animate-pulse delay-1500">🏦</div>
            </div>

            {/* Animated Wave Pattern */}
            <div className="absolute inset-0 opacity-20">
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1000 1000" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
                    <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.1" />
                  </linearGradient>
                </defs>
                <path d="M0,300 Q250,200 500,300 T1000,300 L1000,1000 L0,1000 Z" fill="url(#waveGradient)" className="animate-pulse">
                  <animateTransform
                    attributeName="transform"
                    type="translate"
                    values="0,0;50,0;0,0"
                    dur="10s"
                    repeatCount="indefinite"
                  />
                </path>
              </svg>
            </div>

            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Ready to Protect Your <span className="text-cyan-300">Wealth</span>?
              </h2>
              <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
                Join thousands of clients who trust Consulting19 with their asset protection needs. 
                Start your journey to financial security today.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Link to="/auth?mode=register">
                  <Button 
                    size="md" 
                    className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-bold px-8 py-3 text-base shadow-xl border-0 transform hover:scale-105 transition-all duration-300"
                  >
                    Join to Start Asset Protection
                  </Button>
                </Link>
                <Link to="/auth?mode=register">
                  <Button 
                    size="lg" 
                    className="bg-white text-blue-600 hover:bg-gray-100 font-bold px-10 py-4 text-lg shadow-xl border-0 transform hover:scale-105 transition-all duration-300"
                  >
                    Start Asset Protection Now
                  </Button>
                </Link>
              </div>
              
              <div className="mt-8 flex items-center justify-center space-x-8 text-blue-100">
                <div className="flex items-center space-x-2">
                  <Shield className="w-6 h-6" />
                  <span>Proven Protection</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Globe className="w-6 h-6" />
                  <span>Global Expertise</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Bot className="w-6 h-6" />
                  <span>AI-Powered</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default AssetProtectionPage;