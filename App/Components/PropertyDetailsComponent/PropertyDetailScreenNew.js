import React, { Component } from "react";
import { connect } from "react-redux";
import {
  View,
  SafeAreaView,
  Linking,
  Text,
  Alert,
  ImageBackground,
  Dimensions,
  ScrollView,
  Image,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  TouchableHighlight,
  AsyncStorage,
  FlatList,
  AppState
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { bindActionCreators } from "redux";
import { Actions } from "react-native-router-flux";
import CardView from "react-native-cardview";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import PropertyDetailScreenStyle from "./PropertyDetailScreenStyle";
import HeaderScreen from "../CommonComponent/HeaderScreen";
import Colors from "../../Constants/Colors";
import Strings from "../../Constants/Strings";
import { getPropertyDetail } from "../../Action/ActionCreators";

import { BarIndicator } from "react-native-indicators";
import OfflineNotice from "../../Utils/OfflineNotice";
import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps";
import placeholder from "../../Assets/placeholder.png";
import { Icon, Divider, Avatar, Header, CheckBox } from "react-native-elements";

import {
  toTitleCase,
  showErrorMessage,
  commafy,
  checkUserVerifed
} from "../../Utils/Validations";

const DEVICE_WIDTH = Dimensions.get("window").width;
const DEVICE_HEIGHT = Dimensions.get("window").height;

const ASPECT_RATIO = DEVICE_WIDTH / DEVICE_HEIGHT;
const LATITUDE_DELTA = 0.00544;
const LONGITUDE_DELTA = 0.0315;
import ImageSlider from "react-native-image-slider";
import API from "../../Constants/APIUrls";
import ReadMore from "react-native-read-more-text";
import stripe from "tipsi-stripe";
var moment = require("moment-timezone");
import {
  ifIphoneX,
  getStatusBarHeight,
  getBottomSpace
} from "react-native-iphone-x-helper";
import Modal from "react-native-modal";
import firebase, { Notification } from "react-native-firebase";
import { dismiss } from "react-native-snackbar";

stripe.setOptions({
  publishableKey: Strings.STRIPE_PUBLISHABLE_KEY
});

// require the module
var RNFS = require("react-native-fs");

const ammArray = ["Bedrooms", "Bathrooms", "Garages"];

const options = {
  prefilledInformation: {
    billingAddress: {
      name: "Gunilla Haugeh",
      line1: "Canary Place",
      line2: "3",
      city: "Macon",
      state: "Georgia",
      country: "US",
      postalCode: "31217"
    }
  }
};

let DeviceType = DEVICE_HEIGHT / DEVICE_WIDTH > 1.6 ? "Phone" : "Tablet";
const itemWidth = DeviceType == "Tablet" ? 140 : 120;
console.log("Item Width >>>> " + JSON.stringify(itemWidth));

class PropertyDetailScreen extends Component {
  constructor() {
    super();
    this.state = {
      checked: true,
      visible: false,
      isSpinnerVisible: false,
      isContactSpinnerVisible: false,
      isPaymentSpinnerVisible: false,
      propertyName: "--",
      propertyId: "--",
      propertyDetail: "--",
      no_Of_Bathrooms: "--",
      no_Of_Bedrooms: "--",
      no_Of_CarSpace: "--",
      no_Of_Garages: "--",
      no_Of_OpenFirePlace: "--",
      no_Of_AlaramSystem: "--",
      no_Of_AirConditiong: "--",
      price: "--",
      indoorFeatures: [],
      land_size: "--",
      lat: 0,
      lang: 0,
      region: "",
      sliderImages: [],
      contactInfo: "",
      userData: "",
      propId: "",
      isPropertySaved: false,
      propertyData: "",
      lastInspectedDate: "",
      futureInspectionDate: "",
      propertyAddress: "",
      propertyAmenities: [],
      refresh: false,
      paymentDetails: [],
      sellerID: "",
      sellerProfilePic: "noUser.jpg",
      sellerName: "",
      sellerEmail: "",
      sellerContact: "",
      proffessionlVideoLink: "",
      three_d_video_link: "",

      realEstateContractInfoLink: "",
      realEstateContractInfoFilename: "",
      realEstateContractInfoFilePath: "",

      statementOfInformationFileName: "",
      statementOfInformationFilePath: "",
      statementOfInformationLink: "",

      suburbReportFileName: "",
      suburbReportFilePath: "",
      suburbReportLink: "",

      dueDilligenceFileName: "",
      dueDilligenceFilePath: "",
      dueDilligencelink: "",

      autoValuationFileName: "",
      autoValuationFilePath: "",

      propertyReportFileName: "",
      propertyReportFilePath: "",

      upComingInspectionDate: "",
      brochure_name: "",
      brochure_path: "",

      no_of_views: 0,
      no_of_contacts: 0,
      no_of_inspections: 0,

      purchasedReports: [],
      isModalVisible: false,
      reportCart: [],
      isStateOfInformationChecked: false,
      isDueDilligenceChecked: false,
      isAutoValuationChecked: false,
      isPropertyChecked: false,
      isSuburbChecked: false,
      reportData: [],
      appState: AppState.currentState
    };
  }

  componentWillMount() {
    //this._getUserData();
    //this.checkIfUserIsVerfied();
    this._getPropertyData();
  }

  componentDidMount() {
    AppState.addEventListener("change", this._handleAppStateChange);

    // this.refs.MapView.fitToElements(true);
    // this.refs.MapView.setZoom(map.getZoom() - 1);

    // // set a minimum zoom
    // // if you got only 1 marker or all markers are on the same address map will be zoomed too much.
    // if (this.refs.MapView.getZoom() > 15) {
    //     this.refs.MapView.setZoom(15);
    // }
  }

  _handleAppStateChange = nextAppState => {
    if (
      this.state.appState.match(/inactive|background/) &&
      nextAppState === "active"
    ) {
      console.log("App has come to the foreground!");
      AsyncStorage.getItem(Strings.KEY_USER_DATA)
        .then(value => {
          if (value) {
            var userData = JSON.parse(value);
            console.log("==== App Foreground User Data ===", userData);

            this.setState({
              userData: userData
            });

            if (!this.state.userData.id_verified) {
              this.getUserVerifiedStatus();
            }
            // //this.setState({ userInfo: userData });
            // this._changeLoadingState(true);
            // var postData = {
            //   // "id": propertyData._id,
            //   propertyId: this.props.propertyID,
            //   buyerId: userData._id
            // };
            // this.props.getPropertyDetail(postData, userData.token);
          }
        })
        .done();
    }
    this.setState({ appState: nextAppState });
  };

  componentWillUnmount() {
    AppState.removeEventListener("change", this._handleAppStateChange);
  }

  async getUserVerifiedStatus() {
    //this._changeLoadingState(true);
    this._changeLoadingState(true);
    var postData = {
      id: this.state.userData._id
    };

    fetch(API.GET_BUYER_USER_DETAIL, {
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
        console.log(
          "Response getUserVerifiedStatus >>>> " + JSON.stringify(responseJson)
        );

        if (responseJson !== undefined) {
          if (responseJson.code == Strings.STATUS_OK) {
            AsyncStorage.removeItem(Strings.KEY_USER_DATA);
            this.setState({ userData: responseJson.data });
            this._storeUserData(
              Strings.KEY_USER_DATA,
              JSON.stringify(responseJson.data)
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

  _storeUserData = async (key, value) => {
    try {
      const resp = await AsyncStorage.setItem(key, value);
    } catch (error) {
      // Error saving data
      console.log("Async Error >> " + error);
    }
  };

  //   shouldComponentUpdate(nextProps, nextState) {
  //       console.log("shouldComponentUpdate  nextProps >>>"+JSON.stringify(nextProps));
  //       console.log("shouldComponentUpdate  nextState >>>" + JSON.stringify(nextState));

  //   }
  _toogleList() {
    this.setState({
      refresh: !this.state.refresh
    });
  }

  _toggleModal() {
    this.setState({
      isModalVisible: !this.state.isModalVisible
    });
    //  this.renderModal();
  }

  renderCenterFilterOne() {
    return (
      <View>
        <Text style={styles.titleTextStyleModal}>
          {Strings.MODAL_REPORT_SCREEN_TITLE}
        </Text>
      </View>
    );
  }

  renderRightFilterOne() {
    return (
      <TouchableOpacity
        hitSlop={styles.touchableAreaStyle}
        onPress={() => this.closeModal()}
      >
        {/* <Image source={require("../../Assets/filter.png")} /> */}
        <Icon
          name="times-circle"
          type="font-awesome"
          size={24}
          color={Colors.COLOR_CUTTY_SHARK}
          onPress={() => this.closeModal()}
        />
      </TouchableOpacity>
    );
  }

  closeModal() {
    this.setState({
      isModalVisible: !this.state.isModalVisible,
      reportCart: [],
      isStateOfInformationChecked: false,
      isDueDilligenceChecked: false,
      isAutoValuationChecked: false,
      isPropertyChecked: false,
      isSuburbChecked: false
    });
  }

  checkReportPurchased(text) {
    switch (text) {
      case Strings.LABEL_STATEMENT_OF_INFORMATION:
        return this.checkIfValueExist(Strings.SEVER_STATEMENT_OF_INFORMATION);
      case Strings.LABEL_DUE_DILIGENCE_REPORT:
        return this.checkIfValueExist(Strings.SEVER_DUE_DILIGENCE_REPORT);
      case Strings.LABEL_AUTO_VALUATION_REPORT:
        return this.checkIfValueExist(Strings.SEVER_AUTO_VALUATION_REPORT);
      case Strings.LABEL_PROPERTY_REPORT:
        return this.checkIfValueExist(Strings.SEVER_PROPERTY_REPORT);
      case Strings.LABEL_SUBURB_REPORT:
        return this.checkIfValueExist(Strings.SEVER_SUBURB_REPORT);

      default:
        return false;
    }
  }

  checkIfValueExist(val) {
    //console.log("checkIfValueExist >>> " + JSON.stringify(val));
    let isReportPurchased = false;
    if (this.state.paymentDetails) {
      for (let i = 0; i < this.state.paymentDetails.length; i++) {
        let reportName = this.state.paymentDetails[i].type;
        //   console.log("For Loop >>> " + JSON.stringify(reportName));
        if (reportName == val) {
          isReportPurchased = true;
        }
      }
    }
    return isReportPurchased;
  }

  renderModal() {
    return (
      <Modal
        style={{ backgroundColor: "#FFF" }}
        isVisible={this.state.isModalVisible}
        onBackdropPress={() => this.setState({ isVisible: false })}
      >
        <View style={{ flex: 1, margin: 10 }}>
          <View style={styles.header}>
            <Header
              backgroundColor={"#fff"}
              //  leftComponent={this.renderLeftFilterComponent()}
              centerComponent={this.renderCenterFilterOne()}
              rightComponent={this.renderRightFilterOne()}
            />
          </View>
          <View style={{ flex: 1 }}>
            {/* <View style={{ flexDirection: "row", margin: 10 }}>
              <View style={{ flex: 0.8 }}>
                <Text style={{ fontSize: 15, marginTop: 5 }}>{Strings.LABEL_STATEMENT_OF_INFORMATION}</Text>
              </View>
              <View style={{ flex: 0.2 }}>
              
                {!this.checkReportPurchased(Strings.STATEMENT_OF_INFORMATION)?
                  (<CheckBox
                    containerStyle={{ justifyContent: 'flex-start', marginLeft: 10, padding: 0, borderWidth: 0, backgroundColor: 'transparent', color: Colors.white }}
                    checked={this.state.isStateOfInformationChecked}
                    size={18}
                    textStyle={{ color: Colors.COLOR_CUTTY_SHARK, fontWeight: "400" }}
                    checkedColor={Colors.COLOR_CUTTY_SHARK}
                    onPress={() => this.addReport2Cart(Strings.LABEL_STATEMENT_OF_INFORMATION)}
                  />) : (
                    <TouchableOpacity
                    onPress={() => this.viewStatementOfInformation()}
                    style={[PropertyDetailScreenStyle.btnStyle]}
                  >
                    <Text
                      style={{
                        justifyContent: "center",
                        alignSelf: "center",
                        color: Colors.grey_900,
                        fontSize: 14
                      }}
                    >
                      {"View"}
                    </Text>
                  </TouchableOpacity>)
                }
                
              </View>
            </View>

            <View
              style={PropertyDetailScreenStyle.horizontalDivider}
            /> */}

            {/* {(this.state.dueDilligencelink || (this.state.dueDilligenceFileName && this.state.dueDilligenceFilePath) )
            ?
              (
                <View>
                  <View style={{ flexDirection: "row", margin: 10 }}>
                    <View style={{ flex: 0.8 }}>
                      <Text style={{ fontSize: 15, marginTop: 5 }}>{Strings.LABEL_DUE_DILIGENCE_REPORT}</Text>
                    </View>
                    <View style={{ flex: 0.2 }}>
                      {!this.checkReportPurchased(Strings.LABEL_DUE_DILIGENCE_REPORT) ?
                        (
                          <CheckBox
                            containerStyle={{ justifyContent: 'flex-start', marginLeft: 10, padding: 0, borderWidth: 0, backgroundColor: 'transparent', color: Colors.white }}
                            checked={this.state.isDueDilligenceChecked}
                            size={18}
                            textStyle={{ color: Colors.COLOR_CUTTY_SHARK, fontWeight: "400" }}
                            checkedColor={Colors.COLOR_CUTTY_SHARK}
                            onPress={() => this.addReport2Cart(Strings.LABEL_DUE_DILIGENCE_REPORT)}
                          />
                        ) : (<TouchableOpacity
                          hitSlop={styles.touchableAreaStyle}
                          onPress={() => this.viewDueDiligenceReport()}
                          style={[PropertyDetailScreenStyle.btnStyle]}
                        >
                          <Text
                            style={{
                              justifyContent: "center",
                              alignSelf: "center",
                              color: Colors.grey_900,
                              fontSize: 14
                            }}
                          >
                            {"View"}
                          </Text>
                        </TouchableOpacity>)
                      }

                    </View>
                  </View>
                  <View
                    style={PropertyDetailScreenStyle.horizontalDivider}
                  />
                </View>
                ):null} */}

            {this.state.autoValuationFileName &&
            this.state.autoValuationFilePath ? (
              <View>
                <View style={{ flexDirection: "row", margin: 10 }}>
                  <View style={{ flex: 0.8 }}>
                    <Text style={{ fontSize: 15, marginTop: 5 }}>
                      {Strings.LABEL_AUTO_VALUATION_REPORT}
                    </Text>
                  </View>
                  <View style={{ flex: 0.2 }}>
                    {!this.checkReportPurchased(
                      Strings.LABEL_AUTO_VALUATION_REPORT
                    ) ? (
                      <CheckBox
                        containerStyle={{
                          justifyContent: "flex-start",
                          marginLeft: 10,
                          padding: 0,
                          borderWidth: 0,
                          backgroundColor: "transparent"
                        }}
                        checked={this.state.isAutoValuationChecked}
                        size={18}
                        textStyle={{
                          color: Colors.COLOR_CUTTY_SHARK,
                          fontWeight: "400"
                        }}
                        checkedColor={Colors.COLOR_CUTTY_SHARK}
                        onPress={() =>
                          this.addReport2Cart(
                            Strings.LABEL_AUTO_VALUATION_REPORT
                          )
                        }
                      />
                    ) : (
                      <TouchableOpacity
                        hitSlop={styles.touchableAreaStyle}
                        onPress={() => this.viewAutoValuationReport()}
                        style={[PropertyDetailScreenStyle.btnStyle]}
                      >
                        <Text
                          style={{
                            justifyContent: "center",
                            alignSelf: "center",
                            color: Colors.grey_900,
                            fontSize: 14
                          }}
                        >
                          {"View"}
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
                <View style={PropertyDetailScreenStyle.horizontalDivider} />
              </View>
            ) : null}

            {this.state.propertyReportFileName &&
            this.state.propertyReportFilePath ? (
              <View>
                <View style={{ flexDirection: "row", margin: 10 }}>
                  <View style={{ flex: 0.8 }}>
                    <Text style={{ fontSize: 15, marginTop: 5 }}>
                      {Strings.LABEL_PROPERTY_REPORT}
                    </Text>
                  </View>
                  <View style={{ flex: 0.2 }}>
                    {!this.checkReportPurchased(
                      Strings.LABEL_PROPERTY_REPORT
                    ) ? (
                      <CheckBox
                        containerStyle={{
                          justifyContent: "flex-start",
                          marginLeft: 10,
                          padding: 0,
                          borderWidth: 0,
                          backgroundColor: "transparent"
                        }}
                        checked={this.state.isPropertyChecked}
                        size={18}
                        textStyle={{
                          color: Colors.COLOR_CUTTY_SHARK,
                          fontWeight: "400"
                        }}
                        checkedColor={Colors.COLOR_CUTTY_SHARK}
                        onPress={() =>
                          this.addReport2Cart(Strings.LABEL_PROPERTY_REPORT)
                        }
                      />
                    ) : (
                      <TouchableOpacity
                        hitSlop={styles.touchableAreaStyle}
                        onPress={() => this.viewPropertyReport()}
                        style={[PropertyDetailScreenStyle.btnStyle]}
                      >
                        <Text
                          style={{
                            justifyContent: "center",
                            alignSelf: "center",
                            color: Colors.grey_900,
                            fontSize: 14
                          }}
                        >
                          {"View"}
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
                <View style={PropertyDetailScreenStyle.horizontalDivider} />
              </View>
            ) : null}

            {/* Suburb Report View */}
            {this.state.suburbReportFileName &&
            this.state.suburbReportFilePath ? (
              <View>
                <View style={{ flexDirection: "row", margin: 10 }}>
                  <View style={{ flex: 0.8 }}>
                    <Text style={{ fontSize: 15, marginTop: 5 }}>
                      {Strings.LABEL_SUBURB_REPORT}
                    </Text>
                  </View>
                  <View style={{ flex: 0.2 }}>
                    {!this.checkReportPurchased(Strings.LABEL_SUBURB_REPORT) ? (
                      <CheckBox
                        containerStyle={{
                          justifyContent: "flex-start",
                          marginLeft: 10,
                          padding: 0,
                          borderWidth: 0,
                          backgroundColor: "transparent",
                          color: Colors.white
                        }}
                        checked={this.state.isSuburbChecked}
                        size={18}
                        textStyle={{
                          color: Colors.COLOR_CUTTY_SHARK,
                          fontWeight: "400"
                        }}
                        checkedColor={Colors.COLOR_CUTTY_SHARK}
                        onPress={() =>
                          this.addReport2Cart(Strings.LABEL_SUBURB_REPORT)
                        }
                      />
                    ) : (
                      <TouchableOpacity
                        hitSlop={styles.touchableAreaStyle}
                        onPress={() => this.viewSuburbReport()}
                        style={[PropertyDetailScreenStyle.btnStyle]}
                      >
                        <Text
                          style={{
                            justifyContent: "center",
                            alignSelf: "center",
                            color: Colors.grey_900,
                            fontSize: 14
                          }}
                        >
                          {"View"}
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>

                <View style={PropertyDetailScreenStyle.horizontalDivider} />
              </View>
            ) : null}

            {this.state.reportCart.length !== 0 ? (
              <View style={{ alignItems: "center", marginTop: 30 }}>
                <TouchableOpacity
                  hitSlop={styles.touchableAreaStyle}
                  onPress={() => this.payForSuburbReport()}
                  activeOpacity={0.5}
                >
                  <LinearGradient
                    colors={["#00C2D7", "#4EE1CA"]}
                    style={
                      PropertyDetailScreenStyle.modalRoundedButtonStyleAppTheme
                    }
                  >
                    <Text style={{ color: "white", fontWeight: "600" }}>
                      {"Buy for $" + this.state.reportCart.length * 10}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            ) : null}
          </View>
        </View>
      </Modal>
    );
  }

  addReport2Cart(reportName) {
    switch (reportName) {
      case Strings.LABEL_STATEMENT_OF_INFORMATION:
        if (!this.state.isStateOfInformationChecked) {
          let reportData = {
            type: Strings.KEY_STATEMENT_OF_INFORMATION,
            amount: 10
          };
          this.state.reportCart.push(reportData);
        } else {
          this.removeItem(
            this.state.reportCart,
            Strings.KEY_STATEMENT_OF_INFORMATION
          );
        }
        this.setState({
          isStateOfInformationChecked: !this.state.isStateOfInformationChecked
        });

        return;

      case Strings.LABEL_DUE_DILIGENCE_REPORT:
        if (!this.state.isDueDilligenceChecked) {
          let reportData = {
            type: Strings.KEY_DUE_DILLIGENCE_CHECKLIST,
            amount: 10
          };
          this.state.reportCart.push(reportData);
        } else {
          this.removeItem(
            this.state.reportCart,
            Strings.KEY_DUE_DILLIGENCE_CHECKLIST
          );
        }
        this.setState({
          isDueDilligenceChecked: !this.state.isDueDilligenceChecked
        });

        return;

      case Strings.LABEL_AUTO_VALUATION_REPORT:
        if (!this.state.isAutoValuationChecked) {
          let reportData = {
            type: Strings.KEY_AUTO_VALUATION_REPORT,
            amount: 10
          };
          this.state.reportCart.push(reportData);
        } else {
          this.removeItem(
            this.state.reportCart,
            Strings.KEY_AUTO_VALUATION_REPORT
          );
        }
        this.setState({
          isAutoValuationChecked: !this.state.isAutoValuationChecked
        });

        return;

      case Strings.LABEL_PROPERTY_REPORT:
        if (!this.state.isPropertyChecked) {
          let reportData = {
            type: Strings.KEY_PROPERTY_REPORT,
            amount: 10
          };
          this.state.reportCart.push(reportData);
        } else {
          this.removeItem(this.state.reportCart, Strings.KEY_PROPERTY_REPORT);
        }
        this.setState({ isPropertyChecked: !this.state.isPropertyChecked });

        return;

      case Strings.LABEL_SUBURB_REPORT:
        if (!this.state.isSuburbChecked) {
          let reportData = {
            type: Strings.KEY_SUBURB_REPORT,
            amount: 10
          };
          this.state.reportCart.push(reportData);
        } else {
          this.removeItem(this.state.reportCart, Strings.KEY_SUBURB_REPORT);
        }
        this.setState({ isSuburbChecked: !this.state.isSuburbChecked });

        return;
    }
  }

  removeItem(array, item) {
    for (var i in array) {
      if (array[i].type == item) {
        array.splice(i, 1);
        break;
      }
    }
  }

  _getPropertyData() {
    AsyncStorage.getItem(Strings.KEY_USER_DATA)
      .then(value => {
        if (value) {
          var userData = JSON.parse(value);
          console.log("==== userData ===", userData);

          this.setState({
            userData: userData
          });

          //this.setState({ userInfo: userData });
          this._changeLoadingState(true);
          var postData = {
            // "id": propertyData._id,
            propertyId: this.props.propertyID,
            buyerId: userData._id
          };
          this.props.getPropertyDetail(postData, userData.token);
          if (!this.state.userData.id_verified) {
            this.getUserVerifiedStatus();
          }
        }
      })
      .done();
  }

  componentWillReceiveProps(nextProps) {
    this._changeLoadingState(false);

    if (
      nextProps.PropertyDetailReducer.propertyDetailRes !== undefined &&
      nextProps.PropertyDetailReducer.propertyDetailRes !== ""
    ) {
      console.log(
        "PropertyDetailScreen Screen >>>> " +
          JSON.stringify(nextProps.PropertyDetailReducer.propertyDetailRes)
      );
      if (
        nextProps.PropertyDetailReducer.propertyDetailRes.code !== undefined &&
        nextProps.PropertyDetailReducer.propertyDetailRes.code ===
          Strings.STATUS_OK
      ) {
        data = nextProps.PropertyDetailReducer.propertyDetailRes.data;

        let _ID = "";
        let propType = "";
        let propUniqueID = "";
        let propDetail = "";
        let propNoOfBathrooms = "";
        let propNoOfBedrooms = "";
        let propNoOfCarSpace = "";
        let propNoOfGarageSpace = "";
        let propNoOfOpenFirePlace = "";
        let propNoOfAlaramSystem = "";
        let propNoOfAirConditiong = "";
        let propPrice = "";
        let propLandSize = "";
        let propAddress = "";
        let propAmenities = [];
        let threeDTour = "";
        let proffessionalVideo = "";
        let statementOfInformationLink = "";
        let suburbReport_filename = "";
        let suburbReport_filepath = "";

        let realEstateContractInfoLink = "";
        let realEstateContractInfoFilename = "";
        let realEstateContractInfoFilePath = "";

        if (
          data.xmlPropertyInfo != null ||
          Object.keys(data.xmlPropertyInfo).length !== 0 ||
          data.xmlPropertyInfo.constructor !== Object
        ) {
          console.log("<<<<<<<<<<<<<<<< Inside XML FEED >>>>>>>>>>>>>>");

          _ID = data.xmlPropertyInfo.property_id;
          propType = data.xmlPropertyInfo.property_type;
          propUniqueID = data.xmlPropertyInfo.uniqueID;
          propDetail = data.xmlPropertyInfo.description;
          propNoOfBathrooms = data.xmlPropertyInfo.bathrooms;
          propNoOfBedrooms = data.xmlPropertyInfo.bedrooms;
          propNoOfGarageSpace = data.xmlPropertyInfo.garages;
          propNoOfCarSpace =
            data.xmlPropertyInfo.number_of_amenities.no_of_carports;
          propNoOfAlaramSystem =
            data.xmlPropertyInfo.number_of_amenities.no_of_alarmSystem;
          propNoOfOpenFirePlace =
            data.xmlPropertyInfo.number_of_amenities.no_of_openFirePlace;
          propNoOfAirConditiong =
            data.xmlPropertyInfo.number_of_amenities.no_of_airConditioning;
          propPrice = data.xmlPropertyInfo.priceView;
          propLandSize = data.xmlPropertyInfo.landSize;
          propAddress = data.xmlPropertyInfo.address;

          threeDTour = data.xmlPropertyInfo.externalLinkHref;
          proffessionalVideo = data.xmlPropertyInfo.videoLink;

          statementOfInformationLink = data.xmlPropertyInfo.statementInfo;

          for (let k = 0; k < data.xmlPropertyInfo.amenities.length; k++) {
            if (!ammArray.includes(data.xmlPropertyInfo.amenities[k])) {
              propAmenities.push(data.xmlPropertyInfo.amenities[k]);
            }
          }

          console.log("XML Feed>>>>" + JSON.stringify(propAmenities));

          suburbReport_filename = data.xmlPropertyInfo.suburbReport_filename;
          suburbReport_filepath = data.xmlPropertyInfo.suburbReport_filepath;

          console.log(
            "XML Feed>>>>" +
              " suburbReport_filename = " +
              suburbReport_filename +
              ",,, suburbReport_filepath = " +
              suburbReport_filepath
          );
        } else {
          console.log("<<<<<<<<<<<<<<<< Inside PropertyInfo >>>>>>>>>>>>>>");

          _ID = data.propertyInfo._id;
          propName = data.propertyInfo.property_name;
          propUniqueID = data.propertyInfo.property_unique_id;
          propType = data.propertyInfo.property_type;
          propDetail = data.propertyInfo.prop_description;
          propNoOfBathrooms = data.propertyInfo.no_of_bathroom;
          propNoOfBedrooms = data.propertyInfo.no_of_bedroom;
          propPrice = data.propertyInfo.price;
          propertyAmenitiesInfo = data.propertyAmenitiesInfo;
          propLandSize = data.propertyInfo.land_size;
          propAddress = data.propertyInfo.address;

          if (data.propertyAmenitiesInfo.length != 0) {
            for (let p = 0; p < data.propertyAmenitiesInfo.length; i++) {
              if (
                !ammArray.includes(
                  data.propertyAmenitiesInfo[p].amenitiesId.name
                )
              ) {
                propAmenities.push(
                  data.propertyAmenitiesInfo[p].amenitiesId.name
                );
              }
            }
          }
        }

        // if (data.hasOwnProperty("images")) {
        //   let imgData = item.images.img;

        //   for (let i = 0; i < imgData.length; i++) {
        //     if (imgData[i].hasOwnProperty("url")) {
        //       let slidingImageURL = imgDataimgData[i].url;
        //       this.state.sliderImages.push(slidingImageURL);
        //     }
        //   }

        // }

        if (
          data.xmlPropertyInfo.images &&
          data.xmlPropertyInfo.images !== "" &&
          data.xmlPropertyInfo.images.hasOwnProperty("img")
        ) {
          var imgArray = [];

          let xmlImageArray = data.xmlPropertyInfo.images.img;
          for (let i = 0; i < xmlImageArray.length; i++) {
            if (xmlImageArray[i].hasOwnProperty("url")) {
              let imgUrl = xmlImageArray[i].url;
              console.log("Image URL In forloop >>>>" + imgUrl);
              imgArray.push(imgUrl);
            }
          }

          this.setState({ sliderImages: imgArray });
        } else if (data.propertyMediaInfo.length !== 0) {
          var imgArray = [];

          console.log(
            "Property Info >>>>> Image Array Inside If >>>>" +
              JSON.stringify(data.propertyMediaInfo)
          );

          for (let i = 0; i < data.propertyMediaInfo.length; i++) {
            let imgUrl =
              API.AWS_PATH +
              API.AWS_BUCKET +
              data.propertyMediaInfo[i].image_path +
              "/" +
              data.propertyMediaInfo[i].image_name;
            console.log("Image URL In forloop >>>>" + imgUrl);

            imgArray.push(imgUrl);

            console.log(
              "Image Array in for loop>>>>" + JSON.stringify(imgArray)
            );
          }

          this.setState({ sliderImages: imgArray });
        } else {
          console.log(
            "Image Array ELSE >>>>" + JSON.stringify(data.propertyMediaInfo)
          );
          let imgUrl = API.DEFAULT_IMAGE_URL + Strings.PROPERTY_DEFAULT_IMAGE;
          this.state.sliderImages.push(imgUrl);
        }

        this.setState({
          propId: _ID,
          propertyName: propType,
          propertyId: data.propertyInfo.property_unique_id,
          propertyDetail: propDetail,
          no_Of_Bathrooms: propNoOfBathrooms,
          no_Of_Bedrooms: propNoOfBedrooms,
          price: commafy(propPrice),
          land_size: propLandSize,
          lat: data.propertyInfo.location.coordinates[1],
          lang: data.propertyInfo.location.coordinates[0],
          contactInfo: data.contactInfo,
          lastInspectedDate: data.lastInspectedDate,
          no_Of_CarSpace: propNoOfCarSpace,
          no_Of_Garages: propNoOfGarageSpace,
          no_Of_OpenFirePlace: propNoOfOpenFirePlace,
          no_Of_AlaramSystem: propNoOfAlaramSystem,
          no_Of_AirConditiong: propNoOfAirConditiong,
          userInfo: data.userInfo,
          isPropertySaved: data.isBookmarked === 1 ? true : false,
          propertyAddress: propAddress,
          paymentDetails: data.paymentInfo,
          sellerProfilePic: data.userInfo.profile_pic,
          sellerName: data.userInfo.firstname + " " + data.userInfo.lastname,
          sellerEmail: data.userInfo.email,
          sellerContact: data.userInfo.phone_number,

          statementOfInformationFileName:
            data.propertyInfo.statement_of_information_filename,
          statementOfInformationFilePath:
            data.propertyInfo.statement_of_information_filepath,
          statementOfInformationLink: statementOfInformationLink,

          dueDilligenceFileName:
            data.propertyInfo.due_dilligence_checklist_filename,
          dueDilligenceFilePath:
            data.propertyInfo.due_dilligence_checklist_filepath,
          dueDilligencelink: data.propertyInfo.due_dilligence_checklist_link,

          autoValuationFileName: data.propertyInfo.autovalution_report_filename,
          autoValuationFilePath: data.propertyInfo.autovalution_report_filepath,

          propertyReportFileName: data.propertyInfo.property_report_filename,
          propertyReportFilePath: data.propertyInfo.property_report_filepath,
          futureInspectionDate: data.featureInspectionDate,
          brochure_name: data.propertyInfo.brochure_name,
          brochure_path: data.propertyInfo.brochure_path,
          no_of_views: data.propertyInfo.no_of_views,
          no_of_contacts: data.propertyInfo.no_of_contracts,
          no_of_inspections: data.propertyInfo.no_of_inspections,
          three_d_video_link: threeDTour,
          proffessionlVideoLink: proffessionalVideo,
          realEstateContractInfoLink:
            data.propertyInfo.real_estate_contract_information_link,
          realEstateContractInfoFilename:
            data.propertyInfo.real_estate_contract_information_filename,
          realEstateContractInfoFilePath:
            data.propertyInfo.real_estate_contract_information_filepath,

          suburbReportFileName: suburbReport_filename,
          suburbReportFilePath: suburbReport_filepath
        });
        console.log("Prop Amenities >>>>> " + JSON.stringify(propAmenities));

        for (var pos = 0; pos < propAmenities.length; pos++) {
          this.state.propertyAmenities.push(propAmenities[pos]);
        }

        console.log(
          "State >>>>> " + JSON.stringify(this.state.propertyAmenities)
        );
      } else {
        Alert.alert(
          Strings.APP_NAME,
          nextProps.PropertyDetailReducer.propertyDetailRes.message,
          [{ text: "Ok", onPress: () => Actions.pop(), style: "cancel" }],
          { cancelable: false }
        );
      }
    } else {
      Alert.alert(
        Strings.APP_NAME,
        Strings.SERVER_ERROR,
        [{ text: "Ok", onPress: () => Actions.pop(), style: "cancel" }],
        { cancelable: false }
      );
    }
  }

  _changeLoadingState(loadingState) {
    this.setState({
      isSpinnerVisible: loadingState
    });
  }

  _changeContactLoadingState(loadingState) {
    this.setState({
      isContactSpinnerVisible: loadingState
    });
  }

  _changePaymentLoadingState(loadingState) {
    this.setState({
      isPaymentSpinnerVisible: loadingState
    });
  }

  _renderItem(item, index) {
    return (
      <View
        key={index}
        style={{
          flexDirection: "column",
          justifyContent: "space-evenly",
          marginRight: 2,
          marginTop: 2,
          marginBottom: 2
        }}
      >
        <TouchableOpacity
          disabled={true}
          style={[
            PropertyDetailScreenStyle.propertyHighlightStyle,
            { flex: 0.2 }
          ]}
        >
          <Text
            style={{
              justifyContent: "center",
              alignSelf: "center",
              color: Colors.grey_900,
              fontSize: 14,
              fontWeight: "500",
              textTransform: "capitalize"
            }}
          >
            {item}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  _toggleSaveProperty() {
    console.log("In _toggleSaveProperty");
    this.setState({ isPropertySaved: !this.state.isPropertySaved });
  }

  getInitialState() {
    return {
      region: {
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421
      }
    };
  }

  onRegionChange(region) {
    this.setState({ region });
  }
  renderIndoorFeatures(indoreMapArray) {
    return indoreMapArray.map((item, index) => {
      return (
        <View key={index} style={{ width: DEVICE_WIDTH }}>
          <Text style={{ fontSize: 14, marginTop: 10 }}>
            {item.amenitiesId.name}{" "}
          </Text>
        </View>
      );
    });
  }

  renderRequestButton(contactStatus) {
    switch (contactStatus.status) {
      case Strings.CONTACT_REQUEST_PENDING:
        return (
          <View style={{ alignItems: "center" }}>
            <LinearGradient
              colors={[Colors.orange_700, Colors.orange_900]}
              style={PropertyDetailScreenStyle.roundedButtonStyleAppTheme}
            >
              <Text style={{ color: "white" }}>
                {" "}
                {Strings.BUTTON_TEXT_REQUEST_PENDING}{" "}
              </Text>
            </LinearGradient>
          </View>
        );

      case Strings.CONTACT_REQUEST_ACCEPTED:
        return (
          <View style={{ alignItems: "center" }}>
            <TouchableOpacity
              onPress={() => this._navigateToInspection()}
              // onPress={() => Linking.openURL(API.BUYER_LOGIN)}
              activeOpacity={0.5}
            >
              <LinearGradient
                colors={["#00C2D7", "#4EE1CA"]}
                style={PropertyDetailScreenStyle.roundedButtonStyleAppTheme}
              >
                <Text style={{ color: "white", fontWeight: "600" }}>
                  {" "}
                  {Strings.BUTTON_TEXT_REQUEST_INSPECTION}{" "}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        );
      case Strings.CONTACT_REQUEST_REJECTED:
        return (
          <View style={{ alignItems: "center" }}>
            <LinearGradient
              colors={[Colors.red_500, Colors.red_500]}
              style={PropertyDetailScreenStyle.roundedButtonStyleAppTheme}
            >
              <Text style={{ color: "white" }}>
                {" "}
                {Strings.BUTTON_TEXT_REQUEST_REJECTED}{" "}
              </Text>
            </LinearGradient>
          </View>
        );
    }
  }

  _navigateToInspection() {
    if (this.state.futureInspectionDate) {
      alert(
        "You already have an inspection booking. To book another inspection, please cancel the previous one."
      );
    } else {
      var propertyData = {
        _id: this.state.propId,
        propertyMediaInfo: this.state.sliderImages[0],
        price: this.state.price,
        landSize: this.state.landSize,
        address: this.state.propertyAddress
      };
      Actions.inspectionScreen({ propertyData: propertyData });
    }
  }

  checkIfUserIsVerfied() {
    let isVerified = this.state.userData.id_verified;
    //let isVerified = true;
    console.log("");
    if (isVerified) {
      this.sendContactRequest();
    } else {
      Alert.alert(
        Strings.APP_NAME,
        Strings.ERROR_VERIFIED_PROFILE,
        [
          {
            text: "Verify",
            onPress: () =>
              Linking.openURL(
                API.DIGITAL_ID_VERIFICATION_URL + this.state.userData._id
              )
          },
          { text: "Verify Later", onPress: () => {} }
        ],
        { cancelable: false }
      );
    }
  }

  async sendContactRequest() {
    //this._changeLoadingState(true);
    this._changeContactLoadingState(true);

    console.log(
      "sendContactRequest >>>" + JSON.stringify(this.state.userInfo._id)
    );
    var postData = {
      senderId: this.state.userData._id,
      receiverId: this.state.userInfo._id,
      propertyId: this.state.propId
    };

    fetch(API.SEND_CONTACT_REQUEST, {
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
        this._changeContactLoadingState(false);
        //this._changeLoadingState(false);
        console.log(
          "Response Send Contact Request >>>> " + JSON.stringify(responseJson)
        );

        if (responseJson !== undefined) {
          if (responseJson.code == Strings.STATUS_OK) {
            alert(responseJson.message);
            this.setState({ contactInfo: responseJson.data });
          } else {
            alert(responseJson.message);
          }
        }
      })
      .catch(error => {
        this._changeContactLoadingState(false);
        //this._changeLoadingState(false);
        console.log(error);
        alert(Strings.ALERT_SERVER_ERROR);
      });
  }

  async sendBookmarkPropertyRequest() {
    //this._changeLoadingState(true);
    this._changeContactLoadingState(true);
    var postData = {
      user_id: this.state.userData._id,
      property_id: this.state.propId,
      status: !this.state.isPropertySaved ? 1 : 2
    };

    fetch(API.BOOKMARK_PROPERTY_BY_ID, {
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
        this._changeContactLoadingState(false);
        //this._changeLoadingState(false);
        console.log(
          "Response Send Bookmark Property Request >>>> " +
            JSON.stringify(responseJson)
        );

        if (responseJson !== undefined) {
          if (responseJson.code == Strings.STATUS_OK) {
            alert(responseJson.message);
            // this.setState({ contactInfo: responseJson.data });
            this._toggleSaveProperty();
          } else {
            alert(responseJson.message);
          }
        }
      })
      .catch(error => {
        this._changeContactLoadingState(false);
        //this._changeLoadingState(false);
        console.log(error);
        alert(Strings.ALERT_SERVER_ERROR);
      });
  }

  renderLeftOne() {
    return (
      <TouchableOpacity
        hitSlop={PropertyDetailScreenStyle.touchableAreaStyle}
        onPress={() => Actions.pop()}
      >
        {/* <Image source={require("../../Assets/back_arrow.png")} /> */}
        <Icon name="ios-arrow-back" type="ionicon" color={Colors.WHITE} />
      </TouchableOpacity>
    );
  }

  renderCenterOne() {
    return (
      <View>
        <Text style={styles.titleTextStyle}>
          {Strings.PROPERTY_DETIAL_SCREEN_TITLE}
        </Text>
      </View>
    );
  }

  renderRightOne() {
    return (
      <TouchableOpacity
        hitSlop={PropertyDetailScreenStyle.touchableAreaStyle}
        onPress={() => this.sendBookmarkPropertyRequest()}
      >
        <Image
          source={
            this.state.isPropertySaved
              ? require("../../Assets/star_32.png")
              : require("../../Assets/star_outline_24.png")
          }
        />
        {/* <Icon
                name="star"
                type='evilicon'
                underlayColor={Colors.BLACK}
                reverseColor={'red'}
                color={Colors.WHITE}
            /> */}
      </TouchableOpacity>
    );
  }

  render() {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.header}>
          <Header
            backgroundColor={Colors.COLOR_PRIMARY}
            leftComponent={this.renderLeftOne()}
            centerComponent={this.renderCenterOne()}
            rightComponent={this.renderRightOne()}
          />
        </View>
        <OfflineNotice />

        <ScrollView>
          {this.state.isSpinnerVisible ? (
            <View
              style={{
                flex: 1,
                left: 0,
                right: 0,
                top: DEVICE_WIDTH / 1.2,
                bottom: 0,
                position: "absolute",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: Colors.TRANSPARENT,
                width: window.width,
                height: window.height,
                zIndex: -1
              }}
            >
              <BarIndicator color={Colors.END_COLOR} count={5} />
            </View>
          ) : (
            <View style={{ flex: 1 }}>
              <View style={{ flex: 1, height: DEVICE_HEIGHT / 4 }}>
                {this.state.sliderImages.length > 1 ? (
                  <ImageSlider
                    loopBothSides
                    autoPlayWithInterval={5000}
                    images={this.state.sliderImages}
                  />
                ) : (
                  <Image
                    style={{ flex: 1 }}
                    source={{ uri: this.state.sliderImages[0] }}
                  />
                )}
              </View>

              <CardView
                cardElevation={10}
                cornerRadius={0}
                style={PropertyDetailScreenStyle.propertyPriceCard}
              >
                <View
                  style={{
                    alignContent: "flex-start",
                    alignSelf: "flex-start",
                    alignSelf: "flex-start",
                    justifyContent: "flex-start"
                  }}
                >
                  <Text
                    style={{
                      color: Colors.grey_900,
                      fontSize: 16,
                      fontWeight: "bold"
                    }}
                  >
                    {"$" + this.state.price}
                  </Text>
                </View>

                <View
                  style={{
                    marginTop: 10,
                    alignContent: "flex-start",
                    alignSelf: "flex-start",
                    alignSelf: "flex-start",
                    justifyContent: "flex-start"
                  }}
                >
                  <Text
                    style={{
                      color: Colors.grey_900,
                      fontSize: 15,
                      fontWeight: "400"
                    }}
                  >
                    {this.state.propertyName}
                  </Text>
                </View>

                <View
                  style={{
                    flex: 0.3,
                    marginTop: 10,
                    alignContent: "flex-start",
                    alignSelf: "flex-start",
                    alignSelf: "flex-start",
                    justifyContent: "flex-start"
                  }}
                >
                  <Text
                    style={{
                      color: Colors.grey_900,
                      fontSize: 14
                    }}
                  >
                    {this.state.propertyAddress}
                  </Text>
                </View>

                <View
                  style={{
                    marginTop: 10,
                    alignContent: "flex-start",
                    alignSelf: "flex-start",
                    alignSelf: "flex-start",
                    justifyContent: "flex-start"
                  }}
                >
                  <View>
                    {/* <Text style={{ fontSize: 14, margin: 5 }}>FEATURES:</Text> */}
                    <View style={{ flexDirection: "row" }}>
                      <View style={{ flexDirection: "row" }}>
                        <Icon
                          containerStyle={{ marginRight: 5 }}
                          size={16}
                          name="bed"
                          type="font-awesome"
                          color={Colors.COLOR_PRIMARY_DARK}
                        />
                        <Text style={{ fontSize: 14, marginTop: 2 }}>
                          {this.state.no_Of_Bedrooms}
                        </Text>
                      </View>
                      <View style={{ flexDirection: "row", marginLeft: 10 }}>
                        {/* <Image
                                                style={{ margin: 5 }}
                                                source={require("../../Assets/bed.png")}
                                            /> */}
                        <Icon
                          containerStyle={{ marginRight: 5 }}
                          size={16}
                          name="bathtub"
                          type="font-awesome"
                          color={Colors.COLOR_PRIMARY_DARK}
                        />
                        <Text style={{ fontSize: 14, marginTop: 3 }}>
                          {this.state.no_Of_Bathrooms}
                        </Text>
                      </View>
                      <View style={{ flexDirection: "row", marginLeft: 10 }}>
                        <Icon
                          containerStyle={{ marginRight: 5 }}
                          size={16}
                          name="car"
                          type="font-awesome"
                          color={Colors.COLOR_PRIMARY_DARK}
                        />
                        <Text
                          style={{ fontSize: 14, marginTop: 2, marginLeft: 5 }}
                        >
                          {this.state.no_Of_Garages}
                        </Text>
                      </View>
                    </View>

                    {this.state.land_size ? (
                      <View style={{ flexDirection: "row", marginTop: 15 }}>
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
                          {this.state.land_size + " sqm"}
                        </Text>
                      </View>
                    ) : null}

                    {this.state.lastInspectedDate ? (
                      <View style={{ flexDirection: "row", marginTop: 15 }}>
                        <Text style={{ fontSize: 12, marginTop: 2 }}>
                          {"Last Inspected on :" +
                            moment(this.state.lastInspectedDate).format(
                              Strings.LASTINSPECTED_TIME_SLOT_DATE_FORMAT
                            )}
                        </Text>
                      </View>
                    ) : null}
                  </View>
                </View>
              </CardView>

              {this.state.three_d_video_link ? (
                <CardView
                  cardElevation={10}
                  cornerRadius={0}
                  style={PropertyDetailScreenStyle.mapLocationCard}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignContent: "flex-start",
                      alignSelf: "flex-start",
                      alignSelf: "flex-start",
                      justifyContent: "flex-start"
                    }}
                  >
                    <Text
                      style={{
                        flex: 0.8,
                        color: Colors.grey_900,
                        fontSize: 16,
                        paddingLeft: 10,
                        paddingRight: 10,
                        paddingTop: 5,
                        paddingBottom: 5,
                        fontWeight: "bold"
                      }}
                    >
                      {"3D-Virtual Tour"}
                    </Text>

                    <TouchableOpacity
                      onPress={() =>
                        Linking.openURL(this.state.three_d_video_link)
                      }
                      style={[
                        PropertyDetailScreenStyle.btnStyle,
                        { flex: 0.2 }
                      ]}
                    >
                      <View style={{}}>
                        <Text
                          style={{
                            justifyContent: "center",
                            alignContent: "center",
                            alignSelf: "center",
                            alignItems: "center",
                            color: Colors.grey_900,
                            fontSize: 14
                          }}
                        >
                          {"View"}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </CardView>
              ) : null}

              {this.state.proffessionlVideoLink ? (
                <CardView
                  cardElevation={10}
                  cornerRadius={0}
                  style={PropertyDetailScreenStyle.mapLocationCard}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignContent: "flex-start",
                      alignSelf: "flex-start",
                      alignSelf: "flex-start",
                      justifyContent: "flex-start"
                    }}
                  >
                    <Text
                      style={{
                        flex: 0.8,
                        color: Colors.grey_900,
                        fontSize: 16,
                        paddingLeft: 10,
                        paddingRight: 10,
                        paddingTop: 5,
                        paddingBottom: 5,
                        fontWeight: "bold"
                      }}
                    >
                      {"Professional Video"}
                    </Text>

                    <TouchableOpacity
                      onPress={() =>
                        Linking.openURL(this.state.proffessionlVideoLink)
                      }
                      style={[
                        PropertyDetailScreenStyle.btnStyle,
                        { flex: 0.2 }
                      ]}
                    >
                      <View style={{}}>
                        <Text
                          style={{
                            justifyContent: "center",
                            alignContent: "center",
                            alignSelf: "center",
                            alignItems: "center",
                            color: Colors.grey_900,
                            fontSize: 14
                          }}
                        >
                          {"View"}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </CardView>
              ) : null}

              <CardView
                cardElevation={10}
                cornerRadius={0}
                style={PropertyDetailScreenStyle.mapLocationCard}
              >
                <View style={{ flex: 1, margin: 5 }}>
                  <MapView
                    ref={MapView => (this.MapView = MapView)}
                    style={{ height: DEVICE_HEIGHT / 4 }}
                    provider="google"
                    showsUserLocation={true}
                    showsMyLocationButton={false}
                    loadingEnabled={true}
                    loadingIndicatorColor="#666666"
                    loadingBackgroundColor="#eeeeee"
                    moveOnMarkerPress={false}
                    showsUserLocation={true}
                    showsCompass={true}
                    showsPointsOfInterest={false}
                    pitchEnabled={false}
                    rotateEnabled={false}
                    scrollEnabled={false}
                    zoomEnabled={false}
                    initialRegion={{
                      latitude: this.state.lat,
                      longitude: this.state.lang,
                      latitudeDelta: LATITUDE_DELTA,
                      longitudeDelta: LONGITUDE_DELTA
                    }}
                  >
                    <Marker
                      title={this.state.propertyName}
                      key={this.state.property_unique_id}
                      // coordinate={marker.coordinate}
                      coordinate={{
                        latitude: this.state.lat,
                        longitude: this.state.lang,
                        latitudeDelta: LATITUDE_DELTA,
                        longitudeDelta: LONGITUDE_DELTA
                      }}
                    />
                  </MapView>
                </View>
              </CardView>

              <CardView
                cardElevation={10}
                cornerRadius={0}
                style={PropertyDetailScreenStyle.mapLocationCard}
              >
                <View
                  style={{
                    alignContent: "flex-start",
                    alignSelf: "flex-start",
                    alignSelf: "flex-start",
                    justifyContent: "flex-start"
                  }}
                >
                  <Text
                    style={{
                      color: Colors.grey_900,
                      fontSize: 16,
                      fontWeight: "bold"
                    }}
                  >
                    {"Description"}
                  </Text>
                </View>
                <View style={PropertyDetailScreenStyle.dividerView} />

                <View style={{ flex: 1, margin: 10 }}>
                  {/* <Text style={{ fontSize: 13 }}>
                                                {this.state.propertyDetail}
                                            </Text> */}
                  <Text style={{ fontSize: 14 }}>
                    {this.state.propertyDetail}
                  </Text>
                </View>
              </CardView>
              {this.state.propertyAmenities.length != 0 ? (
                <CardView
                  cardElevation={10}
                  cornerRadius={0}
                  style={PropertyDetailScreenStyle.mapLocationCard}
                >
                  <View
                    style={{
                      alignContent: "flex-start",
                      alignSelf: "flex-start",
                      alignSelf: "flex-start",
                      justifyContent: "flex-start"
                    }}
                  >
                    <Text
                      style={{
                        color: Colors.grey_900,
                        fontSize: 16,
                        fontWeight: "bold"
                      }}
                    >
                      {"Property Highlights"}
                    </Text>
                  </View>
                  <View style={PropertyDetailScreenStyle.dividerView} />
                  {console.log("Item Width >>>> " + JSON.stringify(itemWidth))}
                  <View>
                    {this.state.propertyAmenities.length != 0 ? (
                      <FlatList
                        style={{ flex: 1 }}
                        data={this.state.propertyAmenities}
                        horizontal={false}
                        extraData={this.state.refresh}
                        numColumns={2} //Math.floor(DEVICE_WIDTH / itemWidth)
                        keyExtractor={(item, index) => index}
                        renderItem={({ item, index }) =>
                          this._renderItem(item, index)
                        }
                      />
                    ) : null}
                    {this.state.isPaymentSpinnerVisible ? (
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
              ) : null}

              {/*==================================== Seller Details ================================== */}

              {this.state.contactInfo !== null &&
              this.state.contactInfo.status ===
                Strings.CONTACT_REQUEST_ACCEPTED ? (
                <CardView
                  cardElevation={10}
                  cornerRadius={0}
                  style={PropertyDetailScreenStyle.mapLocationCard}
                >
                  <View
                    style={{
                      alignContent: "flex-start",
                      alignSelf: "flex-start",
                      alignSelf: "flex-start",
                      justifyContent: "flex-start"
                    }}
                  >
                    <Text
                      style={{
                        color: Colors.grey_900,
                        fontSize: 16,
                        fontWeight: "bold"
                      }}
                    >
                      {"Seller Details"}
                    </Text>
                  </View>
                  <View style={PropertyDetailScreenStyle.dividerView} />

                  <View
                    style={{
                      alignContent: "flex-start",
                      alignSelf: "flex-start",
                      alignSelf: "flex-start",
                      justifyContent: "flex-start"
                    }}
                  >
                    {console.log(
                      "Seller Profile Pic >>>>>>>" +
                        JSON.stringify(
                          API.PROFILE_PIC_URL + this.state.profilePic
                        )
                    )}
                    <View style={{ flex: 2, flexDirection: "row" }}>
                      <Avatar
                        rounded
                        medium
                        source={
                          this.state.sellerProfilePic !== "noUser.jpg"
                            ? {
                                uri:
                                  API.PROFILE_PIC_URL +
                                  this.state.sellerProfilePic
                              }
                            : require("../../Assets/user_profile_32.png")
                        }
                        containerStyle={{ margin: 10 }}
                        onPress={() => console.log("Works!")}
                        activeOpacity={0.7}
                      />
                      <View style={{ margin: 10 }}>
                        <Text style={{ padding: 3, fontSize: 14 }}>
                          <Text style={{ color: Colors.grey_900 }}>
                            {"Name : "}
                          </Text>
                          <Text
                            style={{
                              color: Colors.grey_700,
                              textTransform: "capitalize"
                            }}
                          >
                            {this.state.sellerName}
                          </Text>
                        </Text>
                      </View>
                    </View>
                  </View>
                </CardView>
              ) : null}
              {/* {(this.state.suburbReportFileName && this.state.suburbReportFilePath) || } */}
              {this.state.dueDilligencelink ||
              (this.state.dueDilligenceFileName &&
                this.state.dueDilligenceFilePath) ||
              (this.state.autoValuationFileName &&
                this.state.autoValuationFilePath) ||
              (this.state.propertyReportFileName &&
                this.state.propertyReportFilePath &&
                this.state.contactInfo &&
                tthis.state.contactInfo.status ===
                  Strings.CONTACT_REQUEST_ACCEPTED) ? (
                <CardView
                  cardElevation={10}
                  cornerRadius={0}
                  style={PropertyDetailScreenStyle.mapLocationCard}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignContent: "flex-start",
                      alignSelf: "flex-start",
                      alignSelf: "flex-start",
                      justifyContent: "flex-start"
                    }}
                  >
                    <Text
                      style={{
                        flex: 0.8,
                        color: Colors.grey_900,
                        fontSize: 16,
                        paddingLeft: 10,
                        paddingRight: 10,
                        paddingTop: 5,
                        paddingBottom: 5,
                        fontWeight: "bold"
                      }}
                    >
                      {"Reports"}
                    </Text>

                    <TouchableOpacity
                      onPress={() => this._toggleModal()}
                      style={[
                        PropertyDetailScreenStyle.btnStyle,
                        { flex: 0.2 }
                      ]}
                    >
                      <View style={{}}>
                        <Text
                          style={{
                            justifyContent: "center",
                            alignContent: "center",
                            alignSelf: "center",
                            alignItems: "center",
                            color: Colors.grey_900,
                            fontSize: 14
                          }}
                        >
                          {"View"}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </CardView>
              ) : null}

              {this.state.statementOfInformationLink ||
              (this.state.statementOfInformationFileName &&
                this.state.statementOfInformationFilePath) ? (
                <CardView
                  cardElevation={10}
                  cornerRadius={0}
                  style={PropertyDetailScreenStyle.mapLocationCard}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignContent: "flex-start",
                      alignSelf: "flex-start",
                      alignSelf: "flex-start",
                      justifyContent: "flex-start"
                    }}
                  >
                    <Text
                      style={{
                        flex: 0.8,
                        color: Colors.grey_900,
                        fontSize: 16,
                        paddingLeft: 10,
                        paddingRight: 10,
                        paddingTop: 5,
                        paddingBottom: 5,
                        fontWeight: "bold"
                      }}
                    >
                      {Strings.LABEL_STATEMENT_OF_INFORMATION}
                    </Text>

                    <TouchableOpacity
                      onPress={() => this.viewStatementOfInformation()}
                      style={[
                        PropertyDetailScreenStyle.btnStyle,
                        { flex: 0.2 }
                      ]}
                    >
                      <Text
                        style={{
                          justifyContent: "center",
                          alignSelf: "center",
                          color: Colors.grey_900,
                          fontSize: 14
                        }}
                      >
                        {"View"}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </CardView>
              ) : null}

              {this.state.brochure_name && this.state.brochure_path ? (
                <CardView
                  cardElevation={10}
                  cornerRadius={0}
                  style={PropertyDetailScreenStyle.mapLocationCard}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignContent: "flex-start",
                      alignSelf: "flex-start",
                      alignSelf: "flex-start",
                      justifyContent: "flex-start"
                    }}
                  >
                    <Text
                      style={{
                        flex: 0.8,
                        color: Colors.grey_900,
                        fontSize: 16,
                        paddingLeft: 10,
                        paddingRight: 10,
                        paddingTop: 5,
                        paddingBottom: 5,
                        fontWeight: "bold"
                      }}
                    >
                      {"Brochure"}
                    </Text>

                    <TouchableOpacity
                      onPress={() => this.viewPropertyBrochure()}
                      style={[
                        PropertyDetailScreenStyle.btnStyle,
                        { flex: 0.2 }
                      ]}
                    >
                      <Text
                        style={{
                          justifyContent: "center",
                          alignSelf: "center",
                          color: Colors.grey_900,
                          fontSize: 14
                        }}
                      >
                        {"View"}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </CardView>
              ) : null}

              <CardView
                cardElevation={10}
                cornerRadius={0}
                style={PropertyDetailScreenStyle.mapLocationCard}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignContent: "flex-start",
                    alignSelf: "flex-start",
                    alignSelf: "flex-start",
                    justifyContent: "flex-start"
                  }}
                >
                  <Text
                    style={{
                      flex: 0.8,
                      color: Colors.grey_900,
                      fontSize: 16,
                      paddingLeft: 10,
                      paddingRight: 10,
                      paddingTop: 5,
                      paddingBottom: 5,
                      fontWeight: "bold"
                    }}
                  >
                    {"Due Diligence Checklist"}
                  </Text>

                  <TouchableOpacity
                    onPress={() => Actions.duediligencescreen()}
                    style={[PropertyDetailScreenStyle.btnStyle, { flex: 0.2 }]}
                  >
                    <Text
                      style={{
                        justifyContent: "center",
                        alignSelf: "center",
                        color: Colors.grey_900,
                        fontSize: 14
                      }}
                    >
                      {"View"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </CardView>

              {this.state.brochure_name && this.state.brochure_path ? (
                <CardView
                  cardElevation={10}
                  cornerRadius={0}
                  style={PropertyDetailScreenStyle.mapLocationCard}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignContent: "flex-start",
                      alignSelf: "flex-start",
                      alignSelf: "flex-start",
                      justifyContent: "flex-start"
                    }}
                  >
                    <Text
                      style={{
                        flex: 0.8,
                        color: Colors.grey_900,
                        fontSize: 16,
                        paddingLeft: 10,
                        paddingRight: 10,
                        paddingTop: 5,
                        paddingBottom: 5,
                        fontWeight: "bold"
                      }}
                    >
                      {"Real Estate Contract Information"}
                    </Text>

                    <TouchableOpacity
                      onPress={() => this.viewRealEstateInformation()}
                      style={[
                        PropertyDetailScreenStyle.btnStyle,
                        { flex: 0.2 }
                      ]}
                    >
                      <Text
                        style={{
                          justifyContent: "center",
                          alignSelf: "center",
                          color: Colors.grey_900,
                          fontSize: 14
                        }}
                      >
                        {"View"}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </CardView>
              ) : null}

              <CardView
                cardElevation={10}
                cornerRadius={0}
                style={PropertyDetailScreenStyle.mapLocationCard}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignContent: "flex-start",
                    alignSelf: "flex-start",
                    alignSelf: "flex-start",
                    justifyContent: "flex-start"
                  }}
                >
                  <Text
                    style={{
                      flex: 0.8,
                      color: Colors.grey_900,
                      fontSize: 16,
                      paddingLeft: 10,
                      paddingRight: 10,
                      paddingTop: 5,
                      paddingBottom: 5,
                      fontWeight: "bold"
                    }}
                  >
                    {"Total Views on this Property"}
                  </Text>

                  <TouchableOpacity
                    disabled={true}
                    style={[PropertyDetailScreenStyle.btnStyle, { flex: 0.2 }]}
                  >
                    <Text
                      style={{
                        justifyContent: "center",
                        alignSelf: "center",
                        color: Colors.grey_900,
                        fontSize: 14
                      }}
                    >
                      {this.state.no_of_views}
                    </Text>
                  </TouchableOpacity>
                </View>
              </CardView>

              <CardView
                cardElevation={10}
                cornerRadius={0}
                style={PropertyDetailScreenStyle.mapLocationCard}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignContent: "flex-start",
                    alignSelf: "flex-start",
                    alignSelf: "flex-start",
                    justifyContent: "flex-start"
                  }}
                >
                  <Text
                    style={{
                      flex: 0.8,
                      color: Colors.grey_900,
                      fontSize: 16,
                      paddingLeft: 10,
                      paddingRight: 10,
                      paddingTop: 5,
                      paddingBottom: 5,
                      fontWeight: "bold"
                    }}
                  >
                    {"Total Buyers Contacted Seller"}
                  </Text>

                  <TouchableOpacity
                    disabled={true}
                    style={[PropertyDetailScreenStyle.btnStyle, { flex: 0.2 }]}
                  >
                    <Text
                      style={{
                        justifyContent: "center",
                        alignSelf: "center",
                        color: Colors.grey_900,
                        fontSize: 14
                      }}
                    >
                      {this.state.no_of_contacts}
                    </Text>
                  </TouchableOpacity>
                </View>
              </CardView>

              <CardView
                cardElevation={10}
                cornerRadius={0}
                style={PropertyDetailScreenStyle.mapLocationCard}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignContent: "flex-start",
                    alignSelf: "flex-start",
                    alignSelf: "flex-start",
                    justifyContent: "flex-start"
                  }}
                >
                  <Text
                    style={{
                      flex: 0.8,
                      color: Colors.grey_900,
                      fontSize: 16,
                      paddingLeft: 10,
                      paddingRight: 10,
                      paddingTop: 5,
                      paddingBottom: 5,
                      fontWeight: "bold"
                    }}
                  >
                    {"Total Buyers Inspected Property"}
                  </Text>

                  <TouchableOpacity
                    disabled={true}
                    style={[PropertyDetailScreenStyle.btnStyle, { flex: 0.2 }]}
                  >
                    <Text
                      style={{
                        justifyContent: "center",
                        alignSelf: "center",
                        color: Colors.grey_900,
                        fontSize: 14
                      }}
                    >
                      {this.state.no_of_inspections}
                    </Text>
                  </TouchableOpacity>
                </View>
              </CardView>

              <CardView
                cardElevation={10}
                cornerRadius={0}
                style={PropertyDetailScreenStyle.propertyIDCard}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignContent: "flex-start",
                    alignSelf: "flex-start",
                    alignSelf: "flex-start",
                    justifyContent: "flex-start"
                  }}
                >
                  <Text
                    style={{
                      flex: 0.8,
                      color: Colors.grey_900,
                      fontSize: 12,
                      paddingLeft: 10,
                      paddingRight: 10,
                      paddingTop: 5,
                      paddingBottom: 5,
                      fontWeight: "bold"
                    }}
                  >
                    {"Property ID : " + this.state.propertyId}
                  </Text>
                </View>
              </CardView>
            </View>
          )}
        </ScrollView>
        {this.state.isContactSpinnerVisible ? (
          <View
            style={{
              flex: 1,
              left: 0,
              right: 0,
              top: DEVICE_WIDTH / 1.2,
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

        {!this.state.isSpinnerVisible ? (
          this.state.contactInfo ? (
            this.renderRequestButton(this.state.contactInfo)
          ) : (
            <View style={{ alignItems: "center" }}>
              <TouchableOpacity
                onPress={() => this.checkIfUserIsVerfied()}
                activeOpacity={0.5}
              >
                <LinearGradient
                  colors={[Colors.START_COLOR, Colors.END_COLOR]}
                  style={PropertyDetailScreenStyle.roundedButtonStyleAppTheme}
                >
                  <Text style={{ color: "white" }}>
                    {" "}
                    {Strings.BUTTON_TEXT_SEND_REQUEST}{" "}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          )
        ) : null}
        {this.renderModal()}
      </SafeAreaView>
    );
  }

  _handleTextReady = () => {
    console.log("ready!");
  };

  checkPaymentStatus(text) {
    switch (text) {
      case Strings.LABEL_DUE_DILIGENCE_REPORT:
        return this.viewDueDiligenceReport();

      case Strings.LABEL_AUTO_VALUATION_REPORT:
        return this.viewAutoValuationReport();

      case Strings.LABEL_PROPERTY_REPORT:
        return this.viewPropertyReport();

      case Strings.LABEL_SUBURB_REPORT:
        return this.viewSuburbReport();
    }
  }

  viewStatementOfInformation() {
    //  this.closeModal();

    if (this.state.statementOfInformationLink) {
      Actions.statementScreen({
        pdfUrl: this.state.statementOfInformationLink,
        title: Strings.LABEL_STATEMENT_OF_INFORMATION
      });
    } else if (
      this.state.statementOfInformationFileName &&
      this.state.statementOfInformationFilePath
    ) {
      console.log(
        "PDF URL >>>>>" +
          JSON.stringify(
            this.state.statementOfInformationFilePath +
              " / " +
              this.state.statementOfInformationFileName
          )
      );
      let fileUrl =
        API.PDF_URL +
        this.state.statementOfInformationFilePath +
        "/" +
        this.state.statementOfInformationFileName;
      console.log("File URL >>>>>" + JSON.stringify(fileUrl));
      Actions.statementScreen({
        pdfUrl: fileUrl,
        title: Strings.LABEL_STATEMENT_OF_INFORMATION
      });
    } else {
      showErrorMessage(Strings.STATEMENT_OF_INFORMATION + " not available");
    }
  }

  viewDueDiligenceReport() {
    this.closeModal();

    if (this.state.dueDilligencelink) {
      Actions.statementScreen({
        pdfUrl: this.state.dueDilligencelink,
        title: Strings.LABEL_DUE_DILIGENCE_REPORT
      });
    } else if (
      this.state.dueDilligenceFileName &&
      this.state.dueDilligenceFilePath
    ) {
      console.log(
        "PDF URL >>>>>" +
          JSON.stringify(
            this.state.statementOfInformationFilePath +
              " / " +
              this.state.statementOfInformationFileName
          )
      );
      let fileUrl =
        API.PDF_URL +
        this.state.dueDilligenceFilePath +
        "/" +
        this.state.dueDilligenceFileName;
      console.log("File URL >>>>>" + JSON.stringify(fileUrl));
      Actions.statementScreen({
        pdfUrl: fileUrl,
        title: Strings.LABEL_DUE_DILIGENCE_REPORT
      });
    } else {
      showErrorMessage(Strings.LABEL_DUE_DILIGENCE_REPORT + " not available");
    }
  }

  viewAutoValuationReport() {
    this.closeModal();
    if (this.state.autoValuationFileName && this.state.autoValuationFilePath) {
      console.log(
        "PDF URL >>>>>" +
          JSON.stringify(
            this.state.statementOfInformationFilePath +
              " / " +
              this.state.statementOfInformationFileName
          )
      );
      let fileUrl =
        API.PDF_URL +
        this.state.autoValuationFilePath +
        "/" +
        this.state.autoValuationFileName;
      console.log("File URL >>>>>" + JSON.stringify(fileUrl));
      Actions.statementScreen({
        pdfUrl: fileUrl,
        title: Strings.LABEL_AUTO_VALUATION_REPORT
      });
    } else {
      showErrorMessage(Strings.LABEL_AUTO_VALUATION_REPORT + "not available");
    }
  }

  viewPropertyReport() {
    this.closeModal();
    if (
      this.state.propertyReportFileName &&
      this.state.propertyReportFilePath
    ) {
      console.log(
        "PDF URL >>>>>" +
          JSON.stringify(
            this.state.statementOfInformationFilePath +
              " / " +
              this.state.statementOfInformationFileName
          )
      );
      let fileUrl =
        API.PDF_URL +
        this.state.propertyReportFilePath +
        "/" +
        this.state.propertyReportFileName;
      console.log("File URL >>>>>" + JSON.stringify(fileUrl));
      Actions.statementScreen({
        pdfUrl: fileUrl,
        title: Strings.LABEL_PROPERTY_REPORT
      });
    } else {
      showErrorMessage(Strings.LABEL_PROPERTY_REPORT + " not available");
    }
  }

  viewPropertyBrochure() {
    if (this.state.brochure_name && this.state.brochure_path) {
      console.log(
        "PDF URL >>>>>" +
          JSON.stringify(
            this.state.brochure_name + " / " + this.state.brochure_path
          )
      );
      let fileUrl =
        API.PDF_URL + this.state.brochure_path + "/" + this.state.brochure_name;
      console.log("File URL >>>>>" + JSON.stringify(fileUrl));
      // Actions.statementScreen({
      //   pdfUrl: fileUrl,
      //   title: Strings.LABEL_BROCHURE
      // });
      Linking.openURL(fileUrl);
    } else {
      showErrorMessage("Brochure" + " not available");
    }
  }

  viewRealEstateInformation() {
    console.log(
      "viewRealEstateInformation >> " +
        JSON.stringify(this.state.realEstateContractInfoLink)
    );
    console.log(
      "viewRealEstateInformation File>> " +
        JSON.stringify(this.state.realEstateContractInfoFilename)
    );
    console.log(
      "viewRealEstateInformation Path >> " +
        JSON.stringify(this.state.realEstateContractInfoFilePath)
    );
    if (
      this.state.realEstateContractInfoFilename &&
      this.state.realEstateContractInfoFilePath
    ) {
      console.log(
        "PDF URL >>>>>" +
          JSON.stringify(
            this.state.realEstateContractInfoFilename +
              " / " +
              this.state.realEstateContractInfoFilePath
          )
      );
      let fileUrl =
        API.PDF_URL +
        this.state.realEstateContractInfoFilePath +
        "/" +
        this.state.realEstateContractInfoFilename;
      console.log("File URL >>>>>" + JSON.stringify(fileUrl));
      // Actions.statementScreen({
      //   pdfUrl: fileUrl,
      //   title: Strings.LABEL_BROCHURE
      // });
      Actions.statementScreen({
        pdfUrl: fileUrl,
        title: Strings.LABEL_REAL_ESTATE_CONTRACT_INFORMATION
      });
    } else if (this.state.realEstateContractInfoLink) {
      Actions.statementScreen({
        pdfUrl: this.state.realEstateContractInfoLink,
        title: Strings.LABEL_REAL_ESTATE_CONTRACT_INFORMATION
      });
    } else {
      showErrorMessage("Real Estate Contract Information not available");
    }
  }

  viewSuburbReport() {
    this.closeModal();
    if (this.state.paymentDetails) {
      if (
        this.state.suburbReportFileName !== "" &&
        this.state.suburbReportFilePath !== ""
      ) {
        console.log(
          "PDF URL >>>>>" +
            JSON.stringify(
              this.state.suburbReportFilePath +
                " / " +
                this.state.suburbReportFileName
            )
        );
        let fileUrl =
          API.PDF_URL +
          this.state.suburbReportFilePath +
          "/" +
          this.state.suburbReportFileName;
        console.log("File URL >>>>>" + JSON.stringify(fileUrl));
        Actions.statementScreen({
          pdfUrl: fileUrl,
          title: Strings.SUBURB_REPORT_TITLE
        });
      } else {
        showErrorMessage(Strings.LABEL_SUBURB_REPORT + " not available");
      }
      // this.viewPropertyReport();
    } else {
      this.payForSuburbReport();
    }
  }

  async payForSuburbReport() {
    const token = await stripe.paymentRequestWithCardForm(options);

    console.log("Token >>>>> " + JSON.stringify(token));

    if (token) {
      this.sendCardTokenToServer(token.tokenId);
    }
  }

  async sendCardTokenToServer(token) {
    let buyerFullName =
      this.state.userData.firstname + " " + this.state.userData.lastname;
    //this._changeLoadingState(true);

    var postData = {
      buyerId: this.state.userData._id,
      propertyId: this.state.propId,
      property_address: this.state.propertyAddress,
      email: this.state.userData.email,
      full_name: buyerFullName,
      cardToken: token,
      report_price: this.state.reportCart.length * 10,
      report_data: this.state.reportCart
    };

    this.closeModal();
    this._changePaymentLoadingState(true);

    console.log("Send Payment Request >>>> " + JSON.stringify(postData));
    fetch(API.SEND_PAYMENT_REQUEST, {
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
        this._changePaymentLoadingState(false);
        //this._changeLoadingState(false);
        console.log(
          "Response Send Payment Request >>>> " + JSON.stringify(responseJson)
        );

        if (responseJson !== undefined) {
          if (responseJson.code == Strings.STATUS_OK) {
            this.setState({
              paymentDetails: responseJson.data.paymentInfo
            });
            alert(responseJson.message);
          } else {
            alert(responseJson.message);
          }
        }
      })
      .catch(error => {
        this._changePaymentLoadingState(false);
        //this._changeLoadingState(false);
        console.log(error);
        alert(Strings.ALERT_SERVER_ERROR);
      });
  }

  //---------------------------------- PUSH NOTIFICATION ---------------------------------------------//

  // async createNotificationListeners() {
  //   /*
  //   * Triggered when a particular notification has been received in foreground
  //   * */
  //   this.notificationListener = firebase.notifications().onNotification((notification) => {
  //     const { title, body } = notification;
  //     this.showAlert(title, body);
  //     console.log("notificationListener >>>>> " + JSON.stringify(body));
  //   });

  //   /*
  //   * If your app is in background, you can listen for when a notification is clicked / tapped / opened as follows:
  //   * */
  //   this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen) => {
  //     const { title, body } = notificationOpen.notification;
  //     this.showAlert(title, body);
  //     console.log("notificationOpenedListener >>>>> " + JSON.stringify(body));
  //   });

  //   /*
  //   * If your app is closed, you can check if it was opened by a notification being clicked / tapped / opened as follows:
  //   * */
  //   const notificationOpen = await firebase.notifications().getInitialNotification();
  //   if (notificationOpen) {
  //     const { title, body } = notificationOpen.notification;
  //     this.showAlert(title, body);
  //     console.log("notificationOpen >>>>> " + JSON.stringify(body));
  //   }
  //   /*
  //   * Triggered for data only payload in foreground
  //   * */
  //   this.messageListener = firebase.messaging().onMessage((message) => {
  //     //process data message
  //     console.log("messageListener >>>>> " + JSON.stringify(message));
  //   });
  // }

  // showAlert(title, body) {
  //   Alert.alert(
  //     title, body,
  //     [
  //       { text: 'OK', onPress: () => console.log('OK Pressed') },
  //     ],
  //     { cancelable: false },
  //   );
  // }

  //--------------------------------------------------------------------------------------------------//
}

function mapStateToProps(state) {
  return {
    PropertyDetailReducer: state.PropertyDetailReducer
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ getPropertyDetail }, dispatch);
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
    color: Colors.WHITE,
    fontSize: 15,
    fontWeight: "bold"
  },
  titleTextStyleModal: {
    color: Colors.COLOR_CUTTY_SHARK,
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
  touchableAreaStyle: {
    top: 20,
    bottom: 20,
    left: 20,
    right: 20
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PropertyDetailScreen);
