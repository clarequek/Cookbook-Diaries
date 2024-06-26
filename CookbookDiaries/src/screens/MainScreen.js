{/* TEMPORARY unless we cannot figure out bottom tab navigator */}

import { View, Text, Image, TouchableOpacity, Button } from 'react-native'; 
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

        <Button 
          title="Log Out" 
          onPress={() => navigation.navigate('Welcome')}
          color={colors.pink} />
  
        {/* Lottie Logo */}
        <View style={{ height: 200, marginTop: -70 }}>
          <LottieView
            autoPlay
            ref={animation}
            style={{ width: 250, height: 250 }}
            source={require("../../assets/lottie/drinksalad.json")}
          />
        </View>
  
        {/* Button to go to different places */}
        <View> 
          <TouchableOpacity
          style = {{
            backgroundColor: colors.pink,
            paddingHorizontal: hp(5), 
            paddingVertical: hp(1.5),
            borderRadius: hp(1.5),
            marginTop: 20,
            marginBottom: 20,
            alignItems: 'center',
          }}
          onPress = {() => navigation.navigate("Home")}
          >
            <Text
              style = {{
                color: colors.white,
                fontSize: hp(2), 
                fontWeight: "medium",
                fontFamily: fonts.Bold,
              }}>
              Find a new recipe
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
          style = {{
            backgroundColor: colors.pink,
            paddingHorizontal: hp(5), 
            paddingVertical: hp(1.5),
            borderRadius: hp(1.5),
            marginTop: 20,
            marginBottom: 20,
            alignItems: 'center',
          }}
          onPress = {() => navigation.navigate("GroceryList")}
          >
            <Text
              style = {{
                color: colors.white,
                fontSize: hp(2), 
                fontWeight: "medium",
                fontFamily: fonts.Bold,
              }}>
              My Grocery List
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
          style = {{
            backgroundColor: colors.pink,
            paddingHorizontal: hp(5), 
            paddingVertical: hp(1.5),
            borderRadius: hp(1.5),
            marginTop: 20,
            marginBottom: 20,
            alignItems: 'center',
          }}
          onPress = {() => navigation.navigate("GroceryLocator")}
          >
            <Text
              style = {{
                color: colors.white,
                fontSize: hp(2), 
                fontWeight: "medium",
                fontFamily: fonts.Bold,
              }}>
             Grocery Locator
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
          style = {{
            backgroundColor: colors.pink,
            paddingHorizontal: hp(5), 
            paddingVertical: hp(1.5),
            borderRadius: hp(1.5),
            marginTop: 20,
            marginBottom: 20,
            alignItems: 'center',
          }}
          onPress = {() => navigation.navigate("IngredientSubstitution")}
          >
            <Text
              style = {{
                color: colors.white,
                fontSize: hp(2), 
                fontWeight: "medium",
                fontFamily: fonts.Bold,
              }}>
              Ingredient Substitution
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
          style = {{
            backgroundColor: colors.pink,
            paddingHorizontal: hp(5), 
            paddingVertical: hp(1.5),
            borderRadius: hp(1.5),
            marginTop: 20,
            marginBottom: 20,
            alignItems: 'center',
          }}
          onPress = {() => navigation.navigate("Profile")}
          >
            <Text
              style = {{
                color: colors.white,
                fontSize: hp(2), 
                fontWeight: "medium",
                fontFamily: fonts.Bold,
              }}>
              My Profile
            </Text>
          </TouchableOpacity>

        </View>
      </View>
    ); 
  }