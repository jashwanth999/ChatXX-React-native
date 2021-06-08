import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StatusBar } from 'react-native';
import { Header } from 'react-native-elements';
import {
  MaterialCommunityIcons,
  Ionicons,
  MaterialIcons,
} from '@expo/vector-icons';
import { auth, db } from '../../firebase.js';
import Userlist from '../../Userlist.js';
import { ScrollView } from 'react-native-gesture-handler';
export default function Search({ navigation }) {
  const user = auth.currentUser;
  const [using, setUsers] = useState([]);
  const [value, setValue] = useState('');
  setImmediate(() => {
    ref();
  });
  const ref = () => {
    db.collection('users')
      .where('userid', '!=', user.uid)
      .onSnapshot((snapshot) => {
        setUsers(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            users: doc.data(),
          }))
        );
      });
  };
  

  return (
    <View style={{ backgroundColor: 'white', flex: 1 }}>
      <Header
        containerStyle={{
          backgroundColor: '#13E6E6',
          borderBottomColor: 'none',
        }}
        leftComponent={
          <Ionicons
            name="arrow-back"
            color="white"
            size={28}
            onPress={() => navigation.goBack()}
          />
        }
        centerComponent={
          <TextInput
            placeholderTextColor="white"
            textColor="white"
            style={{
          
              width: '100%',

              fontSize: 17,
              color: 'white',
            }}
            value={value}
            onChangeText={(value) => setValue(value)}
            placeholder="Search"
          />
        }
      />
      <StatusBar backgroundColor="#13E6E6" />
      <ScrollView containerStyle={{
        height:"100%"
      }}>
      {using.map(({ id, users }) =>
        (users.username.includes(value.toLowerCase()) || users.username.includes(value.toUpperCase())) && value!="" ? (
          <Userlist
            key={id}
            id={id}
            username={users.username}
            navigation={navigation}
            user={user}
            propic={users.propic}
          />
        ) : (
          <View></View>
        )
      )}

      </ScrollView>
     
    </View>
  );
}
