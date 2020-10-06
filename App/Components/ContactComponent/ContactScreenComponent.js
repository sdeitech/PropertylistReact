import React, { Component } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { TabView, TabBar, SceneMap } from "react-native-tab-view";
import AcceptScreen from "./AcceptScreenComponent/AcceptScreen";
import PendingScreen from "./PendingScreenComponent/PendingScreen";
import RejectScreen from "./RejectScreenComponent/RejectScreen";
import ContactScreenStyle from "./ContactScreenStyle";
import HeaderScreen from "../CommonComponent/HeaderScreen";
import Strings from "../../Constants/Strings";
import OfflineNotice from "../../Utils/OfflineNotice";

const DEVICE_WIDTH = Dimensions.get("window").width;
const DEVICE_HEIGHT = Dimensions.get("window").height;
const initialLayout = {
  height: 0,
  width: DEVICE_WIDTH,
};
export default class ContactScreenComponent extends Component {
  state = {
    index: 0,
    routes: [
      { key: "accepted", title: "Accepted" },
      { key: "pending", title: "Pending" },
      { key: "declined", title: "Declined" }
    ]
  };
  _renderTabBar = props => (
    <TabBar
      {...props}
      scrollEnabled
      indicatorStyle={ContactScreenStyle.indicator}
      style={ContactScreenStyle.tabbar}
      tabStyle={ContactScreenStyle.tab}
      labelStyle={ContactScreenStyle.label}
    />
  );

  _renderScene = SceneMap({
    accepted: AcceptScreen,
    pending: PendingScreen,
    declined: RejectScreen
  });

  // _renderScene(){
  //   return SceneMap({
  //    accepted: AcceptScreen,
  //    pending: PendingScreen,
  //    rejected: RejectScreen
  //  })
  // }


  // _renderScene = () => {
  //   console.log("Render Scene >>>"+this.state.index)
  //   switch (this.state.index) {
  //     case 0:
  //       return AcceptScreen;
  //     case 1:
  //       return PendingScreen;

  //     case 2:
  //       return RejectScreen;

  //     default:
  //       return null;
  //   }
  // }


  _handleIndexChange = index =>
    this.setState({
      index
    });

  render() {
    return (
      <View style={{ flex: 1 }}>
        <HeaderScreen title={Strings.CONTACT_LIST_SCREEN_TITLE} />
        <OfflineNotice />
        <TabView
          navigationState={this.state}
          renderScene={this._renderScene}
          renderTabBar={this._renderTabBar}
          onIndexChange={this._handleIndexChange}
          initialLayout={initialLayout}
        />

      </View>
      );
  }
}
