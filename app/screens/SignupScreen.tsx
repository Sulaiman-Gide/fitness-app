import CustomToast from "@/components/CustomToast";
import { supabase } from "@/config/supabase";
import Colors from "@/constants/Colors";
import { login } from "@/store/authSlice";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import LottieView from "lottie-react-native";
import React, { useCallback, useState } from "react";
import {
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
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
import { useDispatch } from "react-redux";

const { width, height } = Dimensions.get("window");

const SignupScreen = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({
    visible: false,
    message: "",
    type: "info" as "success" | "error" | "info",
  });

  const dispatch = useDispatch();
  const router = useRouter();

  // Animation values
  const fadeAnim = useSharedValue(0);
  const slideAnim = useSharedValue(30);
  const scaleAnim = useSharedValue(0.95);

  React.useEffect(() => {
    fadeAnim.value = withTiming(1, { duration: 800 });
    slideAnim.value = withSpring(0, { damping: 15, stiffness: 100 });
    scaleAnim.value = withSpring(1, { damping: 15, stiffness: 100 });
  }, []);

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

  const handleInputChange = useCallback((field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const validateForm = () => {
    if (!formData.name.trim()) {
      showToast("Please enter your full name", "error");
      return false;
    }
    if (!formData.email.trim()) {
      showToast("Please enter your email", "error");
      return false;
    }
    if (!formData.password) {
      showToast("Please enter your password", "error");
      return false;
    }
    if (formData.password.length < 6) {
      showToast("Password must be at least 6 characters", "error");
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      showToast("Passwords do not match", "error");
      return false;
    }
    return true;
  };

  const handleSignup = async () => {
    if (!validateForm()) return;

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            name: formData.name,
          },
          emailRedirectTo: "fittrackpro://auth/callback",
        },
      });

      if (error) {
        let errorMessage = "An error occurred during signup";
        if (error.message.includes("already registered")) {
          errorMessage = "An account with this email already exists";
        } else if (error.message.includes("Invalid email")) {
          errorMessage = "Please enter a valid email address";
        } else if (error.message.includes("Password should be at least")) {
          errorMessage = "Password must be at least 6 characters long";
        }
        showToast(errorMessage, "error");
        return;
      }

      if (data.user) {
        showToast(
          "Account created successfully! Please check your email to verify your account.",
          "success"
        );

        // Auto-login after successful signup
        setTimeout(async () => {
          try {
            const { data: loginData, error: loginError } =
              await supabase.auth.signInWithPassword({
                email: formData.email,
                password: formData.password,
              });

            if (loginError) {
              showToast("Please verify your email before logging in", "info");
              router.push("/login" as any);
            } else if (loginData.user) {
              dispatch(
                login({
                  id: loginData.user.id,
                  email: loginData.user.email!,
                  name: loginData.user.user_metadata?.name,
                })
              );
              // AuthProvider will handle navigation
            }
          } catch (error) {
            showToast("Please verify your email before logging in", "info");
            router.push("/login" as any);
          }
        }, 2000);
      }
    } catch (error: any) {
      console.error("Signup error:", error);
      showToast("An unexpected error occurred", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = () => {
    router.push("/login" as any);
  };

  const InputField = useCallback(
    ({
      label,
      value,
      onChangeText,
      placeholder,
      secureTextEntry = false,
      showPasswordToggle = false,
      onTogglePassword,
      icon,
      keyboardType = "default",
      autoComplete,
    }: any) => (
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>{label}</Text>
        <View style={styles.inputWrapper}>
          {icon && (
            <Ionicons
              name={icon}
              size={20}
              color={Colors.text.tertiary}
              style={styles.inputIcon}
            />
          )}
          <TextInput
            style={[styles.input, icon && styles.inputWithIcon]}
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor={Colors.text.muted}
            secureTextEntry={secureTextEntry}
            autoCapitalize="none"
            keyboardType={keyboardType}
            autoComplete={autoComplete}
            autoCorrect={false}
            spellCheck={false}
          />
          {showPasswordToggle && (
            <TouchableOpacity
              onPress={onTogglePassword}
              style={styles.passwordToggle}
            >
              <Ionicons
                name={secureTextEntry ? "eye-off" : "eye"}
                size={20}
                color={Colors.text.tertiary}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
    ),
    []
  );

  return (
    <SafeAreaView style={styles.container}>
      <CustomToast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        onHide={hideToast}
      />

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Animated.View style={[styles.content, animatedStyle]}>
            <View style={styles.header}>
              <Text style={styles.title}>Create Account</Text>
              <Text style={styles.subtitle}>
                Join us and start your fitness journey today
              </Text>
            </View>

            <View style={styles.form}>
              <InputField
                label="Full Name"
                value={formData.name}
                onChangeText={(value: string) =>
                  handleInputChange("name", value)
                }
                placeholder="Enter your full name"
                icon="person-outline"
                autoComplete="name"
              />

              <InputField
                label="Email"
                value={formData.email}
                onChangeText={(value: string) =>
                  handleInputChange("email", value)
                }
                placeholder="Enter your email"
                icon="mail-outline"
                keyboardType="email-address"
                autoComplete="email"
              />

              <InputField
                label="Password"
                value={formData.password}
                onChangeText={(value: string) =>
                  handleInputChange("password", value)
                }
                placeholder="Create a password"
                secureTextEntry={!showPassword}
                showPasswordToggle={true}
                onTogglePassword={() => setShowPassword(!showPassword)}
                icon="lock-closed-outline"
                autoComplete="new-password"
              />

              <InputField
                label="Confirm Password"
                value={formData.confirmPassword}
                onChangeText={(value: string) =>
                  handleInputChange("confirmPassword", value)
                }
                placeholder="Confirm your password"
                secureTextEntry={!showConfirmPassword}
                showPasswordToggle={true}
                onTogglePassword={() =>
                  setShowConfirmPassword(!showConfirmPassword)
                }
                icon="lock-closed-outline"
                autoComplete="new-password"
              />

              <TouchableOpacity
                style={[styles.signupButton, loading && styles.buttonDisabled]}
                onPress={handleSignup}
                disabled={loading}
              >
                {loading ? (
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
                  <Text style={styles.signupButtonText}>Create Account</Text>
                )}
              </TouchableOpacity>

              <View style={styles.loginContainer}>
                <Text style={styles.loginText}>Already have an account? </Text>
                <TouchableOpacity onPress={handleLogin}>
                  <Text style={styles.loginLink}>Sign In</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  content: {
    paddingVertical: 40,
  },
  header: {
    marginBottom: 40,
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: Colors.text.primary,
    marginBottom: 8,
    fontFamily: "BeVietnamPro-Bold",
  },
  subtitle: {
    fontSize: 16,
    color: Colors.text.tertiary,
    fontFamily: "BeVietnamPro-Regular",
    lineHeight: 24,
    textAlign: "center",
  },
  form: {
    marginBottom: 32,
  },
  inputContainer: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text.primary,
    marginBottom: 10,
    fontFamily: "BeVietnamPro-Regular",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.background.card,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#E1E5E9",
    paddingHorizontal: 10,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: 48,
    fontSize: 16,
    color: Colors.text.primary,
    fontFamily: "BeVietnamPro-Regular",
  },
  inputWithIcon: {
    marginLeft: 0,
  },
  passwordToggle: {
    padding: 8,
  },
  signupButton: {
    backgroundColor: "#0277BD",
    borderRadius: 12,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  signupButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "BeVietnamPro-Medium",
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 32,
  },
  loginText: {
    fontSize: 16,
    color: Colors.text.tertiary,
    fontFamily: "BeVietnamPro-Regular",
  },
  loginLink: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0277BD",
    fontFamily: "BeVietnamPro-Bold",
  },
});

export default SignupScreen;
