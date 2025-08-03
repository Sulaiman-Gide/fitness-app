import WorkoutCardSkeleton from "@/components/WorkoutCardSkeleton";
import { supabase } from "@/config/supabase";
import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";

interface WorkoutTemplate {
  id: number;
  name: string;
  category: string;
  difficulty: string;
  estimated_duration_minutes: number;
  media_url: string;
}

const workoutCategories = [
  "All",
  "Strength",
  "Cardio",
  "HIIT",
  "Flexibility",
  "Mindfulness",
];

const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

const WorkoutsScreen = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [templates, setTemplates] = useState<WorkoutTemplate[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const userWeight = useSelector((state: any) => state.auth.profile?.weight);

  const getAdjustedDuration = (baseDuration: number, weight?: number) => {
    if (!weight || isNaN(weight)) return baseDuration;

    if (weight < 50) {
      // Less than 50kg: 40% of the time (minimum 12 minutes)
      return Math.max(Math.round(baseDuration * 0.4), 12);
    } else if (weight >= 50 && weight <= 59) {
      // 50-59kg: 60% of the time (minimum 18 minutes)
      return Math.max(Math.round(baseDuration * 0.6), 18);
    } else if (weight >= 60 && weight <= 74) {
      // 60-74kg: 80% of the time (minimum 24 minutes)
      return Math.max(Math.round(baseDuration * 0.8), 24);
    } else if (weight >= 75 && weight <= 89) {
      // 75-89kg: Standard duration
      return baseDuration;
    } else if (weight >= 90 && weight <= 99) {
      // 90-99kg: 25% more time
      return Math.round(baseDuration * 1.25);
    } else {
      // 100kg+: 50% more time
      return Math.round(baseDuration * 1.5);
    }
  };

  const fetchWorkoutTemplates = async () => {
    try {
      let query = supabase.from("workout_templates").select("*");

      const { data, error } = await query.order("name", { ascending: true });
      if (error) throw error;
      setTemplates(data);
    } catch (error) {
      console.error("Error fetching workout templates:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchWorkoutTemplates();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchWorkoutTemplates().finally(() => setRefreshing(false));
  }, []);

  const filteredWorkouts = useMemo(() => {
    let filtered = templates;

    if (selectedCategory !== "All") {
      filtered = filtered.filter((t) => t.category === selectedCategory);
    }

    if (searchQuery) {
      filtered = filtered.filter((t) =>
        t.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return filtered;
  }, [templates, selectedCategory, searchQuery]);

  const groupedWorkouts = useMemo(() => {
    if (selectedCategory !== "All" || searchQuery) {
      return { All: filteredWorkouts };
    }

    const groups = filteredWorkouts.reduce((acc, workout) => {
      const { category } = workout;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(workout);
      return acc;
    }, {} as Record<string, WorkoutTemplate[]>);

    const orderedGroups: Record<string, WorkoutTemplate[]> = {};
    workoutCategories.slice(1).forEach((category) => {
      if (groups[category]) {
        orderedGroups[category] = groups[category];
      }
    });
    return orderedGroups;
  }, [filteredWorkouts, selectedCategory, searchQuery]);

  const CategoryChip = ({ category }: { category: string }) => (
    <TouchableOpacity
      style={[
        styles.categoryChip,
        selectedCategory === category && styles.categoryChipActive,
      ]}
      onPress={() => setSelectedCategory(category)}
    >
      <Text
        style={[
          styles.categoryChipText,
          selectedCategory === category && styles.categoryChipTextActive,
        ]}
      >
        {category}
      </Text>
    </TouchableOpacity>
  );

  const WorkoutCard = ({ template }: { template: WorkoutTemplate }) => (
    <TouchableOpacity
      style={styles.workoutCard}
      activeOpacity={0.8}
      onPress={() =>
        router.push({
          pathname: "/workout-detail",
          params: { id: template.id },
        })
      }
    >
      <Image
        source={{ uri: template.media_url }}
        style={styles.workoutImage}
        contentFit="cover"
        transition={500}
      />
      <View style={styles.workoutImageOverlay} />
      <View style={styles.workoutContent}>
        <Text style={styles.workoutName}>{template.name}</Text>
        <View style={styles.workoutDetails}>
          <View style={styles.workoutDetailChip}>
            <Ionicons name="flash-outline" size={14} color="#FFF" />
            <Text style={styles.workoutDetailText}>{template.difficulty}</Text>
          </View>
          <View style={styles.workoutDetailChip}>
            <Ionicons name="time-outline" size={14} color="#FFF" />
            <Text style={styles.workoutDetailText}>
              {getAdjustedDuration(
                template.estimated_duration_minutes,
                userWeight ? parseFloat(userWeight) : undefined
              )}{" "}
              min
              {userWeight && parseFloat(userWeight) >= 80 && (
                <Text style={styles.adjustedText}>*</Text>
              )}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

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
        <View style={styles.header}>
          {!isSearchActive ? (
            <Text style={styles.title}>Discover Workouts</Text>
          ) : (
            <TextInput
              style={styles.searchInput}
              placeholder="Search workouts..."
              placeholderTextColor={Colors.text.tertiary}
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoFocus
            />
          )}
          <TouchableOpacity
            style={styles.searchButton}
            onPress={() => setIsSearchActive(!isSearchActive)}
          >
            <Ionicons
              name={isSearchActive ? "close" : "search"}
              size={24}
              color={Colors.text.primary}
            />
          </TouchableOpacity>
        </View>

        {!searchQuery && (
          <View style={styles.categoriesContainer}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 24 }}
            >
              {workoutCategories.map((category) => (
                <CategoryChip key={category} category={category} />
              ))}
            </ScrollView>
          </View>
        )}

        {loading && !refreshing ? (
          <View style={styles.workoutsList}>
            {[...Array(5)].map((_, index) => (
              <WorkoutCardSkeleton key={index} delay={index * 150} />
            ))}
          </View>
        ) : filteredWorkouts.length > 0 ? (
          <View style={styles.workoutsContainer}>
            {Object.entries(groupedWorkouts).map(([category, workouts]) => (
              <View
                key={category}
                style={
                  category === "All"
                    ? styles.allCategoryGroup
                    : styles.categoryGroup
                }
              >
                {category !== "All" && (
                  <Text style={styles.categoryTitle}>{category}</Text>
                )}
                {workouts.map((template) => (
                  <WorkoutCard key={template.id} template={template} />
                ))}
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.emptyStateContainer}>
            <Text style={styles.emptyStateText}>
              No workouts found for "{searchQuery}"
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default WorkoutsScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background.primary },
  scrollContent: { paddingBottom: 100 },
  header: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontFamily: "BeVietnamPro-Bold",
    color: Colors.text.primary,
  },
  searchInput: {
    flex: 1,
    fontSize: 22,
    fontFamily: "BeVietnamPro-Regular",
    color: Colors.text.primary,
    marginRight: 15,
  },
  searchButton: {
    backgroundColor: Colors.background.card,
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  categoriesContainer: {
    marginVertical: 10,
  },
  categoryChip: {
    backgroundColor: Colors.background.card,
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginRight: 10,
  },
  categoryChipActive: {
    backgroundColor: Colors.primary.main,
  },
  categoryChipText: {
    fontFamily: "BeVietnamPro-Medium",
    fontSize: 14,
    color: Colors.text.secondary,
  },
  categoryChipTextActive: {
    color: "#FFF",
  },
  workoutsContainer: {
    paddingHorizontal: 24,
  },
  categoryGroup: {
    marginBottom: 30,
  },
  allCategoryGroup: {
    marginBottom: 0,
  },
  categoryTitle: {
    fontSize: 22,
    marginBottom: 15,
    fontFamily: "BeVietnamPro-Bold",
    color: Colors.text.primary,
    textTransform: "capitalize",
  },
  workoutsList: {
    paddingHorizontal: 24,
    marginTop: 10,
  },
  workoutCard: {
    height: 180,
    borderRadius: 20,
    overflow: "hidden",
    position: "relative",
    marginBottom: 20,
  },
  workoutImage: {
    ...StyleSheet.absoluteFillObject,
  },
  workoutImageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  workoutContent: {
    flex: 1,
    justifyContent: "flex-end",
    padding: 20,
  },
  workoutName: {
    fontFamily: "BeVietnamPro-Bold",
    fontSize: 22,
    color: "#FFF",
    marginBottom: 8,
  },
  workoutDetails: {
    flexDirection: "row",
    gap: 10,
  },
  workoutDetailChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 14,
    paddingVertical: 6,
    paddingHorizontal: 12,
    gap: 6,
  },
  workoutDetailText: {
    fontFamily: "BeVietnamPro-Regular",
    fontSize: 12,
    color: "rgba(255,255,255,0.9)",
  },
  emptyStateContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 150,
  },
  emptyStateText: {
    fontFamily: "BeVietnamPro-Medium",
    fontSize: 16,
    color: Colors.text.secondary,
    textAlign: "center",
    marginTop: 16,
    lineHeight: 24,
  },
  adjustedText: {
    color: Colors.primary.main,
    fontSize: 12,
    position: "relative",
    top: -4,
  },
});
