
import React from 'react'
import { Drawer } from 'expo-router/drawer';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import customdrawercontent from '../../../components/DrawerContent/customdrawercontent';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

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
      name="dashboard" 
      options={{
        drawerLabel: 'Dashboard',
        title: 'Dashboard',
        headerShown:false,
        drawerIcon:({size,color})=>(    
          <MaterialIcons name="dashboard" size={size} color={color}/>
        ),
        drawerLabelStyle: {
          fontSize: 18, 
           marginLeft:3
        },
      }}
    />
        <Drawer.Screen
      name="(usermanagement)" 
      options={{
        drawerLabel: 'User Management',
        title: 'User Management',
        headerShown:false,
        drawerIcon:({size,color})=>(
          <FontAwesome5 name="users-cog" size={size} color={color}/>
        ),
        drawerLabelStyle: {
          fontSize: 18, 
         
        },
      }}
    />
       <Drawer.Screen
      name="(coursemanagement)" 
      options={{
        drawerLabel: 'Course Management',
        title: 'Course Management',
        headerShown:false,
        drawerIcon:({size,color})=>(
          <FontAwesome6 name="clipboard-list" size={size} color={color} />
        ),
        drawerLabelStyle: {
          fontSize: 18, 
           marginLeft:8
        },
      }}
    />
    <Drawer.Screen
      name='(setting)'
      options={{
        drawerLabel: 'Settings',
        title: 'Settings',
        headerShown:false,
        drawerIcon:({size,color})=>(
          <SimpleLineIcons name="settings" size={size} color={color}/>
        ),
        drawerLabelStyle: {
          fontSize: 18, 
           marginLeft:2
        },
      }}
    />

    </Drawer>
    


  )
}