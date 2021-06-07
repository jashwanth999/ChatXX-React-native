import React from 'react';
import { View, Text, TouchableOpacity, StatusBar } from 'react-native';
import { Avatar } from 'react-native-elements';
import { LinearGradient } from 'expo-linear-gradient';
import { db, auth } from './firebase.js.js.js';
export default function Homestories({ avatar_url, navigation, username, id }) {
  const user = auth.currentUser;
  setTimeout(() => {
    db.collection('users').doc(user.uid).collection('stories').doc(id).delete();
  }, 1000 * 60 * 60 * 24);
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
            url: avatar_url,
            username: username,
          })
        }>
        <Avatar source={{ uri: avatar_url }} rounded size="medium" />
      </TouchableOpacity>
    </View>
  );
}
