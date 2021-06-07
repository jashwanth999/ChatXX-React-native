import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Avatar } from '../src/Story/node_modules/react-native-elements';
export default function Mapusers({ avatar_url, username,navigation,userid }) {
  return (
    <View
      style={{
        margin: 10,
        width: 300,
        height: 100,
        backgroundColor: 'white',
        elevation: 1,
        borderRadius: 10,
        flexDirection: 'row',
      }}>
      <TouchableOpacity>
        <Image
          source={{ uri: avatar_url }}
          style={{
            width: 100,
            resizeMode: 'cover',
            borderTopLeftRadius: 10,
            borderBottomLeftRadius: 10,
            height: '100%',
          }}
        />
      </TouchableOpacity>
      <View
        style={{ alignItems: 'center', width: '50%', flexDirection: 'column' }}>
        <Text
          style={{
            fontSize: 20,
            opacity: 0.4,
            fontWeight: 'bold',
            margin: 10,
          }}>
          {username}
        </Text>
        <TouchableOpacity
        onPress={() =>
                navigation.navigate('userprofile', {
                  username: username,
                  userid: userid,
                })
              }
          style={{
          
            margin: 10,
            backgroundColor: '#81E475',
            alignItems: 'center',
            borderRadius: 10,
            elevation: 2,
            width:'80%'
           
          }}>
          <Text
            style={{
              color: 'white',
              fontSize: 16,
              fontWeight: 'bold',
              padding: 7,
            }}>
            View Profile
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
