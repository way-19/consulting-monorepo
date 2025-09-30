-- ============================================
-- REPLIT POSTGRESQL MIGRATION
-- Schema from Supabase (47 tables)
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Core user and auth tables
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    first_name VARCHAR,
    last_name VARCHAR,
    email VARCHAR NOT NULL UNIQUE,
    phone VARCHAR,
    bio_en TEXT,
    bio_tr TEXT,
    bio_es TEXT,
    bio_pt TEXT,
    experience_years INTEGER DEFAULT 0,
    hourly_rate NUMERIC,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    role VARCHAR NOT NULL,
    company VARCHAR,
    avatar_url VARCHAR,
    timezone VARCHAR DEFAULT 'UTC',
    commission_rate NUMERIC DEFAULT 65.00,
    backup_codes JSONB DEFAULT '[]',
    country_id INTEGER,
    display_name VARCHAR,
    preferred_language VARCHAR DEFAULT 'en',
    metadata JSONB DEFAULT '{}',
    storage_limit_gb INTEGER DEFAULT 5,
    storage_used_bytes BIGINT DEFAULT 0,
    last_file_cleanup_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS clients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID,
    profile_id UUID,
    first_name VARCHAR NOT NULL,
    last_name VARCHAR NOT NULL,
    email VARCHAR NOT NULL,
    phone VARCHAR,
    company_name VARCHAR,
    country_code VARCHAR,
    preferred_language VARCHAR DEFAULT 'en',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    assigned_consultant_id UUID,
    status VARCHAR DEFAULT 'active',
    priority VARCHAR DEFAULT 'medium',
    notes TEXT
);

-- Country and location tables
CREATE TABLE IF NOT EXISTS countries (
    id SERIAL PRIMARY KEY,
    code VARCHAR NOT NULL UNIQUE,
    name_en VARCHAR,
    name_tr VARCHAR,
    name_es VARCHAR,
    name_pt VARCHAR,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS country_configurations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    country_code VARCHAR NOT NULL,
    country_name VARCHAR,
    is_active BOOLEAN DEFAULT true,
    currency VARCHAR,
    language VARCHAR,
    time_zone VARCHAR,
    date_format VARCHAR,
    minimum_capital NUMERIC,
    minimum_directors INTEGER,
    minimum_shareholders INTEGER,
    requires_local_director BOOLEAN DEFAULT false,
    requires_local_address BOOLEAN DEFAULT false,
    allows_foreign_ownership BOOLEAN DEFAULT true,
    processing_time VARCHAR,
    popularity INTEGER DEFAULT 0,
    description TEXT,
    benefits TEXT[],
    requirements TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Service and order tables
CREATE TABLE IF NOT EXISTS services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR NOT NULL,
    name_en VARCHAR,
    name_tr VARCHAR,
    name_pt VARCHAR,
    description TEXT,
    description_en TEXT,
    description_tr TEXT,
    description_pt TEXT,
    price NUMERIC NOT NULL,
    currency VARCHAR DEFAULT 'USD',
    category VARCHAR,
    is_active BOOLEAN DEFAULT true,
    features TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS service_orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number VARCHAR UNIQUE,
    client_id UUID NOT NULL,
    consultant_id UUID,
    service_id UUID NOT NULL,
    country_code VARCHAR,
    status VARCHAR DEFAULT 'pending',
    company_name VARCHAR,
    company_type VARCHAR,
    total_amount NUMERIC NOT NULL,
    currency VARCHAR DEFAULT 'USD',
    payment_status VARCHAR DEFAULT 'unpaid',
    payment_intent_id VARCHAR,
    order_data JSONB DEFAULT '{}',
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    package_id UUID,
    stripe_session_id VARCHAR
);

-- Task management
CREATE TABLE IF NOT EXISTS tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR NOT NULL,
    description TEXT,
    client_id UUID,
    consultant_id UUID NOT NULL,
    project_id UUID,
    order_id UUID,
    status VARCHAR DEFAULT 'todo',
    priority VARCHAR DEFAULT 'medium',
    due_date TIMESTAMPTZ,
    estimated_hours NUMERIC DEFAULT 0,
    actual_hours NUMERIC DEFAULT 0,
    billable BOOLEAN DEFAULT true,
    is_client_visible BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS task_comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_id UUID NOT NULL,
    user_id UUID NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS task_attachments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_id UUID NOT NULL,
    file_name VARCHAR NOT NULL,
    file_path VARCHAR NOT NULL,
    file_size INTEGER,
    mime_type VARCHAR,
    uploaded_by UUID NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Projects
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR NOT NULL,
    description TEXT,
    client_id UUID NOT NULL,
    consultant_id UUID,
    status VARCHAR DEFAULT 'active',
    progress INTEGER DEFAULT 0,
    start_date DATE,
    end_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Messages and communication
CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sender_id UUID NOT NULL,
    recipient_id UUID,
    receiver_id UUID,
    order_id UUID,
    subject VARCHAR,
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS message_attachments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    message_id UUID NOT NULL,
    file_name VARCHAR NOT NULL,
    file_path VARCHAR NOT NULL,
    file_size INTEGER,
    mime_type VARCHAR,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Meetings
CREATE TABLE IF NOT EXISTS meetings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR NOT NULL,
    description TEXT,
    client_id UUID NOT NULL,
    consultant_id UUID NOT NULL,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    meeting_type VARCHAR DEFAULT 'video',
    status VARCHAR DEFAULT 'scheduled',
    meeting_url TEXT,
    location TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Documents
