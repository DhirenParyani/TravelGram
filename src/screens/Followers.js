import React from 'react'
import { View, Text, TextInput, FlatList, TouchableOpacity,StyleSheet} from 'react-native'
import { ListItem, Icon } from 'react-native-elements'
import { useBackHandler } from '@react-native-community/hooks'
import { connect } from 'react-redux'

const Followers = ({users,navigation}) => {
    const backAction = () => {
       
        navigation.pop();
   }

   useBackHandler(() => backAction())
   
    
   
    return (
        <View style={styles.container}>
           
            <FlatList
                numColumns={1}
                horizontal={false}
                data={users}
                keyExtractor={(user)=>user.uid}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        onPress={()=>{
                                 navigation.navigate('Profile',{userId:item.id})
                        }}>
                        <Text style={styles.item}>{item.name}</Text>
                    </TouchableOpacity>

                )}
            />
        </View>
    );
}


const mapStateToProps = (store)=> ({
   users:store.followers.users
})
const styles = StyleSheet.create({
    container: {
     flex: 1,
     paddingTop: 22,
     backgroundColor: '#1b262c'
    },
    item: {
      padding: 10,
      fontSize: 18,
      height: 44,
      color:'white'
    },
  });

export default connect(mapStateToProps,null)(Followers);