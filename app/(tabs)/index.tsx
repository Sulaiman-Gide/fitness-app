import { supabase } from "@/config/supabase";
import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
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
import { useSelector } from "react-redux";

// Import custom SVG icons
import ProfileOutline from "@/assets/images/profile-outline.svg";
import ProgressOutline from "@/assets/images/progress-outline.svg";
import WorkoutsOutline from "@/assets/images/workouts-outline.svg";

interface Workout {
  id: number;
  name: string;
  created_at: string;
  duration_minutes: number;
  calories_burned: number;
}

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
    title: "Workouts",
    Icon: WorkoutsOutline,
    color: Colors.primary.main,
    route: "/(tabs)/workouts",
  },
  {
    id: "view_progress",
    title: "Progress",
    Icon: ProgressOutline,
    color: Colors.primary.main,
    route: "/(tabs)/progress",
  },
  {
    id: "set_goals",
    title: "Set Goals",
    Icon: ProfileOutline,
    color: Colors.primary.main,
    route: "/goals",
  },
];

const HomeScreen = () => {
  const router = useRouter();
  const user = useSelector((state: any) => state.auth.user);
  const fadeAnim = useSharedValue(0);
  const slideAnim = useSharedValue(50);
  const [greeting, setGreeting] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [todaysProgress, setTodaysProgress] = useState({
    workouts: 0,
    calories: 0,
    time: 0,
  });
  const [recentWorkouts, setRecentWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);

      // Fetch today's progress
      const { data: progressData, error: progressError } = await supabase
        .from("workouts")
        .select("duration_minutes, calories_burned")
        .eq("user_id", user.id)
        .gte("created_at", todayStart.toISOString());

      if (progressError) throw progressError;

      const totalCalories = progressData.reduce(
        (sum, w) => sum + (w.calories_burned || 0),
        0
      );
      const totalTime = progressData.reduce(
        (sum, w) => sum + (w.duration_minutes || 0),
        0
      );
      setTodaysProgress({
        workouts: progressData.length,
        calories: totalCalories,
        time: totalTime,
      });

      // Fetch recent workouts
      const { data: recentData, error: recentError } = await supabase
        .from("workouts")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(5);

      if (recentError) throw recentError;
      setRecentWorkouts(recentData);
    } catch (error) {
      console.error("Error fetching home screen data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const { greeting, subtitle } = getDynamicGreeting(
      todaysProgress.workouts > 0
    );
    setGreeting(greeting);
    setSubtitle(subtitle);

    fadeAnim.value = withTiming(1, { duration: 1000 });
    slideAnim.value = withSpring(0, { damping: 15, stiffness: 100 });
  }, [todaysProgress]);

  useEffect(() => {
    setLoading(true);
    fetchData();
  }, [user]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData().finally(() => setRefreshing(false));
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: fadeAnim.value,
    transform: [{ translateY: slideAnim.value }],
  }));

  const QuickActionCard = ({ action }: any) => (
    <TouchableOpacity
      style={styles.quickActionCard}
      activeOpacity={0.8}
      onPress={() => router.push(action.route)}
    >
      <View style={styles.actionIcon}>
        <action.Icon width={32} height={32} />
      </View>
      <Text style={styles.actionTitle}>{action.title}</Text>
    </TouchableOpacity>
  );

  const StatCard = ({
    icon,
    value,
    label,
  }: {
    icon: any;
    value: string | number;
    label: string;
  }) => (
    <View style={styles.statCard}>
      <Ionicons name={icon} size={28} color={Colors.primary.main} />
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );

  const WorkoutCard = ({ workout }: any) => (
    <TouchableOpacity style={styles.workoutCard} activeOpacity={0.8}>
      <View>
        <Text style={styles.workoutName}>{workout.name}</Text>
        <Text style={styles.workoutDate}>
          {new Date(workout.created_at).toLocaleDateString()}
        </Text>
      </View>
      <View style={styles.workoutStats}>
        <View style={styles.workoutStat}>
          <Ionicons
            name="time-outline"
            size={16}
            color={Colors.text.tertiary}
          />
          <Text style={styles.workoutStatText}>
            {workout.duration_minutes} min
          </Text>
        </View>
        <View style={styles.workoutStat}>
          <Ionicons
            name="flame-outline"
            size={16}
            color={Colors.text.tertiary}
          />
          <Text style={styles.workoutStatText}>
            {workout.calories_burned} cal
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const EmptyState = () => (
    <View style={styles.emptyStateContainer}>
      <Ionicons
        name="barbell-outline"
        size={60}
        color={Colors.text.tertiary}
        style={{ marginBottom: 16 }}
      />
      <Text style={styles.emptyStateTitle}>No Workouts Yet</Text>
      <Text style={styles.emptyStateSubtitle}>
        Start your first workout to see your history here.
      </Text>
      <TouchableOpacity
        style={styles.emptyStateButton}
        onPress={() => router.push("/(tabs)/workouts")}
      >
        <Text style={styles.emptyStateButtonText}>Browse Workouts</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary.main} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.primary.main}
          />
        }
      >
        <Animated.View style={[styles.content, animatedStyle]}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.greeting}>{greeting}</Text>
              <Text style={styles.subtitle}>{subtitle}</Text>
            </View>
            <TouchableOpacity
              style={styles.profileButton}
              onPress={() => router.push("/(tabs)/profile")}
            >
              <ProfileOutline
                width={32}
                height={32}
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
              <StatCard
                icon="barbell-outline"
                value={todaysProgress.workouts}
                label="Workouts"
              />
              <StatCard
                icon="flame-outline"
                value={todaysProgress.calories}
                label="Calories"
              />
              <StatCard
                icon="time-outline"
                value={`${todaysProgress.time}m`}
                label="Time"
              />
            </View>
          </View>

          {/* Recent Workouts */}
          <View style={styles.recentWorkoutsContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Workouts</Text>
              {recentWorkouts.length > 0 && (
                <TouchableOpacity>
                  <Text style={styles.viewAllText}>View All</Text>
                </TouchableOpacity>
              )}
            </View>
            {recentWorkouts.length > 0 ? (
              <View style={styles.workoutsList}>
                {recentWorkouts.map((workout) => (
                  <WorkoutCard key={workout.id} workout={workout} />
                ))}
              </View>
            ) : (
              <EmptyState />
            )}
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
    padding: 4,
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
    justifyContent: "space-between",
    gap: 16,
  },
  quickActionCard: {
    flex: 1,
    backgroundColor: Colors.background.card,
    borderRadius: 20,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 5,
  },
  actionIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.primary.light,
    justifyContent: "center",
    alignItems: "center",
  },
  actionTitle: {
    fontFamily: "BeVietnamPro-Bold",
    fontSize: 14,
    color: Colors.text.primary,
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
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    marginHorizontal: 8,
  },
  statValue: {
    fontFamily: "BeVietnamPro-Bold",
    fontSize: 24,
    color: Colors.text.primary,
    marginTop: 8,
  },
  statLabel: {
    fontFamily: "BeVietnamPro-Regular",
    fontSize: 14,
    color: Colors.text.secondary,
    marginTop: 4,
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  workoutName: {
    fontFamily: "BeVietnamPro-Bold",
    fontSize: 18,
    color: Colors.text.primary,
    marginBottom: 8,
  },
  workoutDate: {
    fontFamily: "BeVietnamPro-Regular",
    fontSize: 12,
    color: Colors.text.tertiary,
  },
  workoutStats: {
    alignItems: "flex-end",
  },
  workoutStat: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 8,
  },
  workoutStatText: {
    fontFamily: "BeVietnamPro-Regular",
    fontSize: 14,
    color: Colors.text.secondary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.background.primary,
  },
  emptyStateContainer: {
    backgroundColor: Colors.background.card,
    borderRadius: 20,
    padding: 32,
    alignItems: "center",
    marginTop: 16,
  },
  emptyStateTitle: {
    fontFamily: "BeVietnamPro-Bold",
    fontSize: 18,
    color: Colors.text.primary,
    marginBottom: 8,
  },
  emptyStateSubtitle: {
    fontFamily: "BeVietnamPro-Regular",
    fontSize: 14,
    color: Colors.text.secondary,
    textAlign: "center",
    marginBottom: 24,
  },
  emptyStateButton: {
    backgroundColor: Colors.primary.main,
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 24,
  },
  emptyStateButtonText: {
    fontFamily: "BeVietnamPro-Bold",
    fontSize: 16,
    color: "#FFF",
  },
});
