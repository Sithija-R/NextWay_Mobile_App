import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Pressable,
  TextInput,
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
import DateTimePickerModal from "react-native-modal-datetime-picker"; 

export default function ProfileEdit() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { user, setUser } = useAuth();
  const { t } = useTranslation();
  const [profileImage, setProfileImage] = useState(null);
  const [datePickerVisible, setDatePickerVisible] = useState(false); 

  const [profileData, setProfileData] = useState({
    username: user?.username || "",
    email: user?.email || "",
    phoneNumber: user?.phoneNumber || "",
    dob: user?.dob || "",
  });

  const handleInputChange = (key, value) => {
    setProfileData((prevData) => ({
      ...prevData,
      [key]: value,
    }));
  };

  const fields = [
    { label: t("username"), placeholder: t("enter_username"), key: "username" },
    {
      label: t("phone"),
      placeholder: t("enter_mobile"),
      key: "phoneNumber",
      keyboardType: "phone-pad",
    },
  ];

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
      setProfileImage(result.assets[0].uri);
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
      let profileImageUrl = "";

      if (profileImage) {
        const response = await fetch(profileImage);
        const blob = await response.blob();

        const filename = profileImage.substring(
          profileImage.lastIndexOf("/") + 1
        );
        const storage = getStorage();
        const imageRef = ref(storage, `profileImages/${uid}/${filename}`);

        await uploadBytes(imageRef, blob);
        profileImageUrl = await getDownloadURL(imageRef);
      }

      const response = await updateUserProfile(uid, {
        ...profileData,
        profileImage: profileImageUrl,
      });
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

  // Show the date picker modal
  const handleDatePicker = () => {
    setDatePickerVisible(true);
  };

  // Hide the date picker modal
  const hideDatePicker = () => {
    setDatePickerVisible(false);
  };

  // Handle date selection
  const handleDateConfirm = (date) => {
    handleInputChange("dob", date.toLocaleDateString()); // Update dob in profileData state
    hideDatePicker();
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
                uri:
                  profileImage ||
                  user.profileImage ||
                  "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541",
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
            {fields.map((field) => (
              <InputField
                key={field.key}
                label={field.label}
                placeholder={field.placeholder}
                value={profileData[field.key]}
                onChangeText={(value) => handleInputChange(field.key, value)}
                keyboardType={field.keyboardType || "default"}
              />
            ))}

      
            <TouchableOpacity onPress={handleDatePicker}>
              <View
                style={{
                  borderWidth: 2,
                  borderColor: "rgba(0, 0, 0, 0.1)",
                  borderRadius: 10,
                  padding: hp(1),
                  marginBottom: hp(3),
                }}
              >
                <Text
                  style={{ fontSize: hp(2), fontWeight: "600", opacity: 0.5 }}
                >
                  {t("date_of_birth")}
                </Text>
                <TextInput
                  style={{
                    fontSize: hp(2),
                    color: "black", 
                  }}
                  placeholder={t("enter_dob")}
                  value={profileData.dob}
                  editable={false}
                />
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <View style={{ marginVertical: hp(3), alignItems: "center" }}>
          {loading ? (
            <View style={{ flexDirection: "row", justifyContent: "center" }}>
              <Loading size={hp(10)} />
            </View>
          ) : (
            <TouchableOpacity
              onPress={handleSave}
              style={{
                backgroundColor: "#149BC6",
                paddingVertical: hp(1.5),
                paddingHorizontal: wp(10),
                borderRadius: 10,
              }}
            >
              <Text
                style={{
                  fontSize: hp(3),
                  fontWeight: "600",
                  textAlign: "center",
                  color: "white",
                }}
              >
                {t("save_changes")}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        <DateTimePickerModal
          isVisible={datePickerVisible}
          mode="date"
          onConfirm={handleDateConfirm}
          onCancel={hideDatePicker}
        />
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
  editable = true,
}) => (
  <View
    style={{
      borderWidth: 2,
      borderColor: "rgba(0, 0, 0, 0.1)",
      borderRadius: 10,
      padding: hp(1),
      marginBottom: hp(3),
    }}
  >
    <Text style={{ fontSize: hp(2), fontWeight: "600", opacity: 0.5 }}>
      {label}
    </Text>
    <TextInput
      style={{ fontSize: hp(2) }}
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      keyboardType={keyboardType}
      editable={editable}
    />
  </View>
);
