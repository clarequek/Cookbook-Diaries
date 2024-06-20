import React, { useState } from 'react';
import { Text, View, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FIREBASE_AUTH } from '../../FirebaseConfig';
import { sendPasswordResetEmail } from 'firebase/auth';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { fonts } from "../utilities/fonts";
import { colors } from "../utilities/colors"; 

const ForgotPassword = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const auth = FIREBASE_AUTH;

  const handleForgotPassword = async () => {
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      alert('Password reset email sent. Check your email inbox.');
    } catch (error) {
      console.error('Error sending password reset email:', error);
      alert('Error sending password reset email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Forgot Password?</Text>
      <Text style={styles.desc}>Enter your email address below to receive a password reset link.</Text>
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
      <TouchableOpacity style={styles.buttonContainer} onPress={handleForgotPassword}>
        <Text style={styles.buttonText}>Send Reset Link</Text>
      </TouchableOpacity>
      {loading && <ActivityIndicator size="large" color="#ff8271" />}
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.goBack}>Go Back</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff5e6',
    padding: 20,
  },
  headerText: {
    fontSize: 24,
    fontFamily: fonts.Bold,
    color: colors.black,
    marginBottom: 20,
  },
  desc: {
    fontSize: 15,
    color: colors.darkgrey,
    fontFamily: fonts.Light,
    marginBottom: 20,
  },
  input: {
    flex: 1,
    paddingHorizontal: 20,
    fontFamily: fonts.Light,
  },
  buttonContainer: {
    backgroundColor: '#ff8271',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  goBack: {
    marginTop: 20,
    color: '#ff8271',
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
});

export default ForgotPassword;