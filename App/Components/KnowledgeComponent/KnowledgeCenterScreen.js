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
import KnowledgeCenterStyle from "./KnowledgeCenterStyle";
import HeaderScreen from "../CommonComponent/HeaderScreen";
import Strings from "../../Constants/Strings";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Actions } from "react-native-router-flux";
import { getKnowledgeBaseList } from "../../Action/ActionCreators";
import OfflineNotice from "../../Utils/OfflineNotice";
import Colors from "../../Constants/Colors";
import {
  BarIndicator,
} from 'react-native-indicators';
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import API from "../../Constants/APIUrls";
import HTML from "react-native-render-html";

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

class KnowledgeCenterScreen extends Component {


  constructor() {
    super();
    this.state = {
      isSpinnerVisible: false,
      knowledgeData: [],
     };
  }

  _changeLoadingState(loadingState) {
    this.setState({
      isSpinnerVisible: loadingState
    });
  }

  componentWillMount(){

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

          this.props.getKnowledgeBaseList(postData, userData.token);
          this._changeLoadingState(true);

        }
      })
      .done();

  }

  componentWillReceiveProps(nextProps){
    this._changeLoadingState(false);

    let knwoledgeResponse = nextProps.KnowledgeReducer.getKnowledgeRes;

    console.log("componentWillReceiveProps Knowledge >>>> "+JSON.stringify(knwoledgeResponse));

    if(knwoledgeResponse !== undefined && knwoledgeResponse!== null){

      if(knwoledgeResponse.code === Strings.STATUS_OK){
        this.setState({
          knowledgeData:knwoledgeResponse.data.data
        })
      }else{
        alert(knwoledgeResponse.message);
      }

    }else {
        alert(Strings.ALERT_SERVER_ERROR);
    }
  }

  renderList(data, index) {
    console.log("this is index number : " + index+" Data >>>> "+JSON.stringify(data));
    return (
      <CardView
        cardElevation={10}
        cornerRadius={5}
        style={KnowledgeCenterStyle.updateForm}
      >
        <View style={{ flex: 1 }}>
          <ImageBackground
            imageStyle={{ borderRadius: 2, overflow: "hidden" }}
            style={KnowledgeCenterStyle.imageStyle}
            source={{ uri: API.PIC_URL + data.filepath+"/"+data.filename }}
          />
          
        </View>
        <View style={KnowledgeCenterStyle.cardContainer}>
          <Text style={KnowledgeCenterStyle.titleStyle}>
            {data.title}
          </Text>
          {/* <Text style={KnowledgeCenterStyle.detailTextStyle}>{he.decode(data.shortDescription)}</Text> */}
          <HTML
            containerStyle={KnowledgeCenterStyle.detailTextStyle} 
            html={data.shortDescription} 

          />
          <View
            style={KnowledgeCenterStyle.btnContainer}
          >
            <TouchableOpacity
              onPress={() => Actions.knowledgeDetailScreen({id:data._id}) }
            >
              <Text
                style={KnowledgeCenterStyle.btnStyle}
              >
                {"View More"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </CardView>
    );
  }

  render() {
    return (
      <View style={{flex:1}}>
        <HeaderScreen title={Strings.KNOWLEDGE_SCREEN_TITLE} />
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
        ) : this.state.knowledgeData.length ? (
          <View style={{flex:1,marginTop:10}}>
              <CompleteFlatList
                highlightColor="#fff"
                pullToRefreshCallback={() => { }}
                data={this.state.knowledgeData}
                renderSeparator={null}
                renderItem={this.renderList.bind(this)}
                
              />
          </View>
        ) : (
              <View style={KnowledgeCenterStyle.emptyListStyle}>
                <Text style={KnowledgeCenterStyle.emptyMessageStyle}>
                  {this.state.isSpinnerVisible ? "" : Strings.KNOWLEDGE_CENTER_EMPTY_SLOT}
                </Text>
              </View>
            )}
      </View>
    );
  }
}
function mapStateToProps(state) {

  return {
    KnowledgeReducer: state.KnowledgeReducer
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ getKnowledgeBaseList }, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(KnowledgeCenterScreen);
