-- Create documents table for consultant document management
-- This table will store both accounting documents (uploaded by clients) and official documents (uploaded by consultants)

-- Create documents table
CREATE TABLE IF NOT EXISTS documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
    consultant_id UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
    document_type VARCHAR(50) NOT NULL, -- 'accounting' or 'official'
    category VARCHAR(100), -- 'invoice', 'bank_statement', 'certificate', 'contract', etc.
    name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size INTEGER,
    mime_type VARCHAR(100),
    status VARCHAR(50) DEFAULT 'uploaded', -- 'uploaded', 'reviewed', 'approved', 'rejected'
    notes TEXT,
    amount DECIMAL(10,2), -- For accounting documents
    currency VARCHAR(3) DEFAULT 'EUR', -- For accounting documents
    transaction_date DATE, -- For accounting documents
    uploaded_by UUID REFERENCES auth.users(id),
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    reviewed_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_documents_client_id ON documents(client_id);
CREATE INDEX IF NOT EXISTS idx_documents_consultant_id ON documents(consultant_id);
CREATE INDEX IF NOT EXISTS idx_documents_document_type ON documents(document_type);
CREATE INDEX IF NOT EXISTS idx_documents_status ON documents(status);
CREATE INDEX IF NOT EXISTS idx_documents_uploaded_at ON documents(uploaded_at);

-- Enable RLS
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- RLS Policies for documents table

-- Policy 1: Clients can view and manage their own documents
CREATE POLICY "documents_client_access" 
ON documents 
FOR ALL 
TO authenticated 
USING (
    EXISTS (
        SELECT 1 FROM clients c 
        WHERE c.id = client_id 
        AND c.user_id = auth.uid()
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM clients c 
        WHERE c.id = client_id 
        AND c.user_id = auth.uid()
    )
);

-- Policy 2: Consultants can view and manage documents for their assigned clients
CREATE POLICY "documents_consultant_access" 
ON documents 
FOR ALL 
TO authenticated 
USING (
    EXISTS (
        SELECT 1 FROM user_profiles up
        JOIN service_orders so ON so.consultant_id = up.id
        WHERE up.user_id = auth.uid() 
        AND up.role = 'consultant'
        AND so.client_id = client_id
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM user_profiles up
        JOIN service_orders so ON so.consultant_id = up.id
        WHERE up.user_id = auth.uid() 
        AND up.role = 'consultant'
        AND so.client_id = client_id
    )
);

-- Policy 3: Admins can view and manage all documents
CREATE POLICY "documents_admin_access" 
ON documents 
FOR ALL 
TO authenticated 
USING (is_admin())
WITH CHECK (is_admin());

-- Create a function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_documents_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER documents_updated_at_trigger
    BEFORE UPDATE ON documents
    FOR EACH ROW
    EXECUTE FUNCTION update_documents_updated_at();

-- Grant permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON documents TO authenticated;

-- Add comment
COMMENT ON TABLE documents IS 'Document management table for consultant portal - stores both client accounting documents and consultant official documents';