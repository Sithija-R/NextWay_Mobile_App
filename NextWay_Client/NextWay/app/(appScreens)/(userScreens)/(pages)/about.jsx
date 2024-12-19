import { View, Text } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native';

export default function About() {
  const navigation = useNavigation(); // Access the navigation object

  return (
    <View style={styles.container} >
      <Text style={styles.text}>About</Text>
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    marginBottom: 20,
  },
});