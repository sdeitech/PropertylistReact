
import SnackBar from "react-native-snackbar-dialog-options";
import Colors from "../Constants/Colors";
import Strings from "../Constants/Strings";
import { AsyncStorage,Alert} from "react-native";
import firebase from "react-native-firebase";
import type, { RemoteMessage } from "react-native-firebase";



    export function  validateEmail(email){
        var re = /^(([^<>()\[\]\\,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }

    export function validatePassword(password) {
        var re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{6,}/;
        
        return re.test(password);
    }

    export function validateName (text){
            var re = /^[a-zA-Z ]*$/;
            return re.test(text);
    }
    export function validateAboutMe (text){
            var re = /^[a-zA-Z _ '.,-]{0,500}$/;
            return re.test(text);
    }

      export function validateNumber (text){
            var re = /^[0-9]*$/;
            return re.test(text);
    }

    export function showErrorMessage (text){
            
        return SnackBar.show(text, {
          style: {
            flex: 1,
            marginBottom: 20
          },
          // backgroundColor: Colors.RED,
          textColor: "white",
          position: "top",
          duration: 3000,
          gradientColors: {
            gradient1: Colors.START_COLOR,
            gradient2: Colors.END_COLOR
          },
          gradient: true,
          containerGradientStyle: { padding: 30, marginTop: 10 }
        });

    }

export function toTitleCase(str) {
  return str.replace(
    /\w\S*/g,
    function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    }
  );
}

export function commafy(num) {
  var str = num.toString().split('.');
  if (str[0].length >= 5) {
    str[0] = str[0].replace(/(\d)(?=(\d{3})+$)/g, '$1,');
  }
  if (str[1] && str[1].length >= 5) {
    str[1] = str[1].replace(/(\d{3})/g, '$1 ');
  }
  return str.join('.');
}

export function checkUserVerifed() {
  var isVerified = false;


  AsyncStorage.getItem(Strings.KEY_USER_DATA)
    .then(value => {
      if (value) {
        var userData = JSON.parse(value);
        console.log("checkUserVerifed==== userData ===", JSON.stringify(userData));

        if (userData.is_id_verified_by_admin){
         
          isVerified=true;
        }
      }
    })
    .done();


  return isVerified;


}







