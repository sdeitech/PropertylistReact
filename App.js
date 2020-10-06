/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from "react";
import { Platform, StyleSheet, Text, View, BackHandler } from "react-native";
import { Actions, Router, Reducer, Scene } from "react-native-router-flux";


import SplashScreen from "./App/Components/SplashComponent/SplashScreen";
import SignInScreen from "./App/Components/SignInComponent/SignInScreen";
import SignUpScreen from "./App/Components/SignInComponent/SignUpScreen";
import ForgotPassword from "./App/Components/SignInComponent/ForgotPassword";


//Profile Screen
import ProfileScreen from "./App/Components/ProfileComponent/ProfileScreen";
import ProfileEditScreen from "./App/Components/ProfileComponent/ProfileEditScreen";
import ProfileChangePassword from "./App/Components/ProfileComponent/ProfileChangePassword";

//SearchLocation

import SearchLocationScreen from "./App/Components/SearchLocationComponent/SearchLocationScreen";

//Dashboard Screen 
import DashboardScreen from "./App/Components/DashboardComponent/DashboardScreen";

//Property
import PropertyDetailScreen from "./App/Components/PropertyDetailsComponent/PropertyDetailScreenNew";
import SearchPropertyScreen from "./App/Components/PropertyListingComponent/SearchPropertyScreen";


import ContactScreen from "./App/Components/ContactComponent/ContactScreenComponent";

//Inspection
import InspectionScreen from "./App/Components/InspectionScreenComponent/InspectionScreen";
import InsepectionListScreen from "./App/Components/InspectionScreenComponent/InsepectionListScreen";

//Knowlegde Screen
import KnowlegdeScreen from "./App/Components/KnowledgeComponent/KnowledgeCenterScreen";

//Knowlegde Detail Screen
import KnowledgeDetailScreen from "./App/Components/KnowledgeComponent/KnowledgeDetailScreen";


//Settings
import SettingScreen from "./App/Components/SettingComponent/SettingScreen";

//Feedback
import FeedbackScreen from "./App/Components/FeedbackComponent/FeedbackScreen";


//StatementScreen
import StatementScreen from "./App/Components/StatementOfInformationComponent/StatementScreen";

//DueDiligenceChecklistScreen
import DueDiligenceChecklistScreen from "./App/Components/StatementOfInformationComponent/DueDiligenceChecklistComponent";

//TermsAndConditions
import TermsAndPrivacy from "./App/Components/TermsAndPrivacy/TermsAndPrivacy";


//NotificationList
import NotificationList from "./App/Components/NotificationListComponent/NotificationList";

//PaymentScreen
import PaymentReportListScreen from "./App/Components/PaymentReportListComponent/PaymentReportListScreen";


//ServiceProviderScreen
import ServiceProviderScreen from "./App/Components/ServiceProviderComponent/ServiceProviderScreen";


//ChatScreen
import ChatScreen from "./App/Components/ChatComponent/ChatComponent";

//Suburb Search Screen
import SearchSuburbScreen from "./App/Components/SearchSuburbReport/SearchSuburbScreen";




