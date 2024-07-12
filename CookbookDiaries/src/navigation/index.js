// AppNavigation.js

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import WelcomeScreen from '../screens/WelcomeScreen';
import SignInSignUpScreen from '../screens/SignInSignUp';
import SignInScreen from '../screens/SignIn';
import SignUpScreen from '../screens/SignUp';
import ForgetPasswordScreen from '../screens/ForgetPassword';
import MainTabNavigator from '../components/bottomtab';
import RecipeDetailsScreen from '../screens/RecipeDetailsScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import CreatePostScreen from '../screens/CreatePostScreen';
import ViewPostScreen from '../screens/ViewPostScreen';
import SettingsScreen from '../screens/SettingsScreen';
import EditCollectionScreen from '../screens/EditCollectionScreen';
import CollectionScreen from '../screens/CollectionScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Main"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="SignInSignUp" component={SignInSignUpScreen} />
        <Stack.Screen name="SignIn" component={SignInScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="ForgetPassword" component={ForgetPasswordScreen} />
        <Stack.Screen name="Main" component={MainTabNavigator} />
        <Stack.Screen name="RecipeDetails" component={RecipeDetailsScreen} />
        <Stack.Screen name="EditProfile" component={EditProfileScreen} />
        <Stack.Screen name="CreatePost" component={CreatePostScreen} />
        <Stack.Screen name="ViewPost" component={ViewPostScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="EditCollection" component={EditCollectionScreen} />
        <Stack.Screen name="Collection" component={CollectionScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
