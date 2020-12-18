//import firebase from 'react-native-firebase'
import React, { useState } from 'react'

import { StyleSheet, ScrollView, Image, Platform,View,FlatList } from 'react-native'
import {
  Container,
  Content,
  Form,
  Item,
  Input,
  Text,
  Button,
  H3,
  Textarea,
  Icon,
} from 'native-base';


import Snackbar from 'react-native-snackbar'
import ProgressBar from 'react-native-progress/Bar'
import firestore from '@react-native-firebase/firestore'
import ImagePicker from 'react-native-image-crop-picker';
import storage from '@react-native-firebase/storage'
import auth from '@react-native-firebase/auth'
import { ListItem, Avatar } from 'react-native-elements'


import { options } from '../utils/options'


//redux
import { connect } from 'react-redux'
import propTypes from 'prop-types'
import shortid from 'shortid'





const AddPost = ({ navigation, userState }) => {
  const [location, setLocation] = useState('')
  const [description, setDescription] = useState('')
  const [image, setImage] = useState(null)
  const [imageUploading, setImageUploading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState(0)
 


  const chooseImage = async () => {
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true
    }).then(uploadedImage => {
     
      setImage(uploadedImage.path)
      
    }).catch(error=>
      Snackbar.show({
        text: "Sorry, there was an issue attempting to get the image you selected. Please try again",
        textColor: "white",
        backgroundColor: "red"
      })
    )

  }
  const uploadImage = async () => {
    const uploadUri = image
    const filename = uploadUri.substring(uploadUri.lastIndexOf('/') + 1);
    try {
      setUploadStatus(0)
      const path = `post/${auth().currentUser.uid}/${filename}`
      const reference = storage().ref().child(path)
      const task = reference.putFile(uploadUri)

      const taskProgress = snapshot => {
        const percentage = Math.round(snapshot.bytesTransferred / snapshot.totalBytes) * 100
        
        setImageUploading(true)
        setUploadStatus(percentage)
      }

      const taskCompleted = () => {
        reference.getDownloadURL().then((snapshot) => {
          savePost(snapshot);
          
          setImageUploading(false)
        })
      }

      const taskError = snapshot => {
        console.log("Error while adding post:",snapshot)
      }
      task.on("state_changed", taskProgress, taskError, taskCompleted);

    }
    catch (error) {
      console.log("Error while adding post:",error)
    }

  }

  const savePost = async (downloadUrl) => {
    try {
      
      if (!location || !image) {
        return Snackbar.show({
          text: "You're missing Location or the picture.",
          textColor: "white",
          backgroundColor: "red"
        })
      }


      firestore().collection('posts')
        .doc(auth().currentUser.uid)
        .collection("userPosts")
        .add({
          location,
          description,
          downloadUrl,
          creation: firestore.FieldValue.serverTimestamp(),
          likes:0

        }).then(() =>{
          Snackbar.show({
            text: "Congratulations, your post is live!",
            textColor: "white",
            backgroundColor: "#1b262c"
          })
          setImage(null)
          setDescription('')
          setLocation('')

        })


    }
    catch (error) {
      console.log(error)
      Snackbar.show({
        text: "Post upload failed",
        textColor: "white",
        backgroundColor: "red"
      })
    }
  }

  return (
    <ScrollView>
    <Container style={styles.container}>
      
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          {image && (
            <Image
              source={{ uri: image }}
              style={styles.image}
              resizeMode="center"
            />
          )}
          <Form>
            <Item regular style={styles.formItem}>
            <Input
                    placeholder="location"
                    value={location}
                    style={{color: '#eee'}}
                    onChangeText={(text) => setLocation(text)}
                  />

            </Item>

            {imageUploading ? (
              <ProgressBar progress={uploadStatus} style={styles.progress} />
            ) : (
                <Button
                  regular
                  bordered
                  block
                  iconLeft
                  info
                  style={styles.formItem}
                  onPress={chooseImage}>
                  <Icon
                    name="md-image-outline"
                    type="Ionicons"
                    style={styles.icon}
                  />
                  <Text
                    style={{
                      color: '#fdcb9e',
                    }}>
                    Choose Image
                    </Text>
                </Button>
              )}

            <Item regular style={styles.formItem}>
              <Textarea
                rowSpan={5}
                placeholder="Some description..."
                value={description}
                style={{ color: '#eee' }}
                onChangeText={(text) => setDescription(text)}
              />
            </Item>

            <Button regular block onPress={uploadImage}>
              <Text>Add Post</Text>
            </Button>
          </Form>
        </ScrollView>
      
    </Container>
    </ScrollView>
  );


}

AddPost.propTypes = {
  userState: propTypes.object.isRequired
}


const mapStateToProps = (store) => (
  {
    userState: store.user
  })
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1b262c',
    flex: 1,
    justifyContent: 'flex-start',
  },
  formItem: {
    marginBottom: 20,
  },
  icon: { fontSize: 20, color: '#fdcb9e' },
  image: { width: null, height: 150, marginVertical: 15 },
  progress: { width: null, marginBottom: 19 },
});


export default connect(mapStateToProps)(AddPost);