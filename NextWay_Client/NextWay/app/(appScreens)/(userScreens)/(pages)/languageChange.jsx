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
  const [selectedLanguage, setSelectedLanguage] = useState(null);

 
  useEffect(() => {
    const loadSavedLanguage = async () => {
      try {
        const savedLanguage = await AsyncStorage.getItem("language");
        if (savedLanguage) {
          i18next.changeLanguage(savedLanguage);
          setSelectedLanguage(savedLanguage);
        }
      } catch (e) {
        console.error("Failed to load language", e);
      }
    };

    loadSavedLanguage();
  }, []);

  const changeLng = (lng) => {
    setSelectedLanguage(lng);
  };



  
  const saveLanguage = async () => {
    try {
      await AsyncStorage.setItem("language", selectedLanguage);
      i18next.changeLanguage(selectedLanguage);
      router.back(); 
    } catch (e) {
      console.error("Failed to save language", e);
    }
  };

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
            {t("change-language")}
          </Text>
        </Pressable>

        <Image
          style={{ width: hp(27), height: hp(20) }}
          resizeMode="stretch"
          source={require("../../../../assets/images/elipses.png")}
        />
      </View>
      <View style={{ flex: 4, alignItems: "center" }}>
        <View style={{ width: "85%", alignItems: "center", marginTop: hp(5) }}>
         
          <TouchableOpacity
            onPress={() => changeLng("en")}
            style={{
              position: "relative",
              marginTop: hp(2),
              height: hp(8),
              width: wp(80),
              borderWidth: 2,
              borderColor: selectedLanguage === "en" ? "#149BC6" : "gray",
              alignItems: "center",
              flexDirection: "row",
              borderRadius: 30,
              paddingLeft: wp(5),
              justifyContent: "center",
            }}
          >
            <Image
              style={{
                position: "absolute",
                left: wp(5),
                width: hp(5),
              }}
              resizeMode="contain"
              source={require("../../../../assets/images/englishIcon.png")}
            />
            <Text style={{ fontSize: hp(3) }}>English</Text>
          </TouchableOpacity>

         
          <TouchableOpacity
            onPress={() => changeLng("sin")}
            style={{
              position: "relative",
              marginTop: hp(2),
              height: hp(8),
              width: wp(80),
              borderWidth: 2,
              borderColor: selectedLanguage === "sin" ? "#149BC6" : "gray",
              alignItems: "center",
              flexDirection: "row",
              borderRadius: 30,
              paddingLeft: wp(5),
              justifyContent: "center",
            }}
          >
            <Image
              style={{
                position: "absolute",
                left: wp(5),
                width: hp(5),
              }}
              resizeMode="contain"
              source={require("../../../../assets/images/sinhalaIcon.png")}
            />
            <Text style={{ fontSize: hp(3) }}>Sinhala</Text>
          </TouchableOpacity>

  
          <TouchableOpacity
            onPress={() => changeLng("tam")}
            style={{
              position: "relative",
              marginTop: hp(2),
              height: hp(8),
              width: wp(80),
              borderWidth: 2,
              borderColor: selectedLanguage === "tam" ? "#149BC6" : "gray",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 30,
            }}
          >
            <Image
              style={{
                position: "absolute",
                left: wp(5),
                width: hp(5),
              }}
              resizeMode="contain"
              source={require("../../../../assets/images/tamilIcon.png")}
            />
            <Text style={{ fontSize: hp(3) }}>Tamil</Text>
          </TouchableOpacity>
        </View>

        {/* Save button */}
        <TouchableOpacity
          onPress={saveLanguage}
          style={{
            marginTop: hp(15),
            height: hp(8),
            width: wp(80),
            backgroundColor: "#149BC6",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 30,
          }}
        >
          <Text style={{ fontSize: hp(3), color: "white", fontWeight: "600" }}>
            Save
          </Text>
        </TouchableOpacity>
      </View>

      <View style={{ alignItems: "flex-end", zIndex: -1 }}>
        <Image
          style={{ width: hp(15), height: hp(14) }}
          resizeMode="stretch"
          source={require("../../../../assets/images/bottomEllipse.png")}
        />
      </View>
    </View>
  );
}
