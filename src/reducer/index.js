import {combineReducers} from 'redux'
import auth from './auth'
import post from './post'
import user from './user'
import followers from './followers'
import comments from './comments'


export default combineReducers(
    {
        auth,
        post,
        user,
        followers,
        comments
    }
)