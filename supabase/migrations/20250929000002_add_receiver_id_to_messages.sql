-- Add receiver_id column to messages table
-- This fixes the consultant panel 400 error for messages queries

-- Add the receiver_id column
ALTER TABLE messages ADD COLUMN IF NOT EXISTS receiver_id UUID;

-- Update existing records to copy recipient_id to receiver_id
UPDATE messages 
SET receiver_id = recipient_id 
WHERE receiver_id IS NULL AND recipient_id IS NOT NULL;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_messages_receiver_id ON messages(receiver_id);

-- Create index for is_read column as well (used in queries)
CREATE INDEX IF NOT EXISTS idx_messages_is_read ON messages(is_read);

-- Create composite index for the exact query used by consultant panel
CREATE INDEX IF NOT EXISTS idx_messages_receiver_id_is_read ON messages(receiver_id, is_read);
