import React, {useCallback} from 'react';
import {ActivityIndicator, Image, StyleSheet, Text, View} from 'react-native';
import {BackHeader, GradientButton, LinearContainer} from '../../../component';
import {useTranslation} from 'react-i18next';
import {commonFontStyle, hp, wp} from '../../../theme/fonts';
import {colors} from '../../../theme/colors';
import {navigateTo} from '../../../utils/commonFunction';
import {SCREENS} from '../../../navigation/screenNames';
import {useFocusEffect} from '@react-navigation/native';
import {IMAGES} from '../../../assets/Images';
import ImageWithLoader from '../../../component/common/ImageWithLoader';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';

const CoMyProfile = () => {
  const {t} = useTranslation();
  const {userInfo} = useSelector((state: RootState) => state.auth);
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

        <View style={styles.profileRow}>
          {userInfo?.logo ? (
            <ImageWithLoader
              source={{uri: userInfo.logo}}
              style={styles.profileImage}
              loaderSize="small"
              loaderColor={colors._0B3970}
              placeholder={
                <View style={styles.loaderContainer}>
                  <ActivityIndicator size="small" color={colors._0B3970} />
                </View>
              }
            />
          ) : (
            <Image
              source={IMAGES.avatar}
              style={{height: hp(51), width: wp(51), borderRadius: hp(51)}}
            />
          )}
          <View>
            <Text style={styles.coTitle}>{userInfo?.company_name}</Text>
            <Text style={styles.typeText}>
              {userInfo?.name || 'Restaurant & Hospital'}
            </Text>
          </View>
        </View>

        <View style={{marginVertical: hp(18)}}>
          <Text style={styles.labelText}>{t('Description')}</Text>
          <Text style={styles.descText}>
            {userInfo?.about ||
              'Dubai is a city of grand visions and endless wonders, where towering skyscrapers & luxurious malls meet the ancient allure of desert dunes & vibrant souks.'}
          </Text>
        </View>

        <View style={styles.infoContainer}>
          <View style={styles.space}>
            <Text style={styles.labelText}>{t('Email')}</Text>
            <Text style={styles.labelDesc}>
              {userInfo?.email || 'marriott@restaurant.com'}
            </Text>
          </View>
          <View style={styles.space}>
            <Text style={styles.labelText}>{t('Phone')}</Text>
            <Text style={styles.labelDesc}>
              {`🇦🇪 +${userInfo?.phone_code} ${userInfo?.phone}`}
            </Text>
          </View>
          <View style={styles.space}>
            <Text style={styles.labelText}>{t('Location')}</Text>
            <Text style={styles.labelDesc}>
              {userInfo?.address ||
                userInfo?.location ||
                ' JLT Dubai, United Arab Emirates'}
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
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(15),
  },
  profileImage: {
    height: hp(90),
    width: wp(90),
    borderRadius: wp(90),
  },
  coTitle: {
    ...commonFontStyle(600, 25, colors._0B3970),
  },
  typeText: {
    ...commonFontStyle(400, 20, colors._4D4D4D),
  },
  descText: {
    marginTop: hp(10),
    ...commonFontStyle(400, 15, colors._656464),
  },
  infoContainer: {
    marginTop: hp(18),
    gap: hp(35),
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
  loaderContainer: {
    width: wp(90),
    height: hp(90),
    borderRadius: hp(90),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f0f0',
  },
});
