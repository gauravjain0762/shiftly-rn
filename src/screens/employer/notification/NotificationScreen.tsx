import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {ActivitiesCard, BackHeader, LinearContainer} from '../../../component';
import {commonFontStyle, hp, wp} from '../../../theme/fonts';
import {colors} from '../../../theme/colors';
import {AppStyles} from '../../../theme/appStyles';
import {SafeAreaView} from 'react-native-safe-area-context';
import NotificationCard from '../../../component/employe/NotificationCard';
import BaseText from '../../../component/common/BaseText';

const notifications = [
  {
    id: '1',
    icon: 'check-circle',
    text: '10 People have applied in this vacancy last 1 hour',
    time: '10:30 PM',
    highlight: false,
  },
  {
    id: '2',
    icon: 'star',
    text: 'Congratulations, your profile has been completed post your job.',
    time: '10:40 PM',
    highlight: true,
  },
  {
    id: '3',
    icon: 'check-circle',
    text: 'Royal Tech Solution view your profile and shortlist for interview.',
    time: '10:50 PM',
    highlight: false,
  },
  {
    id: '4',
    icon: 'check-circle',
    text: 'your resume upload successfully for Zentech UI/Ux Designer Position.',
    time: '10:30 PM',
    highlight: false,
  },
  {
    id: '5',
    icon: 'star',
    text: 'Congratulations, your profile has been completed post your job.',
    time: '10:40 PM',
    highlight: true,
  },
  {
    id: '6',
    icon: 'check-circle',
    text: 'Royal Tech Solution view your profile and shortlist for interview.',
    time: '10:50 PM',
    highlight: false,
  },
  {
    id: '5',
    icon: 'star',
    text: 'Congratulations, your profile has been completed post your job.',
    time: '10:40 PM',
    highlight: true,
  },
  {
    id: '6',
    icon: 'check-circle',
    text: 'Royal Tech Solution view your profile and shortlist for interview.',
    time: '10:50 PM',
    highlight: false,
  },
];
const NotificationScreen = () => {
  return (
    <LinearContainer colors={['#0D468C', '#041326']}>
      <SafeAreaView style={{flex: 1}} edges={['bottom']}>
        <View style={styles.topConrainer}>
          <BackHeader
            containerStyle={styles.header}
            isRight={true}
            title={'Notifications'}
            RightIcon={<View style={{width: 20}} />}
          />
        </View>
        <FlatList
          data={[]} // notificaitons
          style={AppStyles.flex}
          keyExtractor={(_, index) => index.toString()}
          renderItem={(item: any) => <NotificationCard {...item} />}
          contentContainerStyle={styles.scrollContainer}
          ItemSeparatorComponent={() => <View style={{height: hp(22)}} />}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={() => {
            return (
              <View style={styles.emptyContainer}>
                <BaseText style={styles.emptyText}>
                  {'There is no notification available'}
                </BaseText>
              </View>
            );
          }}
        />
      </SafeAreaView>
    </LinearContainer>
  );
};

export default NotificationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tab: {
    backgroundColor: colors.white,
    paddingVertical: hp(14),
    borderRadius: 10,
    alignItems: 'center',
    marginTop: hp(22),
  },
  activeTabText: {
    ...commonFontStyle(700, 20, colors._0B3B75),
  },
  topConrainer: {
    paddingHorizontal: wp(25),
    paddingVertical: hp(18),
    // borderBottomWidth: 1,
    // borderColor: 'rgba(255, 255, 255, 0.8)',
  },
  header: {
    // paddingLeft: wp(13),
    marginBottom: hp(1),
  },

  scrollContainer: {
    flexGrow: 1,
    // paddingVertical: hp(22),
    paddingHorizontal: wp(25),
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    textAlign: 'center',
    ...commonFontStyle(400, 18, colors.white),
  },
});
