-- Combined Migration Script for Production Supabase
-- Execute this in Supabase Dashboard > SQL Editor

-- Migration: 20250925212756_initial_schema.sql
-- Initial Schema for Consulting Platform
-- This creates all the necessary tables and relationships

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Countries table
CREATE TABLE IF NOT EXISTS countries (
    id SERIAL PRIMARY KEY,
    code VARCHAR(2) UNIQUE NOT NULL,
    name_en VARCHAR(100) NOT NULL,
    name_tr VARCHAR(100),
    name_es VARCHAR(100),
    name_pt VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Languages table
CREATE TABLE IF NOT EXISTS languages (
    id SERIAL PRIMARY KEY,
    code VARCHAR(5) UNIQUE NOT NULL,
    name VARCHAR(50) NOT NULL,
    native_name VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Service categories table
CREATE TABLE IF NOT EXISTS service_categories (
    id SERIAL PRIMARY KEY,
    name_en VARCHAR(100) NOT NULL,
    name_tr VARCHAR(100),
    name_es VARCHAR(100),
    name_pt VARCHAR(100),
    description_en TEXT,
    description_tr TEXT,
    description_es TEXT,
    description_pt TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Services table
CREATE TABLE IF NOT EXISTS services (
    id SERIAL PRIMARY KEY,
    category_id INTEGER REFERENCES service_categories(id),
    name_en VARCHAR(100) NOT NULL,
    name_tr VARCHAR(100),
    name_es VARCHAR(100),
    name_pt VARCHAR(100),
    description_en TEXT,
    description_tr TEXT,
    description_es TEXT,
    description_pt TEXT,
    base_price DECIMAL(10,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Consultant profiles table
CREATE TABLE IF NOT EXISTS consultant_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    bio_en TEXT,
    bio_tr TEXT,
    bio_es TEXT,
    bio_pt TEXT,
    experience_years INTEGER DEFAULT 0,
    hourly_rate DECIMAL(10,2),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Consultant countries (which countries a consultant serves)
CREATE TABLE IF NOT EXISTS consultant_countries (
    id SERIAL PRIMARY KEY,
    consultant_id UUID REFERENCES consultant_profiles(id) ON DELETE CASCADE,
    country_id INTEGER REFERENCES countries(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(consultant_id, country_id)
);

-- Consultant spoken languages
CREATE TABLE IF NOT EXISTS consultant_spoken_languages (
    id SERIAL PRIMARY KEY,
    consultant_id UUID REFERENCES consultant_profiles(id) ON DELETE CASCADE,
    language_id INTEGER REFERENCES languages(id) ON DELETE CASCADE,
    proficiency_level VARCHAR(20) DEFAULT 'intermediate', -- beginner, intermediate, advanced, native
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(consultant_id, language_id)
);

-- Consultant country services (services offered by consultant in specific countries)
CREATE TABLE IF NOT EXISTS consultant_country_services (
    id SERIAL PRIMARY KEY,
    consultant_id UUID REFERENCES consultant_profiles(id) ON DELETE CASCADE,
    country_id INTEGER REFERENCES countries(id) ON DELETE CASCADE,
    service_id INTEGER REFERENCES services(id) ON DELETE CASCADE,
    custom_price DECIMAL(10,2),
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(consultant_id, country_id, service_id)
);

-- Clients table
CREATE TABLE IF NOT EXISTS clients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    company_name VARCHAR(100),
    country_code VARCHAR(2) REFERENCES countries(code),
    preferred_language VARCHAR(5) DEFAULT 'en',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Service orders table
CREATE TABLE IF NOT EXISTS service_orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
    consultant_id UUID REFERENCES consultant_profiles(id) ON DELETE CASCADE,
    service_id INTEGER REFERENCES services(id),
    country_id INTEGER REFERENCES countries(id),
    title VARCHAR(200) NOT NULL,
    description TEXT,
    budget DECIMAL(10,2),
    status VARCHAR(20) DEFAULT 'pending', -- pending, accepted, in_progress, completed, cancelled
    priority VARCHAR(10) DEFAULT 'medium', -- low, medium, high, urgent
    deadline DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Service purchases table (completed transactions)
CREATE TABLE IF NOT EXISTS service_purchases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES service_orders(id) ON DELETE CASCADE,
    client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
    consultant_id UUID REFERENCES consultant_profiles(id) ON DELETE CASCADE,
    service_id INTEGER REFERENCES services(id),
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'EUR',
    payment_status VARCHAR(20) DEFAULT 'pending', -- pending, completed, failed, refunded
    payment_method VARCHAR(50),
    transaction_id VARCHAR(100),
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Commission payouts table
CREATE TABLE IF NOT EXISTS commission_payouts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    consultant_id UUID REFERENCES consultant_profiles(id) ON DELETE CASCADE,
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    commission_rate DECIMAL(5,4) DEFAULT 0.15, -- 15% commission
    status VARCHAR(20) DEFAULT 'pending', -- pending, processed, paid
    processed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Commission payout items table
CREATE TABLE IF NOT EXISTS commission_payout_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    payout_id UUID REFERENCES commission_payouts(id) ON DELETE CASCADE,
    purchase_id UUID REFERENCES service_purchases(id) ON DELETE CASCADE,
    service_amount DECIMAL(10,2) NOT NULL,
    commission_amount DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Messages table for communication
CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    recipient_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    order_id UUID REFERENCES service_orders(id) ON DELETE SET NULL,
    subject VARCHAR(200),
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Message attachments table
CREATE TABLE IF NOT EXISTS message_attachments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    message_id UUID REFERENCES messages(id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size INTEGER,
    mime_type VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Conversation participants table
CREATE TABLE IF NOT EXISTS conversation_participants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES service_orders(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(order_id, user_id)
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'info', -- info, success, warning, error
    is_read BOOLEAN DEFAULT false,
    action_url VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Country pages table for content management
CREATE TABLE IF NOT EXISTS country_pages (
    id SERIAL PRIMARY KEY,
    country_id INTEGER REFERENCES countries(id) ON DELETE CASCADE,
    title_en VARCHAR(200),
    title_tr VARCHAR(200),
    title_es VARCHAR(200),
    title_pt VARCHAR(200),
    content_en TEXT,
    content_tr TEXT,
    content_es TEXT,
    content_pt TEXT,
    meta_description_en TEXT,
    meta_description_tr TEXT,
    meta_description_es TEXT,
    meta_description_pt TEXT,
    is_published BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Country media table
CREATE TABLE IF NOT EXISTS country_media (
    id SERIAL PRIMARY KEY,
    country_id INTEGER REFERENCES countries(id) ON DELETE CASCADE,
    type VARCHAR(20) NOT NULL, -- image, video, document
    title VARCHAR(200),
    file_path VARCHAR(500) NOT NULL,
    alt_text VARCHAR(200),
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Country testimonials table
CREATE TABLE IF NOT EXISTS country_testimonials (
    id SERIAL PRIMARY KEY,
    country_id INTEGER REFERENCES countries(id) ON DELETE CASCADE,
    client_name VARCHAR(100) NOT NULL,
    client_company VARCHAR(100),
    testimonial_en TEXT,
    testimonial_tr TEXT,
    testimonial_es TEXT,
    testimonial_pt TEXT,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    is_featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Country settings table
CREATE TABLE IF NOT EXISTS country_settings (
    id SERIAL PRIMARY KEY,
    country_id INTEGER REFERENCES countries(id) ON DELETE CASCADE UNIQUE,
    timezone VARCHAR(50),
    currency VARCHAR(3) DEFAULT 'EUR',
    tax_rate DECIMAL(5,4) DEFAULT 0.0000,
    business_hours JSONB,
    contact_info JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Blog posts table
CREATE TABLE IF NOT EXISTS blog_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    title_en VARCHAR(200),
    title_tr VARCHAR(200),
    title_es VARCHAR(200),
    title_pt VARCHAR(200),
    slug VARCHAR(200) UNIQUE NOT NULL,
    content_en TEXT,
    content_tr TEXT,
    content_es TEXT,
    content_pt TEXT,
    excerpt_en TEXT,
    excerpt_tr TEXT,
    excerpt_es TEXT,
    excerpt_pt TEXT,
    featured_image VARCHAR(500),
    is_published BOOLEAN DEFAULT false,
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- FAQs table
CREATE TABLE IF NOT EXISTS faqs (
    id SERIAL PRIMARY KEY,
    category VARCHAR(100),
    question_en TEXT,
    question_tr TEXT,
    question_es TEXT,
    question_pt TEXT,
    answer_en TEXT,
    answer_tr TEXT,
    answer_es TEXT,
    answer_pt TEXT,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert basic countries
INSERT INTO countries (code, name_en, name_tr, name_es, name_pt) VALUES
('US', 'United States', 'Amerika Birleşik Devletleri', 'Estados Unidos', 'Estados Unidos'),
('GB', 'United Kingdom', 'Birleşik Krallık', 'Reino Unido', 'Reino Unido'),
('DE', 'Germany', 'Almanya', 'Alemania', 'Alemanha'),
('FR', 'France', 'Fransa', 'Francia', 'França'),
('ES', 'Spain', 'İspanya', 'España', 'Espanha'),
('IT', 'Italy', 'İtalya', 'Italia', 'Itália'),
('NL', 'Netherlands', 'Hollanda', 'Países Bajos', 'Países Baixos'),
('BE', 'Belgium', 'Belçika', 'Bélgica', 'Bélgica'),
('CH', 'Switzerland', 'İsviçre', 'Suiza', 'Suíça'),
('AT', 'Austria', 'Avusturya', 'Austria', 'Áustria'),
('IE', 'Ireland', 'İrlanda', 'Irlanda', 'Irlanda'),
('LU', 'Luxembourg', 'Lüksemburg', 'Luxemburgo', 'Luxemburgo'),
('PT', 'Portugal', 'Portekiz', 'Portugal', 'Portugal'),
('GR', 'Greece', 'Yunanistan', 'Grecia', 'Grécia'),
('CY', 'Cyprus', 'Kıbrıs', 'Chipre', 'Chipre'),
('MT', 'Malta', 'Malta', 'Malta', 'Malta'),
('EE', 'Estonia', 'Estonya', 'Estonia', 'Estónia'),
('LV', 'Latvia', 'Letonya', 'Letonia', 'Letónia'),
('LT', 'Lithuania', 'Litvanya', 'Lituania', 'Lituânia'),
('GE', 'Georgia', 'Gürcistan', 'Georgia', 'Geórgia'),
('CR', 'Costa Rica', 'Kosta Rika', 'Costa Rica', 'Costa Rica'),
('SG', 'Singapore', 'Singapur', 'Singapur', 'Singapura'),
('HK', 'Hong Kong', 'Hong Kong', 'Hong Kong', 'Hong Kong'),
('AE', 'United Arab Emirates', 'Birleşik Arap Emirlikleri', 'Emiratos Árabes Unidos', 'Emirados Árabes Unidos'),
('BG', 'Bulgaria', 'Bulgaristan', 'Bulgaria', 'Bulgária'),
('RO', 'Romania', 'Romanya', 'Rumania', 'Roménia'),
('HR', 'Croatia', 'Hırvatistan', 'Croacia', 'Croácia'),
('SI', 'Slovenia', 'Slovenya', 'Eslovenia', 'Eslovénia'),
('SK', 'Slovakia', 'Slovakya', 'Eslovaquia', 'Eslováquia'),
('CZ', 'Czech Republic', 'Çek Cumhuriyeti', 'República Checa', 'República Checa'),
('HU', 'Hungary', 'Macaristan', 'Hungría', 'Hungria'),
('PL', 'Poland', 'Polonya', 'Polonia', 'Polónia'),
('FI', 'Finland', 'Finlandiya', 'Finlandia', 'Finlândia'),
('SE', 'Sweden', 'İsveç', 'Suecia', 'Suécia'),
('DK', 'Denmark', 'Danimarka', 'Dinamarca', 'Dinamarca'),
('NO', 'Norway', 'Norveç', 'Noruega', 'Noruega');

-- Insert basic languages
INSERT INTO languages (code, name, native_name) VALUES
('en', 'English', 'English'),
('tr', 'Turkish', 'Türkçe'),
('es', 'Spanish', 'Español'),
('pt', 'Portuguese', 'Português'),
('de', 'German', 'Deutsch'),
('fr', 'French', 'Français'),
('it', 'Italian', 'Italiano'),
('nl', 'Dutch', 'Nederlands'),
('ru', 'Russian', 'Русский'),
('ar', 'Arabic', 'العربية');

-- Insert basic service categories
INSERT INTO service_categories (name_en, name_tr, name_es, name_pt, description_en, description_tr, description_es, description_pt) VALUES
('Company Formation', 'Şirket Kuruluşu', 'Formación de Empresas', 'Formação de Empresas', 'Complete company formation services', 'Tam şirket kuruluş hizmetleri', 'Servicios completos de formación de empresas', 'Serviços completos de formação de empresas'),
('Tax Advisory', 'Vergi Danışmanlığı', 'Asesoría Fiscal', 'Consultoria Fiscal', 'Professional tax advisory services', 'Profesyonel vergi danışmanlık hizmetleri', 'Servicios profesionales de asesoría fiscal', 'Serviços profissionais de consultoria fiscal'),
('Legal Services', 'Hukuki Hizmetler', 'Servicios Legales', 'Serviços Jurídicos', 'Comprehensive legal support', 'Kapsamlı hukuki destek', 'Apoyo legal integral', 'Apoio jurídico abrangente'),
('Banking & Finance', 'Bankacılık ve Finans', 'Banca y Finanzas', 'Banca e Finanças', 'Banking and financial services', 'Bankacılık ve finansal hizmetler', 'Servicios bancarios y financieros', 'Serviços bancários e financeiros'),
('Compliance', 'Uyumluluk', 'Cumplimiento', 'Conformidade', 'Regulatory compliance services', 'Düzenleyici uyumluluk hizmetleri', 'Servicios de cumplimiento regulatorio', 'Serviços de conformidade regulatória');

-- Insert basic services
INSERT INTO services (category_id, name_en, name_tr, name_es, name_pt, description_en, description_tr, description_es, description_pt) VALUES
(1, 'LLC Formation', 'LLC Kuruluşu', 'Formación de LLC', 'Formação de LLC', 'Limited Liability Company formation', 'Limited Şirket kuruluşu', 'Formación de Sociedad de Responsabilidad Limitada', 'Formação de Sociedade de Responsabilidade Limitada'),
(1, 'Corporation Formation', 'Anonim Şirket Kuruluşu', 'Formación de Corporación', 'Formação de Corporação', 'Corporation formation services', 'Anonim şirket kuruluş hizmetleri', 'Servicios de formación de corporaciones', 'Serviços de formação de corporações'),
(2, 'Tax Planning', 'Vergi Planlaması', 'Planificación Fiscal', 'Planeamento Fiscal', 'Strategic tax planning services', 'Stratejik vergi planlama hizmetleri', 'Servicios de planificación fiscal estratégica', 'Serviços de planeamento fiscal estratégico'),
(3, 'Contract Review', 'Sözleşme İncelemesi', 'Revisión de Contratos', 'Revisão de Contratos', 'Professional contract review and drafting', 'Profesyonel sözleşme inceleme ve hazırlama', 'Revisión y redacción profesional de contratos', 'Revisão e redação profissional de contratos'),
(4, 'Bank Account Opening', 'Banka Hesabı Açma', 'Apertura de Cuenta Bancaria', 'Abertura de Conta Bancária', 'Assistance with business bank account opening', 'İş bankası hesabı açma yardımı', 'Asistencia con la apertura de cuenta bancaria comercial', 'Assistência com abertura de conta bancária comercial');

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_consultant_profiles_user_id ON consultant_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_consultant_profiles_email ON consultant_profiles(email);
CREATE INDEX IF NOT EXISTS idx_clients_user_id ON clients(user_id);
CREATE INDEX IF NOT EXISTS idx_clients_email ON clients(email);
CREATE INDEX IF NOT EXISTS idx_service_orders_client_id ON service_orders(client_id);
CREATE INDEX IF NOT EXISTS idx_service_orders_consultant_id ON service_orders(consultant_id);
CREATE INDEX IF NOT EXISTS idx_service_orders_status ON service_orders(status);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_recipient_id ON messages(recipient_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);

-- Enable Row Level Security (RLS) on all tables
ALTER TABLE consultant_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Create basic RLS policies (these can be customized later)
-- Consultants can view and edit their own profiles
CREATE POLICY "Consultants can view own profile" ON consultant_profiles
    FOR ALL USING (auth.uid() = user_id);

-- Clients can view and edit their own data
CREATE POLICY "Clients can view own data" ON clients
    FOR ALL USING (auth.uid() = user_id);

-- Users can view their own orders
CREATE POLICY "Users can view own orders" ON service_orders
    FOR SELECT USING (
        auth.uid() IN (
            SELECT user_id FROM clients WHERE id = client_id
            UNION
            SELECT user_id FROM consultant_profiles WHERE id = consultant_id
        )
    );

-- Users can view their own messages
CREATE POLICY "Users can view own messages" ON messages
    FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = recipient_id);

-- Users can view their own notifications
CREATE POLICY "Users can view own notifications" ON notifications
    FOR ALL USING (auth.uid() = user_id);

-- Migration: 20250925212757_country_configurations.sql
-- Country Configuration System Migration
-- This creates tables for dynamic country-specific configurations

-- Country configurations table
CREATE TABLE IF NOT EXISTS country_configurations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    country_code VARCHAR(2) UNIQUE NOT NULL REFERENCES countries(code) ON DELETE CASCADE,
    country_name VARCHAR(100) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    
    -- Localization settings
    currency VARCHAR(10) DEFAULT '$',
    language VARCHAR(5) DEFAULT 'en',
    time_zone VARCHAR(50) DEFAULT 'UTC',
    date_format VARCHAR(20) DEFAULT 'MM/DD/YYYY',
    
    -- Legal requirements
    minimum_capital DECIMAL(15,2) DEFAULT 0,
    minimum_directors INTEGER DEFAULT 1,
    minimum_shareholders INTEGER DEFAULT 1,
    requires_local_director BOOLEAN DEFAULT false,
    requires_local_address BOOLEAN DEFAULT false,
    allows_foreign_ownership BOOLEAN DEFAULT true,
    
    -- Metadata
    processing_time VARCHAR(100) DEFAULT '5-7 business days',
    popularity INTEGER DEFAULT 0,
    description TEXT,
    benefits TEXT[], -- Array of benefits
    requirements TEXT[], -- Array of requirements
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Company details form configuration
CREATE TABLE IF NOT EXISTS country_form_sections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    country_config_id UUID REFERENCES country_configurations(id) ON DELETE CASCADE,
    section_id VARCHAR(50) NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(country_config_id, section_id)
);

-- Form fields configuration
CREATE TABLE IF NOT EXISTS country_form_fields (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    section_id UUID REFERENCES country_form_sections(id) ON DELETE CASCADE,
    field_id VARCHAR(50) NOT NULL,
    field_type VARCHAR(20) NOT NULL, -- text, number, textarea, select, checkbox, radio
    label VARCHAR(200) NOT NULL,
    placeholder VARCHAR(200),
    is_required BOOLEAN DEFAULT false,
    display_order INTEGER DEFAULT 0,
    
    -- Validation rules
    min_length INTEGER,
    max_length INTEGER,
    min_value DECIMAL(15,2),
    max_value DECIMAL(15,2),
    regex_pattern VARCHAR(500),
    error_message VARCHAR(200),
    
    -- Options for select/radio/checkbox fields
    options JSONB, -- Array of {value, label} objects
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(section_id, field_id)
);

-- Country packages configuration
CREATE TABLE IF NOT EXISTS country_packages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    country_config_id UUID REFERENCES country_configurations(id) ON DELETE CASCADE,
    package_id VARCHAR(50) NOT NULL,
    name VARCHAR(200) NOT NULL,
    price DECIMAL(15,2) NOT NULL,
    description TEXT,
    delivery_time VARCHAR(100) DEFAULT '5-7 business days',
    is_popular BOOLEAN DEFAULT false,
    display_order INTEGER DEFAULT 0,
    
    -- Package features
    features TEXT[], -- Array of feature descriptions
    legal_requirements TEXT[], -- Array of legal requirements
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(country_config_id, package_id)
);

-- Country additional services configuration
CREATE TABLE IF NOT EXISTS country_services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    country_config_id UUID REFERENCES country_configurations(id) ON DELETE CASCADE,
    service_id VARCHAR(50) NOT NULL,
    name VARCHAR(200) NOT NULL,
    price DECIMAL(15,2) NOT NULL,
    description TEXT,
    category VARCHAR(50) DEFAULT 'Other',
    delivery_time VARCHAR(100) DEFAULT '3-5 business days',
    is_popular BOOLEAN DEFAULT false,
    display_order INTEGER DEFAULT 0,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(country_config_id, service_id)
);

-- Country configuration audit log
CREATE TABLE IF NOT EXISTS country_config_audit (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    country_config_id UUID REFERENCES country_configurations(id) ON DELETE CASCADE,
    action VARCHAR(20) NOT NULL, -- create, update, delete
    changed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    changes JSONB, -- JSON object with old and new values
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_country_configurations_country_code ON country_configurations(country_code);
CREATE INDEX IF NOT EXISTS idx_country_configurations_is_active ON country_configurations(is_active);
CREATE INDEX IF NOT EXISTS idx_country_form_sections_country_config_id ON country_form_sections(country_config_id);
CREATE INDEX IF NOT EXISTS idx_country_form_fields_section_id ON country_form_fields(section_id);
CREATE INDEX IF NOT EXISTS idx_country_packages_country_config_id ON country_packages(country_config_id);
CREATE INDEX IF NOT EXISTS idx_country_services_country_config_id ON country_services(country_config_id);
CREATE INDEX IF NOT EXISTS idx_country_config_audit_country_config_id ON country_config_audit(country_config_id);

-- Enable Row Level Security
ALTER TABLE country_configurations ENABLE ROW LEVEL SECURITY;
ALTER TABLE country_form_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE country_form_fields ENABLE ROW LEVEL SECURITY;
ALTER TABLE country_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE country_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE country_config_audit ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Allow public read access to active configurations
CREATE POLICY "Public read access to active country configurations" ON country_configurations
    FOR SELECT USING (is_active = true);

CREATE POLICY "Public read access to form sections" ON country_form_sections
    FOR SELECT USING (
        country_config_id IN (
            SELECT id FROM country_configurations WHERE is_active = true
        )
    );

CREATE POLICY "Public read access to form fields" ON country_form_fields
    FOR SELECT USING (
        section_id IN (
            SELECT cfs.id FROM country_form_sections cfs
            JOIN country_configurations cc ON cfs.country_config_id = cc.id
            WHERE cc.is_active = true
        )
    );

CREATE POLICY "Public read access to packages" ON country_packages
    FOR SELECT USING (
        country_config_id IN (
            SELECT id FROM country_configurations WHERE is_active = true
        )
    );

CREATE POLICY "Public read access to services" ON country_services
    FOR SELECT USING (
        country_config_id IN (
            SELECT id FROM country_configurations WHERE is_active = true
        )
    );

-- Admin full access policies (assuming admin role exists)
CREATE POLICY "Admin full access to country configurations" ON country_configurations
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE id = auth.uid() 
            AND raw_user_meta_data->>'role' = 'admin'
        )
    );

CREATE POLICY "Admin full access to form sections" ON country_form_sections
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE id = auth.uid() 
            AND raw_user_meta_data->>'role' = 'admin'
        )
    );

CREATE POLICY "Admin full access to form fields" ON country_form_fields
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE id = auth.uid() 
            AND raw_user_meta_data->>'role' = 'admin'
        )
    );

CREATE POLICY "Admin full access to packages" ON country_packages
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE id = auth.uid() 
            AND raw_user_meta_data->>'role' = 'admin'
        )
    );

CREATE POLICY "Admin full access to services" ON country_services
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE id = auth.uid() 
            AND raw_user_meta_data->>'role' = 'admin'
        )
    );

