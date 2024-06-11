
import { View, Text, ScrollView, SafeAreaView, Image, TextInput, Button } from 'react-native'
import React, { useEffect, useState } from 'react'
import { 
  MagnifyingGlassIcon, 
  AdjustmentsHorizontalIcon, 
} from "react-native-heroicons/outline"; 
import { StatusBar } from "expo-status-bar"; 
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Categories from '../components/categories';
import axios from "axios";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry"; 
import Recipes from '../components/recipes';
import { FIREBASE_DB, FIREBASE_AUTH } from '../../FirebaseConfig';
import { getDatabase, ref, get as getFireBase } from "firebase/database";
import { useNavigation } from '@react-navigation/native';
import { doc, getDoc } from 'firebase/firestore';


{/* import heroicons if you wanna make icons on a home screen */}

export default function HomeScreen() {
  const [activeCategory, setActiveCategory] = useState("Beef")
  const [categories, setCategories] = useState([])
  const [meals, setMeals] = useState([])
  const [userName, setUserName] = useState('');
  const [profileImageUrl, setProfileImageUrl] = useState('');
  const navigation = useNavigation();
  const [userData, setUserData] = useState(null);
  const db = FIREBASE_DB;
  const auth = FIREBASE_AUTH;

  useEffect(() => {
    fetchUserData();
    getCategories();
    getRecipes();
  }, []); 

  const handleChangeCategory = (category) => { 
    getRecipes(category); 
    setActiveCategory(category);
    setMeals([]);
  }; 

  const fetchUserData = async () => {
    const db = firebase.firestore();
    const userDocRef = db.collection("users").doc("USER_ID"); // Adjust "USER_ID" according to your database structure

    try {
      const userDocSnap = await userDocRef.get();
      if (userDocSnap.exists) {
        const userData = userDocSnap.data();
        setUserName(userData.name || ''); // Assuming 'username' is a field in your user data
        setProfileImageUrl(userData.profileImage || ''); // Assuming 'profileImage' is a field in your user data
      } else {
        console.log('No such document!');
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

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

          {/* Avatar and Bell Icon */}
          <View className = "mx-4 flex-row justify-between items-center"> 
            <AdjustmentsHorizontalIcon size = {hp(4)} color = {"gray"}/>
            <Image
              // source={profileImageUrl ? { uri: profileImageUrl } : require("../../assets/images/DefaultAvatar.png")}
              style = {{
                width: hp(5),
                height: hp(5), 
                resizeMode: "cover",
              }}
              className = "rounded-full"
            />
          </View>

          {/* Temporary profile page navigator */}
          <Button title="Go to Profile" onPress={() => navigation.navigate('Profile')} />

          {/* Headlines */}
          <View className = "mx-4 space-y-1 mb-2"> 
            <View> 
              <Text
              style = {{
                fontSize: hp(3),
              }}
              className = "font-bold text-neutral-800"> 
                Hi, {userName} {/* Display user name */}
              </Text>
            </View>

            <Text
            style = {{
              fontSize: hp(3.5), 
            }}
            className = "font-extrabold text-[#ebb01a]"> 
                What's cooking today? 
            </Text>
          </View>

          {/* Search bar */}
          <View className= "mx-4 flex-row items-center border rounded-xl border-gray p-[6px]"> 
            <View className = "bg-white rounded-full p-2">
              <MagnifyingGlassIcon 
              size = {hp(2.5)} 
              color = {"#ff8271"} 
              strokeWidth = {3}
              />
            </View>
            <TextInput 
            placeholder='Look for recipe'
            placeholderTextColor = {'gray'}
            style = {{
              fontSize: hp(1.7)
            }}
            className = "flex-1 text-base mb-1, pl-1 tracking-widest"
            />
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

{/* when you are doing your code and you dk whats the problem 
1. check the files exist in your terminal 
2. disconnect server and reconnect again */}

{/* StatusBar is the bar at the top of the screen that displays info like time, 
battery level and network status 

can import StatusBar from "react-native" 
or from "expo-status-bar"*/}