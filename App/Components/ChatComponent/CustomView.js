import PropTypes from 'prop-types';
import React from 'react';
import {
    View,
    Text,
    WebView,
    Image,
    Linking,
    Platform,
    StyleSheet,
    TouchableOpacity,
    ViewPropTypes
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import { Icon } from "react-native-elements";
import Colors from '../../Constants/Colors';


const imgArray = ['jpg', 'JPG', 'png', 'PNG', 'jpeg', 'JPEG'];
const docArray = ["doc", "docx", "xls", "xlsx", "ppt", "pptx", "pdf","txt","rtf"];

export default class CustomView extends React.Component {
    renderPdf() {
        return (
            <TouchableOpacity style={[styles.container, this.props.containerStyle]} onPress={() => {

                Linking.openURL(this.props.currentMessage.file)

            }}>
                {/* <Image
                    {...this.props.imageProps}
                    style={[styles.image, this.props.imageStyle]}
                    source={{ uri: 'http://wwwimages.adobe.com/content/dam/acom/en/legal/images/badges/Adobe_PDF_file_icon_32x32.png' }}
                /> */}
                <Icon
                    size={32}
                    containerStyle={{margin:15}}
                    name='file'
                    type='font-awesome'
                    color={Colors.red_400}
                     />
            </TouchableOpacity>
        );
    }

    render() {
        console.log("Render Custom View >>>>" + JSON.stringify(this.props.currentMessage.file_type))
        if (docArray.includes(this.props.currentMessage.file_type)) {
          return this.renderPdf();
        } 
        return null;
    }
}

const styles = StyleSheet.create({
    container: {
    },
    mapView: {
        width: 150,
        height: 100,
        borderRadius: 13,
        margin: 3,
    },
    image: {
        width: 150,
        height: 100,
        borderRadius: 13,
        margin: 3,
        resizeMode: 'cover'
    },
    webview: {
        flex: 1,
    },
    imageActive: {
        flex: 1,
        resizeMode: 'contain',
    },
});

CustomView.defaultProps = {
    mapViewStyle: {},
    currentMessage: {
        image: null,
        file_type: null,
        template: null,
        template_html: null,
    },
    containerStyle: {},
    imageStyle: {},
};

CustomView.propTypes = {
    currentMessage: PropTypes.object,
    containerStyle: ViewPropTypes.style,
    mapViewStyle: ViewPropTypes.style,
    imageStyle: Image.propTypes.style,
    imageProps: PropTypes.object,
};