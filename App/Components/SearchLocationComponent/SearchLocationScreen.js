import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  View,
  SafeAreaView,
  Image,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
  TextInput,
  ScrollView,
  AsyncStorage,
  ImageEditor,
  TouchableWithoutFeedback,
  Dimensions,
  KeyboardAvoidingView,
  Linking,
  Keyboard,
  TouchableHighlight,
  PermissionsAndroid,

} from 'react-native';
import Modal from "react-native-modal";
import {
  loginUser,
} from "../../Action/ActionCreators";


import { bindActionCreators } from "redux";
import { Actions } from 'react-native-router-flux';
import Colors from '../../Constants/Colors';
import Strings from '../../Constants/Strings';
import API from "../../Constants/APIUrls";



import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import {
  BarIndicator,
} from 'react-native-indicators';
import OfflineNotice from "../../Utils/OfflineNotice";
import DeviceInfo from "react-native-device-info";

import SearchLocationScreenStyle from "../SearchLocationComponent/SearchLocationScreenStyle";
import { Avatar, Divider, Text, CheckBox } from "react-native-elements";
import CardView from "react-native-cardview";
import FastImage from "react-native-fast-image";
import LinearGradient from "react-native-linear-gradient";
import RangeSlider from "react-native-range-slider";
import Geocoder from "react-native-geocoder";
import RNGooglePlaces from "react-native-google-places";
import { showErrorMessage } from "../../Utils/Validations"
import MultiSlider from "@ptomasroos/react-native-multi-slider";
const DEVICE_WIDTH = Dimensions.get("window").width;
const DEVICE_HEIGHT = Dimensions.get("window").height;
import { RNChipView } from "react-native-chip-view";
import Icon from "react-native-vector-icons/FontAwesome";
import SearchInput, { createFilter } from "react-native-search-filter";
import MultiSelect from "react-native-multiple-select";
import { Header } from "react-native-elements";
import HeaderScreenStyle from "../CommonComponent/HeaderStyle";
import TagInput from "react-native-tag-input";
import CompleteFlatList from "react-native-complete-flatlist";
import { Dropdown } from "react-native-material-dropdown";


var customData = require("../../Utils/Aus_Vic_Postcodes.json");
const KEYS_TO_FILTERS = ["name", "postcode"];
const items = [];

var data = [];

var DeviceType = DEVICE_HEIGHT / DEVICE_WIDTH > 1.6 ? "Phone" : "Tablet";

class SearchLocationScreen extends Component {
  constructor() {
    super();

    if(data.length == 0){
      this.getAllNumbersBetween(0, 500, 25);
    }

    this.state = {
      checked: false,
      email: "",
      password: "",
      address: "",
      visible: false,
      isSpinnerVisible: false,
      sliderOneChanging: false,
      sliderOneValue: [5],
      multiSliderValue: [3, 7],
      lat: "",
      lang: "",
      minPrice: "",
      minPriceValue:Strings.minPrice,
      maxPrice: "",
      maxPriceValue: Strings.maxPrice,
      priceRangeLabel: "Any Price",
      suggestions: customData,
      tagsSelected: [],
      selectedItems: [],
      searchTerm: "",
      tags: [],
      isModalVisible: false,
      step:25,
      isSuburbListVisible:true
    };
     
  //  this.onChangeMin = this.onChangeMin.bind(this);
   // this.onChangeMax = this.onChangeMax.bind(this);
   

  }
  async componentWillMount(){
    if (Platform.OS === 'android') {
      this.requestLocationPermission();
    }
    
  }


  getAllNumbersBetween(x) { 
  console.log("Value >>>"+x)
   if (x === 16000) {
     return;
   } else {
      if (x < 500) {
        data.push({
          "id": x,
          "value": "$"+x+"k",
        })
        return this.getAllNumbersBetween(x + 25);
      } else if (x < 1000) {
        data.push({
          "id": x,
          "value": "$" + x + "k",
        })
        return this.getAllNumbersBetween(x + 50);
      } else if (x < 2000) {
        data.push({
          "id": x,
          "value": "$" + x/1000 + "M",
        })
        return this.getAllNumbersBetween(x + 100);
      } else if (x < 3000) {
        data.push({
          "id": x,
          "value": "$" + x / 1000 + "M",
        })
        return this.getAllNumbersBetween(x + 250);
      } else if (x < 5000) {
        data.push({
          "id": x,
          "value": "$" + x / 1000 + "M",
        })
        return this.getAllNumbersBetween(x + 500);
      } else if (x < 16000) {
        data.push({
          "id": x,
          "value": "$" + x / 1000 + "M",
        })
        return this.getAllNumbersBetween(x + 1000);
      }
    
    }
  }

  