CREATE POLICY "Admin full access to audit log" ON country_config_audit
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE id = auth.uid() 
            AND raw_user_meta_data->>'role' = 'admin'
        )
    );

-- Create functions for audit logging
CREATE OR REPLACE FUNCTION log_country_config_changes()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO country_config_audit (country_config_id, action, changed_by, changes)
        VALUES (NEW.id, 'create', auth.uid(), to_jsonb(NEW));
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO country_config_audit (country_config_id, action, changed_by, changes)
        VALUES (NEW.id, 'update', auth.uid(), jsonb_build_object('old', to_jsonb(OLD), 'new', to_jsonb(NEW)));
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        INSERT INTO country_config_audit (country_config_id, action, changed_by, changes)
        VALUES (OLD.id, 'delete', auth.uid(), to_jsonb(OLD));
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create triggers for audit logging
CREATE TRIGGER country_configurations_audit_trigger
    AFTER INSERT OR UPDATE OR DELETE ON country_configurations
    FOR EACH ROW EXECUTE FUNCTION log_country_config_changes();

-- Insert sample data for Georgia and Costa Rica
INSERT INTO country_configurations (
    country_code, country_name, is_active, currency, language, time_zone,
    minimum_capital, minimum_directors, minimum_shareholders,
    requires_local_director, requires_local_address, allows_foreign_ownership,
    processing_time, popularity, description, benefits, requirements
) VALUES 
(
    'GE', 'Georgia', true, '₾', 'en', 'Asia/Tbilisi',
    1000, 1, 1, false, false, true,
    '5-7 business days', 95,
    'Georgia offers one of the most business-friendly environments in the world with minimal bureaucracy and low taxes.',
    ARRAY['0% corporate tax on reinvested profits', 'Fast registration process', 'Strategic location between Europe and Asia', 'No currency restrictions'],
    ARRAY['Minimum capital of 1000 GEL', 'At least one director', 'Registered office in Georgia']
),
(
    'CR', 'Costa Rica', true, '$', 'en', 'America/Costa_Rica',
    0, 1, 1, false, true, true,
    '7-10 business days', 85,
    'Costa Rica provides political stability, strategic location, and access to both North and South American markets.',
    ARRAY['Political stability', 'Strategic location', 'Access to US and Latin American markets', 'Strong legal system'],
    ARRAY['Registered agent required', 'Local registered office', 'Annual corporate tax filing']
);

