import Geolocation from '@react-native-community/geolocation';
import {Alert, Linking, PermissionsAndroid, Platform} from 'react-native';
import {API} from './apiConstant';
import {errorToast} from './commonFunction';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';

// export const requestLocationPermission = async (
//   onSucess: (res: any) => void,
//   onFail: (err: any) => void,
// ) => {
//   if (Platform.OS === 'ios') {
//     getCurrentPosition(
//       data => {
//         if (onSucess) onSucess(data);
//       },
//       error => {
//         if (onFail) onFail(error);
//         _openAppSetting();
//       },
//     );
//   } else {
//     try {
//       const granted = await PermissionsAndroid.request(
//         PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
//         // @ts-ignore
//       );
//       if (granted === PermissionsAndroid.RESULTS.GRANTED) {
//         loactionEnabler(
//           isEnabled => {
//             if (isEnabled) {
//               getCurrentPosition(
//                 data => {
//                   if (onSucess) onSucess(data);
//                 },
//                 error => {
//                   if (onFail) onFail(error);
//                 },
//               );
//             }
//           },
//           err => {
//             if (onFail) onFail(err);
//             loactionOffModal();
//           },
//         );
//       } else {
//         if (onFail) {
//           onFail({message: 'Permission denied'});
//           onFail(true);
//         }
//       }
//     } catch (err) {
//       console.warn(err);
//       onFail({message: 'Platform not supported'});
//     }
//   }
// };

export const requestLocationPermission = async (
  GetForcefully = true,
  onSuccess: (location: any) => void,
  onFail: any, // Use React Navigation or appropriate navigation prop
) => {
  if (Platform.OS === 'ios') {
    await requestIOSPermission(GetForcefully, onSuccess, onFail);
  } else if (Platform.OS === 'android') {
    await requestAndroidPermission(GetForcefully, onSuccess, onFail);
  } else {
    Alert.alert(
      'Unsupported Platform',
      'Location is not supported on this platform.',
      [
        {
          text: 'Back',
          onPress: () => onFail(),
        },
      ],
    );
  }
};

const requestIOSPermission = async (
  GetForcefully: boolean,
  onSuccess: (location: any) => void,
  onFail: any,
) => {
  console.log('Checking iOS location permissions...');
  try {
    const newStatus = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
    const permissionWhenInUse = PERMISSIONS.IOS.LOCATION_WHEN_IN_USE;
    const permissionAlways = PERMISSIONS.IOS.LOCATION_ALWAYS;
    console.log('newStatusnewStatus', newStatus);
    let permissionStatus = await check(permissionAlways);
    if (permissionStatus !== RESULTS.GRANTED) {
      permissionStatus = await check(permissionWhenInUse);
    }
    if (permissionStatus === RESULTS.GRANTED) {
      console.log('Permission already granted, fetching location...');
      getCurrentLocation(onSuccess);
      return;
    } else if (GetForcefully) {
      console.log('Requesting location permission...');
      if (newStatus === RESULTS.GRANTED) {
        console.log('Permission granted after request, fetching location...');
        getCurrentLocation(onSuccess);
      } else if (
        newStatus === RESULTS.BLOCKED ||
        newStatus === RESULTS.DENIED
      ) {
        console.log('Permission denied, showing settings alert...');
        showPermissionDeniedAlert(onFail);
      } else {
        console.log('Permission status unknown:', newStatus);
        onFail('Permission status unknown');
      }
    } else {
      console.log('Permission denied, not forcing request.');
      onSuccess('Permission denied');
    }
  } catch (error) {
    console.log('catch Part', error);
  }
};

