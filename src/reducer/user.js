import {USER_DATA_LOADING_STATE_CHANGE,CHANGE_USER_FOLLOW_STATE, USER_POST_STATE_CHANGE, USER_SEARCH, USER_STATE_CHANGE,CLEAR_DATA,CHANGE_POST_LIKE_STATUS} from "../action/action.types"

const initialState = {
    loading:false,
    currentUser: null,
    posts: [],
    users: [],
    following:false,
    
}

export default (state = initialState, action) => {
    switch (action.type) {
        case USER_DATA_LOADING_STATE_CHANGE:
            return {
                ...state,
                loading: action.loading
            }
        case USER_STATE_CHANGE:
            return {
                ...state,
                currentUser: action.currentUser
            }
        case USER_POST_STATE_CHANGE:
            return {
                ...state,
                posts: action.posts
            }
        case USER_SEARCH:
            return {
                ...state,
                users: action.users
            }

        case CHANGE_POST_LIKE_STATUS:
            return {
                ...state,
                posts:state.posts.map(post => post.id == action.postId ?
                    { ...post,currentUserLike: action.currentUserLike } :
                    posts)
            }      
        case CHANGE_USER_FOLLOW_STATE:
                return {
                    ...state,
                    following: action.following
                } 

        case CLEAR_DATA:
                    return initialState

        default:
            return state;

    }

}
