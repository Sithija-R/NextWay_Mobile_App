import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Pressable,
  TextInput,
  Platform,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Avatar } from "@rneui/themed";
import Feather from "@expo/vector-icons/Feather";
import CustomKeyboardView from "../../../../../components/keyboardView/CustomKeyboardView";
import { updateUserProfile } from "../../../../../services/authService";
import { auth } from "../../../../../firebaseConfig/firebaseConfiguration";
import { useAuth } from "../../../../../context/authContext";
import Loading from "../../../../../components/Loading/Loading";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import * as ImagePicker from "expo-image-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { format } from "date-fns";

export default function ProfileEdit() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { user, setUser } = useAuth();
  const { t } = useTranslation();
  const [datePickerVisible, setDatePickerVisible] = useState(false);

  const [profileData, setProfileData] = useState({
    username: user?.username || "",
    email: user?.email || "",
    phoneNumber: user?.phoneNumber || "",
    dob: user?.dob || "", 
    profileImage: user?.profileImage || "",
  });


  const handleInputChange = (key, value) => {
    setProfileData((prevData) => ({
      ...prevData,
      [key]: value,
    }));
  };

  const handleImagePick = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      handleInputChange("profileImage", result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    try {
      const uid = auth.currentUser?.uid; 

      if (!uid) {
        console.log("User not logged in");
        return;
      }

      setLoading(true);
      let profileImageUrl = profileData.profileImage ;

      if (profileData.profileImage && profileData.profileImage !== user?.profileImage) {
        const response = await fetch(profileData.profileImage);
        const blob = await response.blob();

        const filename = profileData.profileImage.substring(profileData.profileImage.lastIndexOf('/') + 1);
        const storage = getStorage();
        const imageRef = ref(storage, `profileImages/${uid}/${filename}`);

        await uploadBytes(imageRef, blob);
        profileImageUrl = await getDownloadURL(imageRef);
      }

      const response = await updateUserProfile(uid, { ...profileData, profileImage: profileImageUrl });
      setLoading(false);

      if (response.success) {
        alert("Profile updated successfully");
        setUser((prevUser) => ({
          ...prevUser,
          ...profileData,
          profileImage: profileImageUrl,
        }));
      } else {
        alert(`Error: ${response.msg}`);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert(`Error updating profile: ${error.message}`);
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <StatusBar style="dark" />
      <CustomKeyboardView>
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
              {t("edit_profile")}
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

        <View style={{ flex: 4, alignItems: "center" }}>
          <View style={{ position: "relative", marginBottom: hp(8) }}>
            <Avatar
              size={hp(20)}
              rounded
              source={{
                uri: profileData.profileImage || 
                     "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png",
              }}
              containerStyle={{
                borderWidth: 5, 
                borderColor: "rgba(0, 0, 0, 0.2)",
              }}
            />
            <Feather
              name="edit"
              size={hp(4)}
              color="#149BC6"
              style={{
                position: "absolute",
                bottom: hp(0),
                right: hp(2),
              }}
              onPress={handleImagePick}
            />
          </View>

          <View style={{ width: "80%" }}>
            <InputField
              label={t("username")}
              placeholder={t("enter_username")}
              value={profileData.username}
              onChangeText={(value) => handleInputChange("username", value)}
            />
            <InputField
              label={t("phone")}
              placeholder={t("enter_mobile")}
              value={profileData.phoneNumber}
              onChangeText={(value) => handleInputChange("phoneNumber", value)}
              keyboardType="phone-pad"
            />

            {/* Date of Birth Field */}
            <View
              style={{
                borderWidth: 2,
                borderColor: "rgba(0, 0, 0, 0.1)",
                borderRadius: 10,
                flexDirection: "row",
                alignItems: "center",
                width: "100%",
                padding: hp(1),
                marginBottom: hp(3),
              }}
            >
              <Text style={{ fontSize: hp(2), fontWeight: "600", opacity: 0.5 }}>
                {t("date_of_birth")}
              </Text>

              <TouchableOpacity onPress={() => setDatePickerVisible(true)} style={{ flex: 1 }}>
                <TextInput
                  style={{
                    color: profileData.dob ? "black" : "#999",
                    textAlign: "center",
                    marginLeft: wp(5),
                    fontSize: hp(2),
                    paddingHorizontal: wp(3),
                    paddingVertical: hp(1),
                    flex: 1,
                  }}
                  editable={false}
                  value={profileData.dob}
                  placeholder={profileData.dob ? "" : t("enter_dob")}
                />
              </TouchableOpacity>
            </View>

            {datePickerVisible && (
              <DateTimePicker
                value={new Date()}
                mode="date"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={(event, selectedDate) => {
                  setDatePickerVisible(false);
                  if (selectedDate) {
                    handleInputChange("dob", format(selectedDate, "dd/MM/yyyy"));
                  }
                }}
              />
            )}
          </View>
        </View>

        <View style={{ marginVertical: hp(3), alignItems: "center" }}>
          {loading ? <Loading size={hp(10)} /> : (
            <TouchableOpacity onPress={handleSave} style={{ backgroundColor: "#149BC6", paddingVertical: hp(1.5), paddingHorizontal: wp(10), borderRadius: 10 }}>
              <Text style={{ fontSize: hp(3), fontWeight: "600", textAlign: "center", color: "white" }}>
                {t("save_changes")}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </CustomKeyboardView>
    </View>
  );
}


const InputField = ({
  label,
  placeholder,
  value,
  onChangeText,
  keyboardType = "default",
}) => (
  <View
    style={{
      borderWidth: 2,
      borderColor: "rgba(0, 0, 0, 0.1)",
      borderRadius: 10,
      flexDirection: "row",
      alignItems: "center",
      width: "100%",
      padding: hp(1),
      marginBottom: hp(3),
    }}
  >
    <Text
      style={{
        fontSize: hp(2),
        fontWeight: "600",
        opacity: 0.5,
      }}
    >
      {label}
    </Text>

    <TextInput
      style={{
        marginLeft: wp(5),
        fontSize: hp(2),
        paddingHorizontal: wp(3),
        paddingVertical: hp(1),
        flex: 1,
      }}
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      keyboardType={keyboardType}
      autoCapitalize="none"
    />
  </View>
);
