import { useToast } from "@/components/ToastProvider";
import { supabase } from "@/config/supabase";
import Colors from "@/constants/Colors";
import { RootState } from "@/store";
import { sendWorkoutCompleted } from "@/utils/notificationUtils";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Easing,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Circle, Defs, LinearGradient, Stop } from "react-native-svg";
import { useSelector } from "react-redux";

const { width } = Dimensions.get("window");
const CIRCLE_LENGTH = 880; // 2 * Math.PI * 140
const CIRCLE_RADIUS = CIRCLE_LENGTH / (2 * Math.PI);

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

type WorkoutTemplate = {
  id: string;
  name: string;
  category: string;
  difficulty: string;
  estimated_duration_minutes: number;
  media_url: string;
  description: string;
};

const ActiveWorkoutScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const user = useSelector((state: RootState) => state.auth.user);
  const { showToast } = useToast();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [workout, setWorkout] = useState<WorkoutTemplate | null>(null);
  const [loading, setLoading] = useState(true);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [time, setTime] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const animatedProgress = useRef(new Animated.Value(0)).current;
  const timerPulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // If there's an ID, it's a template-based workout
    if (id) {
      const fetchWorkout = async () => {
        setLoading(true);
        try {
          const { data, error } = await supabase
            .from("workout_templates")
            .select("*")
            .eq("id", id)
            .single();
          if (error) throw error;
          setWorkout(data);
        } catch (error) {
          console.error("Error fetching workout details:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchWorkout();
    } else {
      // It's an empty workout, so no loading needed
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    // This effect handles the timer logic
    if (isActive && !isPaused) {
      // For empty workouts, just count up
      if (!workout) {
        timerRef.current = setInterval(() => {
          setTime((prevTime) => prevTime + 1);
        }, 1000);
      } else {
        // For template workouts, animate based on duration
        const totalDuration = workout.estimated_duration_minutes * 60;
        animatedProgress.addListener((animation) => {
          const newTime = (animation.value / CIRCLE_LENGTH) * totalDuration;
          setTime(newTime);
          if (newTime >= totalDuration) {
            handleFinishWorkout();
          }
        });
        Animated.timing(animatedProgress, {
          toValue: CIRCLE_LENGTH,
          duration: (totalDuration - time) * 1000,
          useNativeDriver: true,
          easing: Easing.linear,
        }).start();
      }
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      animatedProgress.stopAnimation();
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      animatedProgress.removeAllListeners();
    };
  }, [isActive, isPaused, workout]);

  useEffect(() => {
    if (isActive && !isPaused) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(timerPulseAnim, {
            toValue: 1.05,
            duration: 500,
            useNativeDriver: true,
            easing: Easing.ease,
          }),
          Animated.timing(timerPulseAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
            easing: Easing.ease,
          }),
        ])
      ).start();
    } else {
      timerPulseAnim.stopAnimation();
      timerPulseAnim.setValue(1);
    }
  }, [isActive, isPaused]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const handleStart = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsActive(true);
    setIsPaused(false);
  };

  const handlePause = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsPaused(!isPaused);
  };

  const handleFinishWorkout = async () => {
    if (isSaving || !user) return;

    setIsSaving(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    try {
      const { error } = await supabase.from("workout_history").insert({
        user_id: user.id,
        workout_template_id: workout?.id || null, // Can be null for empty workouts
        duration_seconds: Math.floor(time),
        // A simple estimate for calories burned: 5 calories per minute
        calories_burned: Math.floor((time / 60) * 5),
      });

      if (error) throw error;

      // Send workout completion notification
      try {
        const userName = user.name || "Fitness Warrior";
        const workoutName = workout?.name || "Workout";
        const duration = Math.floor(time);
        const calories = Math.floor((time / 60) * 5);

        await sendWorkoutCompleted(
          user.id,
          userName,
          workoutName,
          duration,
          calories
        );
      } catch (notificationError) {
        console.error(
          "Error sending workout completion notification:",
          notificationError
        );
        // Don't fail the workout save if notification fails
      }

      showToast({
        type: "success",
        message: "Workout saved successfully!",
      });
      router.back();
    } catch (error) {
      console.error("Error saving workout:", error);
      showToast({
        type: "error",
        message: "Failed to save workout. Please try again.",
      });
    } finally {
      setIsSaving(false);
      // Reset state after saving
      setIsActive(false);
      setIsPaused(false);
      animatedProgress.setValue(0);
      setTime(0);
    }
  };

  const handleStop = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    setIsActive(false);
    setIsPaused(false);
    animatedProgress.setValue(0);
    setTime(0);
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={styles.loadingText}>Loading Workout...</Text>
      </View>
    );
  }

  // Handle case where a specific workout was requested but not found
  if (id && !workout) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={styles.errorText}>Workout not found.</Text>
      </View>
    );
  }

  const workoutName = workout?.name || "Active Workout";
  const workoutCategory = workout?.category || "Freestyle";
  const backgroundImage =
    workout?.media_url || require("../assets/images/photo-2.jpg");

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <Image
        source={backgroundImage}
        style={styles.backgroundImage}
        contentFit="cover"
      />
      <View style={styles.overlay} />

      <TouchableOpacity
        style={[styles.backButton, { top: insets.top + 20 }]}
        onPress={() => router.back()}
      >
        <Ionicons name="arrow-back" size={30} color="#fff" />
      </TouchableOpacity>

      <View style={styles.contentContainer}>
        <Text style={styles.workoutName}>{workoutName}</Text>
        <Text style={styles.workoutCategory}>{workoutCategory}</Text>

        <View style={styles.timerWrapper}>
          <Svg style={styles.svg}>
            <Defs>
              <LinearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
                <Stop
                  offset="0"
                  stopColor={Colors.primary.main}
                  stopOpacity="1"
                />
                <Stop
                  offset="1"
                  stopColor={Colors.primary.light}
                  stopOpacity="1"
                />
              </LinearGradient>
            </Defs>
            <Circle
              cx={width / 2}
              cy={width / 2}
              r={CIRCLE_RADIUS}
              stroke={Colors.background.secondary}
              strokeWidth={20}
              fill="none"
              strokeOpacity={0.3}
            />
            <AnimatedCircle
              cx={width / 2}
              cy={width / 2}
              r={CIRCLE_RADIUS}
              stroke="url(#grad)"
              strokeWidth={20}
              fill="none"
              strokeDasharray={CIRCLE_LENGTH}
              strokeDashoffset={animatedProgress}
              strokeLinecap="round"
              transform={`rotate(-90 ${width / 2} ${width / 2})`}
            />
          </Svg>
          <Animated.Text
            style={[
              styles.timerText,
              { transform: [{ scale: timerPulseAnim }] },
            ]}
          >
            {formatTime(time)}
          </Animated.Text>
        </View>

        <View style={styles.controls}>
          {!isActive ? (
            <TouchableOpacity
              style={[styles.mainControlButton, styles.startButton]}
              onPress={handleStart}
              disabled={isSaving}
            >
              <Ionicons name="play" size={40} color="#000" />
            </TouchableOpacity>
          ) : (
            <>
              <TouchableOpacity
                style={styles.secondaryControlButton}
                onPress={handleStop}
                disabled={isSaving}
              >
                <Ionicons name="stop" size={30} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.mainControlButton}
                onPress={handlePause}
                disabled={isSaving}
              >
                <Ionicons
                  name={isPaused ? "play" : "pause"}
                  size={40}
                  color="#fff"
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.secondaryControlButton}
                onPress={handleFinishWorkout}
                disabled={isSaving}
              >
                {isSaving ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Ionicons name="checkmark-done" size={30} color="#fff" />
                )}
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.75)",
  },
  center: {
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontFamily: "BeVietnamPro-Medium",
    fontSize: 18,
    color: Colors.text.primary,
  },
  errorText: {
    fontFamily: "BeVietnamPro-Medium",
    fontSize: 18,
    color: Colors.text.secondary,
  },
  backButton: {
    position: "absolute",
    left: 20,
    zIndex: 10,
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
    paddingTop: 80,
    paddingBottom: 40,
  },
  workoutName: {
    fontFamily: "BeVietnamPro-Bold",
    fontSize: 30,
    color: "#fff",
    textAlign: "center",
    paddingHorizontal: 40,
  },
  workoutCategory: {
    fontFamily: "BeVietnamPro-Medium",
    fontSize: 18,
    color: Colors.primary.main,
    textTransform: "uppercase",
    letterSpacing: 1.5,
    marginTop: 8,
  },
  timerWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  svg: {
    position: "absolute",
    width: width,
    height: width,
  },
  timerText: {
    fontFamily: "BeVietnamPro-Bold",
    fontSize: 72,
    color: "#fff",
  },
  controls: {
    position: "absolute",
    bottom: 60,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  mainControlButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 8,
  },
  startButton: {
    backgroundColor: "#fff",
  },
  secondaryControlButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ActiveWorkoutScreen;
