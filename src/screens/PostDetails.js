import React,{useEffect,useState,useCallback} from 'react'
import {RefreshControl,SafeAreaView,StyleSheet,ScrollView} from 'react-native'
import Post from '../components/Post'
import { connect } from 'react-redux'
import auth from '@react-native-firebase/auth'
import { fetchUser, fetchUserPost,monitorCurrentPostLikeStatus } from '../action/user'
import { fetchFollowers, clearData } from '../action/followers'
import { ListItem } from 'react-native-elements'


import {useDispatch} from 'react-redux'

const PostDetails=({monitorCurrentPostLikeStatus,fetchUserPost,fetchFollowers,fetchUser,navigation,route,currentUser,posts})=>{
    const [refreshing, setRefreshing] = useState(false);
    const [post,setPost]=useState({})
    const [user,setUser]=useState({})
    
    const dispatch=useDispatch();

    useEffect(() => {
      
        const post  = posts.find(el => el.id === route.params.postId);
                     
        setUser({uid:route.params.userId,...currentUser})
        setPost(post)
    },[route.params.postId,route.params.userId]);
    const wait = (timeout) => {
        return new Promise(resolve => {
          setTimeout(resolve, timeout);
        });
      }
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        const fetchData = () => {
           
             
              fetchUser(route.params.userId);
              fetchUserPost(route.params.userId);
              
        }
        clearData()
        fetchData()
        wait(500).then(() => setRefreshing(false));
      }, []);

    return (
        <SafeAreaView>
      <ScrollView
        
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        
       
        <Post item={post} user={user} navigation={navigation} showBottomTab={false}/>
        
        
        </ScrollView>
        </SafeAreaView>
    )



}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      
    },
    scrollView: {
      flex: 1,
      backgroundColor: 'pink',
      alignItems: 'center',
      justifyContent: 'center',
    },
  });

const mapStateToProps = (store) => ({
    currentUser: store.user.currentUser,
    posts: store.user.posts,
    
    followingUsers: store.followers.userIds,

})

const mapDispatchToProps = {
    fetchUser: (uid) => fetchUser(uid),
    fetchUserPost: (uid) => fetchUserPost(uid),
    fetchFollowers,
    clearData,
    monitorCurrentPostLikeStatus:(uid,postid) => monitorCurrentPostLikeStatus(uid,postid)
}



export default connect(mapStateToProps,mapDispatchToProps)(PostDetails)



