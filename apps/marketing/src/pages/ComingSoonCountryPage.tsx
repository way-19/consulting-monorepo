import React from 'react';
import { ArrowLeft, Clock, Bell, Mail, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useLanguage } from '../lib/language';
import { Button, Card } from '../lib/ui';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

interface ComingSoonCountryPageProps {
  country: string;
  flag: string;
}

const ComingSoonCountryPage: React.FC<ComingSoonCountryPageProps> = ({ country, flag }) => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>{country} - Coming Soon - Consulting19</title>
        <meta name="description" content={`${country} business services will be available soon on Consulting19. Get notified when we launch.`} />
      </Helmet>

      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-orange-600 to-amber-600 text-white py-20 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center mb-6">
            <Link to="/countries">
              <Button variant="outline" icon={ArrowLeft} iconPosition="left" className="border-white text-white bg-white/10 hover:bg-white/20">
                Back to Countries
              </Button>
            </Link>
          </div>
          
          <div className="max-w-4xl mx-auto text-center">
            <div className="text-8xl mb-6 animate-bounce">{flag}</div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              {country}
            </h1>
            <div className="inline-flex items-center bg-orange-500/20 backdrop-blur-sm rounded-full px-6 py-3 mb-6 shadow-lg border border-orange-300/30">
              <Clock className="w-5 h-5 text-orange-200 mr-2" />
              <span className="text-orange-100 font-medium">Coming Soon</span>
            </div>
            <p className="text-xl text-orange-100 mb-8 leading-relaxed">
              We're preparing comprehensive business services for {country}. 
              Our expert consultants will be available soon to help with your expansion.
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Coming Soon Notice */}
        <section className="mb-16">
          <Card className="bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200">
            <Card.Body className="text-center py-12">
              <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Clock className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                {country} Services Coming Soon
              </h2>
              <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                We're currently preparing our expert consultant network and comprehensive 
                business services for {country}. Once our local specialist is assigned 
                and approved by our admin team, all services will become active.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Bell className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Get Notified</h3>
                  <p className="text-sm text-gray-600">Be the first to know when services launch</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Mail className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Expert Consultant</h3>
                  <p className="text-sm text-gray-600">Local specialist being assigned</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Calendar className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Full Services</h3>
                  <p className="text-sm text-gray-600">Complete business formation package</p>
                </div>
              </div>

              <Button 
                size="lg" 
                className="bg-orange-600 hover:bg-orange-700 text-white font-semibold px-8 py-4"
                icon={Bell}
              >
                Notify Me When Available
              </Button>
            </Card.Body>
          </Card>
        </section>

        {/* What Will Be Available */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            What Will Be Available
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              'Company Formation',
              'Tax Optimization', 
              'Banking Solutions',
              'Legal Compliance',
              'Asset Protection',
              'Investment Advisory',
              'Visa & Residency',
              'Market Research'
            ].map((service, index) => (
              <Card key={index} className="text-center opacity-75">
                <Card.Body>
                  <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Clock className="w-6 h-6 text-gray-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">{service}</h3>
                  <p className="text-sm text-gray-500">Available when consultant is assigned</p>
                </Card.Body>
              </Card>
            ))}
          </div>
        </section>

        {/* Admin Note */}
        <section>
          <Card className="bg-blue-50 border-blue-200">
            <Card.Body className="text-center py-8">
              <h3 className="text-xl font-semibold text-blue-900 mb-4">
                🔐 Admin Approval Required
              </h3>
              <p className="text-blue-800 max-w-2xl mx-auto">
                Services for {country} will become active only after our admin team assigns 
                and approves a qualified local consultant. This ensures the highest quality 
                of service and local expertise for our clients.
              </p>
            </Card.Body>
          </Card>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default ComingSoonCountryPage;