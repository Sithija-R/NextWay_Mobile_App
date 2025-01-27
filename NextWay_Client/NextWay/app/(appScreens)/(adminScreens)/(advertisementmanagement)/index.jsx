import { View, Text, Pressable, Image, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";

import { StatusBar } from "expo-status-bar";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useRouter } from "expo-router";
import CustomHeader from "../../../../components/CustomHeader/customheader";
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import AntDesign from '@expo/vector-icons/AntDesign';
import { getAdRequest } from "../../../../services/adminService";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { getAdevertisements } from "../../../../services/advertiseService";

export default function AdvertisementManagement() {
  const router = useRouter();


  const [pendingCount, setPendingCount] = useState(0); 


  useEffect(() => {
    const fetchAds = async () => {
      try {
        const res = await getAdevertisements();
        if (res.success && res.data.length > 0) {
          const pendingAdsCount = res.data.filter(ad => ad.pending === true).length;
          setPendingCount(pendingAdsCount);
          return;
        } 
      } catch (error) {
        console.error("Error fetching ads:", error);
      }
    };
  
    fetchAds();
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
        onPress={()=>router.push('admanagement')}
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
          <FontAwesome6 name="clipboard-list" size={28} color="black" />
          <Text style={{ fontSize: hp(2.5), fontWeight: "600" }}>
          New Advertisement
          </Text>
          {pendingCount > 0 ? (
            <MaterialCommunityIcons name="new-box" size={32} color="#149BC6" />
          ) : (
            <AntDesign name="right" size={24} color="black" />
          )}
        </TouchableOpacity>

        <TouchableOpacity
         onPress={()=>router.push('advertisementhistory')}
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

     <FontAwesome5 name="history" size={28} color="black" />
        
          <Text style={{ fontSize: hp(2.5), fontWeight: "600" }}>
            Advertisement History
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
