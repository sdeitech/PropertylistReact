import {StyleSheet,Dimensions} from "react-native";
import Colors from '../../Constants/Colors';
import Strings from '../../Constants/Strings';
import COLORS from '../../Constants/Colors';


const DEVICE_WIDTH = Dimensions.get("window").width;
const DEVICE_HEIGHT = Dimensions.get("window").height;

export default StyleSheet.create({
containerStyle:{
    margin: 10
},
  updateForm: {
    flex: 1,
    backgroundColor: "#FFF",
    marginLeft: 5,
    marginRight: 5,
    padding:10   
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
    bgImageStyle:{ 
        flex:1, 
        height: DEVICE_HEIGHT/3, 
        resizeMode: "contain" 
    },
    linkTextStyle: {
        fontSize: 14,
        color: "#01C3D7",
        textDecorationLine: "underline",
        textDecorationColor: "#01C3D7",
        marginLeft: 5                                       
     },
    roundedButtonStyleAppThemeNew: {
        height: DEVICE_HEIGHT / 20,
        width: DEVICE_WIDTH / 2.5,
        borderRadius: 30,
        borderWidth: 1,
        borderColor: "transparent",
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center"
    },

    propertyPriceCard: {
        flex: 1,
        backgroundColor: "#FFF",
        padding: 10
    },
    mapLocationCard: {
        flex: 1,
        marginTop:15,
        backgroundColor: "#FFF",
        padding: 10
    },
    propertyIDCard: {
        flex: 1,
        marginTop: 15,
        marginBottom: 10,
        backgroundColor: "#FFF",
        padding: 10
    },
    divider:{
        marginTop: 5,
        marginBottom: 5,
        borderBottomColor: 'black',
        borderBottomWidth: 0.3,
    },
    priceLabel:{
        fontSize:24,
        fontWeight:"bold"
    },
    btnStyle: {
       
        borderColor: COLORS.VIEW_HIGHLIGHT_COLOR,
        borderWidth: 2,
        borderRadius: 30,
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 5,
        paddingBottom: 5,
        justifyContent: "center", alignContent: "center", alignSelf: "center", alignItems: "center"
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
    dividerView:{
        marginTop: 5,
        marginBottom: 5,
        borderBottomColor: Colors.grey_400,
        borderBottomWidth: 0.3,
    },
    radioButtonStyleProperty: {
        borderColor: "#545454",
        borderWidth: 1,
        borderRadius: 25,
        paddingLeft: 15,
        paddingRight: 15,
        paddingBottom: 5,
        paddingTop: 5,
        marginLeft: 5,
        marginRight: 5,
        marginBottom: 5,
        shadowColor: 'rgba(0,0,0, .4)', // IOS
        shadowOffset: { height: 1, width: 1 }, // IOS
        shadowOpacity: 1, // IOS
        shadowRadius: 1, //IOS
        backgroundColor: '#fff',
        elevation: 2, // Android
    },
    propertyHighlightStyle: {
        backgroundColor:Colors.WHITE,
        borderColor: COLORS.VIEW_HIGHLIGHT_COLOR,
        borderWidth: 2,
        borderRadius: 20,
        paddingLeft: 5,
        paddingRight: 5,
        paddingTop: 5,
        paddingBottom: 5,
        margin:2
    },

    touchableAreaStyle: {
        top: 80, bottom: 80, left: 80, right: 80
    },
    horizontalDivider: {
        width: DEVICE_WIDTH / 1.2,
        margin: 10,
        borderBottomColor: COLORS.grey_400,
        borderBottomWidth: 1,
    },
    modalRoundedButtonStyleAppTheme: {
        height: DEVICE_HEIGHT / 18,
        width: DEVICE_WIDTH/1.8,
        borderWidth: 1,
        borderRadius:30,
        borderColor: "transparent",
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center",

    },

});