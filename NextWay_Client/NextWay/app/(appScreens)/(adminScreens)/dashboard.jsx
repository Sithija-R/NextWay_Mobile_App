import { View, Text, Pressable } from 'react-native'
import React from 'react'
import { logoutUser } from '../../../services/authService';

export default function dashboard() {


  const handleLogout=async()=>{
    await logoutUser();
  }
  return (
    <View>
      <Text>dashboard</Text>
      <Pressable onPress={handleLogout}>
        <Text>LogOut</Text>
      </Pressable>
    </View>
  )
}