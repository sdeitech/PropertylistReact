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
  cardContainer: { flex: 1, margin: 10, flexDirection: "row" },
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
    width: DEVICE_WIDTH / 1.8,
    height: DEVICE_HEIGHT / 20,
    alignItems: "center",
    alignSelf: "center",
    alignContent: "center",
    justifyContent: "center"
  },
  emptyListStyle: {
    flex: 1,
    justifyContent: "center"
  },
  emptyMessageStyle: {
    textAlign: "center"
  },
  calendarHeaderStyle: {
    color: COLORS.BLACK,
    paddingBottom: 20,
    fontSize: 16
  },
  calendarIconStyle: {
    height: 12,
    marginTop: 15
  },
  subContainerStyle: {
    marginTop: 50,
    marginBottom: 15,
    marginLeft: 5,
    marginRight: 5,
    padding: 5,
    flexDirection: "row"
  },
  roundedButtonStyleAppTheme: {
    height: DEVICE_HEIGHT / 17,
    width: DEVICE_WIDTH / 1.8,
    margin: 20,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center"
  },
});
