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
  getSavedPropertyList,
} from "../../Action/ActionCreators";


import { bindActionCreators } from "redux";
import { Actions } from 'react-native-router-flux';
import Colors from '../../Constants/Colors';
import Strings from '../../Constants/Strings';
import LinearGradient from "react-native-linear-gradient";
import {validateEmail,showErrorMessage,commafy} from "../../Utils/Validations"
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
import ProprertyListingScreenStyle from "../PropertyListingComponent/ProprertyListingScreenStyle";
import STRINGS from '../../Constants/Strings';
const DEVICE_WIDTH = Dimensions.get("window").width;
const DEVICE_HEIGHT = Dimensions.get("window").height;
import HeaderScreenStyle from "../CommonComponent/HeaderStyle";
import API from "../../Constants/APIUrls";
import { Icon, Avatar } from "react-native-elements";

class ProprertyListingScreen extends Component {
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
      propertyData: [],
      isMapView: false
    };
  }

  componentWillMount() {

    AsyncStorage.getItem(Strings.KEY_USER_DATA)
      .then(value => {
        if (value) {
          var userData = JSON.parse(value);
          console.log("==== ID ===", userData);

          //this.setState({ userInfo: userData });
          this._changeLoadingState(true);
          var filterData = {
            "user_id": userData._id,
            "page": 0,
            "limit":100
          }
          this.props.getSavedPropertyList(filterData, userData.token);
        }
      })
      .done();
    console.log("ProprertyListingScreen >>>>>" + JSON.stringify(this.props));
    
  }

 
  componentWillReceiveProps(nextProps) {
    this._changeLoadingState(false);
    console.log(
      "ProprertyListingScreen componentWillReceiveProps >>>>> " +
        JSON.stringify(nextProps)
    );

    let responseData = nextProps.PropertyListingReducer.propertySavedListRes;

    if (
      responseData != undefined &&
      responseData != ""
    ) {
      if (responseData.code == Strings.STATUS_OK) {
        this.setState({ propertyData: responseData.data.data});
      } 
      // else {
      //   Alert.alert(
      //     Strings.APP_NAME,
      //     responseData.message,
      //     [
      //       {
      //         text: "OK",
      //         onPress: () => console.log(""),
      //         style: "cancel"
      //       }
      //     ],
      //     { cancelable: false }
      //   );
      // }
    }else{
      Alert.alert(Strings.APP_NAME, Strings.SERVER_ERROR,
        [{ text: 'OK', onPress: () => Actions.pop() }], { cancelable: false });
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

  _toogleList() {
    this.setState({
      isMapView: !this.state.isMapView
    });
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <OfflineNotice />
        <HeaderScreen title={Strings.PROPERTY_LIST_SCREEN_TITLE} />
        <View style={{ flex: 1 }}>
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

          {this.state.propertyData.length ? (
            <FlatList
              style={{ marginTop: 20 }}
              data={this.state.propertyData}
              numColumns={1}
              renderItem={({ item, index }) => this._renderItem(item, index)}
            />
          ) : (
            <View style={ProprertyListingScreenStyle.emptyListStyle}>
              <Text style={ProprertyListingScreenStyle.emptyMessageStyle}>
                {this.state.isSpinnerVisible ? "" : Strings.PROPERTY_LIST_EMPTY}
              </Text>
            </View>
          )}
        </View>
      </View>
    );
  }

  actionOnRow(item) {
    console.log("Selected Item :", JSON.stringify(item));
    Actions.propertyDetailScreen({ propertyID: item.propertyInfo[0]._id });
  }

  _renderItem(item, index) {

    let propID = "";
    let propPrice = "";
    let propType = "";
    let propAddress = "";
    let propBathroom = "0";
    let propBedroom = "0";
    let propGarage = "0";
    let propImage = "";
    let imgUrl = "";

    if (item.XMLPropertyInfo !== undefined && item.XMLPropertyInfo !== "" && Object.keys(item.XMLPropertyInfo).length !== 0) {
      xmLFeedData = item.XMLPropertyInfo;

      propID = xmLFeedData.property_id;
      propPrice = commafy(xmLFeedData.priceView);
      propType = xmLFeedData.property_type;
      propAddress = xmLFeedData.address;
      propBathroom = xmLFeedData.bathrooms;
      propBedroom = xmLFeedData.bedrooms;
      propGarage = xmLFeedData.garages;
      propImage = xmLFeedData.images.length!=0 ? xmLFeedData.images.img[0].hasOwnProperty('url') ? xmLFeedData.images.img[0].url : "" :  "";
      propLandSize = xmLFeedData.landSize;

      
    } else {
      propID = item._id;
      propPrice = commafy(item.priceView);
      propType = item.property_type;
      propAddress = item.address;
      propBathroom = item.no_of_bathroom;
      propBedroom = item.no_of_bedroom;
      propGarage = item.is_garbage;
      propLandSize = item.landDetailsAreaText;

      // if (item.propertyMediaInfo !== undefined && item.propertyMediaInfo.length !== 0) {
      //   imgUrl = API.AWS_PATH + API.AWS_BUCKET + item.propertyMediaInfo[0].image_path + "/" + item.propertyMediaInfo[0].image_name;
      // } else {
      //   imgUrl = API.DEFAULT_IMAGE_URL + Strings.PROPERTY_DEFAULT_IMAGE;
      // }
    }

    if (item.XMLPropertyInfo.images && item.XMLPropertyInfo.images.length !== 0 && item.XMLPropertyInfo.images[0] !== "") {
        console.log("XMLPropertyInfo >>>> ");
        //imgUrl = API.AWS_PATH + API.AWS_BUCKET + propImage;
        //imgUrl = propImage.contain("http") ? propImage : imgUrl = API.AWS_PATH + API.AWS_BUCKET + propImage;
        imgUrl = propImage;

    } else if (item.propertyMediaInfo !== undefined && item.propertyMediaInfo.length !== 0) {   
      console.log("propertyMediaInfo >>>> ");   
        imgUrl = API.AWS_PATH + API.AWS_BUCKET + item.propertyMediaInfo[0].image_path + "/" + item.propertyMediaInfo[0].image_name;
    } else if (item.hasOwnProperty("images")) {
      console.log("item.hasOwnProperty >>>> ");   
      if (item.images.length !== 0 && item.images[0] !== "") {
        let imgArray = item.images.img;
        for (let i = 0; i < imgArray.length; i++) {
          if (imgArray[i].hasOwnProperty("url")) {
            imgUrl = imgArray[i].url;
            break;
          }
        }
      }
    }else {
      console.log("No Image found >>>> "); 
        imgUrl = API.DEFAULT_IMAGE_URL + Strings.PROPERTY_DEFAULT_IMAGE;
    }
    
    console.log("SWAP Img index >>>>> " + index + " Img Url >>>>> " + imgUrl);

    //console.log("Img Url >>>>> " + imgUrl);

    return (
      <TouchableWithoutFeedback onPress={() => this.actionOnRow(item)}>
        <View style={ProprertyListingScreenStyle.propertyListCardItemContainer}>
          <View
            style={{
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10,
              overflow: "hidden"
            }}
          >
            <ImageBackground
              imageStyle={{ borderRadius: 2, overflow: "hidden" }}
              style={{ height: DEVICE_HEIGHT / 4.5, borderRadius: 100 }}
              source={
                imgUrl !== ""
                  ? { uri: imgUrl }
                  : { uri: API.DEFAULT_IMAGE_URL + Strings.PROPERTY_DEFAULT_IMAGE }
              }
            //source={{ uri: (imgUrl !== "") ? imgUrl : "https://picsum.photos/200/300/?blur" }}
            >
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  position: "absolute",
                  bottom: 0,
                  marginBottom: 10,
                  borderTopLeftRadius: 10,
                  borderTopRightRadius: 10
                }}
              >
                <View style={{ flex: 0.02 }}>
                  <Image source={require("../../Assets/Rectangle_4.png")} />
                </View>
                <View style={{ flex: 0.98 }}>
                  <Text style={{ color: "white", fontWeight: "bold" }}>
                    {item.property_unique_id}
                  </Text>
                </View>
              </View>
            </ImageBackground>
          </View>

          <View style={{ flex: 1, flexDirection: "row", margin: 10 }}>
            <View style={{ flex: 0.7 }}>

              <View style={{ alignContent: "flex-start", alignSelf: "flex-start", alignSelf: "flex-start", justifyContent: "flex-start" }}>
                <Text style={{
                  color: Colors.grey_900,
                  fontSize: 16,
                  fontWeight: "bold"
                }}>{"$" + propPrice}</Text>

              </View>

              <View style={{ marginTop: 10, alignContent: "flex-start", alignSelf: "flex-start", alignSelf: "flex-start", justifyContent: "flex-start" }}>
                <Text style={{
                  color: Colors.grey_900,
                  fontSize: 15,
                  fontWeight: "400"
                }}>{propType}</Text>

              </View>

              <View style={{ flex: 0.3, marginTop: 10, alignContent: "flex-start", alignSelf: "flex-start", alignSelf: "flex-start", justifyContent: "flex-start" }}>
                <Text style={{
                  color: Colors.grey_900,
                  fontSize: 14
                }}>
                  {propAddress}
                </Text>

              </View>

              <View style={{ marginTop: 10, alignContent: "flex-start", alignSelf: "flex-start", alignSelf: "flex-start", justifyContent: "flex-start" }}>

                <View>
                  {/* <Text style={{ fontSize: 14, margin: 5 }}>FEATURES:</Text> */}
                  <View style={{ flexDirection: "row" }}>
                    <View style={{ flexDirection: "row" }}>
                      {/* <Image
                                                        style={{ margin: 5 }}
                                                        source={require("../../Assets/bed.png")}
                                                    /> */}
                      <Icon
                        containerStyle={{ marginRight: 5 }}
                        size={16}
                        name='bed'
                        type='font-awesome'
                        color={Colors.COLOR_PRIMARY_DARK}
                      />
                      <Text style={{ fontSize: 14, marginTop: 3 }} >{propBedroom}</Text>
                    </View>
                    <View style={{ flexDirection: "row", marginLeft: 10 }}>
                      <Icon
                        containerStyle={{ marginRight: 5 }}
                        size={16}
                        name='bathtub'
                        type='font-awesome'
                        color={Colors.COLOR_PRIMARY_DARK}
                      />
                      <Text style={{ fontSize: 14, marginTop: 2 }} >{propBathroom}</Text>
                    </View>
                    <View style={{ flexDirection: "row", marginLeft: 10 }}>
                      <Icon
                        containerStyle={{ marginRight: 5 }}
                        size={16}
                        name='car'
                        type='font-awesome'
                        color={Colors.COLOR_PRIMARY_DARK}
                      />
                      <Text style={{ fontSize: 14, marginTop: 2, marginLeft: 5 }} >{propGarage}</Text>
                    </View>
                  </View>


                </View>
              </View>
              {propLandSize ? (<View style={{ flexDirection: "row", marginTop: 15 }}>
                <Icon
                  containerStyle={{ marginRight: 5 }}
                  size={18}
                  name="home"
                  type="font-awesome"
                  color={Colors.COLOR_PRIMARY_DARK}
                />
                <Text
                  style={{ fontSize: 12, marginTop: 2, marginLeft: 5 }}
                >
                  {propLandSize + " sqm"}
                </Text>
              </View>) : null}


              {item.underOffer === "yes" ? (<View style={{ flexDirection: "row", marginTop: 15 }}>
                <Icon
                  containerStyle={{ marginRight: 5 }}
                  size={18}
                  name="file-text-o"
                  type="font-awesome"
                  color={Colors.yellow_900}
                />
                <Text
                  style={{ fontSize: 12, marginTop: 2, marginLeft: 5, fontWeight: "bold", color: Colors.yellow_900 }}
                >
                  {"This Property is Under Contract"}
                </Text>
              </View>) : null}                                         


            </View>


          </View>


        </View>
      </TouchableWithoutFeedback>
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
)(ProprertyListingScreen);


