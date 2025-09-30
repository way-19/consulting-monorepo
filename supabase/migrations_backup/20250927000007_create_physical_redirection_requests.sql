-- Create physical redirection requests table
-- This table will store requests for physical mail redirection with payment information

CREATE TABLE IF NOT EXISTS physical_redirection_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
    document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
    
    -- Address information
    recipient_name VARCHAR(255) NOT NULL,
    address_line_1 VARCHAR(255) NOT NULL,
    address_line_2 VARCHAR(255),
    city VARCHAR(100) NOT NULL,
    state_province VARCHAR(100),
    postal_code VARCHAR(20) NOT NULL,
    country VARCHAR(100) NOT NULL,
    
    -- Payment information
    payment_amount DECIMAL(10,2) DEFAULT 25.00,
    payment_currency VARCHAR(3) DEFAULT 'USD',
    stripe_payment_intent_id VARCHAR(255),
    payment_status VARCHAR(20) DEFAULT 'pending', -- pending, completed, failed, refunded
    
    -- Request status
    status VARCHAR(20) DEFAULT 'pending', -- pending, processing, shipped, delivered, cancelled
    notes TEXT,
    
    -- Tracking information
    tracking_number VARCHAR(100),
    shipping_carrier VARCHAR(50),
    estimated_delivery_date DATE,
    actual_delivery_date DATE,
    
    -- Timestamps
    requested_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    paid_at TIMESTAMP WITH TIME ZONE,
    processed_at TIMESTAMP WITH TIME ZONE,
    shipped_at TIMESTAMP WITH TIME ZONE,
    delivered_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_physical_redirection_requests_client_id ON physical_redirection_requests(client_id);
CREATE INDEX IF NOT EXISTS idx_physical_redirection_requests_document_id ON physical_redirection_requests(document_id);
CREATE INDEX IF NOT EXISTS idx_physical_redirection_requests_status ON physical_redirection_requests(status);
CREATE INDEX IF NOT EXISTS idx_physical_redirection_requests_payment_status ON physical_redirection_requests(payment_status);
CREATE INDEX IF NOT EXISTS idx_physical_redirection_requests_requested_at ON physical_redirection_requests(requested_at);

-- Enable RLS
ALTER TABLE physical_redirection_requests ENABLE ROW LEVEL SECURITY;

-- RLS Policies for physical_redirection_requests table

-- Policy 1: Clients can view and manage their own requests
CREATE POLICY "physical_redirection_requests_client_access" 
ON physical_redirection_requests 
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

-- Policy 2: Consultants can view and manage requests for their assigned clients
CREATE POLICY "physical_redirection_requests_consultant_access" 
ON physical_redirection_requests 
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

-- Policy 3: Admins can view and manage all requests
CREATE POLICY "physical_redirection_requests_admin_access" 
ON physical_redirection_requests 
FOR ALL 
TO authenticated 
USING (is_admin())
WITH CHECK (is_admin());

-- Create a function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_physical_redirection_requests_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER physical_redirection_requests_updated_at_trigger
    BEFORE UPDATE ON physical_redirection_requests
    FOR EACH ROW
    EXECUTE FUNCTION update_physical_redirection_requests_updated_at();

-- Grant permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON physical_redirection_requests TO authenticated;

-- Add comment
COMMENT ON TABLE physical_redirection_requests IS 'Physical mail redirection requests table - stores client requests for physical document forwarding with payment and tracking information';