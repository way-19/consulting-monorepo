import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'tr' | 'pt' | 'es';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Comprehensive translations
const translations = {
  en: {
    // Navigation
    home: 'Home',
    services: 'Services',
    countries: 'Countries',
    about: 'About',
    blog: 'Blog',
    contact: 'Contact',
    login: 'Login',
    register: 'Register',
    dashboard: 'Dashboard',
    logout: 'Logout',
    
    // Common
    getStarted: 'Get Started',
    learnMore: 'Learn More',
    scheduleConsultation: 'Schedule Consultation',
    loading: 'Loading...',
    save: 'Save',
    cancel: 'Cancel',
    edit: 'Edit',
    delete: 'Delete',
    
    // Services
    companyFormation: 'Company Formation',
    taxOptimization: 'Tax Optimization',
    bankingSolutions: 'Banking Solutions',
    legalCompliance: 'Legal Compliance',
    assetProtection: 'Asset Protection',
    investmentAdvisory: 'Investment Advisory',
    visaResidency: 'Visa & Residency',
    marketResearch: 'Market Research',
    assetProtection: 'Asset Protection',
    investmentAdvisory: 'Investment Advisory',
    visaResidency: 'Visa & Residency',
    marketResearch: 'Market Research',
    
    // Hero Section
    heroTitle: 'AI-Powered Global Business Consulting',
    heroSubtitle: 'Expert Guidance Worldwide',
    heroDescription: 'Connect with expert advisors in 19+ countries for seamless international business expansion.',
    heroPrimaryCTA: 'Start Your Expansion',
    heroSecondaryCTA: 'Explore Services',
    
    // Additional translations
    heroTitle1: 'AI-Powered Global Business Consulting',
    heroSubtitle1: 'Expert Guidance Worldwide',
    heroDescription1: 'Connect with expert advisors in 19+ countries for seamless international business expansion.',
    heroPrimaryCTA1: 'Start Your Expansion',
    heroSecondaryCTA1: 'Explore Services',
    
    // Asset Protection Page
    protectWhatMatters: 'Protect What Matters Most',
    assetProtectionSubtitle: 'Comprehensive asset protection and wealth security strategies – powered by AI and trusted by clients worldwide',
    joinStartProtection: 'Join to Start Asset Protection',
    freeProtectionConsultation: 'Free Protection Consultation',
    globalExpertise: 'Global Expertise',
    aiMultilingualSupport: 'AI Multilingual Support',
    provenProtectionStructures: 'Proven Protection Structures',
    offshoreProtectionJurisdictions: 'Offshore Protection Jurisdictions',
    aiBackedSecurityGuidance: 'AI-Backed Security Guidance',
    customizedWealthStrategies: 'Customized Wealth Strategies',
    maximumPrivacyRiskMitigation: 'Maximum Privacy & Risk Mitigation',
    whyConsulting19AssetProtection: 'Why Consulting19 for Asset Protection?',
    provenStrategies: 'Proven Strategies',
    localExpertise: 'Local Expertise',
    aiAdvantage: 'AI Advantage',
    confidentialSecure: 'Confidential & Secure',
    protectionStrategies: 'Protection Strategies',
    protectionProcess: 'Protection Process',
    whatsIncluded: 'What\'s Included',
    frequentlyAskedQuestions: 'Frequently Asked Questions',
    readyToProtectAssets: 'Ready to Protect Your Assets?',
    secureWealthDescription: 'Secure your wealth with professional asset protection strategies and expert guidance from qualified specialists',
    joinForProtectionAssessment: 'Join for Protection Assessment',
    
    // Features
    aiPoweredIntelligence: 'AI-Powered Intelligence',
    expertNetwork: 'Expert Network',
    
    // Footer
    copyright: '© 2025 Consulting19. All rights reserved.',
    powered: 'Powered by AI Oracle technology',
    
    // Auth
    email: 'Email Address',
    password: 'Password',
    fullName: 'Full Name',
    company: 'Company',
    country: 'Country',
    
    // Dashboard
    welcome: 'Welcome',
    clients: 'Clients',
    projects: 'Projects',
    documents: 'Documents',
    messages: 'Messages',
    settings: 'Settings',
    
    // Status
    active: 'Active',
    inactive: 'Inactive',
    pending: 'Pending',
  },
  es: {
    // Navigation
    home: 'Inicio',
    services: 'Servicios',
    countries: 'Países',
    about: 'Acerca de',
    blog: 'Blog',
    contact: 'Contacto',
    login: 'Iniciar Sesión',
    register: 'Registrarse',
    dashboard: 'Panel',
    logout: 'Cerrar Sesión',
    
    // Common
    getStarted: 'Comenzar',
    learnMore: 'Saber Más',
    scheduleConsultation: 'Programar Consulta',
    loading: 'Cargando...',
    save: 'Guardar',
    cancel: 'Cancelar',
    edit: 'Editar',
    delete: 'Eliminar',
    
    // Services
    companyFormation: 'Formación de Empresa',
    taxOptimization: 'Optimización Fiscal',
    bankingSolutions: 'Soluciones Bancarias',
    legalCompliance: 'Cumplimiento Legal',
    assetProtection: 'Protección de Activos',
    investmentAdvisory: 'Asesoría de Inversión',
    visaResidency: 'Visa y Residencia',
    marketResearch: 'Investigación de Mercado',
    
    // Hero Section
    heroTitle: 'Consultoría Empresarial Global Impulsada por IA',
    heroSubtitle: 'Orientación Experta Mundial',
    heroDescription: 'Conéctate con asesores expertos en 19+ países para una expansión empresarial internacional sin problemas.',
    heroPrimaryCTA: 'Inicia Tu Expansión',
    heroSecondaryCTA: 'Explorar Servicios',
    
    // Asset Protection Page
    protectWhatMatters: 'Protege Lo Que Más Importa',
    assetProtectionSubtitle: 'Estrategias integrales de protección de activos y seguridad patrimonial – impulsadas por IA y confiadas por clientes en todo el mundo',
    joinStartProtection: 'Únete para Comenzar Protección de Activos',
    freeProtectionConsultation: 'Consulta Gratuita de Protección',
    globalExpertise: 'Experiencia Global',
    aiMultilingualSupport: 'Soporte Multilingüe de IA',
    provenProtectionStructures: 'Estructuras de Protección Probadas',
    offshoreProtectionJurisdictions: 'Jurisdicciones de Protección Offshore',
    aiBackedSecurityGuidance: 'Orientación de Seguridad Respaldada por IA',
    customizedWealthStrategies: 'Estrategias de Riqueza Personalizadas',
    maximumPrivacyRiskMitigation: 'Máxima Privacidad y Mitigación de Riesgos',
    whyConsulting19AssetProtection: '¿Por qué Consulting19 para Protección de Activos?',
    provenStrategies: 'Estrategias Probadas',
    localExpertise: 'Experiencia Local',
    aiAdvantage: 'Ventaja de IA',
    confidentialSecure: 'Confidencial y Seguro',
    protectionStrategies: 'Estrategias de Protección',
    protectionProcess: 'Proceso de Protección',
    whatsIncluded: 'Qué Está Incluido',
    frequentlyAskedQuestions: 'Preguntas Frecuentes',
    readyToProtectAssets: '¿Listo para Proteger Tus Activos?',
    secureWealthDescription: 'Asegura tu riqueza con estrategias profesionales de protección de activos y orientación experta de especialistas calificados',
    joinForProtectionAssessment: 'Únete para Evaluación de Protección',
    
    // Features
    aiPoweredIntelligence: 'Inteligencia Impulsada por IA',
    expertNetwork: 'Red de Expertos',
    
    // Footer
    copyright: '© 2025 Consulting19. Todos los derechos reservados.',
    powered: 'Impulsado por la tecnología AI Oracle',
    
    // Auth
    email: 'Dirección de Correo Electrónico',
    password: 'Contraseña',
    fullName: 'Nombre Completo',
    company: 'Empresa',
    country: 'País',
    
    // Dashboard
    welcome: 'Bienvenido',
    clients: 'Clientes',
    projects: 'Proyectos',
    documents: 'Documentos',
    messages: 'Mensajes',
    settings: 'Configuración',
    
    // Status
    active: 'Activo',
    inactive: 'Inactivo',
    pending: 'Pendiente',
  },
  tr: {
    // Navigation
    home: 'Ana Sayfa',
    services: 'Hizmetler',
    countries: 'Ülkeler',
    about: 'Hakkımızda',
    blog: 'Blog',
    contact: 'İletişim',
    login: 'Giriş',
    register: 'Kayıt Ol',
    dashboard: 'Panel',
    logout: 'Çıkış',
    
    // Common
    getStarted: 'Başlayın',
    learnMore: 'Daha Fazla Bilgi',
    scheduleConsultation: 'Danışmanlık Planlayın',
    loading: 'Yükleniyor...',
    save: 'Kaydet',
    cancel: 'İptal',
    edit: 'Düzenle',
    delete: 'Sil',
    
    // Services
    companyFormation: 'Şirket Kuruluşu',
    taxOptimization: 'Vergi Optimizasyonu',
    bankingSolutions: 'Bankacılık Çözümleri',
    legalCompliance: 'Yasal Uyumluluk',
    assetProtection: 'Varlık Korunması',
    investmentAdvisory: 'Yatırım Danışmanlığı',
    visaResidency: 'Vize ve İkamet',
    marketResearch: 'Pazar Araştırması',
    assetProtection: 'Varlık Korunması',
    investmentAdvisory: 'Yatırım Danışmanlığı',
    visaResidency: 'Vize ve İkamet',
    marketResearch: 'Pazar Araştırması',
    
    // Hero Section
    heroTitle: 'AI Destekli Küresel İş Danışmanlığı',
    heroSubtitle: 'Dünya Çapında Uzman Rehberlik',
    heroDescription: '19+ ülkede uzman danışmanlarla sorunsuz uluslararası iş genişlemesi için bağlantı kurun.',
    heroPrimaryCTA: 'Genişlemenizi Başlatın',
    heroSecondaryCTA: 'Hizmetleri Keşfedin',
    
    // Asset Protection Page
    protectWhatMatters: 'En Değerli Varlıklarınızı Koruyun',
    assetProtectionSubtitle: 'AI destekli kapsamlı varlık korunması ve servet güvenliği stratejileri – dünya çapında müşteriler tarafından güvenilen',
    joinStartProtection: 'Varlık Korunmasına Başlamak İçin Üye Olun',
    freeProtectionConsultation: 'Ücretsiz Koruma Danışmanlığı',
    globalExpertise: 'Küresel Uzmanlık',
    aiMultilingualSupport: 'AI Çok Dilli Destek',
    provenProtectionStructures: 'Kanıtlanmış Koruma Yapıları',
    offshoreProtectionJurisdictions: 'Offshore Koruma Yargı Bölgeleri',
    aiBackedSecurityGuidance: 'AI Destekli Güvenlik Rehberliği',
    customizedWealthStrategies: 'Özelleştirilmiş Servet Stratejileri',
    maximumPrivacyRiskMitigation: 'Maksimum Gizlilik ve Risk Azaltma',
    whyConsulting19AssetProtection: 'Varlık Korunması İçin Neden Consulting19?',
    provenStrategies: 'Kanıtlanmış Stratejiler',
    localExpertise: 'Yerel Uzmanlık',
    aiAdvantage: 'AI Avantajı',
    confidentialSecure: 'Gizli ve Güvenli',
    protectionStrategies: 'Koruma Stratejileri',
    protectionProcess: 'Koruma Süreci',
    whatsIncluded: 'Neler Dahil',
    frequentlyAskedQuestions: 'Sıkça Sorulan Sorular',
    readyToProtectAssets: 'Varlıklarınızı Korumaya Hazır mısınız?',
    secureWealthDescription: 'Nitelikli uzmanlardan profesyonel varlık koruma stratejileri ve uzman rehberliği ile servetinizi güvence altına alın',
    joinForProtectionAssessment: 'Koruma Değerlendirmesi İçin Üye Olun',
    
    // Features
    aiPoweredIntelligence: 'AI Destekli Zeka',
    expertNetwork: 'Uzman Ağı',
    
    // Footer
    copyright: '© 2025 Consulting19. Tüm hakları saklıdır.',
    powered: 'AI Oracle teknolojisi ile güçlendirilmiştir',
    
    // Auth
    email: 'E-posta Adresi',
    password: 'Şifre',
    fullName: 'Ad Soyad',
    company: 'Şirket',
    country: 'Ülke',
    
    // Dashboard
    welcome: 'Hoş Geldiniz',
    clients: 'Müşteriler',
    projects: 'Projeler',
    documents: 'Belgeler',
    messages: 'Mesajlar',
    settings: 'Ayarlar',
    
    // Status
    active: 'Aktif',
    inactive: 'Pasif',
    pending: 'Bekleyen',
  },
  pt: {
    // Navigation
    home: 'Início',
    services: 'Serviços',
    countries: 'Países',
    about: 'Sobre',
    blog: 'Blog',
    contact: 'Contato',
    login: 'Entrar',
    register: 'Registrar',
    dashboard: 'Painel',
    logout: 'Sair',
    
    // Common
    getStarted: 'Começar',
    learnMore: 'Saiba Mais',
    scheduleConsultation: 'Agendar Consulta',
    loading: 'Carregando...',
    save: 'Salvar',
    cancel: 'Cancelar',
    edit: 'Editar',
    delete: 'Excluir',
    
    // Services
    companyFormation: 'Formação de Empresa',
    taxOptimization: 'Otimização Fiscal',
    bankingSolutions: 'Soluções Bancárias',
    legalCompliance: 'Conformidade Legal',
    assetProtection: 'Proteção de Ativos',
    investmentAdvisory: 'Consultoria de Investimento',
    visaResidency: 'Visto e Residência',
    marketResearch: 'Pesquisa de Mercado',
    assetProtection: 'Proteção de Ativos',
    investmentAdvisory: 'Consultoria de Investimento',
    visaResidency: 'Visto e Residência',
    marketResearch: 'Pesquisa de Mercado',
    
    // Hero Section
    heroTitle: 'Consultoria Empresarial Global Alimentada por IA',
    heroSubtitle: 'Orientação Especializada Mundial',
    heroDescription: 'Conecte-se com consultores especialistas em 19+ países para expansão empresarial internacional perfeita.',
    heroPrimaryCTA: 'Inicie Sua Expansão',
    heroSecondaryCTA: 'Explorar Serviços',
    
    // Asset Protection Page
    protectWhatMatters: 'Proteja o Que Mais Importa',
    assetProtectionSubtitle: 'Estratégias abrangentes de proteção de ativos e segurança patrimonial – alimentadas por IA e confiadas por clientes em todo o mundo',
    joinStartProtection: 'Junte-se para Iniciar Proteção de Ativos',
    freeProtectionConsultation: 'Consulta Gratuita de Proteção',
    globalExpertise: 'Expertise Global',
    aiMultilingualSupport: 'Suporte Multilíngue AI',
    provenProtectionStructures: 'Estruturas de Proteção Comprovadas',
    offshoreProtectionJurisdictions: 'Jurisdições de Proteção Offshore',
    aiBackedSecurityGuidance: 'Orientação de Segurança Apoiada por IA',
    customizedWealthStrategies: 'Estratégias de Riqueza Personalizadas',
    maximumPrivacyRiskMitigation: 'Máxima Privacidade e Mitigação de Riscos',
    whyConsulting19AssetProtection: 'Por que Consulting19 para Proteção de Ativos?',
    provenStrategies: 'Estratégias Comprovadas',
    localExpertise: 'Expertise Local',
    aiAdvantage: 'Vantagem da IA',
    confidentialSecure: 'Confidencial e Seguro',
    protectionStrategies: 'Estratégias de Proteção',
    protectionProcess: 'Processo de Proteção',
    whatsIncluded: 'O Que Está Incluído',
    frequentlyAskedQuestions: 'Perguntas Frequentes',
    readyToProtectAssets: 'Pronto para Proteger Seus Ativos?',
    secureWealthDescription: 'Proteja sua riqueza com estratégias profissionais de proteção de ativos e orientação especializada de especialistas qualificados',
    joinForProtectionAssessment: 'Junte-se para Avaliação de Proteção',
    
    // Features
    aiPoweredIntelligence: 'Inteligência Alimentada por IA',
    expertNetwork: 'Rede de Especialistas',
    
    // Footer
    copyright: '© 2025 Consulting19. Todos os direitos reservados.',
    powered: 'Alimentado pela tecnologia AI Oracle',
    
    // Auth
    email: 'Endereço de Email',
    password: 'Senha',
    fullName: 'Nome Completo',
    company: 'Empresa',
    country: 'País',
    
    // Dashboard
    welcome: 'Bem-vindo',
    clients: 'Clientes',
    projects: 'Projetos',
    documents: 'Documentos',
    messages: 'Mensagens',
    settings: 'Configurações',
    
    // Status
    active: 'Ativo',
    inactive: 'Inativo',
    pending: 'Pendente',
  }
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('consulting19-language');
    return (saved as Language) || 'en';
  });

  useEffect(() => {
    localStorage.setItem('consulting19-language', language);
  }, [language]);

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};