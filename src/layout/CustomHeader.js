import React from 'react'
import {StyleSheet} from 'react-native'
import {
    Header,
    Body,
    Button,
    Icon,
    Title,
    Text,
    Right

} from 'native-base'
import {connect} from 'react-redux'
import propTypes from 'prop-types'
import {signOut} from '../action/auth'  
import { clearData } from '../action/followers'



const CustomHeader = ({clearData,signOut, authState,navigation}) =>{
    return (
       <Header
       androidStatusBarColor="#0f4c75"
       style={{
           backgroundColor:"#0f4c75"
       }}>
           <Body>
               <Title>Travel Gram</Title>
           </Body>
          <Right>
              {authState.isAuthenticated && (
                  <>
                  <Button 
                  transparent
                  iconLeft
                     
                      onPress={() => {
                          clearData()
                          signOut().then(
                              ()=>  clearData()
                          )
                          //navigation.replace("SignIn")
                        }}>
                          <Icon name="log-out-outline" style={{color:"red"}}></Icon>
                      </Button>
                  </>
              )}
              
          </Right> 

       </Header>
    )


}

const mapStateToProps = (state) =>(
    {
        authState:state.auth
    }
)
mapDispatchToProps = {
    signOut,
    clearData
}

CustomHeader.prototype = {
    signOut: propTypes.func.isRequired,
    authState:propTypes.object.isRequired
}


CustomHeader.prototype ={
    signOut: propTypes.func.isRequired,
    authState: propTypes.object.isRequired
}

export default connect(mapStateToProps,mapDispatchToProps)(CustomHeader)