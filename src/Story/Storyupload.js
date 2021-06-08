import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
  Dimensions,
} from 'react-native';
import { Header } from 'react-native-elements';
import Icons from 'react-native-vector-icons/MaterialIcons';
import { Avatar } from 'react-native-elements';
import { auth, db, storage } from '../../firebase.js';
import firebase from '@firebase/app';
import Activityind from '../styles/Activityind.js';
function Camerapost({ navigation, route }) {
  const { image, baseimage } = route.params;
  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;
  const [propic, setPropic] = useState(null);
  const [act, setAct] = useState(false);
  const user = auth.currentUser;
  const [followers, setfollowers] = useState([]);
  useEffect(() => {
    db.collection('users')
      .doc(user.uid)
      .collection('followers')
      .onSnapshot((snapshot) => {
        setfollowers(snapshot.docs.map((doc) => doc.data()));
      });
  }, [user.uid]);
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

  const upload = () => {
    setAct(true);
    let apiUrl = 'https://api.cloudinary.com/v1_1/jashwanth/image/upload';

    let data = {
      file: baseimage,
      upload_preset: 'jashwanthclone',
    };

    fetch(apiUrl, {
      body: JSON.stringify(data),
      headers: {
        'content-type': 'application/json',
      },
      method: 'POST',
    })
      .then(async (r) => {
        let data = await r.json();

        db.collection('users').doc(user.uid).collection('stories').add({
          storyurl: data.secure_url,
          username: user.displayName,
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
          propic: propic,
          userid: user.uid,
        });
        for (let i = 0; i < followers.length; i++) {
          db.collection('users')
            .doc(followers[i].followerid)
            .collection('stories')
            .add({
              storyurl: data.secure_url,
              username: user.displayName,
              timestamp: firebase.firestore.FieldValue.serverTimestamp(),
              propic: propic,
              userid: user.uid,
            });
        }
      })

      .then(() => {
        setAct(false);
        navigation.navigate('Chats');
      })
      .catch((err) => {
        alert(err);
      });
  };
  return (
    <View style={{ backgroundColor: 'black', height: '100%' }}>
      <Header
        containerStyle={{
          backgroundColor: '#13E6E6',
          borderBottomColor: '#13E6E6',
        }}
        placement="left"
        leftComponent={
          <Icons
            onPress={() => navigation.navigate('Chats')}
            name={'close'}
            size={24}
            color="white"
            style={{ marginLeft: '3%' }}
          />
        }
      />
      <StatusBar backgroundColor="#13E6E6" />
      {!act ? (
        <View style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
          <Image
            source={{
              uri: image,
            }}
            style={{
              width: windowWidth,
              height: windowHeight - 140,
              resizeMode: 'cover',
            }}
          />
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              flex: 1,
              justifyContent: 'center',
            }}>
            <TouchableOpacity
              onPress={upload}
              style={{
                flex: 0.3,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}>
              <Avatar
                rounded
                source={{
                  uri: `${propic}`,
                }}
              />
              <Text style={{ color: 'white' }}>Add story</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ flex: 0.3 }}
              onPress={() =>
                navigation.navigate('postupload', {
                  postimage:
                    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRKnDQEfRU_Yih9NgNLLKHgXsmbNE-Gp8NTBw&usqp=CAU',
                })
              }>
              <Text style={{ color: '#3498DB', fontSize: 23 }}> Post</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View
          style={{
            justifyContent: 'center',
            alignContent: 'center',
            alignItems: 'center',
            flex: 1,
            backgroundColor: 'white',
          }}>
          <Activityind />
        </View>
      )}
    </View>
  );
}
export default Camerapost;
