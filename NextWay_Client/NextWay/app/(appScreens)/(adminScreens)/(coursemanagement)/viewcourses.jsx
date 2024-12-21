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
  useWindowDimensions,
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
import {
  fetchCoursesByName,
  fetchCourseByUNICODE,
  fetchCourses,
} from "../../../../services/fetchingService";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import Loading from "../../../../components/Loading/Loading";

export default function ViewCourses() {
  const router = useRouter();
  const { t } = useTranslation();
  const [allcourses, setAllCourses] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [courses, setCourses] = useState([]);
  const [searchType, setSearchType] = useState("UNICODE");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAllCourses = async () => {
      try {
        const res = await fetchCourses(); 
        if (res.success && res.data.length > 0) {
          setAllCourses(res.data);
        } else {
          console.log("No courses found");
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchAllCourses();
  }, []);

  useEffect(() => {
    if (keyword === "") {
      setCourses([]);
    }
  }, [keyword]);

  const FirstRoute = () => (
    <View style={[styles.scene]}>
      <ScrollView>
        {allcourses
          .filter((course) => course.STREAM === "Physical")
          .map((course, index) => (
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
                  style={[styles.tableCell, { flex: 0.5, textAlign: "center" }]}
                >
                  {course.UNICODE}
                </Text>
                <Text style={styles.tableCell}>{course.COURSE}</Text>
                <Text style={styles.tableCell}>{course.UNIVERSITY}</Text>
              </View>
            </Pressable>
          ))}
      </ScrollView>
    </View>
  );

  const SecondRoute = () => (
    <View style={[styles.scene]}>
      <ScrollView>
        {allcourses
          .filter((course) => course.STREAM === "Biology")
          .map((course, index) => (
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
                  style={[styles.tableCell, { flex: 0.5, textAlign: "center" }]}
                >
                  {course.UNICODE}
                </Text>
                <Text style={styles.tableCell}>{course.COURSE}</Text>
                <Text style={styles.tableCell}>{course.UNIVERSITY}</Text>
              </View>
            </Pressable>
          ))}
      </ScrollView>
    </View>
  );

  const ThirddRoute = () => (
    <View style={[styles.scene]}>
      <ScrollView>
        {allcourses
          .filter((course) => course.STREAM === "Commerce")
          .map((course, index) => (
            <Pressable
              key={index}
              onPress={() => {
                router.push({
                  pathname: "coursedisplayer",
                  params: { course: JSON.stringify(course) },
                });
              }}
            >
              <View style={styles.tableRow}>
                <Text
                  style={[styles.tableCell, { flex: 0.5, textAlign: "center" }]}
                >
                  {course.UNICODE}
                </Text>
                <Text style={styles.tableCell}>{course.COURSE}</Text>
                <Text style={styles.tableCell}>{course.UNIVERSITY}</Text>
              </View>
            </Pressable>
          ))}
      </ScrollView>
    </View>
  );

  const FourthRoute = () => (
    <View style={[styles.scene]}>
      <ScrollView>
        {allcourses
          .filter((course) => course.STREAM === "Technology")
          .map((course, index) => (
            <Pressable
              key={index}
              onPress={() => {
                router.push({
                  pathname: "coursedisplayer",
                  params: { course: JSON.stringify(course) },
                });
              }}
            >
              <View style={styles.tableRow}>
                <Text
                  style={[styles.tableCell, { flex: 0.5, textAlign: "center" }]}
                >
                  {course.UNICODE}
                </Text>
                <Text style={styles.tableCell}>{course.COURSE}</Text>
                <Text style={styles.tableCell}>{course.UNIVERSITY}</Text>
              </View>
            </Pressable>
          ))}
      </ScrollView>
    </View>
  );

  const FifththRoute = () => (
    <View style={[styles.scene]}>
      <ScrollView>
        {allcourses
          .filter((course) => course.STREAM === "Art")
          .map((course, index) => (
            <Pressable
              key={index}
              onPress={() => {
                router.push({
                  pathname: "coursedisplayer",
                  params: { course: JSON.stringify(course) },
                });
              }}
            >
              <View style={styles.tableRow}>
                <Text
                  style={[styles.tableCell, { flex: 0.5, textAlign: "center" }]}
                >
                  {course.UNICODE}
                </Text>
                <Text style={styles.tableCell}>{course.COURSE}</Text>
                <Text style={styles.tableCell}>{course.UNIVERSITY}</Text>
              </View>
            </Pressable>
          ))}
      </ScrollView>
    </View>
  );

  const SixthRoute = () => (
    <View style={[styles.scene]}>
      <ScrollView>
        {allcourses
          .filter((course) => course.STREAM === "Common")
          .map((course, index) => (
            <Pressable
              key={index}
              onPress={() => {
                router.push({
                  pathname: "coursedisplayer",
                  params: { course: JSON.stringify(course) },
                });
              }}
            >
              <View style={styles.tableRow}>
                <Text
                  style={[styles.tableCell, { flex: 0.5, textAlign: "center" }]}
                >
                  {course.UNICODE}
                </Text>
                <Text style={styles.tableCell}>{course.COURSE}</Text>
                <Text style={styles.tableCell}>{course.UNIVERSITY}</Text>
              </View>
            </Pressable>
          ))}
      </ScrollView>
    </View>
  );

  const renderScene = SceneMap({
    1: FirstRoute,
    2: SecondRoute,
    3: ThirddRoute,
    4: FourthRoute,
    5: FifththRoute,
    6: SixthRoute,
  });

  const routes = [
    { key: "1", title: "Physical" },
    { key: "2", title: "Biology" },
    { key: "3", title: "Commerce" },
    { key: "4", title: "Technology" },
    { key: "5", title: "Art" },
    { key: "6", title: "Common" },
  ];

  const layout = useWindowDimensions();
  const [index, setIndex] = React.useState(0);

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
            {t("view_courses")}
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
            {t("search_course")}
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
              onPress={() => setSearchType("UNICODE")}
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
              <Text style={{ fontSize: hp(2.5) }}>{t("By UNICODE")}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setSearchType("NAME")}
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
              <Text style={{ fontSize: hp(2.5) }}>{t("By Name")}</Text>
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
                searchType === "UNICODE" ? t("Enter UNICODE") : t("Enter Name")
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
                  {t("Search")}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={{ flex: 5, width: "98%" }}>
          {courses.length > 0 && keyword ? (
            <ScrollView style={styles.courseTable}>
              <View style={styles.tableHeader}>
                <Text style={styles.tableHeaderCell}>{t("UNICODE")}</Text>
                <Text style={styles.tableHeaderCell}>{t("course")}</Text>
                <Text style={styles.tableHeaderCell}>{t("university")}</Text>
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
                    <Text style={[styles.tableCell,{ flex: 0.5, textAlign: "center" }]}>{course.UNICODE}</Text>
                    <Text style={styles.tableCell}>{course.COURSE}</Text>
                    <Text style={styles.tableCell}>{course.UNIVERSITY}</Text>
                  </View>
                </Pressable>
              ))}
            </ScrollView>
          ) : (
            <TabView
              navigationState={{ index, routes }}
              renderScene={renderScene}
              onIndexChange={setIndex}
              initialLayout={{ width: layout.width }}
              renderTabBar={(props) => (
                <TabBar
                  {...props}
                  scrollEnabled={true} // Enables horizontal scrolling
                  indicatorStyle={{ backgroundColor: "white" }} // Tab indicator styling
                  style={{ backgroundColor: "#149BC6", width: "98%" }} // Tab bar background styling
                  tabStyle={{ width: 110 }} // Adjust tab width
                  labelStyle={{ fontSize: 14, color: "white" }} // Tab label styling
                />
              )}
            />
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
    width:"100%",
    paddingVertical: 10,
    marginBottom: 5,
    zIndex: 10,
  },
  tableHeaderCell: {
    flex: 1,
    fontWeight: "bold",
    textAlign: "center",
    width:"100%",
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
