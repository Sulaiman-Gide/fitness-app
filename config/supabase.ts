import { createClient } from "@supabase/supabase-js";
import * as SecureStore from "expo-secure-store";
import "react-native-url-polyfill/auto";

const ExpoSecureStoreAdapter = {
  getItem: (key: string) => {
    return SecureStore.getItemAsync(key);
  },
  setItem: (key: string, value: string) => {
    SecureStore.setItemAsync(key, value);
  },
  removeItem: (key: string) => {
    SecureStore.deleteItemAsync(key);
  },
};

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase URL or Anon Key is missing from .env file");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: ExpoSecureStoreAdapter as any,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
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
