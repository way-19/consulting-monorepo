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
    
    // Hero Section
    heroTitle: 'AI-Powered Global Business Consulting',
    heroSubtitle: 'Expert Guidance Worldwide',
    heroDescription: 'Connect with expert advisors in 19+ countries for seamless international business expansion.',
    heroPrimaryCTA: 'Start Your Expansion',
    heroSecondaryCTA: 'Explore Services',
    
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
    
    // Hero Section
    heroTitle: 'AI Destekli Küresel İş Danışmanlığı',
    heroSubtitle: 'Dünya Çapında Uzman Rehberlik',
    heroDescription: '19+ ülkede uzman danışmanlarla sorunsuz uluslararası iş genişlemesi için bağlantı kurun.',
    heroPrimaryCTA: 'Genişlemenizi Başlatın',
    heroSecondaryCTA: 'Hizmetleri Keşfedin',
    
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
    
    // Hero Section
    heroTitle: 'Consultoria Empresarial Global Alimentada por IA',
    heroSubtitle: 'Orientação Especializada Mundial',
    heroDescription: 'Conecte-se com consultores especialistas em 19+ países para expansão empresarial internacional perfeita.',
    heroPrimaryCTA: 'Inicie Sua Expansão',
    heroSecondaryCTA: 'Explorar Serviços',
    
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
    learnMore: 'Más Información',
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
    
    // Hero Section
    heroTitle: 'Consultoría Empresarial Global Impulsada por IA',
    heroSubtitle: 'Orientación Experta Mundial',
    heroDescription: 'Conéctese con asesores expertos en 19+ países para una expansión empresarial internacional sin problemas.',
    heroPrimaryCTA: 'Comience Su Expansión',
    heroSecondaryCTA: 'Explorar Servicios',
    
    // Features
    aiPoweredIntelligence: 'Inteligencia Impulsada por IA',
    expertNetwork: 'Red de Expertos',
    
    // Footer
    copyright: '© 2025 Consulting19. Todos los derechos reservados.',
    powered: 'Impulsado por tecnología AI Oracle',
    
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
    // currency: 'USD', // System-wide USD currency
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