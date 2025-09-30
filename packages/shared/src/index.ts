// Auth
export { AuthProvider, useAuth } from './contexts/AuthContext';

// Language
export { LanguageProvider, useLanguage } from './contexts/LanguageContext';

// UI Components
export * from './components/ui';

// Components
export { default as LoadingSpinner } from './components/LoadingSpinner';
export { default as MfaSetup } from './components/MfaSetup';

// Supabase
export { supabase } from './lib/supabase';
export type * from './types/database';

// Country Configuration
export type * from './types/country-config';
export { CountryConfigService } from './services/CountryConfigService';

// Cross-Domain Sync
export { CrossDomainSync } from './services/CrossDomainSync';
export type { CrossDomainMessage } from './services/CrossDomainSync';