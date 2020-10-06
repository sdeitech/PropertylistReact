import React, { Component } from 'react';

import {
    Image,
    View,
    Text,
    AsyncStorage,
    StyleSheet,
    ImageBackground
} from 'react-native';

import { Actions } from 'react-native-router-flux';
import Strings from "../../Constants/Strings";

class SplashScreen extends Component {

    constructor() {
        super();
        this.state = {

        };
    }

    componentWillMount() {
        setTimeout(() => {
            this._getUserData();
        }, 3000);
    }

    _getUserData = async () => {
        try {
            const userData = await AsyncStorage.getItem(Strings.KEY_USER_DATA);
            if (userData !== null && userData !== undefined) {
                console.log("_getUserData >>>> " + JSON.stringify(userData));
                //Actions.searchLocationScreen({ type: "reset" });
                Actions.searchLocationScreen({ type: "reset" });
            }else{
                Actions.signInScreen({ type: "reset" });
            }

    
        } catch (error) {
            // Error saving data
            console.log(" _getUserData Async Error >> " + error);
        }
    }

    render() {
        return (
            <ImageBackground style={styles.imgBackground}
                resizeMode='cover'
                source={require('../../Assets/Splash.png')}>
            </ImageBackground>

        );
    }

}

export default SplashScreen;

const styles = StyleSheet.create({

    imgBackground: {
        width: '100%',
        height: '100%',
        flex: 1
    },
});