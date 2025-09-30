-- Order-based Task System Migration V2
-- This migration creates the new order-based task system where orders from the order form
-- automatically create tasks for consultants based on country assignment

-- First, let's enhance the service_orders table to support the new order form structure
ALTER TABLE service_orders ADD COLUMN IF NOT EXISTS order_type VARCHAR(50) DEFAULT 'service'; -- service, physical_redirection, company_formation
ALTER TABLE service_orders ADD COLUMN IF NOT EXISTS order_data JSONB DEFAULT '{}'; -- Store order form data
ALTER TABLE service_orders ADD COLUMN IF NOT EXISTS country_code VARCHAR(2); -- For automatic consultant assignment
ALTER TABLE service_orders ADD COLUMN IF NOT EXISTS auto_assigned BOOLEAN DEFAULT false; -- Track if consultant was auto-assigned
ALTER TABLE service_orders ADD COLUMN IF NOT EXISTS commission_rate DECIMAL(5,2) DEFAULT 10.00; -- Commission percentage
ALTER TABLE service_orders ADD COLUMN IF NOT EXISTS commission_amount DECIMAL(10,2); -- Calculated commission amount
ALTER TABLE service_orders ADD COLUMN IF NOT EXISTS commission_status VARCHAR(20) DEFAULT 'pending'; -- pending, calculated, paid

-- Drop existing consultant_countries table and recreate for order assignment
DROP TABLE IF EXISTS consultant_countries CASCADE;

-- Create new consultant_countries table for automatic assignment
CREATE TABLE consultant_countries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    consultant_id UUID REFERENCES auth.users(id) ON DELETE CASCADE, -- Reference to user instead of consultant_profiles
    country_code VARCHAR(2) NOT NULL,
    is_primary BOOLEAN DEFAULT false, -- Primary consultant for this country
    max_orders_per_month INTEGER DEFAULT 50, -- Workload management
    current_month_orders INTEGER DEFAULT 0, -- Current month order count
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(consultant_id, country_code)
);

-- Create order_tasks table (enhanced tasks specifically for orders)
CREATE TABLE IF NOT EXISTS order_tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES service_orders(id) ON DELETE CASCADE,
    consultant_id UUID REFERENCES auth.users(id) ON DELETE CASCADE, -- Reference to user instead of consultant_profiles
    client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
    
    -- Task details
    title VARCHAR(200) NOT NULL,
    description TEXT,
    task_type VARCHAR(50) NOT NULL, -- consultation, document_collection, processing, delivery, follow_up
    status VARCHAR(20) DEFAULT 'pending', -- pending, in_progress, completed, cancelled
    priority VARCHAR(10) DEFAULT 'medium', -- low, medium, high, urgent
    
    -- Time tracking
    estimated_hours DECIMAL(5,2) DEFAULT 0,
    actual_hours DECIMAL(5,2) DEFAULT 0,
    
    -- Dates
    due_date DATE,
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create order_status_history table for tracking status changes
CREATE TABLE IF NOT EXISTS order_status_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES service_orders(id) ON DELETE CASCADE,
    old_status VARCHAR(20),
    new_status VARCHAR(20) NOT NULL,
    changed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Function to automatically assign consultant based on country
CREATE OR REPLACE FUNCTION auto_assign_consultant_by_country()
RETURNS TRIGGER AS $$
DECLARE
    assigned_consultant_id UUID;
    consultant_record RECORD;
