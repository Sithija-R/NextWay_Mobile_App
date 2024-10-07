import {
  View,
  Text,
  TouchableOpacity,
  Pressable,
  Image,
  Alert,
} from "react-native";
import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import CustomHeader from "../../../../components/CustomHeader/customheader";
import { StyleSheet } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useLocalSearchParams, useRouter } from "expo-router";
import CustomKeyboardView from "../../../../components/keyboardView/CustomKeyboardView";
import { useTranslation } from "react-i18next";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function SecondScreen() {
  const router = useRouter();
  const { year, stream } = useLocalSearchParams();

  const {t} = useTranslation();

  const [subjects, setSubjects] = useState(Array(3).fill(null));
  const [results, setResults] = useState(Array(3).fill(null));
  const [focus, setFocus] = useState(Array(6).fill(false)); 
  const [subjectOptions, setSubjectOptions] = useState([]);

  const grades = [
    { label: "A", value: "A" },
    { label: "B", value: "B" },
    { label: "C", value: "C" },
    { label: "S", value: "S" },
    { label: "F", value: "F" },
  ];

  const subjectData= t('subjectData', { returnObjects: true });
  const streams= t('streams', { returnObjects: true });



  
  useEffect(() => {
    if (stream && subjectData[stream.toLowerCase()]) {
      setSubjectOptions(subjectData[stream.toLowerCase()]);
    }
  }, [stream]);

console.log(subjectOptions)
  useEffect(() => {
    // If subjectOptions contains at least 3 elements
    if (subjectOptions.length >= 3) {
      const firstThreeSubjects = subjectOptions.slice(0, 3).map(option => option.value);
      setSubjects(firstThreeSubjects);
    }
  }, [subjectOptions]);


  const getStreamLabel = (value) => {
    const stream = streams.find(stream => stream.value === value);
    return stream ? stream.label : 'Unknown'; // Default to 'Unknown' if no match
  };

  const handleDropdownChange = (index, type, value) => {
    if (type === "subject") {
      const newSubjects = [...subjects];
      newSubjects[index] = value;
      setSubjects(newSubjects);
    } else if (type === "result") {
      const newResults = [...results];
      newResults[index] = value;
      setResults(newResults);
    }
  };

  const handleFocusChange = (index, type, isFocused) => {
    const newFocus = [...focus];
    newFocus[type === "subject" ? index : index + 3] = isFocused;
    setFocus(newFocus);
  };
  
  
  const handleNext = () => {
    
    if (year && stream && subjects.every(Boolean) && results.every(Boolean)) {
    //  console.log(subjects, results)
      const uniqueSubjects = new Set(subjects);
      if (uniqueSubjects.size !== subjects.length) {
        Alert.alert(t('warning'), t('subject-warning'));
        return;
      }
      if (results.includes("F")) {
        Alert.alert(t('warning'), t('pass-warning'));
        return;
      }
  
     
      router.push({
        pathname: "thirdscreen",
        params: {
          year: year,
          stream: stream,
          subjects: JSON.stringify(subjects),
          results: JSON.stringify(results),
        },
      });
    } else {
      Alert.alert(t('warning'), t('all-fields-required'));
    }
  };
  

  return (
    <View style={{ flex: 1 }}>
      <StatusBar style="dark" />
      <CustomKeyboardView>
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
          <Ionicons name="arrow-back" size={hp(3.5)} color="black" />
          <Text style={{ fontSize: wp(5), paddingLeft: wp(5) }}>
            {t("back")}
          </Text>
        </Pressable>

          <Image
            style={{ width: hp(27), height: hp(20) }}
            resizeMode="stretch"
            source={require("../../../../assets/images/elipses.png")}
          />
        </View>

        <View style={{ alignItems: "center", flex: 5 }}>
          <Image
            style={{ height: hp(14) }}
            resizeMode="contain"
            source={require("../../../../assets/images/Logo.png")}
          />

          <View
            style={{
              marginTop: 10,
              backgroundColor: "#149BC6",
              borderRadius: 20,
              paddingHorizontal: 25,
              paddingBottom: 25,
            }}
          >
            <Text
              style={{
                color: "white",
                fontSize: hp(3),
                textAlign: "center",
                paddingTop: hp(1.5),
              }}
            >
              {getStreamLabel(stream)}
            </Text>
            <View
              style={{
                marginTop: hp(1.5),
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                width: "85%",
              }}
            >
              <Text style={{ color: "white", paddingLeft: wp(2) }}>
                {t('subject')}
              </Text>
              <Text style={{ color: "white", paddingRight: wp(7) }}> {t('grade')}</Text>
            </View>

            {subjects.map((subject, index) => (
              <View
                key={index}
                style={{
                  marginTop: hp(4),
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  width: "85%",
                }}
              >
                <Dropdown
                  style={[
                    styles.dropdown1,
                    focus[index] && { borderColor: "blue" },
                  ]}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  inputSearchStyle={styles.inputSearchStyle}
                  iconStyle={styles.iconStyle}
                  data={subjectOptions} 
                 
                  maxHeight={300}
                  labelField="label"
                  valueField="value"
                  placeholder={!focus[index] ? `Subject ${index + 1}` : "..."}
                 
                  value={subject}
                  onFocus={() => handleFocusChange(index, "subject", true)}
                  onBlur={() => handleFocusChange(index, "subject", false)}
                  onChange={(item) =>
                    handleDropdownChange(index, "subject", item.value)
                  }
                  renderLeftIcon={() => (
                    <AntDesign
                      style={styles.icon}
                      color={focus[index] ? "#149BC6" : "gray"}
                      name="book"
                      size={25}
                    />
                  )}
                />

                <Dropdown
                  style={[
                    styles.dropdown2,
                    focus[index + 3] && { borderColor: "blue" },
                  ]}
                  placeholderStyle={styles.placeholderStyle2}
                  selectedTextStyle={styles.selectedTextStyle}
                  iconStyle={styles.iconStyle}
                  data={grades}
                  maxHeight={300}
                  labelField="label"
                  valueField="value"
                  placeholder={!focus[index + 3] ? t('grade') : "..."}
                  value={results[index]}
                  onFocus={() => handleFocusChange(index, "result", true)}
                  onBlur={() => handleFocusChange(index, "result", false)}
                  onChange={(item) =>
                    handleDropdownChange(index, "result", item.value)
                  }
                />
              </View>
            ))}
          </View>

          <TouchableOpacity
            onPress={handleNext}
            style={{
              marginTop: hp(8),
              backgroundColor: "#149BC6",
              padding: hp(2),
              borderRadius: 20,
              width: wp(60),
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
              {t('next')}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={{ alignItems: "flex-end", zIndex: -1 }}>
          <Image
            style={{ width: hp(15), height: hp(15) }}
            resizeMode="stretch"
            source={require("../../../../assets/images/bottomEllipse.png")}
          />
        </View>
      </CustomKeyboardView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: wp(90),
    backgroundColor: "#E9E9E9",
    padding: 16,
  },
  dropdown1: {
    width: wp(45),
    height: hp(6),
    borderColor: "gray",
    backgroundColor: "#E9E9E9",
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
    overflow: "hidden", // Ensure content doesn't overflow
  },
  dropdown2: {
    width: wp(25),
    height: hp(6),
    borderColor: "gray",
    backgroundColor: "#E9E9E9",
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  icon: {
    marginRight: wp(5),
  },
  label: {
    position: "absolute",
    backgroundColor: "white",
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: wp(3),
  },
  placeholderStyle: {
    fontSize: hp(2),
    color: "gray",
  },
  placeholderStyle2: {
    fontSize: hp(1.5),
    color: "gray",
  },
  selectedTextStyle: {
    fontSize: 16,
   
    whiteSpace: "nowrap", // Prevent text from wrapping
    overflow: "hidden", // Hide any overflowing text
    textOverflow: "ellipsis", // Add ellipsis if text overflows
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});
