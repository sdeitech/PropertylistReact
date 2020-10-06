import React, { Component, PureComponent } from "react";
import {
  View,
  ImageBackground,
  Text,
  FlatList,
  TouchableOpacity,
  AsyncStorage,
  Alert,
  Dimensions,
  Linking
} from "react-native";
import { Avatar, Icon, SearchBar, Button } from "react-native-elements";
import CompleteFlatList from "react-native-complete-flatlist";
import CardView from "react-native-cardview";
import AcceptScreenStyle from "./SellerListStyle";
import Colors from "../../Constants/Colors";
import { getAcceptedContactList } from "../../Action/ActionCreators";
import Strings from "../../Constants/Strings";
import { bindActionCreators } from "redux";
import { Actions } from "react-native-router-flux";
import { connect } from "react-redux";
import { BarIndicator } from "react-native-indicators";
import API from "../../Constants/APIUrls";
import LinearGradient from "react-native-linear-gradient";
var moment = require("moment");
import HeaderScreen from "../CommonComponent/HeaderScreen";

import { checkUserVerifed } from "../../Utils/Validations";

const DEVICE_WIDTH = Dimensions.get("window").width;
const DEVICE_HEIGHT = Dimensions.get("window").height;

var defaultData = [];

class SellerListScreen extends PureComponent {
  constructor() {
    super();
    this.state = {
      isSpinnerVisible: false,
      isSearchSpinnerVisible: false,
      isModalVisible: false,
      userData: "",
      searchedText: "",
      acceptedContactList: [],
      defaultContactList: [],
      refreshList: false
    };
  }

  _toogleList() {
    this.setState({
      refresh: !this.state.refresh
    });
  }

  _changeLoadingState(loadingState) {
    this.setState({
      isSpinnerVisible: loadingState
    });
  }

  _changeSearchLoadingState(loadingState) {
    this.setState({
      isSearchSpinnerVisible: loadingState
    });
  }

  componentWillMount() {
    console.log("In Component Did Mount >>>>");

    this.checkIfUserIsVerfied();
  }

  checkIfUserIsVerfied() {
    let isVerified = checkUserVerifed();

    if (!isVerified) {
      this._getUserData();
    } else {
      Alert.alert(
        Strings.APP_NAME,
        Strings.ERROR_VERIFIED_PROFILE,
        [
          { text: "Later", onPress: () => Actions.pop() },
          {
            text: "Verify Now",
            onPress: () => Linking.openURL(API.BUYER_LOGIN)
          }
        ],
        { cancelable: false }
      );
    }
  }

  handleClick = () => {
    Linking.canOpenURL(API.BUYER_LOGIN).then(supported => {
      if (supported) {
        Linking.openURL(API.BUYER_LOGIN);
      } else {
        console.log("Don't know how to open URI: " + API.BUYER_LOGIN);
      }
    });
  };

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
    // console.log(
    //   "componentWillReceiveProps >>>>" +
    //     JSON.stringify(nextProps.ContactReducer)
    // );
    this._changeLoadingState(false);
    var response = nextProps.ContactReducer.acceptContactList;

