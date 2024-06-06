import { View, Text, ScrollView, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { StatusBar } from 'expo-status-bar'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import { CachedImage } from '../utilities/index'
import { useNavigation } from '@react-navigation/native'


export default function RecipeDetailsScreen(props) {
    let item = props.route.paramsn
    const navigation = useNavigation
    const [meals, setMeal] = useState(null)
    const [loading, setLoading] = useState(true)
    const [isFavourite, setIsFavourite] = useState(false)

    useEffect(() => { 
        getMealData(item.idMeal);
    })

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
                sharedTransitiontag = {item.strMeal}
                style = {{
                    width: wp(100), 
                    height: hp(45),
                }}/>
        </View>
        
            <Text>RecipeDetailsScreen</Text>
        </ScrollView>
    )
}