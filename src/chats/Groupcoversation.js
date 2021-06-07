import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
  TouchableHighlight,
} from 'react-native';
import {
  MaterialCommunityIcons,
  Ionicons,
  MaterialIcons,
} from '@expo/vector-icons';
import * as Speech from 'expo-speech';
import { db } from '../auth/firebase.js';
export default function Groupconversation({
  id,
  message,
  user,
  username,
  chatimageurl,
  navigation,
}) {
  const [micon, setmicon] = useState(false);

  const speak = () => {
    Speech.speak(message, { onDone: () => setmicon(false) });
    setmicon(true);
  };
  const micstop = () => {
    Speech.stop();
    setmicon(false);
  };
  const color = [
    '#068ACA',
    'red',
    '#06B848',
    '#06B848',
    '#06B883',
    '#F65906',
    '#F6C306',
    '#A7F606',
    '#061AF6',
    '#F60685',
  ];

  return (
    <View style={{ marginTop: 3 }}>
      {username == user.displayName ? (
        chatimageurl ? (
          <View
            style={{
              display: 'flex',
              flexDirection: 'row-reverse',
              marginLeft: 6,
            }}>
            <View
              style={{
                height: 'auto',
                backgroundColor: '#B9EEEE',
                borderWidth: 0.3,
                borderColor: 'white',
                borderRadius: 9,
                elevation: 4,
                borderTopRightRadius: 0,
                margin: 2,
              }}>
              <View></View>
              <Image
                source={{ uri: chatimageurl }}
                style={{ width: 200, height: 200, resizeMode: 'contain' }}
              />
            </View>
          </View>
        ) : (
          <View
            style={{
              display: 'flex',
              flexDirection: 'row-reverse',
              marginLeft: 6,
            }}>
            <View
              style={{
                height: 'auto',
                backgroundColor: '#B9EEEE',
                borderWidth: 0.3,
                borderColor: 'white',
                borderRadius: 9,
                elevation: 4,
                borderTopRightRadius: 0,
                margin: 2,
                maxWidth: 280,
                minWidth: 40,
              }}>
              <View></View>

              <Text style={{ fontSize: 15, padding: 7 }}>{message}</Text>
            </View>
            <TouchableOpacity>
              <Ionicons
                name={micon ? 'ios-stop' : 'ios-mic-sharp'}
                color="red"
                size={23}
                onPress={micon ? micstop : speak}
              />
            </TouchableOpacity>
          </View>
        )
      ) : chatimageurl ? (
        <View style={{ display: 'flex', flexDirection: 'row', marginLeft: 6 }}>
          <View></View>
          <View
            style={{
              height: 'auto',
              backgroundColor: 'white',
              borderWidth: 0.3,
              borderColor: 'white',
              borderRadius: 9,
              elevation: 4,
              borderTopLeftRadius: 0,
              margin: 2,
            }}>
            <Image
              source={{ uri: chatimageurl }}
              style={{ width: 200, height: 200, resizeMode: 'contain' }}
            />
          </View>
        </View>
      ) : (
        <View style={{ display: 'flex', flexDirection: 'row', marginLeft: 6 }}>
          <View></View>

          <View
            style={{
              height: 'auto',
              backgroundColor: 'white',
              borderWidth: 0.3,
              borderColor: 'white',
              borderRadius: 9,
              elevation: 4,
              borderTopLeftRadius: 0,
              margin: 2,
              maxWidth: 280,
            }}>
            <View style={{ display: 'flex', flexDirection: 'column' }}>
              <Text
                style={{
                  fontSize: 13,
                  padding: 6,
                  paddingBottom: 0,
                  fontWeight: 'bold',
                  color: color[Math.floor(Math.random() * (color.length - 1))],
                }}>
                {username}
              </Text>
              <Text style={{ fontSize: 15, padding: 6, paddingTop: 0 }}>
                {message}
              </Text>
            </View>
          </View>
          <TouchableOpacity>
            <Ionicons
              name={micon ? 'ios-stop' : 'ios-mic-sharp'}
              color="red"
              size={23}
              onPress={micon ? micstop : speak}
            />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
