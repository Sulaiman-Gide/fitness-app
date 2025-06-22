import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

console.log("Morning reminder function starting...")

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
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    )

    const { data: profiles, error: profilesError } = await supabaseClient
      .from('profiles')
      .select('id, push_token, name')
      .not('push_token', 'is', null)

    if (profilesError) throw new Error(profilesError.message)

    if (!profiles || profiles.length === 0) {
      return new Response(JSON.stringify({ message: 'No users with push tokens found.' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }
    
    console.log(`Found ${profiles.length} total profiles with push tokens.`)

    const messages = profiles
      .filter(p => p.push_token && p.push_token.startsWith('ExponentPushToken['))
      .map(profile => ({
        to: profile.push_token,
        sound: 'default',
        title: '☀️ Rise and Shine!',
        body: `Good morning, ${profile.name || 'Fitness Warrior'}! Ready to start your day with a great workout?`,
        data: { 
          type: 'morning_reminder',
          screen: 'workouts',
        },
      }))

    console.log(`Sending ${messages.length} notifications...`)
    
    if(messages.length === 0) {
      return new Response(JSON.stringify({ message: 'No valid push tokens for users to remind.' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const response = await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Accept-encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(messages),
    })

    const pushResult = await response.json()
    console.log('Push notification result:', pushResult)

    return new Response(
      JSON.stringify({ 
        success: true, 
        sent_to_users: messages.length,
        result: pushResult,
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Scheduled notification error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
}) 