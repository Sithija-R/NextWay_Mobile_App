import { View, Text, Pressable, Image } from 'react-native'
import React from 'react'
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { logoutUser } from '../../services/authService';
import { useNavigation } from 'expo-router';
import { DrawerActions } from '@react-navigation/native';

export default function customdrawercontent(props) {

const {bottom} = useSafeAreaInsets();
const navigation = useNavigation();

const handleLogout=()=>{
    navigation.dispatch(DrawerActions.closeDrawer());
    logoutUser();
}

  return (
    <View style={{flex:1}}>
     <DrawerContentScrollView {...props}>
        <View style={{alignItems:'center'}}>
            <Image source={require('../../assets/images/Logo.png')} style={{height:150, width:150}} resizeMode='contain'/>
        </View>
        {/* <DrawerItemList {...props}/> */}
     </DrawerContentScrollView>
     <Pressable onPress={handleLogout} style={{padding:20,paddingBottom:bottom+30}}>
        <Text>Logout</Text>
     </Pressable>
    </View>
  )
}