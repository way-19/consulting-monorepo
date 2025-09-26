import React, { useState } from 'react';
import { Search, Filter, MapPin, Star, Users, Building2, TrendingUp, ArrowRight, Globe, CheckCircle, Clock, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useLanguage } from '../lib/language';
import { Button, Card } from '../lib/ui';
import { AIAgentIcon } from '@consulting19/shared';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const CountriesPage = () => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [regionFilter, setRegionFilter] = useState('all');
  const [serviceFilter, setServiceFilter] = useState('all');

  const allCountries = [
    // Available Countries
    {
      id: 'georgia',
      name: 'Georgia',
      flag: '🇬🇪',
      capital: 'Tbilisi',
      region: 'Caucasus',
      image: 'https://images.pexels.com/photos/4386440/pexels-photo-4386440.jpeg?auto=compress&cs=tinysrgb&w=800',
      rating: 4.9,
      clientCount: 150,
      available: true,
      featured: true,
      highlights: ['1% Tax Rate', 'EU Association', 'No Min. Capital', 'Fast Setup'],
      services: ['Company Formation', 'Tax Planning', 'Banking', 'Visa Services'],
      consultant: {
        name: 'Giorgi Meskhi',
        experience: '8+ years',
        avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100',
      },
      description: 'Strategic business hub between Europe and Asia with favorable tax policies.',
      link: '/countries/georgia',
    },
    
    // Coming Soon Countries
    {
      id: 'usa',
      name: 'United States',
      flag: '🇺🇸',
      capital: 'New York',
      region: 'North America',
      image: 'https://images.pexels.com/photos/290595/pexels-photo-290595.jpeg?auto=compress&cs=tinysrgb&w=800',
      rating: 4.9,
      clientCount: 0,
      available: false,
      featured: true,
      highlights: ['Delaware Corp', 'LLC Options', 'Global Market Access', 'Strong Legal System'],
      services: ['Company Formation', 'Tax Planning', 'Banking', 'Legal Services'],
      consultant: null,
      description: 'World\'s largest economy with comprehensive business opportunities and legal framework.',
      link: '/countries/usa',
    },
    {
      id: 'uae',
      name: 'United Arab Emirates',
      flag: '🇦🇪',
      capital: 'Dubai',
      region: 'Middle East',
      image: 'https://images.pexels.com/photos/3787839/pexels-photo-3787839.jpeg?auto=compress&cs=tinysrgb&w=800',
      rating: 4.8,
      clientCount: 0,
      available: false,
      featured: true,
      highlights: ['0% Corporate Tax', 'Free Zones', 'Strategic Location', 'Banking Hub'],
      services: ['Company Formation', 'Free Zone Setup', 'Banking', 'Visa Services'],
      consultant: null,
      description: 'Leading business hub in the Middle East with world-class infrastructure.',
      link: '/countries/uae',
    },
    {
      id: 'estonia',
      name: 'Estonia',
      flag: '🇪🇪',
      capital: 'Tallinn',
      region: 'Europe',
      image: 'https://images.pexels.com/photos/4386321/pexels-photo-4386321.jpeg?auto=compress&cs=tinysrgb&w=800',
      rating: 4.7,
      clientCount: 0,
      available: false,
      featured: true,
      highlights: ['EU Member', 'Digital First', 'e-Residency', 'Tech Hub'],
      services: ['Company Formation', 'e-Residency', 'Banking', 'Digital Services'],
      consultant: null,
      description: 'Digital-first EU member state with innovative e-residency program.',
      link: '/countries/estonia',
    },
    {
      id: 'malta',
      name: 'Malta',
      flag: '🇲🇹',
      capital: 'Valletta',
      region: 'Europe',
      image: 'https://images.pexels.com/photos/1388030/pexels-photo-1388030.jpeg?auto=compress&cs=tinysrgb&w=800',
      rating: 4.6,
      clientCount: 0,
      available: false,
      featured: false,
      highlights: ['EU Member', '5% Tax Rate', 'Gaming Hub', 'Crypto Friendly'],
      services: ['Company Formation', 'Gaming License', 'Banking', 'Crypto Services'],
      consultant: null,
      description: 'EU member state with attractive tax regime and crypto-friendly policies.',
      link: '/countries/malta',
    },
    {
      id: 'portugal',
      name: 'Portugal',
      flag: '🇵🇹',
      capital: 'Lisbon',
      region: 'Europe',
      image: 'https://images.pexels.com/photos/2166559/pexels-photo-2166559.jpeg?auto=compress&cs=tinysrgb&w=800',
      rating: 4.5,
      clientCount: 0,
      available: false,
      featured: false,
      highlights: ['EU Member', 'NHR Program', 'Golden Visa', 'Tech Hub'],
      services: ['Company Formation', 'Tax Planning', 'Residency', 'Banking'],
      consultant: null,
      description: 'EU member with attractive tax programs and residency options.',
      link: '/countries/portugal',
    },
    {
      id: 'panama',
      name: 'Panama',
      flag: '🇵🇦',
      capital: 'Panama City',
      region: 'Central America',
      image: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800',
      rating: 4.4,
      clientCount: 0,
      available: false,
      featured: false,
      highlights: ['Territorial Tax', 'Banking Hub', 'Privacy Laws', 'Strategic Location'],
      services: ['Company Formation', 'Banking', 'Asset Protection', 'Residency'],
      consultant: null,
      description: 'International financial center with strong privacy laws.',
      link: '/countries/panama',
    },
    {
      id: 'switzerland',
      name: 'Switzerland',
      flag: '🇨🇭',
      capital: 'Zurich',
      region: 'Europe',
      image: 'https://images.pexels.com/photos/1659438/pexels-photo-1659438.jpeg?auto=compress&cs=tinysrgb&w=800',
      rating: 4.8,
      clientCount: 0,
      available: false,
      featured: false,
      highlights: ['Banking Hub', 'Political Stability', 'Low Tax Cantons', 'Privacy'],
      services: ['Company Formation', 'Banking', 'Asset Protection', 'Tax Planning'],
      consultant: null,
      description: 'World-renowned financial center with exceptional stability.',
      link: '/countries/switzerland',
    },
    {
      id: 'singapore',
      name: 'Singapore',
      flag: '🇸🇬',
      capital: 'Singapore',
      region: 'Asia',
      image: 'https://images.pexels.com/photos/2265876/pexels-photo-2265876.jpeg?auto=compress&cs=tinysrgb&w=800',
      rating: 4.9,
      clientCount: 0,
      available: false,
      featured: true,
      highlights: ['17% Tax Rate', 'Asian Gateway', 'Strong Legal', 'Banking Hub'],
      services: ['Company Formation', 'Banking', 'Tax Planning', 'Legal Services'],
      consultant: null,
      description: 'Premier Asian business hub with world-class infrastructure.',
      link: '/countries/singapore',
    },
    {
      id: 'netherlands',
      name: 'Netherlands',
      flag: '🇳🇱',
      capital: 'Amsterdam',
      region: 'Europe',
      image: 'https://images.pexels.com/photos/1851481/pexels-photo-1851481.jpeg?auto=compress&cs=tinysrgb&w=800',
      rating: 4.7,
      clientCount: 0,
      available: false,
      featured: false,
      highlights: ['EU Member', 'Tax Treaties', 'Innovation Hub', 'English Friendly'],
      services: ['Company Formation', 'Tax Planning', 'Banking', 'IP Services'],
      consultant: null,
      description: 'EU member with extensive tax treaty network and innovation focus.',
      link: '/countries/netherlands',
    },
    {
      id: 'ireland',
      name: 'Ireland',
      flag: '🇮🇪',
      capital: 'Dublin',
      region: 'Europe',
      image: 'https://images.pexels.com/photos/2416653/pexels-photo-2416653.jpeg?auto=compress&cs=tinysrgb&w=800',
      rating: 4.7,
      clientCount: 0,
      available: false,
      featured: false,
      highlights: ['EU Member', '12.5% Tax Rate', 'English Speaking', 'Tech Hub'],
      services: ['Company Formation', 'Tax Planning', 'Banking', 'IP Services'],
      consultant: null,
      description: 'EU member state with attractive corporate tax rate and strong English-speaking business environment.',
      link: '/countries/ireland',
    },
    {
      id: 'gibraltar',
      name: 'Gibraltar',
      flag: '🇬🇮',
      capital: 'Gibraltar',
      region: 'Europe',
      image: 'https://images.pexels.com/photos/3225531/pexels-photo-3225531.jpeg?auto=compress&cs=tinysrgb&w=800',
      rating: 4.6,
      clientCount: 0,
      available: false,
      featured: false,
      highlights: ['UK Territory', '10% Tax Rate', 'EU Access', 'Financial Hub'],
      services: ['Company Formation', 'Banking', 'Financial Services', 'Gaming License'],
      consultant: null,
      description: 'British Overseas Territory with competitive tax rates and access to EU markets.',
      link: '/countries/gibraltar',
    },
    {
      id: 'lithuania',
      name: 'Lithuania',
      flag: '🇱🇹',
      capital: 'Vilnius',
      region: 'Europe',
      image: 'https://images.pexels.com/photos/4386321/pexels-photo-4386321.jpeg?auto=compress&cs=tinysrgb&w=800',
      rating: 4.5,
      clientCount: 0,
      available: false,
      featured: false,
      highlights: ['EU Member', '15% Tax Rate', 'Fintech Hub', 'Digital Banking'],
      services: ['Company Formation', 'Banking', 'Fintech License', 'Digital Services'],
      consultant: null,
      description: 'EU member state with growing fintech sector and modern digital banking infrastructure.',
      link: '/countries/lithuania',
    },
    {
      id: 'canada',
      name: 'Canada',
      flag: '🇨🇦',
      capital: 'Toronto',
      region: 'North America',
      image: 'https://images.pexels.com/photos/1519088/pexels-photo-1519088.jpeg?auto=compress&cs=tinysrgb&w=800',
      rating: 4.6,
      clientCount: 0,
      available: false,
      featured: false,
      highlights: ['Stable Economy', 'Immigration Programs', 'NAFTA Access', 'Tech Hub'],
      services: ['Company Formation', 'Immigration', 'Banking', 'Tax Planning'],
      consultant: null,
      description: 'Stable economy with attractive immigration and business programs.',
      link: '/countries/canada',
    },
    {
      id: 'bulgaria',
      name: 'Bulgaria',
      flag: '🇧🇬',
      capital: 'Sofia',
      region: 'Europe',
      image: 'https://images.pexels.com/photos/3225531/pexels-photo-3225531.jpeg?auto=compress&cs=tinysrgb&w=800',
      rating: 4.4,
      clientCount: 0,
      available: false,
      featured: false,
      highlights: ['EU Member', '10% Tax Rate', 'Low Costs', 'Strategic Location'],
      services: ['Company Formation', 'Tax Planning', 'Banking', 'EU Access'],
      consultant: null,
      description: 'EU member state with competitive tax rates and low operational costs.',
      link: '/countries/bulgaria',
    },
    {
      id: 'spain',
      name: 'Spain',
      flag: '🇪🇸',
      capital: 'Madrid',
      region: 'Europe',
      image: 'https://images.pexels.com/photos/1388030/pexels-photo-1388030.jpeg?auto=compress&cs=tinysrgb&w=800',
      rating: 4.5,
      clientCount: 0,
      available: false,
      featured: false,
      highlights: ['EU Member', 'Large Market', 'Golden Visa', 'Strategic Location'],
      services: ['Company Formation', 'Golden Visa', 'Banking', 'Real Estate'],
      consultant: null,
      description: 'Major EU economy with golden visa program and strategic market access.',
      link: '/countries/spain',
    },
    {
      id: 'montenegro',
      name: 'Montenegro',
      flag: '🇲🇪',
      capital: 'Podgorica',
      region: 'Europe',
      image: 'https://images.pexels.com/photos/3225531/pexels-photo-3225531.jpeg?auto=compress&cs=tinysrgb&w=800',
      rating: 4.5,
      clientCount: 0,
      available: false,
      featured: false,
      highlights: ['EU Candidate', 'Low Tax Rates', 'Residency Programs', 'Adriatic Coast'],
      services: ['Company Formation', 'Tax Planning', 'Residency', 'Banking'],
      consultant: null,
      description: 'EU candidate country with attractive tax rates and residency programs.',
      link: '/countries/montenegro',
    },
    {
      id: 'costa-rica',
      name: 'Costa Rica',
      flag: '🇨🇷',
      capital: 'San José',
      region: 'Central America',
      image: 'https://images.pexels.com/photos/1430676/pexels-photo-1430676.jpeg?auto=compress&cs=tinysrgb&w=800',
      rating: 4.7,
      clientCount: 25,
      available: true,
      featured: true,
      highlights: ['Political Stability', 'No Army', 'Eco-Friendly', 'Strategic Location'],
      services: ['Company Formation', 'Tax Planning', 'Banking', 'Residency Services'],
      consultant: {
        name: 'Carlos Mendez',
        experience: '6+ years',
        avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100',
      },
      description: 'Stable democracy in Central America with strong environmental policies and business-friendly regulations.',
      link: '/countries/costa-rica',
    },
    {
      id: 'norway',
      name: 'Norway',
      flag: '🇳🇴',
      capital: 'Oslo',
      region: 'Europe',
      image: 'https://images.pexels.com/photos/1559821/pexels-photo-1559821.jpeg?auto=compress&cs=tinysrgb&w=800',
      rating: 4.9,
      clientCount: 0,
      available: false,
      featured: true,
      highlights: ['Oil Fund', 'High Living Standards', 'Innovation Hub', 'Stable Economy'],
      services: ['Company Formation', 'Tax Planning', 'Banking', 'Innovation Support'],
      consultant: null,
      description: 'Wealthy Nordic country with strong economy, innovation ecosystem and high living standards.',
      link: '/countries/norway',
    },
  ];

  const regions = [
    { value: 'all', label: 'All Regions' },
    { value: 'Europe', label: 'Europe' },
    { value: 'Asia', label: 'Asia' },
    { value: 'Middle East', label: 'Middle East' },
    { value: 'North America', label: 'North America' },
    { value: 'Central America', label: 'Central America' },
    { value: 'Caucasus', label: 'Caucasus' },
  ];

  const serviceTypes = [
    { value: 'all', label: 'All Services' },
    { value: 'Company Formation', label: 'Company Formation' },
    { value: 'Tax Planning', label: 'Tax Planning' },
    { value: 'Banking', label: 'Banking' },
    { value: 'Visa Services', label: 'Visa Services' },
    { value: 'Legal Services', label: 'Legal Services' },
  ];

  const filteredCountries = allCountries.filter(country => {
    const matchesSearch = 
      country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      country.capital.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRegion = regionFilter === 'all' || country.region === regionFilter;
    
    const matchesService = serviceFilter === 'all' || 
      country.services.some(service => service.includes(serviceFilter));
    
    return matchesSearch && matchesRegion && matchesService;
  });

  const availableCountries = filteredCountries.filter(c => c.available);
  const comingSoonCountries = filteredCountries.filter(c => !c.available);

  const handleCountryClick = (country: any) => {
    // This function is no longer needed since we use Link components
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Countries - Global Business Formation Services - Consulting19</title>
        <meta name="description" content="Explore business formation opportunities in 19+ countries. Expert consultants and comprehensive services for international expansion." />
      </Helmet>

      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 text-white py-20 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Global Business Formation Services
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
            Expert consultants and comprehensive business services across 19+ countries. 
            Find the perfect jurisdiction for your international expansion.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/countries">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Explore Available Countries
                </Button>
              </Link>
              <Link to="/auth?mode=register">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Get Country Recommendations
                </Button>
              </Link>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Filters */}
        <section className="mb-12">
          <Card>
            <Card.Body>
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search countries or capitals..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="flex gap-4">
                  <select
                    value={regionFilter}
                    onChange={(e) => setRegionFilter(e.target.value)}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {regions.map(region => (
                      <option key={region.value} value={region.value}>{region.label}</option>
                    ))}
                  </select>
                  <select
                    value={serviceFilter}
                    onChange={(e) => setServiceFilter(e.target.value)}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {serviceTypes.map(service => (
                      <option key={service.value} value={service.value}>{service.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </Card.Body>
          </Card>
        </section>

        {/* Available Countries */}
        {availableCountries.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-gray-900">Available Now</h2>
              <span className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
                {availableCountries.length} countries
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {availableCountries.map((country) => (
                <Link
                  key={country.id}
                  to={country.link}
                  className="block"
                >
                  <Card 
                    hover 
                    className="overflow-hidden cursor-pointer group"
                  >
                  <div className="relative h-48">
                    <img
                      src={country.image}
                      alt={`${country.capital}, ${country.name}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                    
                    {/* Status Badge */}
                    <div className="absolute top-4 right-4">
                      <span className="bg-green-500/90 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                        Available
                      </span>
                    </div>
                    
                    {country.featured && (
                      <div className="absolute top-4 left-4">
                        <span className="bg-orange-500/90 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                          Featured
                        </span>
                      </div>
                    )}
                    
                    {/* Country Info */}
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <span className="text-4xl drop-shadow-lg">{country.flag}</span>
                          <div>
                            <h3 className="text-lg font-bold text-white drop-shadow-lg">{country.name}</h3>
                            <p className="text-sm text-gray-200 drop-shadow-sm">{country.capital}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <Card.Body>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="font-medium text-gray-900">{country.rating}</span>
                        <span className="text-sm text-gray-500">({country.clientCount} clients)</span>
                      </div>
                      <span className="text-sm text-gray-500">{country.region}</span>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                      {country.description}
                    </p>
                    
                    {/* Services */}
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-1">
                        {country.services.slice(0, 3).map((service, i) => (
                          <span key={i} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                            {service}
                          </span>
                        ))}
                        {country.services.length > 3 && (
                          <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                            +{country.services.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {/* Consultant Info */}
                    {country.consultant && (
                      <div className="flex items-center space-x-3 mb-4 p-3 bg-gray-50 rounded-lg">
                        <img
                          src={country.consultant.avatar}
                          alt={country.consultant.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{country.consultant.name}</p>
                          <p className="text-xs text-gray-600">{country.consultant.experience}</p>
                        </div>
                      </div>
                    )}
                    
                    <Button 
                      className="w-full bg-gradient-to-r from-blue-600 to-teal-600 text-white font-semibold"
                      icon={ArrowRight}
                      iconPosition="right"
                    >
                      Explore {country.name}
                    </Button>
                  </Card.Body>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Coming Soon Countries */}
        {comingSoonCountries.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-gray-900">Coming Soon</h2>
              <span className="bg-orange-100 text-orange-800 text-sm font-medium px-3 py-1 rounded-full">
                {comingSoonCountries.length} countries
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {comingSoonCountries.map((country) => (
                <Link
                  key={country.id}
                  to={country.link}
                  className="block"
                >
                  <Card 
                    hover 
                    className="overflow-hidden cursor-pointer group opacity-75 hover:opacity-100 transition-opacity"
                  >
                  <div className="relative h-40">
                    <img
                      src={country.image}
                      alt={`${country.capital}, ${country.name}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                    
                    {/* Status Badge */}
                    <div className="absolute top-3 right-3">
                      <span className="bg-orange-500/90 backdrop-blur-sm text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                        Coming Soon
                      </span>
                    </div>
                    
                    {country.featured && (
                      <div className="absolute top-3 left-3">
                        <span className="bg-purple-500/90 backdrop-blur-sm text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                          Featured
                        </span>
                      </div>
                    )}
                    
                    {/* Country Info */}
                    <div className="absolute bottom-3 left-3 right-3">
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl drop-shadow-lg">{country.flag}</span>
                        <div>
                          <h3 className="text-sm font-bold text-white drop-shadow-lg">{country.name}</h3>
                          <p className="text-xs text-gray-200 drop-shadow-sm">{country.capital}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <Card.Body className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-1">
                        <Star className="w-3 h-3 text-yellow-400 fill-current" />
                        <span className="text-sm font-medium text-gray-900">{country.rating}</span>
                      </div>
                      <span className="text-xs text-gray-500">{country.region}</span>
                    </div>
                    
                    <div className="flex flex-wrap gap-1 mb-3">
                      {country.services.slice(0, 2).map((service, i) => (
                        <span key={i} className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                          {service}
                        </span>
                      ))}
                    </div>
                    
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full text-orange-600 border-orange-600 hover:bg-orange-50"
                    >
                      Notify When Ready
                    </Button>
                  </Card.Body>
                </Card>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* No Results */}
        {filteredCountries.length === 0 && (
          <section>
            <Card>
              <Card.Body className="text-center py-12">
                <Globe className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No Countries Found
                </h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your search terms or filters to find the right jurisdiction.
                </p>
                <Button 
                  variant="outline"
                  onClick={() => {
                    setSearchTerm('');
                    setRegionFilter('all');
                    setServiceFilter('all');
                  }}
                >
                  Clear Filters
                </Button>
              </Card.Body>
            </Card>
          </section>
        )}

        {/* Stats Section */}
        <section className="mt-16">
          <Card className="bg-gradient-to-r from-gray-900 to-gray-800 text-white">
            <Card.Body className="text-center py-12">
              <h2 className="text-3xl font-bold mb-8">Global Reach & Impact</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div>
                  <div className="text-3xl font-bold mb-2">{allCountries.length}+</div>
                  <div className="text-gray-300">Countries Covered</div>
                </div>
                <div>
                  <div className="text-3xl font-bold mb-2">{availableCountries.length}</div>
                  <div className="text-gray-300">Available Now</div>
                </div>
                <div>
                  <div className="text-3xl font-bold mb-2">2,500+</div>
                  <div className="text-gray-300">Successful Formations</div>
                </div>
                <div>
                  <div className="text-3xl font-bold mb-2">98%</div>
                  <div className="text-gray-300">Success Rate</div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </section>

        {/* CTA Section */}
        <section className="mt-16">
          <Card className="bg-gradient-to-r from-blue-600 to-teal-600 text-white">
            <Card.Body className="text-center py-12">
              <h2 className="text-3xl font-bold mb-4">Can't Find Your Ideal Jurisdiction?</h2>
              <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
                Our AI Oracle can analyze your specific needs and recommend the perfect country for your business expansion.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/auth?mode=register">
                  <Button 
                    size="lg" 
                    className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Get AI Recommendations
                  </Button>
                </Link>
                <Link to="/auth?mode=register">
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 text-white border-0 font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Schedule Expert Consultation
                  </Button>
                </Link>
              </div>
            </Card.Body>
          </Card>
        </section>
      </div>

      <Footer />
      
      {/* AI Agent Icon */}
      <AIAgentIcon />
    </div>
  );
};

export default CountriesPage;