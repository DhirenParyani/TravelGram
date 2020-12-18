import React, { useState } from 'react'
import { StyleSheet, ScrollView, TouchableOpacity, View,SafeAreaView} from 'react-native'
import {
  Container,
  Form,
  Item,
  Input,
  Text,
  Button,
  Thumbnail,
  Content
} from 'native-base'
import Snackbar from 'react-native-snackbar';
import ImagePicker from 'react-native-image-crop-picker';
import storage from '@react-native-firebase/storage'
import ProgressBar from 'react-native-progress/Bar'
import firestore from '@react-native-firebase/firestore'
//redux
import propTypes from 'prop-types'
import { signUp } from '../action/auth'
import { connect } from 'react-redux'

const SignUp = ({ signUp }) => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [userName, setUserName] = useState('')
  const [country, setCountry] = useState('')
  const [bio, setBio] = useState('')
  const [image, setImage] = useState('https://firebase.google.com/downloads/brand-guidelines/PNG/logo-logomark.png')
  const [imageUploading, setImageUploading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState(null)
  const [showDropDown, setShowDropDown] = useState(false);
  const genderList = [
    { label: 'Male', value: 'male' },
    { label: 'Female', value: 'female' },
    { label: 'Others', value: 'others' },
  ];
  const chooseImage = async () => {
    ImagePicker.openPicker({
      width: 40,
      height: 40,
      cropping: true
    }).then(uploadedImage => {

      setImage(uploadedImage.path)
      uploadImage(uploadedImage.path);

    });
  }
  const uploadImage = async (image) => {
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
        console.log("Error uploading profile picture:",snapshot)
      }
      task.on("state_changed", taskProgress, taskError, taskCompleted);

    }
    catch (error) {
      console.log("Error uploading profile picture:",error)
    }
  }

  const doSignUp = async () => {
    if (name.length == 0 || email.length == 0 || password.length == 0 || userName.length == 0) {
      let message=""
      let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      if(name.length==0)
      {
           message="Missing name"+" "+","
      }
      if(email.length==0)
      {
        message+="Missing email address"+" "+","
      }
    
      if(password.length<6)
      {
        message+="Password should be greater than 6 characters"+" "+","
      }
      if(emailRegex.test(email)===false)
      {
        message+="Email address is invalid"+","
      }

      Snackbar.show({
        text: message.substring(0,message.length-1).trim(),
        textColor: 'white',
        backgroundColor: 'red'
      })
    }
    else {
      firestore().collection("users")
        .where("userName", '==', userName)
        .get()
        .then(snapshot => {
          if (snapshot.empty)
            signUp({ name, userName, bio, country, email, password, image })
          else {
            Snackbar.show({
              text: `Username is already taken, don't be boring ${name}!!`,
              textColor: 'white',
              backgroundColor: 'red'
            })
          }
        })
    }


  }

  return (
    <Container style={styles.container}>
      <Content padder>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps='handled'>
          <View style={styles.imageContainer}>
            <TouchableOpacity onPress={chooseImage}>
              <Thumbnail large source={{ uri: image }} />
            </TouchableOpacity>
          </View>

          {imageUploading && (
            <ProgressBar progress={uploadStatus} style={styles.progress} />
          )}

          <Form>
            <Item regular style={styles.formItem}>
              <Input
                placeholder="name"
                value={name}
                style={{ color: '#eee' }}
                onChangeText={(text) => setName(text)}


              />
            </Item>
            <Item regular style={styles.formItem}>
              <Input
                placeholder="email"
                value={email}
                style={{ color: '#eee' }}
                onChangeText={(text) => setEmail(text)}


              />
            </Item>
            <Item regular style={styles.formItem}>
              <Input
                placeholder="password"
                value={password}
                secureTextEntry={true}
                style={{ color: '#eee' }}
                onChangeText={(text) => setPassword(text)}


              />
            </Item>
            <Item regular style={styles.formItem}>
              <Input
                placeholder="Username"
                value={userName}
                style={{ color: '#eee' }}
                onChangeText={(text) => setUserName(text)}

              />
            </Item>
            <Item regular style={styles.formItem}>
              <Input
                placeholder="Your Short Bio"
                value={bio}
                style={{ color: '#eee' }}
                onChangeText={(text) => setBio(text)}

              />
            </Item>
            <Item regular style={styles.formItem}>
              <Input
                placeholder="Country"
                value={country}
                style={{ color: '#eee' }}
                onChangeText={(text) => setCountry(text)}
          />
          </Item>
            {/*<Provider>
            <SafeAreaView style={styles.dropdownStyle}>
            <DropDown
          label={'Countries'}
          mode={'outlined'}
          value={country}
          setValue={setCountry}
          list={genderList}
          visible={showDropDown}
          showDropDown={() => setShowDropDown(true)}
          onDismiss={() => setShowDropDown(false)}
          inputProps={{
            right: <TextInput.Icon name={'menu-down'} />,
          }}/>
          </SafeAreaView>
        </Provider>*/}
            <Button regular block onPress={doSignUp}>
              <Text>SignUp</Text>
            </Button>
          </Form>
        </ScrollView>
      </Content>
    </Container>
  );





}
//Stitching up to Dispatch action
const mapDispatchToProps = {
  //we pass on data and that is going to run a signup method
  signUp: (data) => signUp(data)
}


SignUp.prototype = {
  signUp: propTypes.func.isRequired
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1b262c',
    flex: 1,
    justifyContent: 'flex-start',
  },
  imageContainer: {
    alignItems: 'center',
    marginVertical: 5,
  },
  progress: { width: null, marginBottom: 20 },
  formItem: {
    marginBottom: 20,
  },
  dropdownStyle:{
    flex: 1,
    marginHorizontal: 20,
    justifyContent: 'center'
  }
});


//not talking to state so it is null
export default connect(null, mapDispatchToProps)(SignUp)