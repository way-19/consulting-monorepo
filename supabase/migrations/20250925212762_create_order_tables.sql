-- Create missing tables for order form functionality
-- These tables are referenced in the order form code but don't exist in the database

-- Packages table (global packages)
CREATE TABLE IF NOT EXISTS packages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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
