import React, { Component } from "react";
import {
  View,
  ImageBackground,
  Text,
  TouchableOpacity,
  Dimensions,
  AsyncStorage
} from "react-native";
import CardView from "react-native-cardview";
import HeaderScreen from "../CommonComponent/HeaderScreen";
import Strings from "../../Constants/Strings";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Actions } from "react-native-router-flux";
import { getKnowledgeDetail } from "../../Action/ActionCreators";
import OfflineNotice from "../../Utils/OfflineNotice";
import Colors from "../../Constants/Colors";
import {
  BarIndicator,
} from 'react-native-indicators';
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import API from "../../Constants/APIUrls";
import HTML from "react-native-render-html";
import { WebView } from "react-native";



const DEVICE_WIDTH = Dimensions.get("window").width;
const DEVICE_HEIGHT = Dimensions.get("window").height;


class DueDiligenceCheckListComponent extends Component {


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

    // AsyncStorage.getItem(Strings.KEY_USER_DATA)
    //   .then(value => {
    //     if (value) {
    //       var userData = JSON.parse(value);
    //       console.log("==== ID ===", userData);

    //       this.setState({ userData: userData });


    //       var postData = {
    //         "knowledgeID": this.props.id,
    //       }

    //      // this.props.getKnowledgeDetail(postData, userData.token);
    //       // this._changeLoadingState(true);

    //     }
    //   })
    //   .done();

  }

  

  

  render() {
    return (
      <View style={{flex:1}}>
        <HeaderScreen title={Strings.LABEL_DUE_DILIGENCE_REPORT} />
        <OfflineNotice />
        <View style={{ flex: 1 }}>
          <WebView
            source={{ uri: "https://www.consumer.vic.gov.au/housing/buying-and-selling-property/checklists/due-diligence"}}
            style={{ marginTop: 0 }}
            scalesPageToFit
            javaScriptEnabled
            domStorageEnabled
            startInLoadingState
            mixedContentMode="always"
          />

        </View>
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
  return bindActionCreators({ getKnowledgeDetail }, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DueDiligenceCheckListComponent);
