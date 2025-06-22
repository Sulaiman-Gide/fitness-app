import Colors from "@/constants/Colors";
import React from "react";
import { Dimensions, StyleSheet, View } from "react-native";

const { width } = Dimensions.get("window");

const WorkoutCardSkeleton = ({ delay = 0 }: { delay?: number }) => {
  return (
    <View style={styles.workoutCard}>
      <View style={styles.workoutContent}>
        <View style={styles.textPlaceholder} />
        <View style={styles.detailsContainer}>
          <View style={styles.detailChipPlaceholder} />
          <View style={styles.detailChipPlaceholder} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  workoutCard: {
    height: 180,
    borderRadius: 20,
    backgroundColor: Colors.background.secondary,
    overflow: "hidden",
    position: "relative",
  },
  workoutContent: {
    flex: 1,
    justifyContent: "flex-end",
    padding: 20,
  },
  textPlaceholder: {
    width: "70%",
    height: 22,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 8,
    marginBottom: 12,
  },
  detailsContainer: {
    flexDirection: "row",
    gap: 10,
  },
  detailChipPlaceholder: {
    width: 100,
    height: 26,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 14,
  },
});

export default WorkoutCardSkeleton;
