import React, { useState } from 'react';
import { Mail, MapPin, Send, MessageSquare, AlertCircle, CheckCircle } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { useLanguage } from '../lib/language';
import { Button, Card } from '../lib/ui';
import { AIAgentIcon } from '@consulting19/shared';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const ContactPage = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    country: '',
    messageType: '',
    subject: '',
    message: '',
  });
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    
    try {
      // Simulate sending message to admin
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Here you would send the message to admin panel as notification
      console.log('Message sent to admin:', formData);
      
      setSuccess(true);
      setFormData({
        name: '',
        email: '',
        company: '',
        country: '',
        messageType: '',
        subject: '',
        message: '',
      });
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const messageTypes = [
    { value: 'suggestion', label: 'Suggestion' },
    { value: 'complaint', label: 'Complaint' },
    { value: 'partnership', label: 'Partnership' },
    { value: 'other', label: 'Other' },
  ];

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Helmet>
          <title>Message Sent - Consulting19</title>
        </Helmet>

        <Navbar />
        
        <div className="pt-20 pb-20">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <Card>
              <Card.Body className="py-12">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Message Sent Successfully!</h1>
                <p className="text-gray-600 mb-8">
                  Thank you for contacting us. Your message has been sent to our admin team and you'll receive a response within 24-48 hours.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button onClick={() => setSuccess(false)}>
                    Send Another Message
                  </Button>
                  <Button variant="outline" onClick={() => window.location.href = '/'}>
                    Back to Home
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </div>
        </div>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Contact Us - Consulting19</title>
        <meta name="description" content="Contact Consulting19 administration team. Send suggestions, complaints, partnership inquiries, or other messages directly to our admin panel." />
      </Helmet>

      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-teal-600 text-white py-20 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Contact Administration
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Send your suggestions, complaints, partnership inquiries, or other messages directly to our admin team.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <Card>
            <Card.Header>
              <h2 className="text-2xl font-semibold text-gray-900">Send us a Message</h2>
              <p className="text-gray-600">Your message will be sent directly to our administration team.</p>
            </Card.Header>
            <Card.Body>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Your full name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company
                    </label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Your company name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Country
                    </label>
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Your current country"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message Type *
                  </label>
                  <select
                    name="messageType"
                    value={formData.messageType}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select message type</option>
                    {messageTypes.map((type) => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Brief description of your message"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Please provide detailed information about your message..."
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full" 
                  size="lg" 
                  loading={sending}
                  icon={Send}
                  iconPosition="right"
                >
                  {sending ? 'Sending Message...' : 'Send Message to Admin'}
                </Button>
              </form>
            </Card.Body>
          </Card>

          {/* Contact Information */}
          <div className="space-y-8">
            {/* Admin Contact */}
            <Card>
              <Card.Header>
                <h3 className="text-xl font-semibold text-gray-900">Administration Contact</h3>
              </Card.Header>
              <Card.Body>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Mail className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Email</p>
                      <p className="text-gray-600">admin@consulting19.com</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Headquarters</p>
                      <p className="text-gray-600">5830 E 2ND St 7000 WY<br />United States</p>
                    </div>
                  </div>
                </div>
              </Card.Body>
            </Card>

            {/* Important Notice */}
            <Card className="bg-blue-50 border-blue-200">
              <Card.Body>
                <div className="flex items-start space-x-3">
                  <AlertCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold text-blue-900 mb-2">
                      For Country-Specific Services
                    </h3>
                    <p className="text-blue-800 leading-relaxed">
                      If you're interested in business services for a specific country, please register on our platform 
                      and you'll be connected with local experts in your target jurisdiction.
                    </p>
                    <div className="mt-4">
                      <Button 
                        size="sm" 
                        onClick={() => window.location.href = '/auth?mode=register'}
                      >
                        Register for Country Services
                      </Button>
                    </div>
                  </div>
                </div>
              </Card.Body>
            </Card>

            {/* Response Time */}
            <Card className="bg-green-50 border-green-200">
              <Card.Body>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-green-900">Response Time</h3>
                    <p className="text-green-800">We typically respond within 24-48 hours</p>
                  </div>
                </div>
              </Card.Body>
            </Card>

            {/* Message Types Info */}
            <Card>
              <Card.Header>
                <h3 className="text-xl font-semibold text-gray-900">Message Types</h3>
              </Card.Header>
              <Card.Body>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <div>
                      <p className="font-medium text-gray-900">Suggestion</p>
                      <p className="text-sm text-gray-600">Ideas for platform improvement</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div>
                      <p className="font-medium text-gray-900">Complaint</p>
                      <p className="text-sm text-gray-600">Issues or concerns with our services</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                    <div>
                      <p className="font-medium text-gray-900">Partnership</p>
                      <p className="text-sm text-gray-600">Business partnership opportunities</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                    <div>
                      <p className="font-medium text-gray-900">Other</p>
                      <p className="text-sm text-gray-600">General inquiries and other topics</p>
                    </div>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
      
      {/* AI Agent Icon */}
      <AIAgentIcon />
    </div>
  );
};

export default ContactPage;