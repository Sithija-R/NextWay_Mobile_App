import React from 'react';
import { View, TouchableOpacity } from 'react-native';

import { Ionicons } from '@expo/vector-icons'; // Use any icon library you prefer
import { useNavigation } from 'expo-router';
import { DrawerActions } from '@react-navigation/native';


export default function customheader() {

    const navigation = useNavigation();


    const handleToggle=()=>{
      
      navigation.dispatch(DrawerActions.openDrawer())
    }
  
    return (
      <View style={{ flexDirection: 'row', alignItems: 'center', padding: 10 }}>
        <TouchableOpacity onPress={handleToggle}>
          <Ionicons name="menu" size={35} color="black" />
        </TouchableOpacity>
      </View>
    );
  };
    

