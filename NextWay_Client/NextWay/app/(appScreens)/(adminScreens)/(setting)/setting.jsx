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
  import React, { useState } from "react";
  import { StatusBar } from "expo-status-bar";
  import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
  } from "react-native-responsive-screen";
  import { useRouter } from "expo-router";
  import CustomHeader from "../../../../components/CustomHeader/customheader";
  import { useTranslation } from "react-i18next";
  import i18next from "i18next";

  export default function Setting() {
    const router = useRouter();
  
    const [visible, setVisible] = useState(false);
    const { t } = useTranslation();
  
    const changeLng = (lng) => {
      i18next.changeLanguage(lng);
      setVisible(false);
    };
  
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
        <View>
            <Text>
                sss
            </Text>
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
  
 