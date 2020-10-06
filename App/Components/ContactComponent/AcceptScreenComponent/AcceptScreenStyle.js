import { StyleSheet, Dimensions } from "react-native";

const DEVICE_WIDTH = Dimensions.get("window").width;
const DEVICE_HEIGHT = Dimensions.get("window").height;
import COLORS from "../../../Constants/Colors";

export default StyleSheet.create({
  containerStyle: {
    margin: 10
  },
  updateForm: {
     flex: 1,
    backgroundColor: "#FFF",
    margin: 10
  },
  cardContainer: { flex: 1, margin: 10, flexDirection: "row",marginBottom:30 },
  btnContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  btnChatStyle: {
    borderColor: "#02C3D7",
    borderRadius: 20,
    // paddingLeft: 20,
    // paddingRight: 20,
    paddingBottom: 5,
    paddingTop: 5,
    borderWidth: 2,
    flexDirection: "row",
    justifyContent: "center",
    height: DEVICE_HEIGHT / 22,
    margin: 10
  },
  btnRemoveStyle: {
    borderColor: "#F44336",
    borderRadius: 20,
    // paddingLeft: 30,
    // paddingRight: 30,
    paddingBottom: 5,
    paddingTop: 5,
    borderWidth: 2,
    flexDirection: "row",
    justifyContent: "center",
    margin: 10,
    height: DEVICE_HEIGHT / 22
  },
  emptyListStyle: {
    flex: 1,
    justifyContent: "center"
  },
  emptyMessageStyle: {
    textAlign: "center"
  },
  roundedButtonStyleAppTheme: {
    height: DEVICE_HEIGHT / 15,
    width: DEVICE_WIDTH,
    borderWidth: 1,
    borderColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",

  },
  btnStyle: {
    borderColor: COLORS.VIEW_HIGHLIGHT_COLOR,
    borderWidth: 2,
    borderRadius: 40,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 5,
    paddingBottom: 5,
  },
});
