import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StatusBar,
  TextInput,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Header } from '../src/Story/node_modules/react-native-elements';
import {
  MaterialCommunityIcons,
  Ionicons,
  MaterialIcons,
} from '@expo/vector-icons';
import { auth, db } from '../auth/firebase.js';
import Coversation from './Conversation.js';
import firebase from '../src/auth/node_modules/@firebase/app';
import { Avatar } from '../src/Story/node_modules/react-native-elements';
import * as ImagePicker from '../src/styles/node_modules/expo-image-picker';
import * as Speech from 'expo-speech';
import { Button, Overlay } from '../src/Story/node_modules/react-native-elements';
import { Dimensions, Keyboard } from 'react-native';

export default function Messagescreen({ route, navigation }) {
  const { username, roomid, propic, msgusage, msgid } = route.params;
  const user = auth.currentUser;
  const width = Dimensions.get('window').width;
  const height = Dimensions.get('window').height;

  const d = new Date();
  const [chat, setChat] = useState('');
  const [chats, setChats] = useState([]);
  const [chatoptions, setchatoptions] = useState(false);
  const [visible, setVisible] = useState(false);
  const [presentuser, setPresentuser] = useState([]);
  const [userdata, setuserdata] = useState([]);
  // const [scrollviewref, setscrollviewref] = useState('');
  useEffect(() => {
    db.collection('users')
      .doc(user.uid)
      .onSnapshot((doc) => {
        setPresentuser(doc.data());
      });
  }, [user.uid]);
  const scrollViewRef = useRef();

  useEffect(() => {
    db.collection('users')
      .doc(roomid)
      .onSnapshot((doc) => {
        setuserdata(doc.data());
      });
  }, [roomid]);

  const toggleOverlay = () => {
    setVisible(!visible);
  };

  let deletemsgusage = msgusage;
  const pickImage2 = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [5, 4],
      quality: 1,
      base64: true,
    });

    if (!result.cancelled) {
      let base64Img = `data:image/jpg;base64,${result.base64}`;

      navigation.navigate('Chatcamera', {
        image: base64Img,
        username: username,
        roomid: roomid,
        userpropic: propic,
        imageurl: result.uri,
      });
    }
  };

  const send = () => {
    db.collection('users')
      .doc(user.uid)
      .collection('chatusers')
      .doc(roomid)
      .set({
        userid: roomid,
        username: username,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        propic: propic,
        lastmessage: chat,
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
        lastmessage: chat,
        time:
          d.getHours() +
          ':' +
          `${d.getMinutes() < 9 ? '0' + d.getMinutes() : d.getMinutes()}`,
      });
    db.collection('users')
      .doc(user.uid)
      .collection('chatusers')
      .doc(roomid)

      .collection('messages')
      .add({
        message: chat,
        userid: roomid,
        username: user.displayName,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        image: '',
      });

    db.collection('users')
      .doc(roomid)
      .collection('chatusers')
      .doc(user.uid)

      .collection('messages')
      .add({
        message: chat,
        userid: user.uid,
        username: user.displayName,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        image: '',
      });
    Keyboard.dismiss();
    setChat('');
  };
  useEffect(() => {
    try {
      if (roomid) {
        db.collection('users')
          .doc(user.uid)
          .collection('chatusers')
          .doc(roomid)

          .collection('messages')
          .orderBy('timestamp', 'asc')
          .onSnapshot((snapshot) => {
            setChats(
              snapshot.docs.map((doc) => ({
                id: doc.id,
                chats: doc.data(),
              }))
            );
          });
      }
    } catch (err) {
      console.log(err);
    }
  }, [roomid, user.uid]);
  const deletemsg = () => {
    db.collection('users')
      .doc(user.uid)
      .collection('chatusers')
      .doc(roomid)
      .collection('messages')
      .doc(msgid)
      .delete();
    db.collection('users')
      .doc(roomid)
      .collection('chatusers')
      .doc(user.uid)
      .collection('messages')
      .doc(msgid)
      .delete();
    deletemsgusage = false;
  };
  const clearchat = () => {
    for (let i = 0; i < chats.length; i++) {
      db.collection('users')
        .doc(user.uid)
        .collection('chatusers')
        .doc(roomid)
        .collection('messages')
        .doc(chats[i].id)
        .delete();
      db.collection('users')
        .doc(roomid)
        .collection('chatusers')
        .doc(user.uid)
        .collection('messages')
        .doc(chats[i].id)
        .delete();
    }

    toggleOverlay();
  };

  const scrollref = () => {
    //setscrollviewref(chat[chats.length - 1].chats.message);
  };
  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: '#FCF3CF' }}>
      {deletemsgusage && msgusage ? (
        <Header
          containerStyle={{
            backgroundColor: '#13E6E6',
            borderBottomColor: 'none',
          }}
          leftComponent={
            <Ionicons
              name="arrow-back"
              color="white"
              size={28}
              onPress={() =>
                navigation.navigate('messagescreen', { msgusage: false })
              }
            />
          }
          rightComponent={
            <MaterialCommunityIcons
              name="delete"
              color="white"
              size={28}
              onPress={deletemsg}
            />
          }
        />
      ) : (
        <Header
          containerStyle={{
            backgroundColor: '#13E6E6',
            borderBottomColor: 'none',
          }}
          leftComponent={
            <Ionicons
              name="arrow-back"
              color="white"
              size={28}
              onPress={() => {
                navigation.goBack();
                Speech.stop();
              }}
            />
          }
          centerComponent={
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('userprofile', {
                  username: username,
                  userid: roomid,
                })
              }
              style={{ display: 'flex', flexDirection: 'row' }}>
              <Avatar
                rounded
                source={{
                  uri: userdata.propic,
                }}
              />
              <Text style={{ fontSize: 20, marginLeft: 10, color: 'white' }}>
                {username}
              </Text>
            </TouchableOpacity>
          }
          rightComponent={
            <Ionicons
              name="ellipsis-vertical"
              color="white"
              size={22}
              onPress={toggleOverlay}
            />
          }
        />
      )}

      <StatusBar backgroundColor="#13E6E6" />
      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: '#FCF3CF' }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        enabled>
        <View style={{ height: height - 128 }}>
          <ScrollView
            ref={scrollViewRef}
            onContentSizeChange={() =>
              scrollViewRef.current.scrollToEnd({ animated: true })
            }>
            {chats.map(({ id, chats }) => (
              <Coversation
                key={id}
                id={id}
                message={chats.message}
                user={user}
                username={chats.username}
                roomid={roomid}
                chatimageurl={chats.image}
                navigation={navigation}
              />
            ))}
          </ScrollView>
        </View>

        <View style={{ position: 'absolute', bottom: 0 }}>
          <View style={{ display: 'flex', flexDirection: 'row', flex: 1 }}>
            <View
              style={{
                backgroundColor: 'white',
                height: 40,
                borderRadius: 20,
                width: '86%',
                padding: 5,
                margin: 2,
                justifyContent: 'center',
                alignContent: 'center',
              }}>
              <TextInput
                style={{
                  height: 42,
                  outline: 'none',
                  marginLeft: 6,
                  width: '86%',
                  color: 'black',
                  fontSize: 18,
                }}
                placeholder="Type Something...."
                value={chat}
                onChangeText={(chat) => setChat(chat)}
              />
            </View>
            <View
              style={{
                width: 40,
                height: 40,
                alignContent: 'center',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 50,
                backgroundColor: '#24a0ed',
                margin: 3,
              }}>
              <Ionicons
                name={chat ? 'send' : 'camera'}
                color="white"
                size={28}
                onPress={chat ? send : pickImage2}
              />
            </View>
          </View>
        </View>
        <Overlay isVisible={visible} onBackdropPress={toggleOverlay}>
          <View
            style={{
              width: 200,
              height: 190,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('userprofile', {
                  username: username,
                  userid: roomid,
                });
                toggleOverlay();
              }}
              style={{
                margin: 10,
                flex: 0.3,
              }}>
              <Text style={{ fontSize: 20 }}>View Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ margin: 10, flex: 0.3 }}
              onPress={clearchat}>
              <Text style={{ fontSize: 20 }}>Clear Chat</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ margin: 10, flex: 0.3 }}>
              <Text style={{ fontSize: 20, color: 'red' }}>Block</Text>
            </TouchableOpacity>
          </View>
        </Overlay>
      </KeyboardAvoidingView>
    </KeyboardAvoidingView>
  );
}
