import React, { Component, PureComponent } from "react";
import {
  View,
  ImageBackground,
  Text,
  TouchableOpacity,
  AsyncStorage,
  FlatList,
  Dimensions
} from "react-native";
import { Avatar, Icon } from "react-native-elements";
import HeaderScreen from "../CommonComponent/HeaderScreen";
import CompleteFlatList from "react-native-complete-flatlist";
import CardView from "react-native-cardview";
import InspectionScreenStyle from "./InspectionScreenStyle_1";
import Colors from "../../Constants/Colors";
import { getAcceptedContactList } from "../../Action/ActionCreators";
import Strings from "../../Constants/Strings";
import { bindActionCreators } from "redux";
import { Actions } from "react-native-router-flux";
import { connect } from "react-redux";
import {
  BarIndicator,
} from 'react-native-indicators';
var moment = require("moment");
import FastImage from "react-native-fast-image";


const DEVICE_WIDTH = Dimensions.get("window").width;
const DEVICE_HEIGHT = Dimensions.get("window").height;

class InsepectionListScreen_1 extends PureComponent {
  constructor() {
    super();
    this.state = {
      isSpinnerVisible: false,
      isModalVisible: false,
      userData: "",
      inspectionListData: [{}, {}, {}, {}, {},]
    };
  }

  _changeLoadingState(loadingState) {
    this.setState({
      isSpinnerVisible: loadingState
    });
  }

  componentWillMount() {
    console.log("In Component Did Mount >>>>");
    this._getUserData();
  }

  _getUserData() {
    AsyncStorage.getItem(Strings.KEY_USER_DATA)
      .then(value => {
        if (value) {
          var userData = JSON.parse(value);
          console.log("==== UserData ===", userData);

          this.setState({
            userData: userData
          });

          //this.setState({ userInfo: userData });
          this._changeLoadingState(true);
          var postData = {
            buyerId: userData._id,
            status: Strings.CONTACT_REQUEST_ACCEPTED
          };
          this.props.getAcceptedContactList(postData, userData.token);
        }
      })
      .done();
  }

  componentWillReceiveProps(nextProps) {
    console.log(
      "componentWillReceiveProps >>>>" +
      JSON.stringify(nextProps.ContactReducer)
    );
    this._changeLoadingState(false);
    var response = nextProps.ContactReducer.acceptContactList;

    if (response !== undefined) {
      if (response.code === Strings.STATUS_OK) {
        this.setState({
          inspectionListData: response.data
        });
      } else {
        alert(response.message);
      }
    } else {
      //alert(Strings.SERVER_ERROR);
    }
  }

