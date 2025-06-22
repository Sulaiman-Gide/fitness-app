import CustomToast from "@/components/CustomToast";
import { supabase } from "@/config/supabase";
import Colors from "@/constants/Colors";
import { setProfile } from "@/store/authSlice";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import LottieView from "lottie-react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TextInput,
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
import { useDispatch, useSelector } from "react-redux";

const { width, height } = Dimensions.get("window");

const DetailsScreen = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState({
    visible: false,
    message: "",
    type: "info" as "success" | "error" | "info",
  });
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.auth.user);

  // Refs for input fields
  const heightRef = useRef<TextInput>(null);
  const weightRef = useRef<TextInput>(null);
  const ageRef = useRef<TextInput>(null);

  // Animation values
  const fadeAnim = useSharedValue(0);
  const slideAnim = useSharedValue(50);
  const scaleAnim = useSharedValue(0.95);

  // Input validation functions
  const validateNumericInput = (text: string) => {
    // Only allow numbers
    return text.replace(/[^0-9]/g, "");
  };

  const handleHeightChange = (text: string) => {
    const numericText = validateNumericInput(text);
    setHeight(numericText);
  };

  const handleWeightChange = (text: string) => {
    const numericText = validateNumericInput(text);
    setWeight(numericText);
  };

  const handleAgeChange = (text: string) => {
    const numericText = validateNumericInput(text);
    setAge(numericText);
  };

  const focusNextField = (nextRef: React.RefObject<TextInput | null>) => {
    nextRef.current?.focus();
  };

  useEffect(() => {
    if (!user) {
      router.replace("/onboarding");
    }
  }, [user, router]);

  useEffect(() => {
    fadeAnim.value = withTiming(1, { duration: 800 });
    slideAnim.value = withSpring(0, { damping: 15, stiffness: 100 });
    scaleAnim.value = withSpring(1, { damping: 15, stiffness: 100 });
  }, [currentStep]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: fadeAnim.value,
    transform: [{ translateY: slideAnim.value }, { scale: scaleAnim.value }],
  }));

  const showToast = (message: string, type: "success" | "error" | "info") => {
    setToast({ visible: true, message, type });
  };

  const hideToast = () => {
    setToast((prev) => ({ ...prev, visible: false }));
  };

  const handleGetStarted = () => {
    setCurrentStep(1);
  };

  const handleSave = async () => {
    if (!height.trim() || !weight.trim() || !age.trim() || !gender.trim()) {
      showToast("Please fill in all fields", "error");
      return;
    }

    if (!user) {
      showToast("User not found", "error");
      return;
    }

    // Validate input values
    const heightNum = parseFloat(height);
    const weightNum = parseFloat(weight);
    const ageNum = parseInt(age);

    if (isNaN(heightNum) || heightNum <= 0 || heightNum > 300) {
      showToast("Please enter a valid height (1-300 cm)", "error");
      return;
    }

    if (isNaN(weightNum) || weightNum <= 0 || weightNum > 500) {
      showToast("Please enter a valid weight (1-500 kg)", "error");
      return;
    }

    if (isNaN(ageNum) || ageNum <= 0 || ageNum > 120) {
      showToast("Please enter a valid age (1-120)", "error");
      return;
    }

    setIsLoading(true);

    try {
      const profileData = {
        id: user.id,
        height: heightNum,
        weight: weightNum,
        age: ageNum,
        gender: gender.toLowerCase(),
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase.from("profiles").upsert(profileData);

      if (error) {
        console.log(error);
        showToast(error.message, "error");
      } else {
        dispatch(
          setProfile({
            height: heightNum,
            weight: weightNum,
            age: ageNum,
            gender: gender.toLowerCase(),
          })
        );

        showToast("Profile details saved successfully!", "success");

        setTimeout(() => {
          router.replace("/(tabs)");
        }, 1500);
      }
    } catch (error) {
      showToast("An unexpected error occurred", "error");
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  const WelcomeStep = () => (
    <Animated.View style={[styles.welcomeContainer, animatedStyle]}>
      <View style={styles.welcomeHeader}>
        <LinearGradient
          colors={[Colors.primary.main, Colors.primary.dark]}
          style={styles.welcomeIcon}
        >
          <Ionicons name="fitness" size={40} color="white" />
        </LinearGradient>
        <Text style={styles.welcomeTitle}>Welcome to Let's Run!</Text>
        <Text style={styles.welcomeSubtitle}>
          Your personal fitness companion
        </Text>
      </View>

      <View style={styles.featuresContainer}>
        <View style={styles.featureItem}>
          <View style={styles.featureIcon}>
            <Ionicons
              name="trending-up"
              size={24}
              color={Colors.primary.main}
            />
          </View>
          <View style={styles.featureContent}>
            <Text style={styles.featureTitle}>Track Your Progress</Text>
            <Text style={styles.featureDescription}>
              Monitor your fitness journey with detailed analytics and insights
            </Text>
          </View>
        </View>

        <View style={styles.featureItem}>
          <View style={styles.featureIcon}>
            <Ionicons name="fitness" size={24} color={Colors.primary.main} />
          </View>
          <View style={styles.featureContent}>
            <Text style={styles.featureTitle}>Personalized Workouts</Text>
            <Text style={styles.featureDescription}>
              Get custom workout plans tailored to your goals and fitness level
            </Text>
          </View>
        </View>

        <View style={styles.featureItem}>
          <View style={styles.featureIcon}>
            <Ionicons name="trophy" size={24} color={Colors.primary.main} />
          </View>
          <View style={styles.featureContent}>
            <Text style={styles.featureTitle}>Achieve Your Goals</Text>
            <Text style={styles.featureDescription}>
              Set targets and celebrate milestones on your fitness journey
            </Text>
          </View>
        </View>
      </View>

      <TouchableOpacity
        style={styles.getStartedButton}
        onPress={handleGetStarted}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={[Colors.primary.main, Colors.primary.dark]}
          style={styles.buttonGradient}
        >
          <Text style={styles.getStartedText}>Get Started</Text>
          <Ionicons name="arrow-forward" size={20} color="white" />
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );

  const FormStep = () => (
    <View style={styles.formContainer}>
      <View style={styles.formHeader}>
        <Text style={styles.formTitle}>Complete Your Profile</Text>
        <Text style={styles.formSubtitle}>
          Help us personalize your fitness experience
        </Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Height (cm)</Text>
          <View style={styles.inputWrapper} pointerEvents="box-none">
            <Ionicons
              name="resize"
              size={20}
              color={Colors.text.tertiary}
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Enter your height"
              placeholderTextColor={Colors.text.tertiary}
              value={height}
              onChangeText={handleHeightChange}
              keyboardType="numeric"
              maxLength={3}
              autoCorrect={false}
              autoCapitalize="none"
              returnKeyType="next"
              ref={heightRef}
              onSubmitEditing={() => focusNextField(weightRef)}
              blurOnSubmit={false}
              contextMenuHidden={true}
            />
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Weight (kg)</Text>
          <View style={styles.inputWrapper} pointerEvents="box-none">
            <Ionicons
              name="scale"
              size={20}
              color={Colors.text.tertiary}
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Enter your weight"
              placeholderTextColor={Colors.text.tertiary}
              value={weight}
              onChangeText={handleWeightChange}
              keyboardType="numeric"
              maxLength={3}
              autoCorrect={false}
              autoCapitalize="none"
              returnKeyType="next"
              ref={weightRef}
              onSubmitEditing={() => focusNextField(ageRef)}
              blurOnSubmit={false}
              contextMenuHidden={true}
            />
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Age</Text>
          <View style={styles.inputWrapper} pointerEvents="box-none">
            <Ionicons
              name="calendar"
              size={20}
              color={Colors.text.tertiary}
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Enter your age"
              placeholderTextColor={Colors.text.tertiary}
              value={age}
              onChangeText={handleAgeChange}
              keyboardType="numeric"
              maxLength={3}
              autoCorrect={false}
              autoCapitalize="none"
              returnKeyType="done"
              ref={ageRef}
              blurOnSubmit={true}
              contextMenuHidden={true}
            />
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Gender</Text>
          <View style={styles.genderContainer}>
            <TouchableOpacity
              style={[
                styles.genderButton,
                gender.toLowerCase() === "male" && styles.genderButtonActive,
              ]}
              onPress={() => setGender("Male")}
            >
              <Ionicons
                name="male"
                size={20}
                color={
                  gender.toLowerCase() === "male"
                    ? "white"
                    : Colors.text.tertiary
                }
              />
              <Text
                style={[
                  styles.genderButtonText,
                  gender.toLowerCase() === "male" &&
                    styles.genderButtonTextActive,
                ]}
              >
                Male
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.genderButton,
                gender.toLowerCase() === "female" && styles.genderButtonActive,
              ]}
              onPress={() => setGender("Female")}
            >
              <Ionicons
                name="female"
                size={20}
                color={
                  gender.toLowerCase() === "female"
                    ? "white"
                    : Colors.text.tertiary
                }
              />
              <Text
                style={[
                  styles.genderButtonText,
                  gender.toLowerCase() === "female" &&
                    styles.genderButtonTextActive,
                ]}
              >
                Female
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.saveButton, isLoading && styles.buttonDisabled]}
          onPress={handleSave}
          disabled={isLoading}
        >
          <LinearGradient
            colors={[Colors.primary.main, Colors.primary.dark]}
            style={styles.buttonGradient}
          >
            {isLoading ? (
              <LottieView
                source={require("../../assets/Lottie/appLoadingWhite.json")}
                autoPlay
                loop
                style={{
                  width: 20,
                  height: 20,
                }}
              />
            ) : (
              <Text style={styles.saveButtonText}>Save & Continue</Text>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.scrollContainer}>
        {currentStep === 0 ? <WelcomeStep /> : <FormStep />}
      </View>
      <CustomToast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        onHide={hideToast}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
  },
  welcomeContainer: {
    flex: 1,
    justifyContent: "center",
    paddingVertical: 40,
  },
  welcomeHeader: {
    alignItems: "center",
    marginBottom: 60,
  },
  welcomeIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  welcomeTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: Colors.text.primary,
    marginBottom: 12,
    fontFamily: "BeVietnamPro-Bold",
    textAlign: "center",
  },
  welcomeSubtitle: {
    fontSize: 18,
    color: Colors.text.secondary,
    fontFamily: "BeVietnamPro-Regular",
    textAlign: "center",
    lineHeight: 26,
  },
  featuresContainer: {
    marginBottom: 60,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 32,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.background.card,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.text.primary,
    marginBottom: 8,
    fontFamily: "BeVietnamPro-Bold",
  },
  featureDescription: {
    fontSize: 16,
    color: Colors.text.secondary,
    lineHeight: 24,
    fontFamily: "BeVietnamPro-Regular",
  },
  getStartedButton: {
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: Colors.primary.main,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  buttonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 18,
    paddingHorizontal: 32,
  },
  getStartedText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
    fontFamily: "BeVietnamPro-Medium",
    marginRight: 8,
  },
  formContainer: {
    flex: 1,
    paddingVertical: 40,
  },
  formHeader: {
    marginBottom: 40,
    alignItems: "center",
  },
  formTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: Colors.text.primary,
    marginBottom: 12,
    fontFamily: "BeVietnamPro-Bold",
    textAlign: "center",
  },
  formSubtitle: {
    fontSize: 16,
    color: Colors.text.secondary,
    textAlign: "center",
    fontFamily: "BeVietnamPro-Regular",
    lineHeight: 24,
  },
  form: {
    flex: 1,
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text.primary,
    marginBottom: 12,
    fontFamily: "BeVietnamPro-Bold",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.background.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border.light,
    paddingHorizontal: 16,
    paddingVertical: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: Colors.text.primary,
    fontFamily: "BeVietnamPro-Regular",
  },
  genderContainer: {
    flexDirection: "row",
    gap: 12,
  },
  genderButton: {
    flex: 1,
    backgroundColor: Colors.background.card,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.border.light,
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  genderButtonActive: {
    backgroundColor: Colors.primary.main,
    borderColor: Colors.primary.main,
  },
  genderButtonText: {
    fontSize: 16,
    color: Colors.text.primary,
    fontFamily: "BeVietnamPro-Regular",
  },
  genderButtonTextActive: {
    color: "white",
    fontFamily: "BeVietnamPro-Bold",
  },
  saveButton: {
    borderRadius: 16,
    overflow: "hidden",
    marginTop: 32,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
    fontFamily: "BeVietnamPro-Medium",
  },
});

export default DetailsScreen;
