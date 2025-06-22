import Colors from "@/constants/Colors";
import React from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// Import SVG icons
import HomeFilled from "@/assets/images/home-filled.svg";
import HomeOutline from "@/assets/images/home-outline.svg";
import ProfileFilled from "@/assets/images/profile-filled.svg";
import ProfileOutline from "@/assets/images/profile-outline.svg";
import ProgressFilled from "@/assets/images/progress-filled.svg";
import ProgressOutline from "@/assets/images/progress-outline.svg";
import WorkoutsFilled from "@/assets/images/workouts-filled.svg";
import WorkoutsOutline from "@/assets/images/workouts-outline.svg";

const TAB_ICONS: Record<
  string,
  { focused: React.FC<any>; unfocused: React.FC<any> }
> = {
  index: {
    focused: HomeFilled,
    unfocused: HomeOutline,
  },
  workouts: {
    focused: WorkoutsFilled,
    unfocused: WorkoutsOutline,
  },
  progress: {
    focused: ProgressFilled,
    unfocused: ProgressOutline,
  },
  profile: {
    focused: ProfileFilled,
    unfocused: ProfileOutline,
  },
};

const TAB_LABELS: Record<string, string> = {
  index: "Home",
  workouts: "Workouts",
  progress: "Progress",
  profile: "Profile",
};

export function CustomTabBar({ state, descriptors, navigation }: any) {
  return (
    <View style={styles.container}>
      {state.routes.map((route: any, index: number) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const iconSet = TAB_ICONS[route.name];
        const IconComponent = isFocused ? iconSet?.focused : iconSet?.unfocused;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            style={styles.tabButton}
          >
            <IconComponent width={26} height={26} />
            <Text
              style={[
                styles.label,
                {
                  color: isFocused ? Colors.primary.main : Colors.text.tertiary,
                },
                {
                  fontFamily: isFocused
                    ? "BeVietnamPro-Bold"
                    : "BeVietnamPro-Regular",
                },
              ]}
            >
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: Platform.OS === "ios" ? 90 : 70,
    paddingBottom: Platform.OS === "ios" ? 30 : 10,
    paddingTop: 20,
    backgroundColor: Colors.background.card,
    borderTopWidth: 1,
    borderTopColor: Colors.background.secondary,
    alignItems: "flex-start",
    justifyContent: "space-around",
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  label: {
    fontSize: 10,
  },
});
