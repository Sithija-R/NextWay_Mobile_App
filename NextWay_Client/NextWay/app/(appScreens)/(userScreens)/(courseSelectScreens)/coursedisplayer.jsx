import { View, Text, StyleSheet, Pressable, Image, ScrollView } from "react-native";
import React from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
  } from "react-native-responsive-screen";
  import CustomHeader from "../../../../components/CustomHeader/customheader";
  import Ionicons from '@expo/vector-icons/Ionicons';

export default function CourseDetailsScreen() {
  const { course } = useLocalSearchParams();

  const router = useRouter();


  const parsedCourse = course ? JSON.parse(course) : null;

  return (





<View style={{ flex: 1 }}>
        <StatusBar style="dark" />
  
        <Pressable
        onPress={()=>router.back(-1)}
          style={{
            position: "absolute",
            top: hp(7),
            left: wp(2),
            zIndex: 5,
            flexDirection:'row',
            alignItems:'center',
            justifyContent:'space-between'
          }}
        >
         <Ionicons name="arrow-back-outline" size={wp(8)} color="black" />
         <Text style={{fontSize:hp(2.5)}}>back</Text>
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
  
       
          <View style={{ alignItems: "center", marginBottom: hp(2), marginTop:hp(10) }}>
            <Image
              style={{ height: hp(17) }}
              resizeMode="contain"
              source={require("../../../../assets/images/Logo.png")}
            />
          </View>
          <ScrollView contentContainerStyle={{ flexGrow: 1, paddingHorizontal: wp(2) }}>
  
          <View style={styles.container}>
      {parsedCourse ? (
        <>
          <Text style={styles.title}>{parsedCourse.COURSE}    <Text style={{color:'#149BC6'}}>{parsedCourse.UNICODE}</Text></Text>
          <Text style={styles.detail}>University: {parsedCourse.UNIVERSITY}</Text>
          <Text style={styles.detail}>Z-Score: {parsedCourse.Z_SCORE}</Text>
          <Text style={styles.detail}>Description: {parsedCourse.DESCRIPTION}</Text>
         
        </>
      ) : (
        <Text>No course details available.</Text>
      )}
    </View>
         
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
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign:'center'
  },
  detail: {
    fontSize: 18,
    marginBottom: 8,
  },
});
