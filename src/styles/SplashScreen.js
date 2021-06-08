import React, { useEffect } from 'react';
import { View, Text, Image } from 'react-native';
import {
  Animated,
  Easing,
  SectionList,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'
import Userlocation from '../../userlocation';
import {auth} from '../../firebase.js'
export default function SplashScreen({ navigation }) {
  const getdata=async()=>{
    try{
      
    
    }
    catch(error)
    {

    }

  }
  useEffect(() => {
    animate(Easing.bezier(0, 2, 1, -1));
    s();

  }, []);
  const user=auth.currentUser
  const s =async () => {
    const email= await AsyncStorage.getItem('email')
    console.log(email)
    setTimeout(() => {
      if(email)
      {
        navigation.navigate('drawerscreen');

      }
      else
      {
        navigation.navigate("Login")
      }
      
    }, 2000);
  };

  let opacity = new Animated.Value(0);

  const animate = (easing) => {
    opacity.setValue(0);
    Animated.timing(opacity, {
      toValue: 1,
      duration: 3000,
      easing,
    }).start();
  };

  const size = opacity.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 80],
  });

  const animatedStyles = [
    styles.box,
    {
      opacity,
      width: size,
      height: size,
    },
  ];
  return (
    <View
      style={{
        alignItems: 'center',
        alignContent: 'center',
        justifyContent: 'center',
        width: '100%',
        backgroundColor: '#13E6E6',
        flex: 1,
      }}>
      <StatusBar backgroundColor="#13E6E6" />

      <View style={styles.boxContainer}>
        <Animated.View style={animatedStyles}>
          <Text
            style={{
              color: 'white',
              fontSize: 30,
              fontWeight: 'bold',
              fontStyle: 'italic',
            }}>
            ChatX
          </Text>
        </Animated.View>
      </View>
      <View
        style={{
          position: 'absolute',
          bottom: 20,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}>
        <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white' }}>
          from
        </Text>
        <Text style={{ fontSize: 25, fontWeight: 'bold', color: '#A919DA' }}>
          Jashwanth
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  boxContainer: {
    height: 160,
    alignItems: 'center',
  },
  box: {
    marginTop: 32,
  },
});
