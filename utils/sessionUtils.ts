import { supabase } from "@/config/supabase";

export async function getSessionAndProfile() {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();
  if (error) return { session: null, profile: null, error };

  if (!session?.user) return { session: null, profile: null, error: null };

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("height, weight, age, gender")
    .eq("id", session.user.id)
    .single();

  return { session, profile, error: profileError };
}
