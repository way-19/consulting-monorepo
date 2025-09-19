import React, { useState } from 'react';
import { ArrowLeft, Bot, Globe, TrendingUp, Shield, CheckCircle, Zap, Target, BarChart3, Building2, DollarSign, Users, Clock, Star, ChevronRight, MessageSquare, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useLanguage } from '../lib/language';
import { Button, Card } from '../lib/ui';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const AICountryRecommendationsPage = () => {
  const { t } = useLanguage();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    businessType: '',
    industry: '',
    revenue: '',
    employees: '',
    targetMarkets: [],
    priorities: [],
    timeline: '',
  });
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [analyzing, setAnalyzing] = useState(false);

  const businessTypes = [
    'Startup',
    'SME (Small-Medium Enterprise)',
    'Large Corporation',
    'Freelancer/Consultant',
    'E-commerce',
    'SaaS/Tech',
    'Trading Company',
    'Investment Holding',
  ];

  const industries = [
    'Technology',
    'Finance',
    'E-commerce',
    'Consulting',
    'Manufacturing',
    'Real Estate',
    'Healthcare',
    'Education',
    'Crypto/Blockchain',
    'Other',
  ];

  const revenueRanges = [
    'Under $100K',
    '$100K - $500K',
    '$500K - $1M',
    '$1M - $5M',
    '$5M - $10M',
    'Over $10M',
  ];

  const priorityOptions = [
    'Low Tax Rate',
    'EU Market Access',
    'Banking Quality',
    'Political Stability',
    'English Speaking',
    'Fast Setup',
    'Privacy Protection',
    'Crypto Friendly',
  ];

  const targetMarkets = [
    'Europe',
    'North America',
    'Asia Pacific',
    'Middle East',
    'Latin America',
    'Africa',
    'Global',
  ];

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayToggle = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field as keyof typeof prev].includes(value)
        ? (prev[field as keyof typeof prev] as string[]).filter(item => item !== value)
        : [...(prev[field as keyof typeof prev] as string[]), value]
    }));
  };

  const runAIAnalysis = async () => {
    setAnalyzing(true);
    
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Mock AI recommendations based on form data
    const mockRecommendations = [
      {
        country: 'Georgia',
        flag: '🇬🇪',
        score: 95,
        taxRate: '1%',
        setup: '1-2 days',
        reasons: ['Ultra-low tax rate', 'Fast setup', 'EU association', 'English friendly'],
        pros: ['Small Business Status (1% tax)', 'No minimum capital', 'EU association benefits', 'Strategic location'],
        cons: ['Limited banking options', 'Smaller market size'],
        recommended: true,
      },
      {
        country: 'Estonia',
        flag: '🇪🇪',
        score: 88,
        taxRate: '20%',
        setup: '1-3 days',
        reasons: ['EU member', 'Digital first', 'e-Residency', 'Tech hub'],
        pros: ['EU membership', 'Digital infrastructure', 'e-Residency program', 'Tech-friendly'],
        cons: ['Higher tax rate', 'Cold climate'],
        recommended: false,
      },
      {
        country: 'UAE',
        flag: '🇦🇪',
        score: 85,
        taxRate: '0%',
        setup: '3-5 days',
        reasons: ['Zero corporate tax', 'Strategic location', 'Banking hub', 'Free zones'],
        pros: ['0% corporate tax', 'World-class banking', 'Strategic location', 'Political stability'],
        cons: ['Higher setup costs', 'Substance requirements'],
        recommended: false,
      },
    ];
    
    setRecommendations(mockRecommendations);
    setAnalyzing(false);
    setCurrentStep(4);
  };

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      runAIAnalysis();
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>AI-Powered Country Recommendations - Find Your Perfect Jurisdiction - Consulting19</title>
        <meta name="description" content="Get personalized country recommendations powered by AI. Find the perfect jurisdiction for your business expansion with expert analysis." />
      </Helmet>

      <Navbar />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-teal-600 text-white py-14 mt-16 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-14 left-14 w-44 h-44 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-14 right-14 w-67 h-67 bg-yellow-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        {/* Floating AI Icons */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-14 left-1/4 text-3xl animate-float">🤖</div>
          <div className="absolute top-22 right-1/4 text-2xl animate-float-delayed">🌍</div>
          <div className="absolute bottom-14 left-1/3 text-2xl animate-bounce delay-1000">📊</div>
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
              AI-Powered Country
              <br />
              <span className="bg-gradient-to-r from-yellow-300 via-orange-300 to-pink-300 bg-clip-text text-transparent">
                Recommendations
              </span>
            </h1>
            
            <p className="text-lg text-blue-100 mb-6 leading-relaxed max-w-4xl mx-auto">
              Get personalized jurisdiction recommendations based on your business needs, goals, and priorities. 
              Our AI analyzes 19+ countries to find your perfect match.
            </p>
            
            {/* Trust Badge */}
            <div className="inline-flex items-center bg-white/20 backdrop-blur-sm rounded-full px-6 py-2 shadow-lg border border-white/30">
              <Bot className="w-4 h-4 text-purple-300 mr-2" />
              <span className="text-white font-medium">AI Oracle Analysis</span>
              <span className="mx-3 text-white/60">•</span>
              <Globe className="w-4 h-4 text-blue-300 mr-2" />
              <span className="text-white font-medium">19+ Countries</span>
              <span className="mx-3 text-white/60">•</span>
              <Target className="w-4 h-4 text-teal-300 mr-2" />
              <span className="text-white font-medium">Personalized Results</span>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-gray-600">
              Step {currentStep} of 3
            </span>
            <span className="text-sm font-medium text-gray-600">
              {Math.round((currentStep / 3) * 100)}% Complete
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${(currentStep / 3) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Step 1: Business Information */}
        {currentStep === 1 && (
          <Card>
            <Card.Header>
              <h2 className="text-2xl font-bold text-gray-900">Tell Us About Your Business</h2>
              <p className="text-gray-600">Help our AI understand your business to provide better recommendations</p>
            </Card.Header>
            <Card.Body className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Business Type
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {businessTypes.map((type) => (
                    <button
                      key={type}
                      onClick={() => handleInputChange('businessType', type)}
                      className={`p-3 text-sm font-medium rounded-lg border-2 transition-all duration-200 ${
                        formData.businessType === type
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300 text-gray-700'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Industry
                </label>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {industries.map((industry) => (
                    <button
                      key={industry}
                      onClick={() => handleInputChange('industry', industry)}
                      className={`p-3 text-sm font-medium rounded-lg border-2 transition-all duration-200 ${
                        formData.industry === industry
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300 text-gray-700'
                      }`}
                    >
                      {industry}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Annual Revenue
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {revenueRanges.map((range) => (
                    <button
                      key={range}
                      onClick={() => handleInputChange('revenue', range)}
                      className={`p-3 text-sm font-medium rounded-lg border-2 transition-all duration-200 ${
                        formData.revenue === range
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300 text-gray-700'
                      }`}
                    >
                      {range}
                    </button>
                  ))}
                </div>
              </div>
            </Card.Body>
            <Card.Footer>
              <div className="flex justify-end">
                <Button 
                  onClick={nextStep}
                  disabled={!formData.businessType || !formData.industry || !formData.revenue}
                  icon={ChevronRight}
                  iconPosition="right"
                >
                  Next Step
                </Button>
              </div>
            </Card.Footer>
          </Card>
        )}

        {/* Step 2: Priorities & Goals */}
        {currentStep === 2 && (
          <Card>
            <Card.Header>
              <h2 className="text-2xl font-bold text-gray-900">What's Most Important to You?</h2>
              <p className="text-gray-600">Select your top priorities for jurisdiction selection</p>
            </Card.Header>
            <Card.Body className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Business Priorities (Select multiple)
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {priorityOptions.map((priority) => (
                    <button
                      key={priority}
                      onClick={() => handleArrayToggle('priorities', priority)}
                      className={`p-3 text-sm font-medium rounded-lg border-2 transition-all duration-200 ${
                        formData.priorities.includes(priority)
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300 text-gray-700'
                      }`}
                    >
                      {priority}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Target Markets
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {targetMarkets.map((market) => (
                    <button
                      key={market}
                      onClick={() => handleArrayToggle('targetMarkets', market)}
                      className={`p-3 text-sm font-medium rounded-lg border-2 transition-all duration-200 ${
                        formData.targetMarkets.includes(market)
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300 text-gray-700'
                      }`}
                    >
                      {market}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Timeline for Setup
                </label>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  {['ASAP', '1-3 months', '3-6 months', '6+ months'].map((timeline) => (
                    <button
                      key={timeline}
                      onClick={() => handleInputChange('timeline', timeline)}
                      className={`p-3 text-sm font-medium rounded-lg border-2 transition-all duration-200 ${
                        formData.timeline === timeline
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300 text-gray-700'
                      }`}
                    >
                      {timeline}
                    </button>
                  ))}
                </div>
              </div>
            </Card.Body>
            <Card.Footer>
              <div className="flex justify-between">
                <Button variant="outline" onClick={prevStep}>
                  Previous
                </Button>
                <Button 
                  onClick={nextStep}
                  disabled={formData.priorities.length === 0 || formData.targetMarkets.length === 0 || !formData.timeline}
                  icon={ChevronRight}
                  iconPosition="right"
                >
                  Next Step
                </Button>
              </div>
            </Card.Footer>
          </Card>
        )}

        {/* Step 3: Review & Confirm */}
        {currentStep === 3 && (
          <Card>
            <Card.Header>
              <h2 className="text-2xl font-bold text-gray-900">Review Your Information</h2>
              <p className="text-gray-600">Confirm your details before AI analysis</p>
            </Card.Header>
            <Card.Body className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Business Details</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Type:</span>
                      <span className="font-medium">{formData.businessType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Industry:</span>
                      <span className="font-medium">{formData.industry}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Revenue:</span>
                      <span className="font-medium">{formData.revenue}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Timeline:</span>
                      <span className="font-medium">{formData.timeline}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Priorities & Markets</h3>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm text-gray-600">Priorities:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {formData.priorities.map((priority) => (
                          <span key={priority} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                            {priority}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Target Markets:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {formData.targetMarkets.map((market) => (
                          <span key={market} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                            {market}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card.Body>
            <Card.Footer>
              <div className="flex justify-between">
                <Button variant="outline" onClick={prevStep}>
                  Previous
                </Button>
                <Button 
                  onClick={runAIAnalysis}
                  loading={analyzing}
                  icon={Bot}
                  iconPosition="right"
                  className="bg-gradient-to-r from-blue-600 to-purple-600"
                >
                  {analyzing ? 'AI Analyzing...' : 'Start AI Analysis'}
                </Button>
              </div>
            </Card.Footer>
          </Card>
        )}

        {/* Step 4: AI Results */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
              <Card.Body className="text-center py-6">
                <div className="w-11 h-11 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-3">
                  AI Analysis Complete!
                </h2>
                <p className="text-gray-600 mb-4">
                  Based on your requirements, here are our top country recommendations
                </p>
              </Card.Body>
            </Card>

            {/* Recommendations */}
            <div className="space-y-4">
              {recommendations.map((rec, index) => (
                <Card key={index} className={`relative overflow-hidden ${
                  rec.recommended ? 'border-2 border-green-500 bg-green-50' : 'border border-gray-200'
                }`}>
                  {rec.recommended && (
                    <div className="absolute top-3 right-3">
                      <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        🏆 AI Recommended
                      </span>
                    </div>
                  )}
                  
                  <Card.Body className="py-4">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                      {/* Country Info */}
                      <div className="text-center lg:text-left">
                        <div className="flex items-center justify-center lg:justify-start space-x-3 mb-3">
                          <span className="text-4xl">{rec.flag}</span>
                          <div>
                            <h3 className="text-xl font-bold text-gray-900">{rec.country}</h3>
                            <div className="flex items-center space-x-2">
                              <Star className="w-3 h-3 text-yellow-400 fill-current" />
                              <span className="font-semibold text-gray-900">{rec.score}/100</span>
                              <span className="text-gray-500 text-sm">AI Score</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3 mb-3">
                          <div className="bg-white rounded-lg p-2 border border-gray-200">
                            <div className="text-xs text-gray-600">Tax Rate</div>
                            <div className="text-base font-bold text-green-600">{rec.taxRate}</div>
                          </div>
                          <div className="bg-white rounded-lg p-2 border border-gray-200">
                            <div className="text-xs text-gray-600">Setup Time</div>
                            <div className="text-base font-bold text-blue-600">{rec.setup}</div>
                          </div>
                        </div>
                      </div>

                      {/* Pros & Cons */}
                      <div className="space-y-3">
                        <div>
                          <h4 className="font-semibold text-green-900 mb-1 text-sm">✅ Advantages</h4>
                          <ul className="space-y-1">
                            {rec.pros.map((pro: string, i: number) => (
                              <li key={i} className="text-xs text-gray-700 flex items-center">
                                <CheckCircle className="w-2 h-2 text-green-500 mr-2 flex-shrink-0" />
                                {pro}
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold text-red-900 mb-1 text-sm">⚠️ Considerations</h4>
                          <ul className="space-y-1">
                            {rec.cons.map((con: string, i: number) => (
                              <li key={i} className="text-xs text-gray-700 flex items-center">
                                <div className="w-2 h-2 bg-orange-400 rounded-full mr-2 flex-shrink-0"></div>
                                {con}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* AI Reasoning */}
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2 text-sm">🤖 AI Reasoning</h4>
                        <div className="space-y-1">
                          {rec.reasons.map((reason: string, i: number) => (
                            <div key={i} className="flex items-center space-x-1">
                              <Bot className="w-3 h-3 text-purple-600 flex-shrink-0" />
                              <span className="text-xs text-gray-700">{reason}</span>
                            </div>
                          ))}
                        </div>
                        
                        <div className="mt-4 space-y-2">
                          <Link to={`/countries/${rec.country.toLowerCase()}`}>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="w-full"
                              icon={Globe}
                            >
                              Learn More About {rec.country}
                            </Button>
                          </Link>
                          <Link to="/auth?mode=register">
                            <Button 
                              size="sm" 
                              className={`w-full ${
                                rec.recommended 
                                  ? 'bg-gradient-to-r from-green-600 to-blue-600' 
                                  : 'bg-gradient-to-r from-blue-600 to-purple-600'
                              }`}
                              icon={MessageSquare}
                            >
                              Connect with {rec.country} Expert
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="text-center space-y-4">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/auth?mode=register">
                  <Button 
                    size="lg" 
                    className="bg-gradient-to-r from-green-600 to-blue-600"
                    icon={Users}
                  >
                    Connect with Expert Consultants
                  </Button>
                </Link>
                <Button 
                  size="lg" 
                  variant="outline"
                  onClick={() => {
                    setCurrentStep(1);
                    setRecommendations([]);
                    setFormData({
                      businessType: '',
                      industry: '',
                      revenue: '',
                      employees: '',
                      targetMarkets: [],
                      priorities: [],
                      timeline: '',
                    });
                  }}
                >
                  Start New Analysis
                </Button>
              </div>
              
              <p className="text-sm text-gray-500">
                💡 Join Consulting19 to get detailed consultation with country specialists
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Features Section */}
      <section className="py-11 bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Why Our AI Recommendations?
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Advanced analysis considering multiple factors for optimal results
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                icon: Bot,
                title: 'AI-Powered Analysis',
                description: 'Advanced algorithms analyze 50+ factors across all jurisdictions',
                color: 'from-purple-500 to-pink-500',
              },
              {
                icon: BarChart3,
                title: 'Real-Time Data',
                description: 'Up-to-date information on tax rates, regulations, and requirements',
                color: 'from-blue-500 to-cyan-500',
              },
              {
                icon: Target,
                title: 'Personalized Results',
                description: 'Recommendations tailored specifically to your business needs',
                color: 'from-green-500 to-teal-500',
              },
              {
                icon: Users,
                title: 'Expert Validation',
                description: 'All recommendations validated by local experts in each country',
                color: 'from-orange-500 to-red-500',
              },
            ].map((feature, index) => (
              <Card key={index} hover className="text-center">
                <Card.Body>
                  <div className={`w-8 h-8 bg-gradient-to-r ${feature.color} rounded-lg flex items-center justify-center mx-auto mb-3`}>
                    <feature.icon className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="text-base font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-xs leading-relaxed">{feature.description}</p>
                </Card.Body>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-11">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 text-white">
            <Card.Body className="text-center py-8">
              <h2 className="text-2xl font-bold mb-3">Ready to Get Started?</h2>
              <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
                Get your personalized country recommendations and connect with expert consultants 
                to start your international expansion journey.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link to="/auth?mode=register">
                  <Button 
                    size="md" 
                    className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
                  >
                    Join Consulting19
                  </Button>
                </Link>
                <Link to="/countries">
                  <Button 
                    size="md" 
                    variant="outline" 
                    className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white border-0"
                  >
                    Explore All Countries
                  </Button>
                </Link>
              </div>
            </Card.Body>
          </Card>
        </div>
      </section>

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

export default AICountryRecommendationsPage;