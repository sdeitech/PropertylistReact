import React, { Component } from "react";
import { connect } from "react-redux";
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
  ImageEditor,
  TouchableWithoutFeedback,
  Dimensions,
  Picker,
  KeyboardAvoidingView,
  Linking,
  Keyboard,
  TouchableHighlight
} from "react-native";

import {
  clearPropertyListResponse,
  getAllPropertyList,
  getFilteredPropertyList
} from "../../Action/ActionCreators";

import { bindActionCreators } from "redux";
import { Actions } from "react-native-router-flux";
import Colors from "../../Constants/Colors";
import Strings from "../../Constants/Strings";
import LinearGradient from "react-native-linear-gradient";
import {
  validateEmail,
  showErrorMessage,
  commafy
} from "../../Utils/Validations";
import HeaderScreen from "../CommonComponent/HeaderScreen";

import { BarIndicator } from "react-native-indicators";
import OfflineNotice from "../../Utils/OfflineNotice";
import DeviceInfo from "react-native-device-info";
import { Icon, Avatar } from "react-native-elements";

import Home from "../../Assets/my_property.png";
import Saved from "../../Assets/001-arrows.png";
import Chat from "../../Assets/002-communication.png";
import Notification from "../../Assets/002-notification.png";
import More from "../../Assets/more.png";
import CardView from "react-native-cardview";
import ProprertyListingScreenStyle from "../PropertyListingComponent/ProprertyListingScreenStyle";
import STRINGS from "../../Constants/Strings";
import FastImage from "react-native-fast-image";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import {
  ifIphoneX,
  getStatusBarHeight,
  getBottomSpace
} from "react-native-iphone-x-helper";
import { Header } from "react-native-elements";
import HeaderScreenStyle from "../CommonComponent/HeaderStyle";
import Modal from "react-native-modal";
import FilterListScreenStyle from "../FilterListComponent/FilterListScreenStyle";
import { Dropdown } from "react-native-material-dropdown";
import RNGooglePlaces from "react-native-google-places";
import RangeSlider from "react-native-range-slider";
import API from "../../Constants/APIUrls";
import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps";
const DEVICE_WIDTH = Dimensions.get("window").width;
const DEVICE_HEIGHT = Dimensions.get("window").height;
import CompleteFlatList from "react-native-complete-flatlist";

const ASPECT_RATIO = DEVICE_WIDTH / DEVICE_HEIGHT;
const LATITUDE_DELTA = 0.855;
const LONGITUDE_DELTA = 0.844;

class ProprertySearchScreen extends Component {
  constructor() {
    super();
    this.onChangeText = this.onChangeText.bind(this);
    this.state = {
      checked: true,
      email: "",
      password: "",
      visible: false,
      isSpinnerVisible: false,
      activeTab: Strings.HOME_KEY,
      is_active: true,
      propertyData: [],
      isModalVisible: false,
      address: "",
      lat: -37.814,
      lang: 144.96332,
      minPrice: 0,
      maxPrice: 8000000,
      lat: 0,
      lang: 0,
      region: "",
      selectedPropertyType: "",
      selectedNumberOfBedroom: "",
      selectedNumberOfBathroom: "",
      selectedCarSpace: false,
      selectedItems: [],
      mapData: [],
      selectedMarkerData: [],
      propID: "",
      propPrice: "",
      propType: "",
      propAddress: "",
      propBathroom: "",
      propBedroom: "",
      propGarage: "",
      propLandSize: "",
      isPropSaved: ""
    };
  }

  onChangeText(text) {
    console.log("Selected PropertyType >>>" + JSON.stringify(text));
    this.setState({
      selectedPropertyType: text
    });
  }

  componentWillMount() {
    console.log("ProprertyListingScreen >>>>>" + JSON.stringify(this.props));

    if (this.props.filterData !== undefined && this.props.filterData !== "") {
      this._getUserData(this.props.filterData);
    } else {
      this._getFilterData();
    }
  }

  // componentDidMount() {

  //   this.refs.MapView.fitToElements(true);
  //   this.refs.MapView.setZoom(map.getZoom() - 1);

  //   // set a minimum zoom
  //   // if you got only 1 marker or all markers are on the same address map will be zoomed too much.
  //   if (this.refs.MapView.getZoom() > 15) {
  //     this.refs.MapView.setZoom(15);
  //   }
  // }

