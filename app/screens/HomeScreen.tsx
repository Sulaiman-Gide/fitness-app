import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

const { width } = Dimensions.get("window");

const workoutCards = [
  {
    id: "1",
    title: "Full Body Workout",
    duration: "45 min",
    difficulty: "Intermediate",
    calories: "320",
    icon: "fitness",
    gradient: Colors.primary.gradient,
  },
  {
    id: "2",
    title: "Cardio Blast",
    duration: "30 min",
    difficulty: "Beginner",
    calories: "280",
    icon: "heart",
    gradient: Colors.secondary.gradient,
  },
  {
    id: "3",
    title: "Strength Training",
    duration: "60 min",
    difficulty: "Advanced",
    calories: "450",
    icon: "barbell",
    gradient: Colors.accent.gradient,
  },
];

const stats = [
  { label: "Workouts", value: "12", icon: "fitness" },
  { label: "Calories", value: "2,450", icon: "flame" },
  { label: "Minutes", value: "540", icon: "time" },
  { label: "Streak", value: "7", icon: "trending-up" },
];

export default function HomeScreen() {
  const fadeAnim = useSharedValue(0);
  const slideAnim = useSharedValue(50);

  React.useEffect(() => {
    fadeAnim.value = withTiming(1, { duration: 1000 });
    slideAnim.value = withSpring(0, { damping: 15, stiffness: 100 });
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: fadeAnim.value,
    transform: [{ translateY: slideAnim.value }],
  }));

  const WorkoutCard = ({ workout }: any) => (
    <TouchableOpacity style={styles.workoutCard} activeOpacity={0.8}>
      <View
        style={[
          styles.workoutGradient,
          { backgroundColor: Colors.primary.main },
        ]}
      >
        <View style={styles.workoutHeader}>
          <Ionicons
            name={workout.icon as any}
            size={32}
            color={Colors.text.primary}
          />
          <View style={styles.workoutInfo}>
            <Text style={styles.workoutTitle}>{workout.title}</Text>
            <Text style={styles.workoutDuration}>{workout.duration}</Text>
          </View>
        </View>
        <View style={styles.workoutFooter}>
          <View style={styles.workoutMeta}>
            <Text style={styles.workoutDifficulty}>{workout.difficulty}</Text>
            <Text style={styles.workoutCalories}>{workout.calories} cal</Text>
          </View>
          <Ionicons name="play-circle" size={32} color={Colors.text.primary} />
        </View>
      </View>
    </TouchableOpacity>
  );

  const StatCard = ({ stat }: any) => (
    <View style={styles.statCard}>
      <Ionicons name={stat.icon as any} size={24} color={Colors.primary.main} />
      <Text style={styles.statValue}>{stat.value}</Text>
      <Text style={styles.statLabel}>{stat.label}</Text>
    </View>
  );

  return (
    <View
      style={[styles.container, { backgroundColor: Colors.background.primary }]}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={[styles.content, animatedStyle]}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.greeting}>Good morning!</Text>
              <Text style={styles.name}>Ready to crush your goals?</Text>
            </View>
            <TouchableOpacity style={styles.profileButton}>
              <Ionicons
                name="person-circle"
                size={40}
                color={Colors.text.primary}
              />
            </TouchableOpacity>
          </View>

          {/* Stats Grid */}
          <View style={styles.statsContainer}>
            <Text style={styles.sectionTitle}>This Week</Text>
            <View style={styles.statsGrid}>
              {stats.map((stat, index) => (
                <StatCard key={index} stat={stat} />
              ))}
            </View>
          </View>

          {/* Quick Start */}
          <View style={styles.quickStartContainer}>
            <Text style={styles.sectionTitle}>Quick Start</Text>
            <TouchableOpacity
              style={styles.quickStartButton}
              activeOpacity={0.8}
            >
              <View
                style={[
                  styles.quickStartGradient,
                  { backgroundColor: Colors.primary.main },
                ]}
              >
                <Ionicons name="play" size={24} color={Colors.text.primary} />
                <Text style={styles.quickStartText}>Start Workout</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Workout Cards */}
          <View style={styles.workoutsContainer}>
            <View style={styles.workoutsHeader}>
              <Text style={styles.sectionTitle}>Recommended</Text>
              <TouchableOpacity>
                <Text style={styles.seeAllText}>See All</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.workoutsList}>
              {workoutCards.map((workout) => (
                <WorkoutCard key={workout.id} workout={workout} />
              ))}
            </View>
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 60,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 32,
  },
  greeting: {
    fontSize: 16,
    color: Colors.text.secondary,
    fontFamily: "BeVietnamPro-Regular",
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.text.primary,
    fontFamily: "BeVietnamPro-Bold",
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.background.card,
    justifyContent: "center",
    alignItems: "center",
  },
  statsContainer: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.text.primary,
    marginBottom: 16,
    fontFamily: "BeVietnamPro-Bold",
  },
  statsGrid: {
    flexDirection: "row",
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.background.card,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    gap: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.text.primary,
    fontFamily: "BeVietnamPro-Bold",
  },
  statLabel: {
    fontSize: 12,
    color: Colors.text.tertiary,
    fontFamily: "BeVietnamPro-Regular",
  },
  quickStartContainer: {
    marginBottom: 32,
  },
  quickStartButton: {
    borderRadius: 12,
    overflow: "hidden",
  },
  quickStartGradient: {
    height: 64,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  quickStartText: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.text.primary,
    fontFamily: "BeVietnamPro-Bold",
  },
  workoutsContainer: {
    marginBottom: 32,
  },
  workoutsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  seeAllText: {
    fontSize: 16,
    color: Colors.primary.main,
    fontFamily: "BeVietnamPro-Regular",
  },
  workoutsList: {
    gap: 16,
  },
  workoutCard: {
    borderRadius: 16,
    overflow: "hidden",
  },
  workoutGradient: {
    padding: 20,
  },
  workoutHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 12,
  },
  workoutInfo: {
    flex: 1,
  },
  workoutTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.text.primary,
    marginBottom: 4,
    fontFamily: "BeVietnamPro-Bold",
  },
  workoutDuration: {
    fontSize: 14,
    color: Colors.text.secondary,
    fontFamily: "BeVietnamPro-Regular",
  },
  workoutFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  workoutMeta: {
    gap: 4,
  },
  workoutDifficulty: {
    fontSize: 12,
    color: Colors.text.secondary,
    fontFamily: "BeVietnamPro-Regular",
  },
  workoutCalories: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.text.primary,
    fontFamily: "BeVietnamPro-Bold",
  },
});
