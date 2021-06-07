import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StatusBar,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { Header, Divider } from 'react-native-elements';
import {
  MaterialCommunityIcons,
  Ionicons,
  MaterialIcons,
} from '@expo/vector-icons';
import Chatusers from './Chatusers.js';
import Homestories from '../Homestories.js';
import { auth, db } from '../firebase.js';
import Groups from './Groups.js';
import { Overlay } from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage'
export default function Chat({ navigation }) {
  const user = auth.currentUser;
  const [users, setUsers] = useState([]);
  const [presentuser, setPresentuser] = useState([]);
  const [stories, setStories] = useState([]);
  const [suggestusers, setsuggestusers] = useState([]);
  const [groups, setgroups] = useState([]);
  const [visible, setVisible] = useState(false);
  const [groupname, setgroupname] = useState('');
  
  const toggleOverlay = () => {
    setVisible(!visible);
  };
  let email;
  const getData=async()=>{
   email= await AsyncStorage.getItem('email')
  }
  useEffect(() => {
    getData()
    db.collection('users')
      .doc(user.uid)
      .collection('stories')
      .onSnapshot((snapshot) => {
        setStories(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            value: doc.data(),
          }))
        );
      });
      db.collection('users')
      .doc(user.uid)
      .onSnapshot((doc) => {
        setPresentuser(doc.data());
      });
      db.collection('users')
      .doc(user.uid)
      .collection('chatusers')
      .orderBy('timestamp', 'desc')
      .onSnapshot((snapshot) => {
        setUsers(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            users: doc.data(),
          }))
        );
      });
      db.collection('users')
      .where('userid', '!=', user.uid)
      .onSnapshot((snapshot) => {
        setsuggestusers(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            users: doc.data(),
          }))
        );
      });
      db.collection('users')
      .doc(user.uid)
      .collection('groups')
      .orderBy('timestamp', 'desc')
      .onSnapshot((snapshot) => {
        setgroups(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            users: doc.data(),
          }))
        );
      });
  }, [user.uid]);

  const create = () => {
    db.collection('users')
      .doc(user.uid)
      .collection('groups')
      .add({
        createdby: user.displayName,
        createrid: user.uid,
        groupname: groupname,
        grouppropic:
          'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSgluD1vIXiS3No5NwPY5WV23nHLnJzvMKApA&usqp=CAU',
        timestamp: new Date(),
      })
      .then(() => {
        toggleOverlay();
      });
  };
  
  const nothing = () => {};

  return (
    <View style={{ backgroundColor: 'white', flex: 1 }}>
      <Header
        containerStyle={{
          backgroundColor: '#13E6E6',
          borderBottomColor: 'none',
        }}
        leftComponent={
          <Ionicons
            name="menu"
            color="white"
            size={28}
            onPress={() => navigation.openDrawer()}
          />
        }
        centerComponent={{
          text: 'ChatX',
          style: {
            color: 'white',
            fontSize: 25,
            fontWeight: 'bold',
            fontStyle: 'italic',
          },
        }}
        rightComponent={
          <Ionicons
            name="search"
            color="white"
            size={26}
            onPress={() => navigation.navigate('search')}
          />
        }
      />
      <StatusBar backgroundColor="#13E6E6" />
      {users.length ? (
        <ScrollView style={{ height: '90%' }}>
          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: 'white',
            }}>
            <TouchableOpacity
              style={{
                margin: 5,
                alignItems: 'center',
                alignContent: 'center',
                justifyContent: 'center',
                width: 60,
                height: 60,
                borderRadius: 50,
              }}
              onPress={() => navigation.navigate('cam')}>
              <Image
                source={{ uri: presentuser.propic }}
                style={{
                  width: 60,
                  height: 60,
                  resizeMode: 'cover',
                  borderRadius: 50,
                }}
              />
              <Ionicons
                name="md-add-circle"
                color={'#24a0ed'}
                size={20}
                style={{ position: 'absolute', right: 0, bottom: 0 }}
              />
            </TouchableOpacity>
            {stories.map(({ id, value }) => (
              <Homestories
                key={id}
                id={id}
                userspropic={presentuser.propic}
                avatar_url={value.storyurl}
                username={value.username}
                navigation={navigation}
              />
            ))}
          </ScrollView>
          <Divider />

          {users.map(({ id, users }) => (
            <Chatusers
              
              id={id}
              navigation={navigation}
              user={user}
              username={users.username}
              userid={users.userid}
              userpropic={users.propic}
              lastmessage={users.lastmessage}
              time={users.time}
            />
          ))}
          {groups.map(({ id, users }) => (
            <Groups
              key={id}
              id={id}
              navigation={navigation}
              user={user}
              groupname={users.groupname}
              grouppropic={users.grouppropic}
              lastmessage={users.lastmessage}
              time={users.time}
              createrid={users.createrid}
            />
          ))}
        </ScrollView>
      ) : (
        <View
          style={{
            alignItems: 'center',
            alignContent: 'center',
            flex: 1,
            justifyContent: 'center',
            backgroundColor: 'white',
          }}>
          <View
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}>
            <Text style={{ fontWeight: 'bold', opacity: 0.4, fontSize: 18 }}>
              {' '}
              Suggestion's
            </Text>
            <View style={{ display: 'flex', flexDirection: 'row', margin: 5 }}>
              <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}>
                {suggestusers.map(({ id, users }) => (
                  <View
                    style={{
                      width: 180,
                      height: 200,
                      backgroundColor: 'white',
                      elevation: 2,
                      borderRadius: 6,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: 6,
                    }}>
                    <TouchableOpacity>
                      <Image
                        source={{ uri: users.propic }}
                        style={{ width: 80, height: 80, borderRadius: 50 }}
                      />
                    </TouchableOpacity>
                    <Text>{users.username}</Text>

                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate('userprofile', {
                          username: users.username,
                          userid: users.userid,
                        })
                      }
                      style={{
                        width: 110,
                        margin: 10,
                        backgroundColor: '#81E475',
                        alignItems: 'center',
                        borderRadius: 10,
                        elevation: 2,
                      }}>
                      <Text
                        style={{
                          color: 'white',
                          fontSize: 16,
                          fontWeight: 'bold',
                          padding: 7,
                        }}>
                        View Profile
                      </Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>
            </View>
            <View
              style={{
                width: 200,
                height: 50,
                backgroundColor: '#06FFDF',
                borderTopLeftRadius: 0,
                borderRadius: 23,
                alignItems: 'center',
                justifyContent: 'center',
                elevation: 2,
              }}>
              <Text
                style={{
                  fontWeight: 'bold',
                  fontSize: 20,
                  opacity: 1,
                  color: 'white',
                }}>
                No Chats Yet
              </Text>
            </View>
            <Text style={{ fontWeight: 'bold', opacity: 0.4, fontSize: 18 }}>
              {' '}
              Follow users to chat with them
            </Text>
          </View>
        </View>
      )}
      <TouchableOpacity
        onPress={toggleOverlay}
        style={{
          margin: 10,
          backgroundColor: '#3CBC87',
          alignItems: 'center',
          borderRadius: 55,
          width: 55,
          height: 55,
          alignContent: 'center',
          justifyContent: 'center',
          elevation: 2,
          position: 'absolute',
          bottom: 10,
          right: 5,
        }}>
        <MaterialCommunityIcons name="account-group" color="white" size={28} />
      </TouchableOpacity>
      <Overlay isVisible={visible} onBackdropPress={toggleOverlay}>
        <View
          style={{
            width: 300,
            height: 100,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}>
          <View
            style={{
              display: 'flex',
          
              
              margin: 10,
              flexDirection: 'column',
              width: '79%',
              backgroundColor: '#EAEDED',
              borderRadius: 5,

              elevation: 2,
            }}>
            <TextInput
            
              style={{
                height: 40,
                marginLeft: 7,
                
            
                fontSize: 17,
              }}
              placeholder="GroupName"
              value={groupname}
              onChangeText={(groupname) => setgroupname(groupname)}
            />
          </View>
          <TouchableOpacity
            onPress={groupname ? create : nothing}
            style={{
              position: 'absolute',
              right: 10,
              bottom: 5,
            }}>
            <Text
              style={{
                fontSize: 20,
                color: !groupname ? 'grey' : '#288BE0',
              }}>
              Create
            </Text>
          </TouchableOpacity>
        </View>
      </Overlay>
    </View>
  );
}
