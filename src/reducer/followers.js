import { FOLLOWERS_DATA_LOADING_STATE_CHANGE, FOLLOWERS_STATE_CHANGE, FOLLOWERS_DATA_STATE_CHANGE, FOLLOWERS_POST_STATE_CHANGE, FOLLOWERS_LIKES_STATE_CHANGE, CLEAR_DATA, CLEAR_FEEDS_DATA } from '../action/action.types'

const initialState = {
    loading: true,
    userIds: [],
    users: [],
    feed: [],
    usersFollowingLoaded: 0,
};

export default (state = initialState, action) => {
    switch (action.type) {
        case FOLLOWERS_DATA_LOADING_STATE_CHANGE:
            
            return {
                ...state,
                loading: action.loading
            }
        case FOLLOWERS_STATE_CHANGE:
            return {
                ...state,
                userIds: action.userIds
            }
        case FOLLOWERS_DATA_STATE_CHANGE:
            return {
                ...state,
                users: [...state.users, action.user]
            }
        case FOLLOWERS_POST_STATE_CHANGE:

            return {
                ...state,
                usersFollowingLoaded: state.usersFollowingLoaded + 1,
                feed: [...state.feed, ...action.posts]

            }
        case FOLLOWERS_LIKES_STATE_CHANGE:
          
            return {
                ...state,
                feed: state.feed.map(post => post.id == action.postId ?
                    { ...post,currentUserLike: action.currentUserLike } :
                    post)

            }
        case CLEAR_FEEDS_DATA:
            return initialState

        case CLEAR_DATA:
            return initialState

        default:
            return state

    }
}

