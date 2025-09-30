-- Add missing columns to fix console errors

-- 1. Add consultant_country column to service_orders table
ALTER TABLE service_orders 
ADD COLUMN IF NOT EXISTS consultant_country TEXT;

-- 2. Add user_id column to accounting_documents table (alias for client_id)
ALTER TABLE accounting_documents 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);

-- Update user_id to match client_id for existing records
UPDATE accounting_documents SET user_id = client_id WHERE user_id IS NULL;

-- 3. Add name column to accounting_documents if missing
ALTER TABLE accounting_documents 
ADD COLUMN IF NOT EXISTS name TEXT;

-- 4. Add category column to accounting_documents if missing
ALTER TABLE accounting_documents 
ADD COLUMN IF NOT EXISTS category TEXT;

-- 5. Add uploaded_at column to accounting_documents if missing
ALTER TABLE accounting_documents 
ADD COLUMN IF NOT EXISTS uploaded_at TIMESTAMPTZ DEFAULT NOW();

-- 6. Add status column to accounting_documents if missing
ALTER TABLE accounting_documents 
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending';

-- 7. Add file_url column to accounting_documents if missing
ALTER TABLE accounting_documents 
ADD COLUMN IF NOT EXISTS file_url TEXT;

-- 8. Update consultant_country for existing records (optional)
UPDATE service_orders 
SET consultant_country = 'TR' 
WHERE consultant_country IS NULL AND consultant_id IS NOT NULL;

-- 9. Create index for better performance
CREATE INDEX IF NOT EXISTS idx_service_orders_consultant_country ON service_orders(consultant_country);
CREATE INDEX IF NOT EXISTS idx_accounting_documents_user_id ON accounting_documents(user_id);
CREATE INDEX IF NOT EXISTS idx_accounting_documents_status ON accounting_documents(status);
