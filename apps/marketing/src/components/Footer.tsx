import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, MapPin, Linkedin, Facebook, Instagram, Twitter } from 'lucide-react';
import { useLanguage } from '../lib/language';

const Footer = () => {
  const { t } = useLanguage();

  const footerLinks = [
    {
      title: 'Platform',
      links: [
        { name: t('services'), href: '/services' },
        { name: t('countries'), href: '/countries' },
        { name: 'AI Assistant', href: '/ai-experience' },
      ],
    },
    {
      title: 'Company',
      links: [
        { name: t('about'), href: '/about' },
        { name: t('blog'), href: '/blog' },
        { name: 'Sitemap', href: '/sitemap' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { name: 'Privacy Policy', href: '/privacy' },
        { name: 'Terms of Service', href: '/terms' },
        { name: 'Cookie Policy', href: '/cookies' },
      ],
    },
  ];

  const socialLinks = [
    { name: 'LinkedIn', icon: Linkedin, href: 'https://linkedin.com/company/consulting19', color: 'hover:text-blue-600' },
    { name: 'Facebook', icon: Facebook, href: 'https://facebook.com/consulting19', color: 'hover:text-blue-600' },
    { name: 'Instagram', icon: Instagram, href: 'https://instagram.com/consulting19', color: 'hover:text-pink-600' },
    { name: 'Twitter', icon: Twitter, href: 'https://twitter.com/consulting19', color: 'hover:text-blue-400' },
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-teal-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">C19</span>
              </div>
              <span className="text-xl font-bold">Consulting19</span>
            </Link>
            <p className="text-gray-300 mb-6 leading-relaxed text-sm">
              AI-powered global business consulting platform connecting entrepreneurs
              with expert advisors in 19+ countries for seamless international expansion.
            </p>

            <div className="space-y-2 mb-6">
              <div className="flex items-center space-x-3">
                <Mail size={14} className="text-blue-400" />
                <span className="text-gray-300 text-sm">support@consulting19.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin size={14} className="text-blue-400" />
                <span className="text-gray-300 text-sm">Global Operations Center</span>
              </div>
            </div>
          </div>

          {/* Footer Links (Platform, Company, Legal) */}
          {footerLinks.map((section, index) => (
            <div key={index}>
              <h3 className="text-white font-semibold mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-gray-300 hover:text-white transition-colors text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
                {section.title === 'Legal' && ( // Place social icons under Legal
                  <li className="mt-6">
                    <h3 className="text-white font-semibold mb-3 text-sm">Follow Us</h3>
                    <div className="flex space-x-3">
                      {socialLinks.map((social) => {
                        const Icon = social.icon;
                        return (
                          <a
                            key={social.name}
                            href={social.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`p-2.5 bg-gray-800 rounded-lg transition-colors ${social.color}`} // Increased padding for 20% size increase
                            aria-label={social.name}
                          >
                            <Icon size={19} /> {/* Increased size by 20% (16 * 1.2 = 19.2, rounded to 19) */}
                          </a>
                        );
                      })}
                    </div>
                  </li>
                )}
              </ul>
            </div>
          ))}
        </div>
        {/* Copyright */}
        <div className="border-t border-gray-800 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Trustpilot Review */}
            <div>
              <a 
                href="https://www.trustpilot.com/review/consulting19.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-block bg-white rounded-lg p-3 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center space-x-2">
                  <span className="text-green-600 font-bold text-sm">★</span>
                  <span className="text-gray-900 text-xs font-medium">Review us on</span>
                  <span className="text-green-600 font-bold text-sm">Trustpilot</span>
                </div>
              </a>
            </div>
            <div className="text-center md:text-right">
              <p className="text-gray-400 text-sm">
                {t('copyright')}
              </p>
              <p className="text-gray-500 text-xs mt-1">
                {t('powered')}.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
export default Footer;