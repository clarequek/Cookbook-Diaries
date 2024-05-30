import { View, Text, ActivityIndicator } from 'react-native'
import React from 'react'

export default function Loading(props) {
  return (
    <View 
    className = "flex-2 justify-center items-center">
      <ActivityIndicator {...props}/>
    </View>
  )
}