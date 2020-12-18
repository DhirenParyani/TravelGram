import React, { useEffect, useState } from 'react'
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import auth from '@react-native-firebase/auth'
import { connect, useDispatch } from 'react-redux'
import { fetchUser, fetchUserPost } from '../action/user'
import { fetchFollowers, clearData } from '../action/followers'
import EmptyContainer from '../components/EmptyContainer'

import AddPost from './AddPost';
import Profile from './Profile'
import Feeds from './Feeds'
import Search from './Search'
import { FOLLOWERS_DATA_LOADING_STATE_CHANGE } from '../action/action.types'


const Tab = createMaterialBottomTabNavigator()

const Home = ({ feed, followingUsers, followersDataLoading, userDataLoading, clearData, fetchFollowers, fetchUser, fetchUserPost, currentUser, posts }) => {
   

    useEffect(() => {
       
        clearData()
        fetchUser(auth().currentUser.uid);
        fetchUserPost(auth().currentUser.uid);
        fetchFollowers();
      
    }, [])

    return (
        <Tab.Navigator initialRouteName="Feeds">
            <Tab.Screen name="Feeds" component={Feeds}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="home" color={color} size={26} />
                    )
                }} />
            <Tab.Screen name="AddPost" component={AddPost}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="plus-box" color={color} size={26} />
                    )
                }} />
            <Tab.Screen name="Search" component={Search}

                options={{
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="magnify" color={color} size={26} />
                    )
                }} />
            <Tab.Screen name="Profile" component={Profile}
                listeners={({ navigation }) => ({
                    tabPress: event => {
                        event.preventDefault();
                        navigation.navigate("Profile", { userId: auth().currentUser.uid })
                    }
                })}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="account-circle" color={color} size={26} />
                    )
                }} />

        </Tab.Navigator>
    )
}


const mapDispatchToProps = {
    fetchUser: (uid) => fetchUser(uid),
    fetchUserPost: (uid) => fetchUserPost(uid),
    fetchFollowers,
    clearData
}

const mapStateToProps = (store) => ({
    currentUser: store.user.currentUser,
    posts: store.user.posts,
    followingUsers: store.followers.userIds,
    followersDataLoading: store.followers.loading,
    feed: store.followers.feed,
    userDataLoading: store.user.loading
})

export default connect(mapStateToProps, mapDispatchToProps)(Home);