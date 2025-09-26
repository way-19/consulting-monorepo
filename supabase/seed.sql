-- Seed data for consulting platform
-- This file populates the database with initial data

-- Insert languages
INSERT INTO languages (code, name, native_name) VALUES
('en', 'English', 'English'),
('tr', 'Turkish', 'Türkçe'),
('es', 'Spanish', 'Español'),
('pt', 'Portuguese', 'Português')
ON CONFLICT (code) DO NOTHING;

-- Insert countries
INSERT INTO countries (code, name_en, name_tr, name_es, name_pt) VALUES
('TR', 'Turkey', 'Türkiye', 'Turquía', 'Turquia'),
('US', 'United States', 'Amerika Birleşik Devletleri', 'Estados Unidos', 'Estados Unidos'),
('GB', 'United Kingdom', 'Birleşik Krallık', 'Reino Unido', 'Reino Unido'),
('DE', 'Germany', 'Almanya', 'Alemania', 'Alemanha'),
('FR', 'France', 'Fransa', 'Francia', 'França'),
('ES', 'Spain', 'İspanya', 'España', 'Espanha'),
('IT', 'Italy', 'İtalya', 'Italia', 'Itália'),
('PT', 'Portugal', 'Portekiz', 'Portugal', 'Portugal'),
('NL', 'Netherlands', 'Hollanda', 'Países Bajos', 'Países Baixos'),
('BE', 'Belgium', 'Belçika', 'Bélgica', 'Bélgica'),
('CH', 'Switzerland', 'İsviçre', 'Suiza', 'Suíça'),
('AT', 'Austria', 'Avusturya', 'Austria', 'Áustria'),
('SE', 'Sweden', 'İsveç', 'Suecia', 'Suécia'),
('NO', 'Norway', 'Norveç', 'Noruega', 'Noruega'),
('DK', 'Denmark', 'Danimarka', 'Dinamarca', 'Dinamarca'),
('FI', 'Finland', 'Finlandiya', 'Finlandia', 'Finlândia'),
('PL', 'Poland', 'Polonya', 'Polonia', 'Polônia'),
('CZ', 'Czech Republic', 'Çek Cumhuriyeti', 'República Checa', 'República Tcheca'),
('HU', 'Hungary', 'Macaristan', 'Hungría', 'Hungria'),
('GR', 'Greece', 'Yunanistan', 'Grecia', 'Grécia'),
('IE', 'Ireland', 'İrlanda', 'Irlanda', 'Irlanda'),
('LU', 'Luxembourg', 'Lüksemburg', 'Luxemburgo', 'Luxemburgo'),
('MT', 'Malta', 'Malta', 'Malta', 'Malta'),
('CY', 'Cyprus', 'Kıbrıs', 'Chipre', 'Chipre'),
('CA', 'Canada', 'Kanada', 'Canadá', 'Canadá'),
('AU', 'Australia', 'Avustralya', 'Australia', 'Austrália'),
('NZ', 'New Zealand', 'Yeni Zelanda', 'Nueva Zelanda', 'Nova Zelândia'),
('JP', 'Japan', 'Japonya', 'Japón', 'Japão'),
('KR', 'South Korea', 'Güney Kore', 'Corea del Sur', 'Coreia do Sul'),
('SG', 'Singapore', 'Singapur', 'Singapur', 'Singapura'),
('BR', 'Brazil', 'Brezilya', 'Brasil', 'Brasil'),
('MX', 'Mexico', 'Meksika', 'México', 'México'),
('AR', 'Argentina', 'Arjantin', 'Argentina', 'Argentina'),
('CL', 'Chile', 'Şili', 'Chile', 'Chile'),
('CO', 'Colombia', 'Kolombiya', 'Colombia', 'Colômbia'),
('PE', 'Peru', 'Peru', 'Perú', 'Peru'),
('UY', 'Uruguay', 'Uruguay', 'Uruguay', 'Uruguai'),
('PY', 'Paraguay', 'Paraguay', 'Paraguay', 'Paraguai'),
('BO', 'Bolivia', 'Bolivya', 'Bolivia', 'Bolívia'),
('EC', 'Ecuador', 'Ekvador', 'Ecuador', 'Equador'),
('VE', 'Venezuela', 'Venezuela', 'Venezuela', 'Venezuela'),
('CR', 'Costa Rica', 'Kosta Rika', 'Costa Rica', 'Costa Rica'),
('PA', 'Panama', 'Panama', 'Panamá', 'Panamá'),
('GT', 'Guatemala', 'Guatemala', 'Guatemala', 'Guatemala'),
('HN', 'Honduras', 'Honduras', 'Honduras', 'Honduras'),
('SV', 'El Salvador', 'El Salvador', 'El Salvador', 'El Salvador'),
('NI', 'Nicaragua', 'Nikaragua', 'Nicaragua', 'Nicarágua'),
('BZ', 'Belize', 'Belize', 'Belice', 'Belize'),
('DO', 'Dominican Republic', 'Dominik Cumhuriyeti', 'República Dominicana', 'República Dominicana'),
('CU', 'Cuba', 'Küba', 'Cuba', 'Cuba'),
('JM', 'Jamaica', 'Jamaika', 'Jamaica', 'Jamaica'),
('TT', 'Trinidad and Tobago', 'Trinidad ve Tobago', 'Trinidad y Tobago', 'Trinidad e Tobago'),
('BB', 'Barbados', 'Barbados', 'Barbados', 'Barbados')
ON CONFLICT (code) DO NOTHING;

