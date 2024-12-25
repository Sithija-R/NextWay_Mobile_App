import {
  View,
  Text,
  Image,
  Pressable,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import { CheckBox } from "react-native-elements";
import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useAuth } from "../../../../../context/authContext";
import { auth } from "../../../../../firebaseConfig/firebaseConfiguration";
import Loading from "../../../../../components/Loading/Loading";
import { newAdvertiserReq } from "../../../../../services/advertiseService";

export default function Profile() {
  const router = useRouter();
  const { t } = useTranslation();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const [data, setData] = useState({
    id: auth?.currentUser.uid || "",
    email: user?.email || "",
    username: user?.username || "",
    businessName: "",
    description: "",
    contact: "",
    businessType: "",
    termsAccepted: false,
  });

  const handleChange = (field, value) => {
    setData((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  const handleSend = async () => {
    if (!data.businessName.trim()) {
      Alert.alert("Warning!", "Business Name is required");
      return;
    }
    if (!data.businessType.trim()) {
      Alert.alert("Warning!", "Business Type is required");
      return;
    }
    if (!data.description.trim()) {
      Alert.alert("Warning!", "Description is required");
      return;
    }
    if (!data.contact.trim()) {
      Alert.alert("Warning!", "Contact is required");
      return;
    }
    if (!data.termsAccepted) {
      Alert.alert(
        "Warning!",
        "You must accept the terms and conditions to proceed"
      );
      return;
    }
    try {
      const payload = {
        ...data,
        pending: true,
        accepted: false,
      };
      setLoading(true)
      console.log("Form submitted successfully", payload);
      const res = await newAdvertiserReq(payload);
      setLoading(false)
      if (res.success) {
        Alert.alert("Success", "Your request has been submitted successfully");
        router.push("profile");
      } else {
        Alert.alert("Error", "Something went wrong. Please try again.");
      }
      
    } catch (error) {
      Alert.alert("Error", "Something went wrong. Please try again.");
      console.error("Error during form submission:", error);
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
          <Ionicons
            onPress={() => router.back()}
            name="arrow-back"
            size={hp(3.5)}
            color="black"
          />
          <Text
            style={{ fontSize: wp(5), paddingLeft: wp(5), fontWeight: "600" }}
          >
            {t("ad_acc_req")}
          </Text>
        </Pressable>
        <Image
          style={{
            width: hp(27),
            height: hp(20),
          }}
          resizeMode="stretch"
          source={require("../../../../../assets/images/elipses.png")}
        />
      </View>

      <View style={{ flex: 4, alignItems: "center", paddingHorizontal: wp(5) }}>
        <TextInput
          style={{
            width: "100%",
            padding: hp(2),
            marginTop: hp(2),
            borderWidth: 1,
            borderColor: "#ccc",
            borderRadius: 10,
            fontSize: hp(2.2),
          }}
          placeholder={t("business_name")}
          value={data.businessName}
          onChangeText={(value) => handleChange("businessName", value)}
        />

        <TextInput
          style={{
            width: "100%",
            padding: hp(2),
            marginTop: hp(2),
            borderWidth: 1,
            borderColor: "#ccc",
            borderRadius: 10,
            fontSize: hp(2.2),
          }}
          placeholder={t("business_type")}
          value={data.businessType}
          onChangeText={(value) => handleChange("businessType", value)}
        />

        <TextInput
          style={{
            width: "100%",
            padding: hp(2),
            marginTop: hp(2),
            borderWidth: 1,
            borderColor: "#ccc",
            borderRadius: 10,
            fontSize: hp(2.2),
          }}
          placeholder={t("description")}
          value={data.description}
          onChangeText={(value) => handleChange("description", value)}
          multiline
        />

        <TextInput
          style={{
            width: "100%",
            padding: hp(2),
            marginTop: hp(2),
            borderWidth: 1,
            borderColor: "#ccc",
            borderRadius: 10,
            fontSize: hp(2.2),
          }}
          placeholder={t("contact_no")}
          value={data.contact}
          onChangeText={(value) => handleChange("contact", value)}
          keyboardType="phone-pad"
        />

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginTop: hp(2),
          }}
        >
          <CheckBox
            checked={data.termsAccepted}
            onPress={() => handleChange("termsAccepted", !data.termsAccepted)}
          />
          <Text style={{ marginLeft: wp(2), fontSize: hp(2.2) }}>
            {t("Accept Terms & Conditions")}
          </Text>
        </View>
       
        {loading ? (
          <View style={{ flexDirection: "row", justifyContent: "center" ,marginTop: hp(5),}}>
            <Loading size={hp(11)} />
          </View>
        ) : (
          <TouchableOpacity
            onPress={handleSend}
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: hp(5),
              backgroundColor: "#149BC6",
              padding: hp(2),
              borderRadius: 10,
              width: wp(60),
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                fontSize: hp(2.6),
                fontWeight: "600",
                textAlign: "center",
                flex: 1,
                color: "white",
              }}
            >
              {t("send_req")}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={{ alignItems: "flex-end", zIndex: -1 }}>
        <Image
          style={{
            width: hp(15),
            height: hp(14),
          }}
          resizeMode="stretch"
          source={require("../../../../../assets/images/bottomEllipse.png")}
        />
      </View>
    </View>
  );
}
