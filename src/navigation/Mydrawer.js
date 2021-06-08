import React from 'react'
import { createDrawerNavigator } from '@react-navigation/drawer';
import Drawercontent from '../styles/Drawercontent.js';
import Mytabs from './Mytabs'
const Drawer = createDrawerNavigator();
export default function MyDrawer() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => (
        <Drawercontent navigation={props.navigation} />
      )}>
      <Drawer.Screen name="mytabs" component={Mytabs} />
    </Drawer.Navigator>
  );
}