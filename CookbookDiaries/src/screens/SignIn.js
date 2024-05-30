import React, { useState } from "react"
import { useNavigation } from '@react-navigation/native';
import { Text, View, Image, StyleSheet, Button, TextInput, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView} from "react-native";
import { FIREBASE_AUTH } from '../../FirebaseConfig';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import Logo from '../../assets/images/SimplifiedLogo.png'; // Adjust the path as needed

export default function SignIn() {

  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const auth = FIREBASE_AUTH;

  const signIn = async () => {
    setLoading(true);
    try {
      const response = await signInWithEmailAndPassword(auth, email, password);
      console.log(response);
      navigation.navigate('Home')
    } catch (error) {
      console.log(error);
      alert('Invalid email address or password.')
    } finally {
      setLoading(false); //what does setLoading mean?
    }
  };

  return (
    <View style = {styles.container}>
      <Image source ={Logo} style={styles.logo} />
      <Text style = {styles.headerText}> Sign In.</Text>
      <View style = {styles.form}>
        <Text style = {styles.label}> Email Address </Text> 
        <TextInput value = {email} style={styles.input} placeholder= "email" autoCapitalize='none' onChangeText = {(text) => setEmail(text)}/>
        <Text style = {styles.label}> Password </Text> 
        <TextInput value = {password} style={styles.input} placeholder= "password" autoCapitalize='none' onChangeText = {(text) => setPassword(text)} secureTextEntry={true}/>
      </View>
      {loading ? (
        <ActivityIndicator size ="large" />
      ) : (
        <>
          <TouchableOpacity 
          style = {styles.buttonContainer}
          onPress = {() => signIn()} 
          >
          <Text style = {styles.buttonText}> Login </Text> 
          </TouchableOpacity>
        </>
      )
      }
      
      <Button 
        title= "Forgot Password"
        onPress={() => navigation.navigate('ForgetPassword')} //send forget password email
        color="#a9a9a9" 
      />  
      <View style = {styles.row}>
        <Text style = {styles.desc}> No account? </Text>
        <Button
          title = "Create one."
          onPress={() => navigation.navigate('SignUp')}
          color = '#ff8271'
        />
      </View>
    </View>
  )
}

//username
//password
//forgot password button
//no account? create one.


const styles = StyleSheet.create({
  container: {
    flex: 1, //flex: 1 Takes up the full screen; flex has different values
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff5e6',
  },

  logo: {
    width: '70%',
    height: 150,
    //resizeMode: 'contain',
    marginBottom : 15, 
  },

  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 20,
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

  row: { //find a better label for this
    flexDirection: 'row',
  },

  desc: {
    fontSize: 18,
    color: 'a9a9a9',
    marginTop: 8,
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
});