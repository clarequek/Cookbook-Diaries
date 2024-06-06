import React, { useState, useRef } from "react";
import { useNavigation } from '@react-navigation/native';
import { Text, View, StyleSheet, Button, TextInput, TouchableOpacity, ActivityIndicator } from "react-native";
import { FIREBASE_AUTH, FIREBASE_DB } from '../../FirebaseConfig';
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { getFirestore, collection, query, doc, where, getDocs, setDoc } from 'firebase/firestore';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LottieView from "lottie-react-native";
import { fonts } from "../utilities/fonts";
import { colors } from "../utilities/colors";
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import * as ImagePicker from 'expo-image-picker';

//Test on actual phone to see whether profile picture upload works
//On simulator currently not working
export default function SignUp() {
  const navigation = useNavigation();
  const animation = useRef(null);

  const [profileImage, setProfileImage] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const auth = FIREBASE_AUTH;
  const db = FIREBASE_DB;

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage(result.uri);
    }
  };

  const checkUsernameExists = async (username) => {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('username', '==', username));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  };

  const validatePassword = (password) => {
    const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return re.test(password);
  };

  const signUp = async () => {
    if (!email || !password || !confirmPassword || !username || !name) {
      alert("Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    if (!validatePassword(password)) {
      alert("Password must be at least 8 characters long and include an uppercase letter, a lowercase letter, a number, and a special character.");
      return;
    }

    setLoading(true);
    try {
      const usernameExists = await checkUsernameExists(username);
      if (usernameExists) {
        alert('Username already exists.');
        setLoading(false);
        return;
      }

      const response = await createUserWithEmailAndPassword(auth, email, password);

      await sendEmailVerification(response.user);
      console.log(response);

      // Upload profile image to Firebase Storage
      let profileImageUrl = '';
      if (profileImage) {
        const storage = getStorage();
        const imageRef = ref(storage, `profileImages/${response.user.uid}`);
        const img = await fetch(profileImage);
        const bytes = await img.blob();
        await uploadBytes(imageRef, bytes);
        profileImageUrl = await getDownloadURL(imageRef);
      }

      // Store user data in Firebase Firestore
      await setDoc(doc(db, "users", response.user.uid), {
        username: username,
        email: email,
        name: name,
        profileImage: profileImageUrl,
      });

      alert('User registered successfully! Please check your email inbox for a verification link to complete your account setup.');
      navigation.navigate('screens/SignIn');
    } catch (error) {
      console.error('Error during sign-up:', error);
      alert(`An error occurred: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>

      {/* Back arrow button */}
      <TouchableOpacity style={styles.backButtonWrapper} onPress={() => navigation.goBack()}>
        <View style={styles.iconContainer}>
          <Ionicons name={"arrow-back-outline"} color={colors.black} size={25} />
        </View>
      </TouchableOpacity>
      <View style={styles.textContainer}>

        {/* Lottie Logo */}
        <View style={{ height: 200, marginTop: -70 }}>
          <LottieView
            autoPlay
            ref={animation}
            style={{ width: 200, height: 200 }}
            source={require("../../assets/lottie/food-logo.json")}
          />
        </View>

        <Text style={styles.headerText}>Sign up to get started.</Text>

        {/* Profile Picture Upload */}
        <TouchableOpacity style={styles.avatar} onPress={pickImage}>
          {profileImage ? (
            <Image source={{ uri: profileImage }} style={styles.profileImage} />
          ) : (
            <Ionicons name="add-outline" size={40} color={colors.white} style={{ marginTop: 6, marginLeft: 2 }} />
          )}
        </TouchableOpacity>
      </View>

      {/* Form */}
      <View style={styles.form}>
        {/* Username */}
        <View style={styles.inputContainer}>
          <Ionicons name={"person-outline"} size={30} color={colors.darkgrey} />
          <TextInput
            value={username}
            style={styles.input}
            placeholder="Enter your username"
            autoCapitalize='none'
            onChangeText={(text) => setUsername(text)}
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
            onChangeText={(text) => setName(text)}
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
            onChangeText={(text) => setEmail(text)}
          />
        </View>

        {/* Password */}
        <View style={styles.inputContainer}>
          <Ionicons name={"lock-closed-outline"} size={30} color={colors.darkgrey} />
          <TextInput
            value={password}
            style={styles.input}
            placeholder="Enter your password"
            autoCapitalize='none'
            secureTextEntry
            onChangeText={(text) => setPassword(text)}
          />
        </View>

        {/* Confirm Password */}
        <View style={styles.inputContainer}>
          <Ionicons name={"lock-closed-outline"} size={30} color={colors.darkgrey} />
          <TextInput
            value={confirmPassword}
            style={styles.input}
            placeholder="Confirm your password"
            autoCapitalize='none'
            secureTextEntry
            onChangeText={(text) => setConfirmPassword(text)}
          />
        </View>
      </View>

      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <>
          {/* Sign up button */}
          <TouchableOpacity style={styles.buttonContainer} onPress={signUp}>
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>

          {/* Sign in button */}
          <View style={styles.row}>
        <Text style={styles.desc}>Have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
            <Text style={styles.signInText}>Sign in.</Text>
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
  backButtonWrapper: {
    marginTop: 30,
  },
  avatar: {
    backgroundColor: colors.lightpink,
    borderRadius: 50,
    paddingVertical: 10,
    paddingHorizontal: 20,
    height: 100,
    width: 100,
    marginTop: 15,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: 'center',
    marginBottom: 0,
  },

  iconContainer: {
    height: 40,
    width: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  textContainer: {
    marginVertical: 20,
    alignItems: 'center',
  },
  logo: {
    width: '70%',
    height: 150,
    marginBottom: 15,
  },
  headerText: {
    fontSize: 24,
    fontFamily: fonts.Bold,
    color: '#000000',

  },
  form: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  input: {
    flex: 1,
    paddingHorizontal: 20,
    fontFamily: fonts.Light,
  },
  row: {
    flexDirection: 'row',
    justifyContent: "center",
    alignItems: "center",
  },
  desc: {
    fontSize: 16,
    color: colors.darkgrey,
    marginTop: 8,
    fontFamily: fonts.Light,
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
  inputContainer: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 100,
    flexDirection: "row",
    borderColor: colors.darkgrey,
    alignItems: "center",
    marginBottom: 20,
  },
  signInText: {
    fontSize: 16,
    color: colors.pink,
    marginTop: 8,
    fontFamily: fonts.Light,
  },
});