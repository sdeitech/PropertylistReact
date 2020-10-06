import { StyleSheet, Dimensions } from "react-native";
import COLORS from "../../Constants/Colors";

const DEVICE_WIDTH = Dimensions.get("window").width;
const DEVICE_HEIGHT = Dimensions.get("window").height;

export default StyleSheet.create({
  containerStyle: { flex: 1 },
  updateForm: {
    flex: 1,
    height: DEVICE_HEIGHT / 1.1,
    backgroundColor: COLORS.WHITE,
    marginTop: DEVICE_HEIGHT / 3.5,
    marginLeft: 5,
    marginRight: 5,
    padding: 10
  },
  roundedButtonStyleAppTheme: {
    height: DEVICE_HEIGHT / 15,
    width: DEVICE_WIDTH,
    borderWidth: 1,
    borderColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center"
  },
  bgImageStyle: {
    flex: 1,
    height: DEVICE_HEIGHT / 3,
    resizeMode: "contain"
  },
  btnStyle: {
    borderColor: COLORS.VIEW_HIGHLIGHT_COLOR,
    borderWidth: 2,
    borderRadius: 30,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 5,
    paddingBottom: 5,
    margin: 10
  },
  btnStyleSelected: {
    borderColor: COLORS.VIEW_HIGHLIGHT_COLOR,
    backgroundColor: COLORS.VIEW_HIGHLIGHT_COLOR,
    borderWidth: 2,
    borderRadius: 30,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 5,
    paddingBottom: 5,
    margin: 10
  },

  calendarHeaderStyle: {
    color: COLORS.grey_900,
    paddingBottom: 20,
    fontSize: 16
  },
  calendarIconStyle: {
    height: 12,
    marginTop: 15
  },
  updateForm: {
    // flex: 1,
    height: DEVICE_HEIGHT / 3.5,
    backgroundColor: "#FFF",
    margin: 10,

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
    height: DEVICE_HEIGHT / 21,
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
    height: DEVICE_HEIGHT / 21,

  },
  emptyListStyle: {
    flex: 1,
    justifyContent: 'center'
  },
  emptyMessageStyle: {
    textAlign: 'center',
  },

});
