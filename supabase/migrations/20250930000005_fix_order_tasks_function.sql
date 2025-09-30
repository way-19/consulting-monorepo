-- Fix create_order_tasks function to use correct consultant_id reference
-- The issue: service_orders.consultant_id references user_profiles(id)
-- But order_tasks.consultant_id references auth.users(id)
-- We need to get the user_id from user_profiles for order_tasks

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
    consultant_auth_id UUID;
    client_auth_id UUID;
    i INTEGER;
BEGIN
    -- Only create tasks if order has a consultant assigned and status is 'pending' or 'approved'
    IF NEW.consultant_id IS NOT NULL AND NEW.status IN ('pending', 'approved') THEN
        
        -- Get the auth.users id for consultant (NEW.consultant_id is from user_profiles)
        SELECT user_id INTO consultant_auth_id 
        FROM user_profiles 
        WHERE id = NEW.consultant_id;
        
        -- Get the auth.users id for client (NEW.client_id is from clients table)
        SELECT user_id INTO client_auth_id 
        FROM clients 
        WHERE id = NEW.client_id;
        
        -- Check if we found the auth user IDs
        IF consultant_auth_id IS NULL THEN
            RAISE EXCEPTION 'Could not find auth user ID for consultant profile ID: %', NEW.consultant_id;
        END IF;
        
        IF client_auth_id IS NULL THEN
            RAISE EXCEPTION 'Could not find auth user ID for client ID: %', NEW.client_id;
        END IF;
        
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
                    consultant_auth_id, -- Use auth.users id
                    client_auth_id,     -- Use auth.users id  
                    task_titles[i],
                    task_descriptions[i],
                    task_types[i],
                    CASE WHEN i = 1 THEN 'pending' ELSE 'pending' END,
                    NEW.priority,
                    estimated_hours_array[i],
                    CURRENT_DATE + (i * 2) * INTERVAL '1 day'
                );
            END LOOP;
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