-- Get the configuration IDs for sample data
DO $$
DECLARE
    georgia_config_id UUID;
    costa_rica_config_id UUID;
    section_id UUID;
BEGIN
    -- Get Georgia configuration ID
    SELECT id INTO georgia_config_id FROM country_configurations WHERE country_code = 'GE';
    
    -- Create form sections for Georgia
    INSERT INTO country_form_sections (country_config_id, section_id, title, description, display_order)
    VALUES (georgia_config_id, 'company_info', 'Company Information', 'Basic company details for Georgian registration', 1)
    RETURNING id INTO section_id;
    
    -- Create form fields for Georgia
    INSERT INTO country_form_fields (section_id, field_id, field_type, label, placeholder, is_required, display_order, min_length, max_length)
    VALUES 
    (section_id, 'company_name_ge', 'text', 'Company Name (Georgian)', 'Enter company name in Georgian', true, 1, 2, 100),
    (section_id, 'company_name_en', 'text', 'Company Name (English)', 'Enter company name in English', true, 2, 2, 100),
    (section_id, 'business_activity', 'textarea', 'Business Activity Description', 'Describe your business activities', true, 3, 10, 500),
    (section_id, 'share_capital', 'number', 'Share Capital (GEL)', 'Minimum 1000 GEL', true, 4, 1000, 1000000),
    (section_id, 'director_name', 'text', 'Director Full Name', 'Enter director full name', true, 5, 2, 100);
    
    -- Get Costa Rica configuration ID
    SELECT id INTO costa_rica_config_id FROM country_configurations WHERE country_code = 'CR';
    
    -- Create form sections for Costa Rica
    INSERT INTO country_form_sections (country_config_id, section_id, title, description, display_order)
    VALUES (costa_rica_config_id, 'company_info', 'Company Information', 'Basic company details for Costa Rican registration', 1)
    RETURNING id INTO section_id;
    
    -- Create form fields for Costa Rica
    INSERT INTO country_form_fields (section_id, field_id, field_type, label, placeholder, is_required, display_order, min_length, max_length)
    VALUES 
    (section_id, 'company_name', 'text', 'Company Name', 'Enter your company name', true, 1, 2, 100),
    (section_id, 'business_purpose', 'textarea', 'Business Purpose', 'Describe the purpose of your business', true, 2, 10, 500),
    (section_id, 'authorized_capital', 'number', 'Authorized Capital (USD)', 'Enter authorized capital amount', false, 3, 0, 10000000),
    (section_id, 'president_name', 'text', 'President Name', 'Enter president full name', true, 4, 2, 100),
    (section_id, 'secretary_name', 'text', 'Secretary Name', 'Enter secretary full name', true, 5, 2, 100);
END $$;

-- Insert sample packages for Georgia
INSERT INTO country_packages (country_config_id, package_id, name, price, description, delivery_time, is_popular, features, legal_requirements)
SELECT 
    id, 'basic', 'Basic Package', 500.00, 'Essential company registration with all required documents', '5-7 business days', false,
    ARRAY['Company registration', 'Tax registration', 'Bank account assistance', 'Registered office (1 year)'],
    ARRAY['Minimum capital deposit', 'Director appointment', 'Articles of association']
