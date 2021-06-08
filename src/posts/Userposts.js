import React from 'react';
import { View, Text, Image } from 'react-native';
export default function Userpost({ url, caption, length }) {
  return (
    <View
      style={{
        margin: 8,
        width: 150,
        height: 150,
        backgroundColor: 'white',
        elevation: 2,
        borderRadius: 10,
      }}>
      <Image
        source={{
          uri: url,
        }}
        style={{
          width: '100%',
          height: '80%',
          resizeMode: 'cover',
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10,
        }}
      />
      <Text style={{ fontWeight: 'bold', opacity: 0.5, margin: 10 }}>
        {caption && caption.length < 15
          ? caption
          : caption && caption.slice(0, 15) + '...'}
      </Text>
    </View>
  );
}
