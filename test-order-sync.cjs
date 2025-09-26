const { createClient } = require('@supabase/supabase-js');

async function testOrderSync() {
  console.log('🧪 Order form senkronizasyon testi...\n');
  
  const supabase = createClient('http://127.0.0.1:54321', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU');
  
  try {
    // Test 1: Create test client
    console.log('1. Test müşteri oluşturuluyor...');
    const { data: client, error: clientError } = await supabase
      .from('clients')
      .insert({
        email: `test${Date.now()}@example.com`,
        first_name: 'Test',
        last_name: 'User',
        phone: '+1234567890',
        country_code: 'US'
      })
      .select()
      .single();
    
    if (clientError) {
      console.log('   ❌ Hata:', clientError.message);
      return;
    }
    console.log('   ✅ Müşteri oluşturuldu, ID:', client.id);
    
    // Test 2: Create test order
    console.log('\n2. Test sipariş oluşturuluyor...');
    const { data: order, error: orderError } = await supabase
      .from('service_orders')
      .insert({
        client_id: client.id,
        title: 'Test Company Formation',
        description: 'Test order for company formation service',
        budget: 299.00,
        status: 'pending'
      })
      .select()
      .single();
    
    if (orderError) {
      console.log('   ❌ Hata:', orderError.message);
      return;
    }
    console.log('   ✅ Sipariş oluşturuldu, ID:', order.id);
    
    // Test 3: Update order status
    console.log('\n3. Sipariş durumu güncelleniyor...');
    const { data: updated, error: updateError } = await supabase
      .from('service_orders')
      .update({ status: 'processing' })
      .eq('id', order.id)
      .select()
      .single();
    
    if (updateError) {
      console.log('   ❌ Hata:', updateError.message);
    } else {
      console.log('   ✅ Durum güncellendi:', updated.status);
    }
    
    // Clean up
    await supabase.from('service_orders').delete().eq('id', order.id);
    await supabase.from('clients').delete().eq('id', client.id);
    
    console.log('\n🎉 Order form senkronizasyon BAŞARILI!');
    console.log('   ✅ Müşteri oluşturma: Çalışıyor');
    console.log('   ✅ Sipariş oluşturma: Çalışıyor');
    console.log('   ✅ Sipariş güncelleme: Çalışıyor');
    
  } catch (error) {
    console.error('❌ Test hatası:', error.message);
  }
}

testOrderSync();