import React, { useState, useEffect } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { FIREBASE_AUTH, FIREBASE_DB } from '../../FirebaseConfig';
import { getDoc, doc, collection, query, getDocs, onSnapshot, where } from 'firebase/firestore';
import { colors } from "../utilities/colors";
import { useNavigation } from "@react-navigation/native";
import { fonts } from "../utilities/fonts";

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
  const [totalLikes, setTotalLikes] = useState(0);
  const [collections, setColections] = useState(0);
  const [posts, setPosts] = useState([]);


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

  return (
    <View style={styles.container}>
      {userData && (
        <>
        <Text style = {styles.username}> {userData.username}</Text>
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
                <Text style={styles.stats}> {collections} </Text>
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

          {/* Posts */}
          <ScrollView>
            <View style={styles.postsContainer}>
              {renderPostsGrid()}
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
    width: '90%',
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
    marginBottom: 10,
    fontFamily: fonts.SemiBold,
    alignSelf: "center",
    marginTop: 50,
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
    marginTop: 60,
  },
  postContainer: {
    marginBottom: 20,
  },
  postImage: {
    width: 129,
    height: 129,
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: -18.5,
  },
});
