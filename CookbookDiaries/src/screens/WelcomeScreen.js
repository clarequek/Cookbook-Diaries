import { View, Text, Image, TouchableOpacity } from 'react-native'; 
import React, { useRef } from 'react';
import { StatusBar } from "expo-status-bar"; 
import LogoImage from '../../assets/images/Logo.png';
import { fonts } from '../utilities/fonts';
import { colors } from '../utilities/colors';

{/* height and widthPercentageToDP converts a percentage value into 
corresponding pizel value based on device screen height, ensures UI component scales
across different devices */}
import { 
  widthPercentageToDP as wp, 
  heightPercentageToDP as hp, 
} from "react-native-responsive-screen"; 
import { useNavigation } from '@react-navigation/native';
import LottieView from "lottie-react-native"; 
import Animated from 'react-native-reanimated';

export default function WelcomeScreen() {
  const animation = useRef(null); 
  const navigation = useNavigation(); 

  return (
    <View className = "bg-[#fff5e6] flex-1 justify-center items-center space-y-10 relative">
      <Image
        source={require("../../assets/images/background.png")}
        style = {{
          position: "absolute", 
          width: wp(100),
          height: hp(100), 
        }}
      />

      <StatusBar style = "light" />

      {/*Lottie Logo */}
      <View
        style = {{ 
          height : 200,
        }}>
        <LottieView autoPlay ref = {animation}
          style = {{
            width: 300, 
            height: 300, 
          }}
          source={require("../../assets/lottie/food-logo.json")}
          />
      </View>

      {/* Title and Subtitle */}
      <View className = "flex items-center space-y-2">
        <Image source={LogoImage} style={{ width: 300, height: 150 }} />
        <Text 
        className = "text-[#ff8271] tracking-widest font-medium"
        style = {{
          fontSize: hp(1.75),
          fontFamily: fonts.SemiBold
        }}> 
          Cook some good food today!
        </Text>
      </View>

      {/* Button to go to next page */}
      <View> 
        <TouchableOpacity
        style = {{
          backgroundColor: colors.pink,
          paddingHorizontal: hp(5), 
          paddingVertical: hp(1.5),
          borderRadius: hp(1.5),
        }}
        onPress = {() => navigation.navigate("SignInSignUp")}
        >
          <Text
            style = {{
              color: colors.white,
              fontSize: hp(2), 
              fontWeight: "medium",
              fontFamily: fonts.Bold,
            }}>
            Let's get started!
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  ); 
}



{/*
IN react native, the order in which components are declared in the JSX 
determines the order of rendering => overlapping 
*/}