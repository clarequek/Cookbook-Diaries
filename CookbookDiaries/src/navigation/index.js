import { View, Text } from 'react-native';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native'; 
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

import WelcomeScreen from '../screens/WelcomeScreen';
import SignInSignUpScreen from '../screens/SignInSignUp'
import SignInScreen from '../screens/SignIn';
import SignUpScreen from '../screens/SignUp';
import ForgetPasswordScreen from '../screens/ForgetPassword';
import HomeScreen from '../screens/HomeScreen';
import RecipeDetailsScreen from '../screens/RecipeDetailsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import GroceryListScreen from '../screens/GroceryList';
import GroceryLocatorScreen from '../screens/GroceryLocator';


const Stack = createNativeStackNavigator(); 
const Tab = createBottomTabNavigator();


export default function AppNavigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName='Welcome'
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name = "SignInSignUp" component={SignInSignUpScreen} />
        <Stack.Screen name="SignIn" component={SignInScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="ForgetPassword" component={ForgetPasswordScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name = "RecipeDetails" component={RecipeDetailsScreen}/>
        <Stack.Screen name = "Profile" component={ProfileScreen}/>
        <Stack.Screen name = "GroceryList" component = {GroceryListScreen}/> 
        <Stack.Screen name = "GroceryLocator" component = {GroceryLocatorScreen}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

//initialRouteName = whenever app is created, taken to whatever screen you initialise it as
//headerShown: false removes the header at the Screen
//We will need a bottom tab navigator to navigate to the respective locations
//Home
//Community
//Profile
