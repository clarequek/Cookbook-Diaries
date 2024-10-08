import { View, Text, ScrollView, SafeAreaView, Image, TextInput, StyleSheet, TouchableOpacity

 } from 'react-native'
import React, { useEffect, useState } from 'react'
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { StatusBar } from "expo-status-bar"; 
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Categories from '../components/categories';
import axios from "axios";
import Recipes from '../components/recipes';
import { FIREBASE_DB, FIREBASE_AUTH } from '../../FirebaseConfig';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { fonts } from "../utilities/fonts";
import { colors } from "../utilities/colors";

import DefaultAvatar1 from '../../assets/images/DefaultAvatar1.png';
import DefaultAvatar2 from '../../assets/images/DefaultAvatar2.png';
import DefaultAvatar3 from '../../assets/images/DefaultAvatar3.png';
import DefaultAvatar4 from '../../assets/images/DefaultAvatar4.png';
import DefaultAvatar5 from '../../assets/images/DefaultAvatar5.png';
/**
 * HomeScreen component
 * Displays the main home screen with user information, search bar, categories, and recipes.
 * @returns {JSX.Element} The rendered HomeScreen component.
 */

export default function HomeScreen() {
  const [activeCategory, setActiveCategory] = useState("Beef")
  const [categories, setCategories] = useState([])
  const [meals, setMeals] = useState([])
  const [profileImage, setProfileImage] = useState(null);
  const [name, setName] = useState('');
  const [search, setSearch] = useState('');
  const navigation = useNavigation();
  const db = FIREBASE_DB;
  const auth = FIREBASE_AUTH;

  useEffect(() => {
    fetchUserData();
    getCategories();
    getRecipes();
  }, []); 

  /**
   * Handles changing the active category and fetching recipes for the selected category.
   * @param {string} category - The selected category.
   */
  const handleChangeCategory = (category) => { 
    getRecipes(category); 
    setActiveCategory(category);
    setMeals([]);
  }; 

  /**
   * Fetches user data from Firestore and sets the user's name and profile image.
   */
  const fetchUserData = async () => {
    try {
        const userDocRef = doc(db, "users", auth.currentUser.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          setName(userData.name);
            
            // Set the profile image based on the stored value
          if (userData.profileImage === 1) {
            setProfileImage(DefaultAvatar1);
          } else if (userData.profileImage === 2) {
            setProfileImage(DefaultAvatar2);
          } else if (userData.profileImage === 3) {
            setProfileImage(DefaultAvatar3);
          } else if (userData.profileImage === 4) {
            setProfileImage(DefaultAvatar4);
          } else if (userData.profileImage === 5) {
            setProfileImage(DefaultAvatar5);
          } else {
            // Fallback to default image
            setProfileImage(DefaultAvatar1);
          }
        }
    } catch (error) {
        console.error("Error fetching user data:", error);
    }
  };

  /**
   * Fetches categories from the API and sets the categories state.
   */

  const getCategories= async () => { 
    try{
      const response = await axios.get(
        "https://themealdb.com/api/json/v1/1/categories.php"
      ); 
      if (response && response.data){
        setCategories(response.data.categories); 
        // console.log(response.data.categories);
      }
    } catch(error) { 
      console.log(error.message); 
    }
  }; 

  /**
   * Fetches recipes for the specified category from the API and sets the meals state.
   * @param {string} category - The category to fetch recipes for.
   */
  const getRecipes = async(category = "Beef") => { 
    try { 
      const response = await axios.get(
        `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`
      )
      if (response && response.data) { 
        setMeals(response.data.meals)
      }
    } catch(error) { 
      console.log(error.message)
    }
  }

  /**
   * Handles searching for recipes based on the search input.
   */

  const handleSearch= async() => {
    try { 
      const response = await axios.get(
        `https://www.themealdb.com/api/json/v1/1/search.php?s=${search}`
      )
      if (response && response.data) { 
        setMeals(response.data.meals)
      }
    } catch(error) { 
      console.log(error.message)
    }
  }


  return (
    <View className = "flex-1 bg-[#fff5e6]">
      <StatusBar style = "dark" />
      <SafeAreaView>
        <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle = {{
          paddingBottom: 50, 
        }}
        className = "space-y-6 pt-13"
        >

          {/* Back arrow button, Title and Profile */}
          <View className = "mx-4 space-y-1 flex-row justify-between items-center"> 
            {/* <TouchableOpacity 
              className="p-2 rounded-full bg-white ml-1"
              onPress = {() => navigation.goBack()}
              >
                <ChevronLeftIcon
                  size={hp(2.5)}
                  color={colors.pink}
                  strokeWidth={4.5}
                />
            </TouchableOpacity>  */}


          </View>

          {/* Headlines */}
          <View className = "mx-4 space-y-1 mb-2" style = {{flexDirection: 'row',}}> 
            <View>
              <View style={styles.headline}> 
                <Text
                style = {{
                  fontSize: hp(2.0),
                  fontFamily: fonts.SemiBold,
                  color: colors.darkgrey,
                }}
                className = "font-bold text-neutral-800"> 
                  Hi,
                </Text>

                <Text> </Text> 
                {/* Display User's Name */}
                <Text
                style = {{
                  fontSize: hp(2.0),
                  fontFamily: fonts.SemiBold,
                  color: colors.black,
               }}
                className = "font-bold text-neutral-800"> 
                  {name}
                </Text>
              </View>

              <Text
                style = {{
                  fontSize: hp(3), 
                  fontFamily: fonts.Bold,
                }}
                className = "font-extrabold text-[#ff8271]"> 
                  What's cooking today? 
              </Text>

            </View>

            <Image
              source={profileImage}
              style = {{
                width: hp(6),
                height: hp(6), 
                marginLeft: 10,
              }}
              className = "rounded-full"
            />

          </View>

          {/* Search bar and filter icon */}
          <View style = {{flexDirection: 'row', 
            //justifyContent: 'space-around'
            }}>
            {/* Search bar */}
            <View style={styles.searchContainer}>
              <View style={styles.inputContainer}> 
                <Ionicons name={"search-outline"} size={20} color={colors.darkgrey} />
                <TextInput
                  style= {styles.input}
                  placeholder="Look for a recipe"
                  onChangeText={(text) => setSearch(text)}
                  onSubmitEditing={handleSearch}
                />
              </View>
            </View>
          </View>

          {/* Categories */}
          <View>
            {categories.length > 0 && (
                <Categories
                categories = {categories}
                activeCategory={activeCategory}
                handleChangeCategory={handleChangeCategory} 
                />
              )}
          </View>

          {/* Recipes */}
          <View>
            <Recipes meals = {meals} categories = {categories}/>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  )
}

