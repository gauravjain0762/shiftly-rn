import {FlatList, StyleSheet, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {HomeHeader, LinearContainer} from '../../../component';
import {AppStyles} from '../../../theme/appStyles';
import FeedCard from '../../../component/employe/FeedCard';
import {hp, wp} from '../../../theme/fonts';
import {navigateTo} from '../../../utils/commonFunction';
import {SCREENS} from '../../../navigation/screenNames';
import {useSelector} from 'react-redux';
import {RootState} from '../../../store';
import {useGetCompanyPostsQuery} from '../../../api/dashboardApi';
import PostSkeleton from '../../../component/skeletons/PostSkeleton';

const PER_PAGE = 20;

const CoHome = () => {
  const {userInfo} = useSelector((state: RootState) => state.auth);
  const {data: getPost, isLoading: Loading} = useGetCompanyPostsQuery({});
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [allPosts, setAllPosts] = React.useState([]);
  console.log(allPosts, 'getPost');

  useEffect(() => {
    if (getPost) {
      const newData = getPost.data.posts;
      setAllPosts(prev =>
        currentPage === 1 ? newData : [...prev, ...newData],
      );
      if (newData?.length < PER_PAGE) {
        setIsLoading(false);
      }
    }
  }, [getPost, currentPage]);

  const handleLoadMore = () => {
    if (
      !isLoading &&
      getPost?.data?.pagination?.current_page <
        getPost?.data?.pagination?.total_pages
    ) {
      setIsLoading(true);
      setCurrentPage(prev => prev + 1);
    }
  };

  return (
    <LinearContainer colors={['#FFF8E6', '#F3E1B7']}>
      <View style={styles.header}>
        <HomeHeader
          type="company"
          onPressAvatar={() => navigateTo(SCREENS.CoMessage)}
          onPressNotifi={() => navigateTo(SCREENS.CoNotification)}
        />
      </View>

      {Loading ? (
        <PostSkeleton />
      ) : (
        <FlatList
          style={AppStyles.flex}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollcontainer}
          ItemSeparatorComponent={() => <View style={{height: hp(15)}} />}
          data={allPosts}
          renderItem={({item, index}: any) => (
            <FeedCard
              key={index}
              item={item}
              isFollow
              // onPressCard={() => navigateTo(SCREENS.CompanyProfile)}
            />
          )}
          onEndReachedThreshold={0.5}
          onEndReached={handleLoadMore}
        />
      )}
    </LinearContainer>
  );
};

export default CoHome;

const styles = StyleSheet.create({
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
