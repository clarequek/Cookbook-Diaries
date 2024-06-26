import React, { useState, useEffect } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Button, Image, Modal } from "react-native";
import { FIREBASE_AUTH, FIREBASE_DB } from '../../FirebaseConfig';
import { collection, query, doc, where, getDocs, setDoc, getDoc } from 'firebase/firestore';
import { colors } from "../utilities/colors";
import { fonts } from "../utilities/fonts";
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from "@react-navigation/native";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { ChevronLeftIcon } from 'react-native-heroicons/outline'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Alert } from 'react-native';

import DefaultAvatar1 from '../../assets/images/DefaultAvatar1.png';
import DefaultAvatar2 from '../../assets/images/DefaultAvatar2.png';
import DefaultAvatar3 from '../../assets/images/DefaultAvatar3.png';
import DefaultAvatar4 from '../../assets/images/DefaultAvatar4.png';
import DefaultAvatar5 from '../../assets/images/DefaultAvatar5.png';

export default function EditProfileScreen() {
    const [profileImage, setProfileImage] = useState(null);
    const [username, setUsername] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [bio, setBio] = useState('');
    const [experience, setExperience] = useState('');
    const [grocerylist, setGrocerylist] = useState([]);
    const db = FIREBASE_DB;
    const auth = FIREBASE_AUTH;
    const navigation = useNavigation();
    
    const checkUsernameExists = async (username) => {
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('username', '==', username));
      const querySnapshot = await getDocs(q);
      return !querySnapshot.empty;
    };

    useEffect(() => {

      const fetchUserData = async () => {
          try {
              const userDocRef = doc(db, "users", auth.currentUser.uid);
              const userDocSnap = await getDoc(userDocRef);                
              if (userDocSnap.exists()) {
                const userData = userDocSnap.data();
                setUsername(userData.username);
                setName(userData.name);
                setEmail(userData.email);
                setBio(userData.bio || '');
                setProfileImage(userData.profileImage);
                setExperience(userData.experience || 'No experience stated.');
                setGrocerylist(userData.grocerylist || []); //to ensure that grocerylist is still captured after editing
              }
          } catch (error) {
            console.error("Error fetching user data:", error);
          }
      };

        fetchUserData();
    }, []);

  const handleSave = async () => {
    try {
      const userDocRef = doc(db, "users", auth.currentUser.uid);
      if (await checkUsernameExists(username)) {
        Alert.alert("Username already exists", "Please choose a different username.");
        return;
      }

      await setDoc(userDocRef, {
        profileImage,
        username,
        name,
        email,
        bio,
        experience,
        grocerylist,
      });

      navigation.goBack();
    } catch (error) {
      console.error("Error saving user data:", error);
    }
  };

  const profileImages = [
    DefaultAvatar1,
    DefaultAvatar2,
    DefaultAvatar3,
    DefaultAvatar4,
    DefaultAvatar5,
  ];

  const experienceOptions = [
    "Beginner",
    "Intermediate",
    "Advanced",
  ];

  return (
    <View className = "flex-1 bg-[#fff5e6]">
        <TouchableOpacity 
            style = {{
              borderRadius: 100,
              width: 35,
              height: 35,
              marginTop: 50,
              marginLeft: 20,
              backgroundColor: colors.white,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress = {() => navigation.goBack()}
        >
            <ChevronLeftIcon
              size={hp(2.5)}
              color={colors.pink}
              strokeWidth={4.5}
            />
        </TouchableOpacity>

        {/* Profile Picture Selection */}
        <View style={styles.avatarContainer}>
          <Image source={profileImages[profileImage - 1]} style={styles.profileImage} />
          <TouchableOpacity onPress={() => setProfileImage((profileImage % 5) + 1)}>
            <View style={styles.swapIconContainer}>
              <Ionicons name={"swap-horizontal-outline"} color={colors.white} size={15} style={styles.swapIcon} />
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.profileContainer}>
        {/* Username */}
        <View style={styles.inputContainer}>
              <Ionicons name={"person-outline"} size={30} color={colors.darkgrey} />
              <TextInput
                value={username}
                style={styles.input}
                placeholder="Enter your username"
                autoCapitalize='none'
                onChangeText={setUsername}
              />
        </View>

        {/* Name */}
        <View style={styles.inputContainer}>
              <Ionicons name={"person-outline"} size={30} color={colors.darkgrey} />
              <TextInput
                value={name}
                style={styles.input}
                placeholder="Enter your name"
                autoCapitalize='none'
                onChangeText={setName}
              />
        </View>

        {/* Bio */}
        <View style={styles.inputContainer}>
              <Ionicons name={"clipboard-outline"} size={30} color={colors.darkgrey} />
              <TextInput
                value={bio}
                style={styles.input}
                placeholder="Write something about yourself."
                autoCapitalize='none'
                onChangeText={setBio}
              />
        </View>

        {/* Experience */}
        <View style={styles.specialInputContainer}>
            <Ionicons name={"star-outline"} size={30} color={colors.darkgrey} />
            <Picker
                selectedValue={experience}
                style={styles.picker}
                onValueChange={(itemValue) => setExperience(itemValue)}
                itemStyle={{fontSize: 15, fontFamily: fonts.Regular}}
                height={50}
            >
                {experienceOptions.map((experience, index) => (
                    <Picker.Item
                        key={index}
                        label={experience}
                        value={experience}
                    />
                ))}
            </Picker>
        </View>

        {/* Save Button */}
        <TouchableOpacity style={styles.buttonContainer} onPress={handleSave}>
            <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>
        <Button title="Cancel" color={colors.pink} onPress={() => navigation.navigate('Profile')} />
      </View>
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
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
  },
  input: {
    flex: 1,
    paddingHorizontal: 20,
    fontFamily: fonts.SemiBold,
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
  avatarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  swapIconContainer: {
    height: 30,
    width: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.lightpink,
    marginLeft: -20,
    marginTop: 70,
  },
  inputContainer: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 40,
    flexDirection: "row",
    borderColor: colors.darkgrey,
    alignItems: "center",
    marginBottom: 20,
    height: 50,
    width: '95%',
  },
  picker: {
    flex: 1,
    paddingHorizontal: 10, // Add some horizontal padding
    marginTop: 0,
  },

  specialInputContainer: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 40,
    flexDirection: "row",
    borderColor: colors.darkgrey,
    alignItems: "center",
    marginBottom: 20,
    height: 150,
    width: '95%'
  },

  buttonContainer: {
    backgroundColor: colors.pink,
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 20,
    height: 50,
    width: '40%',
    marginTop: 15,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: 'center',
  },
  buttonText: {
    fontSize: 17,
    fontFamily: fonts.Bold,
    color: colors.white,
    textAlign: 'center',
  },
});