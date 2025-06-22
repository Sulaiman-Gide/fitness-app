import CustomToast from "@/components/CustomToast";
import { supabase } from "@/config/supabase";
import Colors from "@/constants/Colors";
import { setProfile } from "@/store/authSlice";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Stack, useRouter } from "expo-router";
import LottieView from "lottie-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";

const GoalsScreen = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();
  const user = useSelector((state: any) => state.auth.user);
  const profile = useSelector((state: any) => state.auth.profile);

  const [targetWeight, setTargetWeight] = useState("");
  const [weeklyWorkouts, setWeeklyWorkouts] = useState("");
  const [dailyCalories, setDailyCalories] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({
    visible: false,
    message: "",
    type: "info" as "success" | "error" | "info",
  });

  useEffect(() => {
    if (profile) {
      setTargetWeight(profile.target_weight?.toString() || "");
      setWeeklyWorkouts(profile.weekly_workouts?.toString() || "");
      setDailyCalories(profile.daily_calorie_target?.toString() || "");
    }
    setLoading(false);
  }, [profile]);

  const showToast = (message: string, type: "success" | "error" | "info") => {
    setToast({ visible: true, message, type });
  };

  const handleSave = async () => {
    if (!user) {
      showToast("You must be logged in to save goals.", "error");
      return;
    }

    setSaving(true);
    const updatedGoals = {
      id: user.id,
      target_weight: Number(targetWeight) || null,
      weekly_workouts: Number(weeklyWorkouts) || null,
      daily_calorie_target: Number(dailyCalories) || null,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("profiles")
      .upsert(updatedGoals)
      .select()
      .single();

    setSaving(false);

    if (error) {
      showToast(error.message, "error");
    } else if (data) {
      dispatch(setProfile(data));
      showToast("Goals saved successfully!", "success");
      setTimeout(() => router.back(), 1500);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary.main} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <Image
        source={require("../assets/images/photo-5.jpg")}
        style={styles.backgroundImage}
        contentFit="cover"
      />
      <LinearGradient
        colors={["rgba(0,0,0,0.3)", "rgba(0,0,0,0.8)"]}
        style={styles.gradientOverlay}
      />

      <View style={[styles.customHeader, { top: insets.top }]}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={28} color="#FFF" />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top + 60,
          paddingBottom: 120,
        }}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          style={styles.headerTextContainer}
          entering={FadeInDown.duration(600)}
        >
          <Text style={styles.sectionTitle}>Set Your Goals</Text>
          <Text style={styles.sectionSubtitle}>
            Achieve more by setting clear targets for your fitness journey.
          </Text>
        </Animated.View>

        <Animated.View
          style={styles.formContainer}
          entering={FadeInDown.duration(600).delay(200)}
        >
          <GoalInput
            label="Target Weight (kg)"
            value={targetWeight}
            onChangeText={setTargetWeight}
            placeholder="e.g., 75"
            icon="barbell"
          />
          <GoalInput
            label="Weekly Workouts"
            value={weeklyWorkouts}
            onChangeText={setWeeklyWorkouts}
            placeholder="e.g., 4"
            icon="calendar"
          />
          <GoalInput
            label="Daily Calorie Target"
            value={dailyCalories}
            onChangeText={setDailyCalories}
            placeholder="e.g., 2200"
            icon="flame"
          />
        </Animated.View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 10 }]}>
        <TouchableOpacity
          style={[styles.saveButton, saving && styles.buttonDisabled]}
          onPress={handleSave}
          disabled={saving}
        >
          {saving ? (
            <LottieView
              source={require("../assets/Lottie/appLoadingWhite.json")}
              autoPlay
              loop
              style={{ width: 24, height: 24 }}
            />
          ) : (
            <Text style={styles.saveButtonText}>Save Changes</Text>
          )}
        </TouchableOpacity>
      </View>
      <CustomToast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        onHide={() => setToast({ ...toast, visible: false })}
      />
    </View>
  );
};

const GoalInput = ({ label, value, onChangeText, placeholder, icon }: any) => (
  <View style={styles.inputContainer}>
    <Text style={styles.label}>{label}</Text>
    <View style={styles.inputWrapper}>
      <Ionicons
        name={icon}
        size={22}
        color={Colors.primary.light}
        style={styles.inputIcon}
      />
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={Colors.text.tertiary}
        keyboardType="numeric"
      />
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.background.primary,
  },
  headerTextContainer: {
    alignItems: "center",
    paddingHorizontal: 24,
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 32,
    fontFamily: "BeVietnamPro-Bold",
    color: "#FFF",
    textAlign: "center",
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 16,
    fontFamily: "BeVietnamPro-Regular",
    color: "rgba(255,255,255,0.8)",
    textAlign: "center",
  },
  formContainer: {
    paddingHorizontal: 24,
    gap: 24,
  },
  inputContainer: {
    width: "100%",
  },
  label: {
    fontSize: 16,
    fontFamily: "BeVietnamPro-Medium",
    color: "rgba(255,255,255,0.9)",
    marginBottom: 12,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 16,
    height: 56,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: "BeVietnamPro-Regular",
    color: "#FFF",
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    paddingTop: 10,
    backgroundColor: "transparent",
  },
  saveButton: {
    backgroundColor: Colors.primary.main,
    borderRadius: 16,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonDisabled: {
    opacity: 0.8,
  },
  saveButtonText: {
    color: "#FFF",
    fontSize: 18,
    fontFamily: "BeVietnamPro-Medium",
  },
  customHeader: {
    position: "absolute",
    left: 10,
    right: 0,
    zIndex: 10,
    height: 60,
    justifyContent: "center",
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: 22,
  },
});

export default GoalsScreen;
