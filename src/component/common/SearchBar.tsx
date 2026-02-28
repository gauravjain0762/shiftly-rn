import React from 'react';
import { View, TextInput, StyleSheet, Image, ViewStyle } from 'react-native';
import { commonFontStyle, hp, wp } from '../../theme/fonts';
import { colors } from '../../theme/colors';
import { IMAGES } from '../../assets/Images';
import { isAndroid } from '../../utils/commonFunction';

type SearchBarProps = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  containerStyle?: ViewStyle;
  inputStyle?: ViewStyle;
  type?: 'company' | 'employe';
  autoFocus?: boolean;
  inputRef?: React.RefObject<TextInput | null>;
};

const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  placeholder = 'Search by keyword...',
  containerStyle,
  inputStyle,
  type = 'employe',
  autoFocus = false,
  inputRef,
}) => {
  return (
    <View style={[
      styles.container,
      type === 'company' && styles.companyContainer,
      containerStyle
    ]}>
      <Image
        source={IMAGES.search}
        style={[
          styles.img,
          { tintColor: type == 'company' ? colors._7B7878 : colors.white },
        ]}
      />
      <TextInput
        ref={inputRef}
        autoFocus={autoFocus}
        style={[
          styles.input,
          { color: type == 'company' ? colors._0B3970 : colors.white },
          inputStyle,
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={type == 'company' ? colors._7B7878 : colors.white}
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
    paddingVertical: isAndroid ? hp(7) : hp(14),
    gap: wp(12),
  },
  companyContainer: {
    backgroundColor: colors.white,
    borderColor: colors._0B3970,
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
