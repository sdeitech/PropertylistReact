import React, { Component } from "react";
import { connect } from 'react-redux';
import { View, Text, ImageBackground, Dimensions, Image, TouchableOpacity,TouchableWithoutFeedback,TouchableHighlight, AsyncStorage, FlatList } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { bindActionCreators } from "redux";
import { Actions } from 'react-native-router-flux';
import CardView from "react-native-cardview";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import PropertyDetailScreenStyle from "./PropertyDetailScreenStyle";
import HeaderScreen from "../CommonComponent/HeaderScreen";
import Colors from '../../Constants/Colors';
import Strings from '../../Constants/Strings';
import {
    getPropertyDetail,
} from "../../Action/ActionCreators";

import { BarIndicator } from "react-native-indicators";
import OfflineNotice from "../../Utils/OfflineNotice";
import MapView, { PROVIDER_GOOGLE, Marker}from "react-native-maps";
import placeholder from "../../Assets/placeholder.png";
import { Icon } from "react-native-elements";

const DEVICE_WIDTH = Dimensions.get("window").width;
const DEVICE_HEIGHT = Dimensions.get("window").height;

const ASPECT_RATIO = DEVICE_WIDTH / DEVICE_HEIGHT;
const LATITUDE_DELTA = 5.122222;
const LONGITUDE_DELTA = 4.2323232;
import ImageSlider from "react-native-image-slider";
import API from "../../Constants/APIUrls";
import ReadMore from "react-native-read-more-text";
import {
    ifIphoneX,
    getStatusBarHeight,
    getBottomSpace
} from "react-native-iphone-x-helper";


class PropertyDetailScreen extends Component {

    constructor() {
        super();
        this.state = {
            checked:true,
            visible: false,
            isSpinnerVisible: false,
            isContactSpinnerVisible: false,
            propertyName:"--",
            propertyId:"--",
            propertyDetail:"--",
            no_Of_Bathrooms:"--",
            no_Of_Bedrooms:"--",
            price:"--",
            indoorFeatures:[],
            land_size:"--",
            lat:0,
            lang:0,
            region:"",
            sliderImages:[],
            contactInfo:"",
            userData:"",
            propId:"",
            isPropertySaved:false,
            propertyData:""

        };
    }

    componentWillMount(){
        //this._getUserData();
    }

    componentDidMount(){
        this._getPropertyData();
        // this.refs.MapView.fitToElements(true);
        // this.refs.MapView.setZoom(map.getZoom() - 1);

        // // set a minimum zoom 
        // // if you got only 1 marker or all markers are on the same address map will be zoomed too much.
        // if (this.refs.MapView.getZoom() > 15) {
        //     this.refs.MapView.setZoom(15);
        // }
    }

    _getPropertyData (){
        AsyncStorage.getItem(Strings.KEY_USER_DATA)
            .then(value => {
                if (value) {
                    var userData = JSON.parse(value);
                    console.log("==== userData ===", userData);

                    this.setState({
                        userData: userData
                    });
                    
                    //this.setState({ userInfo: userData });
                    this._changeLoadingState(true);
                    var postData = {
                        // "id": propertyData._id,
                        "propertyId": this.props.propertyID,
                        "buyerId" : userData._id

                    };
                    this.props.getPropertyDetail(postData, userData.token);
                }
            })
            .done();

    }

