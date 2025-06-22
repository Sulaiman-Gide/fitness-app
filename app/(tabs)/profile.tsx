import { supabase } from "@/config/supabase";
import Colors from "@/constants/Colors";
import { logout } from "@/store/authSlice";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";

const ProfileScreen = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const user = useSelector((state: any) => state.auth.user);
  const profile = useSelector((state: any) => state.auth.profile);

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          try {
            await supabase.auth.signOut();
            dispatch(logout());
            router.replace("/onboarding");
          } catch (error) {
            console.error("Logout error:", error);
            Alert.alert("Error", "Failed to logout. Please try again.");
          }
        },
      },
    ]);
  };

  const ProfileItem = ({
    label,
    value,
  }: {
    label: string;
    value: string | number;
  }) => (
    <View style={styles.profileItem}>
      <Text style={styles.profileLabel}>{label}</Text>
      <Text style={styles.profileValue}>{value}</Text>
    </View>
  );

  console.log(user);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Ionicons name="person" size={40} color={Colors.text.primary} />
            </View>
            <Text style={styles.userName}>
              {user?.name || user?.email?.split("@")[0] || "User"}
            </Text>
            <Text style={styles.userEmail}>{user?.email}</Text>
          </View>

          <View style={styles.profileInfo}>
            <Text style={styles.sectionTitle}>Personal Information</Text>

            {profile ? (
              <>
                <ProfileItem label="Height" value={`${profile.height} cm`} />
                <ProfileItem label="Weight" value={`${profile.weight} kg`} />
                <ProfileItem label="Age" value={`${profile.age} years`} />
                <ProfileItem label="Gender" value={profile.gender} />
              </>
            ) : (
              <Text style={styles.noProfileText}>
                Profile information not available
              </Text>
            )}
          </View>

          <View style={styles.actionsSection}>
            <Text style={styles.sectionTitle}>Actions</Text>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => router.push("/edit-profile")}
            >
              <Ionicons
                name="person-outline"
                size={20}
                color={Colors.text.primary}
              />
              <Text style={styles.actionButtonText}>Edit Profile</Text>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={Colors.text.tertiary}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => router.push("/settings")}
            >
              <Ionicons
                name="settings-outline"
                size={20}
                color={Colors.text.primary}
              />
              <Text style={styles.actionButtonText}>Settings</Text>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={Colors.text.tertiary}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => router.push("/help")}
            >
              <Ionicons
                name="help-circle-outline"
                size={20}
                color={Colors.text.primary}
              />
              <Text style={styles.actionButtonText}>Help & Support</Text>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={Colors.text.tertiary}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => router.push("/privacy")}
            >
              <Ionicons
                name="document-text-outline"
                size={20}
                color={Colors.text.primary}
              />
              <Text style={styles.actionButtonText}>Privacy Policy</Text>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={Colors.text.tertiary}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => router.push("/terms")}
            >
              <Ionicons
                name="document-outline"
                size={20}
                color={Colors.text.primary}
              />
              <Text style={styles.actionButtonText}>Terms of Service</Text>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={Colors.text.tertiary}
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={20} color={Colors.error} />
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  scrollContainer: {
    padding: 20,
    paddingTop: 50,
    paddingBottom: 100,
  },
  profileSection: {
    flex: 1,
  },
  avatarContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.background.card,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  userName: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.text.primary,
    fontFamily: "BeVietnamPro-Bold",
  },
  userEmail: {
    fontSize: 14,
    color: Colors.text.secondary,
    fontFamily: "BeVietnamPro-Regular",
  },
  profileInfo: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.text.primary,
    marginBottom: 16,
    fontFamily: "BeVietnamPro-Bold",
  },
  profileItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
  },
  profileLabel: {
    fontSize: 16,
    color: Colors.text.secondary,
    fontFamily: "BeVietnamPro-Regular",
  },
  profileValue: {
    fontSize: 16,
    color: Colors.text.primary,
    fontFamily: "BeVietnamPro-Bold",
  },
  noProfileText: {
    fontSize: 16,
    color: Colors.text.tertiary,
    textAlign: "center",
    fontStyle: "italic",
    fontFamily: "BeVietnamPro-Regular",
  },
  actionsSection: {
    marginBottom: 30,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
  },
  actionButtonText: {
    flex: 1,
    fontSize: 16,
    color: Colors.text.primary,
    marginLeft: 12,
    fontFamily: "BeVietnamPro-Regular",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
  },
  logoutButtonText: {
    fontSize: 16,
    color: Colors.error,
    marginLeft: 8,
    fontWeight: "600",
    fontFamily: "BeVietnamPro-Bold",
  },
});

export default ProfileScreen;
