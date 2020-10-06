import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
    View,
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

} from 'react-native';

import {
  getProfile,
  clearGetProfileResponse
} from "../../Action/ActionCreators";


import { bindActionCreators } from "redux";
import { Actions } from 'react-native-router-flux';
import Colors from '../../Constants/Colors';
import Strings from '../../Constants/Strings';

import { validateEmail, validatePassword, validateName, showErrorMessage } from "../../Utils/Validations"
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import {
    BarIndicator,
} from 'react-native-indicators';
import OfflineNotice from "../../Utils/OfflineNotice";
import DeviceInfo from "react-native-device-info";
import HeaderScreen from "../CommonComponent/HeaderScreen";
import ProfileScreenStyle from "./ProfileScreenStyle";
import { Avatar, Divider } from "react-native-elements";
import CardView from "react-native-cardview";
import FastImage from "react-native-fast-image";
import API from "../../Constants/APIUrls";
import LinearGradient from "react-native-linear-gradient";

var acronym="";

class ProfileScreen extends Component {

    constructor() {
        super();
        this.state = {
            checked:true,
            visible: false,
            isSpinnerVisible: false,
            firstName :"-",
            lastName:"-",
            aboutMe:"-",
            emailAddress:"-",
            phoneNumber:"-",
            addresss:"-",
            facebook:"-",
            instagram:"-",
            personalNumber:"-",
            profilePic:"",
            profileData:"",
            username:"",
            currentPassword:"",
            newPassword:"",
            confirmPassword:"",
            

        };
    }

    componentWillMount(){
        console.log("In Component Did Mount >>>>");
        this._getUserData();
    }

    componentDidMount(){
        console.log("In Component Did Mount >>>>")
        //this._getUserData();
    }

    _getUserData (){
        AsyncStorage.getItem(Strings.KEY_USER_DATA)
            .then(value => {
                if (value) {
                    var userData = JSON.parse(value);
                    console.log("==== ID ===", userData);

                    this.setState({
                        userData: userData
                    });
                    
                    // //this.setState({ userInfo: userData });
                    // this._changeLoadingState(true);
                    // var postData = {
                    //     "id": userData._id,
                    // };
                    // this.props.getProfile(postData, userData.token);
                }
            })
            .done();

    }

    componentWillReceiveProps(nextProps) {

        this._changeLoadingState(false)

        console.log("Profile Screen >>>> "+JSON.stringify(nextProps));

        // if (nextProps.ProfileReducer!== undefined && nextProps.ProfileReducer!==""){
        //     if (nextProps.ProfileReducer.profileRes.code !== undefined && nextProps.ProfileReducer.profileRes.code === Strings.STATUS_OK){
        //         this.setState({
        //           firstName:nextProps.ProfileReducer.profileRes.data.firstname,
        //           lastName: nextProps.ProfileReducer.profileRes.data.lastname,
        //           username: nextProps.ProfileReducer.profileRes.data.username,
        //           aboutMe: nextProps.ProfileReducer.profileRes.data.aboutme,
        //           emailAddress: nextProps.ProfileReducer.profileRes.data.email,
        //           phoneNumber: nextProps.ProfileReducer.profileRes.data.phone_number,
        //           addresss: nextProps.ProfileReducer.profileRes.data.fulladdress,
        //           facebook: nextProps.ProfileReducer.profileRes.data.facebook,
        //           instagram:nextProps.ProfileReducer.profileRes.data.instagram,
        //           personalNumber: nextProps.ProfileReducer.profileRes.data.phone_number,
        //           profilePic:nextProps.ProfileReducer.profileRes.data.profile_pic,
        //           profileData: nextProps.ProfileReducer.profileRes.data
        //         });
        //     }else{
        //         //alert(nextProps.ProfileReducer.profileRes.message);
        //     }
            
        // }else{
            

        // }
        
    }


    onSubmit = () => {
      
        if (this.state.currentPassword.trim() === "") {
            showErrorMessage(Strings.ERROR_PASSWORD_EMPTY);
        } else if (!validatePassword(this.state.currentPassword.trim())) {
            showErrorMessage(Strings.ERROR_PASSWORD_INVALID);
        } else if (this.state.newPassword.trim() === "") {
            showErrorMessage(Strings.ERROR_NEW_PASSWORD_EMPTY);
        } else if (!validatePassword(this.state.newPassword.trim())) {
            showErrorMessage(Strings.ERROR_NEW_PASSWORD_INVALID);
        } else if(this.state.currentPassword === this.state.newPassword){
            showErrorMessage(Strings.CURRENT_NEW_PASSWORD_MATCH_ERROR);
        } 
        else if (this.state.confirmPassword.trim() === "") {
            showErrorMessage(Strings.ERROR_CONFRIM_PASSWORD);
        }else if(this.state.confirmPassword!== this.state.newPassword){
            showErrorMessage(Strings.ERROR_CONFRIM_PASSWORD_NOT_MATCH);
        }else{
            this.sendChangePasswordRequest();
        }
      

    }

