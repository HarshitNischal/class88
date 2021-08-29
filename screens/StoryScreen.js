import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Platform,
  StatusBar,
  Image,
  ScrollView,
  Dimensions
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import Ionicons from 'react-native-vector-icons/Ionicons';
import AppLoading from "expo-app-loading";
import * as Font from "expo-font";
import { TouchableOpacity } from "react-native-gesture-handler";
import * as Speech from "expo-speech"
import firebase from "firebase";

let customFonts = {
  "Bubblegum-Sans": require("../assets/fonts/BubblegumSans-Regular.ttf")
};


export default class StoryScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fontsLoaded: false,
      speakerColor:"grey",
      speakerIcon:"volume-high-outline",
      light_theme:true
    };
  }

  async _loadFontsAsync() {
    await Font.loadAsync(customFonts);
    this.setState({ fontsLoaded: true });
  }

 componentDidMount() {
    this._loadFontsAsync();
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
async initiateTTS(title,author,story,moral){
  const current_color=this.state.speakerColor
  this.setState({
      speakerColor:current_color==="grey"?"#ee8249"
      :"grey"
  })  
  if(current_color==="grey"){
      Speech.speak("${title}by${author}")
      Speech.speak(story)
      Speech.speak("The Moral Of The Story Is!")
      Speech.speak(moral)
  }
  else{Speech.stop}
}
  
  render() {
    if (!this.state.fontsLoaded) {
      return <AppLoading />;
    } else {
      return (
        <View style={this.state.light_theme?styles.containerLight:styles.container}>
          <SafeAreaView style={styles.droidSafeArea} />
          <View style={styles.appTitle}>
            <View style={styles.appIcon}>
              <Image
                source={require("../assets/logo.png")}
                style={styles.iconImage}
              ></Image>
            </View>
            <View style={styles.appTitleTextContainer}>
              <Text style={this.state.light_theme?styles.appTitleTextLight:styles.appTitleText}>Storytelling App</Text>
            </View>
          </View>
          <View style={styles.storyContainer}>
          <ScrollView style={styles.storyCard}>
          <Image
                source={require("../assets/story_image_1.png")}
                style={styles.storyImage}
              ></Image> 
          
          <View style={styles.dataContainer}>
          <View style={styles.titleTextContainer}>
           <Text style={this.state.light_theme?styles.storyTitleTextLight:styles.storyTitleText}>
               {this.props.route.params.story.title}
           </Text>
           <Text style={this.state.light_theme?styles.storyAuthorTextLight:styles.storyAuthorText}>
               {this.props.route.params.story.author}
           </Text>
           <Text style={this.state.light_theme?styles.storyAuthorTextLight:styles.storyAuthorText}>
               {this.props.route.params.story.created_on}
           </Text>
          </View>
          <View style={styles.iconContainer}>
         
         <TouchableOpacity onPress={()=>{this.initiateTTS(
              this.props.route.params.story.title,
              this.props.route.params.story.author,
              this.props.route.params.story.story,
              this.props.route.params.story.moral
          )}}>
              <Ionicons 
              name={this.state.speakerIcon}
              size={RFValue(30)}
              color={this.state.speakerColor}
              style={{
                  margin:RFValue(15)
              }}
              />
          </TouchableOpacity>
          </View>
          </View>
<View style={styles.storyContainer}>
        <Text style={this.state.light_theme?styles.storyTextLight:styles.storyText}>
               {this.props.route.params.story.story}
           </Text>
           <Text style={this.state.light_theme?styles.moralTextLight:styles.moralText}>
               {this.props.route.params.story.moral}
           </Text>
           </View>
           <View style={styles.actionContainer}>
<View style={styles.likeButton}>
           <Ionicons name={"heart"}size={RFValue(30)} color={"white"}/>
           <Text style={this.state.light_theme?styles.likeTextLight:styles.likeText}>
               12k
           </Text>
           </View>
         
        </View>
      </ScrollView>
      </View>
      </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#15193c"
  },
  containerLight: {
    flex: 1,
    backgroundColor: "white"
  },
  droidSafeArea: {
    marginTop: Platform.OS === "android" ? StatusBar.currentHeight : RFValue(35)
  },
  appTitle: {
    flex: 0.07,
    flexDirection: "row"
  },
  appIcon: {
    flex: 0.3,
    justifyContent: "center",
    alignItems: "center"
  },
  iconImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain"
  },
  appTitleTextContainer: {
    flex: 0.7,
    justifyContent: "center"
  },
  appTitleText: {
    color: "white",
    fontSize: RFValue(28),
    fontFamily: "Bubblegum-Sans"
  },
   appTitleTextLight: {
    color: "black",
    fontSize: RFValue(28),
    fontFamily: "Bubblegum-Sans"
  },
  storyContainer: {
    flex: 1
  },
  storyImage:{
    width: "100%",
    height: RFValue(200),
    borderTopLeftRadius:RFValue(20),
    borderTopRightRadius:RFValue(20),
    resizeMode: "contain"
  },
  dataContainer:{
      flexDirection:"row",
      padding:RFValue(20)
  },
  titleTextContainer: {
    flex: 0.8
  },
  storyTitleText: {
    color: "white",
    fontSize: RFValue(25),
    fontFamily: "Bubblegum-Sans"
  },
  storyTitleTextLight: {
    color: "black",
    fontSize: RFValue(25),
    fontFamily: "Bubblegum-Sans"
  },
  storyAuthorText: {
    color: "white",
    fontSize: RFValue(18),
    fontFamily: "Bubblegum-Sans"
  },
  storyAuthorTextLight: {
    color: "black",
    fontSize: RFValue(18),
    fontFamily: "Bubblegum-Sans"
  },
  iconContainer:{flex:0.2},
  
  moralText: {
    color: "white",
    fontSize: RFValue(20),
    fontFamily: "Bubblegum-Sans"
  },
  moralTextLight: {
    color: "black",
    fontSize: RFValue(20),
    fontFamily: "Bubblegum-Sans"
  },
  actionContainer:{
       justifyContent:"center",
       alignItems:"center",
       margin:RFValue(10)
  },
likeButton:{
    width:RFValue(160),
    height:RFValue(40),
    flexDirection:"row",
    backgroundColor:"#eb3948",
    justifyContent:"center",
       alignItems:"center",
       borderRadius:RFValue(30)
},
likeText: {
    color: "white",
    fontSize: RFValue(25),
    fontFamily: "Bubblegum-Sans",
    marginLeft:RFValue(5)
  },
  likeTextLight: {
    color: "black",
    fontSize: RFValue(25),
    fontFamily: "Bubblegum-Sans",
    marginLeft:RFValue(5)
  },
});
