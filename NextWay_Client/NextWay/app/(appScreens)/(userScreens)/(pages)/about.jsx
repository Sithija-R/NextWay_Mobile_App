import { View, Text ,Button, StyleSheet} from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native';

export default function About() {
  const navigation = useNavigation(); // Access the navigation object

  return (
    <View style={styles.container} >
            <Text style={styles.title}>About</Text>
      <Text style={styles.description}>
        This is the About page of the app. It provides information about the app and its features.
      </Text>

    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    marginBottom: 20,
    lineHeight: 22,
  },
});