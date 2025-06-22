import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef } from "react";
import { Animated, Platform, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface ToastProps {
  visible: boolean;
  message: string;
  type: "success" | "error" | "info";
  onHide: () => void;
  duration?: number;
}

const CustomToast: React.FC<ToastProps> = ({
  visible,
  message,
  type,
  onHide,
  duration = 4000,
}) => {
  const translateY = useRef(new Animated.Value(-200)).current;
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (visible) {
      Animated.spring(translateY, {
        toValue: insets.top > 0 ? insets.top : 20, // Handle non-notch devices
        useNativeDriver: true,
        tension: 120,
        friction: 14,
      }).start();

      const timer = setTimeout(() => {
        hideToast();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [visible, duration, insets.top]);

  const hideToast = () => {
    Animated.timing(translateY, {
      toValue: -200,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      onHide();
    });
  };

  const getToastConfig = () => {
    switch (type) {
      case "success":
        return {
          icon: "checkmark-circle" as const,
          color: "#2E7D32",
        };
      case "error":
        return {
          icon: "alert-circle" as const,
          color: "#C62828",
        };
      default:
        return {
          icon: "information-circle" as const,
          color: "#0277BD",
        };
    }
  };

  const config = getToastConfig();

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateY }],
        },
      ]}
    >
      <View style={[styles.toastBody, { borderLeftColor: config.color }]}>
        <Ionicons
          name={config.icon}
          size={24}
          color={config.color}
          style={styles.icon}
        />
        <Text style={styles.message}>{message}</Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 20,
    right: 20,
    zIndex: 1000,
  },
  toastBody: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderLeftWidth: 5,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  icon: {
    marginRight: 12,
  },
  message: {
    flex: 1,
    color: Colors.text.muted,
    fontSize: 15,
    fontFamily: "BeVietnamPro-Regular",
    lineHeight: 20,
  },
  closeButton: {
    marginLeft: 12,
    padding: 6,
  },
});

export default CustomToast;
