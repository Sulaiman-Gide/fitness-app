import { supabase } from "@/config/supabase";
import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import LottieView from "lottie-react-native";
import React, { useCallback, useEffect, useState } from "react";
import {
  Dimensions,
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

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

// Achievement types and interfaces
interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  requirement: number;
  currentProgress: number;
  isUnlocked: boolean;
  category: "workouts" | "calories" | "streak" | "time" | "strength" | "cardio";
}

interface ProgressData {
  title: string;
  value: string;
  subtitle: string;
  icon: string;
  color: string;
}

interface WeeklyStats {
  day: string;
  value: number;
  color: string;
}

const formatWorkoutTime = (totalMinutes: number) => {
  if (totalMinutes < 1) {
    return "0m";
  }
  if (totalMinutes < 60) {
    return `${totalMinutes}m`;
  }
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (minutes === 0) {
    return `${hours}h`;
  }
  return `${hours}h ${minutes}m`;
};

const ProgressScreen = () => {
  const router = useRouter();
  const user = useSelector((state: any) => state.auth.user);
  const fadeAnim = useSharedValue(0);
  const slideAnim = useSharedValue(50);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [progressData, setProgressData] = useState<ProgressData[]>([]);
  const [weeklyStats, setWeeklyStats] = useState<WeeklyStats[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [userStats, setUserStats] = useState({
    totalWorkouts: 0,
    totalCalories: 0,
    totalTime: 0,
    currentStreak: 0,
    weeklyWorkouts: 0,
    weeklyCalories: 0,
    weeklyTime: 0,
  });

  // Achievement definitions
  const achievementDefinitions: Omit<
    Achievement,
    "currentProgress" | "isUnlocked"
  >[] = [
    // Workout achievements
    {
      id: "first-workout",
      title: "First Steps",
      description: "Complete your first workout",
      icon: "fitness",
      color: "#4CAF50",
      requirement: 1,
      category: "workouts",
    },
    {
      id: "workout-5",
      title: "Getting Started",
      description: "Complete 5 workouts",
      icon: "fitness",
      color: "#4CAF50",
      requirement: 5,
      category: "workouts",
    },
    {
      id: "workout-25",
      title: "Dedicated Athlete",
      description: "Complete 25 workouts",
      icon: "fitness",
      color: "#4CAF50",
      requirement: 25,
      category: "workouts",
    },
    {
      id: "workout-50",
      title: "Fitness Enthusiast",
      description: "Complete 50 workouts",
      icon: "fitness",
      color: "#4CAF50",
      requirement: 50,
      category: "workouts",
    },
    {
      id: "workout-100",
      title: "Fitness Master",
      description: "Complete 100 workouts",
      icon: "fitness",
      color: "#4CAF50",
      requirement: 100,
      category: "workouts",
    },

    // Calorie achievements
    {
      id: "calories-1000",
      title: "Calorie Burner",
      description: "Burn 1,000 total calories",
      icon: "flame",
      color: "#FF9800",
      requirement: 1000,
      category: "calories",
    },
    {
      id: "calories-5000",
      title: "Calorie Crusher",
      description: "Burn 5,000 total calories",
      icon: "flame",
      color: "#FF9800",
      requirement: 5000,
      category: "calories",
    },
    {
      id: "calories-10000",
      title: "Calorie Master",
      description: "Burn 10,000 total calories",
      icon: "flame",
      color: "#FF9800",
      requirement: 10000,
      category: "calories",
    },
    {
      id: "calories-25000",
      title: "Calorie Legend",
      description: "Burn 25,000 total calories",
      icon: "flame",
      color: "#FF9800",
      requirement: 25000,
      category: "calories",
    },

    // Streak achievements
    {
      id: "streak-3",
      title: "Getting Consistent",
      description: "Maintain a 3-day streak",
      icon: "flame",
      color: "#F44336",
      requirement: 3,
      category: "streak",
    },
    {
      id: "streak-7",
      title: "Week Warrior",
      description: "Maintain a 7-day streak",
      icon: "flame",
      color: "#F44336",
      requirement: 7,
      category: "streak",
    },
    {
      id: "streak-14",
      title: "Fortnight Fighter",
      description: "Maintain a 14-day streak",
      icon: "flame",
      color: "#F44336",
      requirement: 14,
      category: "streak",
    },
    {
      id: "streak-30",
      title: "Monthly Master",
      description: "Maintain a 30-day streak",
      icon: "flame",
      color: "#F44336",
      requirement: 30,
      category: "streak",
    },
    {
      id: "streak-100",
      title: "Century Club",
      description: "Maintain a 100-day streak",
      icon: "flame",
      color: "#F44336",
      requirement: 100,
      category: "streak",
    },

    // Time achievements
    {
      id: "time-60",
      title: "Hour Hero",
      description: "Complete 60 minutes of workouts",
      icon: "time",
      color: "#2196F3",
      requirement: 60,
      category: "time",
    },
    {
      id: "time-300",
      title: "Time Tracker",
      description: "Complete 5 hours of workouts",
      icon: "time",
      color: "#2196F3",
      requirement: 300,
      category: "time",
    },
    {
      id: "time-600",
      title: "Time Master",
      description: "Complete 10 hours of workouts",
      icon: "time",
      color: "#2196F3",
      requirement: 600,
      category: "time",
    },
    {
      id: "time-1500",
      title: "Time Legend",
      description: "Complete 25 hours of workouts",
      icon: "time",
      color: "#2196F3",
      requirement: 1500,
      category: "time",
    },

    // Special achievements
    {
      id: "perfect-week",
      title: "Perfect Week",
      description: "Complete 7 workouts in a week",
      icon: "trophy",
      color: "#9C27B0",
      requirement: 7,
      category: "workouts",
    },
    {
      id: "daily-dedication",
      title: "Daily Dedication",
      description: "Work out for 7 consecutive days",
      icon: "calendar",
      color: "#9C27B0",
      requirement: 7,
      category: "streak",
    },
  ];

  const fetchProgressData = async () => {
    if (!user) return;

    try {
      const now = new Date();
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - now.getDay());
      weekStart.setHours(0, 0, 0, 0);

      // Fetch all workout history
      const { data: workoutHistory, error } = await supabase
        .from("workout_history")
        .select("*")
        .eq("user_id", user.id)
        .order("completed_at", { ascending: false });

      if (error) throw error;

      // Calculate total stats
      const totalWorkouts = workoutHistory.length;
      const totalCalories = workoutHistory.reduce(
        (sum, w) => sum + (w.calories_burned || 0),
        0
      );
      const totalTime = Math.round(
        workoutHistory.reduce((sum, w) => sum + (w.duration_seconds || 0), 0) /
          60
      );

      // Calculate weekly stats
      const weeklyWorkouts = workoutHistory.filter(
        (w) => new Date(w.completed_at) >= weekStart
      ).length;
      const weeklyCalories = workoutHistory
        .filter((w) => new Date(w.completed_at) >= weekStart)
        .reduce((sum, w) => sum + (w.calories_burned || 0), 0);
      const weeklyTime = Math.round(
        workoutHistory
          .filter((w) => new Date(w.completed_at) >= weekStart)
          .reduce((sum, w) => sum + (w.duration_seconds || 0), 0) / 60
      );

      // Calculate current streak
      let currentStreak = 0;
      const sortedWorkouts = workoutHistory.sort(
        (a, b) =>
          new Date(b.completed_at).getTime() -
          new Date(a.completed_at).getTime()
      );

      if (sortedWorkouts.length > 0) {
        let currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);

        for (let i = 0; i < 100; i++) {
          // Check up to 100 days back
          const dayWorkouts = sortedWorkouts.filter((w) => {
            const workoutDate = new Date(w.completed_at);
            workoutDate.setHours(0, 0, 0, 0);
            return workoutDate.getTime() === currentDate.getTime();
          });

          if (dayWorkouts.length > 0) {
            currentStreak++;
            currentDate.setDate(currentDate.getDate() - 1);
          } else {
            break;
          }
        }
      }

      // Generate weekly chart data
      const weeklyChartData: WeeklyStats[] = [];
      const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

      for (let i = 0; i < 7; i++) {
        const dayStart = new Date(weekStart);
        dayStart.setDate(weekStart.getDate() + i);
        const dayEnd = new Date(dayStart);
        dayEnd.setDate(dayStart.getDate() + 1);

        const dayWorkouts = workoutHistory.filter((w) => {
          const workoutDate = new Date(w.completed_at);
          return workoutDate >= dayStart && workoutDate < dayEnd;
        });

        const workoutCount = dayWorkouts.length;
        const maxWorkouts = 3; // Assume 3 workouts per day as max for 100% height
        const percentage = Math.min((workoutCount / maxWorkouts) * 100, 100);

        weeklyChartData.push({
          day: days[i],
          value: percentage,
          color: workoutCount > 0 ? "#4CAF50" : "#F44336",
        });
      }

      // Update progress data
      const newProgressData: ProgressData[] = [
        {
          title: "Weekly Progress",
          value: `${Math.min(Math.round((weeklyWorkouts / 7) * 100), 100)}%`,
          subtitle: `${weeklyWorkouts}/7 workouts`,
          icon: "trending-up",
          color: "#4CAF50",
        },
        {
          title: "Calories Burned",
          value: weeklyCalories.toLocaleString(),
          subtitle: "This Week",
          icon: "flame",
          color: "#FF9800",
        },
        {
          title: "Workout Time",
          value: formatWorkoutTime(weeklyTime),
          subtitle: "This Week",
          icon: "time",
          color: "#2196F3",
        },
        {
          title: "Current Streak",
          value: currentStreak.toString(),
          subtitle: "Days",
          icon: "flame",
          color: "#F44336",
        },
      ];

      // Calculate achievements
      const newAchievements = achievementDefinitions.map((achievement) => {
        let currentProgress = 0;

        switch (achievement.category) {
          case "workouts":
            currentProgress =
              achievement.id === "perfect-week"
                ? weeklyWorkouts
                : totalWorkouts;
            break;
          case "calories":
            currentProgress = totalCalories;
            break;
          case "streak":
            currentProgress = currentStreak;
            break;
          case "time":
            currentProgress = totalTime;
            break;
          default:
            currentProgress = 0;
        }

        return {
          ...achievement,
          currentProgress,
          isUnlocked: currentProgress >= achievement.requirement,
        };
      });

      setUserStats({
        totalWorkouts,
        totalCalories,
        totalTime,
        currentStreak,
        weeklyWorkouts,
        weeklyCalories,
        weeklyTime,
      });
      setProgressData(newProgressData);
      setWeeklyStats(weeklyChartData);
      setAchievements(newAchievements);
    } catch (error) {
      console.error("Error fetching progress data:", error);
    }
  };

  useEffect(() => {
    fadeAnim.value = withTiming(1, { duration: 1000 });
    slideAnim.value = withSpring(0, { damping: 15, stiffness: 100 });
  }, []);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      fetchProgressData().finally(() => setLoading(false));
    }, [user])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchProgressData().finally(() => setRefreshing(false));
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: fadeAnim.value,
    transform: [{ translateY: slideAnim.value }],
  }));

  const StatCard = ({ stat }: { stat: ProgressData }) => (
    <View style={styles.statCard}>
      <View
        style={[styles.iconContainer, { backgroundColor: stat.color + "20" }]}
      >
        <Ionicons name={stat.icon as any} size={24} color={stat.color} />
      </View>
      <Text style={styles.statValue}>{stat.value}</Text>
      <Text style={styles.statTitle}>{stat.title}</Text>
      <Text style={styles.statSubtitle}>{stat.subtitle}</Text>
    </View>
  );

  const WeeklyBar = ({ data, index }: { data: WeeklyStats; index: number }) => (
    <View style={styles.barContainer}>
      <View style={styles.barWrapper}>
        <View
          style={[
            styles.bar,
            {
              height: `${data.value}%`,
              backgroundColor: data.color,
            },
          ]}
        />
      </View>
      <Text style={styles.barLabel}>{data.day}</Text>
    </View>
  );

  const AchievementItem = ({ achievement }: { achievement: Achievement }) => (
    <View
      style={[
        styles.achievementItem,
        !achievement.isUnlocked && styles.achievementItemLocked,
      ]}
    >
      <View
        style={[
          styles.achievementIcon,
          { backgroundColor: achievement.color + "20" },
          !achievement.isUnlocked && styles.achievementIconLocked,
        ]}
      >
        <Ionicons
          name={
            achievement.isUnlocked ? (achievement.icon as any) : "lock-closed"
          }
          size={20}
          color={
            achievement.isUnlocked ? achievement.color : Colors.text.tertiary
          }
        />
      </View>
      <View style={styles.achievementContent}>
        <Text
          style={[
            styles.achievementTitle,
            !achievement.isUnlocked && styles.achievementTitleLocked,
          ]}
        >
          {achievement.title}
        </Text>
        <Text
          style={[
            styles.achievementDesc,
            !achievement.isUnlocked && styles.achievementDescLocked,
          ]}
        >
          {achievement.description}
        </Text>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${Math.min(
                  (achievement.currentProgress / achievement.requirement) * 100,
                  100
                )}%`,
                backgroundColor: achievement.color,
              },
            ]}
          />
        </View>
        <Text style={styles.progressText}>
          {achievement.currentProgress} / {achievement.requirement}
        </Text>
      </View>
      {achievement.isUnlocked && (
        <View style={styles.unlockedBadge}>
          <Ionicons
            name="checkmark-circle"
            size={20}
            color={achievement.color}
          />
        </View>
      )}
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <LottieView
            source={require("../../assets/Lottie/appLoadingWhite.json")}
            autoPlay
            loop
            style={{ width: 40, height: 40 }}
          />
        </View>
      </SafeAreaView>
    );
  }

  const unlockedAchievements = achievements.filter((a) => a.isUnlocked);
  const lockedAchievements = achievements.filter((a) => !a.isUnlocked);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Animated.View style={[styles.content, animatedStyle]}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Progress</Text>
            <TouchableOpacity style={styles.settingsButton}>
              <Ionicons name="calendar" size={24} color={Colors.text.primary} />
            </TouchableOpacity>
          </View>

          {/* Stats Grid */}
          <View style={styles.statsContainer}>
            <Text style={styles.sectionTitle}>This Week</Text>
            <View style={styles.statsGrid}>
              {progressData.map((stat, index) => (
                <StatCard key={index} stat={stat} />
              ))}
            </View>
          </View>

          {/* Weekly Chart */}
          <View style={styles.chartContainer}>
            <Text style={styles.sectionTitle}>Weekly Activity</Text>
            <View style={styles.chartWrapper}>
              <View style={styles.chart}>
                {weeklyStats.map((data, index) => (
                  <WeeklyBar key={index} data={data} index={index} />
                ))}
              </View>
            </View>
          </View>

          {/* Achievements */}
          <View style={styles.achievementsContainer}>
            <View style={styles.achievementsHeader}>
              <Text style={styles.sectionTitle}>Achievements</Text>
              <Text style={styles.achievementsCount}>
                {unlockedAchievements.length} / {achievements.length}
              </Text>
            </View>

            {/* Unlocked Achievements */}
            {unlockedAchievements.length > 0 && (
              <View style={styles.achievementSection}>
                <Text style={styles.achievementSectionTitle}>Unlocked</Text>
                <View style={styles.achievementList}>
                  {unlockedAchievements.slice(0, 3).map((achievement) => (
                    <AchievementItem
                      key={achievement.id}
                      achievement={achievement}
                    />
                  ))}
                </View>
              </View>
            )}

            {/* Locked Achievements */}
            <View style={styles.achievementSection}>
              <Text style={styles.achievementSectionTitle}>Upcoming</Text>
              <View style={styles.achievementList}>
                {lockedAchievements.slice(0, 5).map((achievement) => (
                  <AchievementItem
                    key={achievement.id}
                    achievement={achievement}
                  />
                ))}
              </View>
            </View>
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProgressScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    color: Colors.text.secondary,
    fontFamily: "BeVietnamPro-Regular",
  },
  scrollContent: {
    paddingBottom: 40,
  },
  content: {
    paddingHorizontal: Math.max(24, screenWidth * 0.05),
    paddingTop: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 32,
  },
  title: {
    fontSize: Math.max(28, screenWidth * 0.07),
    fontWeight: "bold",
    color: Colors.text.primary,
    fontFamily: "BeVietnamPro-Bold",
  },
  settingsButton: {
    padding: 8,
  },
  statsContainer: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: Math.max(20, screenWidth * 0.05),
    fontWeight: "600",
    color: Colors.text.primary,
    marginBottom: 16,
    fontFamily: "BeVietnamPro-Bold",
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  statCard: {
    width: "48%",
    backgroundColor: Colors.background.card,
    borderRadius: 16,
    padding: Math.max(16, screenWidth * 0.04),
    marginBottom: 16,
    alignItems: "center",
  },
  iconContainer: {
    width: Math.max(40, screenWidth * 0.1),
    height: Math.max(40, screenWidth * 0.1),
    borderRadius: Math.max(20, screenWidth * 0.05),
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  statValue: {
    fontSize: Math.max(20, screenWidth * 0.05),
    fontWeight: "bold",
    color: Colors.text.primary,
    marginBottom: 4,
    fontFamily: "BeVietnamPro-Bold",
  },
  statTitle: {
    fontSize: Math.max(12, screenWidth * 0.03),
    fontWeight: "600",
    color: Colors.text.primary,
    marginBottom: 2,
    fontFamily: "BeVietnamPro-Regular",
  },
  statSubtitle: {
    fontSize: Math.max(10, screenWidth * 0.025),
    color: Colors.text.tertiary,
    fontFamily: "BeVietnamPro-Regular",
  },
  chartContainer: {
    marginBottom: 32,
  },
  chartWrapper: {
    backgroundColor: Colors.background.card,
    borderRadius: 16,
    padding: Math.max(16, screenWidth * 0.04),
  },
  chart: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    height: Math.max(100, screenHeight * 0.12),
  },
  barContainer: {
    alignItems: "center",
    flex: 1,
  },
  barWrapper: {
    height: Math.max(80, screenHeight * 0.1),
    justifyContent: "flex-end",
    marginBottom: 8,
  },
  bar: {
    width: Math.max(16, screenWidth * 0.04),
    borderRadius: 8,
    minHeight: 4,
  },
  barLabel: {
    fontSize: Math.max(10, screenWidth * 0.025),
    color: Colors.text.tertiary,
    fontFamily: "BeVietnamPro-Regular",
  },
  achievementsContainer: {
    marginBottom: 32,
  },
  achievementsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  achievementsCount: {
    fontSize: Math.max(14, screenWidth * 0.035),
    color: Colors.text.secondary,
    fontFamily: "BeVietnamPro-Regular",
  },
  achievementSection: {
    marginBottom: 24,
  },
  achievementSectionTitle: {
    fontSize: Math.max(16, screenWidth * 0.04),
    fontWeight: "600",
    color: Colors.text.secondary,
    marginBottom: 12,
    fontFamily: "BeVietnamPro-Bold",
  },
  achievementList: {
    backgroundColor: Colors.background.card,
    borderRadius: 16,
    padding: Math.max(16, screenWidth * 0.04),
  },
  achievementItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    padding: 12,
    borderRadius: 12,
    backgroundColor: Colors.background.primary,
  },
  achievementItemLocked: {
    opacity: 0.6,
  },
  achievementIcon: {
    width: Math.max(36, screenWidth * 0.09),
    height: Math.max(36, screenWidth * 0.09),
    borderRadius: Math.max(18, screenWidth * 0.045),
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  achievementIconLocked: {
    backgroundColor: Colors.background.card,
  },
  achievementContent: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: Math.max(14, screenWidth * 0.035),
    fontWeight: "600",
    color: Colors.text.primary,
    marginBottom: 2,
    fontFamily: "BeVietnamPro-Regular",
  },
  achievementTitleLocked: {
    color: Colors.text.tertiary,
  },
  achievementDesc: {
    fontSize: Math.max(12, screenWidth * 0.03),
    color: Colors.text.secondary,
    marginBottom: 8,
    fontFamily: "BeVietnamPro-Regular",
  },
  achievementDescLocked: {
    color: Colors.text.tertiary,
  },
  progressBar: {
    height: 4,
    backgroundColor: Colors.background.card,
    borderRadius: 2,
    marginBottom: 4,
  },
  progressFill: {
    height: "100%",
    borderRadius: 2,
  },
  progressText: {
    fontSize: Math.max(10, screenWidth * 0.025),
    color: Colors.text.tertiary,
    fontFamily: "BeVietnamPro-Regular",
  },
  unlockedBadge: {
    marginLeft: 8,
  },
});
