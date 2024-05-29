import { useNavigation } from 'expo-router';
import React from 'react'
import { Text, View, Image, StyleSheet, Button, TouchableOpacity} from 'react-native';

const Logo = require('@/assets/images/Logo.png'); // Adjust the path as needed

export default function Welcome() {
  const navigation = useNavigation();

  return (
    <View style = {styles.container}>
      <Image source ={Logo} style={styles.logo} />
      <TouchableOpacity 
        style = {styles.buttonContainer}
        onPress = {() => navigation.navigate('screens/SignIn')}
      >
        <Text style = {styles.buttonText}> Sign In </Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style = {styles.buttonContainer}
        onPress = {() => navigation.navigate('screens/SignUp')}
      >
        <Text style = {styles.buttonText}> Sign Up </Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1, //Takes up the full screen; flex has different values
    //justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff5e6'
  },

  logo: {
    width: '100%',
    height: 300,
    resizeMode: 'contain', 
  },

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



