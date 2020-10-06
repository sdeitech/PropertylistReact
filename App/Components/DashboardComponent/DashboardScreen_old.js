import React, { Component } from 'react';
import { connect } from 'react-redux';
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
    ImageEditor,
    TouchableWithoutFeedback,
    Dimensions,
    KeyboardAvoidingView,
    Linking,
    Keyboard,
    Modal,
    TouchableHighlight

} from 'react-native';

import {
    loginUser,
} from "../../Action/ActionCreators";


import { bindActionCreators } from "redux";
import { Actions } from 'react-native-router-flux';
import Colors from '../../Constants/Colors';
import Strings from '../../Constants/Strings';
import dashboardStyle from "./DashboardScreenStyle";

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { CheckBox} from "react-native-elements";
import LinearGradient from "react-native-linear-gradient";
import {validateEmail,showErrorMessage} from "../../Utils/Validations"

import HeaderScreen from "../CommonComponent/HeaderScreen";

import {
    BarIndicator,
} from 'react-native-indicators';
import OfflineNotice from "../../Utils/OfflineNotice";
import DeviceInfo from "react-native-device-info";
import BottomNavigation, {
  IconTab,
  FullTab
} from "react-native-material-bottom-navigation";

import Home from "../../Assets/my_property_1.png";
import Saved from "../../Assets/001-arrows.png";
import Chat from "../../Assets/002-communication.png";
import Notification from "../../Assets/002-notification.png";
import More from "../../Assets/more.png";
import CardView from "react-native-cardview";
import DashboardScreenStyle from './DashboardScreenStyle';
import STRINGS from '../../Constants/Strings';

const DEVICE_WIDTH = Dimensions.get("window").width;
const DEVICE_HEIGHT = Dimensions.get("window").height;
let DeviceType = DEVICE_HEIGHT / DEVICE_WIDTH > 1.6 ? "Phone" : "Tablet";

//Components to be selected from Bottom Navigation 
import PropertySearchScreen from "../PropertyListingComponent/PropertySearchScreen";
import PropertyListing from "../PropertyListingComponent/PropertyListingScreen";
import ProfileScreen from "../ProfileComponent/ProfileScreen";
import COLORS from '../../Constants/Colors';


