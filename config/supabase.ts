import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";


export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: "pkce",
    debug: true,
  },
});

// Handle auth state changes with better logging
supabase.auth.onAuthStateChange((event, session) => {
  console.log("🔐 Supabase auth state changed:", {
    event,
    hasUser: !!session?.user,
    userEmail: session?.user?.email,
    sessionId: session?.access_token ? "Present" : "Missing",
    refreshToken: session?.refresh_token ? "Present" : "Missing",
  });

  // Log specific events
  if (event === "SIGNED_IN") {
    console.log("🎉 User signed in successfully");
  } else if (event === "TOKEN_REFRESHED") {
    console.log("🔄 Token refreshed successfully");
  } else if (event === "SIGNED_OUT") {
    console.log("👋 User signed out");
  }
});

// Test the connection and get initial session
supabase.auth.getSession().then(({ data, error }) => {
  if (error) {
    console.error("❌ Supabase connection error:", error);
  } else {
    console.log("✅ Supabase connected successfully");
    if (data.session) {
      console.log("📋 Initial session found:", data.session.user.email);
    } else {
      console.log("📋 No initial session found");
    }
  }
});
