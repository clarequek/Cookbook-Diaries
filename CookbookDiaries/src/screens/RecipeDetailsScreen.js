import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';
import { CachedImage } from '../utilities/index';
import { ChevronLeftIcon } from 'react-native-heroicons/outline';
import Loading from '../components/loading';
import axios from 'axios';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { fonts } from "../utilities/fonts";
import { colors } from "../utilities/colors";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { doc, getDoc, updateDoc, arrayUnion, setDoc } from 'firebase/firestore';
import { FIREBASE_AUTH, FIREBASE_DB } from '../../FirebaseConfig';
import { useFocusEffect } from '@react-navigation/native';

export default function RecipeDetailsScreen(props) {
    let item = props.route.params;
    const db = FIREBASE_DB;
    const auth = FIREBASE_AUTH;
    const navigation = useNavigation();
    const [meal, setMeal] = useState(null); //Stores the details of the selected meal.
    const [isLoading, setIsLoading] = useState(true); // Indicates whether the meal data is being loaded.
    const [isFavourite, setIsFavourite] = useState(false); //Indicates whether the meal is marked as a favorite.
    const [rating, setRating] = useState(0); //The user's rating for the recipe.
    const [averageRating, setAverageRating] = useState(0); //The average rating for the recipe.
    const [taskItems, setTaskItems] = useState([]); //Ingredients added to the grocery list.
    const [favourites, setFavourites] = useState([]); //User's favorite recipes.

    {/* Fetches user data and checks if the recipe is a favorite when the screen is focused. */}
    useFocusEffect(
        React.useCallback(() => {
            fetchUserData();
            checkIfFavourite();
        }, [])
    );

    {/* Fetches meal data, average rating, user data, and checks if the recipe is a favorite when the component mounts. */}
    useEffect(() => { 
        getMealData(item.idMeal);
        fetchAverageRating(item.idMeal);
        fetchUserData();
        checkIfFavourite();
    }, []); 

    /**
     * Fetches the current user's data from Firestore.
     * 
     * @async
     * @function fetchUserData
     * @returns {Promise<void>}
     */
    const fetchUserData = async () => {
        try {
            const userDocRef = doc(db, "users", auth.currentUser.uid);
            const userDocSnap = await getDoc(userDocRef);
            if (userDocSnap.exists()) {
                const userData = userDocSnap.data();
                const favs = userData.favourites || [];
                setFavourites(favs);
                setIsFavourite(favs.includes(item.idMeal));
                setTaskItems(userData.groceryList || []);
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    };

    /**
     * Fetches the meal data from the API.
     * 
     * @async
     * @function getMealData
     * @param {string} id - The ID of the meal to fetch.
     * @returns {Promise<void>}
     */

    const getMealData = async (id) => { 
        try { 
            const response = await axios.get(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
            if (response && response.data) {
                setMeal(response.data.meals[0]);
                setIsLoading(false);
            }
        } catch(error) { 
            console.log(error.message);
        }
    }; 

    /**
     * Gets the indexes of the ingredients present in the meal.
     * 
     * @function ingredientsIndexes
     * @param {Object} meal - The meal object containing ingredients.
     * @returns {number[]} - Array of ingredient indexes.
     */

    const ingredientsIndexes = (meal) => { 
        if (!meal) return []; 
        let indexes = [];
        for (let i = 1; i <= 20; i++) { 
            if (meal["strIngredient" + i]) { 
                indexes.push(i);
            }
        }
        return indexes; //every function must return something 
    }

    /**
     * Formats the instructions into an array of steps.
     * 
     * @function formatInstructions
     * @param {string} instructions - The instructions string from the meal object.
     * @returns {Object[]} - Array of step objects.
     */
    const formatInstructions = (instructions) => {
        return instructions.split('. ').map((instruction, index) => ({
            step: index + 1,
            instruction: instruction.trim()
        })).filter(instruction => instruction.instruction);
    };

    /**
     * Saves the grocery list to Firestore and updates the state.
     * 
     * @async
     * @function saveGroceryList
     * @param {Array} newTaskItems - The new grocery list items.
     * @returns {Promise<void>}
     */
    const saveGroceryList = async (newTaskItems) => {
        try {
            const userDocRef = doc(db, "users", auth.currentUser.uid);
            console.log("Saving new task items to Firestore:", newTaskItems);
            await updateDoc(userDocRef, {
                groceryList: newTaskItems
            });
            setTaskItems(newTaskItems); // update local state immediately
        } catch (error) {
            console.error("Error saving grocery list:", error);
        }
    };

    /**
     * Checks if the current meal is marked as a favorite.
     * 
     * @async
     * @function checkIfFavourite
     * @returns {Promise<void>}
     */
    const checkIfFavourite = async () => {
        try {
            const userDocRef = doc(db, "users", auth.currentUser.uid);
            const userDocSnap = await getDoc(userDocRef);
            if (userDocSnap.exists()) {
                const userData = userDocSnap.data();
                const favs = userData.favourites || [];
                setIsFavourite(favs.some(fav => fav.mealId === item.idMeal));
            }
        } catch (error) {
            console.error("Error checking if favorite:", error);
        }
    };

    /**
     * Adds an ingredient to the grocery list.
     * 
     * @async
     * @function handleAddToGroceryList
     * @param {string} ingredient - The ingredient to add.
     * @param {string} measure - The measurement of the ingredient.
     * @returns {Promise<void>}
     */

    const handleAddToGroceryList = async (ingredient, measure) => {
        const newTaskItems = [...taskItems, { name: ingredient, quantity: measure }];
        setTaskItems(newTaskItems);
        await saveGroceryList(newTaskItems);
        Alert.alert("Added to Grocery List", `${ingredient} (${measure}) added to your grocery list.`);
    };

    /**
     * Adds all ingredients to the grocery list.
     * 
     * @async
     * @function handleAddAllToGroceryList
     * @returns {Promise<void>}
     */
    const handleAddAllToGroceryList = async () => {
        const newTaskItems = [...taskItems];
        ingredientsIndexes(meal).forEach((i) => {
            const ingredient = meal["strIngredient" + i];
            const measure = meal["strMeasure" + i];
            if (ingredient) {
                newTaskItems.push({ name: ingredient, quantity: measure });
            }
        });
        setTaskItems(newTaskItems);
        await saveGroceryList(newTaskItems);
        Alert.alert("Added to Grocery List", "All ingredients added to your grocery list.");
    };

    /**
     * Marks the current meal as a favorite.
     * 
     * @async
     * @function handleFavourites
     * @param {string} mealId - The ID of the meal.
     * @param {string} strMeal - The name of the meal.
     * @param {string} strMealThumb - The thumbnail image of the meal.
     * @returns {Promise<void>}
     */
    const handleFavourites = async (mealId, strMeal, strMealThumb) => {
        try {
            const userDocRef = doc(FIREBASE_DB, "users", FIREBASE_AUTH.currentUser.uid);
            const userDocSnap = await getDoc(userDocRef);
    
            if (userDocSnap.exists()) {
                const userData = userDocSnap.data();
                const favs = userData.favourites || [];
    
                if (isFavourite) {
                    // If already a favourite, remove it
                    const updatedFavs = favs.filter(fav => fav.mealId !== mealId);
                    await updateDoc(userDocRef, { favourites: updatedFavs });
                    setIsFavourite(false);
                    setFavourites(updatedFavs);
                    Alert.alert("Removed from Favourites", "Recipe has been removed from your favourites.");
                } else {
                    // If not a favourite, add it
                    const newFav = { mealId, strMeal, strMealThumb };
                    await updateDoc(userDocRef, { favourites: arrayUnion(newFav) });
                    setIsFavourite(true);
                    setFavourites([...favs, newFav]);
                    Alert.alert("Added to Favourites", "Recipe has been added to your favourites.");
                }
            }
        } catch (error) {
            console.error("Error updating favourites:", error);
            Alert.alert("Error", "There was an error updating your favourites. Please try again later.");
        }
    };
    

    /**
     * Submits the user's rating for the recipe.
     * 
     * @async
     * @function handleRateRecipe
     * @returns {Promise<void>}
     */

    const handleRateRecipe = async () => {
        try {
            const mealDocRef = doc(db, 'meals', item.idMeal);
            const mealDoc = await getDoc(mealDocRef);
            if (mealDoc.exists()) {
                await updateDoc(mealDocRef, {
                    ratings: arrayUnion(rating)
                });
            } else {
                await setDoc(mealDocRef, {
                    ratings: [rating]
                });
            }
            Alert.alert("Rating Submitted", "Thank you for rating this recipe!", [{ text: "OK" }]);
            fetchAverageRating(item.idMeal);
        } catch (e) {
            console.error("Error adding rating: ", e);
            Alert.alert("Error", "There was an error submitting your rating. Please try again later.", [{ text: "OK" }]);
        }
    };

    const fetchAverageRating = async (mealId) => {
        try {
            const mealDocRef = doc(db, 'meals', mealId);
            const mealDoc = await getDoc(mealDocRef);
            if (mealDoc.exists()) {
                const ratings = mealDoc.data().ratings;
                const totalRating = ratings.reduce((sum, rating) => sum + rating, 0);
                const avgRating = totalRating / ratings.length;
                setAverageRating(avgRating);
            } else {
                setAverageRating(0);
            }
        } catch (error) {
            console.error("Error fetching ratings:", error);
        }
    };

    return (
        <ScrollView className="flex-1 bg-white" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 30 }}>
            <StatusBar style="white" />
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
                size={hp(2.5)}
                color={colors.pink}
                strokeWidth={4.5}
                />
            </TouchableOpacity>
        
            <View className="p-2 rounded-full bg-white mr-5">
                <TouchableOpacity 
                onPress={() => {setIsFavourite(true); handleFavourites(item.idMeal, item.strMeal, item.strMealThumb)}}>
                    <Ionicons
                        name={"bookmark"} 
                        color={isFavourite ? "#ff8271" : "gray"}
                        size={hp(2.5)}
                        strokeWidth={4.5}/>
                </TouchableOpacity>
            </View>

        </View>
            {/* Meal Description */}
            {isLoading ? (
                <Loading size="large" className="mt-16" />
            ) : (
                <View className="px-4 flex justify-between space-y-4 bg-white mt-[-46]" style={{ borderTopLeftRadius: 50, borderTopRightRadius: 50, paddingTop: hp(3) }}>
                    {/* Meal Name */}
                    <Animated.View className="space-y-2 px-4" entering={FadeInDown.delay(200).duration(700).springify().damping(12)}>
                        <View className="space-y-2 px-4">
                            <Text className="font-bold flex-1 text-neutral-700" style={{ fontSize: hp(3), fontFamily: fonts.Bold }}> 
                                {meal?.strMeal}
                            </Text> 

                            {/* Displaying Average Rating */}
                            <View style={styles.averageRatingContainer}>
                                <Text style={styles.averageRatingText}>{averageRating}</Text>
                                <Ionicons name={"star"} color={colors.yellow} size={20} />
                            </View>
                        </View>
                    </Animated.View>

                    {/* Ingredients */}
                    <Animated.View className="space-y-4 p-4" entering={FadeInDown.delay(300).duration(700).springify().damping(12)}>
                        <Text style={{ fontSize: hp(2.5), fontFamily: fonts.Bold }} className="font-bold flex-1 text-neutral-700">
                            Ingredients
                        </Text>
                        <View className="space-y-2 ml-3">
                            {ingredientsIndexes(meal).map((i) => (
                                <View className="flex-row space-x-4 items-center" key={i}>
                                    {/* Bullet Point */}
                                    <View className="bg-[#ff8271] rounded-full" style={{ height: hp(2.0), width: hp(2.0) }} />
                                    <View className="flex-row space-x-2" style={styles.container}>
                                        <Text style={{ fontSize: hp(2.0), fontFamily: fonts.Regular }} className="font-medium text-neutral-800">
                                            {meal["strIngredient" + i]}
                                        </Text>
                                        <Text className="font-extrabold text-neutral-700" style={{ fontSize: hp(2.0) }}>
                                            {meal["strMeasure" + i]}
                                        </Text>
                                    </View>
                                    <View style={styles.buttons}> 
                                        {/* Plus Button */}
                                        <TouchableOpacity onPress={() => handleAddToGroceryList(meal["strIngredient" + i], meal["strMeasure" + i])} style={{ justifyContent: 'flex-end', padding: 5, backgroundColor: '#ff8271', borderRadius: 50 }}>
                                            <Ionicons name={"add-outline"} size={15} color={colors.white} />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            ))}
                        </View>

                        <TouchableOpacity style={styles.buttonContainer} onPress={handleAddAllToGroceryList}>
                            <Ionicons name={"cart-outline"} size={20} color={colors.white} />
                            <Text style={styles.buttonText}>   Add all to grocery list!</Text>
                        </TouchableOpacity>
                    </Animated.View>

                    {/* Instructions */}
                    <Animated.View className="space-y-4 p-4" entering={FadeInDown.delay(400).duration(700).springify().damping(12)}>
                        <Text className="font-bold flex-1 text-neutral-700" style={{ fontSize: hp(2.5), fontFamily: fonts.Bold }}>
                            Instructions
                        </Text>
                        {formatInstructions(meal?.strInstructions).map((step, index) => (
                            <View key={index} style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                                <Text style={{ fontSize: hp(1.7), color: 'black', fontWeight: 'bold', marginRight: 5, fontFamily: fonts.Bold }}>{`${step.step}.`}</Text>
                                <Text style={{ fontSize: hp(1.7), color: 'black', flexShrink: 1, fontFamily: fonts.Regular }}>{step.instruction}</Text>
                            </View>
                        ))}
                    </Animated.View>

                    {/* Rating system */}
                    <View style={styles.ratingContainer}>
                        <Text style={styles.ratingTitle}>Rate this Recipe</Text>
                        <View style={styles.starsContainer}>
                            {[1, 2, 3, 4, 5].map((star) => (
                                <TouchableOpacity key={star} onPress={() => setRating(star)}>
                                    <Ionicons name={rating >= star ? "star" : "star-outline"} size={hp(4)} color={colors.pink} />
                                </TouchableOpacity>
                            ))}
                        </View>
                        <TouchableOpacity style={styles.ratingButton} onPress={handleRateRecipe}>
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
        alignItems: 'center',
        justifyContent: "center",
        marginVertical: 20,
        flexDirection: "row",
        marginTop: 0,
        marginBottom: -20,
    },
    averageRatingText: {
        fontSize: 15,
        fontFamily: fonts.SemiBold,
        color: colors.black,
    },
    buttons: {
        justifyContent: 'flex-end', // Align items to the end of the container (far right)
        alignItems: 'center',
        flexDirection: 'row', // Use flexDirection: 'row' to align items horizontally
    },
    container: {
        justifyContent: 'space-around',
    },
});
