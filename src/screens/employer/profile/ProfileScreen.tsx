import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback} from 'react';
import {LinearContainer} from '../../../component';
import {commonFontStyle, hp, wp} from '../../../theme/fonts';
import {colors} from '../../../theme/colors';
import {IMAGES} from '../../../assets/Images';
import {goBack, navigateTo} from '../../../utils/commonFunction';
import {SCREENS} from '../../../navigation/screenNames';
import {useSelector} from 'react-redux';
import {RootState} from '../../../store';
import {SafeAreaView} from 'react-native-safe-area-context';

import CustomImage from '../../../component/common/CustomImage';
import BaseText from '../../../component/common/BaseText';

const ProfileScreen = () => {
  const {userInfo} = useSelector((state: RootState) => state.auth);
  console.log('🔥 ~ ProfileScreen ~ userInfo:', userInfo);

  const handleEditProfile = async () => {
    navigateTo(SCREENS.CreateProfileScreen);
  };

  const HeaderWithAdd = useCallback(
    ({title}: any) => (
      <View style={styles.headerRow}>
        <BaseText style={styles.title}>{title}</BaseText>
      </View>
    ),
    [],
  );

  const Section = useCallback(
    ({title, content}: any) => (
      <View style={styles.card}>
        <HeaderWithAdd title={title} />
        <BaseText style={styles.content}>{content}</BaseText>
      </View>
    ),
    [],
  );

  return (
    <LinearContainer colors={['#0D468C', '#041326']}>
      <ScrollView
        contentContainerStyle={styles.scrollContiner}
        showsVerticalScrollIndicator={false}>
        <Pressable
          onPress={() => goBack()}
          style={{padding: wp(23), paddingBottom: 0}}>
          <Image
            source={IMAGES.backArrow}
            style={{height: hp(20), width: wp(24)}}
          />
        </Pressable>
        <SafeAreaView style={styles.container} edges={['bottom']}>
          <CustomImage
            source={
              userInfo?.picture
                ? {uri: userInfo?.picture}
                : {uri: 'https://randomuser.me/api/portraits/women/44.jpg'}
            }
            imageStyle={{height: '100%', width: '100%'}}
            containerStyle={styles.avatar}
            resizeMode="cover"
          />
          <BaseText style={styles.name}>{userInfo?.name || "N/A"}</BaseText>
          <View style={styles.locationRow}>
            <Image source={IMAGES.marker} style={styles.locationicon} />
            <BaseText style={styles.location}>{userInfo?.location || "N/A"}</BaseText>
          </View>

          <TouchableOpacity
            onPress={handleEditProfile}
            style={styles.editButton}>
            <BaseText style={styles.editButtonText}>Edit Profile</BaseText>
          </TouchableOpacity>

          {/* <TouchableOpacity
            onPress={() => {
              navigateTo(SCREENS.ViewProfileScreen);
            }}
            style={styles.statsRow}>
            <BaseText style={styles.statText}>0 Connections</BaseText>
            <BaseText
              style={[
                styles.statText,
                {opacity: 0.6, color: 'rgba(255, 255, 255, 1)'},
              ]}>
              0 Profile Views
            </BaseText>
          </TouchableOpacity> */}

          <View style={styles.completionCard}>
            <BaseText style={styles.completionTitle}>
              Profile completion
            </BaseText>
            <View style={styles.row}>
              <View style={styles.progressBarBg}>
                <View
                  style={[
                    styles.progressBarFill,
                    {width: userInfo?.profile_completion * 2.75},
                  ]}
                />
              </View>
              <BaseText
                style={
                  styles.percentage
                }>{`${userInfo?.profile_completion}%` || "N/A"}</BaseText>
            </View>
            <View style={styles.progressRow}>
              <BaseText style={styles.progressText}>
                Keep it up! you’re halfway there.
              </BaseText>
            </View>
          </View>

          {/* Section: About Me */}
          <Section title="About me" content={userInfo?.about || "N/A"} />

          {/* Section: Professional Experience */}
          <Section
            title="Professional Experience"
            content={userInfo?.experience?.title|| "N/A"}
          />

          {/* Section: My Languages */}
          <View style={[styles.card, {width: '90%'}]}>
            <HeaderWithAdd title="My Languages" />
            <View style={styles.languageContainer}>
              {userInfo?.languages?.length ? userInfo?.languages?.map((item: any, index: number) => (
                <View key={index} style={[styles.skillBadge]}>
                  <BaseText style={styles.skillText}>{item?.name}</BaseText>
                </View>
              )) : 
                <BaseText  style={styles.skillText}>{"N/A"}</BaseText>
              }
            </View>
          </View>

          {/* Section: Education */}
          <Section
            title="Education"
            onPress={() => {
              navigateTo(SCREENS.CreateProfileScreen);
            }}
            content={userInfo?.education?.degree || 'N/A'}
          />

          {/* Section: Skills */}
          <View style={styles.card}>
            <HeaderWithAdd title="Skills" />
            <View style={styles.skillContainer}>
              {userInfo?.skills?.length ? (
                userInfo?.skills?.map((skill: any) => (
                  <View key={skill} style={styles.skillBadge}>
                    <BaseText style={styles.skillText}>{skill?.title}</BaseText>
                  </View>
                ))
              ) : (
                <BaseText style={styles.skillText}>{'N/A'}</BaseText>
              )}
            </View>
          </View>
        </SafeAreaView>
      </ScrollView>
    </LinearContainer>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    borderRadius: 12,
  },
  avatar: {
    width: wp(130),
    height: wp(130),
    borderRadius: 100,
    overflow: 'hidden',
  },
  name: {
    ...commonFontStyle(600, 25, colors.white),
    marginTop: 8,
  },
  locationRow: {
    flexDirection: 'row',
    gap: wp(16),
    marginTop: hp(8),
  },
  location: {
    ...commonFontStyle(400, 20, colors.white),
  },
  editButton: {
    marginTop: hp(25),
    paddingVertical: hp(10),
    paddingHorizontal: wp(30),
    borderWidth: 1,
    borderRadius: 10,
    borderColor: colors._F4E2B8,
  },
  editButtonText: {
    ...commonFontStyle(400, 17, colors._F4E2B8),
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: hp(24),
    paddingHorizontal: wp(50),
    borderBottomWidth: hp(1),
    borderColor: 'rgba(255, 255, 255, 0.2)',
    paddingBottom: hp(20),
  },
  statText: {
    ...commonFontStyle(500, 15, colors._F4E2B8),
  },
  completionCard: {
    backgroundColor: colors._F4E2B8,
    borderRadius: 12,
    padding: 14,
    marginTop: 16,
    margin: wp(20),
  },
  completionTitle: {
    ...commonFontStyle(600, 18, colors._051C38),
    marginBottom: hp(4),
  },
  progressBarBg: {
    width: '80%',
    height: hp(6),
    borderRadius: 6,
    marginVertical: 8,
    backgroundColor: 'rgba(209, 197, 166, 0.8)',
  },
  progressBarFill: {
    backgroundColor: '#111827',
    height: 6,
    borderRadius: 6,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressText: {
    ...commonFontStyle(500, 15, colors._4F4F4F),
  },
  percentage: {
    ...commonFontStyle(500, 25, '#051D3A'),
  },
  ctaCard: {
    marginTop: 16,
    backgroundColor: '#F5F5F5)',
    paddingHorizontal: wp(26),
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: hp(20),
    marginBottom: hp(20),
  },
  ctaTextContainer: {
    flex: 1,
    gap: hp(8),
  },
  ctaTitle: {
    ...commonFontStyle(700, 17, colors.white),
    marginBottom: 2,
  },
  ctaSubtitle: {
    ...commonFontStyle(400, 14, colors.white),
  },
  ctaArrow: {
    ...commonFontStyle(700, 16, '#fff'),
  },
  locationicon: {
    width: wp(24),
    height: wp(24),
    resizeMode: 'contain',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  right: {
    width: wp(18),
    height: wp(18),
    resizeMode: 'contain',
    transform: [{rotate: '180deg'}],
    tintColor: colors._F4E2B8,
    marginLeft: 20,
  },
  card: {
    width: '90%',
    backgroundColor: '#0B3970',
    borderRadius: 20,
    paddingHorizontal: wp(18),
    marginBottom: hp(15),
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: '#104686',
    paddingBottom: hp(26),
    marginHorizontal: wp(21),
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: hp(11),
    marginBottom: hp(16),
  },
  title: {
    ...commonFontStyle(700, 22, colors.white),
  },
  plus: {
    width: wp(14),
    height: wp(14),
    resizeMode: 'contain',
  },
  addButton: {
    backgroundColor: colors._F4E2B8,
    position: 'absolute',
    right: 0,
    paddingHorizontal: wp(16),
    paddingVertical: hp(13),
    borderBottomLeftRadius: 20,
  },
  content: {
    ...commonFontStyle(400, 16, '#E7E7E7'),
    lineHeight: hp(25),
    marginTop: hp(6),
  },
  subtitle: {
    ...commonFontStyle(500, 21, colors.white),
  },
  languageContainer: {
    gap: wp(8),
    flexWrap: 'wrap',
    flexDirection: 'row',
    alignItems: 'center',
  },
  languageText: {
    ...commonFontStyle(500, 14, '#fff'),
    marginTop: 12,
    marginBottom: 4,
  },
  slider: {
    width: '100%',
    marginTop: 4,
  },
  skillContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
    gap: 8,
  },
  skillBadge: {
    borderWidth: 1,
    borderColor: '#FBE7BD',
    borderRadius: 8,
    paddingVertical: hp(10),
    paddingHorizontal: wp(16),
    marginRight: wp(5),
    marginBottom: 8,
  },
  skillText: {
    ...commonFontStyle(400, 16, '#F4E2B8'),
  },
  certRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  certImage: {
    width: 82,
    height: 58,
    resizeMode: 'contain',
  },
  scrollContiner: {},
});
