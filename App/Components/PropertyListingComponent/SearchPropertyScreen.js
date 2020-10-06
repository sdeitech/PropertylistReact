import React, { Component } from "react";
import { connect } from "react-redux";
import {
  View,
  SafeAreaView,
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
import { validateEmail, showErrorMessage } from "../../Utils/Validations";
import HeaderScreen from "../CommonComponent/HeaderScreen";

import { BarIndicator } from "react-native-indicators";
import OfflineNotice from "../../Utils/OfflineNotice";
import DeviceInfo from "react-native-device-info";
import { Icon, CheckBox } from "react-native-elements";

import Home from "../../Assets/my_property.png";
import Saved from "../../Assets/001-arrows.png";
import Chat from "../../Assets/002-communication.png";
import Notification from "../../Assets/002-notification.png";
import More from "../../Assets/more.png";
import CardView from "react-native-cardview";
import ProprertyListingScreenStyle from "./ProprertyListingScreenStyle";
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
import FilterListScreenStyle from "../FilterListComponent/FilterListScreenStyle";
import { Dropdown } from "react-native-material-dropdown";
import RNGooglePlaces from "react-native-google-places";
import RangeSlider from "react-native-range-slider";
import API from "../../Constants/APIUrls";
import MultiSlider from "@ptomasroos/react-native-multi-slider";
import MultiSelect from "react-native-multiple-select";
import RadioButton from "react-native-radio-button";
import TagInput from "react-native-tag-input";
import CompleteFlatList from "react-native-complete-flatlist";
import SearchLocationScreenStyle from "../SearchLocationComponent/SearchLocationScreenStyle";
import Modal from "react-native-modal";

var customData = require("../../Utils/Aus_Vic_Postcodes.json");
const KEYS_TO_FILTERS = ["name", "postcode"];

const DEVICE_WIDTH = Dimensions.get("window").width;
const DEVICE_HEIGHT = Dimensions.get("window").height;
var DeviceType = DEVICE_HEIGHT / DEVICE_WIDTH > 1.6 ? "Phone" : "Tablet";

const items = [
  {
    id: "All Types",
    name: "All Types"
  },
  {
    id: "House",
    name: "House"
  },
  {
    id: "Townhouse",
    name: "Townhouse"
  },
  {
    id: "Flat/Apartment",
    name: "Flat/Apartment"
  },
  {
    id: "Villa",
    name: "Villa"
  },
  {
    id: "Land",
    name: "Land"
  },
  {
    id: "Acreage",
    name: "Acreage"
  },
  {
    id: "Rural",
    name: "Rural"
  },
  {
    id: "Block of Units",
    name: "Block of Units"
  },
  {
    id: "Retirement Living",
    name: "Retirement Living"
  },
  {
    id: "Off the Plan / Development",
    name: "Off the Plan / Development"
  }
];

var data = [];

class SearchPropertyScreen extends Component {
  constructor() {
    super();
    this.onChangeText = this.onChangeText.bind(this);
    if (data.length == 0) {
      this.getAllNumbersBetween(0, 500, 25);
    }
    this.state = {
      email: "",
      password: "",
      visible: false,
      isSpinnerVisible: false,
      activeTab: Strings.HOME_KEY,
      is_active: true,
      propertyData: [],
      isModalVisible: false,
      address: "",
      lat: "",
      lang: "",
      minPrice: "",
      minPriceValue: Strings.minPrice,
      maxPrice: "",
      maxPriceValue: Strings.maxPrice,
      landSize: "",
      minLandSize: 0,
      maxLandSize: Strings.MAX_LAND_SIZE,
      selectedPropertyType: "",
      selectedNumberOfBedroom: "",
      selectedNumberOfBathroom: "",
      selectedCarSpace: "",
      checked: false,
      excludePropertyChecked: false,
      selectedItems: [],
      keywords: "",
      singleSelection: false,
      priceRangeLabel: "Any Price",
      suggestions: customData,
      tagsSelected: [],
      searchTerm: "",
      tags: [],
      isModalVisible: false,
      propertyType: [],
      refreshList: false
    };
  }

  getAllNumbersBetween(x) {
    console.log("Value >>>" + x);
    if (x === 16000) {
      return;
    } else {
      if (x < 500) {
        data.push({
          id: x,
          value: "$" + x + "k"
        });
        return this.getAllNumbersBetween(x + 25);
      } else if (x < 1000) {
        data.push({
          id: x,
          value: "$" + x + "k"
        });
        return this.getAllNumbersBetween(x + 50);
      } else if (x < 2000) {
        data.push({
          id: x,
          value: "$" + x / 1000 + "M"
        });
        return this.getAllNumbersBetween(x + 100);
      } else if (x < 3000) {
        data.push({
          id: x,
          value: "$" + x / 1000 + "M"
        });
        return this.getAllNumbersBetween(x + 250);
      } else if (x < 5000) {
        data.push({
          id: x,
          value: "$" + x / 1000 + "M"
        });
        return this.getAllNumbersBetween(x + 500);
      } else if (x < 16000) {
        data.push({
          id: x,
          value: "$" + x / 1000 + "M"
        });
        return this.getAllNumbersBetween(x + 1000);
      }
    }
  }

  onSelectedItemsChange = selectedItems => {
    this.setState({ selectedItems });
  };

  openSearchModal() {
    console.log("In openSearchModal >>>>>");
    RNGooglePlaces.openAutocompleteModal({
      type: "establishment",
      country: "au",
      latitude: -37.0201,
      longitude: 144.9646
    })
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

  _tooglePropertyType(text) {
    let items = this.state.propertyType;
    let propertyToRemove = [
      Strings.PROPERTY_HOUSE,
      Strings.PROPERTY_TOWNHOUSE,
      Strings.PROPERTY_TOWNHOUSE,
      Strings.PROPERTY_FLAT_APARTMENT,
      Strings.PROPERTY_VILLA,
      Strings.PROPERTY_LAND,
      Strings.PROPERTY_ACERAGE,
      Strings.PROPERTY_RURAL,
      Strings.PROPERTY_BLOCK_OF_UNITS,
      Strings.PROPERTY_RETIREMENT_LIVING,
      Strings.PROPERTY_OFF_THE_PLAN
    ];
    let propertyToRemoveAll = Strings.PROPERTY_ALL_TYPES;

    if (this.state.propertyType.length === 0) {
      this.state.propertyType.push(text);
    } else if (text === Strings.PROPERTY_ALL_TYPES) {
      let filteredItems = items.filter(
        item => !propertyToRemove.includes(item)
      );

      this.setState({
        propertyType: filteredItems
      });

      console.log(
        "Property Type All >>>>> " + JSON.stringify(this.state.propertyType)
      );
    } else {
      let filteredItems = items.filter(item => item !== propertyToRemoveAll);

      this.setState({
        propertyType: filteredItems
      });

      console.log(
        "Property Type >>>>> " + JSON.stringify(this.state.propertyType)
      );
    }
  }

  _toogleNumberOfBedroom(text) {
    switch (text) {
      case Strings.NO_OF_BEDROOM_STUDIO:
        return this.setState({
          selectedNumberOfBedroom: Strings.NO_OF_BEDROOM_STUDIO
        });

      case Strings.NO_OF_BEDROOM_ONE:
        return this.setState({
          selectedNumberOfBedroom: Strings.NO_OF_BEDROOM_ONE
        });

      case Strings.NO_OF_BEDROOM_TWO:
        return this.setState({
          selectedNumberOfBedroom: Strings.NO_OF_BEDROOM_TWO
        });

      case Strings.NO_OF_BEDROOM_THREE:
        return this.setState({
          selectedNumberOfBedroom: Strings.NO_OF_BEDROOM_THREE
        });

      case Strings.NO_OF_BEDROOM_FOUR:
        return this.setState({
          selectedNumberOfBedroom: Strings.NO_OF_BEDROOM_FOUR
        });

      case Strings.NO_OF_BEDROOM_FIVE:
        return this.setState({
          selectedNumberOfBedroom: Strings.NO_OF_BEDROOM_FIVE
        });
      case Strings.NO_OF_BEDROOM_ADD_ANY:
        return this.setState({
          selectedNumberOfBedroom: Strings.NO_OF_BEDROOM_ADD_ANY
        });
    }
  }

  _toogleNumberOfBathroom(text) {
    switch (text) {
      case Strings.NO_OF_BATHROOM_STUDIO:
        return this.setState({
          selectedNumberOfBathroom: Strings.NO_OF_BATHROOM_STUDIO
        });

      case Strings.NO_OF_BATHROOM_ONE:
        return this.setState({
          selectedNumberOfBathroom: Strings.NO_OF_BATHROOM_ONE
        });

      case Strings.NO_OF_BATHROOM_TWO:
        return this.setState({
          selectedNumberOfBathroom: Strings.NO_OF_BATHROOM_TWO
        });

      case Strings.NO_OF_BATHROOM_THREE:
        return this.setState({
          selectedNumberOfBathroom: Strings.NO_OF_BATHROOM_THREE
        });
      case Strings.NO_OF_BATHROOM_FOUR:
        return this.setState({
          selectedNumberOfBathroom: Strings.NO_OF_BATHROOM_FOUR
        });
      case Strings.NO_OF_BATHROOM_FIVE:
        return this.setState({
          selectedNumberOfBathroom: Strings.NO_OF_BATHROOM_FIVE
        });
      case Strings.NO_OF_BATHROOM_ADD_ANY:
        return this.setState({
          selectedNumberOfBathroom: Strings.NO_OF_BATHROOM_ADD_ANY
        });
    }
  }

  _toogleCarSpace(text) {
    switch (text) {
      case Strings.CAR_SPACE_YES:
        return this.setState({
          selectedCarSpace: "1"
        });

      case Strings.CAR_SPACE_NO:
        return this.setState({
          selectedCarSpace: "0"
        });
    }
  }

  onChangeText(text) {
    console.log("Selected PropertyType >>>" + JSON.stringify(text));
    this.setState({
      selectedPropertyType: text
    });
  }

  clearSearchCriteria() {
    this.setState({
      address: "",
      lat: "",
      lang: "",
      minPrice: "",
      maxPrice: "",
      minLandSize: 0,
      maxLandSize: String.MAX_LAND_SIZE,
      landSize: "",
      tags: [],
      selectedPropertyType: "",
      selectedNumberOfBedroom: "",
      selectedNumberOfBathroom: "",
      selectedCarSpace: "",
      checked: false,
      selectedItems: [],
      propertyType: []
    });
  }

  onSubmit = () => {
    if (this.state.tags.length === 0) {
      showErrorMessage("Please provide location");
    }
    //  else if (!this.state.minPrice && !this.state.maxPrice) {
    //   showErrorMessage("Please provide minimum and maximum range");
    // } else if (!this.state.minPrice) {
    //   showErrorMessage("Please provide minimum range");
    // } else if (!this.state.maxPrice) {
    //   showErrorMessage("Please provide maximum range");
    // } else if (this.state.minPriceValue > this.state.maxPriceValue) {
    //   showErrorMessage("Minimum range cannot be greater than Maximum range");
    // }
    else {
      this._getAdvanceFilteredData();
    }
  };

  _getAdvanceFilteredData() {
    let zipArray = [];
    for (let i = 0; i < this.state.tags.length; i++) {
      let val = this.state.tags[i];
      let myZip = val.split(" ");
      zipArray.push(myZip[myZip.length - 1]);
    }

    console.log("Ziparray >>>>" + zipArray);

    AsyncStorage.getItem(Strings.KEY_USER_DATA)
      .then(value => {
        if (value) {
          var userData = JSON.parse(value);
          console.log("==== ID ===", userData);

          let minPrice = this.state.minPriceValue
            ? this.state.minPriceValue
            : 0;
          let maxPrice = this.state.maxPriceValue
            ? this.state.maxPriceValue
            : 0;

          let carSpace = "";

          if (this.state.selectedCarSpace === "1") {
            carSpace = "1";
          } else if (this.state.selectedCarSpace === "0") {
            carSpace = "0";
          } else {
            carSpace = "";
          }

          //this.setState({ userInfo: userData });
          var postData = {
            filter: {
              zipcode: zipArray,
              nearBy: this.state.checked,
              price_range: [minPrice, maxPrice],
              no_of_bathroom: this.state.selectedNumberOfBathroom,
              no_of_bedroom: this.state.selectedNumberOfBedroom,
              property_type: this.state.propertyType,
              car_space: carSpace,
              land_size: this.state.landSize,
              keywords: this.state.keywords,
              is_contract: this.state.excludePropertyChecked
            }
          };

          console.log("Advance Filter Data >>>> " + JSON.stringify(postData));
          this.props.clearPropertyListResponse();

          // this._changeLoadingState(true);
          // this.props.getFilteredPropertyList(postData, userData.token);
          Actions.dashboardScreen({ type: "reset", filterData: postData });
        }
      })
      .done();
  }

  _changeLoadingState(loadingState) {
    this.setState({
      isSpinnerVisible: loadingState
    });
  }

  // goToLogin = () => {
  //   Actions.signInScreen({ type: "reset" });
  // };

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
      } else {
        this.setState({ priceRangeLabel: "Above $" + min / 100 + "M" });
      }
    } else if (min === Strings.MIN_PRICE && max !== Strings.MAX_PRICE) {
      if (max < 100) {
        this.setState({
          priceRangeLabel: "Above $" + max * 10 + "k"
        });
      } else {
        this.setState({ priceRangeLabel: "Above $" + max / 100 + "M" });
      }
    } else if (min !== Strings.MIN_PRICE && max !== Strings.MAX_PRICE) {
      let finalMin = min;
      let finalMax = max;

      if (finalMin < 100) {
        finalMin = finalMin * 10 + "k";
      } else {
        finalMin = finalMin / 100 + "M";
      }

      if (finalMax < 100) {
        finalMax = finalMax * 10 + "k";
      } else {
        finalMax = finalMax / 100 + "M";
      }

      this.setState({
        priceRangeLabel: "$" + finalMin + " - " + "$" + finalMax
      });
    }

    // let min = data[0];
    // let max = data[1];

    // this.setState({
    //     minPrice:min,
    //     maxPrice:max
    // });

    // console.log("_onChangePriceSlider " + min+" "+max);

    // if(min===Strings.MIN_PRICE && max===Strings.MAX_PRICE){

    //   this.setState({
    //     priceRangeLabel:"Any Price"
    //   });
    // } else if (min === Strings.MIN_PRICE && max !== Strings.MAX_PRICE){

    //     if(max < 1000){
    //       this.setState({
    //         priceRangeLabel: "Up to $"+max+"k"
    //       });

    //     }else{
    //       let roundedValue = parseFloat(Math.round((max / 100000) * 100) / 100).toFixed(1).replace(/\.0+$/, '');
    //       this.setState({
    //         priceRangeLabel: "Up to $" + roundedValue + "M"
    //       });
    //     }

    // } else if (min !== Strings.MIN_PRICE && max === Strings.MAX_PRICE) {

    //   if (min < 1000) {
    //     this.setState({
    //       priceRangeLabel: "Above $" + min + "k"
    //     });

    //   } else {
    //     let roundedValue = parseFloat(Math.round((min / 100000) * 100) / 100).toFixed(1).replace(/\.0+$/, '');
    //     this.setState({
    //       priceRangeLabel: "Above $" + roundedValue + "M"
    //     });
    //   }

    // }else{

    //   var finalMin=min;
    //   var finalMax=max;

    //   if (min < 1000){
    //       finalMin= "$"+min+"k"
    //   }else{
    //     let roundedValue = parseFloat(Math.round((min / 100000) * 100) / 100).toFixed(1).replace(/\.0+$/, '');
    //     finalMin = "$"+roundedValue+"M"
    //   }

    //   if(max < 1000){
    //     finalMin = "$" + max + "k"
    //   }else{
    //     let roundedValue = parseFloat(Math.round((max / 100000) * 100) / 100).toFixed(1).replace(/\.0+$/, '');
    //     finalMax = "$" + roundedValue + "M"
    //   }

    //   this.setState({
    //     priceRangeLabel: finalMin +" - "+ finalMax
    //   });
    // }
  }

  _onChangeNumberOfBedroom() {}

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
        style={[
          styles.emailItem,
          { backgroundColor: valExists ? Colors.COLOR_PRIMARY : null }
        ]}
      >
        <View style={{ margin: 10 }}>
          <Text
            style={{
              color: valExists ? Colors.WHITE : Colors.COMMENT_TEXT_COLOR
            }}
          >
            {data.name}
          </Text>
          <Text
            style={[
              styles.emailSubject,
              { color: valExists ? Colors.WHITE : Colors.COMMENT_TEXT_COLOR }
            ]}
          >
            {data.postcode}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  renderModal() {
    return (
      <Modal
        useNativeDriver={Platform.OS === "android" ? true : false}
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
            <CompleteFlatList
              searchKey={["name", "postcode"]}
              placeholder={Strings.PLACEHOLDER_LOCATION_SEARCH}
              // highlightColor={Colors.COLOR_PRIMARY_DARK}
              data={customData}
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

  onSelectedItemsChange = selectedItems => {
    this.setState({ selectedItems });
  };

  onItemSelected(item) {
    let myVal = item.name + " " + item.postcode;
    console.log("myVal  " + JSON.stringify(myVal));

    let tagArray = this.state.tags;
    console.log("Tag Array  " + JSON.stringify(tagArray));
    console.log("Includes >>>> " + tagArray.includes(myVal));

    if (tagArray.includes(myVal)) {
      alert("Suburb Already Added !!");
    } else {
      this.state.tags.push(item.name + " " + item.postcode);
      this._toggleModal();
    }
    //this.setState({ tags: [...this.state.tags, item.name+" "+item.postcode] });
    console.log("onItemSelected >>>> " + JSON.stringify(this.state.tags));
  }

  onChangeTags = tags => {
    this.setState({ tags });

    console.log("On Change Tag >>>>" + JSON.stringify(this.state.tags));
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
    console.log("On Change Text >>>>" + JSON.stringify(this.state.tags));
  };

  labelExtractor = tag => tag;

  render() {
    const { selectedItems } = this.state;
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#FFF" }}>
        <HeaderScreen title={Strings.PROPERTY_SEARCH_SCREEN_TITLE} />
        <OfflineNotice />
        <KeyboardAwareScrollView
          resetScrollToCoords={{ x: 0, y: 0 }}
          scrollEnabled={true}
          extraHeight={40}
          extraScrollHeight={40}
          keyboardShouldPersistTaps="handled"
          enableAutoAutomaticScroll={true}
          enableOnAndroid={true}
        >
          <CardView
            cardElevation={10}
            cornerRadius={5}
            style={FilterListScreenStyle.containerStyle}
          >
            <View style={FilterListScreenStyle.subContainerStyle}>
              {/*======================= Property Types ==========================================*/}

              <View style={[FilterListScreenStyle.subContainerStyle]}>
                <Text
                  style={[
                    FilterListScreenStyle.textStyle,
                    { fontWeight: "bold" }
                  ]}
                >
                  {"Property Type"}
                </Text>
              </View>
              <View
                style={[
                  FilterListScreenStyle.btnContainerStyle,
                  { marginBottom: 15 }
                ]}
              >
                <FlatList
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={{ marginTop: 20 }}
                  data={items}
                  numColumns={1}
                  extraData={this.state.refresh}
                  renderItem={({ item, index }) =>
                    this._renderItem(item, index)
                  }
                />
              </View>

              <TouchableOpacity
                activeOpacity={0.5}
                onPress={() => this._toggleModal()}
              >
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
                  <View
                    style={{
                      flex: 1,
                      borderColor: Colors.BACK_ARROW_COLOR,
                      borderWidth: 1,
                      marginLeft: 10,
                      marginRight: 10,
                      paddingLeft: 10,
                      margin: 10,

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
                    }}
                  >
                    <TagInput
                      value={this.state.tags}
                      onChange={this.onChangeTags}
                      // text={""}
                      labelExtractor={this.labelExtractor}
                      onChangeText={this.onChangeText}
                      tagColor={Colors.COMMENT_TEXT_COLOR}
                      tagTextColor="white"
                      maxHeight={150}
                      tagContainerStyle={{
                        height: DEVICE_HEIGHT / 17,
                        borderRadius: 30,
                        borderWidth: 1,
                        borderColor: Colors.COMMENT_TEXT_COLOR
                      }}
                    />
                  </View>

                  <View style={{ marginLeft: 10 }}>
                    <CheckBox
                      title={"Surrounding Suburbs"}
                      containerStyle={{
                        justifyContent: "flex-start",
                        margin: 10,
                        padding: 0,
                        borderWidth: 0,
                        backgroundColor: "transparent"
                      }}
                      checked={this.state.checked}
                      size={18}
                      textStyle={{
                        color: Colors.BACK_ARROW_COLOR,
                        fontWeight: "400"
                      }}
                      checkedColor={Colors.BACK_ARROW_COLOR}
                      onIconPress={checked =>
                        this.setState({
                          checked: !this.state.checked,
                          modalVisible: false
                        })
                      }
                      onPress={checked =>
                        this.setState({
                          checked: !this.state.checked,
                          modalVisible: false
                        })
                      }
                    />
                  </View>
                </View>
              ) : (
                <View
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    alignContent: "center",
                    alignSelf: "center",
                    margin: 10
                  }}
                >
                  <Text
                    style={{
                      justifyContent: "center",
                      alignItems: "center",
                      alignContent: "center",
                      alignSelf: "center",
                      color: Colors.COLOR_CUTTY_SHARK
                    }}
                  >
                    {Strings.DEMO_TEXT}
                  </Text>
                </View>
              )}
            </View>

            <View style={FilterListScreenStyle.subContainerStyle}>
              <Text style={{ fontSize: 15, padding: 5, fontWeight: "bold" }}>
                Land Size
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  alignSelf: "center",
                  justifyContent: "center",
                  alignItems: "center",
                  alignContent: "center"
                }}
              >
                <Text
                  style={{
                    fontSize: 13,
                    padding: 5,
                    alignSelf: "center",
                    justifyContent: "center",
                    alignItems: "center",
                    alignContent: "center"
                  }}
                >
                  min.
                </Text>

                <TextInput
                  placeholder=""
                  keyboardType={"number-pad"}
                  maxLength={6}
                  placeholderTextColor={Colors.BACK_ARROW_COLOR}
                  onChangeText={text => this.setState({ landSize: text })}
                  style={styles.textInputStyleClass_1}
                  value={this.state.landSize}
                />

                <Text
                  style={{
                    fontSize: 13,
                    padding: 5,
                    alignSelf: "center",
                    justifyContent: "center",
                    alignItems: "center",
                    alignContent: "center"
                  }}
                >
                  sqm
                </Text>
                {/* <Text style={{ fontSize: 15, alignSelf: "center", justifyContent: "center", alignItems: "center", alignContent: "center" }}>
                  {this.state.minLandSize + " sqm "}
                </Text>
                <Text style={{ fontSize: 13, padding: 5, alignSelf: "center", justifyContent: "center", alignItems: "center", alignContent: "center" }}> To </Text>
                <Text style={{ fontSize: 15, alignSelf: "center", justifyContent: "center", alignItems: "center", alignContent: "center" }}>
                  {this.state.maxLandSize + " sqm "}
                </Text> */}
              </View>
            </View>
            {/* <View style={{ flex: 1, flexDirection: "row", justifyContent: "center" }}>
              <MultiSlider
                values={[this.state.minLandSize, this.state.maxLandSize]}
                sliderLength={DEVICE_WIDTH / 1.4}
                onValuesChange={data => {
                  console.log("Land Size Range Data >>>>>" + JSON.stringify(data));
                  this.setState({
                    minLandSize: data[0],
                    maxLandSize: data[1]
                  });
                }}
                min={0}
                max={Strings.MAX_LAND_SIZE}
                step={1}
                selectedStyle={{
                  backgroundColor: '#50E3C2',
                }}
              />
            </View> */}

            <View
              flexDirection={"row"}
              alignItems={"center"}
              style={FilterListScreenStyle.subContainerStyle}
            >
              <Image
                style={{ margin: 5 }}
                source={require("../../Assets/bed.png")}
              />
              <Text style={FilterListScreenStyle.textStyle}>
                No. of Bedrooms
              </Text>
            </View>
            <View style={FilterListScreenStyle.btnContainerStyle}>
              <ScrollView
                showsHorizontalScrollIndicator={false}
                horizontal={true}
              >
                <TouchableOpacity
                  style={[
                    styles.radioButtonStyle,
                    {
                      backgroundColor:
                        this.state.selectedNumberOfBedroom ===
                        Strings.NO_OF_BEDROOM_ADD_ANY
                          ? Colors.FILTER_SELECTED_COLOR
                          : "#FFF"
                    }
                  ]}
                  onPress={() =>
                    this._toogleNumberOfBedroom(Strings.NO_OF_BEDROOM_ADD_ANY)
                  }
                >
                  <Text style={{ fontSize: 12 }}> Any </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.radioButtonStyle,
                    {
                      backgroundColor:
                        this.state.selectedNumberOfBedroom ===
                        Strings.NO_OF_BEDROOM_STUDIO
                          ? Colors.FILTER_SELECTED_COLOR
                          : "#FFF"
                    }
                  ]}
                  onPress={() =>
                    this._toogleNumberOfBedroom(Strings.NO_OF_BEDROOM_STUDIO)
                  }
                >
                  <Text style={{ fontSize: 12 }}> Studio </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.radioButtonStyle,
                    {
                      backgroundColor:
                        this.state.selectedNumberOfBedroom ===
                        Strings.NO_OF_BEDROOM_ONE
                          ? Colors.FILTER_SELECTED_COLOR
                          : "#FFF"
                    }
                  ]}
                  onPress={() =>
                    this._toogleNumberOfBedroom(Strings.NO_OF_BEDROOM_ONE)
                  }
                >
                  <Text style={{ fontSize: 12 }}> 1 </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.radioButtonStyle,
                    {
                      backgroundColor:
                        this.state.selectedNumberOfBedroom ===
                        Strings.NO_OF_BEDROOM_TWO
                          ? Colors.FILTER_SELECTED_COLOR
                          : "#FFF"
                    }
                  ]}
                  onPress={() =>
                    this._toogleNumberOfBedroom(Strings.NO_OF_BEDROOM_TWO)
                  }
                >
                  <Text style={{ fontSize: 12 }}> 2 </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.radioButtonStyle,
                    {
                      backgroundColor:
                        this.state.selectedNumberOfBedroom ===
                        Strings.NO_OF_BEDROOM_THREE
                          ? Colors.FILTER_SELECTED_COLOR
                          : "#FFF"
                    }
                  ]}
                  onPress={() =>
                    this._toogleNumberOfBedroom(Strings.NO_OF_BEDROOM_THREE)
                  }
                >
                  <Text style={{ fontSize: 12 }}> 3 </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.radioButtonStyle,
                    {
                      backgroundColor:
                        this.state.selectedNumberOfBedroom ===
                        Strings.NO_OF_BEDROOM_FOUR
                          ? Colors.FILTER_SELECTED_COLOR
                          : "#FFF"
                    }
                  ]}
                  onPress={() =>
                    this._toogleNumberOfBedroom(Strings.NO_OF_BEDROOM_FOUR)
                  }
                >
                  <Text style={{ fontSize: 12 }}> 4 </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.radioButtonStyle,
                    {
                      backgroundColor:
                        this.state.selectedNumberOfBedroom ===
                        Strings.NO_OF_BEDROOM_FIVE
                          ? Colors.FILTER_SELECTED_COLOR
                          : "#FFF"
                    }
                  ]}
                  onPress={() =>
                    this._toogleNumberOfBedroom(Strings.NO_OF_BEDROOM_FIVE)
                  }
                >
                  <Text style={{ fontSize: 12 }}> 5+ </Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
            <View
              flexDirection={"row"}
              alignItems={"center"}
              style={FilterListScreenStyle.subContainerStyle}
            >
              <Image
                style={{ margin: 5 }}
                source={require("../../Assets/bathtub.png")}
              />
              <Text style={FilterListScreenStyle.textStyle}>
                No. of Bathrooms
              </Text>
            </View>
            <View style={FilterListScreenStyle.btnContainerStyle}>
              <ScrollView
                showsHorizontalScrollIndicator={false}
                horizontal={true}
              >
                <TouchableOpacity
                  style={[
                    styles.radioButtonStyle,
                    {
                      backgroundColor:
                        this.state.selectedNumberOfBathroom ===
                        Strings.NO_OF_BATHROOM_ADD_ANY
                          ? Colors.FILTER_SELECTED_COLOR
                          : "#FFF"
                    }
                  ]}
                  onPress={() =>
                    this._toogleNumberOfBathroom(Strings.NO_OF_BATHROOM_ADD_ANY)
                  }
                >
                  <Text style={{ fontSize: 12 }}> Any </Text>
                </TouchableOpacity>
                {/* <TouchableOpacity
                style={
                  [styles.radioButtonStyle, {
                    backgroundColor: this.state.selectedNumberOfBathroom ===
                      Strings.NO_OF_BATHROOM_STUDIO
                      ? Colors.FILTER_SELECTED_COLOR
                      : "#FFF"
                  }
                  ]
                }
                onPress={() =>
                  this._toogleNumberOfBathroom(Strings.NO_OF_BATHROOM_STUDIO)
                }
              >
                <Text style={{ fontSize: 12 }}> Studio </Text>
              </TouchableOpacity> */}
                <TouchableOpacity
                  style={[
                    styles.radioButtonStyle,
                    {
                      backgroundColor:
                        this.state.selectedNumberOfBathroom ===
                        Strings.NO_OF_BATHROOM_ONE
                          ? Colors.FILTER_SELECTED_COLOR
                          : "#FFF"
                    }
                  ]}
                  onPress={() =>
                    this._toogleNumberOfBathroom(Strings.NO_OF_BATHROOM_ONE)
                  }
                >
                  <Text style={{ fontSize: 12 }}> 1 </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.radioButtonStyle,
                    {
                      backgroundColor:
                        this.state.selectedNumberOfBathroom ===
                        Strings.NO_OF_BATHROOM_TWO
                          ? Colors.FILTER_SELECTED_COLOR
                          : "#FFF"
                    }
                  ]}
                  onPress={() =>
                    this._toogleNumberOfBathroom(Strings.NO_OF_BATHROOM_TWO)
                  }
                >
                  <Text style={{ fontSize: 12 }}> 2 </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.radioButtonStyle,
                    {
                      backgroundColor:
                        this.state.selectedNumberOfBathroom ===
                        Strings.NO_OF_BATHROOM_THREE
                          ? Colors.FILTER_SELECTED_COLOR
                          : "#FFF"
                    }
                  ]}
                  onPress={() =>
                    this._toogleNumberOfBathroom(Strings.NO_OF_BATHROOM_THREE)
                  }
                >
                  <Text style={{ fontSize: 12 }}> 3 </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.radioButtonStyle,
                    {
                      backgroundColor:
                        this.state.selectedNumberOfBathroom ===
                        Strings.NO_OF_BATHROOM_FOUR
                          ? Colors.FILTER_SELECTED_COLOR
                          : "#FFF"
                    }
                  ]}
                  onPress={() =>
                    this._toogleNumberOfBathroom(Strings.NO_OF_BATHROOM_FOUR)
                  }
                >
                  <Text style={{ fontSize: 12 }}> 4 </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.radioButtonStyle,
                    {
                      backgroundColor:
                        this.state.selectedNumberOfBathroom ===
                        Strings.NO_OF_BATHROOM_FIVE
                          ? Colors.FILTER_SELECTED_COLOR
                          : "#FFF"
                    }
                  ]}
                  onPress={() =>
                    this._toogleNumberOfBathroom(Strings.NO_OF_BATHROOM_FIVE)
                  }
                >
                  <Text style={{ fontSize: 12 }}> 5+ </Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
            <View
              flexDirection={"row"}
              alignItems={"center"}
              style={FilterListScreenStyle.subContainerStyle}
            >
              <Image
                style={{ margin: 5 }}
                source={require("../../Assets/garage.png")}
              />
              <Text style={FilterListScreenStyle.textStyle}>Car Space</Text>
            </View>
            <View style={FilterListScreenStyle.btnContainerStyle}>
              <TouchableOpacity
                style={{
                  borderColor: "#545454",
                  backgroundColor:
                    this.state.selectedCarSpace === "1"
                      ? Colors.FILTER_SELECTED_COLOR
                      : "#FFF",
                  borderWidth: 1,
                  borderRadius: 20,
                  paddingLeft: 13,
                  paddingRight: 13,
                  paddingBottom: 3,
                  paddingTop: 3,
                  marginLeft: 10,
                  marginRight: 10,
                  marginBottom: 20
                }}
                onPress={() => this._toogleCarSpace(Strings.CAR_SPACE_YES)}
              >
                <Text style={{ fontSize: 13 }}> YES </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  borderColor: "#545454",
                  backgroundColor:
                    this.state.selectedCarSpace === "0"
                      ? Colors.FILTER_SELECTED_COLOR
                      : "#FFF",
                  borderWidth: 1,
                  borderRadius: 20,
                  paddingLeft: 13,
                  paddingRight: 13,
                  paddingBottom: 3,
                  paddingTop: 3,
                  marginLeft: 10,
                  marginRight: 10,
                  marginBottom: 20
                }}
                onPress={() => this._toogleCarSpace(Strings.CAR_SPACE_NO)}
              >
                <Text style={{ fontSize: 13 }}> NO </Text>
              </TouchableOpacity>
            </View>
            <View style={FilterListScreenStyle.subContainerStyle}>
              <Text style={{ fontSize: 15, padding: 5, fontWeight: "bold" }}>
                Price range
              </Text>
              {/* <View style={{flexDirection:"row",alignContent:"center",alignSelf:"center",alignItems:"center"}}>
                <Text style={{marginTop:20,fontWeight:"500"}}>{this.state.priceRangeLabel}</Text>
              </View> */}
            </View>
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                justifyContent: "center",
                marginLeft: 5
              }}
            >
              <Dropdown
                ref="picker"
                containerStyle={{ flex: 0.5, margin: 5 }}
                label="Minimum"
                value={this.state.minPrice}
                onChangeText={text => {
                  var resultMin = data.filter(obj => {
                    return obj.value === text;
                  });
                  this.setState({
                    minPrice: text,
                    minPriceValue: resultMin[0].id
                  });
                }}
                textColor={Colors.COLOR_CUTTY_SHARK}
                labelFontSize={14}
                data={data}
                itemCount={DeviceType == "Tablet" ? 10 : 5}
              />
              <Dropdown
                ref={ref => (this.maxDropDown = ref)}
                containerStyle={{ flex: 0.5, margin: 5 }}
                value={this.state.maxPrice}
                onChangeText={text => {
                  var resultMax = data.filter(obj => {
                    return obj.value === text;
                  });
                  this.setState({
                    maxPrice: text,
                    maxPriceValue: resultMax[0].id
                  });
                }}
                textColor={Colors.COLOR_CUTTY_SHARK}
                label="Maximum"
                labelFontSize={14}
                data={data}
                itemCount={DeviceType == "Tablet" ? 10 : 5}
              />
            </View>

            {/* <View style={FilterListScreenStyle.subContainerStyle}>
              <View style={styles.textAreaContainer}>
                <TextInput
                  style={styles.textArea}
                  underlineColorAndroid="transparent"
                  placeholder="Searching For Something Specific. Please Add Keywords Here, e.g. Pool, Study"
                  placeholderTextColor={Colors.BACK_ARROW_COLOR}
                  onChangeText={text => this.setState({ keywords: text })}
                  value={this.state.keywords}
                  numberOfLines={4}
                  multiline={true}
                />
              </View>
            </View> */}

            <View style={{ marginLeft: 10 }}>
              <CheckBox
                title={"Exclude All Properties Under Offer or Contract."}
                containerStyle={{
                  justifyContent: "flex-start",
                  margin: 10,
                  padding: 0,
                  borderWidth: 0,
                  backgroundColor: "transparent"
                }}
                checked={this.state.excludePropertyChecked}
                size={18}
                textStyle={{
                  color: Colors.BACK_ARROW_COLOR,
                  fontWeight: "400"
                }}
                checkedColor={Colors.BACK_ARROW_COLOR}
                onIconPress={checked =>
                  this.setState({
                    excludePropertyChecked: !this.state.excludePropertyChecked,
                    modalVisible: false
                  })
                }
                onPress={checked =>
                  this.setState({
                    excludePropertyChecked: !this.state.excludePropertyChecked,
                    modalVisible: false
                  })
                }
              />
            </View>
          </CardView>
        </KeyboardAwareScrollView>

        <View
          style={{
            flexDirection: "row",
            alignContent: "center",
            alignItems: "center",
            alignSelf: "center"
          }}
        >
          <View style={{ margin: 10 }}>
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={() => this.onSubmit()}
            >
              <LinearGradient
                style={FilterListScreenStyle.roundedButtonStyleAppThemeNew}
                colors={["#00C2D7", "#4EE1CA"]}
              >
                <Text style={{ color: "white", fontWeight: "bold" }}>
                  {" "}
                  {"Apply Filter"}{" "}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
          <View style={{ margin: 10 }}>
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={() => this.clearSearchCriteria()}
            >
              <LinearGradient
                style={FilterListScreenStyle.roundedButtonStyleAppThemeNew}
                colors={["#00C2D7", "#4EE1CA"]}
              >
                <Text style={{ color: "white", fontWeight: "bold" }}>
                  {" "}
                  {"Clear Filter"}{" "}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
        {/* <View>
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => this.onSubmit()}>
            <LinearGradient
              colors={["#00C2D7", "#4EE1CA"]}
              style={FilterListScreenStyle.roundedButtonStyleAppTheme}
            >
              <Text style={{ color: "white" }}> {"SEARCH PROPERTY"} </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
         */}
        {this.renderModal()}
      </SafeAreaView>
    );
  }

  _toogleList() {
    this.setState({
      refresh: !this.state.refresh
    });
  }

  _renderItem(item, index) {
    // console.log("_renderItem >>>" + JSON.stringify(item));
    // console.log("PropertyType  >>>" + JSON.stringify(this.state.propertyType));
    // console.log("Property Exists  >>>" + this.state.propertyType.includes(item.name));

    let isPropertySelected = this.state.propertyType.includes(item.name);
    return (
      <TouchableOpacity onPress={() => this.actionOnRow(item.name)}>
        <View
          style={[
            styles.radioButtonStyleProperty,
            {
              backgroundColor: isPropertySelected
                ? Colors.FILTER_SELECTED_COLOR
                : "#FFF"
            }
          ]}
        >
          <Text style={{ fontSize: 12 }}> {item.name} </Text>
        </View>
      </TouchableOpacity>
    );
  }

  actionOnRow(item) {
    console.log("Selected Item :", JSON.stringify(item));

    if (item === Strings.PROPERTY_ALL_TYPES) {
      this.state.propertyType.splice(0, this.state.propertyType.length);
    } else {
      var index = this.state.propertyType.indexOf(Strings.PROPERTY_ALL_TYPES);
      if (index !== -1) this.state.propertyType.splice(index, 1);
    }

    if (!this.state.propertyType.includes(item)) {
      this.state.propertyType.push(item);
    }

    console.log(
      "PropertyType actionOnRow >>>" + JSON.stringify(this.state.propertyType)
    );
    this._toogleList();
  }

  showLogoutAlert() {
    Alert.alert(
      Strings.APP_NAME,
      "Are you sure , you want the exit the app ?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "Logout", onPress: () => this.logoutFromApp() }
      ],
      { cancelable: false }
    );
  }

  logoutFromApp() {
    AsyncStorage.removeItem(Strings.KEY_USER_DATA);
    Actions.signInScreen({ type: "reset" });
    // if (this.removeItemValue(Strings.KEY_USER_DATA)) {
    //   Actions.signInScreen({ type: "reset" });
    // }
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
    color: "#545454",
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
  radioButtonStyle: {
    borderColor: "#545454",
    borderWidth: 1,
    borderRadius: 20,
    paddingLeft: 5,
    paddingRight: 5,
    paddingBottom: 2,
    paddingTop: 2,
    marginLeft: 5,
    marginRight: 5,
    marginBottom: 5
  },
  radioButtonStyleProperty: {
    borderColor: "#545454",
    borderWidth: 1,
    borderRadius: 25,
    paddingLeft: 15,
    paddingRight: 15,
    paddingBottom: 5,
    paddingTop: 5,
    marginLeft: 5,
    marginRight: 5,
    marginBottom: 5,
    shadowColor: "rgba(0,0,0, .4)", // IOS
    shadowOffset: { height: 1, width: 1 }, // IOS
    shadowOpacity: 1, // IOS
    shadowRadius: 1, //IOS
    backgroundColor: "#fff",
    elevation: 2 // Android
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around"
  },
  customButton: {
    backgroundColor: "green",
    width: "40%",
    height: 40
  },
  textInputStyleClass_1: {
    // Setting up Hint Align center.
    textAlign: "left",

    margin: 10,

    padding: 10,
    // Setting up TextInput height as 50 pixel.
    height: DEVICE_HEIGHT / 18,

    margin: 15,

    width: DEVICE_WIDTH / 5,

    color: Colors.BACK_ARROW_COLOR,
    // Set border width.
    borderBottomWidth: 1,
    // Set border Hex Color Code Here.
    borderColor: Colors.COMMENT_TEXT_COLOR,
    // Set border Radius.
    borderRadius: 2,
    //Set background color of Text Input.
    backgroundColor: "transparent"
  }
});

function mapStateToProps(state) {
  return {};
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ clearPropertyListResponse }, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SearchPropertyScreen);
