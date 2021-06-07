import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Dimensions, Image } from 'react-native';
import {
  MaterialCommunityIcons,
  Ionicons,
  MaterialIcons,
} from '@expo/vector-icons';
import Icons from 'react-native-vector-icons/MaterialIcons';
import { auth, db } from './firebase.js';
import { Button, Overlay } from 'react-native-elements';
export default function MypostView({ navigation, caption, photourl, id }) {
  const user = auth.currentUser;
  const width = Dimensions.get('window').width;
  const height = Dimensions.get('window').height;
  const [visible, setVisible] = useState(false);
  const toggleOverlay = () => {
    setVisible(!visible);
  };
  const del = () => {
    try {
      db.collection('users').doc(user.uid).collection('image').doc(id).delete();
    } catch (error) {
      alert(error);
    }
  };
  return (
    <View
      style={{
        backgroundColor: '#EDF2F0',
        width: width - 30,
        height: 265,
        elevation: 1,
        borderRadius: 15,
        marginTop: 10,
      }}>
      <Image
        source={{
          uri: photourl,
        }}
        style={{
          width: '100%',
          height: '80%',
          resizeMode: 'cover',
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10,
        }}
      />
      <Text
        style={{
          fontSize: 16,
          fontWeight: 'bold',
          fontStyle: 'italic',
          marginLeft: 10,
        }}>
        {caption}
      </Text>
      <TouchableOpacity
        onPress={toggleOverlay}
        style={{
          position: 'absolute',
          top: 10,
          right: 10,
          zIndex: 1,
          backgroundColor: 'white',
          width: 30,
          height: 30,
          borderRadius: 30,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <MaterialIcons name="more-vert" size={23} color="black" />
      </TouchableOpacity>
      <Overlay isVisible={visible} onBackdropPress={toggleOverlay}>
        <View
          style={{
            width: 150,
            height: 100,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            borderRadius: 10,
            justifyContent: 'center',
          }}>
          <TouchableOpacity style={{ padding: 10 }} onPress={del}>
            <Text
              style={{
                fontSize: 20,
                color: 'red',
              }}>
              Delete
            </Text>
          </TouchableOpacity>
        </View>
      </Overlay>
    </View>
  );
}
