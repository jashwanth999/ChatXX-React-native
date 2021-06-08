import * as React from 'react';
import {
  StatusBar
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import {LogBox} from 'react-native'
import Mystacks from './navigation/Mystack'
LogBox.ignoreLogs(['Warning: ...']);
LogBox.ignoreAllLogs();
console.disableYellowBox = true;
export default function App() {
  return (
    <NavigationContainer>
      <StatusBar backgroundColor="#EA8BA5" />
      <Mystacks />
    </NavigationContainer>
  );
}
