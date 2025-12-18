import React, {useEffect, useState} from 'react';
import {ActivityIndicator, FlatList, StyleSheet, View} from 'react-native';
import {HomeHeader, LinearContainer} from '../../../component';
import {AppStyles} from '../../../theme/appStyles';
import FeedCard from '../../../component/employe/FeedCard';
import {commonFontStyle, hp, wp} from '../../../theme/fonts';
import {navigateTo} from '../../../utils/commonFunction';
import {SCREENS} from '../../../navigation/screenNames';
import {
  useGetCompanyPostsQuery,
  useGetProfileQuery,
} from '../../../api/dashboardApi';
import PostSkeleton from '../../../component/skeletons/PostSkeleton';
import {colors} from '../../../theme/colors';
import BaseText from '../../../component/common/BaseText';
import {useTranslation} from 'react-i18next';
import {useAppDispatch} from '../../../redux/hooks';
import {
  setCompanyProfileAllData,
  setCompanyProfileData,
  setUserInfo,
} from '../../../features/authSlice';
import {useSelector} from 'react-redux';
import {RootState} from '../../../store';
import {connectSocket} from '../../../hooks/socketManager';

const CoHome = () => {
  const {t} = useTranslation();
  const dispatch = useAppDispatch();
  const {data: profileData} = useGetProfileQuery();
  const userdata = profileData?.data?.comnpany;
  const {userInfo}: any = useSelector((state: RootState) => state.auth);

  const [currentPage, setCurrentPage] = useState(1);
  const [allPosts, setAllPosts] = useState<any[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  useEffect(() => {
    if (userdata) {
      dispatch(setCompanyProfileAllData(userdata));
      dispatch(setCompanyProfileData(userdata));
      dispatch(setUserInfo(userdata));
    }
  }, [dispatch, userdata]);

  useEffect(() => {
    // Example: connect as a user
    if (userInfo?._id) {
      connectSocket(userInfo?._id, 'company');
    }
  }, [userInfo]);

  const {
    data: getPost,
    isLoading,
    isFetching,
  } = useGetCompanyPostsQuery({page: currentPage});

  const totalPages = getPost?.data?.pagination?.total_pages ?? 1;

  useEffect(() => {
    if (!getPost) return;
    const posts = (getPost?.data?.posts as any[]) ?? [];

    if (currentPage === 1) {
      setAllPosts(posts);
    } else {
      setAllPosts(prev => [...prev, ...posts]);
    }
    setIsLoadingMore(false);
  }, [getPost, currentPage]);

  const handleLoadMore = () => {
    if (!isFetching && !isLoadingMore && currentPage < totalPages) {
      setIsLoadingMore(true);
      setCurrentPage(prev => prev + 1);
    }
  };

  const handleRefresh = () => {
    setCurrentPage(1);
    setAllPosts([]);
  };

  const renderHeader = () => {
    return (
      <View style={styles.header}>
        <HomeHeader
          type="company"
          companyProfile={userInfo}
          onPressAvatar={() => navigateTo(SCREENS.CoMyProfile)}
          onPressNotifi={() => navigateTo(SCREENS.CoNotification)}
        />
      </View>
    );
  };

  return (
    <LinearContainer colors={['#F7F7F7', '#FFFFFF']}>
      {isLoading && currentPage === 1 ? (
        <PostSkeleton backgroundColor={colors.coPrimary} />
      ) : (
        <FlatList
          data={allPosts}
          style={AppStyles.flex}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollcontainer}
          ItemSeparatorComponent={() => <View style={{height: hp(15)}} />}
          renderItem={({item}) => <FeedCard item={item} isFollow />}
          onEndReachedThreshold={0.5}
          onEndReached={handleLoadMore}
          // refreshing={isLoading && currentPage === 1}
          // onRefresh={handleRefresh}
          keyExtractor={(_, index) => index.toString()}
          ListHeaderComponent={renderHeader}
          ListEmptyComponent={() => {
            return (
              <View style={styles.emptyContainer}>
                <BaseText
                  style={{
                    textAlign: 'center',
                    ...commonFontStyle(400, 18, colors.black),
                  }}>
                  {t('There is no post available')}
                </BaseText>
              </View>
            );
          }}
          ListFooterComponent={
            isLoadingMore ? (
              <ActivityIndicator
                size="large"
                style={{marginVertical: hp(10)}}
              />
            ) : null
          }
        />
      )}
    </LinearContainer>
  );
};

export default CoHome;

const styles = StyleSheet.create({
  header: {
    marginTop: hp(20),
    paddingBottom: hp(21),
  },
  scrollcontainer: {
    flexGrow: 1,
    paddingBottom: hp(21),
    paddingHorizontal: wp(25),
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