CREATE TABLE IF NOT EXISTS documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID,
    consultant_id UUID,
    document_type VARCHAR,
    category VARCHAR,
    name VARCHAR NOT NULL,
    file_path VARCHAR NOT NULL,
    file_size INTEGER,
    mime_type VARCHAR,
    status VARCHAR DEFAULT 'pending',
    notes TEXT,
    amount NUMERIC,
    currency VARCHAR,
    transaction_date DATE,
    uploaded_by UUID,
    uploaded_at TIMESTAMPTZ DEFAULT NOW(),
    reviewed_at TIMESTAMPTZ,
    reviewed_by UUID,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS accounting_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID,
    user_id UUID,
    name TEXT NOT NULL,
    type TEXT,
    category TEXT,
    file_url TEXT NOT NULL,
    file_size BIGINT,
    amount NUMERIC,
    currency TEXT DEFAULT 'USD',
    transaction_date DATE,
    status TEXT DEFAULT 'pending',
    notes TEXT,
    uploaded_at TIMESTAMPTZ DEFAULT NOW(),
    reviewed_at TIMESTAMPTZ,
    reviewed_by UUID,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User assignments (consultant-client relationships)
CREATE TABLE IF NOT EXISTS user_assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    consultant_id UUID NOT NULL,
    client_id UUID NOT NULL,
    status VARCHAR DEFAULT 'active',
    assigned_at TIMESTAMPTZ DEFAULT NOW(),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Additional service tables
CREATE TABLE IF NOT EXISTS additional_services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR NOT NULL,
    description TEXT,
    base_price NUMERIC NOT NULL,
    currency VARCHAR DEFAULT 'USD',
    category VARCHAR,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS banks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR NOT NULL,
    country_code VARCHAR,
    price NUMERIC,
    currency VARCHAR DEFAULT 'USD',
    description TEXT,
    requirements JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Audit and logs
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID,
    action_type VARCHAR NOT NULL,
    table_name VARCHAR,
    record_id UUID,
    description TEXT,
    ip_address INET,
    user_agent TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Commission and payouts
CREATE TABLE IF NOT EXISTS commission_payouts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    consultant_id UUID NOT NULL,
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    total_amount NUMERIC NOT NULL,
    commission_rate NUMERIC,
    status VARCHAR DEFAULT 'pending',
    processed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS commission_payout_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    payout_id UUID NOT NULL,
    purchase_id UUID,
    service_amount NUMERIC NOT NULL,
    commission_amount NUMERIC NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Blog and content
CREATE TABLE IF NOT EXISTS blog_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    author_id UUID,
    title_en VARCHAR,
    title_tr VARCHAR,
    title_es VARCHAR,
    title_pt VARCHAR,
    slug VARCHAR UNIQUE,
    content_en TEXT,
    content_tr TEXT,
    content_es TEXT,
    content_pt TEXT,
    excerpt_en TEXT,
    excerpt_tr TEXT,
    excerpt_es TEXT,
    excerpt_pt TEXT,
    featured_image VARCHAR,
    is_published BOOLEAN DEFAULT false,
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS faqs (
    id SERIAL PRIMARY KEY,
    category VARCHAR,
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
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Languages
CREATE TABLE IF NOT EXISTS languages (
    id SERIAL PRIMARY KEY,
    code VARCHAR NOT NULL UNIQUE,
    name VARCHAR NOT NULL,
    native_name VARCHAR,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Consultant related
CREATE TABLE IF NOT EXISTS consultant_assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID NOT NULL,
    consultant_id UUID NOT NULL,
    assigned_at TIMESTAMPTZ DEFAULT NOW(),
    assigned_by UUID,
    is_active BOOLEAN DEFAULT true,
    status VARCHAR DEFAULT 'active',
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS consultant_countries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    consultant_id UUID NOT NULL,
    country_code VARCHAR NOT NULL,
    is_primary BOOLEAN DEFAULT false,
    max_orders_per_month INTEGER,
    current_month_orders INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS consultant_country_services (
    id SERIAL PRIMARY KEY,
    consultant_id UUID NOT NULL,
    country_id INTEGER,
    service_id INTEGER,
    custom_price NUMERIC,
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS consultant_spoken_languages (
    id SERIAL PRIMARY KEY,
    consultant_id UUID NOT NULL,
    language_id INTEGER NOT NULL,
    proficiency_level VARCHAR,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON user_profiles(role);
CREATE INDEX IF NOT EXISTS idx_clients_profile_id ON clients(profile_id);
CREATE INDEX IF NOT EXISTS idx_clients_assigned_consultant ON clients(assigned_consultant_id);
CREATE INDEX IF NOT EXISTS idx_tasks_consultant_id ON tasks(consultant_id);
CREATE INDEX IF NOT EXISTS idx_tasks_client_id ON tasks(client_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_messages_sender ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_receiver ON messages(receiver_id);
CREATE INDEX IF NOT EXISTS idx_service_orders_client ON service_orders(client_id);
CREATE INDEX IF NOT EXISTS idx_service_orders_consultant ON service_orders(consultant_id);
CREATE INDEX IF NOT EXISTS idx_user_assignments_consultant ON user_assignments(consultant_id);
CREATE INDEX IF NOT EXISTS idx_user_assignments_client ON user_assignments(client_id);
