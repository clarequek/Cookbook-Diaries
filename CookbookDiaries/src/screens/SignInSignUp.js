import { useNavigation } from '@react-navigation/native';
import React from 'react'
import { Text, View, Image, StyleSheet, Button, TouchableOpacity} from 'react-native';
import Logo from '../../assets/images/Logo.png';

export default function SignInSignUp() {
  const navigation = useNavigation();

  return (
    <View className = "flex-1 justify-center items-center bg-[#fff5e6]">
      <Image 
      source ={Logo} 
      style={{
        width: '100%',
        height: 350,
        resizeMode: 'contain', 
        marginBottom: 20,
      }} />
      <TouchableOpacity 
        style = {styles.buttonContainer}
        onPress = {() => navigation.navigate('SignIn')}
      >
        <Text style = {styles.buttonText}> Sign In </Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style = {styles.buttonContainer}
        onPress = {() => navigation.navigate('SignUp')}
      >
        <Text style = {styles.buttonText}> Sign Up </Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  buttonContainer: {
    backgroundColor: '#ff8271', // Button background color
    borderRadius: 30, // Border radius to make it rounded
    paddingVertical: 10,
    paddingHorizontal: 20,
    height: 50,
    width: '50%',
    resizeMode: 'contain',
    marginBottom: 20,

  },

  buttonText: { 
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
  },
});



