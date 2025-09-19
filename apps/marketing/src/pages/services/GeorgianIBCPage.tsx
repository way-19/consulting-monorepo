import React from 'react';
import { ArrowLeft, CheckCircle, Clock, DollarSign, FileText, Users, Shield, Building2, TrendingUp, Globe, MessageSquare, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useLanguage } from '../../lib/language';
import { Button, Card } from '../../lib/ui';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const GeorgianIBCPage = () => {
  const { t } = useLanguage();

  const serviceFeatures = [
    'International Business Company registration',
    '0% tax on foreign-sourced income',
    'Corporate structure optimization',
    'International banking assistance',
    'Ongoing compliance management',
    'Annual reporting services',
    'Tax planning consultation',
    'Legal documentation support',
  ];

  const processSteps = [
    {
      step: 1,
      title: 'Business Structure Analysis',
      description: 'Analyze your international operations and optimize structure',
      duration: '2-3 days',
    },
    {
      step: 2,
      title: 'IBC Registration',
      description: 'Register International Business Company with authorities',
      duration: '3-5 days',
    },
    {
      step: 3,
      title: 'Tax Status Setup',
      description: 'Configure international tax status and exemptions',
      duration: '2-3 days',
    },
    {
      step: 4,
      title: 'Banking Coordination',
      description: 'Assist with international banking relationships',
      duration: '1-2 weeks',
    },
    {
      step: 5,
      title: 'Compliance Framework',
      description: 'Establish ongoing compliance and reporting systems',
      duration: '3-5 days',
    },
    {
      step: 6,
      title: 'Documentation Delivery',
      description: 'Provide all certificates and operational documentation',
      duration: '1-2 days',
    },
  ];

  const requirements = [
    'Valid passport and proof of address',
    'Business plan with international operations',
    'Source of funds documentation',
    'Proposed company name and structure',
    'Director and shareholder details',
    'International business activity description',
  ];

  const taxBenefits = [
    {
      title: '0% Tax on Foreign Income',
      description: 'No tax on income generated outside Georgia',
      icon: DollarSign,
    },
    {
      title: 'No Withholding Tax',
      description: 'No withholding tax on dividends to non-residents',
      icon: TrendingUp,
    },
    {
      title: 'Double Tax Treaties',
      description: 'Access to extensive double tax treaty network',
      icon: Globe,
    },
    {
      title: 'Simplified Reporting',
      description: 'Streamlined annual reporting requirements',
      icon: FileText,
    },
  ];

  const faqs = [
    {
      question: 'What qualifies as foreign-sourced income for Georgian IBC?',
      answer: 'Foreign-sourced income includes revenue from services provided outside Georgia, sales to non-Georgian customers, and income from foreign investments or assets.',
    },
    {
      question: 'How long does IBC formation take?',
      answer: 'The complete IBC formation process typically takes 3-4 weeks, including registration, tax setup, and banking arrangements.',
    },
    {
      question: 'What are the ongoing compliance requirements for IBC?',
      answer: 'IBCs must file annual returns, maintain proper accounting records, and comply with international reporting standards. We provide full compliance support.',
    },
    {
      question: 'Can I combine IBC with Georgian tax residency?',
      answer: 'Yes, you can become a Georgian tax resident while operating an IBC, potentially benefiting from both personal and corporate tax advantages.',
    },
    {
      question: 'What banking options are available for Georgian IBCs?',
      answer: 'Georgian IBCs can open accounts with local and international banks. We assist with account opening and ongoing banking relationships.',
    },
    {
      question: 'Are there restrictions on IBC business activities?',
      answer: 'IBCs cannot engage in certain regulated activities like banking or insurance within Georgia, but can conduct most international business activities.',
    },
    {
      question: 'How does Georgian IBC compare to other offshore structures?',
      answer: 'Georgian IBC offers EU association benefits, strong legal framework, and competitive costs while maintaining substance requirements.',
    },
    {
      question: 'What documentation do I receive upon completion?',
      answer: 'You receive certificate of incorporation, articles of association, tax registration certificate, and all necessary corporate documents.',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Georgian International Business Company (IBC) - 0% Tax on Foreign Income - Consulting19</title>
        <meta name="description" content="Georgian IBC formation with 0% tax on foreign income. Professional international business structure setup in 3-4 weeks." />
      </Helmet>

      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-20 mt-16">
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
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <span className="text-6xl">🇬🇪</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              International Business Company
            </h1>
            <p className="text-xl text-purple-100 mb-8 leading-relaxed">
              Establish a Georgian IBC with 0% tax on foreign-sourced income. 
              Perfect for international operations with EU association benefits.
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
        {/* Tax Benefits */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Tax Benefits</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {taxBenefits.map((benefit, index) => (
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

        {/* Service Details */}
        <section className="mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Service Details</h2>
              <div className="prose prose-lg max-w-none text-gray-600 leading-relaxed">
                <p className="mb-4">
                  Georgian International Business Company (IBC) structure is designed for businesses conducting 
                  international operations. This structure offers significant tax advantages for companies earning 
                  income from foreign sources.
                </p>
                <p className="mb-4">
                  The IBC status allows companies to benefit from 0% corporate tax on foreign-sourced income, 
                  making it an attractive option for international trading, consulting, and digital businesses.
                </p>
                <p>
                  Our comprehensive service ensures proper setup and ongoing compliance with all Georgian 
                  and international requirements.
                </p>
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-6">What's Included</h3>
              <div className="space-y-3">
                {serviceFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Process Timeline */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Formation Timeline</h2>
          <div className="space-y-6">
            {processSteps.map((step, index) => (
              <Card key={index}>
                <Card.Body>
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">
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
                      <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center group-open:bg-purple-600 transition-colors">
                        <span className="text-purple-600 group-open:text-white text-lg font-bold group-open:rotate-45 transition-all">+</span>
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
          <Card className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
            <Card.Body className="text-center py-12">
              <h2 className="text-3xl font-bold mb-4">Ready to Establish Your Georgian IBC?</h2>
              <p className="text-purple-100 mb-8 max-w-2xl mx-auto">
                Optimize your international business structure with 0% tax on foreign income and expert guidance.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg"
                  onClick={() => window.open('/auth?mode=register', '_blank')}
                >
                  Join to Start IBC Formation
                </Button>
                <Button 
                  size="lg" 
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

export default GeorgianIBCPage;