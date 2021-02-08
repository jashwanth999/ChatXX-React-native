import React from 'react';
import { View, Text, StatusBar, TouchableOpacity } from 'react-native';
import { Header } from '../src/Story/node_modules/react-native-elements';
import {
  MaterialCommunityIcons,
  Ionicons,
  MaterialIcons,
} from '@expo/vector-icons';
import { ListItem, Avatar } from '../src/Story/node_modules/react-native-elements';
export default function Likenotify({ propic, username }) {
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
        style={{
          marginTop: 5,
          display: 'flex',
          flexDirection: 'row',
          width: '86%',
          elevation: 2,
          backgroundColor: '#D26583',
          borderRadius: 15,
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
          {username} Liked Your Post
        </Text>
      </TouchableOpacity>
    </View>
  );
}
