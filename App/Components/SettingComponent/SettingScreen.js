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
  Platform,
  TextInput,
  ScrollView,
  AsyncStorage,
  Dimensions,
  Switch
} from "react-native";

import { getNotificationSetting } from "../../Action/ActionCreators";

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

class SettingScreen extends Component {
  constructor() {
    super();
    this.state = {
      checked: true,
      email: "",
      password: "",
      visible: false,
      isSpinnerVisible: false,
      activeTab: Strings.HOME_KEY,
      is_active: true,
      propertyData: [],
      isMapView: false,
      userData: "",
      switchEmailAlert: true,
      switchPushNotificationContact: true,
      switchPushNotificationInspection: true,
      switchPushNotificationSold: true
    };
  }

  componentWillMount() {
    AsyncStorage.getItem(Strings.KEY_USER_DATA)
      .then(value => {
        if (value) {
          var userData = JSON.parse(value);
          console.log("==== ID ===", userData);

          this.setState({ userData: userData });

          var postData = {
            buyerId: userData._id
          };

          this.props.getNotificationSetting(postData, userData.token);
          this._changeLoadingState(true);
        }
      })
      .done();
  }

  componentWillReceiveProps(nextProps) {
    this._changeLoadingState(false);

    let notificationResponse = nextProps.SettingReducer.getNotificationRes;

    console.log(
      "Setting Screen componentWillReceiveProps >> " +
        JSON.stringify(nextProps.SettingReducer)
    );

    if (notificationResponse !== undefined) {
      if (notificationResponse.code === Strings.STATUS_OK) {
        if (notificationResponse.data) {
          this.setState({
            switchEmailAlert: notificationResponse.data.emailNotification,
            switchPushNotificationContact:
              notificationResponse.data.pushNotification,
            switchPushNotificationInspection:
              notificationResponse.data.InspectionNotification,
            switchPushNotificationSold:
              notificationResponse.data.pushNotificationAlert
          });
        }
      } else {
        alert(notificationResponse.message);
      }
    }
  }

  onSubmit = () => {
    /// Actions.signUpScreen({ type: "reset" });

    if (this.state.email === "") {
      showErrorMessage(Strings.ERROR_EMAIL);
    } else if (!validateEmail(this.state.email)) {
      showErrorMessage(Strings.ERROR_EMAIL_INVALID);
    } else if (this.state.password === "") {
      showErrorMessage(Strings.ERROR_PASSWORD_EMPTY);
    } else {
      // const brand = DeviceInfo.getBrand();
      // var postData = {
      //     "email": this.state.email,
      //     "password": this.state.password,
      //     "userType": Strings.USER_TYPE_BUYER,
      //     "device_token": "1234",
      //     "device_type": brand === Strings.BRAND_NAME_APPLE ? Strings.DEVCIE_TYPE_IOS : Strings.DEVCIE_TYPE_ANDROID,
      //     "device_id": DeviceInfo.getUniqueID(),
      // };

      // this._changeLoadingState(true);
      // this.props.loginUser(postData);

      Actions.profileScreen();
    }
  };

  _changeLoadingState(loadingState) {
    this.setState({
      isSpinnerVisible: loadingState
    });
  }

  _toogleList() {
    this.setState({
      isMapView: !this.state.isMapView
    });
  }

  toggleSwitch1(value) {
    this.setState({ switchEmailAlert: value });
    console.log("Switch 1 is: " + value);
  }

  toggleSwitch2(value) {
    this.setState({ switchPushNotificationContact: value });
    console.log("Switch 2 is: " + value);
  }

  toggleSwitch3(value) {
    this.setState({ switchPushNotificationInspection: value });
    console.log("Switch 3 is: " + value);
  }

