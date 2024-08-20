import { View, Text } from 'react-native'
import React from 'react'
import { Drawer } from 'expo-router/drawer';
import { Ionicons } from '@expo/vector-icons';
import customdrawercontent from '../../../../components/DrawerContent/customdrawercontent';

export default function _layout() {
  return (
    <Drawer
    screenOptions={{
      drawerLabelStyle:{
        marginLeft: -20
      }
    }}
    drawerContent={customdrawercontent}
    >

      <Drawer.Screen
      name="home" 
      options={{
        drawerLabel: 'Home',
        title: 'home',
        headerShown:false,
        drawerIcon:({size,color})=>(
          <Ionicons name='home' size={size} color={color}/>
        )
      }}
    />
       <Drawer.Screen
      name="about" 
      options={{
        drawerLabel: 'About',
        title: 'About',
        headerShown:false,
        drawerIcon:({size,color})=>(
          <Ionicons name="information-circle" size={size} color={color}/>
        )
      }}
    />
    </Drawer>
    


  )
}