BEGIN
    -- Only proceed if this is a new order with a country_code and not already assigned
    IF NEW.country_code IS NOT NULL AND NEW.consultant_id IS NULL AND NEW.auto_assigned = false THEN
        
        -- Find the best consultant for this country
        -- Priority: primary consultant with lowest current workload
        SELECT 
            cc.consultant_id,
            cc.current_month_orders,
            u.id
        INTO consultant_record
        FROM consultant_countries cc
        JOIN auth.users u ON u.id = cc.consultant_id
        WHERE cc.country_code = NEW.country_code
        AND cc.current_month_orders < cc.max_orders_per_month
        ORDER BY 
            cc.is_primary DESC, -- Primary consultants first
            cc.current_month_orders ASC, -- Lowest workload first
            RANDOM() -- Random selection if tied
        LIMIT 1;
        
        -- If we found a consultant, assign them
        IF consultant_record.consultant_id IS NOT NULL THEN
            NEW.consultant_id := consultant_record.consultant_id;
            NEW.auto_assigned := true;
            
            -- Update consultant's current month order count
            UPDATE consultant_countries 
            SET 
                current_month_orders = current_month_orders + 1,
                updated_at = NOW()
            WHERE consultant_id = consultant_record.consultant_id 
            AND country_code = NEW.country_code;
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to create order tasks when order is created/updated
CREATE OR REPLACE FUNCTION create_order_tasks()
RETURNS TRIGGER AS $$
DECLARE
    task_titles TEXT[] := ARRAY[
        'Initial Consultation',
        'Document Collection & Review', 
        'Order Processing',
        'Quality Check & Delivery',
        'Follow-up & Support'
    ];
    task_descriptions TEXT[] := ARRAY[
        'Conduct initial consultation with client to understand requirements',
        'Collect and review all necessary documents from client',
        'Process the order according to service requirements',
        'Perform quality check and deliver completed service to client',
        'Follow up with client and provide ongoing support'
    ];
    task_types TEXT[] := ARRAY[
        'consultation',
        'document_collection',
        'processing', 
        'delivery',
        'follow_up'
    ];
    estimated_hours_array DECIMAL[] := ARRAY[1.0, 2.0, 4.0, 1.0, 0.5];
    i INTEGER;
BEGIN
    -- Only create tasks if order has a consultant assigned and status is 'pending' or 'approved'
    IF NEW.consultant_id IS NOT NULL AND NEW.status IN ('pending', 'approved') THEN
        
        -- Check if tasks already exist for this order
        IF NOT EXISTS (SELECT 1 FROM order_tasks WHERE order_id = NEW.id) THEN
            
            -- Create tasks for this order
            FOR i IN 1..array_length(task_titles, 1) LOOP
                INSERT INTO order_tasks (
                    order_id,
                    consultant_id,
                    client_id,
                    title,
                    description,
                    task_type,
                    status,
                    priority,
                    estimated_hours,
                    due_date
                ) VALUES (
                    NEW.id,
                    NEW.consultant_id,
                    NEW.client_id,
                    task_titles[i],
                    task_descriptions[i],
                    task_types[i],
                    CASE WHEN i = 1 THEN 'pending' ELSE 'pending' END, -- First task starts as pending
                    NEW.priority,
                    estimated_hours_array[i],
                    CURRENT_DATE + (i * 2) * INTERVAL '1 day' -- Stagger due dates
                );
            END LOOP;
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to calculate commission when order is paid
CREATE OR REPLACE FUNCTION calculate_commission()
RETURNS TRIGGER AS $$
BEGIN
    -- Calculate commission when status changes to 'paid'
    IF NEW.status = 'paid' AND (OLD.status IS NULL OR OLD.status != 'paid') THEN
        NEW.commission_amount := (NEW.total_amount * NEW.commission_rate / 100);
        NEW.commission_status := 'calculated';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to track status changes
CREATE OR REPLACE FUNCTION track_order_status_change()
RETURNS TRIGGER AS $$
BEGIN
    -- Insert status change record if status actually changed
    IF OLD.status IS DISTINCT FROM NEW.status THEN
        INSERT INTO order_status_history (
            order_id,
            old_status,
            new_status,
            changed_by
        ) VALUES (
            NEW.id,
            OLD.status,
            NEW.status,
            auth.uid()
        );
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
CREATE TRIGGER trigger_auto_assign_consultant
    BEFORE INSERT OR UPDATE ON service_orders
    FOR EACH ROW
    EXECUTE FUNCTION auto_assign_consultant_by_country();

CREATE TRIGGER trigger_create_order_tasks
    AFTER INSERT OR UPDATE ON service_orders
    FOR EACH ROW
    EXECUTE FUNCTION create_order_tasks();

CREATE TRIGGER trigger_calculate_commission
    BEFORE UPDATE ON service_orders
    FOR EACH ROW
    EXECUTE FUNCTION calculate_commission();

