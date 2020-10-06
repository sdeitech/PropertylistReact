import React, { Component } from "react";
import { connect } from "react-redux";
import {
  View,
  Image,
  ImageBackground,
  StyleSheet,
  FlatList,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Platform,
  TextInput,
  ScrollView,
  AsyncStorage,
  Dimensions,
  Switch
} from "react-native";

import { getSavedPropertyList } from "../../Action/ActionCreators";

import { bindActionCreators } from "redux";
import { Actions } from "react-native-router-flux";
import Colors from "../../Constants/Colors";
import Strings from "../../Constants/Strings";
import LinearGradient from "react-native-linear-gradient";
import { validateEmail, showErrorMessage } from "../../Utils/Validations";
import HeaderScreen from "../CommonComponent/HeaderScreen";
import {
  ifIphoneX,
  getStatusBarHeight,
  getBottomSpace
} from "react-native-iphone-x-helper";

import { BarIndicator } from "react-native-indicators";
import OfflineNotice from "../../Utils/OfflineNotice";
import SettingScreenStyle from "./SettingScreenStyle";
import STRINGS from "../../Constants/Strings";
const DEVICE_WIDTH = Dimensions.get("window").width;
const DEVICE_HEIGHT = Dimensions.get("window").height;
import HeaderScreenStyle from "../CommonComponent/HeaderStyle";
import CardView from "react-native-cardview";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import API from "../../Constants/APIUrls";
import { WebView } from "react-native";

class StatementScreen extends Component {
  constructor() {
    super();
    this.state = {
      checked: true,
      isSpinnerVisible: false,
      visible: true
    };
  }

  showSpinner() {
    console.log("Show Spinner");
    this.setState({ visible: true });
  }

  hideSpinner() {
    console.log("Hide Spinner");
    this.setState({ visible: false });
  }

  _changeLoadingState(loadingState) {
    this.setState({
      isSpinnerVisible: loadingState
    });
  }

  componentWillMount() {
    console.log("Props >>>>" + JSON.stringify(this.props.pdfUrl));

    AsyncStorage.getItem(Strings.KEY_USER_DATA)
      .then(value => {
        if (value) {
          var userData = JSON.parse(value);
          console.log("==== UserData ===", userData);

          this.setState({ userData: userData });
          //this._changeLoadingState(true);
        }
      })
      .done();
  }

  componentWillReceiveProps(nextProps) {
    this._changeLoadingState(false);
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        {console.log("Statement Screen >>> " + this.props.title)}
        <HeaderScreen title={this.props.title} />
        <OfflineNotice />
        <View style={{ flex: 1 }}>
          {Platform.OS === "android" ? (
            <WebView
              originWhitelist={["*"]}
              onLoad={() => this.hideSpinner()}
              source={{
                uri:
                  "http://docs.google.com/gview?embedded=true&url=" +
                  this.props.pdfUrl
              }}
              style={{ flex: 1, marginTop: 0 }}
              scalesPageToFit
              javaScriptEnabled
              domStorageEnabled
              mixedContentMode="always"
              scalesPageToFit={Platform.OS === "ios" ? false : true}
              allowUniversalAccessFromFileURLs={true}
              allowFileAccessFromFileURLs={true}
              mixedContentMode="always"
              useWebKit={true}
              scrollEnabled
            />
          ) : (
            <WebView
              scalesPageToFit
              originWhitelist={["*"]}
              onLoad={() => this.hideSpinner()}
              javaScriptEnabled={true}
              scrollEnabled={true}
              bounces={false}
              style={{ flex: 1, marginTop: 0 }}
              // scalesPageToFit={Platform.OS === "ios" ? false : true}
              allowUniversalAccessFromFileURLs={true}
              allowFileAccessFromFileURLs={true}
              mixedContentMode="always"
              source={{ uri: this.props.pdfUrl }}
              scrollEnabled
            />
          )}
          {this.state.visible && (
            <View
              style={{
                flex: 1,
                left: 0,
                right: 0,
                top: DEVICE_WIDTH / 1.2,
                bottom: 0,
                position: "absolute",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: Colors.TRANSPARENT,
                width: DEVICE_WIDTH,
                height: DEVICE_HEIGHT,
                zIndex: -1
              }}
            >
              <BarIndicator color={Colors.END_COLOR} count={5} />
            </View>
          )}
        </View>
      </View>
    );
  }
}

{
  /* <WebView
              scalesPageToFit
              javaScriptEnabled
              domStorageEnabled
              mixedContentMode="always"
              style={{ flex: 1, marginTop: 0 }}
              source={{ uri: this.props.pdfUrl }}
            /> */
}

const styles = StyleSheet.create({
  container: {
    padding: 5
  },
  field: {
    color: "#d9d9d9",
    flex: 2,
    fontSize: 13,
    fontWeight: "500",
    padding: 3,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: "#d9d9d9",
    height: 40,
    marginVertical: 5
  },
  button: {
    flex: 2,
    padding: 3,
    borderRadius: 3,
    borderWidth: 1,
    backgroundColor: "#d9d9d9",
    height: 40,
    marginVertical: 10
  },
  buttonLabel: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "500"
  },
  header: {
    ...ifIphoneX(
      {
        paddingTop: getStatusBarHeight()
      },
      {
        paddingTop: 0
      }
    )
  }
});

function mapStateToProps(state) {
  return {
    PropertyListingReducer: state.PropertyListingReducer
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ getSavedPropertyList }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(StatementScreen);
