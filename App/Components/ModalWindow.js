import SnackBar from "react-native-snackbar-dialog-options";
import Colors from "../Constants/Colors";
import Strings from "../Constants/Strings";
import {
    View,
    Image,
    ImageBackground,
    StyleSheet,
    TouchableOpacity,
    Alert,
    Platform,
    TextInput,
    ScrollView,
    AsyncStorage,
    ImageEditor,
    TouchableWithoutFeedback,
    Dimensions,
    KeyboardAvoidingView,
    Linking,
    Keyboard,
    TouchableHighlight

} from 'react-native';
import Modal from "react-native-modal";
import { Header } from "react-native-elements";
import HeaderScreenStyle from "../Components/CommonComponent/HeaderStyle";

class ModalWindow extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
        }
    }
    show() {
        this.setState({
            showModal: true,
        })
    }
    hide() {
        this.setState({
            showModal: false,
        })
    }

    renderCenterFilterOne() {
        return <View>
            <Text style={styles.titleTextStyle}>
              {"Found your ideal property! That’s great!"}
            </Text>
          </View>;
    }

    renderRightFilterOne() {
        return (
            <TouchableOpacity
                hitSlop={HeaderScreenStyle.touchableAreaStyle}
                onPress={() => this.hide()}>
                {/* <Image source={require("../../Assets/filter.png")} /> */}
                <Icon
                    name="times-circle"
                    type="font-awesome"
                    size={24}
                    color={Colors.COLOR_CUTTY_SHARK}
                    onPress={() => this.hide()}
                />
            </TouchableOpacity>
        );
    }

    render() {
        return (
            <Modal
                style={{ backgroundColor: "#FFF" }}
                isVisible={this.state.showModal}
                onBackdropPress={() => this.setState({ isVisible: false })}>
                <View style={{ flex: 1, margin: 10 }}>
                    <View style={styles.header}>
                        <Header
                            backgroundColor={"#fff"}
                            leftComponent={this.renderLeftFilterComponent()}
                            centerComponent={this.renderCenterFilterOne()}
                            rightComponent={this.renderRightFilterOne()}
                        />
                    </View>
                    <View style={{ flex: 1 }}>
                       
                    </View>
                </View>
            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        padding: 5
    },
    field: {
        color: '#d9d9d9',
        flex: 2,
        fontSize: 13,
        fontWeight: '500',
        padding: 3,
        borderRadius: 3,
        borderWidth: 1,
        borderColor: '#d9d9d9',
        height: 40,
        marginVertical: 5
    },
    button: {
        flex: 2,
        padding: 3,
        borderRadius: 3,
        borderWidth: 1,
        backgroundColor: '#d9d9d9',
        height: 40,
        marginVertical: 10
    },
    buttonLabel: {
        color: '#ffffff',
        fontSize: 13,
        fontWeight: '500'
    },
    emailItem: {
        borderBottomWidth: 0.5,
        borderColor: 'rgba(0,0,0,0.3)',
        padding: 10
    },
    emailSubject: {
        color: 'rgba(0,0,0,0.5)'
    },
    searchInput: {
        padding: 10,
        borderColor: '#CCC',
        borderWidth: 1
    },
    searchBarContainer: {
        justifyContent: "center",
        padding: 10,
        backgroundColor: "#f2f2f2",
        width: "100%"
    },
    searchBar: {
        borderRadius: 5,
        backgroundColor: "white",
        height: 38,
        fontSize: 15,
        width: "100%",
        paddingHorizontal: 10
    },
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white"
    },
    defaultSeparator: {
        height: 1,
        width: "80%",
        alignSelf: "center",
        backgroundColor: "#f2f2f2"
    },
    flatList: { height: "100%", width: "100%", backgroundColor: "transparent" }
});
                  
export default ModalWindow