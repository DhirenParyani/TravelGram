import {SET_POST,ERROR_POST,CLEAR_DATA} from '../action/action.types'


const initialState = {
    posts:null,
    loading:true,
    error:false
}


export default (state=initialState, action) => {
    switch(action.type)
    {
        case SET_POST:
            return {
                ...state,
                posts:action.payload,
                loading:false,
                error:false
            }
        case ERROR_POST:
            return {
                    ...state,
                    error:true
            }   
        case CLEAR_DATA:
                return initialState  


        default:
           return state

    }
}