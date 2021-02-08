import React from 'react';
import { View, Text, Image, ActivityIndicator } from 'react-native';
export default function Activityind() {
  return (
    <View
      style={{
        backgroundColor: 'white',
        flex: 1,
        display: 'flex',
        alignContent: 'center',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <ActivityIndicator size="large" color="#13E6E6" />
    </View>
  );
}
