import { StyleSheet, Dimensions } from "react-native";

const DEVICE_WIDTH = Dimensions.get("window").width;
const DEVICE_HEIGHT = Dimensions.get("window").height;
import COLORS from "../../Constants/Colors";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#eceff1"
  },
  tabbar: {
    backgroundColor: COLORS.WHITE
  },
  tab: {
    width: DEVICE_WIDTH / 3
  },
  indicator: {
    backgroundColor: COLORS.COLOR_PRIMARY_DARK
  },
  label: {
    color: COLORS.COLOR_CUTTY_SHARK,
    fontWeight: "bold"
  }
});
