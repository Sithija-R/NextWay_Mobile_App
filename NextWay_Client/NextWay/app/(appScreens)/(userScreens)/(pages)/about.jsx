import { View, Text } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native';

export default function About() {
  const navigation = useNavigation(); // Access the navigation object
  
  return (
    <View>
      <Text>About</Text>
    </View>
  )
}