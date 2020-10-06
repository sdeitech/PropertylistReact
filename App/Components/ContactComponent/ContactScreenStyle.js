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
      // statusbar: {
      //   height: Platform.OS === 'ios' ? 20 : 25,
      // },
      // appbar: {
      //   flexDirection: 'row',
      //   alignItems: 'center',
      //   height: Platform.OS === 'ios' ? 44 : 56,
      //   borderBottomColor: 'rgba(0, 0, 0, 0.1)',
      // },
      // title: {
      //   flex: 1,
      //   margin: 16,
      //   textAlign: Platform.OS === 'ios' ? 'center' : 'left',
      //   fontSize: 18,
      //   color: '#fff',
      // },
      // button: {
      //   flexDirection: 'row',
      //   alignItems: 'center',
      //   width: 56,
      //   padding: Platform.OS === 'ios' ? 12 : 16,
      // },
      // touchable: {
      //   padding: 16,
      //   backgroundColor: '#fff',
      //   borderBottomWidth: 1,
      //   borderBottomColor: 'rgba(0, 0, 0, .06)',
      // },
      // item: {
      //   fontSize: 16,
      //   color: '#333',
      // },

});
