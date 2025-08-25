import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TextInputProps,
  TouchableOpacity,
  Image,
  ViewStyle,
  ImageStyle,
} from 'react-native';
import {commonFontStyle} from '../../theme/fonts';
import {useTheme} from '@react-navigation/native';
import {IMAGES} from '../../assets/Images';
import {colors} from '../../theme/colors';

interface CustomTextInputProps extends TextInputProps {
  label?: string;
  required?: boolean;
  showRightIcon?: boolean;
  containerStyle?: ViewStyle | any;
  imgStyle?: ImageStyle;
  isPassword?: boolean;
  inputStyle?: ViewStyle | any;
  onShow?: (e: boolean) => void;
}

const CustomTextInput: React.FC<CustomTextInputProps> = ({
  label,
  required = false,
  showRightIcon,
  containerStyle,
  imgStyle,
  inputStyle,
  isPassword = false,
  onShow = () => {},
  ...rest
}) => {
  const {colors} = useTheme();
  const styles = React.useMemo(() => getGlobalStyles({colors}), [colors]);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={[styles.container, containerStyle]}>
      <TextInput
        style={[styles.input, inputStyle]}
        secureTextEntry={isPassword && !showPassword}
        // placeholderTextColor={colors._F4E2B8}
        {...rest}
      />
      {showRightIcon && (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => (
            setShowPassword(!showPassword), onShow(!showPassword)
          )}>
          <Image
            source={!showPassword ? IMAGES.eye : IMAGES.eye_on}
            style={{
              width: 24,
              height: 24,
              resizeMode: 'contain',
              tintColor: '#F4E2B8',
              ...imgStyle,
            }}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const getGlobalStyles = (props: any) => {
  return StyleSheet.create({
    container: {
      marginBottom: 15,
      flexDirection: 'row',
      alignItems: 'center',
    },
    label: {
      marginBottom: 5,
      ...commonFontStyle(500, 16, colors.black),
    },
    required: {
      color: 'red',
    },
    input: {
      flex: 1,
      ...commonFontStyle(700, 22, colors._1F1F1F),
    },
  });
};

export default CustomTextInput;
