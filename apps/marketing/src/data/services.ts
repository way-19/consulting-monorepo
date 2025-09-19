import { Service } from '../types/order';

export const services: Service[] = [
  {
    id: 'web-development',
    name: 'Web Development',
    description: 'Modern, responsive web applications built with latest technologies',
    price: 5000,
    duration: '4-8 weeks',
    features: [
      'Responsive Design',
      'Modern Framework (React/Vue)',
      'SEO Optimization',
      'Performance Optimization',
      'Cross-browser Compatibility'
    ]
  },
  {
    id: 'mobile-app',
    name: 'Mobile App Development',
    description: 'Native and cross-platform mobile applications',
    price: 8000,
    duration: '6-12 weeks',
    features: [
      'iOS & Android Support',
      'Native Performance',
      'Push Notifications',
      'Offline Functionality',
      'App Store Deployment'
    ]
  },
  {
    id: 'ecommerce',
    name: 'E-commerce Solution',
    description: 'Complete online store with payment integration',
    price: 7000,
    duration: '6-10 weeks',
    features: [
      'Payment Gateway Integration',
      'Inventory Management',
      'Order Management',
      'Customer Dashboard',
      'Analytics & Reporting'
    ]
  },
  {
    id: 'consulting',
    name: 'Technical Consulting',
    description: 'Expert guidance for your technical challenges',
    price: 2000,
    duration: '2-4 weeks',
    features: [
      'Architecture Review',
      'Technology Stack Advice',
      'Performance Audit',
      'Security Assessment',
      'Best Practices Guide'
    ]
  },
  {
    id: 'maintenance',
    name: 'Maintenance & Support',
    description: 'Ongoing support and maintenance for your applications',
    price: 1500,
    duration: 'Monthly',
    features: [
      'Bug Fixes',
      'Security Updates',
      'Performance Monitoring',
      'Feature Updates',
      '24/7 Support'
    ]
  },
  {
    id: 'custom',
    name: 'Custom Solution',
    description: 'Tailored solution for your specific needs',
    price: 0,
    duration: 'Variable',
    features: [
      'Custom Requirements',
      'Flexible Timeline',
      'Dedicated Team',
      'Regular Updates',
      'Full Documentation'
    ]
  }
];