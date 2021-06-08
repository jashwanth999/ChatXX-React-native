import React from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import { ListItem, Avatar } from 'react-native-elements';
import { auth } from '../firebase.js';
function Groupchatusers({ username, id, navigation, propic }) {
  const user = auth.currentUser;

  return (
    <View style={{ backgroundColor: 'white' }}>
      <ListItem
        containerStyle={{ backgroundColor: 'white' }}
        onPress={() =>
          navigation.navigate('userprofile', {
            userid: id,
            username: username,
            propic: propic,
          })
        }>
        <Avatar
          size="medium"
          rounded
          source={{
            uri: `${propic}`,
          }}
        />
        <ListItem.Content>
          <ListItem.Title style={{ color: 'black' }}>{username}</ListItem.Title>
        </ListItem.Content>
      </ListItem>
    </View>
  );
}
export default Groupchatusers;
