import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { getDoc, doc } from 'firebase/firestore';
import { db, auth } from '../../FirebaseConfig'; // Assuming you have db and auth exported from FirebaseConfig
import { colors } from '../utilities/colors';
import { fonts } from '../utilities/fonts';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import CommentSection from "../components/commentsection";

const ViewPostScreen = ({ post }) => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDocRef = doc(db, "users", auth.currentUser.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          setUserData(userData);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const postDocRef = doc(db, 'posts', post.id); // Assuming post.id is the document ID of the post
        const postDocSnap = await getDoc(postDocRef);
        if (postDocSnap.exists()) {
          const postData = postDocSnap.data();
          setPost(postData); // Assuming you have a state to store the post data
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.error('Error fetching post:', error);
      }
    };
  
    fetchPost();
  }, [post.id]);

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
      <View style={styles.postContainer}>
        <View style={styles.postHeader}>
          {userData && userData.profileImage ? (
            <Image source={{ uri: userData.profileImage }} style={styles.profileImage} />
          ) : (
            <View style={styles.placeholderProfileImage} />
          )}
          <Text style={styles.username}>{userData?.username || 'Unknown'}</Text>
        </View>

        {/* Render Post Content */}
        {post.image && (
          <Image source={{ uri: post.image }} style={styles.image} />
        )}

        {/* Render Likes Section */}
        <View style={styles.postFooter}>
          <View style={styles.likesContainer}>
            <TouchableOpacity onPress={() => handleLike(post.id)}>
              <Ionicons name="heart" size={hp('2.5%')} color={post.userLiked ? 'red' : 'gray'} />
            </TouchableOpacity>
            <Text style={styles.likes}>{post.likesCount} likes</Text>
          </View>
          {post.image && post.text && (
            <Text style={styles.caption}>
              <Text style={styles.username}>{userData?.username || 'Unknown'}: </Text>
              {post.text}
            </Text>
          )}
          <CommentSection postId={post.id} />
        </View>
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
    fontFamily: fonts.Regular,
  },
});

export default ViewPostScreen;
