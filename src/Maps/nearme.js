import React, { useState, useEffect } from 'react';
import MapView, { Marker } from 'react-native-maps';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  StatusBar,
  SafeAreaView,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import * as Location from 'expo-location';
import { Header } from '../src/Story/node_modules/react-native-elements';
import Constants from 'expo-constants';
import Activityind from '../styles/Activityind.js';
import { Avatar } from '../src/Story/node_modules/react-native-elements';
import { Overlay } from '../src/Story/node_modules/react-native-elements';
import { auth, db } from '../auth/firebase.js';
import Mapusers from '../Followusers/Mapusers.js';
import { getDistance } from 'geolib';

export default function Mapview({ navigation }) {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [region, setRegion] = useState(null);
  const [lat, setlat] = useState(null);
  const [long, setlong] = useState(null);
  const [act, setact] = useState(true);
  const user = auth.currentUser;
  const [users, setUsers] = useState([]);
  const [presentuser, setPresentuser] = useState([]);
  const [roomid, setid] = useState('');
  useEffect(() => {
    db.collection('users')
      .doc(user.uid)
      .onSnapshot((doc) => {
        setPresentuser(doc.data());
      });
  }, [user.uid]);

  useEffect(() => {
    db.collection('users')
      .where('userid', '!=', user.uid)
      .onSnapshot((snapshot) => {
        setUsers(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            users: doc.data(),
          }))
        );
      });
  }, [user.uid]);
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
      setact(false);
    })();
  }, []);

  let text = 'Waiting..';
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);
  }
  const [isvisible, setisVisible] = useState(false);

  const toggleOverlay = () => {
    setisVisible(!isvisible);
  };
  const getdis = () => {
    console.log(
      getDistance(
        {
          latitude: Number(presentuser.latitude),
          longitude: Number(presentuser.longitude),
        },
        {
          latitude: Number(17.3833),
          longitude: Number(78.4011),
        }
      )
    );
  };

  return (
    <View
      style={{
        backgroundColor: 'white',
        flex: 1,
      }}>
      <StatusBar backgroundColor="#13E6E6" />
      <View>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: presentuser.latitude,
            longitude: presentuser.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          showsUserLocation={true}
          showsMyLocationButton={true}
          onRegionChange={region}>
          {users.map(({ users, id }) =>
            getDistance(
              {
                latitude: Number(presentuser.latitude),
                longitude: Number(presentuser.longitude),
              },
              {
                latitude: Number(users.latitude),
                longitude: Number(users.longitude),
              }
            ) < 2600 ? (
              <Marker
                onPress={() => setid(id)}
                coordinate={{
                  latitude: Number(users.latitude),
                  longitude: Number(users.longitude),
                }}
                title={users.username}
                description="Hello">
                <Avatar
                  rounded
                  source={{
                    uri: users.propic,
                  }}
                  size="medium"
                />
              </Marker>
            ) : (
              <View></View>
            )
          )}

          <MapView.Circle
            center={{
              latitude: Number(presentuser.latitude),
              longitude: Number(presentuser.longitude),
            }}
            radius={2600}
            strokeWidth={2}
            strokeColor={'#ff3333'}
          />
        </MapView>
        <View
          style={{
            width: '100%',
            position: 'absolute',
            bottom: 0,
            alignItems: 'center',
          }}>
          
          <ScrollView
            horizontal
            style={{ alignItems: 'center', alignContent: 'center' }}>
            {users.map(({ users, id }) =>
              getDistance(
                {
                  latitude: Number(presentuser.latitude),
                  longitude: Number(presentuser.longitude),
                },
                {
                  latitude: Number(users.latitude),
                  longitude: Number(users.longitude),
                }
              ) < 2600 ? (
                <Mapusers
                  avatar_url={users.propic}
                  username={users.username}
                  userid={users.userid}
                  navigation={navigation}
                />
              ) : (
                <View></View>
              )
            )}
          </ScrollView>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  map: {
    width: '100%',
    height: '100%',
  },
});
