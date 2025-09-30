-- ============================================
-- FOREIGN KEY CONSTRAINTS
-- ============================================

-- Clients foreign keys
ALTER TABLE clients 
    ADD CONSTRAINT clients_profile_id_fkey 
    FOREIGN KEY (profile_id) REFERENCES user_profiles(id) ON DELETE CASCADE;

ALTER TABLE clients 
    ADD CONSTRAINT clients_assigned_consultant_id_fkey 
    FOREIGN KEY (assigned_consultant_id) REFERENCES user_profiles(id) ON DELETE SET NULL;

-- Tasks foreign keys
ALTER TABLE tasks 
    ADD CONSTRAINT tasks_client_id_fkey 
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE;

ALTER TABLE tasks 
    ADD CONSTRAINT tasks_consultant_id_fkey 
    FOREIGN KEY (consultant_id) REFERENCES user_profiles(id) ON DELETE CASCADE;

ALTER TABLE tasks 
    ADD CONSTRAINT tasks_project_id_fkey 
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE;

ALTER TABLE tasks 
    ADD CONSTRAINT tasks_order_id_fkey 
    FOREIGN KEY (order_id) REFERENCES service_orders(id) ON DELETE SET NULL;

-- Task comments and attachments
ALTER TABLE task_comments 
    ADD CONSTRAINT task_comments_task_id_fkey 
    FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE;

ALTER TABLE task_comments 
    ADD CONSTRAINT task_comments_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES user_profiles(id) ON DELETE CASCADE;

ALTER TABLE task_attachments 
    ADD CONSTRAINT task_attachments_task_id_fkey 
    FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE;

ALTER TABLE task_attachments 
    ADD CONSTRAINT task_attachments_uploaded_by_fkey 
    FOREIGN KEY (uploaded_by) REFERENCES user_profiles(id) ON DELETE CASCADE;

-- Projects foreign keys
ALTER TABLE projects 
    ADD CONSTRAINT projects_client_id_fkey 
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE;

ALTER TABLE projects 
    ADD CONSTRAINT projects_consultant_id_fkey 
    FOREIGN KEY (consultant_id) REFERENCES user_profiles(id) ON DELETE SET NULL;

-- Service orders foreign keys
ALTER TABLE service_orders 
    ADD CONSTRAINT service_orders_client_id_fkey 
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE;

ALTER TABLE service_orders 
    ADD CONSTRAINT service_orders_consultant_id_fkey 
    FOREIGN KEY (consultant_id) REFERENCES user_profiles(id) ON DELETE SET NULL;

ALTER TABLE service_orders 
    ADD CONSTRAINT service_orders_service_id_fkey 
    FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE RESTRICT;

-- Messages foreign keys
ALTER TABLE messages 
    ADD CONSTRAINT messages_sender_id_fkey 
    FOREIGN KEY (sender_id) REFERENCES user_profiles(id) ON DELETE CASCADE;

ALTER TABLE messages 
    ADD CONSTRAINT messages_receiver_id_fkey 
    FOREIGN KEY (receiver_id) REFERENCES user_profiles(id) ON DELETE CASCADE;

ALTER TABLE messages 
    ADD CONSTRAINT messages_order_id_fkey 
    FOREIGN KEY (order_id) REFERENCES service_orders(id) ON DELETE CASCADE;

ALTER TABLE message_attachments 
    ADD CONSTRAINT message_attachments_message_id_fkey 
    FOREIGN KEY (message_id) REFERENCES messages(id) ON DELETE CASCADE;

-- Meetings foreign keys
ALTER TABLE meetings 
    ADD CONSTRAINT meetings_client_id_fkey 
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE;

ALTER TABLE meetings 
    ADD CONSTRAINT meetings_consultant_id_fkey 
    FOREIGN KEY (consultant_id) REFERENCES user_profiles(id) ON DELETE CASCADE;

