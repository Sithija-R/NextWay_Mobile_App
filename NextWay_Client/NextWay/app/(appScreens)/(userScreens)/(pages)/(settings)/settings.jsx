import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Pressable,
  Modal,
  FlatList,
  StyleSheet,
  Button,
} from "react-native";
import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useRouter } from "expo-router";
import CustomHeader from "../../../../../components/CustomHeader/customheader";
import { useTranslation } from "react-i18next";
import i18next from "i18next";
import { languageResources } from "../../../../../i18n";
import languagesList from "../../../../../services/languagesList.json";
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from "date-fns";



export default function Settings() {
  const router = useRouter();

  const [visible, setVisible] = useState(false);
  const { t } = useTranslation();

  const changeLng = (lng) => {
    i18next.changeLanguage(lng);
    setVisible(false);
  };



  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setShow(false);
    setDate(currentDate);
  };

  const showMode = (currentMode) => {
    setShow(true);
   
  };

  const showDatepicker = () => {
    showMode('date');
  };




  return (
    <View style={{ flex: 1 }}>
      <StatusBar style="dark" />
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
          source={require("../../../../../assets/images/elipses.png")}
        />
      </View>
      <View>
         
         
      <Button onPress={showDatepicker} title="Show date picker!" />
      <Text>Selected Date: {format(date, "dd/MM/yyyy")}</Text>

      {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode={mode}
          is24Hour={true}
          onChange={onChange}
        />
      )}


      </View>

      

    
      <View style={{ alignItems: "flex-end", zIndex: -1 }}>
        <Image
          style={{
            width: hp(15),
            height: hp(14),
          }}
          resizeMode="stretch"
          source={require("../../../../../assets/images/bottomEllipse.png")}
        />
      </View>
    </View>
  );
}

