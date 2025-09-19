import React from 'react';
import { Calendar, User, ArrowRight, Search, Tag } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { useLanguage } from '../lib/language';
import { Button, Card } from '../lib/ui';
import { AIAgentIcon } from '@consulting19/shared';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const BlogPage = () => {
  const { t } = useLanguage();

  const blogPosts = [
    {
      id: 1,
      title: 'Complete Guide to Estonian e-Residency for Digital Nomads',
      excerpt: 'Everything you need to know about Estonia\'s digital residency program and how it can benefit your international business.',
      author: 'Giorgi Meskhi',
      date: '2025-01-15',
      category: 'Digital Nomad',
      readTime: '8 min read',
      image: 'https://images.pexels.com/photos/4386321/pexels-photo-4386321.jpeg?auto=compress&cs=tinysrgb&w=800',
      featured: true,
    },
    {
      id: 2,
      title: 'UAE vs Singapore: Which is Better for Your Tech Startup?',
      excerpt: 'A comprehensive comparison of two leading business hubs for technology companies looking to expand internationally.',
      author: 'Ahmed Al-Rashid',
      date: '2025-01-12',
      category: 'Company Formation',
      readTime: '12 min read',
      image: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=800',
      featured: false,
    },
    {
      id: 3,
      title: 'Tax Optimization Strategies for International Businesses',
      excerpt: 'Learn about legal tax optimization techniques that can significantly reduce your global tax burden.',
      author: 'Maria Silva',
      date: '2025-01-10',
      category: 'Tax Planning',
      readTime: '10 min read',
      image: 'https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg?auto=compress&cs=tinysrgb&w=800',
      featured: false,
    },
    {
      id: 4,
      title: 'Banking Solutions for Global Entrepreneurs',
      excerpt: 'Navigate the complex world of international banking with our expert guide to multi-currency accounts.',
      author: 'Hans Mueller',
      date: '2025-01-08',
      category: 'Banking',
      readTime: '6 min read',
      image: 'https://images.pexels.com/photos/259027/pexels-photo-259027.jpeg?auto=compress&cs=tinysrgb&w=800',
      featured: false,
    },
    {
      id: 5,
      title: 'Legal Compliance Checklist for International Expansion',
      excerpt: 'Essential legal requirements and compliance considerations when expanding your business globally.',
      author: 'Sarah Johnson',
      date: '2025-01-05',
      category: 'Legal',
      readTime: '15 min read',
      image: 'https://images.pexels.com/photos/5668858/pexels-photo-5668858.jpeg?auto=compress&cs=tinysrgb&w=800',
      featured: false,
    },
    {
      id: 6,
      title: 'Crypto Business Setup: Best Jurisdictions in 2025',
      excerpt: 'Discover the most crypto-friendly jurisdictions and how to establish your blockchain business legally.',
      author: 'Alex Thompson',
      date: '2025-01-03',
      category: 'Crypto',
      readTime: '9 min read',
      image: 'https://images.pexels.com/photos/8369648/pexels-photo-8369648.jpeg?auto=compress&cs=tinysrgb&w=800',
      featured: false,
    },
  ];

  const categories = [
    'All Posts',
    'Company Formation',
    'Tax Planning',
    'Banking',
    'Legal',
    'Digital Nomad',
    'Crypto',
  ];

  const [selectedCategory, setSelectedCategory] = React.useState('All Posts');
  const [searchTerm, setSearchTerm] = React.useState('');

  const filteredPosts = blogPosts.filter(post => {
    const matchesCategory = selectedCategory === 'All Posts' || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredPost = blogPosts.find(post => post.featured);
  const regularPosts = filteredPosts; // Show all posts in grid, no featured post

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Blog - Consulting19</title>
        <meta name="description" content="Expert insights on international business expansion, tax optimization, and global compliance from Consulting19's network of advisors." />
      </Helmet>

      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-teal-600 text-white py-20 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Expert Insights & Guides
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Stay informed with the latest trends, strategies, and insights for international business expansion.
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Search and Filters */}
        <div className="mb-12">
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {regularPosts.map((post) => (
            <Card key={post.id} hover className="overflow-hidden">
              <div className="aspect-w-16 aspect-h-9">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-40 object-cover"
                />
              </div>
              
              <Card.Body>
                <div className="flex items-center space-x-2 mb-3">
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                    {post.category}
                  </span>
                  <span className="text-xs text-gray-500">{post.readTime}</span>
                  <span className="text-xs text-gray-500">{post.readTime}</span>
                </div>
                
                <h3 className="text-base font-semibold text-gray-900 mb-2 line-clamp-2">
                  {post.title}
                </h3>
                
                <p className="text-gray-600 text-xs mb-3 line-clamp-2">
                  {post.excerpt}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1 text-xs text-gray-500">
                    <div className="flex items-center">
                      <User className="w-3 h-3 mr-1" />
                      <span>{post.author}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      <span>{new Date(post.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <Button variant="outline" size="sm" icon={ArrowRight} iconPosition="right">
                    Read More
                  </Button>
                </div>
              </Card.Body>
            </Card>
          ))}
        </div>

        {/* No Results */}
        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No articles found
            </h3>
            <p className="text-gray-600">
              Try adjusting your search terms or browse different categories.
            </p>
          </div>
        )}

        {/* Newsletter Signup */}
        <Card className="mt-16 bg-gradient-to-r from-blue-600 to-teal-600 text-white">
          <Card.Body className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">Stay Updated</h2>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Get the latest insights on international business expansion delivered to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-300 focus:outline-none"
              />
              <Button className="bg-orange-500 text-white hover:bg-orange-600 font-semibold">
                Subscribe
              </Button>
            </div>
          </Card.Body>
        </Card>
      </div>

      <Footer />
      
      {/* AI Agent Icon */}
      <AIAgentIcon />
    </div>
  );
};

export default BlogPage;