import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  View,
  SafeAreaView,
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
import Colors from "../../Constants/Colors";
import Strings from '../../Constants/Strings';
import dashboardStyle from "./DashboardScreenStyle";

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { CheckBox } from "react-native-elements";
import LinearGradient from "react-native-linear-gradient";
import { validateEmail, showErrorMessage } from "../../Utils/Validations"
import FastImage from "react-native-fast-image";
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
import NotificationList from "../NotificationListComponent/NotificationList";
import SellerListScreen from "../SellerListComponent/SellerListScreen";
import ProfileScreen from "../ProfileComponent/ProfileScreen";
import COLORS from '../../Constants/Colors';
import Drawer from "react-native-drawer";
import NavDrawerStyle from "./NavDrawerStyle";



class DashboardScreen extends Component {
  constructor() {
    super();
    this.state = {
      userData:"",
      checked: true,
      email: "",
      password: "",
      visible: false,
      isSpinnerVisible: false,
      activeTab: Strings.HOME_KEY,
      is_active: true,
      side: "right",
      tapToClose: true,
      drawerType: 'overlay',
      openDrawerOffset: 100,
      closedDrawerOffset: 0,
    };
  }

  state = {
    drawerVisible: false,
    active: false
  };

  componentWillMount(){
    AsyncStorage.getItem(Strings.KEY_USER_DATA)
      .then(value => {
        if (value) {
          var userData = JSON.parse(value);
          console.log("==== UserData ===", userData);

          this.setState({ userData: userData });
        }
      })
      .done();
  }

