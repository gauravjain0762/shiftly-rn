import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import {BackHeader, GradientButton, LinearContainer} from '../../../component';
import {useTranslation} from 'react-i18next';
import {commonFontStyle, hp, wp} from '../../../theme/fonts';
import {IMAGES} from '../../../assets/Images';
import {colors} from '../../../theme/colors';

const CoMyProfile = () => {
  const {t} = useTranslation();

  return (
    <LinearContainer colors={['#FFF8E6', '#F3E1B7']}>
      <View style={styles.main}>
        <BackHeader
          type="company"
          isRight={false}
          title={t('My Profile')}
          titleStyle={styles.title}
          containerStyle={styles.header}
        />

        <View style={{flexDirection: 'row', alignItems: 'center', gap: wp(15)}}>
          <Image source={IMAGES.hotel_cover} />
          <View>
            <Text style={styles.coTitle}>{'Marriott'}</Text>
            <Text style={styles.typeText}>{'Restaurant & Hospital'}</Text>
          </View>
        </View>

        <Text style={styles.descText}>
          {
            'Dubai is a city of grand visions and endless wonders, where towering skyscrapers & luxurious malls meet the ancient allure of desert dunes & vibrant souks.'
          }
        </Text>

        <View style={{marginTop: hp(18), gap: hp(35)}}>
          <View style={styles.space}>
            <Text style={styles.labelText}>{t('Email')}</Text>
            <Text style={styles.labelDesc}>{'marriott@restaurant.com'}</Text>
          </View>
          <View style={styles.space}>
            <Text style={styles.labelText}>{t('Phone')}</Text>
            <Text style={styles.labelDesc}>{'🇦🇪 +971 25 367 1489'}</Text>
          </View>
          <View style={styles.space}>
            <Text style={styles.labelText}>{t('Location')}</Text>
            <Text style={styles.labelDesc}>
              {'JLT Dubai, United Arab Emirates'}
            </Text>
          </View>
        </View>

        <GradientButton
          style={styles.btn}
          type="Company"
          title={t('Edit Profile')}
          onPress={() => {}}
        />
      </View>
    </LinearContainer>
  );
};

export default CoMyProfile;

const styles = StyleSheet.create({
  main: {
    paddingHorizontal: wp(35),
  },
  header: {
    paddingTop: hp(24),
    marginBottom: hp(28),
  },
  title: {
    right: '60%',
  },
  coTitle: {
    ...commonFontStyle(600, 25, colors._0B3970),
  },
  typeText: {
    ...commonFontStyle(400, 20, colors._4D4D4D),
  },
  descText: {
    marginVertical: hp(18),
    ...commonFontStyle(400, 15, colors._656464),
  },
  labelText: {
    ...commonFontStyle(600, 20, colors._0B3970),
  },
  labelDesc: {
    ...commonFontStyle(400, 18, colors._555555),
  },
  space: {
    gap: hp(6),
  },
  btn: {
    marginTop: hp(40),
  },
});
