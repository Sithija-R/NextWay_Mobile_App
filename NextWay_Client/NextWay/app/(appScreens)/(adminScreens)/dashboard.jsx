import { View, Text, Pressable, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { logoutUser } from '../../../services/authService';
import { StatusBar } from 'expo-status-bar';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { router, useRouter } from "expo-router";
import CustomHeader from "../../../components/CustomHeader/customheader";

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

    <View style={{alignItems: "center", flex: 4, flexDirection: 'row', paddingHorizontal: hp(4), justifyContent: 'space-between', flexWrap: 'wrap'}}>
    <TouchableOpacity onPress={()=>router.push('usermanagement')} style={{minWidth: hp(20), minHeight: hp(20), borderRadius: 15, backgroundColor: "#D3EEF9", marginBottom: hp(2),alignItems:'center'}} >
      <Text>Manage Users</Text>
    </TouchableOpacity>
    <TouchableOpacity onPress={()=>router.push('coursemanagement')} style={{minWidth: hp(20), minHeight: hp(20), borderRadius: 15, backgroundColor: "#D3EEF9", marginBottom: hp(2),alignItems:'center'}} >
    <Text>Manage Courses</Text>
    </TouchableOpacity>
    <TouchableOpacity style={{minWidth: hp(20), minHeight: hp(20), borderRadius: 15, backgroundColor: "#D3EEF9", marginBottom: hp(2),alignItems:'center'}} ></TouchableOpacity>
    <TouchableOpacity style={{minWidth: hp(20), minHeight: hp(20), borderRadius: 15, backgroundColor: "#D3EEF9", marginBottom: hp(2),alignItems:'center'}} ></TouchableOpacity>
    <TouchableOpacity style={{minWidth: hp(20), minHeight: hp(20), borderRadius: 15, backgroundColor: "#D3EEF9", marginBottom: hp(2),alignItems:'center'}} ></TouchableOpacity>
    <TouchableOpacity style={{minWidth: hp(20), minHeight: hp(20), borderRadius: 15, backgroundColor: "#D3EEF9", marginBottom: hp(2),alignItems:'center'}} ></TouchableOpacity>
 
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
  )
}