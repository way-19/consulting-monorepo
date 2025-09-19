import React from 'react';
import { ArrowLeft, CheckCircle, Clock, DollarSign, FileText, Users, Shield, Plane, Home, Globe, MessageSquare, Calendar, Building } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useLanguage } from '../../lib/language';
import { Button, Card } from '../../lib/ui';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const GeorgianVisaPage = () => {
  const { t } = useLanguage();

  const serviceFeatures = [
    'Visa eligibility assessment',
    'Document preparation and review',
    'Application submission assistance',
    'Government liaison services',
    'Status tracking and updates',
    'Interview preparation (if required)',
    'Renewal assistance',
    'Legal compliance guidance',
  ];

  const processSteps = [
    {
      step: 1,
      title: 'Eligibility Assessment',
      description: 'Evaluate your eligibility for Georgian visa or residence permit',
      duration: '1-2 days',
    },
    {
      step: 2,
      title: 'Document Collection',
      description: 'Gather and prepare all required documentation',
      duration: '1 week',
    },
    {
      step: 3,
      title: 'Application Preparation',
      description: 'Complete application forms and supporting materials',
      duration: '2-3 days',
    },
    {
      step: 4,
      title: 'Submission & Payment',
      description: 'Submit application and process government fees',
      duration: '1 day',
    },
    {
      step: 5,
      title: 'Processing & Follow-up',
      description: 'Monitor application status and provide updates',
      duration: '2-4 weeks',
    },
    {
      step: 6,
      title: 'Approval & Collection',
      description: 'Collect approved visa/permit and provide guidance',
      duration: '1-2 days',
    },
  ];

  const requirements = [
    'Valid passport (6+ months validity)',
    'Completed application form',
    'Passport-sized photographs',
    'Proof of accommodation in Georgia',
    'Financial means documentation',
    'Health insurance certificate',
    'Criminal background check',
    'Purpose of stay documentation',
  ];

  const visaTypes = [
    {
      title: 'Tourist Visa',
      description: 'Short-term visits up to 90 days',
      icon: Plane,
      duration: '90 days',
      processing: '5-10 days',
    },
    {
      title: 'Business Visa',
      description: 'Business activities and meetings',
      icon: Building,
      duration: '90 days',
      processing: '5-10 days',
    },
    {
      title: 'Work Permit',
      description: 'Employment in Georgian companies',
      icon: Users,
      duration: '1 year',
      processing: '2-4 weeks',
    },
    {
      title: 'Residence Permit',
      description: 'Long-term residence in Georgia',
      icon: Home,
      duration: '1-5 years',
      processing: '2-4 weeks',
    },
  ];

  const faqs = [
    {
      question: 'Do I need a visa to visit Georgia?',
      answer: 'Citizens of many countries can visit Georgia visa-free for up to 365 days. However, some nationalities require a visa. We can check your specific requirements.',
    },
    {
      question: 'How long does the visa application process take?',
      answer: 'Tourist and business visas typically take 5-10 working days, while work permits and residence permits take 2-4 weeks to process.',
    },
    {
      question: 'Can I apply for a Georgian visa online?',
      answer: 'Yes, Georgia offers an e-visa system for eligible countries. We can assist with both online and embassy applications.',
    },
    {
      question: 'What is the difference between a visa and residence permit?',
      answer: 'A visa allows temporary entry, while a residence permit allows you to live in Georgia for extended periods (1-5 years) and can be renewed.',
    },
    {
      question: 'Can I work in Georgia with a tourist visa?',
      answer: 'No, tourist visas do not allow employment. You need a work permit or appropriate residence permit to work legally in Georgia.',
    },
    {
      question: 'How much does a Georgian visa cost?',
      answer: 'Visa fees vary by type and nationality, typically ranging from $20-200. We provide exact fee information based on your specific case.',
    },
    {
      question: 'Can I extend my visa while in Georgia?',
      answer: 'Some visa types can be extended, while others require leaving and reapplying. We advise on the best approach for your situation.',
    },
    {
      question: 'What happens if my visa application is rejected?',
      answer: 'We review rejection reasons and can assist with reapplication or appeals. Our high success rate minimizes rejection risks.',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Georgian Visa & Residence Permit Services - Expert Immigration Assistance - Consulting19</title>
        <meta name="description" content="Professional Georgian visa and residence permit services. Expert assistance with applications, documentation, and compliance." />
      </Helmet>

      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-20 mt-16">
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
                <Plane className="w-6 h-6 text-white" />
              </div>
              <span className="text-6xl">🇬🇪</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Visa & Residence Permit
            </h1>
            <p className="text-xl text-indigo-100 mb-8 leading-relaxed">
              Professional visa and residence permit services for Georgia. Expert guidance 
              through immigration processes with high success rates.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                icon={MessageSquare}
                onClick={() => window.open('/auth?mode=register', '_blank')}
              >
                Join to Contact Immigration Specialist
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
        {/* Visa Types */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Visa & Permit Types</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {visaTypes.map((visa, index) => (
              <Card key={index} hover className="text-center">
                <Card.Body>
                  <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <visa.icon className="w-6 h-6 text-indigo-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">{visa.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{visa.description}</p>
                  <div className="space-y-2 text-xs text-gray-500">
                    <div className="flex justify-between">
                      <span>Duration:</span>
                      <span className="font-medium">{visa.duration}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Processing:</span>
                      <span className="font-medium">{visa.processing}</span>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            ))}
          </div>
        </section>

        {/* Service Process */}
        <section className="mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Application Process</h2>
              <div className="space-y-6">
                {processSteps.map((step, index) => (
                  <Card key={index}>
                    <Card.Body>
                      <div className="flex items-start space-x-4">
                        <div className="w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold">
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
                    <FileText className="w-5 h-5 text-indigo-600 flex-shrink-0" />
                    <span className="text-gray-700">{requirement}</span>
                  </div>
                ))}
              </div>
              
              <Card className="bg-indigo-50 border-indigo-200">
                <Card.Body>
                  <h3 className="text-lg font-semibold text-indigo-900 mb-4">Why Choose Our Service</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Shield className="w-5 h-5 text-indigo-600" />
                      <span className="text-indigo-800">95% approval rate</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Users className="w-5 h-5 text-indigo-600" />
                      <span className="text-indigo-800">Expert immigration lawyers</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Globe className="w-5 h-5 text-indigo-600" />
                      <span className="text-indigo-800">Government connections</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-indigo-600" />
                      <span className="text-indigo-800">Full process management</span>
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
                      <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center group-open:bg-indigo-600 transition-colors">
                        <span className="text-indigo-600 group-open:text-white text-lg font-bold group-open:rotate-45 transition-all">+</span>
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
          <Card className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
            <Card.Body className="text-center py-12">
              <h2 className="text-3xl font-bold mb-4">Ready to Apply for Your Georgian Visa?</h2>
              <p className="text-indigo-100 mb-8 max-w-2xl mx-auto">
                Get expert assistance with your Georgian visa or residence permit application. High success rates and professional guidance.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  onClick={() => window.open('/auth?mode=register', '_blank')}
                >
                  Join to Start Visa Application
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

export default GeorgianVisaPage;