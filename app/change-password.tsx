import { useToast } from "@/components/ToastProvider";
import { supabase } from "@/config/supabase";
import Colors from "@/constants/Colors";
import { Stack, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const ChangePasswordScreen = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { showToast } = useToast();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (saving) return;
    if (newPassword !== confirmPassword) {
      showToast({ type: "error", message: "Passwords do not match" });
      return;
    }
    if (newPassword.length < 6) {
      showToast({
        type: "error",
        message: "Password must be at least 6 characters",
      });
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      if (error) throw error;
      showToast({ type: "success", message: "Password updated successfully" });
      router.back();
    } catch (error: any) {
      console.error("Error updating password:", error);
      showToast({ type: "error", message: error.message });
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ title: "Change Password", headerShown: true }} />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Change Password</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>New Password</Text>
          <TextInput
            style={styles.input}
            value={newPassword}
            onChangeText={setNewPassword}
            placeholder="New password"
            secureTextEntry
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Confirm New Password</Text>
          <TextInput
            style={styles.input}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Confirm new password"
            secureTextEntry
          />
        </View>
      </ScrollView>
      <View style={[styles.footer, { paddingBottom: insets.bottom + 10 }]}>
        <TouchableOpacity
          style={[styles.saveButton, saving && styles.buttonDisabled]}
          onPress={handleSave}
          disabled={saving}
        >
          {saving ? (
            <Text>Saving...</Text>
          ) : (
            <Text style={styles.saveButtonText}>Save Changes</Text>
          )}
        </TouchableOpacity>
      </View>
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
    marginBottom: 30,
    fontFamily: "BeVietnamPro-Bold",
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: Colors.text.secondary,
    marginBottom: 8,
    fontFamily: "BeVietnamPro-Regular",
  },
  input: {
    backgroundColor: Colors.background.card,
    padding: 15,
    borderRadius: 10,
    fontSize: 16,
    color: Colors.text.primary,
    fontFamily: "BeVietnamPro-Regular",
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: Colors.border.light,
  },
  saveButton: {
    backgroundColor: Colors.primary.main,
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonDisabled: {
    backgroundColor: Colors.primary.dark,
  },
  saveButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "BeVietnamPro-Bold",
  },
});

export default ChangePasswordScreen;
