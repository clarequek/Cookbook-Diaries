import { View, Text, StyleSheet, KeyboardAvoidingView, TextInput, Platform, TouchableOpacity, Keyboard, Button, Image } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useNavigation } from '@react-navigation/native';
import Task from '../components/task';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { fonts } from "../utilities/fonts";
import { colors } from "../utilities/colors";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { FIREBASE_AUTH, FIREBASE_DB } from '../../FirebaseConfig';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const GroceryListScreen = (props) => {
    const navigation = useNavigation();
    const [task, setTask] = useState() //create a State in a functional component 
    const [quantity, setQuantity] = useState()
    const [taskItems, setTaskItems] = useState([])

    const auth = FIREBASE_AUTH;
    const db = FIREBASE_DB;

    useEffect(() => {
      fetchGroceryList();
    }, []); 

    const handleAddTask = async () => { //PLAN: add task to an array called 'grocerylist' for users
      Keyboard.dismiss() //adding this line makes keyboard disappear 
      const newTaskItems = [...taskItems, task];
      setTaskItems(newTaskItems)  
      setTask('')
      await saveGroceryList(newTaskItems);
      //taskItems = taskItems.append(task)
    }
    
    const completeTask = async(index) => {  //PLAN: once task is completed, delete from array
      let itemsCopy = [...taskItems] //creates a new array of Items and store in itemsCop
      itemsCopy.splice(index, 1) 
      //Explanation of splice() Parameters:
      //First Parameter (index): The index at which to start changing the array. 
      //This specifies the position of the first item to be removed.
      //Second Parameter (1): The number of elements to remove. 
      //In this case, it is 1, meaning only one element at the specified index will be removed
      //Then it returns itemsCopy with the removed element 
      setTaskItems(itemsCopy)
      await saveGroceryList(itemsCopy);
    }
  
    const saveGroceryList = async (newTaskItems) => {
      try {
        const userDocRef = doc(db, "users", auth.currentUser.uid);
        await setDoc(userDocRef, {
          grocerylist: newTaskItems //new task items is an array 
        }, { merge: true });
      } catch (error) {
        console.error("Error saving grocery list:", error);
      }
    };

    const fetchGroceryList = async () => {
      try {
        const userDocRef = doc(db, "users", auth.currentUser.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          setTaskItems(userData.grocerylist || []);
        }
      } catch (error) {
        console.error("Error fetching grocery list:", error);
      }
    };

  return ( 
    <View style = {styles.container}>

      {/* Title */}
      <View style = {styles.tasksWrapper}>

        {/* Back arrow button */}
        <TouchableOpacity style={styles.backButtonWrapper} onPress={() => navigation.goBack()}>
          <View style={styles.iconContainer}>
            <Ionicons name={"arrow-back-outline"} color='#000000' size={25} />
          </View>
        </TouchableOpacity>

        <Text className = 'font-extrabold text-[#ebb01a]'
        style = {styles.sectionTitle}> 
          My grocery list: 
        </Text>

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