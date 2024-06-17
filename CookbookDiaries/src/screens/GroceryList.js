import { View, Text, StyleSheet, KeyboardAvoidingView, TextInput, Platform, TouchableOpacity, Keyboard, Button, Image } from 'react-native'
import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import Task from '../components/task';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';

const GroceryListScreen = () => {
    const navigation = useNavigation();
    const [task, setTask] = useState() //create a State in a functional component 
    const [taskItems, setTaskItems] = useState([])

    const handleAddTask = () => { 
      Keyboard.dismiss() //adding this line makes keyboard disappear 
      setTaskItems([...taskItems, task])  
      setTask(null)
      //taskItems = taskItems.append(task)
    }
    
    const completeTask = (index) => { 
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
      <Image
        source = {require("../../assets/images/brunchtransparent.png")} 
        style = {styles.headerImage}/>

      {/* Title */}
      <View style = {styles.tasksWrapper}>

        {/* Temporary home navigator */}
        <Button title="Go to Home" onPress={() => navigation.navigate('Home')} />

        <Text style = {styles.sectionTitle}> My grocery list: </Text>

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
            <Text style = {styles.addText}> + </Text>
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
    backgroundColor: '#fff5e6'
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
    fontWeight: 'bold',
    color: "#ebb01a",
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
    fontSize: 20,
    fontWeight: '400',
    backgroundColor: "#FFF",
    paddingVertical: 15, 
    paddingHorizontal: 15, 
    borderRadius: 60,
    borderColor: "#C0C0C0",
    borderWidth: 1,
    width: wp(67),
  },
  addWrapper: { 
    width: wp(20),
    height: hp(10),
    backgroundColor: "#FFF", 
    borderRadius: 60, 
    borderWidth: 1, 
    borderColor: "#C0C0C0",
    justifyContent: 'center', 
    alignItems: 'center'
  },
  addText: { 
    fontSize: 28,
    fontWeight: '500'

  }
})