-- Import user_profiles data from Supabase
INSERT INTO user_profiles (id, user_id, first_name, last_name, email, phone, role, created_at) VALUES 
('5dcd0d18-c8d5-4cd3-8ef7-c34cbda37a74', 'd6a4a19d-e45a-423e-9cfa-204f1cfec36c', 'Admin', 'User', 'admin@consulting19.com', '+1234567890', 'admin', '2025-09-30 16:11:45.60912+00'),
('2efa54a0-08a4-49e3-9ccb-d63adf2db2c0', '2efa54a0-08a4-49e3-9ccb-d63adf2db2c0', 'Giorgi', 'Meskhi', 'giorgi.meskhi@consulting19.com', NULL, 'consultant', '2025-09-30 20:13:52.362884+00'),
('44175993-eda1-42e7-ab18-bba2f16d721b', '44175993-eda1-42e7-ab18-bba2f16d721b', 'Test', 'Client', 'client@consulting19.com', NULL, 'client', '2025-09-30 20:13:52.362884+00')
ON CONFLICT (id) DO NOTHING;