CREATE TRIGGER trigger_track_status_change
    AFTER UPDATE ON service_orders
    FOR EACH ROW
    EXECUTE FUNCTION track_order_status_change();

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_consultant_countries_country_code ON consultant_countries(country_code);
CREATE INDEX IF NOT EXISTS idx_consultant_countries_consultant_id ON consultant_countries(consultant_id);
CREATE INDEX IF NOT EXISTS idx_consultant_countries_primary ON consultant_countries(is_primary);

CREATE INDEX IF NOT EXISTS idx_order_tasks_order_id ON order_tasks(order_id);
CREATE INDEX IF NOT EXISTS idx_order_tasks_consultant_id ON order_tasks(consultant_id);
CREATE INDEX IF NOT EXISTS idx_order_tasks_status ON order_tasks(status);
CREATE INDEX IF NOT EXISTS idx_order_tasks_task_type ON order_tasks(task_type);

CREATE INDEX IF NOT EXISTS idx_service_orders_country_code ON service_orders(country_code);
CREATE INDEX IF NOT EXISTS idx_service_orders_auto_assigned ON service_orders(auto_assigned);
CREATE INDEX IF NOT EXISTS idx_service_orders_commission_status ON service_orders(commission_status);

CREATE INDEX IF NOT EXISTS idx_order_status_history_order_id ON order_status_history(order_id);

-- Enable RLS
ALTER TABLE consultant_countries ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_status_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies for consultant_countries
CREATE POLICY "Consultants can view own countries" ON consultant_countries
    FOR SELECT USING (
        consultant_id = auth.uid()
    );

CREATE POLICY "Admins can manage consultant countries" ON consultant_countries
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE user_profiles.user_id = auth.uid() 
            AND user_profiles.role = 'admin'
        )
    );

-- RLS Policies for order_tasks
CREATE POLICY "Consultants can view own order tasks" ON order_tasks
    FOR SELECT USING (
        consultant_id = auth.uid()
    );

CREATE POLICY "Consultants can update own order tasks" ON order_tasks
    FOR UPDATE USING (
        consultant_id = auth.uid()
    );

CREATE POLICY "Clients can view their order tasks" ON order_tasks
    FOR SELECT USING (
        client_id IN (
            SELECT id FROM clients WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Admins can manage all order tasks" ON order_tasks
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE user_profiles.user_id = auth.uid() 
            AND user_profiles.role = 'admin'
        )
    );

-- RLS Policies for order_status_history
CREATE POLICY "Users can view order status history for their orders" ON order_status_history
    FOR SELECT USING (
        order_id IN (
            SELECT so.id FROM service_orders so
            WHERE so.consultant_id = auth.uid()
            OR so.client_id IN (
                SELECT id FROM clients WHERE user_id = auth.uid()
            )
        )
    );

CREATE POLICY "Admins can view all order status history" ON order_status_history
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE user_profiles.user_id = auth.uid() 
            AND user_profiles.role = 'admin'
        )
    );

-- Insert sample consultant-country assignments
INSERT INTO consultant_countries (consultant_id, country_code, is_primary, max_orders_per_month) 
SELECT 
    u.id,
    'GE', -- Georgia
    true,
    30
FROM auth.users u
JOIN user_profiles up ON up.user_id = u.id
WHERE up.role = 'consultant'
LIMIT 1;

INSERT INTO consultant_countries (consultant_id, country_code, is_primary, max_orders_per_month) 
SELECT 
    u.id,
    'CR', -- Costa Rica
    true,
    25
FROM auth.users u
JOIN user_profiles up ON up.user_id = u.id
WHERE up.role = 'consultant'
LIMIT 1;

-- Function to reset monthly order counts (should be called monthly via cron)
CREATE OR REPLACE FUNCTION reset_monthly_order_counts()
RETURNS void AS $$
BEGIN
    UPDATE consultant_countries 
    SET 
        current_month_orders = 0,
        updated_at = NOW()
    WHERE current_month_orders > 0;
END;
$$ LANGUAGE plpgsql;

-- Add comment
COMMENT ON TABLE consultant_countries IS 'Maps consultants to countries for automatic order assignment';
COMMENT ON TABLE order_tasks IS 'Tasks created automatically from orders for consultant workflow';
COMMENT ON TABLE order_status_history IS 'Tracks all status changes for orders for audit trail';