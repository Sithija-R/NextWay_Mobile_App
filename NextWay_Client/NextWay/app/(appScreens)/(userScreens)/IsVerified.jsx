import React from "react";
import { Button, Text, View } from "react-native";
import { logoutUser } from "../../../services/authService";

export default function IsVerified() {
  const handleLogout = async () => {
    await logoutUser();
  };
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
      }}
    >
      <Text>Please Verify Your Email!</Text>
      <Button title="logout" onPress={handleLogout} />
    </View>
  );
}
7;
