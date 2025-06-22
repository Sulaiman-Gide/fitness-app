import { supabase } from "@/config/supabase";
import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type WorkoutTemplate = {
  id: string;
  name: string;
  category: string;
  difficulty: string;
  estimated_duration_minutes: number;
  media_url: string;
  description: string;
};

const WorkoutDetailScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [workout, setWorkout] = useState<WorkoutTemplate | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchWorkout = async () => {
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
  }, [id]);

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color={Colors.primary.main} />
      </View>
    );
  }

  if (!workout) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={styles.errorText}>Workout not found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        <View style={styles.mediaContainer}>
          <Image
            source={{ uri: workout.media_url }}
            style={styles.media}
            contentFit="cover"
            transition={500}
          />
          <View style={styles.mediaOverlay} />
          <TouchableOpacity
            style={[styles.backButton, { top: insets.top + 10 }]}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#FFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>{workout.name}</Text>
          <View style={styles.detailsRow}>
            <View style={styles.detailChip}>
              <Ionicons
                name="flash-outline"
                size={16}
                color={Colors.text.primary}
              />
              <Text style={styles.detailText}>{workout.difficulty}</Text>
            </View>
            <View style={styles.detailChip}>
              <Ionicons
                name="time-outline"
                size={16}
                color={Colors.text.primary}
              />
              <Text style={styles.detailText}>
                {workout.estimated_duration_minutes} min
              </Text>
            </View>
            <View style={styles.detailChip}>
              <Ionicons
                name="folder-outline"
                size={16}
                color={Colors.text.primary}
              />
              <Text style={styles.detailText}>{workout.category}</Text>
            </View>
          </View>
          <Text style={styles.description}>{workout.description}</Text>
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom || 24 }]}>
        <TouchableOpacity
          style={styles.startButton}
          activeOpacity={0.8}
          onPress={() =>
            router.push({
              pathname: "/active-workout",
              params: { id: workout.id },
            })
          }
        >
          <Text style={styles.startButtonText}>Start Workout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  center: {
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontFamily: "BeVietnamPro-Medium",
    fontSize: 16,
    color: Colors.text.secondary,
  },
  mediaContainer: {
    height: 400,
    position: "relative",
  },
  media: {
    ...StyleSheet.absoluteFillObject,
  },
  mediaOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  backButton: {
    position: "absolute",
    left: 20,
    backgroundColor: "rgba(0,0,0,0.4)",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    padding: 24,
  },
  title: {
    fontFamily: "BeVietnamPro-Bold",
    fontSize: 28,
    color: Colors.text.primary,
    marginBottom: 16,
  },
  detailsRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
  },
  detailChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.background.card,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    gap: 8,
  },
  detailText: {
    fontFamily: "BeVietnamPro-Regular",
    fontSize: 14,
    color: Colors.text.secondary,
  },
  description: {
    fontFamily: "BeVietnamPro-Light",
    fontSize: 16,
    color: Colors.text.secondary,
    lineHeight: 24,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.background.primary,
    paddingHorizontal: 24,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.background.card,
  },
  startButton: {
    backgroundColor: Colors.primary.main,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
  },
  startButtonText: {
    fontFamily: "BeVietnamPro-Bold",
    fontSize: 16,
    color: "#FFF",
  },
});

export default WorkoutDetailScreen;
