import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import { Header } from '../src/Story/node_modules/react-native-elements';
import Icons from 'react-native-vector-icons/MaterialIcons';
import { Avatar } from '../src/Story/node_modules/react-native-elements';
import { auth, db, storage } from '../auth/firebase.js';
import firebase from '../src/auth/node_modules/@firebase/app';

function Chatcamera({ navigation, route }) {
  const { image, username, roomid, userpropic, imageurl } = route.params;
  const [propic, setPropic] = useState(null);
  const [act, setAct] = useState(false);
  const [baseimage, setbaseimage] = React.useState('');
  const [url, seturl] = useState(null);
  const d = new Date();
  const user = auth.currentUser;
  useEffect(() => {
    try {
      if (user.uid) {
        db.collection('users')
          .doc(user?.uid)
          .onSnapshot((doc) => {
            setPropic(doc.data().propic);
          });
      }
    } catch (error) {
      console.log(error);
    }
  }, []);
  const send = () => {
    setAct(true);

    let apiUrl = 'https://api.cloudinary.com/v1_1/jashwanth/image/upload';

    let data = {
      file: image,
      upload_preset: 'jashwanthclone',
    };

    fetch(apiUrl, {
      body: JSON.stringify(data),
      headers: {
        'content-type': 'application/json',
      },
      method: 'POST',
    }).then(async (r) => {
      let data = await r.json();

      db.collection('users')
        .doc(user.uid)
        .collection('chatusers')
        .doc(roomid)
        .collection('messages')
        .add({
          message: '',
          userid: roomid,
          username: user.displayName,
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
          image: data.secure_url,
        });

      db.collection('users')
        .doc(roomid)
        .collection('chatusers')
        .doc(user.uid)
        .collection('messages')
        .add({
          message: '',
          userid: user.uid,
          username: user.displayName,
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
          image: data.secure_url,
        });

      db.collection('users')
        .doc(user.uid)
        .collection('chatusers')
        .doc(roomid)
        .set({
          userid: roomid,
          username: username,
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
          propic: propic,
          lastmessage: 'image',
          time:
            d.getHours() +
            ':' +
            `${d.getMinutes() < 9 ? '0' + d.getMinutes() : d.getMinutes()}`,
        });
      db.collection('users')
        .doc(roomid)
        .collection('chatusers')
        .doc(user.uid)
        .set({
          userid: user.uid,
          username: user.displayName,
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
          propic: propic,
          lastmessage: 'image',
          time:
            d.getHours() +
            ':' +
            `${d.getMinutes() < 9 ? '0' + d.getMinutes() : d.getMinutes()}`,
        })

        .catch((err) => {
          alert(err);
        });
    });
    setAct(false);
    navigation.navigate('messagescreen', {
      username: username,
      roomid: roomid,
      propic: userpropic,
    });
  };
  return (
    <View style={{ backgroundColor: 'white', height: '100%' }}>
      <Header
        containerStyle={{
          backgroundColor: '#13E6E6',
          borderBottomColor: 'none',
        }}
        placement="left"
        leftComponent={
          <Icons
            onPress={() => navigation.goBack()}
            name={'close'}
            size={24}
            color="white"
            style={{ marginLeft: '3%' }}
          />
        }
      />
      <StatusBar backgroundColor="#13E6E6" />
      {act ? (
        <View
          style={{
            display: 'flex',
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <ActivityIndicator size="small" color="#EA8BA5" />
        </View>
      ) : (
        <View>
          <Image
            source={{ uri: imageurl }}
            style={{ width: 360, height: 600, resizeMode: 'contain' }}
          />
          <TouchableOpacity
            onPress={send}
            style={{ position: 'absolute', bottom: 30, left: 150 }}>
            <View>
              <Avatar
                rounded
                source={{
                  uri: `${userpropic}`,
                }}
                size="large"
              />
            </View>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
export default Chatcamera;