    componentWillReceiveProps(nextProps) {

         this._changeLoadingState(false)

        if (nextProps.PropertyDetailReducer.propertyDetailRes !== undefined && nextProps.PropertyDetailReducer.propertyDetailRes!==""){
            console.log("PropertyDetailScreen Screen >>>> " + JSON.stringify(nextProps.PropertyDetailReducer.propertyDetailRes));
            if (nextProps.PropertyDetailReducer.propertyDetailRes.code !== undefined && nextProps.PropertyDetailReducer.propertyDetailRes.code === Strings.STATUS_OK){
                data = nextProps.PropertyDetailReducer.propertyDetailRes.data;

                this.setState({
                    propertyData:data
                });

                this.setState({
                  propId: data.propertyInfo._id,
                  propertyName:data.propertyInfo.property_name,
                  propertyId:data.propertyInfo.property_unique_id,
                  propertyDetail: data.propertyInfo.prop_description,
                  no_Of_Bathrooms: data.propertyInfo.no_of_bathroom,
                  no_Of_Bedrooms: data.propertyInfo.no_of_bedroom,
                  price: data.propertyInfo.price,
                  indoorFeatures: data.propertyAmenitiesInfo,
                  land_size: data.propertyInfo.land_size,
                  lat: data.propertyInfo.location.coordinates[1],
                  lang: data.propertyInfo.location.coordinates[0],
                    userInfo: data.userInfo,
                  contactInfo: data.contactInfo,
                //   changed by kalpak
                    isPropertySaved:(data.isBookmarked === 1)? true : false
                });
                
                if (data.propertyMediaInfo.length!==0){
                    var imgArray=[];

                    console.log("Image Array Inside If >>>>" + JSON.stringify(data.propertyMediaInfo));

                    for (let i = 0; i < data.propertyMediaInfo.length; i++) {

                        let imgUrl = API.AWS_PATH + API.AWS_BUCKET + data.propertyMediaInfo[i].image_path + "/" + data.propertyMediaInfo[i].image_name;
                        console.log("Image URL In forloop >>>>" + imgUrl);

                        imgArray.push(imgUrl);    

                        console.log("Image Array in for loop>>>>" + JSON.stringify(imgArray));
                    }
                   
                    this.setState({
                        sliderImages:imgArray
                    });
                }else{
                    console.log("Image Array ELSE >>>>" + JSON.stringify(data.propertyMediaInfo));
                    let imgUrl = API.DEFAULT_IMAGE_URL + Strings.PROPERTY_DEFAULT_IMAGE;
                    this.state.sliderImages.push(imgUrl)
                }
                console.log("Images Array in state>>>> " + JSON.stringify(this.state.sliderImages));    
                

            }else{
                // alert(nextProps.ProfileReducer.profileRes.message);
            }
            
        }else{
            Alert.alert(Strings.APP_NAME, Strings.SERVER_ERROR,
                [{ text: 'OK', onPress: () => Actions.pop() }], { cancelable: false });
        }
        
    }

    _changeLoadingState(loadingState) {
        this.setState({
          isSpinnerVisible: loadingState
        });
      }

    _changeContactLoadingState(loadingState) {
        this.setState({
            isContactSpinnerVisible: loadingState
        });
    }

      _renderItem = ({item}) => (
        <View style={{width:DEVICE_WIDTH}}>   
            <Text  style={{fontSize: 14, marginTop: 10}}>{item.amenitiesId.name} </Text>
        </View>
      );

    _toggleSaveProperty() {
        console.log("In _toggleSaveProperty");
        this.setState({ isPropertySaved: !this.state.isPropertySaved });
    }

    getInitialState() {
        return {
            region: {
                latitude: 37.78825,
                longitude: -122.4324,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            },
        };
    }

    onRegionChange(region) {
        this.setState({ region });
    }
    renderIndoorFeatures(indoreMapArray) {
        return indoreMapArray.map((item,index) => {
            return (
                <View key={index} style={{ width: DEVICE_WIDTH }}>
                    <Text style={{ fontSize: 14, marginTop: 10 }}>{item.amenitiesId.name} </Text>
                </View>
            );
        });
    }

    renderRequestButton(contactStatus){
        switch (contactStatus.status){
            case Strings.CONTACT_REQUEST_PENDING :
                return (
                    <View style={{ alignItems: "center" }}>
                     
                            <LinearGradient
                                colors={[Colors.orange_700, Colors.orange_900]}
                                style={PropertyDetailScreenStyle.roundedButtonStyleAppTheme}>
                                <Text style={{ color: "white" }}> {Strings.BUTTON_TEXT_REQUEST_PENDING} </Text>
                            </LinearGradient>
                       
                    </View>
                );

            case Strings.CONTACT_REQUEST_ACCEPTED:
                return (
                    <View style={{ alignItems: "center" }}>
                        <TouchableOpacity
                            onPress={() => Actions.inspectionScreen({propertyData:this.state.propertyData})}
                             activeOpacity={0.5}>

                                <LinearGradient
                                    colors={["#00C2D7", "#4EE1CA"]}
                                    style={PropertyDetailScreenStyle.roundedButtonStyleAppTheme}>
                                    <Text style={{ color: "white",fontWeight:"600" }}> {Strings.BUTTON_TEXT_REQUEST_INSPECTION} </Text>
                                </LinearGradient>
                        </TouchableOpacity>

                    </View>
                );
            case Strings.CONTACT_REQUEST_REJECTED:
                return (
                    <View style={{ alignItems: "center" }}>
                       
                            <LinearGradient
                                colors={[Colors.red_500, Colors.red_500]}
                                style={PropertyDetailScreenStyle.roundedButtonStyleAppTheme}>
                                <Text style={{ color: "white" }}> {Strings.BUTTON_TEXT_REQUEST_REJECTED} </Text>
                            </LinearGradient>
                        
                    </View>
                );           
           

        }
    }


