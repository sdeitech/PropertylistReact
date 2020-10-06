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


import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import {
    BarIndicator,
} from 'react-native-indicators';
import OfflineNotice from "../../Utils/OfflineNotice";
import DeviceInfo from "react-native-device-info";
import HeaderScreen from "../CommonComponent/HeaderScreen";
import ProfileScreenStyle from "../ProfileComponent/ProfileScreenStyle";
import { Avatar, Divider } from "react-native-elements";
import CardView from "react-native-cardview";
import FastImage from "react-native-fast-image";
import API from "../../Constants/APIUrls";

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
                        username: userData.username
                    });
                    
                    //this.setState({ userInfo: userData });
                    this._changeLoadingState(true);
                    var postData = {
                        "id": userData._id,
                    };
                    this.props.getProfile(postData, userData.token);
                }
            })
            .done();

    }

    componentWillReceiveProps(nextProps) {

        this._changeLoadingState(false)

        console.log("Profile Screen >>>> "+JSON.stringify(nextProps));

        if (nextProps.ProfileReducer!== undefined && nextProps.ProfileReducer!==""){
            if (nextProps.ProfileReducer.profileRes.code !== undefined && nextProps.ProfileReducer.profileRes.code === Strings.STATUS_OK){
                this.setState({
                  firstName:nextProps.ProfileReducer.profileRes.data.firstname,
                  lastName: nextProps.ProfileReducer.profileRes.data.lastname,
                  username: nextProps.ProfileReducer.profileRes.data.username,
                  aboutMe: nextProps.ProfileReducer.profileRes.data.aboutme,
                  emailAddress: nextProps.ProfileReducer.profileRes.data.email,
                  phoneNumber: nextProps.ProfileReducer.profileRes.data.phone_number,
                  addresss: nextProps.ProfileReducer.profileRes.data.fulladdress,
                  facebook: nextProps.ProfileReducer.profileRes.data.facebook,
                  instagram:nextProps.ProfileReducer.profileRes.data.instagram,
                  personalNumber: nextProps.ProfileReducer.profileRes.data.phone_number,
                  profilePic:nextProps.ProfileReducer.profileRes.data.profile_pic,
                  profileData: nextProps.ProfileReducer.profileRes.data
                });
            }else{
                //alert(nextProps.ProfileReducer.profileRes.message);
            }
            
        }else{
            

        }
        
    }


    onSubmit = () => {
      
      

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
                <HeaderScreen title={Strings.PROFILE_SCREEN_TITLE} profileData={this.state.profileData}/>
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
                            <View style={ProfileScreenStyle.avatar} pointerEvents="none">
                                
                                <Avatar
                                    large
                                    rounded
                                    source={this.state.profilePic ? { uri: API.PROFILE_PIC_URL + this.state.profilePic } : require('../../Assets/user_profile_32.png')}
                                    title={acronym}
                                    onPress={() => console.log("Works!")}
                                    activeOpacity={0.7}
                                    containerStyle={{ backgroundColor:Colors.WHITE, zIndex: 1}}
                                />

                            </View>
                            <CardView 
                                cardElevation={10}
                                cornerRadius={5}
                                style={ProfileScreenStyle.updateForm}>
                                <Text style={ProfileScreenStyle.userNameTitle}>{this.state.firstName + " " + this.state.lastName}</Text>
                                {/* <Text style={ProfileScreenStyle.userNameSubText}>Product manager @ Property Listit</Text> */}

                                <View style={ProfileScreenStyle.mainContainer}>
                                    <View style={ProfileScreenStyle.aboutMeContainer}>
                                        <Text style={ProfileScreenStyle.aboutMeTitle}>About Me</Text>
                                    </View>
                                    <Divider style={ProfileScreenStyle.aboutMeDivider} />
                                    <Text style={ProfileScreenStyle.aboutMeContentContainer}>
                                        {this.state.aboutMe}
                                    </Text>
                                    <View>
                                        <View style={ProfileScreenStyle.aboutMeContainer}>
                                            <Text style={ProfileScreenStyle.contactInfoTitle}>Contact Information</Text>
                                        </View>
                                        <Divider style={ProfileScreenStyle.aboutMeDivider} />

                                        <Text style={ProfileScreenStyle.emailTitle}>Email Address</Text>
                                        <Text style={ProfileScreenStyle.emailSubText}>{this.state.emailAddress}</Text>

                                        <Text style={ProfileScreenStyle.phoneTitle}>Phone Number</Text>
                                        <Text style={ProfileScreenStyle.phoneSubText}>{this.state.phoneNumber}</Text>

                                        <Text style={ProfileScreenStyle.addressTitle}>Address</Text>
                                        <Text style={ProfileScreenStyle.addressSubText}>{this.state.addresss}</Text>
                                    </View>

                                    <View>
                                        <View style={ProfileScreenStyle.aboutMeContainer}>
                                            <Text style={ProfileScreenStyle.contactInfoTitle}>Custom Information</Text>
                                        </View>
                                        <Divider style={ProfileScreenStyle.aboutMeDivider} />

                                        <Text style={ProfileScreenStyle.emailTitle}>facebook</Text>
                                        <Text style={ProfileScreenStyle.emailSubText}>{this.state.facebook}</Text>

                                        <Text style={ProfileScreenStyle.phoneTitle}>Instagram</Text>
                                        <Text style={ProfileScreenStyle.phoneSubText}>{this.state.instagram}</Text>

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


