import React from 'react';
import { ArrowLeft, CheckCircle, Clock, DollarSign, FileText, Users, Shield, User, TrendingUp, Globe, MessageSquare, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useLanguage } from '../../lib/language';
import { Button, Card } from '../../lib/ui';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const GeorgianIEStatusPage = () => {
  const { t } = useLanguage();

  const serviceFeatures = [
    'Individual Entrepreneur registration',
    '1% tax rate setup (up to $200K)',
    'Tax optimization consultation',
    'Banking assistance',
    'Compliance framework setup',
    'Annual reporting services',
    'Business activity guidance',
    'Ongoing support and advisory',
  ];

  const processSteps = [
    {
      step: 1,
      title: 'Eligibility Review',
      description: 'Assess your eligibility for IE status and tax benefits',
      duration: '1 day',
    },
    {
      step: 2,
      title: 'Registration Preparation',
      description: 'Prepare registration documents and business activity description',
      duration: '1-2 days',
    },
    {
      step: 3,
      title: 'Government Registration',
      description: 'Submit IE registration to Georgian authorities',
      duration: '1 day',
    },
    {
      step: 4,
      title: 'Tax Status Configuration',
      description: 'Configure 1% tax status and compliance requirements',
      duration: '1 day',
    },
    {
      step: 5,
      title: 'Banking Setup',
      description: 'Assist with business banking account opening',
      duration: '2-3 days',
    },
    {
      step: 6,
      title: 'Compliance Setup',
      description: 'Establish ongoing compliance and reporting systems',
      duration: '1 day',
    },
  ];

  const requirements = [
    'Valid passport copy',
    'Proof of address',
    'Business activity description',
    'Proposed business name',
    'Tax residency documentation',
    'Financial capacity proof',
  ];

  const ieBenefits = [
    {
      title: '1% Tax Rate',
      description: 'Only 1% tax on turnover up to $200,000 annually',
      icon: DollarSign,
    },
    {
      title: 'Simple Registration',
      description: 'Quick and easy registration process',
      icon: CheckCircle,
    },
    {
      title: 'Minimal Compliance',
      description: 'Simplified reporting and compliance requirements',
      icon: FileText,
    },
    {
      title: 'Business Flexibility',
      description: 'Wide range of allowed business activities',
      icon: TrendingUp,
    },
  ];

  const faqs = [
    {
      question: 'What is Individual Entrepreneur (IE) status in Georgia?',
      answer: 'IE status is a simplified business structure for individuals conducting business activities, offering a 1% tax rate on turnover up to $200,000 annually.',
    },
    {
      question: 'How quickly can I register for IE status?',
      answer: 'IE registration can be completed in 1 week, including all documentation, registration, and banking setup.',
    },
    {
      question: 'What business activities are allowed under IE status?',
      answer: 'Most business activities are allowed except banking, insurance, and some regulated activities. We can advise on specific business types.',
    },
    {
      question: 'Can foreign nationals register for IE status?',
      answer: 'Yes, foreign nationals can register for IE status in Georgia, but they must be Georgian tax residents or have appropriate visa status.',
    },
    {
      question: 'What happens if my income exceeds $200,000?',
      answer: 'Income above $200,000 is taxed at standard rates (20%). We can help you plan for this threshold and consider alternative structures.',
    },
    {
      question: 'Do I need to be physically present in Georgia for IE registration?',
      answer: 'Physical presence is typically required for IE registration, but we can minimize your time requirements and handle most preparations remotely.',
    },
    {
      question: 'Can I have employees as an Individual Entrepreneur?',
      answer: 'Yes, IEs can hire employees, but there are limitations. For larger operations, we may recommend LLC structure instead.',
    },
    {
      question: 'What are the ongoing obligations for IE status?',
      answer: 'IEs must file monthly declarations, maintain basic records, and comply with tax obligations. We provide full compliance support.',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Georgian Individual Entrepreneur Status - 1% Tax Rate - Consulting19</title>
        <meta name="description" content="Georgian Individual Entrepreneur registration with 1% tax rate. Quick setup for freelancers and small business owners." />
      </Helmet>

      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-teal-600 to-green-600 text-white py-20 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center mb-6">
            <Link to="/countries/georgia">
              <Button variant="outline" icon={ArrowLeft} iconPosition="left">
                Back to Georgia
              </Button>
            </Link>
          </div>
          
          <div className="max-w-4xl">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <span className="text-6xl">🇬🇪</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Individual Entrepreneur Status
            </h1>
            <p className="text-xl text-teal-100 mb-8 leading-relaxed">
              Register as Individual Entrepreneur in Georgia with only 1% tax on income up to $200,000. 
              Perfect for freelancers and small business owners.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                icon={MessageSquare}
                onClick={() => window.open('/auth?mode=register', '_blank')}
              >
                Join to Contact Specialist
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                icon={Calendar}
                onClick={() => window.open('/auth?mode=register', '_blank')}
              >
                Join to Schedule Consultation
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* IE Benefits */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">IE Status Benefits</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {ieBenefits.map((benefit, index) => (
              <Card key={index} hover className="text-center">
                <Card.Body>
                  <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <benefit.icon className="w-6 h-6 text-teal-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">{benefit.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{benefit.description}</p>
                </Card.Body>
              </Card>
            ))}
          </div>
        </section>

        {/* Service Details */}
        <section className="mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Service Overview</h2>
              <div className="prose prose-lg max-w-none text-gray-600 leading-relaxed">
                <p className="mb-4">
                  Individual Entrepreneur (IE) status in Georgia is perfect for freelancers, consultants, and small 
                  business owners who want to benefit from Georgia's favorable tax environment with minimal complexity.
                </p>
                <p className="mb-4">
                  With IE status, you pay only 1% tax on your turnover up to $200,000 annually, making it one of 
                  the most attractive tax regimes for individual business activities in the region.
                </p>
                <p>
                  Our service ensures quick registration and proper setup of your IE status with full compliance 
                  support and ongoing advisory services.
                </p>
              </div>
            </div>
            
            <div className="space-y-6">
              <Card>
                <Card.Body>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Service Details</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Duration:</span>
                      <span className="font-medium text-gray-900">1 week</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Tax Rate:</span>
                      <span className="font-medium text-teal-600">1%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Threshold:</span>
                      <span className="font-medium text-gray-900">$200K annually</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Compliance:</span>
                      <span className="font-medium text-gray-900">Simplified</span>
                    </div>
                  </div>
                </Card.Body>
              </Card>
              
              <Card className="bg-teal-50 border-teal-200">
                <Card.Body>
                  <h3 className="text-lg font-semibold text-teal-900 mb-2">Perfect For</h3>
                  <ul className="space-y-2 text-sm text-teal-800">
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Freelancers and consultants
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Digital nomads
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Small business owners
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Online service providers
                    </li>
                  </ul>
                </Card.Body>
              </Card>
            </div>
          </div>
        </section>

        {/* Process Steps */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Registration Process</h2>
          <div className="space-y-6">
            {processSteps.map((step, index) => (
              <Card key={index}>
                <Card.Body>
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-teal-600 text-white rounded-full flex items-center justify-center font-bold">
                      {step.step}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{step.title}</h3>
                        <span className="text-sm text-gray-500 flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {step.duration}
                        </span>
                      </div>
                      <p className="text-gray-600">{step.description}</p>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Frequently Asked Questions</h2>
          <div className="max-w-4xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <Card key={index}>
                <Card.Body>
                  <details className="group">
                    <summary className="flex items-center justify-between cursor-pointer list-none">
                      <h3 className="text-lg font-semibold text-gray-900 pr-4">{faq.question}</h3>
                      <div className="w-6 h-6 bg-teal-100 rounded-full flex items-center justify-center group-open:bg-teal-600 transition-colors">
                        <span className="text-teal-600 group-open:text-white text-lg font-bold group-open:rotate-45 transition-all">+</span>
                      </div>
                    </summary>
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                    </div>
                  </details>
                </Card.Body>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section>
          <Card className="bg-gradient-to-r from-teal-600 to-green-600 text-white">
            <Card.Body className="text-center py-12">
              <h2 className="text-3xl font-bold mb-4">Ready to Register as Individual Entrepreneur?</h2>
              <p className="text-teal-100 mb-8 max-w-2xl mx-auto">
                Start your business journey in Georgia with IE status and benefit from the 1% tax rate on your income.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  onClick={() => window.open('/auth?mode=register', '_blank')}
                >
                  Join to Start IE Registration
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  onClick={() => window.open('/auth?mode=register', '_blank')}
                >
                  Join to Schedule Consultation
                </Button>
              </div>
            </Card.Body>
          </Card>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default GeorgianIEStatusPage;