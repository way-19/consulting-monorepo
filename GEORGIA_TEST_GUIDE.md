# 🇬🇪 Gürcistan Test Rehberi - Real-Time Senkronizasyon

## 🌐 External URL'ler (Internet Üzerinden Erişilebilir)

### Uygulamalar
- **👥 Client App**: https://consulting-client-georgia.loca.lt
- **💼 Consultant App**: https://consulting-consultant-georgia.loca.lt  
- **⚙️ Admin App**: https://consulting-admin-georgia.loca.lt
- **📝 Marketing/Order Form**: http://localhost:5173 (Sadece local - ngrok gerekli)

## 🔑 Test Hesapları

### 1. Admin Hesabı
- **Email**: admin@consulting19.com
- **Password**: admin123
- **Rol**: Admin
- **Erişim**: Tüm uygulamalar

### 2. Consultant Hesabı (Danışman)
- **Email**: giorgi.meskhi@consulting19.com
- **Password**: consultant123
- **Rol**: Consultant
- **Erişim**: Consultant App

### 3. Client Hesabı (Müşteri)
- **Email**: client@consulting19.com
- **Password**: client123
- **Rol**: Client
- **Erişim**: Client App

## 🧪 Senkronizasyon Test Senaryoları

### Senaryo 1: Doküman Yükleme ve Real-Time Görüntüleme
1. **Gürcistan'da Client olarak**:
   - https://consulting-client-georgia.loca.lt adresine git
   - client@consulting19.com / client123 ile giriş yap
   - Documents sayfasına git
   - Bir doküman yükle

2. **Türkiye'de Consultant olarak**:
   - https://consulting-consultant-georgia.loca.lt adresine git
   - giorgi.meskhi@consulting19.com / consultant123 ile giriş yap
   - Client Documents sayfasına git
   - Yüklenen dokümanı **anında** görmelisin

### Senaryo 2: Mesajlaşma Sistemi
1. **Gürcistan'da Client olarak**:
   - Messages sayfasına git
   - Consultant'a mesaj gönder

2. **Türkiye'de Consultant olarak**:
   - Messages sayfasına git
   - Gelen mesajı **real-time** olarak gör
   - Yanıt gönder

3. **Gürcistan'da Client olarak**:
   - Yanıtı **anında** görmelisin

### Senaryo 3: Appointment Sistemi
1. **Gürcistan'da Client olarak**:
   - Appointments sayfasına git
   - Yeni randevu talep et

2. **Türkiye'de Consultant olarak**:
   - Appointments sayfasına git
   - Randevu talebini **real-time** olarak gör
   - Onayla veya reddet

3. **Gürcistan'da Client olarak**:
   - Randevu durumunu **anında** görmelisin

### Senaryo 4: Admin Monitoring
1. **Türkiye'de Admin olarak**:
   - https://consulting-admin-georgia.loca.lt adresine git
   - admin@consulting19.com / admin123 ile giriş yap
   - Tüm client-consultant etkileşimlerini **real-time** izle

## 🔄 Senkronizasyon Kontrol Noktaları

### ✅ Başarılı Senkronizasyon İşaretleri:
- Doküman yüklendikten sonra 1-2 saniye içinde diğer tarafta görünmeli
- Mesajlar anında iletilmeli
- Randevu durumu değişiklikleri anında yansımalı
- Admin panelinde tüm aktiviteler real-time görünmeli

### ❌ Senkronizasyon Sorunları:
- 5+ saniye gecikme
- Sayfa yenileme gerektiren güncellemeler
- Eksik bildirimler
- Hatalı durum gösterimleri

## 🌍 Zaman Dilimi Notları
- **Türkiye**: UTC+3
- **Gürcistan**: UTC+4 (1 saat ileri)
- Timestamp'ler UTC olarak kaydediliyor
- Local time conversion otomatik yapılıyor

## 🔧 Teknik Detaylar

### Real-Time Teknolojiler:
- **Supabase Real-time**: WebSocket bağlantıları
- **Database**: PostgreSQL with real-time subscriptions
- **Storage**: Supabase Storage (real-time file sync)

### Network Gereksinimleri:
- **Minimum**: 1 Mbps internet
- **Önerilen**: 5+ Mbps (doküman yükleme için)
- **Latency**: <500ms (optimal senkronizasyon için)

## 🚨 Sorun Giderme

### Bağlantı Sorunları:
1. URL'lerin çalıştığını kontrol et
2. Firewall/antivirus ayarlarını kontrol et
3. VPN kullanıyorsan kapat

### Giriş Sorunları:
1. Email/password'u tam olarak kopyala
2. Büyük/küçük harf duyarlılığına dikkat et
3. Browser cache'ini temizle

### Senkronizasyon Sorunları:
1. Browser'ı yenile (F5)
2. Farklı browser dene
3. Network bağlantısını kontrol et

## 📞 Test Koordinasyonu

### Test Zamanlaması:
- **Önerilen**: Türkiye 14:00 = Gürcistan 15:00
- **Test Süresi**: 30-45 dakika
- **Backup Plan**: WhatsApp/Telegram koordinasyonu

### Test Checklist:
- [ ] Tüm URL'ler erişilebilir
- [ ] Giriş işlemleri başarılı
- [ ] Doküman yükleme çalışıyor
- [ ] Mesajlaşma real-time
- [ ] Randevu sistemi senkron
- [ ] Admin monitoring aktif

## 🎯 Başarı Kriterleri

Test başarılı sayılır eğer:
1. **Latency** < 3 saniye
2. **Uptime** %95+
3. **Data consistency** %100
4. **Real-time updates** çalışıyor
5. **Cross-browser compatibility** var

---

**Not**: Bu test ortamı production'a hazırlık için tasarlanmıştır. Gerçek deployment'ta aynı performans beklenir.