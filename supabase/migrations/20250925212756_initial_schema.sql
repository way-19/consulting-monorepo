-- Initial Schema for Consulting Platform
-- This creates all the necessary tables and relationships

-- Enable necessary extensions
-- Note: gen_random_uuid() is available by default in Supabase

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
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    payout_id UUID REFERENCES commission_payouts(id) ON DELETE CASCADE,
    purchase_id UUID REFERENCES service_purchases(id) ON DELETE CASCADE,
    service_amount DECIMAL(10,2) NOT NULL,
    commission_amount DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Messages table for communication
CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    message_id UUID REFERENCES messages(id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size INTEGER,
    mime_type VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Conversation participants table
CREATE TABLE IF NOT EXISTS conversation_participants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES service_orders(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(order_id, user_id)
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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
