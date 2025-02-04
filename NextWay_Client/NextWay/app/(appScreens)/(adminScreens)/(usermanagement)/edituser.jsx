import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Pressable,
  TextInput,
  Platform,
  StyleSheet,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Avatar } from "@rneui/themed";
import Feather from "@expo/vector-icons/Feather";
import Loading from "../../../../components/Loading/Loading";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import * as ImagePicker from "expo-image-picker";
import CustomKeyboardView from "../../../../components/keyboardView/CustomKeyboardView";
import { decode } from "base-64";
import { updateUserProfile } from "../../../../services/authService";
import { Dropdown } from "react-native-element-dropdown";
import DateTimePicker from "@react-native-community/datetimepicker";
import { format } from "date-fns";

export default function EditUser() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const { user } = useLocalSearchParams();
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [profileImage, setProfileImage] = useState(null);

  const parsedUser = user ? JSON.parse(user) : {};
  const decodedProfilePic = parsedUser?.profilepic
    ? decode(parsedUser.profilepic)
    : "";

  const [profileData, setProfileData] = useState({
    username: parsedUser?.username || "",
    email: parsedUser?.email || "",
    dob: parsedUser?.dob || "",
    phoneNumber: parsedUser?.phoneNumber || "",
    role: parsedUser?.role || "",
    profilepic: decodedProfilePic || "",
  });

  const [isRoleFocus, setIsRoleFocus] = useState(false);

  const roles = [
    { label: "Admin", value: "admin" },
    { label: "Student", value: "student" },
  
  ];

  const handleInputChange = (key, value) => {
    setProfileData((prevData) => ({
      ...prevData,
      [key]: value,
    }));
  };

  const fields = [
    {
      label: "email",
      placeholder: t("email"),
      key: "email",
    },
    { label: t("username"), placeholder: t("enter_username"), key: "username" },

    {
      label: t("phone"),
      placeholder: t("enter_mobile"),
      key: "phoneNumber",
      keyboardType: "phone-pad",
    },
  ];

  //pick image
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
      const uid = parsedUser?.id;
      if (!uid) {
        console.log("User id not found");
        return;
      }
      setLoading(true);
      let profileImageUrl = profileData.profilepic;

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
            {t("Edit User")}
          </Text>
        </Pressable>

        <Image
          style={{
            width: hp(27),
            height: hp(20),
          }}
          resizeMode="stretch"
          source={require("../../../../assets/images/elipses.png")}
        />
      </View>
      <View style={{ flex: 5 }}>
        <CustomKeyboardView>
          <View style={{ flex: 1, alignItems: "center" }}>
            <View style={{ position: "relative", marginBottom: hp(5) }}>
              <Avatar
                size={hp(20)}
                rounded
                source={{
                  uri:
                    profileImage ||
                    profileData?.profilepic ||
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
              


              <View
                style={{
                  borderWidth: 2,
                  borderColor: "rgba(0, 0, 0, 0.1)",
                  borderRadius: 10,
                  flexDirection: "row",
                  alignItems: "center",
                  width: "100%",
                  padding: hp(0.9),
                  marginBottom: hp(1),
                  justifyContent: "space-between",
                }}
              >
                <Text
                  style={{
                    fontSize: hp(2),
                    fontWeight: "600",
                    opacity: 0.6,
                  }}
                >
                  Date of Birth
                </Text>
                <TouchableOpacity onPress={() => setDatePickerVisible(true)} style={{ flex: 1 }}>
                <TextInput
                   style={{
                    color: profileData.dob ? "black" : "#999",
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

              <View
                style={{
                  borderWidth: 2,
                  borderColor: "rgba(0, 0, 0, 0.1)",
                  borderRadius: 10,
                  flexDirection: "row",
                  alignItems: "center",
                  width: "100%",
                  padding: hp(0.9),
                  marginBottom: hp(1),
                  justifyContent: "space-between",
                }}
              >
                <Text
                  style={{
                    fontSize: hp(2),
                    fontWeight: "600",
                    opacity: 0.6,
                  }}
                >
                  Role
                </Text>
                <Dropdown
                  style={[
                    styles.dropdown,
                    isRoleFocus && { borderColor: "blue" },
                  ]}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  inputSearchStyle={styles.inputSearchStyle}
                  iconStyle={styles.iconStyle}
                  data={roles}
                  maxHeight={300}
                  labelField="label"
                  valueField="value"
                  placeholder={!isRoleFocus ? t("year") : "..."}
                  value={profileData?.role}
                  onFocus={() => setIsRoleFocus(true)}
                  onBlur={() => setIsRoleFocus(false)}
                  onChange={(item) => {
                    handleInputChange("role", item.value);
                    setIsRoleFocus(false);
                  }}
                />
              </View>
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
        </CustomKeyboardView>
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
      <Image
        style={{
          width: hp(15),
          height: hp(14),
          position: "absolute",
          bottom: 0,
          right: 0,
        }}
        resizeMode="stretch"
        source={require("../../../../assets/images/bottomEllipse.png")}
      />
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
      padding: hp(0.7),
      marginBottom: hp(1),
    }}
  >
    <Text
      style={{
        fontSize: hp(2),
        fontWeight: "600",
        opacity: 0.6,
      }}
    >
      {label}
    </Text>
    {label === "email" ? (
      <Text
        style={{
          marginLeft: wp(5),
          fontSize: hp(2),
          paddingHorizontal: wp(3),
          paddingVertical: hp(1),
          color: "gray",
          flex: 1,
        }}
      >
        {value}
      </Text>
    ) : (
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
    )}
  </View>
);
const styles = StyleSheet.create({
  container: {
    width: wp(30),
    backgroundColor: "#E9E9E9",
    padding: 16,
  },
  dropdown: {
    width: wp(50),
    height: hp(5),
    borderColor: "gray",
    backgroundColor: "#e0e0e0",
    // borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  icon: {
    marginRight: wp(5),
  },
  label: {
    position: "absolute",
    backgroundColor: "white",
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: wp(4),
  },
  placeholderStyle: {
    fontSize: hp(2.5),
    color: "gray",
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});
