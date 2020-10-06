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
    resizeMode: "cover" // or 'stretch'
  },
  profileContainer: {
    flex: 1
  },
  updateForm: {
    flex: 1,
    height: DEVICE_HEIGHT - 80,
    backgroundColor: "#FFF",
    marginTop: DEVICE_HEIGHT / 10,
    marginLeft: 25,
    marginRight: 25
  },
  avatar: {
    position: "absolute",
    top: DEVICE_HEIGHT / 22,
    zIndex: 1,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center"
  },
  userNameTitle: {
    marginTop: DEVICE_HEIGHT / 14,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    color: Colors.USER_NAME_TITLE,
    fontSize: 18
  },
  userNameSubText: {
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    color: Colors.USER_NAME_SUB_TITLE,
    fontSize: 12
  },

  mainContainer: {
    flex: 1,
    flexDirection: "column",
    marginTop: DEVICE_HEIGHT / 20,
    marginLeft: 20,
    marginRight: 20
  },

  aboutMeContainer: {
    justifyContent: "flex-start",
    alignItems: "flex-start",
    alignSelf: "flex-start"
  },
  aboutMeTitle: {
    color: Colors.PROFILE_ABOUT_ME,
    fontSize: 14,
    marginLeft: 10
  },
  aboutMeDivider: {
    backgroundColor: Colors.ABOUT_ME_DIVIDER,
    marginRight: 10,
    marginTop: 10
  },
  aboutMeContentContainer: {
    justifyContent: "flex-start",
    alignItems: "flex-start",
    alignSelf: "flex-start",
    marginTop: 10,
    color: Colors.ABOUT_ME_CONTENT,
    fontSize: 12,
    marginLeft: 10,
    marginBottom: 10
  },

  contactInfoTitle: {
    color: Colors.PROFILE_ABOUT_ME,
    fontSize: 14,
    marginLeft: 10,
    marginTop: 10
  },

  emailTitle: {
    justifyContent: "flex-start",
    alignItems: "flex-start",
    alignSelf: "flex-start",
    marginTop: 10,
    color: Colors.ABOUT_ME_CONTENT,
    fontSize: 12,
    marginLeft: 10
  },

  emailSubText: {
    justifyContent: "flex-start",
    alignItems: "flex-start",
    alignSelf: "flex-start",
    color: Colors.ABOUT_ME_CONTENT,
    fontSize: 10,
    marginLeft: 10
  },

  phoneTitle: {
    justifyContent: "flex-start",
    alignItems: "flex-start",
    alignSelf: "flex-start",
    marginTop: 20,
    color: Colors.ABOUT_ME_CONTENT,
    fontSize: 12,
    marginLeft: 10
  },

  phoneSubText: {
    justifyContent: "flex-start",
    alignItems: "flex-start",
    alignSelf: "flex-start",
    color: Colors.ABOUT_ME_CONTENT,
    fontSize: 10,
    marginLeft: 10
  },

  addressTitle: {
    justifyContent: "flex-start",
    alignItems: "flex-start",
    alignSelf: "flex-start",
    marginTop: 20,
    color: Colors.ABOUT_ME_CONTENT,
    fontSize: 12,
    marginLeft: 10
  },

  addressSubText: {
    justifyContent: "flex-start",
    alignItems: "flex-start",
    alignSelf: "flex-start",
    color: Colors.ABOUT_ME_CONTENT,
    fontSize: 10,
    marginLeft: 10,
    marginRight: 20,
    marginBottom: 10
  },

  profileEditScreenTitleContainer: {
    margin: 5,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center"
  },

  profileEditScreenTitle: {
    margin: 5,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    color: Colors.ABOUT_ME_CONTENT,
    fontSize: 18
  },

  inputTextStyle: {
    margin: 5,
    fontSize: 12,
    paddingBottom: 5
  },

  textInputAreaStyleClass: {
    // Setting up Hint Align center.
    textAlign: "left",

    padding: 10,

    margin: 15,

    color: Colors.BLACK,
    // Set border width.
    borderWidth: 1,
    // Set border Hex Color Code Here.
    borderColor: Colors.BACK_ARROW_COLOR,
    // Set border Radius.
    borderRadius: 2
  },

  updateEditProfileForm: {
    flex: 1,
    backgroundColor: "#FFF",
    marginTop: DEVICE_HEIGHT / 10,
    marginLeft: 25,
    marginRight: 25,
    marginBottom: 20
  },

  profileEditAboutMeTitle: {
    color: Colors.PROFILE_ABOUT_ME,
    fontSize: 14
  },

  textAreaContainer: {
    borderColor: COLORS.grey20,
    borderWidth: 0.5,
    padding: 5,
    marginTop: 15,
    marginBottom: 15
  },
  textArea: {
    height: 100,
    justifyContent: "flex-start"
  },

  roundedButtonStyleAppTheme: {
    height: DEVICE_HEIGHT / 17,
    width: DEVICE_WIDTH / 1.5,
    marginTop: 20,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center"
  },

  squareButtonStyleAppTheme: {
    height: DEVICE_HEIGHT / 15,
    width: DEVICE_WIDTH,
    marginTop: 20,
    borderColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center"
  },

  textInputStyleClass: {
    // Setting up Hint Align center.
    textAlign: "left",

    margin: 10,

    padding: 10,
    // Setting up TextInput height as 50 pixel.
    height: DEVICE_HEIGHT / 18,

    margin: 15,

    width: DEVICE_WIDTH / 1.2,

    color: Colors.BACK_ARROW_COLOR,
    // Set border width.
    borderWidth: 1,
    // Set border Hex Color Code Here.
    borderColor: "#E3E3E3",
    // Set border Radius.
    borderRadius: 2,
    //Set background color of Text Input.
    backgroundColor: "transparent"
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
  tagStyle: {
    height: DEVICE_HEIGHT / 17,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: Colors.COMMENT_TEXT_COLOR
  }
});