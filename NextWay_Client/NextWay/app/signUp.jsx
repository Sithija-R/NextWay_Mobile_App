import { View, Text, Image, TextInput, TouchableOpacity, Pressable, Alert } from 'react-native'
import React, { useRef, useState } from 'react'
import { StatusBar } from 'expo-status-bar'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { useRouter } from 'expo-router';
import CustomKeyboardView from '../components/keyboardView/CustomKeyboardView';
import { registerUser } from '../services/authService';
import Loading from '../components/Loading/Loading';

// SignUp Component
export default function signUp() {

  const router = useRouter();
  const [loading,setLoading] = useState(false);

  // Refs to store input values
  const emailRef = useRef("");
  const nameRef = useRef("");
  const passwordRef = useRef("");
  const passwordConfirmRef = useRef("");


 // Function to handle user registration
const handleRegister= async()=>{
  if (!emailRef.current || !passwordRef.current || !nameRef.current || !passwordConfirmRef.current) {
    Alert.alert('Sign In',"All fields are required!");
    return;
}
  else if(passwordRef.current != passwordConfirmRef.current){
  Alert.alert("Sign Up", 'passwords not match!')
}

  // Set loading to true while waiting for registration response
  setLoading(true);
  let response = await registerUser(emailRef.current.trim(),passwordRef.current,nameRef.current);
  setLoading(false);

  if (!response.success) {
    Alert.alert('Sign Up',response.msg)
    
  }

}

  return (
   
    <View style={{ flex: 1}}>
      <StatusBar style='dark'/>
      <CustomKeyboardView>
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
          onChangeText={value => nameRef.current = value}
          style={{fontSize:hp(2),backgroundColor:'#D9D9D9', paddingHorizontal:wp(3),paddingVertical:hp(2),borderRadius:20}}
          placeholder='Name'
          />
          <TextInput
          onChangeText={value => emailRef.current = value}
          style={{fontSize:hp(2),backgroundColor:'#D9D9D9', paddingHorizontal:wp(3),paddingVertical:hp(2),borderRadius:20}}
          placeholder='Email'
          />
           <TextInput
           onChangeText={value => passwordRef.current = value}
           secureTextEntry
          style={{fontSize:hp(2),backgroundColor:'#D9D9D9', paddingHorizontal:wp(3),paddingVertical:hp(2),borderRadius:20}}
          placeholder='create password'
          />
           <TextInput
           onChangeText={value => passwordConfirmRef.current = value}
           secureTextEntry
          style={{fontSize:hp(2),backgroundColor:'#D9D9D9', paddingHorizontal:wp(3),paddingVertical:hp(2),borderRadius:20}}
          placeholder='confirm password'
          />
       
        </View>


        <View>
            {loading?(
              <View style={{flexDirection:'row', justifyContent:'center'}}> 
                <Loading size={hp(10)}/>
              </View>
            ):(

<TouchableOpacity 
        onPress={handleRegister}
        style={{
            backgroundColor:'#149BC6',
            padding:hp(2),
           borderRadius:40
        }}>
           <Text style={{fontSize:hp(3),fontWeight:'600', textAlign:'center', color:'white'}}>Sign Up</Text>
        </TouchableOpacity>



            )}
          </View>



        

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
  </CustomKeyboardView>
  </View>
  )
}