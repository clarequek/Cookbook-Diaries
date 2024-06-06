import React, { useState, useEffect } from "react";
import { View, Text, Image, StyleSheet, Button } from "react-native";
import { FIREBASE_AUTH, FIREBASE_DB } from '../../FirebaseConfig';
import { getDoc, doc } from 'firebase/firestore';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import { colors } from "../utilities/colors";
import { useNavigation } from "@react-navigation/native";

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

  return (
    <View style={styles.container}>
      {userData && (
        <>
          <View style={styles.profileContainer}>
            {/* Temporary profile page navigator */}
            <Button title="Go to Home" onPress={() => navigation.navigate('Home')} />

            <Image
              source={profileImageUrl ? { uri: profileImageUrl } : require("../../assets/images/DefaultAvatar.png")}
              style={styles.profileImage}
            />
            <Text style={styles.username}>{userData.username}</Text>
            <Text style={styles.email}>{userData.email}</Text>
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
    justifyContent: "center",
    alignItems: "center",
  },
  profileContainer: {
    alignItems: "center",
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
  },
  email: {
    fontSize: 16,
    color: colors.darkgrey,
  },
});