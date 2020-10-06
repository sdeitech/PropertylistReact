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
    TouchableHighlight,
    ActivityIndicator
} from "react-native";

import {
    updateUserProfile,
    clearUpdateProfileResponse
} from "../../Action/ActionCreators";

import { bindActionCreators } from "redux";
import { Actions } from "react-native-router-flux";
import Colors from "../../Constants/Colors";
import Strings from "../../Constants/Strings";
import RNGooglePlaces from "react-native-google-places";

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import { BarIndicator } from "react-native-indicators";
import OfflineNotice from "../../Utils/OfflineNotice";
import DeviceInfo from "react-native-device-info";
import HeaderScreen from "../CommonComponent/HeaderScreen";
import ProfileScreenStyle from "./ProfileScreenStyle";
import { Avatar, Divider, Icon } from "react-native-elements";
import CardView from "react-native-cardview";
import { TextField } from "react-native-material-textfield";
import { Dropdown } from "react-native-material-dropdown";
import LinearGradient from "react-native-linear-gradient";
import Geocoder from "react-native-geocoder";
import FastImage from "react-native-fast-image";
import Modal from "react-native-modal";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import {
    showErrorMessage,
    validateName,
    validateNumber,
    validateAboutMe
} from "../../Utils/Validations";
import API from "../../Constants/APIUrls";

import ImagePicker from "react-native-image-crop-picker";

const DEVICE_WIDTH = Dimensions.get("window").width;
const DEVICE_HEIGHT = Dimensions.get("window").height;

class ProfileScreen extends Component {
    constructor() {
        super();
        this.state = {
            checked: true,
            email: "",
            password: "",
            visible: false,
            isSpinnerVisible: false,
            firstName: "",
            lastName: "",
            aboutMe: "",
            phoneNo: "",
            address: "",
            city: "",
            state: "",
            country: "",
            zipcode: "",
            facebook: "",
            twitter: "",
            instagram: "",
            avatarSource: "",
            imageData: "",
            isModalVisible: false,
            isImgSpinnerVisible: false,
        };
    }

    componentWillMount() {
        console.log(
            "Profile Edit Screen >>>>" + JSON.stringify(this.props.profileData)
        );

        this.setState({
            firstName:
                this.props.profileData.firstname !== null
                    ? this.props.profileData.firstname
                    : "",
            lastName:
                this.props.profileData.lastname !== null
                    ? this.props.profileData.lastname
                    : "",
            aboutMe:
                this.props.profileData.aboutme !== null
                    ? this.props.profileData.aboutme
                    : "",
            phoneNo:
                this.props.profileData.phone_number !== null
                    ? this.props.profileData.phone_number
                    : "",
            address:
                this.props.profileData.fulladdress !== null
                    ? this.props.profileData.fulladdress
                    : "",
            city:
                this.props.profileData.city !== null ? this.props.profileData.city : "",
            state:
                this.props.profileData.state !== null
                    ? this.props.profileData.state
                    : "",
            country:
                this.props.profileData.country !== null
                    ? this.props.profileData.country
                    : "",
            zipcode:
                this.props.profileData.zipcode !== null
                    ? this.props.profileData.zipcode
                    : "",
            facebook:
                this.props.profileData.facebook !== null
                    ? this.props.profileData.facebook
                    : "",
            instagram:
                this.props.profileData.instagram !== null
                    ? this.props.profileData.instagram
                    : "",
            avatarSource:
                this.props.profileData.profile_pic !== null &&
                    this.props.profileData.profile_pic !== "noUser.jpg"
                    ? API.PROFILE_PIC_URL + this.props.profileData.profile_pic
                    : ""
        });
    }

    componentWillReceiveProps(nextProps) {
        this._changeLoadingState(false);
    }

    _changeLoadingState(loadingState) {
        this.setState({
            isSpinnerVisible: loadingState
        });
    }

    goToLogin = () => {
        Actions.signInScreen({ type: "reset" });
    };


