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
    Picker,
    KeyboardAvoidingView,
    Linking,
    Keyboard,
    TouchableHighlight

} from 'react-native';

import {
  clearPropertyListResponse,
  getAllPropertyList,
  getFilteredPropertyList
} from "../../Action/ActionCreators";


import { bindActionCreators } from "redux";
import { Actions } from 'react-native-router-flux';
import Colors from '../../Constants/Colors';
import Strings from '../../Constants/Strings';
import LinearGradient from "react-native-linear-gradient";
import {validateEmail,showErrorMessage} from "../../Utils/Validations"
import HeaderScreen from "../CommonComponent/HeaderScreen";

import {
    BarIndicator,
} from 'react-native-indicators';
import OfflineNotice from "../../Utils/OfflineNotice";
import DeviceInfo from "react-native-device-info";
import { Icon } from "react-native-elements";

import Home from "../../Assets/my_property.png";
import Saved from "../../Assets/001-arrows.png";
import Chat from "../../Assets/002-communication.png";
import Notification from "../../Assets/002-notification.png";
import More from "../../Assets/more.png";
import CardView from "react-native-cardview";
import ProprertyListingScreenStyle from "./ProprertyListingScreenStyle";
import STRINGS from '../../Constants/Strings';
import FastImage from 'react-native-fast-image';
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { ifIphoneX, getStatusBarHeight, getBottomSpace } from "react-native-iphone-x-helper";
import { Header } from "react-native-elements";
import HeaderScreenStyle from "../CommonComponent/HeaderStyle";
import Modal from "react-native-modal";
import FilterListScreenStyle from "../FilterListComponent/FilterListScreenStyle";
import { Dropdown } from "react-native-material-dropdown";
import RNGooglePlaces from "react-native-google-places";
import RangeSlider from "react-native-range-slider";
import API from '../../Constants/APIUrls';
import MultiSlider from "@ptomasroos/react-native-multi-slider";


const DEVICE_WIDTH = Dimensions.get("window").width;
const DEVICE_HEIGHT = Dimensions.get("window").height;

class ProprertySearchScreen extends Component {
  constructor() {
    super();
    this.onChangeText = this.onChangeText.bind(this);
    this.state = {
      checked: true,
      email: "",
      password: "",
      visible: false,
      isSpinnerVisible: false,
      activeTab: Strings.HOME_KEY,
      is_active: true,
      propertyData: [],
      isModalVisible: false,
      address: "",
      lat: "",
      lang: "",
      minPrice: 0,
      maxPrice: 1000,
      selectedPropertyType:"",
      selectedNumberOfBedroom:"",
      selectedNumberOfBathroom:"",
      selectedCarSpace:false,
    };
  }


