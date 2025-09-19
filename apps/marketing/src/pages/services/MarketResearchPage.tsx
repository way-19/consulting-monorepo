import React, { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle, Clock, DollarSign, FileText, Users, Shield, BarChart3, Globe, MessageSquare, Calendar, Target, Bot, Zap, Search, ChevronDown, Eye, TrendingUp, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useLanguage } from '../../lib/language';
import { Button, Card } from '../../lib/ui';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const MarketResearchPage = () => {
  const { t } = useLanguage();
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [visibleSteps, setVisibleSteps] = useState<number[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

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

  // Rotate background images every 4 seconds
  const researchBackgroundImages = [
    'https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg?auto=compress&cs=tinysrgb&w=800', // Data analytics
    'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=800', // Business meeting
    'https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&cs=tinysrgb&w=800', // Charts and graphs
    'https://images.pexels.com/photos/8369648/pexels-photo-8369648.jpeg?auto=compress&cs=tinysrgb&w=800', // Digital analytics
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % researchBackgroundImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [researchBackgroundImages.length]);

  const serviceHighlights = [
    {
      icon: Globe,
      title: 'Market Entry Analysis',
      description: 'Comprehensive market sizing, growth analysis, and entry opportunity assessment',
      color: 'from-pink-500 to-purple-500',
    },
    {
      icon: Search,
      title: 'Competitive Intelligence',
      description: 'Deep competitor analysis, SWOT assessment, and market positioning insights',
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: Users,
      title: 'Consumer Behavior Insights',
      description: 'Customer segmentation, preferences study, and journey mapping analysis',
      color: 'from-pink-500 to-purple-500',
    },
    {
      icon: FileText,
      title: 'Regulatory Research',
      description: 'Legal frameworks, compliance requirements, and regulatory risk assessment',
      color: 'from-purple-500 to-indigo-500',
    },
  ];

  const whyChooseUs = [
    {
      icon: Bot,
      title: 'AI-Driven Analytics',
      description: 'Real-time insights across multiple markets with AI-powered data processing.',
    },
    {
      icon: Globe,
      title: 'Global Reach',
      description: 'Local data sources and research partners in 19+ countries worldwide.',
    },
    {
      icon: Target,
      title: 'Action-Oriented',
      description: 'Reports with clear recommendations and actionable strategies, not just data.',
    },
    {
      icon: Activity,
      title: 'Ongoing Monitoring',
      description: 'Continuous research and market monitoring to keep you ahead of trends.',
    },
  ];

  const researchServices = [
    {
      title: 'Market Entry Research',
      description: 'Growth size, barriers, opportunities',
      icon: Globe,
      color: 'from-magenta-500 to-pink-500',
      features: ['Market size & growth analysis', 'Entry barrier assessment', 'Opportunity identification', 'Success factor analysis'],
      deliverables: ['Market assessment report', 'Entry strategy recommendations', 'Risk analysis', 'Implementation roadmap'],
    },
    {
      title: 'Competitive Intelligence',
      description: 'SWOT, competitor profiling, pricing',
      icon: Search,
      color: 'from-purple-500 to-pink-500',
      features: ['Competitor profiling', 'SWOT analysis', 'Market positioning', 'Pricing strategy analysis'],
      deliverables: ['Competitor profiles', 'Market positioning map', 'SWOT matrix', 'Strategic recommendations'],
    },
    {
      title: 'Consumer Research',
      description: 'Segmentation, preferences, journey mapping',
      icon: Users,
      color: 'from-pink-500 to-purple-500',
      features: ['Customer segmentation', 'Preference analysis', 'Behavior study', 'Journey mapping'],
      deliverables: ['Customer personas', 'Behavior insights', 'Journey maps', 'Targeting strategy'],
    },
    {
      title: 'Regulatory Research',
      description: 'Legal frameworks, compliance, risks',
      icon: Shield,
      color: 'from-purple-500 to-indigo-500',
      features: ['Legal framework analysis', 'Compliance requirements', 'Regulatory risks', 'Policy impact assessment'],
      deliverables: ['Regulatory guide', 'Compliance checklist', 'Risk assessment', 'Monitoring framework'],
    },
  ];

  const processSteps = [
    {
      step: 1,
      title: 'Research Scope Definition',
      description: 'Objectives, key questions',
      duration: '1–2 days',
      detail: 'Define research objectives, target markets, and key strategic questions',
    },
    {
      step: 2,
      title: 'Data Collection Strategy',
      description: 'Methodology design',
      duration: '2–3 days',
      detail: 'Design comprehensive data collection methodology and research framework',
    },
    {
      step: 3,
      title: 'Primary Research',
      description: 'Surveys, interviews',
      duration: '2–4 weeks',
      detail: 'Conduct primary research including surveys, interviews, and focus groups',
    },
    {
      step: 4,
      title: 'Secondary Research',
      description: 'Industry/government data',
      duration: '1–2 weeks',
      detail: 'Analyze industry reports, government data, and existing market studies',
    },
    {
      step: 5,
      title: 'Data Analysis',
      description: 'Insights & patterns',
      duration: '1 week',
      detail: 'Process and analyze all collected data to identify insights and patterns',
    },
    {
      step: 6,
      title: 'Report & Recommendations',
      description: 'Deliver final report',
      duration: '3–5 days',
      detail: 'Deliver comprehensive report with actionable recommendations',
    },
  ];

  const serviceFeatures = [
    'Market entry reports',
    'Competitive analysis',
    'Consumer insights',
    'Regulatory frameworks',
    'Risk assessment',
    'Action plans',
    'Ongoing monitoring',
    'AI-powered dashboards',
  ];

  const faqs = [
    {
      question: 'How long does market research typically take?',
      answer: 'Research duration varies by scope and complexity, typically ranging from 4-12 weeks for comprehensive studies. Simple market assessments can be completed in 2-3 weeks.',
    },
    {
      question: 'What markets do you cover?',
      answer: 'We conduct research in all major global markets, with particular expertise in Europe, Asia-Pacific, Middle East, and North America through our network of local researchers.',
    },
    {
      question: 'Do you provide ongoing market monitoring?',
      answer: 'Yes, we offer ongoing market monitoring services to track changes in competitive landscape, regulatory environment, and market conditions with AI-powered alerts.',
    },
    {
      question: 'What research methodologies do you use?',
      answer: 'We use both quantitative and qualitative methods including surveys, interviews, focus groups, desk research, and AI-powered data analytics to provide comprehensive insights.',
    },
    {
      question: 'Can you help with market entry strategy?',
      answer: 'Absolutely. Beyond research, we provide strategic recommendations for market entry including go-to-market strategy, partnership opportunities, and implementation planning.',
    },
    {
      question: 'How much does market research cost?',
      answer: 'Costs vary based on research scope, methodology, and market complexity. We provide customized quotes based on your specific research requirements and objectives.',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>AI-Powered Market Intelligence for Global Growth - Market Research Services - Consulting19</title>
        <meta name="description" content="Professional market research and competitive intelligence services. AI-powered analytics and expert insights for international expansion decisions." />
      </Helmet>

      <Navbar />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-pink-600 via-purple-600 to-indigo-600 text-white py-10 mt-16 overflow-hidden">
        {/* Rotating Background Images */}
        <div className="absolute inset-0 opacity-15">
          {researchBackgroundImages.map((image, index) => (
            <img
              key={index}
              src={image}
              alt="Market research background"
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                index === currentImageIndex ? 'opacity-100' : 'opacity-0'
              }`}
            />
          ))}
        </div>

        {/* Animated Background Elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-12 left-12 w-40 h-40 bg-white/10 rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute bottom-12 right-12 w-60 h-60 bg-yellow-400/10 rounded-full blur-2xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-400/5 rounded-full blur-2xl"></div>
        </div>

        {/* Floating Research Icons */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-1/4 text-4xl animate-float">📊</div>
          <div className="absolute top-32 right-1/4 text-3xl animate-float-delayed">📈</div>
          <div className="absolute bottom-20 left-1/3 text-3xl animate-bounce delay-1000">🌍</div>
          <div className="absolute bottom-32 right-1/3 text-2xl animate-pulse delay-500">🔍</div>
        </div>

        {/* Animated Data Pattern */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-r from-pink-800/20 via-purple-800/20 to-indigo-800/20">
          <svg className="w-full h-full" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <defs>
              <pattern id="dataPattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                <circle cx="20" cy="20" r="2" fill="currentColor" opacity="0.3" className="animate-pulse" />
              </pattern>
            </defs>
            <path d="M0,60 C300,120 900,0 1200,60 L1200,120 L0,120 Z" fill="url(#dataPattern)" className="text-white/10"></path>
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
                <BarChart3 className="w-6 h-6 text-white" />
                <div className="absolute inset-0 bg-gradient-to-r from-pink-400/30 via-purple-400/30 to-indigo-400/30 rounded-xl blur-md animate-pulse"></div>
              </div>
            </div>
            
            <h1 className="text-2xl md:text-4xl font-bold mb-4 leading-tight animate-fade-in">
              AI-Powered Market Intelligence
              <br />
              <span className="bg-gradient-to-r from-yellow-300 via-orange-300 to-pink-300 bg-clip-text text-transparent animate-gradient">
                for Global Growth
              </span>
            </h1>
            
            <p className="text-lg text-pink-100 mb-6 leading-relaxed max-w-3xl mx-auto animate-fade-in-up delay-200">
              Professional market research and competitive intelligence to guide your international expansion decisions.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6 animate-fade-in-up delay-300">
              <Link to="/auth?mode=register">
                <Button 
                  size="md" 
                  className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-bold px-8 py-3 text-base shadow-xl border-0 transform hover:scale-105 transition-all duration-300"
                >
                  Join to Start Market Research
                </Button>
              </Link>
              <Button 
                size="md" 
                className="bg-white/20 backdrop-blur-sm text-white border-2 border-white/30 hover:bg-white/30 font-semibold px-8 py-3 text-base transition-all duration-300"
              >
                Free Research Consultation
              </Button>
            </div>

            {/* Trust Badge */}
            <div className="inline-flex items-center bg-white/20 backdrop-blur-sm rounded-full px-6 py-2 shadow-lg border border-white/30 animate-fade-in-up delay-400">
              <Globe className="w-5 h-5 text-pink-300 mr-2" />
              <span className="text-white font-medium">19+ Countries</span>
              <span className="mx-3 text-white/60">•</span>
              <Bot className="w-5 h-5 text-purple-300 mr-2" />
              <span className="text-white font-medium">AI-Driven Insights</span>
              <span className="mx-3 text-white/60">•</span>
              <Target className="w-5 h-5 text-orange-300 mr-2" />
              <span className="text-white font-medium">Actionable Strategies</span>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Service Highlights */}
        <section className="py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {serviceHighlights.map((highlight, index) => (
              <Card key={index} hover className="text-center border-2 border-gray-100 hover:border-pink-200 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl group relative overflow-hidden">
                <Card.Body className="py-10 relative z-10">
                  {/* Animated background gradient on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${highlight.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
                  
                  {/* Glowing outline effect */}
                  <div className={`absolute inset-0 bg-gradient-to-r ${highlight.color} opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500`}></div>
                  
                  <div className={`w-20 h-20 bg-gradient-to-r ${highlight.color} rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 relative`}>
                    <highlight.icon className="w-10 h-10 text-white" />
                    <div className={`absolute inset-0 bg-gradient-to-r ${highlight.color} rounded-3xl blur-lg opacity-60 group-hover:opacity-100 transition-opacity duration-500`}></div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-pink-700 transition-colors duration-300">{highlight.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{highlight.description}</p>
                </Card.Body>
              </Card>
            ))}
          </div>
        </section>

        {/* Why Consulting19 for Research? */}
        <section className="py-20 bg-gradient-to-br from-gray-50 via-pink-50 to-purple-50 rounded-3xl mb-16 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-8 left-8 w-32 h-32 border-2 border-pink-300 rounded-full animate-pulse"></div>
            <div className="absolute bottom-8 right-8 w-24 h-24 border-2 border-purple-300 rounded-lg rotate-45 animate-pulse delay-1000"></div>
            <div className="absolute top-1/2 left-1/4 w-16 h-16 border border-indigo-300 rounded-full animate-bounce delay-500"></div>
          </div>

          <div className="relative max-w-6xl mx-auto px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Why <span className="text-pink-600">Consulting19</span> for Research?
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Advanced market intelligence with AI-powered analytics
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-10">
                {whyChooseUs.map((reason, index) => (
                  <div key={index} className="flex items-start space-x-6 group">
                    <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-500 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                      <reason.icon className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-pink-700 transition-colors duration-300">{reason.title}</h3>
                      <p className="text-gray-600 leading-relaxed text-lg">{reason.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* AI Research Dashboard Illustration */}
              <div className="relative">
                <div className="bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 rounded-3xl p-10 shadow-2xl border-2 border-pink-500 relative overflow-hidden">
                  {/* Animated magnifying glass scanning effect */}
                  <div className="absolute top-6 right-6 w-24 h-24 bg-gradient-to-r from-pink-400/30 to-purple-400/30 rounded-full blur-xl animate-pulse"></div>
                  <div className="absolute bottom-6 left-6 w-20 h-20 bg-gradient-to-r from-purple-400/30 to-indigo-400/30 rounded-full blur-lg animate-pulse delay-1000"></div>
                  
                  <div className="text-center mb-8 relative z-10">
                    <div className="w-20 h-20 bg-gradient-to-r from-pink-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl">
                      <Search className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">AI Research Analytics</h3>
                    <p className="text-pink-300">Global market intelligence platform</p>
                  </div>
                  
                  <div className="space-y-6 relative z-10">
                    <div className="bg-white rounded-2xl p-6 shadow-xl border border-pink-100 relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-emerald-500"></div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-gray-700">Market Opportunity</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                          <span className="text-sm font-bold text-green-600">High Potential</span>
                        </div>
                      </div>
                      <div className="text-2xl font-bold text-gray-900 mb-2">$2.4B Market</div>
                      <div className="text-sm text-gray-600">AI-analyzed growth projection</div>
                    </div>
                    
                    <div className="bg-white rounded-2xl p-6 shadow-xl border border-purple-100 relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-indigo-500"></div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-gray-700">Competitive Analysis</span>
                        <div className="flex items-center space-x-2">
                          <Bot className="w-4 h-4 text-purple-600" />
                          <span className="text-sm font-bold text-purple-600">AI Monitored</span>
                        </div>
                      </div>
                      <div className="text-lg font-bold text-gray-900 mb-2">12 Key Players</div>
                      <div className="text-sm text-gray-600">Real-time competitor tracking</div>
                    </div>
                    
                    <div className="bg-gradient-to-r from-pink-500 to-purple-500 rounded-2xl p-6 text-white text-center shadow-xl">
                      <div className="text-sm font-medium mb-2">📊 Research Status</div>
                      <div className="text-xl font-bold">Analysis Complete</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Research Services (Interactive Cards) */}
        <section className="py-20 relative">
          {/* Animated Data Grid Background */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 25% 25%, #ec4899 3px, transparent 3px),
                               radial-gradient(circle at 75% 75%, #8b5cf6 3px, transparent 3px)`,
              backgroundSize: '60px 60px',
              animation: 'moveGrid 20s linear infinite'
            }}></div>
          </div>

          <div className="relative">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Research <span className="text-pink-600">Services</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Interactive service cards with comprehensive research coverage
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {researchServices.map((service, index) => (
                <Card key={index} hover className="text-center group cursor-pointer transform hover:scale-105 transition-all duration-500 hover:shadow-2xl border-2 border-gray-100 hover:border-pink-200 relative overflow-hidden">
                  <Card.Body className="py-10 relative z-10">
                    {/* Animated background gradient on hover */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-15 transition-opacity duration-500`}></div>
                    
                    {/* Glowing effect */}
                    <div className={`absolute inset-0 bg-gradient-to-r ${service.color} opacity-0 group-hover:opacity-30 blur-2xl transition-opacity duration-500`}></div>
                    
                    <div className={`w-20 h-20 bg-gradient-to-r ${service.color} rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 relative`}>
                      <service.icon className="w-10 h-10 text-gray-900 relative z-10 drop-shadow-lg" />
                      <div className={`absolute inset-0 bg-gradient-to-r ${service.color} rounded-3xl blur-lg opacity-60 group-hover:opacity-100 transition-opacity duration-500`}></div>
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-pink-700 transition-colors duration-300">{service.title}</h3>
                    <p className="text-gray-600 leading-relaxed mb-6">{service.description}</p>
                    
                    <div className="space-y-2 mb-6">
                      <h4 className="text-sm font-medium text-gray-900">Features:</h4>
                      {service.features.map((feature, i) => (
                        <div key={i} className="text-xs text-gray-700 flex items-center">
                          <CheckCircle className="w-3 h-3 text-green-500 mr-2 flex-shrink-0" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="space-y-1">
                      <h4 className="text-sm font-medium text-gray-900">Deliverables:</h4>
                      {service.deliverables.map((deliverable, i) => (
                        <div key={i} className="text-xs text-gray-600">
                          • {deliverable}
                        </div>
                      ))}
                    </div>
                  </Card.Body>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Research Process (Timeline Animation) */}
        <section className="py-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Research <span className="text-pink-600">Process</span>
            </h2>
            <p className="text-xl text-gray-600">
              Step-by-step timeline with progress bar animation
            </p>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-2 h-full bg-gradient-to-b from-pink-500 via-purple-500 to-indigo-500 rounded-full hidden lg:block shadow-lg"></div>
            
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
                    <Card className="inline-block group hover:shadow-2xl transition-all duration-500 transform hover:scale-105 border-2 border-gray-100 hover:border-pink-200">
                      <Card.Body className="py-8 px-10 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-pink-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="relative">
                          <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-pink-700 transition-colors duration-300">{step.title}</h3>
                          <p className="text-gray-600 mb-4 text-lg">{step.detail}</p>
                          <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                            <Clock className="w-5 h-5" />
                            <span className="font-medium text-lg">{step.duration}</span>
                          </div>
                        </div>
                      </Card.Body>
                    </Card>
                  </div>
                  
                  <div className={`relative z-10 w-20 h-20 bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-xl shadow-2xl transform transition-all duration-700 ${
                    visibleSteps.includes(index) ? 'scale-100 rotate-0' : 'scale-75 rotate-45'
                  }`}>
                    {step.step}
                    {/* Research pulse animation for active step */}
                    <div className="absolute inset-0 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full animate-ping opacity-30"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-indigo-400 rounded-full animate-pulse opacity-20"></div>
                  </div>
                  
                  <div className="flex-1 hidden lg:block"></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* What's Included (Grid Section) */}
        <section className="py-20 relative">
          {/* Moving grid background */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: `linear-gradient(45deg, #ec4899 25%, transparent 25%),
                               linear-gradient(-45deg, #ec4899 25%, transparent 25%),
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
                What's <span className="text-pink-600">Included</span>
              </h2>
              <p className="text-xl text-gray-600">
                Comprehensive research services with AI-powered insights
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {serviceFeatures.map((feature, index) => (
                <Card key={index} className="text-center hover:shadow-2xl transition-all duration-500 transform hover:scale-110 group border-2 border-gray-100 hover:border-pink-200 relative overflow-hidden">
                  <Card.Body className="py-8 relative z-10">
                    {/* Glowing gradient outline on hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-500 opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500"></div>
                    
                    <div className="relative">
                      <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl transform group-hover:scale-125 group-hover:rotate-12 transition-all duration-500">
                        <CheckCircle className="w-8 h-8 text-white" />
                      </div>
                      <p className="text-gray-700 font-semibold leading-relaxed group-hover:text-pink-700 transition-colors duration-300">{feature}</p>
                    </div>
                  </Card.Body>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section (Accordion with Smooth Expand) */}
        <section className="py-20 relative">
          {/* Moving pink-purple grid background */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 20% 20%, #ec4899 2px, transparent 2px),
                               radial-gradient(circle at 80% 80%, #8b5cf6 2px, transparent 2px)`,
              backgroundSize: '50px 50px',
              animation: 'moveGrid 25s linear infinite reverse'
            }}></div>
          </div>

          <div className="relative">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Frequently Asked <span className="text-pink-600">Questions</span>
              </h2>
              <p className="text-xl text-gray-600">
                Get answers to common market research questions
              </p>
            </div>

            <div className="max-w-4xl mx-auto space-y-6">
              {faqs.map((faq, index) => (
                <Card key={index} className="hover:shadow-2xl transition-all duration-500 border-2 border-gray-100 hover:border-pink-200 group">
                  <Card.Body>
                    <button
                      onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                      className="w-full text-left"
                    >
                      <div className="flex items-center justify-between py-4">
                        <h3 className="text-xl font-bold text-gray-900 pr-6 group-hover:text-pink-700 transition-colors duration-300">{faq.question}</h3>
                        <div className={`w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center transition-all duration-500 ${
                          expandedFaq === index ? 'bg-pink-600 rotate-180' : 'group-hover:bg-pink-200'
                        }`}>
                          <ChevronDown className={`w-6 h-6 transition-all duration-500 ${
                            expandedFaq === index ? 'text-white' : 'text-pink-600'
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
          <div className="bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 rounded-3xl text-white p-16 text-center relative overflow-hidden">
            {/* Animated glowing data chart icons */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-8 left-8 text-4xl animate-pulse">📊</div>
              <div className="absolute top-12 right-12 text-3xl animate-pulse delay-1000">📈</div>
              <div className="absolute bottom-8 left-12 text-3xl animate-bounce delay-500">🔍</div>
              <div className="absolute bottom-12 right-8 text-2xl animate-pulse delay-1500">🌍</div>
            </div>

            {/* Animated Wave Pattern */}
            <div className="absolute inset-0 opacity-20">
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1000 1000" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="researchWaveGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ec4899" stopOpacity="0.3" />
                    <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.1" />
                  </linearGradient>
                </defs>
                <path d="M0,300 Q250,200 500,300 T1000,300 L1000,1000 L0,1000 Z" fill="url(#researchWaveGradient)" className="animate-pulse">
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
                Ready to Research Your <span className="text-yellow-300">Target Market</span>?
              </h2>
              <p className="text-xl text-pink-100 mb-8 max-w-3xl mx-auto">
                Get actionable market intelligence with AI-powered research and expert analysis. 
                Make informed decisions for your international expansion.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Link to="/auth?mode=register">
                  <Button 
                    size="lg" 
                    className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-bold px-10 py-4 text-lg shadow-xl border-0 transform hover:scale-105 transition-all duration-300"
                  >
                    Join to Start Market Research
                  </Button>
                </Link>
                <Button 
                  size="lg" 
                  className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-pink-600 font-bold px-10 py-4 text-lg transition-all duration-300"
                >
                  Join for Research Consultation
                </Button>
              </div>
              
              <div className="mt-8 flex items-center justify-center space-x-8 text-pink-100">
                <div className="flex items-center space-x-2">
                  <BarChart3 className="w-6 h-6" />
                  <span>AI Analytics</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Globe className="w-6 h-6" />
                  <span>Global Reach</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Target className="w-6 h-6" />
                  <span>Actionable Insights</span>
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

export default MarketResearchPage;