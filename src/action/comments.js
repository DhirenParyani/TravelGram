import auth from '@react-native-firebase/auth'

import Snackbar from 'react-native-snackbar';
import firestore from '@react-native-firebase/firestore'
import { READ_COMMENTS } from './action.types';


export const makeComment = (userId,postId,comment) => async (dispatch) => {

        firestore()
            .collection('posts')
            .doc(userId)
            .collection('userPosts')
            .doc(postId)
            .collection('comments')
            .add({
                creator: auth().currentUser.uid,
                comment,
                creation: firestore.FieldValue.serverTimestamp()
            })

            dispatch(readComments(userId,postId))


}


export const readComments = (userId,postId) => async (dispatch,getState) => {
    
    firestore()
    .collection('posts')
    .doc(userId)
    .collection('userPosts')
    .doc(postId)
    .collection('comments')
    .orderBy("creation", "asc")
    .get()
    .then((snapshot) => {
        let comments = snapshot.docs.map(doc => {
            const data = doc.data();
            const id = doc.id;
            return { id, ...data }
        })
        
        dispatch({
            type: READ_COMMENTS,
            comments      
        })
    })

}