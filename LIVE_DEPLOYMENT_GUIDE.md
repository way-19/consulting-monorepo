# 🚀 Canlı Deployment Rehberi

## 📋 Sistem Durumu

✅ **GitHub Repository**: https://github.com/way-19/consulting-monorepo  
✅ **Supabase (Canlı)**: https://qdwykqrepolavgvfxquw.supabase.co  
✅ **Local Development**: Çalışıyor  
✅ **Docker**: Kaldırıldı (Artık kullanılmıyor)  

## 🌐 Canlı Uygulamalar

### 1. Marketing App (Ana Site)
- **URL**: https://consulting19.com
- **Netlify Site**: Ana site
- **Build Command**: `npm run build:marketing`
- **Publish Directory**: `apps/marketing/dist`

### 2. Client App
- **URL**: https://client.consulting19.com
- **Netlify Site**: consulting19-client
- **Build Command**: `npm run build:client`
- **Publish Directory**: `apps/client/dist`

### 3. Consultant App
- **URL**: https://consultant.consulting19.com
- **Netlify Site**: consulting19-consultant
- **Build Command**: `npm run build:consultant`
- **Publish Directory**: `apps/consultant/dist`

### 4. Admin App
- **URL**: https://admin.consulting19.com
- **Netlify Site**: consulting19-admin
- **Build Command**: `npm run build:admin`
- **Publish Directory**: `apps/admin/dist`

## 🔧 Netlify Kurulumu

### Adım 1: Netlify Hesabı ve Site Oluşturma

1. **Netlify'da yeni site oluştur**:
   ```
   - GitHub repository'yi bağla: way-19/consulting-monorepo
   - Branch: main
   - Build command: npm run build:marketing
   - Publish directory: apps/marketing/dist
   ```

2. **Her uygulama için ayrı site oluştur**:
   - Marketing: `consulting19-marketing` (ana domain)
   - Client: `consulting19-client`
   - Consultant: `consulting19-consultant`
   - Admin: `consulting19-admin`

### Adım 2: Environment Variables

Her Netlify sitesinde şu environment variables'ları ekle:

```env
VITE_SUPABASE_URL=https://qdwykqrepolavgvfxquw.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFkd3lrcXJlcG9sYXZndmZ4cXV3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYwNjgzNDIsImV4cCI6MjA3MTY0NDM0Mn0.WuaXRd_Kgd0ld4hMaeLptJktK3AiGTwRajpAnYgyhPo
NODE_ENV=production
```

### Adım 3: Build Settings

Her uygulama için build ayarları:

**Marketing App**:
```
Build command: npm run build:marketing
Publish directory: apps/marketing/dist
```

**Client App**:
```
Build command: npm run build:client
Publish directory: apps/client/dist
```

**Consultant App**:
```
Build command: npm run build:consultant
Publish directory: apps/consultant/dist
```

**Admin App**:
```
Build command: npm run build:admin
Publish directory: apps/admin/dist
```

## 🔄 GitHub Actions (Otomatik Deployment)

GitHub repository'de şu secrets'ları ekle:

```
VITE_SUPABASE_URL=https://qdwykqrepolavgvfxquw.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFkd3lrcXJlcG9sYXZndmZ4cXV3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYwNjgzNDIsImV4cCI6MjA3MTY0NDM0Mn0.WuaXRd_Kgd0ld4hMaeLptJktK3AiGTwRajpAnYgyhPo
NETLIFY_AUTH_TOKEN=[Netlify Personal Access Token]
NETLIFY_SITE_ID_MARKETING=[Marketing Site ID]
NETLIFY_SITE_ID_CLIENT=[Client Site ID]
NETLIFY_SITE_ID_CONSULTANT=[Consultant Site ID]
NETLIFY_SITE_ID_ADMIN=[Admin Site ID]
```

## 🌍 Domain Ayarları

### Ana Domain (consulting19.com)
- Marketing app'e yönlendir
- Netlify DNS kullan

### Subdomainler
- `client.consulting19.com` → Client app
- `consultant.consulting19.com` → Consultant app
- `admin.consulting19.com` → Admin app

## 📊 Monitoring ve Test

### Canlı Test Komutları

```bash
# Supabase bağlantı testi
node test-live-supabase.cjs

# Local development
npm run dev:all

# Production build test
npm run build:all
```

### Kullanıcı Hesapları (Canlı)

- **Admin**: admin@consulting19.com / admin123
- **Client**: client@consulting19.com / [şifre]
- **Consultant**: giorgi.meskhi@consulting19.com / [şifre]

## 🚀 Deployment Süreci

### Manuel Deployment
```bash
# 1. Değişiklikleri commit et
git add .
git commit -m "Update: [açıklama]"
git push origin main

# 2. Netlify otomatik build başlatır
# 3. Her uygulama ayrı ayrı deploy edilir
```

### Otomatik Deployment
- Her `main` branch'e push'ta GitHub Actions çalışır
- Tüm uygulamalar paralel olarak build edilir
- Netlify'a otomatik deploy edilir

## 🔧 Troubleshooting

### Build Hataları
```bash
# Dependencies yenile
npm ci

# Cache temizle
npm run clean
npm install

# Tek tek build test et
npm run build:marketing
npm run build:client
npm run build:consultant
npm run build:admin
```

### Supabase Bağlantı Sorunları
```bash
# Bağlantı test et
node test-live-supabase.cjs

# Environment variables kontrol et
cat .env
```

## 📝 Notlar

- ✅ Docker tamamen kaldırıldı
- ✅ Tüm geliştirme canlı Supabase ile yapılıyor
- ✅ GitHub repository ana kaynak
- ✅ Netlify otomatik deployment
- ✅ Her uygulama ayrı subdomain'de çalışıyor

## 🎯 Sonraki Adımlar

1. Netlify hesabında siteleri oluştur
2. Domain ayarlarını yap
3. GitHub secrets'ları ekle
4. İlk deployment'ı test et
5. Monitoring kurulumunu tamamla