    async sendContactRequest() {
        //this._changeLoadingState(true);
        this._changeContactLoadingState(true);
        var postData = {
            "senderId": this.state.userData._id,
            "receiverId": this.state.userInfo._id,
            "propertyId": this.state.propId
        }


        fetch(
            API.SEND_CONTACT_REQUEST,
            {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    'Content-Type': 'application/json',
                    Authorization: this.state.userData.token
                },
                body: JSON.stringify(postData)
            }
        ).then(response => response.json())
            .then((responseJson) => {
                this._changeContactLoadingState(false);
                //this._changeLoadingState(false);
                console.log("Response Send Contact Request >>>> " + JSON.stringify(responseJson));

                if(responseJson!==undefined){
                if (responseJson.code == Strings.STATUS_OK) {

                    alert(responseJson.message);
                    this.setState({contactInfo:responseJson.data});

                } else {
                    alert(responseJson.message);
                }
            }
            })
            .catch(error => {
                this._changeContactLoadingState(false);
                //this._changeLoadingState(false);
                console.log(error);
                alert(Strings.ALERT_SERVER_ERROR);

            });
    }


    async sendBookmarkPropertyRequest() {
        //this._changeLoadingState(true);
        this._changeContactLoadingState(true);
        var postData = {
            "user_id": this.state.userData._id,
            "property_id": this.state.propId,
            "status": !this.state.isPropertySaved?1:2,
        }


        fetch(
            API.BOOKMARK_PROPERTY_BY_ID,
            {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    'Content-Type': 'application/json',
                    Authorization: this.state.userData.token
                },
                body: JSON.stringify(postData)
            }
        ).then(response => response.json())
            .then((responseJson) => {
                this._changeContactLoadingState(false);
                //this._changeLoadingState(false);
                console.log("Response Send Bookmark Property Request >>>> " + JSON.stringify(responseJson));

                if (responseJson !== undefined) {
                    if (responseJson.code == Strings.STATUS_OK) {

                        // alert(responseJson.message);
                        // this.setState({ contactInfo: responseJson.data });
                        this._toggleSaveProperty();

                    } else {
                        alert(responseJson.message);
                    }
                }
            })
            .catch(error => {
                this._changeContactLoadingState(false);
                //this._changeLoadingState(false);
                console.log(error);
                alert(Strings.ALERT_SERVER_ERROR);

            });
    }


    


    render() {
        return(
            <View style={{flex: 1}}>
                <OfflineNotice />
                <HeaderScreen title={Strings.PROPERTY_DETIAL_SCREEN_TITLE}/>
                 <KeyboardAwareScrollView
                    resetScrollToCoords={{ x: 0, y: 0 }}
                    scrollEnabled={true}
                    extraHeight={0}
                    extraScrollHeight={0}
                    keyboardShouldPersistTaps='handled'
                    enableAutoAutomaticScroll={true}
                    enableOnAndroid={true}>
                    <View style={{ flex: 1 }}>

                        <View style={{ flex: 1,height:DEVICE_HEIGHT/3}}>
                            {this.state.sliderImages.length > 1 ? 
                            (<ImageSlider
                                loopBothSides
                                autoPlayWithInterval={3000}
                                images={this.state.sliderImages}>

                            </ImageSlider>) : 
                            (<Image
                                    style={{ flex:1 }}
                                    source={{ uri: this.state.sliderImages[0]}}
                            />) }
                            

                        </View>

                        {
                            this.state.isSpinnerVisible ?
                                <View style={{
                                    flex: 1,
                                    left: 0,
                                    right: 0,
                                    top: DEVICE_WIDTH / 1.2,
                                    bottom: 0,
                                    position: 'absolute',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    backgroundColor: Colors.TRANSPARENT,
                                    width: window.width,
                                    height: window.height
                                }}>

                                    <BarIndicator color={Colors.END_COLOR} count={5} />
                                </View>
                                : <CardView
                                    cardElevation={10}
                                    cornerRadius={10}
                                    style={PropertyDetailScreenStyle.updateForm}>
                                    <View style={{flex:1}}>
                                        <View style={{ margin: 10 }}>
                                            <View style={{flex:1,flexDirection:"row"}}>
                                                <View style={{flex:0.7}}>
                                                    <Text style={{ fontSize: 16 }}>{this.state.propertyName}</Text>
                                                </View>
                                                <View style={{ flex: 0.3, alignSelf: "center", justifyContent: "center",alignItems:"center",alignContent:"center"}}>
                                                    <TouchableOpacity
                                                        onPress={() => this.sendBookmarkPropertyRequest()}>
                                                        <Image
                                                            source={this.state.isPropertySaved ? require('../../Assets/bookmark_32.png') : require('../../Assets/bookmark_outline_32.png')}
                                                        />
                                                    </TouchableOpacity>
                                                    
                                                    <Text style={{ fontSize: 12,marginTop:5,alignSelf:"center",justifyContent:"center"}}>{"Save Property"}</Text>
                                                </View>
                                            </View>
                                            
                                            <Text style={{ fontSize: 13 }}>{`Property ID: ${this.state.propertyId}`}</Text>
                                        </View>
                                        <View style={{  margin: 10 }}>
                                            {/* <Text style={{ fontSize: 13 }}>
                                                {this.state.propertyDetail}
                                            </Text> */}
                                            <ReadMore
                                                numberOfLines={3}
                                                onReady={this._handleTextReady}>
                                                <Text style={{ fontSize: 14 }}>
                                                    {this.state.propertyDetail}
                                                </Text>
                                            </ReadMore>
                                        </View>
                                        <View style={{ flex: 1, margin: 10 }}>
                                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                                            <Image
                                                style={{ margin: 5 }}
                                                source={require("../../Assets/cost.png")}
                                            />
                                            <Text style={{ fontSize: 14, marginLeft: 10 }} >{`$ ${this.state.price}`}</Text>
                                        </View>
                                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                                            <Image
                                                style={{ margin: 5 }}
                                                source={require("../../Assets/area.png")}
                                            />
                                            <Text style={{ fontSize: 14, marginLeft: 10  }} >85 sqm</Text>
                                        </View>
                                    </View>
                                        <View style={{ marginBottom: 20 }}>
                                            <View style={{ flexDirection: "row", margin: 10 }}>
                                                <Image
                                                    style={{ margin: 5 }}
                                                    source={require("../../Assets/003-info.png")}
                                                />
                                                <Text style={PropertyDetailScreenStyle.linkTextStyle} >
                                                    Statement of Information
                                     </Text>
                                            </View>
                                            <View style={{ flexDirection: "row", margin: 10 }}>
                                                <Image
                                                    style={{ margin: 5 }}
                                                    source={require("../../Assets/002-wedding-planning.png")}
                                                />
                                                <Text style={PropertyDetailScreenStyle.linkTextStyle} >
                                                    Due Diligence Checklist
                                     </Text>
                                            </View>
                                            {/* <View style={{ flexDirection: "row", margin: 10 }}>
                                                <Image
                                                    style={{ margin: 5 }}
                                                    source={require("../../Assets/002-wedding-planning.png")}
                                                />
                                                <Text style={PropertyDetailScreenStyle.linkTextStyle} >
                                                    Section 32 - Vendor Statement
                                     </Text>
                                            </View> */}
                                        </View>
                                        <View style={{flex:1, margin: 20 }}>
                                            <Text style={{ fontSize: 14 }} >Location:</Text>

                                            <MapView
                                                ref={MapView => (this.MapView = MapView)}
                                                style={{ height:DEVICE_HEIGHT/4}}
                                                provider="google"
                                                showsUserLocation={true}
                                                showsMyLocationButton={false}
                                                loadingEnabled={true}
                                                loadingIndicatorColor="#666666"
                                                loadingBackgroundColor="#eeeeee"
                                                moveOnMarkerPress={false}
                                                showsUserLocation={true}
                                                showsCompass={true}
                                                showsPointsOfInterest={false}
                                                pitchEnabled={false}
                                                rotateEnabled={false}
                                                scrollEnabled={false}
                                                zoomEnabled={false}
                                                initialRegion={{
                                                    latitude: this.state.lat,
                                                    longitude: this.state.lang,
                                                    latitudeDelta: LATITUDE_DELTA,
                                                    longitudeDelta: LONGITUDE_DELTA,
                                                }}>

                                                <Marker
                                                    title={this.state.propertyName}
                                                    key={this.state.property_unique_id}
                                                    // coordinate={marker.coordinate}
                                                    coordinate={{
                                                        latitude: this.state.lat,
                                                        longitude: this.state.lang,
                                                        latitudeDelta: LATITUDE_DELTA,
                                                        longitudeDelta: LONGITUDE_DELTA,
                                                    }}
                                                />


                                            </MapView>

                                        </View>
                                        <View style={{ margin: 10 }}>
                                            {/* <Text style={{ fontSize: 14, margin: 5 }}>FEATURES:</Text> */}
                                            <View style={{ flexDirection: "row", marginTop: 10 }}>
                                                <View style={{ flexDirection: "row", marginRight: DEVICE_WIDTH / 5 }}>
                                                    <Image
                                                        style={{ margin: 5 }}
                                                        source={require("../../Assets/bed.png")}
                                                    />
                                                    <Text style={{ fontSize: 14, marginLeft: 5 }} >{`${this.state.no_Of_Bathrooms} Bedrooms`}</Text>
                                                </View>
                                                <View style={{ flexDirection: "row" }}>
                                                    <Image
                                                        style={{ margin: 5 }}
                                                        source={require("../../Assets/bathtub.png")}
                                                    />
                                                    <Text style={{ fontSize: 14, marginLeft: 5 }} >{`${this.state.no_Of_Bathrooms} Bathrooms`}</Text>
                                                </View>
                                            </View>
                                            <View style={{ flexDirection: "row", marginTop: 10, alignItems: "center" }}>
                                                <Image
                                                    style={{ margin: 5, marginLeft: 5 }}
                                                    source={require("../../Assets/garage.png")}
                                                />
                                                <Text style={{ fontSize: 14 }} >1 Garage</Text>
                                            </View>
                                        </View>
                                        <View style={{ flex: 1, margin: 10 }}>
                                            <Text style={{ fontSize: 16,fontWeight:'bold', marginTop: 30 }}>{Strings.PROPERTY_HIGHLIGHTS}</Text>
                                            {/* {this.state.indoorFeatures.length !== 0 ? <FlatList
                                            data={this.state.indoorFeatures}
                                            keyExtractor={this._keyExtractor}
                                            renderItem={this._renderItem}
                                        />
                                            : null} */}

                                            {this.state.indoorFeatures.length !== 0 ?
                                                <View style={{ flex:1 }}>
                                                    {this.renderIndoorFeatures(this.state.indoorFeatures)}
                                                </View>

                                                : null}


                                        </View>

                                    </View>
                                 

                                </CardView>

                        }


                    </View>

                </KeyboardAwareScrollView>

                
                {
                    this.state.isContactSpinnerVisible ?
                        <View style={{
                            flex: 1,
                            left: 0,
                            right: 0,
                            top: DEVICE_WIDTH / 1.2,
                            bottom: 0,
                            position: 'absolute',
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: Colors.TRANSPARENT,
                            width: window.width,
                            height: window.height
                        }}>

                            <BarIndicator color={Colors.END_COLOR} count={5} />
                        </View>:null
                }

                {
                    !this.state.isSpinnerVisible ?
                        this.state.contactInfo ?
                            this.renderRequestButton(this.state.contactInfo)
                            : (<View style={{ alignItems: "center" }}>
                                <TouchableOpacity
                                    onPress={() => this.sendContactRequest()}
                                    activeOpacity={0.5}>
                                    <LinearGradient
                                        colors={[Colors.START_COLOR, Colors.END_COLOR]}
                                        style={PropertyDetailScreenStyle.roundedButtonStyleAppTheme}>
                                        <Text style={{ color: "white" }}> {Strings.BUTTON_TEXT_SEND_REQUEST} </Text>
                                    </LinearGradient>
                                </TouchableOpacity>
                            </View>)    
                    :null
                }   
           
            </View>
        );
    }

    _handleTextReady = () => {
        console.log('ready!');
    }

}

function mapStateToProps(state) {

    return {
        PropertyDetailReducer: state.PropertyDetailReducer
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ getPropertyDetail }, dispatch);
}



export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PropertyDetailScreen);