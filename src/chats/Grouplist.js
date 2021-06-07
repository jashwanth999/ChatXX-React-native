import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StatusBar } from 'react-native';
import { Header } from '../src/Story/node_modules/react-native-elements';
import {
  MaterialCommunityIcons,
  Ionicons,
  MaterialIcons,
} from '@expo/vector-icons';
import { auth, db } from '../auth/firebase.js';
import Userlist from '../Userlist.js';
import GroupChatusers from './GroupChatusers.js';
export default function Grouplist({ navigation, route }) {
  const { createrid, roomid } = route.params;
  const user = auth.currentUser;
  const [using, setUsers] = useState([]);
  const [value, setValue] = useState('');
  const [groupusers, setgroupusers] = useState([]);
  setImmediate(() => {
    ref();
  });
  const ref = () => {
    db.collection('users')
      .doc(createrid)
      .collection('groups')
      .doc(roomid)
      .collection('groupusers')
      .onSnapshot((snapshot) => {
        setgroupusers(
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
              outline: 'none',
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
      {groupusers.map(({ id, users }) =>
        users.addingname?.includes(value) ? (
          <GroupChatusers
            key={id}
            id={id}
            username={users.addingname}
            navigation={navigation}
            user={user}
            propic={users.addingpropic}
            userid={users.addingid}
          />
        ) : (
          <View></View>
        )
      )}
    </View>
  );
}
