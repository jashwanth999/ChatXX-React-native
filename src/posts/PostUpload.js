import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  Button,
  Image,
  Platform,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import * as ImagePicker from '../styles/node_modules/expo-image-picker';
import { storage, db, auth } from '../auth/firebase.js';
import { ProgressBar, Colors } from '../Story/node_modules/react-native-paper';
import { Input } from '../Story/node_modules/react-native-elements';
import firebase from '../auth/node_modules/@firebase/app';
import { Header } from '../Story/node_modules/react-native-elements';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { Avatar } from '../Story/node_modules/react-native-elements';
import Activityind from '../styles/Activityind.js';
import * as MediaLibrary from 'expo-media-library';
function Post({ navigation, route }) {
  const user = auth.currentUser;
  const [image, setImage] = useState(null);
  const [caption, setCaption] = useState('');
  const [progress, setProgess] = useState(0);
  const [propic, setPropic] = useState(null);
  const [act, setact] = useState(false);
  const [data, setdata] = useState([]);

  const [baseimage, setbaseimage] = React.useState('');
  const [url, seturl] = useState(null);
  const [followers, setfollowers] = useState([]);
  useEffect(() => {
    db.collection('users')
      .doc(user.uid)
      .collection('followers')
      .onSnapshot((snapshot) => {
        setfollowers(snapshot.docs.map((doc) => doc.data()));
      });
  }, [user.uid]);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      base64: true,
    });

    if (!result.cancelled) {
      setImage(result.uri);

      let base64Img = `data:image/jpg;base64,${result.base64}`;
      setbaseimage(base64Img);
    }
  };
  const pickImage2 = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [5, 4],
      quality: 1,
      base64: true,
    });

    if (!result.cancelled) {
      setImage(result.uri);
      let base64Img = `data:image/jpg;base64,${result.base64}`;
      setbaseimage(base64Img);
    }
  };
  const upload = () => {
    setact(true);
    let apiUrl = 'https://api.cloudinary.com/v1_1/******/image/upload';

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

        db.collection('users').doc(user.uid).collection('image').add({
          photourl: data.secure_url,
          caption: caption,
          username: user.displayName,
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
          propic: propic,
          userid: user.uid,
        });
        db.collection('users')
          .doc(user.uid)
          .collection('images')
          .doc(user.uid)
          .set({
            photourl: data.secure_url,
            caption: caption,
            username: user.displayName,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            propic: propic,
            userid: user.uid,
          });
        for (let i = 0; i < followers.length; i++) {
          db.collection('users')
            .doc(followers[i].followerid)
            .collection('images')
            .doc(user.uid)
            .set({
              photourl: data.secure_url,
              caption: caption,
              username: user.displayName,
              timestamp: firebase.firestore.FieldValue.serverTimestamp(),
              propic: propic,
              userid: user.uid,
            });
        }

        seturl(null);
      })

      .then(() => {
        setact(false);
        navigation.navigate('post');
      })
      .catch((err) => {
        alert(err);
      });
    setImage(null);
  };
  useEffect(() => {
    if (user?.uid) {
      db.collection('users')
        .doc(user?.uid)
        .onSnapshot((doc) => {
          setPropic(doc.data().propic);
        });
    }
  }, [user.uid]);

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      {act ? (
        <Activityind />
      ) : (
        <View style={{ backgroundColor: 'white', height: '100%' }}>
          <Header
            containerStyle={{
              backgroundColor: '#13E6E6',
            }}
            leftComponent={
              <MaterialCommunityIcons
                onPress={() => navigation.goBack()}
                name="close"
                size={26}
                color="white"
                style={{ marginLeft: '3%' }}
              />
            }
            centerComponent={{
              text: 'New Post',
              style: { color: 'white', fontSize: 20 },
            }}
            rightComponent={
              <MaterialCommunityIcons
                name="check"
                size={26}
                color="#24a0ed"
                style={{ marginLeft: '3%' }}
                onPress={upload}
              />
            }
          />
          <StatusBar backgroundColor="#13E6E6" />
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              borderColor: 'gray',
              margin: 3,
              borderRadius: 40,
            }}>
            <View style={{ margin: 5 }}>
              <Avatar
                rounded
                source={{
                  uri: `${propic}`,
                }}
              />
            </View>
            <View
              style={{
                elevation: 2,
                backgroundColor: '#EAEDED',
                width: '86%',
                borderRadius: 10,
                borderTopLeftRadius: 0,
              }}>
              <TextInput
                style={{
                  height: 44,
                  outline: 'none',
                  color: 'black',
                  fontSize: 16,
                  width: '100%',
                  flexWrap: 'wrap',
                  fontWeight: 'bold',
                }}
                onChangeText={(caption) => setCaption(caption)}
                value={caption}
                placeholder="Write a caption"
              />
            </View>
          </View>
          <View>
            {image ? (
              <View onPress={pickImage}>
                <Image
                  source={{ uri: image }}
                  style={{ width: '100%', height: 300 }}
                />
              </View>
            ) : (
              <TouchableOpacity
                onPress={pickImage}
                style={{ alignItems: 'center', marginTop: 10 }}>
                <View
                  style={{
                    width: '90%',
                    height: 300,
                    backgroundColor: 'white',
                    elevation: 1,
                    borderRadius: 15,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <View
                    style={{
                      display: 'flex',
                      flexDirection: 'row',

                      alignItems: 'center',
                    }}>
                    <Text
                      style={{
                        fontSize: 30,
                        opacity: 0.5,
                        fontWeight: 'bold',
                      }}>
                      Add Photos
                    </Text>
                    <MaterialIcons
                      onPress={pickImage2}
                      name="add-photo-alternate"
                      size={50}
                      color="blue"
                      style={{ padding: 10, opacity: 0.5 }}
                    />
                  </View>
                </View>
              </TouchableOpacity>
            )}

            <View style={{ display: 'flex', flexDirection: 'row' }}>
              <View style={{ flex: 1, flexDirection: 'row' }}>
                <TouchableOpacity
                  onPress={pickImage}
                  style={{
                    flex: 1,
                    margin: 10,
                    backgroundColor: '#81E475',
                    alignItems: 'center',
                    borderRadius: 15,
                    elevation: 2,
                    justifyContent: 'center',
                  }}>
                  <Text
                    style={{
                      color: 'white',
                      fontSize: 20,
                      fontWeight: 'bold',
                      padding: 10,
                    }}>
                    Gallery
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={{ flex: 1, flexDirection: 'row-reverse' }}>
                <TouchableOpacity
                  style={{
                    margin: 10,
                    backgroundColor: 'white',
                    alignItems: 'center',
                    borderRadius: 50,
                    width: 50,
                    height: 50,
                    alignContent: 'center',
                    justifyContent: 'center',
                    elevation: 2,
                  }}>
                  <MaterialCommunityIcons
                    onPress={pickImage2}
                    name="camera"
                    size={30}
                    color="blue"
                    style={{ padding: 10 }}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}
export default Post;
