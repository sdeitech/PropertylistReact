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
  TouchableHighlight
} from "react-native";

import { Header } from "react-native-elements";
import HeaderScreenStyle from "./HeaderStyle";
import Colors from "../../Constants/Colors";
import Strings from "../../Constants/Strings";
import { bindActionCreators } from "redux";
import { Actions } from "react-native-router-flux";
import { loginUser } from "../../Action/ActionCreators";
import { Icon, SearchBar } from "react-native-elements";
import {
  ifIphoneX,
  getStatusBarHeight,
  getBottomSpace
} from "react-native-iphone-x-helper";
//import Icon from "react-native-vector-icons/FontAwesome";
import Modal from "react-native-modal";

class HeaderScreen extends Component {
  constructor() {
    super();
    this.state = {
      isSpinnerVisible: false,
      isModalVisible: false
    };
  }

  _toggleModal() {
    this.setState({ isModalVisible: !this.state.isModalVisible });
    this.renderModal();
  }

  componentWillReceiveProps(nextProps) {
    this._changeLoadingState(false);
  }

  onSubmit = () => {};

  _changeLoadingState(loadingState) {
    this.setState({
      isSpinnerVisible: loadingState
    });
  }

  goToLogin = () => {
    Actions.signInScreen({ type: "reset" });
  };

