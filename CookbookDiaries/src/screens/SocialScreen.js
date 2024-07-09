import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, TextInput, StyleSheet, Button, Alert } from 'react-native';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, getDoc, doc, setDoc, deleteDoc, getDocs } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import * as ImagePicker from 'expo-image-picker';
import { FIREBASE_DB, FIREBASE_AUTH, FIREBASE_STORAGE } from '../../FirebaseConfig';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { colors } from '../utilities/colors';
import { fonts } from '../utilities/fonts';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import CommentSection from "../components/commentsection";

const SocialScreen = () => {
  const [posts, setPosts] = useState([]);
  const [newPostText, setNewPostText] = useState('');
  const [newPostImage, setNewPostImage] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      const q = query(collection(FIREBASE_DB, 'posts'), orderBy('createdAt', 'desc'));
      const unsubscribe = onSnapshot(q, async (querySnapshot) => {
        const postsData = [];
        for (const docSnap of querySnapshot.docs) {
          const postData = docSnap.data();
          const userDoc = await getDoc(doc(FIREBASE_DB, "users", postData.user));
          const userData = userDoc.exists() ? userDoc.data() : {};
          const likesCount = await getLikesCount(docSnap.id);
          const userLiked = await hasUserLikedPost(docSnap.id);
          postsData.push({ ...postData, id: docSnap.id, userData, likesCount, userLiked });
        }
        setPosts(postsData);
      });
      return unsubscribe;
    };

    fetchPosts();
  }, []);

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

    try {
      if (newPostImage) {
        imageUrl = await uploadImage(newPostImage);
      }

      await addDoc(collection(FIREBASE_DB, "posts"), {
        text: newPostText,
        image: imageUrl,
        createdAt: serverTimestamp(),
        user: userId,
        likes: 0
      });

      console.log('Post added successfully');
      setNewPostText('');
      setNewPostImage(null);
    } catch (error) {
      console.error("Error adding document:", error);
    }
  };

  const handleLike = async (postId) => {
    const userId = FIREBASE_AUTH.currentUser.uid;
    const likeDocRef = doc(FIREBASE_DB, `posts/${postId}/likes`, userId);

    try {
      const likeDoc = await getDoc(likeDocRef);
      if (likeDoc.exists()) {
        await deleteDoc(likeDocRef);
      } else {
        await setDoc(likeDocRef, {
          userId,
          createdAt: serverTimestamp()
        });
      }

      const updatedPosts = await Promise.all(
        posts.map(async (post) => {
          if (post.id === postId) {
            const likesCount = await getLikesCount(postId);
            const userLiked = await hasUserLikedPost(postId);
            return { ...post, likesCount, userLiked };
          }
          return post;
        })
      );
      setPosts(updatedPosts);
    } catch (error) {
      console.error("Error liking/unliking post:", error);
    }
  };

  const getLikesCount = async (postId) => {
    const likesCollectionRef = collection(FIREBASE_DB, `posts/${postId}/likes`);
    const likesSnapshot = await getDocs(likesCollectionRef);
    return likesSnapshot.size;
  };

  const hasUserLikedPost = async (postId) => {
    const userId = FIREBASE_AUTH.currentUser.uid;
    const likeDocRef = doc(FIREBASE_DB, `posts/${postId}/likes`, userId);
    const likeDoc = await getDoc(likeDocRef);
    return likeDoc.exists();
  };

  return (
    <View style={styles.container}>
      <View style={styles.newPostContainer}>
        <TextInput
          style={styles.input}
          placeholder="What's on your mind?"
          value={newPostText}
          onChangeText={setNewPostText}
        />
        <TouchableOpacity onPress={pickImage}>
          <Text style={styles.pickImageText}>Pick an image</Text>
        </TouchableOpacity>
        <Button title="Post" onPress={addNewPost} />
      </View>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.postContainer}>
            <View style={styles.postHeader}>
              {item.userData && item.userData.profileImage ? (
                <Image source={{ uri: item.userData.profileImage }} style={styles.profileImage} />
              ) : (
                <View style={styles.placeholderProfileImage} />
              )}
              <Text style={styles.username}>{item.userData?.username || 'Unknown'}</Text>
            </View>

            {/* Picture */}
            {item.image ? (
              <Image source={{ uri: item.image }} style={styles.image} />
            ) : null}

            {/* Caption + Likes */}
            <View style={styles.postFooter}>
              <View style={styles.likesContainer}>
                <TouchableOpacity onPress={() => handleLike(item.id)}>
                  <Ionicons name="heart" size={hp('2.5%')} color={item.userLiked ? 'red' : 'gray'} />
                </TouchableOpacity>
                <Text style={styles.likes}>{item.likesCount} likes</Text>
              </View>
              <Text style={styles.caption}><Text style={styles.username}>{item.userData?.username || 'Unknown'}: </Text>{item.text}</Text>
              <CommentSection postId={item.id} />
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.cream,
    paddingTop: hp(5.5),
    padding: hp(2),
  },
  addPostButton: {
    backgroundColor: colors.pink,
    padding: hp(1.5),
    alignItems: 'center',
    marginBottom: hp(2),
    borderRadius: hp(1),
  },
  addPostButtonText: {
    color: '#fff',
    fontFamily: fonts.SemiBold,
    fontSize: hp(2),
  },
  pickImageText: {
    color: 'blue',
    textAlign: 'center',
    marginBottom: hp(1),
  },
  postContainer: {
    marginBottom: hp(2),
    backgroundColor: '#fff',
    borderRadius: hp(1),
    padding: hp(1),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: hp(0.5),
    elevation: 3,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(1),
  },
  profileImage: {
    width: hp(5),
    height: hp(5),
    borderRadius: hp(2.5),
    marginRight: hp(1),
  },
  placeholderProfileImage: {
    width: hp(5),
    height: hp(5),
    borderRadius: hp(2.5),
    marginRight: hp(1),
    backgroundColor: '#ccc',
  },
  username: {
    fontSize: hp(1.6),
    fontFamily: fonts.SemiBold,
    fontWeight: 'bold',
  },
  image: {
    width: '100%',
    height: hp(25),
    marginBottom: hp(1),
  },
  postFooter: {
    marginTop: hp(1),
  },
  likesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(1),
  },
  likes: {
    marginLeft: hp(0.5),
    fontFamily: fonts.SemiBold,
    fontSize: hp(1.6),
  },
  caption: {
    marginBottom: hp(0.5),
    fontSize: hp(1.6),
    fontFamily: fonts.Regular
  },
});

export default SocialScreen;
