import { View, Text, Image, TouchableOpacity, Pressable } from "react-native";
import React from "react";
import { StatusBar } from "expo-status-bar";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { Link, useRouter } from "expo-router";
import { logoutUser } from "../../../../services/authService";
import CustomHeader from "../../../../components/CustomHeader/customheader";
import CustomPressable from "../../../../components/CustomPressable/customPressable";


export default function Home() {

  const router = useRouter();



  return (
    <View style={{ flex: 1 }}>
      <StatusBar style="dark" />
      <View style={{ flex: 1, alignItems: "flex-start" }}>
        <Pressable style={{position:'absolute',top:hp(5),left:wp(2), zIndex:5}}>
          <CustomHeader/>
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

      <View style={{ alignItems: "center", flex: 4 }}>
        <Image
          style={{ height: hp(25) }}
          resizeMode="contain"
          source={require("../../../../assets/images/Logo.png")}
        />

        <Text style={{ fontSize: hp(4), fontWeight: "600", textAlign: "center" }}>
          Welcome to{"\n"}
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

        <View style={{ alignItems: "center", marginTop: hp(7) }}>
          
          <TouchableOpacity 
          onPress={()=>router.push('firstscreen')} 
          style={{
              backgroundColor: "#149BC6",
              padding: hp(2),
              borderRadius: 40,
              width: wp(80),
            }}>
              <Text
              style={{
                fontSize: hp(3),
                fontWeight: "600",
                textAlign: "center",
                color: "white",
              }}
            >
                Find the Course
            </Text>

          </TouchableOpacity>

          <TouchableOpacity
            style={{
              marginTop: hp(3),
              backgroundColor: "#149BC6",
              padding: hp(2),
              borderRadius: 40,
              width: wp(80),
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
              Advertisement
            </Text>
          </TouchableOpacity>
        </View>
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
