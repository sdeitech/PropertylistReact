import React, { Component, PureComponent} from "react";
import {
  View,
  ImageBackground,
  Text,
  Image,
  TouchableOpacity,
  AsyncStorage,
  TextInput,
  FlatList,
  Alert,
  StyleSheet,
  DatePickerIOS,
  DatePickerAndroid,
  Platform,
  Dimensions
} from "react-native";
import { Avatar, Icon, Header, SearchBar } from "react-native-elements";
import CompleteFlatList from "react-native-complete-flatlist";
import CardView from "react-native-cardview";
import NotificationScreenStyle from "./NotificationScreenStyle";
import Colors from "../../Constants/Colors";
import { getNotificationList } from "../../Action/ActionCreators";
import Strings from "../../Constants/Strings";
import { bindActionCreators } from "redux";
import { Actions } from "react-native-router-flux";
import { connect } from "react-redux";
import {
  BarIndicator,
} from 'react-native-indicators';
var moment = require("moment");
import API from "../../Constants/APIUrls";

import {
  ifIphoneX,
  getStatusBarHeight,
  getBottomSpace
} from "react-native-iphone-x-helper";
import HeaderScreen from "../CommonComponent/HeaderScreen";

var moment = require("moment-timezone");
moment.tz("America/New_York");




const DEVICE_WIDTH = Dimensions.get("window").width;
const DEVICE_HEIGHT = Dimensions.get("window").height;

var mydate = moment().format(Strings.REQUESTED_TIME_SLOT_DATE_FORMAT);

class NotificationList extends Component {
  constructor() {
    super();
    this.state = {
      isSpinnerVisible: false,
      isModalVisible: false,
      userData: "",
      notificationList: [],
      refreshList: false,
      weekStart: moment(),
      selectedDate: mydate,
      postalCode: "",
      selectedTimeSlot: "",
      searchedDate:"",
      chosenDate: moment()
    };

    this.setDate = this.setDate.bind(this);
  }

  setDate(newDate) {
    this.setState({ chosenDate: newDate, searchedDate:newDate})
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
          this.getNotificationList("");
        }
      })
      .done();
  }

  getNotificationList(searchDate){

    this._changeLoadingState(true);

   
    var postData = {
      buyerId: this.state.userData._id,
      page: 0,
      limit: 10,
      search_string: searchDate,
    };
    this.props.getNotificationList(postData, this.state.userData.token);
  }

  componentWillReceiveProps(nextProps) {
    console.log(
      "componentWillReceiveProps >>>>" +
      JSON.stringify(nextProps.NotificationListReducer)
    );

    let notificationListResponse = nextProps.NotificationListReducer.getNotificationList;
    this._changeLoadingState(false);
  

    if (notificationListResponse !== undefined) {
      if (notificationListResponse.code === Strings.STATUS_OK) {
        this.setState({
          notificationList: notificationListResponse.data.data
        });
      } else {
        alert(notificationListResponse.message);
      }
    } else {
      alert(Strings.SERVER_ERROR);
    }
  }

  render() {
    const { navigation } = this.props;
    return (
      <View style={{ flex: 1 }}>
        <HeaderScreen title={Strings.NOTIFICATION_LIST_SCREEN_TITLE} />
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
        ) : this.state.notificationList.length ? (
            <View style={{ flex: 1 }}>
            <FlatList
              data={this.state.notificationList}
              numColumns={1}
              extraData={this.state.refresh}
              renderItem={({ item, index }) => this.renderList(item, index)}
            />

           
          </View>
        ) : (
              <View style={NotificationScreenStyle.emptyListStyle}>
                <Text style={NotificationScreenStyle.emptyMessageStyle}>
                  {this.state.isSpinnerVisible ? "" : Strings.NOTIFICATION_LIST_EMPTY}
            </Text>
          </View>
        )}
      
        
      </View>
      
    );
  }

  openDatePicker(){
    return(
      <View style={styles.container}>
        {Platform.OS ==="ios"?(
          <DatePickerIOS
            minDate={new Date()}
            date={this.state.chosenDate}
            onDateChange={this.setDate}
          />
        ):(
            <DatePickerAndroid
              minDate={new Date()}
              date={this.state.chosenDate}
              onDateChange={this.setDate}
            />
        )}
        
      </View>
    );

  }

  renderList(item, index) {
    console.log("this is index number : " + JSON.stringify(item));
    return (
    <CardView cardElevation={15} cornerRadius={5} style={NotificationScreenStyle.updateForm}>
      <View style={{ flex: 1, flexDirection: "row",marginBottom:10 }}>
          <Avatar
            rounded
            medium
            source={
                 require("../../Assets/user_profile_32.png")
            }
            containerStyle={NotificationScreenStyle.containerStyle}
            onPress={() => console.log("Works!")}
            activeOpacity={0.7}
          />
          <View
            style={{
              flex: 1,
              flexDirection: "column",
              marginTop: 10

            }}
          >
            <Text style={{ padding: 3 }}>
              <Text style={{ color: Colors.grey_900 }}>{"Notification For : "}</Text>
              <Text style={{ color: Colors.grey_700 }}>
                {item.notificationFor}
              </Text>
            </Text>
            <Text style={{ padding: 3 }}>
              <Text style={{ color: Colors.grey_900 }}>{"Message : "}</Text>
              <Text style={{ color: Colors.grey_700 }}>
                {item.notificationMsg}
              </Text>
            </Text>
            <Text style={{ padding: 3 }}>
              <Text style={{ color: Colors.grey_900 }}>
                {"Date : "}
              </Text>
              <Text style={{ color: Colors.grey_700 }}>
                {moment(item.createdAt).format(Strings.DATE_FORMAT_MM)}
              </Text>
            </Text>
           
          </View>
       
      </View>
     
    </CardView>
    );
    
  }

  showCancelBookAlert(item, index){

    Alert.alert(
      Strings.APP_NAME,
      'Do you really want to cancel an scheduled inspection?',
      [
        { text: 'Yes,Cancel It', onPress: () => this._cancelBooking(item, index) },
        { text: 'No not now', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
      ],
      { cancelable: false }
    )
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
            alert(responseJson.message)
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
    for (let i = 0; i < this.state.notificationList.length; i++) {
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
    ...ifIphoneX({
      paddingTop: getStatusBarHeight()
    }, {
        paddingTop: 0
      })
  },
  textInputStyleClass: {
    // Setting up Hint Align center.
    flex:0.6,
    textAlign: "left",
    padding: 10,
    // Setting up TextInput height as 50 pixel.
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
    NotificationListReducer: state.NotificationListReducer
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ getNotificationList }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(NotificationList);

