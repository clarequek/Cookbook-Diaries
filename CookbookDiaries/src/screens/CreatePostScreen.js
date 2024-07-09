import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, Button } from 'react-native';
import { collection, query, orderBy, onSnapshot, getDoc, doc } from 'firebase/firestore';
import { FIREBASE_DB, FIREBASE_AUTH } from '../../FirebaseConfig';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import CommentSection from "../components/commentsection";

const SocialScreen = ({ navigation }) => {
  const [posts, setPosts] = useState([]);

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
      <TouchableOpacity 
        style={styles.newPostButton} 
        onPress={() => navigation.navigate('CreatePost')}
      >
        <Text style={styles.newPostButtonText}>Create New Post</Text>
      </TouchableOpacity>
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
            {item.image ? (
              <Image source={{ uri: item.image }} style={styles.image} />
            ) : null}
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
    backgroundColor: '#fff',
    paddingTop: hp(5.5),
    padding: hp(2),
  },
  newPostButton: {
    backgroundColor: '#f57c00',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignSelf: 'center',
    marginBottom: 20,
  },
  newPostButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
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
    fontSize: hp(1.8),
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
    fontWeight: 'bold',
    fontSize: hp(1.8),
  },
  caption: {
    marginBottom: hp(1),
    fontSize: hp(1.8),
  },
});

export default SocialScreen;
