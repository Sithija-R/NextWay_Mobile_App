import { View, Text, Image, TouchableOpacity, Pressable } from "react-native";
import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useRouter } from "expo-router";
import CustomHeader from "../../../../components/CustomHeader/customheader";
import { useTranslation } from "react-i18next";
import i18next from "i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchNotification } from "../../../../services/fetchingService";
import { auth } from "../../../../firebaseConfig/firebaseConfiguration";
import { Ionicons } from "@expo/vector-icons";

export default function Home() {
  const router = useRouter();
  const { t } = useTranslation();
  const [notifications, setNotifications] = useState(0);
  

  useEffect(() => {
    const getNotifications = async () => {
      try {
        const response = await fetchNotification();
        if (response.success && response.data.length > 0) {
          const notifi = response.data.filter(
            (noti) =>
              noti.userId === auth?.currentUser?.uid || noti.userId === "all"
          );
          const unread = notifi.filter((noti) => noti.read === false).length;
          setNotifications(unread);
        } else {
          console.log("No notifications found");
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };
    getNotifications();
    const interval = setInterval(getNotifications, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const loadSavedLanguage = async () => {
      try {
        const savedLanguage = await AsyncStorage.getItem("language");
        if (savedLanguage) {
          i18next.changeLanguage(savedLanguage);
        }
      } catch (e) {
        console.error("Failed to load language", e);
      }
    };

    loadSavedLanguage();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <StatusBar style="dark" />
      <View style={{ flex: 1 }}>
        <Pressable
          style={{ position: "absolute", top: hp(5), left: wp(2), zIndex: 5 }}
        >
          <CustomHeader />
        </Pressable>
        <Pressable
          onPress={() => router.push("notifications")}
          style={{
            position: "absolute",
            top: hp(5),
            right: wp(4),
            marginTop: hp(2),
          }}
        >
          <Ionicons name="notifications" size={hp(4)} color="#141414" />
          {notifications > 0 && (
            <View
              style={{
                position: "absolute",
                top: 1,
                right: 0,
                width: 10,
                height: 10,
                borderRadius: 4,
                backgroundColor: "red",
                marginLeft: 6, // Space between text and dot
              }}
            />
          )}
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

      <View style={{ alignItems: "center", flex: 4 }}>
        <Image
          style={{ height: hp(25) }}
          resizeMode="contain"
          source={require("../../../../assets/images/Logo.png")}
        />

        <Text
          style={{ fontSize: hp(4), fontWeight: "600", textAlign: "center" }}
        >
          {t("welcome")}
          {"\n"}
          <Text
            style={{
              fontSize: hp(4),
              fontWeight: "600",
              textAlign: "center",
              color: "#EC7117",
            }}
          >
            Nextway
          </Text>
        </Text>

        <View style={{ alignItems: "center", marginTop: hp(7) }}>
          <TouchableOpacity
            onPress={() => router.push("firstScreen")}
            style={{
              backgroundColor: "#149BC6",
              padding: hp(2),
              borderRadius: 40,
              width: wp(80),
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
              {t("find-course")}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              marginTop: hp(3),
              backgroundColor: "#149BC6",
              padding: hp(2),
              borderRadius: 40,
              width: wp(80),
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
              {t("advertisement")}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={{ alignItems: "flex-end", zIndex: -1 }}>
        <Image
          style={{
            width: hp(15),
            height: hp(14),
          }}
          resizeMode="stretch"
          source={require("../../../../assets/images/bottomEllipse.png")}
        />
      </View>
    </View>
  );
}