    sendChangePasswordRequest(){

        this._changeLoadingState(true);
        var postData = {
            "id": this.state.userData._id,
            "password": this.state.newPassword,
            "userType": "Buyer"
        };

        console.log("POST data >>>>" + JSON.stringify(postData));

        fetch(API.CHANGE_PASSWORD_REQUEST, {
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
                console.log("Response Time Slot >>>> " + JSON.stringify(responseJson));

                if (responseJson !== undefined) {
                    if (responseJson.code == Strings.STATUS_OK) {
                      
                        Alert.alert(
                            Strings.APP_NAME,
                            responseJson.message,
                            [
                                {
                                    text: 'Ok',
                                    onPress: () => Actions.pop(),
                                    style: 'cancel',
                                },
                            ],
                            { cancelable: false },
                        );
                        //this._toogleList();
                    } else {
                        alert(responseJson.message);
                        console.log("Error >>> " + responseJson.message);
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

    _changeLoadingState(loadingState) {

        this.setState({
            isSpinnerVisible: loadingState
        })
    }

    goToLogin = () => {
        Actions.signInScreen({ type: "reset" });
    }


    componentWillUnmount() {
        this.props.clearGetProfileResponse();
    }

    render() { 
        if(this.state.username!==''){
            var str = this.state.username;
            var matches = str.match(/\b(\w)/g);
             acronym = matches.join("");

            console.log("Username >>>> " + acronym);

        }
        
        return (
            <View style={{ flex: 1 }}>
                <HeaderScreen title={Strings.CHANGE_PASSWORD}/>
                <OfflineNotice />
                <FastImage source={require("../../Assets/bg_login.png")} style={ProfileScreenStyle.backgroundImage}>
                  
                
                <KeyboardAwareScrollView
                    resetScrollToCoords={{ x: 0, y: 0 }}
                    scrollEnabled={true}
                    extraHeight={40}
                    extraScrollHeight={40}
                    keyboardShouldPersistTaps='handled'
                    enableAutoAutomaticScroll={true}
                    enableOnAndroid={true}>

                    

                    <View style={ProfileScreenStyle.profileContainer}>
                         
                            <CardView 
                                cardElevation={10}
                                cornerRadius={5}
                                style={ProfileScreenStyle.changePasswordFrom}>
                                
                                <View style={ProfileScreenStyle.mainContainer}>
                                    <View
                                        style={{
                                            marginTop: 10,
                                            marginBottom: 15,
                                            borderBottomColor: Colors.BACK_ARROW_COLOR,
                                            borderBottomWidth: 1
                                        }}>
                                        <TextInput
                                            placeholder="Enter Current Password"
                                            placeholderTextColor={Colors.BACK_ARROW_COLOR}
                                            onChangeText={text => this.setState({ currentPassword: text })}
                                            secureTextEntry={true}
                                            value={this.state.currentPassword}
                                            style={ProfileScreenStyle.inputChangePasswordTextStyle}
                                        />

                                     
                                    </View>

                                    <View
                                        style={{
                                            marginTop: 10,
                                            marginBottom: 15,
                                            borderBottomColor: Colors.BACK_ARROW_COLOR,
                                            borderBottomWidth: 1
                                        }}>
                                        <TextInput
                                            placeholder="Enter New Password"
                                            placeholderTextColor={Colors.BACK_ARROW_COLOR}
                                            onChangeText={text => this.setState({ newPassword: text })}
                                            secureTextEntry={true}
                                            value={this.state.newPassword}
                                            style={ProfileScreenStyle.inputChangePasswordTextStyle}
                                        />


                                    </View>

                                    <View
                                        style={{
                                            marginTop: 10,
                                            marginBottom: 15,
                                            borderBottomColor: Colors.BACK_ARROW_COLOR,
                                            borderBottomWidth: 1
                                        }}>
                                        <TextInput
                                            placeholder="Confirm Password"
                                            placeholderTextColor={Colors.BACK_ARROW_COLOR}
                                            onChangeText={text => this.setState({ confirmPassword: text })}
                                            secureTextEntry={true}
                                            value={this.state.confirmPassword}
                                            style={ProfileScreenStyle.inputChangePasswordTextStyle}
                                        />



                                    </View>

                                    <View style={{ marginBottom: 20 }}>
                                        <TouchableOpacity
                                            activeOpacity={0.5}
                                            onPress={() => this.onSubmit()}
                                        >
                                            <LinearGradient
                                                colors={[Colors.START_COLOR, Colors.END_COLOR]}
                                                style={ProfileScreenStyle.roundedButtonStyleAppTheme}
                                            >
                                                <Text style={{ color: Colors.WHITE }}>
                                      
                                                    {"Change Password"}
                                                </Text>
                                            </LinearGradient>
                                        </TouchableOpacity>
                                    </View>

                                   
                                </View>
                                {console.log("Spinner State >>>> "+this.state.isSpinnerVisible)}
                                {

                                    this.state.isSpinnerVisible ?
                                        <View style={{
                                            flex: 1,
                                            left: 0,
                                            right: 0,
                                            top: 0,
                                            bottom: 0,
                                            position: 'absolute',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            backgroundColor: Colors.TRANSPARENT,
                                            width: window.width,
                                            height: window.height
                                        }}>

                                            <BarIndicator color={Colors.END_COLOR} count={5} />
                                        </View>
                                        : null
                                }
                                
                            </CardView>
                    </View>
                   
                  
            </KeyboardAwareScrollView>
            
       </FastImage>
            
         </View>
        );
        
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
        ProfileReducer: state.ProfileReducer
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ getProfile, clearGetProfileResponse}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfileScreen);


