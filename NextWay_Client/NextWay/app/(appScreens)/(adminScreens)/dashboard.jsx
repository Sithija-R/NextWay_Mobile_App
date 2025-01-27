import { View, Text, Pressable, Image, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";

import { StatusBar } from "expo-status-bar";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useRouter } from "expo-router";
import CustomHeader from "../../../components/CustomHeader/customheader";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { getAdRequest } from "../../../services/adminService";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { getAdevertisements } from "../../../services/advertiseService";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useTranslation } from "react-i18next";

export default function dashboard() {
  const router = useRouter();
  const { t } = useTranslation();

  const [pendingCount, setPendingCount] = useState(0);
  const [pendingAds, setPendingAds] = useState(0);

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const res = await getAdRequest();
        if (res.success && res.data.length > 0) {
          const pendingAdsCount = res.data.filter(
            (ad) => ad.pending === true
          ).length;
          setPendingCount(pendingAdsCount);
        }
      } catch (error) {
        console.error("Error fetching ads:", error);
      }
    };

    fetchAds();

    const interval = setInterval(fetchAds, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchAd = async () => {
      try {
        const res = await getAdevertisements();
        if (res.success && res.data.length > 0) {
          const pendingAdsCount = res.data.filter(
            (ad) => ad.pending === true
          ).length;
          setPendingAds(pendingAdsCount);
          return;
        }
      } catch (error) {
        console.error("Error fetching ads:", error);
      }
    };

    fetchAd();
    const interval = setInterval(fetchAd, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <StatusBar style="dark" />
      <View style={{ flex: 1, alignItems: "flex-start" }}>
        <Pressable
          style={{ position: "absolute", top: hp(5), left: wp(2), zIndex: 5 }}
        >
          <CustomHeader />
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

      <View style={{ flex: 3, alignItems: "center" }}>
        <Image
          style={{ height: hp(20) }}
          resizeMode="contain"
          source={require("../../../assets/images/Logo.png")}
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
      </View>
      <View
        style={{
          alignItems: "center",
          flex: 4,
          flexDirection: "row",
          paddingHorizontal: hp(4),
          justifyContent: "space-between",
          flexWrap: "wrap",
        }}
      >
        <TouchableOpacity
          onPress={() => router.push("(usermanagement)")}
          style={{
            minWidth: hp(20),
            maxWidth: hp(20),
            maxHeight: hp(20),
            minHeight: hp(20),
            borderRadius: 15,
            backgroundColor: "#D3EEF9",
            marginBottom: hp(2),
            alignItems: "center",
            paddingHorizontal: hp(1),
            paddingVertical: hp(3),
          }}
        >
          <FontAwesome style={{}} name="users" size={40} color="black" />
          <Text
            style={{
              fontSize: hp(2),
              fontWeight: "bold",
              marginTop: hp(1),
              marginBottom: hp(1),
            }}
          >
            Manage Users
          </Text>
          <Text>Manage users profiles & roles</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => router.push("(coursemanagement)")}
          style={{
            minWidth: hp(20),
            maxWidth: hp(20),
            maxHeight: hp(20),
            minHeight: hp(20),
            borderRadius: 15,
            backgroundColor: "#D3EEF9",
            marginBottom: hp(2),
            alignItems: "center",
            paddingHorizontal: hp(1),
            paddingVertical: hp(3),
          }}
        >
          <FontAwesome5 name="clipboard-list" size={40} color="black" />

          <Text
            style={{
              fontSize: hp(2),
              fontWeight: "bold",
              marginTop: hp(1),
              marginBottom: hp(1),
            }}
          >
            Manage Courses
          </Text>
          <Text>Add,update, or remove courses</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => router.push("(advertisermanagement)")}
          style={{
            minWidth: hp(20),
            maxWidth: hp(20),
            maxHeight: hp(20),
            minHeight: hp(20),
            borderRadius: 15,
            backgroundColor: "#D3EEF9",
            marginBottom: hp(2),
            alignItems: "center",
            paddingHorizontal: hp(1),
            paddingVertical: hp(3),
          }}
        >
          {pendingCount > 0 ? (
            <MaterialIcons
              name="fiber-new"
              size={26}
              color="red"
              style={{ position: "absolute", top: hp(1), right: hp(1) }}
            />
          ) : null}

          <FontAwesome5 name="user-tie" size={40} color="black" />

          <Text
            style={{
              fontSize: hp(2),
              fontWeight: "bold",
              marginTop: hp(1),
              marginBottom: hp(1),
              textAlign: "center",
            }}
          >
            Manage Advertisers
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => router.push("(advertisementmanagement)")}
          style={{
            minWidth: hp(20),
            maxWidth: hp(20),
            maxHeight: hp(20),
            minHeight: hp(20),
            borderRadius: 15,
            backgroundColor: "#D3EEF9",
            marginBottom: hp(2),
            alignItems: "center",
            paddingHorizontal: hp(1),
            paddingVertical: hp(3),
          }}
        >
          {pendingAds > 0 ? (
            <MaterialIcons
              name="fiber-new"
              size={26}
              color="red"
              style={{ position: "absolute", top: hp(1), right: hp(1) }}
            />
          ) : null}

          <FontAwesome5 name="ad" size={40} color="black" />

          <Text
            style={{
              fontSize: hp(2),
              fontWeight: "bold",
              marginTop: hp(1),
              marginBottom: hp(1),
              textAlign: "center",
            }}
          >
            Manage Advertisement
          </Text>
        </TouchableOpacity>
      </View>

      <View style={{ alignItems: "flex-end", zIndex: -1 }}>
        <Image
          style={{
            width: hp(15),
            height: hp(14),
          }}
          resizeMode="stretch"
          source={require("../../../assets/images/bottomEllipse.png")}
        />
      </View>
    </View>
  );
}
