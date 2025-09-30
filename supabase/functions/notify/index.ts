import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

interface NotificationRequest {
  recipient_id: string;
  type: string;
  payload: Record<string, any>;
  email_notification?: boolean;
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

serve(async (req) => {
  try {
    if (req.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders })
    }

    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const { recipient_id, type, payload, email_notification = false }: NotificationRequest = await req.json()

    if (!recipient_id || !type) {
      return new Response(
        JSON.stringify({ error: 'recipient_id and type are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Get current user from auth header
    const authHeader = req.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')
    
    let actor_id = null
    if (token) {
      const { data: { user } } = await supabase.auth.getUser(token)
      actor_id = user?.id
    }

    // Insert notification
    const { data: notification, error: notificationError } = await supabase
      .from('notifications')
      .insert({
        actor_profile_id: actor_id,
        recipient_profile_id: recipient_id,
        type,
        payload
      })
      .select()
      .single()

    if (notificationError) {
      console.error('Error creating notification:', notificationError)
      return new Response(
        JSON.stringify({ error: 'Failed to create notification' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Send email notification if requested
    if (email_notification) {
      try {
        // Get recipient email
        const { data: recipient } = await supabase
          .from('user_profiles')
          .select('email, full_name')
          .eq('id', recipient_id)
          .single()

        if (recipient?.email) {
          // Here you would integrate with your email service
          // For now, just log the email that would be sent
          console.log('Email notification would be sent to:', recipient.email, {
            type,
            payload,
            recipient_name: recipient.full_name
          })
        }
      } catch (emailError) {
        console.error('Email notification failed:', emailError)
        // Don't fail the request if email fails
      }
    }

    // Emit realtime event
    try {
      await supabase
        .channel('notifications')
        .send({
          type: 'broadcast',
          event: 'notification',
          payload: {
            recipient_id,
            notification
          }
        })
    } catch (realtimeError) {
      console.error('Realtime broadcast failed:', realtimeError)
      // Don't fail the request if realtime fails
    }

    return new Response(
      JSON.stringify({ success: true, notification }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Notification function error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})