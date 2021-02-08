import React from 'react';
import { View, Text, StatusBar, TouchableOpacity } from 'react-native';
import { Header } from '../src/Story/node_modules/react-native-elements';
import {
  MaterialCommunityIcons,
  Ionicons,
  MaterialIcons,
} from '@expo/vector-icons';
import { ListItem, Avatar } from '../src/Story/node_modules/react-native-elements';
export default function Groupaddingnotify({
  username,
  propic,
  groupid,
  id,
  groupname,
  navigation,
  adderid,
  grouppropic,
}) {
  return (
    <View
      style={{
        display: 'flex',
        margin: 3,
        flexDirection: 'row',
      }}>
      <Avatar
        source={{
          uri: propic,
        }}
        rounded
        size="medium"
      />
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('groupmessagescreen', {
            groupname: groupname,
            roomid: groupid,
            createrid: adderid,
            propic: grouppropic,
          })
        }
        style={{
          marginTop: 5,
          display: 'flex',
          flexDirection: 'row',
          width: '86%',
          elevation: 2,
          backgroundColor: '#21C37D',
          borderRadius: 10,
          borderTopLeftRadius: 0,
        }}>
        <Text
          style={{
            color: 'white',
            fontWeight: 'bold',
            fontSize: 17,
            flexWrap: 'wrap',
            padding: 7,
          }}>
          {' '}
          {username} added you in {groupname}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
