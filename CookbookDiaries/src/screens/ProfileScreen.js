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
import { ChevronLeftIcon } from 'react-native-heroicons/outline'
import { heightPercentageToDP as hp } from "react-native-responsive-screen";

import DefaultAvatar1 from '../../assets/images/DefaultAvatar1.png';
import DefaultAvatar2 from '../../assets/images/DefaultAvatar2.png';

export default function ProfileScreen() {
  const [userData, setUserData] = useState(null);
  const [selectedProfileImage, setSelectedProfileImage] = useState(null);
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

          // Set the profile image based on the stored value
          if (userData.profileImage === 1) {
            setSelectedProfileImage(DefaultAvatar1);
          } else if (userData.profileImage === 2) {
            setSelectedProfileImage(DefaultAvatar2);
          } else {
            // Fallback to default image
            setSelectedProfileImage(DefaultAvatar1);
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
    <View className = "flex-1 bg-[#fff5e6]">
      <TouchableOpacity 
            style = {{
              borderRadius: 100,
              width: 45,
              height: 45,
              marginTop: 50,
              marginLeft: 20,
              backgroundColor: colors.white,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress = {() => navigation.goBack()}
        >
          <ChevronLeftIcon
            size={hp(3.5)}
            color={colors.pink}
            strokeWidth={4.5}
          />
      </TouchableOpacity>
      
      {userData && (
        <>
          <View style={styles.profileContainer}>
            <Image
              source={selectedProfileImage}
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