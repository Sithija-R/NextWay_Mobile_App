import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  Pressable,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useTranslation } from "react-i18next";
import Ionicons from "@expo/vector-icons/Ionicons";
import CustomKeyboardView from "../components/keyboardView/CustomKeyboardView";
import { useRouter } from "expo-router";





export default function AdvertiserReq() {
  const router = useRouter();
  
  const { t } = useTranslation();
 

 

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
            {t("New Advertiser Requests")}
          </Text>
        </Pressable>

        <Image
          style={{
            width: hp(27),
            height: hp(20),
          }}
          resizeMode="stretch"
          source={require("../assets/images/elipses.png")}
        />
      </View>


      <View style={{ flex: 5 }}>
        <CustomKeyboardView>
         



   
        </CustomKeyboardView>
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
        source={require("../assets/images/bottomEllipse.png")}
      />
    </View>
  );
}

