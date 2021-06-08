import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  Dimensions,
  Alert,
} from 'react-native';
import {
  MaterialCommunityIcons,
  Ionicons,
} from '@expo/vector-icons';
import { auth, db } from '../../firebase.js';
import { Header } from 'react-native-elements';
import Icons from 'react-native-vector-icons/MaterialIcons';
import Userpost from './Userposts.js';
export default function Userprofile({ navigation, route }) {
  const user = auth.currentUser;
  const { userid, username, propic } = route.params;
  let deviceHeight = Dimensions.get('window').height;

  const [presentuser, setPresentuser] = useState([]);
  const [followarray, setfollowarray] = useState([]);
  const [followlength, setfollowlenth] = useState([]);
  const [followinglength, setisfollowinglength] = useState([]);
  const [posts, setPosts] = useState([]);
  const [request, setrequest] = useState(false);
  useEffect(() => {
    db.collection('users')
      .doc(userid)
      .collection('followers')
      .onSnapshot((snapshot) => {
        setfollowlenth(snapshot.docs.map((doc) => doc.data()));
      });
  }, [userid]);
  useEffect(() => {
    db.collection('users')
      .doc(userid)
      .collection('following')
      .onSnapshot((snapshot) => {
        setisfollowinglength(snapshot.docs.map((doc) => doc.data()));
      });
  }, [userid]);
  const sendfollow = () => {
    setrequest(true);

    db.collection('users')
      .doc(user.uid)
      .collection('following')
      .doc(userid)
      .set({
        followingid: userid,
        followingname: username,
        isfollowing: false,
      });
    db.collection('users')
      .doc(userid)
      .collection('followers')
      .doc(user.uid)
      .set({
        followerid: user.uid,
        followername: user.displayName,
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
      .collection('follownotification')
      .doc(user.uid)
      .set({
        followername: user.displayName,
        followerid: user.uid,
        request: true,
        accept: false,
        reject: false,
      });
    db.collection('users')
      .doc(userid)
      .collection('notifications')
      .doc(user.uid)
      .set({
        x: 0,
      });
  };
  const unfollow = () => {
    setfollow(false);
    db.collection('users')
      .doc(user.uid)
      .collection('following')
      .doc(userid)
      .delete();
    db.collection('users')
      .doc(userid)
      .collection('followers')
      .doc(user.uid)
      .delete();
    db.collection('users')
      .doc(user.uid)
      .collection('following')
      .doc(userid)
      .update({
        isfollowing: false,
      });
  };
  useEffect(() => {
    try {
      db.collection('users')
        .doc(user.uid)
        .collection('following')
        .doc(userid)
        .onSnapshot((doc) => {
          setfollowarray(doc.data());
        });
    } catch (error) {
      console.log(error);
    }
  }, [user.uid, userid]);
  useEffect(() => {
    db.collection('users')
      .doc(userid)
      .onSnapshot((doc) => {
        setPresentuser(doc.data());
      });
  }, [userid]);
  const f = followarray?.isfollowing;
  useEffect(() => {
    db.collection('users')
      .doc(userid)
      .collection('image')
      .where('userid', '==', userid)
      .onSnapshot((snapshot) => {
        setPosts(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            value: doc.data(),
          }))
        );
      });
  }, []);

  return (
    <View style={{ backgroundColor: 'white', flex: 1, alignItems: 'center' }}>
      <Header
        containerStyle={{
          backgroundColor: '#13E6E6',
          borderBottomColor: '#13E6E6',
        }}
        placement="left"
        leftComponent={
          <Icons
            onPress={() => navigation.goBack()}
            name={'arrow-back'}
            size={26}
            color="white"
          />
        }
        centerComponent={
          <Text style={{ fontSize: 20, color: 'white' }}>
            {presentuser.username}
          </Text>
        }
      />
      <StatusBar backgroundColor="#13E6E6" />
      <View
        style={{
          backgroundColor: '#13E6E6',
          width: '100%',
          height: 200,
          justifyContent: 'center',
          flexDirection: 'column',
        }}>
        <View
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            alignContent: 'center',
            justifyContent: 'center',
          }}>
          <View>
            <Image
              source={{ uri: presentuser.propic }}
              style={{ width: 90, height: 90, borderRadius: 50 }}
            />
          </View>
          <View style={{ display: 'flex', flexDirection: 'row', margin: 10 }}>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('followers', { userid: userid })
              }
              style={{ alignContent: 'center', alignItems: 'center' }}>
              <Text
                style={{
                  color: 'white',
                  fontSize: 22,
                  fontWeight: 'bold',
                }}>
                {followlength.length}
              </Text>
              <Text
                style={{
                  color: 'white',
                  fontSize: 12,
                  fontWeight: 'bold',
                }}>
                Followers
              </Text>
            </TouchableOpacity>
            <View
              style={{
                flex: 0.8,
                alignContent: 'center',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  color: 'white',
                  fontSize: 25,
                  fontWeight: 'bold',
                }}>
                {presentuser.username}
              </Text>
              
            </View>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('following', { userid: userid })
              }
              style={{
                alignContent: 'center',
                alignItems: 'center',

                elevation: 1,
              }}>
              <Text
                style={{
                  color: 'white',
                  fontSize: 22,
                  fontWeight: 'bold',
                }}>
                {followinglength.length}
              </Text>
              <Text
                style={{
                  color: 'white',
                  fontSize: 12,
                  fontWeight: 'bold',
                }}>
                Following
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View
        style={{
          position: 'absolute',
          top: '34%',
          alignContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          flex: 1,
        }}>
        <View
          style={{
            margin: 10,
            width: 320,
            height: 100,
            backgroundColor: 'white',
            elevation: 2,
            borderRadius: 14,
            flexDirection: 'row',
            justifyContent: 'center',
            alignContent: 'center',
            alignItems: 'center',
          }}>
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
            }}
            onPress={() =>
              navigation.navigate('messagescreen', {
                username: presentuser.username,
                roomid: userid,
                propic: presentuser.propic,
              })
            }>
            <MaterialCommunityIcons
              name="message-text"
              color="blue"
              size={28}
            />
          </TouchableOpacity>
          {request ? (
            <TouchableOpacity
              style={{
                flex: 0.8,
                margin: 10,
                backgroundColor: '#4E5052',
                alignItems: 'center',
                borderRadius: 15,
                elevation: 2,
              }}
              onPress={() => {
                setrequest(false);
              }}>
              <Text
                style={{
                  color: 'white',
                  fontSize: 16,
                  fontWeight: 'bold',
                  padding: 7,
                }}>
                Requested
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={{
                flex: 0.8,
                margin: 10,
                backgroundColor: '#81E475',
                alignItems: 'center',
                borderRadius: 15,
                elevation: 2,
              }}
              onPress={f ? unfollow : sendfollow}>
              <Text
                style={{
                  color: 'white',
                  fontSize: 16,
                  fontWeight: 'bold',
                  padding: 7,
                }}>
                {f ? 'Following' : 'Follow'}
              </Text>
            </TouchableOpacity>
          )}

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
            }}
            onPress={() => {
              if (f) {
                navigation.navigate('userlocation', { userid: userid });
              } else {
                Alert.alert('Account is in Private Mode');
              }
            }}>
            <MaterialCommunityIcons
              name="google-maps"
              color={'red'}
              size={35}
            />
          </TouchableOpacity>
        </View>
        <Text style={{ fontSize: 18, opacity: 0.4, fontWeight: 'bold' }}>
          Posts
        </Text>
        {f ? (
          posts.length ? (
            <View
              style={{
                height: '70%',
              }}>
              <ScrollView
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                  display: 'flex',
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                {posts.map(({ id, value }) => (
                  <Userpost
                    key={id}
                    url={value.photourl}
                    caption={value.caption}
                    length={posts.length}
                  />
                ))}
              </ScrollView>
            </View>
          ) : (
            <View
              style={{
                margin: 10,
                width: '90%',
                height: 250,
                backgroundColor: 'white',
                elevation: 2,
                borderRadius: 14,
                flexDirection: 'row',
                justifyContent: 'center',
                alignContent: 'center',
                alignItems: 'center',
              }}>
              <Text style={{ fontSize: 30, opacity: 0.6 }}> No Posts</Text>
            </View>
          )
        ) : (
          <View
            style={{
              width: '90%',
              height: 250,
              elevation: 2,
              backgroundColor: 'white',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 14,
            }}>
            <View
              style={{
                displayName: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}>
              <Ionicons name="md-lock-closed-sharp" color={'red'} size={45} />
              <Text style={{ fontSize: 25, fontWeight: 'bold' }}>
                Private Account
              </Text>
            </View>
          </View>
        )}
      </View>
    </View>
  );
}
