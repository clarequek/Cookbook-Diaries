import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; 
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyC3aSUGg74vXLopIFnoxFkfCKXeTHk6TSM",
  authDomain: "cookbookdiaries-51960.firebaseapp.com",
  projectId: "cookbookdiaries-51960",
  storageBucket: "cookbookdiaries-51960.appspot.com",
  messagingSenderId: "1023234325517",
  appId: "1:1023234325517:web:e7efb83872299cec7ba944",
  measurementId: "G-WJ71W06S9M"
};

// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = initializeAuth(FIREBASE_APP, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});
export const FIREBASE_DB = getFirestore(FIREBASE_APP);
export const FIREBASE_STORAGE = getStorage(FIREBASE_APP); 
