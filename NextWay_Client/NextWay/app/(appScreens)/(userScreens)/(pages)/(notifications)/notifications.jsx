import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  Pressable,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useTranslation } from "react-i18next";
import Ionicons from "@expo/vector-icons/Ionicons";

import { useRouter } from "expo-router";

import {
  fetchNotification,
  viewNotification,
} from "../../../../../services/fetchingService";
import { auth } from "../../../../../firebaseConfig/firebaseConfiguration";

export default function Notifications() {
  const router = useRouter();

  const { t } = useTranslation();
  const [notifications, setNotifications] = useState([]);
  const [flag, setFlag] = useState(false);

  useEffect(() => {
    const getNotifications = async () => {
      try {
        const response = await fetchNotification();
        if (response.success && response.data.length > 0) {
          const notifi = response.data.filter(
            (noti) =>
              noti.userId === auth?.currentUser?.uid || noti.userId === "all"
          );
          setNotifications(notifi);
        } else {
          console.log("No notifications found");
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };
    getNotifications();
    const interval = setInterval(getNotifications, 120000);
    return () => clearInterval(interval);
  }, [flag]);


  const handleNotificationView = async (id) => {
    try {
      const response = await viewNotification(id);
      if (response.success) {
        setFlag((prev) => !prev);
      }
    } catch (error) {
      console.error("Error viewing notification:", error);
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
            {t("Notifications")}
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

      <View style={{ flex: 7, alignItems: "center", zIndex: 2 }}>
        <ScrollView>
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              paddingBottom: hp(3),
            }}
          >
            {notifications.length > 0 ? (
              notifications.map((notification, index) => (
                notification.read?(null):(

                    <View
                      key={index}
                      style={{
                        marginTop: hp(3),
                        width: wp(90),
    
                        justifyContent: "space-between",
    
                        padding: hp(2),
                        borderRadius: 13,
    
                        borderWidth:
                          notification.type === "ad_request_declined" ||
                          notification.type === "ad_request_accepted"
                            ? 2
                            : 0,
                        borderColor:
                          notification.type === "ad_request_declined"
                            ? "#FFCCCC"
                            : notification.type === "ad_request_accepted"
                            ? "#CCFFCC"
                            : "transparent",
    
                        // Dynamic background color
                        backgroundColor:
                          notification.type === "ad_request_declined"
                            ? "#FFF5F5"
                            : notification.type === "ad_request_accepted"
                            ? "#F5FFF5"
                            : "#FFFFFF",
    
                        // Shadow for iOS
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: 2 }, // Shadow only downward
                        shadowOpacity: 0.2,
                        shadowRadius: 2.62,
                        // Android Shadow (Bottom Only)
                        elevation: 5,
                      }}
                    >
                      <Text style={{ fontSize: wp(4) }}>
                        {notification.message}
                      </Text>
                      <View style={{ alignItems: "flex-end" }}>
                        <TouchableOpacity
                          onPress={() => handleNotificationView(notification.id)}
                          style={{
                            backgroundColor: "#149BC6",
                            padding: hp(1),
                            borderRadius: 10,
                            width: wp(20),
                            alignItems: "center",
                            marginTop: hp(1),
                          }}
                        >
                          <Text style={{ color: "white", fontSize: hp(2) }}>
                            Ok
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))
                )

            ) : (
              <Text>No notifications!</Text>
            )}
          </View>
        </ScrollView>
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
        source={require("../../../../../assets/images/bottomEllipse.png")}
      />
    </View>
  );
}