const scenes = Actions.create(
  <Scene key="root">
    <Scene
      key="SplashScreen"
      component={SplashScreen}
      hideNavBar={true}
      initial
      direction="leftToRight"
    />

    <Scene
      key="signInScreen"
      component={SignInScreen}
      hideNavBar={true}
      isLater={false}
      direction="leftToRight"
    />

    <Scene
      key="signUpScreen"
      component={SignUpScreen}
      hideNavBar={true}
      isLater={false}
      direction="vertical"
      modal
    />
    <Scene
      key="forgotPasswordScreen"
      component={ForgotPassword}
      hideNavBar={true}
      isLater={false}
      direction="leftToRight"
    />

    <Scene
      key="profileScreen"
      component={ProfileScreen}
      hideNavBar={true}
      isLater={false}
      direction="leftToRight"
    />

    <Scene
      key="profileEditScreen"
      component={ProfileEditScreen}
      hideNavBar={true}
      isLater={false}
      direction="leftToRight"
    />

    <Scene
      key="dashboardScreen"
      component={DashboardScreen}
      hideNavBar={true}
      isLater={false}
      direction="leftToRight"
    />

    <Scene
      key="searchLocationScreen"
      component={SearchLocationScreen}
      hideNavBar={true}
      isLater={false}
      direction="leftToRight"
    />

    <Scene
      key="propertyDetailScreen"
      component={PropertyDetailScreen}
      hideNavBar={true}
      isLater={false}
      direction="leftToRight"
    />

    <Scene
      key="searchPropertyScreen"
      component={SearchPropertyScreen}
      hideNavBar={true}
      isLater={false}
      direction="leftToRight"
    />

    <Scene
      key="contactScreen"
      component={ContactScreen}
      hideNavBar={true}
      isLater={false}
      direction="leftToRight"
    />
    <Scene
      key="inspectionScreen"
      component={InspectionScreen}
      hideNavBar={true}
      isLater={false}
      direction="leftToRight"
    />
    <Scene
      key="insepectionListScreen"
      component={InsepectionListScreen}
      hideNavBar={true}
      isLater={false}
      direction="leftToRight"
    />
    <Scene
      key="settingScreen"
      component={SettingScreen}
      hideNavBar={true}
      isLater={false}
      direction="leftToRight"
    />

    <Scene
      key="knowledgeScreen"
      component={KnowlegdeScreen}
      hideNavBar={true}
      isLater={false}
      direction="leftToRight"
    />

    <Scene
      key="feedbackScreen"
      component={FeedbackScreen}
      hideNavBar={true}
      isLater={false}
      direction="leftToRight"
    />
    <Scene
      key="statementScreen"
      component={StatementScreen}
      hideNavBar={true}
      isLater={false}
      direction="leftToRight"
    />
    <Scene
      key="duediligencescreen"
      component={DueDiligenceChecklistScreen}
      hideNavBar={true}
      isLater={false}
      direction="leftToRight"
    />
    <Scene
      key="termsandprivacy"
      component={TermsAndPrivacy}
      hideNavBar={true}
      isLater={false}
      direction="leftToRight"
    />
    <Scene
      key="notificationList"
      component={NotificationList}
      hideNavBar={true}
      isLater={false}
      direction="leftToRight"
    />
    <Scene
      key="paymentReportListScreen"
      component={PaymentReportListScreen}
      hideNavBar={true}
      isLater={false}
      direction="leftToRight"
    />
    <Scene
      key="knowledgeDetailScreen"
      component={KnowledgeDetailScreen}
      hideNavBar={true}
      isLater={false}
      direction="leftToRight"
    />
    <Scene
      key="serviceProviderScreen"
      component={ServiceProviderScreen}
      hideNavBar={true}
      isLater={false}
      direction="leftToRight"
    />
    <Scene
      key="chatScreen"
      component={ChatScreen}
      hideNavBar={true}
      isLater={false}
      direction="leftToRight"
    />
    <Scene
      key="searchSuburbScreen"
      component={SearchSuburbScreen}
      hideNavBar={true}
      isLater={false}
      direction="leftToRight"
    />
    <Scene
      key="profileChangePassword"
      component={ProfileChangePassword}
      hideNavBar={true}
      isLater={false}
      direction="leftToRight"
    />

  
  </Scene>
);


// To see all the requests in the chrome Dev tools in the network tab.
// XMLHttpRequest = GLOBAL.originalXMLHttpRequest ?
//   GLOBAL.originalXMLHttpRequest :
//   GLOBAL.XMLHttpRequest;

// // fetch logger
// global._fetch = fetch;
// global.fetch = function (uri, options, ...args) {
//   return global._fetch(uri, options, ...args).then((response) => {
//     console.log('Fetch', { request: { uri, options, ...args }, response });
//     return response;
//   });
// };

if (typeof GLOBAL !== "undefined") {
  // Route network requests through Chrome's native XMLHttpRequest
  GLOBAL.XMLHttpRequest =
    GLOBAL.originalXMLHttpRequest || GLOBAL.XMLHttpRequest;

  // Use native Blob for native XMLHttpRequest set above
  GLOBAL.Blob = GLOBAL.originalBlob || GLOBAL.Blob;

  // Use native FileReader to read native Blob set above
  GLOBAL.FileReader = GLOBAL.originalFileReader || GLOBAL.FileReader;
}

export default class App extends Component {

  componentDidMount() {
    //listens to hardwareBackPress
    BackHandler.addEventListener("hardwareBackPress", () => {
      try {
        Actions.pop();
        return true;
      } catch (err) {
        console.debug("Can't pop. Exiting the app...");
        return false;
      }
    });
  }

  componentWillUnmount() {
    console.log("Unmounting app, removing listeners");
    BackAndroid.removeEventListener('hardwareBackPress');
  }

  render() {
    return (
      <Router
        scenes={scenes}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
