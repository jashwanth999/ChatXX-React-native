import React, { useState, useEffect, Component, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { db, auth } from '../firebase.js';
import * as Location from 'expo-location';
import Activityind from '../Activityind.js';
import {
  MaterialCommunityIcons,
  Ionicons,
  MaterialIcons,
} from '@expo/vector-icons';
function Register({ navigation }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phonenumber, setphonenumber] = useState('');
  const [visible, setVisible] = useState(false);
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [region, setRegion] = useState(null);
  const [lat, setlat] = useState(null);
  const [long, setlong] = useState(null);
  const [act, setact] = useState(false);
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      const region = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 1.0,
        longitudeDelta: 1.0,
      };
      setlat(location.coords.latitude);
      setlong(location.coords.longitude);
    })();
  }, []);



  const Signup = () => {
    setact(true);
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        db.collection('users')
          .doc(authUser.user.uid)
          .set({
            username: username,
            email: email,
            password: password,
            userid: authUser.user.uid,
            propic:
              'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRKnDQEfRU_Yih9NgNLLKHgXsmbNE-Gp8NTBw&usqp=CAU',
            latitude: lat,
            longitude: long,
            phonenumber: '+91' + phonenumber,
          });
        return authUser.user.updateProfile({
          displayName: username,
        });
      })

      .then(() => {
        setact(false);
        navigation.navigate('Login');
      })
      .catch((error) => {
        alert(error.message);
        setact(false);
      });
    setUsername('');
    setEmail('');
    setPassword('');
  };
  const user = auth.currentUser;
  const ok = () => {};

  return (
    <View style={{ flex: 1, justifyContent: 'flex-end' }}>
      {act ? (
        <Activityind />
      ) : (
        <ScrollView
          contentContainerStyle={{
            backgroundColor: '#13E6E6',
            flex: 1,
            justifyContent: 'flex-end',
          }}>
          <TouchableOpacity
            onPress={() => navigation.navigate('Login')}
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
              top: 20,
              left: 5,
            }}>
            <MaterialCommunityIcons name="arrow-left" color="white" size={23} />
          </TouchableOpacity>
          <View
            style={{
              backgroundColor: 'white',
              alignContent: 'center',
              alignItems: 'center',
              flex: 0.75,
              flexDirection: 'column',
              justifyContent: 'center',
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
            }}>
            <Text
              style={{
                color: '#27AE60',
                fontWeight: 'bold',
                margin: 20,
                fontSize: 16,
              }}>
              {' '}
              Register Your Account
            </Text>

            <View
              style={{
                display: 'flex',
               
               
                margin: 10,
                flexDirection: 'column',
                width: '79%',
                backgroundColor: '#EAEDED',
                borderRadius: 10,
                height: 65,
                elevation: 4,
              }}>
              <Text style={{ opacity: 0.3, fontWeight: 'bold', marginLeft: 7 }}>
                Username
              </Text>
              <TextInput
                style={{
                  height: 40,
                  marginLeft: 7,
                 
                 
                  fontSize: 17,
                }}
                value={username}
                placeholder="Username"
                onChangeText={(username) => setUsername(username)}
              />
            </View>

            <View
              style={{
                display: 'flex',
               
               
                margin: 10,
                flexDirection: 'column',
                width: '79%',
                backgroundColor: '#EAEDED',
                borderRadius: 10,
                height: 65,
                elevation: 4,
              }}>
              <Text style={{ opacity: 0.3, fontWeight: 'bold', marginLeft: 7 }}>
                Email
              </Text>
              <TextInput
                style={{
                  height: 40,
                  marginLeft: 7,
                 
                 
                  fontSize: 17,
                }}
                value={email}
                placeholder="Email"
                onChangeText={(email) => setEmail(email)}
              />
            </View>
            <View
              style={{
                display: 'flex',
               
               
                margin: 10,
                flexDirection: 'column',
                width: '79%',
                backgroundColor: '#EAEDED',
                borderRadius: 10,
                height: 65,
                elevation: 4,
              }}>
              <Text style={{ opacity: 0.3, fontWeight: 'bold', marginLeft: 7 }}>
                password
              </Text>
              <TextInput
                style={{
                  height: 40,
                  marginLeft: 7,
                 
                 
                  fontSize: 17,
                }}
                value={password}
                placeholder="password"
                secureTextEntry={true}
                onChangeText={(password) => setPassword(password)}
              />
            </View>
            <TouchableOpacity
              style={{
                backgroundColor: '#13E6E6',
                display: 'flex',
                borderRadius: 5,
                alignItems: 'center',
                margin: 10,
                width: '79%',
                elevation: 4,
              }}
              onPress={Signup}>
              <Text style={{ padding: 10, color: 'white', fontWeight: 'bold' }}>
                Register
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}
    </View>
  );
}

export default Register;
