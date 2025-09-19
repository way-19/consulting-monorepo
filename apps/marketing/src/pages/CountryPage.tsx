import React from 'react';
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { MapPin, Users, Building2, TrendingUp, Star, Calendar, MessageSquare, ArrowRight, CheckCircle, Globe, Shield, DollarSign, Clock, FileText, User, Eye } from 'lucide-react';
import { useLanguage } from '../lib/language';
import { supabase } from '../lib/supabase';
import { Button, Card } from '../lib/ui';
import { AIAgentIcon } from '@consulting19/shared';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

interface BlogPost {
  id: string;
  title_i18n: any;
  excerpt_i18n: any;
  content_i18n: any;
  slug: string;
  category: string;
  tags: string[];
  featured_image_url: string;
  is_published: boolean;
  published_at: string;
  author: {
    full_name: string;
    company: string;
  };
  created_at: string;
}

const CountryPage = () => {
  const { countryCode } = useParams();
  const { t } = useLanguage();
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [blogLoading, setBlogLoading] = useState(true);

  useEffect(() => {
    if (countryCode === 'georgia') {
      fetchCountryBlogPosts();
    }
  }, [countryCode]);

  const fetchCountryBlogPosts = async () => {
    try {
      setBlogLoading(true);
      
      const { data, error } = await supabase
        .from('blog_posts')
        .select(`
          *,
          author:user_profiles!blog_posts_author_id_fkey(full_name, company)
        `)
        .eq('is_published', true)
        .eq('country_code', countryCode?.toUpperCase())
        .order('published_at', { ascending: false })
        .limit(6);

      if (error) {
        console.error('Error fetching blog posts:', error);
        loadMockBlogPosts();
      } else {
        setBlogPosts(data || []);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      loadMockBlogPosts();
    } finally {
      setBlogLoading(false);
    }
  };

  const loadMockBlogPosts = () => {
    // Use mock blog posts data
    setBlogPosts([
      {
        id: '1',
        title_i18n: { en: 'Complete Guide to Georgian LLC Formation' },
        excerpt_i18n: { en: 'Everything you need to know about setting up an LLC in Georgia with Small Business Status for optimal tax benefits.' },
        content_i18n: { en: 'Setting up an LLC in Georgia offers significant advantages for international entrepreneurs...' },
        slug: 'georgian-llc-formation-guide',
        category: 'Company Formation',
        tags: ['Georgia', 'LLC', 'Tax Benefits'],
        featured_image_url: 'https://images.pexels.com/photos/4386321/pexels-photo-4386321.jpeg?auto=compress&cs=tinysrgb&w=800',
        is_published: true,
        published_at: '2025-01-15T10:00:00Z',
        author: {
          full_name: 'Giorgi Meskhi',
          company: 'Meskhi & Associates'
        },
        created_at: '2025-01-15T10:00:00Z'
      },
      {
        id: '2',
        title_i18n: { en: 'Georgian Tax Residency Benefits for Digital Nomads' },
        excerpt_i18n: { en: 'Discover how Georgian tax residency can benefit digital nomads and remote workers with favorable tax policies.' },
        content_i18n: { en: 'Georgian tax residency offers unique opportunities for digital nomads...' },
        slug: 'georgian-tax-residency-digital-nomads',
        category: 'Tax Planning',
        tags: ['Georgia', 'Tax Residency', 'Digital Nomads'],
        featured_image_url: 'https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg?auto=compress&cs=tinysrgb&w=800',
        is_published: true,
        published_at: '2025-01-12T10:00:00Z',
        author: {
          full_name: 'Giorgi Meskhi',
          company: 'Meskhi & Associates'
        },
        created_at: '2025-01-12T10:00:00Z'
      },
      {
        id: '3',
        title_i18n: { en: 'Banking Solutions for International Businesses in Georgia' },
        excerpt_i18n: { en: 'Navigate the Georgian banking system and open corporate accounts for your international business operations.' },
        content_i18n: { en: 'The Georgian banking sector has evolved significantly in recent years...' },
        slug: 'georgian-banking-solutions-international-business',
        category: 'Banking',
        tags: ['Georgia', 'Banking', 'Corporate Accounts'],
        featured_image_url: 'https://images.pexels.com/photos/259027/pexels-photo-259027.jpeg?auto=compress&cs=tinysrgb&w=800',
        is_published: true,
        published_at: '2025-01-10T10:00:00Z',
        author: {
          full_name: 'Giorgi Meskhi',
          company: 'Meskhi & Associates'
        },
        created_at: '2025-01-10T10:00:00Z'
      }
    ]);
    setBlogLoading(false);
  };

  const getLocalizedContent = (content: any, field: string, fallback: string = '') => {
    if (!content || typeof content !== 'object') return fallback;
    const currentLang = 'en'; // For now, use English
    return content[currentLang] || content.en || fallback;
  };

  // Country data - şimdilik sadece Georgia için
  const countryData = {
    georgia: {
      name: 'Georgia',
      flag: '🇬🇪',
      description: 'Strategic business hub between Europe and Asia with favorable tax policies and streamlined company formation processes.',
      capital: 'Tbilisi',
      language: 'Georgian, English',
      currency: 'Georgian Lari (GEL)',
      timezone: 'GMT+4',
      heroImage: 'https://images.pexels.com/photos/4386321/pexels-photo-4386321.jpeg?auto=compress&cs=tinysrgb&w=1920',
      businessAdvantages: [
        'Small Business Status (1% tax rate)',
        'International Business Company (0% tax on foreign income)',
        'EU Association Agreement benefits',
        'Strategic location between Europe and Asia',
        'Simple online company registration',
        'No currency restrictions',
        'Banking sector with international standards',
        'English-speaking business environment',
      ],
      consultant: {
        id: 'giorgi-meskhi',
        name: 'Giorgi Meskhi',
        title: 'Senior Business Consultant',
        company: 'Meskhi & Associates',
        experience: '8+ years',
        rating: 4.9,
        clients: 150,
        avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400',
        specializations: ['Company Formation', 'Tax Optimization', 'Banking Solutions', 'Legal Compliance'],
        languages: ['English', 'Georgian', 'Russian'],
      },
      services: [
        {
          title: 'Georgia LLC Formation',
          description: 'Complete LLC setup with Small Business Status registration for optimal tax benefits',
          duration: '2-3 weeks',
          features: ['Company registration', 'Tax registration', 'Bank account opening assistance', 'Legal compliance setup', 'Ongoing support'],
          category: 'Company Formation',
          image: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=800',
          link: '/services/georgia/llc-formation',
        },
        {
          title: 'International Business Company',
          description: 'IBC setup for international operations with 0% tax on foreign income',
          duration: '3-4 weeks',
          features: ['IBC registration', 'Tax optimization', 'International banking', 'Ongoing compliance', 'Annual reporting'],
          category: 'Tax Optimization',
          image: 'https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg?auto=compress&cs=tinysrgb&w=800',
          link: '/services/georgia/international-business-company',
        },
        {
          title: 'Tax Residency Planning',
          description: 'Strategic tax planning for Georgian tax residency benefits',
          duration: '1-2 weeks',
          features: ['Residency assessment', 'Tax planning', 'Documentation support', 'Ongoing advisory', 'Compliance monitoring'],
          category: 'Tax Planning',
          image: 'https://images.pexels.com/photos/4386321/pexels-photo-4386321.jpeg?auto=compress&cs=tinysrgb&w=800',
          link: '/services/georgia/tax-residency',
        },
        {
          title: 'Banking Solutions',
          description: 'Corporate banking account opening and financial services setup',
          duration: '1-2 weeks',
          features: ['Bank account opening', 'Multi-currency accounts', 'Payment gateway setup', 'Banking relationships', 'Ongoing support'],
          category: 'Banking',
          image: 'https://images.pexels.com/photos/259027/pexels-photo-259027.jpeg?auto=compress&cs=tinysrgb&w=800',
          link: '/services/georgia/banking-solutions',
        },
        {
          title: 'Visa & Residence Permit',
          description: 'Get your Georgian visa or residence permit with expert guidance',
          duration: '2-4 weeks',
          features: ['Visa application', 'Document preparation', 'Application tracking', 'Legal support', 'Renewal assistance'],
          category: 'Immigration',
          image: 'https://images.pexels.com/photos/4386321/pexels-photo-4386321.jpeg?auto=compress&cs=tinysrgb&w=800',
          link: '/services/georgia/visa-residence-permit',
        },
        {
          title: 'Individual Entrepreneur Status',
          description: 'IE status registration with only 1% tax on income up to $200,000',
          duration: '1 week',
          features: ['IE registration', 'Tax optimization', 'Compliance setup', 'Banking assistance', 'Ongoing support'],
          category: 'Tax Planning',
          image: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800',
          link: '/services/georgia/individual-entrepreneur',
        },
      ],
      stats: {
        companiesFormed: 1200,
        avgFormationTime: '2.5 weeks',
        successRate: '98%',
        clientSatisfaction: 4.9,
      },
      keyFacts: [
        { label: 'Corporate Tax Rate', value: '20%', icon: DollarSign },
        { label: 'Small Business Tax', value: '1%', icon: TrendingUp },
        { label: 'Formation Time', value: '1-2 days', icon: Building2 },
        { label: 'Minimum Capital', value: 'No minimum', icon: Shield },
      ],
    },
  };

  const country = countryData[countryCode as keyof typeof countryData];

  if (!country) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-20 pb-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Country Not Found</h1>
            <p className="text-gray-600 mb-6">The requested country page is not available yet.</p>
            <Button onClick={() => window.history.back()}>
              Go Back
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>{country.name} - Business Formation & Consulting - Consulting19</title>
        <meta name="description" content={`Expert business consulting services in ${country.name}. ${country.description}`} />
      </Helmet>

      <Navbar />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 text-white py-20 mt-16 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img
            src={country.heroImage}
            alt={`${country.name} business landscape`}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="text-6xl mb-6 animate-bounce">{country.flag}</div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Business Formation in {country.name}
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
              {country.description}
            </p>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-15 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-white text-center mb-8">
            Available Services
          </h2>
          <p className="text-lg text-gray-200 text-center mb-8 max-w-3xl mx-auto">
            Comprehensive business services tailored for {country.name}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {country.services.map((service, index) => (
              <Link 
                key={index} 
                to={service.link}
                className="relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] h-60 group block"
              >
                <img
                  src={service.image}
                  alt={service.title}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20 group-hover:from-black/90 group-hover:via-black/50 group-hover:to-black/30 transition-all duration-300"></div>
                <div className="relative z-10 p-4 h-full flex flex-col justify-end">
                  <div className="mb-3">
                    <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-medium rounded-full">
                      {service.category}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2 leading-tight">
                    {service.title}
                  </h3>
                  <p className="text-gray-200 text-xs leading-relaxed mb-2">
                    {service.description}
                  </p>
                  <div className="flex justify-end">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <ArrowRight className="w-4 h-4 text-white" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Key Facts */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Why Choose {country.name}?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {country.keyFacts.map((fact, index) => (
              <Card key={index} hover className="text-center">
                <Card.Body>
                  <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <fact.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {fact.label}
                  </h3>
                  <p className="text-2xl font-bold text-emerald-600">
                    {fact.value}
                  </p>
                </Card.Body>
              </Card>
            ))}
          </div>
        </section>

        {/* Business Advantages */}
        <section className="mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Business Advantages
              </h2>
              <p className="text-gray-600 mb-8 leading-relaxed">
                {country.name} offers exceptional opportunities for international businesses 
                with its strategic location, favorable tax regime, and business-friendly environment.
              </p>
              <div className="space-y-4">
                {country.businessAdvantages.map((advantage, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                    <span className="text-gray-700">{advantage}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt={`${country.name} business environment`}
                className="rounded-xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -right-6 bg-white rounded-xl p-6 shadow-xl">
                <div className="text-center">
                  <div className="text-2xl font-bold text-emerald-600">{country.stats.successRate}</div>
                  <div className="text-sm text-gray-600">Success Rate</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Expert Consultant */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Your Expert Consultant
          </h2>
          <Card className="max-w-4xl mx-auto">
            <Card.Body>
              <div className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8">
                <div className="flex-shrink-0">
                  <img
                    src={country.consultant.avatar}
                    alt={country.consultant.name}
                    className="w-32 h-32 rounded-full object-cover shadow-lg"
                  />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {country.consultant.name}
                  </h3>
                  <p className="text-lg text-gray-600 mb-4">
                    {country.consultant.title} • {country.consultant.company}
                  </p>
                  <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-4">
                    {country.consultant.specializations.map((spec, index) => (
                      <span key={index} className="px-3 py-1 bg-emerald-100 text-emerald-800 text-sm rounded-full">
                        {spec}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-center md:justify-start space-x-6 text-sm text-gray-600 mb-6">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 mr-1" />
                      <span>{country.consultant.rating} rating</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      <span>{country.consultant.clients}+ clients</span>
                    </div>
                    <div className="flex items-center">
                      <Building2 className="w-4 h-4 mr-1" />
                      <span>{country.consultant.experience}</span>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                      <p className="text-blue-800 text-sm font-medium mb-2">
                        💡 Consultant Access
                      </p>
                      <p className="text-blue-700 text-xs">
                        You need to be a member to message the consultant and schedule appointments.
                      </p>
                      <Button 
                        size="sm" 
                        className="mt-3 bg-blue-600 hover:bg-blue-700"
                        onClick={() => window.open('/auth?mode=register', '_blank')}
                      >
                        Sign Up
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </section>

        {/* Country Stats */}
        <section className="mb-16">
          <Card className="bg-gradient-to-r from-emerald-600 to-blue-600 text-white">
            <Card.Body className="text-center py-12">
              <h2 className="text-3xl font-bold mb-8">Our Track Record in {country.name}</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div>
                  <div className="text-3xl font-bold mb-2">{country.stats.companiesFormed}+</div>
                  <div className="text-emerald-100">Companies Formed</div>
                </div>
                <div>
                  <div className="text-3xl font-bold mb-2">{country.stats.avgFormationTime}</div>
                  <div className="text-emerald-100">Avg Formation Time</div>
                </div>
                <div>
                  <div className="text-3xl font-bold mb-2">{country.stats.successRate}</div>
                  <div className="text-emerald-100">Success Rate</div>
                </div>
                <div>
                  <div className="text-3xl font-bold mb-2">{country.stats.clientSatisfaction}★</div>
                  <div className="text-emerald-100">Client Satisfaction</div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </section>

        {/* Country Information */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Country Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <Card.Body className="text-center">
                <MapPin className="w-8 h-8 text-emerald-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">Capital</h3>
                <p className="text-gray-600">{country.capital}</p>
              </Card.Body>
            </Card>
            <Card>
              <Card.Body className="text-center">
                <Globe className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">Languages</h3>
                <p className="text-gray-600">{country.language}</p>
              </Card.Body>
            </Card>
            <Card>
              <Card.Body className="text-center">
                <DollarSign className="w-8 h-8 text-green-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">Currency</h3>
                <p className="text-gray-600">{country.currency}</p>
              </Card.Body>
            </Card>
            <Card>
              <Card.Body className="text-center">
                <Clock className="w-8 h-8 text-purple-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">Timezone</h3>
                <p className="text-gray-600">{country.timezone}</p>
              </Card.Body>
            </Card>
          </div>
        </section>

        {/* Blog Posts Section */}
        {countryCode === 'georgia' && (
          <section className="mb-12">
            <div className="text-center mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Latest Insights from {country.name}
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Expert articles and insights from our local consultant about doing business in {country.name}
              </p>
            </div>

            {blogLoading ? (
              <div className="flex space-x-4 overflow-x-auto pb-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="animate-pulse flex-shrink-0 w-80">
                    <div className="h-40 bg-gray-200 rounded-lg mb-3"></div>
                    <div className="h-3 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : blogPosts.length > 0 ? (
              <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
                {blogPosts.map((post) => (
                  <Card key={post.id} hover className="overflow-hidden flex-shrink-0 w-80 h-96">
                   <Card.Body className="p-0 h-full flex flex-col">
                    <div className="relative">
                      <img
                        src={post.featured_image_url || 'https://images.pexels.com/photos/4386321/pexels-photo-4386321.jpeg?auto=compress&cs=tinysrgb&w=800'}
                        alt={getLocalizedContent(post.title_i18n, 'title', 'Blog Post')}
                        className="w-full h-40 object-cover"
                      />
                      <div className="absolute top-3 left-3">
                        <span className="bg-emerald-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                          {post.category}
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-4 flex-1 flex flex-col">
                      <div className="flex-1">
                        <h3 className="text-base font-semibold text-gray-900 mb-2 line-clamp-2">
                          {getLocalizedContent(post.title_i18n, 'title', 'Untitled Post')}
                        </h3>
                        
                        <p className="text-gray-600 text-xs mb-3 line-clamp-2">
                          {getLocalizedContent(post.excerpt_i18n, 'excerpt', 'No excerpt available')}
                        </p>
                      </div>
                      
                      <div className="border-t border-gray-100 pt-3">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2 text-xs text-gray-500">
                            <div className="flex items-center">
                              <User className="w-3 h-3 mr-1" />
                              <span>{post.author?.full_name}</span>
                            </div>
                            <div className="flex items-center">
                              <Calendar className="w-3 h-3 mr-1" />
                              <span>{new Date(post.published_at).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                        
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full"
                          icon={Eye}
                          onClick={() => window.open(`/blog/${post.slug}`, '_blank')}
                        >
                          Read Article
                        </Button>
                      </div>
                    </div>
                   </Card.Body>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <Card.Body className="text-center py-8">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No Articles Yet
                  </h3>
                  <p className="text-sm text-gray-600">
                    Our {country.name} expert will be publishing insights soon. Check back later!
                  </p>
                </Card.Body>
              </Card>
            )}

            {blogPosts.length > 0 && (
              <div className="text-center mt-6">
                <Button 
                  variant="outline" 
                  size="md"
                  icon={ArrowRight}
                  iconPosition="right"
                  onClick={() => window.open('/blog', '_blank')}
                >
                  View All Articles
                </Button>
              </div>
            )}
          </section>
        )}

        {/* CTA Section */}
        <section>
          <Card className="bg-gradient-to-r from-gray-900 to-gray-800 text-white">
            <Card.Body className="text-center py-12">
              <h2 className="text-3xl font-bold mb-4">
                Ready to Start Your Business in {country.name}?
              </h2>
              <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
                Get expert guidance from our local specialist and start your international expansion journey today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 max-w-md mx-auto">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-white mb-2">
                      🔐 Expert Access Required
                    </h3>
                    <p className="text-blue-100 text-sm mb-4">
                      Sign up to connect with our {country.name} specialist and access exclusive services
                    </p>
                    <Button 
                      size="lg" 
                      className="bg-gradient-to-r from-emerald-500 to-blue-600 text-white hover:from-emerald-600 hover:to-blue-700 shadow-xl w-full font-semibold"
                      onClick={() => window.open('/auth?mode=register', '_blank')}
                    >
                      Join Consulting19
                    </Button>
                    <p className="text-xs text-blue-200 mt-2">
                      Already a member? <button 
                        onClick={() => window.open('/auth', '_blank')}
                        className="text-white underline hover:text-blue-200"
                      >
                        Sign in here
                      </button>
                    </p>
                  </div>
                </div>
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

export default CountryPage;