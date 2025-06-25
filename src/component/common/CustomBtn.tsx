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

interface CustomTextInputProps extends TextInputProps {
  label: string;
  required?: boolean;
  showRightIcon?: boolean;
  onPress?: any;
}

const CustomBtn: React.FC<CustomTextInputProps> = ({
  label,
  required = false,
  showRightIcon,
  onPress,
  ...rest
}) => {
  const {colors} = useTheme();
  const styles = React.useMemo(() => getGlobalStyles({colors}), [colors]);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <TouchableOpacity onPress={() => onPress()}>
      <ImageBackground
        source={IMAGES.btnBg}
        resizeMode="cover"
        style={styles.btnStyle}>
        <Text style={styles.label}>{label}</Text>
      </ImageBackground>
    </TouchableOpacity>
  );
};

const getGlobalStyles = (props: any) => {
  const {colors} = props;
  return StyleSheet.create({
    btnStyle: {
      height: 59,
      justifyContent: 'center',
      alignItems: 'center',
    },
    label: {
      ...commonFontStyle(500, 20, '#051A33'),
      top: -3,
    },
  });
};

export default CustomBtn;