    openSearchModal() {
        console.log("In openSearchModal >>>>>");
        RNGooglePlaces.openAutocompleteModal()
            .then(place => {
                console.log("Place Info >> " + JSON.stringify(place));
                // place represents user's selection from the
                // suggestions and it is a simplified Google Place object.
                this.setState({
                    address: place.address,
                    city: place.addressComponents.administrative_area_level_2,
                    state: place.addressComponents.administrative_area_level_1,
                    country: place.addressComponents.country
                });
                this.getReverseGeocodeLocation(place.latitude, place.longitude);
            })
            .catch(error => console.log(error.message)); // error is a Javascript Error object
    }

    getReverseGeocodeLocation(lat, lang) {
        // Position Geocoding
        var NY = {
            lat: lat,
            lng: lang
        };

        Geocoder.geocodePosition(NY)
            .then(res => {
                // res is an Array of geocoding object (see below)
                console.log("geocodePosition >>> " + JSON.stringify(res));

                this.setState({
                    //address: res[0].formattedAddress,
                    zipcode: res[0].postalCode
                });
            })
            .catch(err => console.log(err));
    }

    showPickerOption() {
        Alert.alert(
            Strings.APP_NAME,
            "Upload picture from",
            [
                { text: "Gallery", onPress: () => this.openGallery() },
                { text: "Camera", onPress: () => this.openCamera() },
                { text: "Cancel", style: "cancel" }
            ],
            { cancelable: true }
        );
    }

    openGallery() {
        ImagePicker.openPicker({
            width: 300,
            height: 400,
            includeBase64: true,
            compressImageQuality: 0.8,
            cropping: true
        }).then(image => {
            this.upload(image.data);
        });
       // this._toggleModal();
    }

    openCamera() {
        ImagePicker.openCamera({
            width: 300,
            height: 400,
            includeBase64: true,
            compressImageQuality: 0.8,
            cropping: true
        }).then(image => {
            this.upload(image.data);
        });
      //  this._toggleModal();
    }

