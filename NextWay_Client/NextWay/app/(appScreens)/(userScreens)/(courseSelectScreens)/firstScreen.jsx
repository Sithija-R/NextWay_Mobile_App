import { View, Text, Button } from 'react-native'
import React from 'react'
import { Link, useRouter } from 'expo-router'

export default function firstScreen() {

    const router = useRouter();

    const handleGoBack = () => {
      router.back(); // Navigate to the previous screen
    };

  return (
    <View>
      <Text>firstScreen</Text>
      <Link href="/secondscreen" asChild>
      <Button title='next'/>
      </Link>

      <Button onPress={handleGoBack} title='back'/>
    </View>
  )
}