  openSearchModal() {

    console.log("In openSearchModal >>>>>");
    RNGooglePlaces.openAutocompleteModal()
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

  _toggleModal() {
    this.setState({
      isModalVisible: !this.state.isModalVisible, 
      selectedNumberOfBedroom: "",
      selectedNumberOfBathroom: "",
      selectedCarSpace: "" });
  }

 _toogleNumberOfBedroom(text){

  switch(text){

    case Strings.NO_OF_BEDROOM_STUDIO:

      return this.setState({
        selectedNumberOfBedroom:Strings.NO_OF_BEDROOM_STUDIO
      });

    case Strings.NO_OF_BEDROOM_ONE:

      return this.setState({
        selectedNumberOfBedroom: Strings.NO_OF_BEDROOM_ONE
      });

    case Strings.NO_OF_BEDROOM_TWO:

      return this.setState({
        selectedNumberOfBedroom: Strings.NO_OF_BEDROOM_TWO
      });

    case Strings.NO_OF_BEDROOM_THREE_PLUS:

      return this.setState({
        selectedNumberOfBedroom: Strings.NO_OF_BEDROOM_THREE_PLUS
      });

      
  }

 } 


  _toogleNumberOfBathroom(text) {

    switch (text) {

      case Strings.NO_OF_BATHROOM_ONE:

        return this.setState({
          selectedNumberOfBathroom: Strings.NO_OF_BATHROOM_ONE
        });

      case Strings.NO_OF_BATHROOM_TWO:

        return this.setState({
          selectedNumberOfBathroom: Strings.NO_OF_BATHROOM_TWO
        });

      case Strings.NO_OF_BATHROOM_THREE_PLUS:

        return this.setState({
          selectedNumberOfBathroom: Strings.NO_OF_BATHROOM_THREE_PLUS
        });


    }

  } 

  _toogleCarSpace(text) {

    switch (text) {

      case Strings.CAR_SPACE_YES:

        return this.setState({
          selectedCarSpace: true
        });

      case Strings.CAR_SPACE_NO:

        return this.setState({
          selectedCarSpace: false
        });

    

    }

  } 


  onChangeText(text) {
    console.log("Selected PropertyType >>>"+JSON.stringify(text));
    this.setState({
      selectedPropertyType:text
    });  
  }

  renderModal() {
    let data = [
      {
         value: 'House',
      },
      {
        value: 'Townhouse',
      }, 
      {
        value: 'Flat/Apartment',
      },
      {
        value: 'Villa',
      },
      {
        value: 'Land',
      },
      {
        value: 'Acreage',
      },
      {
        value: 'Rural',
      },
      {
        value: 'Block of Units',
      },
      {
        value: 'Flat/Apartment',
      },
      {
        value: 'Retirement Living',
      },
      {
        value: 'Off the Plan / Development',
      }
  
  ];
  
    return (
      <Modal
        style={{ backgroundColor: "#FFF" }}
        animationIn="zoomInDown"
        animationOut="zoomOutUp"
        animationInTiming={1000}
        animationOutTiming={1000}
        backdropTransitionInTiming={1000}
        backdropTransitionOutTiming={1000}
        isVisible={this.state.isModalVisible}
        //useNativeDriver={true}
        //onSwipe={() => this.setState({ isVisible: false })}
        onBackdropPress={() => this.setState({ isVisible: false })}
      >
        <View style={{ flex: 1 }}>
          <View style={styles.header}>
            <Header
              backgroundColor={"#fff"}
              leftComponent={this.renderLeftFilterComponent()}
              centerComponent={this.renderCenterFilterOne()}
              rightComponent={this.renderRightFilterOne()}
            />
          </View>
          <KeyboardAwareScrollView>
            <CardView
              cardElevation={10}
              cornerRadius={10}
              style={FilterListScreenStyle.containerStyle}
            >
              <View style={FilterListScreenStyle.subContainerStyle}>
                <Dropdown
                  ref={this.codeRef}
                  label='Property Type'
                  onChangeText={this.onChangeText}
                  data={data}
                />

                <TextInput
                  placeholder="Enter the preferred location,suburb or postcode"
                  placeholderTextColor={Colors.BACK_ARROW_COLOR}
                  onChangeText={text => this.setState(
                    { text }
                  )} //   value={this.state.text}
                  style={styles.textInputStyleClass}
                  value={this.state.address}
                  onTouchStart={() => this.openSearchModal()}
                />
              </View>
              <View
                flexDirection={"row"}
                alignItems={"center"}
                style={FilterListScreenStyle.subContainerStyle}
              >
                <Image
                  style={{ margin: 5 }}
                  source={require("../../Assets/bed.png")}
                />
                <Text style={FilterListScreenStyle.textStyle}>
                  No. of Bedrooms
                </Text>
              </View>
              <View style={FilterListScreenStyle.btnContainerStyle}>
                <TouchableOpacity 
                style={{
                  borderColor: "#545454",
                  backgroundColor: (this.state.selectedNumberOfBedroom === Strings.NO_OF_BEDROOM_STUDIO) ? Colors.FILTER_SELECTED_COLOR :"#FFF",
                  borderWidth: 1,
                  borderRadius: 20,
                  paddingLeft: 10,
                  paddingRight: 10,
                  paddingBottom: 3,
                  paddingTop: 3,
                  marginLeft: 10,
                  marginRight: 10,
                  marginBottom: 20
                }}
                
                onPress={() => this._toogleNumberOfBedroom(Strings.NO_OF_BEDROOM_STUDIO)}
                >
                  <Text style={{ fontSize: 13 }}>1</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    borderColor: "#545454",
                    backgroundColor: (this.state.selectedNumberOfBedroom === Strings.NO_OF_BEDROOM_ONE) ? Colors.FILTER_SELECTED_COLOR : "#FFF",
                    borderWidth: 1,
                    borderRadius: 20,
                    paddingLeft: 8,
                    paddingRight: 8,
                    paddingBottom: 3,
                    paddingTop: 3,
                    marginLeft: 5,
                    marginRight: 5,
                    marginBottom: 20
                  }}

                  onPress={() => this._toogleNumberOfBedroom(Strings.NO_OF_BEDROOM_ONE)}
                >
                  <Text style={{ fontSize: 13 }}> 2 </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    borderColor: "#545454",
                    backgroundColor: (this.state.selectedNumberOfBedroom === Strings.NO_OF_BEDROOM_TWO) ? Colors.FILTER_SELECTED_COLOR : "#FFF",
                     borderWidth: 1,
                    borderRadius: 20,
                    paddingLeft: 8,
                    paddingRight: 8,
                    paddingBottom: 3,
                    paddingTop: 3,
                    marginLeft: 5,
                    marginRight: 5,
                    marginBottom: 20
                  }}

                  onPress={() => this._toogleNumberOfBedroom(Strings.NO_OF_BEDROOM_TWO)}
                >
                  <Text style={{ fontSize: 13 }}> 3 </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    borderColor: "#545454",
                    backgroundColor: (this.state.selectedNumberOfBedroom === Strings.NO_OF_BEDROOM_THREE_PLUS) ? Colors.FILTER_SELECTED_COLOR : "#FFF",
                    borderWidth: 1,
                    borderRadius: 20,
                    paddingLeft: 8,
                    paddingRight: 8,
                    paddingBottom: 3,
                    paddingTop: 3,
                    marginLeft: 5,
                    marginRight: 5,
                    marginBottom: 20
                  }}

                  onPress={() => this._toogleNumberOfBedroom(Strings.NO_OF_BEDROOM_THREE_PLUS)}
                >
                  <Text style={{ fontSize: 13 }}>4</Text>
                </TouchableOpacity>
              </View>
              <View
                flexDirection={"row"}
                alignItems={"center"}
                style={FilterListScreenStyle.subContainerStyle}
              >
                <Image
                  style={{ margin: 5 }}
                  source={require("../../Assets/bathtub.png")}
                />
                <Text style={FilterListScreenStyle.textStyle}>
                  No. of Bathrooms
                </Text>
              </View>
              <View style={FilterListScreenStyle.btnContainerStyle}>
                <TouchableOpacity
                  style={{
                    borderColor: "#545454",
                    backgroundColor: (this.state.selectedNumberOfBathroom === Strings.NO_OF_BATHROOM_ONE) ? Colors.FILTER_SELECTED_COLOR : "#FFF",
                    borderWidth: 1,
                    borderRadius: 20,
                    paddingLeft: 13,
                    paddingRight: 13,
                    paddingBottom: 3,
                    paddingTop: 3,
                    marginLeft: 10,
                    marginRight: 10,
                    marginBottom: 20
                  }}

                  onPress={() => this._toogleNumberOfBathroom(Strings.NO_OF_BATHROOM_ONE)}
                >
                  <Text style={{ fontSize: 13 }}> 1 </Text>
                </TouchableOpacity>


                <TouchableOpacity
                  style={{
                    borderColor: "#545454",
                    backgroundColor: (this.state.selectedNumberOfBathroom === Strings.NO_OF_BATHROOM_TWO) ? Colors.FILTER_SELECTED_COLOR : "#FFF",
                    borderWidth: 1,
                    borderRadius: 20,
                    paddingLeft: 13,
                    paddingRight: 13,
                    paddingBottom: 3,
                    paddingTop: 3,
                    marginLeft: 10,
                    marginRight: 10,
                    marginBottom: 20
                  }}

                  onPress={() => this._toogleNumberOfBathroom(Strings.NO_OF_BATHROOM_TWO)}
                >

                  <Text style={{ fontSize: 13 }}> 2 </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    borderColor: "#545454",
                    backgroundColor: (this.state.selectedNumberOfBathroom === Strings.NO_OF_BATHROOM_THREE_PLUS) ? Colors.FILTER_SELECTED_COLOR : "#FFF",
                    borderWidth: 1,
                    borderRadius: 20,
                    paddingLeft: 13,
                    paddingRight: 13,
                    paddingBottom: 3,
                    paddingTop: 3,
                    marginLeft: 10,
                    marginRight: 10,
                    marginBottom: 20
                  }}

                  onPress={() => this._toogleNumberOfBathroom(Strings.NO_OF_BATHROOM_THREE_PLUS)}
                >
                  <Text style={{ fontSize: 13 }}> 3+ </Text>
                </TouchableOpacity>
              </View>
              <View
                flexDirection={"row"}
                alignItems={"center"}
                style={FilterListScreenStyle.subContainerStyle}
              >
                <Image
                  style={{ margin: 5 }}
                  source={require("../../Assets/garage.png")}
                />
                <Text style={FilterListScreenStyle.textStyle}>Car Space</Text>
              </View>
              <View style={FilterListScreenStyle.btnContainerStyle}>
                <TouchableOpacity
                  style={{
                    borderColor: "#545454",
                    backgroundColor: (this.state.selectedCarSpace) ? Colors.FILTER_SELECTED_COLOR : "#FFF",
                    borderWidth: 1,
                    borderRadius: 20,
                    paddingLeft: 13,
                    paddingRight: 13,
                    paddingBottom: 3,
                    paddingTop: 3,
                    marginLeft: 10,
                    marginRight: 10,
                    marginBottom: 20
                  }}

                  onPress={() => this._toogleCarSpace(Strings.CAR_SPACE_YES)}
                >
                  <Text style={{ fontSize: 13 }}> YES </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    borderColor: "#545454",
                    backgroundColor: (!this.state.selectedCarSpace) ? Colors.FILTER_SELECTED_COLOR : "#FFF",
                    borderWidth: 1,
                    borderRadius: 20,
                    paddingLeft: 13,
                    paddingRight: 13,
                    paddingBottom: 3,
                    paddingTop: 3,
                    marginLeft: 10,
                    marginRight: 10,
                    marginBottom: 20
                  }}

                  onPress={() => this._toogleCarSpace(Strings.CAR_SPACE_NO)}
                >
                  <Text style={{ fontSize: 13 }}> NO </Text>
                </TouchableOpacity>
              </View>
              <View style={FilterListScreenStyle.subContainerStyle}>
                <Text style={{ fontSize: 15, padding: 5 }}>Price range</Text>
                <View flexDirection={"row"} alignItems={"center"}>
                  <Text style={{ fontSize: 13, padding: 5 }}>From</Text>
                  <Text style={{ fontSize: 15 }}> {"$ "+this.state.minPrice}</Text>
                  <Text style={{ fontSize: 13, padding: 5 }}> to </Text>
                  <Text style={{ fontSize: 15 }}> {"$ "+this.state.maxPrice}</Text>
                </View>
              </View>
              <View style={{ flex: 1, flexDirection: "row", marginLeft: 10, marginRight: 10 }}>
                {/* <RangeSlider 
                    minValue={0} 
                    maxValue={800000} 
                    tintColor={Colors.START_COLOR} 
                    handleBorderWidth={1} 
                    handleBorderColor={Colors.START_COLOR} 
                    style={{ flex: 1, height: 70, padding: 10, backgroundColor: "TRANSPARENT" }}
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
              <View style={FilterListScreenStyle.subContainerStyle}>
                {/* <TextInput
                  style={FilterListScreenStyle.searchInputStyle}
                  multiline
                  numberOfLines={6}
                  editable
                  maxLength={50}
                  placeholder="Searching for some thing specific, please mention here..."
                /> */}
                <View style={styles.textAreaContainer} >
                  <TextInput
                    style={styles.textArea}
                    underlineColorAndroid="transparent"
                    placeholder="Searching for some thing specific, please mention here..."
                    placeholderTextColor={Colors.BACK_ARROW_COLOR}
                    onChangeText={(text) => this.setState({ aboutMe: text })}
                    value={this.state.aboutMe}
                    numberOfLines={4}
                    multiline={true}
                  />
                </View>
              </View>
             
            </CardView>
          </KeyboardAwareScrollView>
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
          <View>
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={() => this._getAdvanceFilteredData()}
            >
              <LinearGradient
                colors={["#00C2D7", "#4EE1CA"]}
                style={FilterListScreenStyle.roundedButtonStyleAppTheme}
              >
                <Text style={{ color: "white" }}> {"APPLY FILTERS"} </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }


  _getAdvanceFilteredData(){
    AsyncStorage.getItem(Strings.KEY_USER_DATA)
      .then(value => {
        if (value) {
          var userData = JSON.parse(value);
          console.log("==== ID ===", userData);

          //this.setState({ userInfo: userData });
          var postData = {
            "filter": {
              radius: [this.state.lang, this.state.lat],
              price_range: [this.state.minPrice, this.state.maxPrice],
              no_of_bathroom: this.state.selectedNumberOfBathroom,
              no_of_bedroom: this.state.selectedNumberOfBedroom,
              property_type:this.state.selectedPropertyType,
              car_space: this.state.selectedCarSpace,
              page: 1,
              count: 20
            },
          };

          console.log("Advance Filter Data >>>> "+JSON.stringify(postData));
          this.props.clearPropertyListResponse();;
        
          this._changeLoadingState(true);
          this.props.getFilteredPropertyList(postData, userData.token);
        }
      })
      .done();

  }

  componentWillMount() {
    console.log("ProprertyListingScreen >>>>>" + JSON.stringify(this.props));

    this._getFilterData();
  }

  _getFilterData() {
    AsyncStorage.getItem(Strings.KEY_FILTER_DATA)
      .then(value => {
        if (value) {
          var filterData = JSON.parse(value);
          console.log("==== ID ===", filterData);

          //this.setState({ userInfo: userData });
          this._changeLoadingState(true);

          this._getUserData(this.props.filterData);
        }
      })
      .done();
  }

  _getUserData(filterData) {
    AsyncStorage.getItem(Strings.KEY_USER_DATA)
      .then(value => {
        if (value) {
          var userData = JSON.parse(value);
          console.log("==== ID ===", userData);

          //this.setState({ userInfo: userData });
          
          this._changeLoadingState(true);
          

          this.props.getAllPropertyList(filterData, userData.token);
        }
      })
      .done();
  }

  componentWillReceiveProps(nextProps) {
    this._changeLoadingState(false);
    console.log(
      "ProprertySearchScreen componentWillReceiveProps >>>>> " +
        JSON.stringify(nextProps)
    );

    if (
      nextProps.PropertyListingReducer.propertyListRes != undefined &&
      nextProps.PropertyListingReducer.propertyListRes != "") {
      if (
        nextProps.PropertyListingReducer.propertyListRes.code ==
        Strings.STATUS_OK
      ) {
        this.setState({
          propertyData:
            nextProps.PropertyListingReducer.propertyListRes.data.data
        });
      } else {
        Alert.alert(
          Strings.APP_NAME,
          nextProps.PropertyListingReducer.propertyListRes.message,
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
    } else if (
      nextProps.PropertyListingReducer.propertyFilteredRes !== undefined &&
      nextProps.PropertyListingReducer.propertyFilteredRes !== "") {

      if (nextProps.PropertyListingReducer.propertyFilteredRes.code === Strings.STATUS_OK){

        if (nextProps.PropertyListingReducer.propertyFilteredRes.data.data.length!==0){
          this._toggleModal();
          this.setState({
            propertyData:
              nextProps.PropertyListingReducer.propertyFilteredRes.data.data
          });
        }else{
          Alert.alert(
            Strings.APP_NAME,
            "Sorry !! Properties not found.",
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

  renderLeftOne() {
    return (
      <TouchableOpacity
        hitSlop={HeaderScreenStyle.touchableAreaStyle}
        onPress={() => this.showLogoutAlert()}
      >
        <Image source={require("../../Assets/help.png")} />
      </TouchableOpacity>
    );
  }

  renderLeftFilterComponent() {
    return (
      <TouchableOpacity
        hitSlop={HeaderScreenStyle.touchableAreaStyle}
        onPress={() => console.log("")}
      >
        <Image source={require("../../Assets/help.png")} />
      </TouchableOpacity>
    );
  }

  renderCenterOne() {
    return (
      <View>
        <Text style={styles.titleTextStyle}>
          {Strings.PROPERTY_HOME_SCREEN_TITLE}
        </Text>
      </View>
    );
  }

  renderCenterFilterOne() {
    return (
      <View>
        <Text style={styles.titleTextStyle}>
          {Strings.PROPERTY_FILTER_SCREEN_TITLE}
        </Text>
      </View>
    );
  }

  renderRightOne() {
    return (
      <TouchableOpacity
        hitSlop={HeaderScreenStyle.touchableAreaStyle}
        onPress={() => this._toggleModal()}
      >
        <Image source={require("../../Assets/filter.png")} />
      </TouchableOpacity>
    );
  }

  renderRightFilterOne() {
    return (
      <TouchableOpacity
        hitSlop={HeaderScreenStyle.touchableAreaStyle}
        onPress={() => this._toggleModal()}
      >
        {/* <Image source={require("../../Assets/filter.png")} /> */}
        <Icon
          
          name='times-circle'
          type='font-awesome'
          color={Colors.COLOR_CUTTY_SHARK}
          onPress={() => this._toggleModal()} />
      </TouchableOpacity>
    );
  }

  _onChangeNumberOfBedroom(){
    
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <OfflineNotice />
        {/* <HeaderScreen title={Strings.PROPERTY_HOME_SCREEN_TITLE} /> */}
        <View style={styles.header}>
          <Header
            backgroundColor={"#fff"}
            leftComponent={this.renderLeftOne()}
            centerComponent={this.renderCenterOne()}
            rightComponent={this.renderRightOne()}
          />
        </View>

        <View style={{ flex: 1 }}>
          {this.state.propertyData.length ? (
            <FlatList
              style={{ marginTop: 10 }}
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
        {this.renderModal()}
      </View>
    );
  }

  actionOnRow(item) {
    console.log("Selected Item :", JSON.stringify(item));
    Actions.propertyDetailScreen({ propertyID: item._id });
  }

  showLogoutAlert() {
    Alert.alert(
      Strings.APP_NAME,
      "Are you sure , you want the exit the app ?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "Logout", onPress: () => this.logoutFromApp() }
      ],
      { cancelable: false }
    );
  }

  logoutFromApp() {
    AsyncStorage.removeItem(Strings.KEY_USER_DATA);
    Actions.signInScreen({ type: "reset" });
    // if (this.removeItemValue(Strings.KEY_USER_DATA)) {
    //   Actions.signInScreen({ type: "reset" });
    // }
  }

  _renderItem(item, index) {
    let imgUrl="";
    if (item.propertyMediaInfo !== undefined && item.propertyMediaInfo.length !== 0 ){
      imgUrl = API.AWS_PATH + API.AWS_BUCKET + item.propertyMediaInfo[0].image_path + "/" + item.propertyMediaInfo[0].image_name;
    }
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
              source={{ uri: (imgUrl !== "") ? imgUrl : "https://picsum.photos/200/300/?blur" }}
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
                    {item.property_name}
                  </Text>
                </View>
              </View>
            </ImageBackground>
          </View>
          <View style={{ flex: 0.3, flexDirection: "row", margin: 10 }}>
            <View
              style={{
                flex: 0.8,
                flexDirection: "row",
                justifyContent: "space-between",
                alignContent: "flex-start",
                justifyContent: "flex-start",
                alignSelf: "flex-start"
              }}
            >
              <View style={{ flex: 0.1 }}>
                <Image source={require("../../Assets/cost-1.png")} />
              </View>
              <View style={{ flex: 0.9 }}>
                <Text>{item.price}</Text>
              </View>
            </View>
            <View
              style={{
                flex: 0.2,
                flexDirection: "row",
                justifyContent: "space-between",
                alignContent: "flex-end",
                justifyContent: "flex-end",
                alignSelf: "flex-end"
              }}
            >
              <View style={{ flex: 0.1, marginTop: 3 }}>
                <Image source={require("../../Assets/area.png")} />
              </View>
              <View style={{ flex: 0.9, marginLeft: 10 }}>
                <Text>85 sqm</Text>
              </View>
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
  },

  titleTextStyle: {
    color: "#545454",
    fontSize: 15,
    fontWeight: "bold"
  },
  header: {
    ...ifIphoneX(
      {
        paddingTop: getStatusBarHeight()
      },
      {
        paddingTop: 0
      }
    )
  },
  textInputStyleClass: {
    // Setting up Hint Align center.
    textAlign: "left",

    // Setting up TextInput height as 50 pixel.
    height: DEVICE_HEIGHT / 18,

    paddingLeft: 10,

    marginTop: 20,

    color: Colors.BACK_ARROW_COLOR,
    // Set border width.
    borderWidth: 1,
    // Set border Hex Color Code Here.
    borderColor: "#E3E3E3",
    // Set border Radius.
    borderRadius: 2,
    //Set background color of Text Input.
    backgroundColor: "transparent"
  },
  textArea: {
    height: 100,
    justifyContent: "flex-start"
  },
  textAreaContainer: {
    borderColor: Colors.TOOLBAR_TEXT,
    borderWidth: 0.5,
    padding: 5,
    marginTop: 15,
    marginBottom: 15
  }
});




function mapStateToProps(state) {

    return {
        PropertyListingReducer: state.PropertyListingReducer
    }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ getAllPropertyList, getFilteredPropertyList, clearPropertyListResponse }, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProprertySearchScreen);


