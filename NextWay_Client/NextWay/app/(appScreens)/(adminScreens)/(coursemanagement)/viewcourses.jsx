import {
  View,
  Text,
  Pressable,
  Image,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
  StyleSheet,

} from "react-native";
import React, { useEffect, useState } from "react";
import AntDesign from "@expo/vector-icons/AntDesign";
import { StatusBar } from "expo-status-bar";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import {
  fetchCoursesByName,
  fetchCourseByUNICODE,
  fetchCourses,
} from "../../../../services/fetchingService";
import Loading from "../../../../components/Loading/Loading";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { Tab, TabView } from "@rneui/themed";

export default function ViewCourses() {
  const router = useRouter();
  const [allcourses, setAllCourses] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [courses, setCourses] = useState([]);
  const [searchType, setSearchType] = useState("UNICODE");
  const [loading, setLoading] = useState(false);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (keyword === "") {
      setCourses([]);
    }
  }, [keyword]);

  useFocusEffect(
    React.useCallback(() => {
      const fetchAllCourses = async () => {
        try {
          const res = await fetchCourses();
          if (res?.success && Array.isArray(res.data)) {
            setAllCourses(res.data);
          } else {
            console.error("Invalid response format:", res);
          }
        } catch (error) {
          console.error("Error fetching courses:", error);
        }
      };
      fetchAllCourses();
    }, [])
  );

  const streams = [
    { key: "1", title: "Physical", value: "Physical" },
    { key: "2", title: "Biology", value: "Biological Science" },
    { key: "3", title: "Commerce", value: "Commerce" },
    { key: "4", title: "Engineering Technology", value: "ENGINEERING TECHNOLOGY (ET)" },
    { key: "5", title: "Arts", value: "Arts" },
    { key: "6", title: "Common", value: "Other" },
    {
      key: "7",
      title: "Biosystems Technology",
      value: "Biosystems Technology",
    },
  ];

  const handleSearch = async () => {
    if (!keyword) {
      Alert.alert("Please enter a search keyword");
      return;
    }

    setLoading(true);
    try {
      if (searchType === "UNICODE") {
        const response = await fetchCourseByUNICODE(keyword);
        if (response.success && response.data.length > 0) {
          setCourses([response.data[0]]);
        } else {
          Alert.alert("No course found with the provided UNICODE!");
          setCourses([]);
        }
      } else {
        const searchKeyword = keyword.toUpperCase();
        const response = await fetchCoursesByName(searchKeyword);
        if (response.success && response.data.length > 0) {
          setCourses(response.data);
        } else {
          Alert.alert("No courses found with the provided name!");
          setCourses([]);
        }
      }
    } catch (error) {
      Alert.alert("An error occurred while searching for courses.");
      console.error(error);
    }
    setLoading(false);
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
            View Courses
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
          flex: 8,
          justifyContent: "space-between",
          flexWrap: "wrap",
          paddingBottom: hp(2),
        }}
      >
        <View
          style={{
            flexWrap: "wrap",
            padding: wp(6),
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontSize: hp(3),
              fontWeight: "600",
              textAlign: "left",
            }}
          >
            Search Courses
          </Text>

          {/* Radio Button Section */}
          <View
            style={{
              width: "80%",
              alignItems: "center",
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: hp(2),
              marginBottom: hp(1),
            }}
          >
            <TouchableOpacity
              onPress={() => {
                setSearchType("UNICODE");
                setKeyword(null);
              }}
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginRight: wp(5),
              }}
            >
              <View
                style={{
                  width: hp(2),
                  height: hp(2),
                  borderRadius: hp(1),
                  borderWidth: 2,
                  borderColor: "#149BC6",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: wp(2),
                }}
              >
                {searchType === "UNICODE" && (
                  <View
                    style={{
                      width: hp(1),
                      height: hp(1),
                      borderRadius: hp(0.5),
                      backgroundColor: "#149BC6",
                    }}
                  />
                )}
              </View>
              <Text style={{ fontSize: hp(2.5) }}>By UNICODE</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setSearchType("NAME");
                setKeyword(null);
              }}
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  width: hp(2),
                  height: hp(2),
                  borderRadius: hp(1),
                  borderWidth: 2,
                  borderColor: "#149BC6",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: wp(2),
                }}
              >
                {searchType === "NAME" && (
                  <View
                    style={{
                      width: hp(1),
                      height: hp(1),
                      borderRadius: hp(0.5),
                      backgroundColor: "#149BC6",
                    }}
                  />
                )}
              </View>
              <Text style={{ fontSize: hp(2.5) }}>By Name</Text>
            </TouchableOpacity>
          </View>

          <View
            style={{
              marginTop: hp(2),
              flexDirection: "row",
              alignItems: "center",
              width: "100%",
              padding: hp(1),

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
              placeholder={
                searchType === "UNICODE" ? "Enter UNICODE" : "Enter Name"
              }
              onChangeText={setKeyword}
              autoCapitalize="characters"
            />

            {loading ? (
              <View style={{ flexDirection: "row", paddingHorizontal: wp(6) }}>
                <Loading size={hp(6)} />
              </View>
            ) : (
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
                  Search
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={{ flex: 5, width: "98%" }}>
          {courses.length > 0 && keyword ? (
            <ScrollView style={styles.courseTable}>
              <View style={styles.tableHeader}>
                <Text style={styles.tableHeaderCell}>UNICODE</Text>
                <Text style={styles.tableHeaderCell}>course</Text>
                <Text style={styles.tableHeaderCell}>university</Text>
              </View>
              {courses.map((course, index) => (
                <Pressable
                  key={index}
                  onPress={() => {
                    router.push({
                      pathname: "courseviewer",
                      params: { course: JSON.stringify(course) },
                    });
                  }}
                >
                  <View style={styles.tableRow}>
                    <Text
                      style={[
                        styles.tableCell,
                        { flex: 0.5, textAlign: "center" },
                      ]}
                    >
                      {course.UNICODE}
                    </Text>
                    <Text style={styles.tableCell}>{course.COURSE_eng}</Text>
                    <Text style={styles.tableCell}>
                      {course.UNIVERSITY_eng}
                    </Text>
                  </View>
                </Pressable>
              ))}
            </ScrollView>
          ) : (
            <>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={{ backgroundColor: "#149BC6", maxHeight: hp(10) }}
              >
                <Tab
                  value={index}
                  onChange={setIndex}
                  indicatorStyle={{ backgroundColor: "white", height: 4 }}
                  variant="default"
                >
                  {streams.map((stream) => (
                    <Tab.Item
                      key={stream.key}
                      title={stream.title}
                      titleStyle={{
                        fontSize: hp(2),
                        fontWeight: "bold",
                        color: "white",
                        minWidth: hp(20),
                      }}
                      containerStyle={{ width: 120 }}
                    />
                  ))}
                </Tab>
              </ScrollView>

              <TabView value={index} onChange={setIndex} animationType="spring">
                {streams.map((stream) => {
                  const filteredCourses = allcourses.filter(
                    (course) => course.STREAM === stream.value
                  );

                  return (
                    <TabView.Item key={stream.key} style={{ width: "100%", marginTop:hp(1) }}>
                      <ScrollView>
                        {filteredCourses.length > 0 ? (
                          filteredCourses.map((course, index) => (
                            <Pressable
                              key={index}
                              onPress={() => {
                                router.push({
                                  pathname: "courseviewer",
                                  params: { course: JSON.stringify(course) },
                                });
                              }}
                            >
                              <View
                                style={{
                                  flexDirection: "row",
                                  padding: 10,
                                  borderBottomWidth: 1,
                                  borderColor: "#ddd",
                                }}
                              >
                                <Text
                                  style={{
                                    flex: 0.5,
                                    textAlign: "center",
                                    fontWeight: "bold",
                                  }}
                                >
                                  {course.UNICODE}
                                </Text>
                                <Text style={{ flex: 1 }}>
                                  {course.COURSE_eng}
                                </Text>
                                <Text style={{ flex: 1 }}>
                                  {course.UNIVERSITY_eng}
                                </Text>
                              </View>
                            </Pressable>
                          ))
                        ) : (
                          <Text style={{ textAlign: "center", padding: 20 }}>
                            No courses found for {stream.title}!
                          </Text>
                        )}
                      </ScrollView>
                    </TabView.Item>
                  );
                })}
              </TabView>
            </>

          )}
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
  tableHeader: {
    flexDirection: "row",
    width: "100%",
    paddingVertical: 10,
    marginBottom: 5,
    zIndex: 10,
  },
  tableHeaderCell: {
    flex: 1,
    fontWeight: "bold",
    textAlign: "center",
    width: "100%",
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  tableCell: {
    flex: 1,
    textAlign: "left",
    paddingLeft: wp(2),
  },
});
