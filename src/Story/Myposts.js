import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StatusBar,
  Dimensions,
  Image,
  ScrollView,
} from 'react-native';
import { Header } from 'react-native-elements';
import {
  MaterialCommunityIcons,
  Ionicons,
  MaterialIcons,
} from '@expo/vector-icons';
import Icons from 'react-native-vector-icons/MaterialIcons';
import MypostView from '../../MypostView.js';
import { auth, db } from '../../firebase.js';

export default function Myposts({ navigation }) {
  const user = auth.currentUser;
  const [posts, setposts] = useState([]);
  useEffect(() => {
    db.collection('users')
      .doc(user.uid)
      .collection('image')
      .onSnapshot((snapshot) => {
        setposts(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            value: doc.data(),
          }))
        );
      });
  }, [user.uid]);

  const width = Dimensions.get('window').width;
  const height = Dimensions.get('window').height;
  return (
    <View style={{ flex: 1, alignItems: 'center', backgroundColor: 'white' }}>
      <Header
        containerStyle={{
          backgroundColor: '#13E6E6',
          borderBottomColor: 'none',
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
        centerComponent={{
          text: 'MyPosts',
          style: { color: 'white', fontSize: 20 },
        }}
      />
      <StatusBar backgroundColor="#13E6E6" />
      <ScrollView showsVerticalScrollIndicator={false}>
        {posts.map(({ id, value }) => (
          <MypostView
            key={id}
            id={id}
            photourl={value.photourl}
            caption={value.caption}
          />
        ))}
      </ScrollView>
    </View>
  )
}
