import { StyleSheet, Dimensions } from "react-native";

const DEVICE_WIDTH = Dimensions.get("window").width;
const DEVICE_HEIGHT = Dimensions.get("window").height;
import COLORS from "../../Constants/Colors";

export default StyleSheet.create({
  containerStyle: {
    margin: 10
  },
  updateForm: {
    flex: 1,
    backgroundColor: "#FFF",
    margin: 5
  },
  imageStyle: { height: DEVICE_HEIGHT / 3, borderRadius: 100 },
  cardContainer: { flex: 1, margin: 10 },
  titleStyle: {
    margin: 10,
    fontSize: 20,
    fontWeight: "400",
    color: COLORS.BLACK
  },
  detailTextStyle: {
    margin: 10,
    fontSize: 16,
    textAlign: "justify",
    lineHeight: 25,
    color:COLORS.GRAY_TEXT_COLOR

  },
  btnContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  nameTextStyle: { margin: 10, fontSize: 18, color: COLORS.BLACK },
  btnStyle: {
    borderColor: "#02C3D7",
    borderRadius: 20,
    paddingLeft: 30,
    paddingRight: 30,
    paddingBottom: 5,
    paddingTop: 8,
    borderWidth: 2,
    color: "#02C3D7",
    fontSize:16
  },
  emptyListStyle: {
    flex: 1,
    justifyContent: "center"
  },
  emptyMessageStyle: {
    textAlign: "center"
  },
});
