import React, { Component } from 'react';
import { connect } from 'react-redux';
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
    TouchableHighlight,
    PermissionsAndroid

} from 'react-native';

import {
    loginUser,
    resetSignUpData
} from "../../Action/ActionCreators";

import { bindActionCreators } from "redux";
import { Actions } from 'react-native-router-flux';
import Colors from '../../Constants/Colors';
import Strings from '../../Constants/Strings';
import SignStyle from "../SignInComponent/SignInScreenStyle";

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import BottomNavigation, {
    FullTab
} from 'react-native-material-bottom-navigation'
import { CheckBox} from "react-native-elements";
import LinearGradient from "react-native-linear-gradient";
import {validateEmail,showErrorMessage} from "../../Utils/Validations"
import FastImage from "react-native-fast-image";
const JSON = require("circular-json");


import {
    BarIndicator,
} from 'react-native-indicators';
import OfflineNotice from "../../Utils/OfflineNotice";
import DeviceInfo from "react-native-device-info";
const DEVICE_WIDTH = Dimensions.get("window").width;
const DEVICE_HEIGHT = Dimensions.get("window").height;

import firebase from "react-native-firebase"; 

class SignInScreen extends Component {

    constructor() {
        super();
        this.state = {
            checked:true,
            email: "",
            password: "",
            visible: false,
            isSpinnerVisible: false,
            fcmToken: ""
        };
    }

    componentWillReceiveProps(nextProps) {

        this._changeLoadingState(false)
       

       
        if (nextProps.SignInReducer.signinRes !== undefined && nextProps.SignInReducer.signinRes !== '') {

            if (nextProps.SignInReducer.signinRes.code !== undefined && nextProps.SignInReducer.signinRes.code === Strings.STATUS_OK){
                this._storeUserData(Strings.KEY_USER_DATA, JSON.stringify(nextProps.SignInReducer.signinRes.data));
                
            }else{
                Alert.alert(
                    Strings.APP_NAME,
                    nextProps.SignInReducer.signinRes.message,
                    [
                        {
                            text: "OK",
                            onPress: () => null,
                            style: "cancel"
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
                        onPress: () =>null,
                        style: "cancel"
                    }
                ],
                { cancelable: false }
            );
          }
     
    }

    _storeUserData = async (key,value) => {
        try {
           const resp =  await AsyncStorage.setItem(key, value);
            Actions.searchLocationScreen();
        } catch (error) {
            // Error saving data
           
        }
    }



    //++For FCM
    async componentDidMount() {
        this.checkPermission();
        this.createNotificationListeners();
    }

    

    //Remove listeners allocated in createNotificationListeners()
    // componentWillUnmount() {
    //     this.notificationListener();
    //     this.notificationOpenedListener();
    // }

    //1
    async checkPermission() {
        const enabled = await firebase.messaging().hasPermission();
        if (enabled) {
            this.getToken();
        } else {
            this.requestPermission();
        }
    }

    //3
    async getToken() {
        let fcmToken = await AsyncStorage.getItem('fcmToken', "");
      
        if (!fcmToken) {
            fcmToken = await firebase.messaging().getToken();
            if (fcmToken) {
                // user has a device token
            
                await AsyncStorage.setItem('fcmToken', fcmToken);
                this.setState({ fcmToken: fcmToken});
            }
        }else{
            this.setState({ fcmToken: fcmToken });
        }
    }

    //2
    async requestPermission() {
        try {
            await firebase.messaging().requestPermission();
            // User has authorised
            this.getToken();
        } catch (error) {
            // User has rejected permissions
            
        }
    }

    async createNotificationListeners() {
        /*
        * Triggered when a particular notification has been received in foreground
        * */
        this.notificationListener = firebase.notifications().onNotification((notification) => {
            const { title, body } = notification;
            this.showAlert(title, body);
           
        });

        /*
        * If your app is in background, you can listen for when a notification is clicked / tapped / opened as follows:
        * */
        this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen) => {
            const { title, body } = notificationOpen.notification;
            this.showAlert(title, body);
           
           
        });

