import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { LanguageProvider } from './lib/language';
import { AuthProvider } from '@consulting19/shared';
import HomePage from './pages/HomePage';
import CountriesPage from './pages/CountriesPage';
import ServicesPage from './pages/ServicesPage';
// import ConsultantProfilePage from './pages/ConsultantProfilePage'; // Temporarily disabled - needs fixing
import AuthPage from './pages/AuthPage';
import BlogPage from './pages/BlogPage';
import BlogPostPage from './pages/BlogPostPage';
import ContactPage from './pages/ContactPage';
import CountryPage from './pages/CountryPage';
import AICountryRecommendationsPage from './pages/AICountryRecommendationsPage';
import GeorgianLLCFormationPage from './pages/services/GeorgianLLCFormationPage';
import GeorgianIBCPage from './pages/services/GeorgianIBCPage';
import GeorgianTaxResidencyPage from './pages/services/GeorgianTaxResidencyPage';
import GeorgianBankingPage from './pages/services/GeorgianBankingPage';
import GeorgianVisaPage from './pages/services/GeorgianVisaPage';
import GeorgianIEStatusPage from './pages/services/GeorgianIEStatusPage';
import CompanyFormationPage from './pages/services/CompanyFormationPage';
import TaxOptimizationPage from './pages/services/TaxOptimizationPage';
import BankingSolutionsPage from './pages/services/BankingSolutionsPage';
import LegalCompliancePage from './pages/services/LegalCompliancePage';
import AssetProtectionPage from './pages/services/AssetProtectionPage';
import InvestmentAdvisoryPage from './pages/services/InvestmentAdvisoryPage';
import VisaResidencyPage from './pages/services/VisaResidencyPage';
import MarketResearchPage from './pages/services/MarketResearchPage';
import ComingSoonCountryPage from './pages/ComingSoonCountryPage';
import AIExperiencePage from './pages/AIExperiencePage';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';
import CookiePolicyPage from './pages/CookiePolicyPage';
import AboutPage from './pages/AboutPage';
import SitemapPage from './pages/SitemapPage';
import CompanyFormationWizard from './pages/CompanyFormationWizard';
import PaymentSuccess from './pages/PaymentSuccess';

// Lazy load other apps to prevent circular dependencies
const ClientApp = React.lazy(() => import('../../client/src/App'));
const ConsultantApp = React.lazy(() => import('../../consultant/src/App'));
const AdminApp = React.lazy(() => import('../../admin/src/App'));

function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <LanguageProvider>
          <Router
            future={{
              v7_startTransition: true,
              v7_relativeSplatPath: true,
            }}
          >
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/countries" element={<CountriesPage />} />
              <Route path="/countries/:countryCode" element={<CountryPage />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/blog/:slug" element={<BlogPostPage />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/blog/:slug" element={<BlogPostPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/ai-recommendations" element={<AICountryRecommendationsPage />} />
              <Route path="/ai-experience" element={<AIExperiencePage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/cookies" element={<CookiePolicyPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/sitemap" element={<SitemapPage />} />
              {/* <Route path="/consultant/:consultantId" element={<ConsultantProfilePage />} /> */}
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/order-form" element={<CompanyFormationWizard />} />
              <Route path="/payment-success" element={<PaymentSuccess />} />
              
              {/* Georgian Service Pages */}
              <Route path="/services/georgia/llc-formation" element={<GeorgianLLCFormationPage />} />
              <Route path="/services/georgia/international-business-company" element={<GeorgianIBCPage />} />
              <Route path="/services/georgia/tax-residency" element={<GeorgianTaxResidencyPage />} />
              <Route path="/services/georgia/banking-solutions" element={<GeorgianBankingPage />} />
              <Route path="/services/georgia/visa-residence-permit" element={<GeorgianVisaPage />} />
              <Route path="/services/georgia/individual-entrepreneur" element={<GeorgianIEStatusPage />} />
              
              {/* Global Service Pages */}
              <Route path="/services/company-formation" element={<CompanyFormationPage />} />
              <Route path="/services/tax-optimization" element={<TaxOptimizationPage />} />
              <Route path="/services/banking-solutions" element={<BankingSolutionsPage />} />
              <Route path="/services/legal-compliance" element={<LegalCompliancePage />} />
              <Route path="/services/asset-protection" element={<AssetProtectionPage />} />
              <Route path="/services/investment-advisory" element={<InvestmentAdvisoryPage />} />
              <Route path="/services/visa-residency" element={<VisaResidencyPage />} />
              <Route path="/services/market-research" element={<MarketResearchPage />} />
              
              {/* Coming Soon Country Pages */}
              <Route path="/countries/usa" element={<ComingSoonCountryPage country="United States" flag="🇺🇸" />} />
              <Route path="/countries/uae" element={<ComingSoonCountryPage country="United Arab Emirates" flag="🇦🇪" />} />
              <Route path="/countries/estonia" element={<ComingSoonCountryPage country="Estonia" flag="🇪🇪" />} />
              <Route path="/countries/malta" element={<ComingSoonCountryPage country="Malta" flag="🇲🇹" />} />
              <Route path="/countries/portugal" element={<ComingSoonCountryPage country="Portugal" flag="🇵🇹" />} />
              <Route path="/countries/panama" element={<ComingSoonCountryPage country="Panama" flag="🇵🇦" />} />
              <Route path="/countries/switzerland" element={<ComingSoonCountryPage country="Switzerland" flag="🇨🇭" />} />
              <Route path="/countries/singapore" element={<ComingSoonCountryPage country="Singapore" flag="🇸🇬" />} />
              <Route path="/countries/netherlands" element={<ComingSoonCountryPage country="Netherlands" flag="🇳🇱" />} />
              <Route path="/countries/ireland" element={<ComingSoonCountryPage country="Ireland" flag="🇮🇪" />} />
              <Route path="/countries/gibraltar" element={<ComingSoonCountryPage country="Gibraltar" flag="🇬🇮" />} />
              <Route path="/countries/lithuania" element={<ComingSoonCountryPage country="Lithuania" flag="🇱🇹" />} />
              <Route path="/countries/canada" element={<ComingSoonCountryPage country="Canada" flag="🇨🇦" />} />
              <Route path="/countries/bulgaria" element={<ComingSoonCountryPage country="Bulgaria" flag="🇧🇬" />} />
              <Route path="/countries/spain" element={<ComingSoonCountryPage country="Spain" flag="🇪🇸" />} />
              <Route path="/countries/montenegro" element={<ComingSoonCountryPage country="Montenegro" flag="🇲🇪" />} />
              <Route path="/countries/costa-rica" element={<CountryPage />} />
              <Route path="/countries/norway" element={<ComingSoonCountryPage country="Norway" flag="🇳🇴" />} />
              
              {/* Other Apps */}
              <Route path="/client/*" element={
                <React.Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="text-lg">Loading...</div></div>}>
                  <ClientApp />
                </React.Suspense>
              } />
              <Route path="/consultant/*" element={
                <React.Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="text-lg">Loading...</div></div>}>
                  <ConsultantApp />
                </React.Suspense>
              } />
              <Route path="/admin/*" element={
                <React.Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="text-lg">Loading...</div></div>}>
                  <AdminApp />
                </React.Suspense>
              } />
            </Routes>
          </Router>
        </LanguageProvider>
      </AuthProvider>
    </HelmetProvider>
  );
}

export default App;