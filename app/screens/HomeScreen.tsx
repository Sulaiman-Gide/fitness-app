import { RootState } from "@/store";
import { logout } from "@/store/authSlice";
import { Button, Text, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";

export default function HomeScreen() {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Welcome, {user?.email}!</Text>
      <Button title="Logout" onPress={() => dispatch(logout())} />
    </View>
  );
}
