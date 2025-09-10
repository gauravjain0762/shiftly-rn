import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import {ActivitiesCard, BackHeader, LinearContainer} from '../../../component';
import {commonFontStyle, hp, wp} from '../../../theme/fonts';
import {colors} from '../../../theme/colors';
import {AppStyles} from '../../../theme/appStyles';
import {navigateTo} from '../../../utils/commonFunction';
import {SCREEN_NAMES} from '../../../navigation/screenNames';
import NoDataText from '../../../component/common/NoDataText';
import {useGetActivitiesQuery} from '../../../api/dashboardApi';

const activities = [
  {
    id: '1',
    name: 'Marriot Hotel',
    subtitle: 'Restaurant Manager',
    startDetails: 'Full Time',
    endDetails: 'Dubai',
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
    startDetails: 'Full Time',
    endDetails: 'Dubai',
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
  const {data: activitiesData, isLoading, refetch} = useGetActivitiesQuery({});
  const activities = activitiesData?.data?.activities || [];

  return (
    <LinearContainer colors={['#0D468C', '#041326']}>
      <View style={styles.topConrainer}>
        <BackHeader containerStyle={styles.header} />
      </View>
      {isLoading ? (
        <ActivityIndicator size={'large'} />
      ) : (
        <FlatList
          data={activities}
          style={AppStyles.flex}
          keyExtractor={(_, index) => index.toString()}
          renderItem={(item: any) => <ActivitiesCard {...item} />}
          contentContainerStyle={styles.scrollContainer}
          ItemSeparatorComponent={() => <View style={{height: hp(22)}} />}
          showsVerticalScrollIndicator={false}
          refreshing={isLoading}
          onRefresh={refetch}
          ListEmptyComponent={() => {
            return (
              <NoDataText
                text="No activities found"
                textStyle={{color: colors.white}}
              />
            );
          }}
        />
      )}
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
    paddingTop: hp(18),
    // borderBottomWidth: 1,
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
    flexGrow: 1,
    paddingVertical: hp(22),
    paddingHorizontal: wp(25),
  },
});
