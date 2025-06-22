import Colors from "@/constants/Colors";
import { RootState } from "@/store";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { useSelector } from "react-redux";

export default function LoadingScreen() {
  const { isAuthenticated, initialized, profileComplete } = useSelector(
    (state: RootState) => state.auth
  );
  const router = useRouter();

  useEffect(() => {
    if (initialized) {
      if (!isAuthenticated) {
        router.replace("/onboarding");
      } else if (!profileComplete) {
        router.replace("/auth/details");
      } else {
        router.replace("/(tabs)");
      }
    }
  }, [initialized, isAuthenticated, profileComplete, router]);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Let's Run</Text>
        <Text style={styles.subtitle}>Your fitness journey starts here</Text>
        <ActivityIndicator
          size="large"
          color={Colors.primary.main}
          style={styles.loader}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    alignItems: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: Colors.text.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.text.secondary,
    textAlign: "center",
    marginBottom: 40,
  },
  loader: {
    marginTop: 20,
  },
});
