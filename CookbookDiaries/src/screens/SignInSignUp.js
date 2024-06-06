import React, { useRef } from 'react';
import { Text, View, Image, StyleSheet, Button, TouchableOpacity} from 'react-native';
import LogoImage from '../../assets/images/Logo.png';
import { fonts } from "../utilities/fonts";

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
          fontFamily: fonts.Bold,
        }}> 
          Cook some good food today!
        </Text>
      </View>

      {/* Button to go to next page */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style = {[styles.buttonWrapper, {backgroundColor: '#ff8271'}]}
                          onPress = {() => navigation.navigate('SignIn')}>
          <Text style = {styles.loginButtonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity style = {styles.buttonWrapper}
                          onPress = {() => navigation.navigate('SignUp')}>
          <Text style = {styles.signupButtonText}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  ); 
}

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: "row",
    borderWidth: 1,
    width: '90%',
    borderRadius: 100, // Border radius to make it rounded
    height: 70,
    borderColor: '#ff8271',
  },

  loginButtonText: { 
    fontSize: 24,
    fontFamily: 'Poppins-SemiBold',
    color: '#ffffff',
    textAlign: 'center',
  },

  signupButtonText: { 
    fontSize: 24,
    fontFamily: 'Poppins-SemiBold',
    color: '#ff8271',
    textAlign: 'center',
  },

  buttonWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '50%',
    borderRadius: 98,
  }
});