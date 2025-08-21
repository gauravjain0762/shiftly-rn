import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {HomeHeader, LinearContainer} from '../../../component';
import {AppStyles} from '../../../theme/appStyles';
import FeedCard from '../../../component/employe/FeedCard';
import {commonFontStyle, hp, wp} from '../../../theme/fonts';
import {navigateTo} from '../../../utils/commonFunction';
import {SCREENS} from '../../../navigation/screenNames';
import {useGetCompanyPostsQuery} from '../../../api/dashboardApi';
import PostSkeleton from '../../../component/skeletons/PostSkeleton';
import {colors} from '../../../theme/colors';
import BaseText from '../../../component/common/BaseText';

const CoHome = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [allPosts, setAllPosts] = useState<any[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const {
    data: getPost,
    isLoading,
    isFetching,
  } = useGetCompanyPostsQuery({page: currentPage});

  const totalPages = getPost?.data?.pagination?.total_pages ?? 1;
  const posts = getPost?.data?.posts ?? [];

  useEffect(() => {
    if (!getPost) return;

    if (currentPage === 1) {
      setAllPosts(posts);
    } else {
      setAllPosts(prev => [...prev, ...posts]);
    }
    setIsLoadingMore(false);
  }, [getPost, posts, currentPage]);

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

          onPressAvatar={() => navigateTo(SCREENS.CoMessage)}
          onPressNotifi={() => navigateTo(SCREENS.CoNotification)}
        />
      </View>
    );
  };

  return (
    <LinearContainer colors={['#FFF8E6', '#F3E1B7']}>
      {isLoading && currentPage === 1 ? (
        <PostSkeleton />
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
          refreshing={isLoading && currentPage === 1}
          onRefresh={handleRefresh}
          keyExtractor={(_, index) => index.toString()}
          ListHeaderComponent={renderHeader}
          ListEmptyComponent={() => {
            return (
              <View>
                <BaseText
                  style={{
                    textAlign: 'center',
                    ...commonFontStyle(500, 18, colors.black),
                  }}>
                  {'No posts available'}
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
    paddingHorizontal: wp(25),
    paddingBottom: hp(21),
  },
});
