import { useFonts } from "expo-font";
import { Slot } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import { Provider } from "react-redux";
import store from "../store";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    "BeVietnamPro-Regular": require("../assets/fonts/BeVietnamPro-Regular.ttf"),
    "BeVietnamPro-Bold": require("../assets/fonts/BeVietnamPro-Bold.ttf"),
    "sofiaPro-Light": require("../assets/fonts/sofiapro-light.otf"),
    "sofiaPro-Bold": require("../assets/fonts/SofiaProBold.ttf"),
    "Laila-Medium": require("../assets/fonts/Laila-Medium.ttf"),
    "Laila-SemiBold": require("../assets/fonts/Laila-SemiBold.ttf"),
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Provider store={store}>
      <Slot />
    </Provider>
  );
}
