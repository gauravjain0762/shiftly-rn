import {Image, ScrollView, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {BackHeader, LinearContainer} from '../../../component';
import {useTranslation} from 'react-i18next';
import {SCREEN_WIDTH, commonFontStyle, hp, wp} from '../../../theme/fonts';
import {IMAGES} from '../../../assets/Images';
import {colors} from '../../../theme/colors';

const notifications = [
  {
    id: 1,
    icon: IMAGES.notification_check,
    title: '10 People have applied in this vacancy last 1 hour',
    time: '10:30 PM',
  },
  {
    id: 2,
    icon: IMAGES.notification_star,
    title: 'Congratulations, your profile has been completed post your job.',
    time: '10:40 PM',
  },
  {
    id: 3,
    icon: IMAGES.notification_check,
    title: 'Royal Tech Solution view your profile and shortlist for interview.',
    time: '10:50 PM',
  },
  {
    id: 4,
    icon: IMAGES.notification_check,
    title:
      'your resume upload successfully for Zentech UI/Ux Designer Position.',
    time: '10:30 PM',
  },
  {
    id: 5,
    icon: IMAGES.notification_star,
    title: 'Congratulations, your profile has been completed post your job.',
    time: '10:40 PM',
  },
  {
    id: 6,
    icon: IMAGES.notification_check,
    title: 'Royal Tech Solution view your profile and shortlist for interview.',
    time: '10:50 PM',
  },
  {
    id: 7,
    icon: IMAGES.notification_star,
    title:
      'your resume upload successfully for Zentech UI/Ux Designer Position.',
    time: '10:50 PM',
  },
];

const CoNotification = () => {
  const {t} = useTranslation();

  return (
    <LinearContainer colors={['#FFF8E6', '#F3E1B7']}>
      <BackHeader
        type="company"
        title={t('Notifications')}
        containerStyle={styles.header}
        isRight={false}
        titleStyle={styles.title}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}>
        {notifications.map(item => (
          <View key={item.id} style={styles.card}>
            <View style={styles.cardContent}>
              <Image source={item.icon} style={styles.icon} />
              <View style={{flex: 1}}>
                <Text style={styles.notificationTitle}>{item?.title}</Text>
                <Text style={styles.time}>{item?.time}</Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </LinearContainer>
  );
};

export default CoNotification;

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: wp(35),
    paddingTop: hp(26),
  },
  title: {
    marginRight: 'auto',
    marginLeft: wp(((SCREEN_WIDTH - 70) / 2) * 0.5),
  },
  scrollContainer: {
    paddingBottom: hp(20),
    paddingHorizontal: wp(26),
    paddingTop: hp(10),
  },
  card: {
    borderRadius: 18,
    padding: wp(16),
    marginBottom: hp(16),
    borderWidth: 1.5,
    borderColor: '#C9B68B',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  icon: {
    width: wp(40),
    height: wp(40),
    resizeMode: 'contain',
    marginRight: wp(16),
  },
  notificationTitle: {
    ...commonFontStyle(500, 16, colors._3B3939),
    marginBottom: hp(8),
  },
  time: {
    ...commonFontStyle(500, 16, colors._464646),
  },
});
