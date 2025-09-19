import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, User, Eye, ArrowLeft, Tag, Share2, Clock } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { useLanguage } from '../lib/language';
import { supabase } from '../lib/supabase';
import { Button, Card } from '../lib/ui';
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
  published_at: string;
  view_count: number;
  seo_title: string;
  seo_description: string;
  author: {
    full_name: string;
    company: string;
    avatar_url: string;
  };
  country: {
    name: string;
    flag_emoji: string;
  } | null;
}

const BlogPostPage = () => {
  const { slug } = useParams();
  const { t } = useLanguage();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (slug) {
      fetchPost();
    }
  }, [slug]);

  const fetchPost = async () => {
    if (!slug) return;

    try {
      setLoading(true);
      setError(null);

      // Fetch the blog post
      const { data: postData, error: postError } = await supabase
        .from('blog_posts')
        .select(`
          *,
          author:user_profiles!blog_posts_author_id_fkey(full_name, company, avatar_url),
          country:countries(name, flag_emoji)
        `)
        .eq('slug', slug)
        .eq('is_published', true)
        .single();

      if (postError) {
        console.error('Error fetching post:', postError);
        setError('Post not found');
        return;
      }

      setPost(postData);

      // Increment view count
      await supabase.rpc('increment_blog_post_views', { post_slug: slug });

      // Fetch related posts
      const { data: relatedData } = await supabase
        .from('blog_posts')
        .select(`
          *,
          author:user_profiles!blog_posts_author_id_fkey(full_name, company),
          country:countries(name, flag_emoji)
        `)
        .eq('is_published', true)
        .neq('id', postData.id)
        .or(`category.eq.${postData.category},country_code.eq.${postData.country_code}`)
        .order('published_at', { ascending: false })
        .limit(3);

      setRelatedPosts(relatedData || []);

    } catch (err) {
      console.error('Unexpected error:', err);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const getLocalizedContent = (content: any, field: string, fallback: string = '') => {
    if (!content || typeof content !== 'object') return fallback;
    return content.en || content.tr || content.pt || fallback;
  };

  const sharePost = () => {
    if (navigator.share) {
      navigator.share({
        title: post?.seo_title || getLocalizedContent(post?.title_i18n, 'title'),
        text: post?.seo_description || getLocalizedContent(post?.excerpt_i18n, 'excerpt'),
        url: window.location.href,
      });
    } else {
      // Fallback to copying URL
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-64 bg-gray-200 rounded-lg"></div>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-4 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Post Not Found</h1>
          <p className="text-gray-600 mb-6">The blog post you're looking for doesn't exist or has been removed.</p>
          <Link to="/blog">
            <Button icon={ArrowLeft} iconPosition="left">
              Back to Blog
            </Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>{post.seo_title || getLocalizedContent(post.title_i18n, 'title')} - Consulting19</title>
        <meta name="description" content={post.seo_description || getLocalizedContent(post.excerpt_i18n, 'excerpt')} />
        <meta property="og:title" content={getLocalizedContent(post.title_i18n, 'title')} />
        <meta property="og:description" content={getLocalizedContent(post.excerpt_i18n, 'excerpt')} />
        <meta property="og:image" content={post.featured_image_url} />
      </Helmet>

      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Back Button */}
        <div className="mb-8">
          <Link to="/blog">
            <Button variant="outline" icon={ArrowLeft} iconPosition="left">
              Back to Blog
            </Button>
          </Link>
        </div>

        {/* Article Header */}
        <article>
          <header className="mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                {post.category}
              </span>
              {post.country && (
                <span className="text-sm text-gray-600">
                  {post.country.flag_emoji} {post.country.name}
                </span>
              )}
            </div>
            
            <h1 className="text-4xl font-bold text-gray-900 mb-6 leading-tight">
              {getLocalizedContent(post.title_i18n, 'title')}
            </h1>
            
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-6 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <img
                    src={post.author.avatar_url || 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100'}
                    alt={post.author.full_name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-medium text-gray-900">{post.author.full_name}</p>
                    <p className="text-xs text-gray-500">{post.author.company}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  <span>{new Date(post.published_at).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center">
                  <Eye className="w-4 h-4 mr-1" />
                  <span>{post.view_count} views</span>
                </div>
              </div>
              
              <Button variant="outline" size="sm" icon={Share2} onClick={sharePost}>
                Share
              </Button>
            </div>

            {/* Featured Image */}
            {post.featured_image_url && (
              <img
                src={post.featured_image_url}
                alt={getLocalizedContent(post.title_i18n, 'title')}
                className="w-full h-64 md:h-80 object-cover rounded-xl shadow-lg mb-8"
              />
            )}
          </header>

          {/* Article Content */}
          <div className="prose prose-lg max-w-none mb-12">
            <div 
              dangerouslySetInnerHTML={{ 
                __html: getLocalizedContent(post.content_i18n, 'content', 'Content not available')
                  .replace(/\n/g, '<br>')
              }} 
            />
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag, index) => (
                  <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Author Bio */}
          <Card className="mb-12">
            <Card.Body>
              <div className="flex items-center space-x-4">
                <img
                  src={post.author.avatar_url || 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100'}
                  alt={post.author.full_name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{post.author.full_name}</h3>
                  <p className="text-gray-600">{post.author.company}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Expert consultant specializing in {post.country?.name || 'international'} business services
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  View Profile
                </Button>
              </div>
            </Card.Body>
          </Card>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-8">Related Articles</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedPosts.map((relatedPost) => (
                  <Card key={relatedPost.id} hover>
                    <div className="aspect-w-16 aspect-h-9">
                      <img
                        src={relatedPost.featured_image_url || 'https://images.pexels.com/photos/4386321/pexels-photo-4386321.jpeg?auto=compress&cs=tinysrgb&w=800'}
                        alt={getLocalizedContent(relatedPost.title_i18n, 'title')}
                        className="w-full h-32 object-cover"
                      />
                    </div>
                    
                    <Card.Body>
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                          {relatedPost.category}
                        </span>
                      </div>
                      
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                        {getLocalizedContent(relatedPost.title_i18n, 'title')}
                      </h3>
                      
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {getLocalizedContent(relatedPost.excerpt_i18n, 'excerpt')}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 text-xs text-gray-500">
                          <span>{relatedPost.author?.full_name}</span>
                          <span>•</span>
                          <span>{new Date(relatedPost.published_at).toLocaleDateString()}</span>
                        </div>
                        
                        <Link to={`/blog/${relatedPost.slug}`}>
                          <Button variant="outline" size="sm">
                            Read
                          </Button>
                        </Link>
                      </div>
                    </Card.Body>
                  </Card>
                ))}
              </div>
            </section>
          )}
        </article>
      </div>

      <Footer />
    </div>
  );
};

export default BlogPostPage;