# 🚀 Real-Time Senkronizasyon Test Senaryoları

## 🌐 Tüm External URL'ler

- **📝 Marketing/Order Form**: https://consulting-marketing-georgia.loca.lt
- **👥 Client App**: https://consulting-client-georgia.loca.lt
- **💼 Consultant App**: https://consulting-consultant-georgia.loca.lt  
- **⚙️ Admin App**: https://consulting-admin-georgia.loca.lt

## 🎯 Test Senaryoları (Öncelik Sırasına Göre)

### 🔥 Senaryo 1: Order Form → Consultant Dashboard Senkronizasyonu
**Amaç**: Order form'dan gelen siparişlerin consultant dashboard'da real-time görünmesi

**Adımlar**:
1. **Gürcistan'da** (Marketing):
   - https://consulting-marketing-georgia.loca.lt adresine git
   - Order form'u doldur:
     - Service: "Company Registration"
     - Country: "Georgia"
     - Package: "Standard"
     - Contact info doldur
   - Submit et

2. **Türkiye'de** (Consultant):
   - https://consulting-consultant-georgia.loca.lt adresine git
   - giorgi.meskhi@consulting19.com / consultant123 ile giriş yap
   - Dashboard'a git
   - **Beklenen**: Yeni order **5 saniye içinde** görünmeli

3. **Verification**:
   - Order details doğru mu?
   - Commission calculation yapıldı mı?
   - Status "pending" olarak görünüyor mu?

### 🔥 Senaryo 2: Client Document Upload → Consultant Notification
**Amaç**: Client'ın yüklediği dokümanların consultant'a anında bildirilmesi

**Adımlar**:
1. **Gürcistan'da** (Client):
   - https://consulting-client-georgia.loca.lt adresine git
   - client@consulting19.com / client123 ile giriş yap
   - Documents sayfasına git
   - Bir PDF/image yükle

2. **Türkiye'de** (Consultant):
   - https://consulting-consultant-georgia.loca.lt adresine git
   - Client Documents sayfasında bekle
   - **Beklenen**: Yeni doküman **3 saniye içinde** görünmeli

3. **Verification**:
   - File name doğru mu?
   - Upload timestamp doğru mu?
   - Download link çalışıyor mu?

### 🔥 Senaryo 3: Bidirectional Messaging
**Amaç**: Client-Consultant arası real-time mesajlaşma

**Adımlar**:
1. **Gürcistan'da** (Client):
   - Messages sayfasına git
   - "Merhaba, dokümanlarımı kontrol ettiniz mi?" mesajı gönder

2. **Türkiye'de** (Consultant):
   - Messages sayfasında bekle
   - **Beklenen**: Mesaj **2 saniye içinde** görünmeli
   - "Evet, kontrol ettim. Ek bilgi gerekiyor." yanıtı gönder

3. **Gürcistan'da** (Client):
   - **Beklenen**: Yanıt **2 saniye içinde** görünmeli

### 🔥 Senaryo 4: Appointment Scheduling Real-Time
**Amaç**: Randevu sistemi senkronizasyonu

**Adımlar**:
1. **Gürcistan'da** (Client):
   - Appointments sayfasına git
   - Yarın için 15:00 randevu talep et
   - Note: "Company registration için görüşmek istiyorum"

2. **Türkiye'de** (Consultant):
   - Appointments sayfasında bekle
   - **Beklenen**: Randevu talebi **3 saniye içinde** görünmeli
   - Status'u "Confirmed" olarak değiştir

3. **Gürcistan'da** (Client):
   - **Beklenen**: Onay **2 saniye içinde** görünmeli

### 🔥 Senaryo 5: Admin Real-Time Monitoring
**Amaç**: Admin'in tüm aktiviteleri real-time izlemesi

**Adımlar**:
1. **Türkiye'de** (Admin):
   - https://consulting-admin-georgia.loca.lt adresine git
   - admin@consulting19.com / admin123 ile giriş yap
   - Dashboard'da bekle

2. **Gürcistan'da** (Client):
   - Yukarıdaki tüm aktiviteleri tekrarla:
     - Doküman yükle
     - Mesaj gönder
     - Randevu talep et

3. **Türkiye'de** (Admin):
   - **Beklenen**: Tüm aktiviteler **real-time** görünmeli
   - User activity logs güncellensin
   - Statistics anında değişsin

## ⏱️ Performance Benchmarks

### 🎯 Kabul Edilebilir Latency:
- **Mesajlaşma**: < 2 saniye
- **Doküman yükleme**: < 5 saniye
- **Order processing**: < 5 saniye
- **Status updates**: < 3 saniye

### 🚨 Kritik Eşikler:
- **> 10 saniye**: Kabul edilemez
- **> 30 saniye**: Sistem hatası
- **Timeout**: Network sorunu

## 🔍 Debug ve Monitoring

### Browser Console Kontrolleri:
```javascript
// WebSocket bağlantısını kontrol et
console.log('Supabase realtime status:', supabase.realtime.channels);

// Network requests'i izle
// Developer Tools > Network tab'ında realtime connections'ı kontrol et
```

### Database Real-Time Subscriptions:
- `service_orders` tablosu
- `documents` tablosu  
- `messages` tablosu
- `appointments` tablosu
- `user_profiles` tablosu

## 🧪 Stress Test Senaryoları

### Senaryo A: Concurrent Users
1. **Aynı anda**:
   - Gürcistan'da 2 client
   - Türkiye'de 1 consultant
   - Türkiye'de 1 admin

2. **Aktiviteler**:
   - Her client aynı anda doküman yüklesin
   - Consultant her ikisine de yanıt versin
   - Admin tüm aktiviteyi izlesin

### Senaryo B: High Frequency Updates
1. **1 dakika içinde**:
   - 5 mesaj gönder
   - 3 doküman yükle
   - 2 randevu talep et

2. **Beklenen**:
   - Hiç kayıp olmasın
   - Sıralama korunsun
   - Performance düşmesin

## 📊 Test Sonuçları Kayıt Formu

### Test Bilgileri:
- **Tarih/Saat**: ___________
- **Test Eden**: ___________
- **Network Speed**: ___________
- **Browser**: ___________

### Senaryo Sonuçları:
| Senaryo | Latency | Başarı | Notlar |
|---------|---------|--------|--------|
| Order Form Sync | ___s | ✅/❌ | ______ |
| Document Upload | ___s | ✅/❌ | ______ |
| Messaging | ___s | ✅/❌ | ______ |
| Appointments | ___s | ✅/❌ | ______ |
| Admin Monitoring | ___s | ✅/❌ | ______ |

### Genel Değerlendirme:
- **Overall Performance**: ⭐⭐⭐⭐⭐
- **User Experience**: ⭐⭐⭐⭐⭐
- **Reliability**: ⭐⭐⭐⭐⭐

### Sorunlar ve Çözümler:
1. **Sorun**: ________________
   **Çözüm**: ________________

2. **Sorun**: ________________
   **Çözüm**: ________________

## 🚀 Production Readiness Checklist

- [ ] Tüm senaryolar < 5s latency
- [ ] %99+ uptime
- [ ] Zero data loss
- [ ] Cross-browser compatibility
- [ ] Mobile responsiveness
- [ ] Error handling
- [ ] Graceful degradation
- [ ] Security validation

---

**🎯 Hedef**: Bu test başarılı olursa, sistem production'a hazır demektir!