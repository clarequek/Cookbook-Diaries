import React, { useState } from "react"
import { useNavigation } from 'expo-router';
import { Text, View, Image, StyleSheet, Button, TextInput, TouchableOpacity, ActivityIndicator } from "react-native";
import { FIREBASE_AUTH, FIREBASE_DB } from '../../FirebaseConfig';
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { getFirestore, collection, query, doc, where, getDocs, setDoc } from 'firebase/firestore';

const Logo = require('@/assets/images/SimplifiedLogo.png'); // Adjust the path as needed

export default function SignUp() {

  const navigation = useNavigation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const auth = FIREBASE_AUTH;
  const db = FIREBASE_DB;

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

      // Send email verification
      await sendEmailVerification(response.user);
      console.log(response);

      //Store additional user information in Firestore
      await setDoc(doc(db, "users", response.user.uid), { // Use the user's UID for document ID
        username: username,
        email: email,
        name: name,
      });

      alert('User registered successfully! Please check your email inbox for a verification link to complete your account setup.');
      navigation.navigate('screens/SignIn'); // Navigate to SignIn after successful registration
    
    } catch (error) {

      console.error('Error during sign-up:', error);
      alert(`An error occurred: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={Logo} style={styles.logo} />
      <View style={styles.form}>
        <Text style={styles.label}> Username </Text>
        <TextInput value={username} style={styles.input} placeholder="" autoCapitalize='none' onChangeText={(text) => setUsername(text)} />
        <Text style={styles.label}> Name </Text>
        <TextInput value={name} style={styles.input} placeholder="" autoCapitalize='none' onChangeText={(text) => setName(text)} />
        <Text style={styles.label}> Email Address </Text>
        <TextInput value={email} style={styles.input} placeholder="email" autoCapitalize='none' onChangeText={(text) => setEmail(text)} />
        <Text style={styles.label}> Password </Text>
        <TextInput value={password} style={styles.specialInput} placeholder="password" autoCapitalize='none' onChangeText={(text) => setPassword(text)} secureTextEntry={true} />
        <Text style={styles.subtitle}>Password must be at least 8 characters long and include an uppercase letter, a lowercase letter, a number, and a special character.</Text>
        <Text style={styles.label}> Confirm Password </Text>
        <TextInput value={confirmPassword} style={styles.specialInput} placeholder="" onChangeText={(text) => setConfirmPassword(text)} secureTextEntry={true} />
        <Text style={styles.subtitle}>Passwords should match.</Text>
      </View>
      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <>
          <TouchableOpacity
            style={styles.buttonContainer}
            onPress={() => signUp()} //Temporary action: Should send a verification email + check if all fields are filled
          >
            <Text style={styles.buttonText}> Sign Up </Text>
          </TouchableOpacity>
          <View style={styles.row}>
            <Text style={styles.desc}> Have an account? </Text>
            <Button
              title="Sign in."
              onPress={() => navigation.navigate('screens/SignIn')} // Correct navigation path
              color='#ff8271'
            />
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, //flex: 1 Takes up the full screen; flex has different values
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    backgroundColor: '#fff5e6',
    paddingHorizontal: 20,
  },

  logo: {
    width: '70%',
    height: 150,
    //resizeMode: 'contain',
    marginBottom : 0,
  },

  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
  },

  form: {
    width: '80%',
  },

  label: {
    fontSize: 16,
    color: 'a9a9a9',
  },

  input: {
    borderWidth: 1,
    borderColor: '#000000',
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
  },

  specialInput: {
    borderWidth: 1,
    borderColor: '#000000',
    padding: 10,
    marginBottom: 0,
    borderRadius: 5,
  },

  desc: {
    fontSize: 18,
    color: 'a9a9a9',
    marginTop: 8,
  },

  subtitle: {
    fontSize: 10,
    color: 'a9a9a9',
  },

  buttonContainer: {
    backgroundColor: '#ff8271', // Button background color
    borderRadius: 20, // Border radius to make it rounded
    paddingVertical: 10,
    paddingHorizontal: 20,
    height: 40,
    width: '40%',
    resizeMode: 'contain',
    marginTop: 15,
  },

  buttonText: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
  },

  row: {
    flexDirection: 'row',
  },
});

//FIREBASE ORIGINAL RULES

//rules_version = '2';

//service cloud.firestore {
  //match /databases/{database}/documents {
    //match /{document=**} {
      //allow read, write: if false;
    //}
  //}
//}
