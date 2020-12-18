import React from 'react'
import store from './store'
import {Provider} from 'react-redux'


import App from './App'

const RootApp=()=>{
    //Entire App is surrounded by provider
    return(
        <Provider store={store}>
            <App/>
        </Provider>
    )

}


export default RootApp