import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Avatar } from 'react-native-elements';
import { db, auth } from './firebase.js';
export default function Homestories({ avatar_url, navigation, username, id,userspropic }) {
  const user = auth.currentUser;

  setTimeout(() => {
    db.collection('users').doc(user.uid).collection('stories').doc(id).delete();
  }, 40000);
  return (
    <View
      style={{
        margin: 5,
        borderWidth: 2,
        borderRadius: 50,
        borderColor: '#EA8BA5',
      }}>
      <TouchableOpacity
        style={{ padding: 2.5 }}
        onPress={() =>
          navigation.navigate('homeview', {
            userspropic:userspropic,
            url: avatar_url,
            username: username,
          })
        }>
        <Avatar source={{ uri: avatar_url }} rounded size="medium" />
      </TouchableOpacity>
    </View>
  );
}
