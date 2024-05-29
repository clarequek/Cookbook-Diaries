// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
export const analytics = getAnalytics(FIREBASE_APP);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP)
export const FIREBASE_DB =  getFirestore(FIREBASE_APP);