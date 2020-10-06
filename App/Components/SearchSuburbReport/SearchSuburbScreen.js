import React, { Component } from "react";
import { connect } from "react-redux";
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
  Switch
} from "react-native";

import { getNotificationSetting } from "../../Action/ActionCreators";

import { bindActionCreators } from "redux";
import { Actions } from "react-native-router-flux";
import Colors from "../../Constants/Colors";
import Strings from "../../Constants/Strings";
import LinearGradient from "react-native-linear-gradient";
import { validateEmail, showErrorMessage } from "../../Utils/Validations";
import HeaderScreen from "../CommonComponent/HeaderScreen";
import {
  ifIphoneX,
  getStatusBarHeight,
  getBottomSpace
} from "react-native-iphone-x-helper";

import { BarIndicator } from "react-native-indicators";
import OfflineNotice from "../../Utils/OfflineNotice";
import SearchSuburbStyle from "./SearchSuburbStyle";
import STRINGS from "../../Constants/Strings";
const DEVICE_WIDTH = Dimensions.get("window").width;
const DEVICE_HEIGHT = Dimensions.get("window").height;
import HeaderScreenStyle from "../CommonComponent/HeaderStyle";
import CardView from "react-native-cardview";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import API from "../../Constants/APIUrls";

var DeviceType = DEVICE_HEIGHT / DEVICE_WIDTH > 1.6 ? "Phone" : "Tablet";
import stripe from "tipsi-stripe";

stripe.setOptions({
  publishableKey: Strings.STRIPE_PUBLISHABLE_KEY
});

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
class SearchSuburb extends Component {
  constructor() {
    super();
    this.state = {
      checked: true,
      isSpinnerVisible: false,
      userData: "",
      postalCode: "",
      areaName: "",
      reportData: "",
      paymentInfo: []
    };
  }

  componentWillMount() {
    AsyncStorage.getItem(Strings.KEY_USER_DATA)
      .then(value => {
        if (value) {
          var userData = JSON.parse(value);
          console.log("==== ID ===", userData);

          this.setState({ userData: userData });
        }
      })
      .done();
  }

  componentWillReceiveProps(nextProps) {
    this._changeLoadingState(false);
  }

  onSubmit = () => {
    /// Actions.signUpScreen({ type: "reset" });

    if (this.state.postalCode === "") {
      showErrorMessage(Strings.ERROR_ZIPCODE);
    } else if (this.state.postalCode.trim().length < 4) {
      showErrorMessage(Strings.ERROR_ZIPCODE_MINIMUM_LENGHTH);
    } else if (this.state.areaName === "") {
      showErrorMessage(Strings.ERROR_AREA_NAME);
    } else {
      this.getSuburbReport();
    }
  };

  _changeLoadingState(loadingState) {
    this.setState({
      isSpinnerVisible: loadingState
    });
  }

