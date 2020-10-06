import {
  StyleSheet,
  Platform,
  Dimensions
} from 'react-native';
import Colors from '../../Constants/Colors';
import COLORS from '../../Constants/Colors';

const { width, height } = Dimensions.get('window');
const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;

export default StyleSheet.create({
  containerStyle: {
    flex: 1
  },
  backgroundImage: {
    flex: 1,
    height: undefined,
    width: undefined,
    resizeMode: "stretch" // or 'stretch'
  },
  signInForm: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center"
  },

  logoStyle: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    width: DEVICE_WIDTH / 4,
    height: DEVICE_HEIGHT / 8.5,
    marginBottom: 20,
    resizeMode: "contain"
  },
  signInFormContent: {
    flex: 0.8,
    marginTop: DEVICE_HEIGHT / 7,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center"
  },

  textInputStyleClass: {
    // Setting up Hint Align center.
    textAlign: "left",

    padding: 10,
    // Setting up TextInput height as 50 pixel.
    height: DEVICE_HEIGHT / 18,

    margin: 15,

    width: DEVICE_WIDTH / 1.2,

    color: Colors.WHITE,
    // Set border width.
    borderWidth: 1,
    // Set border Hex Color Code Here.
    borderColor: Colors.WHITE,
    // Set border Radius.
    borderRadius: 8,
    //Set background color of Text Input.
    backgroundColor: "transparent"
  },

  roundedButtonStyleTransparent: {
    height: DEVICE_HEIGHT / 17,
    width: DEVICE_WIDTH / 1.2,
    backgroundColor: "transparent",
    marginTop: 20,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "#fff",
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center"
  },
  roundedButtonStyleAppTheme: {
    height: DEVICE_HEIGHT / 17,
    width: DEVICE_WIDTH / 1.2,
    marginTop: 20,
    backgroundColor: "#00BCD4",
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center"
  },

  propertyListCardItemContainer: {
    flex: 1,
    backgroundColor: "#FFF",
    marginTop: 5,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 5,
    borderTopLeftRadius: 10, 
    borderTopRightRadius: 10,
    borderRadius:10
  },

  propertyListCardItemContent: {
    flex:1,
    height: DEVICE_HEIGHT / 5,
    width: DEVICE_WIDTH /1.2,
    borderRadius: 10,
    borderWidth: 0,
    borderColor: "transparent",
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center"
  },
  propertyListImageContent: {

    flex:1,
    marginLeft:20
  },
  emptyListStyle: {
    flex: 1,
    justifyContent: 'center'
  },
  emptyMessageStyle: {
    textAlign: 'center',
  },
  searchInputStyle: {
    backgroundColor: "white",
    marginTop: DEVICE_HEIGHT / 6.5,
    marginLeft: DEVICE_HEIGHT / 9,
    marginRight: DEVICE_HEIGHT / 9,
    paddingLeft:5,
    height: 40
  }

});