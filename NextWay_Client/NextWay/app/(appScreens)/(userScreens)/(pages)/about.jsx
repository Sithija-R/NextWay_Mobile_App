import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Pressable,
  Modal,
  FlatList,
  StyleSheet,
} from "react-native";
import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useRouter } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useTranslation } from "react-i18next";
import i18next from "i18next";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function Settings() {
  const router = useRouter();
  const { t } = useTranslation();
  
  return (
    <View style={{ flex: 1 }}>
      <StatusBar style="dark" />
      <View style={{ flex: 1, alignItems: "flex-start" }}>
        <Pressable
          onPress={() => router.back()}
          style={{
            position: "absolute",
            top: hp(5),
            left: wp(2),
            zIndex: 5,
            flexDirection: "row",
            marginTop: hp(3),
            alignItems: "center",
            width: "85%",
          }}
        >
          <Ionicons name="arrow-back" size={hp(3.5)} color="black" />
          <Text style={{ fontSize: wp(5), paddingLeft: wp(5) }}>
            {t("back")}
          </Text>
        </Pressable>

        <Image
          style={{ width: hp(27), height: hp(20) }}
          resizeMode="stretch"
          source={require("../../../../assets/images/elipses.png")}
        />
      </View>
      
    </View>
  );
}
