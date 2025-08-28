import React from 'react';
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {commonFontStyle, hp, wp} from '../../theme/fonts';
import {colors} from '../../theme/colors';
import {IMAGES} from '../../assets/Images';
import CustomImage from '../common/CustomImage';

interface Props {
  name: string;
  picture: string;
  selected: boolean;
  responsibility: string;
  onPressEmployee: () => void;
}

const EmplyoeeCard = ({
  name,
  picture,
  selected,
  responsibility,
  onPressEmployee,
}: Props) => {
  return (
    <TouchableOpacity
      onPress={onPressEmployee}
      style={styles.employeeCardWrapper}>
      <View style={styles.employeeCard}>
        <View style={styles.employeeLeft}>
          <CustomImage
            uri={
              picture
                ? picture
                : 'https://images.unsplash.com/photo-1750912228794-92ec92276a50?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDV8Ym84alFLVGFFMFl8fGVufDB8fHx8fA%3D%3D'
            }
            imageStyle={{height: '100%', width: '100%'}}
            containerStyle={styles.avatar2}
            resizeMode="stretch"
          />
          <View style={styles.employeeTextWrapper}>
            <Text style={styles.title}>{`${name || 'Tafnol Theresa'}`}</Text>
            <Text style={styles.subtitle}>{`${
              responsibility || 'Hotel Management'
            }`}</Text>
          </View>
        </View>

        <Pressable onPress={onPressEmployee}>
          {selected ? (
            <Image source={IMAGES.checked} style={styles.checkImg} />
          ) : (
            <View style={styles.unselectedCircle} />
          )}
        </Pressable>
      </View>
    </TouchableOpacity>
  );
};

export default EmplyoeeCard;

const styles = StyleSheet.create({
  employeeCardWrapper: {
    marginTop: hp(10),
  },
  employeeCard: {
    gap: wp(15),
    paddingVertical: hp(7),
    paddingHorizontal: wp(12),
    flexDirection: 'row',
    borderRadius: wp(20),
    borderWidth: wp(1.5),
    alignItems: 'center',
    borderColor: colors._C9B68B,
    justifyContent: 'space-between',
  },
  employeeLeft: {
    gap: wp(12),
    flexDirection: 'row',
    alignItems: 'center',
  },
  employeeTextWrapper: {
    gap: hp(6),
    width: '50%',
  },
  location: {
    ...commonFontStyle(400, 15, colors._939393),
  },
  salary: {
    ...commonFontStyle(400, 15, colors._939393),
  },
  title: {
    ...commonFontStyle(700, 20, colors._0B3B75),
  },
  subtitle: {
    ...commonFontStyle(400, 16, colors._4A4A4A),
  },
  avatar2: {
    width: wp(100),
    height: hp(100),
    borderRadius: wp(10),
    overflow: 'hidden',
  },
  checkImg: {
    width: wp(24),
    height: wp(24),
    resizeMode: 'contain',
    tintColor: colors._4A4A4A,
  },
  unselectedCircle: {
    width: wp(24),
    height: wp(24),
    borderWidth: wp(2),
    borderRadius: wp(12),
    borderColor: colors._4A4A4A,
  },
});
