import React, { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle, Clock, DollarSign, FileText, Users, Shield, Plane, Globe, MessageSquare, Calendar, Home, Bot, Zap, Target, BarChart3, ChevronDown, Eye, Building, MapPin, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useLanguage } from '../../lib/language';
import { Button, Card } from '../../lib/ui';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const VisaResidencyPage = () => {
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
  const immigrationBackgroundImages = [
    'https://images.pexels.com/photos/1591447/pexels-photo-1591447.jpeg?auto=compress&cs=tinysrgb&w=800', // Passport and travel
    'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=800', // Business meeting
    'https://images.pexels.com/photos/1388030/pexels-photo-1388030.jpeg?auto=compress&cs=tinysrgb&w=800', // European architecture
    'https://images.pexels.com/photos/2265876/pexels-photo-2265876.jpeg?auto=compress&cs=tinysrgb&w=800', // Modern city skyline
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % immigrationBackgroundImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [immigrationBackgroundImages.length]);

  const serviceHighlights = [
    {
      icon: Globe,
      title: 'Golden Visa & Citizenship by Investment',
      description: 'Access to premium investment-based residency and citizenship programs',
      color: 'from-amber-500 to-orange-500',
    },
    {
      icon: Users,
      title: 'Entrepreneur & Startup Visas',
      description: 'Business and innovation visa programs for entrepreneurs and startups',
      color: 'from-red-500 to-pink-500',
    },
    {
      icon: Zap,
      title: 'Digital Nomad Programs',
      description: 'Remote work visas and digital nomad-friendly residency options',
      color: 'from-orange-500 to-amber-500',
    },
    {
      icon: Bot,
      title: 'AI-Supported Multilingual Guidance',
      description: 'Instant communication in your language with AI-powered assistance',
      color: 'from-purple-500 to-pink-500',
    },
  ];

  const whyChooseUs = [
    {
      icon: Users,
      title: 'Local Expertise',
      description: 'Licensed immigration partners in each jurisdiction with deep local knowledge.',
    },
    {
      icon: Bot,
      title: 'AI Advantage',
      description: 'Instant communication in your own language with real-time AI translation.',
    },
    {
      icon: Zap,
      title: 'Faster Process',
      description: 'Streamlined applications with expert oversight and proactive monitoring.',
    },
    {
      icon: Shield,
      title: 'Comprehensive Support',
      description: 'From eligibility assessment to final approval and family inclusion.',
    },
  ];

  const visaPrograms = [
    {
      title: 'Golden Visa Programs',
      description: 'Real estate, government bonds investment programs',
      icon: DollarSign,
      color: 'from-amber-500 to-orange-500',
      features: ['Real estate investment', 'Government bonds', 'Business investment', 'Family inclusion'],
      countries: ['Portugal', 'Spain', 'Malta', 'Greece'],
      investment: '$280K - $500K',
      processing: '3-6 months',
    },
    {
      title: 'Entrepreneur Visas',
      description: 'Business setup and innovation fund programs',
      icon: Target,
      color: 'from-red-500 to-pink-500',
      features: ['Business plan required', 'Innovation funds', 'Job creation', 'Mentorship programs'],
      countries: ['Canada', 'UK', 'Netherlands', 'Australia'],
      investment: '$50K - $200K',
      processing: '4-8 months',
    },
    {
      title: 'Digital Nomad Visas',
      description: 'Remote work and location independence programs',
      icon: Plane,
      color: 'from-orange-500 to-amber-500',
      features: ['Remote work allowed', 'Tax benefits', 'Flexible requirements', 'Fast processing'],
      countries: ['Estonia', 'Portugal', 'Dubai', 'Barbados'],
      investment: 'Income requirement',
      processing: '2-4 weeks',
    },
    {
      title: 'Citizenship Programs',
      description: 'Investment-based citizenship and passport programs',
      icon: Home,
      color: 'from-purple-500 to-pink-500',
      features: ['Full citizenship', 'Passport benefits', 'No residency requirement', 'Family inclusion'],
      countries: ['Malta', 'Caribbean', 'Vanuatu', 'Turkey'],
      investment: '$150K - $1M+',
      processing: '6-12 months',
    },
  ];

  const processSteps = [
    {
      step: 1,
      title: 'Eligibility Assessment',
      description: 'Review visa eligibility',
      duration: '1–2 days',
      detail: 'Comprehensive review of your eligibility for various visa and residency programs',
    },
    {
      step: 2,
      title: 'Program Selection',
      description: 'Recommend best program',
      duration: '1–2 days',
      detail: 'Recommend optimal visa/residency program based on your goals and situation',
    },
    {
      step: 3,
      title: 'Document Collection',
      description: 'Gather required docs',
      duration: '1–2 weeks',
      detail: 'Gather and prepare all required documentation and supporting materials',
    },
    {
      step: 4,
      title: 'Application Preparation',
      description: 'Prepare forms',
      duration: '3–5 days',
      detail: 'Complete application forms and prepare supporting materials',
    },
    {
      step: 5,
      title: 'Submission & Processing',
      description: 'Monitor status',
      duration: '2–12 weeks',
      detail: 'Submit application and monitor processing status with regular updates',
    },
    {
      step: 6,
      title: 'Approval & Follow-up',
      description: 'Final requirements',
      duration: '1–2 days',
      detail: 'Receive approval and complete final requirements for visa/residency',
    },
  ];

  const serviceFeatures = [
    'Visa eligibility assessment',
    'Residence permit application assistance',
    'Golden visa/citizenship program guidance',
    'Document preparation and review',
    'Application submission and tracking',
    'Interview preparation and support',
    'Renewal and maintenance services',
    'Family inclusion support',
  ];

  const faqs = [
    {
      question: 'What\'s the difference between a visa and residence permit?',
      answer: 'A visa allows temporary entry to a country, while a residence permit allows you to live there for extended periods. Residence permits often lead to permanent residency or citizenship.',
    },
    {
      question: 'How long do visa applications typically take?',
      answer: 'Processing times vary significantly by country and visa type, ranging from 2 weeks for tourist visas to 6-12 months for investment-based residency programs.',
    },
    {
      question: 'Can my family be included in my visa application?',
      answer: 'Most residency and investment programs allow inclusion of spouse and dependent children. Some programs also include parents or other family members.',
    },
    {
      question: 'What are the tax implications of obtaining residency?',
      answer: 'Tax implications vary by country and your specific situation. We provide comprehensive tax planning to optimize your global tax position with new residency.',
    },
    {
      question: 'Do I need to live in the country to maintain my residency?',
      answer: 'Requirements vary by program. Some require minimal physical presence (7-14 days annually), while others have no residency requirements for investment-based programs.',
    },
    {
      question: 'Can residency lead to citizenship?',
      answer: 'Many residency programs provide a pathway to citizenship after 3-10 years, depending on the country and program requirements.',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Your Global Pathway to Residency & Citizenship - Visa & Residency Services - Consulting19</title>
        <meta name="description" content="Professional immigration and residency planning services. Expert guidance for golden visas, entrepreneur programs, and citizenship by investment opportunities." />
      </Helmet>

      <Navbar />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-red-600 via-orange-600 to-amber-600 text-white py-10 mt-16 overflow-hidden">
        {/* Rotating Background Images */}
        <div className="absolute inset-0 opacity-15">
          {immigrationBackgroundImages.map((image, index) => (
            <img
              key={index}
              src={image}
              alt="Immigration background"
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
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-amber-400/5 rounded-full blur-2xl"></div>
        </div>

        {/* Floating Immigration Icons */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-1/4 text-4xl animate-float">🛂</div>
          <div className="absolute top-32 right-1/4 text-3xl animate-float-delayed">✈️</div>
          <div className="absolute bottom-20 left-1/3 text-3xl animate-bounce delay-1000">🏠</div>
          <div className="absolute bottom-32 right-1/3 text-2xl animate-pulse delay-500">🌍</div>
        </div>

        {/* Animated World Map Pattern */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-r from-red-800/20 via-orange-800/20 to-amber-800/20">
          <svg className="w-full h-full" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <defs>
              <pattern id="worldPattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                <circle cx="20" cy="20" r="2" fill="currentColor" opacity="0.3" className="animate-pulse" />
              </pattern>
            </defs>
            <path d="M0,60 C300,120 900,0 1200,60 L1200,120 L0,120 Z" fill="url(#worldPattern)" className="text-white/10"></path>
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
                <Plane className="w-6 h-6 text-white" />
                <div className="absolute inset-0 bg-gradient-to-r from-red-400/30 via-orange-400/30 to-amber-400/30 rounded-xl blur-md animate-pulse"></div>
              </div>
            </div>
            
            <h1 className="text-2xl md:text-4xl font-bold mb-4 leading-tight animate-fade-in">
              Your Global Pathway to
              <br />
              <span className="bg-gradient-to-r from-yellow-300 via-orange-300 to-pink-300 bg-clip-text text-transparent animate-gradient">
                Residency & Citizenship
              </span>
            </h1>
            
            <p className="text-lg text-red-100 mb-6 leading-relaxed max-w-3xl mx-auto animate-fade-in-up delay-200">
              Professional immigration and residency planning – powered by AI, trusted local experts, and investment opportunities.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6 animate-fade-in-up delay-300">
              <Link to="/auth?mode=register">
                <Button 
                  size="md" 
                  className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-bold px-8 py-3 text-base shadow-xl border-0 transform hover:scale-105 transition-all duration-300"
                >
                  Join to Start Visa Application
                </Button>
              </Link>
              <Button 
                size="md" 
                className="bg-white/20 backdrop-blur-sm text-white border-2 border-white/30 hover:bg-white/30 font-semibold px-8 py-3 text-base transition-all duration-300"
              >
                Join for Immigration Assessment
              </Button>
            </div>

            {/* Trust Badge */}
            <div className="inline-flex items-center bg-white/20 backdrop-blur-sm rounded-full px-6 py-2 shadow-lg border border-white/30 animate-fade-in-up delay-400">
              <Globe className="w-5 h-5 text-amber-300 mr-2" />
              <span className="text-white font-medium">19+ Countries</span>
              <span className="mx-3 text-white/60">•</span>
              <Home className="w-5 h-5 text-red-300 mr-2" />
              <span className="text-white font-medium">Golden Visa & Citizenship Programs</span>
              <span className="mx-3 text-white/60">•</span>
              <Bot className="w-5 h-5 text-orange-300 mr-2" />
              <span className="text-white font-medium">AI Guidance</span>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Service Highlights */}
        <section className="py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {serviceHighlights.map((highlight, index) => (
              <Card key={index} hover className="text-center border-2 border-gray-100 hover:border-red-200 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl group relative overflow-hidden">
                <Card.Body className="py-10 relative z-10">
                  {/* Animated background gradient on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${highlight.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
                  
                  {/* Glowing outline effect */}
                  <div className={`absolute inset-0 bg-gradient-to-r ${highlight.color} opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500`}></div>
                  
                  <div className={`w-20 h-20 bg-gradient-to-r ${highlight.color} rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 relative`}>
                    <highlight.icon className="w-10 h-10 text-white" />
                    <div className={`absolute inset-0 bg-gradient-to-r ${highlight.color} rounded-3xl blur-lg opacity-60 group-hover:opacity-100 transition-opacity duration-500`}></div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-red-700 transition-colors duration-300">{highlight.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{highlight.description}</p>
                </Card.Body>
              </Card>
            ))}
          </div>
        </section>

        {/* Why Consulting19 for Immigration? */}
        <section className="py-20 bg-gradient-to-br from-gray-50 via-red-50 to-orange-50 rounded-3xl mb-16 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-8 left-8 w-32 h-32 border-2 border-red-300 rounded-full animate-pulse"></div>
            <div className="absolute bottom-8 right-8 w-24 h-24 border-2 border-orange-300 rounded-lg rotate-45 animate-pulse delay-1000"></div>
            <div className="absolute top-1/2 left-1/4 w-16 h-16 border border-amber-300 rounded-full animate-bounce delay-500"></div>
          </div>

          <div className="relative max-w-6xl mx-auto px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Why <span className="text-red-600">Consulting19</span> for Immigration?
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Advanced immigration consulting with AI-powered communication
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-10">
                {whyChooseUs.map((reason, index) => (
                  <div key={index} className="flex items-start space-x-6 group">
                    <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                      <reason.icon className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-red-700 transition-colors duration-300">{reason.title}</h3>
                      <p className="text-gray-600 leading-relaxed text-lg">{reason.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* AI Immigration Communication Illustration */}
              <div className="relative">
                <div className="bg-gradient-to-br from-red-50 via-orange-50 to-amber-50 rounded-3xl p-10 shadow-2xl border-2 border-red-100 relative overflow-hidden">
                  {/* Animated background elements */}
                  <div className="absolute top-6 right-6 w-24 h-24 bg-gradient-to-r from-red-200/30 to-orange-200/30 rounded-full blur-xl animate-pulse"></div>
                  <div className="absolute bottom-6 left-6 w-20 h-20 bg-gradient-to-r from-orange-200/30 to-amber-200/30 rounded-full blur-lg animate-pulse delay-1000"></div>
                  
                  <div className="text-center mb-8 relative z-10">
                    <div className="w-20 h-20 bg-gradient-to-r from-red-600 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl">
                      <Bot className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">AI Immigration Assistant</h3>
                    <p className="text-red-700">Multilingual immigration guidance</p>
                  </div>
                  
                  <div className="space-y-6 relative z-10">
                    <div className="bg-white rounded-2xl p-6 shadow-xl border border-red-100 relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-gray-700">🇺🇸 Client (English)</span>
                        <span className="text-xs text-blue-600">English</span>
                      </div>
                      <div className="text-sm text-gray-800">"I need help with golden visa application"</div>
                    </div>
                    
                    <div className="flex justify-center">
                      <div className="w-16 h-16 bg-gradient-to-r from-red-500 via-orange-500 to-amber-500 rounded-full flex items-center justify-center shadow-xl animate-pulse">
                        <Bot className="w-8 h-8 text-white" />
                      </div>
                    </div>
                    
                    <div className="bg-white rounded-2xl p-6 shadow-xl border border-orange-100 relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-orange-500"></div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-gray-700">🇵🇹 Expert (Portuguese)</span>
                        <span className="text-xs text-orange-600">Portuguese</span>
                      </div>
                      <div className="text-sm text-gray-800">"Posso ajudar com o visto dourado"</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Visa & Residency Programs (Interactive Cards) */}
        <section className="py-20 relative">
          {/* Animated World Map Grid Background */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 25% 25%, #dc2626 3px, transparent 3px),
                               radial-gradient(circle at 75% 75%, #ea580c 3px, transparent 3px)`,
              backgroundSize: '60px 60px',
              animation: 'moveGrid 20s linear infinite'
            }}></div>
          </div>

          <div className="relative">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Visa & Residency <span className="text-red-600">Programs</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Interactive program cards with comprehensive coverage
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {visaPrograms.map((program, index) => (
                <Card key={index} hover className="text-center group cursor-pointer transform hover:scale-105 transition-all duration-500 hover:shadow-2xl border-2 border-gray-100 hover:border-red-200 relative overflow-hidden">
                  <Card.Body className="py-10 relative z-10">
                    {/* Animated background gradient on hover */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${program.color} opacity-0 group-hover:opacity-15 transition-opacity duration-500`}></div>
                    
                    {/* Glowing effect */}
                    <div className={`absolute inset-0 bg-gradient-to-r ${program.color} opacity-0 group-hover:opacity-30 blur-2xl transition-opacity duration-500`}></div>
                    
                    <div className={`w-20 h-20 bg-gradient-to-r ${program.color} rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 relative`}>
                      <program.icon className="w-10 h-10 text-white" />
                      <div className={`absolute inset-0 bg-gradient-to-r ${program.color} rounded-3xl blur-lg opacity-60 group-hover:opacity-100 transition-opacity duration-500`}></div>
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-red-700 transition-colors duration-300">{program.title}</h3>
                    <p className="text-gray-600 leading-relaxed mb-6">{program.description}</p>
                    
                    <div className="space-y-2 mb-6">
                      {program.features.map((feature, i) => (
                        <div key={i} className="text-sm text-gray-700 flex items-center">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="space-y-2 text-xs text-gray-500">
                      <div className="flex justify-between">
                        <span><strong>Investment:</strong></span>
                        <span>{program.investment}</span>
                      </div>
                      <div className="flex justify-between">
                        <span><strong>Processing:</strong></span>
                        <span>{program.processing}</span>
                      </div>
                      <div className="text-center mt-3">
                        <strong>Available in:</strong> {program.countries.join(', ')}
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Application Process (Timeline Animation) */}
        <section className="py-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Application <span className="text-red-600">Process</span>
            </h2>
            <p className="text-xl text-gray-600">
              Step-by-step timeline with scroll animation
            </p>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-2 h-full bg-gradient-to-b from-red-500 via-orange-500 to-amber-500 rounded-full hidden lg:block shadow-lg"></div>
            
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
                    <Card className="inline-block group hover:shadow-2xl transition-all duration-500 transform hover:scale-105 border-2 border-gray-100 hover:border-red-200">
                      <Card.Body className="py-8 px-10 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-red-50 to-orange-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="relative">
                          <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-red-700 transition-colors duration-300">{step.title}</h3>
                          <p className="text-gray-600 mb-4 text-lg">{step.detail}</p>
                          <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                            <Clock className="w-5 h-5" />
                            <span className="font-medium text-lg">{step.duration}</span>
                          </div>
                        </div>
                      </Card.Body>
                    </Card>
                  </div>
                  
                  <div className={`relative z-10 w-20 h-20 bg-gradient-to-r from-red-600 via-orange-600 to-amber-600 text-white rounded-full flex items-center justify-center font-bold text-xl shadow-2xl transform transition-all duration-700 ${
                    visibleSteps.includes(index) ? 'scale-100 rotate-0' : 'scale-75 rotate-45'
                  }`}>
                    {step.step}
                    {/* Immigration pulse animation for active step */}
                    <div className="absolute inset-0 bg-gradient-to-r from-red-400 to-orange-400 rounded-full animate-ping opacity-30"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-amber-400 rounded-full animate-pulse opacity-20"></div>
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
              backgroundImage: `linear-gradient(45deg, #dc2626 25%, transparent 25%),
                               linear-gradient(-45deg, #dc2626 25%, transparent 25%),
                               linear-gradient(45deg, transparent 75%, #ea580c 75%),
                               linear-gradient(-45deg, transparent 75%, #ea580c 75%)`,
              backgroundSize: '30px 30px',
              backgroundPosition: '0 0, 0 15px, 15px -15px, -15px 0px',
              animation: 'moveGrid 20s linear infinite'
            }}></div>
          </div>

          <div className="relative">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                What's <span className="text-red-600">Included</span>
              </h2>
              <p className="text-xl text-gray-600">
                Comprehensive immigration services with premium support
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {serviceFeatures.map((feature, index) => (
                <Card key={index} className="text-center hover:shadow-2xl transition-all duration-500 transform hover:scale-110 group border-2 border-gray-100 hover:border-red-200 relative overflow-hidden">
                  <Card.Body className="py-8 relative z-10">
                    {/* Glowing gradient outline on hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-orange-500 opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500"></div>
                    
                    <div className="relative">
                      <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl transform group-hover:scale-125 group-hover:rotate-12 transition-all duration-500">
                        <CheckCircle className="w-8 h-8 text-white" />
                      </div>
                      <p className="text-gray-700 font-semibold leading-relaxed group-hover:text-red-700 transition-colors duration-300">{feature}</p>
                    </div>
                  </Card.Body>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section (Accordion with Smooth Expand) */}
        <section className="py-20 relative">
          {/* Moving red-orange grid background */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 20% 20%, #dc2626 2px, transparent 2px),
                               radial-gradient(circle at 80% 80%, #ea580c 2px, transparent 2px)`,
              backgroundSize: '50px 50px',
              animation: 'moveGrid 25s linear infinite reverse'
            }}></div>
          </div>

          <div className="relative">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Frequently Asked <span className="text-red-600">Questions</span>
              </h2>
              <p className="text-xl text-gray-600">
                Get answers to common immigration questions
              </p>
            </div>

            <div className="max-w-4xl mx-auto space-y-6">
              {faqs.map((faq, index) => (
                <Card key={index} className="hover:shadow-2xl transition-all duration-500 border-2 border-gray-100 hover:border-red-200 group">
                  <Card.Body>
                    <button
                      onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                      className="w-full text-left"
                    >
                      <div className="flex items-center justify-between py-4">
                        <h3 className="text-xl font-bold text-gray-900 pr-6 group-hover:text-red-700 transition-colors duration-300">{faq.question}</h3>
                        <div className={`w-10 h-10 bg-red-100 rounded-full flex items-center justify-center transition-all duration-500 ${
                          expandedFaq === index ? 'bg-red-600 rotate-180' : 'group-hover:bg-red-200'
                        }`}>
                          <ChevronDown className={`w-6 h-6 transition-all duration-500 ${
                            expandedFaq === index ? 'text-white' : 'text-red-600'
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
          <div className="bg-gradient-to-r from-red-600 via-orange-600 to-amber-600 rounded-3xl text-white p-16 text-center relative overflow-hidden">
            {/* Animated glowing passport icons */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-8 left-8 text-4xl animate-pulse">🛂</div>
              <div className="absolute top-12 right-12 text-3xl animate-pulse delay-1000">✈️</div>
              <div className="absolute bottom-8 left-12 text-3xl animate-bounce delay-500">🏠</div>
              <div className="absolute bottom-12 right-8 text-2xl animate-pulse delay-1500">🌍</div>
            </div>

            {/* Animated Wave Pattern */}
            <div className="absolute inset-0 opacity-20">
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1000 1000" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="immigrationWaveGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#dc2626" stopOpacity="0.3" />
                    <stop offset="50%" stopColor="#ea580c" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.1" />
                  </linearGradient>
                </defs>
                <path d="M0,300 Q250,200 500,300 T1000,300 L1000,1000 L0,1000 Z" fill="url(#immigrationWaveGradient)" className="animate-pulse">
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
                Ready to Start Your <span className="text-yellow-300">Immigration Journey</span>?
              </h2>
              <p className="text-xl text-red-100 mb-8 max-w-3xl mx-auto">
                Get expert guidance for visa applications, residency programs, and citizenship opportunities worldwide. 
                Professional support from eligibility to approval.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Link to="/auth?mode=register">
                  <Button 
                    className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-bold px-10 py-4 text-lg shadow-2xl border-0 transform hover:scale-105 transition-all duration-300"
                  >
                    Join to Start Visa Application
                  </Button>
                </Link>
                <Button 
                  size="lg"
                  className="bg-white/20 backdrop-blur-sm text-white border-2 border-white/30 hover:bg-white/30 font-semibold px-10 py-4 text-lg transition-all duration-300"
                >
                  Join for Immigration Assessment
                </Button>
              </div>
              
              <div className="mt-8 flex items-center justify-center space-x-8 text-red-100">
                <div className="flex items-center space-x-2">
                  <Plane className="w-6 h-6" />
                  <span>Visa Applications</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Home className="w-6 h-6" />
                  <span>Residency Programs</span>
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

export default VisaResidencyPage;