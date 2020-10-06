import React, { Component, PureComponent } from "react";
import {
  View,
  ImageBackground,
  Text,
  Image,
  TouchableOpacity,
  TouchableHighlight,
  TouchableWithoutFeedback,
  AsyncStorage,
  TextInput,
  FlatList,
  Alert,
  StyleSheet,
  Dimensions
} from "react-native";
import { Avatar, Icon, Header } from "react-native-elements";
import CompleteFlatList from "react-native-complete-flatlist";
import CardView from "react-native-cardview";
import AcceptScreenStyle from "./AcceptScreenStyle";
import Colors from "../../../Constants/Colors";
import { getUpcomingInspection } from "../../../Action/ActionCreators";
import Strings from "../../../Constants/Strings";
import { bindActionCreators } from "redux";
import { Actions } from "react-native-router-flux";
import { connect } from "react-redux";
import { BarIndicator } from "react-native-indicators";
var moment = require("moment");
import API from "../../../Constants/APIUrls";
import TagInput from "react-native-tag-input";
import Modal from "react-native-modal";
import HeaderScreenStyle from "../../CommonComponent/HeaderStyle";
import {
  ifIphoneX,
  getStatusBarHeight,
  getBottomSpace
} from "react-native-iphone-x-helper";
import CalendarStrip from "react-native-calendar-strip";
import LinearGradient from "react-native-linear-gradient";

var moment = require("moment-timezone");
moment.tz("America/New_York");

var customData = require("../../../Utils/Aus_Vic_Postcodes.json");
const items = [];

const DEVICE_WIDTH = Dimensions.get("window").width;
const DEVICE_HEIGHT = Dimensions.get("window").height;

var mydate = moment().format(Strings.REQUESTED_TIME_SLOT_DATE_FORMAT);

