import React, { Component } from "react";
import { connect } from "react-redux";
import {
  View,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  Alert,
  Platform,
  TextInput,
  ScrollView,
  AsyncStorage,
  ImageEditor,
  TouchableWithoutFeedback,
  Dimensions,
  KeyboardAvoidingView,
  Linking,
  Keyboard,
  Modal,
  TouchableHighlight
} from "react-native";

import { userSignup } from "../../Action/ActionCreators";

import {
  loginUserNameChanged,
  loginPasswordChanged,
  forgotEmailChanged,
  clearForgotResponse,
  showLoading,
  resetState,
  clearResponse
} from "./SignInAction";

import { bindActionCreators } from "redux";
import { Actions } from "react-native-router-flux";
import Colors from "../../Constants/Colors";
import Strings from "../../Constants/Strings";
import SignStyle from "./SignInScreenStyle";

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const { width, height } = Dimensions.get("window");
import BottomNavigation, {
  FullTab
} from "react-native-material-bottom-navigation";
import { CheckBox } from "react-native-elements";
import LinearGradient from "react-native-linear-gradient";
import {
  validateEmail,
  validatePassword,
  validateName,
  showErrorMessage
} from "../../Utils/Validations";
import Spinner from "react-native-loading-spinner-overlay";
import DeviceInfo from "react-native-device-info";
import STRINGS from "../../Constants/Strings";
import { BarIndicator } from "react-native-indicators";
import OfflineNotice from "../../Utils/OfflineNotice";
import FastImage from "react-native-fast-image";

class SignUpScreen extends Component {
  constructor() {
    super();
    this.state = {
      checked: false,
      username: "",
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      conpass: "",
      isSpinnerVisible: false
    };
  }

  componentWillMount() {}

  componentDidMount() {}

  componentWillUnmount() {}

  componentWillReceiveProps(nextProps) {
    this._changeLoadingState(false);
    console.log(
      "SignUp Screen >>>>> " + JSON.stringify(nextProps.SignUpReducer.signupRes)
    );

    console.log(
      "componentWillReceiveProps Loader State >>>>> " +
        this.state.isSpinnerVisible
    );

    if (
      nextProps.SignUpReducer.signupRes !== undefined &&
      nextProps.SignUpReducer.signupRes !== ""
    ) {
      if (
        nextProps.SignUpReducer.signupRes.code !== undefined &&
        nextProps.SignUpReducer.signupRes.code === Strings.STATUS_OK
      ) {
        Alert.alert(
          Strings.APP_NAME,
          nextProps.SignUpReducer.signupRes.message,
          [
            {
              text: "OK",
              onPress: () => Actions.signInScreen({ type: "reset" })
            }
          ],
          { cancelable: false }
        );
      } else {
        Alert.alert(
          Strings.APP_NAME,
          nextProps.SignUpReducer.signupRes.message,
          [
            {
              text: "OK",
              onPress: () => console.log("")
            }
          ],
          { cancelable: false }
        );
      }
    } else {
      Alert.alert(
        Strings.APP_NAME,
        Strings.SERVER_ERROR,
        [
          {
            text: "OK",
            onPress: () => console.log("")
          }
        ],
        { cancelable: false }
      );
    }
  }

