import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {ActivitiesCard, BackHeader, LinearContainer} from '../../../component';
import {commonFontStyle, hp, wp} from '../../../theme/fonts';
import {colors} from '../../../theme/colors';
import {AppStyles} from '../../../theme/appStyles';
import {navigateTo} from '../../../utils/commonFunction';
import {SCREEN_NAMES} from '../../../navigation/screenNames';

const activities = [
  {
    id: '1',
    name: 'Marriot Hotel',
    subtitle: 'Restaurant Manager',
    details: 'Full Time - Dubai',
    time: '1 Hour ago',
    tag: 'Shortlisted',
  },
  {
    id: '2',
    name: 'Donald Christain',
    subtitle: 'Marriot Group Dubai',
    details: 'Interview Request',
    time: '2 Hour ago',
    tag: 'Chat',
  },
  {
    id: '3',
    name: 'Marriot Hotel',
    subtitle: 'Restaurant Manager',
    details: 'Full Time - Dubai',
    time: '1 Hour ago',
    tag: 'Shortlisted',
  },
  {
    id: '4',
    name: 'Donald Christain',
    subtitle: 'Marriot Group Dubai',
    details: 'Interview Request',
    time: '2 Hour ago',
    tag: 'Chat',
  },
];

const ActivityScreen = () => {
  return (
    <LinearContainer colors={['#0D468C', '#041326']}>
      <View style={styles.topConrainer}>
        <BackHeader containerStyle={styles.header} />
        <TouchableOpacity style={styles.tab}>
          <Text style={styles.activeTabText}>Active Chats</Text>
        </TouchableOpacity>
        <Text style={styles.activitiesTitle}>{'My Activities'}</Text>
      </View>
      <FlatList
        data={activities}
        style={AppStyles.flex}
        keyExtractor={item => item.id}
        renderItem={(item: any) => (
          <ActivitiesCard
            onPress={() => navigateTo(SCREEN_NAMES?.Messages)}
            {...item}
          />
        )}
        contentContainerStyle={styles.scrollContainer}
        ItemSeparatorComponent={() => <View style={{height: hp(22)}} />}
        showsVerticalScrollIndicator={false}
      />
    </LinearContainer>
  );
};

export default ActivityScreen;

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
    borderBottomWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },
  header: {
    paddingLeft: wp(13),
  },
  activitiesTitle: {
    ...commonFontStyle(700, 20, colors.white),
    marginTop: hp(22),
  },
  scrollContainer: {
    paddingVertical: hp(22),
    paddingHorizontal: wp(25),
  },
});
