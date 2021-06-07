import React, { useState, useEffect } from 'react';
import { View, Text, Image, StatusBar } from 'react-native';
import {
  MaterialCommunityIcons,
} from '@expo/vector-icons';
import {  Avatar } from 'react-native-elements';
import { ProgressBar, Colors } from 'react-native-paper';
export default function HomeView({ navigation, route }) {
  const { url, username,userspropic } = route.params;
  const [progress, setprogress] = useState(0);
  setTimeout(() => {
    navigation.navigate('Chats');
    setprogress(progress * 0.1);
  }, 3000);

  return (
    <View style={{ flex: 1 }}>
      <StatusBar hidden />
      <ProgressBar
        progress={progress}
        color={Colors.grey800}
        style={{ zIndex: 1 }}
      />
      <View
        style={{
          zIndex: 1,
          position: 'absolute',
          top: 20,
          display: 'flex',
          flexDirection: 'row',
          flex: 1,
          margin: 5,
          alignItems: 'center',
        }}>
        <View
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'row',
            alignContent: 'center',
            alignItems: 'center',
          }}>
          <Avatar
            source={{
              uri: userspropic,
            }}
            rounded
            size="medium"
          />
          <Text
            style={{
              fontSize: 20,
              color: 'white',
              marginLeft: 5,
              fontWeight: 'bold',
            }}>
            {username}
          </Text>
        </View>

        <MaterialCommunityIcons
          name="close"
          color="white"
          size={30}
          onPress={() => navigation.goBack()}
        />
      </View>

      <Image source={{ uri: url }} style={{ flex: 1, resizeMode: 'cover' }} />
    </View>
  );
}
