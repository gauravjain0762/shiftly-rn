import { Alert, Linking, PermissionsAndroid, Platform } from "react-native";
import Geolocation from "@react-native-community/geolocation";
// import Geolocation from "react-native-geolocation-service";
import RNAndroidLocationEnabler from "react-native-android-location-enabler";
import { errorToast } from "./commonFunction";
import { SCREEN_HEIGHT, SCREEN_WIDTH } from "../theme/fonts";

const ASPECT_RATIO = SCREEN_WIDTH / SCREEN_HEIGHT;
export const LATITUDE_DELTA = 0.0922;
export const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

export const requestLocationPermission = async (
  onSucess: (value: any) => void,
  onFail: (value: any) => void
) => {
  if (Platform.OS === "ios") {
    Geolocation.requestAuthorization("always");
    getCurrentPosition(
      (data) => {
        if (onSucess) onSucess(data);
      },
      (error) => {
        if (onFail) onFail(error);
        _openAppSetting();
      }
    );
  } else {
    console.log('====================================');
    console.log("dadsass");
    console.log('====================================');
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        //@ts-ignore
        {
          title: "Location Access Required",
          message: "This App needs to Access your location",
        }
      );
  
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('====================================');
        console.log('gransadasted',granted);
        console.log('====================================');
        getCurrentPosition(
          (data: any) => {
            console.log('====================================');
            console.log('data',data);
            console.log('====================================');
            if (onSucess) onSucess(data);
          },
          (error: any) => {
            console.log("location error", error);
            if (onFail) onFail(error);
          }
        );
        // await loactionEnabler(
        //   (isEnabled: boolean) => {
        //     if (isEnabled) {
        //       console.log('====================================');
        //       console.log("isEnabled");
        //       console.log('====================================');
        //       getCurrentPosition(
        //         (data: any) => {
        //           console.log('====================================');
        //           console.log('data',data);
        //           console.log('====================================');
        //           if (onSucess) onSucess(data);
        //         },
        //         (error: any) => {
        //           console.log("location error", error);
        //           if (onFail) onFail(error);
        //         }
        //       );
        //     }
        //   },
        //   (err: any) => {
        //     console.log('====================================');
        //     console.log('dasdas');
        //     console.log('====================================');
        //     if (onFail) onFail(err);
        //     loactionOffModal();
        //   }
        // );
      } else {
        _openAppSetting();
      }
    } catch (err) {
      console.warn(err);
    }
  }
};

const getCurrentPosition = async (
  onSucess: (value: any) => void,
  onFail: (value: any) => void
) => {
  await Geolocation.getCurrentPosition(
    async (pos) => {
      const crd = pos.coords;
      let position = {
        latitude: crd.latitude,
        longitude: crd.longitude,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      };
      if (onSucess) onSucess(position);
    },
    (error) => {
      if (onFail) onFail(error);
      errorToast(error?.message);
    },
    {
      enableHighAccuracy: false,
      timeout: 15000,
      maximumAge: 10000,
      // enableHighAccuracy: true,
      // timeout: 20000,
      // maximumAge: 1000,
      // distanceFilter: 1,
    }
  );
};

export const loactionEnabler = async (
  onSucess: (value: any) => void,
  onFail: (value: any) => void
) => {
  if (Platform.OS === "android") {
    await RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({
      interval: 10000,
      fastInterval: 5000,
    })
      .then((res) => {
        if (onSucess) onSucess(true);
        // The user has accepted to enable the location services
        // data can be :
        //  - "already-enabled" if the location services has been already enabled
        //  - "enabled" if user has clicked on OK button in the popup
      })
      .catch((err) => {
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

export const _openAppSetting = () => {
  Alert.alert(
    "Location Permission",
    "Please allow app to access your location",
    [
      {
        text: "Setting",
        onPress: () => Linking.openSettings(),
      },
      {
        text: "cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
    ]
  );
};

export const loactionOffModal = () => {
  Alert.alert("Location Permission", "Please turn on location services", [
    {
      text: "Ok",
      onPress: () => {
        loactionEnabler(
          () => {},
          () => {}
        );
      },
    },
  ]);
};

// {
//   enableHighAccuracy: true,
//   timeout: 20000,
//   maximumAge: 1000,
//   distanceFilter: 1,
// }