  _getFilterData() {
    AsyncStorage.getItem(Strings.KEY_FILTER_DATA)
      .then(value => {
        if (value) {
          var filterData = JSON.parse(value);
          console.log("==== Filter Data ===", filterData);

          //this.setState({ userInfo: userData });
          this._changeLoadingState(true);

          this._getUserData(filterData);
        }
      })
      .done();
  }

  _getUserData(filterData) {
    AsyncStorage.getItem(Strings.KEY_USER_DATA)
      .then(value => {
        if (value) {
          var userData = JSON.parse(value);
          console.log("==== UserData ===", userData);

          //this.setState({ userInfo: userData });

          this._changeLoadingState(true);

          this.props.getAllPropertyList(filterData, userData.token);
        }
      })
      .done();
  }

  componentWillReceiveProps(nextProps) {
    this._changeLoadingState(false);
    console.log(
      "ProprertySearchScreen componentWillReceiveProps >>>>> " +
        JSON.stringify(nextProps)
    );

    let propListResponse = nextProps.PropertyListingReducer.propertyListRes;
    let propListFilterResponse =
      nextProps.PropertyListingReducer.propertyFilteredRes;

    if (propListResponse !== undefined && propListResponse !== "") {
      if (propListResponse.code === STRINGS.STATUS_OK) {
        this.setState({
          propertyData: propListResponse.data.data
        });

        let propArray = propListResponse.data.data;

        let zipArray = [];

        for (let i = 0; i < propArray.length; i++) {
          let lat =
            propArray[i].propertyInfo.length != 0
              ? propArray[i].propertyInfo[0].lat
              : 0;
          let lng =
            propArray[i].propertyInfo.length != 0
              ? propArray[i].propertyInfo[0].lng
              : 0;
          let zipcode =
            propArray[i].propertyInfo.length != 0
              ? propArray[i].propertyInfo[0].zipcode
              : 0;

          let zipJson = {
            lat: lat,
            lng: lng,
            zipcode: zipcode,
            zipPropArray: []
          };

          if (zipArray.some(e => e.zipcode === zipcode)) {
            /* vendors contains the element we're looking for */
            console.log("Exists >>> ");
          } else {
            console.log("Not Exists >>> ");
            zipArray.push(zipJson);
          }

          if (zipArray.length !== 0) {
            for (let k = 0; k < zipArray.length; k++) {
              if (zipArray[k].zipcode === zipcode) {
                zipArray[k].zipPropArray.push(propArray[i]);
              }
            }
          }
        }
        this.setState({
          mapData: zipArray
        });
        console.log("ZipJson >>>>>" + JSON.stringify(zipArray));
      } else {
        alert(propListResponse.message);
      }
    } else if (
      propListFilterResponse !== undefined &&
      propListFilterResponse !== ""
    ) {
      if (propListFilterResponse.code === Strings.STATUS_OK) {
        this.setState({
          propertyData: propListFilterResponse.data.data
        });
      }
    }
  }

  //------------------------- Property List Modal-------------------------------//

  renderLeftFilterComponent() {
    return (
      <TouchableOpacity
        hitSlop={HeaderScreenStyle.touchableAreaStyle}
        onPress={() => console.log("")}
      >
        <Image source={require("../../Assets/help.png")} />
      </TouchableOpacity>
    );
  }

  renderCenterFilterOne() {
    return (
      <View>
        <Text style={styles.titleTextStyle}>
          {Strings.PROPERTY_FILTER_SCREEN_TITLE}
        </Text>
      </View>
    );
  }

  renderRightFilterOne() {
    return (
      <TouchableOpacity
        hitSlop={HeaderScreenStyle.touchableAreaStyle}
        onPress={() => this._toggleModal()}
      >
        {/* <Image source={require("../../Assets/filter.png")} /> */}
        <Icon
          name="times-circle"
          type="font-awesome"
          size={24}
          color={Colors.COLOR_CUTTY_SHARK}
          onPress={() => this._toggleModal()}
        />
      </TouchableOpacity>
    );
  }

  renderModal() {
    return (
      <Modal
        style={{ backgroundColor: "#FFF" }}
        isVisible={this.state.isModalVisible}
        onBackdropPress={() => this.setState({ isVisible: false })}
      >
        <View style={{ flex: 1, margin: 10 }}>
          <View style={styles.header}>
            <Header
              backgroundColor={"#fff"}
              leftComponent={this.renderLeftFilterComponent()}
              centerComponent={this.renderCenterFilterOne()}
              rightComponent={this.renderRightFilterOne()}
            />
          </View>
          <View style={{ flex: 1 }}>
            {console.log(
              "Render Modal List Data >>>> " +
                JSON.stringify(this.state.selectedMarkerData)
            )}
            <CompleteFlatList
              searchKey={["prop_description", "address"]}
              placeholder={Strings.PLACEHOLDER_LOCATION_SEARCH}
              // highlightColor={Colors.COLOR_PRIMARY_DARK}
              data={this.state.selectedMarkerData}
              renderSeparator={(sectionId, rowId) => (
                <View key={rowId} style={styles.defaultSeparator} />
              )}
              renderItem={this.cell.bind(this)}
            />
          </View>
        </View>
      </Modal>
    );
  }

