import React, { useState, useEffect } from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  Button,
  Text,
  ActivityIndicator,
} from 'react-native';
import { ListItem, Avatar } from '../src/Story/node_modules/react-native-elements';
import { auth, db } from '../auth/firebase.js';
import firebase from '../src/auth/node_modules/@firebase/app';
function Groupusers({
  username,
  roomid,
  navigation,
  propic,
  groupid,
  groupname,
  grouppropic,
  createrid,
  isadded,
}) {
  const user = auth.currentUser;
  const [image, setImage] = useState(null);
  const [sent, setSent] = useState(false);
  const [video, setvideo] = useState(null);
  const [act, setact] = useState(false);
  const [presentuser, setPresentuser] = useState([]);
  const [creater, setcreater] = useState([]);
  useEffect(() => {
    db.collection('users')
      .doc(createrid)
      .onSnapshot((doc) => {
        setcreater(doc.data());
      });
  }, [createrid]);

  useEffect(() => {
    db.collection('users')
      .doc(user.uid)
      .onSnapshot((doc) => {
        setPresentuser(doc.data());
      });
  }, [user.uid]);
  const [groupusers, setgroupusers] = useState([]);

  useEffect(() => {
    db.collection('users')
      .doc(createrid)
      .collection('groups')
      .doc(groupid)
      .collection('groupusers')
      .doc(roomid)
      .onSnapshot((doc) => setgroupusers(doc.data()));
  }, []);

  const add = () => {
    setact(true);
    db.collection('users').doc(roomid).collection('groups').doc(groupid).set({
      createdby: creater.username,
      createrid: createrid,
      groupname: groupname,
      grouppropic: grouppropic,
      timestamp: new Date(),
    });
    db.collection('users')
      .doc(createrid)
      .collection('groups')
      .doc(groupid)
      .collection('groupusers')
      .doc(roomid)
      .set({
        groupname: groupname,
        groupid: groupid,
        createrid: createrid,
        timestamp: new Date(),
        grouppropic: grouppropic,
        isadded: true,
        addingname: username,
        addingpropic: propic,
        addingid: roomid,
      });
    db.collection('users')
      .doc(createrid)
      .collection('groups')
      .doc(groupid)
      .collection('groupupdate')
      .doc(roomid)
      .update({
        isadded: true,
        roomid: roomid,
      });
    db.collection('users')
      .doc(createrid)
      .collection('groups')
      .doc(groupid)
      .collection('groupupdate')
      .doc(roomid)
      .update({
        isadded: true,
        roomid: roomid,
      });
    db.collection('users')
      .doc(roomid)
      .collection('groupnotifications')
      .doc(groupid)
      .set({
        adderid: user.uid,
        addername: user.displayName,
        groupid: groupid,
        creater: createrid,
        adderpropic: presentuser.propic,
        groupname: groupname,
        grouppropic: grouppropic,
      });
    db.collection('users')
      .doc(roomid)
      .collection('notifications')
      .doc(groupid)
      .set({
        x: 0,
      });

    setact(false);
    setSent(true);
  };

  const nothing = () => {};
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
            style={{ color: 'black', fontSize: 17, marginLeft: 10 }}>
            {username}
          </ListItem.Title>
        </ListItem.Content>

        <TouchableOpacity onPress={!sent ? add : nothing}>
          <View
            style={{
              width: 60,
              borderRadius: 5,
              backgroundColor: sent ? 'grey' : '#24a0ed',
              height: 25,
              alignItems: 'center',
            }}>
            <Text
              style={{
                color: 'white',
                fontSize: 17,
              }}>
              {' '}
              {sent ? 'Added' : 'Add'}
            </Text>
          </View>
        </TouchableOpacity>
      </ListItem>
    </View>
  );
}
export default Groupusers;
