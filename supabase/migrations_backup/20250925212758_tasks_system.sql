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