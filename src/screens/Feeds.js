import React, { useEffect, useState,useCallback} from 'react'
import { StyleSheet, SafeAreaView, FlatList ,Text, RefreshControl} from 'react-native'
import { Container, H1 } from 'native-base'
import { fetchFollowers,clearFeedsData} from '../action/followers'
import Post from '../components/Post'
import { connect,useDispatch } from 'react-redux'
import EmptyContainer from '../components/EmptyContainer'
import { FOLLOWERS_DATA_LOADING_STATE_CHANGE } from '../action/action.types'


const Feeds = ({followersDataLoading,clearFeedsData,navigation,fetchFollowers, profilesLoaded, followingUsers, feed }) => {
    const [posts, setPosts] = useState([]);
    const[likes,setLikes]=useState(0);
    const dispatch = useDispatch();
    const[refreshing,setRefreshing]=useState(false)
    const onRefresh=useCallback(()=>{
        const fetchData = async () => {
           
            await fetchFollowers()
    
        }
        clearFeedsData()
        fetchData()
        
       },[refreshing]);
       
    useEffect(() => {
        

        if(profilesLoaded==followingUsers.length)
        {
            
            dispatch({
                type: FOLLOWERS_DATA_LOADING_STATE_CHANGE,
                loading: false
            })
        }
       
        if (profilesLoaded==followingUsers.length && feed.length>0 && (!followersDataLoading)) {
            
            feed.sort((x, y) => y.creation - x.creation)
            setPosts(feed);
           
        }


    },[profilesLoaded,feed])

    if(followersDataLoading)
    return (<EmptyContainer />)
    return (
        <>

            <FlatList
                data={posts}
                numColumns={1}
                horizontal={false}
                ListEmptyComponent={()=>(
                
                    <Container style={styles.emptyContainer}>
                        <H1>No Posts Found</H1>
                    </Container>
                
                 )}  
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>
                }
                //keyExtractor= {(item)=>item.id}
                renderItem={({ item }) => (
                   (Object.keys(item).length!==0 && (item.user!==null))?
                    (<Post item={item} user={item.user} navigation={navigation} showBottomTab={true}/>):
                    (<EmptyContainer/>)



                )}/>


           
        </>

    )

}

const mapDispatchToProps = {
    fetchFollowers,
    clearFeedsData

}
const mapStateToProps = (store) => ({
    profilesLoaded: store.followers.usersFollowingLoaded,
    followingUsers: store.followers.userIds,
    feed: store.followers.feed,
    followersDataLoading:store.followers.loading
})
const styles = StyleSheet.create({
    container: {
        backgroundColor: '#1b262c',
        justifyContent: 'flex-start',
        padding: 4,
        flex: 1,
    },
    emptyContainer: {
        flex: 1,
        backgroundColor: '#1b262c',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(Feeds);
