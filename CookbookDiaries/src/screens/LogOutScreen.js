import React, { useState, useRef } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Modal, Button } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { signOut } from 'firebase/auth';
import { FIREBASE_AUTH } from '../../FirebaseConfig'; // Ensure this is the correct path to your Firebase config
import { colors } from "../utilities/colors";
import { fonts } from "../utilities/fonts";
import LottieView from "lottie-react-native"; 

export default function LogOutScreen() {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);

  const animation = useRef(null); 

  const handleLogout = async () => {
    try {
      setModalVisible(false);
      await signOut(FIREBASE_AUTH);
      // Navigate to the welcome screen after successful sign out
      navigation.reset({
        index: 0,
        routes: [{ name: 'Welcome' }],
      });
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };

  return (
    <View style={styles.container}>
      {/*Lottie Logo */}
      <View
        style = {{ 
          height : 200,
          marginBottom: 20,
        }}>
        <LottieView autoPlay ref = {animation}
          style = {{
            width: 300, 
            height: 300, 
          }}
          source={require("../../assets/lottie/food-logo.json")}
          />
      </View>
      <Text style={styles.headerText}>We hope you had a great time cooking!</Text>
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={styles.button}
        activeOpacity={0.8}
      >
        <Text style={styles.buttonText}>Log Out</Text>
      </TouchableOpacity>
      <Button onPress={() => navigation.goBack()} title="Go Back" color={colors.pink} />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Are you sure you want to log out?</Text>
            <Button title="Cancel" onPress={() => setModalVisible(false)} />
            <Button title="Log Out" onPress={handleLogout} />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.cream,
  },
  headerText: {
    fontSize: 24,
    fontFamily: fonts.Bold,
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.pink,
    borderRadius: 10,
    width: "80%",
    height: 50,
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontFamily: fonts.SemiBold,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalView: {
    width: 300,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    elevation: 5,
  },
  modalText: {
    marginBottom: 20,
    textAlign: "center",
    fontSize: 18,
    fontFamily: fonts.Regular,
  },
});
