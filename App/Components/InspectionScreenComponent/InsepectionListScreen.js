import React, { Component } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { TabView, TabBar, SceneMap } from "react-native-tab-view";
import AcceptScreen from "./AcceptScreenComponent/AcceptScreen";
import PendingScreen from "./PendingScreenComponent/PendingScreen";
import RejectScreen from "./RejectScreenComponent/RejectScreen";
import InsepectionTabScreenStyle from "./InsepectionTabScreenStyle";
import HeaderScreen from "../CommonComponent/HeaderScreen";
import Strings from "../../Constants/Strings";
import OfflineNotice from "../../Utils/OfflineNotice";

const DEVICE_WIDTH = Dimensions.get("window").width;
const DEVICE_HEIGHT = Dimensions.get("window").height;
const initialLayout = {
  height: 0,
  width: DEVICE_WIDTH
};

export default class InsepectionListScreen extends Component {
  state = {
    index: 0,
    routes: [
      { key: "upcoming", title: "Upcoming" },
      { key: "past", title: "Past" },
      { key: "declined", title: "Declined" }
    ]
  };
  _renderTabBar = props => (
    <TabBar
      {...props}
      scrollEnabled
      indicatorStyle={InsepectionTabScreenStyle.indicator}
      style={InsepectionTabScreenStyle.tabbar}
      tabStyle={InsepectionTabScreenStyle.tab}
      labelStyle={InsepectionTabScreenStyle.label}
    />
  );

  // _renderScene = SceneMap({
  //   upcoming: AcceptScreen,
  //   past: PendingScreen,
  //   declined: RejectScreen
  // });

  _renderScene = ({ route }) => {
    console.log("Route Key >>>>"+JSON.stringify(route))
    switch (route.key) {
      case "upcoming":
        return <AcceptScreen />;
      case "past":
        return <PendingScreen />;
      case "declined":
        return <RejectScreen />;
      default:
        return null;
    }
  };

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
        <HeaderScreen title={Strings.INSPECTION_SCREEN_TITLE} />
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
