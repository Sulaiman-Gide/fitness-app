import { supabase } from "@/config/supabase";
import Colors from "@/constants/Colors";
import { setProfile, setUser } from "@/store/authSlice";
import { useLocalSearchParams, useRouter } from "expo-router";
import LottieView from "lottie-react-native";
import React, { useEffect, useRef, useState } from "react";
import { Text, View } from "react-native";
import { useDispatch } from "react-redux";

const AuthCallback = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [isProcessing, setIsProcessing] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const [hasNavigated, setHasNavigated] = useState(false);
  const params = useLocalSearchParams();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handleAuthCallback = async () => {
      // Prevent multiple navigation attempts
      if (hasNavigated) {
        console.log("Navigation already attempted, skipping...");
        return;
      }

      console.log("🔗 Auth callback triggered - checking session...");
      console.log("📋 URL params:", params);

      try {
        // Wait a bit for Supabase to process the verification
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const { data, error } = await supabase.auth.getSession();

        if (error) {
          console.error("❌ Auth callback error:", error);
          setHasNavigated(true);
          router.replace("/login");
          return;
        }

        console.log(
          "📋 Session data:",
          data.session ? "Session found" : "No session"
        );

        if (data.session) {
          console.log("User authenticated:", data.session.user.email);

          // Check if profile is complete
          try {
            console.log("Checking user profile...");
            const { data: profile } = await supabase
              .from("profiles")
              .select("height, weight, age, gender, name")
              .eq("id", data.session.user.id)
              .single();

            console.log("📊 Profile data:", profile);

            // Get name from profile or user metadata, with fallback to email prefix
            const userName =
              profile?.name ||
              data.session.user.user_metadata?.name ||
              data.session.user.email?.split("@")[0] ||
              "User";

            // User is authenticated, update Redux state
            dispatch(
              setUser({
                id: data.session.user.id,
                email: data.session.user.email!,
                name: userName,
              })
            );

            if (
              profile &&
              profile.height &&
              profile.weight &&
              profile.age &&
              profile.gender
            ) {
              console.log("Profile complete - routing to main app");
              // Profile is complete, go to main app
              dispatch(
                setProfile({
                  height: profile.height,
                  weight: profile.weight,
                  age: profile.age,
                  gender: profile.gender,
                })
              );
              setHasNavigated(true);
              router.replace("/(tabs)");
            } else {
              console.log(
                "⚠️ Profile incomplete - routing to profile completion"
              );
              // Profile incomplete, go to profile completion
              setHasNavigated(true);
              router.replace("/auth/details");
            }
          } catch (profileError) {
            console.error("Profile check error:", profileError);
            // Still set user with fallback name
            const userName =
              data.session.user.user_metadata?.name ||
              data.session.user.email?.split("@")[0] ||
              "User";
            dispatch(
              setUser({
                id: data.session.user.id,
                email: data.session.user.email!,
                name: userName,
              })
            );
            // Profile doesn't exist or error, go to profile completion
            setHasNavigated(true);
            router.replace("/auth/details");
          }
        } else {
          // No session found, but this might be a verification link
          // Let's retry a few times to give Supabase time to process
          if (retryCount < 3) {
            console.log(`No session found, retrying... (${retryCount + 1}/3)`);
            setRetryCount((prev) => prev + 1);

            // Clear any existing timeout
            if (timeoutRef.current) {
              clearTimeout(timeoutRef.current);
            }

            // Set new timeout
            timeoutRef.current = setTimeout(() => {
              handleAuthCallback();
            }, 2000);
            return;
          }

          console.log("No session found after retries - routing to login");
          setHasNavigated(true);
          router.replace("/login");
        }
      } catch (error) {
        console.error("Auth callback error:", error);
        setHasNavigated(true);
        router.replace("/login");
      } finally {
        setIsProcessing(false);
      }
    };

    handleAuthCallback();

    // Cleanup function
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [router, dispatch, retryCount, params, hasNavigated]);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: Colors.background.primary,
      }}
    >
      <LottieView
        source={require("../../assets/Lottie/appLoadingWhite.json")}
        autoPlay
        loop
        style={{
          width: 80,
          height: 80,
        }}
      />
      <Text style={{ marginTop: 16, color: Colors.text.primary, fontSize: 16 }}>
        {retryCount > 0
          ? `Verifying your account... (${retryCount}/3)`
          : "Completing authentication..."}
      </Text>
      <Text style={{ marginTop: 8, color: Colors.text.tertiary, fontSize: 14 }}>
        Please wait while we verify your account
      </Text>
    </View>
  );
};

export default AuthCallback;