  async getSuburbReport() {
    this._changeLoadingState(true);
    var postData = {
      buyerId: this.state.userData._id,
      zipcode: this.state.postalCode,
      area_name: this.state.areaName
    };

    console.log(
      "Response Send Contact Request URL>>>> " +
        JSON.stringify(API.GET_SUBURB_REPORT)
    );
    console.log(
      "Response Send Contact Request PostData>>>> " + JSON.stringify(postData)
    );

    fetch(API.GET_SUBURB_REPORT, {
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
          "Response Send Contact Response >>>> " + JSON.stringify(responseJson)
        );

        if (responseJson !== undefined) {
          if (responseJson.code == Strings.STATUS_OK) {
            if (responseJson.data && responseJson.data.length !== 0) {
              this.setState({
                reportData: responseJson.data,
                paymentInfo: responseJson.paymentInfo
              });
            } else {
              alert("Sorry , Suburb Report not found");
            }
          } else {
            alert(responseJson.message);
          }
        } else {
          alert("Sorry , Report not found");
        }
      })
      .catch(error => {
        this._changeLoadingState(false);
        //this._changeLoadingState(false);
        console.log(error);
        alert(Strings.ALERT_SERVER_ERROR);
      });
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <OfflineNotice />
        <HeaderScreen title={Strings.LABEL_SUBURB_REPORT} />
        <View style={{ flex: 1 }}>
          <CardView
            cardElevation={10}
            cornerRadius={5}
            style={SearchSuburbStyle.settingCardContainer}
          >
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: "row", margin: 20 }}>
                <View style={{ flex: 0.3 }}>
                  <Text
                    style={{
                      fontSize: 16,
                      marginTop: 5,
                      color: Colors.grey_700
                    }}
                  >
                    {"Postcode"}
                  </Text>
                </View>
                <View style={{ flex: 0.7 }}>
                  <TextInput
                    placeholder=""
                    keyboardType={"number-pad"}
                    maxLength={4}
                    placeholderTextColor={Colors.BACK_ARROW_COLOR}
                    onChangeText={text => this.setState({ postalCode: text })}
                    style={SearchSuburbStyle.textInputStyleClass}
                    value={this.state.postalCode}
                  />
                </View>
              </View>

              <View style={{ flexDirection: "row", margin: 20 }}>
                <View style={{ flex: 0.3 }}>
                  <Text
                    style={{
                      fontSize: 16,
                      marginTop: 5,
                      color: Colors.grey_700
                    }}
                  >
                    {"Area Name"}
                  </Text>
                </View>
                <View style={{ flex: 0.7 }}>
                  <TextInput
                    placeholder=""
                    keyboardType={"default"}
                    placeholderTextColor={Colors.BACK_ARROW_COLOR}
                    onChangeText={text => this.setState({ areaName: text })}
                    style={SearchSuburbStyle.textInputStyleClass}
                    value={this.state.areaName}
                  />
                </View>
              </View>

              <View style={{ flexDirection: "row", margin: 20 }}>
                <View style={{ flex: 0.3 }}></View>
                <View style={{ flex: 0.7 }}>
                  <TouchableOpacity
                    onPress={() => this.onSubmit()}
                    activeOpacity={0.5}
                  >
                    <LinearGradient
                      colors={["#00C2D7", "#4EE1CA"]}
                      style={SearchSuburbStyle.buttonStyleAppTheme}
                    >
                      <View>
                        <Text
                          style={{
                            color: "white",
                            fontWeight: "600",
                            justifyContent: "center",
                            alignItems: "center",
                            alignSelf: "center",
                            marginTop: DeviceType == "Tablet" ? 20 : 10
                          }}
                        >
                          {" "}
                          {Strings.BUTTON_TEXT_SEARCH_SUBURB_REPORT}{" "}
                        </Text>
                      </View>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </View>
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
          </CardView>
        </View>

        {console.log(
          "Report Data >>> " + JSON.stringify(this.state.reportData)
        )}
        {this.state.reportData ? (
          <CardView
            cardElevation={10}
            cornerRadius={0}
            style={SearchSuburbStyle.mapLocationCard}
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
                  flex: 0.7,
                  color: Colors.grey_900,
                  fontSize: 16,
                  paddingLeft: 10,
                  paddingRight: 10,
                  paddingTop: 5,
                  paddingBottom: 5,
                  fontWeight: "bold"
                }}
              >
                {"Suburb Report"}
              </Text>

              <TouchableOpacity
                onPress={() =>
                  this.state.paymentInfo == null
                    ? this.payForSuburbReport()
                    : this.viewSuburbReport()
                }
                style={[SearchSuburbStyle.btnStyle, { flex: 0.3 }]}
              >
                <Text
                  style={{
                    justifyContent: "center",
                    alignSelf: "center",
                    color: Colors.grey_900,
                    fontSize: 14
                  }}
                >
                  {this.state.paymentInfo !== null ? "View" : "Buy for $10"}
                </Text>
              </TouchableOpacity>
            </View>
          </CardView>
        ) : null}
      </View>
    );
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
      email: this.state.userData.email,
      full_name: buyerFullName,
      cardToken: token,
      report_price: 10,
      suburbId: this.state.reportData[0]._id,
      postalCode: this.state.postalCode,
      suburbAddress: this.state.areaName
    };

    this._changeLoadingState(true);

    console.log("Payment Request >>>> " + API.SEND_SUBURB_PAYMENT_REQUEST);
    console.log("Send Payment Request >>>> " + JSON.stringify(postData));
    fetch(API.SEND_SUBURB_PAYMENT_REQUEST, {
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
          "Response Send Payment Request >>>> " + JSON.stringify(responseJson)
        );

        if (responseJson !== undefined) {
          if (responseJson.code == Strings.STATUS_OK) {
            this.setState({
              paymentInfo: responseJson.data.paymentInfo
            });
            alert(responseJson.message);
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

  viewSuburbReport() {
    if (this.state.reportData) {
      let fileUrl =
        API.PDF_URL +
        this.state.reportData[0].filepath +
        "/" +
        this.state.reportData[0].filename;
      console.log("File URL >>>>>" + JSON.stringify(fileUrl));
      Actions.statementScreen({
        pdfUrl: fileUrl,
        title: Strings.LABEL_SUBURB_REPORT
      });
    } else {
      showErrorMessage(Strings.SUBURB_REPORT_TITLE + "not available");
    }
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
  header: {
    ...ifIphoneX(
      {
        paddingTop: getStatusBarHeight()
      },
      {
        paddingTop: 0
      }
    )
  }
});

function mapStateToProps(state) {
  return {
    SearchSuburbReducer: state.SearchSuburbReducer
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ getNotificationSetting }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchSuburb);
