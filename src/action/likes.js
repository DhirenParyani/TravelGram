import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'
export const onLike = (userId, postId) => async (dispatch) => {
    try {
       
        firestore()
            .collection("posts")
            .doc(userId)
            .collection("userPosts")
            .doc(postId)
            .collection("likes")
            .doc(auth().currentUser.uid)
            .set({});
           
    }
    catch (error) {
        console.log("Action:Like casuing issues:"+error)
    }
}

export const incrementLikeCount= (userId, postId) => async (dispatch) => {
    try {
       
        firestore()
            .collection("posts")
            .doc(userId)
            .collection("userPosts")
            .doc(postId)
            .update({
                likes: firestore.FieldValue.increment(1)
            })
    }
    catch (error) {
        console.log("Action:Like casuing issues:"+error)
    }
}




export const onUnLike = (userId, postId) => async (dispatch) => {
    try {
        //console.log("unlike",userId,postId)
        firestore()
            .collection("posts")
            .doc(userId)
            .collection("userPosts")
            .doc(postId)
            .collection("likes")
            .doc(auth().currentUser.uid)
            .delete();
            //dispatch(decrementLikeCount(userId,postId));
    }
    catch (error) {

    }
}

export const decrementLikeCount =(userId, postId) => async (dispatch) => {
    try {
        console.log("cerement count",userId,postId)
        firestore()
            .collection("posts")
            .doc(userId)
            .collection("userPosts")
            .doc(postId)
            .update({
                likes: firestore.FieldValue.increment(-1)
            })
    }
    catch (error) {

    }
}