-- Documents foreign keys
ALTER TABLE documents 
    ADD CONSTRAINT documents_client_id_fkey 
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE;

ALTER TABLE documents 
    ADD CONSTRAINT documents_consultant_id_fkey 
    FOREIGN KEY (consultant_id) REFERENCES user_profiles(id) ON DELETE SET NULL;

ALTER TABLE documents 
    ADD CONSTRAINT documents_uploaded_by_fkey 
    FOREIGN KEY (uploaded_by) REFERENCES user_profiles(id) ON DELETE SET NULL;

ALTER TABLE documents 
    ADD CONSTRAINT documents_reviewed_by_fkey 
    FOREIGN KEY (reviewed_by) REFERENCES user_profiles(id) ON DELETE SET NULL;

ALTER TABLE accounting_documents 
    ADD CONSTRAINT accounting_documents_client_id_fkey 
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE;

ALTER TABLE accounting_documents 
    ADD CONSTRAINT accounting_documents_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES user_profiles(id) ON DELETE CASCADE;

ALTER TABLE accounting_documents 
    ADD CONSTRAINT accounting_documents_reviewed_by_fkey 
    FOREIGN KEY (reviewed_by) REFERENCES user_profiles(id) ON DELETE SET NULL;

-- User assignments foreign keys
ALTER TABLE user_assignments 
    ADD CONSTRAINT user_assignments_consultant_id_fkey 
    FOREIGN KEY (consultant_id) REFERENCES user_profiles(id) ON DELETE CASCADE;

ALTER TABLE user_assignments 
    ADD CONSTRAINT user_assignments_client_id_fkey 
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE;

-- Commission payouts
ALTER TABLE commission_payouts 
    ADD CONSTRAINT commission_payouts_consultant_id_fkey 
    FOREIGN KEY (consultant_id) REFERENCES user_profiles(id) ON DELETE CASCADE;

ALTER TABLE commission_payout_items 
    ADD CONSTRAINT commission_payout_items_payout_id_fkey 
    FOREIGN KEY (payout_id) REFERENCES commission_payouts(id) ON DELETE CASCADE;

-- Consultant assignments
ALTER TABLE consultant_assignments 
    ADD CONSTRAINT consultant_assignments_client_id_fkey 
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE;

ALTER TABLE consultant_assignments 
    ADD CONSTRAINT consultant_assignments_consultant_id_fkey 
    FOREIGN KEY (consultant_id) REFERENCES user_profiles(id) ON DELETE CASCADE;

ALTER TABLE consultant_assignments 
    ADD CONSTRAINT consultant_assignments_assigned_by_fkey 
    FOREIGN KEY (assigned_by) REFERENCES user_profiles(id) ON DELETE SET NULL;

-- Consultant countries
ALTER TABLE consultant_countries 
    ADD CONSTRAINT consultant_countries_consultant_id_fkey 
    FOREIGN KEY (consultant_id) REFERENCES user_profiles(id) ON DELETE CASCADE;

-- Consultant services and languages
ALTER TABLE consultant_country_services 
    ADD CONSTRAINT consultant_country_services_consultant_id_fkey 
    FOREIGN KEY (consultant_id) REFERENCES user_profiles(id) ON DELETE CASCADE;

ALTER TABLE consultant_spoken_languages 
    ADD CONSTRAINT consultant_spoken_languages_consultant_id_fkey 
    FOREIGN KEY (consultant_id) REFERENCES user_profiles(id) ON DELETE CASCADE;

ALTER TABLE consultant_spoken_languages 
    ADD CONSTRAINT consultant_spoken_languages_language_id_fkey 
    FOREIGN KEY (language_id) REFERENCES languages(id) ON DELETE CASCADE;

-- Blog posts
ALTER TABLE blog_posts 
    ADD CONSTRAINT blog_posts_author_id_fkey 
    FOREIGN KEY (author_id) REFERENCES user_profiles(id) ON DELETE SET NULL;
