import React, { Component } from "react";
import {
  View,
  ImageBackground,
  Text,
  TouchableOpacity,
  Dimensions,
  AsyncStorage,
  Linking,
} from "react-native";
import CompleteFlatList from "react-native-complete-flatlist";
import CardView from "react-native-cardview";
import ServiceStyle from "./ServiceStyle";
import HeaderScreen from "../CommonComponent/HeaderScreen";
import Strings from "../../Constants/Strings";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Actions } from "react-native-router-flux";
import { getServiceList } from "../../Action/ActionCreators";
import OfflineNotice from "../../Utils/OfflineNotice";
import Colors from "../../Constants/Colors";
import {
  BarIndicator,
} from 'react-native-indicators';
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import API from "../../Constants/APIUrls";
import HTML from "react-native-render-html";
import { Avatar, Icon } from "react-native-elements";

var he = require("he");

const DEVICE_WIDTH = Dimensions.get("window").width;
const DEVICE_HEIGHT = Dimensions.get("window").height;
const data = [
  {
    title: "Real Estate - The Changing of the Guard",
    detail:
      "This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.",
    time: "8:10 PM",
    date: "1 Jan 2018"
  },
  {
    title: "Home",
    detail:
      "This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.",
    time: "9:14 PM",
    date: "1 Dec 2018"
  },
  {
    title: "Real Estate - The Changing of the Guard",
    detail:
      "This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.",
    time: "8:15 PM",
    date: "1 Jan 2018"
  },
  {
    title: "Real Estate - The Changing of the Guard",
    detail:
      "This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.",
    time: "8:10 PM",
    date: "1 Jan 2018"
  },
  {
    title: "Blog",
    detail:
      "This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.",
    time: "8:10 PM",
    date: "1 Jan 2018"
  },
  {
    title: "bejhbj",
    detail:
      "This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.",
    time: "8:10 PM",
    date: "1 Jan 2018"
  },
  {
    title: "Home",
    detail:
      "This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.",
    time: "8:10 PM",
    date: "1 Jan 2018"
  },
  {
    title: "Blog",
    detail:
      "This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.",
    time: "8:10 PM",
    date: "1 Jan 2018"
  },
  {
    title: "Home",
    detail:
      "This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.",
    time: "8:10 PM",
    date: "1 Jan 2018"
  }
];

class ServiceProviderScreen extends Component {


  constructor() {
    super();
    this.state = {
      isSpinnerVisible: false,
      serviceData: [],
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
            "page": 1,
            "count": 50
          }

          this.props.getServiceList(postData, userData.token);
          this._changeLoadingState(true);

        }
      })
      .done();

  }

  componentWillReceiveProps(nextProps) {
    this._changeLoadingState(false);

    let serviceResponse = nextProps.ServiceReducer.getServiceList;

    console.log("componentWillReceiveProps Knowledge >>>> " + JSON.stringify(serviceResponse));

    if (serviceResponse !== undefined && serviceResponse !== null) {
      if (serviceResponse.code === Strings.STATUS_OK) {
        this.setState({
          serviceData: serviceResponse.data.data
        });
      } else {
        alert(serviceResponse.message);
      }
    } else {
      alert(Strings.ALERT_SERVER_ERROR);
    }
  }

  renderList(data, index) {
    console.log("Pic url >>> " + API.PROFILE_PIC_URL + data.provider_pic)
    return (
      <CardView
        cardElevation={10}
        cornerRadius={5}
        style={ServiceStyle.updateForm}>
        <View style={{ flex: 2, flexDirection: "row" ,marginBottom:10 }}>

          <Avatar
            rounded
            medium
            source={
              { uri: "https://s3-ap-southeast-2.amazonaws.com/ptlocal/pdf/services/"+ data.provider_pic}
            }
            containerStyle={{ margin: 10}}
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
              <Text style={{ color: Colors.grey_900 }}>{" Name : "}</Text>
              <Text style={{ color: Colors.grey_700 }}>
                {data.fullname}
              </Text>
            </Text>

            <Text style={{ padding: 3 }}>
              <Text style={{ color: Colors.grey_900 }}>{" Service : "}</Text>
              <Text style={{ color: Colors.grey_700 }}>
                {data.service}
              </Text>
            </Text>
            
             
                <Text style={{ padding: 3 }}>
                  <Text style={{ color: Colors.grey_900 }}>{"Address : "}</Text>
                  <Text style={{ color: Colors.grey_700 }}>
                    {data.address}
                  </Text>
                </Text>
              
            
            <Text style={{ padding: 3 ,marginBottom:10}}>
                <Text style={{ color: Colors.grey_900 }}>
                  {"Phone Number : "}
                </Text>
                <Text style={{ color: Colors.grey_700 }}>
                  {data.phone_number}
                </Text>
              </Text>
          
          </View>

        </View>
      </CardView>
    );
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <HeaderScreen title={Strings.SERVICE_PROVIDER_SCREEN_TITLE} />
        <OfflineNotice />
        {/* <CompleteFlatList
        searchKey={["title", "detail", "time", "date"]}
        highlightColor="#fff"
        pullToRefreshCallback={() => {}}
        data={data}
        renderSeparator={null}
        renderItem={this.renderList.bind(this)}
      /> */}
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
        ) : this.state.serviceData.length ? (
          <View style={{ flex: 1, marginTop: 10 }}>
            <CompleteFlatList
              highlightColor="#fff"
              pullToRefreshCallback={() => {}}
              data={this.state.serviceData}
              renderSeparator={null}
              renderItem={this.renderList.bind(this)}
            />
          </View>
        ) : (
          <View style={ServiceStyle.emptyListStyle}>
            <Text style={ServiceStyle.emptyMessageStyle}>
              {this.state.isSpinnerVisible
                ? ""
                : Strings.SERVICE_PROVIDER_EMPTY_SLOT}
            </Text>
          </View>
        )}
      </View>
    );
  }
}
function mapStateToProps(state) {

  return {
    ServiceReducer: state.ServiceReducer
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ getServiceList }, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ServiceProviderScreen);
