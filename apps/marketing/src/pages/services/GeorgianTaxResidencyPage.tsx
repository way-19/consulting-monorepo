import React from 'react';
import { ArrowLeft, CheckCircle, Clock, DollarSign, FileText, Users, Shield, Calculator, Home, Globe, MessageSquare, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useLanguage } from '../../lib/language';
import { Button, Card } from '../../lib/ui';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const GeorgianTaxResidencyPage = () => {
  const { t } = useLanguage();

  const serviceFeatures = [
    'Tax residency eligibility assessment',
    'Residency application preparation',
    'Tax optimization strategy',
    'Documentation support',
    'Government liaison services',
    'Ongoing tax compliance',
    'Annual tax return filing',
    'Advisory on tax benefits',
  ];

  const processSteps = [
    {
      step: 1,
      title: 'Eligibility Assessment',
      description: 'Evaluate your eligibility for Georgian tax residency',
      duration: '1-2 days',
    },
    {
      step: 2,
      title: 'Strategy Development',
      description: 'Develop personalized tax optimization strategy',
      duration: '2-3 days',
    },
    {
      step: 3,
      title: 'Document Preparation',
      description: 'Prepare all required documentation and applications',
      duration: '3-5 days',
    },
    {
      step: 4,
      title: 'Application Submission',
      description: 'Submit residency application to Georgian authorities',
      duration: '1 day',
    },
    {
      step: 5,
      title: 'Follow-up & Support',
      description: 'Monitor application progress and provide updates',
      duration: '1-2 weeks',
    },
    {
      step: 6,
      title: 'Residency Confirmation',
      description: 'Receive tax residency certificate and setup compliance',
      duration: '1-2 days',
    },
  ];

  const requirements = [
    'Valid passport and travel history',
    'Proof of income and financial status',
    'Health insurance documentation',
    'Criminal background check',
    'Accommodation proof in Georgia',
    'Bank statements (last 6 months)',
  ];

  const residencyBenefits = [
    {
      title: 'Territorial Tax System',
      description: 'Only Georgian-sourced income is taxed',
      icon: Globe,
    },
    {
      title: 'Low Personal Tax Rates',
      description: '20% flat rate on Georgian income',
      icon: Calculator,
    },
    {
      title: 'No Tax on Foreign Income',
      description: 'Foreign income not brought to Georgia is tax-free',
      icon: DollarSign,
    },
    {
      title: 'EU Association Benefits',
      description: 'Access to EU markets and visa-free travel',
      icon: Shield,
    },
  ];

  const faqs = [
    {
      question: 'How many days do I need to spend in Georgia for tax residency?',
      answer: 'You need to spend at least 183 days in Georgia during a 12-month period, or have your center of vital interests in Georgia.',
    },
    {
      question: 'What is the territorial tax system in Georgia?',
      answer: 'Under the territorial system, only income sourced in Georgia is subject to Georgian tax. Foreign income not brought to Georgia remains untaxed.',
    },
    {
      question: 'Can I maintain tax residency in another country while being Georgian tax resident?',
      answer: 'This depends on the tax laws of your other country and any double tax treaties. We provide guidance on avoiding double taxation.',
    },
    {
      question: 'What are the personal income tax rates for Georgian residents?',
      answer: 'Georgian tax residents pay 20% flat rate on Georgian-sourced income. Foreign income not brought to Georgia is not taxed.',
    },
    {
      question: 'Do I need to file annual tax returns as a Georgian resident?',
      answer: 'Yes, Georgian tax residents must file annual tax returns by March 31st. We provide full tax return preparation services.',
    },
    {
      question: 'Can I get Georgian citizenship through tax residency?',
      answer: 'Tax residency is separate from citizenship. However, long-term residency can be a pathway to citizenship after meeting specific requirements.',
    },
    {
      question: 'What happens if I spend less than 183 days in Georgia?',
      answer: 'If you spend less than 183 days, you may still qualify if Georgia is your center of vital interests (main residence, family, economic ties).',
    },
    {
      question: 'Are there any restrictions on Georgian tax residents?',
      answer: 'Georgian tax residents must comply with local tax obligations and may need to report foreign assets depending on their value and location.',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Georgian Tax Residency Planning - Territorial Tax Benefits - Consulting19</title>
        <meta name="description" content="Georgian tax residency planning with territorial tax benefits. Expert guidance for optimal tax structure and compliance." />
      </Helmet>

      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-teal-600 text-white py-20 mt-16">
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
                <Home className="w-6 h-6 text-white" />
              </div>
              <span className="text-6xl">🇬🇪</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Georgian Tax Residency Planning
            </h1>
            <p className="text-xl text-green-100 mb-8 leading-relaxed">
              Strategic tax planning for Georgian tax residency with territorial tax benefits. 
              Optimize your personal tax situation with expert guidance.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                icon={MessageSquare}
                onClick={() => window.open('/auth?mode=register', '_blank')}
              >
                Join to Contact Tax Specialist
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                icon={Calendar}
                onClick={() => window.open('/auth?mode=register', '_blank')}
              >
                Join to Schedule Assessment
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Residency Benefits */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Residency Benefits</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {residencyBenefits.map((benefit, index) => (
              <Card key={index} hover className="text-center">
                <Card.Body>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <benefit.icon className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">{benefit.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{benefit.description}</p>
                </Card.Body>
              </Card>
            ))}
          </div>
        </section>

        {/* Service Overview */}
        <section className="mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Planning Process</h2>
              <div className="space-y-6">
                {processSteps.map((step, index) => (
                  <Card key={index}>
                    <Card.Body>
                      <div className="flex items-start space-x-4">
                        <div className="w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">
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
            </div>
            
            <div className="space-y-6">
              <Card>
                <Card.Body>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Service Timeline</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Assessment:</span>
                      <span className="font-medium text-gray-900">1-2 days</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Preparation:</span>
                      <span className="font-medium text-gray-900">3-5 days</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Application:</span>
                      <span className="font-medium text-gray-900">1-2 weeks</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Total Duration:</span>
                      <span className="font-medium text-green-600">1-2 weeks</span>
                    </div>
                  </div>
                </Card.Body>
              </Card>
              
              <Card className="bg-green-50 border-green-200">
                <Card.Body>
                  <h3 className="text-lg font-semibold text-green-900 mb-2">Tax Savings</h3>
                  <p className="text-sm text-green-800 mb-4">
                    Potential tax savings for digital nomads and international professionals
                  </p>
                  <div className="text-2xl font-bold text-green-600 text-center">
                    Up to 80% savings
                  </div>
                </Card.Body>
              </Card>
            </div>
          </div>
        </section>

        {/* Requirements */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Requirements</h2>
          <div className="max-w-2xl mx-auto">
            <Card>
              <Card.Body>
                <div className="space-y-4">
                  {requirements.map((requirement, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <FileText className="w-5 h-5 text-green-600 flex-shrink-0" />
                      <span className="text-gray-700">{requirement}</span>
                    </div>
                  ))}
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
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center group-open:bg-green-600 transition-colors">
                        <span className="text-green-600 group-open:text-white text-lg font-bold group-open:rotate-45 transition-all">+</span>
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
          <Card className="bg-gradient-to-r from-green-600 to-teal-600 text-white">
            <Card.Body className="text-center py-12">
              <h2 className="text-3xl font-bold mb-4">Ready to Become a Georgian Tax Resident?</h2>
              <p className="text-green-100 mb-8 max-w-2xl mx-auto">
                Optimize your personal tax situation with Georgian tax residency and territorial tax benefits.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  onClick={() => window.open('/auth?mode=register', '_blank')}
                >
                  Join to Start Residency Planning
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  onClick={() => window.open('/auth?mode=register', '_blank')}
                >
                  Join to Schedule Assessment
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

export default GeorgianTaxResidencyPage;