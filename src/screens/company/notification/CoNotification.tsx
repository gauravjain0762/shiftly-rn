import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React from 'react';
import {BackHeader, LinearContainer} from '../../../component';
import {useTranslation} from 'react-i18next';
import {SCREEN_WIDTH, commonFontStyle, hp, wp} from '../../../theme/fonts';
import {IMAGES} from '../../../assets/Images';
import {colors} from '../../../theme/colors';
import BaseText from '../../../component/common/BaseText';

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

  const renderItem = ({item, index}: any) => (
    <View key={index} style={styles.card}>
      <View style={styles.cardContent}>
        <Image source={item.icon} style={styles.icon} />
        <View style={{flex: 1}}>
          <Text style={styles.notificationTitle}>{item?.title}</Text>
          <Text style={styles.time}>{item?.time}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <LinearContainer colors={['#FFF8E6', '#F3E1B7']}>
      <BackHeader
        type="company"
        title={t('Notifications')}
        containerStyle={styles.header}
        isRight={false}
        titleStyle={styles.title}
      />
      <FlatList
        data={[]}
        keyExtractor={(_, index) => index.toString()}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
        ListEmptyComponent={() => {
          return (
            <View style={styles.emptyContainer}>
              <BaseText style={styles.emptyText}>
                {t('There is no notification available')}
              </BaseText>
            </View>
          );
        }}
      />
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
    flexGrow: 1,
    paddingTop: hp(10),
    paddingBottom: hp(20),
    paddingHorizontal: wp(26),
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
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    textAlign: 'center',
    ...commonFontStyle(400, 18, colors.black),
  },
});
