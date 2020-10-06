// //import Moment from 'moment';
// import { PermissionsAndroid } from 'react-native';

// async function requestGalleryPermission() {
//   try {
//     const granted = await PermissionsAndroid.request(
//       PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
//       {
//         'title': 'BUCKiTDREAM',
//         'message': 'BUCKiTDREAM needs access to your external storage '
//       }
//     )
//     if (granted === PermissionsAndroid.RESULTS.GRANTED) {
//       console.log("You can use the gallery")
//     } else {
//       console.log("Camera permission denied")
//     }
//   } catch (err) {
//     console.warn(err)
//   }
// }

// async function requestContactPermission() {
//   try {
//     const granted = await PermissionsAndroid.request(
//       PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
//       {
//         'title': 'BUCKiTDREAM',
//         'message': 'BUCKiTDREAM needs access to your Contacts '
//       }


//     )
//     if (granted === PermissionsAndroid.RESULTS.GRANTED) {
//       console.log("You can use the gallery")
//     } else {
//       console.log("Camera permission denied")
//     }
//   } catch (err) {
//     console.warn(err)
//   }
// }


// const validateEmail = (email) => {
//   var re = /^(([^<>()\[\]\\,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
//   return re.test(email);
// };



// export { validateEmail,  requestGalleryPermission, requestContactPermission };