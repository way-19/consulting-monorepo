import React, { useState } from 'react';
import { Scale, Shield, Users, Building2, CreditCard, Globe, Mail, MapPin, ChevronDown, CheckCircle, AlertTriangle, FileText, Gavel } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { useLanguage } from '../lib/language';
import { Card, Button } from '../lib/ui';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const TermsPage = () => {
  const { t } = useLanguage();
  const [expandedSection, setExpandedSection] = useState<number | null>(null);

  const toggleSection = (index: number) => {
    setExpandedSection(expandedSection === index ? null : index);
  };

  const termsSections = [
    {
      id: 1,
      title: 'Service Description',
      icon: Building2,
      content: (
        <div className="space-y-4">
          <p className="text-gray-600 leading-relaxed">
            Consulting19 is a platform providing international business consulting services, including:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              'Company formation consulting',
              'Tax optimization advisory',
              'Visa & residency consulting',
              'Banking solutions',
              'Legal compliance advisory',
              'Asset protection strategies',
              'Investment advisory',
              'Market research',
              'AI-powered business recommendations',
              'Expert consultant matching'
            ].map((service, index) => (
              <div key={index} className="flex items-center space-x-3">
                <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0" />
                <span className="text-gray-700">{service}</span>
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      id: 2,
      title: 'User Accounts',
      icon: Users,
      content: (
        <div className="space-y-4">
          <p className="text-gray-600 leading-relaxed">
            To use some of our services, you may need to create an account. When creating an account:
          </p>
          <div className="space-y-3">
            {[
              'Must provide accurate, current, and complete information',
              'Responsible for maintaining account security',
              'Do not share account credentials with others',
              'Must notify Consulting19 of suspicious activity',
              'Must be at least 18 years old to create an account'
            ].map((requirement, index) => (
              <div key={index} className="flex items-start space-x-3">
                <Shield className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">{requirement}</span>
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      id: 3,
      title: 'Acceptable Use',
      icon: CheckCircle,
      content: (
        <div className="space-y-6">
          <p className="text-gray-600 leading-relaxed">
            When using our services, you must comply with the following rules:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-l-4 border-l-green-500">
              <Card.Body>
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                  Required Conduct
                </h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Act in accordance with all applicable laws and regulations</li>
                  <li>• Respect the rights of others</li>
                  <li>• Provide accurate and truthful information</li>
                  <li>• Use services for legitimate business purposes</li>
                </ul>
              </Card.Body>
            </Card>

            <Card className="border-l-4 border-l-red-500">
              <Card.Body>
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
                  Prohibited Activities
                </h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Violating laws or regulations</li>
                  <li>• Providing misleading or false information</li>
                  <li>• Abusing or harming the system</li>
                  <li>• Sending spam or unwanted content</li>
                  <li>• Engaging in illegal activities</li>
                  <li>• Unauthorized access attempts</li>
                </ul>
              </Card.Body>
            </Card>
          </div>
        </div>
      )
    },
    {
      id: 4,
      title: 'Consulting Services',
      icon: Users,
      content: (
        <div className="space-y-4">
          <p className="text-gray-600 leading-relaxed">
            Our consulting services are provided through qualified professionals in our network:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-blue-50 border-blue-200">
              <Card.Body>
                <h4 className="font-semibold text-blue-900 mb-2">Service Standards</h4>
                <ul className="space-y-1 text-blue-800 text-sm">
                  <li>• All consultants are vetted and qualified</li>
                  <li>• Services based on current laws and regulations</li>
                  <li>• Professional standards maintained</li>
                </ul>
              </Card.Body>
            </Card>
            <Card className="bg-orange-50 border-orange-200">
              <Card.Body>
                <h4 className="font-semibold text-orange-900 mb-2">Important Disclaimers</h4>
                <ul className="space-y-1 text-orange-800 text-sm">
                  <li>• Outcomes/results not guaranteed</li>
                  <li>• Users responsible for final decisions</li>
                  <li>• Additional fees may apply for specialized services</li>
                </ul>
              </Card.Body>
            </Card>
          </div>
        </div>
      )
    },
    {
      id: 5,
      title: 'Payment and Billing',
      icon: CreditCard,
      content: (
        <div className="space-y-4">
          <p className="text-gray-600 leading-relaxed">
            For paid services, the following terms apply:
          </p>
          <div className="space-y-4">
            {[
              { title: 'Transparent Pricing', desc: 'All fees are clearly stated and require your approval before processing' },
              { title: 'Secure Processing', desc: 'Payments are processed through secure payment processors like Stripe' },
              { title: 'Refund Policies', desc: 'Refund policies may vary by service type and will be clearly communicated' },
              { title: 'Tax Responsibility', desc: 'You are responsible for all applicable taxes in your jurisdiction' },
              { title: 'Late Payment Fees', desc: 'Late payment fees may apply for overdue accounts' },
              { title: 'Price Changes', desc: 'We reserve the right to change pricing with advance notice' }
            ].map((item, index) => (
              <Card key={index} className="border border-gray-200">
                <Card.Body>
                  <h4 className="font-semibold text-gray-900 mb-2">{item.title}</h4>
                  <p className="text-gray-600 text-sm">{item.desc}</p>
                </Card.Body>
              </Card>
            ))}
          </div>
        </div>
      )
    },
    {
      id: 6,
      title: 'Intellectual Property',
      icon: Shield,
      content: (
        <div className="space-y-4">
          <p className="text-gray-600 leading-relaxed">
            All content, design, logos, trademarks, and other intellectual property elements related to our 
            website and services belong to Consulting19 and are protected by copyright laws.
          </p>
          <Card className="bg-purple-50 border-purple-200">
            <Card.Body>
              <h4 className="font-semibold text-purple-900 mb-3">Copyright Protection</h4>
              <p className="text-purple-800 text-sm mb-3">
                You may not copy, distribute, or use this content for commercial purposes without explicit 
                written permission from Consulting19.
              </p>
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-purple-600" />
                <span className="text-purple-800 text-sm font-medium">All rights reserved</span>
              </div>
            </Card.Body>
          </Card>
        </div>
      )
    },
    {
      id: 7,
      title: 'Privacy',
      icon: Shield,
      content: (
        <div className="space-y-4">
          <p className="text-gray-600 leading-relaxed">
            The collection, use, and protection of your personal data is detailed in our Privacy Policy.
          </p>
          <Card className="bg-blue-50 border-blue-200">
            <Card.Body>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-blue-900 mb-2">Privacy Policy Agreement</h4>
                  <p className="text-blue-800 text-sm">
                    By accepting these Terms, you also agree to our Privacy Policy.
                  </p>
                </div>
                <Button size="sm" variant="outline" onClick={() => window.location.href = '/privacy'}>
                  View Privacy Policy
                </Button>
              </div>
            </Card.Body>
          </Card>
        </div>
      )
    },
    {
      id: 8,
      title: 'AI Services and Recommendations',
      icon: Globe,
      content: (
        <div className="space-y-4">
          <p className="text-gray-600 leading-relaxed">
            Our AI-powered services and recommendations:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="border-l-4 border-l-blue-500">
              <Card.Body>
                <h4 className="font-semibold text-gray-900 mb-2">AI Limitations</h4>
                <ul className="space-y-1 text-gray-600 text-sm">
                  <li>• Provided for informational purposes only</li>
                  <li>• Should not replace professional human advice</li>
                  <li>• May not be 100% accurate and should be verified</li>
                  <li>• Continuously improved but may contain limitations</li>
                </ul>
              </Card.Body>
            </Card>
            <Card className="border-l-4 border-l-orange-500">
              <Card.Body>
                <h4 className="font-semibold text-gray-900 mb-2">Human Validation Required</h4>
                <p className="text-gray-600 text-sm">
                  All AI recommendations require human expert consultation for final decisions 
                  and implementation.
                </p>
              </Card.Body>
            </Card>
          </div>
        </div>
      )
    },
    {
      id: 9,
      title: 'Service Denial',
      icon: AlertTriangle,
      content: (
        <div className="space-y-4">
          <p className="text-gray-600 leading-relaxed">
            We reserve the right to refuse service in the following situations:
          </p>
          <div className="space-y-3">
            {[
              'Users who violate these Terms of Service',
              'Individuals or entities engaged in illegal activities',
              'Customers who provide false or incomplete information',
              'Situations that may negatively affect our service quality',
              'High-risk jurisdictions or sanctioned entities',
              'Requests that violate applicable laws or regulations'
            ].map((reason, index) => (
              <div key={index} className="flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">{reason}</span>
              </div>
            ))}
          </div>
          <Card className="bg-red-50 border-red-200">
            <Card.Body>
              <h4 className="font-semibold text-red-900 mb-2">OFAC Compliance</h4>
              <p className="text-red-800 text-sm">
                Consulting19 will not deal or provide services to any OFAC (Office of Foreign Assets Control) 
                sanctions countries or individuals on sanctions lists.
              </p>
            </Card.Body>
          </Card>
        </div>
      )
    },
    {
      id: 10,
      title: 'Limitation of Liability',
      icon: Shield,
      content: (
        <div className="space-y-4">
          <p className="text-gray-600 leading-relaxed">
            Consulting19 does not guarantee that our services will be uninterrupted, error-free, or secure.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-yellow-50 border-yellow-200">
              <Card.Body>
                <h4 className="font-semibold text-yellow-900 mb-2">Service Limitations</h4>
                <p className="text-yellow-800 text-sm">
                  We are not liable for direct or indirect damages that may arise from the use of our services.
                </p>
              </Card.Body>
            </Card>
            <Card className="bg-blue-50 border-blue-200">
              <Card.Body>
                <h4 className="font-semibold text-blue-900 mb-2">Liability Cap</h4>
                <p className="text-blue-800 text-sm">
                  Our liability is limited to the amount you paid for the specific service in question.
                </p>
              </Card.Body>
            </Card>
          </div>
        </div>
      )
    },
    {
      id: 11,
      title: 'Disclaimers',
      icon: AlertTriangle,
      content: (
        <div className="space-y-4">
          <p className="text-gray-600 leading-relaxed">
            Our services are provided "as is" and "as available." We make no warranties, express or implied, regarding:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { title: 'Information Accuracy', desc: 'The accuracy or completeness of information provided' },
              { title: 'Service Availability', desc: 'The availability or reliability of our services' },
              { title: 'Business Outcomes', desc: 'The success of any business formation or consulting advice' },
              { title: 'Legal Compliance', desc: 'Compliance with changing laws and regulations' },
              { title: 'Third-Party Services', desc: 'Third-party services or recommendations' }
            ].map((disclaimer, index) => (
              <Card key={index} className="border border-gray-200">
                <Card.Body>
                  <h4 className="font-semibold text-gray-900 mb-2">{disclaimer.title}</h4>
                  <p className="text-gray-600 text-sm">{disclaimer.desc}</p>
                </Card.Body>
              </Card>
            ))}
          </div>
        </div>
      )
    },
    {
      id: 12,
      title: 'Service Changes',
      icon: Globe,
      content: (
        <div className="space-y-4">
          <p className="text-gray-600 leading-relaxed">
            We reserve the right to modify, suspend, or terminate our services without prior notice.
          </p>
          <Card className="bg-blue-50 border-blue-200">
            <Card.Body>
              <h4 className="font-semibold text-blue-900 mb-2">Change Notification</h4>
              <p className="text-blue-800 text-sm">
                We will try to provide advance notice for significant changes when possible, 
                but reserve the right to make immediate changes when necessary for security or legal reasons.
              </p>
            </Card.Body>
          </Card>
        </div>
      )
    },
    {
      id: 13,
      title: 'Changes to Terms',
      icon: FileText,
      content: (
        <div className="space-y-4">
          <p className="text-gray-600 leading-relaxed">
            We may update these Terms of Service from time to time to reflect changes in our practices, 
            technology, or legal requirements.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-green-50 border-green-200">
              <Card.Body>
                <h4 className="font-semibold text-green-900 mb-2">Effective Date</h4>
                <p className="text-green-800 text-sm">
                  Changes become effective when posted on our website. Continued use constitutes acceptance.
                </p>
              </Card.Body>
            </Card>
            <Card className="bg-purple-50 border-purple-200">
              <Card.Body>
                <h4 className="font-semibold text-purple-900 mb-2">Notification</h4>
                <p className="text-purple-800 text-sm">
                  We may send email notifications for significant changes to these Terms.
                </p>
              </Card.Body>
            </Card>
          </div>
        </div>
      )
    },
    {
      id: 14,
      title: 'Termination',
      icon: AlertTriangle,
      content: (
        <div className="space-y-4">
          <p className="text-gray-600 leading-relaxed">
            Either party may terminate this agreement under certain conditions:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="border-l-4 border-l-blue-500">
              <Card.Body>
                <h4 className="font-semibold text-gray-900 mb-2">User Termination</h4>
                <p className="text-gray-600 text-sm">
                  You may terminate this agreement at any time by discontinuing use of our services 
                  and closing your account.
                </p>
              </Card.Body>
            </Card>
            <Card className="border-l-4 border-l-red-500">
              <Card.Body>
                <h4 className="font-semibold text-gray-900 mb-2">Service Termination</h4>
                <p className="text-gray-600 text-sm">
                  We may suspend or terminate your account if you violate these Terms. 
                  Upon termination, your right to use our services ceases immediately.
                </p>
              </Card.Body>
            </Card>
          </div>
        </div>
      )
    },
    {
      id: 15,
      title: 'Governing Law',
      icon: Gavel,
      content: (
        <div className="space-y-4">
          <p className="text-gray-600 leading-relaxed">
            These Terms are governed by the laws of the United States.
          </p>
          <Card className="bg-blue-50 border-blue-200">
            <Card.Body>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Gavel className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-blue-900 mb-1">Dispute Resolution</h4>
                  <p className="text-blue-800 text-sm">
                    Any disputes will be resolved in the courts of the United States under U.S. federal and state law.
                  </p>
                </div>
              </div>
            </Card.Body>
          </Card>
        </div>
      )
    },
    {
      id: 16,
      title: 'Severability',
      icon: Scale,
      content: (
        <div className="space-y-4">
          <p className="text-gray-600 leading-relaxed">
            If any provision of these Terms is found to be unenforceable or invalid, 
            the remaining provisions will continue to be valid and enforceable.
          </p>
          <Card className="bg-gray-50 border-gray-200">
            <Card.Body>
              <div className="flex items-center space-x-3">
                <Scale className="w-6 h-6 text-gray-600" />
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Legal Validity</h4>
                  <p className="text-gray-600 text-sm">
                    This ensures the overall agreement remains in effect even if individual clauses are challenged.
                  </p>
                </div>
              </div>
            </Card.Body>
          </Card>
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Terms of Service - Consulting19</title>
        <meta name="description" content="Consulting19 terms of service and conditions of use. Rules and conditions you must follow when using our platform." />
      </Helmet>

      <Navbar />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-teal-600 to-purple-600 text-white py-20 mt-16 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-32 h-32 border-2 border-white rounded-full animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-24 h-24 border-2 border-white rounded-lg rotate-45 animate-pulse delay-1000"></div>
        </div>

        {/* Floating Legal Icons */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
          <div className="absolute top-32 left-1/4 text-4xl animate-float">⚖️</div>
          <div className="absolute bottom-32 right-1/4 text-3xl animate-float-delayed">📋</div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
            <Scale className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Terms of Service</h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Terms and conditions governing your use of our platform.
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Introduction */}
        <Card className="mb-12 bg-gradient-to-r from-blue-50 to-teal-50 border-blue-200">
          <Card.Body className="py-8">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Agreement to Terms</h2>
              <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                <p className="mb-4">
                  These Terms of Service ("Terms") govern your use of the Consulting19 website and services. 
                  By visiting our website or using our services, you agree to be bound by these Terms.
                </p>
                <p className="mb-4">
                  If you do not agree to these Terms, please do not use our services.
                </p>
                <div className="bg-white border border-blue-200 rounded-lg p-4 mb-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <AlertTriangle className="w-6 h-6 text-orange-600" />
                    <h3 className="font-semibold text-orange-900">Important Compliance Notice</h3>
                  </div>
                  <ul className="space-y-2 text-blue-800 text-sm">
                    <li>• Consulting19 will not deal or provide services to any OFAC (Office of Foreign Assets Control) sanctions countries</li>
                    <li>• All credit/debit card details and personally identifiable information in relation to Stripe will not be stored, sold, shared, rented, or leased to any third parties</li>
                  </ul>
                </div>
                <p className="text-center font-medium text-gray-900">
                  By using the Consulting19 Online Services, you signify your acceptance of these Terms.
                </p>
              </div>
            </div>
          </Card.Body>
        </Card>

        {/* Terms Sections */}
        <div className="space-y-6">
          {termsSections.map((section, index) => (
            <Card key={section.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <Card.Header>
                <button
                  onClick={() => toggleSection(index)}
                  className="w-full flex items-center justify-between py-2 text-left"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <section.icon className="w-5 h-5 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">{section.title}</h3>
                  </div>
                  <ChevronDown 
                    className={`w-6 h-6 text-gray-400 transition-transform duration-300 ${
                      expandedSection === index ? 'rotate-180' : ''
                    }`} 
                  />
                </button>
              </Card.Header>
              
              <div className={`overflow-hidden transition-all duration-500 ease-in-out ${
                expandedSection === index ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
              }`}>
                <Card.Body className="pt-0">
                  <div className="border-t border-gray-200 pt-6">
                    {section.content}
                  </div>
                </Card.Body>
              </div>
            </Card>
          ))}
        </div>

        {/* Contact Information */}
        <Card className="mt-12 bg-gradient-to-r from-blue-600 to-teal-600 text-white">
          <Card.Body className="py-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Contact Us About Terms</h2>
              <p className="text-blue-100 max-w-2xl mx-auto">
                Have questions about our terms of service? We're here to provide clarity and support.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold mb-2">Legal Inquiries</h3>
                <p className="text-blue-100 text-sm">legal@consulting19.com</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center mx-auto mb-3">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold mb-2">Business Address</h3>
                <p className="text-blue-100 text-sm">5830 E 2ND ST 7000 WY<br />United States</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold mb-2">General Support</h3>
                <p className="text-blue-100 text-sm">support@consulting19.com</p>
              </div>
            </div>
          </Card.Body>
        </Card>

        {/* Last Updated */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            Last updated: {new Date().toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
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

export default TermsPage;