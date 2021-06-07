import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { ListItem, Avatar } from 'react-native-elements';
import { auth, db } from '../firebase.js';

export default function Chatusers({
  navigation,
  username,
  user,
  userid,
  userpropic,
  lastmessage,
  time,
}) {
  const [lastchatmessage, setmessage] = useState('');
  /*if(lastmessage.length>15)
{
  setmessage(lastmessage.slice(0,14)+"....")
}
else{
  set(lastmessage)
}*/

  return (
    <View style={{ display: 'flex' }}>
      <ListItem
        bottomDivider
        onPress={() =>
          navigation.navigate('messagescreen', {
            username: username,
            roomid: userid,
            propic: userpropic,
          })
        }>
        <View
          style={{
            borderRadius: 50,
          }}>
          <TouchableOpacity
            style={{ padding: 2.5 }}
            onPress={() =>
              navigation.navigate('homeview', { url: userpropic })
            }>
            <Avatar source={{ uri: userpropic }} rounded size="medium" />
          </TouchableOpacity>
        </View>
        <ListItem.Content>
          <ListItem.Title style={{ color: '#196F3D', fontWeight: 'bold' }}>
            {username}
          </ListItem.Title>
          <ListItem.Subtitle>
            {lastmessage
              ? lastmessage?.length < 25
                ? lastmessage
                : lastmessage?.slice(0, 25) + '.......'
              : ''}
          </ListItem.Subtitle>
        </ListItem.Content>
        <Text style={{ opacity: 0.6, fontSize: 12 }}>{time}</Text>
      </ListItem>
    </View>
  );
}
