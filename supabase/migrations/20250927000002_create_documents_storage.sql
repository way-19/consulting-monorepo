-- Create storage bucket for documents
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'documents',
  'documents',
  false,
  52428800, -- 50MB limit
  ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/png', 'image/jpg']
);

-- Create storage policies for documents bucket
CREATE POLICY "Authenticated users can upload documents" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'documents');

CREATE POLICY "Users can view their own documents" ON storage.objects
FOR SELECT TO authenticated
USING (
  bucket_id = 'documents' AND (
    -- Clients can view their own documents
    EXISTS (
      SELECT 1 FROM documents d
      JOIN clients c ON c.id = d.client_id
      WHERE d.file_path = name
      AND c.user_id = auth.uid()
    )
    OR
    -- Consultants can view documents for their assigned clients
    EXISTS (
      SELECT 1 FROM documents d
      JOIN service_orders so ON so.client_id = d.client_id
      JOIN user_profiles up ON up.id = so.consultant_id
      WHERE d.file_path = name
      AND up.user_id = auth.uid()
      AND up.role = 'consultant'
    )
    OR
    -- Admins can view all documents
    EXISTS (
      SELECT 1 FROM user_profiles up
      WHERE up.user_id = auth.uid()
      AND up.role = 'admin'
    )
  )
);

CREATE POLICY "Users can update their own documents" ON storage.objects
FOR UPDATE TO authenticated
USING (
  bucket_id = 'documents' AND (
    -- Consultants can update documents for their assigned clients
    EXISTS (
      SELECT 1 FROM documents d
      JOIN service_orders so ON so.client_id = d.client_id
      JOIN user_profiles up ON up.id = so.consultant_id
      WHERE d.file_path = name
      AND up.user_id = auth.uid()
      AND up.role = 'consultant'
    )
    OR
    -- Admins can update all documents
    EXISTS (
      SELECT 1 FROM user_profiles up
      WHERE up.user_id = auth.uid()
      AND up.role = 'admin'
    )
  )
);

CREATE POLICY "Users can delete their own documents" ON storage.objects
FOR DELETE TO authenticated
USING (
  bucket_id = 'documents' AND (
    -- Consultants can delete documents for their assigned clients
    EXISTS (
      SELECT 1 FROM documents d
      JOIN service_orders so ON so.client_id = d.client_id
      JOIN user_profiles up ON up.id = so.consultant_id
      WHERE d.file_path = name
      AND up.user_id = auth.uid()
      AND up.role = 'consultant'
    )
    OR
    -- Admins can delete all documents
    EXISTS (
      SELECT 1 FROM user_profiles up
      WHERE up.user_id = auth.uid()
      AND up.role = 'admin'
    )
  )
);