import auth from '@react-native-firebase/auth'
import Snackbar from 'react-native-snackbar';
import firestore from '@react-native-firebase/firestore'
import { CLEAR_DATA, SIGN_OUT } from './action.types';




export const signUp = (data) => async (dispatch) => {

    
    const { name, userName, bio, email, password, country, image } = data
    auth().createUserWithEmailAndPassword(email, password)
        .then((data) => {
            
            firestore().collection("users")
                .doc(auth().currentUser.uid)
                .set({
                    name,
                    userName,
                    bio,
                    email,
                    password,
                    country,
                    image,

                })
            })
                .catch((error) => {
            console.error(error)
            
            Snackbar.show({
                text: 'Signup Failed',
                textColor: 'white',
                backgroundColor: 'red'
            })
        })


    

}


export const signIn = (data) => async (dispatch) => {
    
    const { email, password } = data
    auth()
        .signInWithEmailAndPassword(email, password)
        .then(() => {
            console.log("Signin Success");
            Snackbar.show({
                text: "Signin success!",
                textColor: "white",
                backgroundColor: "#1b262c"
            })
        })
        .catch((error) => {
            console.error(error);
            Snackbar.show({
                text: "Signin failed!",
                textColor: "white",
                backgroundColor: "red"
            })
        })
}

export const signOut = () =>  (dispatch) => {
    auth().signOut()
        .then(() => {
           
            console.log("Signout Success");
            Snackbar.show({
                text: "SignOut success!",
                textColor: "white",
                backgroundColor: "#1b262c"
            })
            
           
        })
        .catch((error) => {
            console.error(error);
            Snackbar.show({
                text: "Signout Failed",
                textColor: "white",
                backgroundColor: "red"
            })
        })
}
