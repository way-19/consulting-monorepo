import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Globe, ChevronDown, Zap, Bell, User, ArrowRight, Clock } from 'lucide-react';
import { useLanguage } from '../lib/language';
import { Button } from '../lib/ui';
import { AIAgentIcon } from '@consulting19/shared';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileCountriesOpen, setMobileCountriesOpen] = useState(false);
  const { t, language, setLanguage } = useLanguage();
  const location = useLocation();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
    setActiveDropdown(null);
  }, [location]);

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
    { code: 'pt', name: 'Português', flag: '🇵🇹' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
  ];

  const currentLang = languages.find(lang => lang.code === language);

  const navigationItems = [
    { name: t('home'), href: '/', hasDropdown: false },
    { name: t('services'), href: '/services', hasDropdown: false },
    { name: t('countries'), href: '/countries', hasDropdown: true },
    { name: t('blog'), href: '/blog', hasDropdown: false },
    { name: t('contact'), href: '/contact', hasDropdown: false },
    { name: t('about'), href: '/about', hasDropdown: false },
  ];

  const countries = [
    { code: 'georgia', name: 'Georgia', flag: '🇬🇪', available: true },
    { code: 'usa', name: 'United States', flag: '🇺🇸', available: false },
    { code: 'uae', name: 'United Arab Emirates', flag: '🇦🇪', available: false },
    { code: 'estonia', name: 'Estonia', flag: '🇪🇪', available: false },
    { code: 'malta', name: 'Malta', flag: '🇲🇹', available: false },
    { code: 'portugal', name: 'Portugal', flag: '🇵🇹', available: false },
  ];

  const isActivePage = (href: string) => {
    if (href === '/') return location.pathname === '/';
    return location.pathname.startsWith(href);
  };

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100' 
          : 'bg-white/90 backdrop-blur-sm'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 via-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                  <span className="text-white font-bold text-sm">C19</span>
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
              </div>
              <div className="hidden sm:block">
                <span className="text-xl font-bold bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Consulting19
                </span>
                <div className="flex items-center space-x-1 mt-0.5">
                  <Zap className="w-3 h-3 text-emerald-500" />
                  <span className="text-xs text-emerald-600 font-medium">AI-Powered</span>
                </div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {navigationItems.map((item) => (
                <div key={item.name} className="relative">
                  {item.hasDropdown && item.name === 'Countries' ? (
                    <div className="relative">
                      <button
                        onClick={() => setActiveDropdown(activeDropdown === 'countries' ? null : 'countries')}
                        className={`relative px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 group flex items-center space-x-1 ${
                          location.pathname.startsWith('/countries')
                            ? 'text-emerald-600 bg-gradient-to-r from-emerald-50 to-blue-50 shadow-sm'
                            : 'text-gray-700 hover:text-emerald-600 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-blue-50 hover:shadow-sm'
                        }`}
                      >
                        <span className="relative z-10">{item.name}</span>
                        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${
                          activeDropdown === 'countries' ? 'rotate-180' : ''
                        }`} />
                        {location.pathname.startsWith('/countries') && (
                          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-emerald-500 rounded-full"></div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-50 via-blue-50 to-purple-50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </button>
                      
                      {activeDropdown === 'countries' && (
                        <div className="absolute left-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-gray-100 z-[70] overflow-hidden animate-in slide-in-from-top-2 duration-200">
                          <div className="p-1">
                              <div className="px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-100 mb-2">
                                🚀 More countries coming soon...
                              </div>
                              {countries.map((country) => (
                                <Link
                                  key={country.code}
                                  to={`/countries/${country.code}`}
                                  className={`w-full text-left px-3 py-2 rounded-lg transition-all duration-200 flex items-center space-x-3 group ${
                                    country.available 
                                      ? 'text-gray-700 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-blue-50 hover:text-emerald-700'
                                      : 'text-gray-500 hover:bg-gradient-to-r hover:from-orange-50 hover:to-yellow-50 hover:text-orange-700'
                                  }`}
                                  onClick={() => setActiveDropdown(null)}
                                >
                                  <span className="text-2xl group-hover:scale-110 transition-transform duration-200">
                                    {country.flag}
                                  </span>
                                  <div className="flex-1">
                                    <span className="font-medium">{country.name}</span>
                                    {!country.available && (
                                      <div className="text-xs text-orange-600 font-medium">Coming Soon</div>
                                    )}
                                  </div>
                                  {country.available && (
                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                  )}
                                </Link>
                              ))}
                              <div className="border-t border-gray-100 mt-1 pt-1">
                                <Link
                                  to="/countries"
                                  className="w-full text-left px-3 py-2 rounded-lg transition-all duration-200 flex items-center space-x-3 group text-blue-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-blue-700 font-medium"
                                  onClick={() => setActiveDropdown(null)}
                                >
                                  <Globe className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                                  <span>View All 19+ Countries</span>
                                </Link>
                              </div>
                            </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      to={item.href}
                      className={`relative px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 group ${
                        isActivePage(item.href)
                          ? 'text-emerald-600 bg-gradient-to-r from-emerald-50 to-blue-50 shadow-sm'
                          : 'text-gray-700 hover:text-emerald-600 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-blue-50 hover:shadow-sm'
                      }`}
                    >
                      <span className="relative z-10">{item.name}</span>
                      {isActivePage(item.href) && (
                        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-emerald-500 rounded-full"></div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-r from-emerald-50 via-blue-50 to-purple-50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </Link>
                  )}
                </div>
              ))}
              <Link 
                to="/order-form" 
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
              >
                Start Company
              </Link>
            </div>

            {/* Right Side Actions */}
            <div className="hidden lg:flex items-center space-x-4">
              {/* Language Selector */}
              <div className="relative">
                <button 
                  onClick={() => setActiveDropdown(activeDropdown === 'language' ? null : 'language')}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-700 hover:text-emerald-600 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-blue-50 transition-all duration-300 group"
                >
                  <Globe className="w-4 h-4 group-hover:rotate-12 transition-transform duration-200" />
                  <span className="text-lg">{currentLang?.flag}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${
                    activeDropdown === 'language' ? 'rotate-180' : ''
                  }`} />
                </button>
                
                {activeDropdown === 'language' && (
                  <div className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-xl border border-gray-100 z-[70] overflow-hidden animate-in slide-in-from-top-2 duration-200">
                    <div className="py-0.5">
                        {languages.map((lang) => (
                          <button
                            key={lang.code}
                            onClick={() => {
                              setLanguage(lang.code as any);
                              setActiveDropdown(null);
                            }}
                            className={`w-full text-left px-3 py-2 rounded-lg transition-all duration-200 flex items-center space-x-3 group ${
                              language === lang.code 
                                ? 'bg-gradient-to-r from-emerald-50 via-blue-50 to-purple-50 text-emerald-700 shadow-sm' 
                                : 'text-gray-700 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-blue-50'
                            }`}
                          >
                            <span className="text-xl group-hover:scale-110 transition-transform duration-200">
                              {lang.flag}
                            </span>
                            <span className="font-medium">{lang.name}</span>
                            {language === lang.code && (
                              <div className="ml-auto w-2 h-2 bg-emerald-500 rounded-full"></div>
                            )}
                          </button>
                        ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Notification Bell */}

              {/* Auth Buttons */}
              <div className="flex items-center space-x-3">
                <Link to="/auth">
                  <Button 
                    variant="ghost" 
                    className="text-gray-700 hover:text-emerald-600 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-blue-50 transition-all duration-300"
                  >
                    {t('login')}
                  </Button>
                </Link>
                <Link to="/auth?mode=register">
                  <Button className="bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-600 hover:from-emerald-600 hover:via-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                    {t('register')}
                  </Button>
                </Link>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="lg:hidden flex items-center space-x-3">
              {/* Mobile notification */}
              
              <button
                onClick={() => {
                  setIsOpen(!isOpen);
                  setMobileCountriesOpen(false);
                }}
                className="p-2 text-gray-700 hover:text-emerald-600 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-blue-50 rounded-lg transition-all duration-300"
              >
                <div className="relative w-6 h-6">
                  <span className={`absolute block h-0.5 w-6 bg-current transform transition-all duration-300 ${
                    isOpen ? 'rotate-45 translate-y-0' : '-translate-y-2'
                  }`} />
                  <span className={`absolute block h-0.5 w-6 bg-current transform transition-all duration-300 ${
                    isOpen ? 'opacity-0' : 'opacity-100'
                  }`} />
                  <span className={`absolute block h-0.5 w-6 bg-current transform transition-all duration-300 ${
                    isOpen ? '-rotate-45 translate-y-0' : 'translate-y-2'
                  }`} />
                </div>
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className={`lg:hidden transition-all duration-300 ease-in-out ${
            isOpen 
              ? 'max-h-screen opacity-100 pb-6' 
              : 'max-h-0 opacity-0 overflow-hidden'
          }`}>
            <div className="px-2 pt-4 space-y-2 max-h-[calc(100vh-4rem)] overflow-y-auto">
              {navigationItems.map((item) => (
                <div key={item.name}>
                  {item.hasDropdown && item.name === 'Countries' ? (
                    <div>
                      <button
                        onClick={() => setMobileCountriesOpen(!mobileCountriesOpen)}
                        className="w-full flex items-center justify-between px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md"
                      >
                        <span>Countries</span>
                        <ChevronDown className={`w-4 h-4 transition-transform ${mobileCountriesOpen ? 'rotate-180' : ''}`} />
                      </button>
                      {mobileCountriesOpen && (
                        <div className="ml-4 mt-2 space-y-1">
                          {countries.map((country) => (
                            <Link
                              key={country.code}
                              to={`/countries/${country.code}`}
                              onClick={() => setIsOpen(false)}
                              className="block px-6 py-3 rounded-lg font-medium transition-all duration-200 text-gray-700 hover:text-emerald-600 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-blue-50"
                            >
                              <div className="flex items-center space-x-3">
                                <span className="text-xl">{country.flag}</span>
                                <span>{country.name}</span>
                              </div>
                            </Link>
                          ))}
                        </div>
                      )}
                      <div className="border-t border-gray-100 mt-2 pt-2">
                        <Link
                          to="/countries"
                          onClick={() => setIsOpen(false)}
                          className="w-full text-left px-4 py-3 rounded-lg transition-all duration-200 flex items-center space-x-3 group text-blue-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-blue-700 font-medium"
                        >
                          <Globe className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                          <span>View All Countries</span>
                          <ArrowRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <Link
                      to={item.href}
                      className={`block px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                        isActivePage(item.href)
                          ? 'text-emerald-600 bg-gradient-to-r from-emerald-50 to-blue-50 shadow-sm'
                          : 'text-gray-700 hover:text-emerald-600 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-blue-50'
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      <div className="flex items-center justify-between">
                        <span>{item.name}</span>
                        {isActivePage(item.href) && (
                          <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                        )}
                      </div>
                    </Link>
                  )}
                </div>
              ))}
              
              {/* Countries dropdown for mobile */}
              <div className="px-3 py-2 border-b border-gray-100">
                <div 
                  className="flex items-center justify-between text-gray-700 hover:text-blue-600 cursor-pointer"
                  onClick={() => setMobileCountriesOpen(!mobileCountriesOpen)}
                >
                  <Globe className="w-4 h-4 mr-2" />
                  <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">Countries</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${mobileCountriesOpen ? 'rotate-180' : ''}`} />
                </div>
                {mobileCountriesOpen && (
                  <div className="mt-2 space-y-1">
                    {countries.map((country) => (
                      <Link
                        key={country.code}
                        to={`/countries/${country.code}`}
                        className="block px-4 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded"
                        onClick={() => setIsOpen(false)}
                      >
                        <div className="flex items-center space-x-2">
                          <span>{country.flag}</span>
                          <span>{country.name}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Start Company button for mobile */}
              <div className="px-3 py-2">
                <Link
                  to="/order"
                  className="block w-full bg-red-600 hover:bg-red-700 text-white text-center py-3 px-4 rounded-lg font-semibold transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Start Company
                </Link>
              </div>
              
              {/* Mobile Language Selector */}
              <div className="pt-4 border-t border-gray-200">
                <div className="px-4 py-1 text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Language
                </div>
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setLanguage(lang.code as any);
                      setIsOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 rounded-lg transition-all duration-200 flex items-center space-x-3 ${
                      language === lang.code
                        ? 'bg-gradient-to-r from-emerald-50 to-blue-50 text-emerald-700'
                        : 'text-gray-700 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-blue-50'
                    }`}
                  >
                    <span className="text-xl">{lang.flag}</span>
                    <span className="font-medium">{lang.name}</span>
                    {language === lang.code && (
                      <div className="ml-auto w-2 h-2 bg-emerald-500 rounded-full"></div>
                    )}
                  </button>
                ))}
              </div>

              {/* Mobile Auth Buttons */}
              <div className="pt-4 border-t border-gray-200 space-y-3">
                <Link to="/auth" onClick={() => setIsOpen(false)}>
                  <Button variant="outline" className="w-full justify-center">
                    {t('login')}
                  </Button>
                </Link>
                <Link to="/auth?mode=register" onClick={() => setIsOpen(false)}>
                  <Button className="w-full justify-center bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-600 hover:from-emerald-600 hover:via-blue-600 hover:to-purple-700">
                    {t('register')}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

      </nav>

      {/* Global backdrop for all dropdowns */}
      {activeDropdown && (
        <div 
          className="fixed inset-0 z-[100] bg-transparent cursor-pointer" 
          onClick={() => setActiveDropdown(null)}
        />
      )}

      {/* Backdrop for mobile menu */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-[90] lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <style>{`
        @keyframes slide-in-from-top {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-in {
          animation: slide-in-from-top 0.2s ease-out;
        }
        
        .slide-in-from-top-2 {
          animation: slide-in-from-top 0.2s ease-out;
        }

        /* Gradient text animation */
        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient-shift 3s ease infinite;
        }
      `}</style>
      
      {/* AI Agent Icon - appears on all pages */}
      <AIAgentIcon />
    </>
  );
};

export default Navbar;