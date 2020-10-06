/** @format */
import React, { Component } from "react";
import { AppRegistry, Platform } from "react-native";
import App from "./App";
import { name as appName } from "./app.json";
import { Provider } from "react-redux";
import configureStore from "./App/Store/configureStore";
import KeyboardManager from "react-native-keyboard-manager";

const store = configureStore();
console.disableYellowBox = true;

if (Platform.OS === "ios") {
  KeyboardManager.setEnable(true);
  KeyboardManager.setToolbarPreviousNextButtonEnable(true);
}
if (typeof GLOBAL !== "undefined") {
  // Route network requests through Chrome's native XMLHttpRequest
  GLOBAL.XMLHttpRequest =
    GLOBAL.originalXMLHttpRequest || GLOBAL.XMLHttpRequest;

  // Use native Blob for native XMLHttpRequest set above
  GLOBAL.Blob = GLOBAL.originalBlob || GLOBAL.Blob;

  // Use native FileReader to read native Blob set above
  GLOBAL.FileReader = GLOBAL.originalFileReader || GLOBAL.FileReader;
}

const ReduxApp = () => (
  <Provider store={store}>
    <App />
  </Provider>
);

AppRegistry.registerComponent(appName, () => ReduxApp);
