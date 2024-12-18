
import React from 'react'
import { Drawer } from 'expo-router/drawer';
import { Ionicons } from '@expo/vector-icons';
import customdrawercontent from '../../../../components/DrawerContent/customdrawercontent';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';

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
        ),
        drawerLabelStyle: {
          fontSize: 18, 
        },
      }}
    />
        <Drawer.Screen
      name="(profile)" 
      options={{
        drawerLabel: 'Profile',
        title: 'Profile',
        headerShown:false,
        drawerIcon:({size,color})=>(
          <Ionicons name='home' size={size} color={color}/>
        ),
        drawerLabelStyle: {
          fontSize: 18, 
        },
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
        ),
        drawerLabelStyle: {
          fontSize: 18, 
        },
      }}
    />
    <Drawer.Screen
      name='(settings)'
      options={{
        drawerLabel: 'Settings',
        title: 'Settings',
        headerShown:false,
        drawerIcon:({size,color})=>(
          <SimpleLineIcons name="settings" size={size} color={color}/>
        ),
        drawerLabelStyle: {
          fontSize: 18, 
        },
      }}
    />
     <Drawer.Screen
      name='languageChange'
      options={{
        drawerLabel: 'Language',
        title: 'Language',
        headerShown:false,
        drawerIcon:({size,color})=>(
          <MaterialIcons name="language" size={size} color={color} />
        ),
        drawerLabelStyle: {
          fontSize: 18, 
        },
      }}
    />
    </Drawer>
    


  )
}