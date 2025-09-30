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