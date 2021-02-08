import React, { useState, useEffect } from 'react';
import MapView, { Marker } from 'react-native-maps';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  StatusBar,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {
  MaterialCommunityIcons,
  Ionicons,
  MaterialIcons,
} from '@expo/vector-icons';
import * as Location from 'expo-location';
import Constants from 'expo-constants';
import Activityind from '../styles/Activityind.js';
import { Avatar } from '../src/Story/node_modules/react-native-elements';
import { getDistance } from 'geolib';
import { auth, db } from '../auth/firebase.js';

export default function Userlocation({ navigation, route }) {
  const { userid } = route.params;
  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;
  // const userid = '1PuNh5TWZudniyzgcNJJRkBsbg82';
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [region, setRegion] = useState(null);
  const [lat, setlat] = useState(null);
  const [long, setlong] = useState(null);
  const [act, setact] = useState(true);
  const user = auth.currentUser;
  const [users, setUsers] = useState([]);
  const [presentuser, setPresentuser] = useState([]);
  const [distance, setdistance] = useState('');
  const [mainuser, setmainuser] = useState([]);
  useEffect(() => {
    db.collection('users')
      .doc(userid)
      .onSnapshot((doc) => {
        setPresentuser(doc.data());
      });
  }, [userid]);
  useEffect(() => {
    db.collection('users')
      .doc(user.uid)
      .onSnapshot((doc) => {
        setmainuser(doc.data());
      });
  }, [userid]);

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
          latitude: Number(mainuser.latitude),
          longitude: Number(mainuser.longitude),
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
          <Marker
            coordinate={{
              latitude: Number(presentuser.latitude),
              longitude: Number(presentuser.longitude),
            }}
            title={users.username}
            description="Hello">
            <Avatar
              rounded
              source={{
                uri: presentuser.propic,
              }}
            />
          </Marker>
        </MapView>
        <View
          style={{
            position: 'absolute',
            bottom: 30,
            right: 10,
          }}>
          <TouchableOpacity onPress={getdis}>
            <View
              style={{
                width: 50,
                height: 50,
                borderRadius: 50,
                alignContent: 'center',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#067491',
              }}>
              <MaterialCommunityIcons
                name="directions"
                color="white"
                size={28}
              />
            </View>
          </TouchableOpacity>
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
