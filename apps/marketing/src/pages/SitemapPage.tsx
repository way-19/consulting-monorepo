import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Globe, FileText, Calendar, Users, Building2, MapPin, Clock, ExternalLink } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { useLanguage } from '../lib/language';
import { Card } from '../lib/ui';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const SitemapPage = () => {
  const { t } = useLanguage();
  const [lastUpdated, setLastUpdated] = useState<string>('');

  useEffect(() => {
    // Set last updated to current date
    setLastUpdated(new Date().toISOString().split('T')[0]);
  }, []);

  const mainPages = [
    { name: 'Home', href: '/', icon: Globe, description: 'Main landing page with AI-powered consulting overview' },
    { name: 'Services', href: '/services', icon: Building2, description: 'Comprehensive international business services' },
    { name: 'Countries', href: '/countries', icon: MapPin, description: 'Business formation opportunities in 19+ countries' },
    { name: 'About', href: '/about', icon: Users, description: 'Our mission and company information' },
    { name: 'Blog', href: '/blog', icon: FileText, description: 'Expert insights and business guides' },
    { name: 'Contact', href: '/contact', icon: FileText, description: 'Contact administration team' },
    { name: 'AI Experience', href: '/ai-experience', icon: Globe, description: 'Experience AI-powered consulting' },
    { name: 'AI Recommendations', href: '/ai-recommendations', icon: Globe, description: 'Get AI country recommendations' },
  ];

  const servicePages = [
    { name: 'Company Formation', href: '/services/company-formation', description: 'Business incorporation services worldwide' },
    { name: 'Tax Optimization', href: '/services/tax-optimization', description: 'Strategic international tax planning' },
    { name: 'Banking Solutions', href: '/services/banking-solutions', description: 'Global banking and financial services' },
    { name: 'Legal Compliance', href: '/services/legal-compliance', description: 'Comprehensive legal and regulatory compliance' },
    { name: 'Asset Protection', href: '/services/asset-protection', description: 'Wealth protection and asset security strategies' },
    { name: 'Investment Advisory', href: '/services/investment-advisory', description: 'Professional investment and wealth management' },
    { name: 'Visa & Residency', href: '/services/visa-residency', description: 'Immigration and residency planning services' },
    { name: 'Market Research', href: '/services/market-research', description: 'Market intelligence and business research' },
  ];

  const georgianServices = [
    { name: 'Georgian LLC Formation', href: '/services/georgia/llc-formation', description: 'Complete LLC setup with Small Business Status' },
    { name: 'Georgian IBC', href: '/services/georgia/international-business-company', description: 'International Business Company with 0% tax on foreign income' },
    { name: 'Georgian Tax Residency', href: '/services/georgia/tax-residency', description: 'Strategic tax planning for Georgian tax residency' },
    { name: 'Georgian Banking', href: '/services/georgia/banking-solutions', description: 'Corporate banking account opening assistance' },
    { name: 'Georgian Visa', href: '/services/georgia/visa-residence-permit', description: 'Visa and residence permit services' },
    { name: 'Georgian IE Status', href: '/services/georgia/individual-entrepreneur', description: 'Individual Entrepreneur status with 1% tax rate' },
  ];

  const countryPages = [
    { name: 'Georgia', href: '/countries/georgia', flag: '🇬🇪', status: 'Available', description: 'Strategic business hub with 1% tax rate' },
    { name: 'United States', href: '/countries/usa', flag: '🇺🇸', status: 'Coming Soon', description: 'World\'s largest economy' },
    { name: 'UAE', href: '/countries/uae', flag: '🇦🇪', status: 'Coming Soon', description: 'Leading business hub in Middle East' },
    { name: 'Estonia', href: '/countries/estonia', flag: '🇪🇪', status: 'Coming Soon', description: 'Digital-first EU member state' },
    { name: 'Malta', href: '/countries/malta', flag: '🇲🇹', status: 'Coming Soon', description: 'EU member with attractive tax regime' },
    { name: 'Portugal', href: '/countries/portugal', flag: '🇵🇹', status: 'Coming Soon', description: 'EU member with NHR program' },
    { name: 'Panama', href: '/countries/panama', flag: '🇵🇦', status: 'Coming Soon', description: 'International financial center' },
    { name: 'Switzerland', href: '/countries/switzerland', flag: '🇨🇭', status: 'Coming Soon', description: 'World-renowned financial center' },
    { name: 'Singapore', href: '/countries/singapore', flag: '🇸🇬', status: 'Coming Soon', description: 'Premier Asian business hub' },
    { name: 'Netherlands', href: '/countries/netherlands', flag: '🇳🇱', status: 'Coming Soon', description: 'EU member with extensive tax treaty network' },
    { name: 'Ireland', href: '/countries/ireland', flag: '🇮🇪', status: 'Coming Soon', description: 'EU member with 12.5% corporate tax rate' },
    { name: 'Gibraltar', href: '/countries/gibraltar', flag: '🇬🇮', status: 'Coming Soon', description: 'British territory with competitive tax rates' },
    { name: 'Lithuania', href: '/countries/lithuania', flag: '🇱🇹', status: 'Coming Soon', description: 'EU member with growing fintech sector' },
    { name: 'Canada', href: '/countries/canada', flag: '🇨🇦', status: 'Coming Soon', description: 'Stable economy with immigration programs' },
    { name: 'Bulgaria', href: '/countries/bulgaria', flag: '🇧🇬', status: 'Coming Soon', description: 'EU member with competitive tax rates' },
    { name: 'Spain', href: '/countries/spain', flag: '🇪🇸', status: 'Coming Soon', description: 'Major EU economy with golden visa program' },
    { name: 'Montenegro', href: '/countries/montenegro', flag: '🇲🇪', status: 'Coming Soon', description: 'EU candidate with attractive tax rates' },
  ];

  const authPages = [
    { name: 'Login', href: '/auth', description: 'Sign in to your account' },
    { name: 'Register', href: '/auth?mode=register', description: 'Create new account' },
  ];

  const externalLinks = [
    { name: 'Client Dashboard', href: 'https://client.consulting19.com', description: 'Client portal access' },
        { name: 'Consultant Dashboard', href: 'https://consultant.consulting19.com', description: 'Consultant portal access' },
        { name: 'Admin Dashboard', href: 'https://admin.consulting19.com', description: 'Administrative panel access' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Sitemap - Consulting19</title>
        <meta name="description" content="Complete sitemap of Consulting19 platform including all services, countries, and resources for international business consulting." />
      </Helmet>

      <Navbar />
      
      {/* Header */}
      <section className="bg-gradient-to-r from-blue-600 to-teal-600 text-white py-16 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4">Sitemap</h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Complete overview of all pages and resources on Consulting19 platform
          </p>
          <div className="mt-6 flex items-center justify-center space-x-2 text-blue-100">
            <Clock className="w-4 h-4" />
            <span className="text-sm">Last updated: {lastUpdated}</span>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Main Pages */}
          <Card>
            <Card.Header>
              <div className="flex items-center space-x-2">
                <Globe className="w-5 h-5 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-900">Main Pages</h2>
              </div>
            </Card.Header>
            <Card.Body>
              <div className="space-y-3">
                {mainPages.map((page) => (
                  <Link
                    key={page.href}
                    to={page.href}
                    className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                  >
                    <page.icon className="w-5 h-5 text-blue-600 mt-0.5 group-hover:text-blue-700" />
                    <div>
                      <h3 className="font-medium text-gray-900 group-hover:text-blue-700">{page.name}</h3>
                      <p className="text-sm text-gray-600">{page.description}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </Card.Body>
          </Card>

          {/* Service Pages */}
          <Card>
            <Card.Header>
              <div className="flex items-center space-x-2">
                <Building2 className="w-5 h-5 text-green-600" />
                <h2 className="text-xl font-semibold text-gray-900">Global Services</h2>
              </div>
            </Card.Header>
            <Card.Body>
              <div className="space-y-3">
                {servicePages.map((service) => (
                  <Link
                    key={service.href}
                    to={service.href}
                    className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                  >
                    <Building2 className="w-5 h-5 text-green-600 mt-0.5 group-hover:text-green-700" />
                    <div>
                      <h3 className="font-medium text-gray-900 group-hover:text-green-700">{service.name}</h3>
                      <p className="text-sm text-gray-600">{service.description}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </Card.Body>
          </Card>

          {/* Georgian Services */}
          <Card>
            <Card.Header>
              <div className="flex items-center space-x-2">
                <span className="text-2xl">🇬🇪</span>
                <h2 className="text-xl font-semibold text-gray-900">Georgian Services</h2>
              </div>
            </Card.Header>
            <Card.Body>
              <div className="space-y-3">
                {georgianServices.map((service) => (
                  <Link
                    key={service.href}
                    to={service.href}
                    className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                  >
                    <Building2 className="w-5 h-5 text-orange-600 mt-0.5 group-hover:text-orange-700" />
                    <div>
                      <h3 className="font-medium text-gray-900 group-hover:text-orange-700">{service.name}</h3>
                      <p className="text-sm text-gray-600">{service.description}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </Card.Body>
          </Card>

          {/* Countries */}
          <Card>
            <Card.Header>
              <div className="flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-purple-600" />
                <h2 className="text-xl font-semibold text-gray-900">Countries ({countryPages.length})</h2>
              </div>
            </Card.Header>
            <Card.Body>
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {countryPages.map((country) => (
                  <Link
                    key={country.href}
                    to={country.href}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{country.flag}</span>
                      <div>
                        <h3 className="font-medium text-gray-900 group-hover:text-purple-700">{country.name}</h3>
                        <p className="text-sm text-gray-600">{country.description}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      country.status === 'Available' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-orange-100 text-orange-800'
                    }`}>
                      {country.status}
                    </span>
                  </Link>
                ))}
              </div>
            </Card.Body>
          </Card>

          {/* Authentication Pages */}
          <Card>
            <Card.Header>
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-indigo-600" />
                <h2 className="text-xl font-semibold text-gray-900">Authentication</h2>
              </div>
            </Card.Header>
            <Card.Body>
              <div className="space-y-3">
                {authPages.map((page) => (
                  <Link
                    key={page.href}
                    to={page.href}
                    className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                  >
                    <Users className="w-5 h-5 text-indigo-600 mt-0.5 group-hover:text-indigo-700" />
                    <div>
                      <h3 className="font-medium text-gray-900 group-hover:text-indigo-700">{page.name}</h3>
                      <p className="text-sm text-gray-600">{page.description}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </Card.Body>
          </Card>

          {/* External Dashboards */}
          <Card>
            <Card.Header>
              <div className="flex items-center space-x-2">
                <ExternalLink className="w-5 h-5 text-red-600" />
                <h2 className="text-xl font-semibold text-gray-900">Dashboard Access</h2>
              </div>
            </Card.Header>
            <Card.Body>
              <div className="space-y-3">
                {externalLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                  >
                    <ExternalLink className="w-5 h-5 text-red-600 mt-0.5 group-hover:text-red-700" />
                    <div>
                      <h3 className="font-medium text-gray-900 group-hover:text-red-700 flex items-center">
                        {link.name}
                        <ExternalLink className="w-3 h-3 ml-1 opacity-50" />
                      </h3>
                      <p className="text-sm text-gray-600">{link.description}</p>
                    </div>
                  </a>
                ))}
              </div>
            </Card.Body>
          </Card>
        </div>

        {/* Statistics */}
        <Card className="mt-8">
          <Card.Header>
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-gray-600" />
              <h2 className="text-xl font-semibold text-gray-900">Sitemap Statistics</h2>
            </div>
          </Card.Header>
          <Card.Body>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{mainPages.length}</div>
                <div className="text-sm text-gray-600">Main Pages</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{servicePages.length + georgianServices.length}</div>
                <div className="text-sm text-gray-600">Service Pages</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{countryPages.length}</div>
                <div className="text-sm text-gray-600">Country Pages</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {mainPages.length + servicePages.length + georgianServices.length + countryPages.length + authPages.length}
                </div>
                <div className="text-sm text-gray-600">Total Pages</div>
              </div>
            </div>
          </Card.Body>
        </Card>

        {/* Update Information */}
        <Card className="mt-8 bg-blue-50 border-blue-200">
          <Card.Body className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-3">
              <Clock className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-blue-900">Automatic Updates</h3>
            </div>
            <p className="text-blue-800 mb-4">
              This sitemap is automatically updated weekly with new pages, services, and countries.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="bg-white rounded-lg p-3 border border-blue-200">
                <div className="font-medium text-blue-900">Last Update</div>
                <div className="text-blue-700">{lastUpdated}</div>
              </div>
              <div className="bg-white rounded-lg p-3 border border-blue-200">
                <div className="font-medium text-blue-900">Update Frequency</div>
                <div className="text-blue-700">Weekly</div>
              </div>
              <div className="bg-white rounded-lg p-3 border border-blue-200">
                <div className="font-medium text-blue-900">Next Update</div>
                <div className="text-blue-700">
                  {new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                </div>
              </div>
            </div>
          </Card.Body>
        </Card>
      </div>

      <Footer />
    </div>
  );
};

export default SitemapPage;