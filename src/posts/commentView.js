import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Avatar } from '../Story/node_modules/react-native-elements';
import {
  MaterialCommunityIcons,
  Ionicons,
  MaterialIcons,
  AntDesign,
} from '@expo/vector-icons';
import Reply from './reply.js';
export default function CommentView({ comment, navigation, username, propic }) {
  const replies = [
    { reply: 'king' },
    { reply: 'king' },
    { reply: 'king' },
    { reply: 'king' },
  ];
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
        <View style={{ display: 'flex', flexDirection: 'row', width: '65%' }}>
          <TouchableOpacity
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              flex: 1,
            }}
            onPress={() => setlike(!like)}>
            <AntDesign
              name={like ? 'like1' : 'like2'}
              color="black"
              size={18}
              style={{}}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              flex: 1,
            }}
            onPress={() => setlike(!like)}>
            <AntDesign
              name={like ? 'dislike1' : 'dislike2'}
              color="black"
              size={18}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              flex: 1,
            }}>
            <Text style={{ fontSize: 13, opacity: 0.8, fontWeight: 'bold' }}>
              Reply
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
