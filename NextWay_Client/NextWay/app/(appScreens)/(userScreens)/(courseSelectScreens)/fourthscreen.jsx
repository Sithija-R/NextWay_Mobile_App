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
  
  export default function FirstScreen() {
    const router = useRouter();
    const { response, district} = useLocalSearchParams();
  
   
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
          style={{
            position: "absolute",
            top: hp(5),
            left: wp(2),
            zIndex: 5,
          }}
        >
          <CustomHeader />
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
            <Text style={styles.tableHeaderCell}>Course</Text>
            <Text style={styles.tableHeaderCell}>University</Text>
            <Text style={styles.tableHeaderCell}>Z-Score</Text>
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
      fontSize:hp(2.5)
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
  