  cell(data, index) {
    console.log("Cell >>> " + JSON.stringify(data.propertyInfo[0].address));

    return (
      <TouchableOpacity
        onPress={() => this.navigateToPropertyDetail(data)}
        key={index}
        style={[styles.emailItem]}
      >
        <View style={{ margin: 10 }}>
          <Text
            style={{
              color: Colors.COMMENT_TEXT_COLOR
            }}
          >
            {data.propertyInfo[0].property_type}
          </Text>
          <Text
            style={[styles.emailSubject, { color: Colors.COMMENT_TEXT_COLOR }]}
          >
            {data.propertyInfo[0].address}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  //-------------------------END OF Property List Modal-------------------------------//

  _changeLoadingState(loadingState) {
    this.setState({
      isSpinnerVisible: loadingState
    });
  }

  //--------------------------- Header -------------------------------------//

  renderLeftOne() {
    return (
      // <TouchableOpacity
      //   hitSlop={HeaderScreenStyle.touchableAreaStyle}
      //   onPress={() => Actions.searchLocationScreen()}
      // >
      //   <Icon
      //     containerStyle={{
      //       marginTop: 20,
      //       flexDirection: "row",
      //       alignContent: "center",
      //       alignItems: "center",
      //       alignSelf: "center"
      //     }}
      //     name="ios-arrow-back"
      //     type="ionicon"
      //     color={Colors.WHITE}
      //   />
      // </TouchableOpacity>
      null
    );
  }

  renderCenterOne() {
    return (
      <View
        style={{
          alignSelf: "center",
          alignContent: "center",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <Text style={styles.titleTextStyle}>
          {Strings.PROPERTY_HOME_SCREEN_TITLE}
        </Text>
      </View>
    );
  }

  renderRightOne() {
    return (
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          justifyContent: "space-evenly"
        }}
      >
        <TouchableOpacity
          style={{ marginTop: 20 }}
          onPress={() => this._toogleList()}
        >
          <Icon
            name={this.state.isMapView ? "list" : "map"}
            color={Colors.WHITE}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            alignContent: "flex-end",
            alignItems: "flex-end",
            alignSelf: "flex-end"
          }}
          onPress={() => Actions.searchPropertyScreen()}
        >
          <Text
            style={{
              alignSelf: "center",
              color: Colors.WHITE,
              fontWeight: "bold",
              marginLeft: 10
            }}
          >
            {"FILTER"}
          </Text>
          {/* <Icon
            name="ios-funnel"
            type="ionicon"
            
            color={Colors.COLOR_CUTTY_SHARK}
          /> */}
        </TouchableOpacity>
      </View>
    );
  }

  //-------------------------------------------------------------------//

  _toogleList() {
    this.setState({
      isMapView: !this.state.isMapView
    });
  }

