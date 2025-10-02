-- Enable Row Level Security on all sensitive tables
-- This ensures that even if someone bypasses the API, they can't access unauthorized data

-- ======================
-- HELPER FUNCTIONS
-- ======================

-- Function to get current user ID from JWT
CREATE OR REPLACE FUNCTION auth.user_id() RETURNS uuid AS $$
  SELECT COALESCE(
    current_setting('request.jwt.claims', true)::json->>'user_id',
    current_setting('request.jwt.claims', true)::json->>'id'
  )::uuid;
$$ LANGUAGE sql STABLE;

-- Function to get current user role from JWT
CREATE OR REPLACE FUNCTION auth.user_role() RETURNS text AS $$
  SELECT current_setting('request.jwt.claims', true)::json->>'role';
$$ LANGUAGE sql STABLE;

-- ======================
-- USER_PROFILES TABLE
-- ======================

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Users can view their own profile
CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  USING (id = auth.user_id() OR auth.user_role() = 'admin');

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  USING (id = auth.user_id());

-- Only admins can insert new users
CREATE POLICY "Admins can insert users"
  ON user_profiles FOR INSERT
  WITH CHECK (auth.user_role() = 'admin');

-- Only admins can delete users
CREATE POLICY "Admins can delete users"
  ON user_profiles FOR DELETE
  USING (auth.user_role() = 'admin');

-- ======================
-- CLIENTS TABLE
-- ======================

ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

-- Clients can view their own data
CREATE POLICY "Clients can view own data"
  ON clients FOR SELECT
  USING (
    profile_id = auth.user_id() OR
    assigned_consultant_id = auth.user_id() OR
    auth.user_role() = 'admin'
  );

-- Consultants can update their assigned clients
CREATE POLICY "Consultants can update assigned clients"
  ON clients FOR UPDATE
  USING (
    assigned_consultant_id = auth.user_id() OR
    auth.user_role() = 'admin'
  );

-- Only admins can insert clients
CREATE POLICY "Admins can insert clients"
  ON clients FOR INSERT
  WITH CHECK (auth.user_role() = 'admin');

-- Only admins can delete clients
CREATE POLICY "Admins can delete clients"
  ON clients FOR DELETE
  USING (auth.user_role() = 'admin');

-- ======================
-- DOCUMENTS TABLE
-- ======================

ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- Users can view documents they are involved with
CREATE POLICY "Users can view relevant documents"
  ON documents FOR SELECT
  USING (
    uploaded_by = auth.user_id() OR
    consultant_id = auth.user_id() OR
    client_id IN (
      SELECT id FROM clients WHERE profile_id = auth.user_id()
    ) OR
    auth.user_role() = 'admin'
  );

-- Consultants and clients can insert documents
CREATE POLICY "Consultants and clients can insert documents"
  ON documents FOR INSERT
  WITH CHECK (
    (auth.user_role() = 'consultant' AND consultant_id = auth.user_id()) OR
    (auth.user_role() = 'client' AND client_id IN (
      SELECT id FROM clients WHERE profile_id = auth.user_id()
    )) OR
    auth.user_role() = 'admin'
  );

-- Consultants can update documents of their clients
CREATE POLICY "Consultants can update client documents"
  ON documents FOR UPDATE
  USING (
    consultant_id = auth.user_id() OR
    auth.user_role() = 'admin'
  );

-- Users can delete their own uploaded documents
CREATE POLICY "Users can delete own documents"
  ON documents FOR DELETE
  USING (
    uploaded_by = auth.user_id() OR
    auth.user_role() = 'admin'
  );

-- ======================
-- MESSAGES TABLE
-- ======================

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Users can view messages they sent or received
CREATE POLICY "Users can view own messages"
  ON messages FOR SELECT
  USING (
    sender_id = auth.user_id() OR
    receiver_id = auth.user_id() OR
    auth.user_role() = 'admin'
  );

-- Users can send messages
CREATE POLICY "Users can send messages"
  ON messages FOR INSERT
  WITH CHECK (sender_id = auth.user_id());

-- Users can update read status of received messages
CREATE POLICY "Users can update received messages"
  ON messages FOR UPDATE
  USING (receiver_id = auth.user_id());

-- Users can delete their sent messages
CREATE POLICY "Users can delete sent messages"
  ON messages FOR DELETE
  USING (
    sender_id = auth.user_id() OR
    auth.user_role() = 'admin'
  );

