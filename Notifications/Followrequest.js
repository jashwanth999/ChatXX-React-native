import React, { useState, useEffect } from 'react';
import { View, Text, StatusBar, TouchableOpacity } from 'react-native';
import { Header } from 'react-native-elements';
import {
  MaterialCommunityIcons,
  Ionicons,
  MaterialIcons,
} from '@expo/vector-icons';
import { ListItem, Avatar } from 'react-native-elements';
import { db, auth } from '../firebase.js';
export default function Followrequest({
  username,
  id,
  userid,
  accept,
  reject,
}) {
  const [rejectstatus, setrejectstatuts] = useState(true);
  const [acceptstatus, setacceptstatuts] = useState(false);
  const [presentuser, setPresentuser] = useState([]);
  useEffect(() => {
    db.collection('users')
      .doc(userid)
      .onSnapshot((doc) => {
        setPresentuser(doc.data());
      });
  }, []);
  const user = auth.currentUser;
  const sendaccept = () => {
    setacceptstatuts(true);
    db.collection('users')
      .doc(user.uid)
      .collection('follownotification')
      .doc(userid)
      .update({
        request: false,
        accept: true,
        reject: false,
      });
    db.collection('users')
      .doc(userid)
      .collection('following')
      .doc(user.uid)
      .set({
        followingid: user.uid,
        followingname: user.displayName,
        isfollowing: true,
      });

    db.collection('users')
      .doc(user.uid)
      .collection('isfollowingupdate')
      .doc(userid)
      .set({
        isfollowing: true,
      });
  };
  const sendreject = () => {
    setrejectstatuts(false);
    db.collection('users')
      .doc(user.uid)
      .collection('follownotification')
      .doc(userid)
      .update({
        request: true,
        accept: false,
        reject: true,
      });

    db.collection('users')
      .doc(user.uid)
      .collection('isfollowingupdate')
      .doc(userid)
      .set({
        isfollowing: false,
      });
    db.collection('users')
      .doc(userid)
      .collection('following')
      .doc(user.uid)
      .set({
        followingid: user.uid,
        followingname: user.displayName,
        isfollowing: false,
      });
  };
  const nothing = () => {
    db.collection('users')
      .doc(user.uid)
      .collection('follownotification')
      .doc(userid)
      .update({
        reject: false,
      });
  };
  const deletenoty = () => {
    db.collection('users')
      .doc(user.uid)
      .collection('follownotification')
      .doc(id)
      .delete();
  };
  return (
    <View
      style={{
        backgroundColor: 'white',
        width: '94%',
        display: 'flex',
        borderRadius: 6,
        alignItems: 'center',
        margin: 3,
        elevation: 4,
      }}>
      <View
        style={{
          marginTop: 5,
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            flex: 1,
          }}>
          <Avatar
            source={{
              uri: presentuser.propic,
            }}
            rounded
            size="medium"
          />
          <Text style={{ color: '#196F3D', fontWeight: 'bold', fontSize: 17 }}>
            {' '}
            {username} Requested You
          </Text>
        </View>

        <MaterialCommunityIcons
          name="close"
          size={23}
          color="black"
          style={{ position: 'absolute', top: 0, right: 0 }}
          onPress={deletenoty}
        />
      </View>

      <View style={{ display: 'flex', flexDirection: 'row' }}>
        <TouchableOpacity
          onPress={accept ? nothing : sendaccept}
          style={{
            margin: 10,
            backgroundColor: accept ? 'white' : '#81E475',
            alignItems: 'center',
            borderRadius: 10,
            elevation: 2,
            flex: 1,
          }}>
          <Text
            style={{
              color: accept ? 'black' : 'white',
              fontWeight: 'bold',
              padding: 10,
            }}>
            {accept ? 'Accepted' : 'Accept'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={reject ? nothing : sendreject}
          style={{
            margin: 10,
            backgroundColor: 'white',
            alignItems: 'center',
            borderRadius: 10,
            elevation: 2,
            flex: 1,
          }}>
          <Text style={{ color: 'red', fontWeight: 'bold', padding: 10 }}>
            {reject ? 'rejected' : 'Reject'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
