import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
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
import { SafeAreaView } from "react-native-safe-area-context";

// Import custom SVG icons
import ProfileOutline from "@/assets/images/profile-outline.svg";
import ProgressOutline from "@/assets/images/progress-outline.svg";
import WorkoutsOutline from "@/assets/images/workouts-outline.svg";

const getDynamicGreeting = (hasCompletedWorkout: boolean) => {
  const hour = new Date().getHours();
  let greeting = "Good morning!";
  let subtitle = "Ready for your workout today?";

  if (hour >= 12 && hour < 18) {
    greeting = "Good afternoon!";
    subtitle = hasCompletedWorkout
      ? "Great work on your session today!"
      : "Ready to finish up your morning workout?";
  } else if (hour >= 18) {
    greeting = "Good evening!";
    subtitle = hasCompletedWorkout
      ? "You've earned a good rest!"
      : "Time to wrap up today's workout!";
  }

  return { greeting, subtitle };
};

const quickActions = [
  {
    id: "start_workout",
    title: "Start Workout",
    subtitle: "Begin a new session",
    Icon: WorkoutsOutline,
    color: "#4CAF50",
  },
  {
    id: "view_progress",
    title: "View Progress",
    subtitle: "Check your stats",
    Icon: ProgressOutline,
    color: "#2196F3",
  },
  {
    id: "set_goals",
    title: "Set Goals",
    subtitle: "Define your targets",
    Icon: ProfileOutline,
    color: "#FF9800",
  },
];

const recentWorkouts = [
  {
    id: "1",
    name: "Full Body Strength",
    duration: "45 min",
    calories: "320",
    date: "Today",
  },
  {
    id: "2",
    name: "Cardio HIIT",
    duration: "30 min",
    calories: "280",
    date: "Yesterday",
  },
  {
    id: "3",
    name: "Upper Body Focus",
    duration: "40 min",
    calories: "250",
    date: "2 days ago",
  },
];

