import { View, Text, StyleSheet, KeyboardAvoidingView, TextInput, Platform, TouchableOpacity, Keyboard, Button, Image } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useNavigation } from '@react-navigation/native';
import Task from '../components/task';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { fonts } from "../utilities/fonts";
import { colors } from "../utilities/colors";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { ChevronLeftIcon } from 'react-native-heroicons/outline'

const GroceryListScreen = (props) => {
    const navigation = useNavigation();
    const [task, setTask] = useState() //create a State in a functional component 
    const [quantity, setQuantity] = useState()
    const [taskItems, setTaskItems] = useState([])

    const handleAddTask = () => { //PLAN: add task to a new database created called grocery list for users
      Keyboard.dismiss() //adding this line makes keyboard disappear 
      setTaskItems([...taskItems, task])  
      setTask(null)
      //taskItems = taskItems.append(task)
    }
    
    const completeTask = (index) => {  //PLAN: once task is completed, delete document from firebase
      let itemsCopy = [...taskItems] //creates a new array of Items and store in itemsCop
      itemsCopy.splice(index, 1) 
      //Explanation of splice() Parameters:
      //First Parameter (index): The index at which to start changing the array. 
      //This specifies the position of the first item to be removed.
      //Second Parameter (1): The number of elements to remove. 
      //In this case, it is 1, meaning only one element at the specified index will be removed
      //Then it returns itemsCopy with the removed element 
      setTaskItems(itemsCopy)
    }
  return ( 
    <View style = {styles.container}>

      {/* Title */}
      <View style = {styles.tasksWrapper}>
        <View className ="w-full absolute flex-row items-center pt-10"
          style = {{
            justifyContent: 'space-evenly'
          }}> 
            <TouchableOpacity 
              className="p-2 rounded-full bg-white ml-1"
              onPress = {() => navigation.goBack()}
              >
                <ChevronLeftIcon
                  size={hp(3.5)}
                  color={colors.pink}
                  strokeWidth={4.5}
              />
            </TouchableOpacity>
          <Text className = 'font-extrabold text-[#ebb01a]'
        style = {styles.sectionTitle}> 
          My grocery list: 
          </Text>
        </View>

        <View style = {styles.items}>
          {
            taskItems.map((item, index) => { 
              return ( 
                <TouchableOpacity 
                key = {index} 
                onPress = {() => completeTask(index)}>
                  <Task 
                  text = {item}/>
                </TouchableOpacity>
              )
            })
          }
        </View>

      </View>


      {/* Write a task */}
      <KeyboardAvoidingView
        behavior= {Platform.OS === 'ios' ? "padding" : "height"}
        style = {styles.writeTaskWrapper}> 
        <TextInput 
        style = {styles.textInput}
        placeholder='Add to your grocery list!'
        value = {task}
        onChangeText={text => setTask(text)} />

        <TouchableOpacity
        onPress={() => handleAddTask()}>
          <View style = {styles.addWrapper}>
            <Ionicons name={"add-outline"} color={colors.darkgrey} size={25} />
          </View>
        </TouchableOpacity>
      </KeyboardAvoidingView>


    </View>
  )
}

export default GroceryListScreen

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    backgroundColor: colors.cream,
  },
  headerImage : { 
    width: wp(100),
    height: hp(20),
  },
  tasksWrapper: {
    paddingTop: 0,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: hp(3.5),
    color: colors.pink,
    fontFamily: fonts.Bold
  },
  items: {
    marginTop: 20
  }, 
  writeTaskWrapper: {
    position: 'absolute', 
    bottom: 30, 
    width: "100%", 
    flexDirection: "row", 
    justifyContent: "space-around", 
    alignItems: "center"

  },
  textInput: { 
    fontSize: 15,
    fontWeight: '400',
    paddingVertical: 15, 
    paddingHorizontal: 15, 
    borderRadius: 60,
    borderColor: colors.darkgrey,
    borderWidth: 1,
    width: wp(67),
    fontFamily: fonts.Light,
  },
  addWrapper: { 
    width: 60, 
    height: 60,
    borderRadius: 30, 
    borderWidth: 1, 
    borderColor: colors.darkgrey,
    justifyContent: 'center', 
    alignItems: 'center'
  },
  addText: { 
    fontSize: 28,
    fontFamily: fonts.Light,
  },
  backButtonWrapper: {
    marginTop: 30,
  },
  iconContainer: {
    height: 40,
    width: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
})