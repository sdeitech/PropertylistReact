

import React from 'react';
import { View, SafeAreaView, Text, Alert, Modal, Keyboard, ImageBackground, Dimensions, ScrollView, Image, Platform, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, TouchableHighlight, AsyncStorage, FlatList, ActivityIndicator, KeyboardAvoidingView, PermissionsAndroid,} from "react-native";


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

import { DocumentPicker } from 'react-native-document-picker';
import { DocumentPickerUtil } from "react-native-document-picker";
import CustomView from "./CustomView";
// require the module

const imgArray = ['jpg', 'JPG', 'png', 'PNG', 'jpeg', 'JPEG'];
const docArray = ["doc", "docx", "xls", "xlsx", "ppt", "pptx", "pdf", "txt", "rtf"];

var fileData="";
var buyerID="";

if (Platform.OS === 'ios') {
KeyboardManager.setEnable(false);
}
class ChatComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            messages: [],
            loadEarlier: true,
            typingText: null,
            isLoadingEarlier: false,
            modalVisible: false,
            userData: "",
            isImgSpinnerVisible: false,

        };
        this._images = [];
        this._isMounted = false;
        this.onSend = this.onSend.bind(this);
        this.onReceive = this.onReceive.bind(this);
        this.renderCustomActions = this.renderCustomActions.bind(this);
        this.renderBubble = this.renderBubble.bind(this);
        this.renderSystemMessage = this.renderSystemMessage.bind(this);
        this.renderFooter = this.renderFooter.bind(this);
        this.onLoadEarlier = this.onLoadEarlier.bind(this);

        this._isAlright = null;
        this.socket = SocketIO.initialize();
        //console.log("Intialize Socket "+JSON.stringify(this.socket))
        
        
        
        // });
    }

   


    setModalVisible(visible = false) {
        this.setState({ modalVisible: visible });
    }


    componentWillMount() {
        console.log("In componentWillMount >>>>" + JSON.stringify(this.props.seller));
        this._isMounted = true;
        this._getUserData();
        this.socket.on("connect", () => {
            console.info("SocketIO Connected >>> " + this.socket);
            
            this.socket.emit("getConnected", { buyerID: this.state.userData._id, contactID: this.props.contactID });
        });

       
          // socketID: this.socket.id,

          // Any additional custom parameters are passed through
       
       
        // var requestChatHistory = {
        //     senderID: this.state.userData._id,
        //     receiverID: this.props.seller._id,
        //     address: this.props.propertyID.address,
        //     propertyID: this.props.propertyID._id
        //     // Any additional custom parameters are passed through
        // }

        // this.socket.emit("sendBuyerChatHistoryRequest", requestChatHistory);
        if (Platform.OS === 'ios') {
            this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow',
                this._keyboardDidShow);
            this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide',
                this._keyboardDidHide);
        }
    }

    _keyboardDidShow = (e) => {
        let keyboardHeight = e.endCoordinates.height;
        this.setState({
            minInputToolbarHeight: keyboardHeight + 45,
        });
    }

    _keyboardDidHide = () => {
        this.setState({
            minInputToolbarHeight: 45,
        });
    }

    

    componentDidMount() {
      

        // Event called when 'someEvent' it emitted by server
        this.socket.on("sendMessage", data => {
            console.log("on sendMessage >>> ", JSON.stringify(data));

            if (data.contactId !=undefined) {
                if(data.contactId === this.props.contactID){
                    this.onReceive(data);    
                }
            }else{
                this.onReceive(data);
            }
            //this.onReceive(data);    
            

        });

    }


  


    _getUserData() {
        AsyncStorage.getItem(Strings.KEY_USER_DATA)
            .then(value => {
                if (value) {
                    var userData = JSON.parse(value);
                    buyerID = this.state.userData._id;
                    console.log("==== UserData ===", userData);

                    this.setState({
                        userData: userData
                    });

                    this.setState({ userInfo: userData });
                    this._profileLoadingState(true);
                    var postData = {
                        sellerId: this.state.userData._id,
                        buyerId: this.props.seller._id,
                        propertyId: this.props.propertyID._id,
                        contactId: this.props.contactID,
                    };
                    this.props.getChatHistory(postData, userData.token);
                }
            })
            .done();
    }

    componentWillReceiveProps(nextProps) {
        console.log(
            "componentWillReceiveProps >>>>" +
            JSON.stringify(nextProps.ChatHistoryReducer)
        );
        this._profileLoadingState(false);
        var response = nextProps.ChatHistoryReducer.getChatHistory;
        
        // var demoData = {
        //     "_id": 636520,
        //     "text": "Demo.pdf",
        //     "createdAt": "2019-01-23T08:46:27.213Z",
        //     "user": {
        //         "_id": "5c4168c982a4741bbca6b1f7",
        //         "name": "Shendre Shendre",
        //         "avatar": "http://13.238.107.123:5001/assets/images/noUser.jpg"
        //     },
        //     "image": "",
        //      file_type:Strings.FILE_TYPE_PDF,
        //      fileUrl:"http://www.orimi.com/pdf-test.pdf",
        //     "buyerId": "5c4168c982a4741bbca6b1f7",
        //     "propertyId": "5c41703d82a4741bbca6b206"
        // }
        if(response){
            if (response.code === Strings.STATUS_OK) {
                //response.data.push(demoData);
                this.setState((previousState) => {
                    return {
                        messages: GiftedChat.prepend(previousState.messages, response.data.reverse()),
                        loadEarlier: false,
                        isLoadingEarlier: false,
                    };
                });

            }
        }
        
    }


    componentWillUnmount() {
        this._isMounted = false;
        if (Platform.OS === 'ios') {
            this.keyboardDidShowListener.remove();
            this.keyboardDidHideListener.remove();
        }
    }

    onLoadEarlier() {
        this.setState((previousState) => {
            return {
                isLoadingEarlier: true,
            };
        });

        // setTimeout(() => {
        //     if (this._isMounted === true) {
        //         this.setState((previousState) => {
        //             return {
        //                 messages: GiftedChat.prepend(previousState.messages, require('./data/old_messages.js')),
        //                 loadEarlier: false,
        //                 isLoadingEarlier: false,
        //             };
        //         });
        //     }
        // }, 1000); // simulating network
    }

    onSend(messages = []) {
        const { socket } = this;

        // this.setState((previousState) => {
        //     return {
        //         messages: GiftedChat.append(previousState.messages, messages),
        //     };
        // });

        console.log("onSend Message >>>" + JSON.stringify(messages));
        // Emit an event to server

        var customMessage = {
            _id: Math.round(Math.random() * 1000000),
            text: messages[0].text,
            createdAt: messages[0].createdAt,
            senderID: {
                _id: this.state.userData._id,
                name:this.state.userData.firstname+" "+this.state.userData.lastname,
                avatar: this.state.userData.profile_pic
            },
            receiverID: this.props.seller._id,
            contactID: this.props.contactID,
            address: this.props.propertyID.address,
            propertyID: this.props.propertyID._id,
            image:"",
            file_type:Strings.FILE_TYPE_TEXT,
            imageType: 0,
            file: "",
            participants: this.props.participants,
            userType: this.props.userType 
            // Any additional custom parameters are passed through
        }
        console.log("customMessage >>>" + JSON.stringify(customMessage));
        socket.emit("getMessage", customMessage);
        // for demo purpose
        // this.answerDemo(messages);

        // Event called when 'someEvent' it emitted by server

    }



    onReceive(text) {
        this.setState((previousState) => {
            return {
                messages: GiftedChat.append(previousState.messages,text),
            };
        });
    }

    

    selectImages(images) {
        this.setImages(images);
    }

    setImages(images) {
        this._images = images;
    }

    


    openGallery() {
        ImagePicker.openPicker({
            width: 300,
            height: 400,
            includeBase64: true,
            compressImageQuality: 0.8,
            cropping: true
        }).then(image => {
            this.upload(image.data);
        });
        // this._toggleModal();
    }

    openCamera() {
        ImagePicker.openCamera({
            width: 300,
            height: 400,
            includeBase64: true,
            compressImageQuality: 0.8,
            cropping: true
        }).then(image => {
            this.upload(image.data);
        });
        //  this._toggleModal();
    }

    renderCustomActions(props) {
        return (
            <View style={{flexDirection:"row",justifyContent:"space-evenly"}}>
                <TouchableOpacity
                    hitSlop={styles.touchableAreaStyle}
                    onPress={() => {
                        if (Platform.OS === 'android') {
                            if (
                              this.requestCameraPermission()) {
                              this.showPickerOption();
                            } else {
                                this.requestCameraPermission();
                            }
                        } else {
                            this.showPickerOption();
                        }
                        
                    }}>
                    <View style={{ margin: 5, paddingBottom: 5 , paddingLeft:10,paddingRight:10 }}>
                        <Icon
                            name='camera'
                            type='font-awesome'
                            color={Colors.COLOR_PRIMARY_DARK}
                        />
                    </View>
                </TouchableOpacity>
                <TouchableOpacity
                    hitSlop={styles.touchableAreaStyle}
                    onPress={() => this.attachment()}
                >
                    <View style={{ margin: 5, paddingBottom: 5, paddingLeft: 10, paddingRight: 10 }}>
                        <Icon
                            name='paperclip'
                            type='font-awesome'
                            color={Colors.COLOR_PRIMARY_DARK}
                        />
                    </View>
                </TouchableOpacity>
            </View>
            
        );
       
    }


      requestCameraPermission() {
        
            const granted = PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.CAMERA
            );
          console.log("requestCameraPermission >>>> "+JSON.stringify(granted))
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                console.log('You can access the Camera');
            } else {
                console.log("You cannot access Camera");
            }
        
        return granted;
    }

    showPickerOption() {
        Alert.alert(
            Strings.APP_NAME,
            "Upload picture from",
            [
                { text: "Gallery", onPress: () => this.openGallery() },
                { text: "Camera", onPress: () => this.openCamera() },
                { text: "Cancel", style: "cancel" }
            ],
            { cancelable: true }
        );
        // console.log("Document Picker >>>> ",JSON.stringify(DocumentPicker))
        // console.log("Document Picker Util >>>> ", JSON.stringify(DocumentPickerUtil))
        // DocumentPicker.show({
        //     filetype: [DocumentPickerUtil.images(), DocumentPickerUtil.pdf()],
        // }, (error, res) => {
        //     // Android
        //     console.log(
        //         "URI >> "+res.uri,
        //         "Type >> "+res.type, // mime type
        //         "FileName >>"+res.fileName,
        //         "FileSize >>"+res.fileSize
        //     );
        // });
    }
   

    openGallery() {
        ImagePicker.openPicker({
            width: 220,
            height: 160,
            compressImageQuality: 0.95,
            cropping: true
        }).then(image => {
            console.log("Image >>> " + JSON.stringify(image));

             this.upload(image);
            
        });
        // this._toggleModal();
    }

    openCamera() {
        ImagePicker.openCamera({
            width: 220,
            height: 160,
            compressImageQuality: 0.95,
            cropping: true
        }).then(image => {
            console.log("Image >>> "+JSON.stringify(image));

             this.upload(image);
        });
        //  this._toggleModal();
    }

    _profileLoadingState(loadingState) {
        this.setState({
            isImgSpinnerVisible: loadingState
        });
    }


    // iPhone/Android
    attachment(){

        DocumentPicker.show({
            filetype: [DocumentPickerUtil.allFiles()],
        }, (error, res) => {
            this.setState({ ImageLoad: true })
            console.log(res, 'res data');
            fileData=res;    
                //alert(JSON.stringify(fileData))
            if (res && res.uri) {
                var re = /(?:\.([^.]+))?$/;
                var ext = re.exec(res.fileName)[1];

                console.log("Document  >>> " + ext +" >>> "+ imgArray.includes(ext) +" >>> "+ docArray.includes(ext));
                if (imgArray.includes(ext) || docArray.includes(ext)) {
                  this._profileLoadingState(true);
                  var formData = new FormData();

                  formData.append("file", {
                    name: res.fileName,
                    uri: res.uri,
                    type: 'image/png'
                  });
                  console.log("form data : ", formData);
                  console.log("API Uplod file : ", API.UPLOAD_ATTACHMENT);
                  fetch(API.UPLOAD_ATTACHMENT, {
                    method: "POST",
                    headers: {
                      Accept: "application/json",
                      "Content-Type": "multipart/form-data",
                      Authorization: this.state.userData.token
                    },
                    body: formData
                  })
                    .then(response => response.json())
                    .then(responseJson => {
                      this._profileLoadingState(false);
                      //console.log("responseJson file name: ", JSON.stringify(responseJson.data.fieldname));
                      console.log("responseJson : ", JSON.stringify(responseJson));
                      //  alert(JSON.stringify(responseJson.code));
                      if (responseJson.code === 200) {
                        var ftype = 1;
                        // alert(JSON.stringify("File  >>> " + docArray + " type >> " + responseJson.filetype + "Result >>" + docArray.includes(responseJson.filetype)));
                          if (imgArray.includes(ext)) {
                          ftype = 1;
                          } else if (docArray.includes(ext)) {
                          ftype = 2;
                        } else {
                          ftype = 0;
                        }

                        // alert(JSON.stringify("File Type >>>" + JSON.stringify(ftype)));
                        // alert(JSON.stringify(fileData))
                        var customMessage = { 
                            _id: Math.round(Math.random() * 1000000), 
                            text: ftype === 2 ? fileData.fileName : "", 
                            createdAt: moment(), user: { _id: this.state.userData._id }, 
                            senderID: {
                                _id: this.state.userData._id, 
                                name: this.state.userData.firstname + " " + this.state.userData.lastname,
                                avatar: this.state.userData.profile_pic 
                            }, 
                            receiverID: this.props.seller._id, 
                            address: this.props.propertyID.address, 
                            propertyID: this.props.propertyID._id, 
                            contactID: this.props.contactID,
                             image: ftype === 1 ? responseJson.data : "", 
                             file: ftype === 2 ? responseJson.data : "", 
                             file_type: responseJson.filetype, 
                             imageType: ftype,
                             participants: this.props.participants,
                            userType: this.props.userType 
                            };
                          // Any additional custom parameters are passed through
                        console.log("Custom Attachmemt >>>>"+customMessage);   
                        this.socket.emit("getMessage", customMessage);
                        // this.setState(previousState => {
                        //   return { messages: GiftedChat.append(previousState.messages, customMessage) };
                        // });
                      } else {
                        this._profileLoadingState(false);
                        alert(Strings.SERVER_ERROR)
                      }
                    })
                    .catch(error => {
                      // this._changeLoadingState(false);
                      this._profileLoadingState(false);
                      console.log("Doc Upload Error >>> " + JSON.stringify(error));
                      alert(Strings.SERVER_ERROR)
                    });
                } else {
                  Alert.alert(
                    Strings.APP_NAME,
                    "Only Documents and Images are allowed in attachment",
                    [
                      {
                        text: "Ok",
                        onPress: () =>
                          console.log("Cancel Pressed"),
                        style: "cancel"
                      }
                    ],
                    { cancelable: false }
                  );
                }
            }
        });
    }
    

    async upload(data) {
        // this._changeLoadingState(true);
        //this._profileLoadingState(true);
      console.log("Image Data >>>> "+JSON.stringify(data))
        var re = /(?:\.([^.]+))?$/;
        var ext = "jpg";

        if (data) {
            this._profileLoadingState(true);
            var formData = new FormData();

            formData.append("file", {
              name: data.filename ? data.filename : "upload.jpg",
              uri: data.path,
              type: 'image/png'
            });
            console.log("form data : ", JSON.stringify(formData));
            console.log("API Uplod file : ", API.UPLOAD_ATTACHMENT);
            fetch(API.UPLOAD_ATTACHMENT, {
              method: "POST",
              headers: {
                Accept: "application/json",
                "Content-Type": "multipart/form-data",
                Authorization: this.state.userData.token
              },
              body: formData
            })
              .then(response => response.json())
              .then(responseJson => {
                this._profileLoadingState(false);
                //console.log("responseJson file name: ", JSON.stringify(responseJson.data.fieldname));
                console.log(
                  "responseJson : ",
                  JSON.stringify(responseJson)
                );
                //  alert(JSON.stringify(responseJson.code));
                if (responseJson.code === 200) {
                  var ftype = 1;
                  // alert(JSON.stringify("File  >>> " + docArray + " type >> " + responseJson.filetype + "Result >>" + docArray.includes(responseJson.filetype)));
                  if (imgArray.includes(ext)) {
                    ftype = 1;
                  } else if (docArray.includes(ext)) {
                    ftype = 2;
                  } else {
                    ftype = 0;
                  }

                  // alert(JSON.stringify("File Type >>>" + JSON.stringify(ftype)));
                  // alert(JSON.stringify(fileData))
                  var customMessage = {
                    _id: Math.round(Math.random() * 1000000),
                    text: ftype === 2 ? fileData.fileName : "",
                    createdAt: moment(),
                    user: { _id: this.state.userData._id },
                    senderID: {
                      _id: this.state.userData._id,
                      name:
                        this.state.userData.firstname +
                        " " +
                        this.state.userData.lastname,
                      avatar: this.state.userData.profile_pic
                    },
                    receiverID: this.props.seller._id,
                    address: this.props.propertyID.address,
                    propertyID: this.props.propertyID._id,
                    contactID: this.props.contactID,
                    image: ftype === 1 ? responseJson.data : "",
                    file: ftype === 2 ? responseJson.data : "",
                    file_type: responseJson.filetype,
                    imageType: ftype,
                    participants: this.props.participants,
                    userType: this.props.userType
                  };
                  // Any additional custom parameters are passed through
                  console.log(
                    "Custom Attachmemt >>>>" + customMessage
                  );
                  this.socket.emit("getMessage", customMessage);
                  // this.setState(previousState => {
                  //   return { messages: GiftedChat.append(previousState.messages, customMessage) };
                  // });
                } else {
                  this._profileLoadingState(false);
                  alert(Strings.SERVER_ERROR);
                }
              })
              .catch(error => {
                // this._changeLoadingState(false);
                this._profileLoadingState(false);
                console.log(
                  "Doc Upload Error >>> " + JSON.stringify(error)
                );
                alert(Strings.SERVER_ERROR);
              });
        } else {
            Alert.alert(
                Strings.APP_NAME,
                "Only Documents and Images are allowed in attachment",
                [
                    {
                        text: "Ok",
                        onPress: () =>
                            console.log("Cancel Pressed"),
                        style: "cancel"
                    }
                ],
                { cancelable: false }
            );
        }

        // var postData = {
        //     chatImage: "data:image/png;base64," + data
        // };

        // fetch(API.UPLOAD_ATTACHMENT, {
        //     method: "POST",
        //     headers: {
        //         Accept: "application/json",
        //         "Content-Type": "application/json",
        //         Authorization: this.state.userData.token
        //     },
        //     body: JSON.stringify(postData)
        // })
        //     .then(response => response.json())
        //     .then(responseJson => {
        //         // this._changeLoadingState(false);
        //         this._profileLoadingState(false);

        //         console.log("Response Upload >>>> " + JSON.stringify(responseJson));

        //         if (responseJson.code == Strings.STATUS_OK) {
        //             var sendAttachment = {
        //                 _id: Math.round(Math.random() * 1000000),
        //                 text: '',
        //                 createdAt: moment(),
        //                 user: {
        //                     _id: this.state.userData._id,
        //                 },
        //                 senderID: {
        //                     _id: this.state.userData._id,
        //                 },
        //                 receiverID: this.props.seller._id,
        //                 address: this.props.propertyID.address,
        //                 propertyID: this.props.propertyID._id,
        //                 image: responseJson.data,
        //                 contactID: this.props.contactID,
        //                 file_type: Strings.FILE_TYPE_IMAGE
        //                 // Any additional custom parameters are passed through
        //             }

        //             this.socket.emit('getMessage', sendAttachment);
        //             this.setState((previousState) => {
        //                 return {
        //                     messages: GiftedChat.append(previousState.messages, sendAttachment),
        //                 };
        //             });
                    
        //         } else {

        //         }
        //     })
        //     .catch(error => {
        //         // this._changeLoadingState(false);
        //         this._profileLoadingState(false);
        //         console.log(error);
        //     });
    }


    renderBubble(props) {
       // console.log("Render Bubble >>>"+JSON.stringify(props))
        return (
             <View>
                {this.state.userData._id !== props.currentMessage.user._id ?
                    <Text>{props.currentMessage.user.name}</Text>
                    :null
                }
                
            <Bubble
                {...props}
                wrapperStyle={{
                    left: {
                        backgroundColor: Colors.grey_300,
                    },
                    right: {
                        backgroundColor: Colors.COLOR_PRIMARY_DARK
                    }
                }}
            />
            </View>
        );
    }

    renderSystemMessage(props) {
        return (
            <SystemMessage
                {...props}
                containerStyle={{
                    marginBottom: 0,
                }}
                textStyle={{
                    fontSize: 14,
                }}
            />
        );
    }

    renderCustomView(props) {
        console.log("renderCustomView >>>"+JSON.stringify(props))
        return (
            <CustomView
                {...props}
            />
        );
    };

    renderFooter(props) {
        if (this.state.typingText) {
            return (
                <View style={styles.footerContainer}>
                    <Text style={styles.footerText}>
                        {this.state.typingText}
                    </Text>
                </View>
            );
        }
        return null;
    }

    // renderSend = (sendProps) => {
    //     if (sendProps.text.trim().length > 0) {
    //         return (
                
    //                 <Icon
    //                     name='camera'
    //                     type='font-awesome'
    //                     color='#f50'
    //                     onPress={() => this.openGallery()} />
              
    //         );
    //     }
    //     return null;
    // }

    renderSend = (props) => {
        //console.log("renderSend >>>> "+JSON.stringify(props));
        return (
            <Send
                {...props}>
                <View style={{ marginRight: 10, marginBottom: 5 }}>
                 <Icon
                         name='arrow-circle-right'
                         type='font-awesome'
                         color={Colors.COLOR_PRIMARY_DARK}
                        />
                </View>
            </Send>
        );
    }


    renderLeftOne() {
        return (
            <TouchableOpacity
                hitSlop={styles.touchableAreaStyle}
                onPress={() => Actions.pop()}
            >
                {/* <Image source={require("../../Assets/back_arrow.png")} /> */}
                <Icon containerStyle={styles.iconStyle} name="ios-arrow-back" type="ionicon" color={Colors.WHITE} />
            </TouchableOpacity>
        );
    }

    renderCenterOne() {
        let sellerName = this.props.seller;
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
        let platformConf = Platform.OS === 'ios' ? {
            minInputToolbarHeight: this.state.minInputToolbarHeight,
            bottomOffset: 0,
        } : {};
        return (
            
            <View style={{flex:1}}>
                <View style={styles.header}>
                    <Header
                        backgroundColor={Colors.COLOR_PRIMARY}
                        leftComponent={this.renderLeftOne()}
                        centerComponent={this.renderCenterOne()}

                    />
                </View>
               
                <SafeAreaView style={{flex:1}}>
                    <GiftedChat
                        messages={this.state.messages}
                        onSend={this.onSend}
                        // loadEarlier={this.state.loadEarlier}
                        // onLoadEarlier={this.onLoadEarlier}
                        // isLoadingEarlier={this.state.isLoadingEarlier}
                        style={{ flex: 1 }}
                        user={{
                            _id: this.state.userData._id, // sent messages should have same user._id
                        }}
                      
                        keyboardShouldPersistTaps='never'
                        renderActions={this.renderCustomActions}
                        renderBubble={this.renderBubble}
                      //  renderSystemMessage={this.renderSystemMessage}
                        renderCustomView={this.renderCustomView}
                        renderFooter={this.renderFooter}
                        renderSend={this.renderSend} />
                   
                </SafeAreaView>
                        
                 
                
                {this.state.isImgSpinnerVisible ? (
                    <View
                        style={{
                            flex: 1,
                            left: 0,
                            right: 0,
                            top: 0,
                            bottom: 0,
                            zIndex: 1,
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
    },
    iconStyle: {
        marginTop: 20,
        paddingRight:10,
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

export default connect(mapStateToProps, mapDispatchToProps)(ChatComponent);
