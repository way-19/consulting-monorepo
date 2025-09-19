import React, { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle, Clock, DollarSign, FileText, Users, Shield, Building2, Globe, MessageSquare, Calendar, Target, Zap, Bot, ArrowRight, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useLanguage } from '../../lib/language';
import { Button, Card } from '../../lib/ui';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const CompanyFormationPage = () => {
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
      title: '19+ Countries with Local Partners',
      description: 'Licensed experts in every jurisdiction we serve',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Bot,
      title: 'AI Assistant & Multilingual Messaging',
      description: 'Real-time translation and 24/7 AI support',
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: Zap,
      title: 'Fastest Incorporation Process',
      description: 'Average setup completed in 1-3 days',
      color: 'from-orange-500 to-red-500',
    },
    {
      icon: Shield,
      title: 'Compliance & Ongoing Support',
      description: 'Always up-to-date legal frameworks',
      color: 'from-green-500 to-emerald-500',
    },
  ];

  const whyConsulting19 = [
    {
      icon: Users,
      title: 'Local Expertise',
      description: 'We collaborate directly with licensed providers in every jurisdiction.',
    },
    {
      icon: Bot,
      title: 'AI Advantage',
      description: 'Communicate in any language – our AI assistant translates in real time.',
    },
    {
      icon: Zap,
      title: 'Faster Results',
      description: 'Average setup completed in 1–3 days in most countries.',
    },
    {
      icon: CheckCircle,
      title: 'Verified Accuracy',
      description: 'Always up-to-date compliance and legal frameworks. No outdated guides or guesswork.',
    },
  ];

  const popularJurisdictions = [
    {
      country: 'Georgia',
      flag: '🇬🇪',
      type: 'LLC',
      taxRate: '1%',
      timeframe: '1-2 days',
      minCapital: 'No minimum',
    },
    {
      country: 'Estonia',
      flag: '🇪🇪',
      type: 'OÜ',
      taxRate: '20%',
      timeframe: '1-3 days',
      minCapital: '€2,500',
    },
    {
      country: 'UAE',
      flag: '🇦🇪',
      type: 'LLC',
      taxRate: '0%',
      timeframe: '3-5 days',
      minCapital: 'Varies',
    },
    {
      country: 'Ireland',
      flag: '🇮🇪',
      type: 'Ltd',
      taxRate: '12.5%',
      timeframe: '2-3 days',
      minCapital: '€1',
    },
    {
      country: 'Gibraltar',
      flag: '🇬🇮',
      type: 'Ltd',
      taxRate: '10%',
      timeframe: '3-5 days',
      minCapital: '£100',
    },
    {
      country: 'Lithuania',
      flag: '🇱🇹',
      type: 'UAB',
      taxRate: '15%',
      timeframe: '1-2 days',
      minCapital: '€2,500',
    },
    {
      country: 'Malta',
      flag: '🇲🇹',
      type: 'Ltd',
      taxRate: '5%',
      timeframe: '2-4 days',
      minCapital: '€1,164',
    },
    {
      country: 'Netherlands',
      flag: '🇳🇱',
      type: 'BV',
      taxRate: '25.8%',
      timeframe: '1-2 days',
      minCapital: '€0.01',
    },
  ];

  const servicePackage = [
    { icon: Building2, title: 'Business Registration & Incorporation' },
    { icon: FileText, title: 'Government Filing' },
    { icon: Target, title: 'Corporate Structure Optimization' },
    { icon: Users, title: 'Registered Agent Services' },
    { icon: Shield, title: 'Business License Guidance' },
    { icon: CheckCircle, title: 'Ongoing Compliance Support' },
    { icon: Clock, title: 'Annual Reporting Assistance' },
    { icon: Globe, title: 'Legal Entity Maintenance' },
  ];

  const processSteps = [
    {
      step: 1,
      title: 'Business Structure Consultation',
      description: 'Analyze goals, recommend entity type',
      duration: '1-2 days',
    },
    {
      step: 2,
      title: 'Jurisdiction Selection',
      description: 'Choose best jurisdiction',
      duration: '1 day',
    },
    {
      step: 3,
      title: 'Document Preparation',
      description: 'Draft & review documents',
      duration: '2-3 days',
    },
    {
      step: 4,
      title: 'Government Filing',
      description: 'Submit applications',
      duration: '1-5 days',
    },
    {
      step: 5,
      title: 'Corporate Setup',
      description: 'Complete bylaws, resolutions, bank setup',
      duration: '1-2 days',
    },
    {
      step: 6,
      title: 'Final Documentation',
      description: 'Deliver certificates & official docs',
      duration: '1 day',
    },
  ];

  const faqs = [
    {
      question: 'What type of business entity should I choose?',
      answer: 'The choice depends on your business goals, tax objectives, and operational needs. LLCs offer flexibility and tax benefits, while corporations provide structure for growth and investment.',
    },
    {
      question: 'How long does company formation take?',
      answer: 'Formation time varies by jurisdiction, typically ranging from 1 day (Georgia) to 2-3 weeks (complex structures). We provide accurate timelines for each jurisdiction.',
    },
    {
      question: 'What documents do I need to provide?',
      answer: 'Generally, you need passport copies, proof of address, business plan, and proposed company details. Specific requirements vary by jurisdiction.',
    },
    {
      question: 'Can I form a company without visiting the country?',
      answer: 'Yes, most jurisdictions allow remote company formation. We handle the entire process remotely with proper documentation and legal representation.',
    },
    {
      question: 'What ongoing obligations will my company have?',
      answer: 'Obligations include annual filings, tax returns, maintaining registered address, and compliance with local regulations. We provide ongoing support for all requirements.',
    },
    {
      question: 'How much does company formation cost?',
      answer: 'Costs vary by jurisdiction and entity type, typically ranging from $500-5000. This includes government fees, legal fees, and our professional services.',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Incorporate Your Company with AI-Powered Precision - Consulting19</title>
        <meta name="description" content="The only global consulting platform combining licensed local partners in 19+ countries with AI-powered multilingual communication and instant support." />
      </Helmet>

      <Navbar />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 text-white py-12 mt-16 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-yellow-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-128 h-128 bg-teal-400/5 rounded-full blur-3xl"></div>
        </div>

        {/* Floating Icons */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-1/4 text-4xl animate-float">🏢</div>
          <div className="absolute top-32 right-1/4 text-3xl animate-float-delayed">🌍</div>
          <div className="absolute bottom-20 left-1/3 text-3xl animate-bounce delay-1000">📑</div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center mb-6">
            <Link to="/services">
              <Button variant="outline" icon={ArrowLeft} iconPosition="left" className="border-white text-white bg-white/10 hover:bg-white/20 hover:border-white shadow-lg backdrop-blur-sm">
                Back to Services
              </Button>
            </Link>
          </div>
          
          <div className="max-w-5xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight animate-fade-in">
              Incorporate Your Company with
              <br />
              <span className="bg-gradient-to-r from-yellow-300 via-orange-300 to-pink-300 bg-clip-text text-transparent animate-gradient">
                AI-Powered Precision
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-blue-100 mb-6 leading-relaxed max-w-4xl mx-auto animate-fade-in-up delay-200">
              The only global consulting platform combining licensed local partners in 19+ countries 
              with AI-powered multilingual communication and instant support.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6 animate-fade-in-up delay-300">
              <Link to="/auth?mode=register">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-bold px-10 py-5 text-lg shadow-2xl border-0 transform hover:scale-105 transition-all duration-300"
                >
                  Start Formation Now
                </Button>
              </Link>
              <Button 
                size="lg" 
                className="bg-white/20 backdrop-blur-sm text-white border-2 border-white/30 hover:bg-white/30 font-semibold px-10 py-5 text-lg transition-all duration-300"
              >
                Free Consultation with AI Assistant
              </Button>
            </div>

            {/* Trust Badge */}
            <div className="inline-flex items-center bg-white/20 backdrop-blur-sm rounded-full px-8 py-3 shadow-lg border border-white/30 animate-fade-in-up delay-400">
              <CheckCircle className="w-5 h-5 text-green-300 mr-2" />
              <span className="text-white font-medium">98% Success Rate</span>
              <span className="mx-3 text-white/60">•</span>
              <Users className="w-5 h-5 text-blue-300 mr-2" />
              <span className="text-white font-medium">Local Experts</span>
              <span className="mx-3 text-white/60">•</span>
              <Bot className="w-5 h-5 text-purple-300 mr-2" />
              <span className="text-white font-medium">AI-Powered</span>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Service Highlights */}
        <section className="py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {serviceHighlights.map((highlight, index) => (
              <Card key={index} hover className="text-center border-2 border-gray-100 hover:border-blue-200 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl group relative overflow-hidden">
                <Card.Body className="py-10 relative z-10">
                  {/* Animated background gradient on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${highlight.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
                  
                  {/* Glowing outline effect */}
                  <div className={`absolute inset-0 bg-gradient-to-r ${highlight.color} opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500`}></div>
                  
                  <div className={`w-20 h-20 bg-gradient-to-r ${highlight.color} rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 relative`}>
                    <highlight.icon className="w-10 h-10 text-white relative z-10 drop-shadow-lg" />
                    <div className={`absolute inset-0 bg-gradient-to-r ${highlight.color} rounded-3xl blur-lg opacity-60 group-hover:opacity-100 transition-opacity duration-500`}></div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-blue-700 transition-colors duration-300">{highlight.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{highlight.description}</p>
                </Card.Body>
              </Card>
            ))}
          </div>
        </section>

        {/* Why Consulting19? */}
        <section className="py-20 bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 rounded-3xl mb-16 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-8 left-8 w-32 h-32 border-2 border-blue-300 rounded-full animate-pulse"></div>
            <div className="absolute bottom-8 right-8 w-24 h-24 border-2 border-purple-300 rounded-lg rotate-45 animate-pulse delay-1000"></div>
            <div className="absolute top-1/2 left-1/4 w-16 h-16 border border-indigo-300 rounded-full animate-bounce delay-500"></div>
          </div>

          <div className="relative max-w-6xl mx-auto px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Why Choose <span className="text-blue-600">Consulting19</span>?
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                The future of international business consulting is here
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-10">
                {whyConsulting19.map((reason, index) => (
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

              {/* AI Communication Visual */}
              <div className="relative">
                <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50 rounded-3xl p-10 shadow-2xl border-2 border-blue-100 relative overflow-hidden">
                  {/* Animated background elements */}
                  <div className="absolute top-6 right-6 w-24 h-24 bg-gradient-to-r from-blue-200/30 to-purple-200/30 rounded-full blur-xl animate-pulse"></div>
                  <div className="absolute bottom-6 left-6 w-20 h-20 bg-gradient-to-r from-purple-200/30 to-indigo-200/30 rounded-full blur-lg animate-pulse delay-1000"></div>
                  
                  <div className="text-center mb-8 relative z-10">
                    <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl">
                      <Bot className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">AI-Powered Multilingual Communication</h3>
                    <p className="text-blue-700">Seamless communication in 20+ languages</p>
                  </div>
                  
                  <div className="relative flex items-center justify-center space-x-8 relative z-10">
                    <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                      <div className="text-sm text-blue-800 mb-2">🇺🇸 Client (English)</div>
                      <div className="bg-white rounded-lg p-3 shadow-sm">
                        <p className="text-sm">"I need help with company formation"</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-center">
                      <div className="relative w-16 h-16 bg-gradient-to-r from-purple-500 via-blue-500 to-pink-500 rounded-full flex items-center justify-center mb-2 shadow-lg">
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-400 via-blue-400 to-pink-400 rounded-full blur-md opacity-60 animate-pulse"></div>
                        <Bot className="w-6 h-6 text-white relative z-10" />
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full flex items-center justify-center animate-bounce">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                      </div>
                      <span className="text-xs text-purple-600 font-medium">AI Translation</span>
                    </div>
                    
                    <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                      <div className="text-sm text-green-800 mb-2">🇹🇷 Expert (Turkish)</div>
                      <div className="bg-white rounded-lg p-3 shadow-sm">
                        <p className="text-sm">"Şirket kuruluşunda yardım edebilirim"</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Popular Jurisdictions - Modern Card Style (No Links) */}
        <section className="py-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Popular <span className="text-blue-600">Jurisdictions</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose from our most requested business-friendly locations
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularJurisdictions.map((jurisdiction, index) => (
              <Card key={index} className="text-center relative overflow-hidden group border border-gray-200 hover:border-blue-300 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl bg-white/80 backdrop-blur-sm">
                <Card.Body className="py-6 px-4 relative z-10">
                  {/* Background gradient on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-purple-50/50 to-indigo-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <div className="relative">
                    <div className="text-4xl mb-4 transform group-hover:scale-110 transition-transform duration-300">{jurisdiction.flag}</div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{jurisdiction.country}</h3>
                    <div className="inline-block bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded-full mb-4 shadow-sm">
                      {jurisdiction.type}
                    </div>
                  
                    <div className="space-y-3 text-sm">
                      <div className="bg-white/90 rounded-lg p-3 border border-gray-100 shadow-sm backdrop-blur-sm">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600 font-medium text-xs">Tax Rate:</span>
                          <span className="font-bold text-green-600 text-lg">{jurisdiction.taxRate}</span>
                        </div>
                      </div>
                      <div className="bg-white/90 rounded-lg p-2 border border-gray-100 shadow-sm backdrop-blur-sm">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600 font-medium text-xs">Timeframe:</span>
                          <span className="font-semibold text-blue-600 text-sm">{jurisdiction.timeframe}</span>
                        </div>
                      </div>
                      <div className="bg-white/90 rounded-lg p-2 border border-gray-100 shadow-sm backdrop-blur-sm">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600 font-medium text-xs">Min Capital:</span>
                          <span className="font-semibold text-purple-600 text-sm">{jurisdiction.minCapital}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            ))}
          </div>
        </section>

        {/* What's Included */}
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
                Complete service package for hassle-free incorporation
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {servicePackage.map((service, index) => (
                <Card key={index} className="text-center hover:shadow-2xl transition-all duration-500 transform hover:scale-110 group border-2 border-gray-100 hover:border-blue-200 relative overflow-hidden">
                  <Card.Body className="py-8 relative z-10">
                    {/* Glowing gradient outline on hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500"></div>
                    
                    <div className="relative">
                      <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl transform group-hover:scale-125 group-hover:rotate-12 transition-all duration-500">
                        <service.icon className="w-8 h-8 text-white" />
                      </div>
                      <p className="text-gray-700 font-semibold leading-relaxed group-hover:text-blue-700 transition-colors duration-300">{service.title}</p>
                    </div>
                  </Card.Body>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Formation Process (Timeline) */}
        <section className="py-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Formation <span className="text-blue-600">Process</span>
            </h2>
            <p className="text-xl text-gray-600">
              Step-by-step timeline with progress animation
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
                          <p className="text-gray-600 mb-4 text-lg">{step.description}</p>
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
                    {/* Pulse animation for active step */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-ping opacity-30"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-indigo-400 rounded-full animate-pulse opacity-20"></div>
                  </div>
                  
                  <div className="flex-1 hidden lg:block"></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section (Accordion with Smooth Expand) */}
        <section className="py-20 relative">
          {/* Moving blue-purple grid background */}
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
                Get answers to common company formation questions
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
            {/* Animated glowing company icons */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-8 left-8 text-4xl animate-pulse">🏢</div>
              <div className="absolute top-12 right-12 text-3xl animate-pulse delay-1000">📋</div>
              <div className="absolute bottom-8 left-12 text-3xl animate-bounce delay-500">🌍</div>
              <div className="absolute bottom-12 right-8 text-2xl animate-pulse delay-1500">⚖️</div>
            </div>

            {/* Animated Wave Pattern */}
            <div className="absolute inset-0 opacity-20">
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1000 1000" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="formationWaveGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
                    <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.1" />
                  </linearGradient>
                </defs>
                <path d="M0,300 Q250,200 500,300 T1000,300 L1000,1000 L0,1000 Z" fill="url(#formationWaveGradient)" className="animate-pulse">
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
                Ready to Form Your <span className="text-yellow-300">Company</span>?
              </h2>
              <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
                Get expert guidance and establish your business with optimal structure and compliance – 
                powered by AI and local expertise.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Link to="/auth?mode=register">
                  <Button 
                    className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-bold px-10 py-4 text-lg shadow-2xl border-0 transform hover:scale-105 transition-all duration-300"
                  >
                    Start Formation Now
                  </Button>
                </Link>
                <Link to="/order-form">
                  <Button 
                    className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-bold px-10 py-4 text-lg shadow-2xl border-0 transform hover:scale-105 transition-all duration-300"
                  >
                    Start Formation Now
                  </Button>
                </Link>
              </div>
              
              <div className="mt-8 flex items-center justify-center space-x-8 text-blue-100">
                <div className="flex items-center space-x-2">
                  <Building2 className="w-6 h-6" />
                  <span>Expert Formation</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Globe className="w-6 h-6" />
                  <span>Global Reach</span>
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

        @keyframes moveGrid {
          0% { transform: translate(0, 0); }
          100% { transform: translate(30px, 30px); }
        }

        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes fade-in-up {
          from { 
            opacity: 0; 
            transform: translateY(20px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
        
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 1s ease-out;
        }
        
        .delay-200 {
          animation-delay: 0.2s;
          animation-fill-mode: both;
        }
        
        .delay-300 {
          animation-delay: 0.3s;
          animation-fill-mode: both;
        }

        .delay-400 {
          animation-delay: 0.4s;
          animation-fill-mode: both;
        }

        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient-shift 3s ease infinite;
        }

        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </div>
  );
};

export default CompanyFormationPage;