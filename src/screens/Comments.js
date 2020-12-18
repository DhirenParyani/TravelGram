import React, {useState,useEffect} from 'react'
import { View, Text, FlatList, Button, TextInput,StyleSheet} from 'react-native'
import {makeComment,readComments} from '../action/comments'
import { connect } from 'react-redux'
import shortid from 'shortid'
import auth from '@react-native-firebase/auth'
import { useBackHandler } from '@react-native-community/hooks'

const Comments = ({navigation,makeComment,readComments,route,comments}) => {
   const backAction = () => {
       
        navigation.goBack();
   }

   useBackHandler(() => backAction())

    const [text, setText] = useState("")
    const [commentList,setCommentList]=useState([])
   
    useEffect(() => {
        console.log(route.params.postId,route.params.userId)
        const fetchData = async () => {
            await readComments(route.params.userId,route.params.postId)
         }
         fetchData()
         
         comments.sort((x, y) => y.creation - x.creation)    
 

    },[route.params.postId])

   return(
    <View >
        <View style={styles.container}>
        <TextInput
            style={styles.input}
            placeholder='Leave a comment'
            value={text}
            onChangeText={(text) => setText(text)} />
        <Button
            onPress={() => {
                  comments.push({id:shortid.generate(),comment:text,creator:auth().currentUser.uid})                    
                  makeComment(userId=route.params.userId,postId=route.params.postId,comment=text)
                  setText('')
                  }}
            title="Send"
        />
    </View>


    <FlatList
        numColumns={1}
        horizontal={false}
        data={comments}
        keyExtractor= {(comments)=>comments.id}
        renderItem={({ item }) => (
            <View style={styles.comment}>
                 <Text>'{item.comment}'</Text>
            </View>
        )}
    />

    

</View>
   )
}

const mapDispatchToProps = {
    makeComment:(userId,postId,text)=>makeComment(userId,postId,text),
    readComments:(userId,postId)=>readComments(userId,postId)

}
const mapStateToProps = (store) => ({
    comments: store.comments.comments,
  
})

const styles = StyleSheet.create({
    container: {
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: 'rgba(0,0,0,0.1)',
        paddingHorizontal: 20,
        height: 100,
      },
      input: {
        flex: 1,
      },
    comment: {
        marginLeft: 20,
        paddingVertical: 20,
        paddingRight: 20,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: 'rgba(0,0,0,0.05)',
    },
});


export default connect(mapStateToProps,mapDispatchToProps) (Comments);