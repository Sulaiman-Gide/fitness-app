import { useToast } from "@/components/ToastProvider";
import { supabase } from "@/config/supabase";
import Colors from "@/constants/Colors";
import { setProfile as setReduxProfile, setUser } from "@/store/authSlice";
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
import { useDispatch, useSelector } from "react-redux";

const EditProfileScreen = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();
  const { showToast } = useToast();
  const user = useSelector((state: any) => state.auth.user);
  const profile = useSelector((state: any) => state.auth.profile);

  const [name, setName] = useState(user?.name || "");
  const [height, setHeight] = useState(profile?.height?.toString() || "");
  const [weight, setWeight] = useState(profile?.weight?.toString() || "");
  const [age, setAge] = useState(profile?.age?.toString() || "");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (saving) return;
    setSaving(true);

    try {
      // Update user name in auth
      const {
        data: { user: updatedUser },
        error: userError,
      } = await supabase.auth.updateUser({
        data: { name },
      });
      if (userError) throw userError;

      // Update Redux user state with new name
      if (updatedUser) {
        dispatch(
          setUser({
            id: updatedUser.id,
            email: updatedUser.email!,
            name: name,
          })
        );
      }

      // Update profile
      const { data: updatedProfile, error: profileError } = await supabase
        .from("profiles")
        .update({
          name: name,
          height: parseInt(height, 10),
          weight: parseInt(weight, 10),
          age: parseInt(age, 10),
        })
        .eq("id", user.id)
        .select()
        .single();
      if (profileError) throw profileError;

      dispatch(setReduxProfile(updatedProfile));
      showToast({ type: "success", message: "Profile updated successfully" });
      router.back();
    } catch (error: any) {
      console.error("Error updating profile:", error);
      showToast({ type: "error", message: error.message });
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ title: "Edit Profile", headerShown: true }} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Your Name"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Height (cm)</Text>
          <TextInput
            style={styles.input}
            value={height}
            onChangeText={setHeight}
            placeholder="e.g., 180"
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Weight (kg)</Text>
          <TextInput
            style={styles.input}
            value={weight}
            onChangeText={setWeight}
            placeholder="e.g., 75"
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Age</Text>
          <TextInput
            style={styles.input}
            value={age}
            onChangeText={setAge}
            placeholder="e.g., 25"
            keyboardType="numeric"
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

export default EditProfileScreen;
