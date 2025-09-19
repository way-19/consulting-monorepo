import React from 'react';
import { Users, Globe, Shield, Zap, CheckCircle, Award, Target, Heart } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { useLanguage } from '../lib/language';
import { Button, Card } from '../lib/ui';
import { AIAgentIcon } from '@consulting19/shared';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const AboutPage = () => {
  const { t } = useLanguage();

  const stats = [
    { number: '19+', label: 'Countries Served', icon: Globe },
    { number: '2,500+', label: 'Successful Formations', icon: CheckCircle },
    { number: '98%', label: 'Success Rate', icon: Award },
    { number: '24/7', label: 'AI Support', icon: Zap },
  ];

  const values = [
    {
      icon: Shield,
      title: 'Trust & Transparency',
      description: 'We believe in complete transparency in our processes, pricing, and partnerships. Your trust is our foundation.',
    },
    {
      icon: Zap,
      title: 'Innovation First',
      description: 'We leverage cutting-edge AI technology to provide faster, more accurate, and personalized consulting services.',
    },
    {
      icon: Globe,
      title: 'Global Expertise',
      description: 'Our network of local experts ensures you get authentic, up-to-date advice for every jurisdiction.',
    },
    {
      icon: Heart,
      title: 'Client Success',
      description: 'Your success is our success. We\'re committed to helping you achieve your international business goals.',
    },
  ];

  const milestones = [
    {
      year: '2016',
      title: 'Company Founded',
      description: 'Started with a vision to democratize international business consulting',
    },
    {
      year: '2017',
      title: 'AI Integration',
      description: 'Launched AI Oracle assistant for multilingual support',
    },
    {
      year: '2018',
      title: 'Global Expansion',
      description: 'Expanded to 10+ countries with local expert partnerships',
    },
    {
      year: '2020',
      title: 'Platform Launch',
      description: 'Launched comprehensive digital platform for seamless consulting',
    },
    {
      year: '2022',
      title: '19+ Countries',
      description: 'Reached 19+ countries with full-service capabilities',
    },
    {
      year: '2025',
      title: 'AI Revolution',
      description: 'Advanced AI-powered recommendations and instant support',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>About Us - Consulting19</title>
        <meta name="description" content="Learn about Consulting19's mission to democratize international business consulting through AI-powered platform and expert network." />
      </Helmet>

      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 text-white py-20 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              About Consulting19
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              We're revolutionizing international business consulting through AI-powered intelligence 
              and a global network of expert advisors.
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Mission Statement */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              To democratize international business expansion by combining cutting-edge AI technology 
              with local expertise, making global business formation accessible, transparent, and efficient 
              for entrepreneurs worldwide.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <Card key={index} hover className="text-center">
                <Card.Body>
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <stat.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </Card.Body>
              </Card>
            ))}
          </div>
        </section>

        {/* Our Story */}
        <section className="mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
              <div className="prose prose-lg text-gray-600 leading-relaxed">
                <p className="mb-4">
                  Consulting19 was born from a simple observation: international business expansion 
                  was unnecessarily complex, expensive, and opaque. Entrepreneurs faced language barriers, 
                  regulatory confusion, and difficulty finding trustworthy local experts.
                </p>
                <p className="mb-4">
                  We set out to change this by building the world's first AI-powered international 
                  business consulting platform. Our AI Oracle assistant breaks down language barriers, 
                  while our network of vetted local experts provides authentic, up-to-date guidance.
                </p>
                <p>
                  Today, we're proud to serve entrepreneurs from around the world, helping them 
                  establish successful businesses in 19+ countries with unprecedented speed and transparency.
                </p>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Global business consulting"
                className="rounded-xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -right-6 bg-white rounded-xl p-6 shadow-xl">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">2016</div>
                  <div className="text-sm text-gray-600">Founded</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Values</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} hover className="text-center h-full">
                <Card.Body className="py-8">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <value.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{value.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{value.description}</p>
                </Card.Body>
              </Card>
            ))}
          </div>
        </section>

        {/* Timeline */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Journey</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Key milestones in our mission to revolutionize international business consulting
            </p>
          </div>
          
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-blue-500 to-teal-500 rounded-full hidden lg:block"></div>
            
            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <div 
                  key={index}
                  className={`flex items-center ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} flex-col lg:space-x-8`}
                >
                  <div className={`flex-1 ${index % 2 === 0 ? 'lg:text-right' : 'lg:text-left'} text-center lg:mb-0 mb-6`}>
                    <Card className="inline-block group hover:shadow-xl transition-all duration-300">
                      <Card.Body className="py-6 px-8">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{milestone.title}</h3>
                        <p className="text-gray-600">{milestone.description}</p>
                      </Card.Body>
                    </Card>
                  </div>
                  
                  <div className="relative z-10 w-16 h-16 bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-full flex items-center justify-center font-bold shadow-xl">
                    {milestone.year}
                  </div>
                  
                  <div className="flex-1 hidden lg:block"></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Technology */}
        <section className="mb-20">
          <Card className="bg-gradient-to-r from-gray-900 to-gray-800 text-white">
            <Card.Body className="py-16 text-center">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl font-bold mb-6">Powered by AI Oracle Technology</h2>
                <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                  Our proprietary AI Oracle assistant provides instant, multilingual support and 
                  intelligent recommendations, making international business consulting accessible to everyone.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Zap className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-lg font-bold mb-2">Instant Analysis</h3>
                    <p className="text-gray-400">AI-powered jurisdiction recommendations in seconds</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Globe className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-lg font-bold mb-2">20+ Languages</h3>
                    <p className="text-gray-400">Communicate in your native language</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Target className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-lg font-bold mb-2">Personalized</h3>
                    <p className="text-gray-400">Tailored recommendations for your specific needs</p>
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

export default AboutPage;