import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Pressable,
  Modal,
  FlatList,
  StyleSheet,
  ScrollView,
} from "react-native";
import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
            zIndex: 100,
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
      {/* add things here */}

      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={{ alignItems: "center" }}>
          <Image
            style={{ height: hp(20) }}
            resizeMode="contain"
            source={require("../../../../assets/images/Logo.png")}
          />
        </View>
        <Text style={styles.title}>About NextWay</Text>
        <Text style={styles.description}>
          NextWay is a comprehensive mobile application designed to empower Sri
          Lankan students by streamlining their journey from academic
          exploration to career success.
        </Text>
        <Text style={styles.subtitle}>Key Features:</Text>
        <Text style={styles.bullet}>• AI-Powered Career Guidance</Text>
        <Text style={styles.bullet}>• University and Course Exploration</Text>
        <Text style={styles.bullet}>• Community and Peer Support</Text>

        <Text style={styles.subtitle}>Major Goals and Objectives:</Text>
        <Text style={styles.bullet}>• Empower informed decision-making</Text>
        <Text style={styles.bullet}>• Enhance educational accessibility</Text>
        <Text style={styles.bullet}>• Foster skill development</Text>
        <Text style={styles.bullet}>• Build community connections</Text>
        <Text style={styles.bullet}>• Promote equity in education</Text>
        <Text style={styles.bullet}>• Celebrate lifelong learning</Text>
      </ScrollView>
      <View style={{ alignItems: "center", marginTop: hp(1) }}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={{
            backgroundColor: "#149BC6",
            padding: hp(2),
            borderRadius: 40,
            width: wp(50),
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
            {t("Go back")}
          </Text>
        </TouchableOpacity>
      </View>

      <View></View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    width: hp(27),
    height: hp(20),
  },
  contentContainer: {
    padding: wp(5),
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
    overflow: "hidden",
  },
  title: {
    fontSize: wp(6),
    fontWeight: "bold",
    marginBottom: hp(2),
    alignSelf: "center",
  },
  description: {
    fontSize: wp(4),
    marginBottom: hp(2),
    lineHeight: wp(5),
  },
  subtitle: {
    fontSize: wp(5),
    fontWeight: "bold",
    marginTop: hp(2),
    marginBottom: hp(1),
  },
  bullet: {
    fontSize: wp(4),
    marginVertical: hp(0.5),
  },
});
