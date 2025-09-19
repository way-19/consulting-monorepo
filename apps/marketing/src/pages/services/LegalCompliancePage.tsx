import React, { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle, Clock, DollarSign, FileText, Users, Shield, Scale, Globe, MessageSquare, Calendar, AlertTriangle, Bot, Zap, Target, BarChart3, ChevronDown, Eye, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useLanguage } from '../../lib/language';
import { Button, Card } from '../../lib/ui';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const LegalCompliancePage = () => {
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
      icon: Shield,
      title: 'Comprehensive Legal Protection',
      description: 'Full coverage across all areas of business law and compliance',
      color: 'from-red-500 to-orange-500',
    },
    {
      icon: Bot,
      title: 'AI Assistant & Real-Time Updates',
      description: 'Instant alerts when regulations change in your jurisdiction',
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: Zap,
      title: 'Faster Risk Identification',
      description: 'Proactive monitoring prevents compliance issues before they occur',
      color: 'from-orange-500 to-yellow-500',
    },
    {
      icon: Globe,
      title: 'Local Legal Experts in 19+ Countries',
      description: 'Licensed legal professionals in every jurisdiction we serve',
      color: 'from-green-500 to-emerald-500',
    },
  ];

  const whyChooseUs = [
    {
      icon: Eye,
      title: 'Proactive Monitoring',
      description: 'AI alerts you when regulations change in your jurisdiction.',
    },
    {
      icon: Users,
      title: 'Local Expertise',
      description: 'We partner with licensed legal firms in each country.',
    },
    {
      icon: Shield,
      title: 'Full Coverage',
      description: 'From corporate governance to GDPR and labor law, we handle all areas.',
    },
    {
      icon: Lock,
      title: 'Trusted & Secure',
      description: 'Your compliance data is fully protected and constantly monitored.',
    },
  ];

  const complianceAreas = [
    {
      title: 'Corporate Governance',
      description: 'Board resolutions, annual filings, shareholder rights',
      icon: Users,
      color: 'from-blue-500 to-cyan-500',
      requirements: ['Board meetings', 'Annual filings', 'Corporate records', 'Shareholder rights'],
    },
    {
      title: 'Regulatory Compliance',
      description: 'Industry standards, audits, reporting',
      icon: Shield,
      color: 'from-green-500 to-teal-500',
      requirements: ['License maintenance', 'Regulatory reporting', 'Industry standards', 'Audit compliance'],
    },
    {
      title: 'Data Protection',
      description: 'GDPR, privacy, breach prevention',
      icon: FileText,
      color: 'from-purple-500 to-pink-500',
      requirements: ['Privacy policies', 'Data processing', 'Security measures', 'Breach procedures'],
    },
    {
      title: 'Employment Law',
      description: 'Contracts, labor standards, benefits compliance',
      icon: Scale,
      color: 'from-orange-500 to-red-500',
      requirements: ['Employment contracts', 'Labor standards', 'Benefits compliance', 'Termination procedures'],
    },
  ];

  const processSteps = [
    {
      step: 1,
      title: 'Legal Risk Assessment',
      description: 'Review compliance needs',
      duration: '2–3 days',
      detail: 'Comprehensive review of your legal compliance requirements',
    },
    {
      step: 2,
      title: 'Framework Design',
      description: 'Tailor compliance framework',
      duration: '3–5 days',
      detail: 'Design customized compliance framework for your business',
    },
    {
      step: 3,
      title: 'Legal Documentation',
      description: 'Draft & review documents',
      duration: '1–2 weeks',
      detail: 'Prepare and review all necessary legal documentation',
    },
    {
      step: 4,
      title: 'Implementation Support',
      description: 'Apply procedures & training',
      duration: '1 week',
      detail: 'Implement compliance procedures and train your team',
    },
    {
      step: 5,
      title: 'Monitoring Setup',
      description: 'Reporting + audit systems',
      duration: '2–3 days',
      detail: 'Establish ongoing monitoring and reporting systems',
    },
    {
      step: 6,
      title: 'Ongoing Support',
      description: 'Continuous monitoring & updates',
      duration: 'Ongoing',
      detail: 'Continuous legal support and compliance updates',
    },
  ];

  const serviceFeatures = [
    'Comprehensive compliance monitoring',
    'Contract review and drafting',
    'Legal structure optimization',
    'Intellectual property protection',
    'Data protection compliance (GDPR)',
    'Employment law guidance',
    'Regulatory change monitoring',
    'Legal risk assessment',
  ];

  const faqs = [
    {
      question: 'What legal compliance requirements apply to international businesses?',
      answer: 'Requirements vary by jurisdiction but typically include corporate governance, tax compliance, employment law, data protection, and industry-specific regulations.',
    },
    {
      question: 'How do you stay updated with changing regulations?',
      answer: 'We maintain relationships with legal experts in each jurisdiction and use automated monitoring systems to track regulatory changes and updates.',
    },
    {
      question: 'What happens if my business falls out of compliance?',
      answer: 'Non-compliance can result in fines, penalties, or business closure. We provide proactive monitoring and immediate remediation support to prevent issues.',
    },
    {
      question: 'Do you provide legal representation in court?',
      answer: 'We work with qualified local attorneys in each jurisdiction who can provide legal representation when needed. We coordinate all legal proceedings on your behalf.',
    },
    {
      question: 'How much does ongoing legal compliance cost?',
      answer: 'Costs depend on business complexity and jurisdiction requirements. We offer flexible packages from basic compliance monitoring to comprehensive legal support.',
    },
    {
      question: 'Can you help with contract negotiations?',
      answer: 'Yes, we provide contract review, drafting, and negotiation support through our network of qualified legal professionals in each jurisdiction.',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Stay Fully Compliant. Anywhere in the World. - Legal Compliance Services - Consulting19</title>
        <meta name="description" content="Comprehensive legal and regulatory compliance services for international businesses. AI-powered monitoring with global legal specialists." />
      </Helmet>

      <Navbar />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-red-600 via-orange-600 to-purple-600 text-white py-10 mt-16 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-yellow-400/10 rounded-full blur-2xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-orange-400/10 rounded-full blur-xl animate-pulse delay-500"></div>
        </div>

        {/* Floating Legal Icons */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-1/4 text-4xl animate-bounce delay-300">⚖️</div>
          <div className="absolute top-32 right-1/4 text-3xl animate-bounce delay-700">🛡️</div>
          <div className="absolute bottom-20 left-1/3 text-3xl animate-bounce delay-1000">📋</div>
        </div>

        {/* Wave Pattern */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-r from-red-500/20 via-orange-500/20 to-purple-500/20">
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
                <Scale className="w-6 h-6 text-white" />
              </div>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
              Stay Fully Compliant.
              <br />
              <span className="bg-gradient-to-r from-yellow-300 via-orange-300 to-pink-300 bg-clip-text text-transparent">
                Anywhere in the World.
              </span>
            </h1>
            
            <p className="text-lg text-red-100 mb-6 leading-relaxed max-w-4xl mx-auto">
              Comprehensive legal and regulatory compliance services for international businesses – 
              powered by AI and global legal specialists.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
              <Link to="/auth?mode=register">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-bold px-10 py-4 text-lg shadow-2xl border-0 transform hover:scale-105 transition-all duration-300"
                >
                  Join to Start Legal Review
                </Button>
              </Link>
              <Button 
                size="lg" 
                className="bg-white/20 backdrop-blur-sm text-white border-2 border-white/30 hover:bg-white/30 font-semibold px-10 py-4 text-lg transition-all duration-300"
              >
                Free Compliance Consultation
              </Button>
            </div>

            {/* Trust Badge */}
            <div className="inline-flex items-center bg-white/20 backdrop-blur-sm rounded-full px-8 py-3 shadow-lg border border-white/30">
              <Scale className="w-5 h-5 text-orange-300 mr-2" />
              <span className="text-white font-medium">19+ Jurisdictions</span>
              <span className="mx-3 text-white/60">•</span>
              <Bot className="w-5 h-5 text-purple-300 mr-2" />
              <span className="text-white font-medium">AI-Powered Monitoring</span>
              <span className="mx-3 text-white/60">•</span>
              <Shield className="w-5 h-5 text-pink-300 mr-2" />
              <span className="text-white font-medium">Trusted Legal Partners</span>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Service Highlights */}
        <section className="py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {serviceHighlights.map((highlight, index) => (
              <Card key={index} hover className="text-center border-2 border-gray-100 hover:border-red-200 transition-all duration-300 transform hover:scale-105 hover:shadow-xl group">
                <Card.Body className="py-8 relative overflow-hidden">
                  {/* Background gradient on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${highlight.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
                  
                  <div className={`w-16 h-16 bg-gradient-to-r ${highlight.color} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg transform group-hover:scale-110 transition-transform duration-300`}>
                    <highlight.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-red-700 transition-colors duration-300">{highlight.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{highlight.description}</p>
                </Card.Body>
              </Card>
            ))}
          </div>
        </section>

        {/* Why Consulting19 for Compliance? */}
        <section className="py-16 bg-gradient-to-br from-gray-50 via-red-50 to-orange-50 rounded-3xl mb-16 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-8 left-8 w-32 h-32 border border-red-300 rounded-full animate-pulse"></div>
            <div className="absolute bottom-8 right-8 w-24 h-24 border border-orange-300 rounded-lg rotate-45 animate-pulse delay-1000"></div>
          </div>

          <div className="relative max-w-6xl mx-auto px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Why <span className="text-red-600">Consulting19</span> for Compliance?
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Advanced compliance monitoring with AI-powered protection
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                {whyChooseUs.map((reason, index) => (
                  <div key={index} className="flex items-start space-x-4 group">
                    <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <reason.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-red-700 transition-colors duration-300">{reason.title}</h3>
                      <p className="text-gray-600 leading-relaxed">{reason.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Compliance Dashboard Illustration */}
              <div className="relative">
                <div className="bg-gradient-to-br from-red-50 via-orange-50 to-purple-50 rounded-2xl p-8 shadow-2xl border border-red-100 relative overflow-hidden">
                  {/* Animated background elements */}
                  <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-r from-red-200/30 to-orange-200/30 rounded-full blur-xl animate-pulse"></div>
                  <div className="absolute bottom-4 left-4 w-16 h-16 bg-gradient-to-r from-orange-200/30 to-purple-200/30 rounded-full blur-lg animate-pulse delay-1000"></div>
                  
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">AI Compliance Dashboard</h3>
                    <p className="text-red-700">Real-time compliance monitoring</p>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-white rounded-xl p-4 shadow-lg border border-red-100">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">GDPR Compliance</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                          <span className="text-sm font-bold text-green-600">Compliant</span>
                        </div>
                      </div>
                      <div className="w-full bg-green-100 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full w-full"></div>
                      </div>
                    </div>
                    
                    <div className="bg-white rounded-xl p-4 shadow-lg border border-orange-100">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">Corporate Governance</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
                          <span className="text-sm font-bold text-yellow-600">Review Needed</span>
                        </div>
                      </div>
                      <div className="w-full bg-yellow-100 rounded-full h-2">
                        <div className="bg-yellow-500 h-2 rounded-full w-3/4"></div>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-r from-red-500 to-orange-500 rounded-xl p-4 text-white text-center">
                      <div className="text-sm font-medium mb-1">🚨 AI Alert</div>
                      <div className="text-xs">New regulation update detected</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Compliance Areas */}
        <section className="py-16 relative">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 25% 25%, #dc2626 2px, transparent 2px),
                               radial-gradient(circle at 75% 75%, #ea580c 2px, transparent 2px)`,
              backgroundSize: '50px 50px'
            }}></div>
          </div>

          <div className="relative">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Compliance <span className="text-red-600">Areas</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Comprehensive coverage across all legal domains
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {complianceAreas.map((area, index) => (
                <Card key={index} hover className="text-center group cursor-pointer transform hover:scale-105 transition-all duration-300 hover:shadow-2xl border-2 border-gray-100 hover:border-red-200">
                  <Card.Body className="py-8 relative overflow-hidden">
                    {/* Background gradient on hover */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${area.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                    
                    <div className={`w-16 h-16 bg-gradient-to-r ${area.color} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                      <area.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-red-700 transition-colors duration-300">{area.title}</h3>
                    <p className="text-gray-600 leading-relaxed mb-4">{area.description}</p>
                    
                    <div className="space-y-1">
                      {area.requirements.map((req, i) => (
                        <div key={i} className="text-xs text-gray-700 flex items-center">
                          <CheckCircle className="w-3 h-3 text-green-500 mr-2 flex-shrink-0" />
                          <span>{req}</span>
                        </div>
                      ))}
                    </div>
                  </Card.Body>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Compliance Process Timeline */}
        <section className="py-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Compliance <span className="text-red-600">Process</span>
            </h2>
            <p className="text-xl text-gray-600">
              Step-by-step timeline with AI-powered monitoring
            </p>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-red-500 via-orange-500 to-purple-500 rounded-full hidden lg:block"></div>
            
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
                        <div className="absolute inset-0 bg-gradient-to-br from-red-50 to-orange-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="relative">
                          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-red-700 transition-colors duration-300">{step.title}</h3>
                          <p className="text-gray-600 mb-3">{step.detail}</p>
                          <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                            <Clock className="w-4 h-4" />
                            <span className="font-medium">{step.duration}</span>
                          </div>
                        </div>
                      </Card.Body>
                    </Card>
                  </div>
                  
                  <div className={`relative z-10 w-16 h-16 bg-gradient-to-r from-red-600 via-orange-600 to-purple-600 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-xl transform transition-all duration-500 ${
                    visibleSteps.includes(index) ? 'scale-100 rotate-0' : 'scale-75 rotate-45'
                  }`}>
                    {step.step}
                    {/* Pulse animation for active step */}
                    <div className="absolute inset-0 bg-gradient-to-r from-red-400 to-orange-400 rounded-full animate-ping opacity-20"></div>
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
              backgroundImage: `linear-gradient(45deg, #dc2626 25%, transparent 25%),
                               linear-gradient(-45deg, #dc2626 25%, transparent 25%),
                               linear-gradient(45deg, transparent 75%, #ea580c 75%),
                               linear-gradient(-45deg, transparent 75%, #ea580c 75%)`,
              backgroundSize: '20px 20px',
              backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
            }}></div>
          </div>

          <div className="relative">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                What's <span className="text-red-600">Included</span>
              </h2>
              <p className="text-xl text-gray-600">
                Complete compliance coverage with ongoing monitoring
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {serviceFeatures.map((feature, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-all duration-300 transform hover:scale-105 group border-2 border-gray-100 hover:border-red-200">
                  <Card.Body className="py-6 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-red-50 to-orange-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative">
                      <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                        <CheckCircle className="w-6 h-6 text-white" />
                      </div>
                      <p className="text-gray-700 text-sm font-medium leading-relaxed group-hover:text-red-700 transition-colors duration-300">{feature}</p>
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
              backgroundImage: `radial-gradient(circle at 20% 20%, #dc2626 2px, transparent 2px),
                               radial-gradient(circle at 80% 80%, #ea580c 2px, transparent 2px)`,
              backgroundSize: '40px 40px'
            }}></div>
          </div>

          <div className="relative">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Frequently Asked <span className="text-red-600">Questions</span>
              </h2>
              <p className="text-xl text-gray-600">
                Get answers to common compliance questions
              </p>
            </div>

            <div className="max-w-4xl mx-auto space-y-4">
              {faqs.map((faq, index) => (
                <Card key={index} className="hover:shadow-xl transition-all duration-300 border-2 border-gray-100 hover:border-red-200">
                  <Card.Body>
                    <button
                      onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                      className="w-full text-left"
                    >
                      <div className="flex items-center justify-between py-2">
                        <h3 className="text-lg font-semibold text-gray-900 pr-4 hover:text-red-700 transition-colors duration-300">{faq.question}</h3>
                        <div className={`w-8 h-8 bg-red-100 rounded-full flex items-center justify-center transition-all duration-300 ${
                          expandedFaq === index ? 'bg-red-600 rotate-180' : 'hover:bg-red-200'
                        }`}>
                          <ChevronDown className={`w-5 h-5 transition-all duration-300 ${
                            expandedFaq === index ? 'text-white' : 'text-red-600'
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
          <div className="bg-gradient-to-r from-red-600 via-orange-600 to-purple-600 rounded-3xl text-white p-12 text-center relative overflow-hidden">
            {/* Animated Wave Pattern */}
            <div className="absolute inset-0 opacity-20">
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1000 1000" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#dc2626" stopOpacity="0.3" />
                    <stop offset="50%" stopColor="#ea580c" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#a855f7" stopOpacity="0.1" />
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
              {/* Floating shield icons */}
              <div className="absolute top-4 left-4 text-2xl animate-pulse">🛡️</div>
              <div className="absolute top-4 right-4 text-2xl animate-pulse delay-1000">⚖️</div>
              
              <h2 className="text-4xl font-bold mb-4">Ready to Ensure Legal Compliance?</h2>
              <p className="text-xl text-red-100 mb-8 max-w-3xl mx-auto leading-relaxed">
                Protect your business with comprehensive legal compliance services and expert guidance 
                from qualified professionals.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Link to="/auth?mode=register">
                  <Button 
                    size="lg" 
                    className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-bold px-10 py-4 text-lg shadow-2xl border-0 transform hover:scale-105 transition-all duration-300"
                  >
                    Join to Start Legal Review
                  </Button>
                </Link>
                <Link to="/auth?mode=register">
                  <Button 
                    size="lg" 
                    className="bg-white text-red-600 hover:bg-gray-100 font-bold px-10 py-4 text-lg shadow-2xl transform hover:scale-105 transition-all duration-300"
                  >
                    Join to Start Legal Review
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

export default LegalCompliancePage;