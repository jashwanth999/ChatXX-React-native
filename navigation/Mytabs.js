import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import {
  MaterialCommunityIcons,
  Ionicons,
  MaterialIcons,
} from '@expo/vector-icons';
import Notification from '../Notifications/Notification.js';
import Chat from '../chats/Chats.js';
import Profile from '../Profile.js';
import Post from '../posts/Post.js';
import Nearme from '../nearme.js';
import { db, auth } from '../firebase.js';
import Cam from '../Camera.js'
const Tab = createBottomTabNavigator();
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import * as Location from 'expo-location';
export default function Mytabs({ navigation }) {
  const user = auth.currentUser;
  const [len, setlen] = useState([]);
  const [lat,setlat]=useState(null)
  const [long,setlong]=useState(null)
  useEffect(() => {
    db.collection('users')
      .doc(user.uid)
      .collection('notifications')
      .onSnapshot((snapshot) => {
        setlen(snapshot.docs.map((doc) => doc.data()));
      });
  }, [user.uid]);

  
  return (
    <Tab.Navigator
      initialRouteName="Chats"
      tabBarOptions={{
        activeTintColor: 'white',
        showLabel: false,
        keyboardHidesTabBar: true,
        style: { backgroundColor: '#13E6E6' },
      }}>
      <Tab.Screen
        name="Chats"
        component={Chat}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="message-text"
              color={color}
              size={28}
            />
          ),
        }}
      />

      <Tab.Screen
        name="post"
        component={Post}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="ios-images" color={color} size={28} />
          ),
        }}
      />
      <Tab.Screen
        name="camera"
        component={Cam}
        options={{
          tabBarIcon: ({ color, size }) => (
          
                <MaterialCommunityIcons name="plus-box" color={color} size={30} />
             
          ),
        }}
      />
      <Tab.Screen
        name="Notification"
        component={Notification}
        options={{
          tabBarIcon: ({ color, size }) => (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('Notification', { value: true })
              }
              style={{ display: 'flex', flexDirection: 'row' }}>
              <Ionicons name="notifications" color={color} size={28} />
              {len.length ? (
                <View
                  style={{
                    height: 15,
                    width: 15,
                    borderRadius: 50,
                    backgroundColor: 'red',
                    zIndex: 1,
                    position: 'absolute',
                    right: 0,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Text
                    style={{
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: 10,
                      padding: 1,
                    }}>
                    {len.length}
                  </Text>
                </View>
              ) : (
                <View></View>
              )}
            </TouchableOpacity>
          ),
        }}
      />
      <Tab.Screen
        name="nearme"
        component={Nearme}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="google-nearby"
              color={color}
              size={28}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
