// Database Types
export interface UserProfile {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  full_name?: string; // Computed field or legacy field
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

export interface AvailabilitySlot {
  id: number;
  consultant_id: string;
  day_of_week: number; // 0=Monday, 6=Sunday
  start_time: string; // HH:MM format
  end_time: string;
  status?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface BlockedTime {
  id: string;
  consultant_id: string;
  title: string;
  start_time: string;
  end_time: string;
  reason?: string;
  created_at: string;
  updated_at: string;
}

export interface MeetingPricing {
  id: string;
  consultant_id: string;
  duration_minutes: number;
  price: number;
  currency: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ConsultantSettings {
  id: string;
  consultant_id: string;
  video_platform?: string; // 'google_meet' | 'zoom' | 'teams'
  video_meeting_url?: string;
  meeting_topics?: string[]; // ["hukuk", "danışmanlık", "şirket kurulumu"]
  hourly_rate?: number;
  created_at: string;
  updated_at: string;
}

export interface Meeting {
  id: string;
  title: string;
  description?: string;
  client_id: string;
  consultant_id: string;
  start_time: string;
  end_time: string;
  meeting_type?: string; // 'video' | 'phone' | 'in-person'
  meeting_topic?: string;
  duration_minutes?: number;
  price_paid?: number;
  currency?: string;
  payment_status?: string; // 'pending' | 'paid' | 'refunded'
  stripe_session_id?: string;
  status?: string; // 'scheduled' | 'completed' | 'cancelled'
  meeting_url?: string;
  location?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}