const requestAndroidPermission = async (
  GetForcefully: boolean,
  onSuccess: (location: any) => void,
  onFail: any,
) => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );
    console.log('🔥🔥🔥 ~ requestAndroidPermission ~ granted 1:', granted);

    if (GetForcefully) {
      console.log('🔥🔥🔥 ~ requestAndroidPermission ~ granted 2:', granted);
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Started requesting');
        await RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({
          interval: 1000,
          fastInterval: 1000,
        })
          .then(() => getCurrentLocation(onSuccess))
          .catch(() => showEnableLocationAlert(onFail));
      } else {
        showPermissionDeniedAlert(onFail);
      }
    } else {
      await RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({
        interval: 1000,
        fastInterval: 1000,
      }).then(() => {
        getCurrentLocation(onSuccess);
      });
    }
  } catch (error) {
    console.warn(error);
    showPermissionDeniedAlert(onFail);
  }
};
const getCurrentLocation = (onSuccess: (location: any) => void) => {
  Geolocation?.getCurrentPosition(
    position => {
      const {latitude, longitude} = position.coords;
      console.log('latitude, longitude', latitude, longitude);
      const location = {
        latitude,
        longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      };
      onSuccess(location);
    },
    error => {
      console.warn(error);
    },
    {enableHighAccuracy: true, timeout: 60000},
  );
};

const showPermissionDeniedAlert = (onFail: any) => {
  Alert.alert(
    'Location Permission Required',
    'This feature requires location permissions.',
    [
      {text: 'cancel', onPress: () => onFail()},
      {
        text: 'Settings',
        onPress: () => Linking.openSettings(),
      },
    ],
  );
};

const showEnableLocationAlert = (onFail: any) => {
  Alert.alert(
    'Enable Location Services',
    'Location services are turned off. Please enable them to proceed.',
    [
      {text: 'cancel', onPress: () => onFail()},
      {
        text: 'Enable',
        onPress: () => promptForEnableLocationIfNeeded(),
      },
    ],
  );
};

const showSettingsAlert = (onFail: any) => {
  Alert.alert(
    'Location Permission Required',
    'Please enable location permissions in your app settings to proceed.',
    [
      {
        text: 'Cancel',
        onPress: () => onFail(),
      },
      {
        text: 'Settings',
        onPress: () => Linking.openSettings(),
      },
    ],
  );
};

export const loactionEnabler = async (
  onSucess?: (res: any) => void,
  onFail?: (err: any) => void,
) => {
  if (Platform.OS === 'android') {
    await promptForEnableLocationIfNeeded()
      .then((res: any) => {
        if (onSucess) onSucess(true);
        // The user has accepted to enable the location services
        // data can be :
        //  - "already-enabled" if the location services has been already enabled
        //  - "enabled" if user has clicked on OK button in the popup
      })
      .catch(err => {
        if (onFail) onFail(err);
        // The user has not accepted to enable the location services or something went wrong during the process
        // "err" : { "code" : "ERR00|ERR01|ERR02|ERR03", "message" : "message"}
        // codes :
        //  - ERR00 : The user has clicked on Cancel button in the popup
        //  - ERR01 : If the Settings change are unavailable
        //  - ERR02 : If the popup has failed to open
        //  - ERR03 : Internal error
      });
  }
};

export const loactionOffModal = () => {
  Alert.alert('Location Permission', 'Please turn on location services', [
    {
      text: 'Ok',
      onPress: () => {
        loactionEnabler();
      },
    },
  ]);
};

export const _openAppSetting = () => {
  Alert.alert(
    'Location Permission',
    'Please allow app to access your location',
    [
      {
        text: 'Setting',
        onPress: () => Linking.openSettings(),
      },
      {
        text: 'cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
    ],
  );
};

export const getAddress = async (
  region: any,
  onSucess?: any,
  onFailure?: any,
) => {
  const headersList = {};
  let url = `https://maps.googleapis.com/maps/api/geocode/json?address=${region?.latitude},${region?.longitude}&key=${API?.GOOGLE_MAP_API_KEY}`;
  fetch(url, {
    method: 'GET',
    headers: headersList,
  })
    .then(response => response.json())
    .then(responseJson => {
      console.log('responseJson--', responseJson);
      if (responseJson.status === 'OK') {
        return responseJson;
      } else {
        errorToast(responseJson?.status + ' ' + responseJson?.error_message);
      }
    })
    .then(async data => {
      onSucess(data);
    })
    .catch(error => {
      console.log('error------', error);
      onFailure(error);
    });
};
