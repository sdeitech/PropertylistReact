import {
  StyleSheet,
  Platform,
  Dimensions
} from 'react-native';
import Colors from '../Constants/Colors';
const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;
const window = Dimensions.get('window');
let DeviceType = (window.height / window.width) > 1.6 ? 'Phone' : 'Tablet';

export default StyleSheet.create({



  mainContainer: {
    position: 'absolute',
    flex: 1,
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    width: null,
    height: null,

  },

  contactContainer: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: "#f5f5f5",
    alignItems: 'center',
    justifyContent: "center",


  },

  container: {
    width: DEVICE_WIDTH,
    height: DEVICE_HEIGHT,
    flex: 1,
    flexDirection: 'column',
    backgroundColor: "#f5f5f5",
    alignItems: 'center'
  },

  scrollContainer: {
    width: '100%',
    flex: 0.7,
    backgroundColor: Colors.BACKGROUND_COLOR_GENERAL,
    paddingLeft: (DeviceType == 'Tablet' ? 100 : 0),
    paddingRight: (DeviceType == 'Tablet' ? 100 : 0)

  },

  dashboardContainer: {
    width: DEVICE_WIDTH,
    flex: 1,
    flexDirection: 'column',
    backgroundColor: "#f5f5f5",
    justifyContent: 'center'


  },

  talkcontainer: {
    width: DEVICE_WIDTH,
    height: DEVICE_HEIGHT,
    paddingLeft: 30,
    paddingRight: 30,
    flex: 1,
    flexDirection: 'column',
    backgroundColor: "#f5f5f5",
    alignItems: 'center'


  },

  scrollViewcontainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: (DeviceType == 'Tablet') ? DEVICE_WIDTH - 80 : DEVICE_WIDTH,

  },

  headerImageBackgroundStyle: {
    justifyContent: "center",
    alignItems: "center",
    height: 100,
    width: 100,
    borderRadius: 100 / 2,
    backgroundColor: '#EAE3E1',
    marginTop: 30
  },

  KidsSelectionHeaderImageBackgroundStyle: {
    justifyContent: "center",
    alignItems: "center",
    height: 100,
    width: 100,
    borderRadius: 100 / 2,
    backgroundColor: '#EAE3E1',
    marginTop: 30
  },

  bottomTabIcons: { width: 36, height: 36 },
  activityIndicatorStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.TRANSPARENT,
    width: window.width,
    height: window.height
  },

  navBarStyle: {
    backgroundColor: 'white',
    justifyContent: "center",
    //   alignItems: 'center',
    height: 60,
    paddingTop: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    elevation: 5,
    flexDirection: 'row'

  },
  navBarTextStyle: {
    fontSize: 17,
    textAlign: 'center',
    fontWeight: '400'
  },
  surveyQuestionTextStyle: {
    flex: 1,
    textAlign: "center",
    color: 'black',
    fontWeight: "700",
    fontSize: 17,
    marginTop: 20,
    marginLeft: 30,
    marginRight: 30,
    lineHeight: 24,
    letterSpacing: 2
  },

  giftWelcomeTextStyle: {
    textAlign: "center",
    color: Colors.GRAY_TEXT_COLOR,
    fontWeight: "500",
    fontSize: 16,
    marginTop: 10,
    marginLeft: 20,
    marginRight: 20,
    lineHeight: 24,
    letterSpacing: 2
  },



  modalHeaderTextStyle: {
    flex: 0.3,
    textAlign: "center",
    color: 'black',
    fontWeight: "500",
    fontSize: 17,
    marginTop: 50,
    marginLeft: 30,
    marginRight: 30,
    lineHeight: 24,
    letterSpacing: 2
  },

  FBButtonSectionStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.BUTTON,
    borderWidth: 1,
    borderColor: Colors.TRANSPARENT,
    height: 50,
    borderRadius: 40,
    marginLeft: 15,
    marginRight: 15,
    marginTop: 15
  },

  pregnantButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.TRANSPARENT,
    marginTop: 15,
    marginLeft: 30,
    marginRight: 30,


  },

  pregnantButtonYesStyle: {
    flex: 0.42,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 45,
    backgroundColor: Colors.WHITE,
    shadowOffset: { width: 0.2, height: 0.2 },
    shadowColor: Colors.GRAY_COLOR,
    shadowOpacity: 0.2,
    elevation: 0.2
  },

  pregnantButtonNoStyle: {
    flex: 0.42,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 45,
    backgroundColor: Colors.WHITE,
    shadowOffset: { width: 0.2, height: 0.2 },
    shadowColor: Colors.GRAY_COLOR,
    shadowOpacity: 0.2,
    elevation: 0.2
  },

  pregnantButtonYesTextStyle: {
    flex: 1,
    color: Colors.BLACK,
    textAlign: 'center',
    fontSize: 15,
    letterSpacing: 2,
    backgroundColor: Colors.TRANSPARENT

  },

  pregnantButtonNoTextStyle: {
    flex: 1,
    color: Colors.BLACK,
    textAlign: 'center',
    fontSize: 15,
    letterSpacing: 2

  },

  datePickerContainerStyle: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,

  },


  buttonTextStyle: {
    flex: 1,
    color: Colors.WHITE,
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 1

  },

  bottomButtonView: {
    flex: 0.2,
    flexDirection: 'column',
    backgroundColor: Colors.TRANSPARENT,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 10
  },

  bottomButtonViewWithPrevious: {
    flex: 0.2,
    flexDirection: 'column',
    backgroundColor: Colors.BACKGROUND_COLOR_GENERAL,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 20,
    paddingTop: (Platform.OS == 'android') ? 10 : 0,
  },

  deviderView: {
    flexDirection: 'row',
    backgroundColor: Colors.TRANSPARENT,
    alignItems: 'center',
    marginTop: 15,
    marginLeft: 30,
    marginRight: 30,
  },

  deviderStyle: {
    flex: 0.45,
    height: 0.5,
    backgroundColor: Colors.GRAY_COLOR
  },
  deviderTextStyle: {
    flex: 0.1,
    textAlign: 'center',
    fontWeight: '500',
    fontSize: 16


  },
  styleSelectionContainer: {
    height: 22,
    paddingLeft: 20,
    paddingRight: 20,
    alignSelf: 'center'


  },

  whatBuystyleSelectionContainer: {
    flex: 0.2



  },
  kidsContainer: {
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: "row",
    marginLeft: 20,
    marginRight: 20,
    marginTop: 20,
    width: '100%',
    paddingTop: 10,
    paddingLeft: 10,
    paddingRight: 10

  },

  kidsEnrollContainer: {
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: "row",
    marginLeft: 20,
    marginRight: 20,
    marginTop: 20,
    width: '100%',
    padding: 5
  },

  kidsUnselectedStyle: {
    backgroundColor: Colors.TRANSPARENT

  },

  kidsSelectedStyle: {

    backgroundColor: '#F7EDE8'
  },
  kidsTextStyle: {

    marginTop: 8,
    fontSize: 17,
    letterSpacing: 2,
    color: Colors.BLACK,
    fontWeight: "100"
  },
  subtitle: {
    width: "85%",
    margin: 5,
    color: Colors.BLACK,
    fontWeight: "100",
    fontSize: 18,
    marginTop: 30,
    letterSpacing: 2,
    alignSelf: 'flex-start'

  },

  modalViewStyle: {
    flex: 1, paddingTop: 50,
    backgroundColor: Colors.WHITE,
    justifyContent: 'center',
    alignItems: 'center',

  },


  kidSelectionColor: {
    backgroundColor: Colors.SELECTED_COLOR,
    shadowOffset: { width: 0.5, height: 0.5 },
    shadowColor: 'black',
    shadowOpacity: 0.5,
    elevation: 0.5

  },

  giftAmountContainer: {
    marginTop: 5,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginLeft: 30,
    marginRight: 30,
    backgroundColor: Colors.TRANSPARENT
  },
  selectedAmountTextStyle: {
    flex: 0.7,
    fontWeight: '400',
    letterSpacing: 2,
    fontSize: 16,
    color: Colors.LABEL_TEXT_COLOR
  },
  amountTextInut: {

    flex: 0.2,
    borderBottomColor: Colors.GRAY,
    fontSize: 18,
    borderBottomWidth: 1,
    alignItems: 'center',
    textAlign: 'center',
    fontWeight: '400',
    letterSpacing: 2

  },

  materialTextInputStyle: {

    width: 100

  },

  whatToBuyText: {
    flex: 1,
    color: "black",
    letterSpacing: 0.5,
    fontSize: 16,
    padding: 5,
    marginLeft: 4,
    fontWeight: '400'
  }


});