import React from 'react';
import { ArrowLeft, CheckCircle, Clock, DollarSign, FileText, Users, Shield, Building2, Calculator, Globe, MessageSquare, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useLanguage } from '../../lib/language';
import { Button, Card } from '../../lib/ui';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const GeorgianLLCFormationPage = () => {
  const { t } = useLanguage();

  const serviceFeatures = [
    'Complete LLC registration with government authorities',
    'Small Business Status application for 1% tax rate',
    'Tax registration and compliance setup',
    'Corporate bank account opening assistance',
    'Legal compliance documentation',
    'Ongoing support for first 6 months',
    'Annual reporting assistance',
    'Business license guidance',
  ];

  const processSteps = [
    {
      step: 1,
      title: 'Initial Consultation',
      description: 'Discuss your business goals and structure requirements',
      duration: '1 day',
    },
    {
      step: 2,
      title: 'Document Preparation',
      description: 'Prepare all necessary documents and applications',
      duration: '2-3 days',
    },
    {
      step: 3,
      title: 'Government Registration',
      description: 'Submit applications to Georgian authorities',
      duration: '1-2 days',
    },
    {
      step: 4,
      title: 'Tax Registration',
      description: 'Register for taxes and Small Business Status',
      duration: '1 day',
    },
    {
      step: 5,
      title: 'Banking Setup',
      description: 'Assist with corporate bank account opening',
      duration: '3-5 days',
    },
    {
      step: 6,
      title: 'Final Documentation',
      description: 'Deliver all certificates and setup documentation',
      duration: '1 day',
    },
  ];

  const requirements = [
    'Valid passport copy',
    'Proof of address (utility bill or bank statement)',
    'Business plan or activity description',
    'Proposed company name (3 alternatives)',
    'Initial capital amount (no minimum required)',
    'Director and shareholder information',
  ];

  const faqs = [
    {
      question: 'What is the minimum capital requirement for a Georgian LLC?',
      answer: 'There is no minimum capital requirement for Georgian LLCs. You can start with any amount, even 1 GEL.',
    },
    {
      question: 'How long does the LLC formation process take?',
      answer: 'The complete process typically takes 2-3 weeks, including government registration, tax setup, and bank account opening.',
    },
    {
      question: 'What is Small Business Status and how does it benefit me?',
      answer: 'Small Business Status allows you to pay only 1% tax on turnover up to 200,000 GEL annually, instead of the standard 20% corporate tax rate.',
    },
    {
      question: 'Can foreign nationals own 100% of a Georgian LLC?',
      answer: 'Yes, foreign nationals can own 100% of a Georgian LLC without any restrictions or local partner requirements.',
    },
    {
      question: 'Do I need to be physically present in Georgia for LLC formation?',
      answer: 'No, the entire process can be completed remotely through our services. Physical presence is not required.',
    },
    {
      question: 'What ongoing compliance requirements are there?',
      answer: 'Annual tax returns, maintaining registered address, and keeping corporate records updated. We provide ongoing support for all compliance matters.',
    },
    {
      question: 'Can I open a bank account remotely?',
      answer: 'Most Georgian banks require physical presence for account opening, but we can arrange video calls and assist with the entire process.',
    },
    {
      question: 'What business activities are allowed under Small Business Status?',
      answer: 'Most business activities are allowed except banking, insurance, and some regulated activities. We can advise on specific business types.',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Georgian LLC Formation - Complete Business Setup Service - Consulting19</title>
        <meta name="description" content="Professional Georgian LLC formation service with Small Business Status for 1% tax rate. Complete setup in 2-3 weeks with expert guidance." />
      </Helmet>

      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-teal-600 text-white py-20 mt-16">
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
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <span className="text-6xl">🇬🇪</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Georgian LLC Formation
            </h1>
            <p className="text-xl text-blue-100 mb-8 leading-relaxed">
              Complete LLC setup with Small Business Status registration for optimal tax benefits. 
              Professional service with 1% tax rate and full compliance support.
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
        {/* Service Overview */}
        <section className="mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Service Overview</h2>
              <div className="prose prose-lg max-w-none text-gray-600 leading-relaxed">
                <p className="mb-4">
                  Our Georgian LLC formation service provides a complete business setup solution designed specifically 
                  for international entrepreneurs seeking tax-efficient structures in a business-friendly jurisdiction.
                </p>
                <p className="mb-4">
                  Georgia offers one of the most attractive business environments in the region, with its strategic 
                  location between Europe and Asia, favorable tax policies, and streamlined registration processes. 
                  The Small Business Status allows qualifying companies to pay only 1% tax on turnover up to 200,000 GEL annually.
                </p>
                <p>
                  Our expert team handles every aspect of the formation process, from initial consultation to final 
                  documentation, ensuring your business is properly established and compliant with all Georgian regulations.
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
                      <span className="font-medium text-gray-900">2-3 weeks</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Tax Rate:</span>
                      <span className="font-medium text-green-600">1% (Small Business)</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Min. Capital:</span>
                      <span className="font-medium text-gray-900">No minimum</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Foreign Ownership:</span>
                      <span className="font-medium text-gray-900">100% allowed</span>
                    </div>
                  </div>
                </Card.Body>
              </Card>
              
              <Card className="bg-green-50 border-green-200">
                <Card.Body>
                  <h3 className="text-lg font-semibold text-green-900 mb-2">Tax Benefits</h3>
                  <ul className="space-y-2 text-sm text-green-800">
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      1% tax on turnover (up to 200K GEL)
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      No VAT registration required
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Simplified accounting
                    </li>
                  </ul>
                </Card.Body>
              </Card>
            </div>
          </div>
        </section>

        {/* What's Included */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">What's Included</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {serviceFeatures.map((feature, index) => (
              <Card key={index} className="text-center">
                <Card.Body>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-6 h-6 text-blue-600" />
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed">{feature}</p>
                </Card.Body>
              </Card>
            ))}
          </div>
        </section>

        {/* Process Steps */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Formation Process</h2>
          <div className="space-y-6">
            {processSteps.map((step, index) => (
              <Card key={index}>
                <Card.Body>
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
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

        {/* Requirements */}
        <section className="mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Required Documents</h2>
              <div className="space-y-4">
                {requirements.map((requirement, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <FileText className="w-5 h-5 text-blue-600 flex-shrink-0" />
                    <span className="text-gray-700">{requirement}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <Card className="bg-blue-50 border-blue-200">
              <Card.Body>
                <h3 className="text-xl font-semibold text-blue-900 mb-4">Why Choose Our Service?</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Users className="w-5 h-5 text-blue-600" />
                    <span className="text-blue-800">8+ years of experience</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Shield className="w-5 h-5 text-blue-600" />
                    <span className="text-blue-800">98% success rate</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Globe className="w-5 h-5 text-blue-600" />
                    <span className="text-blue-800">English-speaking support</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Calculator className="w-5 h-5 text-blue-600" />
                    <span className="text-blue-800">Tax optimization included</span>
                  </div>
                </div>
              </Card.Body>
            </Card>
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
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center group-open:bg-blue-600 transition-colors">
                        <span className="text-blue-600 group-open:text-white text-lg font-bold group-open:rotate-45 transition-all">+</span>
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
          <Card className="bg-gradient-to-r from-blue-600 to-teal-600 text-white">
            <Card.Body className="text-center py-12">
              <h2 className="text-3xl font-bold mb-4">Ready to Start Your Georgian LLC?</h2>
              <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
                Get expert guidance from our Georgian specialist and establish your business with optimal tax benefits.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  onClick={() => window.open('/auth?mode=register', '_blank')}
                >
                  Join to Start LLC Formation
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  onClick={() => window.open('/auth?mode=register', '_blank')}
                >
                  Join for Free Consultation
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

export default GeorgianLLCFormationPage;