FROM country_configurations WHERE country_code = 'GE'
UNION ALL
SELECT 
    id, 'standard', 'Standard Package', 750.00, 'Complete registration with additional business services', '5-7 business days', true,
    ARRAY['Everything in Basic', 'Corporate seal', 'Legal consultation (2 hours)', 'Accounting setup'],
    ARRAY['Minimum capital deposit', 'Director appointment', 'Articles of association', 'Initial accounting records']
FROM country_configurations WHERE country_code = 'GE'
UNION ALL
SELECT 
    id, 'premium', 'Premium Package', 1200.00, 'Full-service registration with ongoing support', '3-5 business days', false,
    ARRAY['Everything in Standard', 'Priority processing', 'Legal consultation (5 hours)', 'First year compliance'],
    ARRAY['Minimum capital deposit', 'Director appointment', 'Articles of association', 'Compliance monitoring setup']
FROM country_configurations WHERE country_code = 'GE';

-- Insert sample packages for Costa Rica
INSERT INTO country_packages (country_config_id, package_id, name, price, description, delivery_time, is_popular, features, legal_requirements)
SELECT 
    id, 'basic', 'Basic Package', 800.00, 'Standard corporation registration with required documentation', '7-10 business days', false,
    ARRAY['Corporation registration', 'Registered agent service', 'Corporate books', 'Tax ID number'],
    ARRAY['Registered agent appointment', 'Local registered office', 'Corporate bylaws']
FROM country_configurations WHERE country_code = 'CR'
UNION ALL
SELECT 
    id, 'standard', 'Standard Package', 1200.00, 'Complete registration with banking and compliance support', '7-10 business days', true,
    ARRAY['Everything in Basic', 'Bank account opening', 'Legal consultation', 'Annual compliance reminder'],
    ARRAY['Registered agent appointment', 'Local registered office', 'Corporate bylaws', 'Banking documentation']
FROM country_configurations WHERE country_code = 'CR'
UNION ALL
SELECT 
    id, 'premium', 'Premium Package', 1800.00, 'Full-service registration with ongoing legal support', '5-7 business days', false,
    ARRAY['Everything in Standard', 'Priority processing', 'Ongoing legal support', 'Tax planning consultation'],
    ARRAY['Registered agent appointment', 'Local registered office', 'Corporate bylaws', 'Tax compliance setup']
FROM country_configurations WHERE country_code = 'CR';

-- Insert sample services for Georgia
INSERT INTO country_services (country_config_id, service_id, name, price, description, category, delivery_time, is_popular)
SELECT 
    id, 'bank_account', 'Bank Account Opening', 200.00, 'Assistance with opening a corporate bank account', 'Banking', '3-5 business days', true
FROM country_configurations WHERE country_code = 'GE'
UNION ALL
SELECT 
    id, 'tax_consultation', 'Tax Consultation', 150.00, 'Professional tax planning and consultation', 'Tax', '1-2 business days', false
FROM country_configurations WHERE country_code = 'GE'
UNION ALL
SELECT 
    id, 'legal_address', 'Legal Address Service', 100.00, 'Registered office address service (annual)', 'Legal', 'Immediate', true
FROM country_configurations WHERE country_code = 'GE';

-- Insert sample services for Costa Rica
INSERT INTO country_services (country_config_id, service_id, name, price, description, category, delivery_time, is_popular)
SELECT 
    id, 'bank_account', 'Bank Account Opening', 300.00, 'Corporate bank account opening assistance', 'Banking', '5-7 business days', true
FROM country_configurations WHERE country_code = 'CR'
UNION ALL
SELECT 
    id, 'tax_registration', 'Tax Registration', 250.00, 'Complete tax registration and setup', 'Tax', '3-5 business days', false
FROM country_configurations WHERE country_code = 'CR'
UNION ALL
SELECT 
    id, 'compliance_monitoring', 'Annual Compliance', 400.00, 'Annual compliance monitoring and filing', 'Compliance', 'Ongoing', true
FROM country_configurations WHERE country_code = 'CR';

-- Migration: 20250925212758_tasks_system.sql
-- Tasks System Migration
-- This creates the tasks table and related functionality for consultant task management

-- Projects table (create first since tasks references it)
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(200) NOT NULL,
    description TEXT,
    client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
    consultant_id UUID REFERENCES consultant_profiles(id) ON DELETE CASCADE,
    service_order_id UUID REFERENCES service_orders(id) ON DELETE CASCADE,
    
    -- Project properties
    status VARCHAR(20) DEFAULT 'active', -- active, in_progress, completed, cancelled, on_hold
    priority VARCHAR(10) DEFAULT 'medium', -- low, medium, high, urgent
    progress INTEGER DEFAULT 0, -- 0-100 percentage
    budget DECIMAL(10,2),
    currency VARCHAR(3) DEFAULT 'EUR',
    
    -- Dates
    start_date DATE,
    end_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tasks table
CREATE TABLE IF NOT EXISTS tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(200) NOT NULL,
    description TEXT,
    consultant_id UUID REFERENCES consultant_profiles(id) ON DELETE CASCADE,
    client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
    service_order_id UUID REFERENCES service_orders(id) ON DELETE CASCADE,
    project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
    
    -- Task properties
    status VARCHAR(20) DEFAULT 'todo', -- todo, in_progress, review, completed, cancelled
    priority VARCHAR(10) DEFAULT 'medium', -- low, medium, high, urgent
    estimated_hours DECIMAL(5,2) DEFAULT 0,
    actual_hours DECIMAL(5,2) DEFAULT 0,
    billable BOOLEAN DEFAULT true,
    is_client_visible BOOLEAN DEFAULT true,
    
    -- Dates
    due_date DATE,
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Task comments table for communication
CREATE TABLE IF NOT EXISTS task_comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    comment TEXT NOT NULL,
    is_internal BOOLEAN DEFAULT false, -- internal comments only visible to consultant
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Task attachments table
CREATE TABLE IF NOT EXISTS task_attachments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size INTEGER,
    mime_type VARCHAR(100),
    uploaded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Function to automatically create tasks when service order is approved
CREATE OR REPLACE FUNCTION create_tasks_for_approved_order()
RETURNS TRIGGER AS $$
DECLARE
    consultant_id_var UUID;
    client_id_var UUID;
    service_name VARCHAR(200);
    project_id_var UUID;
BEGIN
    -- Only proceed if status changed to 'approved'
    IF NEW.status = 'approved' AND (OLD.status IS NULL OR OLD.status != 'approved') THEN
        
        -- Get consultant and client info
        SELECT 
            sp.consultant_id,
            NEW.client_id,
            s.name_en
        INTO 
            consultant_id_var,
            client_id_var,
            service_name
        FROM service_purchases sp
        JOIN services s ON s.id = NEW.service_id
        WHERE sp.order_id = NEW.id
        LIMIT 1;
        
        -- Create a project for this service order
        INSERT INTO projects (
            title,
            description,
            client_id,
            consultant_id,
            service_order_id,
            status,
            priority,
            start_date,
            budget,
            currency
        ) VALUES (
            service_name || ' - ' || (SELECT first_name || ' ' || last_name FROM clients WHERE id = client_id_var),
            'Project created for service: ' || service_name,
            client_id_var,
            consultant_id_var,
            NEW.id,
            'active',
            NEW.priority,
            CURRENT_DATE,
            NEW.budget,
            'EUR'
        ) RETURNING id INTO project_id_var;
        
        -- Create initial tasks based on service type
        -- Task 1: Initial consultation
        INSERT INTO tasks (
            title,
            description,
            consultant_id,
            client_id,
            service_order_id,
            project_id,
            status,
            priority,
            estimated_hours,
            is_client_visible,
            due_date
        ) VALUES (
            'Initial Consultation - ' || service_name,
            'Conduct initial consultation with client to understand requirements and expectations for ' || service_name,
            consultant_id_var,
            client_id_var,
            NEW.id,
            project_id_var,
            'todo',
            NEW.priority,
            2.0,
            true,
            CURRENT_DATE + INTERVAL '3 days'
        );
        
        -- Task 2: Document collection
        INSERT INTO tasks (
            title,
            description,
            consultant_id,
            client_id,
            service_order_id,
            project_id,
            status,
            priority,
            estimated_hours,
            is_client_visible,
            due_date
        ) VALUES (
            'Document Collection - ' || service_name,
            'Collect all necessary documents and information required for ' || service_name,
            consultant_id_var,
            client_id_var,
            NEW.id,
            project_id_var,
            'todo',
            NEW.priority,
            1.5,
            true,
            CURRENT_DATE + INTERVAL '5 days'
        );
        
        -- Task 3: Service execution
        INSERT INTO tasks (
            title,
            description,
            consultant_id,
            client_id,
            service_order_id,
            project_id,
            status,
            priority,
            estimated_hours,
            is_client_visible,
            due_date
        ) VALUES (
            'Execute Service - ' || service_name,
            'Execute the main service delivery for ' || service_name,
            consultant_id_var,
            client_id_var,
            NEW.id,
            project_id_var,
            'todo',
            NEW.priority,
            8.0,
            true,
            CASE 
                WHEN NEW.deadline IS NOT NULL THEN NEW.deadline - INTERVAL '2 days'
                ELSE CURRENT_DATE + INTERVAL '10 days'
            END
        );
        
        -- Task 4: Final delivery and review
        INSERT INTO tasks (
            title,
            description,
            consultant_id,
            client_id,
            service_order_id,
            project_id,
            status,
            priority,
            estimated_hours,
            is_client_visible,
            due_date
        ) VALUES (
            'Final Delivery - ' || service_name,
            'Complete final delivery and review with client for ' || service_name,
            consultant_id_var,
            client_id_var,
            NEW.id,
            project_id_var,
            'todo',
            NEW.priority,
            1.0,
            true,
            COALESCE(NEW.deadline, CURRENT_DATE + INTERVAL '14 days')
        );
        
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic task creation
CREATE TRIGGER trigger_create_tasks_for_approved_order
    AFTER UPDATE ON service_orders
    FOR EACH ROW
    EXECUTE FUNCTION create_tasks_for_approved_order();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_tasks_consultant_id ON tasks(consultant_id);
