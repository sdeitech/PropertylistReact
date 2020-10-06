import React, { Component } from "react";
import {
  View,
  ImageBackground,
  Text,
  TouchableOpacity,
  Dimensions,
  FlatList,
  AsyncStorage
} from "react-native";
import CompleteFlatList from "react-native-complete-flatlist";
import CardView from "react-native-cardview";
import PaymentReportStyle from "./PaymentReportStyle";
import HeaderScreen from "../CommonComponent/HeaderScreen";
import Strings from "../../Constants/Strings";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Actions } from "react-native-router-flux";
import { getPaymentReportList } from "../../Action/ActionCreators";
import OfflineNotice from "../../Utils/OfflineNotice";
import Colors from "../../Constants/Colors";
import { BarIndicator } from "react-native-indicators";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import API from "../../Constants/APIUrls";
import HTML from "react-native-render-html";

var he = require("he");

const DEVICE_WIDTH = Dimensions.get("window").width;
const DEVICE_HEIGHT = Dimensions.get("window").height;

class PaymentReportListScreen extends Component {
  constructor() {
    super();
    this.state = {
      isSpinnerVisible: false,
      paymentReportList: []
    };
  }

  _changeLoadingState(loadingState) {
    this.setState({
      isSpinnerVisible: loadingState
    });
  }

  componentWillMount() {
    AsyncStorage.getItem(Strings.KEY_USER_DATA)
      .then(value => {
        if (value) {
          var userData = JSON.parse(value);
          console.log("==== ID ===", userData);

          this.setState({ userData: userData });

          var postData = {
            buyerId: this.state.userData._id,
            page: 0,
            count: 50
          };

          this.props.getPaymentReportList(postData, userData.token);
          this._changeLoadingState(true);
        }
      })
      .done();
  }

  componentWillReceiveProps(nextProps) {
    this._changeLoadingState(false);
    console.log(
      "componentWillReceiveProps PaymentListResponse >>>> " +
        JSON.stringify(nextProps.PaymentListReducer.getPaymentReportList)
    );
    // let paymentListResp = nextProps.KnowledgeReducer.getKnowledgeRes;

    let paymentListResponse = nextProps.PaymentListReducer.getPaymentReportList;

    if (paymentListResponse !== undefined && paymentListResponse !== null) {
      if (paymentListResponse.code === Strings.STATUS_OK) {
        console.log(
          "componentWillReceiveProps PaymentListResponse If Condition >>>> " +
            JSON.stringify(paymentListResponse.data.data)
        );
        this.setState({
          paymentReportList: paymentListResponse.data.data
        });
      } else {
        alert(paymentListResponse.message);
      }
    } else {
      alert(Strings.ALERT_SERVER_ERROR);
    }
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <HeaderScreen title={Strings.PAYMENT_REPORT_SCREEN_TITLE} />
        <OfflineNotice />
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
        ) : this.state.paymentReportList.length ? (
          <View style={{ flex: 1, marginTop: 10 }}>
            <FlatList
              data={this.state.paymentReportList}
              extraData={this.state.refresh}
              renderItem={({ item, index }) => this.renderList(item, index)}
            />
          </View>
        ) : (
          <View style={PaymentReportStyle.emptyListStyle}>
            <Text style={PaymentReportStyle.emptyMessageStyle}>
              {this.state.isSpinnerVisible
                ? ""
                : Strings.PAYMENT_REPORT_LIST_EMPTY_SLOT}
            </Text>
          </View>
        )}
      </View>
    );
  }

  renderList(data, index) {
    let propID = "";
    let transctionID = "";
    let address = "";
    let reportPrice = "";
    let totalAmt = "";
    let reportPurchase = "";
    let status = "";

    let purchasedReports = "";
    let paymentStatus = "NA";
    let statusTextColor = Colors.grey_700;

    try {
      propID =
        data.payment_for == "report" ? data.propertyId.property_unique_id : "";
      address = data.payment_for == "report" ? data.propertyId.address : "";
      transctionID = "";
      reportPrice = data.report_price;
      totalAmt = data.total_amount;

      console.log("Purchased Reports >>>>>" + JSON.stringify(data.report_data));

      if (data.status) {
        paymentStatus = data.status;

        if (paymentStatus === "succeeded") {
          statusTextColor = Colors.green_800;
        } else if (paymentStatus === "failed") {
          statusTextColor = Colors.red_600;
        }
      }

      if (data.report_data.length !== 0) {
        purchasedReports = data.report_data
          .map(function(elem) {
            switch (elem.type) {
              case "statement_of_info":
                return Strings.LABEL_STATEMENT_OF_INFORMATION;

              case "due_deligence_checklist":
                return Strings.LABEL_DUE_DILIGENCE_REPORT;

              case "auto_valuation_report":
                return Strings.LABEL_AUTO_VALUATION_REPORT;

              case "property_report":
                return Strings.LABEL_PROPERTY_REPORT;

              case "suburb_report":
                return Strings.LABEL_SUBURB_REPORT;
            }
          })
          .join(",");
      } else {
        purchasedReports = Strings.LABEL_SUBURB_REPORT;
      }
    } catch (error) {
      console.log("Error >>> " + JSON.stringify(error));
    }
    //console.log("this is index number : " + index + " Data >>>> " + JSON.stringify(data));

    return (
      <CardView
        cardElevation={10}
        cornerRadius={5}
        style={PaymentReportStyle.updateForm}
      >
        <View
          style={{
            flex: 1,
            flexDirection: "column",
            margin: 10
          }}
        >
          {data.payment_for == "report" ? (
            <View>
              <Text style={{ padding: 3 }}>
                <Text style={{ color: Colors.grey_900 }}>
                  {"Property ID : "}
                </Text>
                <Text style={{ color: Colors.grey_700 }}>{propID}</Text>
              </Text>
              <Text style={{ padding: 3 }}>
                <Text style={{ color: Colors.grey_900 }}>{"Address : "}</Text>
                <Text style={{ color: Colors.grey_700 }}>{address}</Text>
              </Text>
            </View>
          ) : null}

          {/* <Text style={{ padding: 3 }}>
            <Text style={{ color: Colors.grey_900 }}>
              {"Transaction ID : "}
            </Text>
            <Text style={{ color: Colors.grey_700 }}>
              {data.stripe_response_json.balance_transaction}
            </Text>
          </Text> */}

          <Text style={{ padding: 3 }}>
            <Text style={{ color: Colors.grey_900 }}>{"Report Price :"}</Text>
            <Text style={{ color: Colors.grey_700 }}>{"$" + reportPrice}</Text>
          </Text>
          <Text style={{ padding: 3 }}>
            <Text style={{ color: Colors.grey_900 }}>{"Total Amount :"}</Text>
            <Text style={{ color: Colors.grey_700 }}>{"$" + totalAmt}</Text>
          </Text>
          <Text style={{ padding: 3 }}>
            <Text style={{ color: Colors.grey_900 }}>
              {"Reports Purchased :"}
            </Text>
            <Text style={{ color: Colors.grey_700 }}>{purchasedReports}</Text>
          </Text>

          <Text style={{ padding: 3 }}>
            <Text style={{ color: Colors.grey_900 }}>{"Status :"}</Text>
            <Text style={{ color: statusTextColor }}>{paymentStatus}</Text>
          </Text>
        </View>
      </CardView>
    );
  }
}
function mapStateToProps(state) {
  return {
    PaymentListReducer: state.PaymentListReducer
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ getPaymentReportList }, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PaymentReportListScreen);
