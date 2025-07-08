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

interface CustomTextInputProps extends TextInputProps {
  label?: string;
  required?: boolean;
  showRightIcon?: boolean;
  containerStyle?: ViewStyle;
  imgStyle?: ImageStyle;
  onShow?: (e: boolean) => void;
}

const CustomTextInput: React.FC<CustomTextInputProps> = ({
  label,
  required = false,
  showRightIcon,
  containerStyle,
  imgStyle,
  onShow = () => {},
  ...rest
}) => {
  const {colors} = useTheme();
  const styles = React.useMemo(() => getGlobalStyles({colors}), [colors]);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={[styles.container, containerStyle]}>
      <TextInput
        style={styles.input}
        secureTextEntry={showPassword}
        {...rest}
      />
      {showRightIcon && (
        <TouchableOpacity
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
  const {colors} = props;
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
      ...commonFontStyle(700, 22, '#F4E2B8'),
      flex: 1,
    },
  });
};

export default CustomTextInput;
