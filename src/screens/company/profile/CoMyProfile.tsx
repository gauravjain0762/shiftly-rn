import React, {useCallback} from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import {BackHeader, GradientButton, LinearContainer} from '../../../component';
import {useTranslation} from 'react-i18next';
import {commonFontStyle, hp, wp} from '../../../theme/fonts';
import {colors} from '../../../theme/colors';
import {useGetProfileQuery} from '../../../api/authApi';
import {navigateTo} from '../../../utils/commonFunction';
import {SCREENS} from '../../../navigation/screenNames';
import {useFocusEffect} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import { RootState } from '../../../store';

const CoMyProfile = () => {
  const {t} = useTranslation();
  const {data, refetch} = useGetProfileQuery();
  const companyProfile = data?.data?.company;
  console.log('🔥🔥🔥 ~ CoMyProfile ~ companyProfile:', companyProfile);
  const {companyProfileData} = useSelector((state: RootState) => state.auth);
  console.log('🔥🔥🔥 ~ CoMyProfile ~ companyProfileData:', companyProfileData);

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, []),
  );

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
          <Image
            source={{uri: companyProfile?.logo}}
            style={{height: hp(90), width: wp(90), borderRadius: wp(90)}}
          />
          <View>
            <Text style={styles.coTitle}>
              {companyProfile?.company_name || 'Marriott'}
            </Text>
            <Text style={styles.typeText}>{'Restaurant & Hospital'}</Text>
          </View>
        </View>

        <Text style={styles.descText}>
          {companyProfile?.about ||
            'Dubai is a city of grand visions and endless wonders, where towering skyscrapers & luxurious malls meet the ancient allure of desert dunes & vibrant souks.'}
        </Text>

        <View style={{marginTop: hp(18), gap: hp(35)}}>
          <View style={styles.space}>
            <Text style={styles.labelText}>{t('Email')}</Text>
            <Text style={styles.labelDesc}>
              {companyProfile?.email || 'marriott@restaurant.com'}
            </Text>
          </View>
          <View style={styles.space}>
            <Text style={styles.labelText}>{t('Phone')}</Text>
            <Text
              style={
                styles.labelDesc
              }>{`🇦🇪 +${companyProfile?.phone_code} ${companyProfile?.phone}`}</Text>
          </View>
          <View style={styles.space}>
            <Text style={styles.labelText}>{t('Location')}</Text>
            <Text style={styles.labelDesc}>
              {`${
                companyProfile?.address ||
                companyProfile?.location ||
                ' JLT Dubai, United Arab Emirates'
              }`}
            </Text>
          </View>
        </View>

        <GradientButton
          style={styles.btn}
          type="Company"
          title={t('Edit Profile')}
          onPress={() => {
            navigateTo(SCREENS.CoEditMyProfile);
          }}
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
