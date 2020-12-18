import React, {useState, useEffect} from 'react';
import {Image, Linking} from 'react-native';
import {
  Card,
  CardItem,
  Thumbnail,
  Text,
  Button,
  Icon,
  Left,
  Body,
  Right,
} from 'native-base';
import firestore from '@react-native-firebase/firestore'

import auth from '@react-native-firebase/auth'
import EmptyContainer from './EmptyContainer';

const Post = ({item,user,navigation,showBottomTab}) =>{
  const onLike = (userId, postId) => {
    
    firestore()
        .collection("posts")
        .doc(userId)
        .collection("userPosts")
        .doc(postId)
        .collection("likes")
        .doc(auth().currentUser.uid)
        .set({})
       
  }
  const onUnLike = (userId, postId) => {
    firestore()
        .collection("posts")
        .doc(userId)
        .collection("userPosts")
        .doc(postId)
        .collection("likes")
        .doc(auth().currentUser.uid)
        .delete()
        
  }
  
    
    const [backupImage,setBackupImage]=useState('https://firebase.google.com/downloads/brand-guidelines/PNG/logo-logomark.png')
    if(Object.keys(item).length==0||(typeof user==undefined && (!user.hasOwnProperty('name')) && (!user.hasOwnProperty('image')) && (!user.hasOwnProperty('uid'))))
    return (<EmptyContainer/>)
    return (
    <Card
      style={{
        backgroundColor: '#0f4c75',
        borderColor: '#0f4c75',
      }}>
      <CardItem
        style={{
          backgroundColor: 'transparent',
        }}>
        <Left>
          {(user!==undefined && user.hasOwnProperty('image'))?
          (<Thumbnail source={{uri:user.image}} small />)
          :
          (<Thumbnail source={{uri:backupImage}} small />)
        }
          <Body>
            <Text
              style={{
                color: '#fdcb9e',
              }}>
              {((user!==undefined && user.hasOwnProperty('userName')))?user.userName:""}
            </Text>

            <Text note>{item.location}</Text>
          </Body>
        </Left>
      </CardItem>
      <CardItem cardBody>
        <Image
          source={{uri: item.downloadUrl}}
          style={{height: 400, width:300, flex: 1}}
        />
      </CardItem>
      <CardItem
        cardBody
        style={{
          backgroundColor: 'transparent',
        }}>
        <Text
          numberOfLines={2}
          style={{
            color: '#fff',
          }}>
          {item.description}
        </Text>
      </CardItem>
         
      <CardItem
        style={{
          backgroundColor: '#0f4c75',
        }}>
        <Left>
        {showBottomTab===true ?(
        item.currentUserLike ?
          (
          <Button transparent onPress={()=>(user!=null && user.hasOwnProperty('uid'))?onUnLike(user.uid,item.id):null}>
            <Icon
              name="heart"
              type="Entypo"
              style={{fontSize: 20, color: '#fdcb9e'}}
            />
            <Text
              style={{
                color: '#fdcb9e',
              }}>
              {item.likes}
            </Text>
          </Button>
          ):(
          <Button transparent onPress={()=>(user!=null && user.hasOwnProperty('uid'))?onLike(user.uid,item.id):null}>
            <Icon
              name="heart-outlined"
              type="Entypo"
              style={{fontSize: 20, color: '#fdcb9e'}}
            />
            <Text
              style={{
                color: '#fdcb9e',
              }}>
                {item.likes}
            </Text>
          </Button>
          )
          ):
          (
            <Button transparent onPress={()=>(user!=null && user.hasOwnProperty('uid'))?onUnLike(user.uid,item.id):null}>
            <Icon
              name="star"
              type="Entypo"
              style={{fontSize: 20, color: '#fdcb9e'}}
            />
            <Text
            style={{
              color: '#fdcb9e',
            }}>
            {item.likes}
            </Text>
            </Button>
          )
          
          }
          <Button transparent onPress={()=>navigation.navigate('Comments',{postId:item.id,userId:user.uid})}>
            <Icon
              name="typing"
              type="Entypo"
              style={{fontSize: 20, color: '#fdcb9e'}}
            />
           
          </Button>


        </Left>
       
      </CardItem>
       
    </Card>
  );



}


export default Post