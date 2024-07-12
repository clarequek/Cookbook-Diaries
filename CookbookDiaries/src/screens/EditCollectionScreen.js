import React, { useState, useEffect, useRef } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, Modal, TextInput, Button } from "react-native";
import { FIREBASE_AUTH, FIREBASE_DB } from '../../FirebaseConfig';
import { getDoc, doc, collection, query, getDocs, onSnapshot, where, addDoc } from 'firebase/firestore';
import { colors } from "../utilities/colors";
import { useNavigation } from "@react-navigation/native";
import { fonts } from "../utilities/fonts";
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from 'axios';

import DefaultAvatar1 from '../../assets/images/DefaultAvatar1.png';
import DefaultAvatar2 from '../../assets/images/DefaultAvatar2.png';
import DefaultAvatar3 from '../../assets/images/DefaultAvatar3.png';
import DefaultAvatar4 from '../../assets/images/DefaultAvatar4.png';
import DefaultAvatar5 from '../../assets/images/DefaultAvatar5.png';


export default function EditCollectionScreen() {
  const [userData, setUserData] = useState(null);
  const [selectedProfileImage, setSelectedProfileImage] = useState(null);
  const db = FIREBASE_DB;
  const auth = FIREBASE_AUTH;
  const navigation = useNavigation();
  const [numPosts, setNumPosts] = useState(0);
  const [totalLikes, setTotalLikes] = useState(0);
  const [collections, setCollections] = useState([]);
  const [numCollections, setNumCollections] = useState(0);
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
      fetchNumCollections();
      fetchCollections();
      fetchFavouriteRecipes();
    });
  
    return unsubscribeFocus;
  }, [navigation]); // Make sure to include navigation as a dependency if using it inside the effect

  useEffect(() => {
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
        });
        return unsubscribe;
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, []);

    const fetchNumPosts = async () => {
      try {
        const q = query(collection(db, 'posts'), where("user", "==", auth.currentUser.uid));
        const querySnapshot = await getDocs(q);
        setNumPosts(querySnapshot.size);
      } catch (error) {
        console.error("Error fetching number of posts:", error);
      }
    };

    const fetchNumCollections = async () => {
      try {
        const q = query(collection(db, 'collections'), where("user", "==", auth.currentUser.uid));
        const querySnapshot = await getDocs(q);
        setNumCollections(querySnapshot.size);
      } catch (error) {
        console.error("Error fetching number of collections:". error);
      }
    }

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
    
          // Prepare an array to store favourite recipes
          const favouriteRecipesData = [];
    
          // Loop through each favourite recipe ID and fetch details from the API
          for (const recipe of favouritesArray) {
            console.log("Fetching recipe ID:", recipe.strMeal); // Log the recipe ID
            const recipeData = await getMealData(recipe.mealId);
            if (recipeData) {
              favouriteRecipesData.push({ id: recipe.strMeal, ...recipeData });
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

    const fetchCollections = async () => {
      try {
        const q = query(collection(db, 'collections'), where("user", "==", auth.currentUser.uid));
        const querySnapshot = await getDocs(q);
        const collectionsData = []; //empty array to store the collections
        querySnapshot.forEach((doc) => {
          collectionsData.push({ id: doc.id, ...doc.data() });
        });
        setCollections(collectionsData);
      } catch (error) {
        console.error("Error fetching collections:", error);
      }
    };
    useEffect(() => {
      fetchCollections();
    } , []);
  
    const handleCreateCollection = async () => {
      try {
        if (!newCollectionName) {
          alert('Please enter a name for your new collection.');
          return; // Exit function if name is empty
        }
        await addDoc(collection(db, 'collections'), {
          user: auth.currentUser.uid,
          name: newCollectionName,
          recipes:  [],
          createdAt: new Date()
        });
        setNewCollectionName('');
        setIsModalVisible(false);
        fetchCollections(); // Refresh collections
      } catch (error) {
        console.error("Error creating collection:", error);
      }
    };

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

  // Render function for displaying collections
  const renderCollections = () => {
    return collections.map((collection) => (
      <View>
        <TouchableOpacity
          key={collection.id}
          style={styles.collectionItem}
          onPress={() => {
          // Navigate to the collection details screen or perform other actions
          }}
        >
          <Text style={styles.collectionName}>{collection.name}</Text>
        {/* Add more details or actions related to each collection */}
        </TouchableOpacity>
      </View>
    ));
  };

  // Render function for displaying favorite recipes
  const renderFavouriteRecipes = () => {
    return favouriteRecipes.map((recipe) => (
      <View key={recipe.id}>
        <TouchableOpacity onPress={() => navigation.navigate("RecipeDetails", { ...item })}>
          <Text style={styles.recipeItem}> {recipe.strMeal} </Text> 
          {/* will be replaced with recipe image */}
        </TouchableOpacity>
      </View>
    ));
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
                <Text style={styles.stats}> {numCollections} </Text>
                <Text style={styles.subtitles}> Collections </Text>
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

          {/* Posts or Collections*/}
          {gridClick ? (
            <ScrollView>
              <View style={styles.postsContainer}>
                {renderPostsGrid()}
              </View>
            </ScrollView>

          ) : ( 

            <View style={styles.collectionsContainer}>
              <TouchableOpacity style={[styles.buttonContainer, {marginBottom: 20,}]} onPress={handleOpenModal}>
                <Ionicons name = {"add"} size = {20} color = {colors.white} />
                <Text style={styles.editText}>    Create new collection</Text>
              </TouchableOpacity>
              {/* Favourites */}
              <Text style = {[styles.title, {marginLeft: 12}]}>Your favourites</Text>
              {renderFavouriteRecipes()}

              {/* Collections */}
              <Text style = {[styles.title, {marginTop: 10, marginLeft: 12}]}>Your collections</Text>
              <ScrollView 
                //style={styles.collectionsScrollView}
              >
                {renderCollections()}
              </ScrollView>
            </View>
          )}

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
                <Text style = {[styles.title, {textAlign: "center", flex:1}]}> New collection </Text>
                <TouchableOpacity 
                  onPress = {() => setIsModalVisible(false)}
                >
                  <Ionicons name = {"close"} size = {25}/>
                </TouchableOpacity>
              </View>

              <View style = {styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Enter collection name"
                  value={newCollectionName}
                  onChangeText={setNewCollectionName}
                  placeholderTextColor={colors.darkgrey}
                  autoFocus={true}
               />
              </View>

              <TouchableOpacity style={styles.buttonContainer} 
                onPress={handleCreateCollection}
              >
                <Text style={styles.editText}> Create </Text>
              </TouchableOpacity>

              
            </View>
            
          </Modal>

        

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
    fontSize: 18,
    fontFamily: fonts.SemiBold,
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
    fontWeight: "normal",
    marginLeft: 10,
    fontSize: 15,
  }


});