-- ======================
-- TASKS TABLE
-- ======================

ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Users can view tasks they are involved with
CREATE POLICY "Users can view relevant tasks"
  ON tasks FOR SELECT
  USING (
    assigned_to = auth.user_id() OR
    created_by = auth.user_id() OR
    project_id IN (
      SELECT id FROM projects WHERE 
        consultant_id = auth.user_id() OR 
        client_id IN (SELECT id FROM clients WHERE profile_id = auth.user_id())
    ) OR
    auth.user_role() = 'admin'
  );

-- Consultants can create tasks for their projects
CREATE POLICY "Consultants can create tasks"
  ON tasks FOR INSERT
  WITH CHECK (
    auth.user_role() IN ('consultant', 'admin') AND
    (
      project_id IN (
        SELECT id FROM projects WHERE consultant_id = auth.user_id()
      ) OR
      auth.user_role() = 'admin'
    )
  );

-- Users can update tasks assigned to them
CREATE POLICY "Users can update assigned tasks"
  ON tasks FOR UPDATE
  USING (
    assigned_to = auth.user_id() OR
    created_by = auth.user_id() OR
    auth.user_role() = 'admin'
  );

-- Only creators and admins can delete tasks
CREATE POLICY "Creators can delete tasks"
  ON tasks FOR DELETE
  USING (
    created_by = auth.user_id() OR
    auth.user_role() = 'admin'
  );

-- ======================
-- PROJECTS TABLE
-- ======================

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Users can view projects they are involved with
CREATE POLICY "Users can view relevant projects"
  ON projects FOR SELECT
  USING (
    consultant_id = auth.user_id() OR
    client_id IN (
      SELECT id FROM clients WHERE profile_id = auth.user_id()
    ) OR
    auth.user_role() = 'admin'
  );

-- Consultants and admins can create projects
CREATE POLICY "Consultants can create projects"
  ON projects FOR INSERT
  WITH CHECK (
    (auth.user_role() = 'consultant' AND consultant_id = auth.user_id()) OR
    auth.user_role() = 'admin'
  );

-- Consultants can update their projects
CREATE POLICY "Consultants can update projects"
  ON projects FOR UPDATE
  USING (
    consultant_id = auth.user_id() OR
    auth.user_role() = 'admin'
  );

-- Only admins can delete projects
CREATE POLICY "Admins can delete projects"
  ON projects FOR DELETE
  USING (auth.user_role() = 'admin');

-- ======================
-- AUDIT_LOGS TABLE
-- ======================

ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Only admins can view audit logs
CREATE POLICY "Only admins can view audit logs"
  ON audit_logs FOR SELECT
  USING (auth.user_role() = 'admin');

-- All authenticated users can insert audit logs
CREATE POLICY "Authenticated users can insert audit logs"
  ON audit_logs FOR INSERT
  WITH CHECK (auth.user_id() IS NOT NULL);

-- No one can update or delete audit logs
-- (Audit logs should be immutable)

-- ======================
-- SERVICE_ORDERS TABLE
-- ======================

ALTER TABLE service_orders ENABLE ROW LEVEL SECURITY;

-- Users can view orders they are involved with
CREATE POLICY "Users can view relevant orders"
  ON service_orders FOR SELECT
  USING (
    consultant_id = auth.user_id() OR
    client_id IN (
      SELECT id FROM clients WHERE profile_id = auth.user_id()
    ) OR
    auth.user_role() = 'admin'
  );

-- Clients and admins can create orders
CREATE POLICY "Clients can create orders"
  ON service_orders FOR INSERT
  WITH CHECK (
    (auth.user_role() = 'client' AND client_id IN (
      SELECT id FROM clients WHERE profile_id = auth.user_id()
    )) OR
    auth.user_role() = 'admin'
  );

-- Consultants and admins can update orders
CREATE POLICY "Consultants can update orders"
  ON service_orders FOR UPDATE
  USING (
    consultant_id = auth.user_id() OR
    auth.user_role() = 'admin'
  );

-- Only admins can delete orders
CREATE POLICY "Admins can delete orders"
  ON service_orders FOR DELETE
  USING (auth.user_role() = 'admin');

-- ======================
-- GRANT PERMISSIONS
-- ======================

-- Grant necessary permissions to authenticated role
GRANT USAGE ON SCHEMA auth TO authenticated;
GRANT EXECUTE ON FUNCTION auth.user_id() TO authenticated;
GRANT EXECUTE ON FUNCTION auth.user_role() TO authenticated;
