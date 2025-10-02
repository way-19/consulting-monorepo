-- Import languages data from Supabase
INSERT INTO languages (id, code, name, native_name, created_at) VALUES 
(1, 'en', 'English', 'English', '2025-09-30 15:14:07.509133+00'::timestamptz),
(2, 'tr', 'Turkish', 'Türkçe', '2025-09-30 15:14:07.509133+00'::timestamptz),
(3, 'es', 'Spanish', 'Español', '2025-09-30 15:14:07.509133+00'::timestamptz),
(4, 'pt', 'Portuguese', 'Português', '2025-09-30 15:14:07.509133+00'::timestamptz),
(5, 'de', 'German', 'Deutsch', '2025-09-30 15:14:07.509133+00'::timestamptz),
(6, 'fr', 'French', 'Français', '2025-09-30 15:14:07.509133+00'::timestamptz),
(7, 'it', 'Italian', 'Italiano', '2025-09-30 15:14:07.509133+00'::timestamptz),
(8, 'nl', 'Dutch', 'Nederlands', '2025-09-30 15:14:07.509133+00'::timestamptz),
(9, 'ru', 'Russian', 'Русский', '2025-09-30 15:14:07.509133+00'::timestamptz),
(10, 'ar', 'Arabic', 'العربية', '2025-09-30 15:14:07.509133+00'::timestamptz)
ON CONFLICT (id) DO NOTHING;
