import {
  View,
  Text,
  TouchableOpacity,
  Pressable,
  Image,
  Alert,
  TextInput,
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

export default function firstScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { year, stream, subjects, results } = useLocalSearchParams();

  const zscoreRef = useRef("");
  const interestRef = useRef("");

  const [selectedOption, setSelectedOption] = useState("");



  const handleNext = async () => {
    const zScore = zscoreRef.current;
    const interest = interestRef.current;

    if (!selectedOption) {Alert.alert("Warning!", "Please select an option.");
      return;
    }

    if (selectedOption === "Z score") {
      if (!zScore) {Alert.alert("Warning!", "Please enter your Z score.");
        return;
      }
      if (isNaN(zScore)) {Alert.alert("Warning!", "Z score must be a numerical value.");
        return;
      }

      setLoading(true);
      const response = await fetchCoursesByCriteria(stream,subjects,results,zScore);
      setLoading(false);
      
      if (response && response.success) {
        router.push({
          pathname: "fourthscreen",
          params: {
            response: JSON.stringify(response.data),
          },
        });
      } 
      else {
        Alert.alert("Error", "Failed to fetch courses. Please try again.");
      }
    } 

    else if (selectedOption === "Interest") {
      if (!interest) {
        Alert.alert("Warning!", "Please enter your interest.");
        return;
      }
    }
  };


  const handleCheckboxPress = (option) => {
    setSelectedOption(option);
  };

  return (
    <View style={{ flex: 1 }}>
      <StatusBar style="dark" />
      <CustomKeyboardView>
        <View style={{ flex: 1, alignItems: "flex-start" }}>
          <Pressable
            style={{ position: "absolute", top: hp(5), left: wp(2), zIndex: 5 }}
          >
            <CustomHeader />
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
            }}
          >
            <View
              style={{
                flexDirection: "row",
                height: hp(5),
                alignItems: "center",
              }}
            >
              <CheckBox
                center
                checkedIcon={
                  <Icon name="radio-button-checked" size={24} color="#FB6602" />
                }
                uncheckedIcon="circle-o"
                checked={selectedOption === "Z score"}
                onPress={() => handleCheckboxPress("Z score")}
                containerStyle={{
                  backgroundColor: "transparent",
                  borderWidth: 0,
                  padding: 0,
                }}
              />
              <Text
                style={{
                  fontSize: hp(3),
                  fontWeight: "600",
                  textAlign: "center",
                  marginBottom: hp(1),
                }}
              >
                Z score
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
                maxWidth: wp(50),
                marginBottom: hp(3),
              }}
              placeholder="Enter Z-score"
              editable={selectedOption === "Z score"}
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
                height: hp(5),
                alignItems: "center",
              }}
            >
              <CheckBox
                center
                checkedIcon={
                  <Icon name="radio-button-checked" size={24} color="#FB6602" />
                }
                uncheckedIcon="circle-o"
                checked={selectedOption === "Interest"}
                onPress={() => handleCheckboxPress("Interest")}
                containerStyle={{
                  backgroundColor: "transparent",
                  borderWidth: 0,
                  padding: 0,
                }}
              />

              <Text
                style={{
                  fontSize: hp(3),
                  fontWeight: "600",
                  textAlign: "center",
                  marginBottom: hp(1),
                }}
              >
                Interest
              </Text>
            </View>
            <View>

            <TextInput
              onChangeText={(value) => (interestRef.current = value)}
              style={{
                fontSize: hp(2),
                backgroundColor: "#D9D9D9",
                paddingHorizontal: wp(3),
                paddingVertical: hp(1),
                borderRadius: 15,
                minWidth: wp(40),
                maxWidth: wp(50),
                marginBottom: hp(1.5),
              }}
              placeholder="Enter Interest"
              editable={selectedOption === "Interest"}
            />
            <Pressable
            onPress={()=>router.push('interest')}><Text style={{marginLeft:wp(5), fontSize:hp(1.8), color:'#149BC6'}}>find your interest</Text></Pressable>
            </View>

          </View>
          {loading ? (
                <View style={{  marginTop: hp(8),flexDirection: 'row', justifyContent: 'center' }}>
                  <Loading size={hp(10)} />
                </View>
              ) : (
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
                  Next
                </Text>
              </TouchableOpacity>
              )}

        
        </View>

        <View style={{ alignItems: "flex-end", zIndex: -1, marginTop: hp(12) }}>
          <Image
            style={{
              width: hp(15),
              height: hp(14),
            }}
            resizeMode="stretch"
            source={require("../../../../assets/images/bottomEllipse.png")}
          />
        </View>
      </CustomKeyboardView>
    </View>
  );
}