    if (response !== undefined) {
      if (response.code === Strings.STATUS_OK) {
        defaultData = response.data;
        // console.log(
        //   "componentWillReceiveProps >> " + JSON.stringify(defaultData)
        // );
        let myArr = [];
        // if (defaultData.length != 0) {
        //   for (let i = 0; i < response.data.length != 0; i++) {
        //     if (response.data.participants.length != 0) {
        //       myArr.push(response.data);
        //     }
        //   }
        // }

        if (defaultData.length != 0) {
          myArr = defaultData.filter(item => item.participants.length != 0);
          console.log("myArr >>>> " + myArr);
        }

        this.setState({
          defaultContactList: myArr,
          acceptedContactList: myArr
        });
      } else {
        alert(response.message);
      }
    } else {
      //alert(Strings.SERVER_ERROR);
    }
  }

  renderList(item, index) {
    console.log(
      "this is index number : " + index + " data >>>>>> " + JSON.stringify(item)
    );

    var name = "";
    var arrName = [];
    let status = "";
    let userType = "";
    let receiverId = "";

    try {
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
      if (item.participants.length != 0) {
        receiverId = item.participants[0];

        userType = item.userType === "Buyer" ? "Seller" : item.userType;
      }

      if (userType === "Group") {
        for (let i = 0; i < item.participants.length; i++) {
          arrName.push(
            " " +
              item.participants[i].firstname +
              " " +
              item.participants[i].lastname +
              " "
          );
        }
        name = arrName.join();
        console.log("Group Names >>>> " + name);
      } else {
        if (item.participants.length != 0) {
          name =
            item.participants[0].firstname +
            " " +
            item.participants[0].lastname;
        }
      }
    } catch (err) {}

    return (
      <CardView
        cardElevation={15}
        cornerRadius={5}
        style={AcceptScreenStyle.updateForm}
      >
        <View style={{ flex: 2, flexDirection: "row" }}>
          {receiverId ? (
            <Avatar
              rounded
              medium
              source={
                receiverId.profile_pic !== "noUser.jpg"
                  ? {
                      uri:
                        userType !== "Admin"
                          ? API.PROFILE_PIC_URL + receiverId.profile_pic
                          : receiverId.profile_pic
                    }
                  : require("../../Assets/user_profile_32.png")
              }
              containerStyle={AcceptScreenStyle.containerStyle}
              onPress={() => console.log("Works!")}
              activeOpacity={0.7}
            />
          ) : null}
          <View
            style={{
              flex: 1,
              flexDirection: "column",
              marginTop: 10
            }}
          >
            <Text style={{ padding: 5 }}>
              <Text style={{ color: Colors.grey_900 }}>
                {userType !== "Admin"
                  ? userType + " : "
                  : "Admin is available in the chat room for support if required : "}
              </Text>
              <Text style={{ color: Colors.grey_700 }}>
                {userType !== "Admin" ? name : "Contact Admin"}
              </Text>
            </Text>
            {userType !== "Admin" ? (
              <Text style={{ padding: 5 }}>
                <Text style={{ color: Colors.grey_900 }}>{"Address : "}</Text>
                <Text style={{ color: Colors.grey_700 }}>
                  {item.propertyId.address}
                </Text>
              </Text>
            ) : null}
            {/* <Text style={{ padding: 3 }}>
                <Text style={{ color: Colors.grey_900 }}>
                  {"Phone Number : "}
                </Text>
                <Text style={{ color: Colors.grey_700 }}>
                  {item.receiverId.phone_number}
                </Text>
              </Text> */}
            {/* <Text style={{ padding: 3 }}>
                <Text style={{ color: Colors.grey_900 }}>{"Address : "}</Text>
                <Text style={{ color: Colors.grey_700 }}>
                  {item.propertyId.address}
                </Text>
              </Text>
              <Text style={{ padding: 3 }}>
                <Text style={{ color: Colors.grey_900 }}>
                  {"Request Date : "}
                </Text>
                <Text style={{ color: Colors.grey_700 }}>
                  {moment(item.createdAt).format(Strings.DATE_FORMAT)}
                </Text>
              </Text> */}

            {/* <Text style={{ color: textColor , padding:3 }}> {"Status :" + statusText}</Text> */}
          </View>
        </View>
        <View style={AcceptScreenStyle.cardContainer}>
          <TouchableOpacity
            onPress={() =>
              Actions.chatScreen({
                seller:
                  userType === "Admin"
                    ? "Contact Admin"
                    : item.propertyId.address,
                propertyID: item.propertyId,
                contactID: item._id,
                participants: item.participants,
                userType: item.userType
              })
            }
            style={{ flex: receiverId.userType === "Admin" ? 0.5 : 1 }}
          >
            <View style={AcceptScreenStyle.btnChatStyle}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-evenly",
                  alignSelf: "center",
                  alignContent: "center"
                }}
              >
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
            </View>
          </TouchableOpacity>

          {receiverId.userType !== "Admin" ? (
            <TouchableOpacity
              style={{ flex: 1 }}
              onPress={() => this.showRemoveContactBookAlert(item, index)}
            >
              <View style={AcceptScreenStyle.btnRemoveStyle}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-evenly",
                    alignSelf: "center",
                    alignContent: "center"
                  }}
                >
                  <Icon
                    size={20}
                    name="ios-trash"
                    type="ionicon"
                    color={Colors.RED}
                  />
                  <Text
                    style={{ color: Colors.RED, fontSize: 14, marginLeft: 10 }}
                  >
                    Remove
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ) : null}
        </View>
      </CardView>
    );
  }

  filterContactList(text) {
    console.log("Search Term >>>" + text);

    //  console.log("Intial Dataset >>>" + JSON.strin gify(this.state.acceptedContactList))
    let filteredArray = [];

    console.log("Inside if >>>");

    this.setState({
      searchedText: text
    });

    // if (filteredArray.length !== 0) {
    //   for (let k = 0; k < this.state.acceptedContactList.length; k++) {
    //     this.state.acceptedContactList.splice(k, 1);
    //   }

    //   for (let j = 0; j < filteredArray.length; j++) {
    //     this.state.acceptedContactList.push(filteredArray[j]);
    //   }

    //   this._toogleList();
    // }
  }

  async getFilteredContact() {
    this._changeSearchLoadingState(true);
    var postData = {
      buyerId: this.state.userData._id,
      status: Strings.CONTACT_REQUEST_ACCEPTED,
      seller_name: this.state.searchedText,
      buyer_name:
        this.state.userData.firstname + " " + this.state.userData.lastname
    };
    fetch(API.GET_BUYER_CONTACT_LIST, {
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
        this._changeSearchLoadingState(false);
        //this._changeLoadingState(false);
        console.log(
          "Response getFilteredContact >>>> " + JSON.stringify(responseJson)
        );

        if (responseJson !== undefined) {
          if (responseJson.code == Strings.STATUS_OK) {
            if (responseJson.data.length !== 0) {
              //this.clearList();

              // for (let i = 0; i < responseJson.data.length; i++) {
              //   this.state.acceptedContactList.push(responseJson.data[i]);
              // }

              this.setState({
                acceptedContactList: responseJson.data
              });

              this._toogleList();
            } else {
              alert("Sorry ! The Seller you searched not found");
            }
            // alert(responseJson.message);
            // this.setState({ contactInfo: responseJson.data });
          } else {
            alert(responseJson.message);
          }
        }
      })
      .catch(error => {
        this._changeSearchLoadingState(false);
        //this._changeLoadingState(false);
        console.log(error);
        alert(Strings.ALERT_SERVER_ERROR);
      });
  }

  clearList() {
    for (let i = 0; i < this.state.acceptedContactList.length; i++) {
      this.state.acceptedContactList.splice(i, 1);
    }
  }

  render() {
    const { navigation } = this.props;
    return (
      <View style={{ flex: 1 }}>
        <HeaderScreen title={Strings.SELLER_LIST_TITLE} />
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
        ) : this.state.acceptedContactList.length ? (
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: "row" }}>
              <SearchBar
                containerStyle={{ flex: 0.8 }}
                lightTheme
                searchIcon={null} // You could have passed `null` too
                onChangeText={text => this.filterContactList(text)}
                onClear={() => console.log("Clear Text >> " + text)}
                placeholder="Search by Seller name"
              />

              <View
                style={{
                  flex: 0.2,
                  alignContent: "center",
                  alignItems: "center",
                  alignSelf: "center"
                }}
              >
                <TouchableOpacity
                  onPress={() => this.getFilteredContact()}
                  style={[AcceptScreenStyle.btnStyle]}
                >
                  <Text
                    style={{
                      justifyContent: "center",
                      alignSelf: "center",
                      color: Colors.grey_900,
                      fontSize: 14
                    }}
                  >
                    {"Search"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {this.state.isSearchSpinnerVisible ? (
              <View
                style={{
                  flex: 1,
                  left: 0,
                  right: 0,
                  top: 0,
                  bottom: DEVICE_HEIGHT / 2,
                  position: "absolute",
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: Colors.TRANSPARENT,
                  width: window.width,
                  height: window.height,
                  zIndex: 2
                }}
              >
                <BarIndicator color={Colors.END_COLOR} count={5} />
              </View>
            ) : null}
            <FlatList
              data={this.state.acceptedContactList}
              extraData={this.state.refresh}
              renderItem={({ item, index }) => this.renderList(item, index)}
            />
          </View>
        ) : (
          <View style={AcceptScreenStyle.emptyListStyle}>
            <Text style={AcceptScreenStyle.emptyMessageStyle}>
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

  _filterData() {}

  showRemoveContactBookAlert(item, index) {
    Alert.alert(
      Strings.APP_NAME,
      "Do you really want to remove this seller from your contact ?",
      [
        {
          text: "Yes,Remove it",
          onPress: () => this._removeContact(item, index)
        },
        {
          text: "No, Keep it",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        }
      ],
      { cancelable: false }
    );
  }

  async _removeContact(item, index) {
    this._changeSearchLoadingState(true);
    var postData = {
      contactId: item._id,
      userType: item.userType
    };
    console.log("POST data >>>>" + JSON.stringify(postData));

    fetch(API.REMOVE_CONTACT_BUYER, {
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
        this._changeSearchLoadingState(false);
        //this._changeLoadingState(false);
        console.log("Response Time Slot >>>> " + JSON.stringify(responseJson));

        if (responseJson !== undefined) {
          if (responseJson.code == Strings.STATUS_OK) {
            alert(responseJson.message);
            console.log("Index >> " + index);
            this.state.acceptedContactList.splice(index, 1);

            console.log(
              "Contact List >>>" +
                JSON.stringify(this.state.acceptedContactList)
            );
            this._toogleList();

            //this._toogleList();
          } else {
            alert(responseJson.message);
            console.log("Error >>> " + responseJson.message);
          }
        }
      })
      .catch(error => {
        this._changeSearchLoadingState(false);
        //this._changeLoadingState(false);
        console.log(error);
        alert(Strings.ALERT_SERVER_ERROR);
      });
  }
}

function mapStateToProps(state) {
  return {
    ContactReducer: state.ContactReducer
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ getAcceptedContactList }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(SellerListScreen);
