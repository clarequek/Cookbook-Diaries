import { View, Text, ScrollView, Image, TouchableOpacity, Button, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import { StatusBar } from 'expo-status-bar'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import { useNavigation } from '@react-navigation/native'
import { CachedImage } from '../utilities/index'
import { ChevronLeftIcon } from 'react-native-heroicons/outline'
import { HeartIcon } from "react-native-heroicons/solid"
import Loading from '../components/loading'
import axios from 'axios'
import Animated, { FadeInDown } from 'react-native-reanimated'
import { fonts } from "../utilities/fonts";
import { colors } from "../utilities/colors";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { FIREBASE_DB } from '../../FirebaseConfig';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { Alert } from 'react-native';


export default function RecipeDetailsScreen(props) {
    let item = props.route.params
    const db = FIREBASE_DB
    const navigation = useNavigation()
    const [meal, setMeal] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isFavourite, setIsFavourite] = useState(false)
    const [rating, setRating] = useState(0);
    const [averageRating, setAverageRating] = useState(0);
    
    useEffect(() => { 
        getMealData(item.idMeal)
        fetchAverageRating(item.idMeal)
    }); 

    const getMealData = async (id) => { 
        try { 
            const response = await axios.get(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
        
            if (response && response.data) {
                setMeal(response.data.meals[0])
                setIsLoading(false)
            }

        } catch(error) { 
            console.log(error.message);
        }
    }; 

    const ingredientsIndexes = (meal) => { 
        if (!meal) return []; 
        let indexes = []

        for (let i = 1; i <= 20; i++) { 
            if (meal["strIngredient" + i]) { 
                indexes.push(i)
            }
        }

        return indexes //every function must return something 
    }

    const formatInstructions = (instructions) => {
        return instructions.split('. ').map((instruction, index) => ({
            step: index + 1,
            instruction: instruction.trim()
        })).filter(instruction => instruction.instruction);
    };

    const handleAddToGroceryList = (ingredient, quantity) => {
        const ingredientItem = { ingredient, quantity };
        navigation.navigate('GroceryList', { ingredients: [ingredientItem] });
    };

    const handleAddAllToGroceryList = () => {
        const ingredients = ingredientsIndexes(meal).map((i) => ({
            ingredient: meal["strIngredient" + i],
            quantity: meal["strMeasure" + i]
        }));
        navigation.navigate('GroceryList', { ingredients });
    };

    const handleRateRecipe = async () => {
        try {
            const docRef = await addDoc(collection(db, 'ratings'), {
                mealId: item.idMeal,
                rating: rating,
                timestamp: new Date()
            });
            console.log("Document written with ID: ", docRef.id);
            Alert.alert("Rating Submitted", "Thank you for rating this recipe!", [{ text: "OK" }]);
        } catch (e) {
            console.error("Error adding document: ", e);
            Alert.alert("Error", "There was an error submitting your rating. Please try again later.", [{ text: "OK" }]);
        }
    };

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

    const handleIngredientSubstitution = async (ingredient, quantity) => {
        try {
            const apiKey = 'sk-proj-3aoC1KuTLAvRzkuiDXqAT3BlbkFJXDvqK7ZBARIjBvFuDp2O'; 
            const apiUrl = 'https://api.openai.com/v1/engines/text-davinci-003/completions'; // ChatGPT API endpoint
    
            const response = await axios.post(apiUrl, {
                prompt: `I have ${quantity} of ${ingredient}. What can I substitute it with?`,
                max_tokens: 150,
                temperature: 0.7,
                n: 1,
                stop: ['\n']
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                }
            });
    
            if (response.data && response.data.choices && response.data.choices.length > 0) {
                const substitution = response.data.choices[0].text.trim();
                // You can navigate to another screen or show a modal to display the substitution
                // For now, let's just log the substitution
                console.log(`Substitute ${substitution} for ${ingredient}`);
            } else {
                console.log(`No substitution found for ${ingredient}`);
            }
        } catch (error) {
            console.error('Error fetching substitution:', error);
            // Handle error (e.g., show an alert or log an error message)
        }
    };

    return (
        <ScrollView className = "flex-1 bg-white"
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
            <TouchableOpacity 
            className="p-2 rounded-full bg-white ml-5"
            onPress = {() => navigation.goBack()}
            >
                <ChevronLeftIcon
                size={hp(3.5)}
                color={"#ff8271"}
                strokeWidth={4.5}
                />
            </TouchableOpacity>
        
            <View className="p-2 rounded-full bg-white mr-5">
                <TouchableOpacity 
                onPress={() => setIsFavourite(!isFavourite)}>
                    <HeartIcon
                    size={hp(3.5)}
                    color={isFavourite ? "#ff8271" : "gray"}
                    strokeWidth={4.5}
                    />
                </TouchableOpacity>
            </View>

        </View>
        
        {/* Meal Description */}
        { 
        isLoading ? (
            <Loading size = "large" className = "mt-16" />
        ) : ( 
            <View className = "px-4 flex justify-between space-y-4 bg-white mt-[-46]"
                style = {{
                    borderTopLeftRadius: 50, 
                    borderTopRightRadius : 50, 
                    paddingTop : hp(3), 
                }}>
            {/* Meal Name */}
            <Animated.View
            className="space-y-2 px-4"
            entering={FadeInDown.delay(200)
            .duration(700)
            .springify()
            .damping(12)}>
                <View className = "space-y-2 px-4">
                    <Text className = "font-bold flex-1 text-neutral-700"
                        style = {{ 
                            fontSize: hp(3),
                            fontFamily: fonts.Bold,
                        }}> 
                        {meal?.strMeal}
                    </Text> 
                </View>
            </Animated.View>

            {/* Displaying Average Rating */}
            <View style={styles.averageRatingContainer}>
                <Text style={styles.averageRatingText}>
                    {averageRating}
                </Text>
                <Ionicons name={"star"} color={colors.pink} size={25} />
            </View>


            {/* Ingredients */}
            <Animated.View className="space-y-4 p-4"
            entering={FadeInDown.delay(300)
            .duration(700)
            .springify()
            .damping(12)}>
                <Text
                style={{
                    fontSize: hp(2.5),
                    fontFamily: fonts.Bold,
                }}
                className="font-bold flex-1 text-neutral-700"
                >
                Ingredients
                </Text>

                <View className="space-y-2 ml-3">
                {ingredientsIndexes(meal).map((i) => {
                    return (
                    <View className="flex-row space-x-4 items-center" key={i}>
                        <View
                        className="bg-[#ff8271] rounded-full"
                        style={{
                            height: hp(2.0),
                            width: hp(2.0),
                        }}
                        />
                        <View className="flex-row space-x-2" style={styles.container}>
                        <Text
                            style={{
                            fontSize: hp(2.0),
                            fontFamily: fonts.Regular,
                            }}
                            className="font-medium text-neutral-800"
                        >
                            {meal["strIngredient" + i]}
                        </Text>
                        <Text
                            className="font-extrabold text-neutral-700"
                            style={{
                            fontSize: hp(2.0),
                            }}
                        >
                            {meal["strMeasure" + i]}
                        </Text>

                        <View style={styles.buttons}> 
                            {/* Plus Button */}
                            <TouchableOpacity
                                onPress={() => handleAddToGroceryList(meal["strIngredient" + i], meal["strMeasure" + i])}
                                style={{
                                    justifyContent: 'flex-end',
                                    //marginLeft: 'auto',  // Push the button to the far right
                                    padding: 5,
                                    backgroundColor: '#ff8271',
                                    borderRadius: 50,
                                }}>
                                <Ionicons name={"add-outline"} size={15} color={colors.white} />
                            </TouchableOpacity>

                            {/* Ingredient substitution; Functionality isn't working yet! */}
                            <TouchableOpacity
                                onPress={() => handleIngredientSubstitution(meal["strIngredient" + i], meal["strMeasure" + i])}
                                style={{
                                    justifyContent: 'flex-end',
                                    marginLeft: 5,  // Push the button to the far right
                                    padding: 5,
                                    backgroundColor: '#ff8271',
                                    borderRadius: 50,
                                }}>
                                <Ionicons name={"color-wand-outline"} size={15} color={colors.white} />
                            </TouchableOpacity> 
                        </View>
                        

                        </View>
                    </View>
                    );
                })}
                </View>

                <TouchableOpacity style={styles.buttonContainer} onPress={handleAddAllToGroceryList}>
                    <Ionicons name={"cart-outline"} size={20} color={colors.white} />
                    <Text style={styles.buttonText}>   Add all to grocery list!</Text>
                </TouchableOpacity>
                
            </Animated.View>
            {/* Instructions */}
            <Animated.View
                className="space-y-4 p-4"
                entering={FadeInDown.delay(400)
                    .duration(700)
                    .springify()
                    .damping(12)}>
                <Text
                    className="font-bold flex-1 text-neutral-700"
                    style={{
                        fontSize: hp(2.5),
                        fontFamily: fonts.Bold,
                    }}
                >
                    Instructions
                </Text>
                {formatInstructions(meal?.strInstructions).map((step, index) => (
                    <View key={index} style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                        <Text style={{ //bullet point
                            fontSize: hp(1.7),
                            color: 'black',
                            fontWeight: 'bold',
                            marginRight: 5,
                            fontFamily: fonts.Bold,
                        }}>{`${step.step}.`}</Text>
                        <Text style={{ //actual instructions
                            fontSize: hp(1.7),
                            color: 'black',
                            flexShrink: 1,
                            fontFamily: fonts.Regular,
                        }}>{step.instruction}</Text>
                    </View>
                ))}
            </Animated.View>

            {/* Rating system */}
            <View style={styles.ratingContainer}>
                <Text style={styles.ratingTitle}>Rate this Recipe</Text>
                <View style={styles.starsContainer}>
                    {[1, 2, 3, 4, 5].map((star) => (
                        <TouchableOpacity
                            key={star}
                            onPress={() => setRating(star)}
                        >
                            <Ionicons
                                name={rating >= star ? "star" : "star-outline"}
                                size={hp(4)}
                                color={colors.pink}
                            />
                        </TouchableOpacity>
                    ))}
                </View>
                <TouchableOpacity
                    style={styles.ratingButton}
                    onPress={handleRateRecipe}
                >
                    <Text style={styles.buttonText}>Submit Rating</Text>
                </TouchableOpacity>
            </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
    buttonContainer: {
        backgroundColor: colors.pink,
        borderRadius: 25,
        paddingVertical: 10,
        paddingHorizontal: 20,
        height: 50,
        width: '75%',
        marginTop: 15,
        alignItems: "center",
        justifyContent: "center",
        alignSelf: 'center',
        flexDirection: 'row',
    },
    buttonText: {
        fontSize: 15,
        fontFamily: fonts.Bold,
        color: colors.white,
        textAlign: 'center',
    },
    ratingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    ratingTitle: {
        marginTop: 50,
        fontSize: 15,
        fontFamily: fonts.Bold,
        marginBottom: hp(2),
        color: colors.darkgrey,
        marginBottom: 0,
    },
    starsContainer: {
        flexDirection: 'row',
        marginBottom: hp(2),
    },
    ratingButton: {
        backgroundColor: colors.pink,
        borderRadius: 25,
        paddingVertical: 10,
        paddingHorizontal: 20,
        height: 40,
        width: '50%',
        marginTop: 0,
        alignItems: "center",
        justifyContent: "center",
        alignSelf: 'center',
        flexDirection: 'row',
    },
    averageRatingContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 20,
        flexDirection: "row",
        marginTop: 0,
        marginBottom: -20,
    },
    averageRatingText: {
        fontSize: 15,
        fontFamily: fonts.Bold,
        color: colors.pink,
    },
    buttons: {
        justifyContent: 'flex-end', // Align items to the end of the container (far right)
        alignItems: 'center',
        flexDirection: 'row', // Use flexDirection: 'row' to align items horizontally
    },
    container: {
        justifyContent: 'flex-end',
    },
})