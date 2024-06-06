
import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { StatusBar } from 'expo-status-bar'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import { useNavigation } from '@react-navigation/native'
import { CachedImage } from '../utilities/index'
import axios from 'axios'
import { ChevronLeftIcon } from 'react-native-heroicons/outline'
import { HeartIcon } from "react-native-heroicons/solid"


export default function RecipeDetailsScreen(props) {
    let item = props.route.params
    const navigation = useNavigation
    const [meals, setMeal] = useState(null)
    const [loading, setLoading] = useState(true)
    const [isFavourite, setIsFavourite] = useState(false)

    useEffect(() => { 
        getMealData(item.idMeal)
    }); 

    const getMealData = async (id) => { 
        try { 
            const response = await axios.get(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
        
            if (response && response.data) {
                setMeal(response.data.meals[0])
                setLoading(false)
            }

        } catch(error) { 
            console.log(error.message);
        }
    }; 

    const ingredientsIndexes = (meal) => { 
        if (!meal) return []; 
        let indexes = []

        for (let i = 1; i <= 20; i++) { 
            if (meal["strIngredient" + 1]) { 
                indexes.push(i)
            }
        }
    }
    return (
        <ScrollView className = "flex-1"
        showsVerticalScrollIndicator = {false}
        contentContainerStyle = {{ 
            paddingBottom : 30, 
        }}>
        
        <StatusBar style = "white" />

        {/* Recipe Image */}
        <View className = "flex-row, justify-center"> 
            <CachedImage 
                uri = {item.strMealThumb}
                sharedTransitionTag = {item.strMeal}
                style = {{ 
                    width: wp(100),
                    height: hp(45)
                }}
            />
        </View>

        {/* Back Button and Favorite Icon */}

        <View className="w-full absolute flex-row justify-between items-center pt-10">
            <View className="p-2 rounded-full bg-white ml-5">
            <TouchableOpacity onPress={() => navigation.goBack()}>
                <ChevronLeftIcon
                size={hp(3.5)}
                color={"#f64e32"}
                strokeWidth={4.5}
                />
            </TouchableOpacity>
            </View>

            <View className="p-2 rounded-full bg-white mr-5">
            <TouchableOpacity onPress={() => setIsFavourite(!isFavourite)}>
                <HeartIcon
                size={hp(3.5)}
                color={isFavourite ? "#f64e32" : "gray"}
                strokeWidth={4.5}
                />
            </TouchableOpacity>
            </View>
        </View>

        
            <Text>
                RecipeDetailsScreen
            </Text>
            
         </ScrollView>
    )
}