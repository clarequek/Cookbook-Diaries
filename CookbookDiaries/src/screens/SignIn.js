import React, { useState, useRef } from "react";
import { useNavigation, CommonActions } from '@react-navigation/native';
import { Text, View, StyleSheet, TouchableOpacity, TextInput, ActivityIndicator, KeyboardAvoidingView, Platform} from "react-native";
import { FIREBASE_AUTH } from '../../FirebaseConfig';
import { signInWithEmailAndPassword } from "firebase/auth";
import { fonts } from "../utilities/fonts";
import { colors } from "../utilities/colors";
import Ionicons from 'react-native-vector-icons/Ionicons';
import LottieView from "lottie-react-native"; 

/**
 * SignIn component ensures that each user is authenticated with email and password before being able to proceed to Main.
 * 
 * @component
 */

export default function SignIn() {

  const navigation = useNavigation();
  const animation = useRef(null); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [secureEntry, setSecureEntry] = useState(true);
  const auth = FIREBASE_AUTH;

  /**
   * Handles user sign-in with email and password.
   */

  const signIn = async () => {
    setLoading(true);
    try {
      const response = await signInWithEmailAndPassword(auth, email, password);
      console.log(response);
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'Main' }],
        })
      );
    } catch (error) {
      console.log(error);
      alert('Invalid email address or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
    <View style={styles.container}>
      {/* Back arrow button */}
      <TouchableOpacity style={styles.backButtonWrapper} onPress={() => navigation.goBack()}>
        <View style={styles.iconContainer}>
          <Ionicons name={"arrow-back-outline"} color='#000000' size={25} />
        </View>
      </TouchableOpacity>
      <View style={styles.textContainer}>
        
        {/* Lottie Logo */}
      <View
        style = {{ 
          height : 200,
        }}>
        <LottieView autoPlay ref = {animation}
          style = {{
            width: 200, 
            height: 200, 
          }}
          source={require("../../assets/lottie/food-logo.json")}
          />
      </View>

        <Text style={styles.headerText}>Welcome Back.</Text>
      </View>

      {/* Form */}
      <View style={styles.form}>
        {/* Email */}
        <View style={styles.inputContainer}>
          <Ionicons name={"mail-outline"} size={30} color='#808080' />
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
          <Ionicons name={"lock-closed-outline"} size={30} color='#808080' />
          <TextInput 
            value={password} 
            style={styles.input} 
            placeholder="Enter your password" 
            autoCapitalize='none' 
            onChangeText={(text) => setPassword(text)} 
            secureTextEntry={secureEntry}
          />
          <TouchableOpacity onPress={() => setSecureEntry(prev => !prev)}>
            <Ionicons name={secureEntry ? "eye-off-outline" : "eye-outline"} size={30} color='#808080' />
          </TouchableOpacity>
        </View>
      </View>
      {/* Login button*/}
      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <TouchableOpacity 
          style={styles.buttonContainer}
          onPress={signIn}
        >
          <Text style={styles.buttonText}>Login</Text> 
        </TouchableOpacity>
      )}
      
      {/* Forget Password button */}
      <TouchableOpacity 
        style={styles.forgotButton}
        onPress={() => navigation.navigate('ForgetPassword')}
      >
        <Text style={[styles.forgotButtonText, { fontFamily: "Poppins-Light" }]}>Forgot Password</Text>
      </TouchableOpacity>  
      
      {/* Sign up button */}
      <View style={styles.row}>
        <Text style={styles.desc}>No account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
          <Text style={styles.createAccountText}>Create one.</Text>
        </TouchableOpacity>
      </View>
    </View>
    </KeyboardAvoidingView>
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
    fontWeight: 'bold',
    color: colors.black,
    fontFamily: fonts.Bold,
  },
  form: {
    marginTop: 20,
    alignItems: "center",
    justifyContent: "center",
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
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    height: 40,
    width: '40%',
    marginTop: 15,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: 'center', // Center the button horizontally
  },
  buttonText: { 
    fontSize: 17,
    fontWeight: 'bold',
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
  forgotButton: {
    marginTop: 20,
    alignSelf: 'center',
  },
  forgotButtonText: {
    color: colors.pink,
    fontSize: 16,
  },
  createAccountText: {
    fontSize: 16,
    color: colors.pink,
    marginTop: 8,
    fontFamily: fonts.Light,
  },
});
