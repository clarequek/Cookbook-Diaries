import React, { useState, useEffect, useRef } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, Modal, TextInput, Button } from "react-native";
import { FIREBASE_AUTH, FIREBASE_DB } from '../../FirebaseConfig';
import { getDoc, doc, collection, query, getDocs, onSnapshot, where, addDoc } from 'firebase/firestore';
import { colors } from "../utilities/colors";
import { useNavigation } from "@react-navigation/native";
import { fonts } from "../utilities/fonts";
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import { ChevronLeftIcon } from 'react-native-heroicons/outline'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'

export default function CollectionScreen() {
  const [userData, setUserData] = useState(null);
  const db = FIREBASE_DB;
  const auth = FIREBASE_AUTH;
  const navigation = useNavigation();
  const [collections, setCollections] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const inputRef = useRef(null); // Ref for TextInput
  const [favouriteRecipesToAdd, setFavouriteRecipesToAdd] = useState([])

  const fetchFavouriteRecipesToAdd = async () => {
    try {
      const userRef = doc(FIREBASE_DB, 'users', FIREBASE_AUTH.currentUser.uid);
      const userDoc = await getDoc(userRef);
  
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const favouritesArray = userData.favourites || [];
  
        // Prepare an array to store favourite recipes that are not already in the collection
        const favouriteRecipesToAdd = [];
  
        // Fetch each favourite recipe and check if it's already in the collection
        for (const recipe of favouritesArray) {
          console.log("Fetching recipe ID:", recipe.strMeal); // Log the recipe ID
          const recipeData = await getMealData(recipe.mealId);
          if (recipeData) {
            // Check if the recipe is already in the collection
            const recipeExistsInCollection = collections.some(col => col.recipes.some(r => r.mealId === recipe.mealId));
  
            if (!recipeExistsInCollection) {
              favouriteRecipesToAdd.push({ id: recipe.strMeal, ...recipeData });
            }
          }
        }
  
        // Now you can do something with favouriteRecipesToAdd
        console.log("Favourite recipes to add:", favouriteRecipesToAdd.strMeal);
        // For example, you might add them to a collection using handleAddToCollection
  
      } else {
        console.warn("User document not found.");
      }
    } catch (error) {
      console.error("Error fetching favorite recipes:", error);
    }
  };

  const getMealData = async (id) => { 
    try { 
      const response = await axios.get(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
      
      if (response && response.data) {
        return response.data.meals[0];
      } else {
        console.warn(`Recipe with ID ${id} not found.`);
        return null;
      }
    } catch (error) { 
      console.log(error.message);
      return null;
    }
  }; 

    const fetchCollection = async (collectionId) => {
        try {
          const collectionRef = doc(db, 'collections', collectionId);
          const docSnapshot = await getDoc(collectionRef);
      
          if (docSnapshot.exists()) {
            const collectionData = { id: docSnapshot.id, ...docSnapshot.data() };
            setCollection(collectionData);
          } else {
            console.warn(`Collection with ID ${collectionId} not found.`);
            // Handle case where collection doesn't exist
          }
        } catch (error) {
          console.error("Error fetching collection:", error);
          // Handle error fetching the collection
        }
    };
      
    useEffect(() => {
      fetchCollection();
      fetchFavouriteRecipesToAdd();
    } , []);

  // Render function for displaying favorite recipes
  const renderFavouriteRecipesToAdd = () => {
    return favouriteRecipesToAdd.map((recipe) => (
      <View key={recipe.id}>
        <TouchableOpacity onPress={() => navigation.navigate("RecipeDetails", { ...item })}>
          <Text style={styles.recipeItem}> {recipe.strMeal} </Text> 
          {/* will be replaced with recipe image */}
        </TouchableOpacity>
      </View>
    ));
  };

  const handleAddToCollection = async (collectionId, recipe) => {
    try {
      const collectionRef = doc(db, 'collections', collectionId);
      const collectionDoc = await getDoc(collectionRef);
  
      if (collectionDoc.exists()) {
        const existingRecipes = collectionDoc.data().recipes || [];
        const updatedRecipes = [...existingRecipes, recipe];
  
        await collectionRef.update({
          recipes: updatedRecipes
        });
  
        // Optionally, update state or show a success message
        console.log(`Recipe added to collection ${collectionId}`);
      } else {
        console.warn(`Collection with ID ${collectionId} not found.`);
      }
    } catch (error) {
      console.error("Error adding recipe to collection:", error);
      // Handle error or show error message
    }
  };  

  

  const handleOpenModal = () => {
    setIsModalVisible(true);
    // Focus the TextInput when modal opens
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <View style={styles.container}>
        {/* Back Button */}
        <TouchableOpacity 
            style = {{
              borderRadius: 100,
              width: 35,
              height: 35,
              marginTop: 50,
              marginLeft: 20,
              backgroundColor: colors.white,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress = {() => navigation.goBack()}
        >
          <ChevronLeftIcon
            size={hp(2.5)}
            color={colors.pink}
            strokeWidth={4.5}
          />
        </TouchableOpacity>
        <Text style = {styles.header}> Collection Name </Text>
        <TouchableOpacity 
            style = {styles.buttonContainer}
            onPress = {() => navigation.navigate("EditCollection")}
            >
            <Ionicons name = {"cog"} size = {20} />
            <Text style = {styles.buttonText}> Manage recipes </Text>
        </TouchableOpacity> 
        <TouchableOpacity 
            style = {styles.buttonContainer}
            onPress = {handleOpenModal}
            //{() => navigation.navigate("EditCollection")}
            >
            <Ionicons name = {"add"} size = {20} />
            <Text style = {styles.buttonText}> Add recipes </Text>
        </TouchableOpacity>

        {/* Modal */}
        {/* Modal for Creating New Collection */}
        <Modal
            visible={isModalVisible}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setIsModalVisible(false)}
          >
            <View style={styles.modalContainer}>
              <View 
                style = {{
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: 10,
                  justifyContent: "space-between", }}>
                <Text style = {[styles.title, {textAlign: "center", flex:1}]}> Add Recipes </Text>
                <TouchableOpacity 
                  onPress = {() => setIsModalVisible(false)}
                >
                  <Ionicons name = {"close"} size = {25}/>
                </TouchableOpacity>
                {renderFavouriteRecipesToAdd()}
              </View>

            </View>
            
          </Modal>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.cream,
  },
  buttonContainer: {
    marginTop: 5,
    backgroundColor: colors.pink,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    width: "35%",
    height: 30,
    marginLeft: 15,
  },
  buttonText: {
    fontFamily: fonts.Regular,
    fontSize: 12,
  },
  header: {
    fontFamily: fonts.SemiBold,
    fontSize: 20,
    marginLeft: 15,
    marginTop: 15,
  },
  modalContainer: {
    backgroundColor: colors.white,
    width: '100%',
    height: '100%',
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    marginTop: 330,
    alignSelf: "center",
    position: "absolute",
    marginBottom: 20,
  },
});