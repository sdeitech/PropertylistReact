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
    height: 40,
    flexDirection:'row'
  },

  touchableAreaStyle:{
    top: 80, bottom: 80, left: 80, right: 80,
  }
  
});