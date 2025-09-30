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