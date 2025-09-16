import React, {useState} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import {
  BackHeader,
  JobCard,
  LinearContainer,
  ShareModal,
} from '../../../component';
import {useGetFavouritesJobQuery} from '../../../api/dashboardApi';
import {AppStyles} from '../../../theme/appStyles';
import {navigateTo} from '../../../utils/commonFunction';
import {SCREEN_NAMES} from '../../../navigation/screenNames';
import BaseText from '../../../component/common/BaseText';
import {commonFontStyle, hp, wp} from '../../../theme/fonts';
import {colors} from '../../../theme/colors';

const FavoriteJobList = () => {
  const [modal, setModal] = useState<boolean>(false);
  const {data: getFavoriteJobs} = useGetFavouritesJobQuery({});
  const favJobList = getFavoriteJobs?.data?.jobs;

  return (
    <LinearContainer colors={['#0D468C', '#041326']} containerStyle={{}}>
      <BackHeader
        isRight={false}
        title="Favorite Jobs"
        titleStyle={{flex: 1}}
        containerStyle={{paddingHorizontal: wp(23), gap: wp(20)}}
      />

      <FlatList
        data={favJobList}
        style={AppStyles.flex}
        showsVerticalScrollIndicator={false}
        renderItem={({item, index}: any) => {
          return (
            <JobCard
              key={index}
              item={item}
              isShowFavIcon={false}
              onPressShare={() => {
                setModal(true);
              }}
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
        ItemSeparatorComponent={() => <View style={{height: hp(28)}} />}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <BaseText style={styles.emptyText}>{'No jobs found'}</BaseText>
          </View>
        }
      />
      <ShareModal visible={modal} onClose={() => setModal(!modal)} />
    </LinearContainer>
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
    marginTop: '40%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    textAlign: 'center',
    ...commonFontStyle(500, 17, colors.white),
  },
});