        /*
        * If your app is closed, you can check if it was opened by a notification being clicked / tapped / opened as follows:
        * */
        const notificationOpen = await firebase.notifications().getInitialNotification();
        if (notificationOpen) {
            const { title, body } = notificationOpen.notification;
            this.showAlert(title, body);
           
        }
        /*
        * Triggered for data only payload in foreground
        * */
        this.messageListener = firebase.messaging().onMessage((message) => {
            //process data message
        
           
        });
    }

    showAlert(title, body) {
    
        this.messageListener
        Alert.alert(
            title, body,
            [
                { text: 'OK', onPress: () => null },
            ],
            { cancelable: false },
        );
    }
    //--For FCM

    componentWillUnmount(){
        this.setState({
            checked: true,
            email: "",
            password: "",
            visible: false,
            isSpinnerVisible: false
        });
    }


    onSubmit = () => {
       /// Actions.signUpScreen({ type: "reset" });

        if (this.state.email === '') {
            showErrorMessage(Strings.ERROR_EMAIL);
        }else if(!validateEmail(this.state.email)){
            showErrorMessage(Strings.ERROR_EMAIL_INVALID);
        }else if(this.state.password === ''){
            showErrorMessage(Strings.ERROR_PASSWORD_EMPTY);
        }else{
            const brand = DeviceInfo.getBrand();
            var postData = {
                "email": this.state.email,
                "password": this.state.password,
                "userType": Strings.USER_TYPE_BUYER,
                "device_token": this.state.fcmToken,
                "device_type": brand === Strings.BRAND_NAME_APPLE ? Strings.DEVCIE_TYPE_IOS : Strings.DEVCIE_TYPE_ANDROID,
                "device_id": DeviceInfo.getUniqueID(),
            };

            this._changeLoadingState(true);
            this.props.loginUser(postData);

            //Actions.searchLocationScreen();
        }
      

    }

    _changeLoadingState(loadingState) {

        this.setState({
            isSpinnerVisible: loadingState
        })
    }

    goToLogin = () => {
        Actions.signInScreen({ type: "reset" });
    }

    goToForgotPassword(){
        this.setState({
            checked: true,
            email: "",
            password: "",
            visible: false,
            isSpinnerVisible: false
        });
        this.props.resetSignUpData();
        Actions.forgotPasswordScreen({ type: "reset" });
    }


    render() { 
        return (
            <View style={{ flex: 1 }}>
                <FastImage source={require("../../Assets/bg_login.png")} style={SignStyle.backgroundImage}>
                    <OfflineNotice />

                <KeyboardAwareScrollView
                    resetScrollToCoords={{ x: 0, y: 0 }}
                    scrollEnabled={true}
                    extraHeight={40}
                    extraScrollHeight={40}
                    keyboardShouldPersistTaps='handled'
                    enableAutoAutomaticScroll={true}
                    enableOnAndroid={true}>
                    <View style={SignStyle.signInFormContent}>


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

                                        <BarIndicator color={Colors.WHITE} count={5} />
                                    </View>
                                    : null
                            }


                            <View style={SignStyle.signInForm}>
                                <Image
                                    source={require("../../Assets/logo.png")}
                                    style={SignStyle.logoStyle}
                                />   
                    <TextInput
                       
                        selectionColor={Colors.WHITE}
                        autoCapitalize={"none"}
                        // Adding hint in Text Input using Place holder.
                        placeholder={Strings.EMAIL_PLACEHOLDER}
                        keyboardType={'email-address'}
                        placeholderTextColor={Colors.WHITE}
                        onChangeText={value => this.setState({ email: value })}
                        // Making the Under line Transparent.
                        underlineColorAndroid='transparent'
                    
                        // Calling the custom TextInputStyleClass.
                        style={SignStyle.textInputStyleClass} />



                    <TextInput
                        selectionColor={Colors.WHITE}
                        // Adding hint in Text Input using Place holder.
                        placeholder={Strings.PASSWORD_PLACEHOLDER}

                        secureTextEntry={true}

                        placeholderTextColor={Colors.WHITE}
 
                        // Making the Under line Transparent.
                        underlineColorAndroid='transparent'
                        onChangeText={value => this.setState({ password: value })}
                        // Calling the custom TextInputStyleClass.
                        style={SignStyle.textInputStyleClass} />


                    <View style={{ flex: 1, alignSelf: 'flex-end', marginRight: 15, marginTop: 10,marginBottom:10 }}>

                        <TouchableOpacity
                            activeOpacity={.5}
                            onPress={() => this.goToForgotPassword()}>
                            <Text style={{ color: Colors.WHITE,  justifyContent: "center"}}>
                                {Strings.FORGOT_PASSWORD}
                            </Text>
                        </TouchableOpacity>

                    {/* <CheckBox
                    title={"Remember Me"}
                    containerStyle={{ justifyContent: 'flex-start', marginLeft: 0, marginRight: 20, padding: 0, borderWidth: 0, backgroundColor: 'transparent' }}
                    checked={this.state.checked}
                    size={18}
                    textStyle={{ color: Colors.WHITE, fontWeight: "400" }}
                    checkedColor={Colors.WHITE}
                    onIconPress={checked => this.setState({ checked: !this.state.checked, modalVisible: false })}
                    onPress={checked => this.setState({ checked: !this.state.checked, modalVisible: false })}
                    /> */}


                    </View>

                    <TouchableOpacity
                        activeOpacity={.5}
                        onPress={() => this.onSubmit()}>

                        <LinearGradient
                            colors={[Colors.START_COLOR, Colors.END_COLOR]}
                            style={SignStyle.roundedButtonStyleAppTheme}>
                            <Text style={{ color: Colors.WHITE }}> {Strings.SIGN_BUTTON_TEXT} </Text>

                        </LinearGradient>
                    </TouchableOpacity>


                    <Text style={{ color: Colors.WHITE, marginTop: 20, marginBottom: 10 }}>or</Text>

                    <TouchableOpacity
                        onPress={() => Actions.signUpScreen({ type: "reset" })}
                        activeOpacity={.5}>
                        <View style={SignStyle.roundedButtonStyleTransparent}>
                            <Text style={{ color: Colors.WHITE }}> {Strings.SIGN_UP_BUTTON_TEXT} </Text>
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
    console.log("SigInScreen mapStateToProps >>>>" + JSON.stringify(state.SignInReducer));
    return {
        SignInReducer: state.SignInReducer
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ loginUser, resetSignUpData }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(SignInScreen);


