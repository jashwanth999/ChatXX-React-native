import React, { useState, useEffect } from 'react';
import MapView, { Marker } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
 



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

import { Avatar } from 'react-native-elements';
import { getDistance } from 'geolib';
import { auth, db } from '../../firebase.js';


export default function Userlocation({ navigation, route }) {
  const { userid } = route.params;
  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;
  const origin = {latitude: 37.3318456, longitude: -122.0296002};
const destination = {latitude: 37.771707, longitude: -122.4053769};
const GOOGLE_MAPS_APIKEY = 'AIzaSyAd9NTbzjsqbIs1_rwyMXFXFWqWI8lnaXk';
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
    alert(
      getDistance(
        {
          latitude: Number(mainuser.latitude),
          longitude: Number(mainuser.longitude),
        },
        {
          latitude: Number(presentuser.latitude),
          longitude: Number(presentuser.longitude),
        }
      ) /
        1000 +
        'km ' +
        'distance from your place  .... (route and directions still in development)'
    );
  };

  return (
    <View
      style={{
        backgroundColor: 'white',
        flex: 1,
      }}>
      <StatusBar backgroundColor="#13E6E6" />

        <MapView
        
          style={styles.map}
          showsMyLocationButton={true}
          showsUserLocation={true}
          initialRegion={{
            latitude: presentuser.latitude,
            longitude: presentuser.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          onRegionChange={region}>
            {presentuser.latitude && presentuser.longitude?(
                <Marker
                coordinate={{
                  latitude: Number(presentuser.latitude ),
                  longitude: Number(presentuser.longitude),
                }}
                title='king'
                description="Hello">
                <Avatar
                  rounded
                  source={{
                    uri: presentuser.propic,
                  }}
                />
                </Marker>
             
            ):
            (
              <View>
                </View>
              
            )}
    
              <MapViewDirections
              origin={{latitude: presentuser.latitude,
                longitude: presentuser.longitude, latitudeDelta: 1.0,
                longitudeDelta: 1.0}}
              destination= {{latitude: mainuser.latitude,longitude: mainuser.longitude, latitudeDelta: 1.0,
                longitudeDelta: 1.0}}
              apikey={GOOGLE_MAPS_APIKEY}
              strokeWidth={3}
                strokeColor="black"
            />
          
             
        
        </MapView>
   
        <TouchableOpacity
          onPress={() => navigation.goBack()}
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

  );
}

const styles = StyleSheet.create({
  map: {
    width: '100%',
    height: '100%',
  },
});
