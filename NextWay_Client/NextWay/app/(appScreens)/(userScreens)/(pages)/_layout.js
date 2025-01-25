
import React, { useEffect, useState } from 'react'
import { Drawer } from 'expo-router/drawer';
import { Ionicons } from '@expo/vector-icons';
import customdrawercontent from '../../../../components/DrawerContent/customdrawercontent';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { fetchNotification } from '../../../../services/fetchingService';
import { auth } from '../../../../firebaseConfig/firebaseConfiguration';
import { Text, View } from 'react-native';

export default function _layout() {

  const [notifications, setNotifications] = useState(0);

  useEffect(() => {
    const getNotifications = async () => {
      try {
        const response = await fetchNotification();
        if (response.success && response.data.length > 0) {
          const notifi = response.data.filter(
            (noti) =>
              noti.userId === auth?.currentUser?.uid || noti.userId === "all"
          );
          const unread = notifi.filter((noti) => noti.read === false).length;
          setNotifications(unread)
        } else {
          console.log("No notifications found");
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };
    getNotifications();
    const interval = setInterval(getNotifications, 60000);
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
      name="(notifications)" 
      options={{
        drawerLabel: ({ focused, color }) => (
          <View style={{ flexDirection: 'row', alignItems: 'right' }}>
            <Text style={{ fontSize: 18, color }}>
              Notifications
            </Text>
           
            {notifications > 0 && (
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
        title: 'Notifications',
        headerShown:false,
        drawerIcon:({size,color})=>(
          <Ionicons name="notifications" size={size} color={color} />
        ),
        drawerLabelStyle: {
          fontSize: 18, 
        },
      }}
    />


        <Drawer.Screen
      name="(profile)" 
      options={{
        drawerLabel: ({ focused, color }) => (
          <View style={{ flexDirection: 'row', alignItems: 'right' }}>
            <Text style={{ fontSize: 18,marginLeft:6, color }}>
             Profile
            </Text>
           
    
          </View>
        ),
        title: 'Profile',
        headerShown:false,
        drawerIcon:({size,color})=>(
          <FontAwesome name="user" size={size} color={color}/>
        
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