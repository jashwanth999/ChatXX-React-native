import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
  TouchableHighlight,
  ActivityIndicator,
} from 'react-native';
import {
  MaterialCommunityIcons,
  Ionicons,
  MaterialIcons,
} from '@expo/vector-icons';
import * as Speech from 'expo-speech';
import { db } from '../firebase.js';
export default function Conversation({
  id,
  message,
  user,
  username,
  chatimageurl,
  navigation,
  roomid,
}) {
  const [msgusage, setmsgusage] = useState(false);

  const [micon, setmicon] = useState(false);

  const speak = () => {

    Speech.speak(message, { onDone: () => setmicon(false) });
    setmicon(true);
  };
  const micstop = () => {
    Speech.stop();
    setmicon(false);
  };

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
            {chatimageurl ? (
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
            ) : (
              <View
                style={{
                  height: 200,
                  backgroundColor: 'white',
                  borderWidth: 0.3,
                  borderColor: 'white',
                  borderRadius: 9,
                  elevation: 4,
                  borderTopRightRadius: 0,
                  margin: 2,
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 200,
                }}>
                <View></View>
                <ActivityIndicator size="small" color="black" />
              </View>
            )}
          </View>
        ) : msgusage ? (
          <TouchableOpacity
            onPress={() => {
              setmsgusage(false);

              navigation.navigate('messagescreen', {
                msgusage: false,
                msgid: id,
              });
            }}
            style={{
              display: 'flex',
              flexDirection: 'row-reverse',
              marginLeft: 6,
              backgroundColor: '#B9EEEE',
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
              }}>
              <View></View>
              <Text style={{ fontSize: 17, padding: 6 }}>{message}</Text>
            </View>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={{
              display: 'flex',
              flexDirection: 'row-reverse',
              marginLeft: 6,
            }}>
            <TouchableOpacity
              onLongPress={() => {
                setmsgusage(true);
                navigation.navigate('messagescreen', {
                  msgusage: true,
                  msgid: id,
                });
              }}
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
              }}>
              <View></View>
              <Text style={{ fontSize: 17, padding: 6 }}>{message}</Text>
            </TouchableOpacity>

            <TouchableOpacity>
              <Ionicons
                name={micon ? 'ios-stop' : 'ios-mic-sharp'}
                color="red"
                size={23}
                onPress={micon ? micstop : speak}
              />
            </TouchableOpacity>
          </TouchableOpacity>
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
            <Text style={{ fontSize: 17, padding: 6 }}>{message}</Text>
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
