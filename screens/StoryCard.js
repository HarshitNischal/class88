
import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Platform,
  StatusBar,
  Image,
  Dimensions,
  TouchableOpacity
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { RFValue } from "react-native-responsive-fontsize";
import AppLoading from "expo-app-loading";
import * as Font from "expo-font";
import firebase from "firebase"

let customFonts = {
  "Bubblegum-Sans": require("../assets/fonts/BubblegumSans-Regular.ttf")
};

export default class StoryCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fontsLoaded: false,
      light_theme:true,
      storyId:this.props.story.key,
      storyData:this.props.story.value,
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

  render() {
    if (!this.state.fontsLoaded) {
      return <AppLoading />;
    } else {
      var images={
        image_1:require("../assets/story_image_1.png"),
        image_2:require("../assets/story_image_2.png"),
        image_3:require("../assets/story_image_3.png"),
        image_4:require("../assets/story_image_4.png"),
        image_5:require("../assets/story_image_5.png"),      
      }
      return ( 
        <TouchableOpacity
          style={this.state.light_theme?styles.containerLight:styles.container}
           onPress={()=>this.props.navigation.navigate('Story',{story:this.props.story})}
        >
        <View style={styles.cardContainer}>
            <Image
              source={images[story.preview_image]}
              style={styles.storyImage}
            ></Image>

            <View style={styles.titleContainer}>
              <Text style={this.state.light_theme?styles.storyTitleTextLight:styles.storyTitleText}>
                {this.props.story.title}
              </Text>
              <Text style={this.state.light_theme?styles.storyAuthorTextLight:styles.storyAuthorText}>
                {this.props.story.author}
              </Text>
              <Text style={this.state.light_theme?styles.descriptionTextLight:styles.descriptionText}>
                {this.props.story.description}
              </Text>
            </View>
            <View style={styles.actionContainer}>
              <View style={styles.likeButton}>
                <Ionicons name={"heart"} size={RFValue(30)} color={"white"} />
                <Text style={this.state.light_theme?styles.likeTextLight:styles.likeText}>12k</Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
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
  cardContainer: {
    margin: RFValue(13),
    backgroundColor: "#2f345d",
    borderRadius: RFValue(20)
  },
  storyImage: {
    resizeMode: "contain",
    width: "95%",
    alignSelf: "center",
    height: RFValue(250)
  },
  titleContainer: {
    paddingLeft: RFValue(20),
    justifyContent: "center"
  },
  storyTitleText: {
    fontSize: RFValue(25),
    fontFamily: "Bubblegum-Sans",
    color: "white"
  },
  storyTitleTextLight: {
    fontSize: RFValue(25),
    fontFamily: "Bubblegum-Sans",
    color: "black"
  },
  storyAuthorText: {
    fontSize: RFValue(18),
    fontFamily: "Bubblegum-Sans",
    color: "white"
  },
  storyAuthorTextLight: {
    fontSize: RFValue(18),
    fontFamily: "Bubblegum-Sans",
    color: "black"
  },
  descriptionText: {
    fontFamily: "Bubblegum-Sans",
    fontSize: 13,
    color: "white",
    paddingTop: RFValue(10)
  },
  descriptionTextLight: {
    fontFamily: "Bubblegum-Sans",
    fontSize: 13,
    color: "black",
    paddingTop: RFValue(10)
  },
  actionContainer: {
    justifyContent: "center",
    alignItems: "center",
    padding: RFValue(10)
  },
  likeButton: {
    width: RFValue(160),
    height: RFValue(40),
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    backgroundColor: "#eb3948",
    borderRadius: RFValue(30)
  },
  likeText: {
    color: "white",
    fontFamily: "Bubblegum-Sans",
    fontSize: RFValue(25),
    marginLeft: RFValue(5)
  },
   likeTextLight: {
    color: "black",
    fontFamily: "Bubblegum-Sans",
    fontSize: RFValue(25),
    marginLeft: RFValue(5)
  }
});