import React, { useState, useEffect } from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import { ListItem, Avatar } from 'react-native-elements';
import { auth, db } from '../firebase.js';
function Followlist({ username, id, navigation, propic }) {
  const user = auth.currentUser;
  const [presentuser, setPresentuser] = useState([]);
  useEffect(() => {
    db.collection('users')
      .doc(id)
      .onSnapshot((doc) => {
        setPresentuser(doc.data());
      });
  }, []);

  return (
    <View style={{ backgroundColor: 'white' }}>
      {user?.displayName === username ? (
        <ListItem containerStyle={{ backgroundColor: 'white' }}>
          <Avatar
            size="medium"
            rounded
            source={{
              uri: `${presentuser.propic}`,
            }}
          />
          <ListItem.Content>
            <ListItem.Title
              style={{ color: 'black' }}
              onPress={() => navigation.navigate('Profile')}>
              {username}
            </ListItem.Title>
          </ListItem.Content>
        </ListItem>
      ) : (
        <ListItem
          containerStyle={{ backgroundColor: 'white' }}
          onPress={() =>
            navigation.navigate('userprofile', {
              userid: id,
              username: username,
              propic: presentuser.propic,
            })
          }>
          <Avatar
            size="medium"
            rounded
            source={{
              uri: `${presentuser.propic}`,
            }}
          />
          <ListItem.Content>
            <ListItem.Title style={{ color: 'black' }}>
              {username}
            </ListItem.Title>
          </ListItem.Content>
        </ListItem>
      )}
    </View>
  );
}
export default Followlist;
