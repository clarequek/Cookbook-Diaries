import { View, Text, StyleSheet, KeyboardAvoidingView, TextInput, Platform, TouchableOpacity, Keyboard, Alert, ScrollView } from 'react-native';
import React, { useState, useCallback } from 'react';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Task from '../components/task';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { fonts } from "../utilities/fonts";
import { colors } from "../utilities/colors";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { FIREBASE_AUTH, FIREBASE_DB } from '../../FirebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

const GroceryListScreen = (props) => {
  const navigation = useNavigation();
  const [task, setTask] = useState('');
  const [quantity, setQuantity] = useState('');
  const [taskItems, setTaskItems] = useState([]);

  const auth = FIREBASE_AUTH;
  const db = FIREBASE_DB;

  useFocusEffect(
    useCallback(() => {
      fetchGroceryList();
    }, [])
  );

  const handleAddTask = async () => {
    if (!task || !quantity) {
      Alert.alert("Error", "Please fill in both the ingredient and quantity.");
      return;
    }

    Keyboard.dismiss();
    const newTaskItems = [...taskItems, { name: task, quantity: quantity }];
    setTaskItems(newTaskItems);
    setTask('');
    setQuantity('');
    await saveGroceryList(newTaskItems);
  };

  const completeTask = async (index) => {
    let itemsCopy = [...taskItems];
    itemsCopy.splice(index, 1);
    setTaskItems(itemsCopy);
    await saveGroceryList(itemsCopy);
  };

  const saveGroceryList = async (newTaskItems) => {
    try {
        const userDocRef = doc(db, "users", auth.currentUser.uid);
        console.log("Saving new task items to Firestore:", newTaskItems);
        await updateDoc(userDocRef, {
            groceryList: newTaskItems
        });
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
            console.log("Fetched grocery list from Firestore:", userData.groceryList);
            setTaskItems(userData.groceryList || []);
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
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
      keyboardVerticalOffset={100}
    >
      <View style={styles.header}>
        <Text className='font-extrabold text-[#ebb01a]' style={styles.sectionTitle}>
          My grocery list:
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.tasksWrapper}>
        <View style={styles.items}>
          {taskItems.map((item, index) => (
            <TouchableOpacity key={index} onPress={() => completeTask(index)}>
              <Task text={`${item.name} - ${item.quantity}`} />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <View style={styles.writeTaskWrapper}>
        <TextInput
          style={styles.listInput}
          placeholder='Add to your grocery list!'
          value={task}
          onChangeText={text => setTask(text)}
        />

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
      </View>
    </KeyboardAvoidingView>
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
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 200,
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
    bottom: 0,
    width: '100%',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: colors.cream,
    padding: 20,
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
    marginBottom: 10,
  },
  qty: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  qtyInput: {
    width: wp(20),
    fontSize: 20,
    marginLeft: 10,
    marginRight: 10,
    fontFamily: fonts.Bold,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
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
});
