import React from 'react';
import { Routes, Route, NavLink, Navigate } from 'react-router-dom';
import { 
  Home, List, Grid, HelpCircle, FileText, Image as ImageIcon, Settings 
} from 'lucide-react';
import HeroSection from './cms/HeroSection';
import ServicesList from './cms/ServicesList';
import ServiceEdit from './cms/ServiceEdit';
import FeaturesList from './cms/FeaturesList';
import GeneralFAQ from './cms/GeneralFAQ';
import BlogList from './cms/BlogList';
import BlogEdit from './cms/BlogEdit';
import MediaLibrary from './cms/MediaLibrary';
import SEOSettings from './cms/SEOSettings';

const ContentManagement = () => {
  const navItems = [
    { path: '/content/hero', label: 'Hero Section', icon: Home },
    { path: '/content/services', label: 'Services', icon: List },
    { path: '/content/features', label: 'Features', icon: Grid },
    { path: '/content/faq', label: 'General FAQ', icon: HelpCircle },
    { path: '/content/blog', label: 'Blog/News', icon: FileText },
    { path: '/content/media', label: 'Media Library', icon: ImageIcon },
    { path: '/content/seo', label: 'SEO Settings', icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Content Management</h2>
          <p className="text-sm text-gray-600 mt-1">Manage your country page</p>
        </div>
        
        <nav className="flex-1 p-4">
          <div className="space-y-1">
            {navItems.map(item => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => 
                  `flex items-center px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`
                }
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.label}
              </NavLink>
            ))}
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <Routes>
          <Route index element={<Navigate to="/content/hero" replace />} />
          <Route path="hero" element={<HeroSection />} />
          <Route path="services" element={<ServicesList />} />
          <Route path="services/:id/edit" element={<ServiceEdit />} />
          <Route path="features" element={<FeaturesList />} />
          <Route path="faq" element={<GeneralFAQ />} />
          <Route path="blog" element={<BlogList />} />
          <Route path="blog/new" element={<BlogEdit />} />
          <Route path="blog/:id/edit" element={<BlogEdit />} />
          <Route path="media" element={<MediaLibrary />} />
          <Route path="seo" element={<SEOSettings />} />
        </Routes>
      </div>
    </div>
  );
};

export default ContentManagement;
