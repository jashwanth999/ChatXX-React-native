import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StatusBar,ScrollView } from 'react-native';
import { Header } from 'react-native-elements';
import {
  MaterialCommunityIcons,
  Ionicons,
  MaterialIcons,
} from '@expo/vector-icons';
import { auth, db } from '../firebase.js';
import Followlist from './Followlist.js';
export default function Following({ navigation, route }) {
  const { userid } = route.params;
  const user = auth.currentUser;
  const [using, setUsers] = useState([]);
  const [value, setValue] = useState('');
  setImmediate(() => {
    ref();
  });
  const ref = () => {
    db.collection('users')
      .doc(userid)
      .collection('following')
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
      <ScrollView
      containerStyle={{height:"100%"}}
      >
      {using.map(({ id, users }) =>

        users.followingname.includes(value) ? (
          <Followlist
            key={id}
            id={id}
            username={users.followingname}
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
