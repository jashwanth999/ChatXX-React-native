import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  KeyboardAvoidingView,
  TextInput,
  Text,
  Platform,
  TouchableOpacity,
  StatusBar,
  ScrollView,
} from 'react-native';
import { auth, db } from '../../firebase.js';
import * as Location from 'expo-location';
import Activityind from '../styles/Activityind.js';
import AsyncStorage from '@react-native-async-storage/async-storage';
export default function Login({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [lat, setlat] = useState(null);
  const [long, setlong] = useState(null);
  const [act, setact] = useState(false);
  const scrollViewRef = useRef();
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

  const login = async() => {
    setact(true);
   await auth
      .signInWithEmailAndPassword(email, password)
      
      .then(async() => {
        const user = auth.currentUser;
          db.collection('users').doc(user.uid).update({
            latitude: lat,
            longitude: long,
          });
          try {
            await AsyncStorage.setItem('email', email)
            navigation.navigate('drawerscreen');
          } catch (e) {

        }
      })
      .catch((error) => {
        alert(error.message);
        setact(false);
      });
    setEmail('');
    setPassword('');
  };
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : null}
      enabled>
      <StatusBar backgroundColor="#13E6E6" />
      <View style={{ flex: 1 }}>
        {act ? (
          <Activityind />
        ) : (
          <ScrollView
            ref={scrollViewRef}
            onContentSizeChange={() =>
              scrollViewRef.current.scrollToEnd({ animated: true })
            }
            contentContainerStyle={{
              backgroundColor: '#13E6E6',

              flex: 1,
              justifyContent: 'flex-end',
            }}>
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
                Login to Your Account
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
                <Text
                  style={{ opacity: 0.3, fontWeight: 'bold', marginLeft: 7 }}>
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
                <Text
                  style={{ opacity: 0.3, fontWeight: 'bold', marginLeft: 7 }}>
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
                  width: '79%',
                  display: 'flex',
                  borderRadius: 6,
                  alignItems: 'center',
                  margin: 10,
                  elevation: 4,
                }}
                onPress={login}>
                <Text
                  style={{ padding: 10, color: 'white', fontWeight: 'bold' }}>
                  Login
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => navigation.navigate('Register')}
                style={{
                  backgroundColor: 'white',
                  width: '79%',
                  display: 'flex',
                  borderRadius: 6,
                  alignItems: 'center',
                  margin: 10,
                  elevation: 4,
                }}>
                <Text
                  style={{
                    color: '#27AE60',
                    fontWeight: 'bold',
                    fontSize: 16,
                    padding: 10,
                  }}>
                  {' '}
                  Signup
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

