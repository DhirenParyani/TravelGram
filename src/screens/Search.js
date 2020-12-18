import React, { useEffect, useState } from 'react'
import { View, Text, TextInput, FlatList, TouchableOpacity,StyleSheet} from 'react-native'
import { ListItem, Icon } from 'react-native-elements'

import {fetchSearchList} from '../action/user'
import { connect } from 'react-redux'

const Search = ({searchUser,users,navigation}) => {
    const[searchText,setSearchText]=useState('');
    useEffect(()=>{
    const fetchUsers = async(searchText) => {
            await searchUser(searchText);
        }
        fetchUsers(searchText)  
    },[searchText])
   
    return (
        <View style={styles.container}>
            <ListItem >
            <Icon name="search"/>
            <ListItem.Content>
            <TextInput
                placeholder="Search"
                onChangeText={(text) => setSearchText(text)} autoFocus={true}/>
            </ListItem.Content>    
            </ListItem>   

            <FlatList
                numColumns={1}
                horizontal={false}
                data={users}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        onPress={()=>{
                                 navigation.navigate('Profile',{userId:item.id})
                        }}>
                        <Text style={styles.item}>{item.userName}</Text>
                    </TouchableOpacity>

                )}
            />
        </View>
    );
}

const mapDispatchToProps = {
     searchUser: (text) => fetchSearchList(text)
}
const mapStateToProps = (store)=> ({
   users:store.user.users
})
const styles = StyleSheet.create({
    container: {
     flex: 1,
     paddingTop: 22,
     backgroundColor: '#1b262c',
    },
    item: {
      padding: 10,
      fontSize: 18,
      height: 44,
      color:'white'
    },
  });

export default connect(mapStateToProps,mapDispatchToProps)(Search);