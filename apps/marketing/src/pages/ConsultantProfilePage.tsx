import React from 'react';
import { useParams } from 'react-router-dom';
import { User, MapPin, Star, Calendar, MessageSquare, CheckCircle } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { useLanguage } from '../lib/language';
import { useAuth } from '../lib/auth';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const ConsultantProfilePage = () => {
  const { consultantId } = useParams();
  const { t } = useLanguage();
  const { user } = useAuth();

  // Mock consultant data - in real app this would be fetched from API
  const consultant = {
    id: consultantId,
    name: 'Giorgi Meskhi',
    title: 'International Business Consultant',
    company: 'Meskhi & Associates',
    location: 'Tbilisi, Georgia',
    rating: 4.9,
    reviewCount: 127,
    languages: ['English', 'Georgian', 'Russian'],
    specializations: ['Company Formation', 'Tax Optimization', 'Banking Solutions'],
    experience: '8+ years',
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400',
    bio: 'Experienced international business consultant specializing in Georgian and regional market entry. Helped 200+ companies establish successful operations in the Caucasus region.',
    services: [
      {
        id: '1',
        title: 'Georgia LLC Formation',
        price: 2500, // Bu fiyat sadece giriş yapmış müşterilere gösterilecek
        duration: '2-3 weeks',
        description: 'Complete LLC setup with banking and tax registration'
      },
      {
        id: '2',
        title: 'Tax Residency Planning',
        price: 1500,
        duration: '1-2 weeks',
        description: 'Strategic tax planning for Georgian tax residency'
      },
      {
        id: '3',
        title: 'Banking Setup',
        price: 800,
        duration: '1 week',
        description: 'Corporate banking account opening assistance'
      }
    ]
  };

  // Check if user is logged in and assigned to this consultant
  const isLoggedInClient = user && user.user_metadata?.role === 'client';
  // TODO: In real implementation, check if user is assigned to this specific consultant
  const canSeePricing = isLoggedInClient;

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>{consultant.name} - Consulting19</title>
        <meta name="description" content={`${consultant.name}, ${consultant.title} at ${consultant.company}. ${consultant.bio}`} />
      </Helmet>

      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Consultant Info */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <Card.Body className="text-center">
                <img
                  src={consultant.avatar}
                  alt={consultant.name}
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                />
                <h1 className="text-2xl font-bold text-gray-900 mb-2">{consultant.name}</h1>
                <p className="text-gray-600 mb-2">{consultant.title}</p>
                <p className="text-sm text-gray-500 mb-4">{consultant.company}</p>
                
                <div className="flex items-center justify-center space-x-2 mb-4">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{consultant.location}</span>
                </div>
                
                <div className="flex items-center justify-center space-x-2 mb-6">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(consultant.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-medium text-gray-900">{consultant.rating}</span>
                  <span className="text-sm text-gray-500">({consultant.reviewCount} reviews)</span>
                </div>

                <div className="space-y-4 mb-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-2">Languages</h3>
                    <div className="flex flex-wrap gap-2">
                      {consultant.languages.map((lang, index) => (
                        <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          {lang}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-2">Specializations</h3>
                    <div className="flex flex-wrap gap-2">
                      {consultant.specializations.map((spec, index) => (
                        <span key={index} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button className="w-full" icon={MessageSquare}>
                    {t('contact')} {consultant.name}
                  </Button>
                  <Button variant="outline" className="w-full" icon={Calendar}>
                    {t('scheduleConsultation')}
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* About */}
            <Card>
              <Card.Header>
                <h2 className="text-xl font-semibold text-gray-900">About {consultant.name}</h2>
              </Card.Header>
              <Card.Body>
                <p className="text-gray-600 leading-relaxed mb-4">{consultant.bio}</p>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 mr-1 text-green-600" />
                    <span>{consultant.experience} experience</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 mr-1 text-green-600" />
                    <span>200+ successful projects</span>
                  </div>
                </div>
              </Card.Body>
            </Card>

            {/* Services */}
            <Card>
              <Card.Header>
                <h2 className="text-xl font-semibold text-gray-900">Services Offered</h2>
              </Card.Header>
              <Card.Body>
                <div className="space-y-6">
                  {consultant.services.map((service, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">{service.title}</h3>
                          <p className="text-gray-600 mb-3">{service.description}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>Duration: {service.duration}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          {canSeePricing ? (
                            <>
                              <div className="text-2xl font-bold text-gray-900 mb-1">
                                ${service.price.toLocaleString('en-US')}
                              </div>
                              <Button size="sm">
                                Satın Al
                              </Button>
                            </>
                          ) : (
                            <>
                              <div className="text-lg font-medium text-gray-500 mb-1">
                                Fiyat bilgisi için
                              </div>
                              <Button size="sm" variant="outline" onClick={() => window.open('/auth', '_blank')}>
                                Üye Olun
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card.Body>
            </Card>

            {/* Reviews */}
            <Card>
              <Card.Header>
                <h2 className="text-xl font-semibold text-gray-900">Client Reviews</h2>
              </Card.Header>
              <Card.Body>
                <div className="space-y-6">
                  {[
                    {
                      name: 'Sarah Johnson',
                      company: 'TechStart Inc.',
                      rating: 5,
                      comment: 'Exceptional service! Giorgi helped us establish our Georgian entity efficiently and professionally.',
                      date: '2 weeks ago'
                    },
                    {
                      name: 'Michael Chen',
                      company: 'Global Ventures',
                      rating: 5,
                      comment: 'Outstanding expertise in Georgian tax law. Saved us significant time and money.',
                      date: '1 month ago'
                    }
                  ].map((review, index) => (
                    <div key={index} className="border-b border-gray-200 pb-6 last:border-b-0">
                      <div className="flex items-start space-x-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h4 className="font-medium text-gray-900">{review.name}</h4>
                            <span className="text-sm text-gray-500">• {review.company}</span>
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-3 h-3 ${
                                    i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-gray-600 text-sm mb-2">{review.comment}</p>
                          <span className="text-xs text-gray-500">{review.date}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card.Body>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ConsultantProfilePage;