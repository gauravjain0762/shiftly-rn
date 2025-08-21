import React, {useEffect, useState} from 'react';
import {ActivityIndicator, FlatList, StyleSheet, View} from 'react-native';

import {HomeHeader, LinearContainer} from '../../../component';
import {hp, wp} from '../../../theme/fonts';
import FeedCard from '../../../component/employe/FeedCard';
import {AppStyles} from '../../../theme/appStyles';
import {navigateTo} from '../../../utils/commonFunction';
import {SCREENS} from '../../../navigation/screenNames';
import {useGetEmployeePostsQuery} from '../../../api/dashboardApi';
import PostSkeleton from '../../../component/skeletons/PostSkeleton';

const HomeScreen = () => {
  // const {data: getProfile, isLoading: profileLoading} = useGetEmployeeProfileQuery({});
  const [currentPage, setCurrentPage] = useState(1);
  const [allPosts, setAllPosts] = useState<any[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const {data: getPost, isFetching, isLoading} = useGetEmployeePostsQuery({});
  const totalPages = getPost?.data?.pagination?.total_pages ?? 1;
  const posts = getPost?.data?.posts;

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

  const renderheader = () => {
    return (
      <View style={styles.header}>
        <HomeHeader
          onPressNotifi={() => navigateTo(SCREENS.NotificationScreen)}
        />
      </View>
    );
  };

  return (
    <LinearContainer colors={['#0D468C', '#041326']}>
      {isLoading && currentPage === 1 ? (
        <PostSkeleton />
      ) : (
        <FlatList
          data={allPosts}
          style={AppStyles.flex}
          refreshing={isFetching}
          onRefresh={handleRefresh}
          onEndReachedThreshold={0.5}
          onEndReached={handleLoadMore}
          keyExtractor={(_, index) => index.toString()}
          showsVerticalScrollIndicator={false}
          renderItem={({item, index}: {item: any; index: number}) => (
            <FeedCard item={item} key={index} />
          )}
          contentContainerStyle={styles.scrollcontainer}
          ItemSeparatorComponent={() => <View style={{height: hp(15)}} />}
          ListHeaderComponent={renderheader}
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

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    marginTop: hp(20),
    paddingBottom: hp(21),
  },
  scrollcontainer: {
    paddingBottom: hp(21),
    paddingHorizontal: wp(25),
  },
});
