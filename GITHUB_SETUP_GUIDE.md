# 🚀 GitHub Repo Kurulum ve Çalışma Alanı Rehberi

## 📋 Mevcut Durum
- ✅ Tüm uygulamalar cloud Supabase'e bağlı
- ✅ Docker tamamen kaldırıldı
- ❌ Admin giriş sorunu devam ediyor
- 📁 Çalışma alanı: Yerel dosya sistemi

## 🎯 Hedef
- 🌐 GitHub repo'dan çalışmak
- 🔧 Trae AI'da GitHub workspace kullanmak
- 🔐 Admin giriş sorununu çözmek

---

## 📚 1. GitHub Repo Oluşturma

### Adım 1: GitHub'da Yeni Repo Oluştur
```bash
# GitHub'da yeni repo oluştur:
# - Repo adı: consulting-monorepo
# - Private/Public seç
# - README.md ekleme (zaten var)
```

### Adım 2: Mevcut Kodu GitHub'a Push Et
```bash
# Mevcut dizinde
cd C:\consulting-monorepo

# Git init (eğer yoksa)
git init

# Remote ekle
git remote add origin https://github.com/[USERNAME]/consulting-monorepo.git

# Tüm dosyaları ekle
git add .

# Commit
git commit -m "Initial commit: Production-ready consulting monorepo with cloud Supabase"

# Push
git push -u origin main
```

---

## 🔄 2. Trae AI'da GitHub Workspace Kullanma

### Yöntem 1: GitHub URL ile Açma
```
1. Trae AI'da "Open from GitHub" seçeneğini kullan
2. Repo URL'ini gir: https://github.com/[USERNAME]/consulting-monorepo
3. Clone işlemi otomatik olacak
```

### Yöntem 2: Manuel Clone
```bash
# Yeni bir dizinde
git clone https://github.com/[USERNAME]/consulting-monorepo.git
cd consulting-monorepo

# Dependencies yükle
npm install

# .env dosyasını oluştur (aşağıdaki bilgilerle)
```

---

## ⚙️ 3. .env Dosyası Konfigürasyonu

```env
# Supabase Configuration (Production)
VITE_SUPABASE_URL=https://qdwykqrepolavgvfxquw.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFkd3lrcXJlcG9sYXZndmZ4cXV3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzgwNzI4NjQsImV4cCI6MjA1MzY0ODg2NH0.Qs8-Qs8-Qs8-Qs8-Qs8-Qs8-Qs8-Qs8-Qs8-Qs8-Qs8
SUPABASE_URL=https://qdwykqrepolavgvfxquw.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFkd3lrcXJlcG9sYXZndmZ4cXV3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczODA3Mjg2NCwiZXhwIjoyMDUzNjQ4ODY0fQ.SERVICE_ROLE_KEY

# User Roles
VITE_ADMIN_ROLE=admin
VITE_CONSULTANT_ROLE=consultant
VITE_CLIENT_ROLE=client

# Environment
NODE_ENV=development
VITE_ENVIRONMENT=production

# CORS
VITE_CORS_ORIGIN=*
```

---

## 🚀 4. Uygulamaları Başlatma

```bash
# Tüm uygulamaları başlat
npm run dev:all

# Veya tek tek:
npm run dev          # Marketing (5173)
npm run dev:admin    # Admin (5174)
npm run dev:client   # Client (5177)
npm run dev:consultant # Consultant (5176)
```

### Uygulama URL'leri:
- 🌐 **Marketing:** http://localhost:5173
- ⚙️ **Admin:** http://localhost:5174
- 👥 **Client:** http://localhost:5177
- 💼 **Consultant:** http://localhost:5176

---

## 🔐 5. Admin Giriş Sorunu Çözümü

### Sorun: Admin giriş başarısız
- **Email:** admin@consulting19.com
- **Şifre:** Hiçbir şifre çalışmıyor

### Çözüm Seçenekleri:

#### Seçenek A: Supabase Dashboard'dan Reset
```
1. https://supabase.com/dashboard/project/qdwykqrepolavgvfxquw/auth/users
2. admin@consulting19.com kullanıcısını bul
3. "Reset Password" butonuna tıkla
4. Yeni şifreyi "admin123" olarak ayarla
```

#### Seçenek B: Yeni Admin Oluştur
```bash
# Script çalıştır
node create-new-admin.cjs
```

#### Seçenek C: Email Doğrulama
```
Admin kullanıcısının email'i doğrulanmamış olabilir.
Supabase Dashboard'dan email_confirmed_at alanını kontrol et.
```

---

## 📁 6. Dosya Yapısı

```
consulting-monorepo/
├── apps/
│   ├── admin/          # Admin Panel (5174)
│   ├── client/         # Client App (5177)
│   ├── consultant/     # Consultant App (5176)
│   └── marketing/      # Marketing Site (5173)
├── packages/
│   └── shared/         # Shared Components
├── supabase/
│   ├── migrations/     # Database Migrations
│   └── functions/      # Edge Functions
├── .env               # Environment Variables
├── package.json       # Root Dependencies
└── README.md          # Documentation
```

---

## ✅ 7. Doğrulama Checklist

- [ ] GitHub repo oluşturuldu
- [ ] Kod GitHub'a push edildi
- [ ] Trae AI'da GitHub workspace açıldı
- [ ] .env dosyası doğru konfigüre edildi
- [ ] npm install çalıştırıldı
- [ ] Tüm uygulamalar başlatıldı
- [ ] Admin giriş sorunu çözüldü
- [ ] Supabase bağlantısı test edildi

---

## 🆘 Sorun Giderme

### Yaygın Sorunlar:

1. **npm install hatası**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **Port çakışması**
   ```bash
   # Portları kontrol et
   netstat -ano | findstr :5173
   netstat -ano | findstr :5174
   ```

3. **Supabase bağlantı hatası**
   ```bash
   # .env dosyasını kontrol et
   node test-supabase-connection.cjs
   ```

4. **Admin giriş sorunu**
   ```bash
   # Admin durumunu kontrol et
   node check-admin-status.cjs
   ```

---

## 📞 Destek

Sorun yaşarsanız:
1. Terminal loglarını kontrol edin
2. Browser console'u kontrol edin
3. Supabase Dashboard'u kontrol edin
4. Bu rehberdeki adımları tekrar takip edin

**🎉 Başarılar!**