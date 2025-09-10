import React, {useCallback, useState} from 'react';
import {
  Image,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {BackHeader, GradientButton, LinearContainer} from '../../../component';
import {useTranslation} from 'react-i18next';
import {commonFontStyle, hp, wp} from '../../../theme/fonts';
import {colors} from '../../../theme/colors';
import {navigateTo} from '../../../utils/commonFunction';
import {SCREENS} from '../../../navigation/screenNames';
import {useSelector} from 'react-redux';
import {RootState} from '../../../store';
import {Flag} from 'react-native-country-picker-modal';
import {callingCodeToCountry} from '../../employer/profile/ViewProfileScreen';
import CustomImage from '../../../component/common/CustomImage';

const CoMyProfile = () => {
  const {t} = useTranslation();
  const {userInfo} = useSelector((state: RootState) => state.auth);
  const countryCode = userInfo?.phone_code || 'AE';

  return (
    <LinearContainer
      colors={['#FFF8E6', '#F3E1B7']}
      SafeAreaProps={{edges: ['top', 'bottom']}}
      containerStyle={{
        flex: 1,
        paddingBottom: Platform.OS === 'ios' ? hp(20) : undefined,
      }}>
      <View style={styles.main}>
        <BackHeader
          type="company"
          isRight={false}
          title={t('My Profile')}
          titleStyle={styles.title}
          containerStyle={styles.header}
        />
        <ScrollView scrollEnabled showsVerticalScrollIndicator={false}>
          {/* Profile Header */}
          <View style={styles.profileRow}>
            <CustomImage
              uri={userInfo?.logo}
              imageStyle={{height: '100%', width: '100%'}}
              containerStyle={styles.profileImage}
              resizeMode="stretch"
            />
            <View>
              <Text style={styles.coTitle}>
                {userInfo?.company_name || 'N/A'}
              </Text>
              <Text style={styles.typeText}>{userInfo?.name || 'N/A'}</Text>
            </View>
          </View>

          {/* About / Description */}
          <View style={{marginVertical: hp(18)}}>
            <Text style={styles.labelText}>{t('Description')}</Text>
            <Text style={styles.descText}>{userInfo?.about || 'N/A'}</Text>
          </View>

          {/* Info Section */}
          <View style={styles.infoContainer}>
            <View style={styles.space}>
              <Text style={styles.labelText}>{t('Email')}</Text>
              <Text
                style={[
                  styles.labelDesc,
                  {
                    textTransform: 'lowercase',
                  },
                ]}>
                {userInfo?.email || 'N/A'}
              </Text>
            </View>

            <View style={styles.space}>
              <Text style={styles.labelText}>{t('Phone')}</Text>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Flag
                  withEmoji
                  flagSize={hp(26)}
                  withFlagButton
                  countryCode={callingCodeToCountry(countryCode) as any}
                />
                <Text style={styles.labelDesc}>
                  {`+${countryCode} ${userInfo?.phone}` || 'N/A'}
                </Text>
              </View>
            </View>

            <View style={styles.space}>
              <Text style={styles.labelText}>{t('Location')}</Text>
              <Text style={styles.labelDesc}>{userInfo?.address || 'N/A'}</Text>
            </View>

            {/* Website */}
            <View style={styles.space}>
              <Text style={styles.labelText}>{t('Website')}</Text>
              <Text
                style={[styles.labelDesc, {color: colors._0B3970}]}
                onPress={async () => {
                  let link = userInfo?.website;
                  if (link && !link.startsWith('http')) {
                    link = `https://${link}`;
                  }
                  if (link && (await Linking.canOpenURL(link))) {
                    Linking.openURL(link);
                  }
                }}>
                {userInfo?.website ? `${userInfo?.website}` : 'N/A'}
              </Text>
            </View>

            {/* Company Size */}
            <View style={styles.space}>
              <Text style={styles.labelText}>{t('Company Size')}</Text>
              <Text style={styles.labelDesc}>
                {userInfo?.company_size || 'N/A'}
              </Text>
            </View>

            {/* Business Type */}
            <View style={styles.space}>
              <Text style={styles.labelText}>{t('Business Type')}</Text>
              <Text style={styles.labelDesc}>
                {userInfo?.business_type_id?.title || 'N/A'}
              </Text>
            </View>
          </View>

          {/* Edit Button */}
          <GradientButton
            style={styles.btn}
            type="Company"
            title={t('Edit Profile')}
            onPress={() => {
              navigateTo(SCREENS.CoEditMyProfile);
            }}
          />
        </ScrollView>
      </View>
    </LinearContainer>
  );
};

export default CoMyProfile;

const styles = StyleSheet.create({
  main: {
    flex: 1,
    paddingHorizontal: wp(23),
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
    width: wp(90),
    height: hp(90),
    overflow: 'hidden',
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
    ...commonFontStyle(400, 18, colors._656464),
  },
  infoContainer: {
    gap: hp(26),
    // marginTop: hp(18),
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
    marginBottom: hp(10),
  },
  coverImage: {
    width: wp(120),
    height: hp(80),
    borderRadius: 10,
    overflow: 'hidden',
    marginRight: wp(12),
  },
});
