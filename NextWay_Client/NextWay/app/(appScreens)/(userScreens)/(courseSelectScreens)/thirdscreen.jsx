import {
  View,
  Text,
  TouchableOpacity,
  Pressable,
  Image,
  Alert,
  TextInput,
  Modal,
  ScrollView,
} from "react-native";
import React, { useRef, useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import CustomHeader from "../../../../components/CustomHeader/customheader";
import { useLocalSearchParams, useRouter } from "expo-router";
import CustomKeyboardView from "../../../../components/keyboardView/CustomKeyboardView";
import { CheckBox, Icon } from "react-native-elements";
import { fetchCoursesByCriteria } from "../../../../services/fetchingService";
import Loading from "../../../../components/Loading/Loading";
import { Dropdown } from "react-native-element-dropdown";
import { StyleSheet } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useTranslation } from "react-i18next";
import i18next from "i18next";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import axios from 'axios';

export default function firstScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { stream, subjects, results } = useLocalSearchParams();
  const [visible, setVisible] = useState(false);

  const { t } = useTranslation();
  const currentLanguage = i18next.language;

  const zscoreRef = useRef("");
  const [interest, setInterest] = useState("");

  const [selectedOptions, setSelectedOptions] = useState({
    zscore: false,
    interest: false,
  });

  const [district, setDistrict] = useState(null);
  const [isDistrictFocus, setDistrictFocus] = useState(false);

  const districts = t("districts", { returnObjects: true });
  const [responses, setResponses] = useState(Array(10).fill(""));

