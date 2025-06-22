import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const SettingsScreen = () => {
  const router = useRouter();
  const [notifications, setNotifications] = useState(true);
  const [dataSync, setDataSync] = useState(false);

  const SettingRow = ({
    label,
    value,
    onValueChange,
    onPress,
    children,
    isDestructive = false,
  }: {
    label: string;
    value?: boolean;
    onValueChange?: (value: boolean) => void;
    onPress?: () => void;
    children?: React.ReactNode;
    isDestructive?: boolean;
  }) => (
    <TouchableOpacity
      style={styles.settingRow}
      onPress={onPress || (() => onValueChange && onValueChange(!value))}
      disabled={!onPress && !onValueChange}
    >
      <Text style={[styles.settingLabel, isDestructive && styles.destructive]}>
        {label}
      </Text>
      {children || (
        <Switch
          value={value}
          onValueChange={onValueChange}
          trackColor={{ false: "#767577", true: Colors.primary.main }}
          thumbColor={value ? Colors.primary.light : "#f4f3f4"}
        />
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <Stack.Screen
        options={{
          title: "Settings",
          headerBackTitle: "Profile",
          headerShown: true,
        }}
      />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Settings</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>General</Text>
          <SettingRow
            label="Enable Notifications"
            value={notifications}
            onValueChange={setNotifications}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data</Text>
          <SettingRow
            label="Sync Data Automatically"
            value={dataSync}
            onValueChange={setDataSync}
          />
          <SettingRow label="Export Data">
            <Ionicons
              name="download-outline"
              size={24}
              color={Colors.text.secondary}
            />
          </SettingRow>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <SettingRow
            label="Edit Profile"
            onPress={() => router.push("/edit-profile")}
          >
            <Ionicons
              name="chevron-forward"
              size={24}
              color={Colors.text.secondary}
            />
          </SettingRow>
          <SettingRow
            label="Change Password"
            onPress={() => router.push("/change-password")}
          >
            <Ionicons
              name="chevron-forward"
              size={24}
              color={Colors.text.secondary}
            />
          </SettingRow>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background.primary },
  content: { padding: 20 },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: Colors.text.primary,
    marginBottom: 20,
    fontFamily: "BeVietnamPro-Bold",
  },
  section: {
    marginBottom: 20,
    backgroundColor: Colors.background.card,
    borderRadius: 12,
    padding: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.text.primary,
    marginBottom: 15,
    fontFamily: "BeVietnamPro-Bold",
    paddingHorizontal: 5,
  },
  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
  },
  settingLabel: {
    fontSize: 16,
    color: Colors.text.primary,
    fontFamily: "BeVietnamPro-Regular",
  },
  destructive: {
    color: Colors.error,
  },
});

export default SettingsScreen;
