//empty state forwarding guy
import {SET_USER,IS_AUTHENTICATED,CLEAR_DATA} from '../action/action.types'

//we won't be setting anything that can validate the authentication
//we will use useDispatch for doing so

const initialState={
    user:null,
    loading:true,
    isAuthenticated:false
};

export default (state=initialState,action) =>{
    //We do things based on actionType
    switch(action.type){
    
        case SET_USER:
            return {
                ...state,
                user: action.payload,
                loading:false
            }
        case IS_AUTHENTICATED:
            return {
                ...state,
                isAuthenticated:action.payload,
                loading:false
            }
        
            default:
                return state;

    }

}