  onSubmit = () => {
    console.log("In Submit >>>>>> ");

    /* ------------------------- Register From Validation --------------------------- */

    console.log(
      "Password >>> " +
        this.state.password +
        " Confirm Password >> " +
        this.state.conpass
    );

    if (this.state.firstName.trim() === "") {
      showErrorMessage(Strings.ERROR_FIRST_NAME);
    } else if (!validateName(this.state.firstName.trim())) {
      showErrorMessage(Strings.ERROR_FIRST_NAME_INVALID);
    } else if (this.state.lastName.trim() === "") {
      showErrorMessage(Strings.ERROR_LAST_NAME);
    } else if (!validateName(this.state.lastName.trim())) {
      showErrorMessage(Strings.ERROR_LAST_NAME_INVALID);
    } else if (this.state.email.trim() === "") {
      showErrorMessage(Strings.EMAIL_EMPTY);
    } else if (!validateEmail(this.state.email.trim())) {
      showErrorMessage(Strings.ERROR_EMAIL_INVALID);
    } else if (this.state.password.trim() === "") {
      showErrorMessage(Strings.ERROR_PASSWORD_EMPTY);
    } else if (!validatePassword(this.state.password.trim())) {
      alert(Strings.ERROR_PASSWORD_INVALID);
      //showErrorMessage(Strings.ERROR_PASSWORD_INVALID);
    } else if (this.state.conpass === "") {
      showErrorMessage(Strings.ERROR_CONFRIM_PASSWORD);
    } else if (this.state.password != this.state.conpass) {
      showErrorMessage(Strings.ERROR_CONFRIM_PASSWORD_NOT_MATCH);
    } else if (!this.state.checked) {
      showErrorMessage(Strings.ERROR_TERMS_AND_CONDITIONS);
    } else {
      //--------------If All Validations satisfied the sending data to server

      const brand = DeviceInfo.getBrand();

      //console.log("Brand Name >>>> "+brand)

      var postData = {
        firstname: this.state.firstName,
        lastname: this.state.lastName,
        email: this.state.email,
        password: this.state.password,
        phone_number: "1234567890",
        profile_pic: "",
        address: "",
        state: "",
        city: "",
        zipcode: "",
        gender: "",
        dob: "",
        userType: Strings.USER_TYPE_BUYER,
        device_token: "1234",
        device_type:
          brand === Strings.BRAND_NAME_APPLE
            ? Strings.DEVCIE_TYPE_IOS
            : Strings.DEVCIE_TYPE_ANDROID,
        device_id: DeviceInfo.getUniqueID(),
        current_lat: "0",
        current_lng: "0"
      };

      this._changeLoadingState(true);
      this.props.userSignup(postData);
    }
  };

