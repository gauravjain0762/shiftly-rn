import React from 'react';
import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import {commonFontStyle, hp, wp} from '../../theme/fonts';
import {colors} from '../../theme/colors';
import {IMAGES} from '../../assets/Images';

interface Props {
  selected: boolean;
  setIsSelected: (val: boolean) => void;
}

const EmplyoeeCard = ({selected, setIsSelected}: Props) => {
  return (
    <View style={styles.employeeCardWrapper}>
      <View style={styles.employeeCard}>
        <View style={styles.employeeLeft}>
          <Image
            source={{
              uri: 'https://images.unsplash.com/photo-1750912228794-92ec92276a50?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDV8Ym84alFLVGFFMFl8fGVufDB8fHx8fA%3D%3D',
            }}
            style={styles.avatar2}
          />
          <View style={styles.employeeTextWrapper}>
            <Text style={styles.title}>{'Tafnol Theresa'}</Text>
            <Text style={styles.subtitle}>{'Hotel Management'}</Text>
            <Text style={styles.location}>{'5y Experience'}</Text>
          </View>
        </View>

        <Pressable onPress={() => setIsSelected(!selected)}>
          {selected ? (
            <Image source={IMAGES.checked} style={styles.checkImg} />
          ) : (
            <View style={styles.unselectedCircle} />
          )}
        </Pressable>
      </View>
    </View>
  );
};

export default EmplyoeeCard;

const styles = StyleSheet.create({
  employeeCardWrapper: {
    marginTop: hp(10),
  },
  employeeCard: {
    gap: wp(15),
    padding: hp(7),
    flexDirection: 'row',
    borderRadius: wp(20),
    borderWidth: wp(1.5),
    alignItems: 'center',
    borderColor: colors._C9B68B,
    justifyContent: 'space-between',
  },
  employeeLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(17),
  },
  employeeTextWrapper: {
    gap: hp(10),
  },
  checkImg: {
    width: wp(24),
    height: wp(24),
    marginRight: wp(10),
    resizeMode: 'contain',
    tintColor: colors._4A4A4A,
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
  },
  unselectedCircle: {
    width: wp(24),
    height: wp(24),
    borderWidth: wp(2),
    marginRight: wp(10),
    borderRadius: wp(12),
    borderColor: colors._4A4A4A,
  },
});
