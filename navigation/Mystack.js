import React, { useState, useEffect } from 'react';
import { StatusBar } from 'react-native';
import Splashscreen from '../SplashScreen.js';
import Login from '../auth/Login.js';
import Profile from '../Profile.js';
import Camera from '../Camera.js';
import Messagescreen from '../chats/Messagescreen.js';
import Search from '../Search.js';
import Drawercontent from '../Drawercontent.js';
import Register from '../auth/Register.js';
import Settings from '../Settings.js';
import PostUpload from '../posts/PostUpload.js';
import HomeView from '../HomeView.js';
import Cam from '../Camera.js';
import UserProfile from '../UserProfile.js';
import Userlocation from '../userlocation.js';
import Chatcamera from '../chats/Chatcamera.js';
import Camerapost from '../Storyupload.js';
import { createStackNavigator } from '@react-navigation/stack';
import MyDrawer from './Mydrawer.js';
import Comments from '../posts/Comments.js';
import Groupmessagescreen from '../chats/Groupmessagescreen.js';
import { auth, db } from '../firebase.js';
import Groupcamera from '../chats/Groupcamera.js';
import Groupchatcamera from '../chats/Groupchatcamera.js';
import Grouplist from '../chats/Grouplist.js';
import Followers from '../Followusers/Followers.js';
import Following from '../Followusers/Following.js';
import Myposts from '../Myposts.js';
import AsyncStorage from '@react-native-async-storage/async-storage'
const Stack = createStackNavigator();
export default function Mystacks() {
  const [USER,setuser]=useState()

  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();
  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }
  useEffect(() => {
    const subscriber = auth.onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, []);
 
    return (
      <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="Splashscreen" component={Splashscreen} />
      <Stack.Screen name="Login" component={Login} />
     <Stack.Screen name="Register" component={Register} />
      <Stack.Screen name="drawerscreen" component={MyDrawer} />
      <Stack.Screen name="Myposts" component={Myposts} />
      <Stack.Screen name="camerapost" component={Camerapost} />
      <Stack.Screen name="settings" component={Settings} />
      <Stack.Screen name="userlocation" component={Userlocation} />
      <Stack.Screen name="comments" component={Comments} />
      <Stack.Screen name="userprofile" component={UserProfile} />
      <Stack.Screen name="cam" component={Cam} />
      <Stack.Screen name="messagescreen" component={Messagescreen} />
      <Stack.Screen name="groupmessagescreen" component={Groupmessagescreen} />
      <Stack.Screen name="search" component={Search} />
      <Stack.Screen name="homeview" component={HomeView} />
      <Stack.Screen name="postupload" component={PostUpload} />
      <Stack.Screen name="Chatcamera" component={Chatcamera} />
      <Stack.Screen name="Groupcamera" component={Groupcamera} />
      <Stack.Screen name="Groupchatcamera" component={Groupchatcamera} />
      <Stack.Screen name="Grouplist" component={Grouplist} />
      <Stack.Screen name="followers" component={Followers} />
      <Stack.Screen name="following" component={Following} />
    </Stack.Navigator>
     
    );

 
}
