import React from 'react';
import { View, Text, StatusBar, TouchableOpacity } from 'react-native';
import { Header } from 'react-native-elements';
import {
  MaterialCommunityIcons,
  Ionicons,
  MaterialIcons,
} from '@expo/vector-icons';
import { ListItem, Avatar } from 'react-native-elements';
export default function AccountView() {
  return (
    <View
      style={{
        backgroundColor: 'white',
        width: '94%',
        display: 'flex',
        borderRadius: 6,
        alignItems: 'center',
        margin: 3,
        elevation: 4,
      }}>
      <TouchableOpacity
        style={{
          marginTop: 5,
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <Avatar
          source={{
            uri:
              'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRKnDQEfRU_Yih9NgNLLKHgXsmbNE-Gp8NTBw&usqp=CAU',
          }}
          rounded
          size="medium"
        />
        <Text style={{ color: '#196F3D', fontWeight: 'bold', fontSize: 17 }}>
          {' '}
          Jashwanth Viewed Your Account
        </Text>
      </TouchableOpacity>
    </View>
  );
}
