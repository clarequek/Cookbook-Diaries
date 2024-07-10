
import { View, Text, ScrollView, SafeAreaView, Image, TextInput, Button, StyleSheet, TouchableOpacity

} from 'react-native'
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
import Ionicons from 'react-native-vector-icons/Ionicons';
import { fonts } from "../utilities/fonts";
import { colors } from "../utilities/colors";


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
     {/* Back arrow button */}
     <TouchableOpacity style={styles.backButtonWrapper} onPress={() => navigation.goBack()}>
       <View style={styles.iconContainer}>
         <Ionicons name={"arrow-back-outline"} color='#000000' size={25} />
       </View>
     </TouchableOpacity>

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

         {/* Headlines */}
         <View className = "mx-4 space-y-1 mb-2"> 
           <View> 
             <Text
             style = {{
               fontSize: hp(3),
               fontFamily: fonts.SemiBold,
             }}
             className = "font-bold text-neutral-800"> 
               Hi, {userName} {/* Display user name */}
             </Text>
           </View>

           <Text
           style = {{
             fontSize: hp(3.5), 
             fontFamily: fonts.Bold,
           }}
           className = "font-extrabold text-[#ebb01a]"> 
               What's cooking today? 
           </Text>
         </View>

         {/* Search bar */}
         <View style={styles.inputContainer}>
           
           <Ionicons name={"search-outline"} size={30} color={colors.darkgrey} />
           <TextInput
             style= {styles.input}
             placeholder="Look for a recipe"
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
 input: {
   flex: 1,
   paddingHorizontal: 20,
   fontFamily: fonts.Light,
 },
 inputContainer: {
   borderWidth: 1,
   padding: 10,
   borderRadius: 100,
   flexDirection: "row",
   borderColor: colors.darkgrey,
   alignItems: "center",
   marginBottom: 20,
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