const HomeScreen = () => {
  const fadeAnim = useSharedValue(0);
  const slideAnim = useSharedValue(50);
  // This state should be connected to your actual workout data
  const [hasCompletedWorkout, setHasCompletedWorkout] = useState(false);
  const [greeting, setGreeting] = useState("");
  const [subtitle, setSubtitle] = useState("");

  useEffect(() => {
    const { greeting, subtitle } = getDynamicGreeting(hasCompletedWorkout);
    setGreeting(greeting);
    setSubtitle(subtitle);

    fadeAnim.value = withTiming(1, { duration: 1000 });
    slideAnim.value = withSpring(0, { damping: 15, stiffness: 100 });
  }, [hasCompletedWorkout]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: fadeAnim.value,
    transform: [{ translateY: slideAnim.value }],
  }));

  const QuickActionCard = ({ action }: any) => (
    <TouchableOpacity style={styles.quickActionCard} activeOpacity={0.8}>
      <View
        style={[styles.actionIcon, { backgroundColor: action.color + "20" }]}
      >
        <action.Icon width={28} height={28} fill={action.color} />
      </View>
      <Text style={styles.actionTitle}>{action.title}</Text>
      <Text style={styles.actionSubtitle}>{action.subtitle}</Text>
    </TouchableOpacity>
  );

  const WorkoutCard = ({ workout }: any) => (
    <TouchableOpacity style={styles.workoutCard} activeOpacity={0.8}>
      <View style={styles.workoutHeader}>
        <Text style={styles.workoutName}>{workout.name}</Text>
        <Text style={styles.workoutDate}>{workout.date}</Text>
      </View>
      <View style={styles.workoutStats}>
        <View style={styles.workoutStat}>
          <Ionicons name="time" size={16} color={Colors.text.tertiary} />
          <Text style={styles.workoutStatText}>{workout.duration}</Text>
        </View>
        <View style={styles.workoutStat}>
          <Ionicons name="flame" size={16} color={Colors.text.tertiary} />
          <Text style={styles.workoutStatText}>{workout.calories} cal</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={[styles.content, animatedStyle]}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.greeting}>{greeting}</Text>
              <Text style={styles.subtitle}>{subtitle}</Text>
            </View>
            <TouchableOpacity style={styles.profileButton}>
              <ProfileOutline
                width={28}
                height={28}
                fill={Colors.text.primary}
              />
            </TouchableOpacity>
          </View>

          {/* Quick Actions */}
          <View style={styles.quickActionsContainer}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.quickActionsGrid}>
              {quickActions.map((action) => (
                <QuickActionCard key={action.id} action={action} />
              ))}
            </View>
          </View>

          {/* Today's Stats */}
          <View style={styles.statsContainer}>
            <Text style={styles.sectionTitle}>Today's Progress</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <Ionicons
                  name="fitness"
                  size={24}
                  color={Colors.primary.main}
                />
                <Text style={styles.statValue}>1</Text>
                <Text style={styles.statLabel}>Workouts</Text>
              </View>
              <View style={styles.statCard}>
                <Ionicons name="flame" size={24} color={Colors.primary.main} />
                <Text style={styles.statValue}>320</Text>
                <Text style={styles.statLabel}>Calories</Text>
              </View>
              <View style={styles.statCard}>
                <Ionicons name="time" size={24} color={Colors.primary.main} />
                <Text style={styles.statValue}>45m</Text>
                <Text style={styles.statLabel}>Time</Text>
              </View>
            </View>
          </View>

          {/* Recent Workouts */}
          <View style={styles.recentWorkoutsContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Workouts</Text>
              <TouchableOpacity>
                <Text style={styles.viewAllText}>View All</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.workoutsList}>
              {recentWorkouts.map((workout) => (
                <WorkoutCard key={workout.id} workout={workout} />
              ))}
            </View>
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 32,
  },
  greeting: {
    fontSize: 28,
    fontWeight: "bold",
    color: Colors.text.primary,
    marginBottom: 4,
    fontFamily: "BeVietnamPro-Bold",
  },
  subtitle: {
    fontSize: 16,
    color: Colors.text.tertiary,
    fontFamily: "BeVietnamPro-Regular",
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.background.card,
    justifyContent: "center",
    alignItems: "center",
  },
  quickActionsContainer: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: Colors.text.primary,
    marginBottom: 16,
    fontFamily: "BeVietnamPro-Bold",
  },
  quickActionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  quickActionCard: {
    width: "48%",
    backgroundColor: Colors.background.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    alignItems: "center",
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text.primary,
    marginBottom: 4,
    textAlign: "center",
    fontFamily: "BeVietnamPro-Regular",
  },
  actionSubtitle: {
    fontSize: 12,
    color: Colors.text.tertiary,
    textAlign: "center",
    fontFamily: "BeVietnamPro-Regular",
  },
  statsContainer: {
    marginBottom: 32,
  },
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.background.card,
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    marginHorizontal: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.text.primary,
    marginTop: 8,
    marginBottom: 4,
    fontFamily: "BeVietnamPro-Bold",
  },
  statLabel: {
    fontSize: 14,
    color: Colors.text.tertiary,
    fontFamily: "BeVietnamPro-Regular",
  },
  recentWorkoutsContainer: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  viewAllText: {
    fontSize: 14,
    color: Colors.primary.main,
    fontFamily: "BeVietnamPro-Regular",
  },
  workoutsList: {
    gap: 12,
  },
  workoutCard: {
    backgroundColor: Colors.background.card,
    borderRadius: 16,
    padding: 20,
  },
  workoutHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  workoutName: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.text.primary,
    fontFamily: "BeVietnamPro-Regular",
  },
  workoutDate: {
    fontSize: 14,
    color: Colors.text.tertiary,
    fontFamily: "BeVietnamPro-Regular",
  },
  workoutStats: {
    flexDirection: "row",
    gap: 16,
  },
  workoutStat: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  workoutStatText: {
    fontSize: 14,
    color: Colors.text.tertiary,
    fontFamily: "BeVietnamPro-Regular",
  },
});
