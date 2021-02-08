import * as React from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  StatusBar,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from './src/navigation/node_modules/@react-navigation/stack';
import { createDrawerNavigator } from './src/navigation/node_modules/@react-navigation/drawer';
import {
  MaterialCommunityIcons,
  Ionicons,
  MaterialIcons,
} from '@expo/vector-icons';
import Mystacks from './src/navigation/Mystack'
console.disableYellowBox = true;
export default function App() {
  return (
    <NavigationContainer>
      <StatusBar backgroundColor="#EA8BA5" />
      <Mystacks />
    </NavigationContainer>
  );
}
