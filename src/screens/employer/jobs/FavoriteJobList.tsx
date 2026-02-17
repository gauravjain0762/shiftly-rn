import React, { useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import {
  BackHeader,
  JobCard,
  LinearContainer,
} from '../../../component';
import { useGetFavouritesJobQuery } from '../../../api/dashboardApi';
import { AppStyles } from '../../../theme/appStyles';
import { navigateTo } from '../../../utils/commonFunction';
import { SCREEN_NAMES } from '../../../navigation/screenNames';
import BaseText from '../../../component/common/BaseText';
import { commonFontStyle, hp, wp } from '../../../theme/fonts';
import { colors } from '../../../theme/colors';
import { SafeAreaView } from 'react-native-safe-area-context';

const FavoriteJobList = () => {
  const { data: getFavoriteJobs } = useGetFavouritesJobQuery({});
  const favJobList = getFavoriteJobs?.data?.jobs;

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['bottom']}>
      <LinearContainer colors={[colors._F7F7F7, colors.white]} containerStyle={{ paddingBottom: hp(20) }}>
        <BackHeader
          isRight={false}
          title="Favorite Jobs"
          titleStyle={{ flex: 1 }}
          containerStyle={{ paddingHorizontal: wp(23), gap: wp(20), paddingTop: hp(20) }}
        />

        <FlatList
          data={favJobList}
          style={AppStyles.flex}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }: any) => {
            return (
              <JobCard
                key={index}
                item={item}
                isShowFavIcon={false}
                onPress={() =>
                  navigateTo(SCREEN_NAMES.JobDetail, {
                    item: item,
                  })
                }
              />
            );
          }}
          keyExtractor={(_, index) => index.toString()}
          contentContainerStyle={styles.scrollContainer}
          ItemSeparatorComponent={() => <View style={{ height: hp(28) }} />}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <BaseText style={styles.emptyText}>{'No jobs found'}</BaseText>
            </View>
          }
        />
      </LinearContainer>
    </SafeAreaView>
  );
};

export default FavoriteJobList;

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: '5%',
    paddingVertical: hp(20),
    paddingHorizontal: wp(25),
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    textAlign: 'center',
    ...commonFontStyle(500, 17, colors._0B3970),
  },
});
