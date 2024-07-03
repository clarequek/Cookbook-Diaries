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

const Stack = createNativeStackNavigator();

export default function AppNavigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Welcome"
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
        <Stack.Screen name ="RecipeDetails" component= {RecipeDetailsScreen}/>
        <Stack.Screen name ="EditProfile" component= {EditProfileScreen}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
// import { View, Text } from 'react-native';
// import React from 'react';
// import { NavigationContainer } from '@react-navigation/native'; 
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

// import WelcomeScreen from '../screens/WelcomeScreen';
// import SignInSignUpScreen from '../screens/SignInSignUp'
// import SignInScreen from '../screens/SignIn';
// import SignUpScreen from '../screens/SignUp';
// import ForgetPasswordScreen from '../screens/ForgetPassword';
// import MainScreen from '../screens/MainScreen';
// import HomeScreen from '../screens/HomeScreen';
// import RecipeDetailsScreen from '../screens/RecipeDetailsScreen';
// import ProfileScreen from '../screens/ProfileScreen';
// import GroceryListScreen from '../screens/GroceryList';
// import EditProfileScreen from '../screens/EditProfileScreen';
// import GroceryLocatorScreen from '../screens/GroceryLocator';
// import IngredientSubstitutionScreen from '../screens/IngredientSubstitutionScreen';


// const Stack = createNativeStackNavigator(); 
// const Tab = createBottomTabNavigator();


// export default function AppNavigation() {
//   return (
//     <NavigationContainer>
//       <Stack.Navigator
//         initialRouteName='Main'
//         screenOptions={{
//           headerShown: false,
//         }}
//       >
//         <Stack.Screen name="Welcome" component={WelcomeScreen} />
//         <Stack.Screen name = "SignInSignUp" component={SignInSignUpScreen} />
//         <Stack.Screen name="SignIn" component={SignInScreen} />
//         <Stack.Screen name="SignUp" component={SignUpScreen} />
//         <Stack.Screen name="ForgetPassword" component={ForgetPasswordScreen} />
//         <Stack.Screen name="Main" component={MainScreen} />
//         <Stack.Screen name="Home" component={HomeScreen} />
//         <Stack.Screen name = "RecipeDetails" component={RecipeDetailsScreen}/>
//         <Stack.Screen name = "Profile" component={ProfileScreen}/>
//         <Stack.Screen name = "GroceryList" component = {GroceryListScreen}/> 
//         <Stack.Screen name = "EditProfile" component = {EditProfileScreen}/> 
//         <Stack.Screen name = "GroceryLocator" component = {GroceryLocatorScreen}/>
//         <Stack.Screen name = "IngredientSubstitution" component = {IngredientSubstitutionScreen}/>
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// }