  _toggleModal(item) {
    console.log("In _toggleModal " + JSON.stringify(item));
    this.setState({
      isModalVisible: !this.state.isModalVisible,
      selectedMarkerData: item
    });
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <OfflineNotice />
        {/* <HeaderScreen title={Strings.PROPERTY_HOME_SCREEN_TITLE} /> */}
        <View style={styles.header}>
          <Header
            containerStyle={{ justifyContent: "space-evenly" }}
            backgroundColor={Colors.COLOR_PRIMARY}
            leftComponent={this.renderLeftOne()}
            centerComponent={this.renderCenterOne()}
            rightComponent={this.renderRightOne()}
          />
        </View>

        <View style={{ flex: 1 }}>
          {this.state.propertyData.length ? (
            <View>
              {this.state.isMapView
                ? this.renderMapView()
                : this.renderListView()}
              {/* <TouchableOpacity
                onPress={() => this._toogleList()}
                style={{
                  borderWidth: 1,
                  borderColor: "rgba(0,0,0,0.2)",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 50,
                  position: "absolute",
                  top: DEVICE_HEIGHT / 1.4,
                  bottom: 10,
                  right: 10,
                  height: 50,
                  backgroundColor: "#fff",
                  borderRadius: 100
                }}
              >
                <Icon
                  name={this.state.isMapView ? "list" : "map"}
                  size={30}
                  color="#01a699"
                />
              </TouchableOpacity> */}
            </View>
          ) : (
            <View style={ProprertyListingScreenStyle.emptyListStyle}>
              <Text style={ProprertyListingScreenStyle.emptyMessageStyle}>
                {this.state.isSpinnerVisible ? "" : Strings.PROPERTY_LIST_EMPTY}
              </Text>
            </View>
          )}
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
        </View>
        {this.renderModal()}
      </View>
    );
  }

  renderListView() {
    return (
      <View>
        <FlatList
          style={{ marginTop: 10 }}
          data={this.state.propertyData}
          numColumns={1}
          renderItem={({ item, index }) => this._renderItem(item, index)}
        />
      </View>
    );
  }

  renderMapView() {
    var mapData = this.state.mapData;

    return (
      <MapView
        ref={MapView => (this.MapView = MapView)}
        style={styles.map}
        provider="google"
        showsUserLocation={false}
        showsMyLocationButton={false}
        loadingEnabled={true}
        loadingIndicatorColor="#666666"
        loadingBackgroundColor="#eeeeee"
        moveOnMarkerPress={false}
        showsCompass={true}
        showsPointsOfInterest={false}
        initialRegion={{
          latitude: -37.814,
          longitude: 144.96332,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA
        }}
      >
        {console.log("Map Data >>>>>>> " + JSON.stringify(mapData))}
        {mapData.map((marker, index) => (
          <Marker
            key={index}
            onPress={() => this._toggleModal(marker.zipPropArray)}
            // coordinate={marker.coordinate}
            coordinate={{
              latitude: parseFloat(marker.zipPropArray[0].lat),
              longitude: parseFloat(marker.zipPropArray[0].lng)
            }}
          >
            {console.log(
              "Whole Array>>>" +
                JSON.stringify(marker) +
                "Inside Marker >>> Lat >>>" +
                parseFloat(marker.zipPropArray[0].lat) +
                " Longt >>" +
                parseFloat(marker.zipPropArray[0].lng)
            )}
            <View style={{ alignItems: "center", justifyContent: "center" }}>
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  width: 20,
                  height: 20,
                  borderRadius: 20 / 2,
                  backgroundColor: Colors.PROPERTY_TITLE_COLOR
                }}
              >
                <Text
                  style={{
                    color: "white",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "bold"
                  }}
                >
                  {marker.zipPropArray.length.toString()}
                </Text>
              </View>
              <View>
                <Icon
                  size={36}
                  name="map-marker"
                  type="font-awesome"
                  color="red"
                />
              </View>
            </View>
          </Marker>
        ))}
      </MapView>
    );
  }

  onRegionChangeComplete = region => {
    console.log(" region", region);
  };

  navigateToPropertyDetail(item) {
    this._toggleModal();
    this.actionOnRow(item);
  }

  actionOnRow(item) {
    console.log("Selected Item :", JSON.stringify(item));
    Actions.propertyDetailScreen({ propertyID: item.propertyId });
  }

  logoutFromApp() {
    AsyncStorage.removeItem(Strings.KEY_USER_DATA);
    Actions.signInScreen({ type: "reset" });
    // if (this.removeItemValue(Strings.KEY_USER_DATA)) {
    //   Actions.signInScreen({ type: "reset" });
    // }
  }

  _renderItem(item, index) {
    let propID = "";
    let propPrice = "";
    let propType = "";
    let propAddress = "";
    let propBathroom = "0";
    let propBedroom = "0";
    let propGarage = "0";
    let propImage = "";
    let imgUrl = "";

    if (
      item.XMLPropertyInfo !== undefined &&
      item.XMLPropertyInfo !== "" &&
      Object.keys(item.XMLPropertyInfo).length !== 0
    ) {
      xmLFeedData = item.XMLPropertyInfo;

      propID = xmLFeedData.property_id;
      propPrice = commafy(xmLFeedData.priceView);
      propType = xmLFeedData.property_type;
      propAddress = xmLFeedData.address;
      propBathroom = xmLFeedData.bathrooms;
      propBedroom = xmLFeedData.bedrooms;
      propGarage = xmLFeedData.garages;
      propImage = xmLFeedData.images;
      propLandSize = xmLFeedData.landSize;

      if (propImage) {
        imgUrl = API.AWS_PATH + API.AWS_BUCKET + propImage;
      } else {
        if (
          item.propertyMediaInfo !== undefined &&
          item.propertyMediaInfo.length !== 0
        ) {
          imgUrl =
            API.AWS_PATH +
            API.AWS_BUCKET +
            item.propertyMediaInfo[0].image_path +
            "/" +
            item.propertyMediaInfo[0].image_name;
        } else {
          imgUrl = API.DEFAULT_IMAGE_URL + Strings.PROPERTY_DEFAULT_IMAGE;
        }
      }
    } else {
      propID = item._id;
      propPrice = commafy(item.priceView);
      propType = item.property_type;
      propAddress = item.address;
      propBathroom = item.no_of_bathroom;
      propBedroom = item.no_of_bedroom;
      propGarage = item.is_garbage;
      propLandSize = item.landDetailsAreaText;

      if (
        item.propertyMediaInfo !== undefined &&
        item.propertyMediaInfo.length !== 0
      ) {
        imgUrl =
          API.AWS_PATH +
          API.AWS_BUCKET +
          item.propertyMediaInfo[0].image_path +
          "/" +
          item.propertyMediaInfo[0].image_name;
      } else {
        imgUrl = API.DEFAULT_IMAGE_URL + Strings.PROPERTY_DEFAULT_IMAGE;
      }
    }

    console.log("SWAP Img index >>>>> " + index + " Img Url >>>>> " + imgUrl);

    if (item.hasOwnProperty("images")) {
      if (item.images.length !== 0 && item.images[0] !== "") {
        let imgArray = item.images.img;
        for (let i = 0; i < imgArray.length; i++) {
          if (imgArray[i].hasOwnProperty("url")) {
            imgUrl = imgArray[i].url;
            break;
          }
        }
      }
    }

    console.log("Img Url >>>>> " + imgUrl);
    return (
      <TouchableWithoutFeedback onPress={() => this.actionOnRow(item)}>
        <View style={ProprertyListingScreenStyle.propertyListCardItemContainer}>
          <View
            style={{
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10,
              overflow: "hidden"
            }}
          >
            <ImageBackground
              imageStyle={{ borderRadius: 2, overflow: "hidden" }}
              style={{ height: DEVICE_HEIGHT / 4.5, borderRadius: 100 }}
              source={
                imgUrl !== ""
                  ? { uri: imgUrl }
                  : {
                      uri:
                        API.DEFAULT_IMAGE_URL + Strings.PROPERTY_DEFAULT_IMAGE
                    }
              }
              //source={{ uri: (imgUrl !== "") ? imgUrl : "https://picsum.photos/200/300/?blur" }}
            >
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  position: "absolute",
                  bottom: 0,
                  marginBottom: 10,
                  borderTopLeftRadius: 10,
                  borderTopRightRadius: 10
                }}
              >
                <View style={{ flex: 0.02 }}>
                  <Image source={require("../../Assets/Rectangle_4.png")} />
                </View>
                <View style={{ flex: 0.98 }}>
                  <Text style={{ color: "white", fontWeight: "bold" }}>
                    {item.property_unique_id}
                  </Text>
                </View>
              </View>
            </ImageBackground>
          </View>

          <View style={{ flex: 1, flexDirection: "row", margin: 10 }}>
            <View style={{ flex: 0.7 }}>
              <View
                style={{
                  alignContent: "flex-start",
                  alignSelf: "flex-start",
                  alignSelf: "flex-start",
                  justifyContent: "flex-start"
                }}
              >
                <Text
                  style={{
                    color: Colors.grey_900,
                    fontSize: 16,
                    fontWeight: "bold"
                  }}
                >
                  {"$" + propPrice}
                </Text>
              </View>

              <View
                style={{
                  marginTop: 10,
                  alignContent: "flex-start",
                  alignSelf: "flex-start",
                  alignSelf: "flex-start",
                  justifyContent: "flex-start"
                }}
              >
                <Text
                  style={{
                    color: Colors.grey_900,
                    fontSize: 15,
                    fontWeight: "400"
                  }}
                >
                  {propType}
                </Text>
              </View>

              <View
                style={{
                  flex: 0.3,
                  marginTop: 10,
                  alignContent: "flex-start",
                  alignSelf: "flex-start",
                  alignSelf: "flex-start",
                  justifyContent: "flex-start"
                }}
              >
                <Text
                  style={{
                    color: Colors.grey_900,
                    fontSize: 14
                  }}
                >
                  {propAddress}
                </Text>
              </View>

              <View
                style={{
                  marginTop: 10,
                  alignContent: "flex-start",
                  alignSelf: "flex-start",
                  alignSelf: "flex-start",
                  justifyContent: "flex-start"
                }}
              >
                <View>
                  {/* <Text style={{ fontSize: 14, margin: 5 }}>FEATURES:</Text> */}
                  <View style={{ flexDirection: "row" }}>
                    <View style={{ flexDirection: "row" }}>
                      {/* <Image
                                                        style={{ margin: 5 }}
                                                        source={require("../../Assets/bed.png")}
                                                    /> */}
                      <Icon
                        containerStyle={{ marginRight: 5 }}
                        size={16}
                        name="bed"
                        type="font-awesome"
                        color={Colors.COLOR_PRIMARY_DARK}
                      />
                      <Text style={{ fontSize: 14, marginTop: 3 }}>
                        {propBedroom}
                      </Text>
                    </View>
                    <View style={{ flexDirection: "row", marginLeft: 10 }}>
                      <Icon
                        containerStyle={{ marginRight: 5 }}
                        size={16}
                        name="bathtub"
                        type="font-awesome"
                        color={Colors.COLOR_PRIMARY_DARK}
                      />
                      <Text style={{ fontSize: 14, marginTop: 2 }}>
                        {propBathroom}
                      </Text>
                    </View>
                    <View style={{ flexDirection: "row", marginLeft: 10 }}>
                      <Icon
                        containerStyle={{ marginRight: 5 }}
                        size={16}
                        name="car"
                        type="font-awesome"
                        color={Colors.COLOR_PRIMARY_DARK}
                      />
                      <Text
                        style={{ fontSize: 14, marginTop: 2, marginLeft: 5 }}
                      >
                        {propGarage}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
              {propLandSize ? (
                <View style={{ flexDirection: "row", marginTop: 15 }}>
                  <Icon
                    containerStyle={{ marginRight: 5 }}
                    size={18}
                    name="home"
                    type="font-awesome"
                    color={Colors.COLOR_PRIMARY_DARK}
                  />
                  <Text style={{ fontSize: 12, marginTop: 2, marginLeft: 5 }}>
                    {propLandSize + " sqm"}
                  </Text>
                </View>
              ) : null}

              {item.underOffer === "yes" ? (
                <View style={{ flexDirection: "row", marginTop: 15 }}>
                  <Icon
                    containerStyle={{ marginRight: 5 }}
                    size={18}
                    name="file-text-o"
                    type="font-awesome"
                    color={Colors.yellow_900}
                  />
                  <Text
                    style={{
                      fontSize: 12,
                      marginTop: 2,
                      marginLeft: 5,
                      fontWeight: "bold",
                      color: Colors.yellow_900
                    }}
                  >
                    {"This Property is Under Contract"}
                  </Text>
                </View>
              ) : null}
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
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

  titleTextStyle: {
    color: Colors.WHITE,
    fontSize: 15,
    fontWeight: "bold",
    marginLeft: 36
  },
  header: {
    ...ifIphoneX(
      {
        paddingTop: getStatusBarHeight()
      },
      {
        paddingTop: 0
      }
    ),
    justifyContent: "space-evenly"
  },
  textInputStyleClass: {
    // Setting up Hint Align center.
    textAlign: "left",

    // Setting up TextInput height as 50 pixel.
    height: DEVICE_HEIGHT / 18,

    paddingLeft: 10,

    marginTop: 20,

    color: Colors.BACK_ARROW_COLOR,
    // Set border width.
    borderWidth: 1,
    // Set border Hex Color Code Here.
    borderColor: "#E3E3E3",
    // Set border Radius.
    borderRadius: 2,
    //Set background color of Text Input.
    backgroundColor: "transparent"
  },
  textArea: {
    height: 100,
    justifyContent: "flex-start"
  },
  textAreaContainer: {
    borderColor: Colors.TOOLBAR_TEXT,
    borderWidth: 0.5,
    padding: 5,
    marginTop: 15,
    marginBottom: 15
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
    top: 30,
    bottom: 30,
    left: 30,
    right: 30
  },
  map: {
    height: DEVICE_HEIGHT,
    width: DEVICE_WIDTH
  }
});

function mapStateToProps(state) {
  return {
    PropertyListingReducer: state.PropertyListingReducer
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    { getAllPropertyList, getFilteredPropertyList, clearPropertyListResponse },
    dispatch
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProprertySearchScreen);
