import React, { useState, useEffect } from 'react';
import { View, Text, StatusBar, TextInput } from 'react-native';
import { Header } from 'react-native-elements';
import {
  MaterialCommunityIcons,
  Ionicons,
  MaterialIcons,
} from '@expo/vector-icons';
import { Avatar } from 'react-native-elements';
import { auth, storage, db } from '../../firebase.js';
import * as ImagePicker from 'expo-image-picker';
export default function Settings({ navigation }) {
  const [image, setImage] = useState(null);
  const [baseimage, setbaseimage] = React.useState('');
  const user = auth.currentUser;
  const [presentuser, setPresentuser] = useState([]);

  useEffect(() => {
    db.collection('users')
      .doc(user.uid)
      .onSnapshot((doc) => {
        setPresentuser(doc.data());
      });
  }, [user.uid]);
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
      base64: true,
    });

    if (!result.cancelled) {
      setImage(result.uri);

      let base64Img = `data:image/jpg;base64,${result.base64}`;
      setbaseimage(base64Img);
    }
  };
  const upload = () => {
    let apiUrl = 'https://api.cloudinary.com/v1_1/jashwanth/image/upload';

    let data = {
      file: baseimage,
      upload_preset: 'jashwanthclone',
    };

    fetch(apiUrl, {
      body: JSON.stringify(data),
      headers: {
        'content-type': 'application/json',
      },
      method: 'POST',
    })
      .then(async (r) => {
        let data = await r.json();
        db.collection('users').doc(user.uid).update({
          propic: data.secure_url,
        });
      })

      .catch((err) => {
        alert(err);
      });
    setImage(null);
  };
  return (
    <View>
      <Header
        containerStyle={{
          backgroundColor: '#13E6E6',
          borderBottomColor: 'none',
        }}
        leftComponent={
          <MaterialCommunityIcons
            name="close"
            color="white"
            size={25}
            onPress={() => navigation.goBack()}
          />
        }
        centerComponent={{
          text: 'Edit profile',
          style: { color: 'white', fontSize: 20 },
        }}
        rightComponent={
          <MaterialCommunityIcons
            onPress={upload}
            name="check"
            size={25}
            color="#24a0ed"
            style={{ marginLeft: '3%' }}
          />
        }
      />
      <StatusBar backgroundColor="#13E6E6" />
      <View
        style={{
          display: 'flex',
          alignItems: 'center',
          marginTop: 20,
          flexDirection: 'column',
        }}>
        {image ? (
          <Avatar
            source={{
              uri: image,
            }}
            rounded
            size="xlarge"
          />
        ) : (
          <Avatar
            source={{
              uri: presentuser.propic,
            }}
            rounded
            size="xlarge"
          />
        )}

        <View
          style={{
            width: 50,
            height: 50,
            marginBottom: 45,
            borderRadius: 50,
            alignContent: 'center',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#E04C74',
            position: 'relative',
            bottom: 40,
            left: 45,
          }}>
          <Ionicons name="camera" color="white" size={28} onPress={pickImage} />
        </View>

        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            width: '100%',
            alignContent: 'center',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Ionicons name="person" color="black" size={28} />
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
              placeholder={presentuser.username}
            />
          </View>
        </View>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            width: '100%',
            alignContent: 'center',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Ionicons name="mail" color="black" size={28} />
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
              placeholder={presentuser.email}
            />
          </View>
        </View>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            width: '100%',
            alignContent: 'center',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Ionicons
            name="ios-information-circle-sharp"
            color="black"
            size={28}
          />
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
              Nick name
            </Text>
            <TextInput
              style={{
                height: 40,
                marginLeft: 7,
               
              
                fontSize: 17,
              }}
              placeholder="Nick name"
            />
          </View>
        </View>
      </View>
    </View>
  );
}
