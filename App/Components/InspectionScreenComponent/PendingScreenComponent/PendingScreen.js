import React, { Component,PureComponent } from "react";
import {
  View,
  ImageBackground,
  Text,
  TouchableOpacity,
  AsyncStorage,
  Dimensions
} from "react-native";
import { Avatar, Icon } from "react-native-elements";
import CompleteFlatList from "react-native-complete-flatlist";
import CardView from "react-native-cardview";
import PendingScreenStyle from "./PendingScreenStyle";
import Colors from "../../../Constants/Colors";
import { getPendingInspections } from "../../../Action/ActionCreators";
import Strings from "../../../Constants/Strings";
import { bindActionCreators } from "redux";
import { Actions } from "react-native-router-flux";
import { connect } from "react-redux";
import {
  BarIndicator,
} from 'react-native-indicators';
import API from "../../../Constants/APIUrls";

var moment = require("moment");

const DEVICE_WIDTH = Dimensions.get("window").width;
const DEVICE_HEIGHT = Dimensions.get("window").height;

class PendingScreen extends PureComponent {
  constructor() {
    super();
    this.state = {
      isSpinnerVisible: false,
      isModalVisible: false,
      userData: "",
      pendingContactList: []
    };
  }

  _changeLoadingState(loadingState) {
    this.setState({
      isSpinnerVisible: loadingState
    });
  }

  componentWillMount() {
    console.log("In Component Will Mount PendingScreen  >>>>");
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
            booking_type: Strings.INSPECTION_REQUEST_PENDING,
            page: 1,
            limit: 100
          };
          this.props.getPendingInspections(postData, userData.token);
        }
      })
      .done();
  }

  componentWillReceiveProps(nextProps) {
    console.log(
      "componentWillReceiveProps >>>>" +
        JSON.stringify(nextProps.InspectionReducer)
    );
    this._changeLoadingState(false);
    var response = nextProps.InspectionReducer.pendingInspectionList;

    if (response !== undefined) {
      if (response.code === Strings.STATUS_OK) {
        this.setState({
          pendingContactList: response.data
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
    return <CardView cardElevation={15} cornerRadius={5} style={PendingScreenStyle.updateForm}>
        <View style={{ flex: 2, flexDirection: "row" }}>
          <TouchableOpacity 
          style={{ flex: 2, flexDirection: "row" }} 
          onPress={() => console.log("")}>
            <Avatar rounded medium source={item.inspectionData.created_by.profile_pic !== "noUser.jpg" ? { uri: API.PROFILE_PIC_URL + item.inspectionData.created_by.profile_pic } : require("../../../Assets/user_profile_32.png")} containerStyle={PendingScreenStyle.containerStyle} onPress={() => console.log("Works!")} activeOpacity={0.7} />
            <View style={{ flex: 1, flexDirection: "column", margin: 10 }}>
              <Text style={{ padding: 3 }}>
                <Text style={{ color: Colors.grey_900 }}>
                  {"Seller : "}
                </Text>
                <Text style={{ color: Colors.grey_700 }}>
                  {item.inspectionData.created_by.firstname +
                    " " +
                    item.inspectionData.created_by.lastname}
                </Text>
              </Text>
              <Text style={{ padding: 3 }}>
                <Text style={{ color: Colors.grey_900 }}>
                  {"Address : "}
                </Text>
                <Text style={{ color: Colors.grey_700 }}>
                  {item.propertyData.address}
                </Text>
              </Text>
              {/* <Text style={{ padding: 3 }}>
                <Text style={{ color: Colors.grey_900 }}>
                  {"Phone Number : "}
                </Text>
                <Text style={{ color: Colors.grey_700 }}>
                  {item.inspectionData.created_by.phone_number}
                </Text>
              </Text> */}
              {/* <Text style={{ padding: 3 }}>
                <Text style={{ color: Colors.grey_900 }}>{"Address : "}</Text>
                <Text style={{ color: Colors.grey_700 }}>
                  {item.propertyData.address}
                </Text>
              </Text>
              <Text style={{ padding: 3 }}>
                <Text style={{ color: Colors.grey_900 }}>
                  {"Inspection Date : "}
                </Text>
                <Text style={{ color: Colors.grey_700 }}>
                  {moment(item.inspection_date).format(Strings.DATE_FORMAT)}
                </Text>
              </Text>

              <Text style={{ padding: 3 }}>
                <Text style={{ color: Colors.grey_900 }}>
                  {"Inspection Time : "}
                </Text>
                <Text style={{ color: Colors.grey_700 }}>
                  {item.book_from}
                </Text>
              </Text> */}

              {/* <Text style={{ color: textColor , padding:3 }}> {"Status :" + statusText}</Text> */}
            </View>
          </TouchableOpacity>
        </View>
        <View style={PendingScreenStyle.cardContainer}>
          {/* <TouchableOpacity style={{ flex: 1 }}>
            <View style={PendingScreenStyle.btnChatStyle}>
              <Icon
                size={20}
                name="ios-chatboxes"
                type="ionicon"
                color={Colors.COLOR_PRIMARY}
              />
              <Text
                style={{
                  color: Colors.COLOR_PRIMARY,
                  fontSize: 14,
                  marginLeft: 10
                }}
              >
                Chat
              </Text>
            </View>
          </TouchableOpacity> */}

          {/* <TouchableOpacity style={{ flex: 1, marginTop: 10 , marginLeft:50,marginRight:50 }}>
            <View style={PendingScreenStyle.btnRemoveStyle}>
              <Icon
                size={20}
                name="ios-trash"
                type="ionicon"
                color={Colors.RED}
              />
              <Text style={{ color: Colors.RED, fontSize: 14, marginLeft: 10 }}>
                {Strings.BUTTON_TEXT_CANCEL_INSPECTION}
              </Text>
            </View>
          </TouchableOpacity> */}
        </View>
      </CardView>;
  }

  render() {
    const { navigation } = this.props;
    return (
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
        ) : this.state.pendingContactList.length ? (
          <CompleteFlatList
            placeholder={Strings.SEARCH_PLACEHOLDER_CONTACTS}
           // searchKey={["title", "detail", "time", "date"]}
            highlightColor="#fff"
            pullToRefreshCallback={() => {}}
            data={this.state.pendingContactList}
            renderSeparator={null}
            renderItem={this.renderList.bind(this)}
          />
        ) : (
          <View style={PendingScreenStyle.emptyListStyle}>
            <Text style={PendingScreenStyle.emptyMessageStyle}>
                  {this.state.isSpinnerVisible ? "" : Strings.INSPECTION_LIST_EMPTY}
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
    InspectionReducer: state.InspectionReducer
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ getPendingInspections }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(PendingScreen);

