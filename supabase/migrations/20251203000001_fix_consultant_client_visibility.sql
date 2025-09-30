-- Fix UUID extension and Consultant-Client Visibility RLS Policies
-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. Allow clients to view their assigned consultant's profile
DROP POLICY IF EXISTS "clients_can_view_assigned_consultant_profile" ON consultant_profiles;
CREATE POLICY "clients_can_view_assigned_consultant_profile" 
ON consultant_profiles 
FOR SELECT 
TO authenticated 
USING (
  user_id IN (
    SELECT assigned_consultant_id 
    FROM clients 
    WHERE user_id = auth.uid()
    AND assigned_consultant_id IS NOT NULL
  )
);

-- 2. Allow consultants to view their assigned clients' profiles
DROP POLICY IF EXISTS "consultants_can_view_assigned_clients_profiles" ON user_profiles;
CREATE POLICY "consultants_can_view_assigned_clients_profiles" 
ON user_profiles 
FOR SELECT 
TO authenticated 
USING (
  -- User can view their own profile
  user_id = auth.uid()
  OR
  -- Consultants can view their assigned clients' profiles
  user_id IN (
    SELECT user_id 
    FROM clients 
    WHERE assigned_consultant_id = auth.uid()
  )
  OR
  -- Admins can view all profiles
  EXISTS (
    SELECT 1 FROM user_profiles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'
  )
);

-- 3. Allow consultants to view their assigned clients' details
DROP POLICY IF EXISTS "consultants_can_view_assigned_clients" ON clients;
CREATE POLICY "consultants_can_view_assigned_clients" 
ON clients 
FOR SELECT 
TO authenticated 
USING (
  -- Users can view their own client record
  user_id = auth.uid()
  OR
  -- Consultants can view their assigned clients
  assigned_consultant_id = auth.uid()
  OR
  -- Admins can view all clients
  EXISTS (
    SELECT 1 FROM user_profiles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'
  )
);

-- 4. Allow clients to update their own client record
DROP POLICY IF EXISTS "clients_can_update_own_record" ON clients;
CREATE POLICY "clients_can_update_own_record" 
ON clients 
FOR UPDATE 
TO authenticated 
USING (
  user_id = auth.uid()
);

-- 5. Fix messages visibility for consultant-client communication
DROP POLICY IF EXISTS "users_can_view_own_messages" ON messages;
CREATE POLICY "users_can_view_own_messages" 
ON messages 
FOR SELECT 
TO authenticated 
USING (
  sender_id = auth.uid() 
  OR recipient_id = auth.uid() 
  OR receiver_id = auth.uid()
  OR
  -- Consultants can view messages from their assigned clients
  (sender_id IN (
    SELECT user_id FROM clients WHERE assigned_consultant_id = auth.uid()
  ))
  OR
  -- Clients can view messages from their assigned consultant
  (sender_id IN (
    SELECT assigned_consultant_id FROM clients WHERE user_id = auth.uid()
  ))
);

-- 6. Allow proper message insertion between consultants and clients
DROP POLICY IF EXISTS "users_can_send_messages" ON messages;
CREATE POLICY "users_can_send_messages" 
ON messages 
FOR INSERT 
TO authenticated 
WITH CHECK (
  sender_id = auth.uid()
  AND (
    -- Can send to anyone they have a relationship with
    recipient_id IS NOT NULL 
    OR receiver_id IS NOT NULL
  )
);

-- 7. Fix service orders visibility
DROP POLICY IF EXISTS "users_can_view_related_orders" ON service_orders;
CREATE POLICY "users_can_view_related_orders" 
ON service_orders 
FOR SELECT 
TO authenticated 
USING (
  client_id = auth.uid()
  OR
  -- Consultants can view orders from their assigned clients
  client_id IN (
    SELECT user_id FROM clients WHERE assigned_consultant_id = auth.uid()
  )
  OR
  -- Admins can view all orders
  EXISTS (
    SELECT 1 FROM user_profiles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'
  )
);

-- 8. Allow consultants to update orders for their clients
DROP POLICY IF EXISTS "consultants_can_update_client_orders" ON service_orders;
CREATE POLICY "consultants_can_update_client_orders" 
ON service_orders 
FOR UPDATE 
TO authenticated 
USING (
  client_id IN (
    SELECT user_id FROM clients WHERE assigned_consultant_id = auth.uid()
  )
  OR
  -- Admins can update all orders
  EXISTS (
    SELECT 1 FROM user_profiles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'
  )
);

-- 9. Fix notifications visibility
DROP POLICY IF EXISTS "users_can_view_own_notifications" ON notifications;
CREATE POLICY "users_can_view_own_notifications" 
ON notifications 
FOR SELECT 
TO authenticated 
USING (
  user_id = auth.uid()
  OR
  -- Consultants can view notifications for their clients
  user_id IN (
    SELECT user_id FROM clients WHERE assigned_consultant_id = auth.uid()
  )
);

-- 10. Allow proper notification creation
DROP POLICY IF EXISTS "system_can_create_notifications" ON notifications;
CREATE POLICY "system_can_create_notifications" 
ON notifications 
FOR INSERT 
TO authenticated 
WITH CHECK (
  -- System/service role can create notifications
  true
);
