import Colors from "@/constants/Colors";
import { Stack } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface InfoPageProps {
  title: string;
  children: React.ReactNode;
}

const InfoPage = ({ title, children }: InfoPageProps) => {
  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <Stack.Screen
        options={{ title, headerBackTitle: "Profile", headerShown: true }}
      />
      <ScrollView contentContainerStyle={styles.content}>
        <View>{children}</View>
      </ScrollView>
    </SafeAreaView>
  );
};

export const InfoStyles = StyleSheet.create({
  heading: {
    fontSize: 22,
    fontWeight: "bold",
    color: Colors.text.primary,
    fontFamily: "BeVietnamPro-Bold",
    marginTop: 20,
    marginBottom: 10,
  },
  paragraph: {
    fontSize: 16,
    color: Colors.text.secondary,
    fontFamily: "BeVietnamPro-Regular",
    lineHeight: 24,
    marginBottom: 15,
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: Colors.text.primary,
    marginBottom: 20,
    fontFamily: "BeVietnamPro-Bold",
  },
});

export default InfoPage;
