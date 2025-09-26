import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@14.21.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2023-10-16',
    })

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    const signature = req.headers.get('stripe-signature')
    const body = await req.text()
    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')

    let event
    try {
      event = stripe.webhooks.constructEvent(body, signature!, webhookSecret!)
    } catch (err) {
      console.error('Webhook signature verification failed:', err)
      return new Response('Webhook signature verification failed', { status: 400 })
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session
      const orderData = JSON.parse(session.metadata?.orderData || '{}')

      // Create user account
      const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
        email: orderData.userCredentials.email,
        password: orderData.userCredentials.password,
        email_confirm: true,
      })

      if (authError) {
        console.error('Error creating user:', authError)
        throw authError
      }

      // Find consultant by country
      const { data: consultants } = await supabase
        .from('consultants')
        .select('*')
        .eq('country', orderData.selectedCountry.name)
        .eq('status', 'active')
        .limit(1)

      const assignedConsultant = consultants?.[0] || null

      // Calculate total amount
      let totalAmount = orderData.selectedCountry?.price || 0
      if (orderData.countryConfig && orderData.selectedDynamicPackage) {
        const dynamicPackage = orderData.countryConfig.packages.find(p => p.id === orderData.selectedDynamicPackage)
        totalAmount += dynamicPackage?.price || 0
      } else if (orderData.selectedPackage) {
        totalAmount += orderData.selectedPackage.price || 0
      }

      if (orderData.countryConfig && orderData.selectedDynamicServices?.length > 0) {
        orderData.selectedDynamicServices.forEach(serviceId => {
          const service = orderData.countryConfig.additionalServices.find(s => s.id === serviceId)
          totalAmount += service?.price || 0
        })
      } else if (orderData.selectedServices?.length > 0) {
        totalAmount += orderData.selectedServices.reduce((sum, service) => sum + service.price, 0)
      }

      // Create service order
      const { data: serviceOrder, error: orderError } = await supabase
        .from('service_orders')
        .insert({
          client_id: authUser.user.id,
          consultant_id: assignedConsultant?.id || null,
          service_id: orderData.selectedDynamicPackage || orderData.selectedPackage?.id,
          country: orderData.selectedCountry.name,
          package_name: orderData.countryConfig ? 
            orderData.countryConfig.packages.find(p => p.id === orderData.selectedDynamicPackage)?.name :
            orderData.selectedPackage?.name,
          additional_services: orderData.countryConfig ? 
            orderData.selectedDynamicServices.map(serviceId => 
              orderData.countryConfig.additionalServices.find(s => s.id === serviceId)?.name
            ).filter(Boolean) :
            orderData.selectedServices?.map(s => s.name) || [],
          total_amount: totalAmount,
          status: 'pending',
          payment_status: 'completed',
          stripe_session_id: session.id,
          company_details: orderData.dynamicCompanyData || orderData.companyDetails,
          created_at: new Date().toISOString(),
        })
        .select()
        .single()

      if (orderError) {
        console.error('Error creating service order:', orderError)
        throw orderError
      }

      // Calculate commission (65% to consultant, 35% to system)
      const consultantCommission = totalAmount * 0.65
      const systemCommission = totalAmount * 0.35

      // Create commission payout record
      if (assignedConsultant) {
        await supabase
          .from('commission_payouts')
          .insert({
            consultant_id: assignedConsultant.id,
            order_id: serviceOrder.id,
            amount: consultantCommission,
            status: 'pending',
            created_at: new Date().toISOString(),
          })
      }

      console.log('Order processed successfully:', serviceOrder.id)
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    console.error('Webhook error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})