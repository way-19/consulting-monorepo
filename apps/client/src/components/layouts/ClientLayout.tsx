import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Users, 
  CheckSquare, 
  FileText, 
  MessageCircle, 
  DollarSign, 
  Calendar, 
  Settings, 
  LogOut, 
  User,
  Bell,
  Globe,
  ChevronDown,
  Briefcase,
  BarChart3,
  Clock,
  PenTool,
  FolderOpen,
  Mail,
  TrendingUp,
  HelpCircle
} from 'lucide-react';
import { useAuth } from '@consulting19/shared';

interface ClientLayoutProps {
  children: React.ReactNode;
}

const ClientLayout: React.FC<ClientLayoutProps> = ({ children }) => {
  const location = useLocation();
  const { signOut, user, profile } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
    { code: 'pt', name: 'Português', flag: '🇵🇹' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
  ];

  const handleLanguageChange = (langCode: string) => {
    setCurrentLanguage(langCode);
    setShowLanguageMenu(false);
    localStorage.setItem('consulting19-client-language', langCode);
    // Sayfayı yenile ki dil değişikliği uygulansin
    window.location.reload();
  };

  const navigation = [