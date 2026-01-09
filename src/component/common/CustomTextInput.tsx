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
import {commonFontStyle, hp} from '../../theme/fonts';
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
  const styles = React.useMemo(() => getGlobalStyles({colors}), [colors]);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text style={styles.label}>
          {label}
          {required && <Text style={styles.required}>*</Text>}
        </Text>
      )}
      <View style={styles.inputContainer}>
        <TextInput
          style={[
            styles.input,
            label && styles.inputWithLabel,
            inputStyle,
            label && { marginTop: 20 },
          ]}
          secureTextEntry={isPassword && !showPassword}
          textAlignVertical="center"
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
                tintColor: colors._0B3970,
                ...imgStyle,
              }}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const getGlobalStyles = (props: any) => {
  return StyleSheet.create({
    container: {
      marginBottom: 15,
    },
    label: {
      marginTop: hp(40),
      ...commonFontStyle(500, 16, colors.black),
    },
    required: {
      color: 'red',
      marginLeft: 2,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    input: {
      flex: 1,
      ...commonFontStyle(500, 22, colors._1F1F1F),
    },
    inputWithLabel: {
      marginTop: 0,
    },
  });
};

export default CustomTextInput;
