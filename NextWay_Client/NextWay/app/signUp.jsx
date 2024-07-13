import { View, Text, Image, TextInput, TouchableOpacity, Pressable } from 'react-native'
import React from 'react'
import { StatusBar } from 'expo-status-bar'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { useRouter } from 'expo-router';


export default function signUp() {

  const router = useRouter();




  return (
    <View style={{ flex: 1}}>
      <StatusBar style='dark'/>
      <View style={{flex:1, alignItems:'flex-start'}}>

    <Image
      style={{
        width:hp(27),
        height:hp(20)
      }}
       resizeMode='stretch'
      source={require('../assets/images/elipses.png')}
    />
      </View>
    <View style={{ alignItems: 'center', flex: 5 }}>
      <Image
        style={{ height: hp(15) }}
        resizeMode="contain"
        source={require('../assets/images/Logo.png')}
      />
      <View style={{width:'100%', paddingHorizontal:wp(7)}}>
        <Text style={{fontSize:hp(3),fontWeight:'600'}}>Sign Up</Text>
        <Text style={{fontSize:hp(2)}}>create your NextWay account</Text>
        <View style={{marginTop:hp(2),paddingVertical:hp(2), gap:hp(1)}}>

        <TextInput
          style={{fontSize:hp(2),backgroundColor:'#D9D9D9', paddingHorizontal:wp(3),paddingVertical:hp(2),borderRadius:20}}
          placeholder='Name'
          />
          <TextInput
          style={{fontSize:hp(2),backgroundColor:'#D9D9D9', paddingHorizontal:wp(3),paddingVertical:hp(2),borderRadius:20}}
          placeholder='Email'
          />
           <TextInput
          style={{fontSize:hp(2),backgroundColor:'#D9D9D9', paddingHorizontal:wp(3),paddingVertical:hp(2),borderRadius:20}}
          placeholder='create password'
          />
           <TextInput
          style={{fontSize:hp(2),backgroundColor:'#D9D9D9', paddingHorizontal:wp(3),paddingVertical:hp(2),borderRadius:20}}
          placeholder='confirm password'
          />
       
        </View>

        <TouchableOpacity style={{
            backgroundColor:'#149BC6',
            padding:hp(2),
           borderRadius:40
        }}>
           <Text style={{fontSize:hp(3),fontWeight:'600', textAlign:'center', color:'white'}}>Sign Up</Text>
        </TouchableOpacity>

      </View>
      <View style={{flexDirection:'row', justifyContent:'center', marginTop:hp(1) }}>

          <Text
            style={{ fontSize: hp(2)  }}
          >Already have an account?
          </Text>
          <Pressable onPress={() => router.push("signIn")}>
              <Text style={{ fontWeight: "bold",fontSize: hp(2) }}>  Sign In</Text>
            </Pressable>
          </View>
    </View>
    <View style={{ alignItems:'flex-end', zIndex:-1}}>

    <Image
      style={{
        width:hp(15),
        height:hp(14)
      }}
       resizeMode='stretch'
      source={require('../assets/images/bottomEllipse.png')}
    />
    </View>
  </View>
  )
}