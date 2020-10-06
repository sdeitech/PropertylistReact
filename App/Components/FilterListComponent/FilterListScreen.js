import React, { Component } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TouchableHighlight,
  Image,
  StyleSheet,
  Dimensions,
  Picker,
  TextInput
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import CardView from "react-native-cardview";
import Colors from '../../Constants/Colors';
import FilterListScreenStyle from "./FilterListScreenStyle";

const DEVICE_WIDTH = Dimensions.get("window").width;
const DEVICE_HEIGHT = Dimensions.get("window").height;

class FilterListScreen extends Component {
  state = {
    modalVisible: true,
    min: "400000",
    max: "800000"
  };
  cancel(visible) {
    this.setState({ modalVisible: visible });
  }
  render() {
    return (
      <View>

        <Modal
          visible={this.state.modalVisible}
          transparent
          animationType={"slide"}
          onRequestClose={() => {
            this.cancel(!this.modalVisible);
          }}
        >
          <KeyboardAwareScrollView style={{backgroundColor: "rgba(78, 225, 202, 0.40)"}}>
            <CardView
              cardElevation={10}
              cornerRadius={10}
              style={FilterListScreenStyle.containerStyle}
            >
              <View
                flexDirection={"row"}
                justifyContent={"space-between"}
                style={FilterListScreenStyle.subContainerStyle}
              >
                <Text>{""}</Text>
                <Text 
                style={FilterListScreenStyle.textHeaderStyle}
                >FILTER LIST</Text>
                <TouchableOpacity>
                  <Image
                    style={FilterListScreenStyle.imgHeaderStyle}
                    source={require("../../Assets/help.png")}
                  />
                </TouchableOpacity>
              </View>
              <View style={FilterListScreenStyle.subContainerStyle}>
                <Picker
                  selectedValue={this.state.language}
                  style={{ flex: 1 }}
                >
                  <Picker.Item label="Property Type" value="java" />
                  <Picker.Item label="JavaScript" value="js" />
                </Picker>
                <Picker
                  selectedValue={this.state.language}
                  style={{ flex: 1 }}
                >
                  <Picker.Item label="Suburb Name or Postcode" value="java" />
                  <Picker.Item label="JavaScript" value="js" />
                </Picker>
              </View>
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
              <View
                style={FilterListScreenStyle.btnContainerStyle}
              >
                <TouchableOpacity style={FilterListScreenStyle.btnStyle}>
                  <Text style={{ fontSize: 13 }}>Studio</Text>
                </TouchableOpacity>
                <TouchableOpacity style={FilterListScreenStyle.btnStyle}>
                  <Text style={{ fontSize: 13 }}> 1 </Text>
                </TouchableOpacity>
                <TouchableOpacity style={FilterListScreenStyle.btnStyle}>
                  <Text style={{ fontSize: 13 }}> 2 </Text>
                </TouchableOpacity>
                <TouchableOpacity style={FilterListScreenStyle.btnStyle}>
                  <Text style={{ fontSize: 13 }}> 3+ </Text>
                </TouchableOpacity>
              </View>
              <View
                flexDirection={"row"}
                alignItems={"center"}
                style={FilterListScreenStyle.subContainerStyle}>
                <Image
                  style={{ margin: 5 }}
                  source={require("../../Assets/bathtub.png")}
                />
                <Text style={FilterListScreenStyle.textStyle}>
                  No. of Bathrooms
                </Text>
              </View>
              <View
                style={FilterListScreenStyle.btnContainerStyle}
              >
                <TouchableOpacity style={FilterListScreenStyle.btnStyle}>
                  <Text style={{ fontSize: 13 }}> 1 </Text>
                </TouchableOpacity>
                <TouchableOpacity style={FilterListScreenStyle.btnStyle}>
                  <Text style={{ fontSize: 13 }}> 2 </Text>
                </TouchableOpacity>
                <TouchableOpacity style={FilterListScreenStyle.btnStyle}>
                  <Text style={{ fontSize: 13 }}> 3+ </Text>
                </TouchableOpacity>
              </View>
              <View
                flexDirection={"row"}
                alignItems={"center"}
                style={FilterListScreenStyle.subContainerStyle}>
                <Image
                  style={{ margin: 5 }}
                  source={require("../../Assets/garage.png")}
                />
                <Text style={FilterListScreenStyle.textStyle}>Car Space</Text>
              </View>
              <View
                style={FilterListScreenStyle.btnContainerStyle}
              >
                <TouchableOpacity style={FilterListScreenStyle.btnStyle}>
                  <Text style={{ fontSize: 13 }}> YES </Text>
                </TouchableOpacity>
                <TouchableOpacity style={FilterListScreenStyle.btnStyle}>
                  <Text style={{ fontSize: 13 }}> NO </Text>
                </TouchableOpacity>
              </View>
              <View
                style={FilterListScreenStyle.subContainerStyle}
              >
                <Text style={{ fontSize: 15, padding: 5 }}>Price range</Text>
                <View flexDirection={"row"} alignItems={"center"}>
                  <Text style={{ fontSize: 13, padding: 5 }}>From</Text>
                  <Text style={{ fontSize: 15 }}>{` $ ${this.state.min}`}</Text>
                  <Text style={{ fontSize: 13, padding: 5 }}> to </Text>
                  <Text style={{ fontSize: 15 }}>{` $ ${this.state.max}`}</Text>
                </View>
              </View>
              <View>
                {/* ######Slider######## */}
              </View>
              <View
                style={FilterListScreenStyle.subContainerStyle}>
                <TextInput
                  style={FilterListScreenStyle.searchInputStyle}
                  multiline
                  numberOfLines={6}
                  editable
                  maxLength={50}
                  placeholder="Searching for some thing specific, please mention here..."
                />
              </View>
              <View >
                <TouchableOpacity
                  activeOpacity={0.5}
                  onPress={() => this.cancel(!this.state.modalVisible)}
                >
                  <LinearGradient
                    colors={["#00C2D7", "#4EE1CA"]}
                    style={FilterListScreenStyle.roundedButtonStyleAppTheme}
                  >
                    <Text style={{ color: "white" }}> {"APPLY FILTERS"} </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </CardView>
          </KeyboardAwareScrollView>
        </Modal>
      </View >
    );
  }
}

export default FilterListScreen;
