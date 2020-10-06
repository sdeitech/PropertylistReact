import React, { Component, PureComponent } from "react";
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
import RejectScreenStyle from "./RejectScreenStyle";
import Colors from "../../../Constants/Colors";
import { getRejectedContactList } from "../../../Action/ActionCreators";
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

class RejectScreen extends PureComponent {
  constructor() {
    super();
    this.state = {
      isSpinnerVisible: false,
      isModalVisible: false,
      userData: "",
      rejectContactList: []
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
            status: Strings.CONTACT_REQUEST_REJECTED
          };
          this.props.getRejectedContactList(postData, userData.token);
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
    var response = nextProps.ContactReducer.rejectContactList;

    if (response !== undefined) {
      if (response.code === Strings.STATUS_OK) {
        this.setState({
          rejectContactList: response.data
        });
      } else {
        alert(response.message);
      }
    } else {
      //alert(Strings.SERVER_ERROR);
    }
  }

  renderList(item, index) {
    let receiverId = item.participants[0];
    let name = item.participants[0].firstname + " " + item.participants[0].lastname;
    let userType = item.userType === "Buyer" ? "Seller" : item.userType;
    var arrName = [];

    if (userType === "Group") {
      for (let i = 0; i < item.participants.length; i++) {
        arrName.push(item.participants[i].firstname + " " + item.participants[i].lastname);
      }
      name = arrName.join();
      console.log("Group Names >>>> " + name);
    } else {
      name = item.participants[0].firstname + " " + item.participants[0].lastname;
    }
    return (
      <CardView
        cardElevation={15}
        cornerRadius={5}
        style={RejectScreenStyle.updateForm}>
        <View style={{ flex: 2, flexDirection: "row" }}>
          <TouchableOpacity
            style={{ flex: 2, flexDirection: "row" }}
            onPress={() => Actions.propertyDetailScreen({ propertyID: item.propertyId._id })}
          >
            {/* <Avatar
              rounded
              medium
              source={
                receiverId.profile_pic !== "noUser.jpg"
                  ? { uri: userType !== "Admin" ? API.PROFILE_PIC_URL + receiverId.profile_pic : receiverId.profile_pic }
                  : require("../../../Assets/user_profile_32.png")
              }
              containerStyle={PendingScreenStyle.containerStyle}
              onPress={() => console.log("Works!")}
              activeOpacity={0.7}
            /> */}
            <View
              style={{
                flex: 1,
                flexDirection: "column",
                margin: 10,
                justifyContent: "space-between",
                paddingBottom: 10,
              }}
            >
              {/* <Text style={{ padding: 3 }}>
                <Text style={{ color: Colors.grey_900 }}>{userType + ":"}</Text>
                <Text style={{ color: Colors.grey_700 }}>
                  {name}
                </Text>
              </Text> */}
              {
                userType !== "Admin" ? (
                  <View>
                    <Text style={{ padding: 3 }}>
                      <Text style={{ color: Colors.grey_900 }}>
                        {"Request Date : "}
                      </Text>
                      <Text style={{ color: Colors.grey_700 }}>
                        {moment(item.createdAt).format(Strings.DATE_FORMAT_MM)}
                      </Text>
                    </Text>
                    <Text style={{ padding: 3 }}>
                      <Text style={{ color: Colors.grey_900 }}>{"Address : "}</Text>
                      <Text style={{ color: Colors.grey_700 }}>
                        {item.propertyId.address}
                      </Text>
                    </Text>
                  </View>

                ) : null
              }
              {/* <Text style={{ padding: 3 }}>
                <Text style={{ color: Colors.grey_900 }}>{"Property ID : "}</Text>
                <Text style={{ color: Colors.grey_700 }}>{item.propertyId.property_unique_id}</Text>
              </Text>
              <Text style={{ padding: 3 }}>
                <Text style={{ color: Colors.grey_900 }}>{"Address : "}</Text>
                <Text style={{ color: Colors.grey_700 }}>{item.propertyId.address}</Text>
              </Text>
              <Text style={{ padding: 3 }}>
                <Text style={{ color: Colors.grey_900 }}>{"Request Date : "}</Text>
                <Text style={{ color: Colors.grey_700 }}>{moment(item.createdAt).format(Strings.DATE_FORMAT)}</Text>
              </Text> */}

              {/* <Text style={{ color: textColor , padding:3 }}> {"Status :" + statusText}</Text> */}
            </View>
          </TouchableOpacity>
        </View>
        {/* <View style={PendingScreenStyle.cardContainer}>
          <TouchableOpacity 
            style={{ flex: userType === "Admin" ? 0.5 : 1 }}
            disabled={true}
            onPress={() => console.log("")}>
           
          </TouchableOpacity>

          {userType !== "Admin" ? (
            <TouchableOpacity
              style={{ flex: 1 }}
              onPress={() => this.showRemoveContactBookAlert(item, index)}
            >
              <View style={PendingScreenStyle.btnRemoveStyle}>
                <View style={{ flexDirection: "row", justifyContent: "space-evenly", alignSelf: "center", alignContent: "center" }}>
                  <Icon
                    size={20}
                    name="ios-trash"
                    type="ionicon"
                    color={Colors.RED}
                  />
                  <Text style={{ color: Colors.RED, fontSize: 14, marginLeft: 10, alignSelf: "center", alignContent: "center" }}>
                    Remove
              </Text>
                </View>

              </View>
            </TouchableOpacity>

          ) : null}

        </View> */}

      </CardView>
    );
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
        ) : this.state.rejectContactList.length ? (
          <CompleteFlatList
            placeholder={Strings.SEARCH_PLACEHOLDER_CONTACTS}
           // searchKey={["title", "detail", "time", "date"]}
            highlightColor="#fff"
            pullToRefreshCallback={() => {}}
            data={this.state.rejectContactList}
            renderSeparator={null}
            renderItem={this.renderList.bind(this)}
          />
        ) : (
          <View style={RejectScreenStyle.emptyListStyle}>
            <Text style={RejectScreenStyle.emptyMessageStyle}>
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
  return bindActionCreators({ getRejectedContactList }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(RejectScreen);

