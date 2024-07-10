import { View, Text, Pressable, Image } from 'react-native';
import React, { useState, useEffect } from 'react';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { LinearGradient } from 'expo-linear-gradient';
import { fonts } from '../utilities/fonts';
import { colors } from '../utilities/colors';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function RecipesCard({ index, navigation, item }) {
  let isEven = index % 2 === 0;

  return (
    <Pressable
      style={{
        width: '100%',
        paddingRight: isEven ? 8 : 0,
        marginBottom: 20, // Added margin bottom for spacing between cards
      }}
      onPress={() => navigation.navigate('RecipeDetails', { ...item })}
    >
      <Image
        source={{
          uri: item.strMealThumb,
        }}
        style={{
          width: '100%',
          height: 200,
          borderRadius: 20,
        }}
      />
      
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.9)']}
        style={{
          position: 'absolute',
          bottom: 0,
          width: '100%',
          height: 200,
          borderRadius: 20,
          justifyContent: 'flex-end', // Ensure the text is at the bottom
        }}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      >
        <Text
          style={{
            fontSize: hp(1.8),
            color: colors.white,
            marginLeft: 10,
            fontFamily: fonts.SemiBold,
            marginBottom: 10,
          }}
        >
          {item.strMeal.length > 20 ? item.strMeal.slice(0, 20) + '...' : item.strMeal}
        </Text>
      </LinearGradient>
    </Pressable>
  );
}