
import React, { useEffect, useState } from 'react'
import { Drawer } from 'expo-router/drawer';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import customdrawercontent from '../../../components/DrawerContent/customdrawercontent';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { Text, View } from 'react-native';
import { getAdRequest } from '../../../services/adminService';

export default function _layout() {




  const [pendingCount, setPendingCount] = useState(0); 


  useEffect(() => {
    // Function to fetch ads
    const fetchAds = async () => {
      try {
        const res = await getAdRequest();
        if (res.success && res.data.length > 0) {
          const pendingAdsCount = res.data.filter(ad => ad.pending === true).length;
          setPendingCount(pendingAdsCount);
        }
      } catch (error) {
        console.error("Error fetching ads:", error);
      }
    };

    fetchAds();

    const interval = setInterval(fetchAds, 30000);
    return () => clearInterval(interval);

  }, []);


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
        drawerLabel: ({ focused, color }) => (
          <Text style={{ fontSize: 18, marginLeft: 2, color }}>
          User Management
        </Text>
        ),
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
        drawerLabel: ({ focused, color }) => (
          <Text style={{ fontSize: 18, marginLeft: 2, color }}>
          Course Management
        </Text>
        ),
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
  name="(advertisermanagement)"
  options={{
    drawerLabel: ({ focused, color }) => (
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Text style={{ fontSize: 18, marginLeft: 2, color }}>
          Advertiser Management
        </Text>
       
        {pendingCount > 0 && (
          <View
            style={{
              position: 'absolute',
              top: 3,
              right: 4,
              width: 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: 'red',
              marginLeft: 6, // Space between text and dot
            }}
          />
        )}
      </View>
    ),
    title: 'Advertiser Management',
    headerShown: false,
    drawerIcon: ({ size, color }) => (
      <FontAwesome5 name="user-tie" size={size} color={color} />
    ),
    drawerLabelStyle: {
      fontSize: 18,
      marginLeft: 2,
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