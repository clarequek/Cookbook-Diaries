import React, { useState, useEffect } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, Modal, Button } from "react-native";
import { FIREBASE_AUTH, FIREBASE_DB } from '../../FirebaseConfig';
import { getDoc, doc, query, collection, where, getDocs } from 'firebase/firestore';
import { colors } from "../utilities/colors";
import { useNavigation } from "@react-navigation/native";
import { fonts } from "../utilities/fonts";
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { CachedImage } from '../utilities/index';
import { LinearGradient } from 'expo-linear-gradient';
import { signOut } from 'firebase/auth';

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
  const [numFavourites, setNumFavourites] = useState(0);
  const [totalLikes, setTotalLikes] = useState(0);
  const [favouriteRecipes, setFavouriteRecipes] = useState([]);
  const [savedClick, setSavedClick] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    let isMounted = true; // Track if the component is mounted

    const fetchUserData = async () => {
      try {
        const userDocRef = doc(db, "users", auth.currentUser.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          if (isMounted) {
            setUserData(userData);

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
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    const fetchTotalLikes = async () => {
      try {
        const q = query(collection(db, 'posts'), where("user", "==", auth.currentUser.uid));
        const querySnapshot = await getDocs(q);
        let likesCount = 0;

        const promises = querySnapshot.docs.map(async (doc) => {
          const likesCollectionRef = collection(db, `posts/${doc.id}/likes`);
          const likesSnapshot = await getDocs(likesCollectionRef);
          likesCount += likesSnapshot.size;
        });

        await Promise.all(promises);
        if (isMounted) {
          setTotalLikes(likesCount);
        }
      } catch (error) {
        console.error("Error fetching total likes:", error);
      }
    };

    const fetchFavouriteRecipes = async () => {
      try {
        const userRef = doc(FIREBASE_DB, 'users', FIREBASE_AUTH.currentUser.uid);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          const favouritesArray = userData.favourites || [];
          if (isMounted) {
            setNumFavourites(favouritesArray.length);
          }

          const favouriteRecipesData = [];

          for (const recipe of favouritesArray) {
            console.log("Fetching recipe ID:", recipe.strMeal); 
            const recipeData = await getMealData(recipe.mealId);
            if (recipeData) {
              favouriteRecipesData.push({ id: recipe.mealId, ...recipeData });
            }
          }

          if (isMounted) {
            setFavouriteRecipes(favouriteRecipesData);
          }
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

    fetchUserData();
    fetchTotalLikes();
    fetchFavouriteRecipes();

    return () => {
      isMounted = false; // Cleanup the effect
    };
  }, []);

  const handleLogout = async () => {
    try {
      setModalVisible(false);
      await signOut(FIREBASE_AUTH);
      // Navigate to the welcome screen after successful sign out
      navigation.reset({
        index: 0,
        routes: [{ name: 'Welcome' }],
      });
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };

  const renderBio = () => {
    return userData?.bio || "What's cooking!";
  };

  const renderExperience = () => {
    return userData?.experience || "Cook";
  };

  const renderFavouriteRecipes = () => {
    return (
      <ScrollView>
        {favouriteRecipes.map((recipe) => (
          <TouchableOpacity
            key={recipe.id}
            onPress={() => navigation.navigate("RecipeDetails", { ...recipe })}
          >
            <View style={{ 
              justifyContent: "center" 
               }}>
              <CachedImage
                uri={recipe.strMealThumb}
                sharedTransitionTag={recipe.strMeal}
                style={{
                  width: 350,
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
                  width: 350,
                  height: 200,
                  borderTopLeftRadius: 35,
                  borderTopRightRadius: 35,
                  borderBottomLeftRadius: 35,
                  borderBottomRightRadius: 35,
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
          <View style={{
            flexDirection: "row",
            alignItems: "center",
            marginTop: 50,
            justifyContent: "space-between",
          }}>
            <Text style={styles.username}> {userData.username}</Text>

            {/* Logout Functionality */}
            <TouchableOpacity style={{ marginRight: 10 }} onPress={() => setModalVisible(true)}>
              <Ionicons name={"log-out"} size={30} />
            </TouchableOpacity>

            <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => setModalVisible(false)}
            >
              <View style={styles.modalContainer}>
                <View style={styles.modalView}>
                  <Text style={styles.modalText}>Are you sure you want to log out?</Text>
                  <TouchableOpacity onPress={handleLogout} style = {{marginBottom: 10}}>
                    <Text style = {{fontFamily: fonts.SemiBold, color: colors.pink, fontSize: 15}}> Log Out </Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setModalVisible(false)}>
                    <Text style = {{fontFamily: fonts.Regular, color: colors.pink}}> Cancel </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          </View>
          <View style={styles.profileContainer}>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginRight: 40 }}>
              <Image
                source={selectedProfileImage}
                style={styles.profileImage}
              />
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
          <View style={{ flexDirection: "row", justifyContent: "space-around", marginTop: 20 }}>
            <View style={{ alignItems: "center" }}>
              <TouchableOpacity
                onPress={() => { setSavedClick(true); }}>
                <Ionicons
                  name={"bookmark"}
                  size={25}
                  color={savedClick ? colors.black : colors.lightgrey} />
              </TouchableOpacity>
              <Text style={{ color: savedClick ? colors.black : colors.cream, }}>
                ________________________
              </Text>
            </View>
          </View>

          {/* Favourites */}
          <ScrollView>
            <View style = {{alignItems: "center"}}>
              <Text style={styles.title}>Your favourites</Text>
              {renderFavouriteRecipes()}
            </View>
          </ScrollView>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.cream,
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
    alignSelf: "center",
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
  title: {
    fontSize: 24,
    fontFamily: fonts.SemiBold,
    marginTop: 10,
    marginBottom: 10,
  },
  recipeItem: {
    fontSize: hp(2.0),
    color: colors.white,
    marginLeft: 10,
    fontFamily: fonts.SemiBold,
    marginBottom: 10,
    position: 'absolute',
    bottom: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalView: {
    width: 300,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    elevation: 5,
  },
  modalText: {
    marginBottom: 20,
    textAlign: "center",
    fontSize: 18,
    fontFamily: fonts.SemiBold,
  },
});
