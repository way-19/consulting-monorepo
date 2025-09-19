import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, Globe, Users, Zap, Shield, Building2, Calculator, CreditCard, FileText, TrendingUp, BarChart3, MessageSquare, Send, X, Star, MapPin, Clock, Target, Home, ExternalLink, Bot } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { useLanguage } from '../lib/language';
import { Button, Card } from '../lib/ui';
import Footer from '../components/Footer';
import { AIAgentIcon } from '@consulting19/shared';
import Navbar from '../components/Navbar';
import { useBlogPosts } from '../hooks/useBlogPosts';
import { Calendar, User, Eye, ArrowRight as BlogArrowRight } from 'lucide-react';

const HomePage = () => {
  const { t } = useLanguage();
  const [showAIChat, setShowAIChat] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { posts: blogPosts, loading: blogLoading, getLocalizedContent } = useBlogPosts(undefined, 3);

  return (
    <>
      <div className="min-h-screen">
        {/* Rotate background images every 4 seconds */}
        {(() => {
          const propertyBackgroundImages = [
            'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800', // Modern house
            'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=800', // Luxury property
            'https://images.pexels.com/photos/1115804/pexels-photo-1115804.jpeg?auto=compress&cs=tinysrgb&w=800', // Real estate investment
            'https://images.pexels.com/photos/280229/pexels-photo-280229.jpeg?auto=compress&cs=tinysrgb&w=800', // Property development
          ];

          useEffect(() => {
            const interval = setInterval(() => {
              setCurrentImageIndex((prev) => (prev + 1) % propertyBackgroundImages.length);
            }, 4000);
            return () => clearInterval(interval);
          }, [propertyBackgroundImages.length]);

          return null;
        })()}

        {(() => {
          const [aiMessage, setAiMessage] = useState('');
          const [companyFormationImageIndex, setCompanyFormationImageIndex] = useState(0);
          const [heroSlideIndex, setHeroSlideIndex] = useState(0);

          // Financial background images for Matrix card
          const matrixBackgroundImages = [
            'https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg?auto=compress&cs=tinysrgb&w=800', // Trading charts
            'https://images.pexels.com/photos/8369648/pexels-photo-8369648.jpeg?auto=compress&cs=tinysrgb&w=800', // Bitcoin/crypto
            'https://images.pexels.com/photos/259027/pexels-photo-259027.jpeg?auto=compress&cs=tinysrgb&w=800', // Banking/finance
            'https://images.pexels.com/photos/3483098/pexels-photo-3483098.jpeg?auto=compress&cs=tinysrgb&w=800', // Stock market
          ];

          // Company formation background images
          const companyFormationBackgroundImages = [
            'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=800', // Business meeting
            'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800', // Office workspace
            'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=800', // Business documents
            'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=800', // Corporate setup
          ];

          // Hero slider images with business themes
          const heroSlides = [
            {
              image: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=1920',
              title: 'AI-Enhanced Global Intelligence at Your Service',
              subtitle: 'Smart Hiring, Regulatory Guidance, and Expert Jurisdictional Advice',
              description: 'Comprehensive Business Formation Services',
              cta: 'Start Your Expansion',
              theme: 'business-meeting'
            },
            {
              image: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1920',
              title: 'Global Business Consulting Platform',
              subtitle: 'Expert Guidance Worldwide',
              description: 'Connect with advisors in 19+ countries for seamless international expansion',
              cta: 'Explore Services',
              theme: 'workspace'
            },
            {
              image: 'https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg?auto=compress&cs=tinysrgb&w=1920',
              title: 'AI-Powered Tax Optimization',
              subtitle: 'Strategic International Tax Planning',
              description: 'Minimize your global tax burden with expert guidance and AI insights',
              cta: 'Optimize Taxes',
              theme: 'financial-data'
            },
            {
              image: 'https://images.pexels.com/photos/259027/pexels-photo-259027.jpeg?auto=compress&cs=tinysrgb&w=1920',
              title: 'International Banking Solutions',
              subtitle: 'Global Financial Access',
              description: 'Open corporate accounts and access premium financial services worldwide',
              cta: 'Setup Banking',
              theme: 'banking'
            }
          ];
          // Rotate background images every 4 seconds
          useEffect(() => {
            const interval = setInterval(() => {
              setCurrentImageIndex((prev) => (prev + 1) % matrixBackgroundImages.length);
              setCompanyFormationImageIndex((prev) => (prev + 1) % companyFormationBackgroundImages.length);
              setHeroSlideIndex((prev) => (prev + 1) % heroSlides.length);
            }, 4000);
            return () => clearInterval(interval);
          }, [matrixBackgroundImages.length, companyFormationBackgroundImages.length, heroSlides.length]);

          const features = [
            {
              icon: Zap,
              title: t('aiPoweredIntelligence'),
              description: 'Smart jurisdiction recommendations based on your business needs',
            },
            {
              icon: Users,
              title: t('expertNetwork'),
              description: 'Local specialists in 19+ countries with proven track records',
            },
            {
              icon: Shield,
              title: 'Comprehensive Services',
              description: 'End-to-end support from formation to ongoing compliance',
            },
            {
              icon: Globe,
              title: 'Multi-Language Support',
              description: 'Platform available in English, Turkish, and Portuguese',
            },
          ];

          const countryRecommendations = [
            {
              id: 'georgia',
              name: 'Georgia',
              flag: '🇬🇪',
              image: 'https://images.pexels.com/photos/4386440/pexels-photo-4386440.jpeg?auto=compress&cs=tinysrgb&w=800',
              rating: 4.9,
              link: '/countries/georgia',
              available: true,
            },
            {
              id: 'usa',
              name: 'United States',
              flag: '🇺🇸',
              image: 'https://images.pexels.com/photos/290595/pexels-photo-290595.jpeg?auto=compress&cs=tinysrgb&w=800',
              rating: 4.9,
              link: '/countries/usa',
              available: false,
            },
            {
              id: 'uae',
              name: 'United Arab Emirates',
              flag: '🇦🇪',
              image: 'https://images.pexels.com/photos/3787839/pexels-photo-3787839.jpeg?auto=compress&cs=tinysrgb&w=800',
              rating: 4.8,
              link: '/countries/uae',
              available: false,
            },
            {
              id: 'estonia',
              name: 'Estonia',
              flag: '🇪🇪',
              image: 'https://images.pexels.com/photos/4386321/pexels-photo-4386321.jpeg?auto=compress&cs=tinysrgb&w=800',
              rating: 4.7,
              link: '/countries/estonia',
              available: false,
            },
            {
              id: 'malta',
              name: 'Malta',
              flag: '🇲🇹',
              image: 'https://images.pexels.com/photos/1388030/pexels-photo-1388030.jpeg?auto=compress&cs=tinysrgb&w=800',
              rating: 4.6,
              link: '/countries/malta',
              available: false,
            },
            {
              id: 'portugal',
              name: 'Portugal',
              flag: '🇵🇹',
              image: 'https://images.pexels.com/photos/2166559/pexels-photo-2166559.jpeg?auto=compress&cs=tinysrgb&w=800',
              rating: 4.5,
              link: '/countries/portugal',
              available: false,
            },
            {
              id: 'panama',
              name: 'Panama',
              flag: '🇵🇦',
              image: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800',
              rating: 4.4,
              link: '/countries/panama',
              available: false,
            },
            {
              id: 'switzerland',
              name: 'Switzerland',
              flag: '🇨🇭',
              image: 'https://images.pexels.com/photos/1659438/pexels-photo-1659438.jpeg?auto=compress&cs=tinysrgb&w=800',
              rating: 4.8,
              link: '/countries/switzerland',
              available: false,
            },
          ];

          const expertServices = [
            {
              icon: Building2,
              title: 'Company Formation',
              description: 'Professional business setup and incorporation services worldwide',
              color: 'blue',
              features: ['LLC & Corporation Setup', 'Government Registration', 'Legal Compliance', 'Ongoing Support'],
              link: '/services/company-formation',
            },
            {
              icon: Calculator,
              title: 'Tax Optimization',
              description: 'Strategic tax planning and international tax optimization',
              color: 'green',
              features: ['Tax Planning', 'Double Tax Treaties', 'Residency Planning', 'Annual Compliance'],
              link: '/services/tax-optimization',
            },
            {
              icon: CreditCard,
              title: 'Banking Solutions',
              description: 'Global banking access and financial services',
              color: 'purple',
              features: ['Account Opening', 'Multi-Currency', 'Payment Systems', 'Banking Relations'],
              link: '/services/banking-solutions',
            },
            {
              icon: FileText,
              title: 'Legal Consulting',
              description: 'Comprehensive legal and regulatory compliance',
              color: 'orange',
              features: ['Contract Review', 'IP Protection', 'Compliance Monitoring', 'Legal Structure'],
              link: '/services/legal-compliance',
            },
            {
              icon: Shield,
              title: 'Asset Protection',
              description: 'Wealth protection and asset security strategies',
              color: 'teal',
              features: ['Protection Strategy', 'Trust Setup', 'Risk Mitigation', 'Estate Planning'],
            },
            {
              icon: TrendingUp,
              title: 'Investment Advisory',
              description: 'Professional investment and wealth management',
              color: 'red',
              features: ['Portfolio Management', 'Alternative Investments', 'Real Estate', 'Crypto Compliance'],
            },
            {
              icon: Users,
              title: 'Visa & Residency',
              description: 'Immigration and residency planning services',
              color: 'indigo',
              features: ['Eligibility Review', 'Application Prep', 'Document Filing', 'Status Tracking'],
            },
            {
              icon: BarChart3,
              title: 'Market Research',
              description: 'Market intelligence and business research',
              color: 'pink',
              features: ['Market Analysis', 'Competitor Mapping', 'Pricing Insights', 'Regulations'],
            },
          ];

          const platformStats = [
            { label: 'Countries Covered', value: '19+', icon: Globe },
            { label: 'Expert Consultants', value: '50+', icon: Users },
            { label: 'Successful Projects', value: '2,500+', icon: CheckCircle },
            { label: 'Client Satisfaction', value: '98%', icon: Star },
          ];

          const colorClasses = {
            blue: 'from-blue-500 to-blue-600',
            green: 'from-green-500 to-green-600',
            purple: 'from-purple-500 to-purple-600',
            orange: 'from-orange-500 to-orange-600',
            teal: 'from-teal-500 to-teal-600',
            red: 'from-red-500 to-red-600',
            indigo: 'from-indigo-500 to-indigo-600',
            pink: 'from-pink-500 to-pink-600',
          };

          const getServiceBackgroundImage = (serviceTitle: string) => {
            const serviceImages: { [key: string]: string } = {
              'Company Formation': 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=800',
              'Tax Optimization': 'https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg?auto=compress&cs=tinysrgb&w=800',
              'Banking Solutions': 'https://images.pexels.com/photos/259027/pexels-photo-259027.jpeg?auto=compress&cs=tinysrgb&w=800',
              'Legal Consulting': 'https://images.pexels.com/photos/5668858/pexels-photo-5668858.jpeg?auto=compress&cs=tinysrgb&w=800',
              'Asset Protection': 'https://images.pexels.com/photos/3483098/pexels-photo-3483098.jpeg?auto=compress&cs=tinysrgb&w=800',
              'Investment Advisory': 'https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg?auto=compress&cs=tinysrgb&w=800',
              'Visa & Residency': 'https://images.pexels.com/photos/4386440/pexels-photo-4386440.jpeg?auto=compress&cs=tinysrgb&w=800',
              'Market Research': 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800',
            };
            
            return serviceImages[serviceTitle] || 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=800';
          };

          const quickQuestions = [
            'I want to start a tech company',
            'Looking for tax optimization',
            'Need EU market access',
            'Interested in crypto business',
          ];

          return (
            <div className="min-h-screen bg-gray-50">
              <Helmet>
                <title>Consulting19 - AI-Powered Global Business Consulting</title>
                <meta name="description" content="Expert guidance for international business expansion. AI-powered platform connecting you with advisors in 19+ countries for tax optimization, company formation, and legal compliance." />
              </Helmet>

              <Navbar />
              
              {/* Hero Section */}
              <section className="relative min-h-screen overflow-hidden">
                {/* Hero Slider Background */}
                <div className="absolute inset-0">
                  {heroSlides.map((slide, index) => (
                    <div
                      key={index}
                      className={`absolute inset-0 transition-opacity duration-1000 ${
                        index === heroSlideIndex ? 'opacity-100' : 'opacity-0'
                      }`}
                    >
                      <img
                        src={slide.image}
                        alt={slide.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/50"></div>
                    </div>
                  ))}
                </div>

                {/* Hero Content */}
                <div className="relative z-10 flex items-center justify-center min-h-screen">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="max-w-4xl mx-auto">
                      <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                        {heroSlides[heroSlideIndex]?.title}
                      </h1>
                      <p className="text-xl md:text-2xl text-gray-200 mb-4">
                        {heroSlides[heroSlideIndex]?.subtitle}
                      </p>
                      <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
                        {heroSlides[heroSlideIndex]?.description}
                      </p>
                      <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button 
                          size="lg" 
                          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold px-8 py-4 text-lg shadow-xl"
                        >
                          {heroSlides[heroSlideIndex]?.cta}
                        </Button>
                        <Button 
                          size="lg" 
                          variant="outline" 
                          className="bg-gray-800 text-blue border-gray-800 hover:bg-gray-900 hover:border-gray-900 font-semibold px-8 py-4 text-lg"
                          onClick={() => window.location.href = '/ai-experience'}
                        >
                          Talk to AI Oracle
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Slide Indicators */}
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
                  <div className="flex space-x-2">
                    {heroSlides.map((_, index) => (
                      <button
                        key={index}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${
                          index === heroSlideIndex ? 'bg-white' : 'bg-white/50'
                        }`}
                        onClick={() => setHeroSlideIndex(index)}
                      />
                    ))}
                  </div>
                </div>
              </section>

              {/* Matrix Private Wealth & Company Formation Cards */}
              <section className="py-5 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Matrix — Private Wealth Card */}
                    <Card hover className="overflow-hidden group relative bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-800 text-white">
                      {/* Rotating Background Images */}
                      <div className="absolute inset-0 opacity-20">
                        {matrixBackgroundImages.map((image, index) => (
                          <img
                            key={index}
                            src={image}
                            alt="Financial background"
                            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                              index === currentImageIndex ? 'opacity-100' : 'opacity-0'
                            }`}
                          />
                        ))}
                      </div>
                      
                      {/* Light shadow overlay for text readability */}
                      <div className="absolute inset-0 bg-black/30"></div>
                      
                      {/* Premium Badge */}
                      <div className="absolute top-4 left-4 z-20">
                        <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                          ⭐ PREMIUM
                        </span>
                      </div>
                      
                      {/* Animated Pattern Overlay */}
                      <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-8 right-8 w-32 h-32 border border-white/30 rounded-full animate-pulse"></div>
                        <div className="absolute bottom-8 left-8 w-24 h-24 border border-white/20 rounded-lg rotate-45 animate-pulse delay-1000"></div>
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-6xl opacity-20 animate-pulse delay-500">₿</div>
                      </div>
                      
                      <Card.Body className="p-6 relative z-10">
                        <div className="mb-4">
                          <h2 className="text-xl font-bold text-white mb-2">
                            Matrix — Private Wealth
                          </h2>
                          <p className="text-purple-200 text-sm">
                            Ultra-high-net-worth platform with AI-assisted global allocation
                          </p>
                        </div>
                        
                        <div className="space-y-3 mb-4">
                          {[
                            { icon: '🤖', text: 'AI-driven portfolio analysis' },
                            { icon: '🌍', text: 'Global investment opportunities' },
                            { icon: '🛡️', text: 'Strict confidentiality protocols' }
                          ].map((feature, index) => (
                            <div key={index} className="flex items-center space-x-3 text-sm">
                              <span className="text-lg">{feature.icon}</span>
                              <span className="text-purple-100">{feature.text}</span>
                            </div>
                          ))}
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div className="text-center">
                            <div className="text-lg font-bold text-yellow-400">$68B+ AUM</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold text-green-400">98% Success</div>
                          </div>
                        </div>
                        
                        <Button 
                          className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black font-bold text-sm py-2 shadow-lg"
                          onClick={() => window.open('https://wealth.consulting19.com', '_blank')}
                        >
                          🔥 Explore Matrix Wealth →
                        </Button>
                      </Card.Body>
                    </Card>

                    {/* Company Formation Card */}
                    <Card hover className="overflow-hidden group relative bg-gradient-to-br from-blue-600 via-purple-600 to-blue-700 text-white">
                      {/* Rotating Background Images */}
                      <div className="absolute inset-0 opacity-20">
                        {companyFormationBackgroundImages.map((image, index) => (
                          <img
                            key={index}
                            src={image}
                            alt="Company formation background"
                            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                              index === companyFormationImageIndex ? 'opacity-100' : 'opacity-0'
                            }`}
                          />
                        ))}
                      </div>
                      
                      {/* Light shadow overlay for text readability */}
                      <div className="absolute inset-0 bg-black/30"></div>
                      
                      {/* Icon Badge */}
                      <div className="absolute top-4 left-4 z-20">
                        <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                          <Building2 className="w-4 h-4 text-white" />
                        </div>
                      </div>
                      
                      <Card.Body className="p-6 relative z-10">
                        <div className="mb-4">
                          <h2 className="text-xl font-bold text-white mb-2">
                            Company Formation
                          </h2>
                          <p className="text-blue-200 text-sm">
                            Fast, compliant business setup in 19+ countries
                          </p>
                        </div>
                        
                        <div className="space-y-3 mb-4">
                          {[
                            { icon: '⚡', text: 'AI-powered jurisdiction analysis' },
                            { icon: '🟢', text: 'Expert local guidance' },
                            { icon: '✅', text: 'Banking & compliance included' },
                            { icon: '🔒', text: 'Full legal documentation' }
                          ].map((feature, index) => (
                            <div key={index} className="flex items-center space-x-3 text-sm">
                              <span className="text-lg">{feature.icon}</span>
                              <span className="text-blue-100">{feature.text}</span>
                            </div>
                          ))}
                        </div>
                        
                        <Button 
                          className="w-full bg-gradient-to-r from-emerald-600 to-blue-600 text-white hover:from-emerald-700 hover:to-blue-700 font-bold text-sm py-2 shadow-lg"
                          onClick={() => window.location.href = '/order-form'}
                        >
                          🚀 Start Company Formation →
                        </Button>
                      </Card.Body>
                    </Card>
                  </div>
                </div>
              </section>

              {/* Expert Services */}
              <section className="py-20 bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 relative overflow-hidden">
                {/* Animated Background Pattern */}
                <div className="absolute inset-0 opacity-5">
                  <div className="absolute top-8 left-8 w-32 h-32 border-2 border-blue-300 rounded-full animate-pulse"></div>
                  <div className="absolute bottom-8 right-8 w-24 h-24 border-2 border-purple-300 rounded-lg rotate-45 animate-pulse delay-1000"></div>
                  <div className="absolute top-1/2 left-1/4 w-16 h-16 border border-teal-300 rounded-full animate-bounce delay-500"></div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                      Expert Services for <span className="text-blue-600">Global Success</span>
                    </h2>
                    <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                      Comprehensive business solutions delivered by certified experts across 19+ countries
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {expertServices.map((service, index) => (
                      <Card key={index} hover className="h-full group relative overflow-hidden border-2 border-gray-100 hover:border-blue-200 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl">
                        {/* Background Image */}
                        <div className="absolute inset-0">
                          <img
                            src={getServiceBackgroundImage(service.title)}
                            alt={service.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-all duration-500"></div>
                        </div>
                        
                        <Card.Body className="text-center p-6 relative z-10 h-full flex flex-col justify-between">
                          <div>
                            <h3 className="text-lg font-bold text-white mb-3 drop-shadow-2xl group-hover:text-yellow-300 transition-colors duration-300" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>{service.title}</h3>
                            <p className="text-white mb-4 leading-relaxed text-sm drop-shadow-xl" style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.8)' }}>{service.description}</p>
                            
                            <div className="space-y-2 mb-6">
                              {service.features.map((feature, i) => (
                                <div key={i} className="flex items-center text-sm text-white group-hover:text-yellow-100 transition-colors duration-300">
                                  <CheckCircle className="w-3 h-3 text-green-400 mr-2 flex-shrink-0 group-hover:scale-110 transition-transform duration-300 drop-shadow-lg" />
                                  <span className="font-medium drop-shadow-lg" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}>{feature}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          <Button 
                            variant="primary"
                            size="sm"
                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 backdrop-blur-sm border-2 border-blue-500 text-white font-bold hover:from-blue-700 hover:to-purple-700 hover:text-white shadow-xl hover:shadow-2xl transform group-hover:scale-105 transition-all duration-300"
                            onClick={() => {
                              const serviceLinks: { [key: string]: string } = {
                                'Company Formation': '/services/company-formation',
                                'Tax Optimization': '/services/tax-optimization',
                                'Banking Solutions': '/services/banking-solutions',
                                'Legal Consulting': '/services/legal-compliance',
                                'Asset Protection': '/services/asset-protection',
                                'Investment Advisory': '/services/investment-advisory',
                                'Visa & Residency': '/services/visa-residency',
                                'Market Research': '/services/market-research',
                              };
                              const link = serviceLinks[service.title];
                              if (link) {
                                window.location.href = link;
                              }
                            }}
                          >
                            Explore {service.title}
                          </Button>
                        </Card.Body>
                      </Card>
                    ))}
                  </div>
                </div>
              </section>
              
              {/* Platform Analytics */}
              <section className="py-5 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-6 left-6 w-20 h-20 border border-blue-400 rounded-full animate-pulse"></div>
                  <div className="absolute bottom-6 right-6 w-16 h-16 border border-teal-400 rounded-lg rotate-45 animate-bounce"></div>
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="text-center mb-10">
                    <h2 className="text-3xl md:text-4xl font-bold mb-3">
                      Real-Time Platform <span className="text-blue-400">Analytics</span>
                    </h2>
                    <p className="text-lg text-blue-100 max-w-3xl mx-auto">
                      Advanced AI insights for optimal business decisions
                    </p>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
                    {platformStats.map((stat, index) => (
                      <Card key={index} className="bg-white/10 backdrop-blur-sm border border-white/20">
                        <Card.Body className="text-center">
                          <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-teal-400 rounded-lg flex items-center justify-center mx-auto mb-3">
                            <stat.icon className="w-6 h-6 text-white" />
                          </div>
                          <div className="text-xl font-bold text-white mb-1">{stat.value}</div>
                          <div className="text-blue-200 text-xs">{stat.label}</div>
                        </Card.Body>
                      </Card>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="bg-white/10 backdrop-blur-sm border border-white/20">
                      <Card.Body className="text-center">
                        <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                          <Zap className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="text-base font-bold text-white mb-2">AI Consulting</h3>
                        <p className="text-blue-200 text-xs">Personalized business guidance</p>
                      </Card.Body>
                    </Card>

                    <Card className="bg-white/10 backdrop-blur-sm border border-white/20">
                      <Card.Body className="text-center">
                        <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                          <Users className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="text-base font-bold text-white mb-2">Legal Consulting</h3>
                        <p className="text-blue-200 text-xs">Expert legal advice worldwide</p>
                      </Card.Body>
                    </Card>

                    <Card className="bg-white/10 backdrop-blur-sm border border-white/20">
                      <Card.Body className="text-center">
                        <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                          <Shield className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="text-base font-bold text-white mb-2">Business Formation</h3>
                        <p className="text-blue-200 text-xs">Complete formation services</p>
                      </Card.Body>
                    </Card>
                  </div>

                  <div className="text-center mt-6">
                    <Button
                      size="md"
                      className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-bold px-8 py-4"
                      onClick={() => {
                        window.location.href = '/ai-recommendations';
                      }}
                    >
                      Join Successful Businesses
                    </Button>
                  </div>
                </div>
              </section>

              {/* AI-Powered Country Recommendations */}
              <section className="py-5 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                      AI-Powered Country <span className="text-blue-600">Recommendations</span>
                    </h2>
                    <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                      Smart jurisdiction analysis powered by AI to find the perfect country for your business needs
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {countryRecommendations.map((country) => (
                      <Link
                        key={country.id}
                        to={country.link}
                        className="block"
                      >
                        <Card 
                          hover 
                          className={`relative overflow-hidden transition-all duration-300 group ${
                            country.available ? 'cursor-pointer' : 'opacity-75'
                          }`}
                        >
                          <div className="relative h-48">
                            <img
                              src={country.image}
                              alt={country.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                            
                            {/* Status Badge */}
                            <div className="absolute top-4 right-4">
                              {country.available && (
                                <span className="bg-green-500/90 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                                  Available
                                </span>
                              )}
                              {!country.available && (
                                <span className="bg-orange-500/90 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                                  Coming Soon
                                </span>
                              )}
                            </div>
                            
                            {/* Country Info */}
                            <div className="absolute bottom-4 left-4 right-4">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                  <span className="text-4xl drop-shadow-lg">{country.flag}</span>
                                  <div>
                                    <h3 className="text-lg font-bold text-white drop-shadow-lg">{country.name}</h3>
                                    <div className="flex items-center space-x-1">
                                      <Star className="w-4 h-4 text-yellow-400 fill-current drop-shadow-sm" />
                                      <span className="text-white text-sm font-medium drop-shadow-sm">{country.rating}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Card>
                      </Link>
                    ))}
                  </div>

                  <div className="text-center mt-8">
                    <Link to="/countries">
                      <button className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-700 via-purple-700 to-teal-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <span className="relative z-10 mr-2">View All Countries</span>
                        <Globe className="relative z-10 w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                      </button>
                    </Link>
                  </div>
                </div>
              </section>
              
              {/* AI-Powered Country Recommendations */}
              <section className="py-20 bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-5">
                  <div className="absolute top-8 left-8 w-32 h-32 border border-blue-300 rounded-full animate-pulse"></div>
                  <div className="absolute bottom-8 right-8 w-24 h-24 border border-purple-300 rounded-lg rotate-45 animate-pulse delay-1000"></div>
                  <div className="absolute top-1/2 left-1/4 w-16 h-16 border border-teal-300 rounded-full animate-bounce delay-500"></div>
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                      AI-Powered Country <span className="text-blue-600">Recommendations</span>
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                      Our AI Oracle analyzes your business needs and recommends the perfect jurisdiction for your expansion
                    </p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div className="space-y-8">
                      <div className="space-y-6">
                        {[
                          {
                            icon: Target,
                            title: 'Business Model Analysis',
                            description: 'AI analyzes your business type, revenue model, and target markets to identify optimal jurisdictions.',
                          },
                          {
                            icon: BarChart3,
                            title: 'Tax Optimization Scoring',
                            description: 'Advanced algorithms calculate potential tax savings across different countries and structures.',
                          },
                          {
                            icon: Shield,
                            title: 'Risk Assessment',
                            description: 'Comprehensive risk analysis including political stability, regulatory environment, and business climate.',
                          },
                          {
                            icon: Globe,
                            title: 'Compliance Matching',
                            description: 'Match your industry requirements with countries that offer the best regulatory framework.',
                          },
                        ].map((feature, index) => (
                          <div key={index} className="flex items-start space-x-4 group">
                            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300">
                              <feature.icon className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-700 transition-colors duration-300">{feature.title}</h3>
                              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="bg-white rounded-2xl p-8 shadow-xl border border-blue-100">
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">Get Your AI Recommendation</h3>
                        <p className="text-gray-600 mb-6">
                          Answer a few questions and let our AI Oracle recommend the perfect countries for your business expansion.
                        </p>
                        <Button 
                          size="lg" 
                          className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-bold px-8 py-4 text-lg shadow-xl border-0 transform hover:scale-105 transition-all duration-300"
                          onClick={() => window.location.href = '/ai-recommendations'}
                        >
                          Start AI Analysis
                        </Button>
                      </div>
                    </div>

                    {/* AI Recommendation Interface */}
                    <div className="relative">
                      <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50 rounded-3xl p-8 shadow-2xl border border-blue-200 relative overflow-hidden">
                        {/* Animated background elements */}
                        <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-r from-blue-200/30 to-purple-200/30 rounded-full blur-xl animate-pulse"></div>
                        <div className="absolute bottom-4 left-4 w-16 h-16 bg-gradient-to-r from-purple-200/30 to-indigo-200/30 rounded-full blur-lg animate-pulse delay-1000"></div>
                        
                        <div className="text-center mb-6">
                          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl">
                            <Bot className="w-8 h-8 text-white" />
                          </div>
                          <h3 className="text-2xl font-bold text-gray-900 mb-2">AI Oracle Recommendation</h3>
                          <p className="text-blue-700">Analyzing your business profile...</p>
                        </div>
                        
                        <div className="space-y-4">
                          <div className="bg-white rounded-xl p-4 shadow-lg border border-blue-100">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium text-gray-700">Business Type</span>
                              <span className="text-sm text-blue-600">Tech Startup</span>
                            </div>
                            <div className="w-full bg-blue-100 rounded-full h-2">
                              <div className="bg-blue-500 h-2 rounded-full w-3/4 animate-pulse"></div>
                            </div>
                          </div>
                          
                          <div className="bg-white rounded-xl p-4 shadow-lg border border-purple-100">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium text-gray-700">Tax Optimization</span>
                              <span className="text-sm text-purple-600">High Priority</span>
                            </div>
                            <div className="w-full bg-purple-100 rounded-full h-2">
                              <div className="bg-purple-500 h-2 rounded-full w-full animate-pulse"></div>
                            </div>
                          </div>
                          
                          <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl p-4 text-white text-center shadow-lg">
                            <div className="text-sm font-medium mb-1">🎯 Recommended</div>
                            <div className="text-lg font-bold">🇪🇪 Estonia • 🇬🇪 Georgia</div>
                            <div className="text-xs opacity-90 mt-1">95% match score</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* AI Chat Experience */}
              <section className="py-5 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                      Experience the Future of <span className="text-blue-600">Business Consulting</span>
                    </h2>
                    <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                      Advanced AI technology combined with expert human guidance for 
                      intelligent business decisions and strategic international expansion
                    </p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div>
                      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 shadow-xl">
                        <div className="bg-white rounded-xl p-6 shadow-lg mb-6">
                          <div className="flex items-center space-x-3 mb-4">
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                              <Zap className="w-4 h-4 text-white" />
                            </div>
                            <span className="font-semibold text-gray-900">AI Oracle Assistant</span>
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                          </div>
                          <div className="space-y-3">
                            <div className="bg-blue-50 rounded-lg p-3">
                              <p className="text-sm text-blue-800">
                                Hello! I can help you find the perfect jurisdiction for your business. What type of company are you looking to establish?
                              </p>
                            </div>
                            <div className="bg-gray-100 rounded-lg p-3 ml-8">
                              <p className="text-sm text-gray-700">
                                I want to start a tech company with international clients
                              </p>
                            </div>
                            <div className="bg-blue-50 rounded-lg p-3">
                              <p className="text-sm text-blue-800">
                                Based on your needs, I recommend Estonia (EU access), Georgia (1% tax), or UAE (0% tax). Would you like detailed comparisons?
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="text-center">
                          <Button
                            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold px-6 py-3"
                            onClick={() => {
                              window.location.href = '/ai-experience';
                            }}
                          >
                            Try AI Assistant Now
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-xl flex items-center justify-center">
                          <CheckCircle className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">Intelligent Business Guidance</h3>
                          <p className="text-gray-600">AI-powered recommendations tailored to your specific business needs and goals</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                          <Users className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">Expert Human Support</h3>
                          <p className="text-gray-600">Local specialists in each jurisdiction provide hands-on guidance and support</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                          <Shield className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">Comprehensive Solutions</h3>
                          <p className="text-gray-600">End-to-end business formation with ongoing compliance and optimization</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Fidelkey Promotional Section */}
              <section className="py-12 relative">
                <div className="text-center mb-8">
                  <h2 className="text-xl font-bold text-gray-900 mb-3">
                    Looking for secure, property-backed investment opportunities?
                  </h2>
                </div>

                <Card hover className="max-w-2xl mx-auto overflow-hidden group relative text-white border-2 border-teal-200 hover:border-teal-300 transition-all duration-500 transform hover:scale-[1.02] hover:shadow-2xl">
                  {/* Rotating Background Images */}
                  <div className="absolute inset-0 opacity-80">
                    {[
                      'https://images.pexels.com/photos/3483098/pexels-photo-3483098.jpeg?auto=compress&cs=tinysrgb&w=1200', // Real estate investment
                      'https://images.pexels.com/photos/259027/pexels-photo-259027.jpeg?auto=compress&cs=tinysrgb&w=1200', // Banking/finance
                      'https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg?auto=compress&cs=tinysrgb&w=1200', // Financial charts
                      'https://images.pexels.com/photos/1388030/pexels-photo-1388030.jpeg?auto=compress&cs=tinysrgb&w=1200', // Modern architecture
                    ].map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt="Investment background"
                        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-2000 ${
                          Math.floor(Date.now() / 4000) % 4 === index ? 'opacity-100' : 'opacity-0'
                        }`}
                        style={{
                          animationDelay: `${index * 4}s`,
                          animation: 'fadeInOut 16s infinite'
                        }}
                      />
                    ))}
                  </div>

                  {/* Dark Overlay for Text Readability */}
                  <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-black/70"></div>

                  {/* Animated Background Pattern */}
                  <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-2 left-2 w-8 h-8 border border-teal-300 rounded-full animate-pulse"></div>
                    <div className="absolute bottom-2 right-2 w-6 h-6 border border-blue-300 rounded-lg rotate-45 animate-pulse delay-1000"></div>
                    <div className="absolute top-1/2 left-1/4 w-4 h-4 border border-emerald-300 rounded-full animate-bounce delay-500"></div>
                  </div>

                  {/* Floating Property Icons */}
                  <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
                    <div className="absolute top-3 right-3 text-xl animate-float">🏠</div>
                    <div className="absolute top-4 left-3 text-lg animate-float-delayed">🏢</div>
                    <div className="absolute bottom-3 right-1/3 text-lg animate-bounce delay-1000">🏗️</div>
                    <div className="absolute bottom-4 left-1/3 text-base animate-pulse delay-500">💎</div>
                  </div>

                  <Card.Body className="p-6 relative z-10">
                    <div className="text-center">
                      <div className="flex items-center justify-center space-x-3 mb-6">
                        <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-xl">
                          <Home className="w-4 h-4 text-white" />
                        </div>
                        <div className="text-2xl animate-bounce">🏠</div>
                      </div>
                      
                      <h2 className="text-xl md:text-2xl font-bold mb-3 leading-tight">
                        Mortgaged Title-Deed
                        <br />
                        <span className="bg-gradient-to-r from-yellow-300 via-orange-300 to-pink-300 bg-clip-text text-transparent">
                          Investment Platform
                        </span>
                      </h2>
                      
                      <p className="text-sm text-gray-100 mb-4 leading-relaxed max-w-xl mx-auto">
                        Secure, property-backed investment opportunities with guaranteed returns. 
                        Invest in real estate through innovative mortgage-backed securities.
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                        {[
                          { icon: '🛡️', text: 'Property-backed security' },
                          { icon: '📈', text: 'Guaranteed returns' },
                          { icon: '🌍', text: 'Global real estate access' }
                        ].map((feature, index) => (
                          <div key={index} className="flex items-center space-x-3 group">
                            <div className="w-6 h-6 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                              <span className="text-sm">{feature.icon}</span>
                            </div>
                            <span className="text-gray-100 font-medium group-hover:text-yellow-300 transition-colors duration-300 text-sm">
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
                      
                      <p className="text-xs text-gray-300 mt-2">
                        Powered by <span className="font-semibold text-white">Fidelkey.com</span>
                      </p>
                    </div>
                  </Card.Body>
                </Card>
              </section>              
              
              {/* Blog Section */}
              <section className="py-14 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="text-center mb-12">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                      Latest Insights & Guides
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                      Expert articles and insights from our global network of advisors
                    </p>
                  </div>

                  {blogLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="animate-pulse">
                          <div className="h-40 bg-gray-200 rounded-lg mb-3"></div>
                          <div className="h-3 bg-gray-200 rounded w-3/4 mb-2"></div>
                          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        </div>
                      ))}
                    </div>
                  ) : blogPosts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {blogPosts.slice(0, 4).map((post) => (
                        <Card key={post.id} hover className="overflow-hidden h-full">
                          <div className="relative">
                            <img
                              src={post.featured_image_url || 'https://images.pexels.com/photos/4386321/pexels-photo-4386321.jpeg?auto=compress&cs=tinysrgb&w=800'}
                              alt={getLocalizedContent(post.title_i18n, 'title', 'Blog Post')}
                              className="w-full h-40 object-cover"
                            />
                            <div className="absolute top-3 left-3">
                              <span className="bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                                {post.category}
                              </span>
                            </div>
                          </div>
                          
                          <Card.Body className="p-4">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                              {getLocalizedContent(post.title_i18n, 'title', 'Untitled Post')}
                            </h3>
                            
                            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                              {getLocalizedContent(post.excerpt_i18n, 'excerpt', 'No excerpt available')}
                            </p>
                            
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center space-x-2 text-xs text-gray-500">
                                <div className="flex items-center">
                                  <User className="w-3 h-3 mr-1" />
                                  <span>{post.author?.full_name}</span>
                                </div>
                                <div className="flex items-center">
                                  <Calendar className="w-3 h-3 mr-1" />
                                  <span>{new Date(post.published_at).toLocaleDateString()}</span>
                                </div>
                              </div>
                            </div>
                            
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="w-full text-xs"
                              icon={ArrowRight}
                              iconPosition="right"
                            >
                              Read More
                            </Button>
                          </Card.Body>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <Card className="max-w-md mx-auto">
                      <Card.Body className="text-center py-8">
                        <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          No Blog Posts Yet
                        </h3>
                        <p className="text-gray-600 text-sm">
                          Our experts will be publishing insights soon. Check back later!
                        </p>
                      </Card.Body>
                    </Card>
                  )}

                  <div className="text-center mt-8">
                    <Button 
                      variant="outline" 
                      size="md"
                      icon={ArrowRight}
                      iconPosition="right"
                      onClick={() => window.location.href = '/blog'}
                    >
                      View All Articles
                    </Button>
                  </div>
                </div>
              </section>

              {/* CTA Section */}
              <section className="py-20 bg-gradient-to-r from-blue-600 to-teal-600 text-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                  <h2 className="text-3xl md:text-4xl font-bold mb-6">
                    Ready to Expand Your Business Globally?
                  </h2>
                  <p className="text-xl mb-8 text-blue-100">
                    Join thousands of successful entrepreneurs who trust our AI-powered platform for their international expansion
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button 
                      size="lg" 
                      className="bg-blue text-blue-600 hover:bg-transparent-100 font-bold px-8 py-4 text-lg"
                      onClick={() => window.location.href = '/ai-recommendations'}
                    >
                      Get AI Recommendations
                    </Button>
                    <Button 
                      size="lg" 
                      variant="outline" 
                      className="border-blue text-orange hover:bg-transparent hover:text-blue-600 font-semibold px-8 py-4 text-lg"
                      onClick={() => window.location.href = '/contact'}
                    >
                      Talk to Expert
                    </Button>
                    <Link to="/order-form" className="text-blue-600 hover:text-blue-700 font-semibold">
                    </Link>
                  </div>
                </div>
              </section>
            </div>
          );
        })()}
      </div>

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

      <Footer />
      
      {/* AI Agent Icon */}
      <AIAgentIcon />
    </>
  );
};

export default HomePage;