console.log("respones ",responses)

  const questionarrie = t("questions", { returnObjects: true });

  const handleOptionSelect = (questionIndex, optionKey) => {
    setResponses((prevResponses) => {
      const newResponses = [...prevResponses];
      newResponses[questionIndex] = optionKey;
      return newResponses;
    });
  };


  const handleSubmit = async () => {
    //for android emulator use "http://10.0.2.2:5001/predict"
    //others "http://localhost:5001/predict"
    const apiUrl = "http://127.0.0.1:5001/predict";
    const data = { responses: responses };
    console.log("Sending data: ", data);
  
    try {
      const response = await axios.post(apiUrl, data);
      
      if (response.status === 200 && response.data?.prediction) {
        setInterest(response.data.prediction);
        Alert.alert("Prediction", `Interest : ${response.data.prediction}`);
        setVisible(false)
      } else {
        throw new Error("Invalid response from backend");
        setVisible(false)
      }
    } catch (error) {
      console.error("API Error: ", error);
      Alert.alert("Error", "Failed to get prediction from backend.");
    }
  };
  


  const handleNext = async () => {
    const zScore = selectedOptions.zscore ? zscoreRef.current : null;
    const interests = selectedOptions.interest ? interest : null;

    if (district === null) {
      Alert.alert(t("warning"), t("district-warning"));
      return;
    }
    if (!selectedOptions.zscore && !selectedOptions.interest) {
      Alert.alert(t("warning"), t("select-warning"));
      return;
    }

    if (selectedOptions.zscore && !zScore) {
      Alert.alert(t("warning"), t("z-score-enter-warning"));
      return;
    }
    if (selectedOptions.zscore && isNaN(zScore)) {
      Alert.alert(t("warning"), t("z-score-number-warning"));
      return;
    }

    if (selectedOptions.interest && !interests) {
      Alert.alert(t("warning"), t("interest-warning"));
      return;
    }
    if (selectedOptions.interest && typeof interests !== "string") {
      Alert.alert(t("warning"), "Interest must be a valid string.");
      return;
    }

    setLoading(true);

    let response = await fetchCoursesByCriteria(
      stream,
      subjects,
      results,
      zScore,
      interest,
      district
    );

    setLoading(false);

    if (response && response.success) {
      router.push({
        pathname: "fourthscreen",
        params: {
          response: JSON.stringify(response.data),
          district,
        },
      });
    } else {
      Alert.alert("Error", "Failed to fetch courses. Please try again.");
    }
  };

  const handleCheckboxPress = (option) => {
    setSelectedOptions((prevOptions) => ({
      ...prevOptions,
      [option]: !prevOptions[option],
    }));
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
            style={{
              width: hp(27),
              height: hp(20),
            }}
            resizeMode="stretch"
            source={require("../../../../assets/images/elipses.png")}
          />
        </View>

        <View style={{ flex: 4, alignItems: "center" }}>
          <Image
            style={{ height: hp(17) }}
            resizeMode="contain"
            source={require("../../../../assets/images/Logo.png")}
          />

          <View
            style={{
              marginTop: hp(4),
              width: "80%",
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: hp(2.8),
            }}
          >
            <View
              style={{
                flexDirection: "row",
                height: hp(6),
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Ionicons name="location-sharp" size={28} color="#149BC6" />
              <Text
                style={{
                  fontSize: currentLanguage == "en" ? hp(3) : hp(2.2),
                  fontWeight: "600",
                  textAlign: "center",
                  marginBottom: hp(1.5),
                  marginLeft: wp(5),
                }}
              >
                {t("district")}
              </Text>
            </View>

            <Dropdown
              style={[
                styles.dropdown,
                isDistrictFocus && { borderColor: "blue" },
              ]}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              iconStyle={styles.iconStyle}
              data={districts}
              search
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder={!isDistrictFocus ? t("select") : "..."}
              searchPlaceholder="Search..."
              value={district}
              onFocus={() => setDistrictFocus(true)}
              onBlur={() => setDistrictFocus(false)}
              onChange={(item) => {
                setDistrict(item.value);
                setDistrictFocus(false);
              }}
            />
          </View>

          <View
            style={{
              marginTop: hp(4),
              width: "80%",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                height: hp(6),
                alignItems: "center",
              }}
            >
              <CheckBox
                center
                checkedIcon={
                  <Icon name="radio-button-checked" size={24} color="#FB6602" />
                }
                uncheckedIcon="circle-o"
                checked={selectedOptions.zscore}
                onPress={() => handleCheckboxPress("zscore")}
                containerStyle={{
                  backgroundColor: "transparent",
                  borderWidth: 0,
                  padding: 0,
                }}
              />
              <Text
                style={{
                  fontSize: currentLanguage == "en" ? hp(3) : hp(2.2),
                  fontWeight: "600",
                  textAlign: "center",
                  marginBottom: hp(1),
                }}
              >
                {t("z-score")}
              </Text>
            </View>

            <TextInput
              onChangeText={(value) => (zscoreRef.current = value)}
              style={{
                fontSize: hp(2),
                backgroundColor: "#D9D9D9",
                paddingHorizontal: wp(3),
                paddingVertical: hp(1),
                borderRadius: 15,
                minWidth: wp(40),
                maxWidth: wp(40),
                marginBottom: hp(3),
              }}
              placeholder={t("enter-z")}
              editable={selectedOptions.zscore}
             
            />
          </View>

          <View
            style={{
              marginTop: hp(4),
              width: "80%",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                height: hp(6),
                alignItems: "center",
              }}
            >
              <CheckBox
                center
                checkedIcon={
                  <Icon name="radio-button-checked" size={24} color="#FB6602" />
                }
                uncheckedIcon="circle-o"
                checked={selectedOptions.interest}
                onPress={() => handleCheckboxPress("interest")}
                containerStyle={{
                  backgroundColor: "transparent",
                  borderWidth: 0,
                  padding: 0,
                }}
              />
              <Text
                style={{
                  fontSize: currentLanguage == "en" ? hp(3) : hp(2.2),
                  fontWeight: "600",
                  textAlign: "center",
                  marginBottom: hp(1),
                }}
              >
                {t("interest")}
              </Text>
            </View>

            <View>
              <TextInput
                onChangeText={(value) => setInterest(value)}
                style={{
                  fontSize: hp(2),
                  backgroundColor: "#D9D9D9",
                  paddingHorizontal: wp(3),
                  paddingVertical: hp(1),
                  borderRadius: 15,
                  minWidth: wp(40),
                  maxWidth: wp(40),
                  marginBottom: hp(1.5),
                }}
                placeholder={t("enter-interest")}
                editable={selectedOptions.interest}
                value={interest}
              />
              <Pressable onPress={()=>setVisible(true)}>
                <Text
                  style={{
                    marginLeft: wp(5),
                    fontSize: currentLanguage == "en" ? hp(1.8) : hp(1.4),
                    color: "#149BC6",
                  }}
                >
                  {" "}
                  {t("find-interest")}
                </Text>
              </Pressable>
            </View>
          </View>

          {loading ? (
            <View
              style={{
                marginTop: hp(8),
                flexDirection: "row",
                justifyContent: "center",
              }}
            >
              <Loading size={hp(10)} />
            </View>
          ) : (
            <TouchableOpacity
              onPress={handleNext}
              style={{
                marginTop: hp(8),
                backgroundColor: "#149BC6",
                padding: hp(1.5),
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
                {t("next")}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </CustomKeyboardView>

      <Modal
        visible={visible}
        animationType="slide"
        transparent={true}
        onRequestClose={()=>setVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
           

            <FontAwesome
              onPress={() => setVisible(false)}
              name="close"
              size={24}
              color="black"
              style={{ position: "absolute", top: hp(1), right: hp(2) }}
            />
           
                <View style={{marginTop:hp(3)}}>

            <ScrollView contentContainerStyle={styles.qcontainer}>
              <Text style={styles.qheading}>{t('answer_questions')}</Text>
              {questionarrie.map((item, index) => (
                <View key={item.key} style={styles.qquestionContainer}>
                  <Text style={styles.qquestion}>{item.label}</Text>
                  {item.options.map((option) => (
                    <TouchableOpacity
                      key={option.key}
                      style={[
                        styles.qoption,
                        responses[index] === option.key &&
                          styles.qselectedOption,
                      ]}
                      onPress={() => handleOptionSelect(index, option.key)}
                    >
                      <Text
                        style={[
                          styles.qoptionText,
                          responses[index] === option.key &&
                            styles.qselectedOptionText,
                        ]}
                      >
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              ))}
              <TouchableOpacity onPress={handleSubmit} style={styles.qbutton}>
                <Text style={styles.qbuttonText}>{t('submit')}</Text>
              </TouchableOpacity>
            </ScrollView>
                </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "80%",
    backgroundColor: "#E9E9E9",
    padding: 16,
  },
  dropdown: {
    width: wp(40),
    height: hp(5),
    borderColor: "gray",
    backgroundColor: "#E9E9E9",
    borderWidth: 0.5,
    borderRadius: 20,
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
    fontSize: wp(4),
  },
  placeholderStyle: {
    fontSize: hp(2),
    color: "gray",
    paddingLeft: wp(2),
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Background dimming
  },
  modalContent: {
    width: wp(95),
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    alignItems: "flex-start",
    maxHeight: hp(95),
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalImage: {
    width: wp(80),
    height: hp(30),
    borderRadius: 10,
    marginBottom: 20,
  },
  modalText: {
    fontSize: 14,
    textAlign: "left",
    marginBottom: 8,
    fontWeight: "bold",
  },
  modalDescription: {
    fontSize: 14,
    textAlign: "left",
    marginBottom: 20,
  },
  modalLink: {
    fontSize: 14,
    color: "blue",
    textDecorationLine: "underline",
    marginBottom: 20,
  },

  qcontainer: {

    padding: 20,

    backgroundColor: "#f5f5f5",
  

  },
  qquestionContainer: {

    marginBottom: 50,
 
  },
  qheading: {
    marginTop: 40,
    marginBottom: 20,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  qquestion: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  qoption: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 10,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  qselectedOption: {
    backgroundColor: "#0288D1",
    borderColor: "#0288D1",
  },
  qoptionText: {
    color: "#333",
    fontSize: 14,
  },
  qselectedOptionText: {
    color: "#fff",
    fontWeight: "bold",
  },
  qbutton: {
    backgroundColor: "#149BC6",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  qbuttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
