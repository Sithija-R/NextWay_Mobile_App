import { View, Text } from 'react-native'
import React from 'react'
import { Slot, Stack, useRouter, useSegments } from 'expo-router'
import { AuthProvider, useAuth } from '../context/authContext'
import { useEffect } from 'react'



const MainLayout = () => {
  const { isAuthenticated, userRole } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (typeof isAuthenticated == 'undefined'){
      return
    };

    const inApp = segments[0] == 'appScreens';

    if (isAuthenticated && !inApp) {
      
      if (userRole === 'admin') {
        router.replace('dashboard');
      } else {
        router.replace('home');
      }
    } else if (isAuthenticated === false) {
     
      router.replace('signIn');
    }
  }, [isAuthenticated, userRole]);

  return <Slot />;
};



export default function _layout() {
  return (
 <AuthProvider>
    <MainLayout/>
 </AuthProvider>
  )
}