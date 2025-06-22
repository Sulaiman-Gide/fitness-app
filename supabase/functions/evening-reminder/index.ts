import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

console.log("Evening reminder function starting...")

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // This is a scheduled function, so we're not handling CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create a Supabase client with service role key for admin access
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    )

    // 1. Get all users with push tokens
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

    // 2. Get IDs of users who have worked out today
    const today = new Date()
    today.setUTCHours(0, 0, 0, 0)
    
    const { data: usersWhoWorkedOut, error: workoutError } = await supabaseClient
      .from('workout_history')
      .select('user_id')
      .gte('completed_at', today.toISOString())
      
    if (workoutError) throw new Error(workoutError.message)
    
    const workedOutUserIds = new Set(usersWhoWorkedOut.map(w => w.user_id))
    console.log(`Found ${workedOutUserIds.size} users who worked out today.`)

    // 3. Filter to get users who have NOT worked out today
    const usersToNotify = profiles.filter(p => !workedOutUserIds.has(p.id))
    console.log(`Found ${usersToNotify.length} users to remind.`)

    if (usersToNotify.length === 0) {
      return new Response(JSON.stringify({ message: 'All active users have already worked out today!' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // 4. Send notifications
    const messages = usersToNotify
      .filter(p => p.push_token && p.push_token.startsWith('ExponentPushToken['))
      .map(profile => ({
        to: profile.push_token,
        sound: 'default',
        title: '🌙 Evening Workout Reminder',
        body: `Hey ${profile.name || 'Fitness Warrior'}! Don't forget to crush your evening workout. 💪`,
        data: { 
          type: 'evening_reminder',
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
        sent_to_users: usersToNotify.length,
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