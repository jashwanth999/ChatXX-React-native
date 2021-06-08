import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { ListItem, Avatar } from 'react-native-elements';
import { auth, db } from '../../firebase.js';

export default function Groups({
  navigation,
  groupname,
  user,
  id,
  grouppropic,
  lastmessage,
  time,
  createrid,
}) {
  return (
    <View style={{ display: 'flex' }}>
      <ListItem
        bottomDivider
        onPress={() => {
          navigation.navigate('groupmessagescreen', {
            roomid: id,
            propic: grouppropic,
            groupname: groupname,
            createrid: createrid,
          });
        }}>
        <View
          style={{
            borderRadius: 50,
          }}>
          <TouchableOpacity style={{ padding: 2.5 }}>
            <Avatar source={{ uri: grouppropic }} rounded size="medium" />
          </TouchableOpacity>
        </View>
        <ListItem.Content>
          <ListItem.Title style={{ color: '#196F3D', fontWeight: 'bold' }}>
            {groupname}
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
