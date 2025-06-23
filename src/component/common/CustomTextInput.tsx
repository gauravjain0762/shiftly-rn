import React from 'react';
import {View, Text, TextInput, StyleSheet, TextInputProps} from 'react-native';
import {commonFontStyle} from '../../theme/fonts';
import {useTheme} from '@react-navigation/native';

interface CustomTextInputProps extends TextInputProps {
  label: string;
  required?: boolean;
}

const CustomTextInput: React.FC<CustomTextInputProps> = ({
  label,
  required = false,
  ...rest
}) => {
  const {colors} = useTheme();
  const styles = React.useMemo(() => getGlobalStyles({colors}), [colors]);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {label}
        {required && <Text style={styles.required}>*</Text>}
      </Text>
      <TextInput style={styles.input} {...rest} />
    </View>
  );
};

const getGlobalStyles = (props: any) => {
  const {colors} = props;
  return StyleSheet.create({
    container: {
      marginBottom: 15,
    },
    label: {
      marginBottom: 5,
      ...commonFontStyle(500, 16, colors.black),
    },
    required: {
      color: 'red',
    },
    input: {
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 8,
      paddingLeft: 20,
      marginTop: 3,
      height: 50,
    },
  });
};

export default CustomTextInput;
