# Test Senaryoları - Multi-Port Development

## Port Dağılımı
- **Marketing**: http://localhost:5173/ (Order Form)
- **Client App**: http://localhost:5177/
- **Consultant App**: http://localhost:5176/
- **Admin App**: http://localhost:5174/

## Test Kullanıcıları
- **Admin**: admin@consulting19.com / password123
- **Consultant**: giorgi.meskhi@consulting19.com / password123
- **Client**: client@consulting19.com / password123

## Test Senaryoları

### 1. Order Form Senkronizasyon Testi ⭐
1. **Marketing'te (Port 5173)**:
   - Order form'u doldur ve gönder
   - `service_orders` tablosuna kayıt eklenir
   
2. **Consultant'ta (Port 5176)**:
   - Dashboard'da yeni order'ı görüntüle
   - Financial sayfasında commission hesaplamasını kontrol et
   
3. **Admin'de (Port 5174)**:
   - Tüm order'ları görüntüle
   - Order durumunu güncelle (pending → approved)
   
4. **Real-time Kontrol**:
   - Admin'de durum değişikliği yaptıktan sonra
   - Consultant'ta anında güncelleme olup olmadığını kontrol et

### 2. Doküman Yükleme ve Görüntüleme Testi
1. **Client'ta (Port 5177)**:
   - Client olarak giriş yap
   - Doküman yükle
   
2. **Consultant'ta (Port 5176)**:
   - Consultant olarak giriş yap
   - Client'ın yüklediği dokümanı görüntüle
   - Doküman durumunu güncelle

### 3. Mesajlaşma Testi
1. **Client'ta**: Consultant'a mesaj gönder
2. **Consultant'ta**: Mesajı görüntüle ve yanıtla
3. **Real-time güncellemeleri kontrol et**

### 4. Task Oluşturma ve Takip Testi
1. **Admin'de**: Order'ı approve et
2. **Consultant'ta**: Otomatik oluşan task'ları görüntüle
3. **Client'ta**: Kendisine atanan task'ları görüntüle

## Senkronizasyon Kontrol Noktaları

### ✅ Order Form Senkronizasyonu
- [ ] Order oluşturma sonrası anında görünürlük
- [ ] Order durum değişiklikleri real-time yansıma
- [ ] Commission hesaplamaları güncel
- [ ] CrossDomainSync çalışıyor mu?

### ✅ Genel Senkronizasyon
- [ ] Doküman yükleme sonrası anında görünürlük
- [ ] Mesaj gönderme sonrası real-time güncelleme
- [ ] Task oluşturma ve durum değişiklikleri
- [ ] Bildirimler çalışıyor mu?

## Tarayıcı Önerileri
- **Chrome**: Marketing/Order Form için
- **Firefox**: Consultant rolü için  
- **Edge**: Admin rolü için
- **Safari**: Client rolü için

## Önemli Notlar

### 🔄 CrossDomainSync Sistemi
Order form'da zaten **CrossDomainSync** sistemi mevcut:
- localStorage değişikliklerini dinler
- Cross-tab communication sağlar
- Real-time güncellemeler yapar

### 🗄️ Aynı Veritabanı
Tüm uygulamalar aynı Supabase veritabanını kullandığı için:
- Veriler anında senkronize
- Real-time subscriptions aktif
- RLS policies güvenliği sağlıyor

### 🚀 Test Sırası
1. **Önce Order Form** (en kritik)
2. **Sonra Document Management**
3. **Son olarak Messaging**

Bu şekilde aynı anda 4 farklı tarayıcıda 4 farklı uygulama test edebilirsiniz!