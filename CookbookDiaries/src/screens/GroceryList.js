import { View, Text, StyleSheet, KeyboardAvoidingView, TextInput, Platform, TouchableOpacity, Keyboard, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import Task from '../components/task';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { fonts } from "../utilities/fonts";
import { colors } from "../utilities/colors";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { ChevronLeftIcon } from 'react-native-heroicons/outline';
import { FIREBASE_AUTH, FIREBASE_DB } from '../../FirebaseConfig';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const GroceryListScreen = (props) => {
  const navigation = useNavigation();
  const [task, setTask] = useState(); //create a State in a functional component 
  const [quantity, setQuantity] = useState('');
  const [taskItems, setTaskItems] = useState([]);

  const auth = FIREBASE_AUTH;
  const db = FIREBASE_DB;

  useEffect(() => {
    fetchGroceryList();
  }, []); 

  const handleAddTask = async () => { //PLAN: add task to an array called 'grocerylist' for users
    if (!task || !quantity) {
      Alert.alert("Error", "Please fill in both the ingredient and quantity.");
      return;
    }

    Keyboard.dismiss(); //adding this line makes keyboard disappear 
    const newTaskItems = [...taskItems, { name: task, quantity: quantity }];
    setTaskItems(newTaskItems);
    setTask('');
    setQuantity('');
    await saveGroceryList(newTaskItems);
    //taskItems = taskItems.append(task)
  };

  const completeTask = async (index) => {  //PLAN: once task is completed, delete from array
    let itemsCopy = [...taskItems]; //creates a new array of Items and store in itemsCopy
    itemsCopy.splice(index, 1);
    //Explanation of splice() Parameters:
    //First Parameter (index): The index at which to start changing the array. 
    //This specifies the position of the first item to be removed.
    //Second Parameter (1): The number of elements to remove. 
    //In this case, it is 1, meaning only one element at the specified index will be removed
    //Then it returns itemsCopy with the removed element 
    setTaskItems(itemsCopy);
    await saveGroceryList(itemsCopy);
  };

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

  const incrementQuantity = () => {
    setQuantity(prevQuantity => (parseInt(prevQuantity, 10) || 0) + 1 + '');
  };

  const decrementQuantity = () => {
    setQuantity(prevQuantity => Math.max(0, (parseInt(prevQuantity, 10) || 0) - 1) + '');
  };

  return ( 
    <View style={styles.container}>
      {/* Title */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButtonWrapper} onPress={() => navigation.goBack()}>
          <ChevronLeftIcon
            size={hp(3.5)}
            color={colors.pink}
            strokeWidth={4.5}
          />
        </TouchableOpacity>
        <Text className='font-extrabold text-[#ebb01a]' style={styles.sectionTitle}>
          My grocery list:
        </Text>
      </View>

      <View style={styles.tasksWrapper}>
        <View style={styles.items}>
          {taskItems.map((item, index) => (
            <TouchableOpacity key={index} onPress={() => completeTask(index)}>
              <Task text={`${item.name} - ${item.quantity}`} />
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Write a task */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? "padding" : "height"}
        style={styles.writeTaskWrapper}>
        <TextInput
          style={styles.listInput}
          placeholder='Add to your grocery list!'
          value={task}
          onChangeText={text => setTask(text)} />
        
        <View style={styles.qty}>
          <TouchableOpacity onPress={() => decrementQuantity()}>
            <Ionicons name={"remove-circle"} color={colors.pink} size={25} />
          </TouchableOpacity>

          <TextInput
            style={styles.qtyInput}
            placeholder='QTY'
            placeholderTextColor={colors.darkgrey}
            value={quantity}
            onChangeText={text => setQuantity(text)}
            keyboardType='numeric'
            textAlign='center'
          />

          <TouchableOpacity onPress={() => incrementQuantity()}>
            <Ionicons name={"add-circle"} color={colors.pink} size={25} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => handleAddTask()}>
          <View style={styles.addWrapper}>
            <Ionicons name={"add-outline"} color={colors.white} size={30} />
          </View>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </View>
  );
};

export default GroceryListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.cream,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 5,
    paddingHorizontal: 10,
    backgroundColor: colors.cream,
  },
  tasksWrapper: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    flex: 1,
    fontSize: hp(3.5),
    color: colors.pink,
    fontFamily: fonts.Bold,
    textAlign: 'center',
  },
  items: {
    marginTop: 20,
  },
  writeTaskWrapper: {
    position: 'absolute',
    bottom: 30,
    width: "100%",
    justifyContent: "space-around",
    alignItems: "center",
  },
  listInput: {
    fontSize: 15,
    fontWeight: '400',
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderRadius: 60,
    borderColor: colors.darkgrey,
    borderWidth: 1,
    width: wp(67),
    fontFamily: fonts.Regular,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
  },
  qtyInput: {
    width: wp(20),
    fontSize: 20,
    marginLeft: 10,
    marginRight: 10,
    fontFamily: fonts.Bold,
    justifyContent: "center",
    alignItems: 'center',
    textAlign: 'center', // Center the text within the TextInput
  },
  addWrapper: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.pink,
  },
  addText: {
    fontSize: 28,
    fontFamily: fonts.Light,
  },
  backButtonWrapper: {
    marginRight: 10,
    padding: 5,
  },
  qty: {
    marginTop: 10,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtyPlaceholder: {
    fontSize: 15, // Smaller font for the placeholder
    width: wp(20),
    textAlign: 'center',
    fontFamily: fonts.Bold,
    borderBottomWidth: 1,
    borderBottomColor: colors.darkgrey,
  },
});
