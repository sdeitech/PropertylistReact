

import React from 'react';
import { View, Text, Alert, Modal, ImageBackground, Dimensions, ScrollView, Image,Platform, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, TouchableHighlight, AsyncStorage, FlatList, ActivityIndicator,KeyboardAvoidingView} from "react-native";


import { GiftedChat, Bubble, SystemMessage, Send} from 'react-native-gifted-chat';
import SocketIO from "../../Utils/SocketIO";
import { Icon,Header } from "react-native-elements";
import ImagePicker from "react-native-image-crop-picker";
import {
    ifIphoneX,
    getStatusBarHeight,
    getBottomSpace
} from "react-native-iphone-x-helper";
import Colors from "../../Constants/Colors";
import Strings from "../../Constants/Strings";
import { Actions } from "react-native-router-flux";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import API from "../../Constants/APIUrls";
import {
    BarIndicator,
} from 'react-native-indicators';
var moment = require("moment");
import { bindActionCreators } from "redux";

import { connect } from "react-redux";
import { getChatHistory } from "../../Action/ActionCreators";
import KeyboardSpacer from "react-native-keyboard-spacer";
import KeyboardManager from "react-native-keyboard-manager";
KeyboardManager.setEnable(false);

import ChatComponent from "./ChatComponent";

class ChatScreen extends React.Component {
    constructor(props) {
        super(props);
    }


    renderLeftOne() {
        return (
            <TouchableOpacity
                hitSlop={styles.touchableAreaStyle}
                onPress={() => Actions.pop()}
            >
                {/* <Image source={require("../../Assets/back_arrow.png")} /> */}
                <Icon name="ios-arrow-back" type="ionicon" color={Colors.WHITE} />
            </TouchableOpacity>
        );
    }

    renderCenterOne() {
        let sellerName = this.props.seller.firstname + " " + this.props.seller.lastname;
        return (
            <View>
                <Text style={styles.titleTextStyle}>
                    {sellerName}
                </Text>
            </View>
        );
    }

    renderRightOne() {
        return (
            <View></View>
        );
    }

    render() {
        return (
            
            <View style={{flex:1}}>
                <View style={styles.header}>
                    <Header
                        backgroundColor={Colors.COLOR_PRIMARY}
                        leftComponent={this.renderLeftOne()}
                        centerComponent={this.renderCenterOne()}

                    />
                </View>
              

                    <ChatComponent seller={this.props.seller} propertyID={this.props.propertyID}/> 
              
            </View>
          
            
        );
    }
}

const styles = StyleSheet.create({
    footerContainer: {
        marginTop: 5,
        marginLeft: 10,
        marginRight: 10,
        marginBottom: 10,
    },
    footerText: {
        fontSize: 14,
        color: '#aaa',
    },
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
    titleTextStyle: {
        color: Colors.WHITE,
        fontSize: 15,
        fontWeight: "bold"
    },
    titleTextStyleModal: {
        color: Colors.COLOR_CUTTY_SHARK,
        fontSize: 15,
        fontWeight: "bold"
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
    touchableAreaStyle: {
        top: 20, bottom: 20, left: 20, right: 20
    }
});

function mapStateToProps(state) {

    return {
        ChatHistoryReducer: state.ChatHistoryReducer
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ getChatHistory }, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ChatScreen);