  _changeLoadingState(loadingState) {
    this.setState({
      isSpinnerVisible: loadingState
    });
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        {/* ------------------------- Background Full Screen Image --------------------------- */}
        <FastImage
          source={require("../../Assets/bg_login.png")}
          style={SignStyle.backgroundImage}
        >
          <OfflineNotice />

          {/* ------------------------- Loader Intialized --------------------------- */}

          {console.log(
            "render Loader State >>>>> " + this.state.isSpinnerVisible
          )}
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
              <BarIndicator color={Colors.WHITE} count={5} />
            </View>
          ) : null}

          {/* ------------------------- Logo and Registration Form --------------------------- */}
          <KeyboardAwareScrollView
            resetScrollToCoords={{ x: 0, y: 0 }}
            scrollEnabled={true}
            keyboardShouldPersistTaps="handled"
            enableAutoAutomaticScroll={true}
            enableOnAndroid={true}
          >
            <View style={SignStyle.signInFormContent}>
              <View style={SignStyle.signInForm}>
                <Image
                  source={require("../../Assets/logo.png")}
                  style={SignStyle.logoStyle}
                />

                <TextInput
                  selectionColor={Colors.WHITE}
                  placeholder={Strings.FIRST_NAME_PLACEHOLDER}
                  autoCapitalize={"none"}
                  keyboardType={"default"}
                  placeholderTextColor={Colors.WHITE}
                  underlineColorAndroid="transparent"
                  style={SignStyle.textInputStyleClass}
                  onChangeText={value => this.setState({ firstName: value })}
                />

                <TextInput
                  selectionColor={Colors.WHITE}
                  placeholder={Strings.LAST_NAME_PLACEHOLDER}
                  autoCapitalize={"none"}
                  keyboardType={"default"}
                  placeholderTextColor={Colors.WHITE}
                  underlineColorAndroid="transparent"
                  style={SignStyle.textInputStyleClass}
                  onChangeText={value => this.setState({ lastName: value })}
                />

                <TextInput
                  selectionColor={Colors.WHITE}
                  // Adding hint in Text Input using Place holder.
                  autoCapitalize={"none"}
                  autoCorrect={false}
                  placeholder={Strings.EMAIL_PLACEHOLDER}
                  keyboardType={"email-address"}
                  placeholderTextColor={Colors.WHITE}
                  onChangeText={value => this.setState({ email: value })}
                  // Making the Under line Transparent.
                  underlineColorAndroid="transparent"
                  // Calling the custom TextInputStyleClass.
                  style={SignStyle.textInputStyleClass}
                />

                <TextInput
                  selectionColor={Colors.WHITE}
                  // Adding hint in Text Input using Place holder.
                  placeholder={Strings.PASSWORD_PLACEHOLDER}
                  secureTextEntry={true}
                  placeholderTextColor={Colors.WHITE}
                  // Making the Under line Transparent.
                  underlineColorAndroid="transparent"
                  onChangeText={value => this.setState({ password: value })}
                  // Calling the custom TextInputStyleClass.
                  style={SignStyle.textInputStyleClass}
                />

                <TextInput
                  selectionColor={Colors.WHITE}
                  placeholder={Strings.CONFIRM_PASSWORD_PLACEHOLDER}
                  secureTextEntry={true}
                  placeholderTextColor={Colors.WHITE}
                  underlineColorAndroid="transparent"
                  style={SignStyle.textInputStyleClass}
                  onChangeText={value => this.setState({ conpass: value })}
                />

                <View
                  style={{
                    flex: 1,
                    marginLeft: 10,
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center"
                  }}
                >
                  <CheckBox
                    containerStyle={{
                      justifyContent: "flex-start",
                      marginLeft: 10,
                      padding: 0,
                      borderWidth: 0,
                      backgroundColor: "transparent",
                      color: Colors.white
                    }}
                    checked={this.state.checked}
                    size={18}
                    textStyle={{ color: Colors.WHITE, fontWeight: "400" }}
                    checkedColor={Colors.WHITE}
                    onIconPress={checked =>
                      this.setState({
                        checked: !this.state.checked,
                        modalVisible: false
                      })
                    }
                    onPress={checked =>
                      this.setState({
                        checked: !this.state.checked,
                        modalVisible: false
                      })
                    }
                  />
                  <Text>
                    <Text style={{ color: Colors.WHITE }}>
                      {"By signing up to PropertyListIt you confirm that "}
                    </Text>
                    {"\n"}
                    <Text style={{ color: Colors.WHITE }}>
                      {"you have read and agree with our"}
                    </Text>
                    {"\n"}

                    <Text
                      style={{ color: Colors.WHITE, fontWeight: "bold" }}
                      onPress={() =>
                        Linking.openURL(
                          "http://13.238.107.123:5001/terms-and-conditions-app"
                        )
                      }
                    >
                      {"Terms & Conditions"}
                    </Text>
                    <Text style={{ color: Colors.WHITE }}>{" and "}</Text>

                    <Text
                      style={{ color: Colors.WHITE, fontWeight: "bold" }}
                      onPress={() =>
                        Linking.openURL(
                          "http://13.238.107.123:5001/privacy-policy-app"
                        )
                      }
                    >
                      {"Privacy Policy"}
                    </Text>
                  </Text>
                </View>

                <TouchableOpacity
                  activeOpacity={0.5}
                  onPress={() => this.onSubmit()}
                >
                  <LinearGradient
                    colors={[Colors.START_COLOR, Colors.END_COLOR]}
                    style={SignStyle.roundedButtonStyleAppTheme}
                  >
                    <Text style={{ color: Colors.WHITE }}>
                      {" "}
                      {Strings.SIGN_UP_BUTTON_TEXT}{" "}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>

                <Text
                  style={{
                    color: Colors.WHITE,
                    marginTop: 20,
                    marginBottom: 10
                  }}
                >
                  or
                </Text>

                <TouchableOpacity
                  onPress={() => Actions.signInScreen({ type: "reset" })}
                  activeOpacity={0.5}
                >
                  <View style={SignStyle.roundedButtonStyleTransparent}>
                    <Text style={{ color: Colors.WHITE }}>
                      {" "}
                      {Strings.SIGN_BUTTON_TEXT}{" "}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAwareScrollView>
        </FastImage>
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    SignUpReducer: state.SignUpReducer
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ userSignup }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(SignUpScreen);
