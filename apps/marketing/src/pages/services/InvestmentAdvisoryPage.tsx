import React, { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle, Clock, DollarSign, FileText, Users, Shield, TrendingUp, Globe, MessageSquare, Calendar, BarChart3, Bot, Zap, Target, ChevronDown, Eye, Home, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useLanguage } from '../../lib/language';
import { Button, Card } from '../../lib/ui';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const InvestmentAdvisoryPage = () => {
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
  const investmentBackgroundImages = [
    'https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg?auto=compress&cs=tinysrgb&w=800', // Trading charts
    'https://images.pexels.com/photos/3483098/pexels-photo-3483098.jpeg?auto=compress&cs=tinysrgb&w=800', // Stock market
    'https://images.pexels.com/photos/259027/pexels-photo-259027.jpeg?auto=compress&cs=tinysrgb&w=800', // Banking/finance
    'https://images.pexels.com/photos/8369648/pexels-photo-8369648.jpeg?auto=compress&cs=tinysrgb&w=800', // Crypto/digital
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % investmentBackgroundImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [investmentBackgroundImages.length]);

  const serviceHighlights = [
    {
      icon: Globe,
      title: 'Global Investment Access',
      description: 'Access to premium investment opportunities across 19+ countries',
      color: 'from-emerald-500 to-teal-500',
    },
    {
      icon: Bot,
      title: 'AI Investment Advisory',
      description: 'Intelligent portfolio recommendations with multilingual support',
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: Target,
      title: 'Multi-Asset Portfolios',
      description: 'Diversified portfolios across traditional and alternative assets',
      color: 'from-orange-500 to-red-500',
    },
    {
      icon: Shield,
      title: 'Compliance Across Jurisdictions',
      description: 'Full regulatory compliance and tax optimization strategies',
      color: 'from-blue-500 to-cyan-500',
    },
  ];

  const whyChooseUs = [
    {
      icon: Bot,
      title: 'AI-Powered Strategy',
      description: 'Customized investment advice in your own language with AI assistance.',
    },
    {
      icon: TrendingUp,
      title: 'Alternative Assets',
      description: 'Access opportunities beyond traditional markets including real estate and crypto.',
    },
    {
      icon: Users,
      title: 'Local Expertise',
      description: 'Regulated investment advisors in every jurisdiction we serve.',
    },
    {
      icon: Shield,
      title: 'Comprehensive Support',
      description: 'From initial analysis to ongoing portfolio monitoring and optimization.',
    },
  ];

  const investmentOptions = [
    {
      title: 'Traditional Investments',
      description: 'Stocks, bonds, and mutual funds',
      icon: BarChart3,
      color: 'from-blue-500 to-cyan-500',
      features: ['Global equity markets', 'Fixed income securities', 'Mutual funds & ETFs', 'Index investing'],
      riskLevel: 'Low to Medium',
      minInvestment: '$10,000',
    },
    {
      title: 'Alternative Investments',
      description: 'Private equity, hedge funds, commodities',
      icon: TrendingUp,
      color: 'from-purple-500 to-pink-500',
      features: ['Private equity funds', 'Hedge fund strategies', 'Commodity investments', 'Structured products'],
      riskLevel: 'Medium to High',
      minInvestment: '$100,000',
    },
    {
      title: 'Real Estate',
      description: 'Direct and indirect real estate investments',
      icon: Home,
      color: 'from-green-500 to-teal-500',
      features: ['Direct property investment', 'REITs', 'Real estate funds', 'Development projects'],
      riskLevel: 'Medium',
      minInvestment: '$50,000',
    },
    {
      title: 'Digital Assets',
      description: 'Cryptocurrency and blockchain investments',
      icon: Zap,
      color: 'from-orange-500 to-yellow-500',
      features: ['Cryptocurrency portfolios', 'DeFi strategies', 'NFT investments', 'Blockchain projects'],
      riskLevel: 'High',
      minInvestment: '$5,000',
    },
  ];

  const processSteps = [
    {
      step: 1,
      title: 'Investment Profile Assessment',
      description: 'Evaluate goals & risk tolerance',
      duration: '2–3 days',
      detail: 'Comprehensive evaluation of your investment goals, risk tolerance, and financial situation',
    },
    {
      step: 2,
      title: 'Strategy Development',
      description: 'Create customized strategy',
      duration: '3–5 days',
      detail: 'Develop personalized investment strategy aligned with your objectives',
    },
    {
      step: 3,
      title: 'Portfolio Construction',
      description: 'Build diversified portfolio',
      duration: '1 week',
      detail: 'Construct optimally diversified portfolio with strategic asset allocation',
    },
    {
      step: 4,
      title: 'Implementation',
      description: 'Execute strategy & setup',
      duration: '1–2 weeks',
      detail: 'Execute investment strategy and establish all necessary accounts',
    },
    {
      step: 5,
      title: 'Monitoring Setup',
      description: 'Performance tracking systems',
      duration: '2–3 days',
      detail: 'Establish comprehensive performance monitoring and reporting systems',
    },
    {
      step: 6,
      title: 'Ongoing Management',
      description: 'Continuous optimization',
      duration: 'Ongoing',
      detail: 'Continuous portfolio management and strategy optimization',
    },
  ];

  const serviceFeatures = [
    'Professional portfolio management',
    'Alternative investment opportunities',
    'Real estate investment guidance',
    'ESG investment strategies',
    'Cryptocurrency compliance and strategy',
    'Risk assessment and management',
    'Performance monitoring and reporting',
    'Investment structure optimization',
  ];

  const faqs = [
    {
      question: 'What is the minimum investment amount?',
      answer: 'Minimum investment varies by strategy and jurisdiction, typically starting from $10,000 for traditional portfolios and $100,000 for comprehensive alternative investment strategies.',
    },
    {
      question: 'How do you ensure investment compliance across jurisdictions?',
      answer: 'We work with qualified investment advisors in each jurisdiction and ensure all investments comply with local regulations, international standards, and tax optimization requirements.',
    },
    {
      question: 'What are your investment management fees?',
      answer: 'Fees are typically 1-2% annually for portfolio management, with performance fees for alternative investments. We provide transparent fee structures for all services.',
    },
    {
      question: 'Can you help with cryptocurrency investments?',
      answer: 'Yes, we provide comprehensive cryptocurrency investment strategies and compliance guidance, including tax optimization and regulatory compliance across jurisdictions.',
    },
    {
      question: 'How often do you review and rebalance portfolios?',
      answer: 'We conduct quarterly reviews and rebalancing, with more frequent monitoring for volatile markets. Emergency rebalancing is available when market conditions warrant.',
    },
    {
      question: 'Do you provide ESG investment options?',
      answer: 'Yes, we offer comprehensive ESG (Environmental, Social, Governance) investment strategies that align with your values while maintaining strong returns.',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Smarter Investments. Global Opportunities. - Investment Advisory Services - Consulting19</title>
        <meta name="description" content="Professional investment advisory and wealth management services. Expert guidance for portfolio management, alternative investments, and global strategies." />
      </Helmet>

      <Navbar />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-emerald-600 via-teal-600 to-blue-600 text-white py-10 mt-16 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-12 left-12 w-40 h-40 bg-white/10 rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute bottom-12 right-12 w-60 h-60 bg-yellow-400/10 rounded-full blur-2xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-emerald-400/5 rounded-full blur-2xl"></div>
        </div>

        {/* Floating Finance Icons */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-12 left-1/4 text-2xl animate-float">📈</div>
          <div className="absolute top-20 right-1/4 text-xl animate-float-delayed">🏠</div>
          <div className="absolute bottom-12 left-1/3 text-xl animate-bounce delay-1000">💹</div>
          <div className="absolute bottom-20 right-1/3 text-lg animate-pulse delay-500">💰</div>
        </div>

        {/* Animated Globe Pattern */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-r from-emerald-800/20 via-teal-800/20 to-blue-800/20">
          <svg className="w-full h-full" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <defs>
              <pattern id="globePattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                <circle cx="20" cy="20" r="2" fill="currentColor" opacity="0.3" className="animate-pulse" />
              </pattern>
            </defs>
            <path d="M0,60 C300,120 900,0 1200,60 L1200,120 L0,120 Z" fill="url(#globePattern)" className="text-white/10"></path>
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
                <TrendingUp className="w-6 h-6 text-white" />
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/30 via-teal-400/30 to-blue-400/30 rounded-xl blur-md animate-pulse"></div>
              </div>
            </div>
            
            <h1 className="text-2xl md:text-4xl font-bold mb-4 leading-tight animate-fade-in">
              Smarter Investments.
              <br />
              <span className="bg-gradient-to-r from-yellow-300 via-orange-300 to-pink-300 bg-clip-text text-transparent animate-gradient">
                Global Opportunities.
              </span>
            </h1>
            
            <p className="text-lg text-emerald-100 mb-6 leading-relaxed max-w-3xl mx-auto animate-fade-in-up delay-200">
              Professional investment and wealth management for international clients – powered by AI, trusted advisors, and alternative investment platforms.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6 animate-fade-in-up delay-300">
              <Link to="/auth?mode=register">
                <Button 
                  size="md" 
                  className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-bold px-8 py-3 text-base shadow-xl border-0 transform hover:scale-105 transition-all duration-300"
                >
                  Join to Start Investment Planning
                </Button>
              </Link>
              <Button 
                size="md" 
                className="bg-white/20 backdrop-blur-sm text-white border-2 border-white/30 hover:bg-white/30 font-semibold px-8 py-3 text-base transition-all duration-300"
              >
                Free Portfolio Review
              </Button>
            </div>

            {/* Trust Badge */}
            <div className="inline-flex items-center bg-white/20 backdrop-blur-sm rounded-full px-6 py-2 shadow-lg border border-white/30 animate-fade-in-up delay-400">
              <Globe className="w-5 h-5 text-emerald-300 mr-2" />
              <span className="text-white font-medium">19+ Countries</span>
              <span className="mx-3 text-white/60">•</span>
              <Bot className="w-5 h-5 text-teal-300 mr-2" />
              <span className="text-white font-medium">AI Portfolio Assistant</span>
              <span className="mx-3 text-white/60">•</span>
              <Target className="w-5 h-5 text-blue-300 mr-2" />
              <span className="text-white font-medium">Multi-Asset Expertise</span>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Service Highlights */}
        <section className="py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {serviceHighlights.map((highlight, index) => (
              <Card key={index} hover className="text-center border-2 border-gray-100 hover:border-emerald-200 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl group relative overflow-hidden">
                <Card.Body className="py-10 relative z-10">
                  {/* Animated background gradient on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${highlight.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
                  
                  {/* Glowing outline effect */}
                  <div className={`absolute inset-0 bg-gradient-to-r ${highlight.color} opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500`}></div>
                  
                  <div className={`w-20 h-20 bg-gradient-to-r ${highlight.color} rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 relative`}>
                    <highlight.icon className="w-10 h-10 text-white" />
                    <div className={`absolute inset-0 bg-gradient-to-r ${highlight.color} rounded-3xl blur-lg opacity-60 group-hover:opacity-100 transition-opacity duration-500`}></div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-emerald-700 transition-colors duration-300">{highlight.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{highlight.description}</p>
                </Card.Body>
              </Card>
            ))}
          </div>
        </section>

        {/* Why Consulting19 for Investments? */}
        <section className="py-20 bg-gradient-to-br from-gray-50 via-emerald-50 to-teal-50 rounded-3xl mb-16 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-8 left-8 w-32 h-32 border-2 border-emerald-300 rounded-full animate-pulse"></div>
            <div className="absolute bottom-8 right-8 w-24 h-24 border-2 border-teal-300 rounded-lg rotate-45 animate-pulse delay-1000"></div>
            <div className="absolute top-1/2 left-1/4 w-16 h-16 border border-blue-300 rounded-full animate-bounce delay-500"></div>
          </div>

          <div className="relative max-w-6xl mx-auto px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Why <span className="text-emerald-600">Consulting19</span> for Investments?
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                The future of investment advisory is here
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-10">
                {whyChooseUs.map((reason, index) => (
                  <div key={index} className="flex items-start space-x-6 group">
                    <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                      <reason.icon className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-emerald-700 transition-colors duration-300">{reason.title}</h3>
                      <p className="text-gray-600 leading-relaxed text-lg">{reason.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* AI Investment Dashboard Illustration */}
              <div className="relative">
                <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-blue-50 rounded-3xl p-10 shadow-2xl border-2 border-emerald-100 relative overflow-hidden">
                  {/* Rotating Background Images */}
                  <div className="absolute inset-0 opacity-10">
                    {investmentBackgroundImages.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt="Investment background"
                        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                          index === currentImageIndex ? 'opacity-100' : 'opacity-0'
                        }`}
                      />
                    ))}
                  </div>
                  
                  {/* Animated background elements */}
                  <div className="absolute top-6 right-6 w-24 h-24 bg-gradient-to-r from-emerald-200/30 to-teal-200/30 rounded-full blur-xl animate-pulse"></div>
                  <div className="absolute bottom-6 left-6 w-20 h-20 bg-gradient-to-r from-teal-200/30 to-blue-200/30 rounded-full blur-lg animate-pulse delay-1000"></div>
                  
                  <div className="text-center mb-8 relative z-10">
                    <div className="w-20 h-20 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl">
                      <TrendingUp className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">AI Investment Dashboard</h3>
                    <p className="text-emerald-700">Smart portfolio optimization</p>
                  </div>
                  
                  <div className="space-y-6 relative z-10">
                    <div className="bg-white rounded-2xl p-6 shadow-xl border border-emerald-100 relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-emerald-500"></div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-gray-700">Portfolio Performance</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                          <span className="text-sm font-bold text-green-600">+18.4%</span>
                        </div>
                      </div>
                      <div className="text-2xl font-bold text-gray-900 mb-2">$2.4M</div>
                      <div className="text-sm text-gray-600">AI-optimized allocation</div>
                    </div>
                    
                    <div className="bg-white rounded-2xl p-6 shadow-xl border border-teal-100 relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-500 to-blue-500"></div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-gray-700">Risk Assessment</span>
                        <div className="flex items-center space-x-2">
                          <Bot className="w-4 h-4 text-teal-600" />
                          <span className="text-sm font-bold text-teal-600">AI Monitored</span>
                        </div>
                      </div>
                      <div className="text-lg font-bold text-gray-900 mb-2">Moderate Risk</div>
                      <div className="text-sm text-gray-600">Diversified across 12 assets</div>
                    </div>
                    
                    <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl p-6 text-white text-center shadow-xl">
                      <div className="text-sm font-medium mb-2">📊 Investment Status</div>
                      <div className="text-xl font-bold">Fully Optimized</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Investment Options */}
        <section className="py-20 relative">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 25% 25%, #10b981 3px, transparent 3px),
                               radial-gradient(circle at 75% 75%, #06b6d4 3px, transparent 3px)`,
              backgroundSize: '60px 60px'
            }}></div>
          </div>

          <div className="relative">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Investment <span className="text-emerald-600">Options</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Diversified investment opportunities across multiple asset classes
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {investmentOptions.map((option, index) => (
                <Card key={index} hover className="text-center group cursor-pointer transform hover:scale-105 transition-all duration-500 hover:shadow-2xl border-2 border-gray-100 hover:border-emerald-200 relative overflow-hidden">
                  <Card.Body className="py-10 relative z-10">
                    {/* Animated background gradient on hover */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${option.color} opacity-0 group-hover:opacity-15 transition-opacity duration-500`}></div>
                    
                    {/* Glowing effect */}
                    <div className={`absolute inset-0 bg-gradient-to-r ${option.color} opacity-0 group-hover:opacity-30 blur-2xl transition-opacity duration-500`}></div>
                    
                    <div className={`w-20 h-20 bg-gradient-to-r ${option.color} rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 relative`}>
                      <option.icon className="w-10 h-10 text-white" />
                      <div className={`absolute inset-0 bg-gradient-to-r ${option.color} rounded-3xl blur-lg opacity-60 group-hover:opacity-100 transition-opacity duration-500`}></div>
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-emerald-700 transition-colors duration-300">{option.title}</h3>
                    <p className="text-gray-600 leading-relaxed mb-6">{option.description}</p>
                    
                    <div className="space-y-2 mb-6">
                      {option.features.map((feature, i) => (
                        <div key={i} className="text-sm text-gray-700 flex items-center">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="space-y-2 text-xs text-gray-500">
                      <div className="flex justify-between">
                        <span><strong>Risk Level:</strong></span>
                        <span>{option.riskLevel}</span>
                      </div>
                      <div className="flex justify-between">
                        <span><strong>Min Investment:</strong></span>
                        <span>{option.minInvestment}</span>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Fidelkey Promotional Section */}
        <section className="py-16 relative">
          <div className="text-center mb-8">
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">
              Looking for secure, property-backed investment opportunities?
            </p>
          </div>

          <Card hover className="max-w-3xl mx-auto overflow-hidden group relative bg-gradient-to-br from-teal-600 via-blue-600 to-emerald-600 text-white border-2 border-teal-200 hover:border-teal-300 transition-all duration-500 transform hover:scale-[1.02] hover:shadow-2xl">
            {/* Animated Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-3 left-3 w-12 h-12 border border-teal-300 rounded-full animate-pulse"></div>
              <div className="absolute bottom-3 right-3 w-9 h-9 border border-blue-300 rounded-lg rotate-45 animate-pulse delay-1000"></div>
              <div className="absolute top-1/2 left-1/4 w-6 h-6 border border-emerald-300 rounded-full animate-bounce delay-500"></div>
            </div>

            {/* Floating Property Icons */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
              <div className="absolute top-4 right-4 text-xl animate-float">🏠</div>
              <div className="absolute top-8 left-4 text-base animate-float-delayed">🏢</div>
              <div className="absolute bottom-4 right-1/3 text-base animate-bounce delay-1000">🏗️</div>
              <div className="absolute bottom-6 left-1/3 text-sm animate-pulse delay-500">💎</div>
            </div>

            <Card.Body className="p-8 relative z-10">
              <div className="text-center">
                <div className="flex items-center justify-center space-x-3 mb-6">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-xl">
                    <Home className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-3xl animate-bounce">🏠</div>
                </div>
                
                <h2 className="text-2xl md:text-3xl font-bold mb-3 leading-tight">
                  Mortgaged Title-Deed
                  <br />
                  <span className="bg-gradient-to-r from-yellow-300 via-orange-300 to-pink-300 bg-clip-text text-transparent">
                    Investment Platform
                  </span>
                </h2>
                
                <p className="text-base text-teal-100 mb-6 leading-relaxed max-w-2xl mx-auto">
                  Secure, property-backed investment opportunities with guaranteed returns. 
                  Invest in real estate through innovative mortgage-backed securities.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  {[
                    { icon: '🛡️', text: 'Property-backed security' },
                    { icon: '📈', text: 'Guaranteed returns' },
                    { icon: '🌍', text: 'Global real estate access' }
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3 group">
                      <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                        <span className="text-lg">{feature.icon}</span>
                      </div>
                      <span className="text-teal-100 font-medium group-hover:text-yellow-300 transition-colors duration-300">
                        {feature.text}
                      </span>
                    </div>
                  ))}
                </div>
                
                <Button 
                  size="md" 
                  className="bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white font-bold px-8 py-3 text-base shadow-xl border-0 transform hover:scale-105 transition-all duration-300 relative overflow-hidden group"
                  onClick={() => window.open('https://fidelkey.com', '_blank')}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-teal-400 to-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span className="relative z-10 flex items-center">
                    Explore Mortgaged Title-Deed Investments
                  </span>
                </Button>
                
                <p className="text-xs text-teal-200 mt-2">
                  Powered by <span className="font-semibold text-white">Fidelkey.com</span>
                </p>
              </div>
            </Card.Body>
          </Card>
        </section>

        {/* Advisory Process Timeline */}
        <section className="py-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Advisory <span className="text-emerald-600">Process</span>
            </h2>
            <p className="text-xl text-gray-600">
              Step-by-step timeline with progress animation
            </p>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-2 h-full bg-gradient-to-b from-emerald-500 via-teal-500 to-blue-500 rounded-full hidden lg:block shadow-lg"></div>
            
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
                    <Card className="inline-block group hover:shadow-2xl transition-all duration-500 transform hover:scale-105 border-2 border-gray-100 hover:border-emerald-200">
                      <Card.Body className="py-8 px-10 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-teal-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="relative">
                          <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-emerald-700 transition-colors duration-300">{step.title}</h3>
                          <p className="text-gray-600 mb-4 text-lg">{step.detail}</p>
                          <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                            <Clock className="w-5 h-5" />
                            <span className="font-medium text-lg">{step.duration}</span>
                          </div>
                        </div>
                      </Card.Body>
                    </Card>
                  </div>
                  
                  <div className={`relative z-10 w-20 h-20 bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xl shadow-2xl transform transition-all duration-700 ${
                    visibleSteps.includes(index) ? 'scale-100 rotate-0' : 'scale-75 rotate-45'
                  }`}>
                    {step.step}
                    {/* Investment pulse animation for active step */}
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full animate-ping opacity-30"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-teal-400 to-blue-400 rounded-full animate-pulse opacity-20"></div>
                  </div>
                  
                  <div className="flex-1 hidden lg:block"></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* What's Included */}
        <section className="py-20 relative">
          {/* Moving grid background */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: `linear-gradient(45deg, #10b981 25%, transparent 25%),
                               linear-gradient(-45deg, #10b981 25%, transparent 25%),
                               linear-gradient(45deg, transparent 75%, #06b6d4 75%),
                               linear-gradient(-45deg, transparent 75%, #06b6d4 75%)`,
              backgroundSize: '30px 30px',
              backgroundPosition: '0 0, 0 15px, 15px -15px, -15px 0px',
              animation: 'moveGrid 20s linear infinite'
            }}></div>
          </div>

          <div className="relative">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                What's <span className="text-emerald-600">Included</span>
              </h2>
              <p className="text-xl text-gray-600">
                Comprehensive investment advisory with premium support
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {serviceFeatures.map((feature, index) => (
                <Card key={index} className="text-center hover:shadow-2xl transition-all duration-500 transform hover:scale-110 group border-2 border-gray-100 hover:border-emerald-200 relative overflow-hidden">
                  <Card.Body className="py-8 relative z-10">
                    {/* Glowing gradient outline on hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500"></div>
                    
                    <div className="relative">
                      <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl transform group-hover:scale-125 group-hover:rotate-12 transition-all duration-500">
                        <CheckCircle className="w-8 h-8 text-white" />
                      </div>
                      <p className="text-gray-700 font-semibold leading-relaxed group-hover:text-emerald-700 transition-colors duration-300">{feature}</p>
                    </div>
                  </Card.Body>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 relative">
          {/* Moving emerald-teal grid background */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 20% 20%, #10b981 2px, transparent 2px),
                               radial-gradient(circle at 80% 80%, #06b6d4 2px, transparent 2px)`,
              backgroundSize: '50px 50px',
              animation: 'moveGrid 25s linear infinite reverse'
            }}></div>
          </div>

          <div className="relative">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Frequently Asked <span className="text-emerald-600">Questions</span>
              </h2>
              <p className="text-xl text-gray-600">
                Get answers to common investment questions
              </p>
            </div>

            <div className="max-w-4xl mx-auto space-y-6">
              {faqs.map((faq, index) => (
                <Card key={index} className="hover:shadow-2xl transition-all duration-500 border-2 border-gray-100 hover:border-emerald-200 group">
                  <Card.Body>
                    <button
                      onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                      className="w-full text-left"
                    >
                      <div className="flex items-center justify-between py-4">
                        <h3 className="text-xl font-bold text-gray-900 pr-6 group-hover:text-emerald-700 transition-colors duration-300">{faq.question}</h3>
                        <div className={`w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center transition-all duration-500 ${
                          expandedFaq === index ? 'bg-emerald-600 rotate-180' : 'group-hover:bg-emerald-200'
                        }`}>
                          <ChevronDown className={`w-6 h-6 transition-all duration-500 ${
                            expandedFaq === index ? 'text-white' : 'text-emerald-600'
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

        {/* Final CTA */}
        <section className="py-20">
          <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 rounded-3xl text-white p-16 text-center relative overflow-hidden">
            {/* Animated financial line graph */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-8 left-8 text-4xl animate-pulse">📈</div>
              <div className="absolute top-12 right-12 text-3xl animate-pulse delay-1000">💹</div>
              <div className="absolute bottom-8 left-12 text-3xl animate-bounce delay-500">💰</div>
              <div className="absolute bottom-12 right-8 text-2xl animate-pulse delay-1500">🌍</div>
            </div>

            {/* Animated Wave Pattern */}
            <div className="absolute inset-0 opacity-20">
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1000 1000" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="investmentWaveGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
                    <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.1" />
                  </linearGradient>
                </defs>
                <path d="M0,300 Q250,200 500,300 T1000,300 L1000,1000 L0,1000 Z" fill="url(#investmentWaveGradient)" className="animate-pulse">
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
                Ready to Optimize Your <span className="text-yellow-300">Investments</span>?
              </h2>
              <p className="text-xl text-emerald-100 mb-8 max-w-3xl mx-auto">
                Start building wealth with professional advisory services and alternative platforms like Fidelkey. 
                Expert guidance for traditional and innovative investment opportunities.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Link to="/auth?mode=register">
                  <Button 
                    size="lg" 
                    className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-bold px-10 py-4 text-lg shadow-2xl border-0 transform hover:scale-105 transition-all duration-300"
                  >
                    Join to Start Investment Planning
                  </Button>
                </Link>
                <Button 
                  size="lg" 
                  className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-emerald-600 font-bold px-10 py-4 text-lg transition-all duration-300"
                >
                  Join for Investment Assessment
                </Button>
              </div>
              
              <div className="mt-8 flex items-center justify-center space-x-8 text-emerald-100">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-6 h-6" />
                  <span>Portfolio Optimization</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Globe className="w-6 h-6" />
                  <span>Global Access</span>
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

export default InvestmentAdvisoryPage;