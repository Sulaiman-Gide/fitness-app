import { signup } from "@/store/authSlice";
import { useState } from "react";
import { Button, Text, TextInput, View } from "react-native";
import { useDispatch } from "react-redux";

export default function SignupScreen() {
  const [email, setEmail] = useState("");
  const dispatch = useDispatch();

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 16 }}>
      <Text>Email:</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        style={{ borderWidth: 1, marginBottom: 12, padding: 8 }}
      />
      <Button
        title="Sign Up"
        onPress={() => {
          dispatch(signup({ email }));
        }}
      />
    </View>
  );
}
