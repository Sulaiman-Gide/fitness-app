import { supabase } from "@/config/supabase";
import { setProfile } from "@/store/authSlice";
import Constants from 'expo-constants';
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { useEffect, useRef } from "react";
import { Alert, Platform } from "react-native";
import { useDispatch, useSelector } from "react-redux";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

async function registerForPushNotificationsAsync(): Promise<
  string | undefined
> {
  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  if (!Device.isDevice) {
    Alert.alert("Must use physical device for Push Notifications");
    return;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== "granted") {
    Alert.alert("Failed to get push token for push notification!");
    return;
  }

  // Get the real Expo project ID
  const projectId =
        Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;

  if (!projectId) {
    Alert.alert("Project ID not found");
    return;
  }

  try {
    // Get real Expo push token
    const pushTokenString = (
      await Notifications.getExpoPushTokenAsync({ 
        projectId: projectId
      })
    ).data;
    
    console.log("Real Expo push token generated:", pushTokenString);
    return pushTokenString;
  } catch (e) {
    console.log("Error getting real push token:", e);
    Alert.alert("Failed to get push token");
  }
}

export const usePushNotifications = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.auth.user);
  const profile = useSelector((state: any) => state.auth.profile);
  const notificationListener = useRef<Notifications.Subscription | null>(null);
  const responseListener = useRef<Notifications.Subscription | null>(null);

  useEffect(() => {
    if (!user || !profile || profile.push_token) {
      return;
    }

    registerForPushNotificationsAsync()
      .then((token) => {
        if (token) {
          updateProfileWithToken(token);
        }
      })
      .catch((error: any) => console.error(error));

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        console.log("Notification received:", notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log("Notification response received:", response);
      });

    return () => {
      if (notificationListener.current) {
        notificationListener.current.remove();
      }
      if (responseListener.current) {
        responseListener.current.remove();
      }
    };
  }, [user, profile]);

  const updateProfileWithToken = async (token: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .update({ push_token: token })
        .eq("id", user.id)
        .select()
        .single();

      if (error) throw error;
      dispatch(setProfile(data));
      console.log("Real push token saved successfully");
    } catch (error) {
      console.error("Error saving push token:", error);
    }
  };
};

// Working notification function using local notifications
export async function sendLocalNotification(title: string, body: string, data?: any) {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: title,
        body: body,
        data: data || {},
        sound: true,
      },
      trigger: null, // Send immediately
    });
    
    console.log("Local notification sent successfully");
    return { success: true };
  } catch (error) {
    console.error("Error sending local notification:", error);
    throw error;
  }
}

// Function to send notification via our Supabase backend
export async function sendNotificationViaSupabase(userId: string, title: string, body: string, data?: any) {
  try {
    const { data: result, error } = await supabase.functions.invoke('send-notification', {
      body: {
        user_id: userId,
        title: title,
        body: body,
        data: data || {},
      },
    });

    if (error) throw error;
    console.log("Supabase notification result:", result);
    return result;
  } catch (error) {
    console.error("Error sending Supabase notification:", error);
    throw error;
  }
}
