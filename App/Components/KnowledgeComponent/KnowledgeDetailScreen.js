import React, { Component } from "react";
import {
  View,
  ImageBackground,
  Text,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  AsyncStorage
} from "react-native";
import CardView from "react-native-cardview";
import KnowledgeCenterStyle from "./KnowledgeCenterStyle";
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


class KnowledgeDetailScreen extends Component {


  constructor() {
    super();
    this.state = {
      isSpinnerVisible: false,
      knowledgeData: "",
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
            "id": this.props.id,
          }

       
          this.props.getKnowledgeDetail(postData, userData.token);
          this._changeLoadingState(true);
        }
      })
      .done();

  }

  componentWillReceiveProps(nextProps){
    this._changeLoadingState(false);

    let knwoledgeResponse = nextProps.KnowledgeReducer.getKnowledgeDetail;

    console.log("componentWillReceiveProps getKnowledgeDetail >>>> "+JSON.stringify(knwoledgeResponse));

    if(knwoledgeResponse !== undefined && knwoledgeResponse!== null){

      if(knwoledgeResponse.code === Strings.STATUS_OK){
        this.setState({
          knowledgeData:knwoledgeResponse.data
        })
      }else{
        alert(knwoledgeResponse.message);
      }

    }else {
        alert(Strings.ALERT_SERVER_ERROR);
    }
  }

  

  render() {
    var data = this.state.knowledgeData;
    return (
      <SafeAreaView style={{ flex: 1 }}> 
        <HeaderScreen title={Strings.KNOWLEDGE_DETAIL_TITLE} />
        <OfflineNotice />
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
          ) : (
              <KeyboardAwareScrollView
                resetScrollToCoords={{ x: 0, y: 0 }}
                scrollEnabled={true}
                keyboardShouldPersistTaps="handled"
                enableAutoAutomaticScroll={true}
                enableOnAndroid={true}>
                  <View style={{ flex: 1, marginTop: 10 }}>
                  
                    {/* <View style={{ flex: 1 }}>
                      <ImageBackground
                        imageStyle={{ borderRadius: 2, overflow: "hidden" }}
                        style={KnowledgeCenterStyle.imageStyle}
                        source={{ uri: API.PIC_URL + data.filepath + "/" + data.filename }}
                      />

                    </View> */}
                    <View style={KnowledgeCenterStyle.cardContainer}>
                      {/* <Text style={KnowledgeCenterStyle.titleStyle}>
                        {data.title}
                      </Text> */}
                      {/* <Text style={KnowledgeCenterStyle.detailTextStyle}>{he.decode(data.shortDescription)}</Text> */}
                      {/* <View style={{margin:2}}>
                        <HTML
                          containerStyle={KnowledgeCenterStyle.detailTextStyle}
                          html={data.shortDescription}

                        />

                      </View> */}

                      <View style={{ margin: 2 }}>
                        <HTML
                          containerStyle={KnowledgeCenterStyle.detailTextStyle}
                          html={data.description}

                        />
                      </View>            
                     
                      
                    </View>
                  
                  </View>
            </KeyboardAwareScrollView>
          )}

        </View>
      </SafeAreaView>
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
)(KnowledgeDetailScreen);
