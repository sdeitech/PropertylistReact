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
    TouchableHighlight

} from 'react-native';

import {
    forgotPassword,
} from "../../Action/ActionCreators";
  

import { bindActionCreators } from "redux";
import { Actions } from 'react-native-router-flux';
import Colors from '../../Constants/Colors';
import Strings from '../../Constants/Strings';
import SignStyle from "./SignInScreenStyle";

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import LinearGradient from "react-native-linear-gradient";
import {validateEmail,showErrorMessage} from "../../Utils/Validations"
import { BarIndicator } from "react-native-indicators";
import OfflineNotice from "../../Utils/OfflineNotice";
import DeviceInfo from "react-native-device-info";
import FastImage from "react-native-fast-image";



class ForgotPassword extends Component {

    constructor() {
        super();
        this.state = {
            checked:true,
            email: "",
            errorEmail: "",
            password: "",
            errorPassword: "",
            isSpinnerVisible: false
        };
    }

    componentWillMount(){

        //console.log("Calling Function >>>" + validateEmail("asdghas"))
    }

    componentDidMount() {
        

    }

    componentWillUnmount() {
        
    }

    componentWillReceiveProps(nextProps) {

        this._changeLoadingState(false)
        console.log("Forgot Password Screen >>>>> " + JSON.stringify(nextProps.ForgotPasswordReducer.forgotPass));

        if (nextProps.ForgotPasswordReducer.forgotPass != undefined && nextProps.ForgotPasswordReducer.forgotPass!=''){

            if (nextProps.ForgotPasswordReducer.forgotPass.code == 200){
               // alert(nextProps.ForgotPasswordReducer.forgotPass.message);
                Alert.alert(
                    Strings.APP_NAME,
                    nextProps.ForgotPasswordReducer.forgotPass.message,
                    [
                        { text: 'Ok', onPress: () => Actions.signInScreen()},
                    ],
                    { cancelable: false }
                )
            }else{
                alert(nextProps.ForgotPasswordReducer.forgotPass.message);
            }
        }else{
            if(nextProps.forgotPass==undefined){
                alert("Server Error!!")
            }
        }

    }

    onSubmit = () => {
       /// Actions.signUpScreen({ type: "reset" });

        if (this.state.email === '') {
            
            showErrorMessage(Strings.ERROR_EMAIL)

        }else if(!validateEmail(this.state.email)){
            showErrorMessage(Strings.ERROR_EMAIL_INVALID);
          
        }else {
            const brand = DeviceInfo.getBrand();
            var postData = {
                "email": this.state.email,
                "userType": Strings.USER_TYPE_BUYER,
            };

            this._changeLoadingState(true);
            this.props.forgotPassword(postData);
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

                                <Text style={{ color: Colors.WHITE, margin: 20}}>
                                {Strings.FORGOT_PASSWORD_TITILE}
                                </Text>

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


                                <TouchableOpacity
                                    activeOpacity={.5}
                                    onPress={() => this.onSubmit()}
                                >

                                    <LinearGradient
                                        colors={[Colors.START_COLOR, Colors.END_COLOR]}
                                        style={SignStyle.roundedButtonStyleAppTheme}>
                                        <Text style={{ color: Colors.WHITE }}> {Strings.RESET_PASSWORD} </Text>

                                    </LinearGradient>
                                </TouchableOpacity>


                                <Text style={{ color: Colors.WHITE, marginTop: 20, marginBottom: 20 }}>or</Text>

                                <TouchableOpacity
                                    onPress={() => Actions.signInScreen({ type: "reset" })}
                                    activeOpacity={.5}>
                                    <View style={SignStyle.roundedButtonStyleTransparent}>
                                        <Text style={{ color: Colors.WHITE }}> {Strings.SIGN_BUTTON_TEXT} </Text>
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
        ForgotPasswordReducer: state.ForgotPasswordReducer
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ forgotPassword }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ForgotPassword);


