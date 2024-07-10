import { View, Text, ScrollView, Image, TouchableOpacity, Button, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import { StatusBar } from 'expo-status-bar'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import { useNavigation } from '@react-navigation/native'
import { CachedImage } from '../utilities/index'
import { ChevronLeftIcon } from 'react-native-heroicons/outline'
import Loading from '../components/loading'
import axios from 'axios'
import Animated, { FadeInDown } from 'react-native-reanimated'
import { fonts } from "../utilities/fonts";
import { colors } from "../utilities/colors";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { collection, getDoc, doc, updateDoc, arrayUnion, setDoc } from 'firebase/firestore';
import { FIREBASE_AUTH, FIREBASE_DB } from '../../FirebaseConfig';
import { Alert } from 'react-native';


export default function RecipeDetailsScreen(props) {
    let item = props.route.params
    const db = FIREBASE_DB
    const auth = FIREBASE_AUTH
    const navigation = useNavigation()
    const [meal, setMeal] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isFavourite, setIsFavourite] = useState(false)
    const [rating, setRating] = useState(0);
    const [averageRating, setAverageRating] = useState(0);
    const [taskItems, setTaskItems] = useState([]);
    const [favourites, setFavourites] = useState([]);

    useEffect(() => { 
        getMealData(item.idMeal)
        fetchAverageRating(item.idMeal)
        fetchUserData();
    }, []); 

    const fetchUserData = async () => {
        try {
            const userDocRef = doc(db, "users", auth.currentUser.uid);
            const userDocSnap = await getDoc(userDocRef);
            if (userDocSnap.exists()) {
                const userData = userDocSnap.data();
                const favs = userData.favourites || [];
                setFavourites(favs);
                setIsFavourite(favs.includes(item.idMeal));
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    }
}