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
    flex: 1
  },
  profileContainer: {
    flex: 1
  },
  updateForm: {
    flex: 1,
    height: DEVICE_HEIGHT - 80,
    backgroundColor: "#FFF",
    marginTop: Platform.OS === "ios" ? DEVICE_HEIGHT / 10 : DEVICE_HEIGHT / 6,
    marginLeft: 25,
    marginRight: 25
  },
  changePasswordFrom: {
    flex: 1,
    backgroundColor: "#FFF",
    marginTop: Platform.OS === "ios" ? DEVICE_HEIGHT / 10 : DEVICE_HEIGHT / 6,
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
    marginTop: DEVICE_HEIGHT / 15,
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
    color: Colors.HEADER_DARK,
    fontWeight: "400",
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
    color: Colors.HEADER_DARK,
    fontWeight: "400",
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

  inputChangePasswordTextStyle: {
    margin: 5,
    fontSize: 14,
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
    fontSize: 14,
    color: Colors.HEADER_DARK,
    fontWeight: "400"
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
  roundedButtonStyleAppThemeSmall: {
    height: DEVICE_HEIGHT / 25,
    width: DEVICE_WIDTH / 3,
    marginTop: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center"
  },
  profileIconStyle: {
    borderRadius: 50,
    height: 100,
    backgroundColor: COLORS.GRAY,
    width: 100,
    flex: 0
  },
  profileImgUpdateStyle: {
    flexDirection: "column",
    alignItems: "center",
    marginLeft: 20,
    marginRight: 20
  },
  modalCancelStyle: {
    alignSelf: "center",
    fontSize: 16,
    padding: 20,
    textAlign: "center"
  }
});