import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
}

serve(async (req) => {
  try {
    if (req.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders })
    }

    const url = new URL(req.url)
    const consultantId = url.pathname.split('/').pop()

    if (!consultantId) {
      return new Response('Consultant ID required', { 
        status: 400,
        headers: corsHeaders 
      })
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Get consultant availability
    const { data: availability } = await supabase
      .from('consultant_availability')
      .select('*')
      .eq('consultant_profile_id', consultantId)
      .single()

    // Get confirmed booking requests
    const { data: bookings } = await supabase
      .from('booking_requests')
      .select('*')
      .eq('consultant_id', consultantId)
      .eq('status', 'confirmed')

    // Generate ICS content
    const now = new Date()
    const icsLines = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Consulting19//Consultant Calendar//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
    ]

    // Add confirmed bookings as events
    if (bookings) {
      for (const booking of bookings) {
        const startDate = new Date(booking.requested_date)
        const endDate = new Date(startDate.getTime() + (booking.duration_minutes * 60000))
        
        icsLines.push(
          'BEGIN:VEVENT',
          `UID:booking-${booking.id}@consulting19.com`,
          `DTSTART:${formatICSDate(startDate)}`,
          `DTEND:${formatICSDate(endDate)}`,
          `SUMMARY:Client Consultation`,
          `DESCRIPTION:${booking.message || 'Client consultation session'}`,
          'STATUS:CONFIRMED',
          'END:VEVENT'
        )
      }
    }

    icsLines.push('END:VCALENDAR')

    return new Response(icsLines.join('\r\n'), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/calendar; charset=utf-8',
        'Content-Disposition': `attachment; filename="consultant-${consultantId}.ics"`
      }
    })
  } catch (error) {
    console.error('ICS generation error:', error)
    return new Response('Internal server error', { 
      status: 500,
      headers: corsHeaders 
    })
  }
})

function formatICSDate(date: Date): string {
  return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
}