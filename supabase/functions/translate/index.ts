import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

interface TranslateRequest {
  texts: string[];
  target_lang: 'TR' | 'PT';
  source_lang?: string;
}

interface DeepLResponse {
  translations: Array<{
    detected_source_language: string;
    text: string;
  }>;
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

serve(async (req) => {
  try {
    // Handle CORS preflight requests
    if (req.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders })
    }

    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { 
          status: 405, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    const { texts, target_lang, source_lang = 'EN' }: TranslateRequest = await req.json()

    if (!texts || !Array.isArray(texts) || texts.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Invalid texts array' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    if (!target_lang || !['TR', 'PT'].includes(target_lang)) {
      return new Response(
        JSON.stringify({ error: 'Invalid target_lang. Must be TR or PT' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    const apiKey = Deno.env.get('DEEPL_API_KEY')
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'DeepL API key not configured' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    const translations: string[] = []

    // Translate each text
    for (const text of texts) {
      if (!text || text.trim() === '') {
        translations.push('')
        continue
      }

      try {
        const response = await fetch('https://api-free.deepl.com/v2/translate', {
          method: 'POST',
          headers: {
            'Authorization': `DeepL-Auth-Key ${apiKey}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            text: text,
            target_lang: target_lang,
            source_lang: source_lang,
            preserve_formatting: '1',
            formality: 'default'
          }),
        })

        if (!response.ok) {
          console.error('DeepL API error:', response.status, await response.text())
          translations.push(text) // Fallback to original text
          continue
        }

        const data: DeepLResponse = await response.json()
        
        if (data.translations && data.translations.length > 0) {
          translations.push(data.translations[0].text)
        } else {
          translations.push(text) // Fallback to original text
        }

        // Rate limiting - small delay between requests
        await new Promise(resolve => setTimeout(resolve, 100))
      } catch (error) {
        console.error('Translation error:', error)
        translations.push(text) // Fallback to original text
      }
    }

    return new Response(
      JSON.stringify({ translations }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  } catch (error) {
    console.error('Function error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})