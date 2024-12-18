import { View, Text, Pressable, Image, TouchableOpacity } from "react-native";
import React from "react";

import { StatusBar } from "expo-status-bar";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { router, useRouter } from "expo-router";
import CustomHeader from "../../../../components/CustomHeader/customheader";
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather';


export default function coursemanagement() {
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
          source={require("../../../../assets/images/elipses.png")}
        />
      </View>

      <View
        style={{
          alignItems: "center",
          flex: 4,
          flexDirection: "row",
          justifyContent: "space-between",
          flexWrap: "wrap",
        }}
      >
        <TouchableOpacity
        onPress={()=>router.push('addcourse')}
          style={{
            backgroundColor: "#EEEEEE",
            paddingVertical: hp(2),
            paddingHorizontal: wp(5),
            width: "100%",
            alignItems:'center',
            flexDirection:'row',
            justifyContent:'space-between',
            marginTop:hp(2)
          }}
        >
          <FontAwesome5 name="book-open" size={24} color="black" />
          <Text style={{ fontSize: hp(2.5), fontWeight: "600" }}>
            Add Course
          </Text>
          <FontAwesome6 name="add" size={24} color="black" />
        </TouchableOpacity>

        <TouchableOpacity
         onPress={()=>router.push('deletecourses')}
          style={{
            backgroundColor: "#EEEEEE",
            paddingVertical: hp(2),
            paddingHorizontal: wp(5),
            width: "100%",
            alignItems:'center',
            flexDirection:'row',
            justifyContent:'space-between',
            marginTop:hp(2)
          }}
        >
          <MaterialIcons name="delete" size={32} color="black" />
          <Text style={{ fontSize: hp(2.5), fontWeight: "600" }}>
            Delete Course
          </Text>
          <AntDesign name="right" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            backgroundColor: "#EEEEEE",
            paddingVertical: hp(2),
            paddingHorizontal: wp(5),
            width: "100%",
            alignItems:'center',
            flexDirection:'row',
            justifyContent:'space-between',
            marginTop:hp(2)
          }}
        >
        <MaterialIcons name="edit-document" size={24} color="black" />
          <Text style={{ fontSize: hp(2.5), fontWeight: "600" }}>
           View & Edit Course
          </Text>
          <AntDesign name="right" size={24} color="black" />
        </TouchableOpacity>
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
