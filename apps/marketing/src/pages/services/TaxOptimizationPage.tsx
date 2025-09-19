import React, { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle, Clock, DollarSign, FileText, Users, Shield, Calculator, Globe, MessageSquare, Calendar, TrendingUp, Bot, Zap, Target, BarChart3, ChevronDown, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useLanguage } from '../../lib/language';
import { Button, Card } from '../../lib/ui';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const TaxOptimizationPage = () => {
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
      title: 'Global Reach with Local Experts',
      description: 'Licensed tax advisors in 19+ countries with deep local knowledge',
      color: 'from-blue-500 to-teal-500',
    },
    {
      icon: Bot,
      title: 'AI Assistant & Multilingual Guidance',
      description: 'Real-time translation and 24/7 AI-powered tax guidance',
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: Zap,
      title: 'Tailored Tax Optimization Strategies',
      description: 'Custom strategies designed for your specific business needs',
      color: 'from-orange-500 to-red-500',
    },
    {
      icon: Shield,
      title: '100% Legal & Compliant Solutions',
      description: 'All strategies comply with international tax laws and regulations',
      color: 'from-green-500 to-emerald-500',
    },
  ];

  const whyChooseUs = [
    {
      icon: Shield,
      title: 'Legal & Ethical',
      description: 'We focus only on legitimate, compliant tax strategies.',
    },
    {
      icon: Bot,
      title: 'Faster Insights with AI',
      description: 'Our AI assistant explains strategies clearly in your language.',
    },
    {
      icon: Users,
      title: 'Local Knowledge',
      description: 'Licensed advisors in each jurisdiction ensure accuracy.',
    },
    {
      icon: TrendingUp,
      title: 'Proven Savings',
      description: 'Clients save an average of 20–40% annually on taxes.',
    },
  ];

  const taxStrategies = [
    {
      title: 'Territorial Tax Systems',
      description: 'Benefit from countries that only tax local income',
      examples: ['Georgia', 'Malaysia', 'Singapore'],
      icon: Globe,
      color: 'from-blue-500 to-cyan-500',
    },
    {
      title: 'Double Tax Treaties',
      description: 'Optimize using extensive treaty networks',
      examples: ['Netherlands', 'Malta', 'Cyprus'],
      icon: Shield,
      color: 'from-green-500 to-teal-500',
    },
    {
      title: 'Low Tax Jurisdictions',
      description: 'Establish presence in low-tax environments',
      examples: ['UAE', 'Estonia', 'Ireland'],
      icon: DollarSign,
      color: 'from-orange-500 to-yellow-500',
    },
    {
      title: 'Holding Structures',
      description: 'Create tax-efficient holding company structures',
      examples: ['Luxembourg', 'Netherlands', 'Malta'],
      icon: TrendingUp,
      color: 'from-purple-500 to-pink-500',
    },
  ];

  const processSteps = [
    {
      step: 1,
      title: 'Tax Situation Analysis',
      description: 'Review obligations',
      duration: '2–3 days',
      detail: 'Comprehensive review of your current tax situation and obligations',
    },
    {
      step: 2,
      title: 'Strategy Development',
      description: 'Tailored tax plan',
      duration: '3–5 days',
      detail: 'Develop customized tax optimization strategy based on your goals',
    },
    {
      step: 3,
      title: 'Structure Implementation',
      description: 'Apply structures/entities',
      duration: '1–2 weeks',
      detail: 'Implement recommended tax-efficient structures and entities',
    },
    {
      step: 4,
      title: 'Compliance Setup',
      description: 'Reporting systems',
      duration: '1 week',
      detail: 'Establish ongoing compliance procedures and reporting systems',
    },
    {
      step: 5,
      title: 'Documentation & Training',
      description: 'Deliver docs + training',
      duration: '2–3 days',
      detail: 'Provide documentation and train your team on new procedures',
    },
    {
      step: 6,
      title: 'Ongoing Monitoring',
      description: 'Continuous optimization',
      duration: 'Ongoing',
      detail: 'Continuous monitoring and optimization of tax strategies',
    },
  ];

  const faqs = [
    {
      question: 'Is tax optimization legal?',
      answer: 'Yes, tax optimization through proper planning and legal structures is completely legal. We ensure all strategies comply with international tax laws and regulations.',
    },
    {
      question: 'How much can I save with tax optimization?',
      answer: 'Savings vary based on your situation, but clients typically save 20-60% on their global tax burden through proper planning and structure optimization.',
    },
    {
      question: 'What is the difference between tax avoidance and tax evasion?',
      answer: 'Tax avoidance is legal planning to minimize taxes, while tax evasion is illegal. We only provide legal tax optimization strategies that comply with all regulations.',
    },
    {
      question: 'Do I need to change my business location for tax benefits?',
      answer: 'Not necessarily. Many tax benefits can be achieved through proper structuring without relocating your operations, depending on your business model.',
    },
    {
      question: 'How do double tax treaties work?',
      answer: 'Double tax treaties prevent the same income from being taxed in multiple countries. We help you leverage these treaties to minimize your overall tax burden.',
    },
    {
      question: 'What ongoing obligations come with tax optimization?',
      answer: 'Ongoing obligations include proper documentation, compliance reporting, and maintaining substance requirements. We provide full support for all obligations.',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Optimize Your Global Taxes with AI-Powered Strategies - Consulting19</title>
        <meta name="description" content="Strategic international tax planning designed to legally minimize your global tax burden. Powered by AI and supported by local experts in 19+ countries." />
      </Helmet>

      <Navbar />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-green-600 via-teal-600 to-blue-600 text-white py-10 mt-16 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-yellow-400/10 rounded-full blur-2xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-teal-400/10 rounded-full blur-xl animate-pulse delay-500"></div>
        </div>

        {/* Floating Icons */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-1/4 text-4xl animate-bounce delay-300">💹</div>
          <div className="absolute top-32 right-1/4 text-3xl animate-bounce delay-700">📊</div>
          <div className="absolute bottom-20 left-1/3 text-3xl animate-bounce delay-1000">🌍</div>
        </div>

        {/* Wave Pattern */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-r from-green-500/20 via-teal-500/20 to-blue-500/20">
          <svg className="w-full h-full" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M0,60 C300,120 900,0 1200,60 L1200,120 L0,120 Z" fill="currentColor" className="text-white/10 animate-pulse"></path>
          </svg>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center mb-4">
            <Link to="/services">
              <Button variant="outline" icon={ArrowLeft} iconPosition="left" className="border-white text-white bg-white/10 hover:bg-white/20 hover:border-white shadow-lg backdrop-blur-sm">
                Back to Services
              </Button>
            </Link>
          </div>
          
          <div className="max-w-5xl mx-auto text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg">
                <Calculator className="w-6 h-6 text-white" />
              </div>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
              Optimize Your Global Taxes with
              <br />
              <span className="bg-gradient-to-r from-yellow-300 via-orange-300 to-pink-300 bg-clip-text text-transparent">
                AI-Powered Strategies
              </span>
            </h1>
            
            <p className="text-lg text-green-100 mb-6 leading-relaxed max-w-4xl mx-auto">
              Strategic international tax planning designed to legally minimize your global tax burden. 
              Powered by AI and supported by local experts in 19+ countries.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
              <Link to="/auth?mode=register">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-bold px-10 py-4 text-lg shadow-2xl border-0 transform hover:scale-105 transition-all duration-300"
                >
                  Join to Start Tax Planning
                </Button>
              </Link>
              <Button 
                size="lg" 
                className="bg-white/20 backdrop-blur-sm text-white border-2 border-white/30 hover:bg-white/30 font-semibold px-10 py-4 text-lg transition-all duration-300"
              >
                Free Tax Consultation
              </Button>
            </div>

            {/* Trust Badge */}
            <div className="inline-flex items-center bg-white/20 backdrop-blur-sm rounded-full px-8 py-3 shadow-lg border border-white/30">
              <Globe className="w-5 h-5 text-green-300 mr-2" />
              <span className="text-white font-medium">19+ Countries</span>
              <span className="mx-3 text-white/60">•</span>
              <Shield className="w-5 h-5 text-blue-300 mr-2" />
              <span className="text-white font-medium">100% Legal</span>
              <span className="mx-3 text-white/60">•</span>
              <Bot className="w-5 h-5 text-purple-300 mr-2" />
              <span className="text-white font-medium">AI Assistant Included</span>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Service Highlights */}
        <section className="py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {serviceHighlights.map((highlight, index) => (
              <Card key={index} hover className="text-center border-2 border-gray-100 hover:border-green-200 transition-all duration-300 transform hover:scale-105 hover:shadow-xl group">
                <Card.Body className="py-8 relative overflow-hidden">
                  {/* Background gradient on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${highlight.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
                  
                  <div className={`w-16 h-16 bg-gradient-to-r ${highlight.color} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg transform group-hover:scale-110 transition-transform duration-300`}>
                    <highlight.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-green-700 transition-colors duration-300">{highlight.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{highlight.description}</p>
                </Card.Body>
              </Card>
            ))}
          </div>
        </section>

        {/* Why Tax Optimization with Consulting19? */}
        <section className="py-16 bg-gradient-to-br from-gray-50 via-green-50 to-teal-50 rounded-3xl mb-16 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-8 left-8 w-32 h-32 border border-green-300 rounded-full animate-pulse"></div>
            <div className="absolute bottom-8 right-8 w-24 h-24 border border-teal-300 rounded-lg rotate-45 animate-pulse delay-1000"></div>
          </div>

          <div className="relative max-w-6xl mx-auto px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Why Tax Optimization with <span className="text-green-600">Consulting19</span>?
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                The future of international tax consulting is here
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                {whyChooseUs.map((reason, index) => (
                  <div key={index} className="flex items-start space-x-4 group">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <reason.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-green-700 transition-colors duration-300">{reason.title}</h3>
                      <p className="text-gray-600 leading-relaxed">{reason.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* AI Dashboard Illustration */}
              <div className="relative">
                <div className="bg-gradient-to-br from-green-50 via-teal-50 to-blue-50 rounded-2xl p-8 shadow-2xl border border-green-100 relative overflow-hidden">
                  {/* Animated background elements */}
                  <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-r from-green-200/30 to-teal-200/30 rounded-full blur-xl animate-pulse"></div>
                  <div className="absolute bottom-4 left-4 w-16 h-16 bg-gradient-to-r from-teal-200/30 to-blue-200/30 rounded-full blur-lg animate-pulse delay-1000"></div>
                  
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">AI Tax Dashboard</h3>
                    <p className="text-green-700">Real-time tax optimization insights</p>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-white rounded-xl p-4 shadow-lg border border-green-100">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">Current Tax Rate</span>
                        <span className="text-2xl font-bold text-red-600">35%</span>
                      </div>
                      <div className="w-full bg-red-100 rounded-full h-2">
                        <div className="bg-red-500 h-2 rounded-full w-3/4"></div>
                      </div>
                    </div>
                    
                    <div className="bg-white rounded-xl p-4 shadow-lg border border-green-100">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">Optimized Rate</span>
                        <span className="text-2xl font-bold text-green-600">8%</span>
                      </div>
                      <div className="w-full bg-green-100 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full w-1/4 animate-pulse"></div>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-r from-green-500 to-teal-500 rounded-xl p-4 text-white text-center">
                      <div className="text-sm font-medium mb-1">Annual Savings</div>
                      <div className="text-3xl font-bold">$127,000</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Tax Optimization Strategies */}
        <section className="py-16 relative">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 25% 25%, #10b981 2px, transparent 2px),
                               radial-gradient(circle at 75% 75%, #06b6d4 2px, transparent 2px)`,
              backgroundSize: '50px 50px'
            }}></div>
          </div>

          <div className="relative">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Tax Optimization <span className="text-green-600">Strategies</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Interactive strategies designed for maximum tax efficiency
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {taxStrategies.map((strategy, index) => (
                <Card key={index} hover className="text-center group cursor-pointer transform hover:scale-105 transition-all duration-300 hover:shadow-2xl border-2 border-gray-100 hover:border-green-200">
                  <Card.Body className="py-8 relative overflow-hidden">
                    {/* Background gradient on hover */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${strategy.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                    
                    <div className={`w-16 h-16 bg-gradient-to-r ${strategy.color} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                      <strategy.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-green-700 transition-colors duration-300">{strategy.title}</h3>
                    <p className="text-gray-600 leading-relaxed mb-4">{strategy.description}</p>
                    
                    <div className="text-xs text-gray-500">
                      <strong>Examples:</strong> {strategy.examples.join(', ')}
                    </div>
                  </Card.Body>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Optimization Process Timeline */}
        <section className="py-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Optimization <span className="text-green-600">Process</span>
            </h2>
            <p className="text-xl text-gray-600">
              Step-by-step timeline with progress animation
            </p>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-green-500 via-teal-500 to-blue-500 rounded-full hidden lg:block"></div>
            
            <div className="space-y-12">
              {processSteps.map((step, index) => (
                <div 
                  key={index} 
                  data-step={index}
                  className={`flex items-center ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} flex-col lg:space-x-8 transition-all duration-700 ${
                    visibleSteps.includes(index) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                  }`}
                >
                  <div className={`flex-1 ${index % 2 === 0 ? 'lg:text-right' : 'lg:text-left'} text-center lg:mb-0 mb-6`}>
                    <Card className="inline-block group hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                      <Card.Body className="py-6 px-8 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-teal-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="relative">
                          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-green-700 transition-colors duration-300">{step.title}</h3>
                          <p className="text-gray-600 mb-3">{step.detail}</p>
                          <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                            <Clock className="w-4 h-4" />
                            <span className="font-medium">{step.duration}</span>
                          </div>
                        </div>
                      </Card.Body>
                    </Card>
                  </div>
                  
                  <div className={`relative z-10 w-16 h-16 bg-gradient-to-r from-green-600 via-teal-600 to-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-xl transform transition-all duration-500 ${
                    visibleSteps.includes(index) ? 'scale-100 rotate-0' : 'scale-75 rotate-45'
                  }`}>
                    {step.step}
                    {/* Pulse animation for active step */}
                    <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-teal-400 rounded-full animate-ping opacity-20"></div>
                  </div>
                  
                  <div className="flex-1 hidden lg:block"></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 relative">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: `linear-gradient(45deg, #10b981 25%, transparent 25%),
                               linear-gradient(-45deg, #10b981 25%, transparent 25%),
                               linear-gradient(45deg, transparent 75%, #06b6d4 75%),
                               linear-gradient(-45deg, transparent 75%, #06b6d4 75%)`,
              backgroundSize: '20px 20px',
              backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
            }}></div>
          </div>

          <div className="relative">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Frequently Asked <span className="text-green-600">Questions</span>
              </h2>
              <p className="text-xl text-gray-600">
                Get answers to common tax optimization questions
              </p>
            </div>

            <div className="max-w-4xl mx-auto space-y-4">
              {faqs.map((faq, index) => (
                <Card key={index} className="hover:shadow-xl transition-all duration-300 border-2 border-gray-100 hover:border-green-200">
                  <Card.Body>
                    <button
                      onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                      className="w-full text-left"
                    >
                      <div className="flex items-center justify-between py-2">
                        <h3 className="text-lg font-semibold text-gray-900 pr-4 hover:text-green-700 transition-colors duration-300">{faq.question}</h3>
                        <div className={`w-8 h-8 bg-green-100 rounded-full flex items-center justify-center transition-all duration-300 ${
                          expandedFaq === index ? 'bg-green-600 rotate-180' : 'hover:bg-green-200'
                        }`}>
                          <ChevronDown className={`w-5 h-5 transition-all duration-300 ${
                            expandedFaq === index ? 'text-white' : 'text-green-600'
                          }`} />
                        </div>
                      </div>
                    </button>
                    
                    <div className={`overflow-hidden transition-all duration-500 ease-in-out ${
                      expandedFaq === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                    }`}>
                      <div className="pt-4 border-t border-gray-200 mt-4">
                        <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-16">
          <div className="bg-gradient-to-r from-green-600 via-teal-600 to-blue-600 rounded-3xl text-white p-12 text-center relative overflow-hidden">
            {/* Animated Wave Pattern */}
            <div className="absolute inset-0 opacity-20">
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1000 1000" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
                    <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.1" />
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
            
            <div className="relative">
              <h2 className="text-4xl font-bold mb-4">Ready to Optimize Your Taxes?</h2>
              <p className="text-xl text-green-100 mb-8 max-w-3xl mx-auto leading-relaxed">
                Start saving on your global tax burden with tailored strategies from our experts – 
                powered by AI and supported by local advisors.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Link to="/auth?mode=register">
                  <Button 
                    size="lg" 
                    className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-bold px-10 py-4 text-lg shadow-2xl border-0 transform hover:scale-105 transition-all duration-300"
                  >
                    Join to Start Tax Planning
                  </Button>
                </Link>
                <Link to="/auth?mode=register">
                  <Button 
                    size="lg" 
                    className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-bold px-10 py-4 text-lg shadow-2xl border-0 transform hover:scale-105 transition-all duration-300"
                  >
                    Join to Start Tax Planning
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>

      <Footer />

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

export default TaxOptimizationPage;

