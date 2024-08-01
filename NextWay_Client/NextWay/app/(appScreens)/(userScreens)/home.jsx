import { View, Text, Pressable, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import { logoutUser } from '../../../services/authService';
import { StatusBar } from 'expo-status-bar';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Link } from 'expo-router';

export default function Home() {

  const handleLogout = async () => {
    await logoutUser();
  };

  return (
    <View style={{ flex: 1 }}>
      <StatusBar style="dark" />
      <View style={{ flex: 1, alignItems: 'flex-start' }}>
        <Image
          style={{
            width: hp(27),
            height: hp(20),
          }}
          resizeMode="stretch"
          source={require('../../../assets/images/elipses.png')}
        />
      </View>

      <View style={{ alignItems: 'center', flex: 4 }}>
        <Image
          style={{ height: hp(25) }}
          resizeMode="contain"
          source={require('../../../assets/images/Logo.png')}
        />

        <Text style={{ fontSize: hp(4), fontWeight: '600', textAlign: 'center' }}>
          Welcome to{'\n'}
          <Text style={{ fontSize: hp(4), fontWeight: '600', textAlign: 'center', color: '#EC7117' }}>Nextway</Text>
        </Text>

        <View style={{ alignItems: 'center', marginTop: hp(4) }}>
          <Link href="firstScreen" asChild>
            <TouchableOpacity
              style={{
                marginVertical: hp(2), backgroundColor: '#149BC6', padding: hp(2), borderRadius: 40, width: wp(80),
              }}
            >
              <Text style={{ fontSize: hp(3), fontWeight: '600', textAlign: 'center', color: 'white' }}>
                Find the Course
              </Text>
            </TouchableOpacity>
          </Link>

          <TouchableOpacity
            style={{
              backgroundColor: '#149BC6', padding: hp(2), borderRadius: 40, width: wp(80),
            }}
          >
            <Text style={{ fontSize: hp(3), fontWeight: '600', textAlign: 'center', color: 'white' }}>
              More Courses
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
          onPress={handleLogout}
            style={{
              backgroundColor: '#149BC6', padding: hp(2), borderRadius: 40, width: wp(80),
            }}
          >
            <Text style={{ fontSize: hp(3), fontWeight: '600', textAlign: 'center', color: 'white' }}>
             Logout
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={{ alignItems: 'flex-end', zIndex: -1 }}>
        <Image
          style={{
            width: hp(15),
            height: hp(14),
          }}
          resizeMode="stretch"
          source={require('../../../assets/images/bottomEllipse.png')}
        />
      </View>
    </View>
  );
}
