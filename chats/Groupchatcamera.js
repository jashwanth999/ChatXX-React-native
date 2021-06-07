import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import { Header } from 'react-native-elements';
import Icons from 'react-native-vector-icons/MaterialIcons';
import { Avatar } from 'react-native-elements';
import { auth, db, storage } from '../firebase.js';
import firebase from '@firebase/app';

function Groupcamera({ navigation, route }) {
  const {
    image,
    groupname,
    roomid,
    grouppropic,
    imageurl,
    createrid,
  } = route.params;
  const [propic, setPropic] = useState(null);
  const [act, setAct] = useState(false);
  const [baseimage, setbaseimage] = React.useState('');
  const [url, seturl] = useState(null);
  const [groupusers, setgroupusers] = useState([]);
  const d = new Date();
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
  }, []);

  const user = auth.currentUser;
  useEffect(() => {
    try {
      if (user?.uid) {
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
      setAct(false);
    navigation.navigate('groupmessagescreen', {
      username: groupname,
      roomid: roomid,
      propic: grouppropic,
    });
      for (let i = 0; i < groupusers.length; i++) {
        db.collection('users')
          .doc(groupusers[i].id)
          .collection('groups')
          .doc(roomid)
          .collection('groupmessages')
          .add({
            message: '',
            userid: user.uid,
            username: user.displayName,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            image: data.secure_url,
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
            time: d.getHours() + ':' + d.getMinutes(),
            lastmessage: 'image',
          });
      }

      db.collection('users')
        .doc(createrid)
        .collection('groups')
        .doc(roomid)
        .collection('groupmessages')
        .add({
          message: '',
          userid: roomid,
          username: user.displayName,
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
          image: data.secure_url,
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
            size={30}
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
                  uri: `${grouppropic}`,
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
export default Groupcamera;
