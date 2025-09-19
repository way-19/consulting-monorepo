import React, { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle, Clock, DollarSign, FileText, Users, Shield, CreditCard, Globe, MessageSquare, Calendar, Building, Bot, Zap, Target, BarChart3, ChevronDown, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useLanguage } from '../../lib/language';
import { Button, Card } from '../../lib/ui';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const BankingSolutionsPage = () => {
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
      title: 'Open Accounts in 19+ Countries',
      description: 'Access to leading banks worldwide with local expertise',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: CreditCard,
      title: 'Corporate & Private Banking Options',
      description: 'Full range of banking solutions for every business need',
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: Bot,
      title: 'AI Multilingual Assistance',
      description: 'Communicate with banks in any language with AI support',
      color: 'from-orange-500 to-red-500',
    },
    {
      icon: Shield,
      title: 'Secure, Compliant, and Reliable',
      description: 'Full compliance with international banking regulations',
      color: 'from-green-500 to-emerald-500',
    },
  ];

  const whyChooseUs = [
    {
      icon: Building,
      title: 'Direct Bank Partnerships',
      description: 'We work directly with leading banks worldwide for faster approvals.',
    },
    {
      icon: Globe,
      title: 'Remote Setup',
      description: 'Many accounts can be opened without physical presence.',
    },
    {
      icon: Bot,
      title: 'AI-Powered Communication',
      description: 'Discuss requirements in your own language – our AI assistant ensures seamless communication.',
    },
    {
      icon: CheckCircle,
      title: 'End-to-End Support',
      description: 'From account opening to compliance monitoring, we handle every step.',
    },
  ];

  const bankingOptions = [
    {
      title: 'Traditional Banking',
      description: 'Full-service banks with branches and compliance',
      icon: Building,
      color: 'from-blue-500 to-cyan-500',
      features: ['Physical branches', 'Relationship managers', 'Full service range', 'Regulatory compliance'],
    },
    {
      title: 'Digital Banking',
      description: 'Online-first banking with mobile focus',
      icon: CreditCard,
      color: 'from-purple-500 to-pink-500',
      features: ['Mobile-first', 'Low fees', 'API integration', 'Fast setup'],
    },
    {
      title: 'Private Banking',
      description: 'High-net-worth services with wealth management',
      icon: Shield,
      color: 'from-green-500 to-teal-500',
      features: ['Wealth management', 'Exclusive benefits', 'Dedicated managers', 'Investment services'],
    },
    {
      title: 'Offshore Banking',
      description: 'Privacy and international tax advantages',
      icon: Globe,
      color: 'from-orange-500 to-yellow-500',
      features: ['Privacy protection', 'Tax efficiency', 'Multi-currency', 'International access'],
      jurisdictions: ['Switzerland', 'Ireland', 'Gibraltar', 'Luxembourg'],
    },
  ];

  const processSteps = [
    {
      step: 1,
      title: 'Banking Needs Assessment',
      description: 'Analyze business model',
      duration: '1 day',
      detail: 'Comprehensive analysis of your banking requirements and business model',
    },
    {
      step: 2,
      title: 'Bank Selection & Strategy',
      description: 'Recommend optimal banks',
      duration: '1–2 days',
      detail: 'Recommend optimal banks based on your needs and jurisdiction',
    },
    {
      step: 3,
      title: 'Documentation Preparation',
      description: 'Prepare required docs',
      duration: '2–3 days',
      detail: 'Prepare all required documents for account opening',
    },
    {
      step: 4,
      title: 'Bank Application Process',
      description: 'Submit & coordinate',
      duration: '1–2 days',
      detail: 'Submit applications and coordinate with bank officials',
    },
    {
      step: 5,
      title: 'Account Activation',
      description: 'Activate services',
      duration: '3–10 days',
      detail: 'Complete account opening and activate banking services',
    },
    {
      step: 6,
      title: 'Banking Setup Completion',
      description: 'Configure online banking & payments',
      duration: '1–2 days',
      detail: 'Configure online banking and payment systems',
    },
  ];

  const serviceFeatures = [
    'Corporate account opening assistance',
    'Multi-currency account setup',
    'International wire transfers',
    'Payment gateway integration',
    'Banking relationship management',
    'Trade finance facilitation',
    'Online banking platform setup',
    'Ongoing banking support',
  ];

  const faqs = [
    {
      question: 'Which countries offer the best banking for international businesses?',
      answer: 'Singapore, UAE, Switzerland, and Estonia are among the top choices for international banking, each offering unique advantages like stability, digital services, or tax benefits.',
    },
    {
      question: 'Can I open a bank account remotely?',
      answer: 'Some banks offer remote account opening, especially digital banks in Estonia and Lithuania. However, many traditional banks still require physical presence or video calls.',
    },
    {
      question: 'What documents are typically required for corporate banking?',
      answer: 'Standard requirements include company registration certificate, articles of incorporation, director passports, proof of address, business plan, and source of funds documentation.',
    },
    {
      question: 'How long does corporate account opening take?',
      answer: 'The process typically takes 1-4 weeks depending on the bank, jurisdiction, and complexity of your business. Digital banks are generally faster than traditional banks.',
    },
    {
      question: 'What are typical banking fees for international accounts?',
      answer: 'Fees vary significantly by bank and jurisdiction. We help you compare options and negotiate favorable terms based on your expected transaction volume and account balance.',
    },
    {
      question: 'Do I need a local address to open a corporate account?',
      answer: 'Most banks require a registered address in their jurisdiction, but this can often be a virtual office or registered agent address rather than a physical office.',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Global Banking Access Made Simple - AI-Powered Banking Solutions - Consulting19</title>
        <meta name="description" content="Open international bank accounts with AI-powered assistance. Access premium financial services and manage relationships with top global banks." />
      </Helmet>

      <Navbar />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white py-10 mt-16 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-cyan-400/10 rounded-full blur-2xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-pink-400/10 rounded-full blur-xl animate-pulse delay-500"></div>
        </div>

        {/* Floating Financial Icons */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-1/4 text-4xl animate-bounce delay-300">💳</div>
          <div className="absolute top-32 right-1/4 text-3xl animate-bounce delay-700">💱</div>
          <div className="absolute bottom-20 left-1/3 text-3xl animate-bounce delay-1000">🌍</div>
        </div>

        {/* Wave Pattern */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20">
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
                <CreditCard className="w-6 h-6 text-white" />
              </div>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
              Global Banking Access
              <br />
              <span className="bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-300 bg-clip-text text-transparent">
                Made Simple
              </span>
            </h1>
            
            <p className="text-lg text-blue-100 mb-6 leading-relaxed max-w-4xl mx-auto">
              Open international bank accounts, access premium financial services, and manage 
              relationships with top global banks – powered by AI and local expertise.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
              <Link to="/auth?mode=register">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-bold px-10 py-4 text-lg shadow-2xl border-0 transform hover:scale-105 transition-all duration-300"
                >
                  Join to Start Banking Setup
                </Button>
              </Link>
              <Button 
                size="lg" 
                className="bg-white/20 backdrop-blur-sm text-white border-2 border-white/30 hover:bg-white/30 font-semibold px-10 py-4 text-lg transition-all duration-300"
              >
                Free Banking Consultation
              </Button>
            </div>

            {/* Trust Badge */}
            <div className="inline-flex items-center bg-white/20 backdrop-blur-sm rounded-full px-8 py-3 shadow-lg border border-white/30">
              <Building className="w-5 h-5 text-cyan-300 mr-2" />
              <span className="text-white font-medium">Global Banks</span>
              <span className="mx-3 text-white/60">•</span>
              <Bot className="w-5 h-5 text-purple-300 mr-2" />
              <span className="text-white font-medium">AI-Powered Communication</span>
              <span className="mx-3 text-white/60">•</span>
              <Globe className="w-5 h-5 text-pink-300 mr-2" />
              <span className="text-white font-medium">Remote Setup Available</span>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Service Highlights */}
        <section className="py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {serviceHighlights.map((highlight, index) => (
              <Card key={index} hover className="text-center border-2 border-gray-100 hover:border-blue-200 transition-all duration-300 transform hover:scale-105 hover:shadow-xl group">
                <Card.Body className="py-8 relative overflow-hidden">
                  {/* Background gradient on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${highlight.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
                  
                  <div className={`w-16 h-16 bg-gradient-to-r ${highlight.color} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg transform group-hover:scale-110 transition-transform duration-300`}>
                    <highlight.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-700 transition-colors duration-300">{highlight.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{highlight.description}</p>
                </Card.Body>
              </Card>
            ))}
          </div>
        </section>

        {/* Why Consulting19 for Banking? */}
        <section className="py-16 bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 rounded-3xl mb-16 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-8 left-8 w-32 h-32 border border-blue-300 rounded-full animate-pulse"></div>
            <div className="absolute bottom-8 right-8 w-24 h-24 border border-purple-300 rounded-lg rotate-45 animate-pulse delay-1000"></div>
          </div>

          <div className="relative max-w-6xl mx-auto px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Why <span className="text-blue-600">Consulting19</span> for Banking?
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                The future of international banking consulting is here
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                {whyChooseUs.map((reason, index) => (
                  <div key={index} className="flex items-start space-x-4 group">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <reason.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-700 transition-colors duration-300">{reason.title}</h3>
                      <p className="text-gray-600 leading-relaxed">{reason.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* AI Communication Illustration */}
              <div className="relative">
                <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-2xl p-8 shadow-2xl border border-blue-100 relative overflow-hidden">
                  {/* Animated background elements */}
                  <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-r from-blue-200/30 to-purple-200/30 rounded-full blur-xl animate-pulse"></div>
                  <div className="absolute bottom-4 left-4 w-16 h-16 bg-gradient-to-r from-purple-200/30 to-pink-200/30 rounded-full blur-lg animate-pulse delay-1000"></div>
                  
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">AI Banking Assistant</h3>
                    <p className="text-blue-700">Multilingual banking communication</p>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-white rounded-xl p-4 shadow-lg border border-blue-100">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">🇺🇸 Client</span>
                        <span className="text-xs text-blue-600">English</span>
                      </div>
                      <p className="text-sm text-gray-800">"I need a multi-currency business account"</p>
                    </div>
                    
                    <div className="flex justify-center">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                        <Bot className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    
                    <div className="bg-white rounded-xl p-4 shadow-lg border border-purple-100">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">🇹🇷 Expert</span>
                        <span className="text-xs text-purple-600">Turkish</span>
                      </div>
                      <p className="text-sm text-gray-800">"Çok para birimli hesap açabiliriz"</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Banking Options */}
        <section className="py-16 relative">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 25% 25%, #3b82f6 2px, transparent 2px),
                               radial-gradient(circle at 75% 75%, #8b5cf6 2px, transparent 2px)`,
              backgroundSize: '50px 50px'
            }}></div>
          </div>

          <div className="relative">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Banking <span className="text-blue-600">Options</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Choose the perfect banking solution for your business needs
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {bankingOptions.map((option, index) => (
                <Card key={index} hover className="text-center group cursor-pointer transform hover:scale-105 transition-all duration-300 hover:shadow-2xl border-2 border-gray-100 hover:border-blue-200">
                  <Card.Body className="py-8 relative overflow-hidden">
                    {/* Background gradient on hover */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${option.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                    
                    <div className={`w-16 h-16 bg-gradient-to-r ${option.color} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                      <option.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-700 transition-colors duration-300">{option.title}</h3>
                    <p className="text-gray-600 leading-relaxed mb-4">{option.description}</p>
                    
                    <div className="space-y-1">
                      {option.features.map((feature, i) => (
                        <div key={i} className="text-xs text-gray-700 flex items-center">
                          <CheckCircle className="w-3 h-3 text-green-500 mr-2 flex-shrink-0" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </Card.Body>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Banking Setup Process Timeline */}
        <section className="py-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Banking Setup <span className="text-blue-600">Process</span>
            </h2>
            <p className="text-xl text-gray-600">
              Step-by-step timeline with progress animation
            </p>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500 rounded-full hidden lg:block"></div>
            
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
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="relative">
                          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-700 transition-colors duration-300">{step.title}</h3>
                          <p className="text-gray-600 mb-3">{step.detail}</p>
                          <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                            <Clock className="w-4 h-4" />
                            <span className="font-medium">{step.duration}</span>
                          </div>
                        </div>
                      </Card.Body>
                    </Card>
                  </div>
                  
                  <div className={`relative z-10 w-16 h-16 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-xl transform transition-all duration-500 ${
                    visibleSteps.includes(index) ? 'scale-100 rotate-0' : 'scale-75 rotate-45'
                  }`}>
                    {step.step}
                    {/* Pulse animation for active step */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-ping opacity-20"></div>
                  </div>
                  
                  <div className="flex-1 hidden lg:block"></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* What's Included */}
        <section className="py-16 relative">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: `linear-gradient(45deg, #3b82f6 25%, transparent 25%),
                               linear-gradient(-45deg, #3b82f6 25%, transparent 25%),
                               linear-gradient(45deg, transparent 75%, #8b5cf6 75%),
                               linear-gradient(-45deg, transparent 75%, #8b5cf6 75%)`,
              backgroundSize: '20px 20px',
              backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
            }}></div>
          </div>

          <div className="relative">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                What's <span className="text-blue-600">Included</span>
              </h2>
              <p className="text-xl text-gray-600">
                Complete banking setup with ongoing support
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {serviceFeatures.map((feature, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-all duration-300 transform hover:scale-105 group border-2 border-gray-100 hover:border-blue-200">
                  <Card.Body className="py-6 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                        <CheckCircle className="w-6 h-6 text-white" />
                      </div>
                      <p className="text-gray-700 text-sm font-medium leading-relaxed group-hover:text-blue-700 transition-colors duration-300">{feature}</p>
                    </div>
                  </Card.Body>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 relative">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 20% 20%, #3b82f6 2px, transparent 2px),
                               radial-gradient(circle at 80% 80%, #8b5cf6 2px, transparent 2px)`,
              backgroundSize: '40px 40px'
            }}></div>
          </div>

          <div className="relative">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Frequently Asked <span className="text-blue-600">Questions</span>
              </h2>
              <p className="text-xl text-gray-600">
                Get answers to common banking questions
              </p>
            </div>

            <div className="max-w-4xl mx-auto space-y-4">
              {faqs.map((faq, index) => (
                <Card key={index} className="hover:shadow-xl transition-all duration-300 border-2 border-gray-100 hover:border-blue-200">
                  <Card.Body>
                    <button
                      onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                      className="w-full text-left"
                    >
                      <div className="flex items-center justify-between py-2">
                        <h3 className="text-lg font-semibold text-gray-900 pr-4 hover:text-blue-700 transition-colors duration-300">{faq.question}</h3>
                        <div className={`w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center transition-all duration-300 ${
                          expandedFaq === index ? 'bg-blue-600 rotate-180' : 'hover:bg-blue-200'
                        }`}>
                          <ChevronDown className={`w-5 h-5 transition-all duration-300 ${
                            expandedFaq === index ? 'text-white' : 'text-blue-600'
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
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl text-white p-12 text-center relative overflow-hidden">
            {/* Animated Wave Pattern */}
            <div className="absolute inset-0 opacity-20">
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1000 1000" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
                    <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#ec4899" stopOpacity="0.1" />
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
              <h2 className="text-4xl font-bold mb-4">Ready to Open Your International Bank Account?</h2>
              <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto leading-relaxed">
                Get professional assistance with international banking setup and establish strong 
                financial foundations for your global business.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Link to="/auth?mode=register">
                  <Button 
                    size="lg" 
                    className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-bold px-10 py-4 text-lg shadow-2xl border-0 transform hover:scale-105 transition-all duration-300"
                  >
                    Join to Start Banking Setup
                  </Button>
                </Link>
                <Link to="/auth?mode=register">
                  <Button 
                    size="lg" 
                    className="bg-white text-blue-600 hover:bg-gray-100 font-bold px-10 py-4 text-lg shadow-2xl transform hover:scale-105 transition-all duration-300"
                  >
                    Join to Start Banking Setup
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

export default BankingSolutionsPage;