   updateRef(name, ref) {
      this[name] = ref;
    }

  componentWillReceiveProps(nextProps) {
    this._changeLoadingState(false);
  }

  onSubmit(){

    if (this.state.tags.length === 0) {
      showErrorMessage("Please add at least one suburb or postcode");
    } 
    // else if (!this.state.minPrice && !this.state.maxPrice){
    //   showErrorMessage("Please provide minimum and maximum range");
    // } else if (!this.state.minPrice){
    //   showErrorMessage("Please provide minimum range");
    // } else if (!this.state.maxPrice) {
    //   showErrorMessage("Please provide maximum range");
    // } else if (this.state.minPriceValue > this.state.maxPriceValue) {
    //   showErrorMessage("Minimum range cannot be greater than Maximum range");
    // } 
    else {

      let zipArray = [];
      for (let i = 0; i < this.state.tags.length; i++) {
        let val = this.state.tags[i];
        let myZip = val.split(" ");
        zipArray.push(myZip[myZip.length - 1]);
      }

      let minPrice=this.state.minPriceValue ? this.state.minPriceValue:0;
      let maxPrice = this.state.maxPriceValue ? (this.state.maxPriceValue):0;
      
      var postData = {
        filter: {
          zipcode: zipArray,
          nearBy: this.state.checked,
          price_range: [minPrice, maxPrice],
          no_of_bathroom: "",
          no_of_bedroom: "",
          property_type: [],
          car_space: "",
          land_size: "",
          keywords: ""
        }
      };


      console.log("On Submit Data >>>>>" + JSON.stringify(postData));
      this._storeUserData(Strings.KEY_FILTER_DATA, JSON.stringify(postData));




    }
    //  Actions.dashboardScreen();
  };

  _storeUserData = async (key, value) => {
    try {
      const resp = await AsyncStorage.setItem(key, value);

      Actions.dashboardScreen({ type: "reset" });
    } catch (error) {
      // Error saving data
      console.log("Async Error >> " + error);
    }
  };

  _changeLoadingState(loadingState) {
    this.setState({
      isSpinnerVisible: loadingState
    });
  }

  goToLogin = () => {
    Actions.signInScreen({ type: "reset" });
  };

  openSearchModal() {
    console.log("In openSearchModal >>>>>");
    RNGooglePlaces.openAutocompleteModal()
      .then(place => {
        console.log("Place Info >> " + JSON.stringify(place));
        // place represents user's selection from the
        // suggestions and it is a simplified Google Place object.

        this.setState({
          address: place.address,
          lat: place.latitude,
          lang: place.longitude
        });
      })
      .catch(error => console.log(error.message)); // error is a Javascript Error object
  }

  getCurrentLocation() {
    setTimeout(() => {
      RNGooglePlaces.getCurrentPlace()
        .then(results =>
          console.log("Get Current Location >>> " + JSON.stringify(results))
        )
        .catch(error => console.log("Error >>>>" + error.message));
    }, 0);
  }

