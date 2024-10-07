import {
    View,
    Text,
    Pressable,
    Image,
    ScrollView,
    StyleSheet,
  } from "react-native";
  import React from "react";
  import { StatusBar } from "expo-status-bar";
  import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
  } from "react-native-responsive-screen";
  import CustomHeader from "../../../../components/CustomHeader/customheader";
  import { useLocalSearchParams, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import i18next from "i18next";
import Ionicons from "@expo/vector-icons/Ionicons";
  
  export default function FirstScreen() {
    const router = useRouter();
    const { response, district} = useLocalSearchParams();
  
    const {t}= useTranslation();
    const currentLanguage = i18next.language;
   
    let courses = [];
  
    if (response) {
      try {
       
        courses = JSON.parse(response);
        
      } catch (error) {
        console.error("Error parsing response:", error);
      }
    }
  
   
  
    return (
      <View style={{ flex: 1 }}>
        <StatusBar style="dark" />
  
        <Pressable
          onPress={() => router.back()}
          style={{
            position: "absolute",
            top: hp(5),
            left: wp(2),
            zIndex: 5,
            flexDirection: "row",
            marginTop: hp(1),
            alignItems: "center",
            width: "85%",
          }}
        >
          <Ionicons name="arrow-back" size={hp(3.5)} color="black" />
          <Text style={{ fontSize: wp(5), paddingLeft: wp(2) }}>
            {t("back")}
          </Text>
        </Pressable>
  
        <Image
          style={{
            width: hp(27),
            height: hp(20),
            position: "absolute",
            top: 0,
            left: 0,
          }}
          resizeMode="stretch"
          source={require("../../../../assets/images/elipses.png")}
        />
  
       
          <View style={{ alignItems: "center", marginBottom: hp(2) }}>
            <Image
              style={{ height: hp(17) }}
              resizeMode="contain"
              source={require("../../../../assets/images/Logo.png")}
            />
          </View>
          <ScrollView contentContainerStyle={{ flexGrow: 1, paddingHorizontal: wp(2) }}>
  
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderCell, { fontSize: currentLanguage == 'en' ? hp(2.5) : hp(2) }]}>{t('course')}</Text>
            <Text style={[styles.tableHeaderCell, { fontSize: currentLanguage == 'en' ? hp(2.5) : hp(2) }]}>{t('university')}</Text>
            <Text style={[styles.tableHeaderCell, { fontSize: currentLanguage == 'en' ? hp(2.5) : hp(2) }]}>{t('z-score')}</Text>
          </View>
  
          {courses.length > 0 ? (
            courses.map((course, index) => (
                <Pressable
            key={index}
            onPress={() => {
            
              router.push({
                pathname: "coursedisplayer",
                params: {
                  course: JSON.stringify(course), district
                },
              });
            }}
          >
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>{course.COURSE}</Text>
              <Text style={styles.tableCell}>{course.UNIVERSITY}</Text>
              <Text style={styles.tableCell}>{course.Z_SCORE[district]}</Text>
            </View>
          </Pressable>
            ))
          ) : (
            <Text style={{ textAlign: "center", marginTop: hp(5) }}>
              No courses available.
            </Text>
          )}
        </ScrollView>
  
        <Image
          style={{
            width: hp(15),
            height: hp(14),
            position: "absolute",
            bottom: 0,
            right: 0,
          }}
          resizeMode="stretch"
          source={require("../../../../assets/images/bottomEllipse.png")}
        />
      </View>
    );
  }
  
  const styles = StyleSheet.create({
    tableHeader: {
      flexDirection: "row",
      
      paddingVertical: 10,
      marginBottom: 5,
      zIndex:10
    },
    tableHeaderCell: {
      flex: 1,
      fontWeight: "bold",
      textAlign: "center",
    
     
    },
    tableRow: {
      flexDirection: "row",
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderBottomColor: "#ccc",
    },
    tableCell: {
      flex: 1,
      textAlign: "center",
      paddingLeft:wp(2)
    },
  });
  