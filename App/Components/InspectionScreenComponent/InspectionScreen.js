import React, { Component } from "react";
import {
  View,
  SafeAreaView,
  Text,
  ImageBackground,
  Dimensions,
  Image,
  Alert,
  FlatList,
  TouchableOpacity,
  AsyncStorage
} from "react-native";
import CardView from "react-native-cardview";
import CalendarStrip from "react-native-calendar-strip";
import LinearGradient from "react-native-linear-gradient";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import InspectionScreenStyle from "./InspectionScreenStyle";
import Colors from "../../Constants/Colors";

import Strings from "../../Constants/Strings";
import HeaderScreen from "../CommonComponent/HeaderScreen";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { bookInspectionTimeSlot } from "../../Action/ActionCreators";

import { BarIndicator } from "react-native-indicators";

import { showErrorMessage } from "../../Utils/Validations";
import { Actions } from "react-native-router-flux";
import API from "../../Constants/APIUrls";

var moment = require("moment-timezone");
//moment.tz("America/New_York");

const DEVICE_WIDTH = Dimensions.get("window").width;
const DEVICE_HEIGHT = Dimensions.get("window").height;
const _format = "YYYY-MM-DD";

const numColumns = (DEVICE_WIDTH - 15) / 2;
var mydate = moment().format(Strings.REQUESTED_TIME_SLOT_DATE_FORMAT);

class InspectionScreen extends Component {
  constructor() {
    super();
    this.state = {
      isSpinnerVisible: false,
      isModalVisible: false,
      inspectionID: "",
      timeSlotData: [],
      refreshList: false,
      weekStart: moment(),
      selectedDate: mydate,
      selectedTimeSlot: "",
      propertyData: "",
      propertyImage: ""
    };
  }

  componentWillMount() {
    console.log(
      "Selected Date >>>>>>" +
        moment(this.state.selectedDate).format(Strings.DATE_FORMAT_MM)
    );

    //console.log("PropertyData >>>>>>" + JSON.stringify(this.props.propertyData.propertyInfo));
    // console.log("Property Details >>>>>>>" + JSON.stringify(this.props.propertyData));

    //this._getTimeSlot(currentDate);

    let imgUrl = "";
    if (this.props.propertyData.propertyMediaInfo !== "") {
      imgUrl = this.props.propertyData.propertyMediaInfo;
    } else {
      imgUrl = API.DEFAULT_IMAGE_URL + Strings.PROPERTY_DEFAULT_IMAGE;
    }

    console.log("Image URL  >>>>" + imgUrl);
    this.setState({
      propertyData: this.props.propertyData,
      propertyImage: imgUrl
    });
    this._getUserData();
  }

