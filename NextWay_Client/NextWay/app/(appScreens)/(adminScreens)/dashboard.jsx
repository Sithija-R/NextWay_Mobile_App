import { View, Text, Pressable, Image, TouchableOpacity } from "react-native";
import React from "react";

import { StatusBar } from "expo-status-bar";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useRouter } from "expo-router";
import CustomHeader from "../../../components/CustomHeader/customheader";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

export default function dashboard() {
  const router = useRouter();

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
            paddingHorizontal:hp(1),
            paddingVertical:hp(3)
          }}
        >
          <FontAwesome style={{}} name="users" size={40} color="black" />
          <Text style={{fontSize:hp(2),fontWeight:'bold', marginTop:hp(1),marginBottom:hp(1)}}>Manage Users</Text>
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
            paddingHorizontal:hp(1),
            paddingVertical:hp(3)
          }}
        >
          <FontAwesome5 name="clipboard-list" size={40} color="black"  />
 
          <Text style={{fontSize:hp(2),fontWeight:'bold', marginTop:hp(1),marginBottom:hp(1)}}>Manage Courses</Text>
          <Text>Add,update, or remove courses</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            minWidth: hp(20),
            minHeight: hp(20),
            borderRadius: 15,
            backgroundColor: "#D3EEF9",
            marginBottom: hp(2),
            alignItems: "center",
          }}
        ></TouchableOpacity>
        <TouchableOpacity
          style={{
            minWidth: hp(20),
            minHeight: hp(20),
            borderRadius: 15,
            backgroundColor: "#D3EEF9",
            marginBottom: hp(2),
            alignItems: "center",
          }}
        ></TouchableOpacity>
        <TouchableOpacity
          style={{
            minWidth: hp(20),
            minHeight: hp(20),
            borderRadius: 15,
            backgroundColor: "#D3EEF9",
            marginBottom: hp(2),
            alignItems: "center",
          }}
        ></TouchableOpacity>
        <TouchableOpacity
          style={{
            minWidth: hp(20),
            minHeight: hp(20),
            borderRadius: 15,
            backgroundColor: "#D3EEF9",
            marginBottom: hp(2),
            alignItems: "center",
          }}
        ></TouchableOpacity>
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
