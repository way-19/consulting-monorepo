import React from 'react';
import { ArrowLeft, CheckCircle, Clock, DollarSign, FileText, Users, Shield, CreditCard, Building, Globe, MessageSquare, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useLanguage } from '../../lib/language';
import { Button, Card } from '../../lib/ui';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const GeorgianBankingPage = () => {
  const { t } = useLanguage();

  const serviceFeatures = [
    'Corporate bank account opening',
    'Multi-currency account setup',
    'Online banking activation',
    'Payment gateway integration',
    'International wire transfer setup',
    'Banking relationship management',
    'Ongoing banking support',
    'Compliance monitoring',
  ];

  const processSteps = [
    {
      step: 1,
      title: 'Banking Needs Assessment',
      description: 'Analyze your banking requirements and recommend optimal solutions',
      duration: '1 day',
    },
    {
      step: 2,
      title: 'Bank Selection',
      description: 'Choose the best bank based on your business needs',
      duration: '1-2 days',
    },
    {
      step: 3,
      title: 'Document Preparation',
      description: 'Prepare all required documentation for account opening',
      duration: '2-3 days',
    },
    {
      step: 4,
      title: 'Bank Application',
      description: 'Submit application and coordinate with bank officials',
      duration: '1 day',
    },
    {
      step: 5,
      title: 'Account Activation',
      description: 'Complete account opening and activate banking services',
      duration: '3-5 days',
    },
    {
      step: 6,
      title: 'Setup Completion',
      description: 'Configure online banking and payment systems',
      duration: '1-2 days',
    },
  ];

  const requirements = [
    'Company registration certificate',
    'Tax registration certificate',
    'Articles of association',
    'Director passport and proof of address',
    'Business plan and activity description',
    'Source of funds documentation',
  ];

  const bankingOptions = [
    {
      title: 'Local Georgian Banks',
      description: 'TBC Bank, Bank of Georgia, Liberty Bank',
      icon: Building,
      features: ['Local expertise', 'Competitive rates', 'Georgian language support'],
    },
    {
      title: 'International Banks',
      description: 'International banks with Georgian presence',
      icon: Globe,
      features: ['Global network', 'Multi-currency', 'International standards'],
    },
    {
      title: 'Digital Banking',
      description: 'Modern digital banking solutions',
      icon: CreditCard,
      features: ['Online services', 'Mobile banking', 'API integration'],
    },
    {
      title: 'Private Banking',
      description: 'Premium banking for high-net-worth clients',
      icon: Shield,
      features: ['Dedicated manager', 'Premium services', 'Investment options'],
    },
  ];

  const faqs = [
    {
      question: 'Which Georgian banks are best for international businesses?',
      answer: 'TBC Bank and Bank of Georgia are the leading choices for international businesses, offering comprehensive services, English support, and strong international networks.',
    },
    {
      question: 'Can I open a bank account remotely?',
      answer: 'Most Georgian banks require physical presence for account opening, but some offer video call procedures. We coordinate the entire process to minimize your travel requirements.',
    },
    {
      question: 'What currencies can I hold in Georgian bank accounts?',
      answer: 'Georgian banks typically offer accounts in GEL, USD, EUR, and other major currencies. Multi-currency accounts are common for international businesses.',
    },
    {
      question: 'How long does bank account opening take?',
      answer: 'The process typically takes 1-2 weeks from document submission to account activation, depending on the bank and account type.',
    },
    {
      question: 'What are the typical banking fees in Georgia?',
      answer: 'Banking fees vary by bank and account type. We help you compare options and negotiate favorable terms based on your business volume.',
    },
    {
      question: 'Do Georgian banks offer online banking for international clients?',
      answer: 'Yes, all major Georgian banks offer comprehensive online banking platforms with English language support and mobile applications.',
    },
    {
      question: 'Can I get a debit/credit card for my Georgian business account?',
      answer: 'Yes, Georgian banks issue both debit and credit cards for business accounts, including international cards for global use.',
    },
    {
      question: 'What compliance requirements apply to Georgian business banking?',
      answer: 'Georgian banks follow international compliance standards including KYC, AML, and CRS reporting. We ensure your business meets all requirements.',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Georgian Banking Solutions - Corporate Account Opening - Consulting19</title>
        <meta name="description" content="Professional Georgian banking solutions for international businesses. Corporate account opening and banking relationship management." />
      </Helmet>

      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-orange-600 to-red-600 text-white py-20 mt-16">
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
                <CreditCard className="w-6 h-6 text-white" />
              </div>
              <span className="text-6xl">🇬🇪</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Georgian Banking Solutions
            </h1>
            <p className="text-xl text-orange-100 mb-8 leading-relaxed">
              Professional banking services for international businesses. Corporate account opening, 
              multi-currency solutions, and ongoing banking relationship management.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                icon={MessageSquare}
                onClick={() => window.open('/auth?mode=register', '_blank')}
              >
                Join to Contact Banking Specialist
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                icon={Calendar}
                onClick={() => window.open('/auth?mode=register', '_blank')}
              >
                Join to Schedule Banking Consultation
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Banking Options */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Banking Options</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {bankingOptions.map((option, index) => (
              <Card key={index} hover className="text-center">
                <Card.Body>
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <option.icon className="w-6 h-6 text-orange-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">{option.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{option.description}</p>
                  <div className="space-y-2">
                    {option.features.map((feature, i) => (
                      <div key={i} className="flex items-center justify-center space-x-2">
                        <CheckCircle className="w-3 h-3 text-green-600" />
                        <span className="text-xs text-gray-600">{feature}</span>
                      </div>
                    ))}
                  </div>
                </Card.Body>
              </Card>
            ))}
          </div>
        </section>

        {/* Service Details */}
        <section className="mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Banking Process</h2>
              <div className="space-y-6">
                {processSteps.map((step, index) => (
                  <Card key={index}>
                    <Card.Body>
                      <div className="flex items-start space-x-4">
                        <div className="w-10 h-10 bg-orange-600 text-white rounded-full flex items-center justify-center font-bold">
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
            
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Required Documents</h3>
              <div className="space-y-3 mb-8">
                {requirements.map((requirement, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <FileText className="w-5 h-5 text-orange-600 flex-shrink-0" />
                    <span className="text-gray-700">{requirement}</span>
                  </div>
                ))}
              </div>
              
              <Card className="bg-orange-50 border-orange-200">
                <Card.Body>
                  <h3 className="text-lg font-semibold text-orange-900 mb-4">Banking Benefits</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-orange-600" />
                      <span className="text-orange-800">Multi-currency accounts</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-orange-600" />
                      <span className="text-orange-800">International wire transfers</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-orange-600" />
                      <span className="text-orange-800">Online banking platform</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-orange-600" />
                      <span className="text-orange-800">Dedicated relationship manager</span>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </div>
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
                      <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center group-open:bg-orange-600 transition-colors">
                        <span className="text-orange-600 group-open:text-white text-lg font-bold group-open:rotate-45 transition-all">+</span>
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
          <Card className="bg-gradient-to-r from-orange-600 to-red-600 text-white">
            <Card.Body className="text-center py-12">
              <h2 className="text-3xl font-bold mb-4">Ready to Open Your Georgian Bank Account?</h2>
              <p className="text-orange-100 mb-8 max-w-2xl mx-auto">
                Get professional assistance with Georgian banking setup and establish strong financial foundations for your business.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  onClick={() => window.open('/auth?mode=register', '_blank')}
                >
                  Join to Start Banking Setup
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  onClick={() => window.open('/auth?mode=register', '_blank')}
                >
                  Join to Schedule Banking Consultation
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

export default GeorgianBankingPage;