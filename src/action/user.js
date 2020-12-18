import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'
import { USER_DATA_LOADING_STATE_CHANGE, USER_STATE_CHANGE, USER_POST_STATE_CHANGE, SET_USER, USER_SEARCH, CHANGE_USER_FOLLOW_STATE, CHANGE_POST_LIKE_STATUS } from './action.types'

export const fetchUser = (userid) => async (dispatch) => {
    try {
        dispatch({
            type: USER_DATA_LOADING_STATE_CHANGE,
            loading: true
        })

        firestore().
            collection('users')
            .doc(userid)
            .get()
            .then((snapshot) => {
                if (snapshot.exists) {

                    dispatch({
                        type: USER_STATE_CHANGE,
                        currentUser: snapshot.data()
                    })
                    dispatch({
                        type: USER_DATA_LOADING_STATE_CHANGE,
                        loading: false
                    })
                }
            })
    }
    catch (error) {

        console.log(error)

    }



}


export const changeFollowingStatus = (userid) => async (dispatch) => {
    try {

        firestore().
            collection('following')
            .doc(auth().currentUser.uid)
            .collection('userFollowing')
            .doc(userid)
            .get()
            .then((snapshot) => {
                if (snapshot.exists) {


                    dispatch({
                        type: CHANGE_USER_FOLLOW_STATE,
                        following: true
                    })
                }

            })

    }
    catch (error) {
        console.log(error)

    }
}

export const onFollow = (userid) => async (dispatch) => {
    try {

        firestore().
            collection('following')
            .doc(auth().currentUser.uid)
            .collection('userFollowing')
            .doc(userid)
            .set({})
        ////console.log("now following",userid)

        dispatch({
            type: CHANGE_USER_FOLLOW_STATE,
            following: true
        })


    }
    catch (error) {
        console.log(error)

    }
}
export const onUnFollow = (userid) => async (dispatch) => {
    try {

        firestore().
            collection('following')
            .doc(auth().currentUser.uid)
            .collection('userFollowing')
            .doc(userid)
            .delete()
        dispatch({
            type: CHANGE_USER_FOLLOW_STATE,
            following: false
        })


    }
    catch (error) {
        console.log(error)

    }
}


export const fetchSearchList = (text) => async (dispatch) => {
    try {

        firestore()
            .collection('users')
            .where('name', '>=', text)
            .where('name', '<=', text + '~')
            .get()
            .then((snapshot) => {
                if (snapshot.size > 0) {
                    let users = snapshot.docs.map(doc => {
                        const data = doc.data();
                        const id = doc.id;
                        return { id, ...data }
                    });

                    dispatch({
                        type: USER_SEARCH,
                        users
                    })
                }
                else {
                    let users = []
                    dispatch({
                        type: USER_SEARCH,
                        users
                    })


                }


            })

    }
    catch (error) {

        console.log(error)

    }
}



export const fetchUserPost = (userid) => async (dispatch) => {
    try {
        dispatch({
            type: USER_DATA_LOADING_STATE_CHANGE,
            loading: true
        })


        firestore().
            collection('posts')
            .doc(userid)
            .collection('userPosts')
            .orderBy("creation", "asc")
            .get()
            .then((snapshot) => {
                let posts = snapshot.docs.map(doc => {
                    const data = doc.data();
                    const id = doc.id;
                    return { id, ...data }
                });

                dispatch({
                    type: USER_POST_STATE_CHANGE,
                    posts
                })

                dispatch({
                    type: USER_DATA_LOADING_STATE_CHANGE,
                    loading: false
                })


            })

    }
    catch (error) {

        console.log(error)
    }


}


export const monitorCurrentPostLikeStatus = (uid, postId) => async (dispatch, getState) => {

    try {
        dispatch({
            type: USER_DATA_LOADING_STATE_CHANGE,
            loading: true
        })

        firestore()
            .collection("posts")
            .doc(uid)
            .collection("userPosts")
            .doc(postId)
            .collection("likes")
            .doc(auth().currentUser.uid)
            .onSnapshot((snapshot) => {
                //const postId = snapshot.ZE.path.segments[3];

                let currentUserLike = false;
                if (snapshot != null && snapshot.exists) {
                    currentUserLike = true;
                }

                dispatch({ type: CHANGE_POST_LIKE_STATUS, postId, currentUserLike })
                dispatch({
                    type: USER_DATA_LOADING_STATE_CHANGE,
                    loading: false
                })
            })
    }
    catch (error) {
        console.log(error)

    }



}
