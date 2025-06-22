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

const LoginScreen = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
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
    if (!formData.email.trim()) {
      showToast("Please enter your email", "error");
      return false;
    }
    if (!formData.password) {
      showToast("Please enter your password", "error");
      return false;
    }
    return true;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        let errorMessage = "An error occurred during login";
        if (error.message.includes("Invalid login credentials")) {
          errorMessage = "Invalid email or password";
        } else if (error.message.includes("Email not confirmed")) {
          errorMessage = "Please verify your email before logging in.";
        } else if (error.message.includes("Too many requests")) {
          errorMessage = "Too many login attempts. Please try again later.";
        }
        showToast(errorMessage, "error");
        return;
      }

      if (data.user) {
        showToast("Login successful! Welcome back!", "success");
        dispatch(
          login({
            id: data.user.id,
            email: data.user.email!,
            name: data.user.user_metadata?.name,
          })
        );
        // AuthProvider will handle navigation
      }
    } catch (error: any) {
      console.error("Login error:", error);
      showToast("An unexpected error occurred", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    router.push("/forgot-password" as any);
  };

  const handleSignup = () => {
    router.push("/signup" as any);
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
              <Text style={styles.title}>Welcome Back</Text>
              <Text style={styles.subtitle}>
                Sign in to continue your fitness journey
              </Text>
            </View>

            <View style={styles.form}>
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
                placeholder="Enter your password"
                secureTextEntry={!showPassword}
                showPasswordToggle={true}
                onTogglePassword={() => setShowPassword(!showPassword)}
                icon="lock-closed-outline"
                autoComplete="password"
              />

              <TouchableOpacity
                style={styles.forgotPassword}
                onPress={handleForgotPassword}
              >
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.loginButton, loading && styles.buttonDisabled]}
                onPress={handleLogin}
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
                  <Text style={styles.loginButtonText}>Sign In</Text>
                )}
              </TouchableOpacity>

              <View style={styles.signupContainer}>
                <Text style={styles.signupText}>Don't have an account? </Text>
                <TouchableOpacity onPress={handleSignup}>
                  <Text style={styles.signupLink}>Sign Up</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;

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
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 24,
  },
  forgotPasswordText: {
    color: "#0277BD",
    fontSize: 14,
    fontFamily: "BeVietnamPro-Regular",
    fontWeight: "600",
  },
  loginButton: {
    backgroundColor: "#0277BD",
    borderRadius: 12,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  loginButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "BeVietnamPro-Medium",
  },
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 32,
  },
  signupText: {
    fontSize: 16,
    color: Colors.text.tertiary,
    fontFamily: "BeVietnamPro-Regular",
  },
  signupLink: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0277BD",
    fontFamily: "BeVietnamPro-Bold",
  },
});
