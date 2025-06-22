import Colors from "@/constants/Colors";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

const { width } = Dimensions.get("window");
const SKELETON_CARD_WIDTH = width - 48;

const Shimmer = ({ delay = 0 }: { delay?: number }) => {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withDelay(
      delay,
      withRepeat(
        withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
        -1,
        true
      )
    );
  }, [progress, delay]);

  const animatedStyle = useAnimatedStyle(() => {
    const translateX = interpolate(
      progress.value,
      [0, 1],
      [-SKELETON_CARD_WIDTH, SKELETON_CARD_WIDTH]
    );
    return {
      transform: [{ translateX }],
    };
  });

  return (
    <Animated.View style={[styles.shimmer, animatedStyle]}>
      <LinearGradient
        colors={["transparent", "rgba(255, 255, 255, 0.08)", "transparent"]}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={StyleSheet.absoluteFill}
      />
    </Animated.View>
  );
};

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
      <Shimmer delay={delay} />
    </View>
  );
};

const styles = StyleSheet.create({
  workoutCard: {
    height: 180,
    borderRadius: 20,
    backgroundColor: Colors.background.card,
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
    backgroundColor: "rgba(255,255,255,0.05)",
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
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 14,
  },
  shimmer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});

export default WorkoutCardSkeleton;
