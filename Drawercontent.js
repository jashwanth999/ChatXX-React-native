import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Linking
} from 'react-native';
import { ListItem, Avatar } from 'react-native-elements';
import {
  MaterialCommunityIcons,
  Ionicons,
  MaterialIcons,
  FontAwesome,
} from '@expo/vector-icons';
import { auth, db } from './firebase.js';
import {  Overlay } from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage'
export default function Drawercontent({ navigation }) {
  const user = auth.currentUser;
  const [presentuser, setPresentuser] = useState([]);
  const [visible, setVisible] = useState(false);
  const [groupname, setgroupname] = useState('');
  const [followerlens, setfollowerlen] = useState([]);
  const [followinglen, setfollowinglen] = useState([]);
  const openabout=()=>{
    Linking.openURL("https://jashwanth.netlify.app/");
  }
  useEffect(() => {
    db.collection('users')
      .doc(user.uid)
      .collection('following')
      .onSnapshot((snapshot) => {
        setfollowinglen(snapshot.docs.map((doc) => doc.data()));
      });
      db.collection('users')
      .doc(user.uid)
      .onSnapshot((doc) => {
        setPresentuser(doc.data());
      });
      db.collection('users')
      .doc(user.uid)
      .collection('followers')
      .onSnapshot((snapshot) => {
        setfollowerlen(snapshot.docs.map((doc) => doc.data()));
      });
  }, [user.uid]);
  const toggleOverlay = () => {
    setVisible(!visible);
  };
  const logout = () => {
   
    auth.signOut().then(async() => {
      navigation.navigate('Login');
      await AsyncStorage.removeItem('email');
      await AsyncStorage.removeItem('message');
      
    });
    

  };
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
        navigation.closeDrawer();
      });
  };
  const nothing = () => {};

  return (
    <View style={{ flex: 1, backgroundColor: '#13E6E6' }}>
      <ScrollView
        style={{
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          top: 50,
          flex: 1,
        }}>
        <View
          style={{
            alignContent: 'center',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
            display: 'flex',
          }}>
          <TouchableOpacity style={{ flex: 0.8 }}>
            <Avatar
              source={{
                uri: presentuser.propic,
              }}
              rounded
              size="large"
            />
          </TouchableOpacity>
          <View
            style={{
              display: 'flex',
              flexDirectionL: 'column',
            }}>
            <Text
              style={{
                color: 'white',
                fontSize: 20,
                fontWeight: 'bold',
                position: 'relative',
                right: 50,
              }}>
              {presentuser.username}
            </Text>
          </View>
        </View>
        <View
          style={{
            display: 'flex',
            flex: 1,
            flexDirection: 'row',
            padding: 15,
            marginTop: 5,
          }}>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('following', { userid: user.uid })
            }>
            <Text
              style={{
                color: 'white',
                fontSize: 17,
                fontWeight: 'bold',
                marginLeft: 5,
                marginTop: 4,
              }}>
              {' '}
              {followinglen.length} Following
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('followers', { userid: user.uid })
            }>
            <Text
              style={{
                color: 'white',
                fontSize: 17,
                fontWeight: 'bold',
                marginLeft: 8,
                marginTop: 4,
              }}>
              {' '}
              {followerlens.length} Followers
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={toggleOverlay}
          style={{
            display: 'flex',
            flex: 1,
            flexDirection: 'row',
            padding: 15,
            marginTop: 5,
          }}>
          <MaterialCommunityIcons
            name="account-group"
            color="white"
            size={28}
          />
          <Text
            style={{
              color: 'white',
              fontSize: 17,
              fontWeight: 'bold',
              marginLeft: 15,
              marginTop: 4,
            }}>
            New Group
          </Text>
        </TouchableOpacity>
        <View
          style={{
            display: 'flex',
            flex: 1,
            flexDirection: 'row',
            padding: 15,
            marginTop: 5,
          }}>
          <Ionicons name="ios-star-half-sharp" color="white" size={29} />
          <Text
            style={{
              color: 'white',
              fontSize: 17,
              fontWeight: 'bold',
              marginLeft: 15,
              marginTop: 4,
            }}>
            {' '}
            Favourites
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate('Myposts')}
          style={{
            display: 'flex',
            flex: 1,
            flexDirection: 'row',
            padding: 15,
            marginTop: 5,
          }}>
          <MaterialCommunityIcons
            name="image-multiple"
            color="white"
            size={30}
          />
          <Text
            style={{
              color: 'white',
              fontSize: 17,
              fontWeight: 'bold',
              marginLeft: 15,
              marginTop: 4,
            }}>
            {' '}
            Myposts
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('settings')}>
          <View
            style={{
              display: 'flex',
              flex: 1,
              flexDirection: 'row',
              padding: 15,
              marginTop: 5,
            }}>
            <FontAwesome name="edit" color="white" size={30} />
            <Text
              style={{
                color: 'white',
                fontSize: 17,
                fontWeight: 'bold',
                marginLeft: 15,
                marginTop: 4,
              }}>
              {' '}
              Edit Profile
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
         onPress={openabout}
          style={{
            display: 'flex',
            flex: 1,
            flexDirection: 'row',
            padding: 15,
            marginTop: 5,
          }}>
          <Ionicons
            name="ios-information-circle-sharp"
            color="white"
            size={28}
          />
          <Text
            style={{
              color: 'white',
              fontSize: 17,
              fontWeight: 'bold',
              marginLeft: 15,
              marginTop: 4,
            }}>
            {' '}
             About
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={logout}>
          <View
            style={{
              display: 'flex',
              flex: 1,
              flexDirection: 'row',
              padding: 15,
              marginTop: 5,
            }}>
            <MaterialCommunityIcons name="logout" color="red" size={30} />
            <Text
              style={{
                color: 'red',
                fontSize: 17,
                fontWeight: 'bold',
                marginLeft: 15,
                marginTop: 4,
              }}>
              {' '}
              Logout
            </Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
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
