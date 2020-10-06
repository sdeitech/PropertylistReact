import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
    View,
    Image,
    ImageBackground,
    StyleSheet,
    FlatList,
    Text,
    TouchableOpacity,
    Alert,
    Platform,
    TextInput,
    ScrollView,
    AsyncStorage,
    Dimensions,
    Switch,

} from 'react-native';

import {
  getSavedPropertyList,
} from "../../Action/ActionCreators";


import { bindActionCreators } from "redux";
import { Actions } from 'react-native-router-flux';
import Colors from '../../Constants/Colors';
import Strings from '../../Constants/Strings';
import LinearGradient from "react-native-linear-gradient";
import {validateEmail,showErrorMessage} from "../../Utils/Validations"
import HeaderScreen from "../CommonComponent/HeaderScreen";
import {
  ifIphoneX,
  getStatusBarHeight,
  getBottomSpace
} from "react-native-iphone-x-helper";

import {
    BarIndicator,
} from 'react-native-indicators';
import OfflineNotice from "../../Utils/OfflineNotice";
import STRINGS from '../../Constants/Strings';
const DEVICE_WIDTH = Dimensions.get("window").width;
const DEVICE_HEIGHT = Dimensions.get("window").height;
import HeaderScreenStyle from "../CommonComponent/HeaderStyle";
import CardView from "react-native-cardview";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import API from "../../Constants/APIUrls";
import { WebView } from 'react-native';



class TermsAndPrivacy extends Component {
  constructor() {
    super();
    this.state = {
      checked: true,
      isSpinnerVisible: false,
     
    };
  }

   _changeLoadingState(loadingState) {
    this.setState({
      isSpinnerVisible: loadingState
    });
  }


  componentWillMount() {

    console.log("Props >>>>"+JSON.stringify(this.props.url))
  
  }

  render() {
    return <View style={{ flex: 1 }}>
        <OfflineNotice />
        <HeaderScreen title={this.props.title} />
          <View style={{ flex: 1 }}>
              <WebView
                source={{ uri: this.props.url }}
                style={{ marginTop: 0 }}
                scalesPageToFit
                javaScriptEnabled
                domStorageEnabled
                startInLoadingState
                mixedContentMode="always"
                onNavigationStateChange={(navEvent)=> console.log("On Navigation >> "+JSON.stringify(navEvent.jsEvaluationValue))}
                onMessage={(event)=> console.log("On Message >>> "+JSON.stringify(event.nativeEvent.data))}
              />
                
          </View>
      </View>;
  }

  
  
}



const styles = StyleSheet.create({
    container: {
        padding: 5
    },
    field: {
        color: '#d9d9d9',
        flex: 2,
        fontSize: 13,
        fontWeight: '500',
        padding: 3,
        borderRadius: 3,
        borderWidth: 1,
        borderColor: '#d9d9d9',
        height: 40,
        marginVertical: 5
    },
    button: {
        flex: 2,
        padding: 3,
        borderRadius: 3,
        borderWidth: 1,
        backgroundColor: '#d9d9d9',
        height: 40,
        marginVertical: 10
    },
    buttonLabel: {
        color: '#ffffff',
        fontSize: 13,
        fontWeight: '500'
    },
  header: {
    ...ifIphoneX({
      paddingTop: getStatusBarHeight()
    }, {
        paddingTop: 0
      })
  },
});


function mapStateToProps(state) {

    return {
        PropertyListingReducer: state.PropertyListingReducer
    }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ getSavedPropertyList }, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TermsAndPrivacy);


