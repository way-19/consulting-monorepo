// Database Types
export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  display_name?: string;
  role: 'admin' | 'consultant' | 'client';
  country_id?: string;
  phone?: string;
  company?: string;
  avatar_url?: string;
  preferred_language?: string;
  timezone?: string;
  is_active: boolean;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface Country {
  id: string;
  name: string;
  code: string;
  flag_emoji: string;
  description_i18n: Record<string, string>;
  is_active: boolean;
  created_at: string;
}

export interface Client {
  id: string;
  profile_id: string;
  assigned_consultant_id?: string;
  company_name?: string;
  status: 'active' | 'inactive' | 'pending';
  priority: 'low' | 'medium' | 'high';
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface CustomService {
  id: string;
  consultant_id: string;
  country_id?: string;
  title_i18n: Record<string, string>;
  description_i18n: Record<string, string>;
  features_i18n: Record<string, string[]>;
  category: string;
  price: number;
  currency: string;
  is_active: boolean;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  client_id: string;
  consultant_id: string;
  service_order_id?: string;
  title: string;
  description_i18n: Record<string, string>;
  status: 'active' | 'completed' | 'on_hold' | 'cancelled';
  priority: 'low' | 'medium' | 'high';
  progress: number;
  budget?: number;
  currency?: string;
  start_date?: string;
  end_date?: string;
  created_at: string;
  updated_at: string;
}