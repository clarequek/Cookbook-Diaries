import React, { useState, useEffect, useRef } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, Modal, TextInput, Button, FlatList } from "react-native";
import { FIREBASE_AUTH, FIREBASE_DB } from '../../FirebaseConfig';
import { getDoc, doc, collection, query, getDocs, onSnapshot, where, addDoc } from 'firebase/firestore';
import { colors } from "../utilities/colors";
import { useNavigation } from "@react-navigation/native";
import { fonts } from "../utilities/fonts";
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import { CachedImage } from '../utilities/index'
import { LinearGradient } from 'expo-linear-gradient';

import DefaultAvatar1 from '../../assets/images/DefaultAvatar1.png';
import DefaultAvatar2 from '../../assets/images/DefaultAvatar2.png';
import DefaultAvatar3 from '../../assets/images/DefaultAvatar3.png';
import DefaultAvatar4 from '../../assets/images/DefaultAvatar4.png';
import DefaultAvatar5 from '../../assets/images/DefaultAvatar5.png';


export default function ProfileScreen() {
  const [userData, setUserData] = useState(null);
  const [selectedProfileImage, setSelectedProfileImage] = useState(null);
  const db = FIREBASE_DB;
  const auth = FIREBASE_AUTH;
  const navigation = useNavigation();
  const [numPosts, setNumPosts] = useState(0);
  const [numFavourites, setNumFavourites] = useState(0);
  const [totalLikes, setTotalLikes] = useState(0);
  const [posts, setPosts] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState('');
  const [savedClick, setSavedClick] = useState(true);
  const [gridClick, setGridClick] = useState(false);
  const [favouriteRecipes, setFavouriteRecipes] = useState([])
  const inputRef = useRef(null); // Ref for TextInput


    const fetchUserData = async () => {
      try {
        const userDocRef = doc(db, "users", auth.currentUser.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          setUserData(userData);

          // Set the profile image based on the stored value
          switch (userData.profileImage) {
            case 1:
              setSelectedProfileImage(DefaultAvatar1);
              break;
            case 2:
              setSelectedProfileImage(DefaultAvatar2);
              break;
            case 3:
              setSelectedProfileImage(DefaultAvatar3);
              break;
            case 4:
              setSelectedProfileImage(DefaultAvatar4);
              break;
            case 5:
              setSelectedProfileImage(DefaultAvatar5);
              break;
            default:
              setSelectedProfileImage(DefaultAvatar1);
              break;
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };


  useEffect(() => {
    const unsubscribeFocus = navigation.addListener('focus', () => {
      fetchUserData();
      fetchNumPosts();
      fetchTotalLikes();
      fetchFavouriteRecipes();
      fetchPosts()
    });
  
    return unsubscribeFocus;
  }, [navigation]); // Make sure to include navigation as a dependency if using it inside the effect

    const fetchPosts = async () => {
      try {
        const q = query(collection(db, 'posts'), where("user", "==", auth.currentUser.uid));
        const querySnapshot = await getDocs(q);
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
          const postsData = [];
          querySnapshot.forEach((doc) => {
            const postData = doc.data();
            postsData.push({ id: doc.id, ...postData });
          });
          setPosts(postsData);
          console.log("Posts fetched")
        });
        return unsubscribe;
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };


    const fetchNumPosts = async () => {
      try {
        const q = query(collection(db, 'posts'), where("user", "==", auth.currentUser.uid));
        const querySnapshot = await getDocs(q);
        setNumPosts(querySnapshot.size);
      } catch (error) {
        console.error("Error fetching number of posts:", error);
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
    
    const fetchFavouriteRecipes = async () => {
      try {
        const userRef = doc(FIREBASE_DB, 'users', FIREBASE_AUTH.currentUser.uid);
        const userDoc = await getDoc(userRef);
    
        if (userDoc.exists()) {
          const userData = userDoc.data();
          const favouritesArray = userData.favourites || [];
          setNumFavourites(favouritesArray.length);
    
          // Prepare an array to store favourite recipes
          const favouriteRecipesData = [];
    
          // Loop through each favourite recipe ID and fetch details from the API
          for (const recipe of favouritesArray) {
            console.log("Fetching recipe ID:", recipe.strMeal); // Log the recipe ID
            const recipeData = await getMealData(recipe.mealId);
            if (recipeData) {
              favouriteRecipesData.push({ id: recipe.mealId, ...recipeData });
            }
          }
    
          setFavouriteRecipes(favouriteRecipesData);
        } else {
          console.warn("User document not found.");
        }
      } catch (error) {
        console.error("Error fetching favorite recipes:", error);
      }
    };

    const fetchTotalLikes = async () => {
      try {
        const q = query(collection(db, 'posts'), where("userId", "==", auth.currentUser.uid));
        const querySnapshot = await getDocs(q);
        let likesCount = 0;
        querySnapshot.forEach((doc) => {
          const postData = doc.data();
          const postLikes = postData.likes || 0;
          likesCount += postLikes;
        });
        setTotalLikes(likesCount);
      } catch (error) {
        console.error("Error fetching total likes:", error);
      }
    };


    const renderGridItem = ({ item }) => (
      <TouchableOpacity> 
      {/*navigation.navigate('ViewPostScreen', { post: { id: item.id, image: item.image, text: item.text } })} style={styles.touchableOpacity}> */}
        <View style={styles.postContainer}>
          {item.image && (
            <Image source={{ uri: item.image }} style={styles.postImage} />
          )}
        </View>
      </TouchableOpacity>
    );

  const renderBio = () => {
    return userData?.bio || "What's cooking!";
  };

  const renderExperience = () => {
    return userData?.experience || "Cook";
  };

  const renderPostsGrid = () => {
    const gridItems = [];
    const chunkSize = 3; // Number of columns per row

    for (let i = 0; i < posts.length; i += chunkSize) {
      const chunk = posts.slice(i, i + chunkSize);
      gridItems.push(
        <View key={i} style={styles.rowContainer}>
          {chunk.map(post => (
            <View key={post.id} style={styles.gridItem}>
              {renderGridItem({ item: post })}
            </View>
          ))}
        </View>
      );
    }

    return gridItems;
  };

  // Render function for displaying favorite recipes
  const renderFavouriteRecipes = () => {
    return (
      <ScrollView 
      //horizontal = {true} showsHorizontalScrollIndicator={false}
      >
        {favouriteRecipes.map((recipe) => (
        <TouchableOpacity 
          key={recipe.id} 
          onPress={() => navigation.navigate("RecipeDetails", { ...recipe })}
          style = {{marginLeft: 12,}}>
          {/* Recipe Image */}
        <View className = "flex-row, justify-center"> 
            <CachedImage 
                uri = {recipe.strMealThumb}
                sharedTransitionTag = {recipe.strMeal}
                style = {{ 
                    width: 400,
                    height: 200,
                    borderRadius: 30,
                    marginBottom: 10,
                }}
            />
            <LinearGradient
              colors={["transparent", "rgba(0,0,0,0.9)"]}
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                width: 400,
                height: 200, // Match the gradient height to the card height
                borderTopLeftRadius: 35,
                borderTopRightRadius: 35,
                borderBottomLeftRadius: 35, // Match the border radius of the image
                borderBottomRightRadius: 35, // Match the border radius of the image
                marginBottom: 10,
              }}
              start={{ x: 0.5, y: 0.0 }}
              end={{ x: 0.5, y: 1.0 }}
            />
            <Text style={styles.recipeItem}> 
              {recipe.strMeal.length > 20 ? recipe.strMeal.slice(0, 20) + '...' : recipe.strMeal} 
            </Text> 
        </View>
        </TouchableOpacity>
        ))}
      </ScrollView>
    );
  };

  return (
    <View style={styles.container}>
      {userData && (
        <>
        <View style = {{
          flexDirection: "row",
          alignItems: "center",
          marginTop: 50,
          justifyContent: "space-between",}}>
          <Text style = {styles.username}> {userData.username}</Text>
          <TouchableOpacity style = {{marginRight: 10}} onPress = {() => navigation.navigate("Settings")}>
            <Ionicons name = {"cog"} size = {30} />
          </TouchableOpacity>
        </View>
          <View style={styles.profileContainer}>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginRight: 40 }}>
              <Image
                source={selectedProfileImage}
                style={styles.profileImage}
              />
              <View style={{ alignItems: "center" }}>
                <Text style={styles.stats}> {numPosts} </Text>
                <Text style={styles.subtitles}> Posts </Text>
              </View>

              <View style={{ alignItems: "center" }}>
                <Text style={styles.stats}> {numFavourites} </Text>
                <Text style={styles.subtitles}> Favourites </Text>
              </View>

              <View style={{ alignItems: "center" }}>
                <Text style={styles.stats}> {totalLikes} </Text>
                <Text style={styles.subtitles}> Likes </Text>
              </View>
            </View>
            <Text style={styles.name}>{userData.name}</Text>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={styles.experience}> {renderExperience()} </Text>
              <Text> | </Text>
              <Text style={styles.bio}>{renderBio()} </Text>
            </View>
          </View>

          {/* Edit Profile Button */}
          <TouchableOpacity style={styles.buttonContainer} onPress={() => navigation.navigate("EditProfile")}>
            <Text style={styles.editText}> Edit Profile </Text>
          </TouchableOpacity>

          {/* Tab Buttons */}

          <View style = {{flexDirection: "row", justifyContent: "space-around", marginTop: 20}}> 
            <View style = {{alignItems: "center"}}>
              <TouchableOpacity 
                onPress = {() => {setSavedClick(true);  setGridClick(false)}}>
                <Ionicons
                  name={"bookmark"}
                  size = {25}
                  color={savedClick ? colors.black : colors.lightgrey} />
              </TouchableOpacity>
              <Text style={{ color: savedClick ? colors.black : colors.cream, }}>
                ________________________
              </Text>
            </View>

            <View style = {{alignItems: "center"}}>
              <TouchableOpacity onPress = {() => {setGridClick(true); setSavedClick(false)}}>
                <Ionicons
                  name={"apps"} 
                  size = {25}
                  color={gridClick ? colors.black : colors.lightgrey} />
              </TouchableOpacity>
              <Text style={{ color: gridClick ? colors.black : colors.cream,}}>
                ________________________
              </Text>
            </View>
          </View>

          {/* Posts or Favourites */}
          {gridClick ? (
            <ScrollView>
              <View style={styles.postsContainer}>
                {renderPostsGrid()}
              </View>
            </ScrollView>

          ) : ( 
            <ScrollView>
            <View style={styles.collectionsContainer}>

              {/* Favourites */}
              <Text style = {[styles.title, {marginLeft: 12}]}>Your favourites</Text>
              {renderFavouriteRecipes()}

            </View>
            </ScrollView>
          )}
        </>
      )}
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.cream,
    //position: 'absolute',
  },
  profileContainer: {
    marginTop: 10,
    marginLeft: 20,
  },
  buttonContainer: {
    justifyContent: "center",
    alignItems: "center",
    alignContent: "space-evenly",
    backgroundColor: colors.pink,
    flexDirection: 'row',
    borderRadius: 10,
    width: '95%',
    marginTop: 25,
    height: 40,
    alignSelf: "center", // Center the button horizontally
  },
  profileImage: {
    width: 90,
    height: 90,
    borderRadius: 75,
    marginBottom: 20,
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    fontFamily: fonts.Bold,
  },
  username: {
    fontSize: 17,
    fontFamily: fonts.SemiBold,
    alignSelf: "center",
    textAlign: "center",
    flex: 1,
    marginLeft: 30,
  },
  bio: {
    fontSize: 15,
    //color: colors.darkgrey,
  },
  experience: {
    fontSize: 15,
    color: colors.darkergrey,
    marginLeft: -2,
  },
  editText: {
    fontFamily: fonts.SemiBold,
    color: colors.white,
  },
  subtitles: {
    color: colors.darkgrey,
    fontSize: 13,
  },
  stats: {
    color: colors.black,
    fontSize: 20,
    fontFamily: fonts.Bold,
  },
  postsContainer: {
    marginTop: 18,
  },
  postContainer: {
    marginBottom: 20,
  },
  postImage: {
    width: '33%',
    height: '33%',
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: -18.5,
  },
  modalContainer: {
    backgroundColor: colors.white,
    width: '100%',
    height: 523,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    marginTop: 330,
    alignSelf: "center",
    position: "absolute",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontFamily: fonts.SemiBold,
    marginTop: 10,
    marginBottom: 10,
  },
  inputContainer: {
    alignSelf: "center",
    width: '90%',
    padding: 10,
    borderRadius: 20,
    flexDirection: "row",
    backgroundColor: colors.lightergrey,
    alignItems: "center",
    marginTop: 20,
  },
  input: {
    flex: 1,
    paddingHorizontal: 20,
    fontFamily: fonts.Light,
    color: colors.black,
  },
  collectionName: {
    fontWeight: 'bold',
    marginLeft: 12,
    fontSize: 18,
  },
  recipeItem: {
    fontSize: hp(2.0),
    color: colors.white,
    marginLeft: 10,
    fontFamily: fonts.SemiBold,
    marginBottom: 10,
    position: 'absolute', // Position text on top of the gradient
    bottom: 10, // Position text at the bottom of the gradient
  }


});