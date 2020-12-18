import {READ_COMMENTS} from '../action/action.types'

const initialState={
    comments:[]
};

export default (state=initialState, action) => {
    switch(action.type)
    {
        case READ_COMMENTS:
            return {
                ...state,
                comments: [...action.comments]
            }
        
        
        default:
           return state

    }
}




