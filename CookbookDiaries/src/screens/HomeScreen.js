import { View, Text, ScrollView, SafeAreaView, Image, TextInput, Button, StyleSheet, TouchableOpacity

 } from 'react-native'
import React, { useEffect, useState } from 'react'
import { 
  MagnifyingGlassIcon, 
  AdjustmentsHorizontalIcon, 
} from "react-native-heroicons/outline"; 
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { StatusBar } from "expo-status-bar"; 
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Categories from '../components/categories';
import axios from "axios";
import Recipes from '../components/recipes';
import { FIREBASE_DB, FIREBASE_AUTH } from '../../FirebaseConfig';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { ChevronLeftIcon } from 'react-native-heroicons/outline'
import { fonts } from "../utilities/fonts";
import { colors } from "../utilities/colors";
import DefaultAvatar1 from '../../assets/images/DefaultAvatar1.png';
import DefaultAvatar2 from '../../assets/images/DefaultAvatar2.png';


{/* import heroicons if you wanna make icons on a home screen */}

export default function HomeScreen() {
  const [activeCategory, setActiveCategory] = useState("All")
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
    getAllRecipes();
  }, []);

  const handleChangeCategory = (category) => {
    setActiveCategory(category);
    setMeals([]);
    if (category === "All") {
      getAllRecipes();
    } else {
      getRecipes(category);
    }
  };

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
          } else {
            // Fallback to default image
            setProfileImage(DefaultAvatar1);
          }
        }
    } catch (error) {
        console.error("Error fetching user data:", error);
    }
  };

  const getCategories= async () => { 
    try {
      const response = await axios.get(
        "https://themealdb.com/api/json/v1/1/categories.php"
      ); 
      if (response && response.data){
        setCategories(response.data.categories); 
        // console.log(response.data.categories);
      }
    } catch(error) { 
      console.log(error-message); 
    }
  }; 

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

  const getAllRecipes = async (category = "All") => { //have a sorting mechanism for this
    try {
      const urls = [
        `https://www.themealdb.com/api/json/v1/1/filter.php?c=beef`,
        `https://www.themealdb.com/api/json/v1/1/filter.php?c=chicken`,
        `https://www.themealdb.com/api/json/v1/1/filter.php?c=dessert`,
        `https://www.themealdb.com/api/json/v1/1/filter.php?c=lamb`,
        `https://www.themealdb.com/api/json/v1/1/filter.php?c=miscellaneous`,
        `https://www.themealdb.com/api/json/v1/1/filter.php?c=pasta`,
        `https://www.themealdb.com/api/json/v1/1/filter.php?c=pork`,
        `https://www.themealdb.com/api/json/v1/1/filter.php?c=seafood`,
        `https://www.themealdb.com/api/json/v1/1/filter.php?c=side`,
        `https://www.themealdb.com/api/json/v1/1/filter.php?c=starter`,
        `https://www.themealdb.com/api/json/v1/1/filter.php?c=vegan`,
        `https://www.themealdb.com/api/json/v1/1/filter.php?c=vegetarian`,
        `https://www.themealdb.com/api/json/v1/1/filter.php?c=breakfast`,
        `https://www.themealdb.com/api/json/v1/1/filter.php?c=goat`
      ];
  
      const responses = await Promise.all(urls.map(url => axios.get(url)));
  
      // Extract meals data from all responses
      const allMeals = responses.flatMap(response =>
        response && response.data ? response.data.meals : []
      );

      // Sort meals alphabetically by name
    const mealsSortedAlphabetically = allMeals.sort((a, b) =>
      a.strMeal.localeCompare(b.strMeal)
    );

    // Set the meals state with sorted meals data
    setMeals(mealsSortedAlphabetically);

    } catch (error) {
      console.log(error.message);
    }
  };

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
            {/* Filter button */}
            <TouchableOpacity style = {styles.filterContainer}>
              <Ionicons name={"filter"} size={30} color={colors.pink} />
            </TouchableOpacity>
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

