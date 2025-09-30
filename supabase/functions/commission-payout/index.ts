import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { action, consultant_id, order_id, period_start, period_end } = await req.json()

    switch (action) {
      case 'calculate_commission':
        return await calculateCommission(supabaseClient, consultant_id, order_id)
      
      case 'process_payout':
        return await processPayout(supabaseClient, consultant_id, period_start, period_end)
      
      case 'mark_order_completed':
        return await markOrderCompleted(supabaseClient, order_id)
      
      default:
        throw new Error('Invalid action')
    }

  } catch (error) {
    console.error('Commission payout error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})

async function calculateCommission(supabaseClient: any, consultant_id: string, order_id: string) {
  console.log(`💰 Calculating commission for order ${order_id}...`)

  // Get order details
  const { data: order, error: orderError } = await supabaseClient
    .from('service_orders')
    .select('*')
    .eq('id', order_id)
    .eq('consultant_id', consultant_id)
    .single()

  if (orderError || !order) {
    throw new Error('Order not found or not assigned to this consultant')
  }

  // Get consultant's commission rate
  const { data: consultantProfile } = await supabaseClient
    .from('consultant_profiles')
    .select('commission_rate')
    .eq('user_id', consultant_id)
    .single()

  const commissionRate = consultantProfile?.commission_rate || 65
  const consultantCommissionAmount = order.total_amount * (commissionRate / 100)
  const systemCommissionAmount = order.total_amount - consultantCommissionAmount

  // Update order with commission details
  const { error: updateError } = await supabaseClient
    .from('service_orders')
    .update({
      commission_rate: commissionRate,
      consultant_commission_amount: consultantCommissionAmount,
      system_commission_amount: systemCommissionAmount,
      commission_status: 'calculated'
    })
    .eq('id', order_id)

  if (updateError) {
    throw updateError
  }

  console.log(`✅ Commission calculated: ${commissionRate}% = $${consultantCommissionAmount.toFixed(2)}`)

  return new Response(
    JSON.stringify({
      success: true,
      commission_rate: commissionRate,
      consultant_commission: consultantCommissionAmount,
      system_commission: systemCommissionAmount
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function markOrderCompleted(supabaseClient: any, order_id: string) {
  console.log(`✅ Marking order ${order_id} as completed...`)

  // Update order status and commission status
  const { data: order, error: updateError } = await supabaseClient
    .from('service_orders')
    .update({
      status: 'completed',
      commission_status: 'earned',
      completed_at: new Date().toISOString()
    })
    .eq('id', order_id)
    .select('*')
    .single()

  if (updateError) {
    throw updateError
  }

  // Create commission payout record if not exists
  if (order.consultant_id && order.consultant_commission_amount > 0) {
    const { error: payoutError } = await supabaseClient
      .from('commission_payouts')
      .upsert({
        consultant_id: order.consultant_id,
        order_id: order_id,
        amount: order.consultant_commission_amount,
        status: 'pending',
        created_at: new Date().toISOString()
      })

    if (payoutError) {
      console.error('Error creating commission payout:', payoutError)
    } else {
      console.log(`💰 Commission payout created: $${order.consultant_commission_amount}`)
    }
  }

  return new Response(
    JSON.stringify({
      success: true,
      message: 'Order marked as completed and commission earned'
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function processPayout(supabaseClient: any, consultant_id: string, period_start: string, period_end: string) {
  console.log(`💸 Processing payout for consultant ${consultant_id} (${period_start} to ${period_end})...`)

  // Get all pending commission payouts for the consultant in the period
  const { data: pendingPayouts, error: payoutsError } = await supabaseClient
    .from('commission_payouts')
    .select('*')
    .eq('consultant_id', consultant_id)
    .eq('status', 'pending')
    .gte('created_at', period_start)
    .lte('created_at', period_end)

  if (payoutsError) {
    throw payoutsError
  }

  if (!pendingPayouts || pendingPayouts.length === 0) {
    return new Response(
      JSON.stringify({
        success: true,
        message: 'No pending payouts found for this period',
        total_amount: 0
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  const totalAmount = pendingPayouts.reduce((sum, payout) => sum + payout.amount, 0)

  // Mark all payouts as processed
  const { error: updateError } = await supabaseClient
    .from('commission_payouts')
    .update({
      status: 'processed',
      processed_at: new Date().toISOString()
    })
    .in('id', pendingPayouts.map(p => p.id))

  if (updateError) {
    throw updateError
  }

  console.log(`✅ Processed ${pendingPayouts.length} payouts totaling $${totalAmount.toFixed(2)}`)

  return new Response(
    JSON.stringify({
      success: true,
      message: `Processed ${pendingPayouts.length} payouts`,
      total_amount: totalAmount,
      payout_count: pendingPayouts.length
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}