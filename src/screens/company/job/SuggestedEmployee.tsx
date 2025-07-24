import {Image, ScrollView, StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import {BackHeader, GradientButton, LinearContainer} from '../../../component';
import {commonFontStyle, hp, wp} from '../../../theme/fonts';
import {colors} from '../../../theme/colors';
import {IMAGES} from '../../../assets/Images';
import {useTranslation} from 'react-i18next';
import {navigateTo} from '../../../utils/commonFunction';
import {SCREEN_NAMES} from '../../../navigation/screenNames';
import EmplyoeeCard from '../../../component/employe/EmplyoeeCard';
import BottomModal from '../../../component/common/BottomModal';

const SuggestedEmployee = () => {
  const {t} = useTranslation();
  const [isSelected, setIsSelected] = useState<boolean>(false);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(true);

  return (
    <>
      <LinearContainer colors={['#FFF8E6', '#F3E1B7']}>
        <View style={styles.container}>
          <View style={styles.header}>
            <BackHeader
              type={'company'}
              RightIconStyle={styles.rightIcon}
              title={t('Suggested Employee')}
              RightIcon={<Image source={IMAGES.bell} />}
            />

            <View style={styles.card}>
              <Image source={{uri: IMAGE_URL}} style={styles.avatar} />
              <View style={styles.textContainer}>
                <Text style={styles.title}>{'Restaurant Manager'}</Text>
                <Text style={styles.subtitle}>
                  {'Atlantis, The Palm, Dubai'}
                </Text>
                <View style={styles.row}>
                  <Text style={styles.location}>
                    {'Dubai, UAE - Full Time'}
                  </Text>
                  <Text style={styles.salary}>{'AED 10k'}</Text>
                </View>
              </View>
            </View>

            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{t('Suggested Employee')}</Text>
              <View style={styles.inviteButton}>
                <Image source={IMAGES.invite_all} />
                <Text style={styles.inviteText}>{t('Invite All')}</Text>
              </View>
            </View>
          </View>

          <ScrollView
            style={styles.scrollContainer}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}>
            {[...Array(4)].map((_, index) => (
              <EmplyoeeCard
                key={index}
                selected={isSelected}
                setIsSelected={setIsSelected}
              />
            ))}
          </ScrollView>

          <GradientButton
            style={styles.btn}
            type="Company"
            title={t('Submit')}
            onPress={() => setIsModalVisible(true)}
          />
        </View>
      </LinearContainer>

      <BottomModal
        visible={isModalVisible}
        backgroundColor={colors._FAEED2}
        onClose={() => setIsModalVisible(false)}>
        <View style={styles.modalIconWrapper}>
          <Image
            source={IMAGES.check}
            tintColor={colors._FAEED2}
            style={styles.modalCheckIcon}
          />
        </View>

        <View>
          <Text style={styles.modalTitle}>{'Job Posted Successfully'}</Text>
          <Text style={styles.modalSubtitle}>
            {
              'We’re excited to post your job. get ready to start receiving profiles.'
            }
          </Text>
        </View>

        <GradientButton
          style={styles.btn}
          type="Company"
          title={t('View Listing')}
          onPress={() => navigateTo(SCREEN_NAMES.SuggestedEmployee)}
        />

        <Text
          onPress={() => setIsModalVisible(false)}
          style={styles.modalHomeText}>
          {'Home'}
        </Text>
      </BottomModal>
    </>
  );
};

export default SuggestedEmployee;

const IMAGE_URL =
  'https://images.unsplash.com/photo-1750912228794-92ec92276a50?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDV8Ym84alFLVGFFMFl8fGVufDB8fHx8fA%3D%3D';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: hp(20),
    paddingHorizontal: wp(25),
  },
  header: {},
  rightIcon: {
    tintColor: colors._0B3970,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: hp(20),
  },
  card: {
    gap: wp(14),
    padding: hp(14),
    marginTop: hp(10),
    flexDirection: 'row',
    borderRadius: wp(20),
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  avatar: {
    width: wp(56),
    height: hp(56),
    borderRadius: wp(56),
  },
  avatar2: {
    width: wp(100),
    height: hp(100),
    borderRadius: wp(10),
  },
  textContainer: {
    flex: 1,
    gap: hp(5),
  },
  title: {
    ...commonFontStyle(700, 20, colors._0B3B75),
  },
  subtitle: {
    ...commonFontStyle(400, 16, colors._4A4A4A),
  },
  row: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  location: {
    ...commonFontStyle(400, 15, colors._939393),
  },
  salary: {
    ...commonFontStyle(400, 15, colors._939393),
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: hp(22),
    justifyContent: 'space-between',
  },
  sectionTitle: {
    ...commonFontStyle(700, 20, colors._4A4A4A),
  },
  inviteButton: {
    backgroundColor: colors._0B3970,
    borderRadius: wp(50),
    paddingVertical: hp(10),
    paddingHorizontal: wp(14),
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(5),
  },
  inviteText: {
    ...commonFontStyle(400, 12.5, colors.white),
  },
  btn: {
    marginVertical: hp(25),
  },
  modalIconWrapper: {
    width: wp(90),
    height: hp(90),
    alignSelf: 'center',
    borderRadius: wp(90),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors._0B3970,
  },
  modalCheckIcon: {
    width: wp(30),
    height: hp(30),
    borderRadius: wp(30),
  },
  modalTitle: {
    textAlign: 'center',
    marginVertical: hp(16),
    ...commonFontStyle(600, 25, colors.black),
  },
  modalSubtitle: {
    textAlign: 'center',
    ...commonFontStyle(400, 18, colors._6B6B6B),
  },
  modalHomeText: {
    marginBottom: hp(20),
    textAlign: 'center',
    ...commonFontStyle(400, 19, colors._B4B4B4),
  },
});
