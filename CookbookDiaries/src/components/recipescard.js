import { View, Text, Pressable, Image } from 'react-native';
import React from 'react';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { LinearGradient } from 'expo-linear-gradient';
import { fonts } from '../utilities/fonts';
import { colors } from '../utilities/colors';

export default function RecipesCard({ index, navigation, item }) {
  let isEven = index % 2 == 0;
  let imageHeight = index % 3 == 0 ? hp(25) : hp(30);

  return (
    <View>
      <Pressable
        style={{
          width: "100%",
          paddingRight: isEven ? 8 : 0,
          marginBottom: 10,
        }}
        onPress={() => navigation.navigate("RecipeDetails", { ...item })}
      >
        <Image
          source={{
            uri: item.strMealThumb,
          }}
          style={{
            width: "100%",
            height: imageHeight,
            borderRadius: 35,
          }}
          className="bg-black/5 relative"
        />

        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.9)"]}
          style={{
            position: "absolute",
            bottom: 0,
            width: "100%",
            height: imageHeight, // Match the gradient height to the image height
            borderTopLeftRadius: 35,
            borderTopRightRadius: 35,
            borderBottomLeftRadius: 35, // Match the border radius of the image
            borderBottomRightRadius: 35, // Match the border radius of the image
          }}
          start={{ x: 0.5, y: 0.0 }}
          end={{ x: 0.5, y: 1.0 }}
        />

        <Text
          style={{
            fontSize: hp(1.8),
            color: colors.white,
            marginLeft: 10,
            fontFamily: fonts.SemiBold,
            marginBottom: 10,
            position: 'absolute', // Position text on top of the gradient
            bottom: 10, // Position text at the bottom of the gradient
          }}
        >
          {item.strMeal.length > 20 ? item.strMeal.slice(0, 20) + '...' : item.strMeal}
        </Text>
      </Pressable>
    </View>
  );
}
