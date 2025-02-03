import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  Pressable,
  TouchableOpacity,
  Alert,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useTranslation } from "react-i18next";
import { getAuth } from "firebase/auth"; // Import Firebase Auth
import { useRouter } from "expo-router";

export default function IsVerified() {
  const { t } = useTranslation();
  const router = useRouter();
  const [checking, setChecking] = useState(false);

  const handleCheckVerification = async () => {
    setChecking(true);
    try {
      const auth = getAuth();
      if (auth.currentUser) {
        await auth.currentUser.reload(); // 🔄 Refresh user data
        if (auth.currentUser.emailVerified) {
          Alert.alert("Success", "Email verified! ");
          router.replace("home"); // 🚀 Redirect user
        } else {
          Alert.alert("Not Verified", "Please verify your email first.");
        }
      }
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setChecking(false);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <StatusBar style="dark" />

      <View style={{ flex: 1, alignItems: "flex-start" }}>
        <Pressable
          style={{
            position: "absolute",
            top: hp(5),
            left: wp(2),
            zIndex: 5,
            flexDirection: "row",
            marginTop: hp(1),
            alignItems: "center",
            width: "85%",
          }}
        >
          <Text style={{ fontSize: wp(5), paddingLeft: wp(5), fontWeight: "600" }}>
            {t("warning")}
          </Text>
        </Pressable>

        <Image
          style={{
            width: hp(27),
            height: hp(20),
          }}
          resizeMode="stretch"
          source={require("../../../assets/images/elipses.png")}
        />
      </View>

      <View
        style={{
          flex: 9,
          marginTop: hp(20),
          justifyContent: "center",
          alignItems: "center",
          padding: 20,
        }}
      >
        <Text style={{ fontSize: 20 }}>An email verification link has been sent to your email. Please verify your email to continue!</Text>

        <TouchableOpacity
          onPress={handleCheckVerification}
          style={{
            backgroundColor: checking ? "#888" : "#149BC6",
            padding: hp(1.5),
            borderRadius: 20,
            marginTop: hp(3),
            paddingHorizontal: hp(3),
          }}
          disabled={checking}
        >
          <Text
            style={{
              fontSize: hp(3),
              fontWeight: "600",
              textAlign: "center",
              color: "white",
            }}
          >
            {checking ? "Refreshing..." : "Refresh"}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={{ flex: 5 }}></View>

      <Image
        style={{
          width: hp(15),
          height: hp(14),
          position: "absolute",
          bottom: 0,
          right: 0,
        }}
        resizeMode="stretch"
        source={require("../../../assets/images/bottomEllipse.png")}
      />
    </View>
  );
}
