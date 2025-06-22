/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = "#2f95dc";
const tintColorDark = "#fff";

export default {
  light: {
    text: "#000",
    background: "#fff",
    tint: tintColorLight,
    tabIconDefault: "#ccc",
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: "#fff",
    background: "#0A0A0A",
    tint: tintColorDark,
    tabIconDefault: "#ccc",
    tabIconSelected: tintColorDark,
  },
  // Premium Dark Theme Colors
  primary: {
    main: "#6366F1", // Indigo
    light: "#818CF8",
    dark: "#4F46E5",
    gradient: ["#6366F1", "#8B5CF6"],
  },
  secondary: {
    main: "#10B981", // Emerald
    light: "#34D399",
    dark: "#059669",
    gradient: ["#10B981", "#06B6D4"],
  },
  accent: {
    main: "#F59E0B", // Amber
    light: "#FBBF24",
    dark: "#D97706",
    gradient: ["#F59E0B", "#EF4444"],
  },
  background: {
    primary: "#0A0A0A",
    secondary: "#111111",
    tertiary: "#1A1A1A",
    card: "#1F1F1F",
    surface: "#2A2A2A",
  },
  text: {
    primary: "#FFFFFF",
    secondary: "#E5E7EB",
    tertiary: "#9CA3AF",
    muted: "#6B7280",
  },
  border: {
    light: "#374151",
    medium: "#4B5563",
    dark: "#1F2937",
  },
  success: "#10B981",
  warning: "#F59E0B",
  error: "#EF4444",
  info: "#3B82F6",
};
