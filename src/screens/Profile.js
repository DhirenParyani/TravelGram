import React, { useEffect, useState,useCallback } from 'react'
import { StyleSheet, View, Text, Image, FlatList, Button,RefreshControl} from 'react-native'
import { Thumbnail, H1, Container } from 'native-base'
import { connect } from 'react-redux'
import auth from '@react-native-firebase/auth'
import EmptyContainer from '../components/EmptyContainer'
import { fetchUser, fetchUserPost, changeFollowingStatus, onFollow, onUnFollow,monitorCurrentPostLikeStatus} from '../action/user'
import { TouchableHighlight, TouchableOpacity } from 'react-native-gesture-handler'


const Profile = ({monitorCurrentPostLikeStatus,followingUsers,followersDataLoading,userDataLoading,currentUser, posts, navigation, route, fetchUser, fetchUserPost, changeFollowingStatus, onFollow, onUnFollow, following }) => {
    const[refreshing,setRefreshing]=useState(false)
    const onRefresh=useCallback(()=>{
        const fetchData = async () => {

            await fetchUser(auth().currentUser.uid);
            await fetchUserPost(auth().currentUser.uid);
            
    
        }
        
        fetchData();
       },[refreshing]);

   
    useEffect(() => {

        const fetchData = async () => {
           
            await fetchUser(route.params.userId);
            await fetchUserPost(route.params.userId);
            await changeFollowingStatus(route.params.userId);
            
        }
        fetchData()
        /*for (let i = 0; i < posts.length; i++) {
            monitorCurrentPostLikeStatus(route.params.userId,posts[i].id);
        }*/    

    }, [route.params.userId, following])

    if(followersDataLoading||userDataLoading)
    return (<EmptyContainer />)

    return (
       
        <View style={styles.container}>
            <View style={{ padding: 20, flexDirection: "row" }}>
                <View style={styles.profileImage}>
                    <Thumbnail large source={{ uri: currentUser.image }} />
                </View>
                <View
                    style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        padding: 5
                    }}>
                    <View style={{ flexDirection: "row", flex: 1 }}>
                        <View style={{ flex: 1, alignItems: "center" }}>
                            <Text>{posts.length}</Text>
                            <Text>Posts</Text>
                        </View>
                        <TouchableOpacity style={{ flex: 1, alignItems: "center" }}  onPress={()=>navigation.navigate('Followers')}>
                            <Text>{followingUsers.length}</Text>
                            <Text>following</Text>
                        </TouchableOpacity>
                    </View>


                </View>

            </View>
            <View style={{marginLeft:20,marginBottom:10}}>
                <View >
                <Text >{currentUser.name}</Text>
                </View>
                <View>
                <Text>{currentUser.country}</Text>
                </View>
                <View>
                <Text>{currentUser.bio}</Text>
                </View>
            </View>
            {
                (route.params.userId !== auth().currentUser.uid) ?
                    (
                        <View>
                            {following ? (

                                <Button
                                    title="Following"
                                    onPress={() => onUnFollow(route.params.userId)}
                                />
                            ) :
                                (
                                    <Button
                                        title="Follow"
                                        onPress={() => onFollow(route.params.userId)}
                                    />
                                )}
                        </View>


                    ) : (

                        <View></View>
                    )

            }



            <View style={styles.containerGallery}>
                <FlatList
                    numColumns={3}
                    horizontal={false}
                    data={posts}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>
                    }
                    keyExtractor={item => item.id}
                    ListEmptyComponent={() => (

                        <Container style={styles.emptyContainer}>
                            <H1>No Posts Found</H1>
                        </Container>

                    )}
                    renderItem={({ item }) => (
                       
                            <View style={styles.containerImage}>     
                             <TouchableHighlight
                             onPress={()=>navigation.navigate('PostDetails',{userId:route.params.userId,postId:item.id})}>
                            <Image
                                style={styles.image}
                                source={{ uri: item.downloadUrl }}
                                
                            />
                            </TouchableHighlight>
                            </View>
                       

                    )}

                />
            </View>
        </View>
                         
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff"
    },
    containerInfo: {
        margin: 20
    },
    containerGallery: {
        flex: 1,
        backgroundColor: "#1b262c"
    },
    containerImage: {
        flex: 1 / 3

    },
    image: {
        flex: 1,
        aspectRatio: 1 / 1
    },
    profileImage: {

        borderWidth: 1,
        marginRight: 10
    },
    emptyContainer: {
        flex: 1,
        backgroundColor: '#1b262c',
        justifyContent: 'center',
        alignItems: 'center',
    }


})

const mapDispatchToProps = {
    fetchUser: (uid) => fetchUser(uid),
    fetchUserPost: (uid) => fetchUserPost(uid),
    changeFollowingStatus: (uid) => changeFollowingStatus(uid),
    onFollow: (uid) => onFollow(uid),
    onUnFollow: (uid) => onUnFollow(uid),
    monitorCurrentPostLikeStatus:(uid,postid)=>monitorCurrentPostLikeStatus(uid,postid)
}

const mapStateToProps = (store) => ({
    currentUser: store.user.currentUser,
    posts: store.user.posts,
    following: store.user.following,
    followersDataLoading:store.followers.loading,
    userDataLoading:store.user.loading,
    followingUsers: store.followers.userIds,

})

export default connect(mapStateToProps, mapDispatchToProps)(Profile);