import { View, Text, TouchableOpacity, Pressable, Image, Alert } from "react-native";
import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import CustomHeader from "../../../../components/CustomHeader/customheader";
import { StyleSheet } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useRouter } from "expo-router";
import CustomKeyboardView from "../../../../components/keyboardView/CustomKeyboardView";



export default function firstScreen() {

    const router = useRouter();

  const [year,setYear] = useState(null);
  const [stream,setStream] = useState(null);
  const [isYearFocus, setIsYearFocus] = useState(false);
  const [isStreamFocus, setIsStreamFocus] = useState(false);

  const years = [
    { label: "2024", value: "2024" },
    { label: "2023", value: "2023" },
    { label: "2022", value: "2022" },
    { label: "2021", value: "2021" },
    
  ];
  const streams = [
    { label: "Physical", value: "Physical" },
    { label: "Biology", value: "Biology" },
    { label: "Commerce", value: "Commerce" },
    { label: "Art", value: "Art" },
    { label: "Technology", value: "Technology" },
    { label: "Common", value: "Common" },
   
  ];

const handleNext=()=>{

   
    if(year&&stream){
        router.push({
            pathname: 'secondscreen',
            params: { year:year,stream:stream},
          });
    }
    else Alert.alert('Warning!','please select all fields')
}


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
     
      <View style={{ flex:5, alignItems: "center" }}>
        <Image
          style={{ height: hp(17) }}
          resizeMode="contain"
          source={require("../../../../assets/images/Logo.png")}
        />
        <View
        style={{
            marginTop:hp(4),

        }}>
          <Text
            style={{
              fontSize: hp(3),
              fontWeight: "600",
              textAlign: "center",
              marginBottom:hp(1)
            }}
          >
            Choose the Year
          </Text>

          <Dropdown
            style={[styles.dropdown, isYearFocus && { borderColor: "blue" }]}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            iconStyle={styles.iconStyle}
            data={years}
            search
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder={!isYearFocus ? "Year" : "..."}
            searchPlaceholder="Search..."
            value={year}
            onFocus={() => setIsYearFocus(true)}
            onBlur={() => setIsYearFocus(false)}
            onChange={(item) => {
              setYear(item.value);
              setIsYearFocus(false);
            }}
            renderLeftIcon={() => (
              <AntDesign
                style={styles.icon}
                color={isYearFocus ? "#149BC6" : "gray"}
                name="calendar"
                size={25}
              />
            )}
          />
        </View>

        <View 
         style={{
            marginTop:hp(5),
            
        }}>
          <Text
            style={{
              fontSize: hp(3),
              fontWeight: "600",
              textAlign: "center",
              marginBottom:hp(1)
            }}
          >
            Choose the Stream
          </Text>
          

          <Dropdown
            style={[styles.dropdown, isStreamFocus && { borderColor: "blue" }]}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            iconStyle={styles.iconStyle}
            data={streams}
            search
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder={!isStreamFocus ? "Stream" : "..."}
            searchPlaceholder="Search..."
            value={stream}
            onFocus={() => setIsStreamFocus(true)}
            onBlur={() => setIsStreamFocus(false)}
            onChange={(item) => {
              setStream(item.value);
              setIsStreamFocus(false);
            }}
            renderLeftIcon={() => (
              <AntDesign
                style={styles.icon}
                color={isStreamFocus ? "#149BC6" : "gray"}
                name="book"
                size={25}
              />
            )}
          />
        </View>
        <TouchableOpacity
        onPress={handleNext}
        style={{
            marginTop:hp(8),
            backgroundColor: "#149BC6",
            padding: hp(2),
            borderRadius: 20,
            width: wp(60),
          }}>
            <Text
            style={{
                fontSize: hp(3),
                fontWeight: "600",
                textAlign: "center",
                color: "white",
              }}>Next</Text>
        </TouchableOpacity>
      </View>

      <View style={{ alignItems: "flex-end", zIndex: -1 , marginTop:hp(4.5)}}>
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

const styles = StyleSheet.create({
  container: {
    width:wp(90),
    backgroundColor: "#E9E9E9",
    padding: 16,
  },
  dropdown: {
    width:wp(60),
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
    fontSize: wp(4),
  },
  placeholderStyle: {
    fontSize: hp(2.5),
    color:'gray'
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
});
