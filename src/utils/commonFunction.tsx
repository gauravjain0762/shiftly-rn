import Toast from "react-native-toast-message";
import { navigationRef } from "../navigation/RootContainer";
import { CommonActions } from "@react-navigation/native";
import ImagePicker from "react-native-image-crop-picker";
import moment from "moment";

export const successToast = (message: string) => {
  Toast.show({ type: "success", text1: message });
};

export const errorToast = (message: string) => {
  Toast.show({ type: "error", text1: message });
};

export const emailCheck = (email: string) => {
  let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
  if (reg.test(email) === false) {
    return false;
  } else {
    return true;
  }
};

export const nameCheck = (name: string) => {
  let reg = /^([a-zA-Z ]){2,30}$/;
  if (reg.test(name) === false) {
    return false;
  } else {
    return true;
  }
};

export const passwordCheck = (string: string) => {
  let reg = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{9,}$/;
  return reg.test(string);
};

export const mobileNumberCheck = (mobileNo: string) => {
  let reg = /^\d*$/;
  return reg.test(mobileNo);
};

export const resetNavigation = (name: string, params?: any | undefined) => {
  navigationRef.dispatch(
    CommonActions.reset({
      index: 1,
      routes: [{ name: name, params: params }],
    })
  );
};

export const navigateTo = (name: string, params?: any | undefined) => {
  navigationRef.navigate(name, params);
};

type ImagePickerProps = {
  params?: object;
  onSucess: (params: object) => void;
  onFail?: (params: { message: string }) => void | undefined;
};
export const openImagePicker = ({
  params,
  onSucess,
  onFail,
}: ImagePickerProps) => {
  try {
    ImagePicker.openPicker({
      multiple: false,
      cropping: false,
      mediaType: "photo",
      freeStyleCropEnabled: false,
      ...params,
    })
      .then((image) => {
        let obj = {
          ...image,
          uri: image.path,
          name: "image_" + moment().unix() + "_" + image.path.split("/").pop(),
        };
        onSucess(obj);
      })
      .catch((err) => {
        onFail?.(err);
      });
  } catch (error) {}
};
