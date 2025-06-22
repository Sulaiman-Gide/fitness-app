import Colors from "@/constants/Colors";
import { Stack, useLocalSearchParams } from "expo-router";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const ActiveWorkoutScreen = () => {
  const { id } = useLocalSearchParams();

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.content}>
        <Text style={styles.title}>Active Workout</Text>
        <Text style={styles.text}>Workout ID: {id}</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  title: {
    fontFamily: "BeVietnamPro-Bold",
    fontSize: 28,
    color: Colors.text.primary,
    marginBottom: 20,
  },
  text: {
    fontFamily: "BeVietnamPro-Regular",
    fontSize: 18,
    color: Colors.text.secondary,
  },
});

export default ActiveWorkoutScreen;
