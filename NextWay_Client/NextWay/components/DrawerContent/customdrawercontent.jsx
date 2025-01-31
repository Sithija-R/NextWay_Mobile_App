import { View, Text, Pressable, Image } from "react-native";
import React from "react";
import {
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { logoutUser } from "../../services/authService";
import { useNavigation } from "expo-router";
import { DrawerActions } from "@react-navigation/native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useTranslation } from "react-i18next";

export default function customdrawercontent(props) {
  const { bottom } = useSafeAreaInsets();
  const navigation = useNavigation();
  const { t } = useTranslation();

  const handleLogout = () => {
    navigation.dispatch(DrawerActions.closeDrawer());
    logoutUser();
  };

  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView {...props}>
        <View style={{ alignItems: "center" }}>
          <Image
            source={require("../../assets/images/Logo.png")}
            style={{ height: 150, width: 150 }}
            resizeMode="contain"
          />
        </View>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>
      <View
        style={{
          alignItems: "center",
          marginBottom: bottom+hp(3),
        }}
      >
        <Pressable
          onPress={handleLogout}
          style={{
            backgroundColor: "#149BC6",
            padding: hp(2),
            borderRadius: 40,
            width: wp(50),
            alignItems: "center",
          }}
        >
          <Text
            style={{ fontSize: hp(2.3), textAlign: "center", color: "white" }}
          >
            {t('logout')}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