class DashboardScreen extends Component {
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
      "propertyData":
          [
              {
                  "name": "Proxima Midnight",
                  "email": "proxima@appdividend.com"
              },
              {
                  "name": "Ebony Maw",
                  "email": "ebony@appdividend.com"
              },
              {
                  "name": "Black Dwarf",
                  "email": "dwarf@appdividend.com"
              },
              {
                  "name": "Mad Titan",
                  "email": "thanos@appdividend.com"
              },
              {
                  "name": "Supergiant",
                  "email": "supergiant@appdividend.com"
              },
              {
                  "name": "Loki",
                  "email": "loki@appdividend.com"
              },
              {
                  "name": "corvus",
                  "email": "corvus@appdividend.com"
              },
              {
                  "name": "Proxima Midnight",
                  "email": "proxima1@appdividend.com"
              },
              {
                  "name": "Ebony Maw",
                  "email": "ebony1@appdividend.com"
              },
              {
                  "name": "Black Dwarf",
                  "email": "dwarf1@appdividend.com"
              },
              {
                  "name": "Mad Titan",
                  "email": "thanos1@appdividend.com"
              },
              {
                  "name": "Supergiant",
                  "email": "supergiant1@appdividend.com"
              },
              {
                  "name": "Loki",
                  "email": "loki1@appdividend.com"
              },
              {
                  "name": "corvus",
                  "email": "corvus1@appdividend.com"
              }
          ]
      
    };
  }

  componentWillReceiveProps(nextProps) {
    this._changeLoadingState(false);
    console.log(
      "SignIn Screen >>>>> " + JSON.stringify(nextProps.SignInReducer.signinRes)
    );

    if (nextProps.SignInReducer != undefined && nextProps.SignInReducer != "") {
      if (nextProps.SignInReducer.signinRes.messageId == Strings.STATUS_OK) {
        Alert.alert(
          "Alert Title",
          "My Alert Msg",
          [
            {
              text: "OK",
              onPress: () => Actions.pop(),
              style: "cancel"
            }
          ],
          { cancelable: false }
        );
      } else {
        Alert.alert(
          Strings.APP_NAME,
          nextProps.SignInReducer.signinRes.message,
          [
            {
              text: "OK",
              onPress: () => console.log(""),
              style: "cancel"
            }
          ],
          { cancelable: false }
        );
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

  goToLogin = () => {
    Actions.signInScreen({ type: "reset" });
  };

  tabs = [
    {
      key: Strings.HOME_KEY,
      icon: Home,
      label: Strings.HOME_LABEL,
      
    },
    {
      key: Strings.SAVED_KEY,
      icon: Saved,
      label: Strings.SAVED_LABEL,
      
    },
    {
      key: Strings.CHAT_KEY,
      icon: Chat,
      label: Strings.CHAT_LABEL,
      
    },
    {
      key: Strings.NOTIFICATION_KEY,
      icon: Notification,
      label:Strings.NOTIFICATION_LABEL,      
    },
    {
      key: Strings.MORE_KEY,
      icon: More,
      label: STRINGS.MORE_LABEL,
      
    }
  ];

    

  renderIcon = icon => ({ isActive }) => (
    //

    <Image source={icon} activeOpacity={0.7} />
  );

    renderTab = ({ tab, isActive }) => (

        <LinearGradient
            colors={[Colors.START_COLOR, Colors.END_COLOR]}>
            
            <FullTab
                style={{ width: (DeviceType == 'Tablet') ? DEVICE_WIDTH : '100%', alignSelf: 'stretch', }}
                isActive={isActive}
                key={tab.key}
                label={tab.label}
                renderIcon={this.renderIcon(tab.icon)}
            />    

        </LinearGradient>
        
    )

  render() {
    return (
        <View style={{ flex: 1 }}>
            <View style={{ flex: 1 }}>
                {this.staticView()}
               
            </View>
            {this.bottomNavigationView()}
        </View>
    );
  }

    bottomNavigationView() {
        return (

           
                <BottomNavigation
                    style={{ width:DEVICE_WIDTH}}
                    activeTab={this.state.activeTab}
                    labelColor="white"
                    rippleColor="white"
                    innerStyle={{ paddingTop: 10,flex:1 }}
                    onTabPress={newTab => this.onTabSelected(newTab)}
                    renderTab={this.renderTab}
                    tabs={this.tabs}
                    useLayoutAnimation />
         

        );

    }

    onTabSelected(newTab) {

      this.setState({
        activeTab:newTab.key
      });

      switch(newTab){

          case Strings.HOME_KEY:
              return  this.setState({activeTab:Strings.HOME_KEY});
          
          case Strings.SAVED_KEY:
              return this.setState({ activeTab: Strings.SAVED_KEY });

          case Strings.CHAT_KEY:
              return this.setState({ activeTab: Strings.CHAT_KEY });

          case Strings.NOTIFICATION_KEY:
              return this.setState({ activeTab: Strings.NOTIFICATION_KEY });

          case Strings.MORE_KEY:
              return this.setState({ activeTab: Strings.MORE_KEY });



      }
    }

    staticView() {

      switch(this.state.activeTab){

        case Strings.HOME_KEY:

			    return <PropertySearchScreen filterData = {this.props.filterData}/>

        case Strings.SAVED_KEY:

          return <PropertyListing filterData={this.props.filterData} />

		  case Strings.MORE_KEY:

			  return <ProfileScreen />   

        
      }

    }
            

    _renderItem(item, index) {

        return <View style={DashboardScreenStyle.propertyListCardItemContainer}>
            <View style={{ borderTopLeftRadius: 10, borderTopRightRadius: 10, overflow: "hidden" }}>
              <ImageBackground imageStyle={{ borderRadius: 2, overflow: "hidden" }} style={{ height: DEVICE_HEIGHT / 4.5, borderRadius: 100 }} source={{ uri: "https://picsum.photos/200/300/?random" }}>
                <View style={{ flex: 1, flexDirection: "row", position: "absolute", bottom: 0, marginBottom: 10, borderTopLeftRadius: 10, borderTopRightRadius: 10 }}>
                  <View style={{ flex: 0.02 }}>
                    <Image source={require("../../Assets/Rectangle_4.png")} />
                  </View>
                  <View style={{ flex: 0.98 }}>
                    <Text
                      style={{ color: "white", fontWeight: "bold" }}
                    >
                      Costal Adobe
                    </Text>
                  </View>
                </View>
              </ImageBackground>
            </View>
            <View style={{ flex: 0.3, flexDirection: "row", margin: 10 }}>
              <View style={{ flex: 0.8, flexDirection: "row", justifyContent: "space-between", alignContent: "flex-start", justifyContent: "flex-start", alignSelf: "flex-start" }}>
                <View style={{ flex: 0.1 }}>
                  <Image source={require("../../Assets/cost-1.png")} />
                </View>
                <View style={{ flex: 0.9 }}>
                  <Text>$80000 - $76000</Text>
                </View>
              </View>
              <View style={{ flex: 0.2, flexDirection: "row", justifyContent: "space-between", alignContent: "flex-end", justifyContent: "flex-end", alignSelf: "flex-end" }}>
                <View style={{ flex: 0.1, marginTop: 3 }}>
                  <Image source={require("../../Assets/area.png")} />
                </View>
                <View style={{ flex: 0.9, marginLeft: 10 }}>
                  <Text>85 sqm</Text>
                </View>
              </View>
            </View>
          </View>;
    }
}


const styles = StyleSheet.create({
    container: {
        padding: 5
    },
    field: {
        color: '#d9d9d9',
        flex: 2,
        fontSize: 13,
        fontWeight: '500',
        padding: 3,
        borderRadius: 3,
        borderWidth: 1,
        borderColor: '#d9d9d9',
        height: 40,
        marginVertical: 5
    },
    button: {
        flex: 2,
        padding: 3,
        borderRadius: 3,
        borderWidth: 1,
        backgroundColor: '#d9d9d9',
        height: 40,
        marginVertical: 10
    },
    buttonLabel: {
        color: '#ffffff',
        fontSize: 13,
        fontWeight: '500'
    }
});


function mapStateToProps(state) {

    return {
        SignInReducer: state.SignInReducer
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ loginUser }, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DashboardScreen);