-- Insert service categories
INSERT INTO service_categories (name_en, name_tr, name_es, name_pt, description_en, description_tr, description_es, description_pt) VALUES
('Business Consulting', 'İş Danışmanlığı', 'Consultoría Empresarial', 'Consultoria Empresarial', 'Strategic business advice and planning', 'Stratejik iş tavsiyesi ve planlama', 'Asesoramiento y planificación estratégica empresarial', 'Aconselhamento e planejamento estratégico de negócios'),
('Legal Services', 'Hukuki Hizmetler', 'Servicios Legales', 'Serviços Jurídicos', 'Legal advice and representation', 'Hukuki tavsiye ve temsil', 'Asesoramiento legal y representación', 'Aconselhamento jurídico e representação'),
('Tax Consulting', 'Vergi Danışmanlığı', 'Consultoría Fiscal', 'Consultoria Fiscal', 'Tax planning and compliance services', 'Vergi planlama ve uyum hizmetleri', 'Servicios de planificación fiscal y cumplimiento', 'Serviços de planejamento tributário e conformidade'),
('Immigration Services', 'Göçmenlik Hizmetleri', 'Servicios de Inmigración', 'Serviços de Imigração', 'Immigration and visa assistance', 'Göçmenlik ve vize yardımı', 'Asistencia de inmigración y visas', 'Assistência de imigração e visto'),
('Real Estate', 'Gayrimenkul', 'Bienes Raíces', 'Imobiliário', 'Property investment and management', 'Mülk yatırımı ve yönetimi', 'Inversión y gestión inmobiliaria', 'Investimento e gestão imobiliária'),
('Financial Planning', 'Finansal Planlama', 'Planificación Financiera', 'Planejamento Financeiro', 'Personal and business financial planning', 'Kişisel ve işletme finansal planlaması', 'Planificación financiera personal y empresarial', 'Planejamento financeiro pessoal e empresarial'),
('Education Services', 'Eğitim Hizmetleri', 'Servicios Educativos', 'Serviços Educacionais', 'Educational consulting and planning', 'Eğitim danışmanlığı ve planlama', 'Consultoría y planificación educativa', 'Consultoria e planejamento educacional'),
('Healthcare Services', 'Sağlık Hizmetleri', 'Servicios de Salud', 'Serviços de Saúde', 'Healthcare and medical consulting', 'Sağlık ve tıbbi danışmanlık', 'Consultoría médica y de salud', 'Consultoria médica e de saúde'),
('Technology Consulting', 'Teknoloji Danışmanlığı', 'Consultoría Tecnológica', 'Consultoria Tecnológica', 'IT and technology solutions', 'BT ve teknoloji çözümleri', 'Soluciones de TI y tecnología', 'Soluções de TI e tecnologia'),
('Marketing Services', 'Pazarlama Hizmetleri', 'Servicios de Marketing', 'Serviços de Marketing', 'Marketing and advertising consulting', 'Pazarlama ve reklam danışmanlığı', 'Consultoría de marketing y publicidad', 'Consultoria de marketing e publicidade')
ON CONFLICT DO NOTHING;

-- Insert some basic services
INSERT INTO services (category_id, name_en, name_tr, name_es, name_pt, description_en, description_tr, description_es, description_pt, base_price) VALUES
(1, 'Business Plan Development', 'İş Planı Geliştirme', 'Desarrollo de Plan de Negocios', 'Desenvolvimento de Plano de Negócios', 'Comprehensive business plan creation', 'Kapsamlı iş planı oluşturma', 'Creación integral de plan de negocios', 'Criação abrangente de plano de negócios', 500.00),
(1, 'Market Research', 'Pazar Araştırması', 'Investigación de Mercado', 'Pesquisa de Mercado', 'Market analysis and research services', 'Pazar analizi ve araştırma hizmetleri', 'Servicios de análisis e investigación de mercado', 'Serviços de análise e pesquisa de mercado', 300.00),
(2, 'Contract Review', 'Sözleşme İncelemesi', 'Revisión de Contratos', 'Revisão de Contratos', 'Legal contract review and advice', 'Hukuki sözleşme incelemesi ve tavsiye', 'Revisión legal de contratos y asesoramiento', 'Revisão legal de contratos e aconselhamento', 200.00),
(2, 'Company Formation', 'Şirket Kuruluşu', 'Formación de Empresa', 'Formação de Empresa', 'Business entity formation services', 'İş varlığı oluşturma hizmetleri', 'Servicios de formación de entidades comerciales', 'Serviços de formação de entidades comerciais', 800.00),
(3, 'Tax Return Preparation', 'Vergi Beyannamesi Hazırlama', 'Preparación de Declaración de Impuestos', 'Preparação de Declaração de Impostos', 'Personal and business tax returns', 'Kişisel ve işletme vergi beyannameleri', 'Declaraciones de impuestos personales y comerciales', 'Declarações de impostos pessoais e comerciais', 150.00),
(4, 'Visa Application Assistance', 'Vize Başvuru Yardımı', 'Asistencia para Solicitud de Visa', 'Assistência para Solicitação de Visto', 'Help with visa applications and documentation', 'Vize başvuruları ve belgelendirme konusunda yardım', 'Ayuda con solicitudes de visa y documentación', 'Ajuda com solicitações de visto e documentação', 250.00),
(5, 'Property Investment Advice', 'Mülk Yatırım Tavsiyesi', 'Asesoramiento de Inversión Inmobiliaria', 'Aconselhamento de Investimento Imobiliário', 'Real estate investment consulting', 'Gayrimenkul yatırım danışmanlığı', 'Consultoría de inversión inmobiliaria', 'Consultoria de investimento imobiliário', 400.00)
ON CONFLICT DO NOTHING;