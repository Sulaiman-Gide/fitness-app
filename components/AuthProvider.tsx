import { supabase } from "@/config/supabase";
import { RootState } from "@/store";
import { setInitialized, setProfile, setUser } from "@/store/authSlice";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { isAuthenticated, initialized, profileComplete } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    let isMounted = true;

    // Check initial session
    const checkInitialSession = async () => {
      try {
        console.log("🔍 Checking initial session...");
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!isMounted) return;

        console.log("📋 Initial session:", session ? "Found" : "Not found");

        if (session?.user) {
          console.log("✅ User found in initial session:", session.user.email);
          dispatch(
            setUser({
              id: session.user.id,
              email: session.user.email!,
              name: session.user.user_metadata?.name,
            })
          );

          try {
            const { data: profile } = await supabase
              .from("profiles")
              .select("height, weight, age, gender")
              .eq("id", session.user.id)
              .single();

            if (!isMounted) return;

            if (
              profile &&
              profile.height &&
              profile.weight &&
              profile.age &&
              profile.gender
            ) {
              console.log("✅ Profile complete in initial session");
              dispatch(
                setProfile({
                  height: profile.height,
                  weight: profile.weight,
                  age: profile.age,
                  gender: profile.gender,
                })
              );
            } else {
              console.log("⚠️ Profile incomplete in initial session");
            }
          } catch (error) {
            console.error("❌ Error checking profile on initial load:", error);
          }
        }
      } catch (error) {
        console.error("❌ Error checking initial session:", error);
      } finally {
        if (isMounted) {
          console.log("✅ Setting initialized to true");
          dispatch(setInitialized(true));
        }
      }
    };

    checkInitialSession();

    // Set up auth state listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!isMounted) return;

      console.log("🔄 Auth state change:", event, session?.user?.email);

      if (event === "SIGNED_IN" && session?.user) {
        dispatch(
          setUser({
            id: session.user.id,
            email: session.user.email!,
            name: session.user.user_metadata?.name,
          })
        );

        try {
          const { data: profile } = await supabase
            .from("profiles")
            .select("height, weight, age, gender")
            .eq("id", session.user.id)
            .single();

          if (!isMounted) return;

          if (
            !profile ||
            !profile.height ||
            !profile.weight ||
            !profile.age ||
            !profile.gender
          ) {
            router.replace("/auth/details");
          } else {
            // Update profile in Redux state
            dispatch(
              setProfile({
                height: profile.height,
                weight: profile.weight,
                age: profile.age,
                gender: profile.gender,
              })
            );
            router.replace("/(tabs)");
          }
        } catch (error) {
          console.error("Error checking profile on auth change:", error);
          if (isMounted) {
            router.replace("/auth/details");
          }
        }
      } else if (event === "SIGNED_OUT") {
        if (isMounted) {
          dispatch(setUser(null));
          router.replace("/onboarding");
        }
      } else if (event === "TOKEN_REFRESHED" && session?.user) {
        // Handle token refresh
        dispatch(
          setUser({
            id: session.user.id,
            email: session.user.email!,
            name: session.user.user_metadata?.name,
          })
        );
      }
    });

    // Cleanup function
    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [dispatch, router]);

  // Handle navigation based on auth state - only for initial app load
  useEffect(() => {
    if (!initialized) {
      console.log("⏳ App not initialized yet, staying on loading screen");
      return;
    }

    // Only handle navigation for initial app load, not for auth state changes
    // Auth callback and other components will handle their own routing
    if (!isAuthenticated) {
      console.log("🚪 User not authenticated, going to onboarding");
      router.replace("/onboarding");
    } else if (profileComplete) {
      console.log("✅ User fully authenticated, going to main app");
      router.replace("/(tabs)");
    }
    // Don't route to profile details here - let auth callback handle it
  }, [initialized, isAuthenticated, profileComplete, router]);

  return <>{children}</>;
};

export default AuthProvider;
