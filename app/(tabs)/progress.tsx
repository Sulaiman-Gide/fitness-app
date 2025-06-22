import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
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

const progressData = [
  {
    title: "Weekly Progress",
    value: "85%",
    subtitle: "Goal Completion",
    icon: "trending-up",
    color: "#4CAF50",
  },
  {
    title: "Calories Burned",
    value: "2,450",
    subtitle: "This Week",
    icon: "flame",
    color: "#FF9800",
  },
  {
    title: "Workout Time",
    value: "12.5h",
    subtitle: "Total Time",
    icon: "time",
    color: "#2196F3",
  },
  {
    title: "Current Streak",
    value: "8",
    subtitle: "Days",
    icon: "fire",
    color: "#F44336",
  },
];

const weeklyStats = [
  { day: "Mon", value: 85, color: "#4CAF50" },
  { day: "Tue", value: 92, color: "#4CAF50" },
  { day: "Wed", value: 78, color: "#FF9800" },
  { day: "Thu", value: 95, color: "#4CAF50" },
  { day: "Fri", value: 88, color: "#4CAF50" },
  { day: "Sat", value: 82, color: "#FF9800" },
  { day: "Sun", value: 90, color: "#4CAF50" },
];

const ProgressScreen = () => {
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

  const StatCard = ({ stat }: any) => (
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

  const WeeklyBar = ({ data, index }: any) => (
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

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
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

          {/* Recent Achievements */}
          <View style={styles.achievementsContainer}>
            <Text style={styles.sectionTitle}>Recent Achievements</Text>
            <View style={styles.achievementList}>
              <View style={styles.achievementItem}>
                <View
                  style={[
                    styles.achievementIcon,
                    { backgroundColor: "#4CAF50" + "20" },
                  ]}
                >
                  <Ionicons name="trophy" size={20} color="#4CAF50" />
                </View>
                <View style={styles.achievementContent}>
                  <Text style={styles.achievementTitle}>Perfect Week</Text>
                  <Text style={styles.achievementDesc}>
                    Completed all 7 workouts this week
                  </Text>
                </View>
              </View>
              <View style={styles.achievementItem}>
                <View
                  style={[
                    styles.achievementIcon,
                    { backgroundColor: "#FF9800" + "20" },
                  ]}
                >
                  <Ionicons name="flame" size={20} color="#FF9800" />
                </View>
                <View style={styles.achievementContent}>
                  <Text style={styles.achievementTitle}>Calorie Master</Text>
                  <Text style={styles.achievementDesc}>
                    Burned 2,000+ calories in a day
                  </Text>
                </View>
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
  title: {
    fontSize: 32,
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
    fontSize: 20,
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
    padding: 20,
    marginBottom: 16,
    alignItems: "center",
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.text.primary,
    marginBottom: 4,
    fontFamily: "BeVietnamPro-Bold",
  },
  statTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.text.primary,
    marginBottom: 2,
    fontFamily: "BeVietnamPro-Regular",
  },
  statSubtitle: {
    fontSize: 12,
    color: Colors.text.tertiary,
    fontFamily: "BeVietnamPro-Regular",
  },
  chartContainer: {
    marginBottom: 32,
  },
  chartWrapper: {
    backgroundColor: Colors.background.card,
    borderRadius: 16,
    padding: 20,
  },
  chart: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    height: 120,
  },
  barContainer: {
    alignItems: "center",
    flex: 1,
  },
  barWrapper: {
    height: 100,
    justifyContent: "flex-end",
    marginBottom: 8,
  },
  bar: {
    width: 20,
    borderRadius: 10,
    minHeight: 4,
  },
  barLabel: {
    fontSize: 12,
    color: Colors.text.tertiary,
    fontFamily: "BeVietnamPro-Regular",
  },
  achievementsContainer: {
    marginBottom: 32,
  },
  achievementList: {
    backgroundColor: Colors.background.card,
    borderRadius: 16,
    padding: 20,
  },
  achievementItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  achievementIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  achievementContent: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text.primary,
    marginBottom: 2,
    fontFamily: "BeVietnamPro-Regular",
  },
  achievementDesc: {
    fontSize: 14,
    color: Colors.text.tertiary,
    fontFamily: "BeVietnamPro-Regular",
  },
});
