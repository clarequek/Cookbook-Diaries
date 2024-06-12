import { View, Text, StyleSheet, KeyboardAvoidingView, TextInput, Platform, TouchableOpacity, Keyboard } from 'react-native'
import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import Task from '../components/task';

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

      {/* Your grocery list */}
      <View style = {styles.tasksWrapper}>
        <Text style = {styles.sectionTitle}> Clarelia, this is your grocery list! </Text>

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
        placeholder='Write a task'
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
  tasksWrapper: {
    paddingTop: 80,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 24, 
    fontWeight: 'bold',
  },
  items: {
    marginTop: 30
  }, 
  writeTaskWrapper: {
    position: 'absolute', 
    bottom: 60, 
    width: "100%", 
    flexDirection: "row", 
    justifyContent: "space-around", 
    alignItems: "center"

  },
  textInput: { 
    backgroundColor: "#FFF",
    paddingVertical: 15, 
    paddingHorizontal: 15, 
    borderRadius: 60,
    borderColor: "#C0C0C0",
    borderWidth: 1,
    width: 250,

  },
  addWrapper: { 
    width: 60,
    height: 60,
    backgroundColor: "#FFF", 
    borderRadius: 60, 
    borderWidth: 1, 
    borderColor: "#C0C0C0",
    justifyContent: 'center', 
    alignItems: 'center'
  },
  addText: { 

  }
})