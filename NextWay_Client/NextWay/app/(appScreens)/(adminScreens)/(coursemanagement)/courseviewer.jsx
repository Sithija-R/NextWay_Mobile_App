import { View, Text, StyleSheet, Pressable, Image, ScrollView, TouchableOpacity } from "react-native";
import React from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
  } from "react-native-responsive-screen";
  import Ionicons from '@expo/vector-icons/Ionicons';
import { useTranslation } from "react-i18next";

export default function CourseDetailsScreen() {
  const { course,district } = useLocalSearchParams();

  const router = useRouter();
const{t}= useTranslation();

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
         <Text style={{fontSize:hp(2.5)}}>{t('back')}</Text>
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
  
       
         <View style={{flex:4,marginTop:hp(12), maxHeight:hp(85),alignItems:'center'}}>


            
          <View style={styles.container}>
      {parsedCourse ? (
        <>
          <Text style={styles.title}>{parsedCourse.COURSE}    <Text style={{color:'#149BC6'}}>{parsedCourse.UNICODE}</Text></Text>

          <View style={{ width: wp(90),maxHeight:hp(62), backgroundColor: 'rgba(128, 128, 128, 0.2)', padding:hp(2.2), borderRadius:15 }}>
        <ScrollView contentContainerStyle={{ flexGrow: 1, paddingHorizontal: wp(2) }}>


        <Text  style={styles.text}><Text style={styles.detailHeader}>Stream: </Text><Text style={styles.details} > {parsedCourse.STREAM}</Text> </Text>
          <Text  style={styles.text}><Text style={styles.detailHeader}>University: </Text><Text style={styles.details} > {parsedCourse.UNIVERSITY}</Text> </Text>
          <Text  style={styles.text}><Text style={styles.detailHeader}>Description: </Text><Text style={[styles.details,{fontWeight:'light'}]} > {parsedCourse.DESCRIPTION}</Text> </Text>
          <Text style={[styles.text,{marginBottom:2}]}><Text style={[styles.detailHeader]}>Qualifications:{"\n"}</Text>
  {Object.entries(parsedCourse.MINIMUM_QUALIFICATIONS.RequiredGrades).map(
    ([subject, grade], index) => (
      <Text  style={styles.details} key={index}>  {"\t"}
           {subject}: {grade}{"\n"}
      </Text>
    )
  )}
      
        
</Text>
          <Text  style={styles.text}><Text style={styles.detailHeader}>Z-Score</Text><Text style={styles.details}> {parsedCourse.Z_SCORE[district]}</Text> </Text>
          {Object.entries(parsedCourse.Z_SCORE).map(
    ([subject, grade], index) => (
      <Text  style={styles.details} key={index}>  {"\t"}
           {subject}: {grade}
      </Text>
    )
  )}


        </ScrollView>
          </View>
         
         
        </>
      ) : (
        <Text>No course details available.</Text>
      )}
    <TouchableOpacity
              
              style={{
                backgroundColor: "#149BC6",
                marginTop:hp(1),
                padding: hp(1),
                paddingHorizontal: wp(2),
                borderRadius: 10,
                minWidth:"80%"
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
                {t("Edit")}
              </Text>
            </TouchableOpacity>
    </View>

         </View>
  
         
      
  
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
    alignItems:'center',
 
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign:'center',
    width:wp(100)
  },
  detailHeader: {
    fontSize: 18,
    marginBottom: 8,
    fontWeight:'bold'
    
  },
  details:{
    fontSize: 18,
    marginBottom: 8,
    fontWeight:'normal'
  },
  text:{
    marginBottom:hp(2)
  }
  
});
