import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import { ListItem, Avatar } from '../Story/node_modules/react-native-elements';
import { Divider } from '../Story/node_modules/react-native-elements';
import {
  MaterialCommunityIcons,
  Ionicons,
  MaterialIcons,
  AntDesign,
} from '@expo/vector-icons';
import { BottomSheet } from 'react-native-btr';
import Shareusers from '../Shareusers.js';
import { auth, db } from '../auth/firebase.js';
export default function PostView({
  propic,
  photourl,
  username,
  caption,
  navigation,
  id,
  photolikes,
  isliked,
  presentpropic,
}) {
  const [visible, setVisible] = useState(false);

  const user = auth.currentUser;
  const [users, setUsers] = useState([]);
  const [likes, setlikes] = useState([]);
  const [value, setvalue] = useState('');
  useEffect(() => {
    db.collection('users')
      .doc(id)
      .collection('images')
      .doc(id)
      .onSnapshot((doc) => {
        setlikes(doc.data());
      });
  }, []);

  const piclike = () => {
    db.collection('users').doc(user.uid).collection('images').doc(id).update({
      isliked: true,
    });
    db.collection('users')
      .doc(id)
      .collection('images')
      .doc(id)
      .update({
        likes: likes?.likes + 1,
      });
    db.collection('users').doc(id).collection('likenotification').add({
      photoid: id,
      likername: user.displayName,
      likerid: user.uid,
      likerpropic: presentpropic,
      caption: caption,
      username: username,
      propic: propic,
      photourl: photourl,
    });
    db.collection("users").doc(id).collection("notifications").add({
      x:0
    })
  };
  const picdislike = () => {
    if (likes?.likes) {
      db.collection('users').doc(user.uid).collection('images').doc(id).update({
        isliked: false,
      });
      db.collection('users')
        .doc(id)
        .collection('images')
        .doc(id)
        .update({
          likes: likes?.likes - 1,
        });
    } else {
      db.collection('users').doc(user.uid).collection('images').doc(id).update({
        isliked: false,
      });
      db.collection('users').doc(id).collection('images').doc(id).update({
        likes: 0,
      });
    }
  };

  useEffect(() => {
    db.collection('users')
      .doc(user.uid)
      .collection('chatusers')
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
  return (
    <View
      style={{
        marginTop: 3,
        margin: 2,
      }}>
      <View>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <Avatar
            source={{
              uri: propic,
            }}
            rounded
            size="medium"
          />
          <Text
            style={{
              fontSize: 17,
              fontWeight: 'bold',

              marginLeft: 5,
            }}>
            {username}
          </Text>
          <View style={{ position: 'absolute', right: 10 }}>
            <MaterialIcons
              name="more-vert"
              color="black"
              size={22}
              style={{}}
            />
          </View>
        </View>
        {caption ? (
          <View style={{ position: 'relative', left: '6%' }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: 'bold',
                opacity: 0.6,
                flexWrap: 'wrap',
                marginTop: 8,
                marginBottom: 2,
              }}>
              {caption}
            </Text>
          </View>
        ) : (
          <View style={{ marginTop: 10 }}></View>
        )}

        <View
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            alignContent: 'center',
            flex: 1,
          }}>
          <Image
            source={{
              uri: photourl,
            }}
            style={{
              width: '90%',
              height: 220,

              borderRadius: 8,
            }}
          />

          <View
            style={{
              display: 'flex',
              marginTop: 5,
              marginBottom: 5,
              flexDirection: 'row',
              width: '90%',
            }}>
            <TouchableOpacity
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
              onPress={() =>
                navigation.navigate('comments', {
                  photourl: photourl,
                  photoid: id,
                  username: username,
                  avatarurl: propic,
                  caption: caption,
                  photolikes: photolikes,
                  isliked: isliked,
                })
              }>
              <AntDesign name="message1" color="black" size={22} style={{}} />
              <Text style={{ fontSize: 13, opacity: 0.8, fontWeight: 'bold' }}>
                Comments
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                flex: 1,
              }}
              onPress={isliked ? picdislike : piclike}>
              <AntDesign
                name={isliked ? 'like1' : 'like2'}
                color={isliked ? '#2A92EC' : 'black'}
                size={22}
                style={{}}
              />
              <Text
                style={{
                  fontSize: 13,
                  opacity: 0.8,
                  fontWeight: 'bold',
                  color: isliked ? '#2A92EC' : 'black',
                }}>
                {likes?.likes} Likes
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                flex: 0.5,
              }}
              onPress={toggleBottomNavigationView}>
              <AntDesign name="sharealt" color="black" size={22} style={{}} />

              <Text style={{ fontSize: 13, opacity: 0.8, fontWeight: 'bold' }}>
                Share
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <Divider />
      </View>
      <BottomSheet
        visible={visible}
        onBackButtonPress={toggleBottomNavigationView}
        onBackdropPress={toggleBottomNavigationView}>
        <View
          style={{
            width: '100%',
            height: 400,
            backgroundColor: 'white',
            borderTopLeftRadius: 25,
            borderTopRightRadius: 25,
          }}>
          <TouchableOpacity
            onPress={() => setisVisible(false)}
            style={{ width: '100%', alignItems: 'center' }}>
            <View
              style={{
                width: 50,
                height: 7,
                backgroundColor: '#13E6E6',
                borderRadius: 15,
              }}></View>
            <View
              style={{
                display: 'flex',
                border: 'none',
                outline: 'none',
                marginTop: 10,
                flexDirection: 'column',
                width: '90%',
                backgroundColor: '#EAEDED',
                borderRadius: 10,
                height: 40,
                elevation: 2,
              }}>
              <TextInput
                style={{
                  height: 40,
                  marginLeft: 7,
                  outline: 'none',
                  border: 'none',
                  fontSize: 17,
                }}
                value={value}
                placeholder="search"
                onChangeText={(value) => setvalue(value)}
              />
            </View>
          </TouchableOpacity>
          <View style={{ marginTop: 10 }}>
            <ScrollView>
              {users.map(({ id, users }) =>
                users.username.includes(value) ? (
                  <Shareusers
                    key={id}
                    roomid={id}
                    username={users.username}
                    navigation={navigation}
                    user={user}
                    propic={users.propic}
                    imageurl={photourl}
                    userid={users.userid}
                  />
                ) : (
                  <View></View>
                )
              )}
            </ScrollView>
          </View>
        </View>
      </BottomSheet>
    </View>
  );
}
