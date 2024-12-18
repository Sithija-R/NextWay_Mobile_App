import { View, Text, Pressable, Image, TouchableOpacity } from 'react-native'
import React from 'react'

import { StatusBar } from 'expo-status-bar';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { router, useRouter } from "expo-router";
import CustomHeader from "../../../../components/CustomHeader/customheader";

export default function usermanagement() {

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

    <View style={{alignItems: "center", flex: 4, flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap'}}>
<TouchableOpacity style={{backgroundColor:'#EEEEEE'}}><Text>User Role Management</Text></TouchableOpacity>

 
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
  )
}