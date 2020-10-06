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
      marginLeft: 5,
      marginRight: 5,
      padding: 5
    },
    subContainerStyle: {
      marginTop: 10,
      marginBottom: 15,
      marginLeft: 5,
      marginRight: 5,
      padding: 5
    },
    btnContainerStyle: {
      marginLeft: 5,
      flexDirection: "row"
    },
    textHeaderStyle: {
      fontSize: 18,
      marginTop: 5
      // marginRight:DEVICE_WIDTH/2.8
    },
    imgHeaderStyle: {
      marginRight: 15,
      marginTop: 10
    },
    textStyle: {
      marginLeft: 10,
      fontSize: 14
    },
    btnStyle: {
      borderColor: "#545454",
      borderWidth: 1,
      borderRadius: 20,
      paddingLeft: 13,
      paddingRight: 13,
      paddingBottom: 3,
      paddingTop: 3,
      marginLeft: 10,
      marginRight: 10,
      marginBottom: 20
    },
    searchInputStyle: {
      borderColor: "#545454",
      borderWidth: 1,
      borderRadius: 10,
      textAlignVertical: "top",
      marginRight: 5,
      padding: 5
    },
    roundedButtonStyleAppTheme: {
      height: DEVICE_HEIGHT / 20,
      width: DEVICE_WIDTH / 2,
      margin: 20,
      backgroundColor: "#00BCD4",
      borderRadius: 30,
      borderWidth: 1,
      borderColor: "transparent",
      justifyContent: "center",
      alignItems: "center",
      alignSelf: "center"
    },
    roundedButtonStyleAppThemeNew: {
      height: DEVICE_HEIGHT / 20,
      width: DEVICE_WIDTH / 2.5,
      backgroundColor: "#00BCD4",
      borderRadius: 30,
      borderWidth: 1,
      borderColor: "transparent",
      justifyContent: "center",
      alignItems: "center",
      alignSelf: "center"
    }
  });