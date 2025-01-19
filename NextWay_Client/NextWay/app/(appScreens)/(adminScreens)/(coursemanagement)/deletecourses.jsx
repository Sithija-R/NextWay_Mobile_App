import {
  View,
  Text,
  Pressable,
  Image,
  TouchableOpacity,
  TextInput,
  Alert,
  StyleSheet,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import AntDesign from "@expo/vector-icons/AntDesign";
import { StatusBar } from "expo-status-bar";
import { useTranslation } from "react-i18next";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useRouter } from "expo-router";
import { deleteCourseById, fetchCourseByUNICODE } from "../../../../services/fetchingService";

export default function DeleteCourses() {
  // Initialize hooks for navigation and translation
  const router = useRouter();
  const { t } = useTranslation();
  // State variables for storing course UNICODE and details
  const [unicode, setUnicode] = useState(null);
  const [course, setCourse] = useState(null);


  const handleSearch = async () => {
    if (!unicode) {
      Alert.alert("Please enter UNICODE");
      return;
    }

    // Fetch course details from the service
    const response = await fetchCourseByUNICODE(unicode);

    if (response.success) {
      setCourse(response.data[0]);
    } else {
      Alert.alert("No Course Found!");
    }
  };

  // Function to handle course deletion
  const handleDeleteCourse = async () => {
    if (!course.id) {
      Alert.alert("Error", "Invalid course ID");
      return;
    }
  
    Alert.alert(
      "Delete Course", 
      "Are you sure you want to delete this course?", 
      [
        {
          text: "Cancel", 
          style: "cancel",
        },
        {
          text: "Delete", 
          style: "destructive", 
          onPress: async () => {
           
            console.log("deleted ",course.id)
            const response = await deleteCourseById(course.id);
  
            if (response.success) {
              Alert.alert("Success", response.msg);
              setCourse(null);
              
            } else {
              Alert.alert("Error", response.msg);
            }
          },
        },
      ]
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <StatusBar style="dark" />
      <View style={{ flex: 1, alignItems: "flex-start" }}>
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
          <AntDesign name="left" size={hp(3)} color="black" />
          <Text
            style={{ fontSize: wp(5), paddingLeft: wp(5), fontWeight: 600 }}
          >
            {t("delete_course")}
          </Text>
        </Pressable>

        <Image
          style={{ width: hp(27), height: hp(20) }}
          resizeMode="stretch"
          source={require("../../../../assets/images/elipses.png")}
        />
      </View>

      <View
        style={{
          alignItems: "center",
          flex: 4.5,

          justifyContent: "space-between",
          flexWrap: "wrap",
        }}
      >
        <View
          style={{
            flexWrap: "wrap",
            padding: wp(6),
          }}
        >
          <Text
            style={{
              fontSize: hp(3),
              fontWeight: "600",
              textAlign: "left",
            }}
          >
            {t("search_course")}
          </Text>
          <View
            style={{
              marginTop: hp(2),
              flexDirection: "row",
              alignItems: "center",
              width: "100%",
              padding: hp(1),
              marginBottom: hp(3),
              justifyContent: "space-between",
            }}
          >
            <TextInput
              style={{
                width: "60%",
                borderWidth: 2,
                borderColor: "rgba(0, 0, 0, 0.1)",
                borderRadius: 10,

                fontSize: hp(2.5),
                paddingHorizontal: wp(3),
                paddingVertical: hp(1),
                flex: 1,
                marginRight: wp(2),
              }}
              placeholder={t("UNICODE")}
              onChangeText={setUnicode}
              autoCapitalize="characters"
            />

            <TouchableOpacity
              onPress={handleSearch}
              style={{
                backgroundColor: "#149BC6",
                padding: hp(1),
                paddingHorizontal: wp(2),
                borderRadius: 10,
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
                {t("Search")}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.container}>
          {course ? (
            <>
              <Text style={styles.title}>
                {course.COURSE}{" "}
                <Text style={{ color: "#149BC6", marginLeft: wp(20) }}>
                  {course.UNICODE}
                </Text>
              </Text>

              <View
                style={{
                  width: wp(90),
                  maxHeight: hp(67),
                  backgroundColor: "rgba(128, 128, 128, 0.2)",
                  padding: hp(2.2),
                  borderRadius: 15,
                }}
              >
                <ScrollView
                  contentContainerStyle={{
                    flexGrow: 1,
                    paddingHorizontal: wp(2),
                  }}
                >
            

                  <Text style={styles.text}>
                    <Text style={styles.detailHeader}>Stream: </Text>
                    <Text style={styles.details}> {course.STREAM}</Text>{" "}
                  </Text>
                  <Text style={styles.text}>
                    <Text style={styles.detailHeader}>University: </Text>
                    <Text style={styles.details}>
                      {" "}
                      {course.UNIVERSITY}
                    </Text>{" "}
                  </Text>
                  <Text style={styles.text}>
                    <Text style={styles.detailHeader}>Description: </Text>
                    <Text style={[styles.details, { fontWeight: "light" }]}>
                      {" "}
                      {course.DESCRIPTION}
                    </Text>{" "}
                  </Text>
                </ScrollView>
                <TouchableOpacity
              onPress={handleDeleteCourse}
              style={{
              
                backgroundColor: "red",
                padding: hp(1),
                paddingHorizontal: wp(2),
                borderRadius: 10,
              }}
            >
              <Text
                style={{
                  fontSize: hp(3),
                paddingHorizontal:wp(20),
                  fontWeight: "600",
                  textAlign: "center",
                  color: "white",
                }}
              >
                {t("Delete")}
              </Text>
            </TouchableOpacity>
              </View>
              
            </>
          ) : (
            <Text> </Text>
          )}
        
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

// Styles for the component
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  detailHeader: {
    fontSize: 18,
    marginBottom: 8,
    fontWeight: "bold",
  },
  details: {
    fontSize: 18,
    marginBottom: 8,
    fontWeight: "normal",
  },
  text: {
    marginBottom: hp(2),
  },
});
