import React, { useState, useEffect } from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  Button,
  Text,
  ActivityIndicator,
} from 'react-native';
import { ListItem, Avatar } from 'react-native-elements';
import { auth, db } from './firebase.js';
import firebase from '@firebase/app';
function Shareusers({ username, roomid, navigation, propic, imageurl }) {
  const user = auth.currentUser;
  const [image, setImage] = useState(null);
  const [sent, setSent] = useState(false);
  const [video, setvideo] = useState(null);
  const [act, setact] = useState(false);
  const [presentuser, setPresentuser] = useState([]);
  const d = new Date();

  useEffect(() => {
    db.collection('users')
      .doc(user.uid)
      .onSnapshot((doc) => {
        setPresentuser(doc.data());
      });
  }, [user.uid]);
  const send = () => {
    setact(true);

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
        image: imageurl,
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
        image: imageurl,
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
        propic: presentuser.propic,
        lastmessage: 'image',
        time:
          d.getHours() +
          ':' +
          `${d.getMinutes() < 9 ? '0' + d.getMinutes() : d.getMinutes()}`,
      })
      .then(() => {
        setact(false);
        setSent(true);
      });
  };

  return (
    <View style={{ backgroundColor: 'white' }}>
      <ListItem bottomDivider containerStyle={{ backgroundColor: 'white' }}>
        <Avatar
          size="medium"
          rounded
          source={{
            uri: `${propic}`,
          }}
        />
        <ListItem.Content>
          <ListItem.Title
            style={{ color: 'black', fontSize: 17, marginLeft: 10 }}
            onPress={() =>
              navigation.navigate('messagescreen', {
                roomid: roomid,
                username: username,
                propic: propic,
              })
            }>
            {username}
          </ListItem.Title>
        </ListItem.Content>
        {!sent ? (
          act ? (
            <TouchableOpacity>
              <View
                style={{
                  width: 60,
                  borderRadius: 5,
                  backgroundColor: '#24a0ed',
                  height: 25,
                  alignContent: 'center',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <ActivityIndicator size="small" color="white" />
              </View>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={send}>
              <View
                style={{
                  width: 60,
                  borderRadius: 5,
                  backgroundColor: '#24a0ed',
                  height: 25,
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    color: 'white',
                    fontSize: 17,
                  }}>
                  {' '}
                  send
                </Text>
              </View>
            </TouchableOpacity>
          )
        ) : (
          <View
            style={{
              width: 60,
              borderRadius: 5,
              backgroundColor: '#383838',
              height: 25,
              alignItems: 'center',
            }}>
            <Text
              style={{
                color: 'white',
                fontSize: 17,
              }}>
              {' '}
              sent
            </Text>
          </View>
        )}
      </ListItem>
    </View>
  );
}
export default Shareusers;
