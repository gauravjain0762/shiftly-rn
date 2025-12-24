import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TextInputProps,
  TouchableOpacity,
  Image,
  ImageBackground,
} from 'react-native';
import {commonFontStyle} from '../../theme/fonts';
import {useTheme} from '@react-navigation/native';
import {IMAGES} from '../../assets/Images';
import { colors } from '../../theme/colors';

interface CustomTextInputProps extends TextInputProps {
  label: string;
  required?: boolean;
  showRightIcon?: boolean;
  onPress?: any;
  outline?: any;
  btnStyle?: any;
}

const CustomBtn: React.FC<CustomTextInputProps> = ({
  label,
  required = false,
  showRightIcon,
  outline,
  btnStyle,
  onPress,
  ...rest
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <TouchableOpacity onPress={() => onPress()}>
      <ImageBackground
        source={outline ? IMAGES.outlineBtn : IMAGES.btnBg}
        resizeMode="cover"
        style={[styles.btnStyle,{height: outline ? 70 : 53,},btnStyle]}>
        <Text style={[styles.label,{color:outline ? colors.white : colors.black}]}>{label}</Text>
      </ImageBackground>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  btnStyle: {
      height: 59,
      alignItems: 'center',
      justifyContent: 'center',
    },
    label: {
      ...commonFontStyle(500, 20, '#051A33'),
      top: -3,
    },
});

export default CustomBtn;
