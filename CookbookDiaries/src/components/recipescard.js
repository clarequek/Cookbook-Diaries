import { View, Text, Pressable, Image } from 'react-native';
import React, { useState, useEffect } from 'react';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { LinearGradient } from 'expo-linear-gradient';
import { fonts } from '../utilities/fonts';
import { colors } from '../utilities/colors';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { FIREBASE_DB } from '../../FirebaseConfig';

export default function RecipesCard({ index, navigation, item }) {
  let isEven = index % 2 === 0;

  const db = FIREBASE_DB
  const [averageRating, setAverageRating] = useState(0);

  useEffect(() => {
    fetchAverageRating(item.idMeal);
  }, [item.idMeal]);

  const fetchAverageRating = async (mealId) => {
    try {
        const q = query(collection(db, 'ratings'), where("mealId", "==", mealId));
        const querySnapshot = await getDocs(q);

        let totalRating = 0;
        let numRatings = 0;

        querySnapshot.forEach((doc) => {
            const ratingData = doc.data();
            totalRating += ratingData.rating;
            numRatings++;
        });

        if (numRatings > 0) {
            const avgRating = totalRating / numRatings;
            setAverageRating(avgRating);
        } else {
            setAverageRating(0);
        }
    } catch (error) {
        console.error("Error fetching ratings:", error);
    }
};
  
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
          }}
        >
          {item.strMeal.length > 20 ? item.strMeal.slice(0, 20) + '...' : item.strMeal}
        </Text>

        {/* Displaying Average Rating */}
        <View 
          style = {{
            flexDirection: 'row',
            alignItems: 'center',
            marginLeft: 10,
            marginBottom: 5,
          }}>
            <Ionicons name={"star"} color={colors.yellow} size={15} />
            <Text> </Text>
            <Text 
              style = {{
                color: colors.white,
                fontSize: hp(1.5),
                fontFamily: fonts.SemiBold,
              }}>
              {averageRating}
            </Text>              
        </View>
      </LinearGradient>
    </Pressable>
  );
}
