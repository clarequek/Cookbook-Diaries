import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import * as ImagePicker from 'expo-image-picker';
import { FIREBASE_DB, FIREBASE_AUTH, FIREBASE_STORAGE } from '../../FirebaseConfig';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../utilities/colors';
import { fonts } from '../utilities/fonts';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { ChevronLeftIcon } from 'react-native-heroicons/outline';
import Ionicons from 'react-native-vector-icons/Ionicons';

const CreatePostScreen = () => {
  const navigation = useNavigation();
  const [newPostText, setNewPostText] = useState('');
  const [newPostImage, setNewPostImage] = useState(null);

  const requestPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Sorry, we need camera roll permissions to make this work!');
      return false;
    }
    return true;
  };

  const pickImage = async () => {
    const hasPermission = await requestPermission();
    if (!hasPermission) return;

    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      console.log('Image picker result:', result);

      if (!result.canceled) {
        console.log('Image picked:', result.assets[0].uri);
        setNewPostImage(result.assets[0].uri);
      } else {
        console.log('Image picking cancelled');
      }
    } catch (error) {
      console.error('Error picking image:', error);
    }
  };

  const uploadImage = async (uri) => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const filename = uri.substring(uri.lastIndexOf('/') + 1);
      const storageRef = ref(FIREBASE_STORAGE, `images/${filename}`);
      await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(storageRef);
      console.log('Image uploaded. URL:', downloadURL);
      return downloadURL;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  };

  const addNewPost = async () => {
    const userId = FIREBASE_AUTH.currentUser.uid;
    let imageUrl = '';

    // Validation: Ensure there's either an image or text, but not both
    if (!newPostText && !newPostImage) {
      Alert.alert('Validation Error', 'Please provide a caption or select an image.');
      return;
    }

    try {
      if (newPostImage) {
        imageUrl = await uploadImage(newPostImage);
      }

      await addDoc(collection(FIREBASE_DB, "posts"), {
        text: newPostText,
        image: imageUrl,
        createdAt: serverTimestamp(),
        user: userId,
        likes: 0,
      });

      console.log('Post added successfully');
      setNewPostText('');
      setNewPostImage(null);
      navigation.goBack();
    } catch (error) {
      console.error("Error adding document:", error);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.goBackButton} onPress={() => navigation.goBack()}>
        <ChevronLeftIcon size={hp(3)} color={colors.pink} strokeWidth={4.5} />
      </TouchableOpacity>

      <View style={styles.newPostContainer}>
        {newPostImage ? (
          <Image source={{ uri: newPostImage }} style={styles.imagePreview} />
        ) : (
          <TouchableOpacity onPress={pickImage} style={styles.pickImageButton}>
            <Ionicons name="camera" size={hp(3)} color={colors.white} />
            <Text style={styles.pickImageText}>Choose an Image</Text>
          </TouchableOpacity>
        )}

        <TextInput
          style={styles.input}
          placeholder="What's on your mind?"
          placeholderTextColor={colors.darkGrey}
          value={newPostText}
          onChangeText={setNewPostText}
          multiline
        />

        <TouchableOpacity onPress={addNewPost} style={styles.postButton}>
          <Text style={styles.postButtonText}>Post</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.cream,
    padding: hp(2),
  },
  goBackButton: {
    position: 'absolute',
    top: hp(5),
    left: hp(2),
    padding: hp(1),
    backgroundColor: colors.white,
    borderRadius: hp(2),
    zIndex: 1,
  },
  newPostContainer: {
    width: '100%',
    backgroundColor: colors.light,
    borderRadius: hp(2),
    padding: hp(2),
    alignItems: 'center',
    marginTop: hp(8),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: hp(0.5),
    elevation: 3,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: colors.darkGrey,
    padding: hp(1),
    marginBottom: hp(1),
    borderRadius: hp(1),
    backgroundColor: colors.white,
    fontFamily: fonts.Regular,
    fontSize: hp(1.8),
    textAlignVertical: 'top',
  },
  pickImageButton: {
    backgroundColor: colors.pink,
    padding: hp(1.5),
    alignItems: 'center',
    marginBottom: hp(2),
    borderRadius: hp(1),
    flexDirection: 'row',
  },
  pickImageText: {
    color: 'white',
    fontFamily: fonts.SemiBold,
    fontSize: hp(2),
    marginLeft: hp(1),
  },
  imagePreview: {
    width: '100%',
    height: hp(25),
    marginBottom: hp(2),
    borderRadius: hp(1),
  },
  postButton: {
    backgroundColor: colors.pink,
    padding: hp(1.5),
    alignItems: 'center',
    borderRadius: hp(1),
  },
  postButtonText: {
    color: '#fff',
    fontFamily: fonts.SemiBold,
    fontSize: hp(2),
  },
});

export default CreatePostScreen;