class AcceptScreen extends PureComponent {
  constructor() {
    super();
    this.state = {
      isSpinnerVisible: false,
      isModalVisible: false,
      userData: "",
      acceptedContactList: [],
      refreshList: false,
      weekStart: moment(),
      selectedDate: mydate,
      postalCode: "",
      selectedTimeSlot: ""
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
            booking_type: Strings.INSPECTION_REQUEST_UPCOMING,
            page: 1,
            limit: 100,
            postal_code: "",
            date: ""
          };
          this.props.getUpcomingInspection(postData, userData.token);
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
    var response = nextProps.InspectionReducer.upcomingInspectionList;

    if (response !== undefined) {
      if (response.code === Strings.STATUS_OK) {
        this.setState({
          acceptedContactList: response.data
        });
      } else {
        alert(response.message);
      }
    } else {
      //alert(Strings.SERVER_ERROR);
    }
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
        ) : this.state.acceptedContactList.length ? (
          <View style={{ flex: 1 }}>
            <FlatList
              style={{ marginTop: 20 }}
              data={this.state.acceptedContactList}
              numColumns={1}
              extraData={this.state.refresh}
              renderItem={({ item, index }) => this.renderList(item, index)}
            />

            <TouchableOpacity
              onPress={() => {
                console.log("Click");
                this.showModal();
              }}
              style={{
                borderWidth: 1,
                borderColor: "rgba(0,0,0,0.2)",
                alignItems: "center",
                justifyContent: "center",
                width: 50,
                position: "absolute",
                top: DEVICE_HEIGHT / 1.4,
                bottom: 10,
                right: 10,
                height: 50,
                backgroundColor: "#fff",
                borderRadius: 100
              }}
            >
              <Icon
                name={"filter"}
                type="font-awesome"
                size={30}
                color="#01a699"
              />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={AcceptScreenStyle.emptyListStyle}>
            <Text style={AcceptScreenStyle.emptyMessageStyle}>
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
        {this.renderModal()}
      </View>
    );
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
        style={AcceptScreenStyle.updateForm}
      >
        <View style={{ flex: 2, flexDirection: "row" }}>
          <TouchableOpacity
            style={{ flex: 2, flexDirection: "row" }}
            onPress={() =>
              Actions.propertyDetailScreen({
                propertyID: item.propertyData._id
              })
            }
          >
            <Avatar
              rounded
              medium
              source={
                item.inspectionData.created_by.profile_pic !== "noUser.jpg"
                  ? {
                      uri:
                        API.PROFILE_PIC_URL +
                        item.inspectionData.created_by.profile_pic
                    }
                  : require("../../../Assets/user_profile_32.png")
              }
              containerStyle={AcceptScreenStyle.containerStyle}
              onPress={() => console.log("Works!")}
              activeOpacity={0.7}
            />
            <View
              style={{
                flex: 1,
                flexDirection: "column",
                margin: 10
              }}
            >
              <Text style={{ padding: 3 }}>
                <Text style={{ color: Colors.grey_900 }}>{"Seller : "}</Text>
                <Text style={{ color: Colors.grey_700 }}>
                  {item.inspectionData.created_by.firstname +
                    " " +
                    item.inspectionData.created_by.lastname}
                </Text>
              </Text>
              <Text style={{ padding: 3 }}>
                <Text style={{ color: Colors.grey_900 }}>{"Address : "}</Text>
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
              </Text> 
              <Text style={{ padding: 3 }}>
                <Text style={{ color: Colors.grey_900 }}>{"Address : "}</Text>
                <Text style={{ color: Colors.grey_700 }}>
                  {item.propertyData.address}
                </Text>
              </Text>*/}
              <Text style={{ padding: 3 }}>
                <Text style={{ color: Colors.grey_900 }}>{"Date : "}</Text>
                <Text style={{ color: Colors.grey_700 }}>
                  {moment(item.inspection_date).format(Strings.DATE_FORMAT_MM)}
                </Text>
              </Text>

              <Text style={{ padding: 3 }}>
                <Text style={{ color: Colors.grey_900 }}>{"Time : "}</Text>
                <Text style={{ color: Colors.grey_700 }}>
                  {item.book_from + " - " + item.book_to}
                </Text>
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={AcceptScreenStyle.cardContainer}>
          <TouchableHighlight
            onPress={() => {
              console.log("Clicked");
              this.showCancelBookAlert(item, index);
            }}
            style={{ flex: 1, justifyContent: "center" }}
          >
            <View style={AcceptScreenStyle.btnRemoveStyle}>
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
          </TouchableHighlight>
        </View>
      </CardView>
    );
  }

  showCancelBookAlert(item, index) {
    Alert.alert(
      Strings.APP_NAME,
      "Do you really want to cancel a scheduled inspection ?",
      [
        { text: "Yes", onPress: () => this._cancelBooking(item, index) },
        {
          text: "No",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        }
      ],
      { cancelable: false }
    );
  }

  async _cancelBooking(item, index) {
    this._changeLoadingState(true);
    var postData = {
      property_id: item._id
    };

    console.log("POST data >>>>" + JSON.stringify(postData));

    fetch(API.CANCEL_BOOKING_SLOT, {
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
        this._changeLoadingState(false);
        //this._changeLoadingState(false);
        console.log(error);
        alert(Strings.ALERT_SERVER_ERROR);
      });
  }

  _toggleModal() {
    console.log("In _toggleModal");
    this.setState({
      isModalVisible: !this.state.isModalVisible
    });
  }

  renderLeftFilterComponent() {
    return (
      <TouchableOpacity
        hitSlop={HeaderScreenStyle.touchableAreaStyle}
        onPress={() => console.log("")}
      >
        <Image source={require("../../../Assets/help.png")} />
      </TouchableOpacity>
    );
  }

  renderCenterFilterOne() {
    return (
      <View>
        <Text style={styles.titleTextStyle}>{"Filter Inspection"}</Text>
      </View>
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
          name="times-circle"
          type="font-awesome"
          size={24}
          color={Colors.COLOR_CUTTY_SHARK}
          onPress={() => this._toggleModal()}
        />
      </TouchableOpacity>
    );
  }

  renderModal() {
    let datesWhitelist = [
      {
        start: moment(0),
        end: moment().add(28, "days") // total 4 days enabled
      }
    ];
    //let datesBlacklist = [ moment.add(1, 'days') ]; // 1 day disabled
    let datesBlacklist = [
      {
        start: moment(0), // the "beginning of time", in Unix time
        end: moment().subtract(1, "day")
      }
    ];

    return (
      <Modal
        style={{ backgroundColor: "#FFF", height: 200 }}
        isVisible={this.state.isModalVisible}
        onBackdropPress={() => this.setState({ isVisible: false })}
      >
        <View style={{ flex: 1, margin: 10, height: 200 }}>
          <View style={styles.header}>
            <Header
              backgroundColor={"#fff"}
              leftComponent={this.renderLeftFilterComponent()}
              centerComponent={this.renderCenterFilterOne()}
              rightComponent={this.renderRightFilterOne()}
            />
          </View>
          <View style={{ flex: 1, marginTop: 50 }}>
            <CalendarStrip
              ref={"myCalendarStrip"}
              daySelectionAnimation={{
                type: "background",
                duration: 300,
                highlightColor: Colors.CALENDAR_HIGHLIGHT
              }}
              style={{ height: 120, paddingTop: 20, paddingBottom: 10 }}
              calendarHeaderStyle={AcceptScreenStyle.calendarHeaderStyle}
              calendarColor={Colors.WHITE}
              dateNumberStyle={{ color: Colors.DATE_COLOR }}
              dateNameStyle={{ color: Colors.DATE_COLOR }}
              iconContainer={{ flex: 0.1 }}
              iconStyle={AcceptScreenStyle.calendarIconStyle}
              highlightDateNumberStyle={{ color: Colors.VIEW_HIGHLIGHT_COLOR }}
              highlightDateNameStyle={{ color: Colors.VIEW_HIGHLIGHT_COLOR }}
              selectedDate={this.state.selectedDate}
              onDateSelected={text => this._getTimeSlot(text)}
              datesBlacklist={datesBlacklist}
              datesWhitelist={datesWhitelist}
            />

            <View style={AcceptScreenStyle.subContainerStyle}>
              <Text
                style={{
                  fontSize: 15,
                  padding: 5,
                  fontWeight: "bold",
                  justifyContent: "center",
                  alignSelf: "center"
                }}
              >
                Postcode
              </Text>
              <TextInput
                placeholder=""
                keyboardType={"number-pad"}
                maxLength={4}
                placeholderTextColor={Colors.BACK_ARROW_COLOR}
                onChangeText={text => this.setState({ postalCode: text })}
                style={styles.textInputStyleClass}
                value={this.state.postalCode}
              />
            </View>
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={() => this.filterInspectionList()}
            >
              <LinearGradient
                colors={[Colors.START_COLOR, Colors.END_COLOR]}
                style={AcceptScreenStyle.roundedButtonStyleAppTheme}
              >
                <View style={{ flexDirection: "row", padding: 10 }}>
                  <Text
                    style={{
                      color: Colors.WHITE,
                      fontWeight: "400",
                      marginLeft: 5
                    }}
                  >
                    {"Submit"}
                  </Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }

  showModal() {
    this.setState({
      selectedDate: moment(),
      postalCode: ""
    });
    this._toggleModal();
  }

  _getTimeSlot(date) {
    mydate = moment(date).format(Strings.REQUESTED_TIME_SLOT_DATE_FORMAT);
    console.log("Get Time Slot From Calendar>>>>>>" + mydate);
    this.setState({
      selectedDate: mydate
    });
    console.log(
      "Get Time Slot From Moment>>>>>>" +
        JSON.stringify(this.state.selectedDate)
    );
  }

  async filterInspectionList() {
    this._toggleModal();
    this._changeLoadingState(true);
    var postData = {
      buyerId: this.state.userData._id,
      booking_type: Strings.INSPECTION_REQUEST_UPCOMING,
      page: 1,
      limit: 10,
      postal_code: this.state.postalCode,
      date: mydate
    };

    console.log("POST data >>>>" + JSON.stringify(postData));

    fetch(API.GET_INSPECTION_LIST, {
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
        console.log("Response Time Slot >>>> " + JSON.stringify(responseJson));

        if (responseJson !== undefined) {
          if (responseJson.code == Strings.STATUS_OK) {
            if (responseJson.data.length !== 0) {
              this.clearList();

              for (let i = 0; i < responseJson.data.length; i++) {
                this.state.acceptedContactList.push(responseJson.data[i]);
              }

              this._toogleList();
            } else {
              alert("Sorry ! The Seller you searched not found");
            }
          } else {
            console.log("Error >>> " + responseJson.message);
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

  clearList() {
    for (let i = 0; i < this.state.acceptedContactList.length; i++) {
      this.state.acceptedContactList.splice(i, 1);
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
  autocompleteContainer: {
    width: DEVICE_WIDTH / 1.2,
    left: 0,
    backgroundColor: "transparent",
    position: "absolute",
    right: 0,
    top: 0,
    zIndex: 1
  },
  emailItem: {
    borderBottomWidth: 0.5,
    borderColor: "rgba(0,0,0,0.3)",
    padding: 10
  },
  emailSubject: {
    color: "rgba(0,0,0,0.5)"
  },
  searchInput: {
    padding: 10,
    borderColor: "#CCC",
    borderWidth: 1
  },
  searchBarContainer: {
    justifyContent: "center",
    padding: 10,
    backgroundColor: "#f2f2f2",
    width: "100%"
  },
  searchBar: {
    borderRadius: 5,
    backgroundColor: "white",
    height: 38,
    fontSize: 15,
    width: "100%",
    paddingHorizontal: 10
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white"
  },
  defaultSeparator: {
    height: 1,
    width: "80%",
    alignSelf: "center",
    backgroundColor: "#f2f2f2"
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

    margin: 10,

    padding: 10,
    // Setting up TextInput height as 50 pixel.
    height: DEVICE_HEIGHT / 18,

    margin: 15,

    width: DEVICE_WIDTH / 5,

    color: Colors.BACK_ARROW_COLOR,
    // Set border width.
    borderWidth: 1,
    // Set border Hex Color Code Here.
    borderColor: Colors.COMMENT_TEXT_COLOR,
    // Set border Radius.
    borderRadius: 2,
    //Set background color of Text Input.
    backgroundColor: "transparent"
  },
  flatList: { height: "100%", width: "100%", backgroundColor: "transparent" }
});

function mapStateToProps(state) {
  return {
    InspectionReducer: state.InspectionReducer
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ getUpcomingInspection }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(AcceptScreen);
