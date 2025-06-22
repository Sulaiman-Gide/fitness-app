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

const workoutCategories = [
  {
    id: "strength",
    title: "Strength Training",
    subtitle: "Build muscle and power",
    icon: "barbell",
    color: "#4CAF50",
    exercises: 24,
  },
  {
    id: "cardio",
    title: "Cardio",
    subtitle: "Improve endurance",
    icon: "heart",
    color: "#F44336",
    exercises: 18,
  },
  {
    id: "flexibility",
    title: "Flexibility",
    subtitle: "Enhance mobility",
    icon: "body",
    color: "#2196F3",
    exercises: 12,
  },
  {
    id: "hiit",
    title: "HIIT",
    subtitle: "High intensity training",
    icon: "flash",
    color: "#FF9800",
    exercises: 15,
  },
];

const popularWorkouts = [
  {
    id: "1",
    name: "Full Body Blast",
    category: "Strength",
    duration: "45 min",
    difficulty: "Intermediate",
    rating: 4.8,
  },
  {
    id: "2",
    name: "Cardio Kickboxing",
    category: "Cardio",
    duration: "30 min",
    difficulty: "Beginner",
    rating: 4.6,
  },
  {
    id: "3",
    name: "Yoga Flow",
    category: "Flexibility",
    duration: "40 min",
    difficulty: "All Levels",
    rating: 4.9,
  },
  {
    id: "4",
    name: "Tabata Training",
    category: "HIIT",
    duration: "20 min",
    difficulty: "Advanced",
    rating: 4.7,
  },
];

const WorkoutsScreen = () => {
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

  const CategoryCard = ({ category }: any) => (
    <TouchableOpacity style={styles.categoryCard} activeOpacity={0.8}>
      <View
        style={[
          styles.categoryIcon,
          { backgroundColor: category.color + "20" },
        ]}
      >
        <Ionicons
          name={category.icon as any}
          size={32}
          color={category.color}
        />
      </View>
      <View style={styles.categoryContent}>
        <Text style={styles.categoryTitle}>{category.title}</Text>
        <Text style={styles.categorySubtitle}>{category.subtitle}</Text>
        <Text style={styles.categoryExercises}>
          {category.exercises} exercises
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={Colors.text.tertiary} />
    </TouchableOpacity>
  );

  const WorkoutCard = ({ workout }: any) => (
    <TouchableOpacity style={styles.workoutCard} activeOpacity={0.8}>
      <View style={styles.workoutHeader}>
        <View>
          <Text style={styles.workoutName}>{workout.name}</Text>
          <Text style={styles.workoutCategory}>{workout.category}</Text>
        </View>
        <View style={styles.workoutRating}>
          <Ionicons name="star" size={16} color="#FFD700" />
          <Text style={styles.ratingText}>{workout.rating}</Text>
        </View>
      </View>
      <View style={styles.workoutDetails}>
        <View style={styles.workoutDetail}>
          <Ionicons name="time" size={16} color={Colors.text.tertiary} />
          <Text style={styles.detailText}>{workout.duration}</Text>
        </View>
        <View style={styles.workoutDetail}>
          <Ionicons name="fitness" size={16} color={Colors.text.tertiary} />
          <Text style={styles.detailText}>{workout.difficulty}</Text>
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
            <Text style={styles.title}>Workouts</Text>
            <TouchableOpacity style={styles.searchButton}>
              <Ionicons name="search" size={24} color={Colors.text.primary} />
            </TouchableOpacity>
          </View>

          {/* Categories */}
          <View style={styles.categoriesContainer}>
            <Text style={styles.sectionTitle}>Categories</Text>
            <View style={styles.categoriesList}>
              {workoutCategories.map((category) => (
                <CategoryCard key={category.id} category={category} />
              ))}
            </View>
          </View>

          {/* Popular Workouts */}
          <View style={styles.popularContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Popular Workouts</Text>
              <TouchableOpacity>
                <Text style={styles.viewAllText}>View All</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.workoutsList}>
              {popularWorkouts.map((workout) => (
                <WorkoutCard key={workout.id} workout={workout} />
              ))}
            </View>
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default WorkoutsScreen;

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
  searchButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.background.card,
    justifyContent: "center",
    alignItems: "center",
  },
  categoriesContainer: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: Colors.text.primary,
    marginBottom: 16,
    fontFamily: "BeVietnamPro-Bold",
  },
  categoriesList: {
    gap: 12,
  },
  categoryCard: {
    backgroundColor: Colors.background.card,
    borderRadius: 16,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  categoryIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  categoryContent: {
    flex: 1,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.text.primary,
    marginBottom: 4,
    fontFamily: "BeVietnamPro-Regular",
  },
  categorySubtitle: {
    fontSize: 14,
    color: Colors.text.tertiary,
    marginBottom: 4,
    fontFamily: "BeVietnamPro-Regular",
  },
  categoryExercises: {
    fontSize: 12,
    color: Colors.text.tertiary,
    fontFamily: "BeVietnamPro-Regular",
  },
  popularContainer: {
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
    alignItems: "flex-start",
    marginBottom: 12,
  },
  workoutName: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.text.primary,
    marginBottom: 4,
    fontFamily: "BeVietnamPro-Regular",
  },
  workoutCategory: {
    fontSize: 14,
    color: Colors.text.tertiary,
    fontFamily: "BeVietnamPro-Regular",
  },
  workoutRating: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  ratingText: {
    fontSize: 14,
    color: Colors.text.primary,
    fontFamily: "BeVietnamPro-Regular",
  },
  workoutDetails: {
    flexDirection: "row",
    gap: 16,
  },
  workoutDetail: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  detailText: {
    fontSize: 14,
    color: Colors.text.tertiary,
    fontFamily: "BeVietnamPro-Regular",
  },
});