  componentWillReceiveProps(nextProps) {
    this._changeLoadingState(false);

    console.log(
      "Inspection Screen componentWillReceiveProps>> " +
        JSON.stringify(nextProps.InspectionReducer.inspectionBookRes)
    );

    let responseData = nextProps.InspectionReducer.inspectionBookRes;

    if (responseData != undefined) {
      if (responseData.code === Strings.STATUS_OK) {
        Alert.alert(
          Strings.APP_NAME,
          responseData.message,
          [
            {
              text: "OK",
              onPress: () => Actions.dashboardScreen({ type: "reset" })
            }
          ],
          { cancelable: false }
        );
      } else {
        alert(responseData.message);
      }
    } else {
      alert(Strings.SERVER_ERROR);
    }
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

  _getTimeSlot(date) {
    mydate = moment(date).format(Strings.REQUESTED_TIME_SLOT_DATE_FORMAT);

    if (this.state.timeSlotData.length !== 0) {
      for (var i = this.state.timeSlotData.length - 1; i >= 0; i--) {
        this.state.timeSlotData.splice(i, 1);
      }
      this._toogleList();
    }

    console.log("Get Time Slot From Calendar>>>>>>" + mydate);
    this.setState({
      selectedDate: mydate,
      selectedTimeSlot: ""
    });

    console.log(
      "Get Time Slot From Moment>>>>>>" +
        JSON.stringify(this.state.selectedDate)
    );

    this.getInspectionTimeSlots();

    // let data=[];
    // var time_start = "09:00 AM";

    // if (moment(date).format(Strings.DATE_FORMAT) == moment(currentDate).format(Strings.DATE_FORMAT)) {
    //     time_start = currentTime
    // }

    // var time_end = "9:00 PM";
    // var timeAndDateStart = moment(moment(date).format('MM/DD/YYYY') + ' ' + time_start);
    // var timeAndDateEnd = moment(moment(date).format('MM/DD/YYYY') + ' ' + time_end);
    // var duration = moment.duration(timeAndDateEnd.diff(timeAndDateStart));
    // duration = duration.asHours();

    // if (duration > 0) {
    //     for (var i = 1; i <= duration; i++) {
    //         var slotStart = moment(timeAndDateStart).add(i, 'hours')
    //         data.push(moment(slotStart).format('hh:mm a'))
    //     }
    // }

    // if(this.state.timeSlotData.length!==0){
    //   for (var i = this.state.timeSlotData.length - 1; i >= 0; i--) {
    //     this.state.timeSlotData.splice(i, 1);
    //   }
    // }

    // this.setState({
    //   timeSlotData:data,
    //   selectedTimeSlot:"",
    // })

    // this._toogleList();
  }

  sendInspectionRequest() {
    console.log(
      "sendInspectionRequest >>>" + JSON.stringify(this.state.selectedTimeSlot)
    );
    if (this.state.selectedTimeSlot === "") {
      showErrorMessage(Strings.ERROR_TIME_SLOT);
    } else {
      var postData = {
        inspection_id: this.state.inspectionID,
        inspection_date: mydate,
        buyer_id: this.state.userData._id,
        property_id: this.props.propertyData._id,
        book_from: this.state.selectedTimeSlot.from_time,
        book_to: this.state.selectedTimeSlot.to_time
      };

      this._changeLoadingState(true);
      console.log(
        "sendInspectionRequest PostData >>> " + JSON.stringify(postData)
      );
      this.props.bookInspectionTimeSlot(postData, this.state.userData.token);
    }
  }

  _getUserData() {
    AsyncStorage.getItem(Strings.KEY_USER_DATA)
      .then(value => {
        if (value) {
          var userData = JSON.parse(value);
          //console.log("==== UserData ===", JSON.stringify(userData));

          this.setState({
            userData: userData
          });
          // this._changeLoadingState(true);
          // var postData = {
          //   "propertyId": this.state.propertyData.propertyInfo._id,
          //   "senderId": this.state.userData._id,
          //   "receiverId": this.state.propertyData.userInfo._id,
          //   "inspectionDate": this.state.selectedDate,
          //   "inspectionTime": this.state.selectedTimeSlot,
          //   "userType": Strings.USER_TYPE_BUYER,
          //   "inspectionBy": this.state.userData._id,
          //   "message": ""
          // };

          // console.log("PostData >>>"+JSON.stringify(postData));
          //  this.props.sendInspectionRequest(postData, userData.token);

          this.getInspectionTimeSlots();
        }
      })
      .done();
  }

  getMomentFromTimeString(str) {
    var t = moment(str, "HH:mm A");
    // Now t is a moment.js object of today's date at the time given in str

    if (t.get("hour") < 22)
      // If it's before 9 pm
      t.add("d", 1); // Add 1 day, so that t is tomorrow's date at the same time

    return t;
  }

  async getInspectionTimeSlots() {
    //this._changeLoadingState(true);

    this._changeLoadingState(true);
    var postData = {
      property_id: this.props.propertyData._id,
      date: mydate,
      buyerId: this.state.userData._id
    };

    console.log("POST data >>>>" + JSON.stringify(postData));

    fetch(API.GET_INSPECTION_TIME_SLOTS, {
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
            if (responseJson.data.length != 0) {
              this.setState({
                inspectionID: responseJson.data[0]._id,
                timeSlotData: responseJson.data[0].time_slots
              });
            }
            this._toogleList();
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

  render() {
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
      <SafeAreaView style={InspectionScreenStyle.containerStyle}>
        <HeaderScreen title={Strings.INSPECTION_SCREEN_TITLE} />
        <ImageBackground
          style={InspectionScreenStyle.bgImageStyle}
          // source={{ uri: "https://picsum.photos/200/300/?random" }}
          source={{ uri: this.state.propertyImage }}
        >
          <KeyboardAwareScrollView
            resetScrollToCoords={{ x: 0, y: 0 }}
            scrollEnabled={true}
            keyboardShouldPersistTaps="handled"
            enableAutoAutomaticScroll={true}
            enableOnAndroid={true}
          >
            <View style={InspectionScreenStyle.containerStyle}>
              <CardView
                cardElevation={10}
                cornerRadius={10}
                style={InspectionScreenStyle.updateForm}
              >
                <CalendarStrip
                  ref={"myCalendarStrip"}
                  calendarAnimation={{ type: "sequence", duration: 60 }}
                  daySelectionAnimation={{
                    type: "background",
                    duration: 300,
                    highlightColor: Colors.CALENDAR_HIGHLIGHT
                  }}
                  style={{ height: 120, paddingTop: 20, paddingBottom: 10 }}
                  calendarHeaderStyle={
                    InspectionScreenStyle.calendarHeaderStyle
                  }
                  calendarColor={Colors.WHITE}
                  dateNumberStyle={{ color: Colors.DATE_COLOR }}
                  dateNameStyle={{ color: Colors.DATE_COLOR }}
                  iconContainer={{ flex: 0.1 }}
                  iconStyle={InspectionScreenStyle.calendarIconStyle}
                  highlightDateNumberStyle={{
                    color: Colors.VIEW_HIGHLIGHT_COLOR
                  }}
                  highlightDateNameStyle={{
                    color: Colors.VIEW_HIGHLIGHT_COLOR
                  }}
                  selectedDate={this.state.selectedDate}
                  onDateSelected={text => this._getTimeSlot(text)}
                  onWeekChanged={text =>
                    console.log("On Week Change >>> " + JSON.stringify(text))
                  }
                  getPreviousWeek={text =>
                    console.log("getPreviousWeek >>> " + JSON.stringify(text))
                  }
                  datesBlacklist={datesBlacklist}
                  datesWhitelist={datesWhitelist}
                />

                <View style={{ height: DEVICE_HEIGHT / 2.6 }}>
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

                  {this.state.timeSlotData.length != 0 ? (
                    <View>
                      <FlatList
                        style={{ flexGrow: 1 }}
                        data={this.state.timeSlotData}
                        extraData={this.state.refresh}
                        horizontal={false}
                        numColumns={3}
                        renderItem={({ item, index }) =>
                          this._renderItem(item, index)
                        }
                      />
                    </View>
                  ) : (
                    <View style={InspectionScreenStyle.emptyListStyle}>
                      <Text style={InspectionScreenStyle.emptyMessageStyle}>
                        {this.state.isSpinnerVisible
                          ? ""
                          : Strings.INSPECTION_TIME_SLOT_EMPTY}
                      </Text>
                    </View>
                  )}
                </View>
                {/* <View style={{ marginTop: 20 }}>
                  <Text
                    style={{ fontSize: 16, marginLeft: 20, marginBottom: 20 }}>
                    {this.state.propertyData.address}
                  </Text>

                  {this.state.landSize ? (<View style={{ flexDirection: "row", }}>
                    <View
                      style={{
                        flex: 1,
                        flexDirection: "row",
                        justifyContent: "space-evenly",
                        alignItems: "center"
                      }}>

                      <View style={{ flex: 1, flexDirection: "row", justifyContent: "center" }}>
                        <Image source={require("../../Assets/cost_1.png")} style={{ margin: 5 }} />
                        <Text style={{ margin: 3 }}>{"$ " + this.state.propertyData.price}</Text>
                      </View>

                      <View style={{ flex: 1, flexDirection: "row", justifyContent: "center" }}>
                        <Image source={require("../../Assets/area_3.png")} style={{ margin: 5 }} />
                        <Text style={{ margin: 2 }}>{this.state.propertyData.landSize + " sqm"}</Text>
                      </View>

                    </View>

                  </View>):null}
               
                </SafeAreaView> */}
              </CardView>
            </View>
          </KeyboardAwareScrollView>

          {this.state.selectedTimeSlot ? (
            <View style={{ alignItems: "center" }}>
              <TouchableOpacity
                onPress={() => this.sendInspectionRequest()}
                activeOpacity={0.5}
              >
                <LinearGradient
                  colors={[Colors.START_COLOR, Colors.END_COLOR]}
                  style={InspectionScreenStyle.roundedButtonStyleAppTheme}
                >
                  <Text style={{ color: "white", fontSize: 16 }}>
                    {" "}
                    {Strings.BUTTON_TEXT_REQUEST_INSPECTION}{" "}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          ) : null}
        </ImageBackground>
      </SafeAreaView>
    );
  }

  _renderItem(item, index) {
    //  console.log("Index >>"+index+" Item >>>"+item);

    return (
      <View
        style={{
          flexDirection: "column",
          justifyContent: "space-evenly",
          marginRight: 5,

          marginTop: 5,
          marginBottom: 5
        }}
      >
        {console.log(
          "Selected Time >>>>" + JSON.stringify(this.state.selectedTimeSlot)
        )}
        <TouchableOpacity
          onPress={() => this.setState({ selectedTimeSlot: item })}
          style={
            this.state.selectedTimeSlot === item
              ? InspectionScreenStyle.btnStyleSelected
              : InspectionScreenStyle.btnStyle
          }
        >
          <Text
            style={{
              color:
                this.state.selectedTimeSlot === item
                  ? Colors.WHITE
                  : Colors.BLACK,
              fontWeight:
                this.state.selectedTimeSlot === item ? "bold" : "normal"
            }}
          >
            {item.from_time}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    InspectionReducer: state.InspectionReducer
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ bookInspectionTimeSlot }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(InspectionScreen);
