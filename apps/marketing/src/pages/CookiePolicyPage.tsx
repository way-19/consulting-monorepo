import React, { useState } from 'react';
import { Cookie, Shield, Settings, Eye, Users, Globe, Mail, MapPin, ChevronDown, CheckCircle, AlertTriangle, Clock, Monitor, X } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { useLanguage } from '../lib/language';
import { Card, Button } from '../lib/ui';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const CookiePolicyPage = () => {
  const { t } = useLanguage();
  const [expandedSection, setExpandedSection] = useState<number | null>(null);
  const [showCookieSettings, setShowCookieSettings] = useState(false);
  const [cookiePreferences, setCookiePreferences] = useState({
    essential: true, // Always true, cannot be disabled
    functional: true,
    analytics: true,
    marketing: false,
  });

  const toggleSection = (index: number) => {
    setExpandedSection(expandedSection === index ? null : index);
  };

  const updateCookiePreference = (category: string, value: boolean) => {
    if (category === 'essential') return; // Essential cookies cannot be disabled
    setCookiePreferences(prev => ({ ...prev, [category]: value }));
  };

  const saveCookiePreferences = () => {
    // Save preferences to localStorage
    localStorage.setItem('consulting19-cookie-preferences', JSON.stringify(cookiePreferences));
    
    // Apply preferences (in real implementation, this would control actual cookie behavior)
    console.log('Cookie preferences saved:', cookiePreferences);
    
    // Close modal
    setShowCookieSettings(false);
    
    // Show confirmation
    alert('Cookie preferences saved successfully!');
  };

  const acceptAllCookies = () => {
    const allAccepted = {
      essential: true,
      functional: true,
      analytics: true,
      marketing: true,
    };
    setCookiePreferences(allAccepted);
    localStorage.setItem('consulting19-cookie-preferences', JSON.stringify(allAccepted));
    setShowCookieSettings(false);
    alert('All cookies accepted!');
  };

  const rejectNonEssential = () => {
    const essentialOnly = {
      essential: true,
      functional: false,
      analytics: false,
      marketing: false,
    };
    setCookiePreferences(essentialOnly);
    localStorage.setItem('consulting19-cookie-preferences', JSON.stringify(essentialOnly));
    setShowCookieSettings(false);
    alert('Only essential cookies accepted!');
  };

  const cookieSections = [
    {
      id: 1,
      title: 'What Are Cookies?',
      icon: Cookie,
      content: (
        <div className="space-y-4">
          <p className="text-gray-600 leading-relaxed">
            Cookies are small text files that websites store on users' devices (computers, tablets, phones). 
            These files help websites function better and improve user experience.
          </p>
          <Card className="bg-blue-50 border-blue-200">
            <Card.Body>
              <div className="flex items-center space-x-3">
                <Shield className="w-6 h-6 text-blue-600" />
                <div>
                  <h4 className="font-semibold text-blue-900">Safe & Harmless</h4>
                  <p className="text-blue-800 text-sm">
                    Cookies do not contain personally identifiable information and are completely harmless to your device.
                  </p>
                </div>
              </div>
            </Card.Body>
          </Card>
        </div>
      )
    },
    {
      id: 2,
      title: 'Why We Use Cookies',
      icon: Settings,
      content: (
        <div className="space-y-4">
          <p className="text-gray-600 leading-relaxed">
            At Consulting19, we use cookies for the following purposes:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { icon: Shield, title: 'Essential Functionality', desc: 'Cookies necessary for our website to function properly' },
              { icon: Users, title: 'User Experience', desc: 'Remember your preferences to provide a more personalized experience' },
              { icon: Eye, title: 'Analytics', desc: 'Analyze website usage to improve our services' },
              { icon: Shield, title: 'Security', desc: 'Ensure account security and prevent fraud' },
              { icon: Globe, title: 'Marketing', desc: 'Show you more relevant content and advertisements' }
            ].map((purpose, index) => (
              <Card key={index} className="border-l-4 border-l-blue-500">
                <Card.Body>
                  <div className="flex items-center space-x-3 mb-2">
                    <purpose.icon className="w-5 h-5 text-blue-600" />
                    <h4 className="font-semibold text-gray-900">{purpose.title}</h4>
                  </div>
                  <p className="text-gray-600 text-sm">{purpose.desc}</p>
                </Card.Body>
              </Card>
            ))}
          </div>
        </div>
      )
    },
    {
      id: 3,
      title: 'Types of Cookies We Use',
      icon: Monitor,
      content: (
        <div className="space-y-6">
          <p className="text-gray-600 leading-relaxed">
            We use different types of cookies to provide various functionalities:
          </p>
          
          <div className="space-y-6">
            {/* Essential Cookies */}
            <Card className="border-l-4 border-l-red-500">
              <Card.Body>
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <Shield className="w-5 h-5 text-red-600 mr-2" />
                  1. Essential Cookies
                </h4>
                <p className="text-gray-600 text-sm mb-4">
                  These cookies are necessary for our website to perform basic functions and cannot be disabled:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    { name: 'Session Cookies', desc: 'Maintain your login status and session information' },
                    { name: 'Security Cookies', desc: 'Ensure account security and prevent attacks' },
                    { name: 'Load Balancing Cookies', desc: 'Distribute traffic across servers' },
                    { name: 'Authentication Cookies', desc: 'Verify your identity and access permissions' }
                  ].map((cookie, index) => (
                    <div key={index} className="bg-red-50 p-3 rounded-lg">
                      <h5 className="font-medium text-red-900 text-sm">{cookie.name}</h5>
                      <p className="text-red-800 text-xs">{cookie.desc}</p>
                    </div>
                  ))}
                </div>
              </Card.Body>
            </Card>

            {/* Functional Cookies */}
            <Card className="border-l-4 border-l-blue-500">
              <Card.Body>
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <Settings className="w-5 h-5 text-blue-600 mr-2" />
                  2. Functional Cookies
                </h4>
                <p className="text-gray-600 text-sm mb-4">
                  These cookies enable enhanced features and personalization of the website:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    { name: 'Language Preference', desc: 'Remember your selected language' },
                    { name: 'Theme Preference', desc: 'Store your light/dark theme choice' },
                    { name: 'Form Data', desc: 'Temporarily store form information you\'ve filled out' },
                    { name: 'Navigation Preferences', desc: 'Remember your menu and page preferences' },
                    { name: 'AI Assistant Settings', desc: 'Store your AI chat preferences and history' }
                  ].map((cookie, index) => (
                    <div key={index} className="bg-blue-50 p-3 rounded-lg">
                      <h5 className="font-medium text-blue-900 text-sm">{cookie.name}</h5>
                      <p className="text-blue-800 text-xs">{cookie.desc}</p>
                    </div>
                  ))}
                </div>
              </Card.Body>
            </Card>

            {/* Analytics Cookies */}
            <Card className="border-l-4 border-l-green-500">
              <Card.Body>
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <Eye className="w-5 h-5 text-green-600 mr-2" />
                  3. Analytics Cookies
                </h4>
                <p className="text-gray-600 text-sm mb-4">
                  Help us understand website performance and usage:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    { name: 'Google Analytics', desc: 'Visitor statistics and behavior analysis' },
                    { name: 'Page Views', desc: 'Identify most popular pages and content' },
                    { name: 'User Journey', desc: 'Analyze how you navigate through the site' },
                    { name: 'Performance Metrics', desc: 'Page load times and error rates' },
                    { name: 'Conversion Tracking', desc: 'Measure the effectiveness of our services' }
                  ].map((cookie, index) => (
                    <div key={index} className="bg-green-50 p-3 rounded-lg">
                      <h5 className="font-medium text-green-900 text-sm">{cookie.name}</h5>
                      <p className="text-green-800 text-xs">{cookie.desc}</p>
                    </div>
                  ))}
                </div>
              </Card.Body>
            </Card>

            {/* Marketing Cookies */}
            <Card className="border-l-4 border-l-purple-500">
              <Card.Body>
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <Globe className="w-5 h-5 text-purple-600 mr-2" />
                  4. Marketing Cookies
                </h4>
                <p className="text-gray-600 text-sm mb-4">
                  Used to show you more relevant advertisements and content:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    { name: 'Retargeting', desc: 'Show relevant ads based on pages you\'ve visited' },
                    { name: 'Social Media', desc: 'Integration with social media platforms' },
                    { name: 'Email Marketing', desc: 'Measure the effectiveness of email campaigns' },
                    { name: 'Conversion Tracking', desc: 'Measure the success of marketing campaigns' },
                    { name: 'Personalization', desc: 'Customize content based on your interests' }
                  ].map((cookie, index) => (
                    <div key={index} className="bg-purple-50 p-3 rounded-lg">
                      <h5 className="font-medium text-purple-900 text-sm">{cookie.name}</h5>
                      <p className="text-purple-800 text-xs">{cookie.desc}</p>
                    </div>
                  ))}
                </div>
              </Card.Body>
            </Card>
          </div>
        </div>
      )
    },
    {
      id: 4,
      title: 'Third-Party Cookies',
      icon: Globe,
      content: (
        <div className="space-y-4">
          <p className="text-gray-600 leading-relaxed">
            Our website may also use cookies from the following third-party services:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: 'Google Analytics', purpose: 'Website analytics' },
              { name: 'Google Ads', purpose: 'Advertising campaigns' },
              { name: 'Facebook Pixel', purpose: 'Social media advertising' },
              { name: 'LinkedIn Insight', purpose: 'Professional network advertising' },
              { name: 'Hotjar', purpose: 'User experience analysis' },
              { name: 'Intercom', purpose: 'Customer support system' },
              { name: 'Supabase', purpose: 'Backend services and authentication' },
              { name: 'Stripe', purpose: 'Payment processing' }
            ].map((service, index) => (
              <Card key={index} className="text-center">
                <Card.Body>
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Globe className="w-5 h-5 text-gray-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 text-sm mb-1">{service.name}</h4>
                  <p className="text-gray-600 text-xs">{service.purpose}</p>
                </Card.Body>
              </Card>
            ))}
          </div>
        </div>
      )
    },
    {
      id: 5,
      title: 'Cookie Management',
      icon: Settings,
      content: (
        <div className="space-y-6">
          <p className="text-gray-600 leading-relaxed">
            You can manage your cookie preferences in the following ways:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-l-4 border-l-blue-500">
              <Card.Body>
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <Monitor className="w-5 h-5 text-blue-600 mr-2" />
                  Browser Settings
                </h4>
                <p className="text-gray-600 text-sm mb-3">
                  Most web browsers automatically accept cookies, but you can modify your browser settings to:
                </p>
                <ul className="space-y-1 text-gray-600 text-sm">
                  <li>• Completely disable cookies</li>
                  <li>• Receive warnings before cookies are stored</li>
                  <li>• Delete existing cookies</li>
                  <li>• Block cookies from specific websites</li>
                  <li>• Set different rules for different types of cookies</li>
                </ul>
              </Card.Body>
            </Card>

            <Card className="border-l-4 border-l-green-500">
              <Card.Body>
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <Settings className="w-5 h-5 text-green-600 mr-2" />
                  Cookie Preference Center
                </h4>
                <p className="text-gray-600 text-sm mb-3">
                  You can manage your cookie preferences through the "Cookie Settings" link at the bottom of our website:
                </p>
                <ul className="space-y-1 text-gray-600 text-sm">
                  <li>• Turn cookie categories on and off individually</li>
                  <li>• See which cookies are currently active</li>
                  <li>• Change your preferences at any time</li>
                  <li>• View detailed information about each cookie</li>
                </ul>
              </Card.Body>
            </Card>
          </div>
        </div>
      )
    },
    {
      id: 6,
      title: 'Cookie Duration',
      icon: Clock,
      content: (
        <div className="space-y-4">
          <p className="text-gray-600 leading-relaxed">
            Our cookies are stored for different periods:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { type: 'Session Cookies', duration: 'Deleted when you close your browser', color: 'blue' },
              { type: 'Persistent Cookies', duration: 'Stored for a specific period (usually 1-2 years)', color: 'green' },
              { type: 'Security Cookies', duration: 'Active during your session', color: 'red' },
              { type: 'Analytics Cookies', duration: 'May be stored for up to 2 years', color: 'purple' },
              { type: 'Marketing Cookies', duration: 'Typically stored for 30-90 days', color: 'orange' }
            ].map((cookie, index) => (
              <Card key={index} className={`border-l-4 border-l-${cookie.color}-500`}>
                <Card.Body>
                  <h4 className={`font-semibold text-${cookie.color}-900 text-sm mb-2`}>{cookie.type}</h4>
                  <p className={`text-${cookie.color}-800 text-xs`}>{cookie.duration}</p>
                </Card.Body>
              </Card>
            ))}
          </div>
        </div>
      )
    },
    {
      id: 7,
      title: 'Effects of Disabling Cookies',
      icon: AlertTriangle,
      content: (
        <div className="space-y-4">
          <p className="text-gray-600 leading-relaxed">
            If you disable cookies:
          </p>
          <Card className="bg-orange-50 border-orange-200">
            <Card.Body>
              <h4 className="font-semibold text-orange-900 mb-3">Potential Limitations</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  'Some website features may not work properly',
                  'You may not receive a personalized experience',
                  'You may need to log in again each visit',
                  'Your preferences may not be remembered',
                  'Some forms and features may be unavailable',
                  'AI assistant functionality may be limited'
                ].map((limitation, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <AlertTriangle className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" />
                    <span className="text-orange-800 text-sm">{limitation}</span>
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>
        </div>
      )
    },
    {
      id: 8,
      title: 'Mobile Applications',
      icon: Monitor,
      content: (
        <div className="space-y-4">
          <p className="text-gray-600 leading-relaxed">
            In our mobile applications, we may use similar technologies instead of cookies:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { name: 'App Data', desc: 'Store your preferences and settings' },
              { name: 'Device Identifiers', desc: 'For security and analytics purposes' },
              { name: 'Push Notifications', desc: 'To send you important updates' },
              { name: 'Local Storage', desc: 'Cache data for better performance' }
            ].map((tech, index) => (
              <Card key={index} className="border border-gray-200">
                <Card.Body>
                  <h4 className="font-semibold text-gray-900 mb-2">{tech.name}</h4>
                  <p className="text-gray-600 text-sm">{tech.desc}</p>
                </Card.Body>
              </Card>
            ))}
          </div>
        </div>
      )
    },
    {
      id: 9,
      title: 'International Transfers',
      icon: Globe,
      content: (
        <div className="space-y-4">
          <p className="text-gray-600 leading-relaxed">
            Data collected through cookies may be transferred to countries where our service providers are located. 
            These transfers are conducted with appropriate security measures.
          </p>
          <Card className="bg-blue-50 border-blue-200">
            <Card.Body>
              <div className="flex items-center space-x-3">
                <Shield className="w-6 h-6 text-blue-600" />
                <div>
                  <h4 className="font-semibold text-blue-900">GDPR Compliance</h4>
                  <p className="text-blue-800 text-sm">
                    All international transfers comply with GDPR and other data protection regulations 
                    with appropriate safeguards in place.
                  </p>
                </div>
              </div>
            </Card.Body>
          </Card>
        </div>
      )
    },
    {
      id: 10,
      title: 'Updates',
      icon: CheckCircle,
      content: (
        <div className="space-y-4">
          <p className="text-gray-600 leading-relaxed">
            This Cookie Policy is regularly reviewed and updated as necessary. 
            Significant changes will be announced on our website.
          </p>
          <Card className="bg-green-50 border-green-200">
            <Card.Body>
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-6 h-6 text-green-600" />
                <div>
                  <h4 className="font-semibold text-green-900">Stay Informed</h4>
                  <p className="text-green-800 text-sm">
                    We recommend checking this page periodically for any updates to our cookie practices.
                  </p>
                </div>
              </div>
            </Card.Body>
          </Card>
        </div>
      )
    },
    {
      id: 11,
      title: 'Your Choices',
      icon: Users,
      content: (
        <div className="space-y-4">
          <p className="text-gray-600 leading-relaxed">
            You have several options for managing cookies:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { choice: 'Accept all cookies', desc: 'For the best experience', color: 'green' },
              { choice: 'Accept only essential cookies', desc: 'Basic functionality only', color: 'blue' },
              { choice: 'Customize your cookie preferences', desc: 'Choose specific categories', color: 'purple' },
              { choice: 'Reject all non-essential cookies', desc: 'Minimal cookie usage', color: 'orange' }
            ].map((choice, index) => (
              <Card key={index} className={`border-l-4 border-l-${choice.color}-500`}>
                <Card.Body>
                  <h4 className={`font-semibold text-${choice.color}-900 mb-2`}>{choice.choice}</h4>
                  <p className={`text-${choice.color}-800 text-sm`}>{choice.desc}</p>
                </Card.Body>
              </Card>
            ))}
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Cookie Policy - Consulting19</title>
        <meta name="description" content="Learn about Consulting19's cookie usage policy. How we use cookies on our website and their purposes." />
      </Helmet>

      <Navbar />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white py-20 mt-16 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-32 h-32 border-2 border-white rounded-full animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-24 h-24 border-2 border-white rounded-lg rotate-45 animate-pulse delay-1000"></div>
        </div>

        {/* Floating Cookie Icons */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
          <div className="absolute top-32 left-1/4 text-4xl animate-float">🍪</div>
          <div className="absolute bottom-32 right-1/4 text-3xl animate-float-delayed">🌐</div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
            <Cookie className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Cookie Policy</h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Information about the cookies we use on our website and their purposes.
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Introduction */}
        <Card className="mb-12 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <Card.Body className="py-8">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">How We Use Cookies</h2>
              <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                <p className="mb-4">
                  Cookies are small text files that websites store on users' devices to help websites function better 
                  and improve user experience. At Consulting19, we use cookies responsibly and transparently.
                </p>
                <p className="mb-4">
                  This Cookie Policy explains what cookies are, how we use them, and how you can manage your preferences. 
                  By using our website, you consent to our use of cookies as described in this policy.
                </p>
                <div className="bg-white border border-blue-200 rounded-lg p-4 mb-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <Shield className="w-6 h-6 text-blue-600" />
                    <h3 className="font-semibold text-blue-900">Privacy & Security</h3>
                  </div>
                  <p className="text-blue-800 text-sm">
                    All cookie data is handled in accordance with our Privacy Policy and applicable data protection laws. 
                    We never sell or share your personal information with unauthorized third parties.
                  </p>
                </div>
                <p className="text-center font-medium text-gray-900">
                  You can manage your cookie preferences at any time through your browser settings or our Cookie Preference Center.
                </p>
              </div>
            </div>
          </Card.Body>
        </Card>

        {/* Cookie Sections */}
        <div className="space-y-6">
          {cookieSections.map((section, index) => (
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

        {/* Cookie Preference Center */}
        <Card className="mt-12 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
          <Card.Body className="py-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Manage Your Cookie Preferences</h2>
              <p className="text-purple-100 max-w-2xl mx-auto">
                Take control of your cookie settings and customize your experience on our website.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold mb-2">Accept All</h3>
                <p className="text-purple-100 text-sm">Best experience</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold mb-2">Essential Only</h3>
                <p className="text-purple-100 text-sm">Basic functionality</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Settings className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold mb-2">Customize</h3>
                <p className="text-purple-100 text-sm">Choose categories</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center mx-auto mb-3">
                  <AlertTriangle className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold mb-2">Reject All</h3>
                <p className="text-purple-100 text-sm">Minimal cookies</p>
              </div>
            </div>
            
            <div className="text-center mt-8">
              <Button 
                size="lg" 
                className="bg-white/20 backdrop-blur-sm text-white border-2 border-white/30 hover:bg-white/30 font-semibold"
                icon={Settings}
                onClick={() => setShowCookieSettings(true)}
              >
                Open Cookie Settings
              </Button>
            </div>
          </Card.Body>
        </Card>

        {/* Contact Information */}
        <Card className="mt-12 bg-gradient-to-r from-blue-600 to-teal-600 text-white">
          <Card.Body className="py-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Contact Us About Cookies</h2>
              <p className="text-blue-100 max-w-2xl mx-auto">
                Have questions about our cookie usage? We're here to provide clarity and support.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold mb-2">Privacy Inquiries</h3>
                <p className="text-blue-100 text-sm">privacy@consulting19.com</p>
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
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold mb-2">Data Protection Officer</h3>
                <p className="text-blue-100 text-sm">dpo@consulting19.com</p>
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

      {/* Cookie Settings Modal */}
      {showCookieSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <Card.Header>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Cookie className="w-4 h-4 text-blue-600" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">Cookie Preferences</h2>
                </div>
                <button
                  onClick={() => setShowCookieSettings(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </Card.Header>
            <Card.Body>
              <p className="text-gray-600 mb-6">
                Manage your cookie preferences. Essential cookies are required for the website to function and cannot be disabled.
              </p>
              
              <div className="space-y-6">
                {/* Essential Cookies */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <Shield className="w-5 h-5 text-red-600" />
                      <h3 className="font-semibold text-gray-900">Essential Cookies</h3>
                      <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded-full">
                        Required
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Necessary for the website to function properly. Cannot be disabled.
                    </p>
                  </div>
                  <div className="ml-4">
                    <div className="w-12 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <div className="w-4 h-4 bg-white rounded-full"></div>
                    </div>
                  </div>
                </div>

                {/* Functional Cookies */}
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <Settings className="w-5 h-5 text-blue-600" />
                      <h3 className="font-semibold text-gray-900">Functional Cookies</h3>
                    </div>
                    <p className="text-sm text-gray-600">
                      Enable enhanced features and personalization (language, theme, preferences).
                    </p>
                  </div>
                  <div className="ml-4">
                    <button
                      onClick={() => updateCookiePreference('functional', !cookiePreferences.functional)}
                      className={`relative inline-flex h-6 w-12 items-center rounded-full transition-colors ${
                        cookiePreferences.functional ? 'bg-blue-600' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          cookiePreferences.functional ? 'translate-x-7' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* Analytics Cookies */}
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <Eye className="w-5 h-5 text-green-600" />
                      <h3 className="font-semibold text-gray-900">Analytics Cookies</h3>
                    </div>
                    <p className="text-sm text-gray-600">
                      Help us understand website performance and user behavior (Google Analytics).
                    </p>
                  </div>
                  <div className="ml-4">
                    <button
                      onClick={() => updateCookiePreference('analytics', !cookiePreferences.analytics)}
                      className={`relative inline-flex h-6 w-12 items-center rounded-full transition-colors ${
                        cookiePreferences.analytics ? 'bg-green-600' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          cookiePreferences.analytics ? 'translate-x-7' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* Marketing Cookies */}
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <Globe className="w-5 h-5 text-purple-600" />
                      <h3 className="font-semibold text-gray-900">Marketing Cookies</h3>
                    </div>
                    <p className="text-sm text-gray-600">
                      Show you relevant advertisements and track marketing campaign effectiveness.
                    </p>
                  </div>
                  <div className="ml-4">
                    <button
                      onClick={() => updateCookiePreference('marketing', !cookiePreferences.marketing)}
                      className={`relative inline-flex h-6 w-12 items-center rounded-full transition-colors ${
                        cookiePreferences.marketing ? 'bg-purple-600' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          cookiePreferences.marketing ? 'translate-x-7' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            </Card.Body>
            <Card.Footer>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={rejectNonEssential}
                >
                  Essential Only
                </Button>
                <Button 
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600"
                  onClick={saveCookiePreferences}
                >
                  Save Preferences
                </Button>
                <Button 
                  className="flex-1 bg-gradient-to-r from-green-600 to-blue-600"
                  onClick={acceptAllCookies}
                >
                  Accept All
                </Button>
              </div>
            </Card.Footer>
          </Card>
        </div>
      )}

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

export default CookiePolicyPage;