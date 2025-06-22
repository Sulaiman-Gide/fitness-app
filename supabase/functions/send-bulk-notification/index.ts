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
    // Create a Supabase client with the Auth context of the function
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Get the request body
    const { user_ids, title, body, data } = await req.json()

    if (!user_ids || !title || !body) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: user_ids, title, body' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Get push tokens for all specified users
    const { data: profiles, error: profilesError } = await supabaseClient
      .from('profiles')
      .select('id, push_token')
      .in('id', user_ids)
      .not('push_token', 'is', null)

    if (profilesError) {
      return new Response(
        JSON.stringify({ error: 'Failed to fetch user profiles' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    if (!profiles || profiles.length === 0) {
      return new Response(
        JSON.stringify({ error: 'No users found with push tokens' }),
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Separate real tokens from fake device IDs
    const realTokens = profiles.filter(profile => 
      profile.push_token && profile.push_token.startsWith('ExponentPushToken[')
    )
    const fakeTokens = profiles.filter(profile => 
      profile.push_token && profile.push_token.startsWith('device_')
    )

    let result = { success: true }

    // Send real push notifications if we have any
    if (realTokens.length > 0) {
      const messages = realTokens.map(profile => ({
        to: profile.push_token,
        sound: 'default',
        title: title,
        body: body,
        data: { ...data, user_id: profile.id },
      }))

      const response = await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Accept-encoding': 'gzip, deflate',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(messages),
      })

      const pushResult = await response.json()
      result = { ...result, pushResult }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        result,
        sent_to_real_tokens: realTokens.length,
        sent_to_fake_tokens: fakeTokens.length,
        total_requested: user_ids.length,
        note: fakeTokens.length > 0 ? 'Some users have fake device IDs (development mode)' : 'All notifications sent to real devices'
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: (error as Error).message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
}) 