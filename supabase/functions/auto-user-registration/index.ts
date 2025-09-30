import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { 
      email, 
      firstName, 
      lastName, 
      phone, 
      companyName, 
      countryCode,
      orderData 
    } = await req.json()

    console.log('🚀 Auto User Registration Started:', { email, firstName, lastName, countryCode })

    // 1. Generate temporary password
    const tempPassword = Math.random().toString(36).slice(-12) + 'A1!'
    
    // 2. Create auth user
    const { data: authUser, error: authError } = await supabaseClient.auth.admin.createUser({
      email: email,
      password: tempPassword,
      email_confirm: true,
      user_metadata: {
        first_name: firstName,
        last_name: lastName,
        phone: phone,
        company_name: companyName,
        country_code: countryCode,
        registration_source: 'order_form',
        temp_password: tempPassword
      }
    })

    if (authError) {
      console.error('❌ Auth user creation failed:', authError)
      throw authError
    }

    console.log('✅ Auth user created:', authUser.user.id)

    // 3. Create user profile
    const { data: userProfile, error: profileError } = await supabaseClient
      .from('user_profiles')
      .insert({
        user_id: authUser.user.id,
        email: email,
        first_name: firstName,
        last_name: lastName,
        role: 'client',
        is_active: true
      })
      .select()
      .single()

    if (profileError) {
      console.error('❌ User profile creation failed:', profileError)
      throw profileError
    }

    console.log('✅ User profile created')

    // 4. Create client record
    const { data: clientRecord, error: clientError } = await supabaseClient
      .from('clients')
      .insert({
        user_id: authUser.user.id,
        first_name: firstName,
        last_name: lastName,
        email: email,
        phone: phone,
        company_name: companyName,
        country_code: countryCode,
        preferred_language: 'en'
      })
      .select()
      .single()

    if (clientError) {
      console.error('❌ Client record creation failed:', clientError)
      throw clientError
    }

    console.log('✅ Client record created:', clientRecord.id)

    // 5. Auto-assign consultant based on country
    const { data: consultantCountries, error: consultantError } = await supabaseClient
      .from('consultant_countries')
      .select(`
        consultant_id,
        is_primary,
        max_orders_per_month,
        current_month_orders,
        user_profiles!inner(
          user_id,
          email,
          first_name,
          last_name,
          role
        )
      `)
      .eq('country_code', countryCode)
      .eq('user_profiles.role', 'consultant')
      .eq('user_profiles.is_active', true)
      .order('is_primary', { ascending: false })
      .order('current_month_orders', { ascending: true })

    let assignedConsultant = null
    if (consultantCountries && consultantCountries.length > 0) {
      // Find consultant with available capacity
      for (const cc of consultantCountries) {
        if (cc.current_month_orders < cc.max_orders_per_month) {
          assignedConsultant = cc
          break
        }
      }
      
      // If no consultant has capacity, assign to primary consultant
      if (!assignedConsultant) {
        assignedConsultant = consultantCountries.find(cc => cc.is_primary) || consultantCountries[0]
      }
    }

    console.log('🎯 Assigned consultant:', assignedConsultant?.user_profiles?.email || 'None')

    // 6. Create service order with commission calculation
    console.log('📋 Creating service order...')
    
    // Calculate commission (get consultant's commission rate or use default 65%)
    let commissionRate = 65 // Default commission rate
    let consultantCommissionAmount = 0
    let systemCommissionAmount = 0
    
    if (assignedConsultant) {
      // Get consultant's commission rate from consultant_profiles
      const { data: consultantProfile } = await supabaseClient
        .from('consultant_profiles')
        .select('commission_rate')
        .eq('user_id', assignedConsultant.consultant_id)
        .single()
      
      if (consultantProfile?.commission_rate) {
        commissionRate = consultantProfile.commission_rate
      }
    }
    
    const totalAmount = orderData.total_amount || 0
    consultantCommissionAmount = totalAmount * (commissionRate / 100)
    systemCommissionAmount = totalAmount - consultantCommissionAmount
    
    const { data: serviceOrder, error: orderError } = await supabaseClient
      .from('service_orders')
      .insert({
        client_id: clientRecord.id,
        consultant_id: assignedConsultant?.consultant_id || null,
        title: `Company Formation - ${companyName}`,
        description: `Company formation service for ${companyName} in ${countryCode}`,
        country_code: countryCode,
        order_type: orderData.order_type || 'company_formation',
        order_data: {
          company_name: companyName,
          ...orderData
        },
        total_amount: totalAmount,
        currency: orderData.currency || 'USD',
        status: 'pending',
        priority: 'medium',
        auto_assigned: assignedConsultant ? true : false,
        commission_rate: commissionRate,
        consultant_commission_amount: consultantCommissionAmount,
        system_commission_amount: systemCommissionAmount,
        commission_status: 'calculated'
      })
      .select()
      .single()

    if (orderError) {
      console.error('❌ Service order creation failed:', orderError)
      throw orderError
    }

    console.log('✅ Service order created:', serviceOrder.id)
    console.log(`💰 Commission calculated: ${commissionRate}% = $${consultantCommissionAmount.toFixed(2)} (System: $${systemCommissionAmount.toFixed(2)})`)

    // 7. Update consultant's current month orders count
    if (assignedConsultant) {
      await supabaseClient
        .from('consultant_countries')
        .update({ 
          current_month_orders: assignedConsultant.current_month_orders + 1 
        })
        .eq('consultant_id', assignedConsultant.consultant_id)
        .eq('country_code', countryCode)
    }

    // 8. Send welcome email with login credentials
    const emailData = {
      to: email,
      subject: 'Welcome! Your Account Has Been Created',
      html: `
        <h2>Welcome to Our Platform!</h2>
        <p>Dear ${firstName} ${lastName},</p>
        <p>Your order has been received and your account has been created automatically.</p>
        
        <h3>Your Login Credentials:</h3>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Temporary Password:</strong> ${tempPassword}</p>
        
        <h3>Your Assigned Consultant:</h3>
        ${assignedConsultant ? `
          <p><strong>Name:</strong> ${assignedConsultant.user_profiles.first_name} ${assignedConsultant.user_profiles.last_name}</p>
          <p><strong>Email:</strong> ${assignedConsultant.user_profiles.email}</p>
        ` : '<p>A consultant will be assigned to your case shortly.</p>'}
        
        <h3>Next Steps:</h3>
        <ol>
          <li>Log in to your client portal using the credentials above</li>
          <li>Change your password for security</li>
          <li>Upload required documents</li>
          <li>Your consultant will contact you within 24 hours</li>
        </ol>
        
        <p><a href="${Deno.env.get('CLIENT_PORTAL_URL') || 'https://client.yoursite.com'}" style="background: #10B981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">Access Client Portal</a></p>
        
        <p>Best regards,<br>Your Business Formation Team</p>
      `
    }

    // Send email (you can integrate with your email service here)
    console.log('📧 Email would be sent:', emailData)

    return new Response(
      JSON.stringify({
        success: true,
        user_id: authUser.user.id,
        client_id: clientRecord.id,
        order_id: serviceOrder.id,
        consultant: assignedConsultant ? {
          id: assignedConsultant.consultant_id,
          name: `${assignedConsultant.user_profiles.first_name} ${assignedConsultant.user_profiles.last_name}`,
          email: assignedConsultant.user_profiles.email
        } : null,
        login_credentials: {
          email: email,
          temp_password: tempPassword
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )

  } catch (error) {
    console.error('❌ Auto registration error:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})