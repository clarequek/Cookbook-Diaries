import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { collection, query, orderBy, onSnapshot, getDoc, doc, setDoc, deleteDoc, getDocs, serverTimestamp } from 'firebase/firestore';
import { FIREBASE_DB, FIREBASE_AUTH } from '../../FirebaseConfig';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { colors } from '../utilities/colors';
import { fonts } from '../utilities/fonts';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import CommentSection from "../components/commentsection";
import { useNavigation } from '@react-navigation/native';

import DefaultAvatar1 from '../../assets/images/DefaultAvatar1.png';
import DefaultAvatar2 from '../../assets/images/DefaultAvatar2.png';
import DefaultAvatar3 from '../../assets/images/DefaultAvatar3.png';
import DefaultAvatar4 from '../../assets/images/DefaultAvatar4.png';
import DefaultAvatar5 from '../../assets/images/DefaultAvatar5.png';

const SocialScreen = () => {
  const navigation = useNavigation();
  const [posts, setPosts] = useState([]);
  const [selectedProfileImage, setSelectedProfileImage] = useState(1);

  const  images = [
    DefaultAvatar1,
    DefaultAvatar2,
    DefaultAvatar3,
    DefaultAvatar4,
    DefaultAvatar5
  ]

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
          const profileImage = fetchProfileImage(userData.profileImage);
          setSelectedProfileImage(profileImage);
          postsData.push({ ...postData, id: docSnap.id, userData, likesCount, userLiked, profileImage });
        }
        setPosts(postsData);
      });
      return unsubscribe;
    };

    fetchPosts();
  }, []);

  const fetchProfileImage = async(profileImage) => {
    // Set the profile image based on the stored value
    switch (profileImage) {
      case 1:
        return DefaultAvatar1;
      case 2:
        return DefaultAvatar2;
      case 3:
        return DefaultAvatar3;
      case 4:
        return DefaultAvatar4;
      case 5:
        return DefaultAvatar5;
      default:
        return DefaultAvatar1;
    }
  }


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
      <TouchableOpacity style={styles.addPostButton} onPress={() => navigation.navigate('CreatePost')}>
        <Ionicons name="add-circle-outline" size={hp(3)} color="#fff" />
        <Text style={styles.addPostButtonText}>Create New Post</Text>
      </TouchableOpacity>

      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.postContainer}>
            <View style={styles.postHeader}>   
              <Image source={images[item.userData.profileImage - 1]} style={styles.profileImage} />
              <Text style={styles.username}>{item.userData?.username || 'Unknown'}</Text>
            </View>

            {/* Picture */}
            {item.image && (
              <Image source={{ uri: item.image }} style={styles.image} />
            )}
            {item.text && !item.image && (
              <Text style={styles.textOnlyPost}>{item.text}</Text>
            )}

            {/* Likes */}
            <View style={styles.postFooter}>
              <View style={styles.likesContainer}>
                <TouchableOpacity onPress={() => handleLike(item.id)}>
                  <Ionicons name="heart" size={hp('2.5%')} color={item.userLiked ? 'red' : 'gray'} />
                </TouchableOpacity>
                <Text style={styles.likes}>{item.likesCount} likes</Text>
              </View>
              {item.image && item.text && (
                <Text style={styles.caption}><Text style={styles.username}>{item.userData?.username || 'Unknown'}: </Text>{item.text}</Text>
              )}
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
    flexDirection: 'row',
    justifyContent: 'center',
  },
  addPostButtonText: {
    color: '#fff',
    fontFamily: fonts.SemiBold,
    fontSize: hp(2),
    marginLeft: hp(0.5),
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
  textOnlyPost: {
    fontSize: hp(2),
    fontFamily: fonts.Regular,
    color: colors.darkGrey,
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
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 75,
    marginRight: 10,
  },
});

export default SocialScreen;
