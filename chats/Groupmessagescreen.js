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
  Dimensions,
  Keyboard,
} from 'react-native';
import { Header } from 'react-native-elements';
import {
  MaterialCommunityIcons,
  Ionicons,
  MaterialIcons,
  AntDesign,
} from '@expo/vector-icons';
import { auth, db } from '../firebase.js';
import Coversation from './Conversation.js';
import firebase from '@firebase/app';
import { Avatar } from 'react-native-elements';
import * as ImagePicker from 'expo-image-picker';
import * as Speech from 'expo-speech';
import { Button, Overlay } from 'react-native-elements';
import { BottomSheet } from 'react-native-btr';
import AsyncStorage from '@react-native-async-storage/async-storage'
import Groupusers from './GroupUsers.js';
import Groupconversation from './Groupcoversation';
export default function Groupmessagescreen({ route, navigation }) {
  const {
    groupname,
    roomid,
    propic,
    msgusage,
    msgid,
    createrid,
  } = route.params;
  const width = Dimensions.get('window').width;
  const height = Dimensions.get('window').height;
  const scrollViewRef = useRef();
  const user = auth.currentUser;
  const d = new Date();
  const [chat, setChat] = useState('');
  const [chats, setChats] = useState([]);
  const [chatoptions, setchatoptions] = useState(false);
  const [visible, setVisible] = useState(false);
  const [presentuser, setPresentuser] = useState([]);
  const [userdata, setuserdata] = useState([]);
  const [users, setUsers] = useState([]);
  const [bottomvisible, setbottom] = useState(false);
  const [groupusers, setgroupusers] = useState([]);

  useEffect(() => {
    db.collection('users')
      .doc(createrid)
      .collection('groups')
      .doc(roomid)
      .collection('groupusers')
      .onSnapshot((snapshot) => {
        setgroupusers(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            users: doc.data(),
          }))
        );
      });
  }, [user.uid]);

  useEffect(() => {
    db.collection('users')
      .doc(user.uid)
      .collection('chatusers')
      .where('userid', '!=', createrid)
      .onSnapshot((snapshot) => {
        setUsers(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            users: doc.data(),
          }))
        );
      });
  }, [user.uid]);
  const toggleBottomNavigationView = () => {
    setVisible(!visible);
  };
  const [isvisible, setisVisible] = useState(false);

  const toggleOverlay = () => {
    setisVisible(!isvisible);
  };
  useEffect(() => {
    db.collection('users')
      .doc(user.uid)
      .onSnapshot((doc) => {
        setPresentuser(doc.data());
      });
  }, [user.uid]);

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
      await AsyncStorage.setItem('message', "true")
      navigation.navigate('Groupchatcamera', {
        image: base64Img,
        groupname: groupname,
        roomid: roomid,
        grouppropic: propic,
        imageurl: result.uri,
        createrid: createrid,
      });
    }
  };

  const deletemsg = () => {
    db.collection('users')
      .doc(user.uid)
      .collection('following')
      .doc(roomid)
      .collection('chatmessages')
      .doc(roomid)
      .collection('messages')
      .doc(msgid)
      .delete();
    db.collection('users')
      .doc(roomid)
      .collection('following')
      .doc(user.uid)
      .collection('chatmessages')
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
        .collection('following')
        .doc(roomid)
        .collection('chatmessages')
        .doc(roomid)
        .collection('messages')
        .doc(chats[i].id)
        .delete();
      db.collection('users')
        .doc(roomid)
        .collection('following')
        .doc(user.uid)
        .collection('chatmessages')
        .doc(user.uid)
        .collection('messages')
        .doc(chats[i].id)
        .delete();
    }

    toggleOverlay();
  };

  useEffect(() => {
    try {
      if (roomid) {
        db.collection('users')
          .doc(user.uid)
          .collection('groups')
          .doc(roomid)
          .collection('groupmessages')
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
  const send = async() => {
    for (let i = 0; i < groupusers.length; i++) {
      db.collection('users')
        .doc(groupusers[i].id)
        .collection('groups')
        .doc(roomid)
        .collection('groupmessages')
        .add({
          message: chat,
          userid: user.uid,
          username: user.displayName,
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
          image: '',
        });
      db.collection('users')
        .doc(groupusers[i].id)
        .collection('groups')
        .doc(roomid)
        .set({
          createdby: user.displayName,
          groupname: groupname,
          grouppropic:
            'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSgluD1vIXiS3No5NwPY5WV23nHLnJzvMKApA&usqp=CAU',
          timestamp: new Date(),
          createrid: createrid,
          time:
            d.getHours() +
            ':' +
            `${d.getMinutes() < 9 ? '0' + d.getMinutes() : d.getMinutes()}`,
          lastmessage: chat,
        });
    }

    db.collection('users')
      .doc(createrid)
      .collection('groups')
      .doc(roomid)
      .collection('groupmessages')
      .add({
        message: chat,
        userid: roomid,
        username: user.displayName,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        image: '',
      });

    db.collection('users')
      .doc(createrid)
      .collection('groups')
      .doc(roomid)
      .set({
        createdby: user.displayName,
        groupname: groupname,
        grouppropic:
          'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSgluD1vIXiS3No5NwPY5WV23nHLnJzvMKApA&usqp=CAU',
        createrid: createrid,
        timestamp: new Date(),
        lastmessage: chat,
        time:
          d.getHours() +
          ':' +
          `${d.getMinutes() < 9 ? '0' + d.getMinutes() : d.getMinutes()}`,
      });
      await AsyncStorage.setItem('message', "true")
    setChat('');
    Keyboard.dismiss();
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#FCF3CF' }}>
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
            style={{ display: 'flex', flexDirection: 'row' }}
            onPress={() =>
              navigation.navigate('Grouplist', {
                createrid: createrid,
                roomid: roomid,
              })
            }>
            <Avatar
              rounded
              source={{
                uri: propic,
              }}
            />
            <Text style={{ fontSize: 20, marginLeft: 10, color: 'white' }}>
              {groupname}
            </Text>
          </TouchableOpacity>
        }
        rightComponent={
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <AntDesign
              name="addusergroup"
              color="white"
              size={25}
              onPress={toggleBottomNavigationView}
              style={{ marginRight: 5 }}
            />
            <Ionicons
              name="ellipsis-vertical"
              color="white"
              size={22}
              onPress={toggleOverlay}
            />
          </View>
        }
      />

      <StatusBar backgroundColor="#13E6E6" />
      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: '#FCF3CF' }}
        behavior={Platform.OS === 'ios' ? 'padding' : null}
        enabled>
        <View>
          <ScrollView
            style={{ height: height - 128 }}
            ref={scrollViewRef}
            onContentSizeChange={() =>
              scrollViewRef.current.scrollToEnd({ animated: true })
            }>
            {chats.map(({ id, chats }) => (
              <Groupconversation
                key={id}
                id={id}
                message={chats.message}
                user={user}
                username={chats.username}
                roomid={roomid}
                chatimageurl={chats.image}
                navigation={navigation}
                isadded={chats.isadded}
              />
            ))}
          </ScrollView>
        </View>

        <View style={{ position: 'absolute', bottom: 0, flex: 1 }}>
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
        <Overlay isVisible={isvisible} onBackdropPress={toggleOverlay}>
          <View
            style={{
              width: 200,
              height: 190,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}>
            <TouchableOpacity
              style={{
                margin: 10,
                flex: 0.3,
              }}>
              <Text style={{ fontSize: 20 }}>View Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ margin: 10, flex: 0.3 }}>
              <Text style={{ fontSize: 20 }}>Clear Chat</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ margin: 10, flex: 0.3 }}>
              <Text style={{ fontSize: 20, color: 'red' }}>Block</Text>
            </TouchableOpacity>
          </View>
        </Overlay>
      </KeyboardAvoidingView>
      <BottomSheet
        visible={visible}
        onBackButtonPress={toggleBottomNavigationView}
        onBackdropPress={toggleBottomNavigationView}>
        <View
          style={{
            width: '100%',
            height: 400,
            backgroundColor: 'white',
            borderRadius: 25,
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
          }}>
          <TouchableOpacity
            onPress={() => setisVisible(false)}
            style={{ width: '100%', alignItems: 'center' }}>
            <View
              style={{
                width: 50,
                height: 5,
                backgroundColor: '#13E6E6',
                borderRadius: 15,
              }}></View>
          </TouchableOpacity>
          <View style={{ marginTop: 10 }}>
            <ScrollView style={{ height: 390 }}>
              {users.map(({ id, users }) => (
                <Groupusers
                  key={id}
                  roomid={id}
                  username={users.username}
                  navigation={navigation}
                  user={user}
                  propic={users.propic}
                  userid={users.userid}
                  groupid={roomid}
                  groupname={groupname}
                  grouppropic={propic}
                  createrid={createrid}
                />
              ))}
            </ScrollView>
          </View>
        </View>
      </BottomSheet>
    </View>
  );
}
