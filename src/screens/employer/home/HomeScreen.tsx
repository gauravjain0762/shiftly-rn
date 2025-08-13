import React from 'react';
import {FlatList, StyleSheet, View} from 'react-native';

import {HomeHeader, LinearContainer} from '../../../component';
import {hp, wp} from '../../../theme/fonts';
import FeedCard from '../../../component/employe/FeedCard';
import {AppStyles} from '../../../theme/appStyles';
import {navigateTo} from '../../../utils/commonFunction';
import {SCREENS} from '../../../navigation/screenNames';
import {useGetEmployeePostsQuery} from '../../../api/dashboardApi';

const HomeScreen = () => {
  // const {data: getProfile, isLoading: profileLoading} = useGetEmployeeProfileQuery({});
  const {data} = useGetEmployeePostsQuery({});
  const postList = data?.data?.posts;

  return (
    <LinearContainer colors={['#0D468C', '#041326']}>
      <View style={styles.header}>
        <HomeHeader
          onPressNotifi={() => navigateTo(SCREENS.NotificationScreen)}
        />
      </View>
      <FlatList
        data={postList}
        style={AppStyles.flex}
        showsVerticalScrollIndicator={false}
        renderItem={({item, index}: {item: any; index: number}) => (
          <FeedCard item={item} key={index} />
        )}
        contentContainerStyle={styles.scrollcontainer}
        ItemSeparatorComponent={() => <View style={{height: hp(15)}} />}
      />
    </LinearContainer>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: wp(25),
    marginTop: hp(20),
    paddingBottom: hp(21),
  },
  scrollcontainer: {
    paddingHorizontal: wp(25),
    paddingBottom: hp(21),
  },
});
