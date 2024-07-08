// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; 
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDo1J9g-u96BguGMyzqi4jKgGYtn-DAx8U",
  authDomain: "cookbook-diaries.firebaseapp.com",
  projectId: "cookbook-diaries",
  storageBucket: "cookbook-diaries.appspot.com",
  messagingSenderId: "912618893529",
  appId: "1:912618893529:web:628ad236e8d9a3a5430ec8",
  measurementId: "G-LNQRKZ8PBT"
};

// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);

// Initialize Firebase Auth with React Native AsyncStorage
export const FIREBASE_AUTH = initializeAuth(FIREBASE_APP, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

export const FIREBASE_STORAGE = getStorage(FIREBASE_APP); // Add this line

// Initialize Firestore
export const FIREBASE_DB = getFirestore(FIREBASE_APP);