  _onChangePriceSlider(data) {
    let min = data[0];
    let max = data[1];

    
    this.setState({
      minPrice: min,
      maxPrice: max
    });

    console.log("_onChangePriceSlider " + min + " " + max);

    if (min === Strings.MIN_PRICE && max === Strings.MAX_PRICE) {
      this.setState({
        priceRangeLabel: "Any Price"
      });
      this.setState({
        minPrice: Strings.MIN_PRICE,
        maxPrice: Strings.MAX_PRICE
      });
    } else if (min !== Strings.MIN_PRICE && max === Strings.MAX_PRICE) {
      if (min < 100) {
        this.setState({
          priceRangeLabel: "Above $" + min * 10 + "k"
        });
      }else{
        this.setState({ priceRangeLabel: "Above $" + min/100  + "M" });
      } 
      
    }
    else if (min === Strings.MIN_PRICE && max !== Strings.MAX_PRICE) {
      if (max < 100) {
        this.setState({
          priceRangeLabel: "Above $" + max * 10 + "k"
        });
      } else {
        this.setState({ priceRangeLabel: "Above $" + max / 100 + "M" });
      }

    } else if (min !== Strings.MIN_PRICE && max !== Strings.MAX_PRICE){
       let finalMin = min;
       let finalMax = max;

       if(finalMin<100){
          finalMin=finalMin * 10 + "k"
       }else{
         finalMin = finalMin/100 + "M"
       }

      if (finalMax < 100) {
        finalMax = finalMax * 10 + "k";
      } else {
        finalMax = finalMax / 100 + "M";
      }

      this.setState({
        priceRangeLabel: "$"+finalMin + " - " + "$"+finalMax
      });

    }
    //   if (max < 1000) {
    //     this.setState({
    //       priceRangeLabel: "Up to $" + max + "k"
    //     });

    //   } else {
    //     let roundedValue = parseFloat(Math.round((max / 100000) * 100) / 100)
    //       .toFixed(1)
    //       .replace(/\.0+$/, "");
    //     this.setState({
    //       priceRangeLabel: "Up to $" + roundedValue + "M"
    //     });
    //   }
    //   this.setState({
    //     minPrice: Strings.MIN_PRICE,
    //     maxPrice: max
    //   });

    // } else if (min !== Strings.MIN_PRICE && max === Strings.MAX_PRICE) {
    //   if (min < 1000) {
    //     this.setState({
    //       priceRangeLabel: "Above $" + min + "k"
    //     });
    //   } else {
    //     let roundedValue = parseFloat(Math.round((min / 100000) * 100) / 100)
    //       .toFixed(1)
    //       .replace(/\.0+$/, "");
    //     this.setState({
    //       priceRangeLabel: "Above $" + roundedValue + "M"
    //     });
    //   }

    //   this.setState({
    //     minPrice: min,
    //     maxPrice: Strings.MAX_PRICE
    //   });

    // } else {
    //   var finalMin = min;
    //   var finalMax = max;

    //   if (min < 1000) {
    //     finalMin = "$" + min + "k";
    //   } else {
    //     let roundedValue = parseFloat(Math.round((min / 100000) * 100) / 100)
    //       .toFixed(1)
    //       .replace(/\.0+$/, "");
    //     finalMin = "$" + roundedValue + "M";
    //   }

    //   if (max < 1000) {
    //     finalMin = "$" + max + "k";
    //   } else {
    //     let roundedValue = parseFloat(Math.round((max / 100000) * 100) / 100)
    //       .toFixed(1)
    //       .replace(/\.0+$/, "");
    //     finalMax = "$" + roundedValue + "M";
    //   }

    //   this.setState({
    //     priceRangeLabel: finalMin + " - " + finalMax
    //   });

    //   this.setState({
    //     minPrice: min,
    //     maxPrice: max
    //   });
    // }
  }

  searchUpdated(term) {
    this.setState({ searchTerm: term });
  }

  renderLeftFilterComponent() {
    // return (
    //   <TouchableOpacity
    //     hitSlop={HeaderScreenStyle.touchableAreaStyle}
    //     onPress={() => console.log("")}
    //   >
    //     <Image source={require("../../Assets/help.png")} />
    //   </TouchableOpacity>
    // );
  }

