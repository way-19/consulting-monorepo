-- Create accounting_documents table for the new document system
CREATE TABLE IF NOT EXISTS accounting_documents (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    client_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type TEXT NOT NULL, -- MIME type
    category TEXT NOT NULL CHECK (category IN ('bank_statements', 'invoices', 'additional_expenses')),
    file_url TEXT NOT NULL,
    file_size BIGINT NOT NULL,
    amount DECIMAL(10,2),
    currency TEXT DEFAULT 'TRY',
    transaction_date DATE,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    notes TEXT,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    reviewed_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_accounting_documents_client_id ON accounting_documents(client_id);
CREATE INDEX IF NOT EXISTS idx_accounting_documents_category ON accounting_documents(category);
CREATE INDEX IF NOT EXISTS idx_accounting_documents_status ON accounting_documents(status);
CREATE INDEX IF NOT EXISTS idx_accounting_documents_uploaded_at ON accounting_documents(uploaded_at);

-- Enable RLS
ALTER TABLE accounting_documents ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Clients can only see their own documents
CREATE POLICY "Clients can view their own accounting documents" ON accounting_documents
    FOR SELECT USING (auth.uid() = client_id);

-- Clients can insert their own documents
CREATE POLICY "Clients can insert their own accounting documents" ON accounting_documents
    FOR INSERT WITH CHECK (auth.uid() = client_id);

-- Clients can update their own documents (only certain fields)
CREATE POLICY "Clients can update their own accounting documents" ON accounting_documents
    FOR UPDATE USING (auth.uid() = client_id)
    WITH CHECK (auth.uid() = client_id);

-- Consultants can view all documents
CREATE POLICY "Consultants can view all accounting documents" ON accounting_documents
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE user_profiles.user_id = auth.uid() 
            AND user_profiles.role = 'consultant'
        )
    );

-- Consultants can update document status and review info
CREATE POLICY "Consultants can update accounting document status" ON accounting_documents
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE user_profiles.user_id = auth.uid() 
            AND user_profiles.role = 'consultant'
        )
    );

-- Create storage bucket for accounting documents
INSERT INTO storage.buckets (id, name) 
VALUES ('accounting-documents', 'accounting-documents')
ON CONFLICT (id) DO NOTHING;

-- Storage policies
-- Clients can upload to their own folder
CREATE POLICY "Clients can upload accounting documents" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'accounting-documents' 
        AND (storage.foldername(name))[1] = auth.uid()::text
    );

-- Clients can view their own files
CREATE POLICY "Clients can view their own accounting documents" ON storage.objects
    FOR SELECT USING (
        bucket_id = 'accounting-documents' 
        AND (storage.foldername(name))[1] = auth.uid()::text
    );

-- Consultants can view all files
CREATE POLICY "Consultants can view all accounting documents" ON storage.objects
    FOR SELECT USING (
        bucket_id = 'accounting-documents' 
        AND EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE user_profiles.user_id = auth.uid() 
            AND user_profiles.role = 'consultant'
        )
    );

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_accounting_documents_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER update_accounting_documents_updated_at
    BEFORE UPDATE ON accounting_documents
    FOR EACH ROW
    EXECUTE FUNCTION update_accounting_documents_updated_at();

-- Note: Dashboard now fetches accounting documents directly for alerts
-- No need for separate notification system