  renderList(item, index) {
    console.log("this is index number : " + index);

    let textColor = "";
    let statusText = "";

    if (item.status === Strings.CONTACT_REQUEST_ACCEPTED) {
      statusText = "Accepted";
      textColor = Colors.green_800;
    } else if (item.status === Strings.CONTACT_REQUEST_PENDING) {
      statusText = "Pending";
      textColor = Colors.yellow_800;
    } else {
      statusText = "Rejected";
      textColor = Colors.red_800;
    }

    return (
      <CardView
        cardElevation={15}
        cornerRadius={5}
        style={InspectionScreenStyle.updateForm}
      >
        <View style={{ flex: 2, flexDirection: "row" }}>
          <TouchableOpacity
            style={{ flex: 2, flexDirection: "row" }}
            onPress={() =>
              Actions.propertyDetailScreen({ propertyID: item.propertyId._id })
            }
          >
            <Avatar
              size="large"
              source={{
                uri:
                  "https://s3.amazonaws.com/uifaces/faces/twitter/brynn/128.jpg"
              }}
              containerStyle={InspectionScreenStyle.containerStyle}
              onPress={() => console.log("Works!")}
              activeOpacity={0.7}
            />
            <View
              style={{
                flex: 1,
                flexDirection: "column",
                margin: 10,
                justifyContent: "space-between",
                paddingBottom: 10
              }}
            >
              <Text style={{ padding: 3 }}>
                <Text style={{ color: Colors.grey_900 }}>{"Seller : "}</Text>
                <Text style={{ color: Colors.grey_700 }}>
                  {/* {item.receiverId.firstname + " " + item.receiverId.lastname} */}
                  {"Mark Wood"}
                </Text>
              </Text>
              <Text style={{ padding: 3 }}>
                <Text style={{ color: Colors.grey_900 }}>
                  {"Property ID : "}
                </Text>
                <Text style={{ color: Colors.grey_700 }}>
                  {/* {item.propertyId.property_unique_id} */}
                  {"PRO457680"}
                </Text>
              </Text>
              <Text style={{ padding: 3 }}>
                <Text style={{ color: Colors.grey_900 }}>{"Address : "}</Text>
                <Text style={{ color: Colors.grey_700 }}>
                  {/* {item.propertyId.address} */}
                  {"2 Lonsdale Street , Melbourne , VIC 3000"}
                </Text>
              </Text>
              <Text style={{ padding: 3 }}>
                <Text style={{ color: Colors.grey_900 }}>
                  {"Inspection Date : "}
                </Text>
                <Text style={{ color: Colors.grey_700 }}>
                  {/* {moment(item.createdAt).format(Strings.DATE_FORMAT)} */}
                  {"18 Nov 2018"}
                </Text>
              </Text>

              <Text style={{ padding: 3 }}>
                <Text style={{ color: Colors.grey_900 }}>
                  {"Inspection Time : "}
                </Text>
                <Text style={{ color: Colors.grey_700 }}>
                  {/* {moment(item.createdAt).format(Strings.DATE_FORMAT)} */}
                  {"5 : 00 pm"}
                </Text>
              </Text>

              {/* <Text style={{ padding: 3 }}>
                <Text style={{ color: Colors.grey_900 }}>
                  {"Inspection Status : "}
                </Text>
                <Text style={{ color: Colors.grey_700 }}>
                  {moment(item.createdAt).format(Strings.DATE_FORMAT)}
                </Text>
              </Text> */}

              {/* <Text style={{ color: textColor , padding:3 }}> {"Status :" + statusText}</Text> */}
            </View>
          </TouchableOpacity>
        </View>
        <View style={InspectionScreenStyle.cardContainer}>
          <TouchableOpacity style={{ flex: 1 }}>
            <View style={InspectionScreenStyle.btnRemoveStyle}>
              <Icon
                size={20}
                name="ios-trash"
                type="ionicon"
                color={Colors.RED}
              />
              <Text style={{ color: Colors.RED, fontSize: 14, marginLeft: 10 }}>
                {"Cancel Inspection"}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </CardView>
    );
  }

  render() {
    const { navigation } = this.props;
    return (
      <View style={{ flex: 1 }}>
        <HeaderScreen title={Strings.INSPECTION_SCREEN_TITLE} />
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
        ) : this.state.inspectionListData.length ? (
         <FastImage source={require("../../Assets/bg_login.png")} style={InsepectionListScreen_1.backgroundImage}>
              <FlatList
                style={{ marginTop: 5 }}
                data={this.state.inspectionListData}
                numColumns={1}
                renderItem={this.renderList.bind(this)}
              />
          </FastImage>
        ) : (
              <View style={InspectionScreenStyle.emptyListStyle}>
                <Text style={InspectionScreenStyle.emptyMessageStyle}>
                  {this.state.isSpinnerVisible ? "" : Strings.CONTACT_LIST_EMPTY}
                </Text>
              </View>
            )}
        {/* <CompleteFlatList
          placeholder={Strings.SEARCH_PLACEHOLDER_CONTACTS}
          searchKey={["title", "detail", "time", "date"]}
          highlightColor="#fff"
          pullToRefreshCallback={() => {}}
          data={data}
          renderSeparator={null}
          renderItem={this.renderList.bind(this)}
        /> */}
      </View>
    );
  }
}

function mapStateToProps(state) {

  return {
    ContactReducer: state.ContactReducer
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ getAcceptedContactList }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(InsepectionListScreen_1);

