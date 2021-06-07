import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StatusBar,
  Image,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Header } from '../Story/node_modules/react-native-elements';
import {
  MaterialCommunityIcons,
  Ionicons,
  MaterialIcons,
} from '@expo/vector-icons';
import { ListItem, Avatar } from '../Story/node_modules/react-native-elements';
import { Divider } from '../Story/node_modules/react-native-elements';
import { db, auth } from '../auth/firebase.js';
import CommentView from './commentView.js';
import firebase from '../auth/node_modules/@firebase/app';

export default function Comments({ navigation, route }) {
  const user = auth.currentUser;
  const width = Dimensions.get('window').width;
  const height = Dimensions.get('window').height;
  const [commentvalue, setcomment] = useState('');
  const { photourl, photoid, username, avatarurl, caption } = route.params;
  const [presentuser, setPresentuser] = useState([]);
  const [comments, setComments] = useState([]);
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
    db.collection('users')
      .doc(user.uid)
      .onSnapshot((doc) => {
        setPresentuser(doc.data());
      });
  }, [user.uid]);
  const sendcomment = () => {
    db.collection('users')
      .doc(photoid)
      .collection('images')
      .doc(photoid)
      .collection('comments')
      .add({
        comment: commentvalue,
        username: user.displayName,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        photoid: photoid,
        propic: presentuser.propic,
      });
    db.collection('users').doc(photoid).collection('commentnotifications').add({
      username: user.displayName,
      userid: user.uid,
      comment: commentvalue,
      propic: presentuser.propic,
      photourl: photourl,
      caption: caption,
      photoid: photoid,
      uploadername: username,
      uploaderpropic: avatarurl,
    });
    db.collection('users').doc(photoid).collection('notifications').add({
      x: 0,
    });

    setcomment('');
  };
  useEffect(() => {
    db.collection('users')
      .doc(photoid)
      .collection('images')
      .doc(photoid)
      .collection('comments')
      .orderBy('timestamp', 'desc')
      .onSnapshot((snapshot) => {
        setComments(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            com: doc.data(),
          }))
        );
      });
  }, [photoid]);
  const nothing = () => {};
  return (
    <View style={{ flex: 1 }}>
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
            onPress={() => navigation.goBack()}
          />
        }
        centerComponent={{
          text: 'Comments',
          style: { color: 'white', fontSize: 20 },
        }}
        rightComponent={
          <Ionicons
            name="ellipsis-vertical"
            color="white"
            size={20}
            onPress={() => {}}
          />
        }
      />
      <StatusBar backgroundColor="#13E6E6" />
      <View style={{ height: height - 126 }}>
        <ScrollView>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              margin: 10,
            }}>
            <Avatar
              source={{
                uri: avatarurl,
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
          </View>
          {caption ? (
            <View style={{ position: 'relative', left: '6%' }}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: 'bold',
                  marginLeft: 5,
                  opacity: 0.6,
                }}>
                {caption}
              </Text>
            </View>
          ) : (
            <View></View>
          )}

          <View
            style={{
              alignItems: 'center',
              display: 'flex',
              flexDirection: 'column',
            }}>
            <Image
              source={{
                uri: photourl,
              }}
              style={{
                width: '90%',
                height: 210,
                marginBottom: 10,
                borderRadius: 8,
              }}
            />
          </View>
          <Divider />
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              flex: 1,
              marginLeft: 10,
              marginRight: 10,
              alignItems: 'center',
            }}>
            <Text style={{ flex: 1, fontWeight: 'bold', fontSize: 19 }}>
              {' '}
              Comments
            </Text>
            <Text> {comments.length}Comments</Text>
          </View>

          <View style={{ display: 'flex', margin: 10 }}>
            {comments.map(({ com, id }) => (
              <CommentView
                key={id}
                comment={com.comment}
                username={com.username}
                propic={com.propic}
                navigation={navigation}
              />
            ))}
          </View>
        </ScrollView>
      </View>
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          backgroundColor: 'white',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <View
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <Avatar
            source={{
              uri: presentuser.propic,
            }}
            rounded
          />

          <TextInput
            placeholder="comment"
            style={{ width: '90%', height: 50, marginLeft: 5, fontSize: 17 }}
            value={commentvalue}
            onChangeText={(commentvalue) => setcomment(commentvalue)}
          />
        </View>
        <TouchableOpacity
          style={{ marginRight: 10 }}
          onPress={commentvalue ? sendcomment : nothing}>
          <Text
            style={{
              color: commentvalue ? '#3B8FE1' : '#8AB3DA',
              fontWeight: 'bold',
              fontSize: 20,
            }}>
            Post
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
