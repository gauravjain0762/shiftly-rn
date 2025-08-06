import {FlatList, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {HomeHeader, LinearContainer} from '../../../component';
import {AppStyles} from '../../../theme/appStyles';
import FeedCard from '../../../component/employe/FeedCard';
import {hp, wp} from '../../../theme/fonts';
import {navigateTo} from '../../../utils/commonFunction';
import {SCREENS} from '../../../navigation/screenNames';
import {useTranslation} from 'react-i18next';
import {useSelector} from 'react-redux';
import {RootState} from '../../../store';
import {useGetCompanyPostsQuery} from '../../../api/dashboardApi';

const CoHome = () => {
  const {t} = useTranslation();
  const {userInfo} = useSelector((state: RootState) => state.auth);
  const {data: getPost, isLoading: Loading} = useGetCompanyPostsQuery({});
  const [currentPage, setCurrentPage] = React.useState(1);
  const [allPosts, setAllPosts] = React.useState([]);
  console.log(allPosts, 'getPost');
  React.useEffect(() => {
    if (getPost) {
      const newData = getPost.data.posts;
      setAllPosts(prev =>
        currentPage === 1 ? newData : [...prev, ...newData],
      );
    }
  }, [getPost, currentPage]);

  const handleLoadMore = () => {
    // Check if there are more pages to load
    if (
      getPost &&
      getPost.data?.pagination?.current_page <
        getPost.data?.pagination?.total_pages &&
      !Loading
    ) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
    }
  };

  return (
    <LinearContainer colors={['#FFF8E6', '#F3E1B7']}>
      <View style={styles.header}>
        <HomeHeader
          onPressAvatar={() => navigateTo(SCREENS.CoMessage)}
          type="company"
          onPressNotifi={() => navigateTo(SCREENS.CoNotification)}
        />
      </View>
      <FlatList
        style={AppStyles.flex}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollcontainer}
        ItemSeparatorComponent={() => <View style={{height: hp(15)}} />}
        data={allPosts}
        renderItem={({item}: any) => (
          <FeedCard
            item={item}
            isFollow
            // onPressCard={() => navigateTo(SCREENS.CompanyProfile)}
          />
        )}
        onEndReached={handleLoadMore}
      />
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