const styles = StyleSheet.create({
  backButtonWrapper: {
    marginTop: 30,
  },
  iconContainer: {
    height: 40,
    width: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    flex: 1,
    fontSize: hp(3),
    color: colors.pink,
    fontFamily: fonts.Bold,
    textAlign: 'center',
  },
  input: {
    flex: 1,
    paddingHorizontal: 20,
    fontFamily: fonts.Light,
    color: colors.darkergrey,
  },
  inputContainer: {
    padding: 10,
    backgroundColor: colors.white,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    height: 40,
  },

  searchContainer: {
    alignItems: "center",
    width: '85%',
    marginLeft: 10,
  },

  headline: {
    flexDirection: 'row',
  },

  filterContainer: {
    marginLeft: 5,
    marginTop: 0,
    alignItems: "center",
    width: 40,
    height: 40,
    borderRadius: 15,
    justifyContent: 'center',
  },

});

{/* when you are doing your code and you dk whats the problem 
1. check the files exist in your terminal 
2. disconnect server and reconnect again */}

{/* StatusBar is the bar at the top of the screen that displays info like time, 
battery level and network status 

can import StatusBar from "react-native" 
or from "expo-status-bar"
<TextInput 
            placeholder='Look for recipe'
            placeholderTextColor = {'gray'}
            style = {{
              fontSize: hp(1.7),
              fontFamily: fonts.Light,
            }}
            className = "flex-1 text-base mb-1, pl-1 tracking-widest"
            />*/}

