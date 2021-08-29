import React, {Component} from "react";
import {View, Text, Button, StyleSheet, SafeAreaView, Platform, StatusBar, Image} from "react-native"
import firebase from "firebase";
import * as Google from 'expo-google-app-auth';
import { RFValue } from "react-native-responsive-fontsize";

import AppLoading from "expo-app-loading";
import * as Font from "expo-font";
import { TouchableOpacity } from "react-native-gesture-handler";

let customFonts = {
  "Bubblegum-Sans": require("../assets/fonts/BubblegumSans-Regular.ttf")
};

export default class LoginScreen extends Component{
  constructor(props) {
    super(props);
    this.state = {
      fontsLoaded: false
    };
  }

  async _loadFontsAsync() {
    await Font.loadAsync(customFonts);
    this.setState({ fontsLoaded: true });
  }

  componentDidMount() {
    this._loadFontsAsync();
  }
  isUserEqual=(googleUser, firebaseUser)=> {
        if (firebaseUser) {
          var providerData = firebaseUser.providerData;
          for (var i = 0; i < providerData.length; i++) {
            if (providerData[i].providerId === firebase.auth.GoogleAuthProvider.PROVIDER_ID &&
                providerData[i].uid === googleUser.getBasicProfile().getId()) {
              // We don't need to reauth the Firebase connection.
              return true;
            }
          }
        }
        return false;
      }
       onSignIn=(googleUser)=> {
        console.log('Google Auth Response', googleUser);
        // We need to register an Observer on Firebase Auth to make sure auth is initialized.
        var unsubscribe = firebase.auth().onAuthStateChanged((firebaseUser) => {
          unsubscribe();
          // Check if we are already signed-in Firebase with the correct user.
          if (this.isUserEqual(googleUser, firebaseUser)) {
            // Build Firebase credential with the Google ID token.
            var credential = firebase.auth.GoogleAuthProvider.credential(
                googleUser.id_token,
                googleUser.accessToken);
      
            // Sign in with credential from the Google user.
            firebase.auth().signInWithCredential(credential)
            .then(function(result){
                if(result.additionalUserInfo.isNewUser){
                    firebase.database().ref("/users/"+result.user.uid)
                    .set({
                        gmail:result.user.email,
                        profile_picture:result.additionalUserInfo.profile.profile.profile_picture,
                        locale:result.additionalUserInfo.profile.locale,
                        first_name:result.additionalUserInfo.profile.given_name,
                        last_name:result.additionalUserInfo.profile.family_name,
                        current_theme:"dark"
                    })
                    .then(function(snapshot){
                        
                    })
                }
            })
            .catch((error) => {
              // Handle Errors here.
              var errorCode = error.code;
              var errorMessage = error.message;
              // The email of the user's account used.
              var email = error.email;
              // The firebase.auth.AuthCredential type that was used.
              var credential = error.credential;
              // ...
            });
          } else {
            console.log('User already signed-in Firebase.');
          }
        });
      }
      signInWithGoogleAsync=async()=> {
        try {
          const result = await Google.logInAsync({
            androidClientId: "826594397288-17mae5m6g3gh0d4t1cfpqsqpr4mc70gk.apps.googleusercontent.com",
            iosClientId: "826594397288-1b5j4ltokesdurtf6lmeleld7no3mn5i.apps.googleusercontent.com",
            scopes: ['profile', 'email'],
          });
      
          if (result.type === 'success') {
            this.onSignIn(result)
            return result.accessToken;
          } else {
            return { cancelled: true };
          }
        } catch (e) {
          return { error: true };
        }
      }
      render(){

        if (!this.state.fontsLoaded) {
          return <AppLoading />;
        } else {
          return (
            <View style={styles.container}>
              <SafeAreaView style={styles.droidSafeArea} />
              <View style={styles.appTitle}>
                  <Image
                    source={require("../assets/logo.png")}
                    style={styles.iconImage}
                  ></Image>
                </View>
                <View style={styles.appTitleTextContainer}>
                  <Text style={styles.appTitleText}>Storytelling App</Text>
                </View>
         
              <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button}
                 
                  onPress={()=>this.signInWithGoogleAsync()}
                  >
                     <Image
                    source={require("../assets/google_icon.png")}
                    style={styles.googleIcon}
                  ></Image>
                  <Text style={styles.googleText}>
                    Sign in With Google
                  </Text>
              </TouchableOpacity>
              </View>
              <View style={styles.cloudContainer}>
              <Image
                    source={require("../assets/cloud.png")}
                    style={styles.cloudImage}
                  ></Image>
              </View>
              </View>
              
          )
      }
    }
  }
  const styles = StyleSheet.create({ container: { flex: 1, backgroundColor: "#15193c" }, 
  droidSafeArea: { marginTop: Platform.OS === "android" ? StatusBar.currentHeight : RFValue(35) }, appTitle: { flex: 0.4, justifyContent: "center", alignItems: "center" }, appTitleText: { color: "white", textAlign: "center", fontSize: RFValue(40), fontFamily: "Bubblegum-Sans" }, buttonContainer: { flex: 0.3, justifyContent: "center", alignItems: "center" }, button: { width: RFValue(250), height: RFValue(50), flexDirection: "row", justifyContent: "space-evenly", alignItems: "center", borderRadius: RFValue(30), backgroundColor: "white" }, googleIcon: { width: RFValue(30), height: RFValue(30), resizeMode: "contain" }, googleText: { color: "black", fontSize: RFValue(20), fontFamily: "Bubblegum-Sans" },
  cloudContainer: { flex: 0.3 }, cloudImage: { position: "absolute", width: "100%", resizeMode: "contain", bottom: RFValue(-5) } });
