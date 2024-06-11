import { View, Text } from 'react-native'
import React from 'react'

const GroceryListScreen = () => {
    const navigation = useNavigation();

  return (
    <View>
        <Text
        onPress = {() => navigation.navigate("Home")}>
            GroceryListScreen
        </Text>
    </View>
  )
}

export default GroceryListScreen