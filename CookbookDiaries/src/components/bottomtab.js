import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import GroceryListScreen from '../screens/GroceryList';
import IngredientSubstitutionScreen from '../screens/IngredientSubstitutionScreen';
import GroceryLocatorScreen from '../screens/GroceryLocator';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { colors } from '../utilities/colors';

const Tab = createBottomTabNavigator();

const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'Profile') {
            iconName = 'person';
          } else if (route.name === 'Substitution') {
            iconName = 'search';
          }  else if (route.name === 'Grocery List') {
            iconName = 'list';
          } else if (route.name === 'Grocery Locator') {
            iconName = 'map';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.pink,
        tabBarInactiveTintColor: colors.darkgrey,
        tabBarStyle: {
          display: 'flex',
        },
        headerShown: false, //hide header for all screens
      })}
    >
      {/* Order of Tab.Screen here determines order it shows up on bottom tab */}
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
      <Tab.Screen name="Substitution" component={IngredientSubstitutionScreen} />
      <Tab.Screen name="Grocery List" component={GroceryListScreen} />
      <Tab.Screen name="Grocery Locator" component={GroceryLocatorScreen} />
    </Tab.Navigator>
  );
};

export default MainTabNavigator;
