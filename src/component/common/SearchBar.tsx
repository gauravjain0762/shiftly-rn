import React from 'react';
import {View, TextInput, StyleSheet, Image, ViewStyle} from 'react-native';
import {commonFontStyle, hp, wp} from '../../theme/fonts';
import {colors} from '../../theme/colors';
import {IMAGES} from '../../assets/Images';

type SearchBarProps = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  containerStyle?: ViewStyle;
  inputStyle?: ViewStyle;
  type?: 'company' | 'employe';
};

const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  placeholder = 'Search by keyword...',
  containerStyle,
  inputStyle,
  type = 'employe',
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      <Image
        source={IMAGES.search}
        style={[
          styles.img,
          {tintColor: type == 'company' ? colors._0B3970 : colors.white},
        ]}
      />
      <TextInput
        style={[
          styles.input,
          {color: type == 'company' ? colors._0B3970 : colors.white},
          inputStyle,
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={type == 'company' ? colors._0B3970 : colors.white}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#1557A8',
    borderWidth: 1,
    borderRadius: 30,
    paddingHorizontal: wp(24),
    paddingVertical: hp(14),
    gap: wp(12),
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    ...commonFontStyle(400, 15, colors.white),
  },
  img: {
    width: wp(22),
    height: wp(22),
    resizeMode: 'contain',
    tintColor: colors.white,
  },
});

export default SearchBar;
