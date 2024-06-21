import React, { useState, useEffect } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Button, Image, Modal } from "react-native";
import { FIREBASE_AUTH, FIREBASE_DB } from '../../FirebaseConfig';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { colors } from "../utilities/colors";
import { fonts } from "../utilities/fonts";
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from "@react-navigation/native";
import Ionicons from 'react-native-vector-icons/Ionicons';
import DefaultAvatar1 from '../../assets/images/DefaultAvatar1.png';
import DefaultAvatar2 from '../../assets/images/DefaultAvatar2.png';


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
                    setExperience(userData.experience || '');
                    setGrocerylist(userData.grocerylist || []);
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

  const experienceOptions = [
    "Begginer",
    "Intermediate",
    "Advanced",
  ];

  return (
    <View style={styles.container}>
        {/* Back arrow button */}
        <TouchableOpacity style={styles.backButtonWrapper} onPress={() => navigation.goBack()}>
            <View style={styles.iconContainer}>
                <Ionicons name={"arrow-back-outline"} color='#000000' size={25} />
            </View>
        </TouchableOpacity>

        {/* Profile Picture Selection */}
        <View style={styles.avatarContainer}>
            <Image source={profileImage === 1 ? DefaultAvatar1 : DefaultAvatar2} style={styles.profileImage} />
            <TouchableOpacity onPress={() => setProfileImage(profileImage === 1 ? 2 : 1)}> 
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

        {/* Email */}
        <View style={styles.inputContainer}>
              <Ionicons name={"mail-outline"} size={30} color={colors.darkgrey} />
              <TextInput
                value={email}
                style={styles.input}
                placeholder="Enter your email"
                autoCapitalize='none'
                onChangeText={setEmail}
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
    fontFamily: fonts.Light,
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
    backgroundColor: colors.pink,
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