import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Header } from 'react-native-elements';
import {
  MaterialCommunityIcons,
  Ionicons,
  MaterialIcons,
} from '@expo/vector-icons';
import { ListItem, Avatar } from 'react-native-elements';
import Followrequest from './Followrequest.js';
import Likenotify from './Likenotify.js';
import CommentNotify from './CommentNotify.js';
import Groupaddingnotify from './Groupaddingnotify.js';
import { auth, db } from '../firebase.js';
export default function Notification({ navigation, route }) {
  const user = auth.currentUser;

  const [requestnoty, setrequestnoty] = useState([]);
  const [commentNotify, setcommentnotify] = useState([]);
  const [likenotify, setlikenotify] = useState([]);
  const [groupnotify, setgroupnotify] = useState([]);
  const [len, setlen] = useState([]);

  setImmediate(() => {
    const sub = db
      .collection('users')
      .doc(user.uid)
      .collection('notifications')
      .onSnapshot((snapshot) => {
        snapshot.docs.map((doc) => {
          db.collection('users')
            .doc(user.uid)
            .collection('notifications')
            .doc(doc.id)
            .delete();
        });
      });
    return sub;
  });

  useEffect(() => {
    db.collection('users')
      .doc(user.uid)
      .collection('groupnotifications')

      .onSnapshot((snapshot) => {
        setgroupnotify(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            value: doc.data(),
          }))
        );
      });
  }, [user.uid]);
  useEffect(() => {
    db.collection('users')
      .doc(user.uid)
      .collection('likenotification')
      .where('likerid', '!=', user.uid)
      .onSnapshot((snapshot) => {
        setlikenotify(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            value: doc.data(),
          }))
        );
      });
  }, [user.uid]);
  useEffect(() => {
    db.collection('users')
      .doc(user.uid)
      .collection('follownotification')
      .onSnapshot((snapshot) => {
        setrequestnoty(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            value: doc.data(),
          }))
        );
      });
  }, [user.uid]);
  useEffect(() => {
    db.collection('users')
      .doc(user.uid)
      .collection('commentnotifications')
      .where('userid', '!=', user.uid)
      .onSnapshot((snapshot) => {
        setcommentnotify(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            value: doc.data(),
          }))
        );
      });
  }, [user.uid]);

  return (
    <View style={{ flex: 1, backgroundColor: 'white',  }}>
      <Header
        containerStyle={{
          backgroundColor: '#13E6E6',
          borderBottomColor: 'none',
        }}
        centerComponent={{
          text: 'Notification',
          style: { color: 'white', fontSize: 20 },
        }}
      />
      <StatusBar backgroundColor="#13E6E6" />
      <ScrollView contentContainerStyle={{ alignItems: 'center' }}>
        {requestnoty.map(({ id, value }) => (
          <Followrequest
            key={id}
            id={id}
            accept={value.accept}
            reject={value.reject}
            username={value.followername}
            userid={value.followerid}
            navigation={navigation}
          />
        ))}
        {commentNotify.map(({ id, value }) => (
          <CommentNotify
            key={id}
            id={value.photoid}
            username={value.uploadername}
            userid={value.userid}
            comment={value.comment}
            propic={value.uploaderpropic}
            navigation={navigation}
            photourl={value.photourl}
            caption={value.caption}
            mainname={value.username}
            mainpropic={value.propic}
          />
        ))}
        {groupnotify.map(({ id, value }) => (
          <Groupaddingnotify
            key={id}
            id={id}
            username={value.addername}
            adderid={value.adderid}
            groupid={value.groupid}
            propic={value.adderpropic}
            navigation={navigation}
            groupname={value.groupname}
            grouppropic={value.grouppropic}
          />
        ))}
        {likenotify.map(({ id, value }) => (
          <Likenotify
            key={id}
            id={id}
            username={value.likername}
            adderid={value.likerid}
            propic={value.likerpropic}
            navigation={navigation}
          />
        ))}
      </ScrollView>
    </View>
  );
}
