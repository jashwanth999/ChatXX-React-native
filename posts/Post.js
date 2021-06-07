import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StatusBar } from 'react-native';
import PostView from './PostView.js';
import { Header } from 'react-native-elements';
import { FAB, Portal, Provider } from 'react-native-paper';
import { auth, db } from '../firebase.js';
export default function Post({ navigation }) {
  const [state, setState] = React.useState({ open: false });
  const onStateChange = ({ open }) => setState({ open });
  const { open } = state;
  const [images, setImages] = useState([]);
  const user = auth.currentUser;
  const [presetuser, setpresetuser] = useState([]);
  useEffect(() => {
    db.collection('users')
      .doc(user.uid)
      .onSnapshot((doc) => {
        setpresetuser(doc.data());
      });
      db.collection('users')
      .doc(user.uid)
      .collection('images')
      .orderBy('timestamp', 'desc')
      .onSnapshot((snapshot) => {
        setImages(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            value: doc.data(),
          }))
        );
      });
  }, []);

  return (
    <View>
      <Header
        containerStyle={{
          backgroundColor: '#13E6E6',
          borderBottomColor: 'none',
        }}
        centerComponent={{
          text: 'Posts',
          style: { color: 'white', fontSize: 20 },
        }}
      />
      <StatusBar backgroundColor="#13E6E6" />
      <ScrollView style={{ height: '88.7%' }}>
        {images.map(({ id, value }) => (
          <PostView
            key={id}
            id={id}
            user={user}
            caption={value.caption}
            photourl={value.photourl}
            propic={value.propic}
            username={value.username}
            navigation={navigation}
            photolikes={value.likes}
            isliked={value.isliked}
            presentpropic={presetuser.propic}
          />
        ))}
      </ScrollView>

      <Provider>
        <Portal>
          <FAB.Group
            open={open}
            icon={open ? 'close' : 'plus'}
            actions={[
              {
                icon: 'google-photos',
                label: 'Library',
                onPress: () => navigation.navigate('postupload'),
              },
              {
                icon: 'camera-iris',
                label: 'Take Photo',
                onPress: () => console.log('Pressed email'),
              },
            ]}
            onStateChange={onStateChange}
            onPress={() => {
              if (open) {
              }
            }}
          />
        </Portal>
      </Provider>
    </View>
  );
}
