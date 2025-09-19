import React, { useState } from 'react';
import { Shield, Lock, Eye, Users, Globe, Mail, MapPin, ChevronDown, CheckCircle, Clock } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { useLanguage } from '../lib/language';
import { Card, Button } from '../lib/ui';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const PrivacyPage = () => {
  const { t } = useLanguage();
  const [expandedSection, setExpandedSection] = useState<number | null>(null);

  const toggleSection = (index: number) => {
    setExpandedSection(expandedSection === index ? null : index);
  };

  const privacySections = [
    {
      id: 1,
      title: 'Who to Contact About Your Personal Information?',
      icon: Mail,
      content: (
        <div className="space-y-4">
          <p className="text-gray-600 leading-relaxed">
            If you have any questions, concerns, or requests regarding your personal information or this Privacy Policy, 
            please contact us through the following channels:
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-blue-900 mb-2">Data Protection Officer</h4>
                <p className="text-blue-800">dpo@consulting19.com</p>
              </div>
              <div>
                <h4 className="font-semibold text-blue-900 mb-2">Privacy Inquiries</h4>
                <p className="text-blue-800">privacy@consulting19.com</p>
              </div>
              <div>
                <h4 className="font-semibold text-blue-900 mb-2">Business Address</h4>
                <p className="text-blue-800">5830 E 2ND ST 7000 WY<br />United States</p>
              </div>
              <div>
                <h4 className="font-semibold text-blue-900 mb-2">Response Time</h4>
                <p className="text-blue-800">Within 30 days of receipt</p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 2,
      title: 'Personal Information That We Collect',
      icon: Users,
      content: (
        <div className="space-y-6">
          <p className="text-gray-600 leading-relaxed">
            We collect various types of information to provide and improve our services:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-l-4 border-l-blue-500">
              <Card.Body>
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <Users className="w-5 h-5 text-blue-600 mr-2" />
                  Personal Identifiers
                </h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Name, email address, phone number</li>
                  <li>• Company name and business information</li>
                  <li>• Country of residence and contact details</li>
                  <li>• Account credentials and profile data</li>
                </ul>
              </Card.Body>
            </Card>

            <Card className="border-l-4 border-l-green-500">
              <Card.Body>
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <Globe className="w-5 h-5 text-green-600 mr-2" />
                  Usage Data
                </h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• IP address and browser information</li>
                  <li>• Pages visited and time spent on site</li>
                  <li>• Referring URLs and navigation patterns</li>
                  <li>• Device type and operating system</li>
                </ul>
              </Card.Body>
            </Card>

            <Card className="border-l-4 border-l-purple-500">
              <Card.Body>
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <Shield className="w-5 h-5 text-purple-600 mr-2" />
                  Financial Information
                </h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Billing addresses for transactions</li>
                  <li>• Payment information (processed via Stripe)</li>
                  <li>• Transaction history and invoices</li>
                  <li>• Credit card data (not stored by us)</li>
                </ul>
              </Card.Body>
            </Card>

            <Card className="border-l-4 border-l-orange-500">
              <Card.Body>
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <Mail className="w-5 h-5 text-orange-600 mr-2" />
                  Communication Data
                </h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Support tickets and chat messages</li>
                  <li>• Consultation notes and records</li>
                  <li>• Email correspondence</li>
                  <li>• AI assistant interactions</li>
                </ul>
              </Card.Body>
            </Card>
          </div>
        </div>
      )
    },
    {
      id: 3,
      title: 'How We Use Personal Information',
      icon: Eye,
      content: (
        <div className="space-y-4">
          <p className="text-gray-600 leading-relaxed">
            We use the collected information for the following legitimate business purposes:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              'Provide, operate, and maintain our consulting services',
              'Manage your account and provide technical support',
              'Respond to your questions and service requests',
              'Improve our services and develop new features',
              'Send marketing communications (with your consent)',
              'Comply with legal obligations and prevent fraud',
              'Analyze website usage and performance trends',
              'Connect you with appropriate consultants and experts',
              'Process payments and manage billing',
              'Provide AI-powered recommendations and support'
            ].map((use, index) => (
              <div key={index} className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">{use}</span>
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      id: 4,
      title: 'International Transfer of Personal Information',
      icon: Globe,
      content: (
        <div className="space-y-4">
          <p className="text-gray-600 leading-relaxed">
            Your information may be stored and processed on servers located outside your country of residence. 
            We take necessary steps to ensure your data is protected in accordance with this Privacy Policy and applicable data protection laws.
          </p>
          <Card className="bg-blue-50 border-blue-200">
            <Card.Body>
              <h4 className="font-semibold text-blue-900 mb-3">GDPR Compliance</h4>
              <p className="text-blue-800 text-sm">
                Consulting19 ensures compliance with GDPR and other international data protection laws when 
                transferring information across borders. We implement appropriate safeguards including 
                standard contractual clauses and adequacy decisions.
              </p>
            </Card.Body>
          </Card>
        </div>
      )
    },
    {
      id: 5,
      title: 'Sharing of Personal Information',
      icon: Users,
      content: (
        <div className="space-y-6">
          <p className="text-gray-600 leading-relaxed">
            We may share your personal information with third parties only in the following circumstances:
          </p>
          
          <div className="space-y-4">
            <Card className="border-l-4 border-l-blue-500">
              <Card.Body>
                <h4 className="font-semibold text-gray-900 mb-2">Service Providers</h4>
                <p className="text-gray-600 text-sm">
                  Third-party companies that help us provide our services, including payment processors (Stripe), 
                  hosting services (Supabase), and analytics providers (Google Analytics).
                </p>
              </Card.Body>
            </Card>

            <Card className="border-l-4 border-l-green-500">
              <Card.Body>
                <h4 className="font-semibold text-gray-900 mb-2">Business Partners</h4>
                <p className="text-gray-600 text-sm">
                  Qualified consultants and experts in our network who provide services to you. 
                  We only share information necessary for service delivery.
                </p>
              </Card.Body>
            </Card>

            <Card className="border-l-4 border-l-red-500">
              <Card.Body>
                <h4 className="font-semibold text-gray-900 mb-2">Legal Requirements</h4>
                <p className="text-gray-600 text-sm">
                  To comply with legal obligations, respond to subpoenas, or comply with legal processes. 
                  We will notify you unless prohibited by law.
                </p>
              </Card.Body>
            </Card>

            <Card className="border-l-4 border-l-purple-500">
              <Card.Body>
                <h4 className="font-semibold text-gray-900 mb-2">With Your Consent</h4>
                <p className="text-gray-600 text-sm">
                  Any other sharing will only occur with your explicit consent and for purposes you approve.
                </p>
              </Card.Body>
            </Card>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h4 className="font-semibold text-red-900 mb-2">OFAC Sanctions Compliance</h4>
            <p className="text-red-800 text-sm">
              Consulting19 will not deal or provide services to any OFAC (Office of Foreign Assets Control) 
              sanctions countries or individuals on sanctions lists.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 6,
      title: 'Security',
      icon: Shield,
      content: (
        <div className="space-y-4">
          <p className="text-gray-600 leading-relaxed">
            We implement comprehensive security measures to protect your personal information:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="text-center">
              <Card.Body>
                <Lock className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                <h4 className="font-semibold text-gray-900 mb-2">Encryption</h4>
                <p className="text-gray-600 text-sm">Industry-standard encryption for data in transit and at rest</p>
              </Card.Body>
            </Card>
            <Card className="text-center">
              <Card.Body>
                <Shield className="w-8 h-8 text-green-600 mx-auto mb-3" />
                <h4 className="font-semibold text-gray-900 mb-2">Access Controls</h4>
                <p className="text-gray-600 text-sm">Strict access controls and authentication systems</p>
              </Card.Body>
            </Card>
            <Card className="text-center">
              <Card.Body>
                <Eye className="w-8 h-8 text-purple-600 mx-auto mb-3" />
                <h4 className="font-semibold text-gray-900 mb-2">Monitoring</h4>
                <p className="text-gray-600 text-sm">Continuous monitoring for security threats and breaches</p>
              </Card.Body>
            </Card>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-yellow-800 text-sm">
              <strong>Important:</strong> No method of transmission over the internet or electronic storage is 100% secure. 
              While we implement all reasonable security measures, we cannot guarantee absolute security.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 7,
      title: 'Retention of Personal Information',
      icon: Lock,
      content: (
        <div className="space-y-4">
          <p className="text-gray-600 leading-relaxed">
            We retain your personal information only for as long as necessary to fulfill the purposes outlined 
            in this Privacy Policy or as required by law.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-green-50 border-green-200">
              <Card.Body>
                <h4 className="font-semibold text-green-900 mb-2">Active Accounts</h4>
                <p className="text-green-800 text-sm">
                  Information retained while your account is active and for legitimate business purposes.
                </p>
              </Card.Body>
            </Card>
            <Card className="bg-blue-50 border-blue-200">
              <Card.Body>
                <h4 className="font-semibold text-blue-900 mb-2">Legal Requirements</h4>
                <p className="text-blue-800 text-sm">
                  Some information may be retained longer to comply with legal, regulatory, or tax obligations.
                </p>
              </Card.Body>
            </Card>
          </div>
          <p className="text-gray-600 text-sm">
            When we no longer need your information, we securely delete or anonymize it using industry-standard methods.
          </p>
        </div>
      )
    },
    {
      id: 8,
      title: 'Personal Information of Other Individuals',
      icon: Users,
      content: (
        <div className="space-y-4">
          <p className="text-gray-600 leading-relaxed">
            If you provide us with personal information about other individuals (such as dependents, employees, 
            or business partners), you must ensure that:
          </p>
          <div className="space-y-3">
            {[
              'You have the authority to share their information with us',
              'You have informed them about this Privacy Policy',
              'You have obtained their consent where required',
              'The information is accurate and up-to-date'
            ].map((requirement, index) => (
              <div key={index} className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">{requirement}</span>
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      id: 9,
      title: 'Your Rights and How to Exercise Them',
      icon: CheckCircle,
      content: (
        <div className="space-y-6">
          <p className="text-gray-600 leading-relaxed">
            You have several rights regarding your personal information under applicable data protection laws:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { title: 'Right to Access', desc: 'Request access to personal information we hold about you' },
              { title: 'Right to Rectification', desc: 'Request correction of inaccurate or incomplete information' },
              { title: 'Right to Erasure', desc: 'Request deletion of your personal information under certain conditions' },
              { title: 'Right to Restrict Processing', desc: 'Request restriction of processing under certain conditions' },
              { title: 'Right to Data Portability', desc: 'Receive your data in a structured, machine-readable format' },
              { title: 'Right to Object', desc: 'Object to the processing of your personal information' },
              { title: 'Right to Withdraw Consent', desc: 'Withdraw consent at any time where processing is based on consent' },
              { title: 'Right to Lodge a Complaint', desc: 'File a complaint with your local data protection authority' }
            ].map((right, index) => (
              <Card key={index} className="border border-gray-200">
                <Card.Body>
                  <h4 className="font-semibold text-gray-900 mb-2">{right.title}</h4>
                  <p className="text-gray-600 text-sm">{right.desc}</p>
                </Card.Body>
              </Card>
            ))}
          </div>

          <Card className="bg-blue-50 border-blue-200">
            <Card.Body>
              <h4 className="font-semibold text-blue-900 mb-3">How to Exercise Your Rights</h4>
              <p className="text-blue-800 text-sm mb-3">
                To exercise any of these rights, please contact us at privacy@consulting19.com with:
              </p>
              <ul className="space-y-1 text-blue-800 text-sm">
                <li>• Your full name and email address</li>
                <li>• Specific right you wish to exercise</li>
                <li>• Detailed description of your request</li>
                <li>• Proof of identity (for security purposes)</li>
              </ul>
            </Card.Body>
          </Card>
        </div>
      )
    },
    {
      id: 10,
      title: 'Other Information We Collect Through the Site',
      icon: Globe,
      content: (
        <div className="space-y-4">
          <p className="text-gray-600 leading-relaxed">
            In addition to personal information, we collect technical and usage data to improve our services:
          </p>
          <div className="space-y-4">
            <Card className="border-l-4 border-l-indigo-500">
              <Card.Body>
                <h4 className="font-semibold text-gray-900 mb-2">Cookies & Tracking Technologies</h4>
                <p className="text-gray-600 text-sm mb-3">
                  We use cookies and similar technologies to enhance user experience and analyze site traffic. 
                  For detailed information, please see our Cookie Policy.
                </p>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline" onClick={() => window.location.href = '/cookies'}>
                    View Cookie Policy
                  </Button>
                </div>
              </Card.Body>
            </Card>
            <Card className="border-l-4 border-l-teal-500">
              <Card.Body>
                <h4 className="font-semibold text-gray-900 mb-2">Analytics Data</h4>
                <p className="text-gray-600 text-sm">
                  We use Google Analytics and other tools to understand how visitors interact with our site, 
                  which helps us improve user experience and service quality.
                </p>
              </Card.Body>
            </Card>
          </div>
        </div>
      )
    },
    {
      id: 11,
      title: 'Third Party Websites',
      icon: Globe,
      content: (
        <div className="space-y-4">
          <p className="text-gray-600 leading-relaxed">
            Our website may contain links to third-party websites, services, or applications. This Privacy Policy 
            does not apply to these external sites.
          </p>
          <Card className="bg-orange-50 border-orange-200">
            <Card.Body>
              <h4 className="font-semibold text-orange-900 mb-2">Important Notice</h4>
              <p className="text-orange-800 text-sm">
                Consulting19 is not responsible for the privacy practices of linked third-party websites. 
                We encourage you to read the privacy policies of any external sites you visit.
              </p>
            </Card.Body>
          </Card>
        </div>
      )
    },
    {
      id: 12,
      title: 'Use of Site by Minors',
      icon: Shield,
      content: (
        <div className="space-y-4">
          <p className="text-gray-600 leading-relaxed">
            Our services are not intended for individuals under the age of 18. We do not knowingly collect 
            personal information from children under 18.
          </p>
          <Card className="bg-red-50 border-red-200">
            <Card.Body>
              <h4 className="font-semibold text-red-900 mb-2">Child Protection Policy</h4>
              <p className="text-red-800 text-sm">
                If we become aware that we have collected personal information from a child under 18, 
                we will take immediate steps to delete such information from our systems.
              </p>
            </Card.Body>
          </Card>
        </div>
      )
    },
    {
      id: 13,
      title: 'Changes to This Privacy Policy',
      icon: Eye,
      content: (
        <div className="space-y-4">
          <p className="text-gray-600 leading-relaxed">
            We may update this Privacy Policy from time to time to reflect changes in our practices, 
            technology, legal requirements, or other factors.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-blue-50 border-blue-200">
              <Card.Body>
                <h4 className="font-semibold text-blue-900 mb-2">Notification Process</h4>
                <p className="text-blue-800 text-sm">
                  We will notify you of significant changes via email or prominent notice on our website 
                  at least 30 days before changes take effect.
                </p>
              </Card.Body>
            </Card>
            <Card className="bg-green-50 border-green-200">
              <Card.Body>
                <h4 className="font-semibold text-green-900 mb-2">Effective Date</h4>
                <p className="text-green-800 text-sm">
                  Changes become effective when posted on our website. Continued use of our services 
                  constitutes acceptance of the updated policy.
                </p>
              </Card.Body>
            </Card>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Privacy Policy - Consulting19</title>
        <meta name="description" content="Learn about Consulting19's privacy policy. How we collect, use, and protect your data with full transparency and compliance." />
      </Helmet>

      <Navbar />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-teal-600 to-purple-600 text-white py-20 mt-16 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-32 h-32 border-2 border-white rounded-full animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-24 h-24 border-2 border-white rounded-lg rotate-45 animate-pulse delay-1000"></div>
        </div>

        {/* Floating Shield Icons */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
          <div className="absolute top-32 left-1/4 text-4xl animate-float">🔒</div>
          <div className="absolute bottom-32 right-1/4 text-3xl animate-float-delayed">🛡️</div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Privacy Policy</h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Your privacy and data security are our top priorities.
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Introduction */}
        <Card className="mb-12 bg-gradient-to-r from-blue-50 to-teal-50 border-blue-200">
          <Card.Body className="py-8">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Our Commitment to Your Privacy</h2>
              <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                <p className="mb-4">
                  Consulting19 is committed to protecting the privacy of the individuals we encounter in conducting our business. 
                  "Personal Information" is information that identifies and relates to you or other individuals (such as your dependents).
                </p>
                <p className="mb-4">
                  This Privacy Policy describes how we handle Personal Information that we collect both through this website 
                  (the "Site") and through other means (for example, from your application forms, telephone calls, e-mails, 
                  and other communications with us, as well as from witnesses or other third parties involved in our business dealings with you).
                </p>
                <div className="bg-white border border-blue-200 rounded-lg p-4 mb-4">
                  <p className="text-blue-900 font-semibold mb-2">Important Compliance Notice:</p>
                  <p className="text-blue-800 text-sm mb-2">
                    • Consulting19 will not deal or provide services or products to any OFAC (Office of Foreign Assets Control) sanctions countries.
                  </p>
                  <p className="text-blue-800 text-sm">
                    • All credit/debit card details and personally identifiable information in relation to Stripe will not be stored, sold, shared, rented, or leased to any third parties.
                  </p>
                </div>
                <p className="text-center font-medium text-gray-900">
                  By using the Consulting19 Online Services, you signify your acceptance of this Privacy Policy.
                </p>
              </div>
            </div>
          </Card.Body>
        </Card>

        {/* Privacy Sections */}
        <div className="space-y-6">
          {privacySections.map((section, index) => (
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
              <h2 className="text-3xl font-bold mb-4">Contact Us About Privacy</h2>
              <p className="text-blue-100 max-w-2xl mx-auto">
                Have questions about our privacy practices? We're here to help and ensure transparency.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold mb-2">Privacy Inquiries</h3>
                <p className="text-blue-100 text-sm">privacy@consulting19.com</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold mb-2">Data Protection Officer</h3>
                <p className="text-blue-100 text-sm">dpo@consulting19.com</p>
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
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold mb-2">Response Time</h3>
                <p className="text-blue-100 text-sm">Within 30 days<br />of receipt</p>
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

export default PrivacyPage;