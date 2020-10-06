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
    Dimensions,
    Switch,

} from 'react-native';

import {
  getSavedPropertyList,
} from "../../Action/ActionCreators";


import { bindActionCreators } from "redux";
import { Actions } from 'react-native-router-flux';
import Colors from '../../Constants/Colors';
import Strings from '../../Constants/Strings';
import LinearGradient from "react-native-linear-gradient";
import HeaderScreen from "../CommonComponent/HeaderScreen";
import {
  ifIphoneX,
  getStatusBarHeight,
  getBottomSpace
} from "react-native-iphone-x-helper";

import {
    BarIndicator,
} from 'react-native-indicators';
import OfflineNotice from "../../Utils/OfflineNotice";
import FeedbackScreenStyle from "./FeedbackScreenStyle";
import STRINGS from '../../Constants/Strings';
const DEVICE_WIDTH = Dimensions.get("window").width;
const DEVICE_HEIGHT = Dimensions.get("window").height;
import HeaderScreenStyle from "../CommonComponent/HeaderStyle";
import CardView from "react-native-cardview";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import API from "../../Constants/APIUrls";
import { validateAboutMe, showErrorMessage } from "../../Utils/Validations";


class FeedbackScreen extends Component {
  constructor() {
    super();
    this.state = {
      feedbackSelected:"",
      userData: "",
      comments:"",
    
    };
  }

  componentWillMount() {

    AsyncStorage.getItem(Strings.KEY_USER_DATA)
      .then(value => {
        if (value) {
          var userData = JSON.parse(value);
          console.log("==== ID ===", userData);

          this.setState({ userData: userData });
          //this._changeLoadingState(true);
        
        }
      })
      .done();
   
    
  }

 
  componentWillReceiveProps(nextProps) {
    this._changeLoadingState(false);
   
  }


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

  toggleSwitch1(value){
    this.setState({ switchEmailAlert: value })
    console.log('Switch 1 is: ' + value)
  }

  toggleSwitch2(value) {
    this.setState({ switchPushNotificationContact: value })
    console.log('Switch 2 is: ' + value)
  }

  toggleSwitch3(value) {
    this.setState({ switchPushNotificationInspection: value });
    console.log('Switch 3 is: ' + value)
  }

  toggleSwitch4(value) {
    this.setState({ switchPushNotificationSold: value });
    console.log('Switch 4 is: ' + value)
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <OfflineNotice />
        <HeaderScreen title={Strings.FEEDBACK_SCREEN_TITLE} />
        <View style={{ flex: 1}}>
          <CardView
            cardElevation={10}
            cornerRadius={5}
            style={FeedbackScreenStyle.settingCardContainer}>

            <View style={{ flex: 1, marginTop: 20 }}>
              <View style={{ margin:10,alignContent: "flex-start", alignSelf: "flex-start", alignSelf: "flex-start", justifyContent: "flex-start" }}>
                <Text style={{
                  color: Colors.grey_800,
                  fontSize: 14,
                  fontWeight: "bold"
                }}>{"Feedback Type :"}</Text>

              </View>
              <View style={{ flexDirection: "row", margin: 10, justifyContent:"space-evenly" }}>

                <TouchableOpacity onPress={() => this.actionOnRow(Strings.BUTTON_LABEL_TECHNICAL)}>
                  <View
                    style={
                      [FeedbackScreenStyle.btnStyle, {
                        backgroundColor: this.state.feedbackSelected === Strings.BUTTON_LABEL_TECHNICAL 
                          ? Colors.FILTER_SELECTED_COLOR
                          : "#FFF"
                      }
                      ]
                    }>
                    <Text style={{ fontSize: 12 }}> {Strings.BUTTON_LABEL_TECHNICAL} </Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => this.actionOnRow(Strings.BUTTON_LABEL_USER_EXPIRENCE)}>
                  <View
                    style={
                      [FeedbackScreenStyle.btnStyle, {
                        backgroundColor: this.state.feedbackSelected === Strings.BUTTON_LABEL_USER_EXPIRENCE 
                          ? Colors.FILTER_SELECTED_COLOR
                          : "#FFF"
                      }
                      ]
                    }>
                    <Text style={{ fontSize: 12 }}> {Strings.BUTTON_LABEL_USER_EXPIRENCE} </Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => this.actionOnRow(Strings.BUTTON_LABEL_OTHERS)}>
                  <View
                    style={
                      [FeedbackScreenStyle.btnStyle, {
                        backgroundColor: this.state.feedbackSelected === Strings.BUTTON_LABEL_OTHERS 
                          ? Colors.FILTER_SELECTED_COLOR
                          : "#FFF"
                      }
                      ]
                    }>
                    <Text style={{ fontSize: 12 }}> {Strings.BUTTON_LABEL_OTHERS} </Text>
                  </View>
                </TouchableOpacity>

               
              </View>
              <View style={FeedbackScreenStyle.textAreaContainer}>
                <TextInput
                  style={FeedbackScreenStyle.textArea}
                  underlineColorAndroid="transparent"
                  placeholder="Please provide your feedback"
                  placeholderTextColor={Colors.BACK_ARROW_COLOR}
                  onChangeText={text => this.setState({ comments: text })}
                  value={this.state.comments}
                  numberOfLines={4}
                  multiline={true}
                />
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
              activeOpacity={0.5}>

              <LinearGradient
                colors={["#00C2D7", "#4EE1CA"]}
                style={FeedbackScreenStyle.buttonStyleAppTheme}>
                <Text style={{ color: "white", fontWeight: "600" }}> {Strings.BUTTON_TEXT_SEND_FEEDBACK} </Text>
              </LinearGradient>
            </TouchableOpacity>

          </View>
        </View>
      </View>
    );
  }

  actionOnRow(selectedText){
      this.setState({

            feedbackSelected:selectedText
      });
  }

  async _updateSetting(){

    if(this.state.feedbackSelected===""){
      showErrorMessage(Strings.ERROR_FEEDBACK_TYPE);
    }else if (this.state.comments.trim() === "") {
      showErrorMessage(Strings.ERROR_FEEDBACK);
    }else{

      this._changeLoadingState(true);
      var postData = {
        "userId": this.state.userData._id,
        "feedbackType": this.state.feedbackSelected,
        "feedbackMsg": this.state.comments,
      }

      fetch(
        API.SEND_FEEDBACK_TO_SERVER,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            'Content-Type': 'application/json',
            Authorization: this.state.userData.token
          },
          body: JSON.stringify(postData)
        }
      ).then(response => response.json())
        .then((responseJson) => {
          this._changeLoadingState(false);
          //this._changeLoadingState(false);
          console.log("Response Send Contact Request >>>> " + JSON.stringify(responseJson));

          if (responseJson !== undefined) {
            if (responseJson.code == Strings.STATUS_OK) {
              Alert.alert(
                Strings.APP_NAME,
                responseJson.message,
                [
                  { text: "Ok", onPress: () => Actions.pop() }
                ],
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
    },
  header: {
    ...ifIphoneX({
      paddingTop: getStatusBarHeight()
    }, {
        paddingTop: 0
      })
  },
});


function mapStateToProps(state) {

    return {
        PropertyListingReducer: state.PropertyListingReducer
    }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ getSavedPropertyList }, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FeedbackScreen);


