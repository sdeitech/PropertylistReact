import {
    StyleSheet,
    Platform,
    Image,
    StatusBar
} from 'react-native';
import Dimensions from 'Dimensions';
import { ifIphoneX } from 'react-native-iphone-x-helper'

import Colors from "../../Constants/Colors";

const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;
const window = Dimensions.get('window');

const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 20 : StatusBar.currentHeight;
const APPBAR_HEIGHT = Platform.OS === 'ios' ? 60 : 56;
const DeviceType = (window.height / window.width) > 1.6 ? 'Phone' : 'Tablet';
export default StyleSheet.create({
  headerTitle: {
    color: Colors.TEXT_COLOR,

    fontSize: 20
  },

  toolBarStyle: {
    backgroundColor: Colors.WHITE,

    paddingLeft: 15,
    paddingRight: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    ...ifIphoneX(
      {
        paddingTop: 50,
        paddingBottom: 10
      },
      {
        paddingTop: Platform.OS === "ios" ? 15 : 0,

        height: APPBAR_HEIGHT
      }
    )
  },

  drawerStyle: {
    backgroundColor: Colors.WHITE,
    marginTop: 20,
    borderTopLeftRadius: 20,
    flex: 1,
    marginLeft: 10,
    shadowColor: "#9292AF",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 10
  },

  drawerSecondPartStyle: {
    backgroundColor: Colors.TRANSPARENT,
    flex: 1,
    marginTop: 10,
    flexDirection: "column"
  },

  drawerHeaderStyle: {
    backgroundColor: Colors.TRANSPARENT,
    flex: 0.15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    width: "90%"
  },
  flatListItemContainer: {
    flexDirection: "row",
    height: DEVICE_HEIGHT / 11,
    marginTop: 5,
    marginLeft: 40,
    marginRight: 20,
    width: "90%",
    alignItems: "center",
    justifyContent: "flex-start",
    backgroundColor: Colors.TRANSPARENT
  },

  flatListItemTitle: {
    color: Colors.PROFILE_ABOUT_ME,
    justifyContent: "center",
    fontSize: DeviceType === "Tablet" ? 15 : 20,
    alignItems: "center",
    alignSelf: "center",
    textAlign: "right"
  }
});