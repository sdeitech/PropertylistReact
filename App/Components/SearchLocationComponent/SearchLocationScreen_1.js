import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
    View,
    Image,
    ImageBackground,
    StyleSheet,
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


import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import {
    BarIndicator,
} from 'react-native-indicators';
import OfflineNotice from "../../Utils/OfflineNotice";
import DeviceInfo from "react-native-device-info";

import SearchLocationScreenStyle from "./SearchLocationScreenStyle";
import { Avatar, Divider,Text } from "react-native-elements";
import CardView from "react-native-cardview";
import FastImage from "react-native-fast-image";
import LinearGradient from "react-native-linear-gradient";
import RangeSlider from "react-native-range-slider";
import Geocoder from "react-native-geocoder";
import RNGooglePlaces from "react-native-google-places";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import {showErrorMessage } from "../../Utils/Validations"
import MultiSlider from "@ptomasroos/react-native-multi-slider";

class SearchLocationScreen extends Component {
  constructor() {
    super();
    this.state = {
      checked: true,
      email: "",
      password: "",
      address: "",
      visible: false,
      isSpinnerVisible: false,
      sliderOneChanging: false,
      sliderOneValue: [5],
      multiSliderValue: [3, 7],
      lat:"",
      lang:"",
      minPrice:0,
      maxPrice:1000,
    };
  }

  componentWillReceiveProps(nextProps) {
    this._changeLoadingState(false);
  }

  onSubmit = () => {

    if(this.state.lat==="" && this.state.lang===""){
        showErrorMessage("Please provide location");
    }else{
      var postData = {
        "filter": {
            radius: [this.state.lang, this.state.lat],
            price_range:[this.state.minPrice,this.state.maxPrice],
            page : 1,
            count: 20
        },
        
      };

      this._storeUserData(Strings.KEY_FILTER_DATA, JSON.stringify(postData));

      console.log("On Submit Data >>>>>"+JSON.stringify(postData));

    
    }
    //  Actions.dashboardScreen();
  };

  _storeUserData = async (key, value) => {
    try {
      const resp = await AsyncStorage.setItem(key, value);

      Actions.dashboardScreen({ type: "reset" });
    } catch (error) {
      // Error saving data
      console.log("Async Error >> " + error);
    }
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
    RNGooglePlaces.openPlacePickerModal()
      .then((place) => {
        console.log("Place Info >> " + JSON.stringify(place));
        // place represents user's selection from the
        // suggestions and it is a simplified Google Place object.
     
        this.setState({
          address: place.address,
          lat: place.latitude,
          lang: place.longitude
        });  

      })
      .catch(error => console.log(error.message));  // error is a Javascript Error object
  }


  getCurrentLocation(){
    setTimeout(() => {
      RNGooglePlaces.getCurrentPlace()
        .then(results => console.log("Get Current Location >>> "+JSON.stringify(results)))
        .catch(error => console.log("Error >>>>" + error.message));
    }, 0);
  }


