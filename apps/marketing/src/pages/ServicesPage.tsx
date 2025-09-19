import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, Calculator, CreditCard, FileText, Shield, TrendingUp, Users, BarChart3 } from 'lucide-react';
import { useLanguage } from '../lib/language';
import { Card, Button } from '../lib/ui';
import { AIAgentIcon } from '@consulting19/shared';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const ServicesPage = () => {
  const { t } = useLanguage();

  // Background images for each service category
  const serviceBackgrounds = {
    'Company Formation': 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=800',
    'Tax Optimization': 'https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg?auto=compress&cs=tinysrgb&w=800',
    'Banking Solutions': 'https://images.pexels.com/photos/259027/pexels-photo-259027.jpeg?auto=compress&cs=tinysrgb&w=800',
    'Legal Compliance': 'https://images.pexels.com/photos/5668858/pexels-photo-5668858.jpeg?auto=compress&cs=tinysrgb&w=800',
    'Asset Protection': 'https://images.pexels.com/photos/3483098/pexels-photo-3483098.jpeg?auto=compress&cs=tinysrgb&w=800',
    'Investment Advisory': 'https://images.pexels.com/photos/8369648/pexels-photo-8369648.jpeg?auto=compress&cs=tinysrgb&w=800',
    'Visa & Residency': 'https://images.pexels.com/photos/1591447/pexels-photo-1591447.jpeg?auto=compress&cs=tinysrgb&w=800',
    'Market Research': 'https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&cs=tinysrgb&w=800',
  };

  const serviceCategories = [
    {
      icon: Building2,
      title: t('companyFormation') || 'Company Formation',
      summary: 'Professional business setup and incorporation services worldwide',
      services: [
        'Company Registration',
        'Business Licenses',
        'Corporate Structure Setup',
        'Registered Agent Services',
        'Virtual Office Solutions',
      ],
      color: 'blue',
    },
    {
      icon: Calculator,
      title: t('taxOptimization') || 'Tax Optimization',
      summary: 'Strategic tax planning and international tax optimization',
      services: [
        'International Tax Planning',
        'Double Tax Treaty Optimization',
        'Tax Residency Planning',
        'Transfer Pricing',
        'Annual Compliance',
      ],
      color: 'teal',
    },
    {
      icon: CreditCard,
      title: t('bankingSolutions') || 'Banking Solutions',
      summary: 'Global banking and financial services access',
      services: [
        'Corporate Account Opening',
        'Multi-Currency Accounts',
        'Payment Gateway Setup',
        'Banking Relationships',
        'Trade Finance',
      ],
      color: 'orange',
    },
    {
      icon: FileText,
      title: t('legalCompliance') || 'Legal Compliance',
      summary: 'Comprehensive legal and regulatory compliance',
      services: [
        'Compliance Monitoring',
        'Contract Review',
        'Legal Structure Optimization',
        'IP Protection',
        'Data Protection',
      ],
      color: 'green',
    },
    {
      icon: Shield,
      title: t('assetProtection') || 'Asset Protection',
      summary: 'Wealth protection and asset security strategies',
      services: [
        'Protection Strategy',
        'Trust & Foundation Setup',
        'Risk Mitigation',
        'Estate Planning',
        'Insurance Coordination',
      ],
      color: 'purple',
    },
    {
      icon: TrendingUp,
      title: t('investmentAdvisory') || 'Investment Advisory',
      summary: 'Professional investment and wealth management',
      services: [
        'Portfolio Management',
        'Alternative Investments',
        'Real Estate Investment',
        'ESG Investment Strategies',
        'Crypto Compliance',
      ],
      color: 'red',
    },
    {
      icon: Users,
      title: t('visaResidency') || 'Visa & Residency',
      summary: 'Immigration and residency planning services',
      services: [
        'Eligibility Review',
        'Country Comparison',
        'Application Preparation',
        'Document Filing',
        'Status Tracking',
      ],
      color: 'indigo',
    },
    {
      icon: BarChart3,
      title: t('marketResearch') || 'Market Research',
      summary: 'Market intelligence and business research',
      services: [
        'Market Analysis',
        'Competitor Mapping',
        'Pricing Insights',
        'Go-to-Market Testing',
        'Local Regulations',
      ],
      color: 'pink',
    },
  ];

  const colorClasses = {
    blue: 'from-blue-600 to-blue-700',
    teal: 'from-teal-600 to-teal-700',
    orange: 'from-orange-600 to-orange-700',
    green: 'from-green-600 to-green-700',
    purple: 'from-purple-600 to-purple-700',
    red: 'from-red-600 to-red-700',
    indigo: 'from-indigo-600 to-indigo-700',
    pink: 'from-pink-600 to-pink-700',
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-teal-600 text-white py-20 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Comprehensive International Business Services
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            From company formation to ongoing compliance, we provide end-to-end support delivered by expert consultants in 19+ countries.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {serviceCategories.map((category, index) => (
            <Card key={index} hover className="h-full min-h-[300px] relative overflow-hidden group">
              {/* Background Image */}
              <div className="absolute inset-0">
                <img
                  src={serviceBackgrounds[category.title as keyof typeof serviceBackgrounds]}
                  alt={category.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-black/70 group-hover:from-black/80 group-hover:via-black/60 group-hover:to-black/80 transition-all duration-300"></div>
              </div>
              
              <Card.Body className="h-full flex flex-col p-6 relative z-10">
                <div className="flex items-start space-x-3 mb-5">
                  <div className={`w-10 h-10 bg-gradient-to-r ${colorClasses[category.color as keyof typeof colorClasses]} rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg backdrop-blur-sm border border-white/20`}>
                    <category.icon className="w-5 h-5 text-white drop-shadow-lg" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-2 drop-shadow-lg">
                      {category.title}
                    </h3>
                    <p className="text-gray-200 leading-relaxed text-sm line-clamp-2 drop-shadow-sm">
                      {category.summary}
                    </p>
                  </div>
                </div>
                
                <ul className="space-y-2 mb-6 flex-1">
                  {category.services.map((service, i) => (
                    <li key={i} className="flex items-center text-white">
                      <div className={`w-2 h-2 bg-gradient-to-r ${colorClasses[category.color as keyof typeof colorClasses]} rounded-full mr-2 flex-shrink-0 shadow-md`}></div>
                      <span className="text-xs font-medium drop-shadow-sm">{service}</span>
                    </li>
                  ))}
                </ul>
                
                <div className="mt-auto">
                  <Button 
                    variant="primary" 
                    size="sm"
                    className={`w-full md:w-auto md:min-w-[160px] bg-gradient-to-r ${colorClasses[category.color as keyof typeof colorClasses]} backdrop-blur-sm text-white hover:opacity-90 font-semibold shadow-lg hover:shadow-xl border-0 transition-all duration-300 transform hover:scale-105`}
                    onClick={() => {
                      const serviceLinks: { [key: string]: string } = {
                        'Company Formation': '/services/company-formation',
                        'Tax Optimization': '/services/tax-optimization',
                        'Banking Solutions': '/services/banking-solutions',
                        'Legal Compliance': '/services/legal-compliance',
                        'Asset Protection': '/services/asset-protection',
                        'Investment Advisory': '/services/investment-advisory',
                        'Visa & Residency': '/services/visa-residency',
                        'Market Research': '/services/market-research',
                      };
                      const link = serviceLinks[category.title];
                      if (link) {
                        window.location.href = link;
                      }
                    }}
                  >
                    <span className="relative z-10">Explore {category.title}</span>
                  </Button>
                </div>
              </Card.Body>
            </Card>
          ))}
        </div>
      </section>

      {/* Bottom CTA Section */}
      <section className="bg-gray-100 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Need a Custom Solution?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Our expert advisors can design a tailored strategy for your business needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth?mode=register">
              <Button size="lg">
                Consult with Expert
              </Button>
            </Link>
            <Link to="/countries">
              <Button size="lg" variant="outline">
                Explore Countries
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
      
      {/* AI Agent Icon */}
      <AIAgentIcon />
    </div>
  );
};

export default ServicesPage;