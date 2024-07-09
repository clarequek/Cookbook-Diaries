import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, getDoc, doc } from 'firebase/firestore';
import { FIREBASE_DB, FIREBASE_AUTH } from '../../FirebaseConfig';
import { colors } from '../utilities/colors';
import { fonts } from '../utilities/fonts';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

const CommentSection = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');

  useEffect(() => {
    const fetchComments = async () => {
      const q = query(collection(FIREBASE_DB, `posts/${postId}/comments`), orderBy('createdAt', 'desc'));
      const unsubscribe = onSnapshot(q, async (querySnapshot) => {
        const commentsData = [];
        for (const docSnap of querySnapshot.docs) {
          const commentData = docSnap.data();
          const userDoc = await getDoc(doc(FIREBASE_DB, "users", commentData.user));
          const userData = userDoc.exists() ? userDoc.data() : {};
          commentsData.push({ ...commentData, id: docSnap.id, userData });
        }
        setComments(commentsData);
      });
      return unsubscribe;
    };

    fetchComments();
  }, [postId]);

  const handleAddComment = async () => {
    const userId = FIREBASE_AUTH.currentUser.uid;
    try {
      await addDoc(collection(FIREBASE_DB, `posts/${postId}/comments`), {
        text: commentText,
        createdAt: serverTimestamp(),
        user: userId
      });
      setCommentText('');
    } catch (e) {
      console.error("Error adding comment: ", e);
    }
  };

  return (
    <View>
      <FlatList
        data={comments}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Text style={styles.comment}><Text style={styles.username}>{item.userData?.username || 'Unknown'}: </Text>{item.text}</Text>
        )}
      />
      <View style={styles.commentInputContainer}>
        <TextInput
          style={styles.commentInput}
          placeholder="Add a comment"
          value={commentText}
          onChangeText={setCommentText}
        />
        <TouchableOpacity style={styles.postButton} onPress={handleAddComment}>
          <Text style={styles.postButtonText}>Post</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: hp(0.5),

  },
  commentInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: hp(1),
    borderRadius: hp(1),
    backgroundColor: '#fff',
    fontFamily: fonts.Regular,
  },
  postButton: {
    marginLeft: hp(1),
    padding: hp(1),
    backgroundColor: colors.pink,
    borderRadius: hp(1),
  },
  postButtonText: {
    color: '#fff',
    fontFamily: fonts.SemiBold,
  },
  comment: {
    fontSize: hp(1.3),
    fontFamily: fonts.Regular,
  },
  username: {
    fontFamily: fonts.SemiBold
  },
});

export default CommentSection;
