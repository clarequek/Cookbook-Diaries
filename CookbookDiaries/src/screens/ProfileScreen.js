import React, { useState, useEffect } from "react";
import { View, Text, Image, StyleSheet, Button, TouchableOpacity } from "react-native";
import { FIREBASE_AUTH, FIREBASE_DB } from '../../FirebaseConfig';
import { getDoc, doc } from 'firebase/firestore';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import { colors } from "../utilities/colors";
import { useNavigation } from "@react-navigation/native";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { RotateInDownLeft } from "react-native-reanimated";
import { fonts } from "../utilities/fonts";

export default function ProfileScreen() {
  const [userData, setUserData] = useState(null);
  const [profileImageUrl, setProfileImageUrl] = useState(null);
  const db = FIREBASE_DB;
  const auth = FIREBASE_AUTH;
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDocRef = doc(db, "users", auth.currentUser.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          setUserData(userData);

          if (userData.profileImage) {
            const storage = getStorage();
            const imageRef = ref(storage, userData.profileImage);
            const imageUrl = await getDownloadURL(imageRef);
            setProfileImageUrl(imageUrl);
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const renderBio = () => {
    return userData.bio ? userData.bio : "No bio yet.";
  };

  const renderExperience = () => {
    return userData.experience ? userData.experience : "Cook";
  };

  return (
    <View style={styles.container}>
      {/* Back arrow button */}
      <TouchableOpacity style={styles.backButtonWrapper} onPress={() => navigation.goBack()}>
        <View style={styles.iconContainer}>
          <Ionicons name={"arrow-back-outline"} color='#000000' size={25} />
        </View>
      </TouchableOpacity>
      
      {userData && (
        <>
          <View style={styles.profileContainer}>
            <Image
              source= {require("../../assets/images/DefaultAvatar1.png")}
              style={styles.profileImage}
            />
            <Text style={styles.username}>{userData.username}</Text>
            <Text style={styles.email}>{userData.email}</Text>
            <Text style={styles.experience}>Experience: {renderExperience()}</Text>
            <Text style={styles.bio}>{renderBio()}</Text>
            <TouchableOpacity style = {styles.buttonContainer} onPress = {() => navigation.navigate("EditProfile")}>
              <Ionicons name={"pencil-outline"} size={20} color={colors.white} />
              <Text style={styles.editText}> Edit Profile </Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.cream,
    padding: 20,
  },
  profileContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  buttonContainer: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.pink,
    flexDirection: 'row',
    borderRadius: 20,
    width: 125,
    marginTop: 25,
    height: 30,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
  },
  username: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    fontFamily: fonts.Bold,
  },
  email: {
    fontSize: 16,
    color: colors.darkgrey,
    fontFamily: fonts.SemiBold,
  },
  bio: {
    fontSize: 14,
    color: colors.grey,
    fontFamily: fonts.Regular,
    marginVertical: 10,
    textAlign: 'center',
    marginTop: 0,
  },
  experience: {
    fontSize: 16,
    color: colors.black,
    fontFamily: fonts.SemiBold,
    marginBottom: 10,
    marginTop: 10,
  },
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
 editText: {
    fontFamily: fonts.SemiBold, 
    color: colors.white,
  }
});