    async upload(data) {
        // this._changeLoadingState(true);
        this._profileLoadingState(true);
        this._toggleModal();

        var postData = {
            userId: this.props.profileData._id,
            profile_pic: "data:image/png;base64," + data
        };

        fetch(API.UPLOAD_USER_PROFILE_PIC, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: this.props.profileData.token
            },
            body: JSON.stringify(postData)
        })
            .then(response => response.json())
            .then(responseJson => {
                // this._changeLoadingState(false);
                this._profileLoadingState(false);

                console.log("Response Gallery >>>> " + JSON.stringify(responseJson));

                if (responseJson.code == Strings.STATUS_OK) {
                    this.setState({
                        avatarSource: API.PROFILE_PIC_URL + responseJson.data.profile_pic
                    });

                    this._storeUserData(
                        Strings.KEY_USER_DATA,
                        JSON.stringify(responseJson.data)
                    );
                } else {
                }
            })
            .catch(error => {
                // this._changeLoadingState(false);
                this._profileLoadingState(false);
                console.log(error);
                dispatch({ type: LOGIN_FAIL, payload: error });
            });
    }

    _storeUserData = async (key, value) => {
        try {
            const resp = await AsyncStorage.setItem(key, value);
            Alert.alert(
                Strings.APP_NAME,
                "Profile Image updated Successfully ..",
                [
                    {
                        text: "OK",
                        // onPress: () => this._toggleModal()
                        // Actions.dashboardScreen({ type: "reset" })
                        //    this._navigateToPreviousScreen()
                    }
                ],
                { cancelable: false }
            );
            // Actions.dashboardScreen();
        } catch (error) {
            // Error saving data
            console.log("Async Error >> " + error);
        }
    };

    _navigateToPreviousScreen() {
        // Actions.pop();
        // Actions.refresh();
        Actions.profileScreen({ type: "reset" });
    }

    onSubmit = () => {
        if (this.state.firstName.trim() === "") {
            showErrorMessage(Strings.ERROR_FIRST_NAME);
        } else if (!validateName(this.state.firstName.trim())) {
            showErrorMessage(Strings.ERROR_FIRST_NAME_INVALID);
        } else if (this.state.lastName.trim() === "") {
            showErrorMessage(Strings.ERROR_LAST_NAME);
        } else if (!validateName(this.state.lastName.trim())) {
            showErrorMessage(Strings.ERROR_LAST_NAME_INVALID);
        } else if (this.state.aboutMe.trim() === "") {
            showErrorMessage(Strings.ERROR_ABOUT_ME);
        } else if (!validateAboutMe(this.state.aboutMe)) {
            showErrorMessage(Strings.ERROR_ABOUT_ME_INVALID);
        } else if (this.state.phoneNo.trim() === "") {
            showErrorMessage(Strings.ERROR_MOBILE_NUMBER);
        } else if (this.state.phoneNo.trim().length < 10) {
            showErrorMessage(Strings.ERROR_MOBILE_NUMBER_MINIMUM_LENGHTH);
        } else if (this.state.address.trim() === "") {
            showErrorMessage(Strings.ERROR_ADDRESS);
        } else if (this.state.zipcode.trim() === "") {
            showErrorMessage(Strings.ERROR_ZIPCODE);
        } else if (this.state.zipcode.trim().length < 4) {
            showErrorMessage(Strings.ERROR_ZIPCODE_MINIMUM_LENGHTH);
        } else {
            var postData = {
                id: this.props.profileData._id,
                firstname: this.state.firstName,
                lastname: this.state.lastName,
                phone_number: this.state.phoneNo,
                address: this.state.address,
                country: this.state.country,
                state: this.state.state,
                city: this.state.city,
                zipcode: this.state.zipcode,
                aboutme: this.state.aboutMe,
                facebook: this.state.facebook,
                instagram: this.state.instagram,
                business_name: "",
                business_contact: "",
                designation: "",
                profile_pic: "",
                current_lat: "",
                current_lng: ""
            };
            this._changeLoadingState(true);
            this.props.updateUserProfile(postData, this.props.profileData.token);
        }
    };

    onDeletePic = () => {
        // this._changeLoadingState(true);
        this._toggleModal();
        this._profileLoadingState(true);

        var postData = {
            userId: this.props.profileData._id
        };

        fetch(API.DELETE_USER_PROFILE_PIC, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: this.props.profileData.token
            },
            body: JSON.stringify(postData)
        })
            .then(response => response.json())
            .then(responseJson => {
                // this._changeLoadingState(false);
                this._profileLoadingState(false);
                console.log("Response Gallery >>>> " + JSON.stringify(responseJson));

                if (responseJson.code == Strings.STATUS_OK) {
                    this.setState({
                        avatarSource: API.PROFILE_PIC_URL + responseJson.data.profile_pic
                    });

                    this._storeUserData(
                        Strings.KEY_USER_DATA,
                        JSON.stringify(responseJson.data)
                    );
                } else {
                }
            })
            .catch(error => {
                // this._changeLoadingState(false);
                this._profileLoadingState(false);
                console.log(error);
                dispatch({ type: LOGIN_FAIL, payload: error });
            });
    };

    componentWillReceiveProps(nextProps) {
        this._changeLoadingState(false);

        console.log(
            "Profile Edit Screen Response >>>> " +
            JSON.stringify(nextProps.profileUpdateRes)
        );

        if (
            nextProps.ProfileReducer !== undefined &&
            nextProps.ProfileReducer !== ""
        ) {
            if (
                nextProps.ProfileReducer.profileUpdateRes.code != undefined &&
                nextProps.ProfileReducer.profileUpdateRes.code === Strings.STATUS_OK
            ) {
                Alert.alert(
                    Strings.APP_NAME,
                    nextProps.ProfileReducer.profileUpdateRes.message,
                    [
                        {
                            text: "OK",
                            onPress: () =>
                                //Actions.dashboardScreen({ type: "reset" })
                                this._navigateToPreviousScreen()
                        }
                    ],
                    { cancelable: false }
                );
            }
        }
    }

    componentWillUnmount() {
        this.props.clearUpdateProfileResponse();
        ImagePicker.clean()
            .then(() => {
                console.log("removed all tmp images from tmp directory");
            })
            .catch(e => {
                alert(e);
            });
    }
    _profileLoadingState(loadingState) {
        this.setState({
            isImgSpinnerVisible: loadingState
        });
    }
    renderModal() {
        return (
            <Modal
                isVisible={this.state.isModalVisible}   
                onBackdropPress={() => this.setState({ isVisible: false })}
            >
                <View style={{ top: DEVICE_HEIGHT / 1.6, flex: 1 }}>
                    <CardView
                        cardElevation={10}
                        cornerRadius={5}
                        style={{ height: DEVICE_HEIGHT / 2.8, backgroundColor: Colors.WHITE }}
                    >
                        <View
                            style={{
                                alignItems: "center",
                                flex: 3
                            }}
                        >
                            <Text
                                style={{
                                    color: Colors.TEXT_COLOR,
                                    fontWeight: "600",
                                    margin: 20
                                }}
                            >
                                Profile Photo
              </Text>
                            <View style={{ flexDirection: "row" }}>
                                <TouchableOpacity onPress={() => this.openGallery()}>
                                    <View style={ProfileScreenStyle.profileImgUpdateStyle}>
                                        <Icon
                                            reverse
                                            name="md-images"
                                            type="ionicon"
                                            color={Colors.COLOR_CUTTY_SHARK}
                                        />
                                        <Text>Gallery</Text>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => this.openCamera()}>
                                    <View style={ProfileScreenStyle.profileImgUpdateStyle}>
                                        <Icon
                                            reverse
                                            name="md-camera"
                                            type="ionicon"
                                            color={Colors.COLOR_CUTTY_SHARK}
                                        />
                                        <Text>Camera</Text>
                                    </View>
                                </TouchableOpacity>

                                {this.state.avatarSource ? (

                                    <TouchableOpacity onPress={() => this.onDeletePic()}>
                                        <View style={ProfileScreenStyle.profileImgUpdateStyle}>
                                            <Icon
                                                reverse
                                                name="md-trash"
                                                type="ionicon"
                                                color={Colors.COLOR_CUTTY_SHARK}
                                            />
                                            <Text>Remove</Text>
                                        </View>
                                    </TouchableOpacity>
                                ) : null}
                            </View>
                        </View>
                        <TouchableOpacity
                            style={{
                                flex: 1,
                                justifyContent: "center"
                            }}
                            onPress={() => this._toggleModal()}
                        >
                            <View
                                style={{
                                    borderTopWidth: 0.5,
                                    borderColor: Colors.GRAY_TEXT_COLOR
                                }}
                            >
                                <Text style={ProfileScreenStyle.modalCancelStyle}>Cancel</Text>
                            </View>
                        </TouchableOpacity>
                    </CardView>
                </View>
            </Modal>
        );
    }

    _toggleModal() {
        console.log("In _toggleModal" + this.state.isModalVisible);
        this.setState({
            isModalVisible: !this.state.isModalVisible
        });
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                {this.renderModal()}
                <HeaderScreen title={Strings.PROFILE_EDIT_SCREEN_TITLE} />
                <OfflineNotice />
                <ImageBackground
                    source={require("../../Assets/bg_login.png")}
                    style={ProfileScreenStyle.backgroundImage}
                >
                    <KeyboardAwareScrollView
                        resetScrollToCoords={{ x: 0, y: 0 }}
                        scrollEnabled={true}
                        extraHeight={40}
                        extraScrollHeight={40}
                        automaticallyAdjustContentInsets={false}
                        keyboardShouldPersistTaps="always"
                        enableAutoAutomaticScroll={true}
                        enableOnAndroid={true}
                    >
                        

                        <View style={ProfileScreenStyle.profileContainer}>
                            <CardView
                                cardElevation={10}
                                cornerRadius={5}
                                style={ProfileScreenStyle.updateEditProfileForm}
                            >
                                <View style={ProfileScreenStyle.profileEditScreenTitle}>
                                    {/* <Text style={ProfileScreenStyle.profileEditScreenTitle}>Edit Profile</Text> */}
                                </View>

                                <View style={ProfileScreenStyle.profileEditScreenTitle}>
                                    {/* <Avatar
                                        large
                                        rounded
                                        source={this.state.avatarSource ? { uri: this.state.avatarSource } : require('../../Assets/user_profile_32.png')}
                                        onPress={() => this.showPickerOption()}
                                        activeOpacity={0.7}
                                    />
                                    {this.state.avatarSource ? (<View style={{ margin: 5 }}>

                                        <TouchableOpacity
                                            activeOpacity={.5}
                                            onPress={() => this.onDeletePic()}
                                        >

                                            <LinearGradient
                                                colors={[Colors.START_COLOR, Colors.END_COLOR]}
                                                style={ProfileScreenStyle.roundedButtonStyleAppThemeSmall}>
                                                <Text style={{ color: Colors.WHITE }}> {Strings.BUTTON_REMOVE_TEXT} </Text>

                                            </LinearGradient>
                                        </TouchableOpacity>

                                    </View>):null} */}
                                    <TouchableWithoutFeedback onPress={() => this._toggleModal()}>
                                        <View>
                                            {this.state.isImgSpinnerVisible ? (
                                                <ActivityIndicator
                                                    size={"large"}
                                                    color={Colors.COLOR_CUTTY_SHARK}
                                                    style={{
                                                        position: "absolute",
                                                        zIndex: 1,
                                                        top: 30,
                                                        left: 30
                                                    }}
                                                />
                                            ) : null}
                                            <FastImage
                                                style={ProfileScreenStyle.profileIconStyle}
                                                source={
                                                    this.state.avatarSource
                                                        ? { uri: this.state.avatarSource }
                                                        : require("../../Assets/user_profile_32.png")
                                                }
                                            />
                                            <Icon
                                                reverse
                                                name="md-create"
                                                type="ionicon"
                                                color={Colors.COLOR_CUTTY_SHARK}
                                                size={15}
                                                containerStyle={{
                                                    position: "absolute",
                                                    top: 60,
                                                    left: 60
                                                }}
                                            />
                                        </View>
                                    </TouchableWithoutFeedback>
                                </View>

                                {this.state.isSpinnerVisible ? (
                                    <View
                                        style={{
                                            flex: 1,
                                            left: 0,
                                            right: 0,
                                            top: 0,
                                            bottom: DEVICE_HEIGHT / 1.2,
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

                                <View style={ProfileScreenStyle.mainContainer}>
                                    <View
                                        style={{
                                            marginBottom: 15,
                                            borderBottomColor: Colors.BACK_ARROW_COLOR,
                                            borderBottomWidth: 1
                                        }}
                                    >
                                        <TextInput
                                            placeholder="First Name"
                                            autoCapitalize={"none"}
                                            placeholderTextColor={Colors.BACK_ARROW_COLOR}
                                            onChangeText={text => this.setState({ firstName: text })}
                                            value={this.state.firstName}
                                            style={ProfileScreenStyle.inputTextStyle}
                                        />
                                    </View>

                                    <View
                                        style={{
                                            marginBottom: 15,
                                            borderBottomColor: Colors.BACK_ARROW_COLOR,
                                            borderBottomWidth: 1
                                        }}
                                    >
                                        <TextInput
                                            placeholder="Last Name"
                                            autoCapitalize={"none"}
                                            onChangeText={text => this.setState({ lastName: text })}
                                            value={this.state.lastName}
                                            placeholderTextColor={Colors.BACK_ARROW_COLOR}
                                            style={ProfileScreenStyle.inputTextStyle}
                                        />
                                    </View>

                                    <View style={ProfileScreenStyle.aboutMeContainer}>
                                        <Text style={ProfileScreenStyle.profileEditAboutMeTitle}>
                                            About Me
                    </Text>
                                    </View>
                                    <Divider style={ProfileScreenStyle.aboutMeDivider} />
                                    <View style={ProfileScreenStyle.textAreaContainer}>
                                        <TextInput
                                            style={ProfileScreenStyle.textArea}
                                            underlineColorAndroid="transparent"
                                            placeholder="Type something"
                                            placeholderTextColor={Colors.BACK_ARROW_COLOR}
                                            onChangeText={text => this.setState({ aboutMe: text })}
                                            value={this.state.aboutMe}
                                            numberOfLines={4}
                                            multiline={true}
                                        />
                                    </View>

                                    <View style={ProfileScreenStyle.aboutMeContainer}>
                                        <Text style={ProfileScreenStyle.profileEditAboutMeTitle}>
                                            Contact Information
                    </Text>
                                    </View>
                                    <Divider style={ProfileScreenStyle.aboutMeDivider} />

                                    <View
                                        style={{
                                            marginTop: 10,
                                            marginBottom: 15,
                                            borderBottomColor: Colors.BACK_ARROW_COLOR,
                                            borderBottomWidth: 1
                                        }}
                                    >
                                        <TextInput
                                            placeholder="Enter Phone"
                                            placeholderTextColor={Colors.BACK_ARROW_COLOR}
                                            onChangeText={text => this.setState({ phoneNo: text })}
                                            keyboardType={"number-pad"}
                                            maxLength={10}
                                            value={this.state.phoneNo}
                                            style={ProfileScreenStyle.inputTextStyle}
                                        />
                                    </View>

                                    <View
                                        style={{
                                            marginTop: 10,
                                            marginBottom: 15,
                                            borderBottomColor: Colors.BACK_ARROW_COLOR,
                                            borderBottomWidth: 1
                                        }}
                                    >
                                        <TextInput
                                            placeholder="Enter Address"
                                            onTouchStart={() => this.openSearchModal()}
                                            placeholderTextColor={Colors.BACK_ARROW_COLOR}
                                            //onChangeText={(text) => this.setState({ text })}
                                            value={this.state.address}
                                            style={ProfileScreenStyle.inputTextStyle}
                                        />
                                    </View>

                                    <View style={{ flex: 1, flexDirection: "row" }}>
                                        <View style={{ flex: 0.5, margin: 5 }}>
                                            <View
                                                style={{
                                                    marginTop: 10,
                                                    marginBottom: 15,
                                                    borderBottomColor: Colors.BACK_ARROW_COLOR,
                                                    borderBottomWidth: 1
                                                }}
                                            >
                                                <TextInput
                                                    placeholder="City"
                                                    placeholderTextColor={Colors.BACK_ARROW_COLOR}
                                                    onChangeText={text => this.setState({ text })}
                                                    value={this.state.city}
                                                    editable={false}
                                                    style={ProfileScreenStyle.inputTextStyle}
                                                />
                                            </View>
                                        </View>
                                        <View style={{ flex: 0.5, margin: 5 }}>
                                            <View
                                                style={{
                                                    marginTop: 10,
                                                    marginBottom: 15,
                                                    borderBottomColor: Colors.BACK_ARROW_COLOR,
                                                    borderBottomWidth: 1
                                                }}
                                            >
                                                <TextInput
                                                    placeholder="State"
                                                    placeholderTextColor={Colors.BACK_ARROW_COLOR}
                                                    onChangeText={text => this.setState({ text })}
                                                    value={this.state.state}
                                                    editable={false}
                                                    style={ProfileScreenStyle.inputTextStyle}
                                                />
                                            </View>
                                        </View>
                                    </View>

                                    <View style={{ flex: 1, flexDirection: "row" }}>
                                        <View style={{ flex: 0.5, margin: 5 }}>
                                            <View
                                                style={{
                                                    marginTop: 10,
                                                    marginBottom: 15,
                                                    borderBottomColor: Colors.BACK_ARROW_COLOR,
                                                    borderBottomWidth: 1
                                                }}
                                            >
                                                <TextInput
                                                    placeholder="Country"
                                                    placeholderTextColor={Colors.BACK_ARROW_COLOR}
                                                    onChangeText={text => this.setState({ text })}
                                                    value={this.state.country}
                                                    editable={false}
                                                    style={ProfileScreenStyle.inputTextStyle}
                                                />
                                            </View>
                                        </View>
                                        <View style={{ flex: 0.5, margin: 5 }}>
                                            <View
                                                style={{
                                                    marginTop: 10,
                                                    marginBottom: 15,
                                                    borderBottomColor: Colors.BACK_ARROW_COLOR,
                                                    borderBottomWidth: 1
                                                }}
                                            >
                                                <TextInput
                                                    placeholder="Postcode"
                                                    placeholderTextColor={Colors.BACK_ARROW_COLOR}
                                                    onChangeText={text =>
                                                        this.setState({ zipcode: text })
                                                    }
                                                    value={this.state.zipcode}
                                                    maxLength={4}
                                                    keyboardType={"number-pad"}
                                                    style={ProfileScreenStyle.inputTextStyle}
                                                />
                                            </View>
                                        </View>
                                    </View>

                                    <View>
                                        <View style={ProfileScreenStyle.aboutMeContainer}>
                                            <Text style={ProfileScreenStyle.contactInfoTitle}>
                                                Custom Information
                      </Text>
                                        </View>
                                        <Divider style={ProfileScreenStyle.aboutMeDivider} />

                                        <View style={{ flex: 0.5, margin: 5 }}>
                                            <View
                                                style={{
                                                    marginTop: 10,
                                                    marginBottom: 15,
                                                    borderBottomColor: Colors.BACK_ARROW_COLOR,
                                                    borderBottomWidth: 1
                                                }}
                                            >
                                                <TextInput
                                                    placeholder="Facebook"
                                                    placeholderTextColor={Colors.BACK_ARROW_COLOR}
                                                    onChangeText={text =>
                                                        this.setState({ facebook: text })
                                                    }
                                                    value={this.state.facebook}
                                                    style={ProfileScreenStyle.inputTextStyle}
                                                />
                                            </View>
                                        </View>

                                        <View style={{ flex: 0.5, margin: 5 }}>
                                            <View
                                                style={{
                                                    marginTop: 10,
                                                    marginBottom: 15,
                                                    borderBottomColor: Colors.BACK_ARROW_COLOR,
                                                    borderBottomWidth: 1
                                                }}
                                            >
                                                <TextInput
                                                    placeholder="Instagram"
                                                    placeholderTextColor={Colors.BACK_ARROW_COLOR}
                                                    onChangeText={text =>
                                                        this.setState({ instagram: text })
                                                    }
                                                    value={this.state.instagram}
                                                    style={ProfileScreenStyle.inputTextStyle}
                                                />
                                            </View>
                                        </View>
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
                                                    {" "}
                                                    {Strings.BUTTON_SAVE_TEXT}{" "}
                                                </Text>
                                            </LinearGradient>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </CardView>
                        </View>
                    </KeyboardAwareScrollView>
                </ImageBackground>
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
    }
});

function mapStateToProps(state) {
    return {
        ProfileReducer: state.ProfileReducer
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(
        { updateUserProfile, clearUpdateProfileResponse },
        dispatch
    );
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ProfileScreen);