CREATE INDEX IF NOT EXISTS idx_tasks_client_id ON tasks(client_id);
CREATE INDEX IF NOT EXISTS idx_tasks_service_order_id ON tasks(service_order_id);
CREATE INDEX IF NOT EXISTS idx_tasks_project_id ON tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON tasks(due_date);

CREATE INDEX IF NOT EXISTS idx_projects_consultant_id ON projects(consultant_id);
CREATE INDEX IF NOT EXISTS idx_projects_client_id ON projects(client_id);
CREATE INDEX IF NOT EXISTS idx_projects_service_order_id ON projects(service_order_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);

CREATE INDEX IF NOT EXISTS idx_task_comments_task_id ON task_comments(task_id);
CREATE INDEX IF NOT EXISTS idx_task_attachments_task_id ON task_attachments(task_id);

-- Function to update task updated_at timestamp
CREATE OR REPLACE FUNCTION update_task_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updating task updated_at
CREATE TRIGGER trigger_update_task_updated_at
    BEFORE UPDATE ON tasks
    FOR EACH ROW
    EXECUTE FUNCTION update_task_updated_at();

-- Create trigger for updating project updated_at
CREATE TRIGGER trigger_update_project_updated_at
    BEFORE UPDATE ON projects
    FOR EACH ROW
    EXECUTE FUNCTION update_task_updated_at();

-- Migration: 20250925212759_fix_task_trigger.sql
-- Fix the task creation trigger function
-- This corrects the consultant_id retrieval logic

CREATE OR REPLACE FUNCTION create_tasks_for_approved_order()
RETURNS TRIGGER AS $$
DECLARE
    consultant_id_var UUID;
    client_id_var UUID;
    service_name VARCHAR(200);
    project_id_var UUID;
BEGIN
    -- Only proceed if status changed to 'approved'
    IF NEW.status = 'approved' AND (OLD.status IS NULL OR OLD.status != 'approved') THEN
        
        -- Get consultant and client info directly from the service order
        consultant_id_var := NEW.consultant_id;
        client_id_var := NEW.client_id;
        
        -- Get service name
        SELECT name_en INTO service_name
        FROM services 
        WHERE id = NEW.service_id;
        
        -- Only proceed if we have a consultant assigned
        IF consultant_id_var IS NOT NULL THEN
            
            -- Create a project for this service order
            INSERT INTO projects (
                title,
                description,
                client_id,
                consultant_id,
                service_order_id,
                status,
                priority,
                start_date,
                budget,
                currency
            ) VALUES (
                service_name || ' - ' || (SELECT first_name || ' ' || last_name FROM clients WHERE id = client_id_var),
                'Project created for service: ' || service_name,
                client_id_var,
                consultant_id_var,
                NEW.id,
                'active',
                NEW.priority,
                CURRENT_DATE,
                NEW.budget,
                'EUR'
            ) RETURNING id INTO project_id_var;
            
            -- Create initial tasks based on service type
            -- Task 1: Initial consultation
            INSERT INTO tasks (
                title,
                description,
                consultant_id,
                client_id,
                service_order_id,
                project_id,
                status,
                priority,
                estimated_hours,
                is_client_visible,
                due_date
            ) VALUES (
                'Initial Consultation - ' || service_name,
                'Conduct initial consultation with client to understand requirements and expectations for ' || service_name,
                consultant_id_var,
                client_id_var,
                NEW.id,
                project_id_var,
                'todo',
                NEW.priority,
                2.0,
                true,
                CURRENT_DATE + INTERVAL '3 days'
            );
            
            -- Task 2: Document collection
            INSERT INTO tasks (
                title,
                description,
                consultant_id,
                client_id,
                service_order_id,
                project_id,
                status,
                priority,
                estimated_hours,
                is_client_visible,
                due_date
            ) VALUES (
                'Document Collection - ' || service_name,
                'Collect all necessary documents and information required for ' || service_name,
                consultant_id_var,
                client_id_var,
                NEW.id,
                project_id_var,
                'todo',
                NEW.priority,
                1.5,
                true,
                CURRENT_DATE + INTERVAL '5 days'
            );
            
            -- Task 3: Service execution
            INSERT INTO tasks (
                title,
                description,
                consultant_id,
                client_id,
                service_order_id,
                project_id,
                status,
                priority,
                estimated_hours,
                is_client_visible,
                due_date
            ) VALUES (
                'Execute Service - ' || service_name,
                'Execute the main service delivery for ' || service_name,
                consultant_id_var,
                client_id_var,
                NEW.id,
                project_id_var,
                'todo',
                NEW.priority,
                8.0,
                true,
                CASE 
                    WHEN NEW.deadline IS NOT NULL THEN NEW.deadline - INTERVAL '2 days'
                    ELSE CURRENT_DATE + INTERVAL '10 days'
                END
            );
            
            -- Task 4: Final delivery and review
            INSERT INTO tasks (
                title,
                description,
                consultant_id,
                client_id,
                service_order_id,
                project_id,
                status,
                priority,
                estimated_hours,
                is_client_visible,
                due_date
            ) VALUES (
                'Final Delivery - ' || service_name,
                'Complete final delivery and review with client for ' || service_name,
                consultant_id_var,
                client_id_var,
                NEW.id,
                project_id_var,
                'todo',
                NEW.priority,
                1.0,
                true,
                COALESCE(NEW.deadline, CURRENT_DATE + INTERVAL '14 days')
            );
            
        END IF;
        
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Migration: 20250925212760_rename_consultant_profiles_to_user_profiles.sql
-- Migration to rename consultant_profiles to user_profiles
-- This aligns the database schema with the application code expectations

-- First, rename the table
ALTER TABLE consultant_profiles RENAME TO user_profiles;

-- Add additional columns that are expected by the application
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS full_name VARCHAR(255) GENERATED ALWAYS AS (first_name || ' ' || last_name) STORED,
ADD COLUMN IF NOT EXISTS role VARCHAR(50) DEFAULT 'consultant',
ADD COLUMN IF NOT EXISTS company VARCHAR(255),
ADD COLUMN IF NOT EXISTS avatar_url TEXT,
ADD COLUMN IF NOT EXISTS timezone VARCHAR(50) DEFAULT 'UTC',
ADD COLUMN IF NOT EXISTS commission_rate DECIMAL(5,2) DEFAULT 65.00;

-- Update foreign key constraint names to reflect the new table name
-- Note: PostgreSQL automatically updates constraint names when renaming tables,
-- but we'll ensure consistency

-- Update any indexes that reference the old table name
-- (PostgreSQL handles this automatically, but we document it for clarity)

-- Create an index on the role column for better query performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON user_profiles(role);
CREATE INDEX IF NOT EXISTS idx_user_profiles_is_active ON user_profiles(is_active);
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);

-- Update any views or functions that might reference the old table name
-- (None found in current schema, but this is where they would be updated)

-- Note: PostgreSQL automatically updates foreign key references when a table is renamed,
-- so all existing foreign key constraints will continue to work correctly.

-- Add a comment to document the change
COMMENT ON TABLE user_profiles IS 'Unified user profiles table for all user types (consultants, clients, admins). Renamed from consultant_profiles to align with application code.';

-- Migration: 20250925212761_fix_consultant_profiles_references.sql
-- Fix consultant_profiles references to user_profiles
-- This migration updates all foreign key constraints to reference the renamed table

-- Drop existing foreign key constraints that reference consultant_profiles
ALTER TABLE service_orders DROP CONSTRAINT IF EXISTS service_orders_consultant_id_fkey;
ALTER TABLE consultant_countries DROP CONSTRAINT IF EXISTS consultant_countries_consultant_id_fkey;
ALTER TABLE consultant_spoken_languages DROP CONSTRAINT IF EXISTS consultant_spoken_languages_consultant_id_fkey;
ALTER TABLE consultant_country_services DROP CONSTRAINT IF EXISTS consultant_country_services_consultant_id_fkey;
ALTER TABLE service_purchases DROP CONSTRAINT IF EXISTS service_purchases_consultant_id_fkey;
ALTER TABLE projects DROP CONSTRAINT IF EXISTS projects_consultant_id_fkey;
ALTER TABLE tasks DROP CONSTRAINT IF EXISTS tasks_consultant_id_fkey;

-- Add new foreign key constraints that reference user_profiles
ALTER TABLE service_orders ADD CONSTRAINT service_orders_consultant_id_fkey 
    FOREIGN KEY (consultant_id) REFERENCES user_profiles(id) ON DELETE CASCADE;

ALTER TABLE consultant_countries ADD CONSTRAINT consultant_countries_consultant_id_fkey 
    FOREIGN KEY (consultant_id) REFERENCES user_profiles(id) ON DELETE CASCADE;

ALTER TABLE consultant_spoken_languages ADD CONSTRAINT consultant_spoken_languages_consultant_id_fkey 
    FOREIGN KEY (consultant_id) REFERENCES user_profiles(id) ON DELETE CASCADE;

ALTER TABLE consultant_country_services ADD CONSTRAINT consultant_country_services_consultant_id_fkey 
    FOREIGN KEY (consultant_id) REFERENCES user_profiles(id) ON DELETE CASCADE;

ALTER TABLE service_purchases ADD CONSTRAINT service_purchases_consultant_id_fkey 
    FOREIGN KEY (consultant_id) REFERENCES user_profiles(id) ON DELETE CASCADE;

ALTER TABLE projects ADD CONSTRAINT projects_consultant_id_fkey 
    FOREIGN KEY (consultant_id) REFERENCES user_profiles(id) ON DELETE CASCADE;

ALTER TABLE tasks ADD CONSTRAINT tasks_consultant_id_fkey 
    FOREIGN KEY (consultant_id) REFERENCES user_profiles(id) ON DELETE CASCADE;

-- Add a comment to document the change
COMMENT ON CONSTRAINT service_orders_consultant_id_fkey ON service_orders IS 'Updated to reference user_profiles instead of consultant_profiles';

-- Migration: 20250925212762_create_order_tables.sql
-- Create missing tables for order form functionality
-- These tables are referenced in the order form code but don't exist in the database

