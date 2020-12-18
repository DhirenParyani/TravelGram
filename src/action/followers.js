import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'
import { FOLLOWERS_DATA_LOADING_STATE_CHANGE, FOLLOWERS_POST_STATE_CHANGE, FOLLOWERS_DATA_STATE_CHANGE, FOLLOWERS_STATE_CHANGE, FOLLOWERS_LIKES_STATE_CHANGE, CLEAR_DATA, CLEAR_FEEDS_DATA } from './action.types'


let profilesScanned = 0; let profilesToBeScanned = 0;
export const fetchFollowers = () => async (dispatch) => {

    try {
        dispatch({
            type: FOLLOWERS_DATA_LOADING_STATE_CHANGE,
            loading: true
        });

       

        firestore().
            collection('following')
            .doc(auth().currentUser.uid)
            .collection('userFollowing')
            .get()
            .then((snapshot) => {

               
                if (snapshot.size > 0) {
                    profilesToBeScanned = snapshot.size;
                    let followerIds = snapshot.docs.map(doc => {

                        const id = doc.id;
                        return id;
                    });
                   
                    dispatch({
                        type: FOLLOWERS_STATE_CHANGE,
                        userIds: followerIds
                    })

                    for (profilesScanned = 0; profilesScanned < followerIds.length; profilesScanned++) {
                        dispatch(fetchFollowersData(followerIds[profilesScanned], true))
                    }

                }
                else dispatch({
                    type: FOLLOWERS_DATA_LOADING_STATE_CHANGE,
                    loading: false
                })



            })
    }
    catch (error) {

        console.log(error)

    }

}


export const fetchFollowersData = (followerId, getPosts) => async (dispatch, getState) => {
    try {
       
        const found = getState().followers.users.some(el => el.uid === followerId);
        if (!found) {
            firestore().
                collection("users")
                .doc(followerId)
                .get()
                .then((snapshot) => {
                    if (snapshot.exists) {
                        let user = snapshot.data();
                        user.uid = snapshot.id;

                        dispatch({ type: FOLLOWERS_DATA_STATE_CHANGE, user });
                    }
                    else {
                        console.log('follower ID', followerId, ' does not exist')
                    }

                })
        }
        if (getPosts) {

            dispatch(fetchFollowersPosts(followerId));
        }



    }
    catch (error) {
        console.log(error)

    }
}

export const fetchFollowersPosts = (followerId) => async (dispatch, getState) => {
    try {

        firestore().
            collection("posts")
            .doc(followerId)
            .collection("userPosts")
            .orderBy("creation", "asc")
            .get()
            .then((snapshot) => {


                const user = getState().followers.users.find(el => el.uid === followerId);

                const uid = getState().followers.users.length


                let posts = snapshot.docs.map(doc => {
                    const data = doc.data();
                    const id = doc.id;
                    return { id, ...data, user }
                })


                for (let i = 0; i < posts.length; i++) {
                    dispatch(fetchUsersFollowingLikes(followerId, posts[i].id))
                }
                dispatch({ type: FOLLOWERS_POST_STATE_CHANGE, posts, followerId })

            })


    }
    catch (error) {
        console.log(error)

    }
}

export const fetchUsersFollowingLikes = (uid, postId) => async (dispatch, getState) => {

    try {
        firestore()
            .collection("posts")
            .doc(uid)
            .collection("userPosts")
            .doc(postId)
            .collection("likes")
            .doc(auth().currentUser.uid)
            .onSnapshot((snapshot) => {
                let currentUserLike = false;
                if (snapshot != null && snapshot.exists) {
                    currentUserLike = true;
                }

                dispatch({ type: FOLLOWERS_LIKES_STATE_CHANGE, postId, currentUserLike })
            })
    }
    catch (error) {
        console.log(error)

    }



}






export const clearData = () => async (dispatch) => {

    dispatch({ type: CLEAR_DATA })

}


export const clearFeedsData = () => async (dispatch) => {

    dispatch({ type: CLEAR_FEEDS_DATA })

}


