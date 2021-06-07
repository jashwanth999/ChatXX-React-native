import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Avatar } from 'react-native-elements';
import {
  MaterialCommunityIcons,
  Ionicons,
  MaterialIcons,
  AntDesign,
} from '@expo/vector-icons';
import Reply from './reply.js';
export default function CommentView({ comment, navigation, username, propic }) {
  const [like, setlike] = useState(false);
  return (
    <View
      style={{
        display: 'flex',
        flexDirection: 'row',
        marginBottom: 5,
      }}>
      <Avatar
        source={{
          uri: propic,
        }}
        rounded
      />
      <View style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
        <View
          style={{
            display: 'flex',
            flexDirection: 'column',
            maxWidth: '65%',
            elevation: 1,
            backgroundColor: '#E2E5E8',
            width: 'auto',
            borderRadius: 10,
            marginLeft: 5,
            minWidth: '25%',
            borderTopLeftRadius: 0,
          }}>
          <Text style={{ padding: 2, fontWeight: 'bold' }}>{username}</Text>
          <Text
            style={{
              opacity: 0.6,
              fontSize: 13,
              fontWeight: 'bold',
              padding: 4,
            }}>
            {comment}
          </Text>
        </View>
      </View>
    </View>
  );
}
