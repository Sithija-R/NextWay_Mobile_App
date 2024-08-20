import React, { forwardRef } from 'react';
import { Pressable, Text } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const CustomPressable = forwardRef(({ children, style, textStyle, ...props }, ref) => (
    <Pressable
      ref={ref}
      style={[{
        marginVertical: hp(2),
        backgroundColor: "#149BC6",
        padding: hp(2),
        borderRadius: 40,
        width: wp(80),
      }, style]}
      {...props}
    >
      <Text
        style={[{
          fontSize: hp(3),
          fontWeight: "600",
          textAlign: "center",
          color: "white",
        }, textStyle]}
      >
        {children}
      </Text>
    </Pressable>
  ));
  
  export default CustomPressable;