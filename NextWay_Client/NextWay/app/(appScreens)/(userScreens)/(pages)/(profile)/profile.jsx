import {
  View,
  Text,
  Image,
  Pressable,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { StatusBar } from "expo-status-bar";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { useRouter } from "expo-router";
import CustomHeader from "../../../../../components/CustomHeader/customheader";
import { useTranslation } from "react-i18next";
import i18next from "i18next";
import { Avatar } from "@rneui/themed";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Fontisto from "@expo/vector-icons/Fontisto";
import Feather from "@expo/vector-icons/Feather";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useAuth } from "../../../../../context/authContext";
import Entypo from '@expo/vector-icons/Entypo';


export default function Profile() {
  const router = useRouter();
  const { t } = useTranslation();
  const { user } = useAuth();

  const userInfo = [
    {
      icon: <MaterialCommunityIcons name="shield-account-outline" size={hp(4.5)} color="black" style={{ opacity: 0.5 }} />,
      label: t("username"),
      value: user?.username,
    },
    {
      icon: <Fontisto name="email" size={hp(4.2)} color="black" style={{ opacity: 0.5 }} />,
      label: t("email"),
      value: user?.email,
    },
    {
      icon: <MaterialIcons name="timeline" size={hp(4.2)} color="black" style={{ opacity: 0.5 }}/>,
      label: t("age"),
      value: user?.age,
    },
    {
      icon: <Feather name="phone" size={hp(4)} color="black" style={{ opacity: 0.5 }} />,
      label: t("phone"),
      value: user?.phoneNumber,
    },
  ];

  return (
    <View style={{ flex: 1 }}>
      <StatusBar style="dark" />
      <View style={{ flex: 1, alignItems: "flex-start" }}>
        
        <Pressable style={{ position: "absolute", top: hp(5), left: wp(2), zIndex: 5 }}>
          <CustomHeader />
        </Pressable>
     
      
        <Image
          style={{
            width: hp(27),
            height: hp(20),
          }}
          resizeMode="stretch"
          source={require("../../../../../assets/images/elipses.png")}
        />
      </View>

      <View style={{ flex: 4, alignItems: "center" }}>
        <Avatar
          size={hp(20)}
          rounded
          source={{
            uri:
              user?.profileImage ||
              "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541",
          }}
          containerStyle={{
            borderWidth: 5,
            borderColor: "rgba(0, 0, 0, 0.2)",
          }}
        />

        <View style={{ marginTop: hp(2), alignItems: "flex-start", width: "70%" }}>
          {userInfo.map((info, index) => (
            <View
              key={index}
              style={{
                marginTop: hp(3),
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              {info.icon}

              <View
                style={{
                  marginLeft: wp(5),
                  width: "90%",
                  borderBottomWidth: 1,
                  borderBottomColor: "rgba(0, 0, 0, 0.2)",
                  alignItems: "flex-start",
                  paddingBottom: hp(1),
                }}
              >
                <Text
                  style={{
                    fontSize: hp(2.5),
                    fontWeight: "600",
                    opacity: 0.5,
                  }}
                >
                  {info.label}
                </Text>
                <Text
                  style={{
                    fontSize: hp(2),
                    fontWeight: "600",
                  }}
                >
                  {info.value}
                </Text>
              </View>
            </View>
          ))}
        </View>

        <TouchableOpacity
          onPress={() => router.push("profileEdit")}
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginTop: hp(5),
            backgroundColor: "#D9D9D9",
            padding: hp(2),
            borderRadius: 10,
            width: wp(60),
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              fontSize: hp(2.6),
              fontWeight: "600",
              textAlign: "center",
              flex: 1,
            }}
          >
            {t("edit-profile")}
          </Text>
     

          <MaterialIcons
            name="navigate-next"
            size={hp(5)}
            color="black"
            style={{
              position: "absolute",
              right: hp(2),
              opacity: 0.5,
            }}
          />
        </TouchableOpacity>
      </View>

      <View style={{ alignItems: "flex-end", zIndex: -1 }}>
        <Image
          style={{
            width: hp(15),
            height: hp(14),
          }}
          resizeMode="stretch"
          source={require("../../../../../assets/images/bottomEllipse.png")}
        />
      </View>
    </View>
  );
}