-- Packages table (global packages)
CREATE TABLE IF NOT EXISTS packages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    delivery_time VARCHAR(50),
    features JSONB DEFAULT '[]',
    is_active BOOLEAN DEFAULT true,
    is_popular BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Additional services table
CREATE TABLE IF NOT EXISTS additional_services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    base_price DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    category VARCHAR(50),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Banks table
CREATE TABLE IF NOT EXISTS banks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    country_code VARCHAR(2),
    price DECIMAL(10,2) DEFAULT 0,
    currency VARCHAR(3) DEFAULT 'USD',
    description TEXT,
    requirements JSONB DEFAULT '[]',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for all tables
ALTER TABLE packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE additional_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE banks ENABLE ROW LEVEL SECURITY;

-- Create policies for anonymous read access (needed for order form)
CREATE POLICY "Public read access to packages" ON packages
    FOR SELECT USING (true);

CREATE POLICY "Public read access to additional_services" ON additional_services
    FOR SELECT USING (true);

CREATE POLICY "Public read access to banks" ON banks
    FOR SELECT USING (true);

-- Admin policies for full access
CREATE POLICY "Admin full access to packages" ON packages
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE user_profiles.user_id = auth.uid() 
            AND user_profiles.role = 'admin'
        )
    );

CREATE POLICY "Admin full access to additional_services" ON additional_services
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE user_profiles.user_id = auth.uid() 
            AND user_profiles.role = 'admin'
        )
    );

CREATE POLICY "Admin full access to banks" ON banks
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE user_profiles.user_id = auth.uid() 
            AND user_profiles.role = 'admin'
        )
    );

-- Update service_orders table to support the new structure
ALTER TABLE service_orders ADD COLUMN IF NOT EXISTS country_code VARCHAR(2);
ALTER TABLE service_orders ADD COLUMN IF NOT EXISTS selected_package_id UUID REFERENCES packages(id);
ALTER TABLE service_orders ADD COLUMN IF NOT EXISTS additional_service_ids UUID[] DEFAULT '{}';
ALTER TABLE service_orders ADD COLUMN IF NOT EXISTS customer_details JSONB DEFAULT '{}';
ALTER TABLE service_orders ADD COLUMN IF NOT EXISTS total_amount DECIMAL(10,2);
ALTER TABLE service_orders ADD COLUMN IF NOT EXISTS currency VARCHAR(3) DEFAULT 'USD';

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_packages_active ON packages(is_active);
CREATE INDEX IF NOT EXISTS idx_additional_services_active ON additional_services(is_active);
CREATE INDEX IF NOT EXISTS idx_banks_active ON banks(is_active);
CREATE INDEX IF NOT EXISTS idx_banks_country ON banks(country_code);

-- Insert sample data for packages
INSERT INTO packages (name, description, price, delivery_time, features, is_popular) VALUES
('Basic Company Formation', 'Standard company registration with basic documentation', 299.00, '5-7 business days', '["Company registration", "Basic documentation", "Tax ID"]', false),
('Premium Company Formation', 'Complete company setup with additional services', 599.00, '3-5 business days', '["Company registration", "Complete documentation", "Tax ID", "Bank account assistance", "Legal consultation"]', true),
('Express Company Formation', 'Fast-track company formation service', 899.00, '1-2 business days', '["Priority processing", "Company registration", "Complete documentation", "Tax ID", "Bank account assistance", "Legal consultation", "24/7 support"]', false);

-- Insert sample data for additional services
INSERT INTO additional_services (name, description, base_price, category) VALUES
('Virtual Office', 'Professional business address and mail handling', 49.00, 'office'),
('Accounting Setup', 'Initial accounting system setup and consultation', 199.00, 'accounting'),
('Legal Consultation', 'One-hour legal consultation with expert', 150.00, 'legal'),
('Tax Advisory', 'Tax planning and advisory services', 250.00, 'tax'),
('Bank Account Opening', 'Assistance with business bank account opening', 299.00, 'banking'),
('Trademark Registration', 'Business trademark registration service', 399.00, 'legal');

-- Insert sample data for banks
INSERT INTO banks (name, country_code, price, description) VALUES
('Bank of Georgia', 'GE', 0, 'Leading bank in Georgia with excellent business services'),
('TBC Bank', 'GE', 50, 'Modern digital banking solutions for businesses'),
('Liberty Bank', 'GE', 25, 'Reliable banking partner for small and medium businesses'),
('Banco Nacional', 'CR', 100, 'National bank of Costa Rica with comprehensive services'),
('Banco Popular', 'CR', 75, 'Popular choice for international businesses in Costa Rica');

-- Migration: 20250925212763_fix_country_config_rls.sql
-- Fix RLS policies for country_configurations table
-- This migration ensures anonymous users can read country configurations

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "country_configurations_select_policy" ON country_configurations;

-- Create new policy for public read access
CREATE POLICY "country_configurations_select_policy" 
ON country_configurations 
FOR SELECT 
TO public 
USING (true);

-- Ensure RLS is enabled
ALTER TABLE country_configurations ENABLE ROW LEVEL SECURITY;

-- Grant necessary permissions
GRANT SELECT ON country_configurations TO anon;
GRANT SELECT ON country_configurations TO authenticated;

-- Migration: 20250925212764_fix_user_profiles_rls.sql
-- Fix RLS policies for user_profiles table
-- This migration ensures proper access control for user profiles

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON user_profiles;
DROP POLICY IF EXISTS "Admins can manage all profiles" ON user_profiles;

-- Enable RLS on user_profiles table
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Policy 1: Users can view and update their own profile
CREATE POLICY "Users can manage own profile" 
ON user_profiles 
FOR ALL 
TO authenticated 
USING (auth.uid() = id);

-- Policy 2: Admins can view all profiles
CREATE POLICY "Admins can view all profiles" 
ON user_profiles 
FOR SELECT 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM user_profiles 
    WHERE id = auth.uid() 
    AND role = 'admin'
  )
);

-- Policy 3: Admins can manage all profiles
CREATE POLICY "Admins can manage all profiles" 
ON user_profiles 
FOR ALL 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM user_profiles 
    WHERE id = auth.uid() 
    AND role = 'admin'
  )
);

-- Grant necessary permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON user_profiles TO authenticated;

-- Add comment
COMMENT ON TABLE user_profiles IS 'User profiles with proper RLS policies for self-access and admin access';

-- Migration: 20250925212765_fix_auth_policies.sql
-- Fix authentication and user profile access policies
-- This migration addresses 403 and 500 errors in admin panel

-- First, ensure proper permissions for authenticated users on user_profiles
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Drop and recreate user_profiles policies with better error handling
DROP POLICY IF EXISTS "Users can manage own profile" ON user_profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON user_profiles;
DROP POLICY IF EXISTS "Admins can manage all profiles" ON user_profiles;

-- Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Policy 1: Users can view and update their own profile
CREATE POLICY "user_profiles_own_access" 
ON user_profiles 
FOR ALL 
TO authenticated 
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Policy 2: Admins can view all profiles
CREATE POLICY "user_profiles_admin_select" 
ON user_profiles 
FOR SELECT 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM user_profiles up
    WHERE up.id = auth.uid() 
    AND up.role = 'admin'
    AND up.is_active = true
  )
);

-- Policy 3: Admins can insert profiles
CREATE POLICY "user_profiles_admin_insert" 
ON user_profiles 
FOR INSERT
TO authenticated 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM user_profiles up
    WHERE up.id = auth.uid() 
    AND up.role = 'admin'
    AND up.is_active = true
  )
);

-- Policy 4: Admins can update profiles
CREATE POLICY "user_profiles_admin_update" 
ON user_profiles 
FOR UPDATE
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM user_profiles up
    WHERE up.id = auth.uid() 
    AND up.role = 'admin'
    AND up.is_active = true
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM user_profiles up
    WHERE up.id = auth.uid() 
    AND up.role = 'admin'
    AND up.is_active = true
  )
);

-- Policy 5: Admins can delete profiles
CREATE POLICY "user_profiles_admin_delete" 
ON user_profiles 
FOR DELETE
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM user_profiles up
    WHERE up.id = auth.uid() 
    AND up.role = 'admin'
    AND up.is_active = true
  )
);

-- Ensure auth schema permissions
GRANT USAGE ON SCHEMA auth TO authenticated;

