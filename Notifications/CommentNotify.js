import React from 'react';
import { View, Text, StatusBar, TouchableOpacity } from 'react-native';
import { Header } from 'react-native-elements';
import {
  MaterialCommunityIcons,
  Ionicons,
  MaterialIcons,
} from '@expo/vector-icons';
import { ListItem, Avatar } from 'react-native-elements';
export default function CommentNotify({
  username,
  userid,
  propic,
  id,
  navigation,
  caption,
  photourl,
  mainname,
  mainpropic,
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
          uri: mainpropic,
        }}
        rounded
        size="medium"
      />
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('comments', {
            photoid: id,
            username: username,
            photourl: photourl,
            caption: caption,
            avatarurl: propic,
          })
        }
        style={{
          marginTop: 5,
          display: 'flex',
          flexDirection: 'row',
          width: '86%',
          elevation: 2,
          backgroundColor: '#21B5C3',
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
          {mainname} commented on your post
        </Text>
      </TouchableOpacity>
    </View>
  );
}