  renderCenterFilterOne() {
    return (
      <View>
        <Text style={styles.titleTextStyle}>
          {this.state.isSuburbListVisible ? Strings.PROPERTY_FILTER_SCREEN_TITLE : "Help"}
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

  _toggleModal() {
    console.log("In _toggleModal");
    this.setState({
      isModalVisible: !this.state.isModalVisible
    });
  }

  cell(data, index) {
    let myVal = data.name + " " + data.postcode;
    let valExists = this.state.tags.includes(myVal);
    return (
      <TouchableOpacity
        onPress={() => this.onItemSelected(data)}
        key={index}
        style={[styles.emailItem, { backgroundColor: valExists ? Colors.COLOR_PRIMARY : null }]}>
        <View style={{ margin: 10 }}>
          <Text style={{ color: valExists ? Colors.WHITE : Colors.COMMENT_TEXT_COLOR }}>{data.name}</Text>
          <Text style={[styles.emailSubject, { color: valExists ? Colors.WHITE : Colors.COMMENT_TEXT_COLOR }]}>
            {data.postcode}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  renderModal() {
    return (
      <Modal
        useNativeDriver={Platform.OS === 'android'?true:false}
        style={{ backgroundColor: "#FFF",flex:this.state.isSuburbListVisible?1:0 }}
        isVisible={this.state.isModalVisible}
        onBackdropPress={() => this.setState({ isVisible: false })}>
        <View style={{ flex: this.state.isSuburbListVisible ? 1 : null,  margin: 10 }}>
          
            <Header
              backgroundColor={"#fff"}
              leftComponent={this.renderLeftFilterComponent()}
              centerComponent={this.renderCenterFilterOne()}
              rightComponent={this.renderRightFilterOne()}
            />
          
          <View style={{ flex: this.state.isSuburbListVisible ? 1 : null}} >
            {this.state.isSuburbListVisible?(
              <CompleteFlatList
                searchKey={['name', 'postcode']}
                placeholder={Strings.PLACEHOLDER_LOCATION_SEARCH}
                // highlightColor={Colors.COLOR_PRIMARY_DARK}
                data={customData}
                renderSeparator={(sectionId, rowId) => <View key={rowId} style={styles.defaultSeparator} />}
                renderItem={this.cell.bind(this)}
              />

            ) : (<View style={{ flex: this.state.isSuburbListVisible ? 1 : null,margin:20}}>
                  <Text style={{fontWeight:"bold",color:Colors.grey_800}}>
                  {"Found your ideal property! That’s great!"}
                  </Text>
                  <Text style={{fontWeight:"400",color:Colors.grey_800,marginTop:10,marginBottom:10}}>
                  {"1. Click CONTACT SELLER, located at the bottom of the ‘Property Detail’ page."}
                  </Text>
                 <Text style={{fontWeight:"400",color:Colors.grey_800,marginTop:10,marginBottom:10}}>
                    {"2. Once your request has been accepted you can ‘Chat’ directly with the seller in real time and ‘Book Your Inspection’ all from the app. "}
                 </Text>
                 <Text style={{fontWeight:"400",color:Colors.grey_800,marginTop:10,marginBottom:10}}>
                  {"It’s that easy!! "}
                 </Text>
              </View>
            )}
            
          </View>
        </View>
      </Modal>
    );
  }

  onSelectedItemsChange = selectedItems => {
    this.setState({ selectedItems });
  };

  onItemSelected(item) {

    let myVal = item.name + " " + item.postcode;
    console.log("myVal  " + JSON.stringify(myVal))

    let tagArray = this.state.tags;
    console.log("Tag Array  " + JSON.stringify(tagArray))
    console.log("Includes >>>> " + tagArray.includes(myVal));

    if (tagArray.includes(myVal)) {
      alert("Suburb Already Added !!")
    } else {
      this.state.tags.push(item.name + " " + item.postcode);
      this._toggleModal();
    }
    //this.setState({ tags: [...this.state.tags, item.name+" "+item.postcode] });
    console.log(
      "onItemSelected >>>> " + JSON.stringify(this.state.tags)
    );
  }

  onChangeTags = tags => {
    this.setState({ tags });

    console.log("On Change Tag >>>> " + JSON.stringify(this.state.tags))
  };

  onChangeText = text => {
    this.setState({ text });

    const lastTyped = text.charAt(text.length - 1);
    const parseWhen = [",", " ", ";", "\n"];

    if (parseWhen.indexOf(lastTyped) > -1) {
      this.setState({
        tags: [...this.state.tags, this.state.text],
        text: ""
      });
    }
    console.log("On Change Text >>>>" + JSON.stringify(this.state.tags))
  };

  labelExtractor = tag => tag;


  async  requestLocationPermission() {
  
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('You can access the location');
    } else {
      console.log('You cannot access');
    }
 
    console.warn(err);
  
  return granted;
}

  render() {
    //console.log("Screen Height in >>>>>"+DEVICE_WIDTH/DEVICE_HEIGHT)
    
    return (
      <SafeAreaView style={{flex:1}}>
      <View style={{ flex: 1, backgroundColor: "#F6F6F6" }}>
        <OfflineNotice />

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
            <BarIndicator color={Colors.WHITE} count={4} />
          </View>
        ) : null}

        <KeyboardAwareScrollView
          resetScrollToCoords={{ x: 0, y: 0 }}
          scrollEnabled={true}
          extraHeight={40}
          extraScrollHeight={40}
          keyboardShouldPersistTaps="handled"
          enableAutoAutomaticScroll={false}
          enableOnAndroid={true}>
          <View style={{ flex: 1, marginTop: 50, marginBottom: 20 }}>
            <Text style={{ color: "#545454", marginLeft: 25 }} h3>
              Hi There!
            </Text>

            <Text style={{ color: "#545454", marginLeft: 25 }} h3>
              Let’s find your home
            </Text>
          </View>

          <View style={{ flex: 1, margin: 5 }}>
            <CardView
              style={{ backgroundColor: Colors.WHITE, margin: 5, padding: 5 }}
              cardElevation={10}
              cornerRadius={5}
            >
              <View style={{ margin: 20 }}>
                <View style={{flex:1,flexDirection:"row"}}>
                  <View style={{flex:0.9}}>
                      <Text style={{ color: "#545454", fontSize: 18 }}>
                        Preferred Locations
                      </Text>
                  </View>
                  <View style={{flex:0.1}}>
                      <Icon
                        raised
                        type='font-awesome'
                        size={24}
                        name="question-circle"
                        reverseColor={Colors.BLUE}
                        color={Colors.COLOR_CUTTY_SHARK}
                        onPress={() => {
                          this.setState({
                            isSuburbListVisible:false
                          })
                          this._toggleModal();
                        }}

                        />
                  </View>

                </View>
                
              </View>
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={() => {
                  this.setState({
                    isSuburbListVisible: true
                  })
                  this._toggleModal()
                  }}>
                <LinearGradient
                  colors={[Colors.START_COLOR, Colors.END_COLOR]}
                  style={SearchLocationScreenStyle.roundedButtonStyleAppTheme}
                >
                  <View style={{ flexDirection: "row", padding: 10 }}>
                    <Text
                      style={{
                        color: Colors.WHITE,
                        fontWeight: "400",
                        marginLeft: 5
                      }}
                    >
                      {"Add Suburbs"}
                    </Text>
                  </View>
                </LinearGradient>
              </TouchableOpacity>

              {this.state.tags.length != 0 ? (
                
                <View>
                <View style={{
                flex: 1, borderColor: Colors.BACK_ARROW_COLOR, borderWidth: 1, marginLeft: 10, marginRight: 10, paddingLeft: 10, margin: 10,

                padding: 10,

                color: "#545454",
                // Set border width.
                borderWidth: 1,
                // Set border Hex Color Code Here.
                borderColor: "#E3E3E3",
                // Set border Radius.
                borderRadius: 2,
                //Set background color of Text Input.
                backgroundColor: "transparent"
              }}>
                <TagInput
                  value={this.state.tags}
                  onChange={this.onChangeTags}
                  text={""}
                  labelExtractor={this.labelExtractor}
                  onChangeText={this.onChangeText}
                  tagColor={Colors.COMMENT_TEXT_COLOR}
                  tagTextColor="white"
                  maxHeight={DEVICE_HEIGHT/1.2}
                      tagContainerStyle={{
                        height: DEVICE_HEIGHT / 17, borderRadius: 30,
                        borderWidth: 1,
                        borderColor: Colors.COMMENT_TEXT_COLOR }}
                />
              </View>


                <View style={{ marginLeft: 10 }}>
                  <CheckBox
                    title={"Surrounding Suburbs"}
                    containerStyle={{ justifyContent: 'flex-start', margin: 10, padding: 0, borderWidth: 0, backgroundColor: 'transparent' }}
                    checked={this.state.checked}
                    size={18}
                    textStyle={{ color: Colors.BACK_ARROW_COLOR, fontWeight: "400" }}
                    checkedColor={Colors.BACK_ARROW_COLOR}
                    onIconPress={checked => this.setState({ checked: !this.state.checked, modalVisible: false })}
                    onPress={checked => this.setState({ checked: !this.state.checked, modalVisible: false })}
                  />
                </View>
                </View>
):(
  <View style={{justifyContent:"center",alignItems:"center",alignContent:"center",alignSelf:"center",margin:10}}>
      <Text style={{justifyContent:"center",alignItems:"center",alignContent:"center",alignSelf:"center",color:Colors.COLOR_CUTTY_SHARK}}>
        {Strings.DEMO_TEXT}
      </Text>
  </View>
)}       

              



            </CardView>
          </View>

          <View style={{ flex: 1, margin: 5 }}>
            <CardView
              style={{ backgroundColor: Colors.WHITE, margin: 5 }}
              cardElevation={10}
              cornerRadius={5}
            >
              <View style={{ margin: 20, flexDirection: "column" }}>
                <Text
                  style={{ color: "#545454", fontSize: 18, fontWeight: "bold" }}
                >
                  Price Range
                </Text>
{/* 
                <View
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    marginTop: 10,
                    marginBottom: 20,
                    alignContent: "center",
                    alignSelf: "center",
                    alignItems: "center"
                  }}>
                  <Text style={{ marginTop: 20, fontWeight: "500" }}>
                    {this.state.priceRangeLabel}
                  </Text>
                </View> */}

                <View
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    justifyContent: "center",
                    zIndex: -1
                  }}
                >
                  {/* <MultiSlider
                    isMarkersSeparated={true}
                    values={[this.state.minPrice, this.state.maxPrice]}
                    sliderLength={DEVICE_WIDTH / 1.4}
                    onValuesChange={data => this._onChangePriceSlider(data)}
                    min={Strings.MIN_PRICE}
                    max={Strings.MAX_PRICE}
                    step={1}
                    markerStyle={{
                      height: 18,
                      width: 18,
                      borderRadius: 10,
                      backgroundColor: 'white',
                    }}
                    allowOverlap={false}
                    snapped
                    selectedStyle={{
                      backgroundColor: "#50E3C2"
                    }}
                  /> */}
                    <Dropdown
                      ref='picker'
                      containerStyle={{flex:0.5,margin:5}}
                      label='Minimum'
                      value={this.state.minPrice}
                      onChangeText={(text) => {
                       

                       var resultMin = data.filter(obj => {
                            return obj.value === text
                       })
                        this.setState({
                          minPrice: text,
                          minPriceValue:resultMin[0].id
                        });


                      }}
                      textColor={Colors.COLOR_CUTTY_SHARK}
                      labelFontSize={14}
                      data={data}
                      itemCount={(DeviceType == 'Tablet') ? 10 : 5}
                    />
                    <Dropdown
                      ref={(ref) => this.maxDropDown = ref}
                      containerStyle={{ flex: 0.5,margin:5 }}
                      value={this.state.maxPrice}
                      onChangeText={(text) => {

                        var resultMax = data.filter(obj => {
                          return obj.value === text
                        })
                        this.setState({
                          maxPrice: text,
                          maxPriceValue: resultMax[0].id
                        });
                      
                      }}
                      textColor={Colors.COLOR_CUTTY_SHARK}
                      label='Maximum'
                      labelFontSize={14}
                      data={data}
                      itemCount={(DeviceType == 'Tablet') ? 10 : 5}
                    />
                </View>
              </View>
            </CardView>
          </View>
        </KeyboardAwareScrollView>
        <TouchableOpacity activeOpacity={0.5} onPress={() => {
            if (Platform.OS === 'android'){
              if (this.requestLocationPermission()){
                  this.onSubmit()
                }else{
                this.requestLocationPermission();
                }
            }else{
              this.onSubmit()
            }
            
        } }>
          <LinearGradient
            colors={[Colors.START_COLOR, Colors.END_COLOR]}
            style={SearchLocationScreenStyle.squareButtonStyleAppTheme}
          >
            <View style={{ flexDirection: "row", padding: 10 }}>
              <Text
                style={{
                  color: Colors.WHITE,
                  fontWeight: "bold",
                  marginLeft: 5
                }}
              >
                {" "}
                {"DONE"}{" "}
              </Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>
        {this.renderModal()}
      </View>
      </SafeAreaView>
    );
  }

  handleClick(){
    Linking.canOpenURL(API.BUYER_LOGIN).then(supported => {
      if (supported) {
        Linking.openURL(API.BUYER_LOGIN);
      } else {
        console.log("Don't know how to open URI: " + API.BUYER_LOGIN);
      }
    });
  };

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
  autocompleteContainer: {
    width: DEVICE_WIDTH / 1.2,
    left: 0,
    backgroundColor: "transparent",
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 1
  },
  emailItem: {
    borderBottomWidth: 0.5,
    borderColor: 'rgba(0,0,0,0.3)',
    padding: 10
  },
  emailSubject: {
    color: 'rgba(0,0,0,0.5)'
  },
  searchInput: {
    padding: 10,
    borderColor: '#CCC',
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
  flatList: { height: "100%", width: "100%", backgroundColor: "transparent" }
});


function mapStateToProps(state) {

  return {
    SignInReducer: state.SignInReducer
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ loginUser }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchLocationScreen);


