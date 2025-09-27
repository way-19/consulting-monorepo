# 🔧 Netlify Environment Variables Düzeltme Rehberi

## 🚨 Sorun
Danışman paneline giriş yaptığınızda localhost'a yönlendiriliyor. Bu sorun, Netlify'da consultant uygulaması için environment değişkenlerinin doğru şekilde ayarlanmamasından kaynaklanıyor.

## ✅ Çözüm

### 1. Netlify Dashboard'a Git
1. https://app.netlify.com adresine git
2. `consulting19-consultant` sitesini bul ve tıkla

### 2. Environment Variables Ekle
1. Sol menüden **Site settings** → **Environment variables** seçeneğine git
2. **Add a variable** butonuna tıkla
3. Şu değişkenleri ekle:

```
VITE_SUPABASE_URL = https://qdwykqrepolavgvfxquw.supabase.co
VITE_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFkd3lrcXJlcG9sYXZndmZ4cXV3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYwNjgzNDIsImV4cCI6MjA3MTY0NDM0Mn0.WuaXRd_Kgd0ld4hMaeLptJktK3AiGTwRajpAnYgyhPo
NODE_ENV = production
```

### 3. Diğer Uygulamalar İçin de Kontrol Et

Aynı environment değişkenlerini şu sitelerde de kontrol et:
- `consulting19-client` (Client App)
- `consulting19-admin` (Admin App)

### 4. Redeploy Yap
1. **Deploys** sekmesine git
2. **Trigger deploy** → **Deploy site** butonuna tıkla
3. Build tamamlanana kadar bekle

## 🔍 Kontrol

Deploy tamamlandıktan sonra:
1. https://consultant.consulting19.com adresine git
2. Giriş yap: `giorgi.meskhi@consulting19.com` / `Consultant123!`
3. Artık localhost'a yönlendirmemeli

## 📝 Notlar

- Environment değişkenleri build sırasında uygulamaya gömülür
- Değişiklik yaptıktan sonra mutlaka redeploy yapmalısınız
- Tüm uygulamalar aynı Supabase instance'ını kullanır

## 🆘 Hala Sorun Varsa

Eğer sorun devam ederse:
1. Browser cache'ini temizle (Ctrl+Shift+R)
2. Incognito/Private modda dene
3. Browser Developer Tools'da Console'u kontrol et