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
    const { user_id, title, body, data } = await req.json()

    if (!user_id || !title || !body) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: user_id, title, body' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Get the user's push token from the profiles table
    const { data: profile, error: profileError } = await supabaseClient
      .from('profiles')
      .select('push_token')
      .eq('id', user_id)
      .single()

    if (profileError || !profile?.push_token) {
      return new Response(
        JSON.stringify({ error: 'User not found or no push token available' }),
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const pushToken = profile.push_token

    // Check if this is a valid Expo push token
    if (!pushToken.startsWith('ExponentPushToken[')) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Invalid push token format - not a real Expo token',
          token: pushToken,
          note: 'Make sure the app has generated a real Expo push token'
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Send push notification using Expo's push service
    const message = {
      to: pushToken,
      sound: 'default',
      title: title,
      body: body,
      data: data || {},
    }

    console.log('Sending notification to:', pushToken)
    console.log('Message:', message)

    const response = await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    })

    const result = await response.json()
    console.log('Expo push service response:', result)

    if (response.ok) {
      return new Response(
        JSON.stringify({ 
          success: true, 
          result,
          message: 'Notification sent successfully via Expo push service'
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    } else {
      return new Response(
        JSON.stringify({ 
          error: 'Failed to send notification via Expo push service', 
          result,
          note: 'Check if the push token is valid and the device is online'
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

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