import React, {Component} from 'react';
import {createDrawerNavigator} from "@react-navigation/drawer";
import StackNavigator from './stackNavigation';
import Profile from "../screens/Profile";
import LogOut from "../screens/LogoutScreen";
  
const Drawer = createDrawerNavigator();

const DrawerNavigator=()=> {
  return (
    
      <Drawer.Navigator initialRouteName="Home">
        <Drawer.Screen name="Home" component={StackNavigator} options={{
          unmountOnBlur:true
        }} />
        <Drawer.Screen name="Profile" component={Profile} options={{
          unmountOnBlur:true
        }} />
        <Drawer.Screen name="LogOut" component={LogOut} options={{
          unmountOnBlur:true
        }} />
      </Drawer.Navigator>
     
  );
}
export default DrawerNavigator