  componentWillReceiveProps(nextProps) {


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
      label: Strings.NOTIFICATION_LABEL,
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


  drawerContentView() {

    let isContactAdmin = false;

    if (this.state.userData.contactData !== undefined && this.state.userData.contactData.length !==0){
      isContactAdmin = true;
    }else{
      isContactAdmin=false;
    }

    return (
      <View style={NavDrawerStyle.drawerStyle}>
        <ScrollView>

          <View style={NavDrawerStyle.drawerSecondPartStyle}>

            <TouchableOpacity onPress={() => this.onMenuItemChange(Strings.PROFILE)}>
              <View style={NavDrawerStyle.flatListItemContainer}>
                <Image
                  style={{ marginRight: 20 }}
                  source={require("../../Assets/003-avatar.png")}
                />
                <Text
                  style={NavDrawerStyle.flatListItemTitle}
                  numberOfLines={1}>
                  {Strings.PROFILE}
                </Text>

              </View>
            </TouchableOpacity>



            <TouchableOpacity onPress={() => this.onMenuItemChange(Strings.CHANGE_PASSWORD)}>
              <View style={NavDrawerStyle.flatListItemContainer}>
                <Image
                  style={{ marginRight: 20 }}
                  source={require("../../Assets/003-avatar.png")}
                />
                <Text
                  style={NavDrawerStyle.flatListItemTitle}
                  numberOfLines={1}>
                  {Strings.CHANGE_PASSWORD}
                </Text>

              </View>
            </TouchableOpacity>


            <TouchableOpacity onPress={() => this.onMenuItemChange(Strings.CONTACT_LIST_SCREEN_TITLE)}>
              <View style={NavDrawerStyle.flatListItemContainer}>
                <Image
                  style={{ marginRight: 20, color: 'white' }}
                  source={require("../../Assets/menu_my_property_2x.png")}
                />
                <Text
                  style={NavDrawerStyle.flatListItemTitle}
                  numberOfLines={1}>
                  {Strings.CONTACT_LIST_SCREEN_TITLE}
                </Text>

              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => this.onMenuItemChange(Strings.INSPECTION_SCREEN_TITLE)}>
              <View style={NavDrawerStyle.flatListItemContainer}>
                <Image
                  style={{ marginRight: 20, color: 'white' }}
                  source={require("../../Assets/menu_my_property_2x.png")}
                />
                <Text
                  style={NavDrawerStyle.flatListItemTitle}
                  numberOfLines={1}>
                  {Strings.INSPECTION_SCREEN_TITLE}
                </Text>

              </View>
            </TouchableOpacity>


            {/* <TouchableOpacity onPress={() => console.log("")}>
              <View style={NavDrawerStyle.flatListItemContainer}>
                <Image
                  style={{ marginRight: 20, color: 'white' }}
                  source={require("../../Assets/menu_my_property_2x.png")}
                />
                <Text
                  style={NavDrawerStyle.flatListItemTitle}
                  numberOfLines={1}>
                  {Strings.FAQ}
                </Text>

              </View>
            </TouchableOpacity> */}


            <TouchableOpacity onPress={() => this.onMenuItemChange(Strings.FEEDBACK_SCREEN_TITLE)}>
              <View style={NavDrawerStyle.flatListItemContainer}>
                <Image
                  style={{ marginRight: 20, color: 'white' }}
                  source={require("../../Assets/menu_feedback.png")}
                />
                <Text
                  style={NavDrawerStyle.flatListItemTitle}
                  numberOfLines={1}>
                  {Strings.GIVE_FEEDBACK}
                </Text>

              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => this.onMenuItemChange(Strings.KNOWLEDGE_SCREEN_TITLE)}>
              <View style={NavDrawerStyle.flatListItemContainer}>
                <Image
                  style={{ marginRight: 20, color: 'white' }}
                  source={require("../../Assets/menu_feedback.png")}
                />
                <Text
                  style={NavDrawerStyle.flatListItemTitle}
                  numberOfLines={1}>
                  {Strings.KNOWLEDGE_SCREEN_TITLE}
                </Text>

              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => this.onMenuItemChange(Strings.SUBURB_REPORT_TITLE)}>
              <View style={NavDrawerStyle.flatListItemContainer}>
                <Image
                  style={{ marginRight: 20, color: 'white' }}
                  source={require("../../Assets/menu_feedback.png")}
                />
                <Text
                  style={NavDrawerStyle.flatListItemTitle}
                  numberOfLines={1}>
                  {Strings.SUBURB_REPORT_TITLE}
                </Text>

              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => this.onMenuItemChange(Strings.PAYMENT_REPORT_SCREEN_TITLE)}>
              <View style={NavDrawerStyle.flatListItemContainer}>
                <Image
                  style={{ marginRight: 20, color: 'white' }}
                  source={require("../../Assets/menu_feedback.png")}
                />
                <Text
                  style={NavDrawerStyle.flatListItemTitle}
                  numberOfLines={1}>
                  {Strings.PAYMENT_REPORT_SCREEN_TITLE}
                </Text>

              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => this.onMenuItemChange(Strings.SERVICE_PROVIDER_SCREEN_TITLE) }>
              <View style={NavDrawerStyle.flatListItemContainer}>
                <Image
                  style={{ marginRight: 20, color: 'white' }}
                  source={require("../../Assets/menu_feedback.png")}
                />
                <Text
                  style={NavDrawerStyle.flatListItemTitle}
                  numberOfLines={1}>
                  {Strings.SERVICE_PROVIDER_SCREEN_TITLE}
                </Text>

              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => Linking.openURL("http://13.238.107.123:5001/terms-and-conditions-app")}>
              <View style={NavDrawerStyle.flatListItemContainer}>
                <Image
                  style={{ marginRight: 20, color: 'white' }}
                  source={require("../../Assets/menu_feedback.png")}
                />
                <Text
                  style={NavDrawerStyle.flatListItemTitle}
                  numberOfLines={1}>
                  {"Terms & Conditions"}
                </Text>

              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => Linking.openURL("http://13.238.107.123:5001/privacy-policy-app")}>
              <View style={NavDrawerStyle.flatListItemContainer}>
                <Image
                  style={{ marginRight: 20, color: 'white' }}
                  source={require("../../Assets/menu_feedback.png")}
                />
                <Text
                  style={NavDrawerStyle.flatListItemTitle}
                  numberOfLines={1}>
                  {"Privacy Policy"}
                </Text>

              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => this.onMenuItemChange(Strings.SETTING)}>
              <View style={NavDrawerStyle.flatListItemContainer}>
                <Image
                  style={{ marginRight: 20, color: 'white' }}
                  source={require("../../Assets/menu_feedback.png")}
                />
                <Text
                  style={NavDrawerStyle.flatListItemTitle}
                  numberOfLines={1}>
                  {Strings.SETTING}
                </Text>

              </View>
            </TouchableOpacity>

            { isContactAdmin ?
            (
              <TouchableOpacity onPress={() => this.onMenuItemChange(Strings.CONTACT_ADMIN)}>
                <View style={NavDrawerStyle.flatListItemContainer}>
                  <Image
                    style={{ marginRight: 20, color: 'white' }}
                    source={require("../../Assets/menu_feedback.png")}
                  />
                  <Text
                    style={NavDrawerStyle.flatListItemTitle}
                    numberOfLines={1}>
                    {Strings.CONTACT_ADMIN}
                  </Text>

                </View>
              </TouchableOpacity>
            ) :
            null
            }

           


            <TouchableOpacity onPress={() => this.onMenuItemChange(Strings.LOGOUT)}>
              <View style={NavDrawerStyle.flatListItemContainer}>
                <Image
                  style={{ marginRight: 20, color: 'white' }}
                  source={require("../../Assets/menu_logout.png")}
                />
                <Text
                  style={NavDrawerStyle.flatListItemTitle}
                  numberOfLines={1}>
                  {Strings.LOGOUT}
                </Text>

              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  }

  onMenuItemChange(menuItem) {
    console.log("onMenuItemChange >>>>>> " + menuItem);
    this.closeControlPanel();
    switch (menuItem) {

      case Strings.PROFILE:
        return Actions.profileScreen();

      case Strings.CHANGE_PASSWORD:
        return Actions.profileChangePassword();

      case Strings.CONTACT_LIST_SCREEN_TITLE:

        return Actions.contactScreen();

      case Strings.INSPECTION_SCREEN_TITLE:

        return Actions.insepectionListScreen();

      case Strings.SETTING:

        return Actions.settingScreen();  

      case Strings.KNOWLEDGE_SCREEN_TITLE:

        return Actions.knowledgeScreen();  

      case Strings.SUBURB_REPORT_TITLE:

        return Actions.searchSuburbScreen();

      case Strings.PAYMENT_REPORT_SCREEN_TITLE:
      
        return Actions.paymentReportListScreen();

      case Strings.SERVICE_PROVIDER_SCREEN_TITLE:

        return Actions.serviceProviderScreen();  

      case Strings.FEEDBACK_SCREEN_TITLE:

        return Actions.feedbackScreen();  

      case Strings.CONTACT_ADMIN:
        var contactData = this.state.userData.contactData[0];
        console.log("In contact Admin");

        return Actions.chatScreen({
          seller: "Contact Admin",
          propertyID: contactData.propertyId,
          contactID: contactData._id,
          participants: contactData.participants,
          userType: contactData.userType
        });  

        
      case Strings.LOGOUT:

        return this.showLogoutAlert();
    }

  }

  showLogoutAlert() {
    Alert.alert(
      Strings.APP_NAME,
      'Are you sure you want to exit the app?',
      [
        { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
        { text: 'Logout', onPress: () => this.logoutFromApp() },
      ],
      { cancelable: false }
    )
  }

  logoutFromApp() {
    this.closeControlPanel();
    AsyncStorage.removeItem(Strings.KEY_USER_DATA);
    Actions.signInScreen({ type: "reset" });

  }

  callScreen() {

    this.staticView();
  }

  closeControlPanel = () => {
    if (this._drawer !== undefined) {
      this._drawer.close();
    }
  };

  openControlPanel = () => {
    if (this._drawer.open()) {
      this._drawer.close();
    } else {
      this._drawer.open();
    }


  };


  render() {
    return (
      // <View style={DashboardScreenStyle.dashboardContainer}>

      //       <View style={{ flex: 1 }}>
      //           {this.staticView()}

      //       </View>
      //       {this.bottomNavigationView()}

      //   </View>
      <SafeAreaView style={{flex:1}}>
      <View style={DashboardScreenStyle.dashboardContainer}>

        <Drawer
          ref={(ref) => this._drawer = ref}
          type={this.state.drawerType}
          animation={this.state.animation}
          openDrawerOffset={this.state.openDrawerOffset}
          closedDrawerOffset={this.state.closedDrawerOffset}
          content={this.drawerContentView()}
          styles={NavDrawerStyle.drawerStyle}
          tapToClose={this.state.tapToClose}
          side={this.state.side}
          tweenHandler={(ratio) => ({
            main: { opacity: (2 - ratio) / 2 }
          })}
        >
          <View style={DashboardScreenStyle.dashBoardViewContainer}>

            {this.staticView()}


          </View>

        </Drawer>

        {this.bottomNavigationView()}




      </View>
      </SafeAreaView>
    );
  }


  bottomNavigationView() {
    return (


      <BottomNavigation
        style={{ width: DEVICE_WIDTH }}
        activeTab={this.state.activeTab}
        labelColor="white"
        rippleColor="white"
        innerStyle={{ paddingTop: 10, flex: 1 }}
        onTabPress={newTab => this.onTabSelected(newTab.key)}
        renderTab={this.renderTab}
        tabs={this.tabs}
        useLayoutAnimation />


    );

  }

  onTabSelected(newTab) {

    this.closeControlPanel();

    if (newTab != Strings.MORE_KEY) {
      this.setState({
        activeTab: newTab
      });
    } else {
      this.openControlPanel();
    }



    switch (newTab) {

      case Strings.HOME_KEY:
        return this.setState({ activeTab: Strings.HOME_KEY });

      case Strings.SAVED_KEY:
        return this.setState({ activeTab: Strings.SAVED_KEY });

      case Strings.CHAT_KEY:
        return this.setState({ activeTab: Strings.CHAT_KEY });

      case Strings.NOTIFICATION_KEY:
        return this.setState({ activeTab: Strings.NOTIFICATION_KEY });

      // case Strings.MORE_KEY:
      //     return this.setState({ activeTab: Strings.MORE_KEY });



    }
  }

  staticView() {
    console.log("Active Tab>>>" + JSON.stringify(this.state.activeTab))
    switch (this.state.activeTab) {

      case Strings.HOME_KEY:

        return <PropertySearchScreen filterData={this.props.filterData} />

      case Strings.SAVED_KEY:

        return <PropertyListing filterData={this.props.filterData} />

      case Strings.CHAT_KEY:

        return <SellerListScreen />;
        //return alert("This feature is in development, coming soon..");


      case Strings.NOTIFICATION_KEY:

        return <NotificationList />;


      // case Strings.MORE_KEY:


      //      this.openControlPanel(); 
      //return <ProfileScreen filterData={this.props.filterData} />;

      default:
        return <PropertySearchScreen filterData={this.props.filterData} />


    }

  }



}

const drawerStyles = {
  drawer: { shadowColor: "white", shadowOpacity: 0.8, shadowRadius: 3 },
  main: { paddingLeft: 0 }
};


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
  },

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