  showLogoutAlert() {
    Alert.alert(
      Strings.APP_NAME,
      "Are you sure , you want the exit the app ?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "Logout", onPress: () => this.logoutFromApp() }
      ],
      { cancelable: false }
    );
  }

  logoutFromApp() {
    AsyncStorage.removeItem(Strings.KEY_USER_DATA);
    Actions.signInScreen({ type: "reset" });
    //    if(this.removeItemValue(Strings.KEY_USER_DATA)){
    //        Actions.signInScreen({ type: "reset" });
    //    }
  }

  // async removeItemValue(key) {
  //     try {
  //         await AsyncStorage.removeItem(key);
  //         return true;
  //     }
  //     catch (exception) {
  //         return false;
  //     }
  // }

  renderLeftOne(screenName) {
    switch (screenName) {
      case Strings.PROFILE_SCREEN_TITLE:
        return (
          <TouchableOpacity
            hitSlop={HeaderScreenStyle.touchableAreaStyle}
            onPress={() => Actions.dashboardScreen({ type: "reset" })}
          >
            {/* <Image source={require("../../Assets/back_arrow.png")} /> */}
            <Icon
              containerStyle={styles.iconStyle}
              name="ios-arrow-back"
              type="ionicon"
              color={Colors.WHITE}
            />
          </TouchableOpacity>
        );

      case Strings.CHANGE_PASSWORD:
        return (
          <TouchableOpacity
            hitSlop={HeaderScreenStyle.touchableAreaStyle}
            onPress={() => Actions.pop()}
          >
            {/* <Image source={require("../../Assets/back_arrow.png")} /> */}
            <Icon
              containerStyle={styles.iconStyle}
              name="ios-arrow-back"
              type="ionicon"
              color={Colors.WHITE}
            />
          </TouchableOpacity>
        );

      case Strings.PROFILE_EDIT_SCREEN_TITLE:
        return (
          <TouchableOpacity
            hitSlop={HeaderScreenStyle.touchableAreaStyle}
            onPress={() => Actions.pop()}
          >
            {/* <Image source={require("../../Assets/back_arrow.png")} /> */}
            <Icon
              containerStyle={styles.iconStyle}
              name="ios-arrow-back"
              type="ionicon"
              color={Colors.WHITE}
            />
          </TouchableOpacity>
        );

      case Strings.PROPERTY_DETIAL_SCREEN_TITLE:
        return (
          <TouchableOpacity
            hitSlop={HeaderScreenStyle.touchableAreaStyle}
            onPress={() => {
              Actions.pop();
              setTimeout(() => {
                Actions.refresh({
                  someprop: Math.random() * 100
                });
              }, 10);
            }}
          >
            {/* <Image source={require("../../Assets/back_arrow.png")} /> */}
            <Icon
              containerStyle={styles.iconStyle}
              name="ios-arrow-back"
              type="ionicon"
              color={Colors.WHITE}
            />
          </TouchableOpacity>
        );

      case Strings.PROPERTY_HOME_SCREEN_TITLE:
        return (
          <TouchableOpacity
            hitSlop={HeaderScreenStyle.touchableAreaStyle}
            onPress={() => Actions.searchLocationScreen()}
          >
            {/* <Image source={require("../../Assets/help.png")} /> */}
            <Icon
              containerStyle={styles.iconStyle}
              name="ios-arrow-back"
              type="ionicon"
              color={Colors.WHITE}
            />
          </TouchableOpacity>
        );

      case Strings.PROPERTY_SEARCH_SCREEN_TITLE:
        return (
          <TouchableOpacity
            hitSlop={HeaderScreenStyle.touchableAreaStyle}
            onPress={() => Actions.pop()}
          >
            {/* <Image source={require("../../Assets/back_arrow.png")} /> */}
            <Icon
              containerStyle={styles.iconStyle}
              name="ios-arrow-back"
              type="ionicon"
              color={Colors.WHITE}
            />
          </TouchableOpacity>
        );

      case Strings.CONTACT_LIST_SCREEN_TITLE:
        return (
          <TouchableOpacity
            hitSlop={HeaderScreenStyle.touchableAreaStyle}
            onPress={() => Actions.pop()}
          >
            {/* <Image source={require("../../Assets/back_arrow.png")} /> */}
            <Icon
              containerStyle={{ marginTop: 18 }}
              name="ios-arrow-back"
              type="ionicon"
              color={Colors.WHITE}
            />
          </TouchableOpacity>
        );

      case Strings.CONTACT_LIST_SCREEN_TITLE:
        return (
          <TouchableOpacity
            hitSlop={HeaderScreenStyle.touchableAreaStyle}
            onPress={() => Actions.pop()}
          >
            {/* <Image source={require("../../Assets/back_arrow.png")} /> */}
            <Icon
              containerStyle={styles.iconStyle}
              name="ios-arrow-back"
              type="ionicon"
              color={Colors.WHITE}
            />
          </TouchableOpacity>
        );

      case Strings.INSPECTION_SCREEN_TITLE:
        return (
          <TouchableOpacity
            hitSlop={HeaderScreenStyle.touchableAreaStyle}
            onPress={() => Actions.pop()}
          >
            {/* <Image source={require("../../Assets/back_arrow.png")} /> */}
            <Icon
              containerStyle={styles.iconStyle}
              name="ios-arrow-back"
              type="ionicon"
              color={Colors.WHITE}
            />
          </TouchableOpacity>
        );

      case Strings.SETTING:
        return (
          <TouchableOpacity
            hitSlop={HeaderScreenStyle.touchableAreaStyle}
            onPress={() => Actions.pop()}
          >
            {/* <Image source={require("../../Assets/back_arrow.png")} /> */}
            <Icon
              containerStyle={styles.iconStyle}
              name="ios-arrow-back"
              type="ionicon"
              color={Colors.WHITE}
            />
          </TouchableOpacity>
        );

      case Strings.KNOWLEDGE_SCREEN_TITLE:
        return (
          <TouchableOpacity
            hitSlop={HeaderScreenStyle.touchableAreaStyle}
            onPress={() => Actions.pop()}
          >
            {/* <Image source={require("../../Assets/back_arrow.png")} /> */}
            <Icon
              containerStyle={styles.iconStyle}
              name="ios-arrow-back"
              type="ionicon"
              color={Colors.WHITE}
            />
          </TouchableOpacity>
        );

      case Strings.FEEDBACK_SCREEN_TITLE:
        return (
          <TouchableOpacity
            hitSlop={HeaderScreenStyle.touchableAreaStyle}
            onPress={() => Actions.pop()}
          >
            {/* <Image source={require("../../Assets/back_arrow.png")} /> */}
            <Icon
              containerStyle={styles.iconStyle}
              name="ios-arrow-back"
              type="ionicon"
              color={Colors.WHITE}
            />
          </TouchableOpacity>
        );

      case Strings.LABEL_STATEMENT_OF_INFORMATION:
        return (
          <TouchableOpacity
            hitSlop={HeaderScreenStyle.touchableAreaStyle}
            onPress={() => Actions.pop()}
          >
            {/* <Image source={require("../../Assets/back_arrow.png")} /> */}
            <Icon
              containerStyle={styles.iconStyle}
              name="ios-arrow-back"
              type="ionicon"
              color={Colors.WHITE}
            />
          </TouchableOpacity>
        );

      case Strings.LABEL_DUE_DILIGENCE_REPORT:
        return (
          <TouchableOpacity
            hitSlop={HeaderScreenStyle.touchableAreaStyle}
            onPress={() => Actions.pop()}
          >
            {/* <Image source={require("../../Assets/back_arrow.png")} /> */}
            <Icon
              containerStyle={styles.iconStyle}
              name="ios-arrow-back"
              type="ionicon"
              color={Colors.WHITE}
            />
          </TouchableOpacity>
        );

      case Strings.LABEL_AUTO_VALUATION_REPORT:
        return (
          <TouchableOpacity
            hitSlop={HeaderScreenStyle.touchableAreaStyle}
            onPress={() => Actions.pop()}
          >
            {/* <Image source={require("../../Assets/back_arrow.png")} /> */}
            <Icon
              containerStyle={styles.iconStyle}
              name="ios-arrow-back"
              type="ionicon"
              color={Colors.WHITE}
            />
          </TouchableOpacity>
        );

      case Strings.LABEL_PROPERTY_REPORT:
        return (
          <TouchableOpacity
            hitSlop={HeaderScreenStyle.touchableAreaStyle}
            onPress={() => Actions.pop()}
          >
            {/* <Image source={require("../../Assets/back_arrow.png")} /> */}
            <Icon
              containerStyle={styles.iconStyle}
              name="ios-arrow-back"
              type="ionicon"
              color={Colors.WHITE}
            />
          </TouchableOpacity>
        );

      case Strings.LABEL_SUBURB_REPORT:
        return (
          <TouchableOpacity
            hitSlop={HeaderScreenStyle.touchableAreaStyle}
            onPress={() => Actions.pop()}
          >
            {/* <Image source={require("../../Assets/back_arrow.png")} /> */}
            <Icon
              containerStyle={styles.iconStyle}
              name="ios-arrow-back"
              type="ionicon"
              color={Colors.WHITE}
            />
          </TouchableOpacity>
        );

      case Strings.LABEL_BROCHURE:
        return (
          <TouchableOpacity
            hitSlop={HeaderScreenStyle.touchableAreaStyle}
            onPress={() => Actions.pop()}
          >
            {/* <Image source={require("../../Assets/back_arrow.png")} /> */}
            <Icon
              containerStyle={styles.iconStyle}
              name="ios-arrow-back"
              type="ionicon"
              color={Colors.WHITE}
            />
          </TouchableOpacity>
        );

      case Strings.TERMS_AND_CONDITIONS_TITLE:
        return (
          <TouchableOpacity
            hitSlop={HeaderScreenStyle.touchableAreaStyle}
            onPress={() => Actions.pop()}
          >
            {/* <Image source={require("../../Assets/back_arrow.png")} /> */}
            <Icon
              containerStyle={styles.iconStyle}
              name="ios-arrow-back"
              type="ionicon"
              color={Colors.WHITE}
            />
          </TouchableOpacity>
        );

      case Strings.PRIVACY_POLICY_TITLE:
        return (
          <TouchableOpacity
            hitSlop={HeaderScreenStyle.touchableAreaStyle}
            onPress={() => Actions.pop()}
          >
            {/* <Image source={require("../../Assets/back_arrow.png")} /> */}
            <Icon
              containerStyle={styles.iconStyle}
              name="ios-arrow-back"
              type="ionicon"
              color={Colors.WHITE}
            />
          </TouchableOpacity>
        );

      case Strings.PAYMENT_REPORT_SCREEN_TITLE:
        return (
          <TouchableOpacity
            hitSlop={HeaderScreenStyle.touchableAreaStyle}
            onPress={() => Actions.pop()}
          >
            {/* <Image source={require("../../Assets/back_arrow.png")} /> */}
            <Icon
              containerStyle={styles.iconStyle}
              name="ios-arrow-back"
              type="ionicon"
              color={Colors.WHITE}
            />
          </TouchableOpacity>
        );

      case Strings.KNOWLEDGE_DETAIL_TITLE:
        return (
          <TouchableOpacity
            hitSlop={HeaderScreenStyle.touchableAreaStyle}
            onPress={() => Actions.pop()}
          >
            {/* <Image source={require("../../Assets/back_arrow.png")} /> */}
            <Icon
              containerStyle={styles.iconStyle}
              name="ios-arrow-back"
              type="ionicon"
              color={Colors.WHITE}
            />
          </TouchableOpacity>
        );

      case Strings.SERVICE_PROVIDER_SCREEN_TITLE:
        return (
          <TouchableOpacity
            hitSlop={HeaderScreenStyle.touchableAreaStyle}
            onPress={() => Actions.pop()}
          >
            {/* <Image source={require("../../Assets/back_arrow.png")} /> */}
            <Icon
              containerStyle={styles.iconStyle}
              name="ios-arrow-back"
              type="ionicon"
              color={Colors.WHITE}
            />
          </TouchableOpacity>
        );

      case Strings.LABEL_REAL_ESTATE_CONTRACT_INFORMATION:
        return (
          <TouchableOpacity
            hitSlop={HeaderScreenStyle.touchableAreaStyle}
            onPress={() => Actions.pop()}
          >
            {/* <Image source={require("../../Assets/back_arrow.png")} /> */}
            <Icon
              containerStyle={styles.iconStyle}
              name="ios-arrow-back"
              type="ionicon"
              color={Colors.WHITE}
            />
          </TouchableOpacity>
        );

      default:
        return null;
    }
  }

  renderCenterOne(screenName) {
    switch (screenName) {
      case Strings.PROFILE_SCREEN_TITLE:
        return (
          <View>
            <Text style={styles.titleTextStyle}>{screenName}</Text>
          </View>
        );

      case Strings.CHANGE_PASSWORD:
        return (
          <View>
            <Text style={styles.titleTextStyle}>{screenName}</Text>
          </View>
        );

      case Strings.PROFILE_EDIT_SCREEN_TITLE:
        return (
          <View>
            <Text style={styles.titleTextStyle}>{screenName}</Text>
          </View>
        );

      case Strings.PROPERTY_LIST_SCREEN_TITLE:
        return (
          <View>
            <Text style={styles.titleTextStyle}>{screenName}</Text>
          </View>
        );

      case Strings.PROPERTY_DETIAL_SCREEN_TITLE:
        return (
          <View>
            <Text style={styles.titleTextStyle}>{screenName}</Text>
          </View>
        );

      case Strings.PROPERTY_HOME_SCREEN_TITLE:
        return (
          <View>
            <Text style={styles.titleTextStyle}>{screenName}</Text>
          </View>
        );

      case Strings.PROPERTY_SEARCH_SCREEN_TITLE:
        return (
          <View>
            <Text style={styles.titleTextStyle}>{screenName}</Text>
          </View>
        );

      case Strings.CONTACT_LIST_SCREEN_TITLE:
        return (
          <View>
            <Text style={styles.titleTextStyle}>{screenName}</Text>
          </View>
        );

      case Strings.INSPECTION_SCREEN_TITLE:
        return (
          <View>
            <Text style={styles.titleTextStyle}>{screenName}</Text>
          </View>
        );

      case Strings.SETTING:
        return (
          <View>
            <Text style={styles.titleTextStyle}>{screenName}</Text>
          </View>
        );
      case Strings.KNOWLEDGE_SCREEN_TITLE:
        return (
          <View>
            <Text style={styles.titleTextStyle}>{screenName}</Text>
          </View>
        );

      case Strings.FEEDBACK_SCREEN_TITLE:
        return (
          <View>
            <Text style={styles.titleTextStyle}>{screenName}</Text>
          </View>
        );

      case Strings.LABEL_STATEMENT_OF_INFORMATION:
        return (
          <View>
            <Text style={styles.titleTextStyle}>{screenName}</Text>
          </View>
        );

      case Strings.LABEL_DUE_DILIGENCE_REPORT:
        return (
          <View>
            <Text style={styles.titleTextStyle}>{screenName}</Text>
          </View>
        );

      case Strings.LABEL_AUTO_VALUATION_REPORT:
        return (
          <View>
            <Text style={styles.titleTextStyle}>{screenName}</Text>
          </View>
        );

      case Strings.LABEL_PROPERTY_REPORT:
        return (
          <View>
            <Text style={styles.titleTextStyle}>{screenName}</Text>
          </View>
        );

      case Strings.LABEL_SUBURB_REPORT:
        return (
          <View>
            <Text style={styles.titleTextStyle}>{screenName}</Text>
          </View>
        );

      case Strings.LABEL_BROCHURE:
        return (
          <View>
            <Text style={styles.titleTextStyle}>{screenName}</Text>
          </View>
        );

      case Strings.TERMS_AND_CONDITIONS_TITLE:
        return (
          <View>
            <Text style={styles.titleTextStyle}>{screenName}</Text>
          </View>
        );
      case Strings.PRIVACY_POLICY_TITLE:
        return (
          <View>
            <Text style={styles.titleTextStyle}>{screenName}</Text>
          </View>
        );

      case Strings.NOTIFICATION_LIST_SCREEN_TITLE:
        return (
          <View>
            <Text style={styles.titleTextStyle}>{screenName}</Text>
          </View>
        );

      case Strings.PAYMENT_REPORT_SCREEN_TITLE:
        return (
          <View>
            <Text style={styles.titleTextStyle}>{screenName}</Text>
          </View>
        );
      case Strings.KNOWLEDGE_DETAIL_TITLE:
        return (
          <View>
            <Text style={styles.titleTextStyle}>{screenName}</Text>
          </View>
        );

      case Strings.SERVICE_PROVIDER_SCREEN_TITLE:
        return (
          <View>
            <Text style={styles.titleTextStyle}>{screenName}</Text>
          </View>
        );
      case Strings.SELLER_LIST_TITLE:
        return (
          <View>
            <Text style={styles.titleTextStyle}>{screenName}</Text>
          </View>
        );
      case Strings.LABEL_REAL_ESTATE_CONTRACT_INFORMATION:
        return (
          <View>
            <Text style={styles.titleTextStyle}>{screenName}</Text>
          </View>
        );
    }
  }

  renderRightOne(screenName) {
    switch (screenName) {
      case Strings.PROFILE_SCREEN_TITLE:
        return (
          <TouchableOpacity
            hitSlop={HeaderScreenStyle.touchableAreaStyle}
            onPress={() =>
              Actions.profileEditScreen({ profileData: this.props.profileData })
            }
          >
            {/* <Image source={require("../../Assets/edit.png")} /> */}
            <Icon name="edit" type="feather" color={Colors.WHITE} size={20} />
          </TouchableOpacity>
        );

      case Strings.PROPERTY_HOME_SCREEN_TITLE:
        return (
          <TouchableOpacity
            hitSlop={HeaderScreenStyle.touchableAreaStyle}
            onPress={() => Actions.searchPropertyScreen()}
          >
            {/* <Image source={require("../../Assets/filter.png")} /> */}
            {/* <Icon
                                    name='ios-search'
                                    type='ionicon'
                                    color={Colors.COLOR_CUTTY_SHARK}
                                /> */}
            <Text style={{ alignSelf: "center", color: Colors.WHITE }}>
              {"FILTER"}
            </Text>
          </TouchableOpacity>
        );

      case Strings.PROPERTY_DETIAL_SCREEN_TITLE:
        return (
          <TouchableOpacity
            hitSlop={HeaderScreenStyle.touchableAreaStyle}
            onPress={() => console.log("")}
          >
            {/* <Image source={require("../../Assets/help.png")} /> */}
            <Icon
              name="star"
              type="evilicon"
              reverseColor={Colors.BLUE}
              color={Colors.WHITE}
            />
          </TouchableOpacity>
        );

      // case Strings.PROPERTY_SEARCH_SCREEN_TITLE:
      //     return <TouchableOpacity
      //         hitSlop={HeaderScreenStyle.touchableAreaStyle}
      //         onPress={() => console.log("")}>
      //         {/* <Image source={require("../../Assets/help.png")} /> */}
      //         <Icon
      //             name="ios-help-circle-outline"
      //             type='ionicon'
      //             color={Colors.WHITE}
      //         />
      //     </TouchableOpacity>;

      // case Strings.INSPECTION_SCREEN_TITLE:
      //     return <TouchableOpacity
      //         hitSlop={HeaderScreenStyle.touchableAreaStyle}
      //         onPress={() => Actions.searchPropertyScreen()}>
      //         {/* <Image source={require("../../Assets/filter.png")} /> */}
      //         {/* <Icon
      //                         name='ios-search'
      //                         type='ionicon'
      //                         color={Colors.COLOR_CUTTY_SHARK}
      //                     /> */}
      //         <Text style={{ alignSelf: "center", color: Colors.WHITE }}>{"FILTER"}</Text>
      //     </TouchableOpacity>;
    }
  }

  renderModal() {
    return (
      <Modal
        isVisible={this.state.isModalVisible}
        onSwipe={() => this.setState({ isVisible: false })}
        onBackdropPress={() => this.setState({ isVisible: false })}
      >
        <View style={{ flex: 1 }}>
          <Text>Hello!</Text>
          <TouchableOpacity onPress={this._toggleModal}>
            <Text>Hide me!</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    );
  }

  render() {
    return (
      <View style={styles.header}>
        {console.log("Header >>> " + this.props.title)}
        <Header
          backgroundColor={Colors.COLOR_PRIMARY}
          leftComponent={this.renderLeftOne(this.props.title)}
          centerComponent={this.renderCenterOne(this.props.title)}
          rightComponent={this.renderRightOne(this.props.title)}
        />
      </View>
    );
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
  titleTextStyle: {
    color: Colors.WHITE,
    fontSize: 15,
    fontWeight: "bold"
  },
  header: {
    ...ifIphoneX(
      {
        paddingTop: getStatusBarHeight()
      },
      {
        paddingTop: 0
      }
    ),
    justifyContent: "space-evenly"
  },
  iconStyle: {
    marginTop: 20
  }
});

function mapStateToProps(state) {
  return {
    SignInReducer: state.SignInReducer
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ loginUser }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(HeaderScreen);
