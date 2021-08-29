import React, {Component} from 'react';
import {createMaterialBottomTabNavigator} from "@react-navigation/material-bottom-tabs";
import Feed from '../screens/Feed';
import CreateStory from "../screens/CreateStory";
import { RFValue } from 'react-native-responsive-fontsize';
import {StyleSheet} from 'react-native';
import firebase from "firebase";

// You can import Ionicons from @expo/vector-icons/Ionicons if you use Expo or
// react-native-vector-icons/Ionicons otherwise.
import Ionicons from 'react-native-vector-icons/Ionicons';

// (...)
const Tab = createMaterialBottomTabNavigator();

export default class BottomTabNavigator extends Component {
  constructor(props) {
    super(props);
    this.state = {
    light_theme:true,
    isUpdated:false  
  };
  }
renderFeed=(props)=>{
  return <Feed setUpdateToFalse={this.removeUpdate}{...props}/>
}
renderCreateStory=(props)=>{
  return <CreateStory setUpdateToTrue={this.changeUpdate}{...props}/>
}
changeUpdate=()=>{
  this.setState({isUpdated:true})
}
removeUpdate=()=>{
  this.setState({isUpdated:false})
}

  componentDidMount() {
    this.fetchUser()
  }
  async fetchUser(){
    let theme,name,image;
    await firebase.database().ref("/users/"+firebase.auth().currentUser.uid)
    .on("value",function(snapshot){
      theme=snapshot.val().current_theme;
      name="${snapshot.val().first_name}${snapshot.val().last_name}";
      image=snapshot.val().profile_picture;
    })
    this.setState({
      light_theme:theme==="light"?true:false,
      isEnabled:theme==="light"?false:true,
    name:name,
    profile_image:image
    })
  }
render(){
  return (
    
      <Tab.Navigator
      labeled={false}
      barStyle={this.state.light_theme?styles.bottomTabStyleLight:styles.bottomTabStyle}
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Feed') {
              iconName = focused
                ? 'book'
                : 'book-outline';
            } else if (route.name === 'CreateStory') {
              iconName = focused ? 'create' : 'create-outline';
            }

            // You can return any component that you like here!
            return <Ionicons name={iconName} size={size} color={color} style={styles.icon}/>;
          },
        })}
        tabBarOptions={{
          activeTintColor: 'tomato',
          inactiveTintColor: 'gray',
        }}
      >
        <Tab.Screen name="Feed" component={this.renderFeed} options={{
          unmountOnBlur:true
        }}/>
        <Tab.Screen name="CreateStory" component={this.renderCreateStory} options={{
          unmountOnBlur:true
        }}/>
      </Tab.Navigator>
   
  );
}}
const styles=StyleSheet.create({
  bottomTabStyle:{
    backgroundColor:"#2f345d",
    height:"8%",
borderTopLeftRadius:30,
borderTopRightRadius:30,
overflow:"hidden",
position:"absolute",
  },
   bottomTabStyleLight:{
    backgroundColor:"#eaeaea",
    height:"8%",
borderTopLeftRadius:30,
borderTopRightRadius:30,
overflow:"hidden",
position:"absolute",
  },
 
})