-- Create a function to safely get user profile
CREATE OR REPLACE FUNCTION get_user_profile(user_id uuid DEFAULT auth.uid())
RETURNS TABLE (
  id uuid,
  email text,
  full_name text,
  display_name text,
  role text,
  country_id uuid,
  phone text,
  company text,
  avatar_url text,
  preferred_language text,
  timezone text,
  is_active boolean,
  metadata jsonb,
  created_at timestamptz,
  updated_at timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    up.id,
    up.email,
    up.full_name,
    up.display_name,
    up.role,
    up.country_id,
    up.phone,
    up.company,
    up.avatar_url,
    up.preferred_language,
    up.timezone,
    up.is_active,
    up.metadata,
    up.created_at,
    up.updated_at
  FROM user_profiles up
  WHERE up.id = user_id;
END;
$$;

-- Grant execute permission on the function
GRANT EXECUTE ON FUNCTION get_user_profile TO authenticated;

-- Add comment
COMMENT ON TABLE user_profiles IS 'User profiles with enhanced RLS policies for admin panel access';

-- Migration: 20250925212766_fix_rls_recursion.sql
-- Fix infinite recursion in user_profiles RLS policies
-- The issue is that admin policies check user_profiles table which creates circular dependency

-- Drop all existing policies
DROP POLICY IF EXISTS "user_profiles_own_access" ON user_profiles;
DROP POLICY IF EXISTS "user_profiles_admin_select" ON user_profiles;
DROP POLICY IF EXISTS "user_profiles_admin_insert" ON user_profiles;
DROP POLICY IF EXISTS "user_profiles_admin_update" ON user_profiles;
DROP POLICY IF EXISTS "user_profiles_admin_delete" ON user_profiles;

-- Create a function to check if user is admin using auth.jwt() instead of user_profiles
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_email text;
BEGIN
  -- Get email from JWT token
  user_email := auth.jwt() ->> 'email';
  
  -- Check if email is admin email
  RETURN user_email = 'admin@consulting19.com';
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION is_admin TO authenticated;

-- Policy 1: Users can view and update their own profile
CREATE POLICY "user_profiles_own_access" 
ON user_profiles 
FOR ALL 
TO authenticated 
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Policy 2: Admin can view all profiles (using email check instead of role check)
CREATE POLICY "user_profiles_admin_select" 
ON user_profiles 
FOR SELECT 
TO authenticated 
USING (is_admin());

-- Policy 3: Admin can insert profiles
CREATE POLICY "user_profiles_admin_insert" 
ON user_profiles 
FOR INSERT
TO authenticated 
WITH CHECK (is_admin());

-- Policy 4: Admin can update profiles
CREATE POLICY "user_profiles_admin_update" 
ON user_profiles 
FOR UPDATE
TO authenticated 
USING (is_admin())
WITH CHECK (is_admin());

-- Policy 5: Admin can delete profiles
CREATE POLICY "user_profiles_admin_delete" 
ON user_profiles 
FOR DELETE
TO authenticated 
USING (is_admin());

-- Add comment
COMMENT ON FUNCTION is_admin IS 'Check if current user is admin using JWT email instead of user_profiles to avoid recursion';

-- Migration: 20250927000001_create_documents_table.sql
-- Create documents table for consultant document management
-- This table will store both accounting documents (uploaded by clients) and official documents (uploaded by consultants)

-- Create documents table
CREATE TABLE IF NOT EXISTS documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
    consultant_id UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
    document_type VARCHAR(50) NOT NULL, -- 'accounting' or 'official'
    category VARCHAR(100), -- 'invoice', 'bank_statement', 'certificate', 'contract', etc.
    name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size INTEGER,
    mime_type VARCHAR(100),
    status VARCHAR(50) DEFAULT 'uploaded', -- 'uploaded', 'reviewed', 'approved', 'rejected'
    notes TEXT,
    amount DECIMAL(10,2), -- For accounting documents
    currency VARCHAR(3) DEFAULT 'EUR', -- For accounting documents
    transaction_date DATE, -- For accounting documents
    uploaded_by UUID REFERENCES auth.users(id),
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    reviewed_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_documents_client_id ON documents(client_id);
CREATE INDEX IF NOT EXISTS idx_documents_consultant_id ON documents(consultant_id);
CREATE INDEX IF NOT EXISTS idx_documents_document_type ON documents(document_type);
CREATE INDEX IF NOT EXISTS idx_documents_status ON documents(status);
CREATE INDEX IF NOT EXISTS idx_documents_uploaded_at ON documents(uploaded_at);

-- Enable RLS
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- RLS Policies for documents table

-- Policy 1: Clients can view and manage their own documents
CREATE POLICY "documents_client_access" 
ON documents 
FOR ALL 
TO authenticated 
USING (
    EXISTS (
        SELECT 1 FROM clients c 
        WHERE c.id = client_id 
        AND c.user_id = auth.uid()
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM clients c 
        WHERE c.id = client_id 
        AND c.user_id = auth.uid()
    )
);

-- Policy 2: Consultants can view and manage documents for their assigned clients
CREATE POLICY "documents_consultant_access" 
ON documents 
FOR ALL 
TO authenticated 
USING (
    EXISTS (
        SELECT 1 FROM user_profiles up
        JOIN service_orders so ON so.consultant_id = up.id
        WHERE up.user_id = auth.uid() 
        AND up.role = 'consultant'
        AND so.client_id = client_id
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM user_profiles up
        JOIN service_orders so ON so.consultant_id = up.id
        WHERE up.user_id = auth.uid() 
        AND up.role = 'consultant'
        AND so.client_id = client_id
    )
);

-- Policy 3: Admins can view and manage all documents
CREATE POLICY "documents_admin_access" 
ON documents 
FOR ALL 
TO authenticated 
USING (is_admin())
WITH CHECK (is_admin());

-- Create a function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_documents_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER documents_updated_at_trigger
    BEFORE UPDATE ON documents
    FOR EACH ROW
    EXECUTE FUNCTION update_documents_updated_at();

-- Grant permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON documents TO authenticated;

-- Add comment
COMMENT ON TABLE documents IS 'Document management table for consultant portal - stores both client accounting documents and consultant official documents';

-- Migration: 20250927000002_create_documents_storage.sql
-- Create storage bucket for documents
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'documents',
  'documents',
  false,
  52428800, -- 50MB limit
  ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/png', 'image/jpg']
);

-- Create storage policies for documents bucket
CREATE POLICY "Authenticated users can upload documents" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'documents');

CREATE POLICY "Users can view their own documents" ON storage.objects
FOR SELECT TO authenticated
USING (
  bucket_id = 'documents' AND (
    -- Clients can view their own documents
    EXISTS (
      SELECT 1 FROM documents d
      JOIN clients c ON c.id = d.client_id
      WHERE d.file_path = name
      AND c.user_id = auth.uid()
    )
    OR
    -- Consultants can view documents for their assigned clients
    EXISTS (
      SELECT 1 FROM documents d
      JOIN service_orders so ON so.client_id = d.client_id
      JOIN user_profiles up ON up.id = so.consultant_id
      WHERE d.file_path = name
      AND up.user_id = auth.uid()
      AND up.role = 'consultant'
    )
    OR
    -- Admins can view all documents
    EXISTS (
      SELECT 1 FROM user_profiles up
      WHERE up.user_id = auth.uid()
      AND up.role = 'admin'
    )
  )
);

CREATE POLICY "Users can update their own documents" ON storage.objects
FOR UPDATE TO authenticated
USING (
  bucket_id = 'documents' AND (
    -- Consultants can update documents for their assigned clients
    EXISTS (
      SELECT 1 FROM documents d
      JOIN service_orders so ON so.client_id = d.client_id
      JOIN user_profiles up ON up.id = so.consultant_id
      WHERE d.file_path = name
      AND up.user_id = auth.uid()
      AND up.role = 'consultant'
    )
    OR
    -- Admins can update all documents
    EXISTS (
      SELECT 1 FROM user_profiles up
      WHERE up.user_id = auth.uid()
      AND up.role = 'admin'
    )
  )
);

CREATE POLICY "Users can delete their own documents" ON storage.objects
FOR DELETE TO authenticated
USING (
  bucket_id = 'documents' AND (
    -- Consultants can delete documents for their assigned clients
    EXISTS (
      SELECT 1 FROM documents d
      JOIN service_orders so ON so.client_id = d.client_id
      JOIN user_profiles up ON up.id = so.consultant_id
      WHERE d.file_path = name
      AND up.user_id = auth.uid()
      AND up.role = 'consultant'
    )
    OR
    -- Admins can delete all documents
    EXISTS (
      SELECT 1 FROM user_profiles up
      WHERE up.user_id = auth.uid()
      AND up.role = 'admin'
    )
  )
);

-- Migration: 20250927000003_fix_clients_table_structure.sql
-- Fix clients table structure to match application expectations
-- This migration aligns the clients table with the TypeScript interfaces

-- Add missing columns to clients table
ALTER TABLE clients 
ADD COLUMN IF NOT EXISTS profile_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
ADD COLUMN IF NOT EXISTS assigned_consultant_id UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'pending')),
ADD COLUMN IF NOT EXISTS priority VARCHAR(10) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
ADD COLUMN IF NOT EXISTS notes TEXT;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_clients_profile_id ON clients(profile_id);
CREATE INDEX IF NOT EXISTS idx_clients_assigned_consultant_id ON clients(assigned_consultant_id);
CREATE INDEX IF NOT EXISTS idx_clients_status ON clients(status);
CREATE INDEX IF NOT EXISTS idx_clients_priority ON clients(priority);

-- Update existing clients to set profile_id based on user_id
-- This assumes that each client has a corresponding user_profile
UPDATE clients 
SET profile_id = (
    SELECT id FROM user_profiles 
    WHERE user_profiles.user_id = clients.user_id 
    AND user_profiles.role = 'client'
    LIMIT 1
)
WHERE profile_id IS NULL;

-- Add RLS policies for the new structure
CREATE POLICY "Clients can view own data via profile_id" ON clients
    FOR SELECT USING (
        profile_id IN (
            SELECT id FROM user_profiles WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Consultants can view assigned clients" ON clients
    FOR SELECT USING (
        assigned_consultant_id IN (
            SELECT id FROM user_profiles WHERE user_id = auth.uid() AND role = 'consultant'
        )
    );

CREATE POLICY "Admins can view all clients" ON clients
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE user_profiles.user_id = auth.uid() 
            AND user_profiles.role = 'admin'
        )
    );

-- Add comment to document the change
COMMENT ON TABLE clients IS 'Client information table updated to match application expectations with profile_id and consultant assignment support';

-- Seed Data
-- Seed data for consulting platform
-- This file populates the database with initial data

-- Insert languages
INSERT INTO languages (code, name, native_name) VALUES
('en', 'English', 'English'),
('tr', 'Turkish', 'Türkçe'),
('es', 'Spanish', 'Español'),
('pt', 'Portuguese', 'Português')
ON CONFLICT (code) DO NOTHING;