  toggleSwitch4(value) {
    this.setState({ switchPushNotificationSold: value });
    console.log("Switch 4 is: " + value);
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <OfflineNotice />
        <HeaderScreen title={Strings.SETTING} />
        <View style={{ flex: 1 }}>
          <CardView
            cardElevation={10}
            cornerRadius={5}
            style={SettingScreenStyle.settingCardContainer}
          >
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: "row", margin: 10 }}>
                <View style={{ flex: 0.8 }}>
                  <Text style={{ fontSize: 15, marginTop: 5 }}>
                    {"Email alert when you receive a new message from a seller"}
                  </Text>
                </View>
                <View style={{ flex: 0.2 }}>
                  <Switch
                    style={{ transform: [{ scaleX: 0.7 }, { scaleY: 0.7 }] }}
                    onValueChange={value => this.toggleSwitch1(value)}
                    value={this.state.switchEmailAlert}
                  />
                </View>
              </View>

              <View style={SettingScreenStyle.horizontalDivider} />

              <View style={{ flexDirection: "row", margin: 10 }}>
                <View style={{ flex: 0.8 }}>
                  <Text style={{ fontSize: 15, marginTop: 5 }}>
                    {
                      "Push notification when a property seller has accepted your contact request"
                    }
                  </Text>
                </View>
                <View style={{ flex: 0.2 }}>
                  <Switch
                    style={{ transform: [{ scaleX: 0.7 }, { scaleY: 0.7 }] }}
                    onValueChange={value => this.toggleSwitch2(value)}
                    value={this.state.switchPushNotificationContact}
                  />
                </View>
              </View>

              <View style={SettingScreenStyle.horizontalDivider} />

              <View style={{ flexDirection: "row", margin: 10 }}>
                <View style={{ flex: 0.8 }}>
                  <Text style={{ fontSize: 15, marginTop: 5 }}>
                    {"Push notification for inspections"}
                  </Text>
                </View>
                <View style={{ flex: 0.2 }}>
                  <Switch
                    style={{ transform: [{ scaleX: 0.7 }, { scaleY: 0.7 }] }}
                    onValueChange={value => this.toggleSwitch3(value)}
                    value={this.state.switchPushNotificationInspection}
                  />
                </View>
              </View>

              <View style={SettingScreenStyle.horizontalDivider} />

              <View style={{ flexDirection: "row", margin: 10 }}>
                <View style={{ flex: 0.8 }}>
                  <Text style={{ fontSize: 15, marginTop: 5 }}>
                    {
                      "Email alert when a connected property is marked as Sold to another buyer. No info of buyer will be shown."
                    }
                  </Text>
                </View>
                <View style={{ flex: 0.2 }}>
                  <Switch
                    style={{ transform: [{ scaleX: 0.7 }, { scaleY: 0.7 }] }}
                    onValueChange={value => this.toggleSwitch4(value)}
                    value={this.state.switchPushNotificationSold}
                  />
                </View>
              </View>

              {this.state.isSpinnerVisible ? (
                <View
                  style={{
                    flex: 1,
                    left: 0,
                    right: 0,
                    top: 0,
                    bottom: 0,
                    position: "absolute",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: Colors.TRANSPARENT,
                    width: window.width,
                    height: window.height
                  }}
                >
                  <BarIndicator color={Colors.END_COLOR} count={5} />
                </View>
              ) : null}
            </View>
          </CardView>

          <View style={{ alignItems: "center" }}>
            <TouchableOpacity
              onPress={() => this._updateSetting()}
              activeOpacity={0.5}
            >
              <LinearGradient
                colors={["#00C2D7", "#4EE1CA"]}
                style={SettingScreenStyle.buttonStyleAppTheme}
              >
                <Text style={{ color: "white", fontWeight: "600" }}>
                  {" "}
                  {Strings.BUTTON_TEXT_SAVE_SETTINGS}{" "}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  async _updateSetting() {
    this._changeLoadingState(true);
    var postData = {
      userId: this.state.userData._id,
      pushNotificationAlert: this.state.switchPushNotificationSold.toString(),
      pushNotification: this.state.switchPushNotificationContact.toString(),
      emailNotification: this.state.switchEmailAlert.toString(),
      InspectionNotification: this.state.switchPushNotificationInspection.toString()
    };

    console.log(
      "_updateSetting PostData URL >>> " +
        JSON.stringify(API.SEND_NOTIFICATION_SETTING_REQUEST)
    );
    console.log("_updateSetting PostData >>> " + JSON.stringify(postData));

    fetch(API.SEND_NOTIFICATION_SETTING_REQUEST, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: this.state.userData.token
      },
      body: JSON.stringify(postData)
    })
      .then(response => response.json())
      .then(responseJson => {
        this._changeLoadingState(false);
        //this._changeLoadingState(false);
        console.log(
          "Response Send Contact Request >>>> " + JSON.stringify(responseJson)
        );

        if (responseJson !== undefined) {
          if (responseJson.code == Strings.STATUS_OK) {
            Alert.alert(
              Strings.APP_NAME,
              responseJson.message,
              [{ text: "Ok", onPress: () => Actions.pop() }],
              { cancelable: false }
            );
          } else {
            alert(responseJson.message);
          }
        }
      })
      .catch(error => {
        this._changeLoadingState(false);
        //this._changeLoadingState(false);
        console.log(error);
        alert(Strings.ALERT_SERVER_ERROR);
      });
  }
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
    SettingReducer: state.SettingReducer
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ getNotificationSetting }, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SettingScreen);
