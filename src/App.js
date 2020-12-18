import React, { useEffect } from 'react'
import { Text } from 'react-native'
import 'react-native-gesture-handler'

import auth from '@react-native-firebase/auth'

import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
//dispatch any info which can talk with state residing inside redux
import { useDispatch, connect } from 'react-redux'
import SignIn from './screens/SignIn'
import SignUp from './screens/SignUp'
import Home from './screens/Home'
import Comments from './screens/Comments'
import PostDetails from './screens/PostDetails'

import CustomHeader from './layout/CustomHeader'

import { IS_AUTHENTICATED } from './action/action.types'
import EmptyContainer from './components/EmptyContainer'
import { requestPermission } from './utils/AskPermission'
import Followers from './screens/Followers'

const Stack = createStackNavigator();

const App = ({ navigation,authState}) => {

  const dispatch = useDispatch();

  const onAuthStateChanged = (user) => {
    if (user) {
      dispatch({
        type: IS_AUTHENTICATED,
        payload: true
      })
      
      

    }
    else {
      dispatch({
        type: IS_AUTHENTICATED,
        payload: false
      })

    }


  }

  useEffect(() => {
    requestPermission()
    const subscriber = auth().onAuthStateChanged((authState)=>onAuthStateChanged(authState))
    //unmount
    return subscriber;
  }, [])


  if (authState.loading) {
    return <EmptyContainer />
  }

  return (
    <>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={
            {
              header: (props) => <CustomHeader {...props} />
            }
          }>
        {authState.isAuthenticated ? (
          
          <>
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="Comments" component={Comments} navigation={navigation} options={{headerBackTitleVisible:true}}/>
            <Stack.Screen name="PostDetails" component={PostDetails} navigation={navigation} options={{headerBackTitleVisible:false}}/>
            <Stack.Screen name="Followers" component={Followers} navigation={navigation} options={{headerBackTitleVisible:false}}/>

          </>) : (


            <>
              <Stack.Screen name="SignIn" component={SignIn} />
              <Stack.Screen name="SignUp" component={SignUp} />
            </>


          )}
      </Stack.Navigator>
    </NavigationContainer>
    </>
  );

}

const mapStateToProps = (state) => ({
  authState: state.auth
})

export default connect(mapStateToProps)(App)