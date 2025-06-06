import { View, Text, Image, TextInput, TouchableOpacity, Pressable, Alert } from "react-native";
import React, { useRef, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { useRouter } from "expo-router";
import Loading from "../components/Loading/Loading";
import CustomKeyboardView from "../components/keyboardView/CustomKeyboardView";
import { loginUser, sendPwResetEmail } from "../services/authService";

// SignIn Component
export default function SignIn() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // References for email and password input fields
  const emailRef = useRef("");
  const passwordRef = useRef("");

  // Handle user login
  const handleLogin = async () => {
    const email = emailRef.current.trim();
    const password = passwordRef.current;

    // Validation checks
    if (!email || !password) {
      Alert.alert('Sign In', "All fields are required!");
      return;
    }
    setLoading(true);
    const response = await loginUser(email, password);
    setLoading(false);

    // Show error or success message
    if (!response.success) {
      Alert.alert('Sign In', response.msg);
    }
  };

  const changePassword = async () => {
    const email = emailRef.current.trim();

    if (!email) {
      Alert.alert('Change Password', "Email is required!");
      return;
    }
    setLoading(true);
    const response = await sendPwResetEmail(email);
    setLoading(false);
   
    // Show appropriate message after attempting to send password reset
    if (!response.success) {
      Alert.alert('Change Password', response.msg);
    } else {
      Alert.alert('Change Password', "Password reset email sent successfully!");
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <CustomKeyboardView>
        <StatusBar style="dark" />
        <View style={{ flex: 1, alignItems: "flex-start" }}>
          <Image
            style={{
              width: hp(27),
              height: hp(20),
            }}
            resizeMode="stretch"
            source={require("../assets/images/elipses.png")}
          />
        </View>

        <View style={{ alignItems: "center", flex: 4 }}>
          <Image
            style={{ height: hp(25) }}
            resizeMode="contain"
            source={require("../assets/images/Logo.png")}
          />
          <View
            style={{
              width: "100%",
              paddingHorizontal: wp(7),
              paddingVertical: hp(1),
            }}
          >
            <Text style={{ fontSize: hp(3), fontWeight: "600" }}>Sign in</Text>
            <Text style={{ fontSize: hp(2) }}>Log in to your account</Text>
            <View
              style={{ marginTop: hp(2), paddingVertical: hp(2), gap: hp(2) }}
            >
              <TextInput
                onChangeText={value => emailRef.current = value}
                style={{
                  fontSize: hp(2),
                  backgroundColor: "#D9D9D9",
                  paddingHorizontal: wp(3),
                  paddingVertical: hp(2),
                  borderRadius: 20,
                }}
                placeholder="Email"
                autoCapitalize="none"
                keyboardType="email-address"
              />
              <TextInput
                onChangeText={value => passwordRef.current = value}
                style={{
                  fontSize: hp(2),
                  backgroundColor: "#D9D9D9",
                  paddingHorizontal: wp(3),
                  paddingVertical: hp(2),
                  borderRadius: 20,
                }}
                placeholder="Password"
                secureTextEntry
              />
              <Text style={{ fontSize: hp(2), textAlign: "right" }} onPress={changePassword}>
                Forgot password?
              </Text>
            </View>

            <View>
              {loading ? (
                <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                  <Loading size={hp(10)} />
                </View>
              ) : (
                <TouchableOpacity
                  onPress={handleLogin}
                  style={{
                    backgroundColor: "#149BC6", padding: hp(2), borderRadius: 40,
                  }}
                >
                  <Text style={{ fontSize: hp(3), fontWeight: "600", textAlign: "center", color: "white", }}
                  >
                    Sign In
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                marginTop: hp(1),
              }}
            >
              <Text style={{ fontSize: hp(2) }}>Don't have an account?</Text>
              <Pressable onPress={() => router.push("signUp")}>
                <Text style={{ fontWeight: "bold", fontSize: hp(2) }}>
                  {" "}
                  Sign Up
                </Text>
              </Pressable>
            </View>
          </View>
        </View>

        <View style={{ alignItems: "flex-end", zIndex: -1 }}>
          <Image
            style={{
              width: hp(15),
              height: hp(14),
            }}
            resizeMode="stretch"
            source={require("../assets/images/bottomEllipse.png")}
          />
        </View>
      </CustomKeyboardView>
    </View>
  );
}