-- Insert countries
INSERT INTO countries (code, name_en, name_tr, name_es, name_pt) VALUES
('TR', 'Turkey', 'Türkiye', 'Turquía', 'Turquia'),
('US', 'United States', 'Amerika Birleşik Devletleri', 'Estados Unidos', 'Estados Unidos'),
('GB', 'United Kingdom', 'Birleşik Krallık', 'Reino Unido', 'Reino Unido'),
('DE', 'Germany', 'Almanya', 'Alemania', 'Alemanha'),
('FR', 'France', 'Fransa', 'Francia', 'França'),
('ES', 'Spain', 'İspanya', 'España', 'Espanha'),
('IT', 'Italy', 'İtalya', 'Italia', 'Itália'),
('PT', 'Portugal', 'Portekiz', 'Portugal', 'Portugal'),
('NL', 'Netherlands', 'Hollanda', 'Países Bajos', 'Países Baixos'),
('BE', 'Belgium', 'Belçika', 'Bélgica', 'Bélgica'),
('CH', 'Switzerland', 'İsviçre', 'Suiza', 'Suíça'),
('AT', 'Austria', 'Avusturya', 'Austria', 'Áustria'),
('SE', 'Sweden', 'İsveç', 'Suecia', 'Suécia'),
('NO', 'Norway', 'Norveç', 'Noruega', 'Noruega'),
('DK', 'Denmark', 'Danimarka', 'Dinamarca', 'Dinamarca'),
('FI', 'Finland', 'Finlandiya', 'Finlandia', 'Finlândia'),
('PL', 'Poland', 'Polonya', 'Polonia', 'Polônia'),
('CZ', 'Czech Republic', 'Çek Cumhuriyeti', 'República Checa', 'República Tcheca'),
('HU', 'Hungary', 'Macaristan', 'Hungría', 'Hungria'),
('GR', 'Greece', 'Yunanistan', 'Grecia', 'Grécia'),
('IE', 'Ireland', 'İrlanda', 'Irlanda', 'Irlanda'),
('LU', 'Luxembourg', 'Lüksemburg', 'Luxemburgo', 'Luxemburgo'),
('MT', 'Malta', 'Malta', 'Malta', 'Malta'),
('CY', 'Cyprus', 'Kıbrıs', 'Chipre', 'Chipre'),
('CA', 'Canada', 'Kanada', 'Canadá', 'Canadá'),
('AU', 'Australia', 'Avustralya', 'Australia', 'Austrália'),
('NZ', 'New Zealand', 'Yeni Zelanda', 'Nueva Zelanda', 'Nova Zelândia'),
('JP', 'Japan', 'Japonya', 'Japón', 'Japão'),
('KR', 'South Korea', 'Güney Kore', 'Corea del Sur', 'Coreia do Sul'),
('SG', 'Singapore', 'Singapur', 'Singapur', 'Singapura'),
('BR', 'Brazil', 'Brezilya', 'Brasil', 'Brasil'),
('MX', 'Mexico', 'Meksika', 'México', 'México'),
('AR', 'Argentina', 'Arjantin', 'Argentina', 'Argentina'),
('CL', 'Chile', 'Şili', 'Chile', 'Chile'),
('CO', 'Colombia', 'Kolombiya', 'Colombia', 'Colômbia'),
('PE', 'Peru', 'Peru', 'Perú', 'Peru'),
('UY', 'Uruguay', 'Uruguay', 'Uruguay', 'Uruguai'),
('PY', 'Paraguay', 'Paraguay', 'Paraguay', 'Paraguai'),
('BO', 'Bolivia', 'Bolivya', 'Bolivia', 'Bolívia'),
('EC', 'Ecuador', 'Ekvador', 'Ecuador', 'Equador'),
('VE', 'Venezuela', 'Venezuela', 'Venezuela', 'Venezuela'),
('CR', 'Costa Rica', 'Kosta Rika', 'Costa Rica', 'Costa Rica'),
('PA', 'Panama', 'Panama', 'Panamá', 'Panamá'),
('GT', 'Guatemala', 'Guatemala', 'Guatemala', 'Guatemala'),
('HN', 'Honduras', 'Honduras', 'Honduras', 'Honduras'),
('SV', 'El Salvador', 'El Salvador', 'El Salvador', 'El Salvador'),
('NI', 'Nicaragua', 'Nikaragua', 'Nicaragua', 'Nicarágua'),
('BZ', 'Belize', 'Belize', 'Belice', 'Belize'),
('DO', 'Dominican Republic', 'Dominik Cumhuriyeti', 'República Dominicana', 'República Dominicana'),
('CU', 'Cuba', 'Küba', 'Cuba', 'Cuba'),
('JM', 'Jamaica', 'Jamaika', 'Jamaica', 'Jamaica'),
('TT', 'Trinidad and Tobago', 'Trinidad ve Tobago', 'Trinidad y Tobago', 'Trinidad e Tobago'),
('BB', 'Barbados', 'Barbados', 'Barbados', 'Barbados')
ON CONFLICT (code) DO NOTHING;

-- Insert service categories
INSERT INTO service_categories (name_en, name_tr, name_es, name_pt, description_en, description_tr, description_es, description_pt) VALUES
('Business Consulting', 'İş Danışmanlığı', 'Consultoría Empresarial', 'Consultoria Empresarial', 'Strategic business advice and planning', 'Stratejik iş tavsiyesi ve planlama', 'Asesoramiento y planificación estratégica empresarial', 'Aconselhamento e planejamento estratégico de negócios'),
('Legal Services', 'Hukuki Hizmetler', 'Servicios Legales', 'Serviços Jurídicos', 'Legal advice and representation', 'Hukuki tavsiye ve temsil', 'Asesoramiento legal y representación', 'Aconselhamento jurídico e representação'),
('Tax Consulting', 'Vergi Danışmanlığı', 'Consultoría Fiscal', 'Consultoria Fiscal', 'Tax planning and compliance services', 'Vergi planlama ve uyum hizmetleri', 'Servicios de planificación fiscal y cumplimiento', 'Serviços de planejamento tributário e conformidade'),
('Immigration Services', 'Göçmenlik Hizmetleri', 'Servicios de Inmigración', 'Serviços de Imigração', 'Immigration and visa assistance', 'Göçmenlik ve vize yardımı', 'Asistencia de inmigración y visas', 'Assistência de imigração e visto'),
('Real Estate', 'Gayrimenkul', 'Bienes Raíces', 'Imobiliário', 'Property investment and management', 'Mülk yatırımı ve yönetimi', 'Inversión y gestión inmobiliaria', 'Investimento e gestão imobiliária'),
('Financial Planning', 'Finansal Planlama', 'Planificación Financiera', 'Planejamento Financeiro', 'Personal and business financial planning', 'Kişisel ve işletme finansal planlaması', 'Planificación financiera personal y empresarial', 'Planejamento financeiro pessoal e empresarial'),
('Education Services', 'Eğitim Hizmetleri', 'Servicios Educativos', 'Serviços Educacionais', 'Educational consulting and planning', 'Eğitim danışmanlığı ve planlama', 'Consultoría y planificación educativa', 'Consultoria e planejamento educacional'),
('Healthcare Services', 'Sağlık Hizmetleri', 'Servicios de Salud', 'Serviços de Saúde', 'Healthcare and medical consulting', 'Sağlık ve tıbbi danışmanlık', 'Consultoría médica y de salud', 'Consultoria médica e de saúde'),
('Technology Consulting', 'Teknoloji Danışmanlığı', 'Consultoría Tecnológica', 'Consultoria Tecnológica', 'IT and technology solutions', 'BT ve teknoloji çözümleri', 'Soluciones de TI y tecnología', 'Soluções de TI e tecnologia'),
('Marketing Services', 'Pazarlama Hizmetleri', 'Servicios de Marketing', 'Serviços de Marketing', 'Marketing and advertising consulting', 'Pazarlama ve reklam danışmanlığı', 'Consultoría de marketing y publicidad', 'Consultoria de marketing e publicidade')
ON CONFLICT DO NOTHING;

-- Insert some basic services
INSERT INTO services (category_id, name_en, name_tr, name_es, name_pt, description_en, description_tr, description_es, description_pt, base_price) VALUES
(1, 'Business Plan Development', 'İş Planı Geliştirme', 'Desarrollo de Plan de Negocios', 'Desenvolvimento de Plano de Negócios', 'Comprehensive business plan creation', 'Kapsamlı iş planı oluşturma', 'Creación integral de plan de negocios', 'Criação abrangente de plano de negócios', 500.00),
(1, 'Market Research', 'Pazar Araştırması', 'Investigación de Mercado', 'Pesquisa de Mercado', 'Market analysis and research services', 'Pazar analizi ve araştırma hizmetleri', 'Servicios de análisis e investigación de mercado', 'Serviços de análise e pesquisa de mercado', 300.00),
(2, 'Contract Review', 'Sözleşme İncelemesi', 'Revisión de Contratos', 'Revisão de Contratos', 'Legal contract review and advice', 'Hukuki sözleşme incelemesi ve tavsiye', 'Revisión legal de contratos y asesoramiento', 'Revisão legal de contratos e aconselhamento', 200.00),
(2, 'Company Formation', 'Şirket Kuruluşu', 'Formación de Empresa', 'Formação de Empresa', 'Business entity formation services', 'İş varlığı oluşturma hizmetleri', 'Servicios de formación de entidades comerciales', 'Serviços de formação de entidades comerciais', 800.00),
(3, 'Tax Return Preparation', 'Vergi Beyannamesi Hazırlama', 'Preparación de Declaración de Impuestos', 'Preparação de Declaração de Impostos', 'Personal and business tax returns', 'Kişisel ve işletme vergi beyannameleri', 'Declaraciones de impuestos personales y comerciales', 'Declarações de impostos pessoais e comerciais', 150.00),
(4, 'Visa Application Assistance', 'Vize Başvuru Yardımı', 'Asistencia para Solicitud de Visa', 'Assistência para Solicitação de Visto', 'Help with visa applications and documentation', 'Vize başvuruları ve belgelendirme konusunda yardım', 'Ayuda con solicitudes de visa y documentación', 'Ajuda com solicitações de visto e documentação', 250.00),
(5, 'Property Investment Advice', 'Mülk Yatırım Tavsiyesi', 'Asesoramiento de Inversión Inmobiliaria', 'Aconselhamento de Investimento Imobiliário', 'Real estate investment consulting', 'Gayrimenkul yatırım danışmanlığı', 'Consultoría de inversión inmobiliaria', 'Consultoria de investimento imobiliário', 400.00)
ON CONFLICT DO NOTHING;