  render() {
    return <View style={{ flex: 1, backgroundColor: "#F6F6F6" }}>
        <OfflineNotice />

        {this.state.isSpinnerVisible ? <View style={{ flex: 1, left: 0, right: 0, top: 0, bottom: 0, position: "absolute", justifyContent: "center", alignItems: "center", backgroundColor: Colors.TRANSPARENT, width: window.width, height: window.height }}>
            <BarIndicator color={Colors.WHITE} count={4} />
          </View> : null}

        <KeyboardAwareScrollView resetScrollToCoords={{ x: 0, y: 0 }} scrollEnabled={true} extraHeight={40} extraScrollHeight={40} keyboardShouldPersistTaps="handled" enableAutoAutomaticScroll={true} enableOnAndroid={true}>
          <View style={{ flex: 1, marginTop: 50, marginBottom: 20 }}>
            <Text style={{ color: "#545454", marginLeft: 25 }} h3>
              Hi There!
            </Text>

            <Text style={{ color: "#545454", marginLeft: 25 }} h3>
              Let find your home
            </Text>
          </View>

          <View style={{ flex: 1, margin: 5 }}>
            <CardView style={{ backgroundColor: Colors.WHITE, margin: 5 }} cardElevation={10} cornerRadius={5}>
              <View style={{ margin: 20 }}>
                <Text style={{ color: "#545454", fontSize: 18 }}>
                  Preferred Location
                </Text>
              </View>

              {/* <TextInput 
                placeholder="Enter the preferred location,suburb or postcode"
                placeholderTextColor={Colors.BACK_ARROW_COLOR} 
                onChangeText={text => this.setState(
                      { text }
                )} //   value={this.state.text}
                style={SearchLocationScreenStyle.textInputStyleClass} 
                value={this.state.address}
                onTouchStart={() => this.openSearchModal()}  
              /> */}
            <GooglePlacesAutocomplete
              placeholder='Enter Location'
              minLength={2}
              autoFocus={false}
              returnKeyType={'default'}
              fetchDetails={true}
              query={{
                // available options: https://developers.google.com/places/web-service/autocomplete
                key: 'AIzaSyD_Y3DBYPkIhbNPKfjQbFl3DHuIKCVS29M',
                language: 'en', // language of the results
              }}

              styles={{
                textInputContainer: {
                  backgroundColor: 'rgba(0,0,0,0)',
                  borderTopWidth: 0,
                  borderBottomWidth: 0
                },
                textInput: {
                  marginLeft: 0,
                  marginRight: 0,
                  height: 38,
                  color: '#5d5d5d',
                  fontSize: 16
                },
                predefinedPlacesDescription: {
                  color: '#1faadb'
                },
              }}
              currentLocation={false}
            />

            <TouchableOpacity activeOpacity={0.5} onPress={() => this.getCurrentLocation()}>
                <LinearGradient colors={[Colors.START_COLOR, Colors.END_COLOR]} style={SearchLocationScreenStyle.roundedButtonStyleAppTheme}>
                  <View style={{ flexDirection: "row", padding: 10 }}>
                    <Image source={require("../../Assets/placeholder_location.png")} />
                    <Text
                      style={{
                        color: Colors.WHITE,
                        fontWeight: "bold",
                        marginLeft: 5
                      }}
                    >
                      {" "}
                      {"Pick my current location"}{" "}
                    </Text>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            </CardView>
          </View>

          <View style={{ flex: 1, margin: 5 }}>
            <CardView style={{ backgroundColor: Colors.WHITE, margin: 5 }} cardElevation={10} cornerRadius={5}>
              <View style={{ margin: 20, flexDirection: "column" }}>
                <Text
                  style={{
                    color: "#545454",
                    fontSize: 18,
                    fontWeight: "100"
                  }}
                >
                  Price Range
                </Text>

                <View style={{ flex: 1, flexDirection: "row", marginTop: 10, marginBottom: 20 }}>
                  <Text
                    style={{
                      color: "#545454",
                      fontSize: 14,
                      fontWeight: "100"
                    }}
                  >
                    {"From"}
                  </Text>
                  <Text
                    style={{
                      color: "#545454",
                      fontSize: 14,
                      fontWeight: "100",
                      marginRight: 10,
                      marginLeft: 10
                    }}
                  >
                    {"$"+this.state.minPrice}
                  </Text>
                  <Text
                    style={{
                      color: "#545454",
                      fontSize: 14,
                      fontWeight: "100",
                      marginLeft: 10,
                      marginRight: 10
                    }}
                  >
                    {"To"}
                  </Text>
                  <Text
                    style={{
                      color: "#545454",
                      fontSize: 14,
                      fontWeight: "100",
                      marginRight: 10
                    }}
                  >
                    {"$"+this.state.maxPrice}
                  </Text>
                </View>

              <View style={{ flex: 1, flexDirection: "row", marginLeft: 10, marginRight: 10 }}>
                  {/* <RangeSlider minValue={0} maxValue={800000} tintColor={Colors.START_COLOR} handleBorderWidth={1} handleBorderColor={Colors.START_COLOR} selectedMinimum={20} selectedMaximum={40} style={{ flex: 1, height: 70, padding: 10, backgroundColor: "TRANSPARENT" }} 
                  onChange={data => {
                      //console.log("Range Data >>>>>"+JSON.stringify(data));
                      this.setState({
                        minPrice: data.selectedMinimum,
                        maxPrice: data.selectedMaximum
                      });
                    }} /> */}
                <MultiSlider
                  values={[0, 800000]}
                  sliderLength={280}
                  onValuesChange={data => {
                    console.log("Range Data >>>>>" + JSON.stringify(data));
                    this.setState({
                      minPrice: data[0],
                      maxPrice: data[1]
                    });
                  }}
                  min={0}
                  max={800000}
                  step={1}
                />
                </View>
              </View>
            </CardView>
          </View>
        </KeyboardAwareScrollView>
        <TouchableOpacity activeOpacity={0.5} onPress={() => this.onSubmit()}>
        <LinearGradient colors={[Colors.START_COLOR, Colors.END_COLOR]} style={SearchLocationScreenStyle.squareButtonStyleAppTheme}>
          <View style={{ flexDirection: "row", padding: 10 }}>
            <Text
              style={{
                color: Colors.WHITE,
                fontWeight: "bold",
                marginLeft: 5
              }}
            >
              {" "}
              {"DONE"}{" "}
            </Text>
          </View>
        </LinearGradient>
        </TouchableOpacity>
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

export default connect(mapStateToProps, mapDispatchToProps)(SearchLocationScreen);


