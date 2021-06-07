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
export default function SplashScreen({ navigation }) {
  useEffect(() => {
    animate(Easing.bezier(0, 2, 1, -1));
    s();
  }, []);
  const s = () => {
    setTimeout(() => {
      navigation.navigate('drawerscreen');
    }, 1400);
  };

  let opacity = new Animated.Value(0);

  const animate = (easing) => {
    opacity.setValue(0);
    Animated.timing(opacity, {
      toValue: 1,
      duration: 1300,
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
          <Image
            source={{
              uri:
                'https://res.cloudinary.com/jashwanth/image/upload/v1612179860/hauq4vlxuw1iclw6hx0o.jpg',
            }}
            style={{ width: 100, height: 100, borderRadius: 50 }}
          />
        </Animated.View>
      </View>
      <View style={{ position: 'absolute', bottom: 20 }}>
        <Text style={{ fontSize: 25, fontWeight: 'bold', color: '#8ADAA2' }}>
          from Jashwanth
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
